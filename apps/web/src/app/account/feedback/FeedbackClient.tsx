'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Frown, Meh, Smile, Store,
  Star, Package, Truck, Smartphone, Camera, ArrowRight,
  Annoyed, Laugh, ArrowLeft, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { userApi } from '@/lib/api/user';

export function FeedbackClient() {
  const router = useRouter();
  
  // Form State
  const [experience, setExperience] = useState<number | null>(4);
  const [topic, setTopic] = useState<string>('overall');
  const [text, setText] = useState<string>('');
  const [nps, setNps] = useState<number | null>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const EXPERIENCES = [
    { value: 1, label: 'Very Poor', icon: <Annoyed className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" /> },
    { value: 2, label: 'Poor', icon: <Frown className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" /> },
    { value: 3, label: 'Average', icon: <Meh className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" /> },
    { value: 4, label: 'Good', icon: <Smile className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" /> },
    { value: 5, label: 'Excellent', icon: <Laugh className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" /> },
  ];

  const TOPICS = [
    { id: 'overall', label: 'Overall Experience', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'product', label: 'Product Quality', icon: <Package className="w-5 h-5" /> },
    { id: 'delivery', label: 'Delivery Experience', icon: <Truck className="w-5 h-5" /> },
    { id: 'store', label: 'Store Experience', icon: <Store className="w-5 h-5" /> },
    { id: 'app', label: 'App Experience', icon: <Smartphone className="w-5 h-5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      await userApi.submitFeedback({
        experience: experience || 5,
        topic,
        text,
        nps: nps ?? 10,
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setErrorMessage(error.message || 'Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      {/* Background Gradient for Mobile Top Area */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0B2A99] via-[#0B2A99]/80 to-transparent pointer-events-none z-0 lg:hidden" />

      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <AccountSidebar />

        <div className="flex-1 w-full min-w-0 flex flex-col pt-2">
          
          {isSuccess ? (
            /* Success State */
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-surface-200/80 text-center flex flex-col items-center justify-center my-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-[#192168] mb-2">Thank you for your feedback!</h2>
              <p className="text-sm text-surface-500 max-w-md mb-8 leading-relaxed">
                Your thoughts and ratings have been received. We actively use customer suggestions to make your neighborhood shopping faster and better every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 rounded-xl border border-surface-200 text-sm font-bold text-surface-700 hover:bg-surface-50 transition"
                >
                  Submit More Feedback
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/account')}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-sm transition"
                >
                  Return to Account Hub
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              
              {/* Header Area */}
              <div className="flex items-start justify-between relative mt-2 lg:mt-0 lg:p-6 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-surface-100">
                <div className="flex-1 min-w-0 pr-4 z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden">
                      <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-[24px] md:text-[32px] font-extrabold text-white lg:text-[#192168] leading-tight">Feedback</h1>
                  </div>
                  <p className="text-[12px] md:text-[14px] text-white/90 lg:text-surface-600 font-medium lg:font-normal pl-8 lg:pl-0">We value your feedback and are always looking to improve.</p>
                </div>

                {/* Speech Bubble Graphic */}
                <div className="relative shrink-0 w-24 h-16 pointer-events-none mt-2 z-0">
                  <div className="w-16 h-12 bg-gray-200/50 rounded-xl rounded-br-none absolute bottom-0 right-8 z-0 shadow-sm blur-[1px]" />
                  <div className="w-20 h-14 bg-[#1668F6] rounded-xl rounded-bl-none relative z-10 flex items-center justify-center gap-1 shadow-md ml-auto">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="absolute top-0 right-1 text-yellow-400 text-lg">✦</div>
                  <div className="absolute bottom-2 -left-2 text-blue-400 text-sm">✦</div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Main Form Container */}
              <div className="bg-white lg:bg-transparent rounded-none lg:rounded-2xl flex flex-col gap-8 -mx-4 px-4 lg:mx-0 lg:px-0">
                
                {/* Overall Rating Section */}
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#192168] mb-1">How was your overall experience?</h3>
                  <p className="text-[12px] text-surface-500 mb-4">Rate your satisfaction with recent orders and deliveries</p>
                  
                  <div className="flex items-center justify-between gap-1 sm:gap-4 max-w-xl">
                    {EXPERIENCES.map((item) => {
                      const isSelected = experience === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setExperience(item.value)}
                          className={`flex-1 py-3 px-1 rounded-xl flex flex-col items-center gap-2 transition-all ${
                            isSelected 
                              ? 'bg-blue-50 text-[#1668F6] font-bold border-2 border-[#1668F6] shadow-xs scale-105' 
                              : 'text-surface-400 hover:text-surface-600 hover:bg-surface-50 border border-transparent'
                          }`}
                        >
                          <div className={isSelected ? 'text-[#1668F6]' : 'text-surface-400'}>
                            {item.icon}
                          </div>
                          <span className="text-[11px] sm:text-[12px] whitespace-nowrap">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic Selector */}
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#192168] mb-1">What would you like to review?</h3>
                  <p className="text-[11px] text-surface-500 mb-3">Select the area that best relates to your comments</p>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {TOPICS.map((t) => {
                      const isSelected = topic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTopic(t.id)}
                          className={`px-3.5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 border transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-[#1668F6] text-[#1668F6] shadow-2xs'
                              : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
                          }`}
                        >
                          <span className={isSelected ? 'text-[#1668F6]' : 'text-surface-400'}>{t.icon}</span>
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Comments */}
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#192168] mb-1">Tell us more</h3>
                  <p className="text-[11px] text-surface-500 mb-2">Share specific details about what went well or what we can improve</p>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your feedback here... (e.g. fast delivery, fresh items, easy checkout)"
                    className="w-full p-3.5 rounded-xl border border-surface-200 focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6] text-sm text-[#192168] placeholder:text-surface-400 outline-none transition"
                  />
                </div>

                {/* NPS Scale 0 - 10 */}
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#192168] mb-1">How likely are you to recommend us to friends and family?</h3>
                  <p className="text-[11px] text-surface-500 mb-3">0 = Not likely at all, 10 = Extremely likely</p>
                  
                  <div className="grid grid-cols-11 gap-1 sm:gap-2 max-w-xl">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNps(num)}
                        className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center border transition-all ${
                          nps === num
                            ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-2xs scale-105'
                            : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#192168] px-1 mt-1.5 max-w-xl">
                    <span>Not likely</span>
                    <span>Extremely likely</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 mb-6 bg-[#1668F6] text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors shadow-[0_4px_14px_rgba(22,104,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Feedback...
                    </>
                  ) : (
                    <>
                      Submit Feedback
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
