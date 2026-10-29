import React from 'react';
import { Plus, ArrowRight, FileText, Calculator, FileCheck } from 'lucide-react';

interface CreateNewBillCardProps {
  onOpenCreateInvoice?: () => void;
  onOpenEstimate?: () => void;
  onOpenCreditNote?: () => void;
  onViewAllInvoices?: () => void;
}

export const CreateNewBillCard: React.FC<CreateNewBillCardProps> = ({ 
  onOpenCreateInvoice,
  onOpenEstimate,
  onOpenCreditNote,
  onViewAllInvoices,
}) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#081028] text-white border border-[#152348] shadow-sm flex flex-col justify-between space-y-3 h-full">
      <div>
        {/* Top Tag & Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Create New Bill</h3>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/80">
            Most Used
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
          Generate professional invoices in seconds
        </p>

        {/* 3 Action Tiles */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5">
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="p-2 rounded-xl bg-[#0f1b38] hover:bg-[#15264f] border border-[#1e2f5b] text-center transition-all flex flex-col items-center justify-center gap-0.5 group cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold text-slate-100 block leading-tight">Tax Invoice</span>
            <span className="text-[8px] text-slate-400 block leading-none">GST Invoice</span>
          </button>

          <button
            type="button"
            onClick={onOpenEstimate || onOpenCreateInvoice}
            className="p-2 rounded-xl bg-[#0f1b38] hover:bg-[#15264f] border border-[#1e2f5b] text-center transition-all flex flex-col items-center justify-center gap-0.5 group cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold text-slate-100 block leading-tight">Estimate / Quote</span>
            <span className="text-[8px] text-slate-400 block leading-none">Quotation</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreditNote || onOpenCreateInvoice}
            className="p-2 rounded-xl bg-[#0f1b38] hover:bg-[#15264f] border border-[#1e2f5b] text-center transition-all flex flex-col items-center justify-center gap-0.5 group cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold text-slate-100 block leading-tight">Credit Note</span>
            <span className="text-[8px] text-slate-400 block leading-none">Credit / Debit</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5 pt-0.5">
        <button
          type="button"
          onClick={onOpenCreateInvoice}
          className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1a56db] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>

        <button
          type="button"
          onClick={onViewAllInvoices || onOpenCreateInvoice}
          className="w-full text-center text-[10px] font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Invoices</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
