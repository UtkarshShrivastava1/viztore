import React from 'react';
import { useReturnsStore, ReturnRecord } from '../stores/returnsStore.js';
import { ReturnsKPIBar } from '../components/returns/ReturnsKPIBar.js';
import { ReturnsTable } from '../components/returns/ReturnsTable.js';
import { ReturnDetailsModal } from '../components/returns/ReturnDetailsModal.js';
import { RaiseRequestModal } from '../components/returns/RaiseRequestModal.js';

interface ReturnsPageProps {
  onNavigateHome?: () => void;
}

export const ReturnsPage: React.FC<ReturnsPageProps> = ({ onNavigateHome }) => {
  const {
    selectedReturn,
    setSelectedReturn,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isRaiseModalOpen,
    closeRaiseModal,
    returnForRaise,
  } = useReturnsStore();

  const handleViewReturn = (ret: ReturnRecord) => {
    setSelectedReturn(ret);
    setIsDetailsModalOpen(true);
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

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Returns & Refunds
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product returns and refunds in one place.
          </p>
        </div>
      </div>

      {/* 4 KPI Cards Matching 9.0.png */}
      <ReturnsKPIBar />

      {/* Main Returns Table Matching 9.0.png & 9.2.png */}
      <ReturnsTable onViewReturn={handleViewReturn} />

      {/* Return Details Modal Matching 9.1.png */}
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
