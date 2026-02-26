import React, { useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPost } from './types';
import { ORANGE, BOARD_BG } from './theme';
import { BlogCard } from './BlogCard';
import { BlogModal } from './BlogModal';
import { BlogEmbers } from './BlogEmbers';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const POSTS: BlogPost[] = [
    {
        id: 'b1', tag: 'DSA', tagColor: '#f97316',
        title: 'Mastering Dynamic Programming',
        excerpt: 'Three mental models that crack every DP problem — Memoize, Tabulate, Optimize.',
        author: 'Aryan Shah', date: 'Feb 18, 2025', readTime: '8 min',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
        rotation: -2.2, ix: 55, iy: 70,
        content: [
            { type: 'paragraph', text: 'Dynamic programming boils down to one insight: cache overlapping sub-problem answers. Get comfortable with the recurrence relation first, then pick the right form.' },
            { type: 'heading', text: 'Top-Down Memoization' },
            {
                type: 'code', language: 'python', text: `def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 2:   return 1
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

print(fib(50))  # 12586269025`},
            { type: 'heading', text: 'When to use DP?' },
            { type: 'paragraph', text: 'If the problem asks for an optimal value (min/max/count) AND sub-answers are reused — DP is your tool. Always sketch the state-transition diagram before coding.' },
        ],
    },
    {
        id: 'b2', tag: 'Backend', tagColor: '#22c55e',
        title: 'Production REST API with Node.js',
        excerpt: 'JWT auth, rate-limiting, and Postgres pooling — battle-tested at 10 k+ req/sec.',
        author: 'Neel Patel', date: 'Jan 30, 2025', readTime: '12 min',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
        rotation: 1.7, ix: 420, iy: 50,
        content: [
            { type: 'paragraph', text: 'Production APIs need auth, error handling, and observability from day one — not as afterthoughts bolted on later.' },
            { type: 'heading', text: 'JWT Middleware' },
            {
                type: 'code', language: 'javascript', text: `const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};`},
            { type: 'heading', text: 'Project Layout' },
            {
                type: 'code', language: 'bash', text: `src/controllers/   # request handlers
src/middleware/    # auth, rate-limit, logger
src/models/        # DB schema + queries
src/routes/        # route declarations
src/services/      # business logic`},
        ],
    },
    {
        id: 'b3', tag: 'AI / ML', tagColor: '#a855f7',
        title: 'How LLMs Actually Work',
        excerpt: 'Transformers, self-attention, RLHF — from first principles, no PhD required.',
        author: 'Priya Mehta', date: 'Feb 5, 2025', readTime: '15 min',
        thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
        rotation: 2.5, ix: 775, iy: 90,
        content: [
            { type: 'paragraph', text: 'LLMs are probability machines that predict the next token given prior context. The engineering behind that deceptively simple description is remarkable.' },
            { type: 'heading', text: 'Scaled Dot-Product Attention' },
            {
                type: 'code', language: 'python', text: `def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / d_k**0.5
    weights = softmax(scores, dim=-1)
    return weights @ V`},
            { type: 'paragraph', text: 'Self-attention lets every token attend to every other token in one matrix multiply — enabling the long-range context capture that makes LLMs so powerful.' },
            { type: 'heading', text: 'RLHF in plain English' },
            { type: 'paragraph', text: 'Reinforcement Learning from Human Feedback fine-tunes model outputs using ranked human preferences so the model learns "helpfulness" beyond perplexity alone.' },
        ],
    },
    {
        id: 'b4', tag: 'Frontend', tagColor: '#38bdf8',
        title: 'CSS Grid vs Flexbox',
        excerpt: 'The one-sentence rule that resolves 95 % of layout decisions. No more guessing.',
        author: 'Krushit Prajapati', date: 'Feb 12, 2025', readTime: '6 min',
        thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
        rotation: -1.5, ix: 90, iy: 455,
        content: [
            { type: 'paragraph', text: 'Flexbox controls one axis. Grid controls two. Use them together — Grid for the page shell, Flexbox inside each cell.' },
            {
                type: 'code', language: 'css', text: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}`},
            { type: 'paragraph', text: 'Common mistake: using nested Flexbox to do what Grid was designed for. If you are fighting your layout, switch tools.' },
        ],
    },
    {
        id: 'b5', tag: 'DevOps', tagColor: '#facc15',
        title: 'Git Internals: What Happens on Commit',
        excerpt: 'Blobs, trees, commit objects — the SHA-1 store that makes Git immortal.',
        author: 'Harsh Desai', date: 'Jan 22, 2025', readTime: '10 min',
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
        rotation: 3.0, ix: 485, iy: 440,
        content: [
            { type: 'paragraph', text: 'Git is not just version control — it is a content-addressable filesystem. Every object is stored by its SHA-1 hash, making it distributed and tamper-evident by design.' },
            { type: 'heading', text: 'Inspect a commit' },
            {
                type: 'code', language: 'bash', text: `git cat-file -p HEAD
# tree   3f9a12b...
# parent 1e4d8bc...
# author Harsh Desai 1706000000 +0530
#
# Add dark mode toggle`},
            { type: 'paragraph', text: 'Blobs store file content. Trees store directory snapshots. Commits chain them together with a parent pointer — that is the entire object model.' },
        ],
    },
];

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
    const [selected, setSelected] = useState<BlogPost | null>(null);
    const { zMap, focus } = useZManager(POSTS);
    const boardRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* ── Page background: dark tech photo + overlays ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none' }}>
                {/* Sci-fi library background photo */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('/assets/blog-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                }} />
                {/* Dark overlay — let the warm orange library glow bleed through */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,4,6,0.72)' }} />
                {/* Subtle grid on top */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff' stroke-width='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                    opacity: 0.04,
                }} />
                {/* Glowing orange ember particles */}
                <BlogEmbers />
                {/* Soft radial orange glow behind the board area */}
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,106,0,0.07) 0%, transparent 70%)' }} />
            </div>

            <div style={{ minHeight: '100vh', paddingTop: 40, paddingBottom: 80 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,106,0,0.7)', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: 12 }}>
                        [ Engineering Knowledge Board ]
                    </p>
                    <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: 'clamp(1.9rem,5vw,3.1rem)', color: '#f1f5f9', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                        The{' '}
                        <span style={{ color: ORANGE, textShadow: `0 0 40px rgba(255,106,0,0.45)` }}>Notice Board</span>
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
                                height: 800,
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
                                    zIndex={zMap[post.id]}
                                    onFocus={() => focus(post.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 14, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1c1c20', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    code vimarsh — engineering knowledge board
                </p>
            </div>

            <AnimatePresence>
                {selected && <BlogModal key={selected.id} post={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </>
    );
};
