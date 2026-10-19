"use client";

import { Mail, ArrowRight } from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

export default function CareersCTA() {
  return (
    <section className="bg-slate-50 py-12 border-t border-slate-200/70">
      <div className="container-viz">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-blue-900 via-[#0B1F4D] to-blue-950 p-6 sm:p-8 text-white shadow-lg">
          <div className="max-w-xl text-center sm:text-left">
            <h3 className="text-xl font-bold sm:text-2xl">
              Don&apos;t see the right role for you?
            </h3>
            <p className="mt-1 text-sm text-blue-200/80">
              We are always excited to hear from passionate builders, engineers,
              and designers. Send us your resume and tell us how you can make a
              difference.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={`mailto:${branding.supportEmail}?subject=General%20Application%20-%20${encodeURIComponent(branding.appName)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg active:scale-[0.98]"
            >
              <Mail className="h-4 w-4 text-blue-600" />
              <span>Send Open Application</span>
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
