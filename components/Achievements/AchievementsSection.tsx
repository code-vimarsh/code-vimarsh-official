import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Achievement } from './types';
import { useScrollProgress } from './useScrollProgress';
import { EmbersBackground, NodeDot } from './GlowDots';
import { AchievementCard, CardKeyframes, CARD_W } from './AchievementCard';
import { FiredSword } from './Sword';
import { SPath } from './SPath';
import { MobileTimeline } from './MobileTimeline';
import { AchievementModal } from './AchievementModal';

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (CRUD-ready — swap ACHIEVEMENTS with useState + API fetch)
// ─────────────────────────────────────────────────────────────────────────────
const ACHIEVEMENTS: Achievement[] = [
    { id: '1', date: 'JAN 2022', title: 'Code Vimarsh Founded', description: 'The journey began with a vision to build a community of passionate coders and problem solvers.', icon: '🏛', category: 'Founding' },
    { id: '2', date: 'APR 2022', title: 'First Hackathon Organized', description: 'Successfully hosted our inaugural 24-hour hackathon with 150+ participants from across the region.', icon: '⚔️', category: 'Hackathon' },
    { id: '3', date: 'AUG 2022', title: '500 Members Milestone', description: 'Our community grew to 500 active members, establishing Code Vimarsh as a leading coding community.', icon: '👑', category: 'Milestone' },
    { id: '4', date: 'DEC 2022', title: 'National Coding Championship', description: 'Represented at the national level with 3 teams qualifying for the finals and 1 team winning gold.', icon: '🏆', category: 'Hackathon' },
    { id: '5', date: 'MAR 2023', title: 'Open Source Initiative', description: 'Launched our open-source contribution program, with members contributing to 70+ major projects.', icon: '🔥', category: 'Open Source' },
    { id: '6', date: 'JUL 2023', title: 'Tech Summit 2023', description: 'Organized a flagship tech summit with industry leaders, attracting 1000+ attendees and 30 speakers.', icon: '🚀', category: 'Recognition' },
    { id: '7', date: 'NOV 2023', title: '1000 Members Strong', description: 'Crossed the 1000-member mark, becoming one of the largest student-led coding communities.', icon: '👑', category: 'Milestone' },
    { id: '8', date: 'FEB 2024', title: 'International Recognition', description: 'Featured by global tech platforms for our innovative approach to community-driven coding education.', icon: '🌐', category: 'Recognition' },
    { id: '9', date: 'MAY 2024', title: 'Smart India Hackathon Winners', description: 'Secured 1st prize in the software edition, competing against 500+ teams nationwide.', icon: '🥇', category: 'Hackathon' },
    { id: '10', date: 'SEP 2024', title: '100+ PRs in Hacktoberfest', description: 'Club milestone reached in a single month — 100+ merged pull requests to major open-source repos.', icon: '⭐', category: 'Open Source' },
];

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
    const achievements = ACHIEVEMENTS;

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
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: '#0b0f19',
                overflow: 'hidden',
                /* Full-bleed breakout from Layout's max-w container */
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
            }}
        >
            {/* Castle background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url('/assets/castle-bg.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
            {/* Dark overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(180deg,rgba(11,15,25,0.78) 0%,rgba(11,15,25,0.65) 45%,rgba(11,15,25,0.88) 100%)' }} />

            <EmbersBackground />
            <CardKeyframes />

            {/* ── Section header ── */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: 80, paddingBottom: 40 }}>
                <h1 style={{ fontFamily: 'Cinzel Decorative,Cinzel,serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f5f0e8', margin: 0, letterSpacing: '0.04em' }}>
                    Hall of{' '}
                    <span style={{ color: '#f97316', textShadow: '0 0 40px rgba(249,115,22,0.55)' }}>Achievements</span>
                </h1>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(0.65rem,1.5vw,0.85rem)', color: '#6a5a4a', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 14 }}>
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
    );
};
