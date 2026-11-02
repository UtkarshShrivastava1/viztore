import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useReturnsStore, ReturnRecord } from '../stores/returnsStore.js';
import { ReturnsKPIBar } from '../components/returns/ReturnsKPIBar.js';
import { ReturnsTable } from '../components/returns/ReturnsTable.js';
import { ReturnDetailsModal } from '../components/returns/ReturnDetailsModal.js';
import { ReturnDetailsDrawer } from '../components/returns/ReturnDetailsDrawer.js';
import { RejectReturnModal } from '../components/returns/RejectReturnModal.js';
import { ReturnSlipModal } from '../components/returns/ReturnSlipModal.js';
import { RaiseRequestModal } from '../components/returns/RaiseRequestModal.js';
import { NewReturnView } from '../components/returns/NewReturnView.js';

interface ReturnsPageProps {
  onNavigateHome?: () => void;
}

export const ReturnsPage: React.FC<ReturnsPageProps> = ({ onNavigateHome }) => {
  const {
    selectedReturn,
    setSelectedReturn,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    isRejectModalOpen,
    setIsRejectModalOpen,
    returnToReject,
    isSlipModalOpen,
    setIsSlipModalOpen,
    isRaiseModalOpen,
    closeRaiseModal,
    returnForRaise,
    activeView,
    setActiveView,
    fetchReturns,
  } = useReturnsStore();

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleViewReturn = (ret: ReturnRecord) => {
    setSelectedReturn(ret);
    setIsDetailsDrawerOpen(true);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-3.5">
      {/* Header Section matching 9.0.png */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 font-medium">
          <span
            className="hover:text-slate-600 cursor-pointer"
            onClick={onNavigateHome}
          >
            Home
          </span>
          <span>&gt;</span>
          <span className="text-slate-800 font-semibold">Returns & Refunds</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Returns & Refunds
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage product returns and refunds in one place.
            </p>
          </div>

          {activeView === 'overview' && (
            <button
              type="button"
              onClick={() => setActiveView('new_return')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Return</span>
            </button>
          )}
        </div>
      </div>

      {activeView === 'new_return' ? (
        <NewReturnView
          onCancel={() => setActiveView('overview')}
          onSuccess={() => {
            setActiveView('overview');
            fetchReturns();
          }}
        />
      ) : (
        <>
          {/* 4 KPI Cards Matching 9.0.png */}
          <ReturnsKPIBar />

          {/* Main Returns Table Matching 9.0.png & 9.2.png */}
          <ReturnsTable onViewReturn={handleViewReturn} />
        </>
      )}

      {/* Return Details Action Drawer with Approve / Reject / Refund Controls */}
      <ReturnDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        returnRecord={selectedReturn}
        onOpenSlipModal={() => setIsSlipModalOpen(true)}
      />

      {/* Reject Return Reason Modal */}
      <RejectReturnModal />

      {/* Printable Return Slip Modal */}
      <ReturnSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        returnRecord={selectedReturn}
      />

      {/* Return Details Summary Modal */}
      <ReturnDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        returnRecord={selectedReturn}
      />

      {/* Raise Request Modal Matching 9.3.png */}
      <RaiseRequestModal
        isOpen={isRaiseModalOpen}
        onClose={closeRaiseModal}
        returnRecord={returnForRaise}
      />
    </div>
  );
};
