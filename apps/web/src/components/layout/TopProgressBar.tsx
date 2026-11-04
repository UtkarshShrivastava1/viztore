'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress whenever the route finishes changing
  useEffect(() => {
    if (loading) {
      setProgress(100);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      finishTimerRef.current = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }
  }, [pathname, searchParams]);

  // Intercept all internal Link clicks for 0ms visual feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Don't intercept if modified click (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.href);
      const isInternal = url.origin === window.location.origin;
      const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search && url.hash;

      if (isInternal && !isSamePage && !target.target && target.getAttribute('download') === null) {
        // Start instant progress
        if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        setLoading(true);
        setProgress(25);

        timerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 150);
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="fixed top-0 left-0 right-0 z-[10000] h-[3px] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#1668F6] via-[#4C82FB] to-emerald-400 shadow-[0_0_10px_#1668F6] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: loading || progress === 100 ? 1 : 0,
        }}
      />
    </div>
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
