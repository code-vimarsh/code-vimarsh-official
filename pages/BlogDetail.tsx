import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Globe } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';

/* ── Lightweight markdown renderer ──────────────────────────────────── */
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const inlineRender = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((p, idx) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={idx} className="font-bold text-white">{p.slice(2, -2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*'))
        return <em key={idx} className="italic text-slate-300">{p.slice(1, -1)}</em>;
      if (p.startsWith('`') && p.endsWith('`'))
        return <code key={idx} className="text-xs font-mono bg-surfaceLight px-1.5 py-0.5 rounded text-primary">{p.slice(1, -1)}</code>;
      return p;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const block: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { block.push(lines[i]); i++; }
      nodes.push(
        <div key={i} className="my-4 rounded-xl overflow-hidden border border-surfaceLight">
          {lang && <div className="px-4 py-1.5 text-xs font-mono bg-surfaceLight text-textMuted">{lang}</div>}
          <pre className="p-4 text-xs font-mono leading-relaxed text-slate-200 overflow-x-auto bg-black/40"
            style={{ scrollbarWidth: 'thin' }}>
            <code>{block.join('\n')}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1) { nodes.push(<h1 key={i} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-3">{h1[1]}</h1>); i++; continue; }
    if (h2) { nodes.push(<h2 key={i} className="text-xl md:text-2xl font-bold text-white mt-6 mb-2">{h2[1]}</h2>); i++; continue; }
    if (h3) { nodes.push(<h3 key={i} className="text-lg font-semibold text-white mt-5 mb-2">{h3[1]}</h3>); i++; continue; }

    // Unordered list item
    const ul = line.match(/^[-*] (.+)/);
    if (ul) {
      nodes.push(
        <li key={i} className="ml-6 mb-1 text-slate-300 list-disc leading-relaxed text-sm">
          {inlineRender(ul[1])}
        </li>
      );
      i++;
      continue;
    }

    // Ordered list item
    const ol = line.match(/^\d+\. (.+)/);
    if (ol) {
      nodes.push(
        <li key={i} className="ml-6 mb-1 text-slate-300 list-decimal leading-relaxed text-sm">
          {inlineRender(ol[1])}
        </li>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={i} className="border-surfaceLight my-6" />);
      i++;
      continue;
    }

    // Blockquote
    const bq = line.match(/^> (.+)/);
    if (bq) {
      nodes.push(
        <blockquote key={i} className="border-l-4 border-primary/60 pl-4 my-3 text-sm text-slate-400 italic">
          {inlineRender(bq[1])}
        </blockquote>
      );
      i++;
      continue;
    }

    // Empty line
    if (!line.trim()) { nodes.push(<br key={i} />); i++; continue; }

    // Normal paragraph
    nodes.push(
      <p key={i} className="text-slate-300 leading-relaxed text-sm mb-2">
        {inlineRender(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

/* ── Topic badge colours ─────────────────────────────────────────────── */
const TOPIC_COLOR: Record<string, string> = {
  'Web Development': '#38bdf8', 'AI / ML': '#a855f7', 'DSA': '#f97316',
  'Hackathon': '#facc15', 'Workshop': '#22c55e', 'Club Activity': '#f43f5e',
  'Announcement': '#fb923c', 'DevOps': '#fbbf24', 'Mobile': '#34d399',
  'Open Source': '#60a5fa', 'Other': '#9ca3af',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });

/* ── Page ─────────────────────────────────────────────────────────────── */
const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { managedBlogs } = useGlobalState();

  const blog = useMemo(
    () => managedBlogs.find(b => b.slug === slug && b.status === 'Published'),
    [managedBlogs, slug]
  );

  const readTime = useMemo(() => {
    if (!blog) return 0;
    return Math.max(1, Math.ceil(blog.content.trim().split(/\s+/).length / 200));
  }, [blog]);

  const rendered = useMemo(() => (blog ? renderMarkdown(blog.content) : []), [blog]);

  /* ── 404 state ───────────────────────────────────────────────────────── */
  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-mono font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Blog post not found</h1>
        <p className="text-textMuted text-sm mb-8">
          This post may not exist, has been removed, or is currently under draft.
        </p>
        <Link
          to="/blog"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold text-sm rounded-xl hover:bg-primary/80 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    );
  }

  const topicColor = TOPIC_COLOR[blog.topic] ?? '#9ca3af';

  return (
    <article className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          All Posts
        </Link>

        {/* Hero image */}
        {blog.featuredImage && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-surfaceLight mb-8">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-semibold border"
            style={{ color: topicColor, background: `${topicColor}12`, borderColor: `${topicColor}40` }}
          >
            {blog.topic}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-textMuted font-mono">
            <Clock size={11} /> {readTime} min read
          </span>
          <span className="flex items-center gap-1.5 text-xs text-textMuted font-mono">
            <Calendar size={11} /> {fmtDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono ml-auto">
            <Globe size={11} /> Published
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
          {blog.title}
        </h1>

        {/* Short description */}
        {blog.shortDescription && (
          <p className="text-base text-slate-400 leading-relaxed mb-6 border-l-2 border-primary/50 pl-4">
            {blog.shortDescription}
          </p>
        )}

        {/* Author */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-surfaceLight">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{blog.authorName}</p>
            <p className="text-xs text-textMuted">{blog.authorRole}</p>
          </div>
        </div>

        {/* Body */}
        <div className="prose-blog">
          {rendered}
        </div>

        {/* Gallery */}
        {blog.images.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-mono uppercase tracking-widest text-textMuted mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {blog.images.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-surfaceLight">
                  <img src={img} alt={`gallery-${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-surfaceLight">
            <p className="flex items-center gap-2 text-xs font-mono text-textMuted uppercase tracking-widest mb-3">
              <Tag size={11} /> Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono rounded-full bg-surfaceLight text-textMuted border border-surfaceLight/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-surfaceLight text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-primary transition-colors"
          >
            <ArrowLeft size={13} /> View all posts
          </Link>
        </div>

      </div>
    </article>
  );
};

export default BlogDetail;
