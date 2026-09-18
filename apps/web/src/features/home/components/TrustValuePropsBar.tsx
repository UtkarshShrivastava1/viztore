import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'Same day in your area' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7-day return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% safe checkout' },
  { icon: Headphones, label: '24×7 Support', description: 'Always here to help' },
];

export function TrustValuePropsBar() {
  return (
    <div className="w-full bg-[#F5F9FE] md:bg-[#F5F9FE] rounded-2xl p-4 md:p-6 border-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center">
              <item.icon className="lg:w-6 lg:h-6 w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-black lg:text-sm text-[10px]">{item.label}</p>
              <p className="text-surface-800 lg:text-xs text-[9px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
