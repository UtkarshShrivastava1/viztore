"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import { branding } from "@repo/shared-types/branding.config";
import {
  Globe2,
  Rocket,
  AlertTriangle,
  Eye,
  Target,
  Handshake,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  MapPin,
} from "lucide-react";
import PageHero , { type  Benefit }  from "@/components/ui/PageHero";


const benefits : Benefit[] =  [
  {
     icon: "Store" as const,
    title: "Built for Local Businesses",
    description: "Designed specifically for independent retailers and growing brands.",
  },
  {
    icon: "Globe" as const,
    title: "Made for India",
    description: "Built to solve the real challenges of India's retail ecosystem.",
  },
  {
    icon:  "Rocket" as const,
    title: "Future Ready",
    description: "Creating the technology powering the next generation of local commerce.",
  },
];

const story = [
  {
    icon: AlertTriangle,
    title: "The Problem",
    description:
      "Millions of local retailers offer great products, yet most remain invisible online. Customers often don't know where products are available nearby, while retailers lose opportunities simply because they can't be discovered.",
  },
  {
    icon: Eye,
    title: "The Vision",
    description:
      "A future where every local store is digitally connected, every product is searchable, and every customer can discover nearby businesses with confidence.",
  },
  {
    icon: Target,
    title: "The Mission",
    description:
      "To build India's most connected retail commerce platform by bringing retailers, customers, suppliers, and technology together on one unified network.",
  },
];

const values = [
  {
    icon: Rocket,
    title: "Innovation",
    description: "Building practical technology that solves real retail problems.",
  },
  {
    icon: Handshake,
    title: "Customer First",
    description: "Every decision starts with creating value for retailers and shoppers.",
  },
  {
    icon: Sparkles,
    title: "Simplicity",
    description: "Powerful technology should feel effortless to use.",
  },
  {
    icon: Globe2,
    title: "Local First",
    description: "Strengthening local businesses and communities through digital commerce.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description: "Building reliable technology with honest communication and secure systems.",
  },
];

const buildingBlocks = [
  {
    title: "For Retailers",
    items: [
      "Digital Storefront",
      "Product & Inventory Management",
      "Billing & Orders",
      "Customer Management",
      "Analytics & Growth Tools",
    ],
  },
  {
    title: "For Customers",
    items: [
      "Search Products",
      "Discover Nearby Stores",
      "Compare Availability",
      "Reserve Products",
      "Pickup & Local Delivery",
    ],
  },
  {
    title: "Supplier Network",
    items: [
      "Discover Wholesalers",
      "Compare Supplier Offers",
      "Bulk Procurement",
      "Smart Reordering",
      "Purchase Management",
    ],
  },
  {
    title: "Powered By",
    items: [
      "Secure Cloud Infrastructure",
      "Smart Analytics",
      "Payment Integrations",
      "Delivery Partners",
      "Commerce APIs",
    ],
  },
];

const roadmap = [
  { phase: "Phase 1", description: "Digitize local retailers with powerful business management tools." },
  { phase: "Phase 2", description: "Enable customers to discover nearby products and stores." },
  { phase: "Phase 3", description: "Build a connected supplier network for smarter inventory sourcing." },
  { phase: "Phase 4", description: "Create a Local + Global retail discovery network." },
  { phase: "Phase 5", description: "Power the future of retail with AI, automation, and connected commerce." },
];

const whyMatters = [
  { icon: Building2, title: "For Retailers", description: "Grow beyond walk-in customers with digital visibility." },
  { icon: Users, title: "For Customers", description: "Discover products faster and shop locally with confidence." },
  { icon: Truck, title: "For Suppliers", description: "Connect directly with retailers and simplify wholesale commerce." },
  { icon: MapPin, title: "For Communities", description: "Support local businesses while strengthening the local economy." },
];

export default function AboutUsContent() {
  return (
    <>
     <Navbar />
      <main>
        {/* Hero Section */}

        <PageHero
          badge={`About ${branding.appName}`}
          heading=" Building the Future of."
          highlight="Local Retail."
          description={` ${branding.appName} is building a connected retail commerce platform that helps local retailers digitize their businesses, makes products instantly discoverable, and creates a better shopping experience for customers.`}
          primaryLabel="Join Waitlist"
          secondaryLabel="Request Demo"
          benefits={benefits  || []}
        />




        {/* Our Story */}
        <section className="py-10 sm:py-10 lg:py-10">
          <div className="container-viz">
            <SectionHeading eyebrow="" title="Our Story." />
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {story.map((item, i) => (
                <FeatureCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Our Belief */}
       <section className="relative overflow-hidden bg-viz-navy py-20 sm:py-24 lg:py-28">
  <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-viz-primary/25 blur-[120px]" />
  <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-viz-accent/15 blur-[100px]" />

  <div className="container-viz relative">
    <div className="mx-auto max-w-4xl">
      {/* <span className="badge-eyebrow border-white/15 bg-white/5 text-viz-accent">
        Our Belief
      </span> */}

      <div className="mt-10 flex gap-6 sm:gap-10">
        {/* Vertical accent line */}
        <div className="mt-2 hidden w-1 shrink-0 rounded-full bg-gradient-to-b from-viz-accent via-viz-primary to-transparent sm:block" />

        <div className="flex flex-col gap-4">
          <p className="text-lg leading-snug text-slate-400 sm:text-xl">
            Local retail has never lacked products.
          </p>
          <p className="text-xl font-medium leading-snug text-slate-300 sm:text-2xl">
            It has lacked <span className="text-viz-accent">visibility</span>.
          </p>
          <p className="text-xl font-medium leading-snug text-slate-200 sm:text-2xl">
            Customers shouldn&apos;t have to guess where products are available.
          </p>
          <p className="text-xl font-medium leading-snug text-slate-200 sm:text-2xl">
            Retailers shouldn&apos;t lose sales because they aren&apos;t{" "}
            <span className="text-viz-accent">digitally discoverable</span>.
          </p>
          <p className="text-xl font-medium leading-snug text-white sm:text-2xl">
            Technology should make local commerce simpler, smarter, and more connected.
          </p>

          <p className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            That&apos;s why <span className="text-viz-accent">{branding.appName}</span> exists.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        
      {/* Our Values */}
<section className="bg-viz-bg-2 py-10 sm:py-10 lg:py-10">
  <div className="container-viz">
    <SectionHeading eyebrow="" title="Our Values" />

    <div className="mt-16 flex flex-wrap justify-center gap-6">
      {values.map((item, i) => (
        <div
          key={item.title}
          className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
        >
          <FeatureCard
            icon={item.icon}
            title={item.title}
            description={item.description}
            index={i}
          />
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Why We Started */}
        <section className="bg-white py-24 sm:py-28 lg:py-12 ">
          <div className="container-viz mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="" title="Why We Started?" />
            <div className="mt-16 grid grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="rounded-3xl border border-viz-border bg-white p-6 shadow-sm text-base leading-relaxed text-viz-paragraph sm:text-lg"
              >
                <p>
                  Retail is changing, but millions of local stores are still
                  disconnected from the digital economy.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="rounded-3xl border border-viz-border bg-white p-6 shadow-sm text-base leading-relaxed text-viz-paragraph sm:text-lg"
              >
                <p>
                  Large marketplaces have transformed online shopping, yet
                  discovering products available in nearby stores remains
                  surprisingly difficult.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="rounded-3xl border border-viz-border bg-white p-6 shadow-sm text-base leading-relaxed text-viz-paragraph sm:text-lg"
              >
                <p>
                  {branding.appName} was created to bridge this gap — helping retailers
                  become digitally visible while giving customers a smarter way
                  to discover, compare, and shop locally.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We're Building */}
        <section className="bg-viz-bg-2 py-10 sm:py-10 lg:py-10">
          <div className="container-viz">
            <SectionHeading
              eyebrow=""
              title="One Connected Retail Ecosystem."
              description={`${branding.appName} is more than a retail management platform. We're building the digital infrastructure that connects every part of local commerce.`}
            />
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {buildingBlocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-3xl border border-viz-border bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 text-base font-semibold text-viz-heading">
                    {block.title}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-viz-paragraph before:mr-2 before:text-viz-accent before:content-['●']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Road Ahead */}
      <section className="py-10 sm:py-10 lg:py-10">
  <div className="container-viz">
    <SectionHeading eyebrow="" title="The Road Ahead" />

    <div className="mt-16 relative">
      {/* Center line (desktop) / Left line (mobile) */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-viz-border" />

      <div className="flex flex-col gap-10">
        {roadmap.map((step, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={step.phase}
              className={`relative flex flex-col sm:flex-row items-start sm:items-center pl-12 sm:pl-0 ${
                isEven ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 sm:left-1/2 top-0 sm:top-1/2 flex h-8 w-8 -translate-x-1/2 sm:-translate-y-1/2 items-center justify-center rounded-full bg-viz-primary text-sm font-bold text-white z-10 ring-4 ring-white">
                {i + 1}
              </div>

              {/* Card content */}
              <div
                className={`w-full sm:w-[calc(50%-2rem)] rounded-2xl border border-viz-border bg-white p-6 shadow-sm ${
                  isEven ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
                }`}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-viz-primary">
                  {step.phase}
                </h3>
                <p className="mt-1 text-sm text-viz-paragraph sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>

        {/* Why Platform Matters */}
        <section className="bg-viz-bg-2 py-10 sm:py-10 lg:py-10">
          <div className="container-viz">
            <SectionHeading eyebrow="" title={`Why ${branding.appName} Matters?`} />
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyMatters.map((item, i) => (
                <FeatureCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
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
