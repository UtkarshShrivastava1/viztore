"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Package,
  Boxes,
  Receipt,
  ClipboardList,
  Truck,
  Users,
  Globe,
  MapPinned,
  BarChart3,
  Store,
  type LucideIcon,
} from "lucide-react";

/**
 * Platform Features section (Tailwind + DaisyUI build)
 * ---------------------------------------------------------------
 * Two tracks instead of a generic 3-column grid, because the brief's
 * own copy already splits this way:
 *   - "manage products, inventory, billing, orders, and customers"
 *     -> TRACK 01 · Inside Your Store (6 cards)
 *   - "...make your store discoverable to nearby shoppers"
 *     -> TRACK 02 · Beyond Your Door (3 cards)
 *
 * Signature moment: a radar "ping" (Tailwind's built-in animate-ping)
 * sits in the seam between the two tracks — a store pin signaling
 * outward to three small dots (nearby shoppers). It's a literal,
 * quiet picture of "local discovery," reusing viz-primary (white)
 * for the signal and viz-accent for the shopper dots so it ties
 * both tracks together visually.
 *
 * Color usage:
 *   - viz-primary (white, per your config) = the "Inside Your Store"
 *     accent, the ping signal, and the primary CTA.
 *   - viz-accent = the "Beyond Your Door" accent, kept as-is from
 *     your existing dashboard mockup so nothing is invented.
 *   - viz-navy / viz-border = unchanged section + card surfaces.
 *
 * NOTE on DaisyUI: `btn-primary` / `badge-primary` read DaisyUI's
 * own theme `primary` value, which is configured separately from
 * your Tailwind `viz-primary` custom color. If you want those
 * component classes to also render white, set the DaisyUI theme's
 * `primary` to white AND give it a dark `primary-content` (e.g.
 * `#0b1520`) so button text stays legible. This file uses explicit
 * `bg-viz-primary text-viz-navy` on the CTA instead, so it works
 * correctly even before that theme change is made.
 * ---------------------------------------------------------------
 */

interface ItemProps {
  eyebrow: React.ReactNode;
  title: string;
  accent: string;
  // Add other properties as needed
}

interface Feature{
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
  delay?: number;
  visible?: boolean;
}



const operationsFeatures = [
  { icon: Package, title: "Product Management", description: "Organize products, categories, variants, and pricing with ease." },
  { icon: Boxes, title: "Inventory Management", description: "Track stock in real time and never lose sight of your inventory." },
  { icon: Receipt, title: "Billing & Invoicing", description: "Generate fast, accurate bills and manage transactions effortlessly." },
  { icon: ClipboardList, title: "Order Management", description: "Manage walk-in, pickup, delivery, and online orders from one dashboard." },
  { icon: Users, title: "Customer Management", description: "Maintain customer profiles, purchase history, and loyalty insights." },
  { icon: BarChart3, title: "Reports & Analytics", description: "Understand sales, inventory performance, and customer trends." },
];

const reachFeatures = [
  { icon: Globe, title: "Digital Storefront", description: "Showcase your products online and make your store discoverable." },
  { icon: MapPinned, title: "Local Product Discovery", description: "Help nearby customers find your products when they search." },
  { icon: Truck, title: "Hyperlocal Delivery", description: "Offer convenient local delivery without changing how you run your store." },
];

function TrackLabel({ eyebrow, title, accent }:ItemProps) {
  const dot = accent === "primary" ? "bg-viz-primary" : "bg-viz-accent";
  return (
    <div className="mt-14 mb-6 flex items-center gap-3">
      <span className={`h-2 w-2 flex-none rounded-full ${dot}`} />
      <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
        {eyebrow}
      </span>
      <span className="font-semibold text-white">{title}</span>
      <span className="h-px flex-1 bg-viz-border" />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, accent, delay, visible }:Feature) {
  const iconBg =
    accent === "primary"
      ? "bg-viz-primary/10 text-viz-primary"
      : "bg-viz-accent/15 text-viz-accent";
  const hoverBorder =
    accent === "primary" ? "hover:border-viz-primary/40" : "hover:border-viz-accent/40";

  return (
    <div
      className={`card border border-viz-border bg-viz-navy/60 transition-all duration-700 ${hoverBorder} hover:-translate-y-1 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="card-body gap-2 p-5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <h3 className="card-title text-base text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </div>
  );
}

function DiscoverySeam() {
  return (
    <div className="my-10 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-viz-border" />

      <div className="relative flex h-10 w-10 flex-none items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-viz-primary/40 [animation-duration:3s]" />
        <span className="absolute inset-0 animate-ping rounded-full bg-viz-primary/25 [animation-delay:1s] [animation-duration:3s]" />
        <span className="absolute inset-0 animate-ping rounded-full bg-viz-primary/15 [animation-delay:2s] [animation-duration:3s]" />

        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-viz-primary/60 bg-viz-navy text-viz-primary">
          <Store size={15} strokeWidth={1.75} />
        </span>

        <span className="absolute -top-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-viz-accent" />
        <span className="absolute -bottom-2 -left-5 h-1 w-1 rounded-full bg-viz-accent" />
        <span className="absolute -bottom-2 -right-5 h-1 w-1 rounded-full bg-viz-accent" />
      </div>

      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-viz-border" />
    </div>
  );
}



export default function Features() {
  const [headRef, headVisible] = useReveal();
  const [opsRef, opsVisible] = useReveal();
  const [reachRef, reachVisible] = useReveal();

  function useReveal(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}

  return (
    <section id="features" className="bg-viz-navy py-24 sm:py-28">
      <div className="container-viz">
        <div
          ref={headRef}
          className={`max-w-xl transition-all duration-700 ${
            headVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {/* <span className="badge badge-outline gap-2 border-viz-primary/40 font-mono text-xs uppercase tracking-widest text-viz-primary"> */}
          <span className="badge badge-outline gap-2 border-white/40 font-mono text-xs uppercase tracking-widest text-white">
            For Retailers
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need to Run Your Store
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/60">
            Manage products, inventory, billing, orders, and customers — all
            while making your store discoverable to nearby shoppers.
          </p>
        </div>

        <div ref={opsRef}>
          <TrackLabel eyebrow="" title="Inside Your Store" accent="primary" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {operationsFeatures.map((f, i) => (
              <FeatureCard
                key={f.title}
                {...f}
                accent="primary"
                delay={i * 60}
                visible={opsVisible}
              />
            ))}
          </div>
        </div>

        <DiscoverySeam />

        <div ref={reachRef}>
          <TrackLabel eyebrow="" title="Beyond Your Door" accent="accent" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reachFeatures.map((f, i) => (
              <FeatureCard
                key={f.title}
                {...f}
                accent="accent"
                delay={i * 60}
                visible={reachVisible}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}