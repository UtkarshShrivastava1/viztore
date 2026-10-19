'use client'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import RetailCategories from "@/components/home/RetailCategories";
import CustomerSection from "@/components/home/CustomerSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { useRef } from "react";

export default function Home() {

  const heroRef = useRef<HTMLDivElement>(null); // Explicitly type the ref to HTMLDivElement



  return (
    <>
      <Navbar />
      <main > {/* Adjust padding to match Navbar height (h-18 = 72px) */}
        {/* Pass the ref to the Hero component */}
        <div ref={heroRef}>
          <Hero />
        </div>
        {/* <TrustedBrands /> */}
        <ProblemSection />
        <HowItWorks />
        <Features />
        <RetailCategories />
        <CustomerSection />
        <WhyChooseUs />
        {/* <CTASection /> */}
      </main>
      <Footer />
    </>
  );
}
