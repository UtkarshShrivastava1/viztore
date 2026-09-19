"use client";

import React from "react";

/**
 * Home page promo hero banner.
 *
 * Note on product imagery: the reference design shows a real product photo
 * (a shoe with a visible Nike swoosh). That's a trademarked logo + licensed
 * photography, so it isn't reproduced here. Instead this component takes an
 * optional `productImageSrc` (point it at your own product photography /
 * merchant-supplied images) and falls back to a plain, non-branded line-art
 * placeholder so the banner still renders sensibly without real assets.
 *
 * Uses the cursive "Caveat" font for the script line — load it once, e.g. in
 * your root layout:
 *
 *   import { Caveat } from "next/font/google";
 *   const caveat = Caveat({ subsets: ["latin"], weight: ["600","700"] });
 *   // apply caveat.className to the element, or expose it as a CSS variable
 *
 * Requires Tailwind + DaisyUI configured in the host project.
 */

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const TruckIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6.5h9v8h-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M11.5 9.6h3.4l2.8 2.5v2.4h-6.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M2.5 8.3 6 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="6.3" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="15" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const ReturnsIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path d="M17.2 3.8v3.2h-3.2M6.8 20.2V17h3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);

const SecureIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3 4.8 5.4v5.3c0 4.9 3.2 8.2 7.2 9.9 4-1.7 7.2-5 7.2-9.9V5.4L12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="1.8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SupportIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="3" y="13" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <rect x="17" y="13" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M19 18v1a3 3 0 0 1-3 3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const defaultFeatures: FeatureItem[] = [
  { icon: <TruckIcon />, title: "Fast Delivery", subtitle: "On orders above \u20b9199" },
  { icon: <ReturnsIcon />, title: "Easy Returns", subtitle: "7 days return policy" },
  { icon: <SecureIcon />, title: "Secure Payments", subtitle: "100% secure payments" },
  { icon: <SupportIcon />, title: "Support", subtitle: "24x7 assistance" },
];

export interface HomeHeroBannerProps {
  tag?: string;
  discountPrefix?: string;
  discountValue?: string;
  description?: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  scriptLineTop?: string;
  scriptLineBottom?: string;
  productImageSrc?: string;
  productImageAlt?: string;
  features?: FeatureItem[];
  dotsCount?: number;
  activeDot?: number;
}

export default function HomeHeroBanner({
  tag = "BIG DEALS",
  discountPrefix = "UP TO",
  discountValue = "50% OFF",
  description = ["On top products from", "local stores near you"],
  ctaLabel = "Shop Now",
  onCtaClick,
  scriptLineTop = "Local Stores",
  scriptLineBottom = "Bigger Possibilities",
  productImageSrc,
  productImageAlt = "Featured products",
  features = defaultFeatures,
  dotsCount = 5,
  activeDot = 0,
}: HomeHeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#DCEBFD] via-[#CFE3FC] to-[#A9C9F7] font-sans">
      <RaysBackground />

      <div className="relative flex w-full flex-col md:flex-row md:items-stretch">
        {/* Left: copy */}
        <div className="flex shrink-0 flex-col justify-center gap-4 px-8 py-10 md:w-[30%] md:py-12">
          <span className="w-fit rounded-full bg-white px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#3B39E4] shadow-sm">
            {tag}
          </span>

          <div>
            <p className="text-lg font-extrabold tracking-wide text-[#0E1442]">{discountPrefix}</p>
            <p className="text-[56px] font-extrabold leading-none tracking-tight text-[#0E1442] drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]">
              {discountValue}
            </p>
          </div>

          <p className="text-lg font-semibold leading-snug text-[#1E2A5E]">
            {description.map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="flex w-fit items-center gap-2 rounded-full bg-[#101235] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1B1E4A]"
          >
            {ctaLabel}
            <span aria-hidden>&rarr;</span>
          </button>
        </div>

        {/* Middle: podium + product image + script text */}
        <div className="relative flex min-h-[220px] flex-1 items-end justify-center pb-10 pt-6">
          <Podium />

          <div className="relative z-10 mb-1.5 h-[130px] w-[280px]">
            {productImageSrc ? (
              <img
                src={productImageSrc}
                alt={productImageAlt}
                className="h-full w-full object-contain drop-shadow-xl"
              />
            ) : (
              <PlaceholderProducts />
            )}
          </div>

          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 -rotate-6 text-right text-[#2540FF] sm:block">
            <p className="font-[cursive] text-2xl leading-tight">{scriptLineTop}</p>
            <p className="font-[cursive] text-2xl leading-tight">{scriptLineBottom}</p>
            <svg viewBox="0 0 120 12" className="ml-auto mt-1 h-3 w-28 text-[#2540FF]">
              <path d="M2 8 C 30 2, 70 2, 118 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute bottom-3 left-1/3 flex items-center gap-1.5">
            {Array.from({ length: dotsCount }).map((_, i) =>
              i === activeDot ? (
                <span key={i} className="h-2 w-6 rounded-full bg-[#2554FF]" />
              ) : (
                <span key={i} className="h-2 w-2 rounded-full bg-[#B9C6EC]" />
              )
            )}
          </div>
        </div>

        {/* Right: feature card */}
        <div className="relative z-10 flex shrink-0 flex-col justify-center gap-0 rounded-l-3xl bg-white/70 px-8 py-8 shadow-[0_8px_30px_rgba(20,40,120,0.08)] backdrop-blur-sm md:w-[26%] md:py-6">
          {features.map((feature, i) => (
            <div key={feature.title}>
              <div className="flex items-center gap-4 py-3">
                <span className="shrink-0 text-[#2554FF]">{feature.icon}</span>
                <div className="leading-tight">
                  <p className="text-[15px] font-bold text-[#12172E]">{feature.title}</p>
                  <p className="text-[13px] text-[#6B7A99]">{feature.subtitle}</p>
                </div>
              </div>
              {i < features.length - 1 && <div className="h-px w-full bg-[#E2E8F5]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Radiating light rays behind the product podium. */
function RaysBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        background:
          "radial-gradient(circle at 52% 65%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 22%, rgba(255,255,255,0) 55%), conic-gradient(from 0deg at 52% 70%, rgba(255,255,255,0.25) 0deg, rgba(255,255,255,0) 12deg, rgba(255,255,255,0.25) 24deg, rgba(255,255,255,0) 36deg, rgba(255,255,255,0.25) 48deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,0.25) 72deg, rgba(255,255,255,0) 84deg, rgba(255,255,255,0.25) 96deg, rgba(255,255,255,0) 108deg, rgba(255,255,255,0.25) 120deg, rgba(255,255,255,0) 132deg, rgba(255,255,255,0.25) 144deg, rgba(255,255,255,0) 156deg, rgba(255,255,255,0.25) 168deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0.25) 192deg, rgba(255,255,255,0) 204deg, rgba(255,255,255,0.25) 216deg, rgba(255,255,255,0) 228deg, rgba(255,255,255,0.25) 240deg, rgba(255,255,255,0) 252deg, rgba(255,255,255,0.25) 264deg, rgba(255,255,255,0) 276deg, rgba(255,255,255,0.25) 288deg, rgba(255,255,255,0) 300deg, rgba(255,255,255,0.25) 312deg, rgba(255,255,255,0) 324deg, rgba(255,255,255,0.25) 336deg, rgba(255,255,255,0) 348deg, rgba(255,255,255,0.25) 360deg)",
      }}
    />
  );
}

/** Glowing 3D podium the product sits on. */
function Podium() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div className="h-6 w-64 rounded-[50%] bg-gradient-to-b from-[#5C8DF0] to-[#2554FF] shadow-[0_25px_45px_-10px_rgba(37,84,255,0.65)]" />
      <div className="mx-auto -mt-2 h-3 w-56 rounded-[50%] bg-[#3E6EF0] opacity-80" />
    </div>
  );
}

/** Generic, non-branded placeholder product slots (swap via productImageSrc). */
function PlaceholderProducts() {
  return (
    <div className="flex h-full w-full items-end justify-center gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex h-24 w-20 items-center justify-center rounded-2xl border border-white/70 bg-white/40 shadow-md backdrop-blur-sm"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#1D3FE0]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 8V6a5 5 0 0 1 10 0v2M4.5 8h15l-1 12h-13z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
