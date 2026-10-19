"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  index?: number;
}

export default function CategoryCard({
  icon: Icon,
  label,
  index = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="flex cursor-default flex-col items-center gap-3 rounded-2xl border border-viz-border bg-viz-bg-2 px-4 py-7 text-center transition-shadow duration-300 hover:border-viz-primary/30 hover:bg-white hover:shadow-xl"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-viz-primary/10 text-viz-primary">
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-sm font-medium text-viz-heading">{label}</span>
    </motion.div>
  );
}
