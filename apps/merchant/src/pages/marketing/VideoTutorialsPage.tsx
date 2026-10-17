import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { VideoCard } from '../../components/marketing/VideoCard.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface VideoTutorialsPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const VideoTutorialsPage: React.FC<VideoTutorialsPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Videos');
  const { openVideoModal } = useVideoModal();

  const categories = [
    'All Videos',
    'Getting Started',
    'Store Setup',
    'Product Management',
    'Orders & Delivery',
    'Inventory',
    'Marketing & Growth',
    'Billing & Payments',
  ];

  const gettingStartedVideos = MARKETING_DATA.videos.slice(0, 4);
  const latestVideos = MARKETING_DATA.videos.slice(4, 8);

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header (Mockup 5.3.png) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/learn/guides')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Learn
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">Video Tutorials</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                VIDEO TUTORIALS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Step-by-Step Videos to Help You{' '}
                <span className="text-[#0038ed]">Get Started</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Watch short videos to learn how to set up, manage and grow your store on {branding.appName}.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player Graphic */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div
                onClick={() => gettingStartedVideos[0] && openVideoModal(gettingStartedVideos[0])}
                className="w-full max-w-md aspect-video bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-white flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-300">Featured Walkthrough</span>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">3:12</span>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-[#0038ed] text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">How to Set Up Your Store</h4>
                </div>

                <div className="text-[11px] text-slate-400 text-center">Click to play tutorial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs */}
      <div className="py-6 bg-white border-b border-slate-100 sticky top-20 z-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0038ed] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Getting Started with {branding.appName} Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Getting Started with {branding.appName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Learn the basics and set up your store in a few simple steps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gettingStartedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v) => openVideoModal(v)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Playlists */}
      <section className="py-14 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Popular Playlists</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Watch curated video playlists based on your needs.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              onClick={() => gettingStartedVideos[0] && openVideoModal(gettingStartedVideos[0])}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Complete Setup Guide</h4>
              <p className="text-[11px] text-[#0038ed] font-semibold mt-1">8 videos</p>
            </div>
            <div
              onClick={() => gettingStartedVideos[2] && openVideoModal(gettingStartedVideos[2])}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Product Management</h4>
              <p className="text-[11px] text-[#0038ed] font-semibold mt-1">10 videos</p>
            </div>
            <div
              onClick={() => latestVideos[0] && openVideoModal(latestVideos[0])}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Orders &amp; Delivery</h4>
              <p className="text-[11px] text-[#0038ed] font-semibold mt-1">7 videos</p>
            </div>
            <div
              onClick={() => latestVideos[1] && openVideoModal(latestVideos[1])}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Marketing &amp; Growth</h4>
              <p className="text-[11px] text-[#0038ed] font-semibold mt-1">6 videos</p>
            </div>
            <div
              onClick={() => latestVideos[2] && openVideoModal(latestVideos[2])}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Billing &amp; Payments</h4>
              <p className="text-[11px] text-[#0038ed] font-semibold mt-1">5 videos</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Latest Video Tutorials */}
      <section className="py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Latest Video Tutorials</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Watch our latest tutorials and feature updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v) => openVideoModal(v)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Banner */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Create Your Store on {branding.appName} Today
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              List your products, reach nearby customers and start receiving orders.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartSelling}
            className="px-6 py-3 rounded-xl bg-white text-[#0038ed] font-bold text-sm shadow-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Start Selling &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
