"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Headphones, ArrowRight } from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

export default function ContactDirectInfo() {
  return (
    <div className="rounded-3xl border border-blue-100 bg-[#F0F7FF] p-7 sm:p-9 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Get in touch
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          You can also reach us directly through the following channels.
        </p>

        <div className="mt-8 space-y-6">
          {/* 1. Email */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-blue-600 shadow-sm">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </span>
              <a
                href={`mailto:${branding.supportEmail}`}
                className="mt-0.5 inline-block text-sm sm:text-base font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
              >
                {branding.supportEmail}
              </a>
              <p className="mt-0.5 text-xs text-slate-500">
                For general enquiries and support.
              </p>
            </div>
          </div>

          {/* 2. Phone */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-blue-600 shadow-sm">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phone
              </span>
              <a
                href={`tel:${branding.contactPhone.replace(/\s+/g, '')}`}
                className="mt-0.5 inline-block text-sm sm:text-base font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
              >
                {branding.contactPhone}
              </a>
              <p className="mt-0.5 text-xs text-slate-500">
                Mon - Sat, 10:00 AM to 6:00 PM
              </p>
            </div>
          </div>

          {/* 3. Office Address */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-blue-600 shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-sm">
              <h3 className="font-bold text-slate-900">Office Address</h3>
              <div className="mt-1 space-y-0.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p className="font-medium text-slate-800">
                  {branding.legalEntity}
                </p>
                <p>{branding.companyAddress}</p>
              </div>
            </div>
          </div>

          {/* 4. Retailer Support */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-blue-600 shadow-sm">
              <Headphones className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Retailer Support
              </h3>
              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                For store onboarding, product training and business enquiries.
              </p>

              {/* Action Button */}
              <Link
                href="/for-retailers"
                className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white/90 py-2.5 px-4 text-xs sm:text-sm font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:bg-white hover:border-blue-400 hover:text-blue-700 hover:shadow active:scale-[0.99]"
              >
                <span>Talk to Retailer Support</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
