"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { branding } from "@repo/shared-types/branding.config";

const retailerProblems = [
  {
    title: "Invisible to Nearby Customers",
    description: "Customers don't know your store has the products they need.",
  },
  {
    title: "Inventory Remains Undiscovered",
    description: "Products on your shelves never appear in online searches.",
  },
  {
    title: "Losing Sales to E-commerce",
    description: "Customers choose online platforms because local availability isn't visible.",
  },
  {
    title: "Dependent on Walk-in Customers",
    description: "Growth is limited without digital discovery and local reach.",
  },
  {
    title: "No Instant Buying Experience",
    description: "No reservation, pickup, or same-day local delivery options.",
  },
  {
    title: "Disconnected Retail Operations",
    description: "Managing inventory, orders, billing, and customers across different tools slows your business.",
  },
];

const customerProblems = [
  { title: "Don't Know Which Store Has the Product", description: "Finding nearby product availability is still difficult." },
  { title: "No Real-Time Inventory Visibility", description: "Customers can't check stock before leaving home." },
  { title: "Wasting Time Visiting Multiple Stores", description: "Shopping often becomes trial and error." },
  { title: "Waiting for Online Deliveries", description: "Products available nearby are often ordered online instead." },
  { title: "No Easy Reserve or Pickup Option", description: "Customers can't secure products before visiting a store." },
  { title: "Fragmented Local Shopping Experience", description: "Every store works independently with no unified discovery platform." },
];
const insight = {
  eyebrow: "",
  title: "The Missing Piece: Digital Discoverability",
  paragraphs: [
    "Every city already has the products people need.",
    " Local retail has inventory. Customers have demand.",
    "The missing piece is digital discoverability.",
    "Retailers deserve the same digital visibility as large e-commerce platforms.",
    `${branding.appName} connects local inventory with nearby customers through one unified commerce network.`,
    `${branding.appName} bridges that gap by making local retail searchable, discoverable, and instantly accessible.`,
  ],
};

export default function ProblemSection() {
  return (
    <section className="py-14 sm:py-28 lg:py-16">
      <div className="container-viz">

      <SectionHeading
        eyebrow=""
        title="The Challenges Facing Local Retailers and Customers"
        description={`Local retailers face challenges in reaching customers, while customers struggle to find products nearby. ${branding.appName} bridges this gap by making local retail searchable, discoverable, and instantly accessible.`}
        subheading="The Problem"
      />
      <div className="container-viz grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 mt-10"> {/* Increased margin-top from mt-5 to mt-10 for more separation from the heading. */}
        {/* Left - Retailer Problems */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-viz-border bg-viz-bg-2 p-8"
        >
          <h3 className="mb-6 text-xl font-extrabold text-viz-heading">
            For Retailers
          </h3>
          <ul className="space-y-5">
            {retailerProblems.map((problem) => (
              <li key={problem.title} className="flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                <span className="text-sm text-viz-paragraph">
                  <strong className="text-black">{problem.title}:</strong>{" "}
                  {problem.description}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Center - insight */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }} 
          className="flex flex-col items-start justify-center rounded-3xl bg-viz-navy p-8 text-left"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-viz-accent">
            {insight.eyebrow}
          </p>
          <h3 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {insight.title}
          </h3>
          <ul className="mt-6 space-y-5 text-sm leading-relaxed text-slate-300"> {/* Increased margin-top from mt-4 to mt-6 for better spacing from the insight title. */}
            {insight.paragraphs.map((paragraph, index) => (
              <li key={index} className="flex items-start gap-3">
                {/* Using CheckCircle2 to visually represent positive insights, similar to XCircle for problems */}
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-viz-accent" />
                <span>{paragraph}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right - Customer Problems */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-3xl border border-viz-border bg-viz-bg-2 p-8"
        >
          <h3 className="mb-6 text-xl font-extrabold text-viz-heading">
            For Customers
          </h3>
          <ul className="space-y-5">
            {customerProblems.map((problem) => (
              <li key={problem.title} className="flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                <span className="text-sm text-viz-paragraph">
                  <strong className="text-black">{problem.title}:</strong>{" "}
                  {problem.description}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
