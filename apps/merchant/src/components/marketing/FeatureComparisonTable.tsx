import React from 'react';
import { Check } from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface ComparisonRow {
  feature: string;
  standard: boolean | string;
  premium: boolean | string;
}

export const FeatureComparisonTable: React.FC = () => {
  const rows: ComparisonRow[] = [
    {
      feature: 'Create your digital store (profile, logo, address, timings)',
      standard: true,
      premium: true,
    },
    {
      feature: 'Product listing (images, categories, variants)',
      standard: true,
      premium: true,
    },
    {
      feature: 'Inventory management & stock alerts',
      standard: true,
      premium: true,
    },
    {
      feature: 'Orders & delivery management',
      standard: true,
      premium: true,
    },
    {
      feature: 'Billing & GST invoices generator',
      standard: true,
      premium: true,
    },
    {
      feature: 'Customer management & order history',
      standard: true,
      premium: true,
    },
    {
      feature: 'Reports & revenue analytics',
      standard: true,
      premium: true,
    },
    {
      feature: 'Marketing tools (offers, coupons, promotions)',
      standard: true,
      premium: true,
    },
    {
      feature: 'Customer app listing (hyperlocal discovery)',
      standard: true,
      premium: true,
    },
    {
      feature: `${branding.appName} delivery fleet access (customer orders)`,
      standard: true,
      premium: true,
    },
    {
      feature: 'Delivery charges for customer orders',
      standard: '₹30 (< ₹850) / ₹50 (≥ ₹850)',
      premium: 'No delivery charges (₹0)',
    },
    {
      feature: 'Dedicated support channel',
      standard: 'Standard support',
      premium: 'Priority support',
    },
    {
      feature: 'Plan duration',
      standard: '12 months only',
      premium: '12 months only',
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200/90 rounded-3xl shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-blue-50/70 border-b border-blue-100/80">
              <th className="py-4.5 px-6 font-bold text-sm text-slate-800 w-[50%]">Features</th>
              <th className="py-4.5 px-6 font-bold text-sm text-center text-slate-800 w-[25%]">
                <div>Standard Plan</div>
                <div className="text-xs font-semibold text-[#0038ed] mt-0.5">₹12,000 / year</div>
              </th>
              <th className="py-4.5 px-6 font-bold text-sm text-center text-slate-800 w-[25%] bg-blue-100/50">
                <div className="flex items-center justify-center gap-1">
                  <span>Premium Plan</span>
                </div>
                <div className="text-xs font-semibold text-[#0038ed] mt-0.5">₹16,000 / year</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/70' : 'bg-slate-50/30 hover:bg-slate-50/70'}
              >
                <td className="py-3.5 px-6 font-medium text-slate-700">{row.feature}</td>
                <td className="py-3.5 px-6 text-center text-slate-700">
                  {typeof row.standard === 'boolean' ? (
                    row.standard ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#0038ed]">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )
                  ) : (
                    <span className="font-semibold text-slate-700">{row.standard}</span>
                  )}
                </td>
                <td className="py-3.5 px-6 text-center text-slate-700 bg-blue-50/20">
                  {typeof row.premium === 'boolean' ? (
                    row.premium ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0038ed] text-white shadow-2xs">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )
                  ) : (
                    <span className="font-bold text-[#0038ed]">{row.premium}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
