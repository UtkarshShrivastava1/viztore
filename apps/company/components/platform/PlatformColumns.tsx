"use client";

import { Store, ShoppingBag, Globe, Rocket } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ColumnList from "@/components/ui/ColumnList";

const columns = [
  {
    icon: Store,
    title: "Retail Operations",
    subtitle: "Run your store with confidence.",
    items: [
      "Product Management",
      "Inventory",
      "Billing & GST",
      "Customer Management",
      "Orders",
      "Reports",
      "Multi Store",
      "Staff Management",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Customer Experience",
    subtitle: "Make local shopping effortless.",
    items: [
      "Product Search",
      "Nearby Discovery",
      "Product Comparison",
      "Live Availability",
      "Wishlist",
      "Reserve Product",
      "Pickup",
      "Delivery",
    ],
  },
  {
    icon: Globe,
    title: "Commerce Network",
    subtitle: "Connect beyond your storefront.",
    items: [
      "Local Search",
      "Global Search",
      "Supplier Network",
      "QR Storefront",
      "Digital Catalog",
      "Store Profile",
      "Discovery Engine",
      "Commerce APIs",
    ],
  },
  {
    icon: Rocket,
    title: "Business Growth",
    subtitle: "Grow beyond daily operations.",
    items: [
      "Analytics",
      "Marketing Campaigns",
      "Loyalty",
      "Offers",
      "Customer Insights",
      "AI Catalog",
      "Image Enhancement",
      "Reports",
    ],
  },
];

export default function PlatformColumns() {
  return (
    <section className="bg-viz-bg-2 py-24 sm:py-28 lg:py-14">
      <div className="container-viz">
        <SectionHeading eyebrow="" title="Built for Every Part of Retail." />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, i) => (
            <ColumnList
              key={col.title}
              icon={col.icon}
              title={col.title}
              subtitle={col.subtitle}
              items={col.items}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
