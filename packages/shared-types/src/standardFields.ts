import { z } from 'zod';

/**
 * Global & National Standard Formats
 */
export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const BANK_ACCOUNT_REGEX = /^\d{9,18}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Sanitizers & Input Normalizers
 */

/**
 * Cleans phone number to strictly 10 digits.
 * Strips formatting, '+91', country code prefixes, or leading zero.
 */
export function cleanPhoneNumber(value: string | undefined | null): string {
  if (!value) return '';
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/**
 * Formats 10-digit mobile number for formal display: +91 98765 43210
 */
export function formatPhoneDisplay(value: string | undefined | null): string {
  const digits = cleanPhoneNumber(value);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}

/**
 * Cleans postal PIN code to strictly 6 digits.
 */
export function cleanPincode(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/\D/g, '').slice(0, 6);
}

/**
 * Cleans PAN to strictly 10 uppercase alphanumeric characters.
 */
export function cleanPAN(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
}

/**
 * Cleans GSTIN to strictly 15 uppercase alphanumeric characters.
 */
export function cleanGSTIN(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
}

/**
 * Cleans IFSC to strictly 11 uppercase alphanumeric characters.
 */
export function cleanIFSC(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
}

/**
 * Cleans bank account number to strictly digits (max 18).
 */
export function cleanBankAccount(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/\D/g, '').slice(0, 18);
}

/**
 * Standard Zod Schemas
 */
export const standardPhoneSchema = z.string()
  .transform(cleanPhoneNumber)
  .pipe(z.string().regex(INDIAN_PHONE_REGEX, 'Enter a valid 10-digit mobile number (starting with 6-9)'));

export const standardPhoneOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanPhoneNumber(val) : ''))
  .refine((val) => val === '' || INDIAN_PHONE_REGEX.test(val), {
    message: 'Enter a valid 10-digit mobile number (starting with 6-9)',
  });

export const standardPincodeSchema = z.string()
  .transform(cleanPincode)
  .pipe(z.string().regex(PINCODE_REGEX, 'Enter a valid 6-digit postal PIN code'));

export const standardPanSchema = z.string()
  .transform(cleanPAN)
  .pipe(z.string().regex(PAN_REGEX, 'Enter a valid 10-character PAN (e.g. ABCDE1234F)'));

export const standardGstinSchema = z.string()
  .transform(cleanGSTIN)
  .pipe(z.string().regex(GSTIN_REGEX, 'Enter a valid 15-character GSTIN'));

export const standardIfscSchema = z.string()
  .transform(cleanIFSC)
  .pipe(z.string().regex(IFSC_REGEX, 'Enter a valid 11-character bank IFSC code (e.g. SBIN0001234)'));

export const standardBankAccountSchema = z.string()
  .transform(cleanBankAccount)
  .pipe(z.string().regex(BANK_ACCOUNT_REGEX, 'Enter a valid bank account number (9-18 digits)'));

export const standardPincodeOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanPincode(val) : ''))
  .pipe(z.string().regex(PINCODE_REGEX, 'Enter a valid 6-digit postal PIN code').or(z.literal('')));

export const standardPanOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanPAN(val) : ''))
  .pipe(z.string().regex(PAN_REGEX, 'Enter a valid 10-character PAN (e.g. ABCDE1234F)').or(z.literal('')));

export const standardGstinOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanGSTIN(val) : ''))
  .pipe(z.string().regex(GSTIN_REGEX, 'Enter a valid 15-character GSTIN').or(z.literal('')));

export const standardIfscOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanIFSC(val) : ''))
  .pipe(z.string().regex(IFSC_REGEX, 'Enter a valid 11-character bank IFSC code (e.g. SBIN0001234)').or(z.literal('')));

