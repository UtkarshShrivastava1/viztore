import React from 'react';
import { Play } from 'lucide-react';

export interface VideoTutorialItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

interface VideoCardProps {
  video: VideoTutorialItem;
  onPlay: (video: VideoTutorialItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  return (
    <div
      onClick={() => onPlay(video)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0038ed]/30 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Thumbnail Area with Mock Screen & Play Trigger */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-95">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] text-slate-400 ml-2 font-mono">{video.category}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-xs font-medium text-slate-300 line-clamp-1">{video.title}</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#002fcf] transition-all">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold rounded-md">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill */}
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0038ed] text-[11px] font-bold uppercase tracking-wider mb-2">
            {video.category}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors leading-snug">
            {video.title}
          </h4>
          {video.description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
