import React from 'react';
import { Headphones, Phone, Mail } from 'lucide-react';
import { branding } from '../../lib/branding.js';

export const StillNeedHelpBanner: React.FC = () => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f0f6ff] border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          {/* Left Side: Headset Icon + Text */}
          <div className="flex items-center gap-4 text-center lg:text-left flex-col sm:flex-row">
            <div className="w-14 h-14 rounded-full bg-blue-100/80 text-[#0052ff] flex items-center justify-center shrink-0 shadow-2xs">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0c1427]">Still Need Help?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Our team is here to support you. Get in touch with us anytime.
              </p>
            </div>
          </div>

          {/* Right Side: Call Us & Email Support */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white/80 py-3.5 px-6 rounded-2xl border border-blue-100/80 shadow-2xs">
            {/* Call Us */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Call Us
                </div>
                <a
                  href="tel:+919109107251"
                  className="text-sm font-extrabold text-[#0052ff] hover:underline block leading-tight"
                >
                  +91 91091 07251
                </a>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Mon - Sat, 10:00 AM - 6:00 PM
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-slate-200" />

            {/* Email Support */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Support
                </div>
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-sm font-extrabold text-[#0052ff] hover:underline block leading-tight"
                >
                  {branding.supportEmail}
                </a>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  We usually reply within 24 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
