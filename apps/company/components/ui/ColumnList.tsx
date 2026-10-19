"use client";

import { motion } from "framer-motion";
import { Check, LucideIcon } from "lucide-react";

interface ColumnListProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  items: string[];
  index?: number;
}

export default function ColumnList({
  icon: Icon,
  title,
  subtitle,
  items,
  index = 0,
}: ColumnListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-3xl border border-viz-border bg-white p-7 shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-viz-primary" />}
        <h3 className="text-base font-semibold text-viz-heading">{title}</h3>
      </div>
      {subtitle && (
        <p className="mb-5 text-sm text-viz-paragraph">{subtitle}</p>
      )}
      <ul className={`space-y-3 ${!subtitle ? "mt-5" : ""}`}>
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-viz-paragraph">
            <Check size={15} className="shrink-0 text-viz-primary" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
