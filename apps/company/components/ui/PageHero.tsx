"use client";

import { motion } from "framer-motion";
import {
  Eye,
  MapPin,
  Search,
  ShoppingBag,
  Heart,
  Globe,
  Clock,
  TrendingUp,
  BarChart3,
  Store,
  PackagePlus,
  Boxes,
  Receipt,
  Rocket,
  Package,
  ClipboardList,
  FileBarChart,
  Users,
  Factory,
  Wallet,
  Truck,
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
  type LucideIcon,
  Globe2,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";

const iconMap = {
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  MapPin,
  Search,
  ShoppingBag,
  Heart,
  Store,
  Globe, 
  Globe2, // Added Globe2 to the iconMap
  PackagePlus,
  Boxes,
  Receipt,
  Rocket,
  Package, 
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
  UserCheck,
} satisfies Record<string, LucideIcon>;

export type PageHeroIconName = keyof typeof iconMap;

interface Benefit {
  icon: PageHeroIconName;
  title: string;
  description: string;
}

export type { Benefit };

interface PageHeroProps {
  badge: string;
  heading: string;
  highlight?: string;
  description: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  benefits?: Benefit[];
}

export default function PageHero({
  badge,
  heading,
  highlight,
  description,
  primaryLabel: _primaryLabel = "Join Waitlist",
  secondaryLabel: _secondaryLabel = "Request Demo",
  benefits,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-viz-navy pb-20 pt-20 lg:pt-20 sm:pt-44">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-viz-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-viz-accent/20 blur-[100px]" />

      <div className="container-viz relative grid grid-cols-1 items-center gap-12 lg:gap-3   lg:grid-cols-2">
        {/* Left Side: Heading + Text + Buttons */}
        <div className="flex flex-col items-start justify-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="badge-eyebrow border-white/15 bg-white/5 text-viz-accent">
              {badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
              {heading}
              {highlight && <span className="text-viz-accent"> {highlight}</span>}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              {description}
            </p>
            {/* <div className="mt-8 flex flex-col items-start justify-start gap-3 sm:flex-row">
              <Button variant="primary">{primaryLabel}</Button>
              <Button variant="secondary-dark">{secondaryLabel}</Button>
            </div> */}
          </motion.div>
        </div>
{benefits && (
  <div className="flex flex-wrap justify-center gap-4">
    {benefits.map((b, i) => {
      const Icon = iconMap[b.icon];
      return (
        <motion.div
          key={b.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
          className="w-full sm:w-[calc(50%-0.5rem)] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-viz-accent/10 text-viz-accent">
            <Icon size={22} />
          </span>
          <h3 className="mb-1 text-sm font-semibold text-white">
            {b.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-400">
            {b.description}
          </p>
        </motion.div>
      );
    })}
  </div>
)}
      </div>
    </section>
  );
}
