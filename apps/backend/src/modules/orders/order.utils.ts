import crypto from 'node:crypto';
import type { OrderItemDTO, ShippingAddressDTO } from './order.types.js';

export const TAX_RATE = 0.05; // 5% GST for local grocery/retail
export const STANDARD_SHIPPING_FEE = 49; // ₹49 local courier / delivery fee
export const FREE_SHIPPING_THRESHOLD = 499; // Free delivery above ₹499

export function calculateSubtotal(items: OrderItemDTO[]): number {
  return Number(
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2),
  );
}

export function calculateTax(subtotal: number): number {
  return Number((subtotal * TAX_RATE).toFixed(2));
}

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateGrandTotal(
  subtotal: number,
  tax: number,
  shippingFee: number,
): number {
  return Number((subtotal + tax + shippingFee).toFixed(2));
}

export function generateOrderNumber(date = new Date()): string {
  const yyyymmdd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${yyyymmdd}-${suffix}`;
}

export function generateDeliveryOtp(): string {
  // Cryptographically secure 4-digit OTP (1000 - 9999)
  return String(crypto.randomInt(1000, 10000));
}

export function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export function normalizeAddress(address?: Partial<ShippingAddressDTO> | null): ShippingAddressDTO {
  return {
    fullName: (address?.fullName ?? '').trim(),
    street: (address?.street ?? '').trim(),
    city: (address?.city ?? '').trim(),
    state: (address?.state ?? '').trim(),
    postalCode: (address?.postalCode ?? '').trim(),
    country: (address?.country || 'IN').trim().toUpperCase(),
    phone: (address?.phone ?? '').trim(),
  };
}
