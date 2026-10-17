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
    href: '/deals',
    badge: 'BIG DEALS',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'NEW\nARRIVALS',
    subtitle: 'Fresh collection from top local boutiques',
    cta: 'Explore Now',
    href: '/products?category=fashion',
    badge: 'FRESH DROPS',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
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
      <div className="relative rounded-[2rem] overflow-hidden group min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[300px] w-full bg-gradient-to-r from-[#D5E5FF] via-[#E8F1FF] to-[#DEECFF] shadow-xs flex items-center">
        
        {/* Center Image (Extended & Overlapped) */}
        <div className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none z-10 overflow-hidden">
          <img 
            src={slide.imageUrl} 
            alt={slide.title.replace('\n', ' ')} 
            className="w-[85%] md:w-[60%] h-full lg:w-[50%] object-contain object-center scale-[1.05] drop-shadow-xl z-0 transition-transform duration-700 ease-out"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #081028 15%, #081028 85%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, #081028 15%, #081028 85%, transparent 100%)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';
            }}
          />

          {/* Decorative Cursive Text */}
          <div className="absolute right-[26%] bottom-[22%] -rotate-6 opacity-90 z-15 hidden lg:block">
            <span className="text-[#1668F6] text-3xl font-serif italic tracking-wide leading-tight">
              Local Stores<br/>Bigger Possibilities
            </span>
          </div>
        </div>

        {/* Left Content */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 z-20 pointer-events-none">
          <div className="max-w-[220px] sm:max-w-sm space-y-2.5 sm:space-y-3.5 pointer-events-auto">
            <span className="inline-block bg-white text-[#1668F6] text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs uppercase tracking-wider">
              {slide.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1538] leading-[1.1] tracking-tight whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-[#0B1538]/80 text-xs sm:text-sm font-medium leading-snug max-w-[260px]">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 mt-2 sm:mt-3 rounded-full bg-[#0B1538] text-white text-xs sm:text-sm font-bold hover:bg-[#1668F6] transition-colors shadow-md shadow-[#0B1538]/15"
            >
              {slide.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Trust Bar (Overlaps the image slightly) */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[280px] xl:w-[320px] flex-col justify-center gap-4 px-6 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#DEECFF] via-[#DEECFF]/80 to-transparent -z-10" />
          
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3.5">
              <div className="shrink-0 text-[#1668F6] p-2 bg-white/80 backdrop-blur-md rounded-full shadow-2xs border border-blue-100/60">
                <item.icon strokeWidth={1.75} className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{item.label}</h4>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-snug">{item.description}</p>
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
