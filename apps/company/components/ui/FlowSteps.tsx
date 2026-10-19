"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FlowStepsProps {
  steps: { icon: LucideIcon; label: string }[];
  light?: boolean;
}

export default function FlowSteps({ steps, light = false }: FlowStepsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-2">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex items-center gap-3 sm:gap-2"
        >
          <div
            className={`flex flex-col items-center gap-2 rounded-2xl border px-5 py-4 ${
              light
                ? "border-white/10 bg-white/5 backdrop-blur-sm"
                : "border-viz-border bg-white shadow-sm"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                light ? "bg-viz-accent/20 text-viz-accent" : "bg-viz-primary/10 text-viz-primary"
              }`}
            >
              <step.icon size={18} />
            </span>
            <span
              className={`text-xs font-semibold ${
                light ? "text-white" : "text-viz-heading"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight
              size={18}
              className={light ? "text-white/30" : "text-viz-border"}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
