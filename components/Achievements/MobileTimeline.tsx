import React, { useRef, useState, useEffect } from 'react';
import { Achievement } from './types';

export const MobileTimeline: React.FC<{ items: Achievement[]; onCardClick: (a: Achievement) => void }> = ({ items, onCardClick }) => (
    <div style={{ position: 'relative', zIndex: 10, maxWidth: 480, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ position: 'absolute', left: 38, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg,#f97316,rgba(249,115,22,0.1))' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {items.map((a, i) => <MobileCard key={a.id} a={a} idx={i} onClick={() => onCardClick(a)} />)}
        </div>
    </div>
);

export const MobileCard: React.FC<{ a: Achievement; idx: number; onClick: () => void }> = ({ a, idx, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} onClick={onClick} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(24px)', transition: `opacity 0.5s ease ${idx * 0.04}s, transform 0.5s ease ${idx * 0.04}s`, cursor: 'pointer' }}>
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: '#0b0f19', border: '2px solid #f97316', boxShadow: '0 0 10px rgba(249,115,22,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginTop: 8, zIndex: 1 }}>{a.icon}</div>
            <div style={{ flex: 1, background: 'rgba(10,12,20,0.82)', border: '1px solid rgba(249,115,22,0.22)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#f97316', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 5px' }}>{a.date}</p>
                <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 13, color: '#f5f0e8', margin: '0 0 6px', fontVariant: 'small-caps' }}>{a.title}</h3>
                <p style={{ fontSize: 11, color: '#9a8878', lineHeight: 1.55, margin: 0 }}>{a.description}</p>
            </div>
        </div>
    );
};
