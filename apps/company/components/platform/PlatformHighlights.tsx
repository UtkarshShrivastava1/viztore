"use client";

import {
  Package,
  Search,
  Globe,
  Factory,
  Truck,
  Link2,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import { branding } from "@repo/shared-types/branding.config";

const highlights = [
  { icon: Package, title: "Retail Operations", description: "Manage your entire business from one dashboard." },
  { icon: Search, title: "Smart Discovery", description: "Help customers discover products nearby through intelligent search." },
  { icon: Globe, title: "Local + Global Search", description: `Find products nearby first, then expand across the ${branding.appName} network when needed.` },
  { icon: Factory, title: "Supplier Network", description: "Compare wholesalers, discover suppliers, and place bulk purchase orders." },
  { icon: Truck, title: "Hyperlocal Commerce", description: "Support reservation, pickup, and local delivery from one platform." },
  { icon: Link2, title: "Integrations", description: "Payments, GST, WhatsApp, Tally, SMS, Shipping Partners." },
  { icon: TrendingUp, title: "Growth Tools", description: "Analytics, campaigns, CRM, and customer retention." },
];

export default function PlatformHighlights() {
  return (
    <section className="py-24 sm:py-28 lg:py-12">
      <div className="container-viz">
        <SectionHeading eyebrow="" title="Everything Working Together." />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <FeatureCard
              key={h.title}
              icon={h.icon}
              title={h.title}
              description={h.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
