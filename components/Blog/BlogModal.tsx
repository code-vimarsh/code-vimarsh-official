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

/* lightweight markdown → React nodes for managed blog content */
function renderMarkdown(md: string, orange: string): React.ReactNode[] {
    const lines = md.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;
    const inline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
        return parts.map((p, idx) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={idx} style={{ fontWeight: 700, color: '#f1f5f9' }}>{p.slice(2, -2)}</strong>;
            if (p.startsWith('*') && p.endsWith('*')) return <em key={idx} style={{ color: '#94a3b8' }}>{p.slice(1, -1)}</em>;
            if (p.startsWith('`') && p.endsWith('`')) return <code key={idx} style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, color: orange }}>{p.slice(1, -1)}</code>;
            return p;
        });
    };
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('```')) {
            const lang = line.slice(3).trim();
            const block: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) { block.push(lines[i]); i++; }
            nodes.push(<BlogCodeBlock key={`code-${i}`} text={block.join('\n')} language={lang || 'text'} />);
            i++; continue;
        }
        const h2 = line.match(/^## (.+)/); if (h2) { nodes.push(<h2 key={i} style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: orange, margin: '24px 0 10px', letterSpacing: '0.03em' }}>{h2[1]}</h2>); i++; continue; }
        const h3 = line.match(/^#{1,3} (.+)/); if (h3) { nodes.push(<h2 key={i} style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: orange, margin: '24px 0 10px', letterSpacing: '0.03em' }}>{h3[1]}</h2>); i++; continue; }
        const ul = line.match(/^[-*] (.+)/); if (ul) { nodes.push(<li key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, marginBottom: 6, marginLeft: 20 }}>{inline(ul[1])}</li>); i++; continue; }
        if (/^---+$/.test(line.trim())) { nodes.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '16px 0' }} />); i++; continue; }
        if (!line.trim()) { nodes.push(<br key={i} />); i++; continue; }
        nodes.push(<p key={i} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.82, marginBottom: 16 }}>{inline(line)}</p>);
        i++;
    }
    return nodes;
}

export const BlogModal: React.FC<ModalProps> = ({ post, onClose }) => {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
    }, [onClose]);

    return (
        <>
        {/* Scoped scrollbar styling — keeps webkit scrollbar thin and inside the inner div */}
        <style>{`
            .blog-modal-scroll::-webkit-scrollbar { width: 4px; }
            .blog-modal-scroll::-webkit-scrollbar-track { background: transparent; }
            .blog-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,106,0,0.28); border-radius: 99px; }
            .blog-modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,106,0,0.5); }
        `}</style>
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
                    maxHeight: '88vh',
                    display: 'flex', flexDirection: 'column',
                    background: 'rgba(11,11,14,0.99)',
                    border: `1px solid rgba(255,106,0,0.38)`,
                    borderRadius: 16,
                    /* overflow:hidden clips children to rounded corners,
                       the scrollbar lives on the inner div — never touches this border */
                    overflow: 'hidden',
                    boxShadow: `0 0 60px rgba(255,106,0,0.12), 0 2px 4px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.7)`,
                }}
            >
                {/* Hero — fixed height, never scrolls */}
                <div style={{ position: 'relative', height: 190, flexShrink: 0, overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
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

                {/* Inner scroll container — scrollbar lives here, isolated from the card border */}
                <div className="blog-modal-scroll" style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    /* Firefox thin scrollbar */
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,106,0,0.28) transparent',
                } as React.CSSProperties}>

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
                    {/* Sections — structured OR raw markdown */}
                    {post.rawMarkdown
                        ? renderMarkdown(post.rawMarkdown, ORANGE)
                        : post.content.map((s, i) => {
                            if (s.type === 'paragraph') return <p key={i} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.82, marginBottom: 16 }}>{s.text}</p>;
                            if (s.type === 'heading') return <h2 key={i} style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: ORANGE, margin: '24px 0 10px', letterSpacing: '0.03em' }}>{s.text}</h2>;
                            if (s.type === 'code') return <BlogCodeBlock key={i} text={s.text!} language={s.language!} />;
                            return null;
                        })
                    }
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1c1c22', textAlign: 'center', marginTop: 16, letterSpacing: '0.12em' }}>press ESC or click outside to close</p>
                </div>{/* /Body padding */}
                </div>{/* /Inner scroll container */}
            </motion.article>
        </motion.div>
        </>
    );
};
