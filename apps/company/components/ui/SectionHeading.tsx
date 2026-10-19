"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  subheading?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  subheading,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative max-w-3xl  ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {/* Decorative glow behind the heading */}
      <div
        className={`pointer-events-none absolute -z-10 h-32 w-32 rounded-full blur-3xl ${
          light ? "bg-viz-accent/20" : "bg-viz-primary/10"
        } ${align === "center" ? "left-1/2 top-0 -translate-x-1/2" : "left-0 top-0"}`}
      />

      {eyebrow && (
        <span className="section-eyebrow relative inline-flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              light ? "bg-viz-accent" : "bg-viz-primary"
            }`}
          />
          {eyebrow}
        </span>
      )}

      <h2 className={`section-heading relative ${light ? "text-white" : ""}`}>
        {title}
        {/* Small accent ring beside/under the title */}
        {/* <span // Adjusted size to h-1.5 w-1.5 to make the decorative circle smaller, resembling a full stop.
          className={`-ml-1 inline-block h-1.5 w-1.5 rounded-full align-sub ${
            light ? "bg-viz-accent" : "bg-viz-primary"
          }`} 
        /> */}
      </h2>

      {description && (
        <p // Increased margin-top from mt-4 to mt-6 for better spacing from the title.
          className={`lg:text-[0.9rem] relative mt-6 text-base sm:text-lg ${
            light ? "text-slate-300" : "text-viz-paragraph"
          }`}
        >
          {description}
        </p>
      )}


      {subheading && (
        <span className="section-eyebrow relative inline-flex items-center gap-2 mt-10">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              light ? "bg-viz-accent" : "bg-viz-primary"
            }`}
          />
          {subheading}
        </span>
      )}
    </motion.div>
  );
}