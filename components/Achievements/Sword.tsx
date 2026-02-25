import React, { useState, useEffect } from 'react';

export const FiredSword: React.FC<{
    w: number; h: number; progress: number;
    pathRef: React.RefObject<SVGPathElement | null>;
    totalLen: number;
}> = ({ w, h, progress, pathRef, totalLen }) => {
    const [pos, setPos] = useState<{ x: number; y: number; angle: number } | null>(null);

    // Compute position + tangent angle so sword always faces direction of travel
    useEffect(() => {
        const p = pathRef.current;
        if (!p || totalLen === 0) return;
        const dist = Math.min(Math.max(progress, 0), 1) * totalLen;
        const pt = p.getPointAtLength(dist);
        // Sample slightly ahead to get the tangent direction
        const eps = Math.min(3, totalLen * 0.005);
        const pt2 = p.getPointAtLength(Math.min(dist + eps, totalLen - 0.01));
        // atan2(dy, dx) − 90° aligns the sword tip (+Y local) with movement direction
        const angleDeg = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI) - 90;
        setPos({ x: pt.x, y: pt.y, angle: angleDeg });
    }, [progress, pathRef, totalLen]);

    if (!pos) return null;

    return (
        <svg
            width={w} height={h}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 20, overflow: 'visible' }}
            aria-hidden
        >
            <defs>
                {/* Blade metallic fill */}
                <linearGradient id="fs-blade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0a0a18" />
                    <stop offset="35%" stopColor="#1a0d04" />
                    <stop offset="65%" stopColor="#0d1018" />
                    <stop offset="100%" stopColor="#050508" />
                </linearGradient>
                <filter id="fs-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="2.2" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {/* Outer g: GPU-accelerated position + tangent rotation via SVG attribute */}
            <g transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`}>
                {/* Inner g: breathing scale animation via CSS — isolated from SVG transform */}
                <g style={{
                    animation: 'fs-breathe 2.4s ease-in-out infinite',
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                }}>

                    {/* BLADE */}
                    <path
                        d="M 0,-22 L 4.5,10 L 0,27 L -4.5,10 Z"
                        fill="url(#fs-blade)"
                        filter="url(#fs-glow)"
                    />
                    {/* Blade orange edge highlight */}
                    <path
                        d="M 0,-22 L 4.5,10 L 0,27 L -4.5,10 Z"
                        fill="none"
                        stroke="#f97316" strokeWidth="0.9" strokeOpacity="0.65"
                    />
                    {/* Blade center ridge — subtle metallic sheen */}
                    <line x1="0" y1="-20" x2="0" y2="25"
                        stroke="rgba(249,115,22,0.22)" strokeWidth="1.2" strokeLinecap="round" />

                    {/* CROSS-GUARD */}
                    <path
                        d="M -11,-22 L -6.5,-24.5 L 6.5,-24.5 L 11,-22 L 8.5,-19.5 L -8.5,-19.5 Z"
                        fill="#1a0c04" stroke="#f97316" strokeWidth="0.9" filter="url(#fs-glow)"
                    />

                    {/* GRIP */}
                    <rect x="-3.5" y="-38" width="7" height="14" rx="2.5" fill="#110800" />
                    {[-35, -32, -29].map(y => (
                        <line key={y} x1="-3.5" y1={y} x2="3.5" y2={y}
                            stroke="#f97316" strokeWidth="0.55" strokeOpacity="0.38" />
                    ))}

                    {/* POMMEL */}
                    <circle cx="0" cy="-43" r="5" fill="#1a0c04" stroke="#f97316" strokeWidth="1" filter="url(#fs-glow)" />
                    <circle cx="0" cy="-43" r="2.2" fill="#f97316" opacity="0.75" />
                </g>
            </g>

            {/* Breathing keyframe — injected once, scoped inside this SVG */}
            <style>{`
        @keyframes fs-breathe {
          0%, 100% { transform: scale(0.93); opacity: 0.82; }
          50%       { transform: scale(1.18); opacity: 1;    }
        }
      `}</style>
        </svg>
    );
};
