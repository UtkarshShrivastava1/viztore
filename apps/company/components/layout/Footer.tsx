import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
} from "lucide-react";
import { branding } from "@/config/company";

const supportLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Partner with Us", href: "/for-retailers" },
  { label: "Customer Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Seller Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/terms-and-conditions" },
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

          {/* Column 2: Our Address */}
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
              Made with <span className="text-red-500 text-sm">❤️</span> in India
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
