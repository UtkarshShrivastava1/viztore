/**
 * Merchant Hub Date & Timezone Utilities
 * Enforces unified Asia/Kolkata (IST) presentation across all merchant dashboard tables,
 * analytics, order streams, and invoice printouts.
 */

import {
  IST_TIMEZONE,
  parseDateSafe,
  toUTCISOString,
  formatDateIST,
  formatDateTimeIST,
  formatTimeIST,
  formatRelativeTimeIST,
  toISTDateInput,
  getISTDayBounds,
  getISTMonthBounds,
} from '@repo/shared-types';

export {
  IST_TIMEZONE,
  parseDateSafe,
  toUTCISOString,
  formatDateIST,
  formatDateTimeIST,
  formatTimeIST,
  formatRelativeTimeIST,
  toISTDateInput,
  getISTDayBounds,
  getISTMonthBounds,
};

/**
 * Standard table display formatter (e.g. "29 Oct 2026")
 */
export const formatDate = formatDateIST;

/**
 * Standard timestamp display formatter (e.g. "29 Oct 2026, 05:45 PM")
 */
export const formatDateTime = formatDateTimeIST;

/**
 * Standard time display formatter (e.g. "05:45 PM")
 */
export const formatTime = formatTimeIST;

/**
 * Standard relative timestamp formatter (e.g. "Just now", "5m ago", "Yesterday")
 */
export const formatRelativeTime = formatRelativeTimeIST;

