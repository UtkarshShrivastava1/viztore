"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

export default function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-[#00173d] pt-28 pb-16 lg:pt-22 lg:pb-10">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-12 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="container-viz relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Badge, Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start lg:col-span-7 xl:col-span-7"
          >
            {/* Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Careers at {branding.appName}
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Build the Future of{" "}
              <span className="block text-[#FBBF24]">Local Commerce.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-100/80 sm:text-lg lg:text-xl font-normal">
              Join a team that&apos;s helping local retailers go digital and
              making shopping in every city more visible, accessible and
              connected.
            </p>

            {/* Quick Metrics / Tagline */}
            <div className="mt-8 flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs sm:text-sm text-blue-200/70">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span>4 Open Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                <span>Bhilai &bull; Raipur &bull; Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Fast-Growing Tech Startup</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Graphic / We're Hiring Office Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="flex justify-center lg:col-span-5 xl:col-span-5"
          >
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600/30 to-amber-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

              {/* Image Frame with Glass Effect */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-white/5 p-2 backdrop-blur-xl shadow-2xl shadow-black/40">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src="/images/career_hero_hiring.jpg"
                    alt={`${branding.appName} is hiring - Office desk with We're Hiring sign`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Dark Gradient Overlay at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00173d]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
