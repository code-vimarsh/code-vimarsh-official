import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, User } from 'lucide-react';
import { BlogPost } from './types';
import { ORANGE } from './theme';
import { BlogCodeBlock } from './BlogCodeBlock';

interface ModalProps {
    post: BlogPost;
    onClose: () => void;
}

export const BlogModal: React.FC<ModalProps> = ({ post, onClose }) => {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(4,4,6,0.82)',
                backdropFilter: 'blur(10px)',
                paddingTop: 68, paddingBottom: 20, paddingLeft: 20, paddingRight: 20,
            }}
        >
            <motion.article
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 12 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 660,
                    maxHeight: '88vh', overflowY: 'auto',
                    background: 'rgba(11,11,14,0.99)',
                    border: `1px solid rgba(255,106,0,0.38)`,
                    borderRadius: 16,
                    boxShadow: `0 0 60px rgba(255,106,0,0.12), 0 2px 4px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.7)`,
                }}
            >
                {/* Hero */}
                <div style={{ position: 'relative', height: 190, overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                    <img src={post.thumbnail} alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(11,11,14,1) 0%,rgba(11,11,14,0.5) 50%,transparent 100%)' }} />
                    {/* Close */}
                    <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#aaa', transition: 'border-color 0.2s, color 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = ORANGE; (e.currentTarget as HTMLButtonElement).style.color = ORANGE; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#aaa'; }}
                    ><X size={14} /></button>
                    {/* Tag */}
                    <span style={{ position: 'absolute', bottom: 14, left: 20, background: `${post.tagColor}18`, border: `1px solid ${post.tagColor}66`, color: post.tagColor, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.16em', padding: '3px 11px', borderRadius: 40 }}>{post.tag}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '22px 28px 32px' }}>
                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
                        {[{ I: <User size={11} />, v: post.author }, { I: <Clock size={11} />, v: `${post.date} · ${post.readTime}` }].map(({ I, v }) => (
                            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4b5563', fontFamily: 'JetBrains Mono,monospace' }}>{I} {v}</div>
                        ))}
                    </div>
                    {/* Title */}
                    <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem,3vw,1.6rem)', color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.3 }}>{post.title}</h1>
                    {/* Orange rule */}
                    <div style={{ height: 1, background: `linear-gradient(90deg,${ORANGE},transparent)`, marginBottom: 20 }} />
                    {/* Sections */}
                    {post.content.map((s, i) => {
                        if (s.type === 'paragraph') return <p key={i} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.82, marginBottom: 16 }}>{s.text}</p>;
                        if (s.type === 'heading') return <h2 key={i} style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: ORANGE, margin: '24px 0 10px', letterSpacing: '0.03em' }}>{s.text}</h2>;
                        if (s.type === 'code') return <BlogCodeBlock key={i} text={s.text!} language={s.language!} />;
                        return null;
                    })}
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1c1c22', textAlign: 'center', marginTop: 16, letterSpacing: '0.12em' }}>press ESC or click outside to close</p>
                </div>
            </motion.article>
        </motion.div>
    );
};
