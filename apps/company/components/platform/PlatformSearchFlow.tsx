"use client";

import { MapPin, Globe, Scale, BookMarked, Truck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FlowSteps from "@/components/ui/FlowSteps";

const searchFlow = [
  { icon: MapPin, label: "Local" },
  { icon: Globe, label: "Global" },
  { icon: Scale, label: "Compare" },
  { icon: BookMarked, label: "Reserve" },
  { icon: Truck, label: "Delivery" },
];

export default function PlatformSearchFlow() {
  return (
    <section className="bg-viz-navy py-24 sm:py-28 lg:py-13">
      <div className="container-viz">
        <SectionHeading
          eyebrow=""
          title="One Search. Endless Possibilities."
          light
        />
        <div className="mt-14">
          <FlowSteps steps={searchFlow} light />
        </div>
      </div>
    </section>
  );
}
