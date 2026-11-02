'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Mic, Bell, CircleUserRound, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

interface SearchBarProps {
  placeholder?: string;
  notificationCount?: number;
}

export default function SearchBar({
  placeholder = "Search for products, stores and more...",
  notificationCount = 0,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuthStore();

  // Sync with current query param in URL whenever pathname/route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search') || params.get('q');
      if (q) {
        setQuery(q);
      } else if (!params.has('search') && !params.has('q')) {
        setQuery('');
      }
    }
  }, [pathname]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/products');
    }
  };

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return;

    interface SpeechRecognitionInstance {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: () => void;
      onend: () => void;
      onerror: () => void;
      onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
      start: () => void;
    }

    type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const input = document.getElementById('mobile-search-input');
      input?.focus();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          const cleanTranscript = transcript.trim();
          setQuery(cleanTranscript);
          router.push(`/products?search=${encodeURIComponent(cleanTranscript)}`);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
      const input = document.getElementById('mobile-search-input');
      input?.focus();
    }
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      openAuthModal('login');
    }
  };

  const handleNotificationsClick = () => {
    router.push('/account/notifications');
  };

  return (
    <div className="flex items-center gap-3.5 px-4 pb-3.5">
      {/* Search Input Form Pill */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-sm relative min-w-0"
      >
        <button
          type="submit"
          aria-label="Search"
          className="shrink-0 p-1 text-[#1E293B] hover:text-[#1668F6] transition-colors cursor-pointer"
        >
          <Search className="h-5 w-5" strokeWidth={2} />
        </button>
        <input
          id="mobile-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-500/90 font-normal focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              const input = document.getElementById('mobile-search-input');
              input?.focus();
            }}
            className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          aria-label="Voice search"
          onClick={handleVoiceSearch}
          className={`shrink-0 p-1 transition-colors ${
            isListening ? 'text-red-500 animate-pulse' : 'text-[#1E293B] hover:text-[#1668F6]'
          }`}
        >
          <Mic className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </form>

      {/* Notification Bell */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={handleNotificationsClick}
        className="relative text-white hover:opacity-85 transition-opacity shrink-0 cursor-pointer p-0.5"
      >
        <Bell className="h-[25px] w-[25px]" strokeWidth={1.75} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold text-white shadow-sm border border-white/20">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Profile Icon */}
      <button
        type="button"
        aria-label="User profile"
        onClick={handleUserClick}
        className="text-white hover:opacity-85 transition-opacity shrink-0 cursor-pointer p-0.5"
      >
        <CircleUserRound className="h-[25px] w-[25px]" strokeWidth={1.6} />
      </button>
    </div>
  );
}
