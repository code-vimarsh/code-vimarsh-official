/**
 * SectionBackground.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully reusable dark-theme section background that replicates the Blog section
 * background system exactly.
 *
 * Layer stack (bottom → top, z-index ascending):
 *  -2 ┌─ fixed viewport wrapper ────────────────────────────────────────────┐
 *     │  [0] Background image (configurable, default: blog-bg.png)          │
 *     │  [1] Dark semi-transparent overlay  rgba(4,4,6,0.72)                │
 *     │  [2] SVG corner-grid texture  opacity 0.04                          │
 *     │  [3] Ember particles  (40 floating orange glowing dots)              │
 *     │  [4] Radial orange ambient glow  (ellipse, top-30%, centered)        │
 *     │  [5] Top spotlight vignette  (soft cone from top edge)               │
 *  -2 └──────────────────────────────────────────────────────────────────────┘
 *   0   Content wrapper (relative, minHeight 100vh) → children render here
 *
 * Usage:
 *   <SectionBackground>
 *     <YourSectionContent />
 *   </SectionBackground>
 *
 * Props:
 *   children         – Content rendered above all background layers
 *   backgroundImage  – Path to the BG photo (default: '/assets/blog-bg.png')
 *   contentClassName – Extra Tailwind classes on the content wrapper div
 *   contentStyle     – Extra inline styles on the content wrapper div
 */

import React, { useState, useEffect, useRef, memo } from 'react';

// ─── Ember particle types ─────────────────────────────────────────────────────
interface EmberParticle {
  id: number;
  size: number;
  left: number;
  top: number;
  isAlt: boolean;
  duration: number;
  delay: number;
}

// ─── Ember particles — isolated sub-component (memo, no re-render on parent) ──
const EmberParticles: React.FC = memo(() => {
  const [embers, setEmbers] = useState<EmberParticle[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,          // 1.5 – 4.5 px
        left: Math.random() * 100,
        top: Math.random() * 100,
        isAlt: Math.random() > 0.5,
        duration: Math.random() * 28 + 18,       // 18 – 46 s
        delay: -(Math.random() * 46),            // stagger via negative delay
      }))
    );
  }, []); // runs once on mount

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {embers.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#ffb347',
            borderRadius: '50%',
            boxShadow:
              '0 0 10px 2px rgba(255,106,0,0.9), 0 0 4px 1px rgba(255,60,0,0.7)',
            opacity: 0,
            animation: `${p.isAlt ? 'sb-ember-alt' : 'sb-ember'} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Scoped keyframes — namespaced with "sb-" to avoid collisions */}
      <style>{`
        @keyframes sb-ember {
          0%   { transform: translate(0,0)   scale(0.8); opacity: 0;    }
          20%  { opacity: 0.75; }
          50%  { transform: translate(35px,-140px)  scale(1.1);  opacity: 0.35; }
          80%  { opacity: 0.7; }
          100% { transform: translate(70px,-300px)  scale(0.8);  opacity: 0;    }
        }
        @keyframes sb-ember-alt {
          0%   { transform: translate(0,0)   scale(1);   opacity: 0;    }
          25%  { opacity: 0.8; }
          60%  { transform: translate(-28px,-190px) scale(1.15); opacity: 0.25; }
          85%  { opacity: 0.65; }
          100% { transform: translate(-55px,-380px) scale(0.9);  opacity: 0;    }
        }
      `}</style>
    </div>
  );
});

EmberParticles.displayName = 'EmberParticles';

// ─── Props ────────────────────────────────────────────────────────────────────
interface SectionBackgroundProps {
  /** Section content rendered above all background layers */
  children: React.ReactNode;
  /** Background photo URL — defaults to the Blog section image */
  backgroundImage?: string;
  /** Extra classes applied to the content wrapper (z-10 is always included) */
  contentClassName?: string;
  /** Extra inline styles applied to the content wrapper */
  contentStyle?: React.CSSProperties;
}

// ─── Main component ───────────────────────────────────────────────────────────
const SectionBackground: React.FC<SectionBackgroundProps> = ({
  children,
  backgroundImage = '/assets/blog-bg.png',
  contentClassName = '',
  contentStyle = {},
}) => {
  // Prevent unnecessary re-renders of the background when the parent re-renders
  const bgRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── Layer stack: fixed viewport background ────────────────────────── */}
      {/*
       * position: fixed  → background is viewport-attached (like the Blog)
       * zIndex: -2       → sits below every page element
       * pointerEvents: none → never captures clicks
       */}
      <div
        ref={bgRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* ── Layer 0: Background photo ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ── Layer 1: Dark semi-transparent overlay ─────────────────────── */}
        {/* Identical to Blog: rgba(4,4,6,0.72) — lets warm library glow bleed */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(4,4,6,0.72)',
            zIndex: 1,
          }}
        />

        {/* ── Layer 2: SVG corner-grid texture ───────────────────────────── */}
        {/* 60×60 grid lines, opacity 0.04 — identical to Blog */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            opacity: 0.04,
            zIndex: 2,
          }}
        />

        {/* ── Layer 3: Ember particles (zIndex comes from the component) ─── */}
        <EmberParticles />

        {/* ── Layer 4: Soft radial orange ambient glow ────────────────────── */}
        {/* Ellipse centered at top-30% — identical to Blog */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(255,106,0,0.07) 0%, transparent 70%)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />

        {/* ── Layer 5: Top spotlight vignette ─────────────────────────────── */}
        {/* Soft cone from the very top edge — adds depth like a stage light */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: 480,
            background:
              'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,106,0,0.045) 0%, transparent 100%)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Content wrapper: always above background layers ──────────────── */}
      {/*
       * position: relative so children can use absolute/fixed internally.
       * minHeight: 100vh ensures the section fills the viewport.
       * No overflow: hidden here — let the section itself manage overflow.
       */}
      <div
        className={`relative z-10 ${contentClassName}`}
        style={{
          minHeight: '100vh',
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default SectionBackground;
