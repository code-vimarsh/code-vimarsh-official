/**
 * ImageCarousel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A lightweight, zero-dependency carousel / gallery for displaying multiple
 * images inside cards (EventCard, ProjectCard).
 *
 * • Single image  → renders a plain <img> (no chrome overhead)
 * • Multiple images → prev/next arrows + dot indicators, optional auto-play
 * • Preserves aspect-ratio via a fixed-height container passed as `className`
 * • Falls back to a placeholder icon if the image URL fails to load
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface ImageCarouselProps {
  /** Ordered list of image URLs / data-URIs. At least one expected. */
  images: string[];
  /** Alt text prefix for accessibility      */
  alt?: string;
  /** Height + additional Tailwind classes applied to the outer wrapper  */
  className?: string;
  /** Milliseconds between auto-advances. 0 = disabled (default)        */
  autoPlayMs?: number;
  /** Additional item rendered on top (e.g. a category badge overlay)   */
  overlay?: React.ReactNode;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt = 'image',
  className = 'h-48',
  autoPlayMs = 0,
  overlay,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [errored, setErrored]     = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auto-play ────────────────────────────────────────────────────────────
  const stopAuto = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    if (autoPlayMs > 0 && images.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((i) => (i + 1) % images.length);
      }, autoPlayMs);
    }
    return stopAuto;
  }, [autoPlayMs, images.length, stopAuto]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const go = useCallback((delta: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    stopAuto(); // pause auto-play once user interacts
    setActiveIdx((i) => (i + delta + images.length) % images.length);
  }, [images.length, stopAuto]);

  const onImgError = (idx: number) =>
    setErrored((prev) => new Set([...prev, idx]));

  // ── Single image (no carousel chrome) ─────────────────────────────────
  if (images.length === 0) {
    return (
      <div className={`relative w-full overflow-hidden bg-[#0f0f0f] shrink-0 ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <ImageOff size={32} className="text-surfaceLight" />
        </div>
        {overlay}
      </div>
    );
  }

  const singleMode = images.length === 1;

  return (
    <div className={`relative w-full overflow-hidden bg-surfaceLight shrink-0 ${className}`}>
      {/* Slides */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: idx === activeIdx ? 1 : 0, pointerEvents: idx === activeIdx ? 'auto' : 'none' }}
          aria-hidden={idx !== activeIdx}
        >
          {errored.has(idx) ? (
            <div className="w-full h-full flex items-center justify-center bg-[#0f0f0f]">
              <ImageOff size={28} className="text-surfaceLight" />
            </div>
          ) : (
            <img
              src={src}
              alt={`${alt} ${idx + 1}`}
              loading="lazy"
              onError={() => onImgError(idx)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      ))}

      {/* Overlay slot (e.g. category badge, live glow) */}
      {overlay}

      {/* Controls — only when multiple images */}
      {!singleMode && (
        <>
          {/* Prev */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => go(-1, e)}
            className="
              absolute left-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full flex items-center justify-center
              bg-black/50 backdrop-blur-sm border border-white/10
              text-white opacity-0 group-hover:opacity-100
              hover:bg-black/75 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
            "
          >
            <ChevronLeft size={14} />
          </button>

          {/* Next */}
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => go(1, e)}
            className="
              absolute right-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full flex items-center justify-center
              bg-black/50 backdrop-blur-sm border border-white/10
              text-white opacity-0 group-hover:opacity-100
              hover:bg-black/75 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
            "
          >
            <ChevronRight size={14} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={(e) => { e.stopPropagation(); stopAuto(); setActiveIdx(idx); }}
                className={`
                  rounded-full transition-all duration-300 border border-white/20
                  focus-visible:outline-none
                  ${idx === activeIdx ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}
                `}
              />
            ))}
          </div>

          {/* Counter badge (top-right, subtle) */}
          <div
            className="absolute top-2.5 right-2.5 z-20 text-[10px] font-mono
              px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/70 border border-white/10"
          >
            {activeIdx + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
