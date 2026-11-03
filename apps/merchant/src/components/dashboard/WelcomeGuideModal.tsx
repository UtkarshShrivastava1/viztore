import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Package,
  Receipt,
  MapPin,
  Share2,
  ExternalLink,
  Copy,
  Check,
  X,
  ArrowRight,
  Rocket,
  ShieldCheck,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { branding } from '../../lib/branding.js';
import { DashboardTab } from './Sidebar.js';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: DashboardTab, subTab?: string) => void;
}

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { currentStore, user } = useAuthStore();
  const { products } = useCatalogStore();

  const [copied, setCopied] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('merchant_guide_completed_steps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Automatically mark product step complete if store already has products
  useEffect(() => {
    if (products && products.length > 0 && !completedSteps.add_product) {
      setCompletedSteps((prev) => {
        const next = { ...prev, add_product: true };
        try {
          localStorage.setItem('merchant_guide_completed_steps', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }, [products, completedSteps.add_product]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      try {
        localStorage.setItem('merchant_guide_completed_steps', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markStepDone = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepId]: true };
      try {
        localStorage.setItem('merchant_guide_completed_steps', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const storeName = currentStore?.name || user?.fullName || 'Your Store';
  const merchantName = user?.fullName || 'Merchant';

  // Construct Customer Storefront URL
  const getStorefrontUrl = () => {
    const slugOrId = currentStore?.slug || currentStore?._id || currentStore?.id || '';
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return `http://localhost:3000/stores/${slugOrId}`;
      }
      return `${window.location.protocol}//${host.replace(/^(seller|partner|merchant)\./, 'www.')}/stores/${slugOrId}`;
    }
    return `https://${branding.domain || 'localhost:3000'}/stores/${slugOrId}`;
  };

  const storefrontUrl = getStorefrontUrl();

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(storefrontUrl);
      setCopied(true);
      markStepDone('share_link');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const guideSteps = [
    {
      id: 'add_product',
      title: 'Add Your First Product to Catalog',
      badge: 'Step 1 • Essential',
      description: 'Upload your items with photos, barcode, price, and stock levels so nearby customers can discover and buy.',
      icon: Package,
      actionLabel: 'Launch Product Wizard',
      onAction: () => {
        markStepDone('add_product');
        onClose();
        useCatalogStore.getState().setWizardStep(1);
        useCatalogStore.getState().resetDraftProduct();
        useCatalogStore.getState().setActiveView('wizard');
        onNavigate('catalog');
      },
      secondaryLabel: 'Browse Catalog',
      onSecondary: () => {
        markStepDone('add_product');
        onClose();
        useCatalogStore.getState().setActiveView('list');
        onNavigate('catalog');
      },
    },
    {
      id: 'pos_billing',
      title: 'Test Counter POS & Instant Receipts',
      badge: 'Step 2 • In-Store Retail',
      description: 'Experience high-speed walk-in retail billing with instant barcode scanning, custom discounts, and thermal printing.',
      icon: Receipt,
      actionLabel: 'Open Counter POS',
      onAction: () => {
        markStepDone('pos_billing');
        onClose();
        onNavigate('billing');
      },
    },
    {
      id: 'store_profile',
      title: 'Verify Weekly Hours & 4 km Radius',
      badge: 'Step 3 • Discovery',
      description: 'Review your store address, open days, daily timings, and delivery radius to ensure seamless hyperlocal dispatch.',
      icon: MapPin,
      actionLabel: 'Review Store Profile',
      onAction: () => {
        markStepDone('store_profile');
        onClose();
        onNavigate('store');
      },
    },
    {
      id: 'share_link',
      title: 'Share Your Storefront Link & QR',
      badge: 'Step 4 • Customer Reach',
      description: 'Share your direct customer web ordering link on WhatsApp, social media, or print a counter standee.',
      icon: Share2,
      actionLabel: copied ? 'Link Copied! ✓' : 'Copy Storefront Link',
      onAction: handleCopyLink,
      secondaryLabel: 'Visit Live Store ↗',
      onSecondary: () => {
        markStepDone('share_link');
        window.open(storefrontUrl, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  const totalSteps = guideSteps.length;
  const completedCount = guideSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle decorative glow in header */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/70 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 relative z-10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0038ed] text-[11px] font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 fill-blue-500 text-blue-600 animate-pulse" />
                <span>WELCOME TO {branding.appName.toUpperCase()} STORE OS</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Welcome aboard, {merchantName}! 🎉
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                <span className="font-semibold text-slate-900">"{storeName}"</span> is officially active. Follow this short quick-start guide to begin taking orders today.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100/80">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-[#0038ed]" />
                <span>Quick Start Progress</span>
              </span>
              <span className="text-[#0038ed] font-extrabold">
                {completedCount} of {totalSteps} Completed ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0038ed] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Guide Cards */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 min-h-0 flex-1 relative z-10 scrollbar-thin">
          {guideSteps.map((step, idx) => {
            const isDone = Boolean(completedSteps[step.id]);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-white hover:bg-slate-50/70 border-slate-200/80 hover:border-blue-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Step Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-[#0038ed] transition-colors cursor-pointer shrink-0"
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                    )}
                  </button>

                  {/* Icon & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold text-[#0038ed] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">
                        {step.badge}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Completed ✓
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm font-bold leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Actions Row */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100/80">
                      <button
                        type="button"
                        onClick={step.onAction}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                          step.id === 'share_link' && copied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0038ed] hover:bg-blue-700 text-white shadow-blue-600/20'
                        }`}
                      >
                        {step.id === 'share_link' ? (
                          copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                        <span>{step.actionLabel}</span>
                      </button>

                      {step.secondaryLabel && step.onSecondary && (
                        <button
                          type="button"
                          onClick={step.onSecondary}
                          className="px-3 py-1.5 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{step.secondaryLabel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">24x7 Hyperlocal Support &amp; Active Dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-slate-900/15 flex items-center gap-1.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Floating Launcher Widget (renders at bottom right of dashboard to allow reopening guide anytime)
interface WelcomeGuideLauncherProps {
  onOpen: () => void;
}

export const WelcomeGuideLauncher: React.FC<WelcomeGuideLauncherProps> = ({ onOpen }) => {
  const [completedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('merchant_guide_completed_steps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const totalSteps = 4;
  const completedCount = ['add_product', 'pos_billing', 'store_profile', 'share_link'].filter(
    (id) => completedSteps[id]
  ).length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white border border-blue-200 hover:border-blue-400 text-slate-800 shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 transition-all duration-200 cursor-pointer active:scale-95 animate-in fade-in"
      title="Open Quick Start Guide"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white flex items-center justify-center text-xs font-extrabold shadow-md shadow-blue-600/30">
        <Rocket className="w-3.5 h-3.5" />
      </div>

      <div className="text-left hidden sm:block pr-1">
        <div className="text-[11px] font-extrabold text-[#0038ed] leading-none flex items-center gap-1">
          <span>Quick Start Guide</span>
          <span className="text-[9px] bg-blue-100 text-[#0038ed] px-1.5 py-0.2 rounded-full font-black">
            {completedCount}/{totalSteps}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
          {completedCount === totalSteps ? 'All set up!' : 'Finish store setup'}
        </span>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
};

