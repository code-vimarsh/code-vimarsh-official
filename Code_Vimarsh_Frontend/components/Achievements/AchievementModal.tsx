import React, { useEffect } from 'react';
import { Achievement } from './types';

export const AchievementModal: React.FC<{ a: Achievement; onClose: () => void }> = ({ a, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    // Prevent body scroll while modal open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5,7,14,0.75)',
                backdropFilter: 'blur(8px)',
                animation: 'cv-fadeIn 0.22s ease',
                padding: '20px',
            }}
        >
            {/* Modal panel */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 520,
                    background: 'rgba(10,12,22,0.97)',
                    border: '1px solid rgba(249,115,22,0.40)',
                    borderRadius: 18,
                    boxShadow: '0 0 60px rgba(249,115,22,0.22), 0 0 120px rgba(249,115,22,0.08)',
                    padding: '36px 38px 32px',
                    animation: 'cv-popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 16, right: 18,
                        background: 'rgba(249,115,22,0.10)',
                        border: '1px solid rgba(249,115,22,0.30)',
                        borderRadius: '50%',
                        width: 34, height: 34,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#f97316', fontSize: 18, lineHeight: 1,
                        transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,115,22,0.25)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,115,22,0.10)'; }}
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 40, right: 40, height: 2, background: 'linear-gradient(90deg,transparent,#f97316,transparent)', borderRadius: 2 }} />

                {/* Icon + Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{
                        width: 54, height: 54, borderRadius: 14,
                        background: 'rgba(249,115,22,0.10)',
                        border: '1px solid rgba(249,115,22,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26,
                        flexShrink: 0,
                        boxShadow: '0 0 18px rgba(249,115,22,0.18)',
                    }}>
                        {a.icon}
                    </div>
                    <div>
                        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#f97316', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 4px' }}>{a.date}</p>
                        <span style={{ display: 'inline-block', fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: '#f97316', border: '1px solid rgba(249,115,22,0.28)', borderRadius: 50, padding: '2px 10px', background: 'rgba(249,115,22,0.07)' }}>{a.category}</span>
                    </div>
                </div>

                {/* Title */}
                <h2 style={{
                    fontFamily: 'Cinzel,serif', fontWeight: 700,
                    fontSize: 'clamp(1.1rem,3vw,1.5rem)',
                    color: '#f5f0e8', margin: '0 0 14px',
                    lineHeight: 1.3,
                    letterSpacing: '0.03em',
                }}>
                    {a.title}
                </h2>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(249,115,22,0.15)', marginBottom: 18 }} />

                {/* Description */}
                <p style={{ fontSize: 14, color: '#b0a090', lineHeight: 1.75, margin: 0 }}>{a.description}</p>

                {/* Footer close hint */}
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a3a2a', marginTop: 28, textAlign: 'center', letterSpacing: '0.12em' }}>press ESC or click outside to close</p>
            </div>

            {/* Keyframe styles injected inline */}
            <style>{`
        @keyframes cv-fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cv-popIn   { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
      `}</style>
        </div>
    );
};
