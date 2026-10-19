"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TimelineCardProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
  index?: number;
}

export default function TimelineCard({
  icon: Icon,
  step,
  title,
  description,
  isLast = false,
  index = 0,
}: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex flex-1 flex-col items-center text-center"
    >
      {!isLast && (
        <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-viz-primary/40 to-viz-border md:block" />
      )}
      <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-viz-border bg-white shadow-md">
        <Icon size={26} className="text-viz-primary" strokeWidth={2} />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-viz-accent text-xs font-bold text-viz-navy">
          {step}
        </span>
      </div>
      {/* Tooltip container */}
      <div className="tooltip tooltip-bottom tooltip-secondary text-white" data-tip={description}>
        <h3 className="mb-2 text-base font-semibold text-viz-heading">{title}</h3>
      </div>
    </motion.div>
  );
}
