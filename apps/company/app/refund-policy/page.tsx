"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { branding } from "@repo/shared-types/branding.config";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          badge="Policy"
          heading="Refund & Cancellation"
          highlight="Policy"
          description={`Guidelines regarding cancellations, returns, and refunds for orders and services on ${branding.appName}.`}
        />

        <section className="py-16 bg-white">
          <div className="container-viz max-w-4xl mx-auto prose prose-slate">
            <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  1. Order Cancellations
                </h2>
                <p>
                  Customers may request order cancellations prior to dispatch or
                  preparation by the local merchant. Once an order is out for
                  delivery or prepared, cancellation eligibility depends on the
                  individual merchant&apos;s store policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  2. Returns & Replacements
                </h2>
                <p>
                  Damaged, incorrect, or defective items can be reported within
                  the window specified by the seller upon delivery. Our support
                  team works directly with you and the neighborhood store to
                  ensure prompt replacement or resolution.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  3. Refund Processing
                </h2>
                <p>
                  Approved refunds are processed back to the original payment
                  method within 5–7 business days, depending on your bank or
                  payment provider.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-viz-heading mb-3">
                  4. Need Assistance?
                </h2>
                <p>
                  For any return or cancellation queries, contact us at{" "}
                  <a
                    href={`mailto:${branding.supportEmail}`}
                    className="text-viz-primary underline"
                  >
                    {branding.supportEmail}
                  </a>{" "}
                  or call{" "}
                  <a href={`tel:${branding.contactPhone.replace(/\s+/g, '')}`} className="text-viz-primary underline">
                    {branding.contactPhone}
                  </a>
                  .
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
