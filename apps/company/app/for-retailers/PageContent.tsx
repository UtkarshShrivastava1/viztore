"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import TimelineCard from "@/components/ui/TimelineCard";
import CategoryCard from "@/components/ui/CategoryCard";
import { branding } from "@repo/shared-types/branding.config";

import {
  Store,
  PackagePlus,
  Boxes,
  Receipt,
  Rocket,
  Package,
  Receipt as ReceiptIcon,
  ClipboardList,
  FileBarChart,
  Users,
  Factory,
  Wallet,
  Truck,
  ClipboardCheck,
  Shirt,
  Footprints,
  Cpu,
  Gem,
  Home,
  Sparkles,
  Gift,
  Dumbbell,
  Layers,
  Smile,
  ShieldCheck,
  MapPinned,
  LineChart,
  Handshake,
} from "lucide-react";
import PageHero, {type Benefit} from "@/components/ui/PageHero";
// import PageHeroIconName from "@/components/ui/PageHero"; // Removed incorrect type import


const benefits : Benefit[] =  [
  {
    icon: "Globe2", // Changed to string literal
    title: "Increase Visibility",
    description: "Get discovered by nearby customers searching for your products.",
    
  },
  {
    icon: "Clock", // Changed to string literal
    title: "Save Time",
    description: "Simplify inventory, billing, and daily store operations.",
  },
  {
    icon: "TrendingUp", // Changed to string literal
    title: "Boost Sales",
    description: "Reach more local customers and increase repeat purchases.",
   
  },
  {
    icon: "BarChart3", // Changed to string literal
    title: "Business Insights",
    description: "Track performance with real-time reports and analytics.",
    
  },
];

// The benefits array is already correct based on the provided input.
const steps = [
  {
    icon: Store,
    title: "Create Your Store",
    description: "Set up your digital storefront in minutes.",
  },
  {
    icon: PackagePlus,
    title: "Add Products",
    description: "Upload products, images, variants, and pricing.",
  },
  {
    icon: Boxes,
    title: "Manage Inventory",
    description: "Track stock levels with real-time inventory updates.",
  },
  {
    icon: Receipt,
    title: "Billing & Orders",
    description: "Generate invoices and manage walk-in, pickup, and delivery orders.",
  },
  {
    icon: Rocket,
    title: "Grow Your Business",
    description: "Reach nearby customers and grow through local discovery.",
  },
];

const featureList = [
  { icon: Package, label: "Product Management" },
  { icon: Boxes, label: "Inventory Tracking" },
  { icon: ReceiptIcon, label: "Billing & GST Invoicing" },
  { icon: Users, label: "Customer Management" },
  { icon: ClipboardList, label: "Orders & Deliveries" },
  { icon: FileBarChart, label: "Reports & Analytics" },
];

// The featureList array is already correct based on the provided input.
const supplierCards = [
  {
    icon: Factory,
    title: "Verified Supplier Network",
    description: "Connect with trusted wholesalers and distributors.",
  },
  {
    icon: Wallet,
    title: "Compare & Choose",
    description: "Compare prices, MOQ, delivery timelines, and supplier offers.",
  },
  {
    icon: Truck,
    title: "Bulk Ordering",
    description: "Place purchase orders directly from multiple suppliers.",
  },
  {
    icon: ClipboardCheck,
    title: "Procurement Management",
    description: "Track purchase orders, invoices, and supplier history from one dashboard.",
  },
];

// The supplierCards array is already correct based on the provided input.
const retailTypes = [
  { icon: Shirt, label: "Fashion Boutiques" },
  { icon: Footprints, label: "Footwear Stores" },
  { icon: Cpu, label: "Electronics Shops" },
  { icon: Gem, label: "Jewellery Stores" },
  { icon: Home, label: "Home & Living" },
  { icon: Sparkles, label: "Beauty Stores" },
  { icon: Gift, label: "Gift Shops" },
  { icon: Dumbbell, label: "Sports Stores" },
];

// The retailTypes array is already correct based on the provided input.
const whyChoose = [
  {
    icon: Layers,
    title: "One Platform",
    description: "Everything your business needs in one place.",
  },
  {
    icon: Smile,
    title: "Easy to Use",
    description: "Designed for retailers with no technical expertise.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with reliable performance.",
  },
  {
    icon: MapPinned,
    title: "Local Discovery",
    description: "Help nearby customers find your products instantly.",
  },
  {
    icon: LineChart,
    title: "Better Business Insights",
    description: "Make smarter decisions with real-time analytics.",
  },
  {
    icon: Handshake,
    title: "Grow with Confidence",
    description: "Operate efficiently while reaching more local customers.",
  },
];

export default function ForRetailersContent() {
  return (
    <>
      <Navbar />
      <main >
        {/* Hero */}
          <PageHero
          badge="For Retailers"
          heading="Digitize. Manage."
          highlight="Grow Your Store."
          description="Everything your store needs — from daily operations to local customer discovery."
          benefits={benefits || [] }

        />

      

        {/* How Platform Works for Retailers */}
        <section className="bg-viz-bg-2 py-24 sm:py-28 lg:py-11 pb-10">
          <div className="container-viz">
            <SectionHeading
              eyebrow=""
              title={`How ${branding.appName} Works for Retailers?`}
              description="Everything your store needs — from daily operations to local customer discovery."
            />
            <div className="mt-16 flex flex-col gap-12 md:flex-row md:gap-4 ">
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

     

        {/* Powerful Features */}
<section className="py-24 sm:py-28 md:py-12 lg:py-17">
  <div className="container-viz grid grid-cols-1 items-center gap-14 lg:grid-cols-2  ">
    {/* LEFT: Copy + Feature Grid */}
    <div>
      <SectionHeading
        align="left"
        eyebrow=""
        title="Everything You Need to Run Your Store."
        description="Manage your retail operations, streamline daily workflows, and grow your business — all from one connected platform."
      />

      <div className="mt-8 grid grid-cols-2 gap-3">
        {featureList.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="group flex flex-col gap-3 rounded-2xl border border-viz-border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-viz-primary/10 text-viz-primary transition-colors duration-300 group-hover:bg-viz-primary group-hover:text-white">
              <Icon size={18} />
            </span>
            <span className="text-sm font-medium leading-snug text-viz-heading">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* <div className="mt-8">
        <Button variant="primary">Explore All Features</Button>
      </div> */}
    </div>

    {/* RIGHT: Browser-window mockup */}
    <div className="relative">
      {/* Floating accent card */}
      <div className="absolute -top-6 -right-4 z-10 hidden sm:flex items-center gap-3 rounded-2xl border border-viz-border bg-white px-4 py-3 shadow-xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold">
          ▲
        </span>
        <div className="leading-tight">
          <p className="text-xs text-viz-paragraph">Sales Today</p>
          <p className="text-sm font-bold text-viz-heading">+24.6%</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-viz-border bg-white shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-viz-border bg-viz-bg-2 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-viz-accent" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 rounded-lg bg-white px-3 py-1 text-center text-[11px] text-viz-paragraph shadow-inner">
            app.{branding.domain}/dashboard
          </div>
        </div>

        {/* Storefront content */}
        <div className="p-5">
          {/* Nav row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-viz-primary/20" />
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-viz-bg-2" />
              <div className="h-6 w-6 rounded-full bg-viz-bg-2" />
            </div>
          </div>

          {/* Hero banner */}
          <div className="mb-4 h-24 rounded-2xl bg-gradient-to-br from-viz-primary/20 to-viz-accent/10" />

          {/* Product grid */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-viz-border bg-viz-bg-2 p-2"
              >
                <div className="mb-2 h-12 rounded-lg bg-white" />
                <div className="h-2 w-3/4 rounded-full bg-viz-border" />
                <div className="mt-1 h-2 w-1/2 rounded-full bg-viz-border" />
              </div>
            ))}
          </div>

          {/* Bottom stat strip */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-viz-primary/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-viz-paragraph">
                Orders
              </p>
              <p className="mt-1 text-sm font-bold text-viz-heading">128</p>
            </div>
            <div className="rounded-xl bg-viz-accent/10 p-3">
              <p className="text-[10px] uppercase tracking-wide text-viz-paragraph">
                Revenue
              </p>
              <p className="mt-1 text-sm font-bold text-viz-heading">₹42k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Supplier Network */}
        <section className="bg-viz-bg-2 py-24 sm:py-28 lg:py-[15px]">
          <div className="container-viz p-10">
            <SectionHeading
              eyebrow=""
              title="Source Inventory Smarter."
              description={`Everything you need to source inventory smarter. Discover suppliers, compare offers, manage purchases, and keep your shelves stocked — all within ${branding.appName}.`}
              align="center"
            />
            <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {supplierCards.map((card, i) => (
                <FeatureCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Built for Every Type of Retail Business */}
        <section className="py-24 sm:py-28 lg:py-[15px]">
          <div className="container-viz p-10">
            <SectionHeading
              eyebrow=""
              title="Built for Every Type of Retail Business."
              description={`Whatever you sell, ${branding.appName} adapts to your category with the right tools — and many more.`}
            /> 
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {retailTypes.map((cat, i) => (
                <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Retailers Choose the Platform */}
        <section className="bg-viz-bg-2 py-24 sm:py-28 lg:py-[15px]">
          <div className="container-viz p-10">
            <SectionHeading
              eyebrow=""
              title="Built to Help Local Retailers Grow."
            />
            <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyChoose.map((reason, i) => (
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

      
      </main>
      <Footer />
    </>
  );
}
