"use client";

import React from "react";
import Link from 'next/link';
/**
 * Slim "Stores Near You" banner.
 *
 * This component uses a rounded, friendly display font ("Poppins") to match
 * the reference design. Load it once in your root layout, e.g.:
 *
 *   import { Poppins } from "next/font/google";
 *   const poppins = Poppins({ subsets: ["latin"], weight: ["500","600","700","800"] });
 *   // then add poppins.className to <body> or wrap this section in it.
 *
 * Requires Tailwind + DaisyUI configured in the host project.
 */

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const CommunityIcon = ({ className = "h-9 w-9" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="9.5" r="1.3" fill="currentColor" />
    <path d="M9 13c.7.8 1.8 1.2 3 1.2s2.3-.4 3-1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="4.5" cy="13.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="19.5" cy="13.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const TruckIcon = ({ className = "h-9 w-9" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6.5h9v9h-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M11.5 9.8h3.6l2.9 2.6v3.1h-6.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="6.5" cy="17.3" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="15.5" cy="17.3" r="1.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ShieldCheckIcon = ({ className = "h-9 w-9" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3 4.5 5.5v5.4c0 5 3.3 8.4 7.5 10.1 4.2-1.7 7.5-5.1 7.5-10.1V5.5L12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 12.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features: FeatureItem[] = [
  { icon: <CommunityIcon />, title: "Support Local Businesses", subtitle: "Stronger communities" },
  { icon: <TruckIcon />, title: "Same Day Pickup", subtitle: "Convenient & Fast" },
  { icon: <ShieldCheckIcon />, title: "Trusted Stores", subtitle: "Verified & Reliable" },
];

export interface StoresNearYouHeroProps {
  city?: string;
  state?: string;
}

export default function StoresNearYouHero({
  city = "Your City",
  state = "India",
}: StoresNearYouHeroProps) {
  return (
    <section className="w-full bg-white font-sans">
      <div className="flex w-full flex-col md:flex-row md:items-stretch">
        {/* Left: breadcrumb + heading */}
        <div className="flex shrink-0 flex-col justify-center gap-2 bg-white px-8 py-7 md:w-[36%] md:py-0">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Stores <span className="text-[#1668F6]">Near You</span></span>
        </div>

          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#0E1442] sm:text-[36px]">
            Stores Near You
          </h1>

          <p className="text-[17px] font-semibold text-[#1E2A5E]">
            Discover trusted local stores around you.
          </p>
          <p className="text-[17px] text-[#8891B5]">
            Shop from nearby stores and support your local community.
          </p>
        </div>

        {/* Middle: map with pin */}
        <div className="relative min-h-[170px] flex-1 overflow-hidden">
          <MapBackground />

          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <div className="drop-shadow-md">
              <svg viewBox="0 0 24 30" className="h-11 w-11 text-[#2554FF]" fill="currentColor">
                <path d="M12 29S1 18 1 11.5A11 11 0 0 1 23 11.5C23 18 12 29 12 29Z" />
                <circle cx="12" cy="11" r="4.2" fill="white" />
              </svg>
            </div>

            <div className="rounded-2xl bg-white px-5 py-3 shadow-lg">
              <p className="text-[13px] font-medium text-[#2F6BFF]">Near you</p>
              <p className="text-[15px] font-bold text-[#1D3FE0]">
                {city}, {state}
              </p>
            </div>
          </div>
        </div>

        {/* Right: trust badges */}
        <div className="flex shrink-0 flex-col justify-center gap-5 bg-[#EEF2FC] px-8 py-7 md:w-[26%] md:py-0">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <span className="shrink-0 text-[#2554FF]">{feature.icon}</span>
              <div className="leading-tight">
                <p className="text-[15px] font-bold text-[#0E1442]">{feature.title}</p>
                <p className="text-[13px] text-[#7C89B8]">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Feathered watercolor-style map: dense streets, a river, and two park patches. */
function MapBackground() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 700 220"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapFade" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#D6E6FB" stopOpacity="1" />
            <stop offset="70%" stopColor="#E7F0FC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="700" height="220" fill="url(#mapFade)" />

        <g stroke="#FFFFFF" strokeWidth="2.2" opacity="0.85">
          <path d="M0 20 L700 35" />
          <path d="M0 55 L700 45" />
          <path d="M0 85 L700 100" />
          <path d="M0 120 L700 108" />
          <path d="M0 150 L700 165" />
          <path d="M0 185 L700 175" />
          <path d="M40 0 L60 220" />
          <path d="M120 0 L100 220" />
          <path d="M200 0 L230 220" />
          <path d="M300 0 L280 220" />
          <path d="M400 0 L430 220" />
          <path d="M500 0 L470 220" />
          <path d="M580 0 L610 220" />
          <path d="M650 0 L630 220" />
        </g>

        <path
          d="M-10 160 C 120 120, 220 190, 340 140 S 560 90, 710 130"
          stroke="#C7DCF7"
          strokeWidth="10"
          fill="none"
          opacity="0.7"
        />

        <ellipse cx="120" cy="60" rx="46" ry="26" fill="#D9EFDC" opacity="0.9" />
        <ellipse cx="600" cy="170" rx="38" ry="22" fill="#D9EFDC" opacity="0.85" />
      </svg>
    </div>
  );
}
