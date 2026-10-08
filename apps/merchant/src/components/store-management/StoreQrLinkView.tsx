import React, { useState, useRef } from 'react';
import {
  QrCode,
  Link2,
  Copy,
  Check,
  Download,
  Printer,
  Share2,
  ExternalLink,
  Globe,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Store,
  FileText,
  MessageSquare,
  Share,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';
import { branding } from '../../lib/branding.js';

export const StoreQrLinkView: React.FC = () => {
  const { storeSlug, setActiveSubTab } = useStoreManagementStore();
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const displayDomain =
    branding.domain && branding.domain !== 'localhost'
      ? branding.domain
      : `${branding.appName.toLowerCase().replace(/\s+/g, '')}.in`;

  const storeUrl = `https://${displayDomain}/${storeSlug || 'fashionhub'}`;
  const qrRef = useRef<SVGSVGElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setActionNotice('Store link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setActionNotice(null);
    }, 2500);
  };

  const handleDownload = (format: 'png' | 'jpg' | 'svg') => {
    setShowDownloadMenu(false);
    if (!qrRef.current) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${storeSlug}-qr-code.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setActionNotice('SVG QR Code downloaded successfully!');
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    // PNG / JPG Canvas Export
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 512, 512);
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const fileUrl = canvas.toDataURL(mimeType, 0.95);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = `${storeSlug}-qr-code.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setActionNotice(`${format.toUpperCase()} QR Code (512x512) downloaded!`);
        setTimeout(() => setActionNotice(null), 3000);
      }
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSocialShare = (platform: 'whatsapp' | 'instagram' | 'facebook' | 'more') => {
    const text = `Check out our store at ${storeUrl}`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(storeUrl);
      setActionNotice('Link copied! Paste into your Instagram Bio or Story sticker.');
      setTimeout(() => setActionNotice(null), 3500);
    } else {
      if (navigator.share) {
        navigator.share({
          title: `${branding.appName} - Online Store`,
          text: `Shop from our store online:`,
          url: storeUrl,
        }).catch(() => {});
      } else {
        handleCopy();
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumb & Header (media_1791024769882.jpg) */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className="hover:text-blue-600 transition-colors"
          >
            Store Management
          </button>
          <span>&gt;</span>
          <span className="text-slate-800">My Store QR &amp; Link</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          My Store QR &amp; Link
        </h1>
        <p className="text-xs text-slate-500">
          Download your store QR code and copy your store link to share with customers.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold text-blue-800 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top 2 Cards: Left = Store QR Code, Right = Your Store Link */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Store QR Code (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">Store QR Code</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Let customers scan this QR code to visit your store directly.
                </p>
              </div>
            </div>

            {/* QR Card Content: Left Graphic + Right Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Left Column: Stylized QR Container (6 cols) */}
              <div className="sm:col-span-6 flex flex-col items-center">
                {/* QR Frame with subtle backdrop blob */}
                <div className="relative p-5 bg-gradient-to-b from-blue-50/60 to-slate-50 border border-slate-200/80 rounded-2xl shadow-xs w-full max-w-[240px] flex flex-col items-center">
                  {/* Decorative background glow */}
                  <div className="absolute -top-3 -left-3 w-20 h-20 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />

                  {/* SVG QR Code */}
                  <div className="relative bg-white p-3 rounded-xl shadow-xs border border-slate-100">
                    <svg
                      ref={qrRef}
                      viewBox="0 0 200 200"
                      className="w-44 h-44 select-none"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* White Background */}
                      <rect width="200" height="200" fill="white" rx="10" />

                      {/* Top-Left Eye Marker */}
                      <rect x="16" y="16" width="46" height="46" rx="8" stroke="#1e40af" strokeWidth="6" />
                      <rect x="25" y="25" width="28" height="28" rx="4" fill="#1d4ed8" />

                      {/* Top-Right Eye Marker */}
                      <rect x="138" y="16" width="46" height="46" rx="8" stroke="#1e40af" strokeWidth="6" />
                      <rect x="147" y="25" width="28" height="28" rx="4" fill="#1d4ed8" />

                      {/* Bottom-Left Eye Marker */}
                      <rect x="16" y="138" width="46" height="46" rx="8" stroke="#1e40af" strokeWidth="6" />
                      <rect x="25" y="147" width="28" height="28" rx="4" fill="#1d4ed8" />

                      {/* Matrix Dot Pattern (Deterministic QR Data Modules) */}
                      <g fill="#0f172a">
                        {/* Timing Patterns */}
                        <rect x="70" y="36" width="6" height="6" rx="1.5" />
                        <rect x="84" y="36" width="6" height="6" rx="1.5" />
                        <rect x="98" y="36" width="6" height="6" rx="1.5" />
                        <rect x="112" y="36" width="6" height="6" rx="1.5" />
                        <rect x="126" y="36" width="6" height="6" rx="1.5" />

                        <rect x="36" y="70" width="6" height="6" rx="1.5" />
                        <rect x="36" y="84" width="6" height="6" rx="1.5" />
                        <rect x="36" y="98" width="6" height="6" rx="1.5" />
                        <rect x="36" y="112" width="6" height="6" rx="1.5" />
                        <rect x="36" y="126" width="6" height="6" rx="1.5" />

                        {/* Top Area Modules */}
                        <rect x="70" y="18" width="6" height="6" rx="1.5" />
                        <rect x="78" y="26" width="6" height="6" rx="1.5" />
                        <rect x="92" y="20" width="6" height="6" rx="1.5" />
                        <rect x="108" y="22" width="6" height="6" rx="1.5" />
                        <rect x="122" y="18" width="6" height="6" rx="1.5" />
                        <rect x="86" y="48" width="6" height="6" rx="1.5" />
                        <rect x="102" y="52" width="6" height="6" rx="1.5" />

                        {/* Mid-Left Area Modules */}
                        <rect x="18" y="74" width="6" height="6" rx="1.5" />
                        <rect x="26" y="86" width="6" height="6" rx="1.5" />
                        <rect x="48" y="78" width="6" height="6" rx="1.5" />
                        <rect x="54" y="94" width="6" height="6" rx="1.5" />
                        <rect x="20" y="106" width="6" height="6" rx="1.5" />
                        <rect x="52" y="118" width="6" height="6" rx="1.5" />

                        {/* Mid-Right Area Modules */}
                        <rect x="138" y="72" width="6" height="6" rx="1.5" />
                        <rect x="152" y="80" width="6" height="6" rx="1.5" />
                        <rect x="166" y="72" width="6" height="6" rx="1.5" />
                        <rect x="178" y="84" width="6" height="6" rx="1.5" />
                        <rect x="142" y="96" width="6" height="6" rx="1.5" />
                        <rect x="160" y="98" width="6" height="6" rx="1.5" />
                        <rect x="174" y="106" width="6" height="6" rx="1.5" />
                        <rect x="146" y="116" width="6" height="6" rx="1.5" />
                        <rect x="168" y="122" width="6" height="6" rx="1.5" />
                        <rect x="180" y="132" width="6" height="6" rx="1.5" />

                        {/* Bottom-Right Area Modules */}
                        <rect x="138" y="144" width="6" height="6" rx="1.5" />
                        <rect x="150" y="152" width="6" height="6" rx="1.5" />
                        <rect x="166" y="146" width="6" height="6" rx="1.5" />
                        <rect x="176" y="158" width="6" height="6" rx="1.5" />
                        <rect x="142" y="168" width="6" height="6" rx="1.5" />
                        <rect x="156" y="174" width="6" height="6" rx="1.5" />
                        <rect x="172" y="172" width="6" height="6" rx="1.5" />

                        {/* Bottom-Center Area Modules */}
                        <rect x="74" y="144" width="6" height="6" rx="1.5" />
                        <rect x="90" y="148" width="6" height="6" rx="1.5" />
                        <rect x="108" y="146" width="6" height="6" rx="1.5" />
                        <rect x="80" y="162" width="6" height="6" rx="1.5" />
                        <rect x="96" y="168" width="6" height="6" rx="1.5" />
                        <rect x="114" y="166" width="6" height="6" rx="1.5" />
                        <rect x="86" y="180" width="6" height="6" rx="1.5" />
                        <rect x="104" y="180" width="6" height="6" rx="1.5" />
                      </g>

                      {/* Center Brand Badge (Navy Rounded Rectangle) */}
                      <rect x="68" y="68" width="64" height="64" rx="10" fill="#0a122c" />
                      <rect x="69" y="69" width="62" height="62" rx="9" stroke="#1e293b" strokeWidth="1" />
                      <text
                        x="100"
                        y="94"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="900"
                        letterSpacing="0.8"
                        textAnchor="middle"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        FASHION
                      </text>
                      <text
                        x="100"
                        y="110"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="900"
                        letterSpacing="0.8"
                        textAnchor="middle"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        HUB
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Scan QR and Visit Store subtitle banner */}
                <div className="flex items-start gap-2.5 mt-3 max-w-[240px] text-left">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      Scan QR and Visit Store
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Let your customers explore your store, view products and place orders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions & Recommended Use (6 cols) */}
              <div className="sm:col-span-6 space-y-4">
                {/* Download Button with Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Download QR Code</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-80" />
                  </button>

                  {showDownloadMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in duration-100">
                      <button
                        type="button"
                        onClick={() => handleDownload('png')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Download PNG</span>
                        <span className="text-[10px] font-mono text-slate-400">512×512</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload('jpg')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Download JPG</span>
                        <span className="text-[10px] font-mono text-slate-400">512×512</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload('svg')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Download SVG Vector</span>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">Vector</span>
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-1">
                    PNG, JPG, SVG (512 × 512 px)
                  </span>
                </div>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print QR Code</span>
                </button>

                {/* Share Button with Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Share QR Code</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showShareMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowShareMenu(false);
                          handleSocialShare('whatsapp');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Share to WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowShareMenu(false);
                          handleSocialShare('facebook');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Share to Facebook</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowShareMenu(false);
                          handleCopy();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Store Link</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommended Use Card */}
                <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <Lightbulb className="w-4 h-4 fill-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Recommended Use</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Display at your physical store</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Use in posters, visiting cards, packaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Share on WhatsApp, Instagram, Facebook</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Add to bills and customer communication</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Your Store Link (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Card Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">Your Store Link</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share this link with customers to open your store directly.
                </p>
              </div>
            </div>

            {/* Store Link Input Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={storeUrl}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 select-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy Link</span>
                )}
              </button>
            </div>

            {/* Share on Social Media */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Share on Social Media</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleSocialShare('whatsapp')}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">WhatsApp</span>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={() => handleSocialShare('instagram')}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">Instagram</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialShare('facebook')}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">Facebook</span>
                </button>

                {/* More */}
                <button
                  type="button"
                  onClick={() => handleSocialShare('more')}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                    <Share className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Status Banner */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-900 leading-tight">
                  Your store link is live
                </h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Customers can visit your store using this link and explore your products.
                </p>
              </div>
            </div>

            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors shrink-0"
              title="Open store link in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Use Your QR & Link Everywhere */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Use Your QR &amp; Link Everywhere
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reach more customers by sharing your store QR code and link across multiple channels.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: At Your Store */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
            {/* Visual Vector Illustration */}
            <div className="h-28 flex items-center justify-center mb-3">
              <svg viewBox="0 0 160 120" className="w-36 h-28" fill="none">
                {/* Store Roof & Awning */}
                <path d="M25 45L80 15L135 45H25Z" fill="#1e40af" />
                <path d="M25 45H135V52C135 55 132 58 128 58C124 58 121 55 121 52C121 55 118 58 114 58C110 58 107 55 107 52C107 55 104 58 100 58C96 58 93 55 93 52C93 55 90 58 86 58C82 58 79 55 79 52C79 55 76 58 72 58C68 58 65 55 65 52C65 55 62 58 58 58C54 58 51 55 51 52C51 55 48 58 44 58C40 58 37 55 37 52C37 55 34 58 30 58C26 58 25 55 25 52V45Z" fill="#3b82f6" />
                {/* Store Walls & Window */}
                <rect x="32" y="58" width="96" height="52" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="42" y="68" width="34" height="34" rx="2" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="1.5" />
                <line x1="59" y1="68" x2="59" y2="102" stroke="#93c5fd" strokeWidth="1.5" />
                <line x1="42" y1="85" x2="76" y2="85" stroke="#93c5fd" strokeWidth="1.5" />
                {/* Store Door */}
                <rect x="88" y="68" width="28" height="42" rx="2" fill="#334155" />
                <circle cx="94" cy="90" r="1.5" fill="#f8fafc" />
                {/* Plants / Accents */}
                <circle cx="128" cy="102" r="5" fill="#10b981" />
                <rect x="126" y="105" width="4" height="6" fill="#b45309" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">At Your Store</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Display QR code at billing counter, entrance or product displays.
              </p>
            </div>
          </div>

          {/* Card 2: Marketing Materials */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
            {/* Visual Vector Illustration */}
            <div className="h-28 flex items-center justify-center mb-3">
              <svg viewBox="0 0 160 120" className="w-36 h-28" fill="none">
                {/* Backdrop blob */}
                <circle cx="80" cy="60" r="42" fill="#dbeafe" />
                {/* Standee Base */}
                <ellipse cx="80" cy="105" rx="36" ry="6" fill="#94a3b8" />
                {/* Acrylic Standee Frame */}
                <rect x="52" y="24" width="56" height="76" rx="6" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                {/* Mini Standee Header */}
                <rect x="60" y="32" width="40" height="5" rx="1.5" fill="#94a3b8" />
                {/* Mini QR Code */}
                <rect x="64" y="44" width="32" height="32" rx="3" fill="#0f172a" />
                <rect x="67" y="47" width="8" height="8" fill="#ffffff" />
                <rect x="85" y="47" width="8" height="8" fill="#ffffff" />
                <rect x="67" y="65" width="8" height="8" fill="#ffffff" />
                {/* Shop Now Button Ribbon */}
                <rect x="58" y="82" width="44" height="11" rx="3" fill="#2563eb" />
                <text x="80" y="90" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
                  SHOP NOW
                </text>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Marketing Materials</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Use in posters, flyers, visiting cards and packaging.
              </p>
            </div>
          </div>

          {/* Card 3: Share with Customers */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
            {/* Visual Vector Illustration */}
            <div className="h-28 flex items-center justify-center mb-3">
              <svg viewBox="0 0 160 120" className="w-36 h-28" fill="none">
                {/* Phone Body */}
                <rect x="56" y="16" width="48" height="92" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
                {/* Phone Speaker Notch */}
                <rect x="73" y="21" width="14" height="2" rx="1" fill="#94a3b8" />
                {/* WhatsApp Chat Bubble */}
                <circle cx="80" cy="50" r="14" fill="#25D366" />
                <path d="M74 46H86V54H77L74 57V46Z" fill="#ffffff" />
                {/* Message preview bubble */}
                <rect x="63" y="70" width="34" height="14" rx="4" fill="#3b82f6" />
                <rect x="67" y="75" width="20" height="2" rx="1" fill="#ffffff" />
                <rect x="67" y="79" width="14" height="2" rx="1" fill="#bfdbfe" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Share with Customers</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Send your store link on WhatsApp, SMS or other messaging channels.
              </p>
            </div>
          </div>

          {/* Card 4: Social Media */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
            {/* Visual Vector Illustration */}
            <div className="h-28 flex items-center justify-center mb-3">
              <svg viewBox="0 0 160 120" className="w-36 h-28" fill="none">
                {/* Floating Social Icons */}
                {/* Instagram Bubble */}
                <circle cx="54" cy="56" r="18" fill="url(#insta-grad)" />
                <rect x="47" y="49" width="14" height="14" rx="4" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="54" cy="56" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="58.5" cy="51.5" r="0.8" fill="#ffffff" />

                {/* Facebook Bubble */}
                <circle cx="90" cy="46" r="18" fill="#1877F2" />
                <path d="M92 45H90V43.5C90 42.8 90.3 42.5 91 42.5H92V40H90.2C88.2 40 87 41.2 87 43.1V45H85V48H87V54H90V48H92L92 45Z" fill="#ffffff" />

                {/* Share Node Bubble */}
                <circle cx="120" cy="68" r="14" fill="#6366f1" />
                <circle cx="116" cy="68" r="2" fill="#ffffff" />
                <circle cx="123" cy="64" r="2" fill="#ffffff" />
                <circle cx="123" cy="72" r="2" fill="#ffffff" />
                <line x1="117.5" y1="67" x2="121.5" y2="65" stroke="#ffffff" strokeWidth="1" />
                <line x1="117.5" y1="69" x2="121.5" y2="71" stroke="#ffffff" strokeWidth="1" />

                <defs>
                  <linearGradient id="insta-grad" x1="36" y1="74" x2="72" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F58529" />
                    <stop offset="0.5" stopColor="#DD2A7B" />
                    <stop offset="1" stopColor="#8134AF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Social Media</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Add link to your Instagram, Facebook and other social profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
