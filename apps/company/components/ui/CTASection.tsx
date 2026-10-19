"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { branding } from "@repo/shared-types/branding.config";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export default function CTASection({
  title = "Ready to take your store to the next level?",
  description = `Join hundreds of local retailers already getting discovered with ${branding.appName}.`,
  primaryLabel = "Join Waitlist",
  secondaryLabel = "Request Demo",
}: CTASectionProps) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-viz relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-viz-primary via-blue-700 to-viz-navy px-8 py-16 text-center sm:px-16 sm:py-20"
      >
        {/* Abstract shapes */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-viz-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute right-16 top-10 h-24 w-24 rotate-12 rounded-3xl border border-white/10" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-base text-blue-100 sm:text-lg">
            {description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="primary" className="!bg-viz-accent !text-viz-navy !shadow-amber-400/30 hover:!bg-amber-300">
              {primaryLabel}
            </Button>
            <Button variant="secondary-dark">{secondaryLabel}</Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
