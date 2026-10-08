import React, { useState } from 'react';
import { Gift, Award, Star, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const LoyaltyProgramTab: React.FC = () => {
  const [pointsPerSpend, setPointsPerSpend] = useState(1);
  const [pointValue, setPointValue] = useState(0.25);

  const tiers = [
    { name: 'Bronze', threshold: '₹0 - ₹4,999', members: 8420, multiplier: '1x Points', perk: 'Standard delivery' },
    { name: 'Silver', threshold: '₹5,000 - ₹14,999', members: 2850, multiplier: '1.25x Points', perk: '5% extra discount' },
    { name: 'Gold', threshold: '₹15,000 - ₹29,999', members: 890, multiplier: '1.5x Points', perk: 'Free delivery on all orders' },
    { name: 'Platinum VIP', threshold: '₹30,000+', members: 290, multiplier: '2x Points', perk: 'Exclusive early sale access' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Loyalty & Rewards Program</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Reward repeat purchases and cultivate long-term customer loyalty with tiered rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {tiers.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">{t.name}</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-[11px] text-slate-500">{t.threshold}</div>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Active Members:</span>
                <span>{t.members.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-blue-600 font-semibold">{t.multiplier}</div>
              <div className="text-[10px] text-slate-400">{t.perk}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Program Rules Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Points Earned per ₹100 Spent</label>
            <input
              type="number"
              value={pointsPerSpend}
              onChange={(e) => setPointsPerSpend(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Point Redemption Value (in ₹)</label>
            <input
              type="number"
              step="0.05"
              value={pointValue}
              onChange={(e) => setPointValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => alert('Loyalty program rules saved!')}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
          >
            Save Loyalty Rules
          </button>
        </div>
      </div>
    </div>
  );
};
