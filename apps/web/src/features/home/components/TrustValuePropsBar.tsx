import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'On orders above ₹199' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7 days return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% secure payments' },
  { icon: Headphones, label: 'Support', description: '24x7 assistance' },
];

export function TrustValuePropsBar() {
  return (
    <div className="w-full bg-[#F5F8FF] rounded-2xl p-3 sm:p-4 border border-blue-50/80 shadow-2xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#1668F6]">
              <item.icon strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">{item.label}</p>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-tight truncate mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
