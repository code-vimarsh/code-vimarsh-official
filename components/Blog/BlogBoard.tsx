import React, { useRef, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPost } from './types';
import { ORANGE, BOARD_BG } from './theme';
import { BlogCard } from './BlogCard';
import { BlogModal } from './BlogModal';
import { useGlobalState } from '../../context/GlobalContext';
import SectionBackground from '../shared/SectionBackground';

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT PRESETS — cycled over dynamic posts
// ─────────────────────────────────────────────────────────────────────────────
const LAYOUT_PRESETS = [
    { rotation: -2.2, ix: 55,  iy: 70  },
    { rotation:  1.7, ix: 420, iy: 50  },
    { rotation:  2.5, ix: 620, iy: 90  },
    { rotation: -1.5, ix: 90,  iy: 455 },
    { rotation:  3.0, ix: 460, iy: 430 },
    { rotation: -2.8, ix: 700, iy: 420 },
];

const TOPIC_TAG_COLOR: Record<string, string> = {
    'Web Development': '#38bdf8', 'AI / ML': '#a855f7', 'DSA': '#f97316',
    'Hackathon': '#facc15', 'Workshop': '#22c55e', 'Club Activity': '#f43f5e',
    'Announcement': '#fb923c', 'DevOps': '#facc15', 'Mobile': '#34d399',
    'Open Source': '#60a5fa', 'Other': '#9ca3af',
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX MANAGER
// ─────────────────────────────────────────────────────────────────────────────
function useZManager(posts: BlogPost[]) {
    const [zMap, setZMap] = useState<Record<string, number>>(() => Object.fromEntries(posts.map((p, i) => [p.id, i + 1])));
    const [maxZ, setMaxZ] = useState(posts.length);
    const focus = useCallback((id: string) => {
        setMaxZ(z => { const n = z + 1; setZMap(prev => ({ ...prev, [id]: n })); return n; });
    }, []);
    return { zMap, focus };
}

export const BlogBoard: React.FC = () => {
    const { managedBlogs } = useGlobalState();

    // Map published managed blogs → BlogPost shape for the draggable board
    const POSTS: BlogPost[] = useMemo(() => managedBlogs
        .filter(b => b.status === 'Published')
        .map((b, idx) => {
            const preset = LAYOUT_PRESETS[idx % LAYOUT_PRESETS.length];
            const wordCount = b.content.trim().split(/\s+/).length;
            return {
                id: b.id,
                tag: b.topic,
                tagColor: TOPIC_TAG_COLOR[b.topic] ?? '#9ca3af',
                title: b.title,
                excerpt: b.shortDescription,
                author: b.authorName,
                date: fmtDate(b.createdAt),
                readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min`,
                thumbnail: b.featuredImage,
                content: [],                 // unused — modal uses rawMarkdown
                rawMarkdown: b.content,
                rotation: preset.rotation,
                ix: preset.ix,
                iy: preset.iy,
            };
        }),
        [managedBlogs]
    );

    const [selected, setSelected] = useState<BlogPost | null>(null);
    const { zMap, focus } = useZManager(POSTS);
    const boardRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <SectionBackground
                backgroundImage="/assets/blog-bg.png"
                contentStyle={{ paddingTop: 40, paddingBottom: 80, overflowX: 'hidden' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,106,0,0.7)', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: 12 }}>
                        [ Engineering Knowledge Board ]
                    </p>
                    <h1 style={{ fontFamily: 'Cinzel Decorative, Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.9rem,5vw,3.1rem)', color: '#f1f5f9', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                        Vimarsh{' '}
                        <span style={{ color: ORANGE, textShadow: `0 0 40px rgba(255,106,0,0.45)` }}>Insights</span>
                    </h1>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a2a2e', letterSpacing: '0.10em', maxWidth: 420, margin: '0 auto' }}>
                        drag cards to rearrange · click to read the full article
                    </p>
                </div>

                {/* Board frame */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
                    <div style={{
                        width: '100%', maxWidth: 1140, padding: '1px',
                        borderRadius: 18,
                        background: `linear-gradient(135deg, rgba(255,106,0,0.35), rgba(255,106,0,0.06), rgba(255,106,0,0.18))`,
                        boxShadow: `0 50px 120px rgba(0,0,0,0.85), 0 0 80px rgba(255,106,0,0.05), inset 0 1px 0 rgba(255,255,255,0.04)`,
                    }}>
                        {/* Matte dark panel */}
                        <div
                            ref={boardRef}
                            style={{
                                position: 'relative',
                                height: 860,
                                borderRadius: 17,
                                overflow: 'hidden',
                                background: BOARD_BG,
                                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.55)',
                            }}
                        >
                            {/* Very subtle inner grid on board */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='0.5' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px', pointerEvents: 'none',
                            }} />
                            {/* Orange corner accents */}
                            {[[14, 14], [14, -14], [-14, 14], [-14, -14]].map(([x, y], i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    ...(y < 0 ? { bottom: Math.abs(y) } : { top: y }),
                                    ...(x < 0 ? { right: Math.abs(x) } : { left: x }),
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: `rgba(255,106,0,0.35)`,
                                    boxShadow: `0 0 10px rgba(255,106,0,0.4)`,
                                    zIndex: 2,
                                }} />
                            ))}

                            {POSTS.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    boardRef={boardRef as React.RefObject<HTMLDivElement>}
                                    isSelected={selected?.id === post.id}
                                    onOpen={() => setSelected(post)}
                                    zIndex={zMap[post.id] ?? 1}
                                    onFocus={() => focus(post.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 14, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1c1c20', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    code vimarsh — engineering knowledge board
                </p>
            </SectionBackground>

            <AnimatePresence>
                {selected && <BlogModal key={selected.id} post={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </>
    );
};
