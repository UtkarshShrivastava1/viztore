import React from 'react';
import { Plus, ArrowRight, FileText, Calculator, ShoppingBag, Sparkles, Zap } from 'lucide-react';

interface CreateNewBillCardProps {
  onOpenCreateInvoice?: () => void;
  onOpenEstimate?: () => void;
  onOpenPurchase?: () => void;
  onOpenCreditNote?: () => void;
  onViewAllInvoices?: () => void;
}

export const CreateNewBillCard: React.FC<CreateNewBillCardProps> = ({ 
  onOpenCreateInvoice,
  onOpenEstimate,
  onOpenPurchase,
  onOpenCreditNote,
  onViewAllInvoices,
}) => {
  return (
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#0a1228] via-[#0f1b3d] to-[#070c1e] text-white border border-[#1d2d5a] shadow-lg shadow-blue-950/25 flex flex-col justify-between space-y-3.5 h-full overflow-hidden group">
      {/* Background Ambient Mesh Orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/25 transition-colors duration-500" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Tag & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Zap className="w-3 h-3 text-blue-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-tight">
              Rapid Billing & POS
            </h3>
          </div>

          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            <span>Most Used</span>
          </span>
        </div>

        <p className="text-[11px] text-slate-300/80 mt-1 leading-tight font-medium">
          Generate tax invoices, estimates & purchase records in seconds
        </p>

        {/* 3 Action Tiles */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="p-2.5 rounded-xl bg-[#132042]/80 hover:bg-[#1a2d5c] border border-[#21356a] hover:border-blue-400/50 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 group/tile cursor-pointer shadow-sm hover:-translate-y-0.5"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center group-hover/tile:scale-110 transition-transform">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-100 block leading-tight mt-0.5">Tax Invoice</span>
            <span className="text-[8px] text-slate-400 block leading-none font-medium">GST Compliant</span>
          </button>

          <button
            type="button"
            onClick={onOpenEstimate || onOpenCreateInvoice}
            className="p-2.5 rounded-xl bg-[#132042]/80 hover:bg-[#1a2d5c] border border-[#21356a] hover:border-emerald-400/50 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 group/tile cursor-pointer shadow-sm hover:-translate-y-0.5"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center group-hover/tile:scale-110 transition-transform">
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-100 block leading-tight mt-0.5">Estimate</span>
            <span className="text-[8px] text-slate-400 block leading-none font-medium">Quotation</span>
          </button>

          <button
            type="button"
            onClick={onOpenPurchase || onOpenCreditNote || onOpenCreateInvoice}
            className="p-2.5 rounded-xl bg-[#132042]/80 hover:bg-[#1a2d5c] border border-[#21356a] hover:border-purple-400/50 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 group/tile cursor-pointer shadow-sm hover:-translate-y-0.5"
          >
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center group-hover/tile:scale-110 transition-transform">
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-100 block leading-tight mt-0.5">Purchase</span>
            <span className="text-[8px] text-slate-400 block leading-none font-medium">Record Expense</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-2 pt-1">
        <button
          type="button"
          onClick={onOpenCreateInvoice}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-white via-slate-50 to-blue-50 hover:from-blue-50 hover:to-white text-blue-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-black/20 hover:shadow-lg active:scale-[0.98] cursor-pointer group/btn"
        >
          <Plus className="w-4 h-4 text-blue-600 group-hover/btn:rotate-90 transition-transform duration-200" />
          <span>Create New Invoice</span>
        </button>

        <button
          type="button"
          onClick={onViewAllInvoices || onOpenCreateInvoice}
          className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/link py-0.5"
        >
          <span>View Invoices & Quotes</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
