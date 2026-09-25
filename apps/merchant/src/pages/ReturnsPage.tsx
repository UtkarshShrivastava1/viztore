import React, { useState } from 'react';
import {
  Plus,
  Upload,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useReturnsStore, ReturnRecord } from '../stores/returnsStore.js';
import { ReturnsKPIBar } from '../components/returns/ReturnsKPIBar.js';
import { ReturnsTable } from '../components/returns/ReturnsTable.js';
import { NewReturnView } from '../components/returns/NewReturnView.js';
import { ReturnDetailsDrawer } from '../components/returns/ReturnDetailsDrawer.js';
import { ReturnSlipModal } from '../components/returns/ReturnSlipModal.js';
import { RejectReturnModal } from '../components/returns/RejectReturnModal.js';

interface ReturnsPageProps {
  onNavigateHome?: () => void;
}

export const ReturnsPage: React.FC<ReturnsPageProps> = ({ onNavigateHome }) => {
  const {
    activeView,
    setActiveView,
    selectedReturn,
    setSelectedReturn,
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    isSlipModalOpen,
    setIsSlipModalOpen,
    selectedReturnIds,
    bulkApprove,
    bulkReject,
  } = useReturnsStore();

  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const handleViewReturn = (ret: ReturnRecord) => {
    setSelectedReturn(ret);
    setIsDetailsDrawerOpen(true);
  };

  const handleExportCSV = () => {
    alert('Exporting returns report to CSV...');
    setIsMoreActionsOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {activeView === 'new_return' ? (
        <NewReturnView
          onCancel={() => setActiveView('overview')}
          onSuccess={() => setActiveView('overview')}
        />
      ) : (
        <>
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
              <span
                className="hover:text-slate-600 cursor-pointer"
                onClick={onNavigateHome}
              >
                Home
              </span>
              <span>&gt;</span>
              <span className="text-slate-800 font-semibold">Returns & Refunds</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Returns & Refunds
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage product returns, refunds and exchanges in one place.
                </p>
              </div>

              {/* Action Buttons Matching 10.0.png */}
              <div className="flex items-center gap-2.5">
                {/* + New Return Button */}
                <button
                  onClick={() => setActiveView('new_return')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Return</span>
                </button>

                {/* Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Export</span>
                </button>

                {/* More Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <span>More Actions</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isMoreActionsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsMoreActionsOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                        <button
                          disabled={selectedReturnIds.length === 0}
                          onClick={() => {
                            bulkApprove();
                            setIsMoreActionsOpen(false);
                          }}
                          className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-left transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bulk Approve Selected</span>
                        </button>

                        <button
                          disabled={selectedReturnIds.length === 0}
                          onClick={() => {
                            bulkReject();
                            setIsMoreActionsOpen(false);
                          }}
                          className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-left transition-colors"
                        >
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span>Bulk Reject Selected</span>
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={handleExportCSV}
                          className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                          <span>Export Returns Log</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5 KPI Cards */}
          <ReturnsKPIBar />

          {/* Main Table */}
          <ReturnsTable onViewReturn={handleViewReturn} />
        </>
      )}

      {/* Slide-over Details Drawer */}
      <ReturnDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        returnRecord={selectedReturn}
        onOpenSlipModal={() => setIsSlipModalOpen(true)}
      />

      {/* Printable Return Slip Modal */}
      <ReturnSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        returnRecord={selectedReturn}
      />

      {/* Reject Return Modal */}
      <RejectReturnModal />
    </div>
  );
};
