"use client";

import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { branding } from "@repo/shared-types/branding.config";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-900 to-viz-navy text-white px-6 py-24 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-viz-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-viz-accent/15 blur-[120px]" />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md mb-6">
            <Compass className="h-4 w-4" />
            <span>Error 404 • Page Not Found</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">
            Lost in the <span className="bg-gradient-to-r from-blue-400 to-viz-accent bg-clip-text text-transparent">Grid?</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-md mx-auto mb-10">
            We couldn&apos;t find the page you&apos;re looking for on {branding.appName}. The link may be broken, or the destination has been updated.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-viz-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-600 hover:shadow-blue-600/40 active:scale-[0.98] w-full sm:w-auto"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/40 active:scale-[0.98] w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-4">
              Explore Popular Destinations
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-blue-200">
              <Link href="/for-retailers" className="rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">
                For Retailers
              </Link>
              <Link href="/for-customers" className="rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">
                For Customers
              </Link>
              <Link href="/platform" className="rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">
                Platform
              </Link>
              <Link href="/about-us" className="rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
