"use client";

import {
  Globe, // For "Beyond Retail Software"
  MapPinned,
  Layers, // For "One Platform, Multiple Channels"
  Rocket, // For "Built for Modern Retail"
  TrendingUp,
  Link, // For "Everything Connected"
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import { branding } from "@repo/shared-types/branding.config";

const reasons = [
  {
    icon: Globe,
    title: "Beyond Retail Software",
    description: "Manage your business while making your store digitally discoverable.",
  },
  {
    icon: MapPinned,
    title: "Built for Local Commerce",
    description: "Connect with nearby customers actively searching for your products.",
  },
  {
    icon: Layers,
    title: "One Platform, Multiple Channels",
    description: "Manage walk-in sales, online discovery, pickup, and local delivery from one place.",
  },
  {
    icon: Rocket,
    title: "Built for Modern Retail",
    description: "Modern tools designed to simplify operations and accelerate business growth.",
  },
  {
    icon: TrendingUp,
    title: "Turn Visibility Into Growth",
    description: "Get discovered by more customers and convert searches into sales.",
  },
  {
    icon: Link,
    title: "Everything Connected",
    description: "Products, inventory, billing, customers, orders, and analytics—working together seamlessly.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-24 sm:py-28 lg:py-16">
      <div className="container-viz">
        <SectionHeading
          eyebrow=""
          title={`Why ${branding.appName} is the Future of Local Retail?`}
          description={`Discover how ${branding.appName} empowers local businesses to thrive in the digital age.`}
        />

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <FeatureCard
              key={reason.title}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
