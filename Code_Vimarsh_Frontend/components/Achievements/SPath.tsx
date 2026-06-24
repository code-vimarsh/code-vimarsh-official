import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SPath — orange glowing animated S-curve
// ─────────────────────────────────────────────────────────────────────────────
export const SPath: React.FC<{
    d: string; w: number; h: number; progress: number;
    totalLen: number; pathRef: React.RefObject<SVGPathElement | null>;
}> = ({ d, w, h, progress, totalLen, pathRef }) => {
    const isReady = totalLen >= 1;
    const drawn = isReady ? totalLen * Math.min(Math.max(progress, 0), 1) : 0;
    const remaining = isReady ? totalLen - drawn : 0;
    return (
        <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 10, overflow: 'visible' }} aria-hidden>
            <defs>
                <filter id="cv-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3.5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="cv-track" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.04" />
                </linearGradient>
            </defs>
            {/* Dim ghost track — always visible */}
            <path d={d} fill="none" stroke="url(#cv-track)" strokeWidth="2" strokeLinecap="round" />
            {/* Animated lit path — ref ALWAYS rendered so getTotalLength() works.
          Hidden via strokeOpacity=0 until path length is measured. */}
            <path
                ref={pathRef}
                d={d}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.2"
                strokeLinecap="round"
                filter={isReady ? 'url(#cv-glow)' : undefined}
                strokeOpacity={isReady ? 1 : 0}
                style={isReady ? { strokeDasharray: totalLen, strokeDashoffset: remaining } : {}}
            />
        </svg>
    );
};
