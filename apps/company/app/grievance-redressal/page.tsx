"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { branding } from "@repo/shared-types/branding.config";

export default function GrievanceRedressalPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          badge="Compliance"
          heading="Grievance"
          highlight="Redressal"
          description="In accordance with the Information Technology Act and Consumer Protection rules, we ensure transparent resolution of your grievances."
        />

        <section className="py-16 bg-white">
          <div className="container-viz max-w-4xl mx-auto prose prose-slate">
            <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  Grievance Officer
                </h2>
                <p>
                  If you have any complaints or concerns regarding our platform,
                  services, or compliance with applicable laws, you may contact
                  our designated Grievance Officer:
                </p>

                <div className="mt-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2">
                  <p>
                    <strong>Company:</strong> {branding.legalEntity} ({branding.appName})
                  </p>
                  <p>
                    <strong>Address:</strong> {branding.companyAddress}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${branding.supportEmail}`}
                      className="text-viz-primary underline"
                    >
                      {branding.supportEmail}
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong> {branding.contactPhone}
                  </p>
                  <p>
                    <strong>Working Hours:</strong> Monday to Friday, 10:00 AM –
                    6:00 PM IST
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  Resolution Timelines
                </h2>
                <p>
                  All grievances submitted will be acknowledged within 48 hours
                  of receipt, and our team will work to resolve the issue within
                  the statutory timeline of 30 days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
