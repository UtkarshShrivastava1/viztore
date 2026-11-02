/**
 * Canonical Date & Timezone Utilities
 * Standardizes ISO 8601 UTC persistence and deterministic Asia/Kolkata (IST) display formatting
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Normalizes any valid date input (Date, timestamp number, or string) into a standard Date object.
 * Returns null if the input cannot be parsed.
 */
export function parseDateSafe(input?: string | number | Date | null): Date | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Returns an ISO 8601 UTC string suitable for storage in MongoDB or API payloads.
 * Defaults to current timestamp if omitted.
 */
export function toUTCISOString(input?: string | number | Date | null): string {
  const d = parseDateSafe(input) || new Date();
  return d.toISOString();
}

/**
 * Formats a date into Indian Standard Time (IST) calendar representation.
 * Default format: "29 Oct 2026"
 */
export function formatDateIST(
  input?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = parseDateSafe(input);
  if (!d) return '—';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(d);
}

/**
 * Formats date and time into Indian Standard Time (IST).
 * Default format: "29 Oct 2026, 05:45 PM"
 */
export function formatDateTimeIST(
  input?: string | number | Date | null,
  includeSeconds = false,
): string {
  const d = parseDateSafe(input);
  if (!d) return '—';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...(includeSeconds ? { second: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat('en-IN', options).format(d);
}

/**
 * Formats time only into Indian Standard Time (IST).
 * Default format: "05:45 PM"
 */
export function formatTimeIST(
  input?: string | number | Date | null,
  includeSeconds = false,
): string {
  const d = parseDateSafe(input);
  if (!d) return '—';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...(includeSeconds ? { second: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat('en-IN', options).format(d);
}

/**
 * Formats date for HTML <input type="date"> (YYYY-MM-DD) in IST.
 * Prevents UTC-induced date shift (e.g. late night orders displaying as previous day).
 */
export function toISTDateInput(input?: string | number | Date | null): string {
  const d = parseDateSafe(input) || new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d); // Returns YYYY-MM-DD
}

/**
 * Formats relative time (e.g. "Just now", "5m ago", "3h ago", "Yesterday", "24 Oct")
 */
export function formatRelativeTimeIST(input?: string | number | Date | null): string {
  const d = parseDateSafe(input);
  if (!d) return '—';

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDateIST(d);
}

/**
 * Computes exact UTC boundaries for a given calendar day in IST.
 * IST is UTC+5:30.
 * Example: 2026-10-29 00:00:00 IST is 2026-10-28 18:30:00.000 UTC.
 */
export function getISTDayBounds(input?: string | number | Date | null): {
  startOfDayUTC: Date;
  endOfDayUTC: Date;
  istDateString: string;
} {
  const istDateString = toISTDateInput(input);
  const parts = istDateString.split('-');
  const year = parseInt(parts[0] || '2026', 10);
  const month = parseInt(parts[1] || '1', 10) - 1;
  const day = parseInt(parts[2] || '1', 10);

  // 00:00:00 IST in UTC: subtract 5 hours 30 mins
  const startOfDayUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - (5 * 60 + 30) * 60 * 1000);
  // 23:59:59.999 IST in UTC
  const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000 - 1);

  return {
    startOfDayUTC,
    endOfDayUTC,
    istDateString,
  };
}

/**
 * Computes exact UTC boundaries for a given calendar month in IST.
 */
export function getISTMonthBounds(year: number, monthIndex: number): {
  startOfMonthUTC: Date;
  endOfMonthUTC: Date;
} {
  // Start of month at 00:00:00 IST
  const startOfMonthUTC = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0) - (5 * 60 + 30) * 60 * 1000);

  // Next month first day
  const nextMonthUTC = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0) - (5 * 60 + 30) * 60 * 1000);
  const endOfMonthUTC = new Date(nextMonthUTC.getTime() - 1);

  return {
    startOfMonthUTC,
    endOfMonthUTC,
  };
}
