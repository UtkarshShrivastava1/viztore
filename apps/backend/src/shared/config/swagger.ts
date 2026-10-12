import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.config.js';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Hyperlocal Commerce Platform API',
    version: '1.0.0',
    description:
      'Enterprise Modular Monolith REST API for Hyperlocal Multi-Vendor E-Commerce. Powers Customer Web Storefront, Merchant Management Portal, and In-House Retail POS Walk-in Billing with ACID Transactional Outbox and OCC Versioning.',
    contact: {
      name: 'Platform Engineering Team',
      email: 'engineering@example.com',
    },
    license: {
      name: 'Proprietary / Enterprise',
    },
  },
  servers: [
    {
      url: `/api/${env.API_VERSION}`,
      description: 'Current Environment (Relative)',
    },
    {
      url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`,
      description: 'Local Development Server',
    },
    {
      url: process.env.API_STAGING_URL || `https://api-staging.onrender.com/api/${env.API_VERSION}`,
      description: 'Cloud Staging Server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Customer & Merchant authentication, JWT lifecycle, and addresses' },
    { name: 'Stores', description: 'Merchant store onboarding, settings, and 2dsphere geo-discovery' },
    { name: 'Catalog', description: 'Product categories, barcode indexing, and multi-store inventory' },
    { name: 'Orders', description: 'Order lifecycle, OCC stock reservations, and OTP delivery verification' },
    { name: 'Billing', description: 'In-house retail POS walk-in checkout and GST compliance invoices' },
    { name: 'Delivery', description: 'Delivery partner assignment, live tracking, and dispatch' },
    { name: 'Notifications', description: 'WhatsApp notifications, alerts, and unread badges' },
    { name: 'System', description: 'Platform health and liveness/readiness inspection probes' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your JWT access token (Bearer <token>)',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string', example: 'Operation completed successfully' },
        },
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
              message: { type: 'string', example: 'The requested resource was not found' },
              details: { type: 'object' },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'Rahul Sharma' },
          phone: { type: 'string', example: '+919876543210' },
          email: { type: 'string', example: 'rahul@example.com' },
          role: { type: 'string', enum: ['customer', 'merchant', 'admin'], example: 'customer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterUserDto: {
        type: 'object',
        required: ['name', 'phone', 'password'],
        properties: {
          name: { type: 'string', example: 'Rahul Sharma' },
          phone: { type: 'string', example: '+919876543210' },
          email: { type: 'string', example: 'rahul@example.com' },
          password: { type: 'string', example: 'SecurePassword123' },
          role: { type: 'string', enum: ['customer', 'merchant'], default: 'customer' },
        },
      },
      LoginDto: {
        type: 'object',
        required: ['phone', 'password'],
        properties: {
          phone: { type: 'string', example: '+919876543210' },
          password: { type: 'string', example: 'SecurePassword123' },
        },
      },
      TokenPair: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      Store: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          name: { type: 'string', example: 'Apex Mart & Grocery' },
          slug: { type: 'string', example: 'apex-mart-grocery' },
          description: { type: 'string', example: 'Hyperlocal provisions and fresh fruits' },
          merchantId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          isActive: { type: 'boolean', example: true },
          isOpen: { type: 'boolean', example: true },
          deliveryRadiusKm: { type: 'number', example: 4.5 },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Point' },
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [81.3509, 21.1938],
                description: '[longitude, latitude]',
              },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
          storeId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          name: { type: 'string', example: 'Aashirvaad Shudh Chakki Atta 5kg' },
          price: { type: 'number', example: 245 },
          mrp: { type: 'number', example: 280 },
          stock: { type: 'integer', example: 48 },
          barcode: { type: 'string', example: '8901030012345' },
          category: { type: 'string', example: 'Flours & Grains' },
          isActive: { type: 'boolean', example: true },
          version: { type: 'integer', example: 1 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d4' },
          orderNumber: { type: 'string', example: 'ORD-20261012-7821' },
          storeId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          userId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                name: { type: 'string' },
                quantity: { type: 'integer' },
                price: { type: 'number' },
                total: { type: 'number' },
              },
            },
          },
          subtotal: { type: 'number', example: 490 },
          deliveryFee: { type: 'number', example: 35 },
          total: { type: 'number', example: 525 },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
            example: 'confirmed',
          },
          paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed'], example: 'paid' },
          paymentMethod: { type: 'string', enum: ['cod', 'online', 'wallet'], example: 'online' },
          deliveryAddress: { type: 'object' },
          deliveryOtp: { type: 'string', example: '4821' },
          version: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateOrderDto: {
        type: 'object',
        required: ['storeId', 'items', 'deliveryAddress', 'paymentMethod'],
        properties: {
          storeId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
                quantity: { type: 'integer', example: 2 },
              },
            },
          },
          deliveryAddress: {
            type: 'object',
            required: ['street', 'city', 'pincode', 'location'],
            properties: {
              street: { type: 'string', example: 'Flat 402, Green Valley Apartments' },
              city: { type: 'string', example: 'Bhilai' },
              pincode: { type: 'string', example: '490020' },
              location: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'Point' },
                  coordinates: { type: 'array', items: { type: 'number' }, example: [81.352, 21.195] },
                },
              },
            },
          },
          paymentMethod: { type: 'string', enum: ['cod', 'online', 'wallet'], example: 'online' },
        },
      },
      PosCheckoutDto: {
        type: 'object',
        required: ['storeId', 'items', 'paymentMethod'],
        properties: {
          storeId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          customerPhone: { type: 'string', example: '+919876543210' },
          customerName: { type: 'string', example: 'Pooja Verma' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity', 'unitPrice'],
              properties: {
                productId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
                quantity: { type: 'integer', example: 1 },
                unitPrice: { type: 'number', example: 245 },
                barcode: { type: 'string', example: '8901030012345' },
                gstRate: { type: 'number', example: 5 },
                hsnCode: { type: 'string', example: '11010000' },
              },
            },
          },
          paymentMethod: { type: 'string', enum: ['cash', 'upi', 'card'], example: 'upi' },
          discountAmount: { type: 'number', example: 10 },
        },
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d5' },
          invoiceNumber: { type: 'string', example: 'INV-20261012-0042' },
          storeId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          type: { type: 'string', enum: ['walk_in', 'online_order'], example: 'walk_in' },
          subtotal: { type: 'number', example: 245 },
          taxAmount: { type: 'number', example: 12.25 },
          discountAmount: { type: 'number', example: 10 },
          grandTotal: { type: 'number', example: 247.25 },
          paymentStatus: { type: 'string', enum: ['paid', 'pending'], example: 'paid' },
          paymentMethod: { type: 'string', example: 'upi' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new customer or merchant account',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterUserDto' } } },
        },
        responses: {
          201: {
            description: 'User registered successfully with access and refresh tokens',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenPair' } } },
          },
          409: { description: 'Phone number already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate with phone and password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginDto' } } },
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenPair' } } },
          },
          401: { description: 'Invalid phone or password' },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Exchange a valid refresh token for a fresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'New token pair issued' },
          401: { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        summary: 'Retrieve authenticated profile',
        responses: {
          200: { description: 'User profile details' },
          401: { description: 'Unauthorized' },
        },
      },
      patch: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        summary: 'Update current user profile',
        responses: {
          200: { description: 'Profile updated' },
        },
      },
    },
    '/auth/addresses': {
      get: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        summary: 'List user delivery addresses',
        responses: {
          200: { description: 'List of addresses' },
        },
      },
      post: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        summary: 'Add a new delivery address',
        responses: {
          201: { description: 'Address created' },
        },
      },
    },
    '/stores': {
      get: {
        tags: ['Stores'],
        summary: 'Discover nearby stores using 2dsphere spatial proximity',
        parameters: [
          { name: 'lat', in: 'query', schema: { type: 'number' }, description: 'Latitude' },
          { name: 'lng', in: 'query', schema: { type: 'number' }, description: 'Longitude' },
          { name: 'radius', in: 'query', schema: { type: 'number', default: 4 }, description: 'Radius in km' },
        ],
        responses: {
          200: { description: 'List of nearby stores' },
        },
      },
      post: {
        tags: ['Stores'],
        security: [{ bearerAuth: [] }],
        summary: 'Create and onboard a new merchant store',
        responses: {
          201: { description: 'Store created successfully' },
        },
      },
    },
    '/stores/{id}': {
      get: {
        tags: ['Stores'],
        summary: 'Get store details by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Store details' },
          404: { description: 'Store not found' },
        },
      },
      patch: {
        tags: ['Stores'],
        security: [{ bearerAuth: [] }],
        summary: 'Update store configuration or hours',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Store updated' },
        },
      },
    },
    '/catalog/products': {
      get: {
        tags: ['Catalog'],
        summary: 'Browse and search catalog products with filters',
        parameters: [
          { name: 'storeId', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Paginated list of catalog products' },
        },
      },
      post: {
        tags: ['Catalog'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a new catalog product (Merchant/Admin)',
        responses: {
          201: { description: 'Product created' },
        },
      },
    },
    '/catalog/products/{idOrSlug}': {
      get: {
        tags: ['Catalog'],
        summary: 'Get single product by ID or URL slug',
        parameters: [{ name: 'idOrSlug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product details' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/catalog/products/barcode/{barcode}': {
      get: {
        tags: ['Catalog'],
        summary: 'Fast barcode lookup for instant POS scanning',
        parameters: [{ name: 'barcode', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product matched to barcode' },
          404: { description: 'No product found with barcode' },
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'List customer orders or merchant store orders',
        responses: {
          200: { description: 'List of orders' },
        },
      },
      post: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'Place a new online order with OCC stock validation & reservation',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderDto' } } },
        },
        responses: {
          201: { description: 'Order created and stock reserved' },
          409: { description: 'Insufficient stock or OCC contention' },
        },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'Get order details by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order details' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'Transition order state (confirmed, packed, out_for_delivery, delivered)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order status updated' },
        },
      },
    },
    '/orders/{id}/verify-otp': {
      post: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'Verify customer delivery OTP to mark order delivered',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['otp'],
                properties: { otp: { type: 'string', example: '4821' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'OTP verified and order delivered' },
          400: { description: 'Invalid or expired OTP' },
        },
      },
    },
    '/orders/{id}/cancel': {
      post: {
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        summary: 'Cancel order and atomically reclaim reserved catalog stock',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order cancelled and stock restored' },
        },
      },
    },
    '/billing/pos/checkout': {
      post: {
        tags: ['Billing'],
        security: [{ bearerAuth: [] }],
        summary: 'Process in-house walk-in POS checkout with instant stock deduction and GST invoice',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PosCheckoutDto' } } },
        },
        responses: {
          201: {
            description: 'Walk-in invoice generated successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Invoice' } } },
          },
        },
      },
    },
    '/billing/invoices': {
      get: {
        tags: ['Billing'],
        security: [{ bearerAuth: [] }],
        summary: 'List POS and online invoices for a merchant store',
        parameters: [
          { name: 'storeId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string' } },
          { name: 'endDate', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of invoices with tax breakdown' },
        },
      },
    },
    '/billing/invoices/{id}': {
      get: {
        tags: ['Billing'],
        security: [{ bearerAuth: [] }],
        summary: 'Get single invoice with itemized CGST/SGST/IGST breakdown',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Invoice details' },
          404: { description: 'Invoice not found' },
        },
      },
    },
    '/billing/barcode/scan': {
      get: {
        tags: ['Billing'],
        security: [{ bearerAuth: [] }],
        summary: 'Instant barcode scan for POS quick add',
        parameters: [
          { name: 'barcode', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'storeId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Scanned item with stock and pricing' },
        },
      },
    },
    '/billing/summary': {
      get: {
        tags: ['Billing'],
        security: [{ bearerAuth: [] }],
        summary: 'POS daily sales summary, cash vs UPI totals, and collected taxes',
        parameters: [{ name: 'storeId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Daily sales analytics summary' },
        },
      },
    },
    '/delivery/orders/{orderId}/track': {
      get: {
        tags: ['Delivery'],
        summary: 'Get real-time tracking coordinates and status for an order',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Live tracking details' },
        },
      },
    },
    '/delivery/quote': {
      post: {
        tags: ['Delivery'],
        summary: 'Calculate delivery fee and ETA based on pickup and drop coordinates',
        responses: {
          200: { description: 'Calculated delivery quote' },
        },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        security: [{ bearerAuth: [] }],
        summary: 'List user notifications and order alerts',
        responses: {
          200: { description: 'Notifications list' },
        },
      },
    },
    '/notifications/unread-summary': {
      get: {
        tags: ['Notifications'],
        security: [{ bearerAuth: [] }],
        summary: 'Get count of unread notifications',
        responses: {
          200: { description: 'Unread notification count' },
        },
      },
    },
    '/healthz': {
      get: {
        tags: ['System'],
        summary: 'Kubernetes/Cloud Liveness Probe',
        responses: {
          200: { description: 'Process is responsive' },
        },
      },
    },
    '/readyz': {
      get: {
        tags: ['System'],
        summary: 'Kubernetes/Cloud Readiness Probe',
        responses: {
          200: { description: 'MongoDB, Redis, and services ready' },
          503: { description: 'Dependencies disconnected' },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.routes.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
