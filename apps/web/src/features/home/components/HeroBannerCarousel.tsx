'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const promoSlides = [
  {
    id: 1,
    title: 'UP TO\n50% OFF',
    subtitle: 'On top electronics, fashion & daily essentials from local stores near you',
    cta: 'Shop Now',
    href: '/deals',
    badge: '⚡ MEGA LOCAL DEALS',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    bgGradient: 'from-[#D5E5FF] via-[#E8F1FF] to-[#DEECFF]',
    accentColor: '#1668F6',
  },
  {
    id: 2,
    title: 'FRESH\nFASHION',
    subtitle: 'Latest collections & seasonal trends from premium local boutiques',
    cta: 'Explore Styles',
    href: '/category/fashion',
    badge: '✨ NEW ARRIVALS',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    bgGradient: 'from-[#FFE8E8] via-[#FFF2F2] to-[#FFEFEF]',
    accentColor: '#E11D48',
  },
  {
    id: 3,
    title: 'LOCAL\nFAVORITES',
    subtitle: 'Support neighborhood shops with lightning-fast 30-min doorstep delivery',
    cta: 'Browse Stores',
    href: '/stores',
    badge: '🚀 HYPERLOCAL EXPRESS',
    imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800',
    bgGradient: 'from-[#E1F7EB] via-[#F1FAF5] to-[#E8F8F0]',
    accentColor: '#059669',
  },
];

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'Under 30 mins' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% Protected' },
  { icon: RotateCcw, label: 'Easy Returns', description: 'At Doorstep' },
  { icon: Headphones, label: '24x7 Support', description: 'Always Here' },
];

export function HeroBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative rounded-[2rem] overflow-hidden group min-h-[290px] sm:min-h-[330px] md:min-h-[370px] lg:min-h-[340px] w-full shadow-xs border border-blue-100/50">
        
        {/* Render all slides stacked with smooth cross-fade transition */}
        {promoSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Center / Right Hero Graphic with Smooth Scaling */}
              <div className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none z-10 overflow-hidden">
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title.replace('\n', ' ')} 
                  className={`w-[85%] md:w-[60%] h-full lg:w-[48%] object-contain object-center drop-shadow-xl z-0 transition-transform duration-700 ease-out ${
                    isActive ? 'scale-[1.03]' : 'scale-95'
                  }`}
                  style={{ 
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #081028 15%, #081028 85%, transparent 100%)', 
                    maskImage: 'linear-gradient(to right, transparent 0%, #081028 15%, #081028 85%, transparent 100%)' 
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Decorative Cursive Accent */}
                <div className="absolute right-[26%] bottom-[18%] -rotate-6 opacity-85 z-15 hidden lg:block pointer-events-none">
                  <span className="text-[#1668F6] text-3xl font-serif italic tracking-wide leading-tight">
                    Shop Local<br/>Live Better
                  </span>
                </div>
              </div>

              {/* Left Content with Micro-Stagger */}
              <div className="absolute inset-y-0 left-0 w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 z-20 pointer-events-none">
                <div className={`max-w-[240px] sm:max-w-sm space-y-2.5 sm:space-y-3.5 pointer-events-auto transition-all duration-500 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}>
                  <span className="inline-block bg-white text-[#1668F6] text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs uppercase tracking-wider border border-blue-50">
                    {slide.badge}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1538] leading-[1.08] tracking-tight whitespace-pre-line">
                    {slide.title}
                  </h2>
                  <p className="text-[#0B1538]/80 text-xs sm:text-sm font-medium leading-snug max-w-[270px]">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 mt-1.5 sm:mt-2.5 rounded-full bg-[#0B1538] text-white text-xs sm:text-sm font-extrabold hover:bg-[#1668F6] transition-all duration-200 shadow-md shadow-[#0B1538]/15 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
                  >
                    {slide.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Right Trust Bar (Desktop Viewport - Persistent on Top) */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[280px] xl:w-[320px] flex-col justify-center gap-3.5 px-6 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-white/60 via-white/30 to-transparent -z-10 backdrop-blur-[2px]" />
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3.5 pointer-events-auto group/item">
              <div className="shrink-0 text-[#1668F6] p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-xs border border-blue-100/60 transition-transform duration-200 group-hover/item:scale-105">
                <item.icon strokeWidth={2} className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0B1538] leading-snug">{item.label}</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls (Visible on Desktop Hover) */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prevSlide}
          className="hidden md:flex items-center justify-center absolute left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md hover:shadow-lg backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
          className="hidden md:flex items-center justify-center absolute right-4 lg:right-[300px] xl:right-[340px] w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md hover:shadow-lg backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-30 pointer-events-auto">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'bg-[#0B1538] w-7 shadow-xs' : 'bg-[#0B1538]/25 w-2 hover:bg-[#0B1538]/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
