import React, { useState, createContext, useContext } from 'react';
import { X, Play } from 'lucide-react';
import { MerchantNavbar } from './MerchantNavbar.js';
import { MerchantFooter } from './MerchantFooter.js';
import { VideoTutorialItem } from './VideoCard.js';

interface VideoModalContextType {
  openVideoModal: (video: VideoTutorialItem) => void;
  closeVideoModal: () => void;
}

const VideoModalContext = createContext<VideoModalContextType>({
  openVideoModal: () => {},
  closeVideoModal: () => {},
});

export const useVideoModal = () => useContext(VideoModalContext);

interface MerchantPublicLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onGoToLogin?: () => void;
  onGoToSignup?: () => void;
  children: React.ReactNode;
}

export const MerchantPublicLayout: React.FC<MerchantPublicLayoutProps> = ({
  currentRoute,
  onNavigate,
  onGoToLogin,
  onGoToSignup,
  children,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoTutorialItem | null>(null);

  const openVideoModal = (video: VideoTutorialItem) => {
    setActiveVideo(video);
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
  };

  return (
    <VideoModalContext.Provider value={{ openVideoModal, closeVideoModal }}>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0038ed] selection:text-white">
        {/* Universal Sticky Header */}
        <MerchantNavbar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          onGoToLogin={onGoToLogin}
          onGoToSignup={onGoToSignup}
        />

        {/* Page Content Body */}
        <main className="flex-1 w-full">{children}</main>

        {/* Universal 4/5-Column Footer */}
        <MerchantFooter onNavigate={onNavigate} />

        {/* Video Tutorial Interactive Preview Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={closeVideoModal}
          >
            <div
              className="bg-slate-900 text-white rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-700 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs text-slate-400">• {activeVideo.duration}</span>
                </div>
                <button
                  type="button"
                  onClick={closeVideoModal}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Mockup Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-radial from-blue-900/30 to-slate-950 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-xl mb-4 animate-pulse">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <h3 className="text-lg font-bold text-white max-w-md">{activeVideo.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm">
                    Interactive Walkthrough &amp; Video Guide for Retail Partners.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-slate-900 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400">
                <span>Duration: {activeVideo.duration}</span>
                <button
                  type="button"
                  onClick={() => {
                    closeVideoModal();
                    if (onGoToSignup) onGoToSignup();
                    else onNavigate('/register');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold transition-colors cursor-pointer"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VideoModalContext.Provider>
  );
};
