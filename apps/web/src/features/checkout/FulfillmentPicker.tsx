import React from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { Calendar, ShoppingBag, Truck } from 'lucide-react';

export function FulfillmentPicker() {
  const { fulfillmentType, setFulfillmentType } = useCheckoutStore();

  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold text-[#192168] mb-1">2. Delivery Options</h2>
      <p className="text-[11px] text-gray-500 mb-3">Choose how you want to receive your order</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <OptionCard 
          icon={<Calendar className="h-5 w-5" />}
          title="Reserve"
          desc="Reserve your order for a specific date and time."
          selected={fulfillmentType === 'reserve'}
          onClick={() => setFulfillmentType('reserve')}
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
        />
        <OptionCard 
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Pickup"
          desc="Pick up your order from the store."
          selected={fulfillmentType === 'pickup'}
          onClick={() => setFulfillmentType('pickup')}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50"
        />
        <OptionCard 
          icon={<Truck className="h-5 w-5" />}
          title="Deliver"
          desc="Get your order delivered to your address."
          selected={fulfillmentType === 'deliver'}
          onClick={() => setFulfillmentType('deliver')}
          iconColor="text-[#1668F6]"
          iconBg="bg-blue-50"
        />
      </div>

      {fulfillmentType === 'deliver' && (
         <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2.5 text-[11px] font-bold text-emerald-600">
           <Truck className="h-4 w-4" />
           Yay! You get FREE delivery on this order.
         </div>
      )}
      {fulfillmentType === 'reserve' && (
         <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2.5 text-[11px] font-bold text-emerald-600">
           <Calendar className="h-4 w-4" />
           Your items will be reserved. You can pay later at the time of pickup or delivery.
         </div>
      )}
    </div>
  );
}

function OptionCard({ icon, title, desc, selected, onClick, iconColor, iconBg }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
        selected ? 'border-[#1668F6] bg-blue-50/30' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${selected ? 'border-[#1668F6]/20 bg-white' : `border-transparent ${iconBg}`} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-snug pr-2">{desc}</p>
      </div>
      <div className="shrink-0">
        {selected ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1668F6] text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
        )}
      </div>
    </div>
  );
}
