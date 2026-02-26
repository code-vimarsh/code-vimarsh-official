import React, { useState, useEffect } from 'react';

export const BlogEmbers: React.FC = () => {
    const [embers, setEmbers] = useState<{ id: number; size: number; left: number; top: number; isAlt: boolean; duration: number; delay: number }[]>([]);

    useEffect(() => {
        setEmbers(
            Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                size: Math.random() * 3 + 1.5,
                left: Math.random() * 100,
                top: Math.random() * 100,
                isAlt: Math.random() > 0.5,
                duration: Math.random() * 28 + 18,
                delay: -(Math.random() * 46),
            }))
        );
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
                        backgroundColor: '#ffb347',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px 2px rgba(255,106,0,0.9), 0 0 4px 1px rgba(255,60,0,0.7)',
                        opacity: 0,
                        animation: `${p.isAlt ? 'blog-ember-alt' : 'blog-ember'} ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
            <style>{`
        @keyframes blog-ember {
          0%   { transform: translate(0,0) scale(0.8); opacity: 0; }
          20%  { opacity: 0.75; }
          50%  { transform: translate(35px,-140px) scale(1.1); opacity: 0.35; }
          80%  { opacity: 0.7; }
          100% { transform: translate(70px,-300px) scale(0.8); opacity: 0; }
        }
        @keyframes blog-ember-alt {
          0%   { transform: translate(0,0) scale(1); opacity: 0; }
          25%  { opacity: 0.8; }
          60%  { transform: translate(-28px,-190px) scale(1.15); opacity: 0.25; }
          85%  { opacity: 0.65; }
          100% { transform: translate(-55px,-380px) scale(0.9); opacity: 0; }
        }
      `}</style>
        </div>
    );
};
