import React, { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// EmbersBackground — subtle animated glowing particles
// ─────────────────────────────────────────────────────────────────────────────
export const EmbersBackground: React.FC = () => {
    const [embers, setEmbers] = useState<any[]>([]);

    useEffect(() => {
        // Elegant and minimal: 35 embers over the entire long section
        const particles = Array.from({ length: 35 }).map((_, i) => {
            const size = Math.random() * 3 + 2; // 2px to 5px
            const isAlt = Math.random() > 0.5;
            const duration = Math.random() * 25 + 20; // 20s to 45s slow movement
            const delay = -(Math.random() * 45); // Start at random animation phases
            // Distribute evenly but randomly
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return { id: i, size, left, top, isAlt, duration, delay };
        });
        setEmbers(particles);
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
            {embers.map(p => (
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
                        boxShadow: '0 0 12px 2px #f97316, 0 0 4px 1px #ea580c',
                        opacity: 0,
                        animation: `${p.isAlt ? 'ember-drift-alt' : 'ember-drift'} ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
            <style>{`
        @keyframes ember-drift {
          0%   { transform: translate(0, 0) scale(0.8); opacity: 0; }
          20%  { opacity: 0.7; }
          50%  { transform: translate(40px, -150px) scale(1.1); opacity: 0.3; }
          80%  { opacity: 0.8; }
          100% { transform: translate(80px, -300px) scale(0.8); opacity: 0; }
        }
        @keyframes ember-drift-alt {
          0%   { transform: translate(0, 0) scale(1); opacity: 0; }
          25%  { opacity: 0.8; }
          60%  { transform: translate(-30px, -200px) scale(1.2); opacity: 0.2; }
          85%  { opacity: 0.6; }
          100% { transform: translate(-60px, -400px) scale(1); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// NodeDot — static orange dot at each achievement point ON the curve
// ─────────────────────────────────────────────────────────────────────────────
export const NodeDot: React.FC<{ cx: number; cy: number; w: number; h: number }> = ({ cx, cy, w, h }) => (
    <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 15, overflow: 'visible' }} aria-hidden>
        <circle cx={cx} cy={cy} r={7} fill="#0b0f19" stroke="#f97316" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.8))' }} />
        <circle cx={cx} cy={cy} r={3.5} fill="#f97316" />
    </svg>
);
