import React from 'react';
import { Star } from 'lucide-react';
import { branding } from '../../lib/branding.js';

export interface TestimonialItem {
  name: string;
  storeName: string;
  city: string;
  quote: string;
  rating?: number;
  avatarUrl?: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const rating = testimonial.rating ?? 5;
  const sanitizedQuote = testimonial.quote.replace(
    /Viztore/g,
    branding.appName
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
      {/* Quote */}
      <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed italic mb-6">
        "{sanitizedQuote}"
      </p>

      {/* Author & Store details */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {testimonial.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        )}

        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900 leading-tight">{testimonial.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {testimonial.storeName} • {testimonial.city}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
