import { describe, it, expect } from 'vitest';
import {
  toUTCISOString,
  formatDateIST,
  formatDateTimeIST,
  formatTimeIST,
  formatRelativeTimeIST,
  toISTDateInput,
  getISTDayBounds,
  buildISTDateQuery,
  buildISTDateRangeQuery,
} from './date.js';

describe('Global System Date & Timezone Utilities', () => {
  it('converts timestamp to standard UTC ISO string', () => {
    const fixedTimestamp = 1761720000000;
    const iso = toUTCISOString(fixedTimestamp);
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(iso).toBe(new Date(fixedTimestamp).toISOString());
  });

  it('formats calendar dates in Indian Standard Time (Asia/Kolkata)', () => {
    // 2026-10-29 00:30:00 UTC = 2026-10-29 06:00:00 IST
    const dateUtc = new Date('2026-10-29T00:30:00.000Z');
    const formatted = formatDateIST(dateUtc);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('29');
  });

  it('formats time in 12-hour format with AM/PM in IST', () => {
    // 2026-10-29 12:30:00 UTC = 18:00:00 IST (6:00 PM IST)
    const dateUtc = new Date('2026-10-29T12:30:00.000Z');
    const timeFormatted = formatTimeIST(dateUtc);
    expect(timeFormatted).toMatch(/06:00\s*(pm|PM)/i);
  });

  it('computes exact UTC boundaries for IST calendar day (UTC+5:30)', () => {
    // 2026-10-29 in IST
    const bounds = getISTDayBounds('2026-10-29');
    expect(bounds.istDateString).toBe('2026-10-29');

    // 00:00:00 IST on 2026-10-29 is 2026-10-28 18:30:00.000 UTC
    expect(bounds.startOfDayUTC.toISOString()).toBe('2026-10-28T18:30:00.000Z');

    // 23:59:59.999 IST on 2026-10-29 is 2026-10-29 18:29:59.999 UTC
    expect(bounds.endOfDayUTC.toISOString()).toBe('2026-10-29T18:29:59.999Z');
  });

  it('builds MongoDB query objects for daily and range queries', () => {
    const singleDayQuery = buildISTDateQuery('2026-10-29');
    expect(singleDayQuery.$gte.toISOString()).toBe('2026-10-28T18:30:00.000Z');
    expect(singleDayQuery.$lte.toISOString()).toBe('2026-10-29T18:29:59.999Z');

    const rangeQuery = buildISTDateRangeQuery('2026-10-01', '2026-10-15');
    expect(rangeQuery.$gte?.toISOString()).toBe('2026-09-30T18:30:00.000Z');
    expect(rangeQuery.$lte?.toISOString()).toBe('2026-10-15T18:29:59.999Z');
  });

  it('handles HTML date input values reliably', () => {
    const dateInput = toISTDateInput('2026-10-29T19:00:00.000Z'); // 2026-10-30 00:30 IST
    expect(dateInput).toBe('2026-10-30');
  });

  it('handles relative time safely', () => {
    expect(formatRelativeTimeIST(new Date())).toBe('Just now');
    expect(formatRelativeTimeIST(null)).toBe('—');
  });
});
