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
export const PERSON_NAME_REGEX = /^[a-zA-Z\s.'-]{2,100}$/;
export const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#~_.-])[A-Za-z\d@$!%*?&^#~_.-]{8,128}$/;
export const OTP_4_REGEX = /^\d{4}$/;
export const OTP_6_REGEX = /^\d{6}$/;

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
 * Strips HTML tags and script injections to protect against XSS.
 */
export function stripHtml(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Normalizes email address: trims whitespace, converts to lowercase.
 */
export function cleanEmail(value: string | undefined | null): string {
  if (!value) return '';
  return stripHtml(value).trim().toLowerCase();
}

/**
 * Cleans human person/store/business name:
 * Strips HTML, trims whitespace, collapses multiple consecutive spaces.
 */
export function cleanName(value: string | undefined | null): string {
  if (!value) return '';
  return stripHtml(value).replace(/\s+/g, ' ').trim().slice(0, 100);
}

/**
 * Cleans currency / monetary amount:
 * Rounds to 2 decimal places, ensures non-negative number.
 */
export function cleanAmount(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100) / 100;
}

/**
 * Cleans integer counts / quantities:
 * Ensures positive integer within bounded range.
 */
export function cleanInteger(value: number | string | undefined | null, min = 1, max = 99999): number {
  if (value === undefined || value === null || value === '') return min;
  const num = typeof value === 'number' ? Math.floor(value) : parseInt(String(value).replace(/\D/g, ''), 10);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Evaluates password strength according to enterprise security standards.
 * Returns score (0-4), status, and descriptive error message if invalid.
 */
export function validatePassword(password: string): { isValid: boolean; error?: string; score: number } {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.', score: 0 };
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&^#~_.-]/.test(password)) score++;

  if (score < 3) {
    return {
      isValid: false,
      error: 'Password must include uppercase, lowercase, numbers, and special characters.',
      score,
    };
  }
  return { isValid: true, score };
}

/**
 * Validates email address format.
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const clean = cleanEmail(email);
  if (!clean) return { isValid: false, error: 'Email address is required.' };
  if (!EMAIL_REGEX.test(clean)) return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  return { isValid: true };
}

/**
 * Validates human or company name.
 */
export function validatePersonName(name: string): { isValid: boolean; error?: string } {
  const clean = cleanName(name);
  if (!clean || clean.length < 2) return { isValid: false, error: 'Name must be at least 2 characters.' };
  if (!PERSON_NAME_REGEX.test(clean)) return { isValid: false, error: 'Name should only contain letters, spaces, dots, or hyphens.' };
  return { isValid: true };
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

export const standardEmailSchema = z.string()
  .transform(cleanEmail)
  .pipe(z.string().regex(EMAIL_REGEX, 'Enter a valid email address'));

export const standardEmailOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanEmail(val) : ''))
  .pipe(z.string().regex(EMAIL_REGEX, 'Enter a valid email address').or(z.literal('')));

export const standardNameSchema = z.string()
  .transform(cleanName)
  .pipe(z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'));

export const standardNameOptionalSchema = z.string()
  .optional()
  .or(z.literal(''))
  .transform((val) => (val ? cleanName(val) : ''))
  .pipe(z.string().max(100, 'Name must be at most 100 characters').or(z.literal('')));

export const standardPasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .refine((val) => validatePassword(val).isValid, {
    message: 'Password must include uppercase, lowercase, numbers, and special characters',
  });

export const standardOtp4Schema = z.string()
  .transform((val) => String(val || '').replace(/\D/g, '').slice(0, 4))
  .pipe(z.string().regex(OTP_4_REGEX, 'Enter a valid 4-digit OTP code'));

export const standardOtp6Schema = z.string()
  .transform((val) => String(val || '').replace(/\D/g, '').slice(0, 6))
  .pipe(z.string().regex(OTP_6_REGEX, 'Enter a valid 6-digit OTP code'));

export const standardAmountSchema = z.number()
  .min(0, 'Amount must be non-negative')
  .transform((val) => Math.round(val * 100) / 100);

export const standardQuantitySchema = z.number()
  .int('Quantity must be an integer')
  .min(1, 'Quantity must be at least 1')
  .max(99999, 'Quantity exceeds maximum allowable limit');


