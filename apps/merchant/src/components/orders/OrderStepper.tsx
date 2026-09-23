import React from 'react';
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { OrderTab } from '../../stores/orderStore.js';

interface OrderStepperProps {
  activeTab?: OrderTab;
  onSelectStep?: (tab: OrderTab) => void;
}

export const OrderStepper: React.FC<OrderStepperProps> = ({ activeTab = 'new_orders', onSelectStep }) => {
  const isReturns = activeTab === 'returns';

  const steps = [
    {
      id: '01',
      name: 'New Order',
      icon: ShoppingCart,
      color: 'blue',
      tabKey: 'new_orders' as OrderTab,
      circleStyle: activeTab === 'new_orders'
        ? 'border-blue-400 bg-blue-50 text-blue-600 ring-2 ring-blue-100'
        : 'border-blue-300 bg-blue-50/40 text-blue-600',
      labelStyle: activeTab === 'new_orders' ? 'text-blue-600 font-bold' : 'text-slate-800 font-semibold',
    },
    {
      id: '02',
      name: 'Ready to Ship',
      icon: Package,
      color: 'orange',
      tabKey: 'ready_to_ship' as OrderTab,
      circleStyle: activeTab === 'ready_to_ship'
        ? 'border-orange-400 bg-orange-50 text-orange-600 ring-2 ring-orange-100'
        : 'border-orange-300 bg-orange-50/30 text-orange-500',
      labelStyle: activeTab === 'ready_to_ship' ? 'text-orange-600 font-bold' : 'text-slate-800 font-semibold',
    },
    {
      id: '03',
      name: 'Shipped',
      icon: Truck,
      color: 'green',
      tabKey: 'shipped' as OrderTab,
      circleStyle: activeTab === 'shipped'
        ? 'border-emerald-400 bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100'
        : 'border-emerald-300 bg-emerald-50/30 text-emerald-600',
      labelStyle: activeTab === 'shipped' ? 'text-emerald-600 font-bold' : 'text-slate-800 font-semibold',
    },
    {
      id: '04',
      name: isReturns ? 'Returns' : 'Delivered',
      icon: isReturns ? RotateCcw : CheckCircle2,
      color: isReturns ? 'red' : 'teal',
      tabKey: isReturns ? ('returns' as OrderTab) : ('delivered' as OrderTab),
      circleStyle: isReturns
        ? 'border-rose-400 bg-rose-50/60 text-rose-600 ring-2 ring-rose-100'
        : activeTab === 'delivered'
        ? 'border-teal-400 bg-teal-50 text-teal-600 ring-2 ring-teal-100'
        : 'border-teal-300 bg-teal-50/30 text-teal-600',
      labelStyle: isReturns
        ? 'text-rose-600 font-bold'
        : activeTab === 'delivered'
        ? 'text-teal-600 font-bold'
        : 'text-slate-800 font-semibold',
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
      <h3 className="text-xs font-semibold text-slate-800 mb-3">Order Flow</h3>

      {/* Overflow wrapper with sufficient top padding so the badges are never clipped */}
      <div className="w-full overflow-x-auto pt-3 pb-2 px-1">
        <div className="flex items-start justify-between min-w-[560px]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <div
                  onClick={() => onSelectStep?.(step.tabKey)}
                  className="flex flex-col items-center cursor-pointer group shrink-0 transition-transform hover:-translate-y-0.5"
                >
                  {/* Icon Circle with Solid Blue Badge */}
                  <div className="relative">
                    {/* Badge 01..06: Solid Blue circle matching reference, fully visible without top clipping */}
                    <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center z-20 shadow-2xs ring-2 ring-white">
                      {step.id}
                    </div>

                    {/* Circle Node (h-12 = 48px) */}
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${step.circleStyle}`}
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Step Label below */}
                  <span className={`text-xs mt-2 text-center whitespace-nowrap ${step.labelStyle}`}>
                    {step.name}
                  </span>
                </div>

                {/* Dotted Arrow Connector: perfectly aligned on the exact same horizontal line */}
                {!isLast && (
                  <div className="flex-1 mx-2 sm:mx-4 h-12 flex items-center justify-center">
                    <div className="w-full flex items-center">
                      <div className="flex-1 border-t-2 border-dotted border-blue-200" />
                      <svg
                        className="w-2.5 h-2.5 text-blue-400 shrink-0 -ml-0.5"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2L6.5 5L2 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
