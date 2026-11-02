/**
 * Backend Date & Timezone Utilities
 * Standardizes UTC storage in MongoDB with Asia/Kolkata (IST) calendar query windows.
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
 * Builds a MongoDB date range query for a specific calendar day in IST.
 * Ensures orders, invoices, and expenses query between 00:00:00 IST and 23:59:59.999 IST.
 */
export function buildISTDateQuery(dateInput?: string | Date): { $gte: Date; $lte: Date } {
  const { startOfDayUTC, endOfDayUTC } = getISTDayBounds(dateInput);
  return {
    $gte: startOfDayUTC,
    $lte: endOfDayUTC,
  };
}

/**
 * Builds a MongoDB date range query for a date span [startDate, endDate] given in IST YYYY-MM-DD.
 */
export function buildISTDateRangeQuery(
  startDateStr?: string,
  endDateStr?: string,
): { $gte?: Date; $lte?: Date } {
  const filter: { $gte?: Date; $lte?: Date } = {};

  if (startDateStr) {
    const { startOfDayUTC } = getISTDayBounds(startDateStr);
    filter.$gte = startOfDayUTC;
  }

  if (endDateStr) {
    const { endOfDayUTC } = getISTDayBounds(endDateStr);
    filter.$lte = endOfDayUTC;
  }

  return filter;
}
