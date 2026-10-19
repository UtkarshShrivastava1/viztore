"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CareersHero from "@/components/careers/CareersHero";
import CareersValues from "@/components/careers/CareersValues";
import OpenPositions from "@/components/careers/OpenPositions";
import CareersCTA from "@/components/careers/CareersCTA";

export default function CareersPageContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <CareersHero />
        <CareersValues />
        <OpenPositions />
        <CareersCTA />
      </main>
      <Footer />
    </>
  );
}
