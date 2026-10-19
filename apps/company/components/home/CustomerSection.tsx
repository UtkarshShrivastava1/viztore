"use client";

import { motion } from "framer-motion";
import { MapPin, Bike, Search, Package, Scale, ShoppingBag, Zap, Star } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const customerFeatures = [
  {
    icon: Search,
    title: "Search Products, Not Stores",
    description:
      "Find exactly what you need without visiting multiple shops.",
  },
  {
    icon: MapPin,
    title: "Discover Nearby Stores",
    description:
      "Instantly see which local stores have the product you're looking for.",
  },
  {
    icon: Package,
    title: "Check Real-Time Availability",
    description:
      "Know what's in stock before you leave home.",
  },
  {
    icon: Scale,
    title: "Compare Nearby Options",
    description:
      "Compare availability, price, distance, and convenience.",
  },
  {
    icon: ShoppingBag,
    title: "Reserve, Pickup or Delivery",
    description:
      "Reserve products, pick them up, or choose local delivery.",
  },
  {
    icon: Zap,
    title: "Faster Local Shopping",
    description:
      "Get products from nearby retailers without waiting days for shipping.",
  },
];

function FeatureCard({ icon: Icon, title, description }: typeof customerFeatures[0]) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative cursor-pointer tooltip tooltip-top tooltip-secondary" // DaisyUI handles the tooltip visibility, added tooltip-secondary for background
      data-tip={description} // Provide the tooltip content via data-tip
    >
      <GlassCard className="flex flex-col items-start gap-3 !p-6 h-full">
        <div className="flex items-center gap-3">
          <Icon size={24} className="text-viz-accent" />
          <h3 className="text-sm font-thin text-white">{title}</h3>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function CustomerSection() {
  return (
    <section
      id="customer-app"
      className="relative overflow-hidden bg-viz-navy py-24 sm:py-28 lg:py-16"
    >
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-viz-primary/25 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-viz-accent/15 blur-[100px]" />

      <div className="container-viz relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-eyebrow border-white/15 bg-white/5 text-viz-accent">
            FOR CUSTOMERS
          </span>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Discover Local.
            <br />
            Buy Nearby.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
            Find products from real stores around you, compare and order in a
            few taps, and support your local retailers while getting what you
            need — fast.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {customerFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Phone mockup with fuller composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto h-[460px] w-full max-w-sm lg:h-[540px] "
        >
          {/* Decorative radar rings behind the phone */}
         <div className="pointer-events-none absolute left-1/2 top-[45%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-viz-accent/20 lg:h-[360px] lg:w-[360px]" />
          <div className="pointer-events-none absolute left-1/2 top-[45%] h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-viz-accent/15 lg:h-[290px] lg:w-[290px]" />
          {/* Decorative radar rings */}
             <div className="pointer-events-none absolute left-1/2 top-[45%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-viz-accent/20 lg:h-[340px] lg:w-[340px]" />
            <div className="pointer-events-none absolute left-1/2 top-[45%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-viz-accent/15 lg:h-[270px] lg:w-[270px]" />

          {/* Phone */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute left-1/2 top-[45%] h-[400px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border-4 border-white/10 bg-gradient-to-b from-slate-900 to-viz-navy p-2 shadow-2xl lg:h-[460px] lg:w-[230px]"
          >
            <div className="flex h-full w-full flex-col rounded-[2rem] bg-gradient-to-b from-viz-accent/15 to-viz-navy p-4">
              {/* Fake status bar */}
              <div className="mb-4 flex items-center justify-between">
                <div className="h-2 w-10 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>

              {/* Search bar */}
               <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="absolute -left-4 -top-2 lg:top-2"
                >
                  <GlassCard className="flex items-center gap-2 !p-3">
                    <Search size={16} className="text-viz-accent" />
                    <span className="text-xs font-medium text-white">
                      120+ products nearby
                    </span>
                  </GlassCard>
                </motion.div>

              {/* Product list items */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: Package, label: "Shoes", meta: "In stock" },
                  { icon: ShoppingBag, label: "Organic Honey", meta: "2 stores" },
                  { icon: Star, label: "Top rated near you", meta: "4.8 ★" },
                ].map(({ icon: Icon, label, meta }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl bg-white/10 p-2"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-viz-accent/20 text-viz-accent">
                      <Icon size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[9px] font-semibold text-white">
                        {label}
                      </div>
                      <div className="text-[8px] text-slate-400">{meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map preview strip */}
              <div className="mt-auto flex h-16 items-center justify-center rounded-xl bg-viz-accent/20">
                <MapPin size={16} className="text-viz-accent" />
              </div>
            </div>
          </motion.div>

          {/* Floating card: top-right — fills the empty space */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute -right-2 top-0 lg:top-4"
          >
            <GlassCard className="flex items-center gap-2 !p-3">
              <Star size={16} className="text-viz-accent" />
              <span className="text-xs font-medium text-white">
                4.8 rated nearby
              </span>
            </GlassCard>
          </motion.div>

          {/* Floating card: left */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 top-1/4"
          >
            <GlassCard className="flex items-center gap-2 !p-3">
              <MapPin size={16} className="text-viz-accent" />
              <span className="text-xs font-medium text-white">
                Store 400m away
              </span>
            </GlassCard>
          </motion.div>

          {/* Floating card: bottom-right */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -right-2 bottom-10"
          >
            <GlassCard className="flex items-center gap-2 !p-3">
              <Bike size={16} className="text-viz-accent" />
              <span className="text-xs font-medium text-white">
                Arriving in 18 min
              </span>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}