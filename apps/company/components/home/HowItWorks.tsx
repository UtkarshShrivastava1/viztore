"use client";

import { Store, PackagePlus, ScanLine, Rocket, LineChart, MapPinned, Search, Eye, Scale, ShoppingBag, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import { branding } from "@repo/shared-types/branding.config";

const retailerSteps = [
  {
    icon: Store,
    title: "Digitize Your Store",
    description: "Set up your digital storefront and bring your business online.",
  },
  {
    icon: PackagePlus,
    title: "Manage Inventory & Billing", 
    description: "Streamline operations with easy inventory management and integrated billing.",
  },
  {
    icon: ScanLine,
    title: "Publish Real-Time Inventory",
    description: "Make your products discoverable to nearby customers with live availability.", 
  },
  {
    icon: MapPinned,
    title: "Reach Nearby Customers",
    description: "Connect with local shoppers actively searching for your products.", 
  },
  {
    icon: Rocket,
    title: "Manage Orders & Delivery",
    description: "Handle online orders, pickups, and local deliveries efficiently.",
  },
  {
    icon: LineChart,
    title: "Grow Your Business",
    description: "Leverage insights and tools to accelerate your store's growth.",
  },
];

const customerSteps = [
  {
    icon: Search,
    title: "Search Products",
    description: "Find exactly what you need without visiting multiple shops.",
  },
  {
    icon: MapPinned,
    title: "Discover Nearby Stores",
    description: "Instantly see which local stores have the product you're looking for.",
  },
  {
    icon: Eye,
    title: "View Live Availability",
    description: "Check stock before leaving home and avoid wasted trips.",
  },
  {
    icon: Scale,
    title: "Compare Nearby Options",
    description: "Compare stores by price, distance, and ratings.",
  },
  {
    icon: ShoppingBag,
    title: "Reserve, Pickup or Delivery",
    description: "Secure products before visiting or get them delivered to your door.",
  },
  {
    icon: ShieldCheck,
    title: "Buy Locally with Confidence",
    description: "Support local businesses and enjoy a seamless shopping experience.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-viz-bg-2 py-24 sm:py-28 lg:py-10   ">
      <div className="container-viz"> 
        <SectionHeading
          eyebrow=""
          title={`How ${branding.appName} Works?`}
          description="Empowering retailers with smarter operations while helping customers discover and shop locally—all through one connected platform."
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* For Retailers */}
          <div className="rounded-3xl border border-viz-border p-4">
            <h3 className="mb-8 text-2xl font-extrabold text-viz-heading">For Retailers</h3>
            <div className="flex flex-col gap-2 ">
              {retailerSteps.map((step, i) => (
                <FeatureCard
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* For Customers */}
          <div className="rounded-3xl border border-viz-border p-4">
            <h3 className="mb-8 text-2xl font-extrabold text-viz-heading">For Customers</h3>
            <div className="flex flex-col gap-2">
              {customerSteps.map((step, i) => (
                <FeatureCard
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
