import React, { useRef, useState, useEffect } from 'react';
import { Achievement } from './types';

export const CARD_W = 310;

export const AchievementCard: React.FC<{ a: Achievement; side: 'left' | 'right'; onClick: () => void; isActive: boolean }> = ({ a, side, onClick, isActive }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? (isActive ? 'scale(1.02)' : 'none') : `translateX(${side === 'left' ? '30px' : '-30px'})`,
                transition: 'opacity 0.6s ease, transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                width: CARD_W,
                background: isActive ? 'rgba(13,15,24,0.90)' : 'rgba(10,12,20,0.82)',
                backdropFilter: 'blur(10px)',
                border: isActive ? '1px solid rgba(249,115,22,0.55)' : '1px solid rgba(249,115,22,0.22)',
                borderRadius: 12,
                padding: '16px 18px',
                boxShadow: isActive
                    ? '0 0 24px rgba(249,115,22,0.28), 0 0 52px rgba(249,115,22,0.10)'
                    : '0 0 22px rgba(249,115,22,0.09)',
                cursor: 'pointer',
                animation: isActive ? 'cv-card-pulse 2.2s ease-in-out infinite' : 'none',
                position: 'relative',
            } as React.CSSProperties}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(249,115,22,0.60)';
                el.style.boxShadow = '0 0 36px rgba(249,115,22,0.25)';
                if (!isActive) el.style.transform = 'scale(1.025)';
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = isActive ? 'rgba(249,115,22,0.55)' : 'rgba(249,115,22,0.22)';
                el.style.boxShadow = isActive
                    ? '0 0 24px rgba(249,115,22,0.28), 0 0 52px rgba(249,115,22,0.10)'
                    : '0 0 22px rgba(249,115,22,0.09)';
                el.style.transform = vis ? (isActive ? 'scale(1.02)' : 'none') : `translateX(${side === 'left' ? '30px' : '-30px'})`;
            }}
        >
            {/* Date row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#f97316', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{a.date}</span>
            </div>
            {/* Title */}
            <h3 style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 14, color: isActive ? '#fff' : '#f5f0e8', margin: '0 0 7px', lineHeight: 1.3, letterSpacing: '0.02em' }}>{a.title}</h3>
            {/* Desc */}
            <p style={{ fontSize: 12, color: '#9a8878', lineHeight: 1.6, margin: 0 }}>{a.description}</p>
            {/* Badge + click hint */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: '#f97316', border: '1px solid rgba(249,115,22,0.28)', borderRadius: 50, padding: '2px 10px', background: 'rgba(249,115,22,0.06)' }}>{a.category}</span>
                <span style={{ fontSize: 10, color: '#6a5a4a', fontFamily: 'JetBrains Mono,monospace' }}>click to expand ↗</span>
            </div>
        </div>
    );
};

export const CardKeyframes: React.FC = () => (
    <style>{`
    @keyframes cv-card-pulse {
      0%, 100% { box-shadow: 0 0 24px rgba(249,115,22,0.28), 0 0 52px rgba(249,115,22,0.10); }
      50%       { box-shadow: 0 0 32px rgba(249,115,22,0.38), 0 0 68px rgba(249,115,22,0.16); }
    }
  `}</style>
);
