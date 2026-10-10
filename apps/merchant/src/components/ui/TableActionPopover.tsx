import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface TableActionPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
  width?: number | string;
}

export const TableActionPopover: React.FC<TableActionPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = '',
  align = 'right',
  width,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'bottom' | 'top' }>({
    top: 0,
    left: 0,
    placement: 'bottom',
  });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverEl = popoverRef.current;
    const menuWidth = popoverEl ? popoverEl.offsetWidth : 208; // default ~w-52
    const menuHeight = popoverEl ? popoverEl.offsetHeight : 220;

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let top: number;
    let placement: 'bottom' | 'top' = 'bottom';

    if (spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow) {
      // Flip upwards if not enough room below
      top = triggerRect.top - menuHeight - 4;
      placement = 'top';
    } else {
      top = triggerRect.bottom + 4;
      placement = 'bottom';
    }

    let left: number;
    if (align === 'right') {
      left = triggerRect.right - menuWidth;
    } else {
      left = triggerRect.left;
    }

    // Boundary collision guards: clamp within screen margins
    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }
    if (top < 12) {
      top = 12;
    }

    setCoords({ top, left, placement });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const handleScrollOrResize = (e: Event) => {
      // If user scrolls inside the popover itself, keep it open
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      }}
      className={`bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-100 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
};
