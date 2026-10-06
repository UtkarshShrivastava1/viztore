import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure .env is resolved regardless of execution directory (monorepo root or apps/backend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { env } from '../shared/config/env.config.js';
import {
  createWhatsAppService,
  normalizePhoneNumber,
} from '../modules/notifications/whatsapp.service.js';
import { branding } from '@repo/shared-types';

/**
 * CLI Test Runner for Meta WhatsApp Cloud API
 *
 * Usage:
 *   pnpm test:whatsapp <recipient_phone> [flow]
 *
 * Examples:
 *   pnpm test:whatsapp 919876543210
 *   pnpm test:whatsapp 9876543210 order
 *   pnpm test:whatsapp 9876543210 rider
 *   pnpm test:whatsapp 9876543210 out-for-delivery
 *   pnpm test:whatsapp 9876543210 delivered
 */

function maskString(str?: string, keepVisible = 4): string {
  if (!str) return '(not configured)';
  if (str.length <= keepVisible * 2) return '****';
  return `${str.slice(0, keepVisible)}...${str.slice(-keepVisible)} (len: ${str.length})`;
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const rawRecipient = args[0] || process.env.TEST_WHATSAPP_PHONE || process.env.WHATSAPP_TEST_RECIPIENT;
  const flow = (args[1] || 'ping').toLowerCase();

  console.log('\n======================================================');
  console.log(`📡 ${branding.appName} — Meta WhatsApp Cloud API Live Tester`);
  console.log('======================================================');
  console.log(`• Phone Number ID:      ${env.WHATSAPP_PHONE_NUMBER_ID || '(missing)'}`);
  console.log(`• Access Token:         ${maskString(env.WHATSAPP_ACCESS_TOKEN)}`);
  console.log(`• Business Account ID:  ${env.WHATSAPP_BUSINESS_ACCOUNT_ID || '(missing)'}`);
  console.log(`• Graph API Version:    ${env.WHATSAPP_API_VERSION}`);
  console.log(`• Active Environment:   ${env.NODE_ENV}`);
  console.log('------------------------------------------------------');

  if (!rawRecipient || rawRecipient === '--help' || rawRecipient === '-h') {
    console.log('\n⚠️  No recipient phone number specified!\n');
    console.log('Usage:');
    console.log('  pnpm test:whatsapp <phone_number> [flow]\n');
    console.log('Available flows:');
    console.log('  • ping             Default diagnostic ping message');
    console.log('  • order            Simulate Customer Order Placed + 4-digit OTP');
    console.log('  • rider            Simulate Rider Delivery Assignment manifest');
    console.log('  • out-for-delivery Simulate Out For Delivery + OTP notice');
    console.log('  • delivered        Simulate Order Delivered receipt\n');
    console.log('Examples:');
    console.log('  pnpm test:whatsapp 9876543210');
    console.log('  pnpm test:whatsapp 919876543210 order');
    console.log('======================================================\n');
    process.exit(0);
  }

  const normalizedPhone = normalizePhoneNumber(rawRecipient);
  console.log(`Target Recipient:       ${rawRecipient} ➔ ${normalizedPhone}`);
  console.log(`Execution Mode:         LIVE OUTBOUND DISPATCH`);
  console.log(`Selected Test Flow:     ${flow.toUpperCase()}`);
  console.log('------------------------------------------------------\n');

  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
    console.error('❌ Error: Missing required WhatsApp credentials in .env!');
    console.error('Please configure WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.');
    process.exit(1);
  }

  // Force live HTTP call regardless of NODE_ENV
  const whatsapp = createWhatsAppService({ forceLive: true });

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {
    let result;

    switch (flow) {
      case 'order': {
        console.log('📦 Dispatching Order Confirmation test payload...');
        result = await whatsapp.sendOrderConfirmation(normalizedPhone, {
          orderNumber: 'ORD-TEST99',
          grandTotal: 1499,
          itemsCount: 3,
          deliveryOtp: '4821',
          storeName: 'Downtown Supermart',
        });
        break;
      }

      case 'rider': {
        console.log('🛵 Dispatching Rider Assignment test payload...');
        result = await whatsapp.sendRiderDispatch(normalizedPhone, {
          orderNumber: 'ORD-TEST99',
          riderName: 'Rahul Verma',
          pickupAddress: 'Shop 12, Main Market, Mumbai',
          dropoffAddress: 'Flat 402, Sunshine Heights, Mumbai',
          mapsUrl: 'https://maps.google.com/?q=19.0760,72.8777',
        });
        break;
      }

      case 'out-for-delivery': {
        console.log('🚚 Dispatching Out-For-Delivery test payload...');
        result = await whatsapp.sendOutForDelivery(normalizedPhone, {
          orderNumber: 'ORD-TEST99',
          riderName: 'Rahul Verma',
          deliveryOtp: '4821',
          etaMinutes: 18,
        });
        break;
      }

      case 'delivered': {
        console.log('✅ Dispatching Delivery Completed test payload...');
        result = await whatsapp.sendDeliveryCompleted(normalizedPhone, {
          orderNumber: 'ORD-TEST99',
          customerName: 'Aarav Patel',
        });
        break;
      }

      case 'ping':
      default: {
        console.log('🔔 Dispatching Live Diagnostic System Ping...');
        const pingMessage = [
          `🔔 *[${branding.appName}] LIVE WHATSAPP DIAGNOSTIC PING*`,
          `--------------------------------`,
          `✅ Meta WhatsApp Cloud API connection is active!`,
          `🕒 Timestamp: ${timestamp} IST`,
          `⚡ Environment: ${env.NODE_ENV}`,
          `📱 Graph API: ${env.WHATSAPP_API_VERSION}`,
          `🏢 Recipient: +${normalizedPhone}`,
          `--------------------------------`,
          `This message confirms outbound messaging is fully wired to your store engine.`,
        ].join('\n');

        result = await whatsapp.sendTextMessage(normalizedPhone, pingMessage);
        break;
      }
    }

    console.log('\n======================================================');
    if (result.success) {
      console.log('🎉 DISPATCH SUCCESSFUL!');
      console.log(`• Message ID (wamid): ${result.messageId || '(none)'}`);
      console.log(`• Recipient:          +${result.recipient}`);
      console.log(`• Flow Executed:      ${flow}`);
      console.log('======================================================\n');
      process.exit(0);
    } else {
      console.log('❌ DISPATCH FAILED!');
      console.log(`• Recipient:          +${result.recipient}`);
      console.log(`• Error Reason:       ${result.error || 'Unknown error'}`);
      console.log('------------------------------------------------------');
      console.log('💡 Common WhatsApp Cloud API Troubleshooting:');
      console.log('  1. In Meta Sandbox / Development mode, you must first add the');
      console.log('     recipient number to the "To" list in the WhatsApp App Dashboard:');
      console.log('     developers.facebook.com ➔ WhatsApp ➔ API Setup ➔ Manage Phone Numbers.');
      console.log('  2. If using standard text messages without a pre-approved template,');
      console.log('     Meta requires an active 24-hour customer care window.');
      console.log('  3. Ensure your WHATSAPP_ACCESS_TOKEN has not expired (temporary tokens expire in 24h).');
      console.log('======================================================\n');
      process.exit(1);
    }
  } catch (err: unknown) {
    console.error('\n💥 Unhandled Exception during WhatsApp ping:');
    console.error(err instanceof Error ? err.stack : err);
    process.exit(1);
  }
}

run();
