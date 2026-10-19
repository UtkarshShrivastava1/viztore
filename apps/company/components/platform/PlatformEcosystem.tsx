"use client";

import { Factory, Store, Users, Truck, BarChart3, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FlowSteps from "@/components/ui/FlowSteps";

const ecosystem = [
  { icon: Factory, label: "Supplier" },
  { icon: Store, label: "Retailer" },
  { icon: Users, label: "Customer" },
  { icon: Truck, label: "Delivery" },
  { icon: BarChart3, label: "Analytics" },
  { icon: TrendingUp, label: "Growth" },
];

export default function PlatformEcosystem() {
  return (
    <section className="py-24 sm:py-28 lg:py-14">
      <div className="container-viz">
        <SectionHeading eyebrow="" title="Everything Connected." />
        <div className="mt-14">
          <FlowSteps steps={ecosystem} />
        </div>
      </div>
    </section>
  );
}
