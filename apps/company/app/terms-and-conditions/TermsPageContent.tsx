"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TermsHero from "@/components/terms/TermsHero";
import TermsContent from "@/components/terms/TermsContent";

export default function TermsPageContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <TermsHero />
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}
