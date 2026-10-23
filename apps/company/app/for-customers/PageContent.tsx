"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import TimelineCard from "@/components/ui/TimelineCard";
import CategoryCard from "@/components/ui/CategoryCard";
import CTASection from "@/components/ui/CTASection";
import { branding } from "@repo/shared-types/branding.config";
import {
  MapPin,
  Search,
  ShoppingBag,
  Heart,
  Wallet,
  ShieldCheck,
  Shirt,
  Footprints,
  Gem,
  Cpu,
  Home,
  Sparkles,
  Gift,
  Dumbbell,
  Globe2,
  Scale,
  PackageCheck,

  Zap,
} from "lucide-react";
import PageHero ,{type Benefit} from "@/components/ui/PageHero";


const benefits : Benefit[] =  [
  {
    icon: "MapPin",
    title: "Discover Nearby Stores",
    description: "Find trusted local retailers around you.",
  },
  {
    icon: "Search",
    title: "Search & Compare",
    description: "Compare products, prices, and availability.",
  },
  {
    icon: "ShoppingBag",
    title: "Reserve or Buy",
    description: "Reserve products or order instantly.",
  },
  {
    icon: "Heart",
    title: "Support Local",
    description: "Shop from businesses in your own city.",
  },
];

const whyShop = [
  {
    icon: MapPin,
    title: "Find Products Nearby",
    description: "Know exactly where products are available around you.",
  },
  {
  
    icon: Zap, // Changed icon from Clock to Zap based on input "⚡ Save Time"
    title: " Save Time",
    description: "No more visiting multiple stores to find one product.",
  },
  {
    icon: Wallet,
    title: "Compare Before You Buy",
    description: "Compare nearby stores by price, availability, and convenience.",
  },
  {
    icon: ShoppingBag,
    title: "Shop Your Way",
    description: "Reserve, pick up, or get products delivered.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Local Stores",
    description: "Buy confidently from verified retailers.",
  },
  {
    icon: Heart,
    title: "Support Local Businesses",
    description: "Every purchase helps strengthen your local economy.",
  },
];

const categories = [
  { icon: Shirt, label: "Fashion" },
  { icon: Footprints, label: "Footwear" },
  { icon: Gem, label: "Jewellery" },
  { icon: Cpu, label: "Electronics" },
  { icon: Home, label: "Home & Living" },
  { icon: Sparkles, label: "Beauty" },
  { icon: Gift, label: "Gifts & Lifestyle" },
  { icon: Dumbbell, label: "Sports & Fitness" },
];

const steps = [
  {
    icon: Search,
    title: "Search Products",
    description: "Search for any product or browse categories.",
  },
  {
    icon: MapPin,
    title: "Discover Nearby Stores",
    description: "View nearby retailers with live availability.",
  },
  {
    icon: Scale,
    title: "Compare & Choose",
    description: "Compare stores by price, distance, and ratings.",
  },
  {
    icon: PackageCheck,
    title: "Reserve or Get Delivered",
    description: "Choose pickup or local delivery.",
  },
  {
    icon: Zap,
    title: "Enjoy Local Shopping",
    description: "Shop faster while supporting businesses near you.",
  },
];

const searchFeatures = [
  {
    icon: MapPin,
    title: "Local Search",
    description: "Discover products available in nearby stores for faster pickup or delivery.",
  },
  {
    icon: Globe2,
    title: "Global Search",
    description: "Expand your search beyond your city and explore products from retailers across India.",
  },
  {
    icon: Zap,
    title: "Smart Search",
    description: `${branding.appName} automatically suggests the best available options — nearby first, nationwide next.`,
  },
  {
    icon: ShoppingBag,
    title: "Shop Without Limits",
    description: "Never stop at \"Out of Stock.\" Find the product wherever it's available.",
  },
];

export default function ForCustomersContent() {
  return (
    <>
      <Navbar  />
      <main>
 {/* Hero */}
     

      <PageHero
        badge="Built for Everyday Shoppers"
        heading="Discover Local."
        highlight="Shop Smarter."
        description="Find products nearby, compare availability, reserve instantly, and choose pickup or local delivery — all from one app."
        primaryLabel="Join Waitlist"
        secondaryLabel="Request Demo"
        benefits={benefits || [] }
      />


        {/* Why Shop with Platform */}
        <section className="py-24 sm:py-28 lg:py-10">
          <div className="container-viz">
            <SectionHeading
              eyebrow=""
              title={`Why Shop with ${branding.appName}?`}
            />
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyShop.map((reason, i) => (
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

        {/* Popular Categories */}
        <section className="bg-viz-bg-2 py-24 sm:py-28 lg:py-10">
          <div className="container-viz">
            <SectionHeading
              eyebrow=""
              title="Explore Popular Categories."
              description="Discover products from your favorite local stores across multiple categories."
            />
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* How Platform Works */}
        <section className="py-24 sm:py-28 lg:py-14">
          <div className="container-viz">
            <SectionHeading
              eyebrow=""
              title={`How ${branding.appName} Works?`}
            />
            <div className="mt-16 flex flex-col gap-12 md:flex-row md:gap-4">
              {steps.map((step, i) => (
                <TimelineCard
                  key={step.title}
                  icon={step.icon}
                  step={i + 1}
                  title={step.title}
                  description={step.description}
                  isLast={i === steps.length - 1}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Local + Global Search */}
        <section className="relative overflow-hidden bg-viz-navy py-24 sm:py-28 mb-10 ">
          <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-viz-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-viz-accent/15 blur-[100px]" />

          <div className="container-viz relative">
            <SectionHeading
              light
              eyebrow=""
              title="Search Local. Expand Globally."
              description={`Every search starts with nearby stores. If the product isn't available locally, ${branding.appName} automatically expands your search across its retail network — helping you find exactly what you need.`}
            />
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {searchFeatures.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-viz-accent/15 text-viz-accent">
                      <Icon size={20} />
                    </span>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{description}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
              <p className="text-lg font-semibold text-white">
                Can&apos;t find it nearby?
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Switch to Global and discover products from retailers across
                India.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CTASection
          title="Start shopping local today"
          description={`Discover stores, reserve products, and support your local community with ${branding.appName}.`}
          primaryLabel="Join Waitlist"
          secondaryLabel="Request Demo"
        />
      </main>
      <Footer />
    </>
  );
}
