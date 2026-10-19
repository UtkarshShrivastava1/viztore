"use client";

import { motion } from "framer-motion";
import { Store, Globe, Rocket } from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

const heroBenefits = [
  {
    icon: Store,
    title: "Built for Local Businesses",
    description:
      "Designed specifically for independent retailers and growing brands.",
  },
  {
    icon: Globe,
    title: "Made for India",
    description:
      "Built to solve the real challenges of India's retail ecosystem.",
  },
  {
    icon: Rocket,
    title: "Future Ready",
    description:
      "Creating the technology powering the next generation of local commerce.",
  },
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#00173d] pt-28 pb-16 lg:pt-15 lg:pb-15 ">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-36 top-10 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="container-viz relative z-10 ">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Badge, Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start lg:col-span-6 xl:col-span-6"
          >
            {/* Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Contact Us
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[52px] sm:leading-[1.12]">
              Let&apos;s Talk
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-[34px] font-bold text-white">
                We&apos;re here to help{" "}
                <span className="text-[#FBBF24]">your store grow.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100/80 sm:text-lg font-normal">
              Have a question about {branding.appName}? Connect with our team for
              assistance, product enquiries, retailer onboarding or any other
              support.
            </p>
          </motion.div>

          {/* Right Column: 3 Feature Glass Cards matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col gap-4 lg:col-span-6 xl:col-span-6"
          >
            {/* Top Row: 2 Cards Side-by-Side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {heroBenefits.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3.5 text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300/80">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: 3rd Card Centered */}
            <div className="flex justify-center">
              {heroBenefits.slice(2, 3).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="w-full sm:w-[calc(50%-0.5rem)] group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3.5 text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300/80">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
