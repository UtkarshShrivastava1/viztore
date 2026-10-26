'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2, Search, Camera, Filter } from 'lucide-react';
import { usePdpStore } from '@/stores/pdp.store';

interface ReviewItem {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  variantInfo: string;
  title: string;
  comment: string;
  helpfulCount: number;
  photos?: string[];
  verified: boolean;
}

const SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Aarav Sharma',
    rating: 5,
    date: '2 days ago',
    variantInfo: 'Size: L • Color: Navy Blue',
    title: 'Exceptional fabric quality and true-to-size fit!',
    comment:
      'The cotton feels extremely premium and breathable for all-day wear. The stitch precision and neckline structure hold up really well even after multiple washes. Local store delivery arrived within 35 minutes.',
    helpfulCount: 42,
    photos: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
    ],
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Priya Patel',
    rating: 5,
    date: '1 week ago',
    variantInfo: 'Size: M • Color: Olive Green',
    title: 'Best casual t-shirt in this segment',
    comment:
      'Completely satisfied with the color depth and finish. Love that I was able to buy it directly from my nearby neighborhood retailer with instant delivery!',
    helpfulCount: 19,
    photos: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80',
    ],
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Rohan Verma',
    rating: 4,
    date: '2 weeks ago',
    variantInfo: 'Size: XL • Color: Black',
    title: 'Solid comfort and good styling',
    comment:
      'Very comfortable for gym as well as casual outings. Sleeve length is just right. Highly recommended if you prefer regular drape fit.',
    helpfulCount: 8,
    verified: true,
  },
];

const STAR_DISTRIBUTION = [
  { stars: 5, percentage: 74, count: 947 },
  { stars: 4, percentage: 17, count: 218 },
  { stars: 3, percentage: 5, count: 64 },
  { stars: 2, percentage: 2, count: 26 },
  { stars: 1, percentage: 2, count: 25 },
];

export function ProductReviews() {
  const { upvotedReviews, toggleReviewUpvote } = usePdpStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  const filteredReviews = SAMPLE_REVIEWS.filter((rev) => {
    const matchesSearch =
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStar = selectedStarFilter ? rev.rating === selectedStarFilter : true;
    return matchesSearch && matchesStar;
  });

  return (
    <div className="space-y-8">
      {/* Header & Overall Score Summary */}
      <div className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          {/* Rating Number & Stars */}
          <div className="flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-surface-200 pb-6 lg:pb-0 lg:pr-8 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-[#061842] tracking-tight">
                4.7
              </span>
              <div className="flex items-center gap-1 mt-1.5 text-amber-500">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                ))}
                <Star className="w-4 h-4 fill-amber-500/70 stroke-amber-500" />
              </div>
              <span className="text-xs font-semibold text-surface-500 mt-1">
                1,280 Verified Ratings
              </span>
            </div>

            <div className="space-y-1 text-xs text-surface-600 font-medium">
              <p className="font-extrabold text-[#061842]">94% of customers</p>
              <p>recommend this product to a friend</p>
            </div>
          </div>

          {/* 5-Star Distribution Bars */}
          <div className="flex-1 w-full max-w-lg space-y-2">
            {STAR_DISTRIBUTION.map((item) => (
              <button
                key={item.stars}
                type="button"
                onClick={() =>
                  setSelectedStarFilter(selectedStarFilter === item.stars ? null : item.stars)
                }
                className="w-full flex items-center gap-3 text-xs group hover:opacity-80 transition-opacity"
              >
                <span className="w-7 font-bold text-surface-600 group-hover:text-[#1668F6] text-right">
                  {item.stars} ★
                </span>
                <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.stars >= 4 ? 'bg-[#1668F6]' : item.stars === 3 ? 'bg-amber-500' : 'bg-surface-300'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-9 font-semibold text-surface-500 text-left">
                  {item.percentage}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Buyer Photo Carousel */}
        <div className="mt-6 pt-6 border-t border-surface-100">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-[#1668F6]" />
            <h4 className="text-xs font-extrabold text-[#061842] uppercase tracking-wider">
              Customer Photos (184)
            </h4>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&auto=format&fit=crop&q=80',
            ].map((src, idx) => (
              <div
                key={idx}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-surface-200 hover:scale-105 transition-transform cursor-pointer shadow-2xs"
              >
                <img src={src} alt="Customer upload" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within customer reviews..."
            className="w-full h-10 pl-9 pr-4 text-xs font-semibold text-[#061842] bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1668F6] placeholder:font-normal placeholder:text-surface-400 shadow-2xs"
          />
        </div>

        {selectedStarFilter && (
          <button
            type="button"
            onClick={() => setSelectedStarFilter(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#1668F6] text-xs font-bold border border-blue-200 self-start sm:self-auto"
          >
            <Filter className="w-3.5 h-3.5" /> Filtering {selectedStarFilter}★ reviews • Clear
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const isUpvoted = !!upvotedReviews[rev.id];
            const currentHelpful = rev.helpfulCount + (isUpvoted ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6 shadow-2xs transition-shadow hover:shadow-xs"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-black">
                        {rev.rating} ★
                      </span>
                      <h4 className="text-sm font-extrabold text-[#061842]">
                        {rev.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-surface-500 flex-wrap">
                      <span className="font-bold text-[#061842]">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Buyer
                        </span>
                      )}
                      <span>•</span>
                      <span>{rev.date}</span>
                      <span>•</span>
                      <span className="text-surface-400">{rev.variantInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm font-medium text-surface-600 leading-relaxed mt-3">
                  {rev.comment}
                </p>

                {/* Photos if any */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex gap-2.5 mt-3.5">
                    {rev.photos.map((img, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-surface-200"
                      >
                        <img
                          src={img}
                          alt="Review attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Upvote Button */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-100">
                  <span className="text-[11px] text-surface-400 font-medium">
                    Was this review helpful to you?
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleReviewUpvote(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                      isUpvoted
                        ? 'bg-blue-50 text-[#1668F6] border-[#1668F6]/30'
                        : 'bg-surface-50 hover:bg-surface-100 text-surface-600 border-surface-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-surface-200 text-surface-500 text-xs font-medium">
            No reviews match your search query.
          </div>
        )}
      </div>
    </div>
  );
}
