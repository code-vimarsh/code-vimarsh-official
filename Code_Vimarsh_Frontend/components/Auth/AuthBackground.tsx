import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/** Each orb: position, size and animation params are intentionally different
 *  so they feel organic rather than patterned.
 */
const ORBS = [
  { w: 520, h: 520, left: '-8%',  top: '-18%', color: 'rgba(255,106,0,0.10)', dur: 20, delay: 0,  xRange: [0, 40, -15, 20, 0],  yRange: [0, -30, 20, -12, 0]  },
  { w: 380, h: 380, left: '65%',  top: '55%',  color: 'rgba(210,40,0,0.08)',  dur: 26, delay: 4,  xRange: [0, -30, 18, -8,  0],  yRange: [0, 25, -15, 10,  0]  },
  { w: 280, h: 280, left: '40%',  top: '75%',  color: 'rgba(255,160,0,0.08)', dur: 18, delay: 8,  xRange: [0, 22, -10, 14, 0],   yRange: [0, -20, 12, -6,  0]  },
  { w: 220, h: 220, left: '80%',  top: '8%',   color: 'rgba(255,80,0,0.09)',  dur: 22, delay: 2,  xRange: [0, -18, 12, -6,  0],  yRange: [0, 18, -10, 8,   0]  },
  { w: 160, h: 160, left: '20%',  top: '45%',  color: 'rgba(255,120,0,0.07)', dur: 14, delay: 11, xRange: [0, 15, -8,  10,  0],  yRange: [0, -12, 8, -5,  0]  },
];

const AuthBackground: React.FC = () => {
  const [embers, setEmbers] = useState<{ id: number; size: number; left: number; top: number; isAlt: boolean; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        isAlt: Math.random() > 0.5,
        duration: Math.random() * 25 + 20,
        delay: -(Math.random() * 45),
      }))
    );
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* ── Floating orbs ── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  orb.w,
            height: orb.h,
            left:   orb.left,
            top:    orb.top,
            background: `radial-gradient(circle at 40% 40%, ${orb.color}, transparent 70%)`,
            filter: 'blur(56px)',
            willChange: 'transform',
          }}
          animate={{ x: orb.xRange, y: orb.yRange, scale: [1, 1.08, 0.96, 1.04, 1] }}
          transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Radial depth glow behind card center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(255,106,0,0.05) 0%, transparent 65%)',
        }}
      />

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Ember particles ── */}
      {embers.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#fbd38d',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px #f97316, 0 0 4px 1px #ea580c',
            opacity: 0,
            animation: `${p.isAlt ? 'auth-ember-alt' : 'auth-ember'} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes auth-ember {
          0%   { transform: translate(0,0) scale(0.8); opacity: 0; }
          20%  { opacity: 0.65; }
          50%  { transform: translate(40px,-140px) scale(1.1); opacity: 0.28; }
          80%  { opacity: 0.7; }
          100% { transform: translate(80px,-280px) scale(0.8); opacity: 0; }
        }
        @keyframes auth-ember-alt {
          0%   { transform: translate(0,0) scale(1); opacity: 0; }
          25%  { opacity: 0.75; }
          60%  { transform: translate(-30px,-190px) scale(1.2); opacity: 0.22; }
          85%  { opacity: 0.55; }
          100% { transform: translate(-60px,-380px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AuthBackground;
