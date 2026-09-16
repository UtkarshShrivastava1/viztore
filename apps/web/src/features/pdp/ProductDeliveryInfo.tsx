import React from 'react';
import { MapPin, Truck, Box } from 'lucide-react';

export function ProductDeliveryInfo() {
  return (
    <div className="space-y-5 py-2">
      <h2 className="text-[15px] font-extrabold text-[#192168]">Delivery Details</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[13px] font-extrabold text-[#192168] mb-1">Deliver to</p>
            <p className="text-[11px] font-medium text-[#192168]">123, MG Road, Near City Mall, Indore, Madhya Pradesh - 452001</p>
          </div>
          <button className="text-xs font-bold text-[#1668F6]">Change</button>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#f4f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Truck className="w-4 h-4 text-[#192168]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-extrabold text-[#192168] mb-1">Delivery by</p>
            <p className="text-[11px] font-medium text-[#192168]">Tomorrow, 12 May</p>
            <p className="text-[11px] font-extrabold text-emerald-600 mt-1">Order within 2h 30m</p>
          </div>
          <span className="text-[13px] font-extrabold text-emerald-600 mt-0.5">FREE</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#f4f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Box className="w-4 h-4 text-[#1668F6]" />
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[13px] font-extrabold text-[#192168] mb-1">Return Policy</p>
            <p className="text-[11px] font-medium text-[#192168]">7 Days easy return & exchange</p>
          </div>
          <button className="text-xs font-bold text-[#1668F6]">Know More</button>
        </div>
      </div>
    </div>
  );
}
