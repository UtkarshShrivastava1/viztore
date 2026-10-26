import React from 'react';
import {
  Shirt,
  Store,
  LayoutGrid,
  Percent,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  Zap,
} from 'lucide-react';
import { AdType } from '../../stores/marketingStore.js';

interface Step1AdTypeSelectProps {
  selectedType: AdType;
  onSelectType: (type: AdType) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const Step1AdTypeSelect: React.FC<Step1AdTypeSelectProps> = ({
  selectedType,
  onSelectType,
  onNext,
  onCancel,
}) => {
  const adTypes: {
    type: AdType;
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    benefit: string;
    placement: string;
    color: string;
  }[] = [
    {
      type: 'Sponsored Product',
      icon: <Shirt className="w-5 h-5 text-blue-600" />,
      title: 'Sponsored Product',
      description: 'Promote a specific product to appear at the top of category & search results.',
      badge: 'Most Popular',
      benefit: 'Get 3x more product views and instant sales boost',
      placement: 'Search results, product pages, home recommendations',
      color: 'blue',
    },
    {
      type: 'Sponsored Store',
      icon: <Store className="w-5 h-5 text-purple-600" />,
      title: 'Store Spotlight',
      description: 'Increase overall footfall and storefront visibility for your brand.',
      badge: 'Brand Builder',
      benefit: 'Showcase your entire store catalog to local shoppers',
      placement: 'Store listing directory, top banner rail, nearby shops',
      color: 'purple',
    },
    {
      type: 'Category Promotion',
      icon: <LayoutGrid className="w-5 h-5 text-emerald-600" />,
      title: 'Category Spotlight',
      description: 'Feature your listings at the pinnacle of relevant product categories.',
      badge: 'High Conversion',
      benefit: 'Target active shoppers exploring your exact category',
      placement: 'Category header banners & prominent top grid cards',
      color: 'emerald',
    },
    {
      type: 'Best Deals Promotion',
      icon: <Percent className="w-5 h-5 text-rose-600" />,
      title: 'Best Deals & Offers',
      description: 'Promote discount sales and limited-time bargains to value shoppers.',
      badge: 'Quick Clearance',
      benefit: 'Attract bargain hunters with eye-catching offer stickers',
      placement: 'Deals of the day section, flash sale carousel',
      color: 'rose',
    },
    {
      type: 'Banner Ad',
      icon: <ImageIcon className="w-5 h-5 text-indigo-600" />,
      title: 'Banner Advertisement',
      description: 'Display customized full-width banners highlighting your contact & deals.',
      badge: 'Maximum Reach',
      benefit: 'Build strong local brand awareness with hero visuals',
      placement: 'Homepage hero carousel, category banners, checkout splash',
      color: 'indigo',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          1. Select Advertisement Type
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose the campaign format that best fits your business objective.
        </p>
      </div>

      {/* 5 Selectable Ad Type Cards (12.2.png & 12.5.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {adTypes.map((item) => {
          const isSelected =
            selectedType === item.type ||
            (item.type === 'Banner Ad' && selectedType === 'Banner Advertisement') ||
            (item.type === 'Best Deals Promotion' && selectedType === 'Best Deals');

          return (
            <div
              key={item.title}
              onClick={() => onSelectType(item.type)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {item.description}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5 text-emerald-700 font-medium">
                    <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{item.benefit}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-500">
                    <Eye className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span className="line-clamp-1">{item.placement}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Where Your Ad Will Appear Interactive Banner (12.2.png) */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/60 rounded-2xl border border-blue-200/80 p-5 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              Where Your Ad Will Appear
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your ad will be dynamically served across high-intent storefront placements with live sponsored badges, guaranteed search priority, and smart keyword matching.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-700">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-3xs">
              ✓ Category Tops
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-3xs">
              ✓ Search Autocomplete
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-3xs">
              ✓ Cart Recommendation Rail
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
