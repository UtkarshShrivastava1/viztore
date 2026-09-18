import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Check } from 'lucide-react';
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
      : draft.step1?.fullName || 'Thoufiq Ahmed',
  );
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatureAdded, setSignatureAdded] = useState(Boolean(draft.step3?.signatureData));
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    setSignatureAdded(false);
  };

  const handleAddSignature = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        setError('Please draw your signature first or switch to Create mode');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      updateStep(3, {
        signatureType: 'draw',
        signatureData: dataUrl,
        authorizedSignatoryName: typedName || 'Authorized Signatory',
        signatoryDesignation: 'proprietor' as any,
        consentDate: new Date().toISOString(),
      });
    } else {
      const nameToUse = typedName?.trim() || 'Thoufiq Ahmed';
      if (!nameToUse) {
        setError('Please enter your name to create a signature');
        return;
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
  };

  const handleFinalContinue = () => {
    if (!signatureAdded) {
      handleAddSignature();
    }
    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* Header with Step 2 Badge */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#0038ed] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
          2
        </div>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-wider text-[#0038ed] uppercase">
          ID &amp; SIGNATURE VERIFICATION
        </h2>
      </div>

      <p className="text-xs text-slate-500 mb-5">
        Please provide your e-signature to verify your identity.
      </p>

      {error && (
        <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Signature Card */}
      <div className="space-y-3.5">
        <label className="block text-xs font-semibold text-slate-800">
          Signature Verification *
        </label>

        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4 shadow-2xs">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">Add Your e-Signature</h3>

          {/* Draw / Create Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab('draw');
                setSignatureAdded(false);
              }}
              className={`pb-2.5 font-bold transition-all relative cursor-pointer ${
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
              className={`pb-2.5 font-bold transition-all relative cursor-pointer ${
                activeTab === 'create'
                  ? 'text-[#0038ed] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0038ed]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Create
            </button>
          </div>

          {/* Draw Tab Content (Screen 2.png) */}
          {activeTab === 'draw' && (
            <div className="relative border border-slate-200 rounded-lg p-3 bg-slate-50/40">
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-[#0038ed] hover:text-[#002fcf] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="relative bg-white rounded-md border border-slate-200 h-44 overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={176}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
                {/* Baseline Guide matching Screen 2.png */}
                <div className="absolute bottom-4 left-6 right-6 border-b border-dashed border-slate-300 pointer-events-none flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-mono select-none">×</span>
                  <span className="text-[10px] text-slate-400 font-medium select-none">
                    Draw Signature
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Create Tab Content (Screen 5.png) */}
          {activeTab === 'create' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter your name to create a signature *
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                    setSignatureAdded(false);
                  }}
                  placeholder="e.g. Thoufiq Ahmed"
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed]"
                />
              </div>

              {/* Dynamic Cursive Signature Preview */}
              <div className="h-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
                <span
                  style={{
                    fontFamily: "'Dancing Script', 'Caveat', 'Brush Script MT', cursive",
                  }}
                  className="text-4xl sm:text-5xl text-slate-900 tracking-wide select-none drop-shadow-2xs"
                >
                  {typedName || 'Your Signature'}
                </span>
                <div className="absolute bottom-3 left-6 right-6 border-b border-slate-200/80 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Legal disclaimer */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            By clicking on &quot;Add&quot;, I understand that this is my electronic signature and is valid when
            used by me or my agent.
          </p>

          {/* Actions inside Signature Card */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddSignature}
              className={`px-5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer ${
                signatureAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0038ed] hover:bg-[#002fcf] text-white'
              }`}
            >
              {signatureAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Signature Added ✓</span>
                </>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </div>

        {/* Big Bottom Continue Button */}
        <div className="pt-3 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-32 py-3 px-4 rounded-lg border border-[#0038ed] text-[#0038ed] font-semibold text-sm hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleFinalContinue}
            className="flex-1 py-3 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
