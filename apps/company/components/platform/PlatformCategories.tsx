"use client";

import {
  Shirt,
  Footprints,
  Cpu,
  Gem,
  Sparkles,
  Sofa,
  Dumbbell,
  Gift,
  Armchair,
  BookOpen,
  PawPrint,
  MoreHorizontal,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";

const categories = [
  { icon: Shirt, label: "Fashion" },
  { icon: Footprints, label: "Footwear" },
  { icon: Cpu, label: "Electronics" },
  { icon: Gem, label: "Jewellery" },
  { icon: Sparkles, label: "Beauty" },
  { icon: Sofa, label: "Home & Living" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Gift, label: "Gifts" },
  { icon: Armchair, label: "Furniture" },
  { icon: BookOpen, label: "Books" },
  { icon: PawPrint, label: "Pet" },
  { icon: MoreHorizontal, label: "More" },
];

export default function PlatformCategories() {
  return (
    <section className="py-24 sm:py-28  lg:py-14">
      <div className="container-viz">
        <SectionHeading eyebrow="" title="Designed for Every Retail Business." />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
