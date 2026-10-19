// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { branding } from "@repo/shared-types/branding.config";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "For Retailers", href: "/for-retailers" },
  { label: "For Customers", href: "/for-customers" },
  { label: "Platform", href: "/platform" },
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Contact", href: "/contact" },
];

const HERO_THRESHOLD = 500; // px scrolled before navbar is considered "past hero"
const LG_BREAKPOINT = 1024; // matches Tailwind's `lg`

export default function Navbar() {
  const pathname = usePathname();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= LG_BREAKPOINT);
    const handleScroll = () => setPastHero(window.scrollY > HERO_THRESHOLD);

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isOverHero = isLargeScreen && !pastHero;

  const logoSrc = isOverHero
    ? "/images/lightLogo.png" // Desktop: before hero, light logo
    : "/images/darkLogo.png"; // Desktop: past hero, dark logo; Mobile: always dark logo

  // Navbar surface: transparent over hero on desktop, white with subtle blur & border once scrolled or on mobile
  const navSurface = isOverHero
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100";

  return (
    <div className="drawer drawer-end">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      {/* ---------- Navbar bar ---------- */}
      <div className="drawer-content">
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navSurface}`}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src={logoSrc}
                  alt={`${branding.appName} Logo`}
                  width={140}
                  height={36}
                  priority
                  className="h-10 sm:h-11 w-auto object-contain transition-opacity duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex lg:items-center">
              <ul className="flex items-center gap-1 xl:gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? isOverHero
                              ? "text-blue-400 font-semibold"
                              : "text-viz-primary font-semibold bg-blue-50/70"
                            : isOverHero
                            ? "text-white/90 hover:text-white hover:bg-white/10"
                            : "text-slate-600 hover:text-viz-primary hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                        {isActive && isOverHero && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right side: Mobile hamburger menu */}
            <div className="flex items-center lg:hidden">
              <label
                htmlFor="mobile-drawer"
                aria-label="Open menu"
                className={`btn btn-square btn-ghost ${
                  isOverHero ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
          </div>
        </header>
      </div>

      {/* ---------- Mobile side drawer ---------- */}
      <div className="drawer-side z-[60]">
        <label
          htmlFor="mobile-drawer"
          aria-label="Close menu"
          className="drawer-overlay"
        />
        <div className="menu bg-white min-h-full w-80 max-w-[85vw] p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-100">
              <Image
                src="/images/darkLogo.png"
                alt={`${branding.appName} Logo`}
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <label
                htmlFor="mobile-drawer"
                aria-label="Close menu"
                className="btn btn-sm btn-circle btn-ghost text-slate-500 hover:bg-slate-100"
              >
                ✕
              </label>
            </div>

            <ul className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <label htmlFor="mobile-drawer" className="p-0">
                      <Link
                        href={link.href}
                        className={`block w-full rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                          isActive
                            ? "bg-viz-primary/10 text-viz-primary font-semibold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-viz-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-6 border-t border-slate-100">
            <label htmlFor="mobile-drawer" className="p-0">
              <Link
                href="/contact"
                className="flex w-full items-center justify-center rounded-xl bg-viz-primary py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </label>
            <p className="mt-4 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} {branding.appName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}