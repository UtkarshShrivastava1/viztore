'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const promoSlides = [
  {
    id: 1,
    title: 'UP TO\n50% OFF',
    subtitle: 'On top products from local stores near you',
    cta: 'Shop Now',
    href: '/products?category=deals',
    badge: 'BIG DEALS',
    imageUrl: '/banners/hero_center_products.png', // User will supply the transparent PNG of products
  },
  {
    id: 2,
    title: 'NEW\nARRIVALS',
    subtitle: 'Fresh collection from top local boutiques',
    cta: 'Explore Now',
    href: '/products?category=fashion',
    badge: 'FRESH DROPS',
    imageUrl: '/banners/hero_center_products.png',
  },
];

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'On orders above ₹199' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7 days return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% secure payments' },
  { icon: Headphones, label: 'Support', description: '24x7 assistance' },
];

export function HeroBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = promoSlides[currentSlide];

  return (
    <div className="w-full">
      <div className="relative rounded-[2rem] overflow-hidden group min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[300px] w-full bg-gradient-to-r from-[#D4E4FF] via-[#E6EFFF] to-[#E1ECFF] shadow-sm flex items-center">
        
        {/* Center Image (Extended & Overlapped) */}
        <div className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none z-10 overflow-hidden">
          
          
          <img 
            src={slide.imageUrl} 
            alt={slide.title.replace('\n', ' ')} 
            className=" w-[90%] md:w-[65%] h-full lg:w-[55%] object-contain object-center scale-[1.15] drop-shadow-2xl z-0 transition-transform duration-700 ease-out"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #081028 20%, #081028 80%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, #081028 20%, #081028 80%, transparent 100%)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800';
            }}
          />

          {/* Decorative Cursive Text */}
          <div className="absolute right-[25%] bottom-[25%] -rotate-12 opacity-80 z-15 hidden lg:block">
            <span className="text-brand-600 text-3xl font-serif italic tracking-wide leading-tight">
              Local Stores<br/>Bigger Possibilities
            </span>
          </div>
        </div>

        {/* Left Content */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 z-20 pointer-events-none">
          <div className="max-w-[200px] sm:max-w-sm space-y-3 sm:space-y-4 pointer-events-auto">
            <span className="inline-block bg-white text-brand-600 text-[10px] sm:text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
              {slide.badge}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#081028] leading-[1.1] tracking-tight whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-[#081028]/80 text-sm sm:text-base font-medium leading-snug max-w-[260px]">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 mt-2 sm:mt-4 rounded-xl bg-[#081028] text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-[#081028]/20"
            >
              {slide.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Trust Bar (Overlaps the image slightly) */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[300px] xl:w-[340px] flex-col justify-center gap-6 px-8 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#E1ECFF] via-[#E1ECFF]/70 to-transparent -z-10" />
          
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-5">
              <div className="shrink-0 text-brand-600 p-3.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm">
                <item.icon strokeWidth={1} className="w-12 h-12" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-bold text-gray-900 leading-[1.5] mb-1">{item.label}</h4>
                <p className="text-md text-gray-700 leading-[1.5]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation & Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40 pointer-events-auto">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-[#081028] w-6' : 'bg-[#081028]/20 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
