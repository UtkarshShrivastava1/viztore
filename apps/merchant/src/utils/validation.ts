/**
 * Strict Indian business and address regex validation utilities.
 * Enforces production-grade tax IDs, mobile formats, and PIN codes.
 */

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PIN_REGEX = /^\d{6}$/;

/**
 * Validates 15-character Indian Goods and Services Tax Identification Number (GSTIN).
 * Format: 2 state digits + 10 PAN characters + 1 entity code + 'Z' + 1 checksum digit/char.
 */
export function validateGSTIN(gstin: string): { isValid: boolean; error?: string } {
  const clean = gstin.trim().toUpperCase();
  if (!clean) return { isValid: true }; // optional if empty
  if (clean.length !== 15) {
    return { isValid: false, error: 'GSTIN must be exactly 15 characters long.' };
  }
  if (!GSTIN_REGEX.test(clean)) {
    return { isValid: false, error: 'Invalid GSTIN format (e.g. 07AAAAA0000A1Z5).' };
  }
  return { isValid: true };
}

/**
 * Validates 10-character Indian Permanent Account Number (PAN).
 * Format: 5 uppercase letters + 4 digits + 1 uppercase letter.
 */
export function validatePAN(pan: string): { isValid: boolean; error?: string } {
  const clean = pan.trim().toUpperCase();
  if (!clean) return { isValid: true }; // optional if empty
  if (clean.length !== 10) {
    return { isValid: false, error: 'PAN must be exactly 10 characters long.' };
  }
  if (!PAN_REGEX.test(clean)) {
    return { isValid: false, error: 'Invalid PAN format (e.g. ABCDE1234F).' };
  }
  return { isValid: true };
}

/**
 * Validates 10-digit Indian standard mobile phone number.
 * Must start with 6, 7, 8, or 9 followed by 9 digits.
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const clean = phone.replace(/[^0-9]/g, '');
  if (!clean) return { isValid: false, error: 'Mobile phone number is required.' };
  if (clean.length !== 10) {
    return { isValid: false, error: 'Mobile number must be exactly 10 digits.' };
  }
  if (!PHONE_REGEX.test(clean)) {
    return { isValid: false, error: 'Mobile number must start with 6, 7, 8, or 9.' };
  }
  return { isValid: true };
}

/**
 * Validates 6-digit Indian Postal PIN Code.
 */
export function validatePIN(pin: string): { isValid: boolean; error?: string } {
  const clean = pin.trim();
  if (!clean) return { isValid: true }; // optional if empty
  if (clean.length !== 6 || !PIN_REGEX.test(clean)) {
    return { isValid: false, error: 'PIN code must be a valid 6-digit number.' };
  }
  return { isValid: true };
}
