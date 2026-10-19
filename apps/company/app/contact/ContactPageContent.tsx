"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactDirectInfo from "@/components/contact/ContactDirectInfo";

export default function ContactPageContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        <ContactHero />

        {/* Form and Contact Channels Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container-viz">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 xl:col-span-7">
                <ContactForm />
              </div>

              {/* Right Column: Get in Touch Info */}
              <div className="lg:col-span-5 xl:col-span-5">
                <ContactDirectInfo />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
