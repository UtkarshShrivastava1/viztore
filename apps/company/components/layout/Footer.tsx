import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
} from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

const supportLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Partner with Us", href: "/for-retailers" },
  { label: "Customer Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Seller Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund and Cancellation Policy", href: "/refund-policy" },
  { label: "Grievance Redressal", href: "/grievance-redressal" },
];

export default function Footer() {
  return (
    <footer className="bg-[#03153d] pt-16 text-slate-300">
      <div className="container-viz">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0">
          {/* Column 1: Logo, Description & Follow Us */}
          <div className="lg:col-span-5 lg:pr-12 lg:border-r lg:border-white/10 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/lightLogo.png"
                  alt={`${branding.appName} - ${branding.tagline}`}
                  width={220}
                  height={56}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-blue-100/75">
                Discover and shop from local stores in your city. Support local businesses
                and find everything you need, all in one place.
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-base font-bold text-white mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Our Address & Download the App */}
          <div className="lg:col-span-4 lg:px-10 lg:border-r lg:border-white/10 flex flex-col justify-between">
            <div>
              <div>
                <h4 className="text-base font-bold text-white">Our Address</h4>
                <div className="mt-2 h-1 w-10 rounded-full bg-[#0070F3] shadow-sm shadow-blue-500/50" />
              </div>

              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-black/10">
                  <MapPin className="h-7 w-7 text-[#0066FF]" />
                </div>
                <div className="text-sm leading-relaxed">
                  <h5 className="font-bold text-white text-base">{branding.legalEntity}</h5>
                  <p className="mt-1 text-blue-100/75">
                    {branding.companyAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-base font-bold text-white mb-3">Download the App</h4>
              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play Button */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black/90 px-3.5 py-2 transition-all duration-200 hover:border-white/50 hover:bg-black active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3.609 1.814L13.793 12 3.61 22.186A2.215 2.215 0 013 20.615V3.385c0-.609.224-1.17.609-1.571z"
                      fill="#00D2FF"
                    />
                    <path
                      d="M17.186 8.607L13.793 12l3.393 3.393 3.844-2.219a1.353 1.353 0 000-2.348l-3.844-2.219z"
                      fill="#FFCE00"
                    />
                    <path
                      d="M3.609 1.814l10.184 10.186 3.393-3.393L6.155.857a2.535 2.535 0 00-2.546.957z"
                      fill="#00F076"
                    />
                    <path
                      d="M13.793 12L3.609 22.186a2.535 2.535 0 002.546.957l11.031-6.35-3.393-3.393z"
                      fill="#FF3A44"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-300 leading-none">
                      GET IT ON
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      Google Play
                    </div>
                  </div>
                </a>

                {/* Apple Store Button */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black/90 px-3.5 py-2 transition-all duration-200 hover:border-white/50 hover:bg-black active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 shrink-0 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.78-11.65-14.21-6.38-10.08-11.41-21.72-15.09-34.92-3.69-13.2-5.53-25.29-5.53-36.27 0-14.89 3.69-27.14 11.07-36.75 7.38-9.61 16.73-14.51 28.05-14.7 4.9.12 10.36 1.43 16.39 3.92 6.03 2.49 10.05 3.79 12.06 3.92 1.68 0 5.86-1.4 12.54-4.21 6.68-2.81 12.44-4.11 17.28-3.92 15.54 1.12 27.27 7.04 35.19 17.76-13.75 8.35-20.47 19.78-20.15 34.28.32 11.22 4.63 20.67 12.92 28.35 8.29 7.68 18.23 12.18 29.83 13.51-2.58 7.84-5.69 15.61-9.33 23.32zM119.22 31.84c0-7.72 2.76-14.93 8.28-21.63 5.53-6.7 12.43-10.74 20.7-12.11.22 1.34.33 2.57.33 3.69 0 7.61-2.85 15.04-8.56 22.3-5.71 7.26-12.63 11.39-20.75 12.39-0.01-1.57 0-3.11 0-4.64z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] font-medium text-slate-300 leading-none">
                      Download on the
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      App Store
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-3 lg:pl-10">
            <div>
              <h4 className="text-base font-bold text-white">Support</h4>
              <div className="mt-2 h-1 w-10 rounded-full bg-[#0070F3] shadow-sm shadow-blue-500/50" />
            </div>

            <ul className="mt-6 flex flex-col gap-1">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100/80 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row text-xs text-blue-100/70">
          <p>
            © {new Date().getFullYear()} <strong className="font-semibold text-white">{branding.appName}</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              Made in India <span className="text-red-500 text-sm">❤️</span> in India
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-slate-200 font-medium">Service Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
