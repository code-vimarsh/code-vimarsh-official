import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from './types';
import { ORANGE, CARD_BG, BORDER_ACT, BORDER_DIM } from './theme';

interface CardProps {
    post: BlogPost;
    boardRef: React.RefObject<HTMLDivElement | null>;
    isSelected: boolean;
    onOpen: () => void;
    zIndex: number;
    onFocus: () => void;
}

export const BlogCard: React.FC<CardProps> = ({ post, boardRef, isSelected, onOpen, zIndex, onFocus }) => {
    const [pos, setPos] = useState({ x: post.ix, y: post.iy });
    const [hover, setHover] = useState(false);
    const [isDrag, setIsDrag] = useState(false);

    // Refs for RAF drag — avoid any state update mid-drag
    const outerRef = useRef<HTMLDivElement>(null);
    const livePos = useRef({ x: post.ix, y: post.iy });
    const mouseRef = useRef({ x: 0, y: 0 });
    const originRef = useRef({ mx: 0, my: 0, px: 0, py: 0 });
    const rafId = useRef(0);
    const draggingRef = useRef(false);
    const CARD_W = 232, CARD_H_APPROX = 330;

    const applyTransform = useCallback((x: number, y: number, dragging: boolean) => {
        const el = outerRef.current; if (!el) return;
        const rot = dragging ? 0 : hover ? post.rotation * 0.2 : post.rotation;
        const scaleV = dragging ? 1.03 : 1;
        el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${scaleV})`;
        // willChange: only set while dragging to hint GPU layer; clear afterwards to free memory
        el.style.willChange = dragging ? 'transform' : 'auto';
    }, [hover, post.rotation]);

    // Keep transform in sync when hover/drag state changes (not mid-drag)
    useEffect(() => {
        if (!draggingRef.current) applyTransform(livePos.current.x, livePos.current.y, false);
    }, [hover, applyTransform]);

    const onGripDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); e.preventDefault();
        onFocus();
        draggingRef.current = true;
        setIsDrag(true);
        originRef.current = { mx: e.clientX, my: e.clientY, px: livePos.current.x, py: livePos.current.y };
        mouseRef.current = { x: e.clientX, y: e.clientY };

        const board = boardRef.current;

        const loop = () => {
            if (!draggingRef.current) return;
            const { x: mx, y: my } = mouseRef.current;
            const { mx: ox, my: oy, px, py } = originRef.current;
            const bW = board ? board.getBoundingClientRect().width : 9999;
            const bH = board ? board.getBoundingClientRect().height : 9999;
            const nx = Math.min(Math.max(px + mx - ox, 0), bW - CARD_W);
            const ny = Math.min(Math.max(py + my - oy, 0), bH - CARD_H_APPROX);
            livePos.current = { x: nx, y: ny };
            applyTransform(nx, ny, true);
            rafId.current = requestAnimationFrame(loop);
        };
        rafId.current = requestAnimationFrame(loop);

        const onMove = (mv: MouseEvent) => {
            mouseRef.current = { x: mv.clientX, y: mv.clientY };
        };
        const onUp = () => {
            cancelAnimationFrame(rafId.current);
            draggingRef.current = false;
            setIsDrag(false);
            // commit final position — single React update
            setPos({ ...livePos.current });
            applyTransform(livePos.current.x, livePos.current.y, false);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseup', onUp);
    }, [boardRef, onFocus, applyTransform]);

    // Sync after state commit (pos change after drag)
    useEffect(() => {
        livePos.current = pos;
        if (!draggingRef.current) applyTransform(pos.x, pos.y, false);
    }, [pos, applyTransform]);

    if (isSelected) return null;

    return (
        <div
            ref={outerRef}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { if (!draggingRef.current) setHover(false); }}
            onClick={() => { if (!draggingRef.current) { onFocus(); onOpen(); } }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: CARD_W,
                /* paddingTop makes room for the pin that sits above the card border */
                paddingTop: 20,
                cursor: isDrag ? 'grabbing' : 'pointer',
                zIndex,
                transform: `translate3d(${pos.x}px,${pos.y}px,0) rotate(${post.rotation}deg)`,
                transformOrigin: 'center top',
                userSelect: 'none',
                background: 'transparent',
            }}
        >
            {/* ── Push Pin ── centered on the top border, the ONLY drag trigger */}
            <div
                onMouseDown={onGripDown}
                onClick={e => e.stopPropagation()}
                title="Drag me to move this card"
                style={{
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    cursor: isDrag ? 'grabbing' : 'grab',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Pin head — clean flat circle */}
                <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: post.tagColor,
                    border: '2.5px solid rgba(255,255,255,0.28)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.55)',
                    flexShrink: 0,
                }} />
                {/* Shaft — thin straight needle */}
                <div style={{
                    width: 2,
                    height: 16,
                    background: 'rgba(180,160,140,0.75)',
                    flexShrink: 0,
                }} />
            </div>

            {/* ── Card body (below pin) ── */}
            <div style={{
                position: 'relative',     /* anchors absolutely-positioned children inside */
                background: CARD_BG,
                border: `1px solid ${hover || isDrag ? BORDER_ACT : BORDER_DIM}`,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: isDrag
                    ? `0 24px 60px rgba(0,0,0,0.65), 0 0 30px rgba(255,106,0,0.18)`
                    : hover
                        ? `0 12px 36px rgba(0,0,0,0.55), 0 0 20px rgba(255,106,0,0.12)`
                        : `0 6px 20px rgba(0,0,0,0.4)`,
                transition: isDrag ? 'none' : 'border-color 0.25s, box-shadow 0.25s',
            }}>
                {/* Thumbnail */}
                <div style={{ width: '100%', height: 106, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                {/* Gradient fade at bottom of thumbnail */}
                <div style={{ position: 'absolute', top: 74, left: 0, right: 0, height: 38, background: `linear-gradient(0deg,${CARD_BG} 0%,transparent 100%)`, pointerEvents: 'none' }} />

                {/* Card content */}
                <div style={{ padding: '10px 14px 14px' }}>
                    {/* Tag pill */}
                    <span style={{
                        display: 'inline-block', fontSize: 9,
                        fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.15em',
                        color: post.tagColor,
                        border: `1px solid ${post.tagColor}55`,
                        borderRadius: 30, padding: '2px 9px', marginBottom: 8,
                        background: `${post.tagColor}0D`,
                    }}>{post.tag}</span>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700,
                        fontSize: 13.5, color: hover ? '#ffffff' : '#d1d5db',
                        margin: '0 0 7px', lineHeight: 1.35, paddingRight: 22,
                        transition: 'color 0.2s',
                    }}>{post.title}</h3>

                    {/* Excerpt */}
                    <p style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.6, margin: '0 0 12px' }}>{post.excerpt}</p>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 9, color: '#374151', fontFamily: 'JetBrains Mono,monospace' }}>{post.readTime}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: ORANGE, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, letterSpacing: '0.08em' }}>
                            READ <ArrowUpRight size={10} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
