import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Achievement } from './types';
import { useScrollProgress } from './useScrollProgress';
import { EmbersBackground, NodeDot } from './GlowDots';
import { AchievementCard, CardKeyframes, CARD_W } from './AchievementCard';
import { FiredSword } from './Sword';
import { SPath } from './SPath';
import { MobileTimeline } from './MobileTimeline';
import { AchievementModal } from './AchievementModal';
import { useGlobalState } from '../../context/GlobalContext';

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CURVE_X_FRAC = 0.54;   // S-curve horizontal center (fraction of svg width)
const ROW_H = 280;    // vertical px between consecutive nodes
const BEZIER_BULGE = 80;     // bezier control point bulge 
const TOP_PAD = 60;     // y offset of first node from top of container
const NODE_GAP = 75;     // gap between node center and nearest card edge

function buildPath(count: number, cx: number, topPad: number): string {
    if (count === 0) return '';
    const pts: [number, number][] = Array.from({ length: count }, (_, i) => [cx, topPad + i * ROW_H]);
    if (count === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const [, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        const midY = (y1 + y2) / 2;
        const dir = i % 2 === 0 ? 1 : -1;
        const bx = cx + dir * BEZIER_BULGE;
        d += ` C ${bx} ${midY}, ${bx} ${midY}, ${x2} ${y2}`;
    }
    return d;
}

export const AchievementsSection: React.FC = () => {
    const { managedAchievements } = useGlobalState();

    // Sort by order field, then map to the local Achievement shape expected by cards/modal
    const achievements: Achievement[] = useMemo(() =>
        [...managedAchievements]
            .sort((a, b) => a.order - b.order)
            .map(a => ({
                id: a.id,
                date: a.date,
                title: a.title,
                description: a.description,
                icon: a.icon,
                category: a.category,
            })),
        [managedAchievements]
    );

    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement | null>(null);

    const [svgW, setSvgW] = useState(0);
    const [pathLen, setPathLen] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [selected, setSelected] = useState<Achievement | null>(null);

    const progress = useScrollProgress(sectionRef);

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        fn();
        window.addEventListener('resize', fn, { passive: true });
        return () => window.removeEventListener('resize', fn);
    }, []);

    useEffect(() => {
        const el = containerRef.current; if (!el) return;
        const ro = new ResizeObserver(() => setSvgW(el.getBoundingClientRect().width));
        ro.observe(el);
        setSvgW(el.getBoundingClientRect().width);
        return () => ro.disconnect();
    }, []);

    const curveCx = svgW * CURVE_X_FRAC;
    const svgH = TOP_PAD + (achievements.length - 1) * ROW_H + 80;
    const pathD = useMemo(() => isMobile ? '' : buildPath(achievements.length, curveCx, TOP_PAD), [achievements.length, curveCx, isMobile]);

    const nodes = useMemo<[number, number][]>(() =>
        isMobile ? [] : achievements.map((_, i) => [curveCx, TOP_PAD + i * ROW_H]),
        [achievements, curveCx, isMobile]
    );

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            if (pathRef.current) {
                setPathLen(pathRef.current.getTotalLength());
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pathD]);

    return (
        <>
        {/* ── Full-viewport fixed background — bypasses Layout pt-24 / max-w-7xl ── */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* Castle background */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/assets/castle-bg.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
            {/* Dark overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(11,15,25,0.78) 0%,rgba(11,15,25,0.65) 45%,rgba(11,15,25,0.88) 100%)' }} />
            {/* Embers fill the full viewport */}
            <EmbersBackground />
        </div>

        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                width: '100vw',
                minHeight: '100vh',
                /* Full-bleed breakout from Layout's max-w container */
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
            }}
        >
            <CardKeyframes />

            {/* ── Section header ── */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: 80, paddingBottom: 40 }}>
                <h1 className="heading-primary" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', margin: 0 }}>
                    Hall of{' '}
                    <span className="heading-accent-glow">Achievements</span>
                </h1>
                <p className="section-subtitle">
                    A chronicle of milestones forged in code and community
                </p>
            </div>

            {/* ── Achievement detail modal ── */}
            {selected && <AchievementModal a={selected} onClose={() => setSelected(null)} />}

            {/* ── Timeline ── */}
            {isMobile ? (
                <MobileTimeline items={achievements} onCardClick={setSelected} />
            ) : (
                <div
                    ref={containerRef}
                    style={{ position: 'relative', zIndex: 10, width: '100%', height: svgH }}
                >
                    {svgW > 0 && pathD && (
                        <>
                            {/* S-curve SVG */}
                            <SPath
                                d={pathD} w={svgW} h={svgH}
                                progress={progress}
                                totalLen={pathLen}
                                pathRef={pathRef}
                            />

                            {/* FiredSword — medieval sword that travels the S-curve */}
                            <FiredSword
                                w={svgW} h={svgH}
                                progress={progress}
                                pathRef={pathRef}
                                totalLen={pathLen}
                            />

                            {/* Node dots at every achievement point */}
                            {nodes.map(([cx, cy], i) => (
                                <NodeDot key={achievements[i].id} cx={cx} cy={cy} w={svgW} h={svgH} />
                            ))}

                            {/* Achievement cards — placed directly beside their node */}
                            {achievements.map((a, i) => {
                                const [cx, cy] = nodes[i] ?? [0, 0];
                                // Even index → card on LEFT of curve
                                // Odd index  → card on RIGHT of curve
                                const isLeft = i % 2 === 0;
                                const cardLeft = isLeft
                                    ? cx - NODE_GAP - CARD_W
                                    : cx + NODE_GAP;
                                return (
                                    <div
                                        key={a.id}
                                        style={{
                                            position: 'absolute',
                                            top: cy - 65,
                                            left: cardLeft,
                                            width: CARD_W,
                                        }}
                                    >
                                        <AchievementCard
                                            a={a}
                                            side={isLeft ? 'left' : 'right'}
                                            onClick={() => setSelected(a)}
                                            isActive={i === Math.round(progress * (achievements.length - 1))}
                                        />
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            {/* Bottom breathing room */}
            <div style={{ position: 'relative', zIndex: 10, height: 60 }} />
        </section>
        </>  
    );
};
