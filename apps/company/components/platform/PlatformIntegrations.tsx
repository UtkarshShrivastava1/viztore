"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Truck,
  Calculator,
  MessageCircle,
  Smartphone,
  Mail,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const integrations = [
  { icon: CreditCard, label: "Payment" },
  { icon: FileText, label: "GST" },
  { icon: Truck, label: "Shipping" },
  { icon: Calculator, label: "Accounting" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Smartphone, label: "SMS" },
  { icon: Mail, label: "Email" },
];

export default function PlatformIntegrations() {
  return (
    <section className="bg-viz-bg-2 py-24 sm:py-28  lg:py-14">
      <div className="container-viz">
        <SectionHeading
          eyebrow=""
          title="Works with Your Favorite Tools."
        />

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {integrations.map((tool, i) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-2xl border border-viz-border bg-white px-6 py-4 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-viz-primary/10 text-viz-primary">
                <tool.icon size={18} />
              </span>
              <span className="text-sm font-medium text-viz-heading">
                {tool.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
