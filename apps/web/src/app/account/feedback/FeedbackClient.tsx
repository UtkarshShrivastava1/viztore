'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Frown, Meh, Smile, Store,
  Star, Package, Truck, Smartphone, Camera, ArrowRight,
  Annoyed, Laugh, ArrowLeft
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function FeedbackClient() {
  const router = useRouter();
  
  // Form State
  const [experience, setExperience] = useState<number | null>(null);
  const [topic, setTopic] = useState<string>('overall');
  const [text, setText] = useState<string>('');
  const [nps, setNps] = useState<number | null>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    try {
      // TODO: Connect to backend API
      // await userApi.submitFeedback({ experience, topic, text, nps, images: [] });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Feedback submitted successfully! Thank you.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
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
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            
            {/* Header Area */}
            <div className="flex items-start justify-between relative mt-2 lg:mt-0 lg:p-6 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-surface-100">
              <div className="flex-1 min-w-0 pr-4 z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden">
                    <ArrowLeft className="w-6 h-6 text-white" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-white leading-tight">Feedback</h1>
                </div>
                <p className="text-[12px] md:text-[14px] text-white lg:text-surface-600 font-medium lg:font-normal pl-8 lg:pl-0">We value your feedback and are always looking to improve.</p>
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

            {/* Main Form Container */}
            <div className="bg-white lg:bg-transparent rounded-none lg:rounded-2xl flex flex-col gap-8 -mx-4 px-4 lg:mx-0 lg:px-0">
              
              {/* Experience Rating */}
              <div className="mt-4 lg:mt-0">
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-4">How was your experience with {branding.appName}?</h3>
                <div className="flex items-center justify-between w-full max-w-xl mx-auto">
                  {EXPERIENCES.map((exp) => (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => setExperience(exp.value)}
                      className={`flex flex-col items-center gap-2 transition-colors flex-1 ${
                        experience === exp.value ? 'text-[#1668F6]' : 'text-surface-400 hover:text-surface-600'
                      }`}
                    >
                      <div className={`rounded-full p-3 sm:p-4 border-[1.5px] transition-colors ${experience === exp.value ? 'border-[#1668F6] bg-blue-50/50 text-[#1668F6]' : 'border-surface-200 bg-white text-surface-400'}`}>
                        {exp.icon}
                      </div>
                      <span className={`text-[10px] sm:text-[12px] text-center leading-tight ${experience === exp.value ? 'font-bold text-[#1668F6]' : 'font-medium text-surface-500'}`}>
                        {exp.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Topic */}
              <div>
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-4">What is your feedback about?</h3>
                <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                  {TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={`flex flex-col items-center justify-center gap-2 py-4 px-3 w-[110px] shrink-0 rounded-[12px] border transition-all ${
                        topic === t.id 
                          ? 'border-[#1668F6] bg-blue-50/30 text-[#1668F6]' 
                          : 'border-surface-200 bg-white hover:border-surface-300 text-surface-500'
                      }`}
                    >
                      {t.icon}
                      <span className={`text-[11px] leading-tight text-center ${topic === t.id ? 'font-bold text-[#1668F6]' : 'font-semibold text-surface-500'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-1">Tell us more <span className="text-surface-400 font-medium text-[12px]">(Optional)</span></h3>
                <div className="relative mt-2">
                  <textarea 
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                    placeholder="Share your thoughts, suggestions or issues..."
                    className="w-full p-4 rounded-xl border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-[#192168] placeholder:text-surface-400 resize-none bg-white transition-colors"
                  />
                  <div className="absolute bottom-3 right-4 text-[10px] font-medium text-surface-400">
                    {text.length}/500
                  </div>
                </div>
              </div>

              {/* NPS Score */}
              <div>
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-4">Would you recommend {branding.appName} to others?</h3>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
                    {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNps(num)}
                        className={`w-10 h-10 shrink-0 rounded-md border flex items-center justify-center text-[14px] font-bold transition-colors ${
                          nps === num 
                            ? 'bg-[#1668F6] border-[#1668F6] text-white' 
                            : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#192168] px-1 mt-1">
                    <span>Not at all</span>
                    <span>Definitely</span>
                  </div>
                </div>
              </div>

              {/* Screenshots Upload */}
              <div>
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-0.5">Add Screenshots <span className="text-surface-400 font-medium text-[12px]">(Optional)</span></h3>
                <p className="text-[11px] text-surface-500 mb-3">You can upload screenshots to help us understand better.</p>
                
                <div className="w-[120px] h-24 rounded-[12px] border-[1.5px] border-dashed border-surface-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-surface-50 transition-colors group">
                  <Camera className="w-6 h-6 text-surface-400 group-hover:text-[#1668F6] transition-colors stroke-[1.5]" />
                  <div className="text-center">
                    <p className="text-[11px] font-semibold text-[#192168]">Upload Image</p>
                    <p className="text-[9px] text-surface-400">(Max 3 images)</p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*" />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 mb-6 bg-[#1668F6] text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors shadow-[0_4px_14px_rgba(22,104,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

