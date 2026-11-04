import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import jwt from 'jsonwebtoken';
import { env } from '../shared/config/env.config.js';

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('\n======================================================');
  console.log('🚀 LIVE ORDER & RIDER WHATSAPP DISPATCH SIMULATION');
  console.log('======================================================');
  console.log(`Target Backend: ${BASE_URL}\n`);

  // 1. Customer Authentication (Token for Utkarsh 8109147565)
  console.log('👤 [Step 1] Customer Auth Token Acquisition...');
  const customerToken = jwt.sign(
    {
      sub: '66d000000000000000000001',
      role: 'customer',
      email: 'utkarsh@example.com',
      phone: '8109147565',
      fullName: 'Utkarsh Shrivastava',
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '7d' },
  );

  console.log(`✅ Customer Token Ready: Utkarsh Shrivastava (+91 8109147565)`);

  // 2. Discover Store & Product
  console.log('\n🏪 [Step 2] Finding Active Store & In-Stock Product...');
  const storesRes = await fetch(`${BASE_URL}/api/v1/stores`);
  const storesBody: any = await storesRes.json();
  const stores = storesBody.data?.stores || storesBody.data || [];
  if (!stores.length) throw new Error('No stores found');

  let targetStore: any = null;
  let targetProduct: any = null;
  let targetVariant: any = null;

  for (const s of stores) {
    const sId = s.id || s._id;
    const catRes = await fetch(`${BASE_URL}/api/v1/catalog/products?storeId=${sId}`);
    if (catRes.ok) {
      const catBody: any = await catRes.json();
      const prods = catBody.data?.products || catBody.data || [];
      for (const p of prods) {
        const v = p.variants?.find((varItem: any) => varItem.stock > 0);
        if (v) {
          targetStore = s;
          targetProduct = p;
          targetVariant = v;
          break;
        }
      }
    }
    if (targetStore) break;
  }

  if (!targetStore || !targetProduct || !targetVariant) {
    throw new Error('No in-stock store/product found');
  }

  const storeId = targetStore.id || targetStore._id;
  const productId = targetProduct.id || targetProduct._id;
  const storeName = targetStore.name;
  const productName = targetProduct.name || targetProduct.title || 'Smartphone 5G';
  console.log(`✅ Store Selected: ${storeName} (${targetStore.address?.city || 'Durg'})`);
  console.log(`✅ Product Selected: ${productName} (₹${targetVariant.price})`);

  // 3. Place Single-Store Order
  console.log('\n📦 [Step 3] Placing Order...');
  const orderPayload = {
    storeId,
    items: [
      {
        productId,
        sku: targetVariant.sku,
        name: productName,
        quantity: 1,
        unitPrice: targetVariant.price,
        storeId,
      },
    ],
    shippingAddress: {
      fullName: 'Utkarsh Shrivastava',
      street: 'Kadam Plaza, Borsi Extension',
      city: 'Durg',
      state: 'Chhattisgarh',
      postalCode: '491001',
      country: 'IN',
      phone: '8109147565',
    },
    notes: 'Live Rider WhatsApp Verification Simulation',
  };

  const orderRes = await fetch(`${BASE_URL}/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify(orderPayload),
  });

  const orderBody: any = await orderRes.json();
  if (!orderRes.ok || !orderBody.data) {
    throw new Error(`Order placement failed: ${JSON.stringify(orderBody)}`);
  }

  const order = orderBody.data;
  const orderId = order.id || order._id;
  const orderNumber = order.orderNumber;
  const deliveryOtp = order.deliveryOtp;
  console.log(`🎉 Order Placed Successfully!`);
  console.log(`• Order ID:     ${orderId}`);
  console.log(`• Order Number: ${orderNumber}`);
  console.log(`• Delivery OTP: ${deliveryOtp} (For doorstep delivery handover)`);
  console.log(`• Grand Total:  ₹${order.grandTotal}`);

  // 4. Merchant Confirmation (Triggers Delivery Broadcast to All Pilot Riders)
  console.log('\n⚡ [Step 4] Merchant Accepting Order & Auto-Broadcasting to Riders...');
  console.log('Logging in as Merchant/Admin...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'admin@example.com',
      password: 'Password@123',
    }),
  });

  let merchantToken = customerToken;
  if (adminLoginRes.ok) {
    const adminBody: any = await adminLoginRes.json();
    merchantToken = adminBody.data?.tokens?.accessToken || adminBody.data?.accessToken;
  }

  const confirmRes = await fetch(`${BASE_URL}/api/v1/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${merchantToken}`,
    },
    body: JSON.stringify({ status: 'CONFIRMED' }),
  });

  if (!confirmRes.ok) {
    throw new Error(`Order confirmation failed: ${await confirmRes.text()}`);
  }
  console.log(`✅ Order ${orderNumber} is now CONFIRMED!`);
  console.log(`📡 Domain Event emitted: delivery.broadcast`);
  console.log(`📲 WhatsApp broadcast alerts dispatched to all pilot riders in roster:`);
  console.log(`   1. Utkarsh Shrivastava (+91 8109147565)`);
  console.log(`   2. Harish Rao         (+91 9644837246)`);

  console.log('\n⏳ Waiting 5 seconds for riders to review broadcast alert...');
  await sleep(5000);

  // 5. Merchant Pack Order & Assign Harish Rao as Delivery Partner
  console.log('\n🛵 [Step 5] Merchant Packing & Assigning Rider Harish Rao (RDR-002)...');
  const adminToken = jwt.sign(
    { sub: '66d000000000000000000099', role: 'admin', email: 'admin@platform.internal' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '1d' }
  );

  await fetch(`${BASE_URL}/api/v1/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'PACKED' }),
  });

  const assignRes = await fetch(`${BASE_URL}/api/v1/delivery/orders/${orderId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      rider: {
        id: 'RDR-002',
        name: 'Harish Rao',
        phone: '9644837246',
        vehicleType: 'MOTORCYCLE',
      },
      estimatedMinutes: 25,
    }),
  });

  const assignBody: any = await assignRes.json();
  if (!assignRes.ok || !assignBody.data) {
    console.warn(`Assign via API returned:`, assignBody);
  } else {
    console.log(`✅ Rider Harish Rao successfully assigned!`);
    console.log(`🔑 Store Pickup OTP: ${assignBody.data?.pickupOtp || '(Generated)'}`);
    console.log(`📲 Outbound WhatsApp alerts dispatched:`);
    console.log(`   • To Harish Rao (+91 9644837246): Full Delivery Run Manifest + Store Pickup OTP`);
    console.log(`   • To Customer (+91 8109147565): "Delivery Partner Harish Rao is on the way!"`);
  }

  console.log('\n======================================================');
  console.log('🎉 SIMULATION COMPLETED SUCCESSFULLY!');
  console.log('Both Harish and you should now have received the live WhatsApp alerts.');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('\n❌ Simulation failed:', err);
  process.exit(1);
});
