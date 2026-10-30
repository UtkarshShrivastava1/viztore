import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Zap, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { playScanBeep } from '../../lib/masterCatalogService.js';

interface CameraBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

// Global declaration for experimental BarcodeDetector API
declare global {
  class BarcodeDetector {
    constructor(options?: { formats: string[] });
    static getSupportedFormats(): Promise<string[]>;
    detect(image: ImageBitmapSource): Promise<Array<{ rawValue: string; format: string }>>;
  }
}

export const CameraBarcodeScannerModal: React.FC<CameraBarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('Align barcode inside the frame...');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const isScanningRef = useRef(false);

  // Popular test barcodes for instant testing
  const demoBarcodes = [
    { label: 'Tata Salt (1 kg)', code: '8901499009845' },
    { label: 'Maggi Noodles (70g)', code: '8901058852394' },
    { label: 'boAt Rockerz 450', code: '8906145620018' },
    { label: 'Amul Butter (500g)', code: '8901262010054' },
    { label: 'Peter England Shirt', code: '8907861001234' },
  ];

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setDetectedCode(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setScanStatus('Initializing camera stream...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Check if torch is supported
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities?.() || {}) as { torch?: boolean };
        setHasTorch(Boolean(capabilities.torch));
      }

      setScanStatus('Camera active. Scanning for EAN-13 / UPC / SKU...');
      isScanningRef.current = true;
      startDetectionLoop(mediaStream);
    } catch (err) {
      console.warn('[CameraBarcodeScanner] Camera access error or denied:', err);
      setHasPermission(false);
      setScanStatus('Camera access denied or camera not found. Use manual picker below.');
    }
  };

  const stopCamera = () => {
    isScanningRef.current = false;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleTorch = async () => {
    if (!stream || !hasTorch) return;
    try {
      const track = stream.getVideoTracks()[0];
      const nextTorch = !torchOn;
      // @ts-expect-error applyConstraints accepts torch in mobile Chrome
      await track.applyConstraints({ advanced: [{ torch: nextTorch }] });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  const startDetectionLoop = async (mediaStream: MediaStream) => {
    // If browser supports native BarcodeDetector API
    if ('BarcodeDetector' in window) {
      try {
        const detector = new BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
        });

        const scanFrame = async () => {
          if (!isScanningRef.current || !videoRef.current) return;
          try {
            if (videoRef.current.readyState >= 2) {
              const barcodes = await detector.detect(videoRef.current);
              const firstBarcode = barcodes[0];
              if (firstBarcode && firstBarcode.rawValue) {
                handleSuccess(firstBarcode.rawValue);
                return;
              }
            }
          } catch {
            // Ignore frame decode glitch
          }
          if (isScanningRef.current) {
            requestAnimationFrame(scanFrame);
          }
        };

        requestAnimationFrame(scanFrame);
        return;
      } catch (err) {
        console.warn('BarcodeDetector initialization fallback:', err);
      }
    }
  };

  const handleSuccess = (code: string) => {
    isScanningRef.current = false;
    setDetectedCode(code);
    playScanBeep();
    setScanStatus(`Barcode detected: ${code}`);

    setTimeout(() => {
      onDetected(code);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col text-white">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Barcode Scanner
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono font-medium">
                  EAN-13 / UPC
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Position barcode inside the illuminated frame</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {hasPermission === false ? (
            <div className="p-6 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-200">Camera Permission Required or Unavailable</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                To scan physical retail product boxes directly, allow camera access in your browser or test using the sample barcodes below.
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Laser scan line */}
                <div className="w-64 h-36 border-2 border-dashed border-blue-400/80 rounded-2xl relative shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500/80 animate-pulse absolute top-1/2 -translate-y-1/2" />
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-blue-400" />
                </div>
              </div>

              {/* Detection Flash Overlay */}
              {detectedCode && (
                <div className="absolute inset-0 bg-emerald-500/40 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
                  <div className="bg-emerald-950/90 border border-emerald-400/40 rounded-2xl p-4 text-center shadow-xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
                    <p className="text-xs font-bold text-white">Scanned Successfully!</p>
                    <p className="text-xs font-mono text-emerald-300 mt-0.5">{detectedCode}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Controls pill overlay at bottom of camera */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-1.5 rounded-full transition-colors ${
                  torchOn ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
                title="Toggle Torch"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
              title="Flip Camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] text-slate-300 font-medium px-1 truncate max-w-[200px]">
              {scanStatus}
            </span>
          </div>
        </div>

        {/* Quick Sample Barcodes (Instant Testing without physical items) */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Quick Test Barcodes:
            </span>
            <span className="text-[10px] text-slate-500">Click any item to simulate instant scan</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoBarcodes.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSuccess(item.code)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 border border-slate-700/70 hover:border-blue-500/50 text-left transition-all group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                  {item.label}
                </div>
                <div className="text-[10px] font-mono text-slate-400 group-hover:text-blue-400 truncate">
                  {item.code}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

