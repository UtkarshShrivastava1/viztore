# Enterprise Modular Monolith — Catalog \+ Order

Production-oriented reference architecture for Node.js \+ TypeScript \+ Express \+ MongoDB/Mongoose \+ Redis \+ BullMQ. This document aligns the Catalog and Order modules around thin controllers, service/domain rules, repository data access, facades, version-based OCC, ACID transactions, rollback, transactional outbox, BullMQ, local EventBus, idempotency, caching, connection pooling, and horizontal scaling.

# **1\. Target architecture**

Internet \-\> CDN/WAF \-\> Load Balancer

             |

       \+-----+-----+-----+

       |           |     |

     API-1       API-2  API-N

       |           |     |

       \+-----------+-----+---- Redis

       |                         |

       \+-------------------------+---- MongoDB Replica Set

                                      | Catalog

                                      | Orders

                                      | Outbox

                                      |

                                      v

                                   BullMQ

                                      |

                              Dedicated Workers

Synchronous module communication: \`Order \-\> Catalog Facade\`, \`Order \-\> Store Facade\`.

Durable asynchronous communication: \`Mongo Transaction \-\> Transactional Outbox \-\> BullMQ \-\> Workers\`.

Local same-process communication: \`Service \-\> EventBus/EventEmitter \-\> local subscribers\`.

# **2\. Core rules**

* Controllers are thin; no concurrency logic or direct DB access.  
* Services own business rules, authorization, state transitions, and transaction orchestration.  
* Repositories own MongoDB/cache access.  
* Catalog owns product and inventory truth.  
* Order stores an immutable product/price snapshot.  
* Redis is never inventory truth.  
* Mutations use version-based OCC where concurrent overwrites matter.  
* Transactional Outbox is written inside the same MongoDB transaction as the business change.  
* BullMQ is durable async transport; EventBus/EventEmitter is local-only.  
* All DB, queue, pagination, and worker operations are bounded.

# **3\. Module structure**

src/modules/

  catalog/

    catalog.controller.ts

    catalog.routes.ts

    catalog.service.ts

    catalog.repository.ts

    catalog.query.ts

    catalog.cache.ts

    catalog.facade.ts

    catalog.types.ts

    product.model.ts

    catalog.module.ts

    index.ts

  orders/

    order.controller.ts

    order.routes.ts

    order.service.ts

    order.repository.ts

    order.facade.ts

    order.types.ts

    order.utils.ts

    order.model.ts

    order.module.ts

    index.ts

  shared/

    database/mongoose.ts

    database/transaction.ts

    database/outbox.service.ts

    redis/client.ts

    redis/cache.ts

    queue/bullmq.ts

    events/eventBus.ts

    events/eventTypes.ts

    middleware/idempotency.middleware.ts

## **3A. AuthenticatedRequest in Catalog and Order controllers**

Use the shared AuthenticatedRequest type for every controller endpoint that is protected by authGuard. This gives req.user and req.correlationId compile-time types and removes unsafe (req as any) casts. Public Catalog read endpoints can continue using normal Express Request because they are intentionally unauthenticated.

### **FILE: src/modules/shared/types/authenticated-request.ts**

import type { Request } from 'express';  
import type { JwtTokenPayload } from '@repo/shared-types';

export interface AuthenticatedRequest\<  
  TBody \= unknown,  
  TParams extends Record\<string, string\> \= Record\<string, string\>,  
  TQuery \= Record\<string, unknown\>,  
\> extends Request\<TParams, unknown, TBody, TQuery\> {  
  user: JwtTokenPayload;  
  correlationId: string;  
}

### **Catalog controller — protected mutation example**

import type { Response } from 'express';  
import type { CreateProductDto } from '@repo/shared-types';  
import type { AuthenticatedRequest } from '../shared/types/authenticated-request.js';

type CreateProductRequestBody \= CreateProductDto & {  
  storeId: string;  
};

createProduct: async (  
  req: AuthenticatedRequest\<CreateProductRequestBody\>,  
  res: Response,  
) \=\> {  
  const { storeId, ...data } \= req.body;

  const product \= await service.createProduct({  
    storeId,  
    merchantId: req.user.sub,  
    data,  
    correlationId: req.correlationId,  
  });

  return res.status(201).json({  
    success: true,  
    data: product,  
  });  
},

### **Order controller — protected creation example**

import type { Response } from 'express';  
import type { CreateOrderDTO } from './order.types.js';  
import type { AuthenticatedRequest } from '../shared/types/authenticated-request.js';

createOrder: async (  
  req: AuthenticatedRequest\<CreateOrderDTO\>,  
  res: Response,  
) \=\> {  
  const order \= await service.createOrder({  
    userId: req.user.sub,  
    data: req.body,  
    idempotencyKey: req.header('Idempotency-Key')\!,  
    correlationId: req.correlationId,  
  });

  return res.status(201).json({  
    success: true,  
    data: order,  
  });  
},

Routing rule: authGuard performs authentication and populates req.user; AuthenticatedRequest only provides the TypeScript contract. Order routes are protected by router.use(authGuard). Catalog routes protect mutations after the public GET routes with router.use(authGuard).

# **4\. Thousands of requests do not mean thousands of DB connections**

Each Node process maintains a bounded MongoDB pool. Approximate total connections:

API tasks \* maxPoolSize per task \+ worker pools \+ headroom

Example:

8 API tasks \* 25 \= 200 API connections

2 workers \* 10 \= 20 worker connections

Total \~= 220

Do not blindly increase pool size. Measure query latency, pool wait, MongoDB CPU, connection limits, and workload first. Never call \`mongoose.connect()\` inside a request.

# **5\. MongoDB connection**

import mongoose from 'mongoose';

export async function connectMongo(uri: string): Promise\<void\> {

  await mongoose.connect(uri, {

    maxPoolSize: Number(process.env.MONGO\_MAX\_POOL\_SIZE ?? 25),

    minPoolSize: Number(process.env.MONGO\_MIN\_POOL\_SIZE ?? 5),

    maxIdleTimeMS: 60\_000,

    waitQueueTimeoutMS: 5\_000,

    serverSelectionTimeoutMS: 5\_000,

    socketTimeoutMS: 30\_000,

    retryWrites: true,

  });

}

# **6\. Redis cache-aside**

import Redis from 'ioredis';

export const redis \= new Redis(process.env.REDIS\_URL\!, {

  maxRetriesPerRequest: 3,

  enableReadyCheck: true,

});

export async function cacheAside\<T\>(

  key: string,

  ttlSeconds: number,

  loader: () \=\> Promise\<T\>,

): Promise\<T\> {

  const cached \= await redis.get(key);

  if (cached \!== null) return JSON.parse(cached) as T;

  const value \= await loader();

  if (value \!== null && value \!== undefined) {

    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);

  }

  return value;

}

# **7\. ACID transaction helper**

import mongoose, { type ClientSession } from 'mongoose';

export async function withTransaction\<T\>(

  work: (session: ClientSession) \=\> Promise\<T\>,

): Promise\<T\> {

  const session \= await mongoose.startSession();

  try {

    let result\!: T;

    await session.withTransaction(

      async () \=\> { result \= await work(session); },

      {

        readConcern: { level: 'snapshot' },

        writeConcern: { w: 'majority' },

        readPreference: 'primary',

      },

    );

    return result;

  } finally {

    await session.endSession();

  }

}

Every MongoDB operation participating in the transaction must receive the same \`ClientSession\`. If any participating operation throws, MongoDB aborts the transaction and rolls back its writes.

# CATALOG MODULE

# **8\. Catalog responsibilities**

* Product CRUD/search/listing.  
* Store/merchant authorization.  
* Redis cache-aside product reads.  
* Cache invalidation after mutations.  
* Version-based OCC for product mutations.  
* Atomic inventory deduction/restoration.  
* Public Catalog Facade for Order.  
* Proper indexes and bounded pagination.

# **9\. Catalog types**

import type { ClientSession } from 'mongoose';

export interface CheckStockItem {

  productId: string;

  sku?: string;

  quantity: number;

}

export interface UpdateProductCommand {

  productId: string;

  merchantId: string;

  expectedVersion: number;

  data: UpdateProductDto;

  correlationId: string;

}

export interface ICatalogRepository {

  findById(id: string): Promise\<IProduct | null\>;

  findBySlug(slug: string): Promise\<IProduct | null\>;

  update(id: string, expectedVersion: number, dto: UpdateProductDto,

         session?: ClientSession): Promise\<IProduct | null\>;

  delete(id: string, expectedVersion: number,

         session?: ClientSession): Promise\<boolean\>;

  deductStock(items: CheckStockItem\[\], session?: ClientSession): Promise\<void\>;

  restoreStock(items: CheckStockItem\[\], session?: ClientSession): Promise\<void\>;

}

export interface ICatalogFacade {

  getProductById(id: string): Promise\<ProductSnapshot | null\>;

  checkStock(items: CheckStockItem\[\]): Promise\<StockCheckResult\>;

  deductStock(items: CheckStockItem\[\], session?: ClientSession): Promise\<void\>;

  restoreStock(items: CheckStockItem\[\], session?: ClientSession): Promise\<void\>;

}

# **10\. Product model OCC/indexes**

version: {

  type: Number,

  required: true,

  default: 1,

  min: 1,

  index: true,

},

productSchema.index({ storeId: 1, isActive: 1, createdAt: \-1 });

productSchema.index({ slug: 1, isActive: 1 }, { unique: true });

# **11\. Catalog version-based update**

async function update(

  id: string,

  expectedVersion: number,

  dto: UpdateProductDto,

  session?: ClientSession,

) {

  const updated \= await productModel.findOneAndUpdate(

    { \_id: id, version: expectedVersion, isActive: true },

    {

      \$set: { ...dto, updatedAt: new Date() },

      \$inc: { version: 1 },

    },

    { new: true, runValidators: true, session },

  );

  return updated ? toProductResponse(updated) : null;

}

A null result must be distinguished between not-found/inactive and version conflict; never overwrite another request's changes.

# **12\. Catalog atomic inventory deduction**

async function deductOne(item: CheckStockItem, session?: ClientSession) {

  const result \= await productModel.updateOne(

    {

      \_id: item.productId,

      isActive: true,

      'variants.sku': item.sku,

      'variants.stock': { \$gte: item.quantity },

    },

    {

      \$inc: {

        'variants.\$.stock': \-item.quantity,

        version: 1,

      },

    },

    { session },

  );

  if (result.modifiedCount \!== 1\) {

    throw AppError.conflict(

      'Insufficient stock or concurrent product change',

      'STOCK\_UPDATE\_CONFLICT',

    );

  }

}

async function deductStock(items: CheckStockItem\[\], session?: ClientSession) {

  const ordered \= \[...items\].sort((a, b) \=\>

    (a.sku ?? a.productId).localeCompare(b.sku ?? b.productId),

  );

  for (const item of ordered) await deductOne(item, session);

}

The pre-check is only a fast validation. The conditional atomic update is the final inventory authority.

# **13\. Catalog cache**

export const productKey \= (id: string) \=\> \`catalog:product:\${id}\`;

export const slugKey \= (slug: string) \=\> \`catalog:slug:\${slug}\`;

export async function findById(id: string) {

  return cacheAside(productKey(id), 180, async () \=\>

    productModel.findOne({ \_id: id, isActive: true })

      .read('secondaryPreferred')

      .lean(),

  );

}

export async function invalidateProductCache(id: string, slug?: string) {

  const keys \= \[productKey(id)\];

  if (slug) keys.push(slugKey(slug));

  await redis.del(...keys);

}

For strict read-after-write, use primary reads or stronger cache versioning. Short TTL plus invalidation is a reasonable baseline for a read-heavy catalog.

# ORDER MODULE

# **14\. Order responsibilities**

* Resolve authoritative Catalog product data.  
* Store immutable price/name/SKU snapshot.  
* Atomic inventory reservation/deduction.  
* ACID order creation.  
* Version-based OCC for status/cancellation.  
* Strict order state machine.  
* Transactional Outbox.  
* BullMQ async processing.  
* Local EventBus subscribers.  
* Idempotent order creation/retries.  
* Protected delivery OTP.

# **15\. Order model**

const orderSchema \= new Schema\<OrderDocument\>({

  userId: { type: String, required: true, index: true },

  storeId: { type: String, required: true, index: true },

  orderNumber: { type: String, required: true, unique: true, index: true },

  items: { type: \[orderItemSchema\], required: true },

  shippingAddress: { type: shippingAddressSchema, required: true },

  subtotal: { type: Number, required: true },

  tax: { type: Number, required: true },

  shippingFee: { type: Number, required: true },

  grandTotal: { type: Number, required: true },

  status: {

    type: String,

    enum: Object.values(OrderStatus),

    default: OrderStatus.PENDING,

    index: true,

  },

  statusHistory: { type: \[statusHistorySchema\], default: \[\] },

  deliveryOtp: { type: String, required: true },

  deliveredAt: { type: Date },

  version: { type: Number, required: true, default: 1, min: 1, index: true },

}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: \-1 });

orderSchema.index({ storeId: 1, status: 1, createdAt: \-1 });

# **16\. Order OCC repository update**

async function updateStatus(

  id: string,

  expectedVersion: number,

  expectedStatus: OrderStatus,

  newStatus: OrderStatus,

  auditEntry: IOrderStatusHistoryEntry,

  session: ClientSession,

) {

  const updated \= await model.findOneAndUpdate(

    { \_id: id, version: expectedVersion, status: expectedStatus },

    {

      \$set: {

        status: newStatus,

        ...(newStatus \=== OrderStatus.DELIVERED

          ? { deliveredAt: new Date() }

          : {}),

      },

      \$push: { statusHistory: auditEntry },

      \$inc: { version: 1 },

    },

    { new: true, session },

  );

  return updated ? toResponse(updated) : null;

}

Two requests reading version 5 cannot both successfully mutate version 5 to version 6\. The loser receives a conflict and must re-read.

# **17\. Order state machine**

PENDING \-\> CONFIRMED \-\> PROCESSING \-\> PACKED \-\> SHIPPED \-\> OUT\_FOR\_DELIVERY \-\> DELIVERED

   |          |            |            |          |                 |

   \+----------+------------+------------+----------+-----------------+-\> CANCELLED

READY\_FOR\_PICKUP can be reached from PACKED and can reach DELIVERED/CANCELLED.

DELIVERED and CANCELLED are terminal.

# **18\. Enterprise order creation**

async function createOrder(

  userId: string,

  dto: CreateOrderDTO,

  correlationId: string,

): Promise\<OrderResponse\> {

  // Validate input and single-store invariant.

  // Resolve Store through Store Facade.

  // Resolve authoritative product data through Catalog Facade.

  // Build immutable product/price snapshots.

  // Sort stock operations deterministically.

  // Optional fast stock pre-check.

  const order \= await withTransaction(async (session) \=\> {

    // Final inventory authority.

    await catalogFacade.deductStock(stockItems, session);

    const created \= await orderRepository.create(

      {

        userId,

        storeId: dto.storeId,

        items: authoritativeItems,

        shippingAddress: normalizeAddress(dto.shippingAddress),

      },

      { session },

    );

    await appendOutboxEvent(

      {

        eventType: EVENTS.ORDER\_CREATED,

        schemaVersion: 1,

        aggregateType: 'Order',

        aggregateId: created.id,

        correlationId,

        payload: {

          orderId: created.id,

          orderNumber: created.orderNumber,

          userId,

          storeId: created.storeId,

          grandTotal: created.grandTotal,

        },

      },

      session,

    );

    return created;

  });

  void processPendingOutboxEvents().catch(error \=\> {

    logger.warn({ error, correlationId }, 'Outbox dispatch failed');

  });

  // Local only.

  eventBus.emit(EVENTS.ORDER\_PLACED, {

    orderId: order.id,

    orderNumber: order.orderNumber,

    correlationId,

  });

  return order;

}

# **19\. Rollback**

BEGIN TRANSACTION

  1\. Catalog atomic stock deduction

  2\. Order insert

  3\. Outbox insert

COMMIT

If any step fails:

  \-\> stock deduction rolls back

  \-\> order insert rolls back

  \-\> outbox insert rolls back

This works only when the participating writes are in the same MongoDB transaction/session and MongoDB deployment supports the transaction topology.

# **20\. Why stock pre-check is not enough**

Stock \= 5

A checks \-\> 5

B checks \-\> 5

A wants 4

B wants 4

Only the atomic predicate:

  { stock: { \$gte: 4 } }

with:

  { \$inc: { stock: \-4 } }

can safely decide the winner.

# **21\. Cancellation with OCC \+ inventory restoration**

await withTransaction(async (session) \=\> {

  const updated \= await orderRepository.cancelIfVersionMatches(

    {

      orderId,

      expectedVersion: current.version,

      expectedStatus: current.status,

    },

    session,

  );

  if (\!updated) {

    throw AppError.conflict(

      'Order changed concurrently',

      'ORDER\_CONCURRENT\_MODIFICATION',

    );

  }

  await catalogFacade.restoreStock(

    current.items.map(toStockItem),

    session,

  );

  await appendOutboxEvent(

    {

      eventType: EVENTS.ORDER\_CANCELLED,

      schemaVersion: 1,

      aggregateType: 'Order',

      aggregateId: updated.id,

      correlationId,

      payload: { orderId: updated.id, reason },

    },

    session,

  );

});

Cancellation itself must be idempotent/concurrency-safe so inventory is restored at most once.

# OUTBOX / BULLMQ / EVENTBUS

# **22\. EventBus vs BullMQ**

EventBus/EventEmitter

  \= in-process

  \= fast

  \= local subscribers

  \= not durable

BullMQ

  \= persistent queue

  \= retries/backoff

  \= worker processes

  \= durable async work

Transactional Outbox

  \= Mongo transaction \+ durable event record

  \= prevents database/message dual-write inconsistency

# **23\. Outbox record**

interface OutboxEvent {

  eventId: string;

  eventType: string;

  schemaVersion: number;

  aggregateType: string;

  aggregateId: string;

  correlationId?: string;

  payload: unknown;

  status: 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'FAILED';

  attempts: number;

  availableAt: Date;

  createdAt: Date;

}

async function appendOutboxEvent(

  event: NewOutboxEvent,

  session: ClientSession,

) {

  await OutboxModel.create(\[{

    eventId: crypto.randomUUID(),

    ...event,

    status: 'PENDING',

    attempts: 0,

    availableAt: new Date(),

  }\], { session });

}

# **24\. Outbox to BullMQ**

await orderEventsQueue.add(

  event.eventType,

  {

    eventId: event.eventId,

    eventType: event.eventType,

    schemaVersion: event.schemaVersion,

    aggregateId: event.aggregateId,

    aggregateType: event.aggregateType,

    correlationId: event.correlationId,

    payload: event.payload,

  },

  {

    jobId: event.eventId,

    attempts: 8,

    backoff: { type: 'exponential', delay: 1000 },

    removeOnComplete: 1000,

    removeOnFail: false,

  },

);

# **25\. BullMQ worker with consumer idempotency**

const worker \= new Worker(

  'order-events',

  async job \=\> {

    const { eventId, eventType, payload } \= job.data;

    if (await consumerRepository.exists(eventId)) return;

    switch (eventType) {

      case EVENTS.ORDER\_CREATED:

        await notificationService.sendOrderCreated(payload);

        break;

      case EVENTS.ORDER\_CANCELLED:

        await notificationService.sendOrderCancelled(payload);

        break;

      default:

        logger.warn({ eventType }, 'Unknown event');

    }

    await consumerRepository.markProcessed(eventId);

  },

  {

    connection: redis,

    concurrency: Number(process.env.ORDER\_WORKER\_CONCURRENCY ?? 20),

  },

);

Assume at-least-once delivery. Consumers must be idempotent.

# **26\. Idempotency for order creation**

Idempotency key \= userId \+ operation \+ clientKey

Stored:

  key

  userId

  requestHash

  status

  response/orderId

  expiresAt

Unique index:

  { userId: 1, operation: 1, key: 1 }

Retry with same key \+ same request \-\> previous result

Same key \+ different request \-\> reject

Middleware protection is useful, but DB uniqueness/business-level idempotency is the final protection against duplicate orders.

# **27\. Error handling**

Do not do this:

try {

  return await repository.findById(id);

} catch {

  return null;

}

Use:

try {

  return await repository.findById(id);

} catch (error) {

  logger.error({ error, id, correlationId }, 'Order lookup failed');

  throw error;

}

Only expected not-found conditions should return null. Redis/Mongo infrastructure failures must not become false 404 responses.

# SCALING AND OPERATIONS

# **28\. End-to-end request sequence**

POST /orders \+ Idempotency-Key

        |

        v

Controller: auth \+ validation

        |

        v

Order Service

   |             |

   v             v

Store Facade   Catalog Facade

                  |

                  \+-- product snapshot

                  \+-- stock pre-check

        |

        v

Mongo Transaction

   \+-- atomic stock deduction

   \+-- order insert

   \+-- outbox insert

        |

      COMMIT

        |

        \+-- outbox dispatcher \-\> BullMQ \-\> workers

        \+-- local EventBus

# **29\. OCC examples**

Product:

A reads v10

B reads v10

A updates where v10 \-\> v11

B updates where v10 \-\> 0 docs \-\> 409 Conflict

Order:

A reads PENDING/v4

B reads PENDING/v4

A \-\> CONFIRMED/v5

B \-\> CANCELLED where v4 \-\> 0 docs \-\> 409 Conflict

Inventory:

stock=10

A wants 7 \-\> succeeds \-\> stock=3

B wants 7 \-\> predicate fails \-\> insufficient/conflict

# **30\. Pagination**

Page/skip with strict limits is acceptable initially. For very large histories, use cursor/keyset pagination:

GET /orders?limit=50\&cursor=\<createdAt,id\>

query:

{

  \$or: \[

    { createdAt: { \$lt: cursor.createdAt } },

    { createdAt: cursor.createdAt, \_id: { \$lt: cursor.id } },

  \],

}

.sort({ createdAt: \-1, \_id: \-1 })

.limit(51)

# **31\. Production checklist**

* One Mongo connection per Node process/task.  
* Bounded Mongo pool and Redis clients.  
* Same ClientSession for all writes in an ACID unit.  
* Version increment on every OCC mutation.  
* Atomic inventory predicate \`stock \>= requested\`.  
* Client price is never authoritative.  
* Order stores Catalog snapshot.  
* Outbox is written in the same transaction.  
* Outbox dispatcher is retryable/idempotent.  
* BullMQ uses retries/backoff.  
* Consumers are idempotent.  
* EventBus is local only.  
* No swallowed infrastructure errors.  
* Catalog cache invalidation after successful writes.  
* Proper compound indexes.  
* Bounded pagination.  
* Correlation ID flows HTTP \-\> service \-\> outbox \-\> worker.  
* Rate limiting.  
* Metrics for RPS, p95/p99 latency, DB pool saturation, queue depth, and error rate.  
* Graceful shutdown closes server, workers, Redis and Mongo.

# **32\. What not to do**

* Do not split into microservices just because traffic grows.  
* Do not create a Mongo connection per request.  
* Do not use Redis as inventory truth.  
* Do not use EventEmitter as reliable distributed messaging.  
* Do not use unbounded \`Promise.all\` for thousands of writes.  
* Do not trust client-supplied price/name/SKU.  
* Do not rely on a stock pre-check alone.  
* Do not perform read-then-write mutations without OCC/atomic predicates.  
* Do not swallow DB/Redis failures as not-found.

# **33\. Final architecture decision**

Catalog and Order remain separate domain modules inside the same modular monolith. Catalog owns products and inventory. Order owns order lifecycle, price/product snapshots, status, cancellation and transaction orchestration. Synchronous module calls go through facades. Durable async communication uses Transactional Outbox \-\> BullMQ. EventBus/EventEmitter is local-only.

The supplied Order implementation already had strong foundations: deterministic stock ordering, Catalog/Store facades, \`withTransaction\`, transactional outbox insertion, post-commit outbox dispatch, local EventBus emission, and status-based compare-and-swap. The required upgrade for the requested enterprise standard is explicit version-based OCC, authoritative Catalog snapshots, safe cancellation/stock restoration, durable/idempotent async processing, and removal of broad error swallowing.