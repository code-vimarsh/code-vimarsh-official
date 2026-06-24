import React from 'react';
import { X, Clock, User, Tag, BookOpen } from 'lucide-react';
import { ManagedBlog } from '../../../types';

interface Props {
  blog: ManagedBlog;
  onClose: () => void;
}

/** Estimate reading time from plain text / markdown content */
const readTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

/** Very lightweight markdown → HTML for preview only */
const renderMarkdown = (md: string): string => {
  return md
    .replace(/```[\s\S]*?```/g, m => {
      const lines = m.split('\n');
      const code = lines.slice(1, -1).join('\n');
      return `<pre class="blog-pre"><code>${escHtml(code)}</code></pre>`;
    })
    .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="blog-code">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="blog-li">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="blog-ul">$1</ul>')
    .replace(/\n{2,}/g, '</p><p class="blog-p">')
    .replace(/^(?!<)(.+)$/gm, '<p class="blog-p">$1</p>');
};

const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOPIC_COLOR: Record<string, string> = {
  'Web Development': '#38bdf8',
  'AI / ML': '#a855f7',
  'DSA': '#f97316',
  'Hackathon': '#facc15',
  'Workshop': '#22c55e',
  'Club Activity': '#f43f5e',
  'Announcement': '#fb923c',
  'DevOps': '#fbbf24',
  'Mobile': '#34d399',
  'Open Source': '#60a5fa',
  'Other': '#9ca3af',
};

export const BlogPreviewModal: React.FC<Props> = ({ blog, onClose }) => {
  const color = TOPIC_COLOR[blog.topic] ?? '#f97316';
  const rt = readTime(blog.content);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,10,0.90)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Preview badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/15 border border-yellow-500/40 rounded-full z-10">
        <BookOpen size={12} className="text-yellow-400" />
        <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest">Preview Mode</span>
        {blog.status === 'Draft' && (
          <span className="ml-1 text-xs font-mono text-yellow-600">(Draft — not visible publicly)</span>
        )}
      </div>

      <div
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden border border-surfaceLight shadow-2xl"
        style={{ background: 'rgba(11,11,14,0.99)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          {blog.featuredImage ? (
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}18` }}>
              <BookOpen size={48} style={{ color }} />
            </div>
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg,rgba(11,11,14,1) 0%,rgba(11,11,14,0.4) 60%,transparent 100%)' }} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <X size={15} />
          </button>
          {/* Topic badge */}
          <span
            className="absolute bottom-4 left-5 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
            style={{ color, background: `${color}18`, borderColor: `${color}55`, letterSpacing: '0.12em' }}
          >
            {blog.topic}
          </span>
        </div>

        {/* Inner scrollable body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,106,0,0.28) transparent' } as React.CSSProperties}
        >
          <div className="px-7 py-5">
            {/* Meta row */}
            <div className="flex flex-wrap gap-4 mb-3 text-xs font-mono text-textMuted">
              <span className="flex items-center gap-1.5"><User size={11} /> {blog.authorName} · {blog.authorRole}</span>
              <span className="flex items-center gap-1.5"><Clock size={11} /> {rt}</span>
              <span className="flex items-center gap-1.5"><Tag size={11} /> {blog.tags.slice(0, 3).join(', ')}</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-white text-2xl leading-snug mb-3">{blog.title}</h1>

            {/* Orange rule */}
            <div className="h-px mb-5" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />

            {/* Short description */}
            <p className="text-sm text-slate-400 italic mb-6 leading-relaxed border-l-2 pl-4" style={{ borderColor: `${color}66` }}>
              {blog.shortDescription}
            </p>

            {/* Full content rendered */}
            <style>{`
              .blog-h1{font-size:1.4rem;font-weight:800;color:#f1f5f9;margin:1.5rem 0 0.6rem;line-height:1.25;}
              .blog-h2{font-size:1.1rem;font-weight:700;color:${color};margin:1.4rem 0 0.5rem;letter-spacing:0.02em;}
              .blog-h3{font-size:0.95rem;font-weight:600;color:#cbd5e1;margin:1.2rem 0 0.4rem;}
              .blog-p{font-size:0.875rem;color:#94a3b8;line-height:1.82;margin-bottom:0.9rem;}
              .blog-pre{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px 16px;margin:1rem 0;overflow-x:auto;}
              .blog-pre code{font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#e2e8f0;white-space:pre;}
              .blog-code{font-family:'JetBrains Mono',monospace;font-size:0.75rem;background:rgba(255,255,255,0.07);padding:1px 5px;border-radius:4px;color:#fb923c;}
              .blog-ul{padding-left:1.2rem;margin-bottom:0.9rem;}
              .blog-li{font-size:0.875rem;color:#94a3b8;line-height:1.7;list-style-type:disc;}
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />

            {/* Extra images */}
            {blog.images.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-mono text-textMuted uppercase tracking-widest mb-3">Gallery</p>
                <div className="grid grid-cols-2 gap-3">
                  {blog.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg border border-surfaceLight" onError={e => (e.currentTarget.style.display = 'none')} />
                  ))}
                </div>
              </div>
            )}

            {/* Tags footer */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-surfaceLight">
                {blog.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-full border"
                    style={{ color, background: `${color}10`, borderColor: `${color}40` }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-center text-xs font-mono mt-5 text-textMuted/40 uppercase tracking-widest">
              press ESC or click outside to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
