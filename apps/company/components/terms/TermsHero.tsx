"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

export default function TermsHero() {
  return (
    <section className="relative overflow-hidden bg-[#00173d] pt-28 pb-14 lg:pt-32 lg:pb-16">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-36 top-10 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="container-viz relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start max-w-3xl"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold tracking-wider text-amber-300 uppercase backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            LEGAL
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Terms &amp; Conditions
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-blue-100/80 leading-relaxed font-normal">
            The terms that guide your use of {branding.appName}.
          </p>

          {/* Last Updated */}
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-200/60 font-medium">
            <Calendar className="h-3.5 w-3.5 text-amber-400/80" />
            <span>Last updated: 15 October 2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
