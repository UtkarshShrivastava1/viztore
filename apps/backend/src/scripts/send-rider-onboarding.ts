import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { env } from '../shared/config/env.config.js';
import { createWhatsAppService } from '../modules/notifications/whatsapp.service.js';
import { PILOT_RIDERS, branding } from '@repo/shared-types';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const targetPhone = process.argv[2] || '9644837246';
  const whatsapp = createWhatsAppService({ forceLive: true });

  const rider = PILOT_RIDERS.find(r => r.phone === targetPhone) || {
    id: 'RDR-002',
    name: 'Harish Rao',
    phone: targetPhone,
    zone: 'Bhilai / Durg Hub',
    vehicleType: 'MOTORCYCLE',
  };

  const welcomeMessage = [
    `🛵 *WELCOME TO THE PILOT DELIVERY FLEET!*`,
    `--------------------------------`,
    `Hi *${rider.name}*,`,
    `Welcome onboard as an official Delivery Fleet Partner for *${branding.appName}*!`,
    ``,
    `📋 *Your Partner Profile:*`,
    `• Partner ID: *${rider.id}*`,
    `• Operating Zone: *${rider.zone}*`,
    `• Contact: *+91 ${rider.phone}*`,
    `• Status: *Active & Dispatch Ready ✅*`,
    `--------------------------------`,
    `📖 *HOW TO ACCEPT & DELIVER ORDERS:*`,
    ``,
    `1️⃣ *Instant WhatsApp Run Alerts:*`,
    `Whenever a neighborhood shop prepares an order, you'll receive a WhatsApp run alert detailing the store pickup address, customer dropoff area, and your delivery payout.`,
    ``,
    `2️⃣ *Accepting a Delivery:*`,
    `Click the interactive link in the WhatsApp dispatch alert to immediately claim the run.`,
    ``,
    `3️⃣ *Store Pickup & 4-Digit OTP:*`,
    `Arrive at the pickup store. Show your unique *4-digit Store Pickup OTP* to the merchant to receive the parcel.`,
    ``,
    `4️⃣ *Customer Dropoff & Handover:*`,
    `Navigate to customer address. Upon physical handover, ask the customer for their secret *4-digit Delivery OTP*.`,
    ``,
    `5️⃣ *Instant Settlement:*`,
    `Enter the OTP to confirm delivery. Your delivery earnings are immediately settled into your wallet balance! 💰`,
    `--------------------------------`,
    `⚡ *Tip:* Keep this chat unmuted and pinned to receive instant broadcast alerts when new orders are ready for pickup.`,
    ``,
    `Drive safely and happy delivering with *${branding.appName}*! 🚀`,
  ].join('\n');

  console.log(`Sending onboarding welcome message to ${rider.name} (+91 ${rider.phone})...`);

  let lastResult;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt} of 3...`);
      lastResult = await whatsapp.sendTextMessage(rider.phone, welcomeMessage);
      if (lastResult.success && !lastResult.error) {
        console.log('✅ Dispatch successful!');
        console.log(JSON.stringify(lastResult, null, 2));
        return;
      }
      console.warn(`Attempt ${attempt} returned error: ${lastResult.error}. Retrying...`);
    } catch (e) {
      console.warn(`Attempt ${attempt} thrown error: ${e}. Retrying...`);
    }
    await sleep(1500);
  }

  console.log('Final result:', JSON.stringify(lastResult, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
