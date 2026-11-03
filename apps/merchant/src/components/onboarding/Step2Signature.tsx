import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Check, Undo2 } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';

interface Step2SignatureProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const Step2Signature: React.FC<Step2SignatureProps> = ({ onContinue, onBack }) => {
  const { draft, updateStep } = useOnboardingStore();

  const [activeTab, setActiveTab] = useState<'draw' | 'create'>('draw');
  const [typedName, setTypedName] = useState(
    draft.step3?.signatureType === 'generate'
      ? draft.step3.signatureData
      : draft.step1?.fullName || '',
  );
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatureAdded, setSignatureAdded] = useState(Boolean(draft.step3?.signatureData));
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab]);

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX =
      'touches' in e && e.touches.length > 0
        ? e.touches[0]!.clientX
        : (e as React.MouseEvent).clientX;
    const clientY =
      'touches' in e && e.touches.length > 0
        ? e.touches[0]!.clientY
        : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const snap = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setStrokeHistory((prev) => [...prev, snap]);
      }
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = strokeHistory.slice(0, -1);
    if (nextHistory.length > 0) {
      const prevSnapshot = nextHistory[nextHistory.length - 1]!;
      ctx.putImageData(prevSnapshot, 0, 0);
      setHasDrawn(true);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
    setStrokeHistory(nextHistory);
    setSignatureAdded(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokeHistory([]);
    setHasDrawn(false);
    setSignatureAdded(false);
  };

  const handleAddSignature = (): boolean => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        setError('Please draw your signature first or switch to Create mode');
        return false;
      }
      const dataUrl = canvas.toDataURL('image/png');
      updateStep(3, {
        signatureType: 'draw',
        signatureData: dataUrl,
        authorizedSignatoryName:
          typedName || draft.step1?.fullName || 'Authorized Signatory',
        signatoryDesignation: 'proprietor' as any,
        consentDate: new Date().toISOString(),
      });
    } else {
      const nameToUse = typedName?.trim() || draft.step1?.fullName?.trim();
      if (!nameToUse) {
        setError('Please enter your name to create an electronic signature');
        return false;
      }
      updateStep(3, {
        signatureType: 'generate',
        signatureData: nameToUse,
        authorizedSignatoryName: nameToUse,
        signatoryDesignation: 'proprietor' as any,
        consentDate: new Date().toISOString(),
      });
    }

    setSignatureAdded(true);
    setError(null);
    return true;
  };

  const handleFinalContinue = () => {
    if (!signatureAdded) {
      const ok = handleAddSignature();
      if (!ok) return;
    }
    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/40 relative lg:h-full flex flex-col justify-between overflow-hidden">
      {/* Header with Step 2 Badge */}
      <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
            2
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
              Electronic Signature
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Legally compliant merchant consent
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>IT Act 2000 Compliant</span>
        </div>
      </div>

      {error && (
        <div className="mb-2.5 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 shrink-0 animate-in fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Signature Workspace Card */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-2.5 scrollbar-thin">
        <p className="text-xs text-slate-500">
          Draw your signature or generate an official electronic signature using your name.
        </p>

        <div className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Add Your e-Signature
            </h3>

            {/* Draw / Create Tabs */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('draw');
                  setSignatureAdded(false);
                }}
                className={`pb-1 transition-all relative cursor-pointer ${
                  activeTab === 'draw'
                    ? 'text-[#0038ed] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0038ed]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Draw
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('create');
                  setSignatureAdded(false);
                }}
                className={`pb-1 transition-all relative cursor-pointer ${
                  activeTab === 'create'
                    ? 'text-[#0038ed] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0038ed]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Create
              </button>
            </div>
          </div>

          {/* Draw Tab Content */}
          {activeTab === 'draw' && (
            <div className="relative border border-slate-200 rounded-xl p-2.5 bg-slate-50/50">
              <div className="flex items-center justify-end gap-3 mb-1.5">
                <button
                  type="button"
                  disabled={strokeHistory.length === 0}
                  onClick={handleUndo}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  title="Undo last stroke"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-semibold text-[#0038ed] hover:text-[#002fcf] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="relative bg-white rounded-lg border border-slate-200 h-36 overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={144}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
                <div className="absolute bottom-3 left-6 right-6 border-b border-dashed border-slate-300 pointer-events-none flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-mono select-none">×</span>
                  <span className="text-[10px] text-slate-400 font-medium select-none">
                    Draw Signature
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Create Tab Content */}
          {activeTab === 'create' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enter Full Legal Name *
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                    setSignatureAdded(false);
                  }}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed] font-medium"
                />
              </div>

              <div className="h-28 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-3 relative overflow-hidden">
                <span
                  style={{
                    fontFamily: "'Dancing Script', 'Caveat', 'Brush Script MT', cursive",
                  }}
                  className="text-3xl sm:text-4xl text-slate-900 tracking-wide select-none drop-shadow-2xs"
                >
                  {typedName || 'Your Signature'}
                </span>
                <div className="absolute bottom-2 left-6 right-6 border-b border-slate-200/80 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Legal disclaimer & Add button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-tight">
              By clicking on &quot;Add&quot;, I declare this electronic signature valid under the IT Act 2000.
            </p>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleAddSignature}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  signatureAdded
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#0038ed] hover:bg-[#002fcf] text-white shadow-xs'
                }`}
              >
                {signatureAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Signature Added ✓</span>
                  </>
                ) : (
                  'Add Signature'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM ACTION BAR (100% Anchored & Fully Visible) */}
      <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleFinalContinue}
          className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <span>Confirm &amp; Proceed to Store Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
