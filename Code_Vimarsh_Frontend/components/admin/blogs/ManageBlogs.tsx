import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Eye, Globe, FileText,
  Search, Filter, BookOpen, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useGlobalState } from '../../../context/GlobalContext';
import { ManagedBlog, BlogStatus, BlogTopic } from '../../../types';
import { BlogFormModal } from './BlogFormModal';
import { BlogPreviewModal } from './BlogPreviewModal';

const TOPIC_COLOR: Record<string, string> = {
  'Web Development': '#38bdf8', 'AI / ML': '#a855f7', 'DSA': '#f97316',
  'Hackathon': '#facc15', 'Workshop': '#22c55e', 'Club Activity': '#f43f5e',
  'Announcement': '#fb923c', 'DevOps': '#fbbf24', 'Mobile': '#34d399',
  'Open Source': '#60a5fa', 'Other': '#9ca3af',
};

const readTime = (content: string) => {
  const w = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(w / 200))} min`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * Delete confirmation inline modal
 */
const DeleteConfirm: React.FC<{ blog: ManagedBlog; onConfirm: () => void; onCancel: () => void }> = ({ blog, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(4,6,10,0.88)', backdropFilter: 'blur(8px)' }}
    onClick={onCancel}>
    <div className="w-full max-w-md bg-surface border border-red-500/40 rounded-2xl p-6 shadow-2xl"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Delete Blog Post</h3>
          <p className="text-xs text-textMuted">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-1">You are about to permanently delete:</p>
      <p className="text-sm font-semibold text-red-300 mb-1 truncate">"{blog.title}"</p>
      <p className="text-xs font-mono text-textMuted mb-6">slug: {blog.slug}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2 text-sm border border-surfaceLight rounded-lg hover:border-white/30 text-textMuted hover:text-white transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
);

const ManageBlogs: React.FC = () => {
  const { managedBlogs, addManagedBlog, updateManagedBlog, deleteManagedBlog, toggleBlogStatus } = useGlobalState();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BlogStatus | 'All'>('All');
  const [filterTopic, setFilterTopic] = useState<BlogTopic | 'All'>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ManagedBlog | null>(null);
  const [previewTarget, setPreviewTarget] = useState<ManagedBlog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedBlog | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => managedBlogs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase())
      || b.slug.toLowerCase().includes(search.toLowerCase())
      || b.authorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchTopic = filterTopic === 'All' || b.topic === filterTopic;
    return matchSearch && matchStatus && matchTopic;
  }), [managedBlogs, search, filterStatus, filterTopic]);

  const allSlugs = managedBlogs.map(b => b.slug);
  const publishedCount = managedBlogs.filter(b => b.status === 'Published').length;
  const draftCount = managedBlogs.filter(b => b.status === 'Draft').length;

  const handleSave = (blog: ManagedBlog) => {
    if (editTarget) {
      updateManagedBlog(blog);
      showToast(`"${blog.title}" updated successfully.`);
    } else {
      addManagedBlog(blog);
      showToast(`"${blog.title}" created successfully.`);
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteManagedBlog(deleteTarget.id);
    showToast(`"${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  const handleToggle = (blog: ManagedBlog) => {
    toggleBlogStatus(blog.id);
    const next = blog.status === 'Published' ? 'Draft' : 'Published';
    showToast(`"${blog.title}" moved to ${next}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border border-green-500/40 bg-surface shadow-xl text-sm text-green-400 font-medium">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <BookOpen size={22} className="text-primary" /> Blog Management
          </h2>
          <p className="text-textMuted text-sm mt-1">Create, edit, and publish blog posts for the platform.</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', val: managedBlogs.length, color: '#f97316' },
          { label: 'Published', val: publishedCount, color: '#22c55e' },
          { label: 'Drafts', val: draftCount, color: '#9ca3af' },
          { label: 'Topics', val: new Set(managedBlogs.map(b => b.topic)).size, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-surfaceLight rounded-xl p-4">
            <p className="text-xs text-textMuted font-mono uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, slug, or author…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-surface border border-surfaceLight rounded-lg text-white placeholder-textMuted focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 text-sm bg-surface border border-surfaceLight rounded-lg text-white focus:border-primary focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Drafts</option>
        </select>
        <select
          value={filterTopic}
          onChange={e => setFilterTopic(e.target.value as any)}
          className="px-3 py-2 text-sm bg-surface border border-surfaceLight rounded-lg text-white focus:border-primary focus:outline-none"
        >
          <option value="All">All Topics</option>
          {['Web Development','AI / ML','DSA','Hackathon','Workshop','Club Activity','Announcement','DevOps','Mobile','Open Source','Other'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <span className="text-xs font-mono text-textMuted ml-auto">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <BookOpen size={44} className="mb-4 opacity-20" />
          <p className="font-semibold text-white">No blog posts found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new post.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surfaceLight">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surfaceLight bg-surface">
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider">Post</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider hidden md:table-cell">Topic</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider hidden lg:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider hidden lg:table-cell">Read</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider hidden md:table-cell">Updated</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog, idx) => {
                const color = TOPIC_COLOR[blog.topic] ?? '#9ca3af';
                return (
                  <tr
                    key={blog.id}
                    className="border-b border-surfaceLight/50 hover:bg-surfaceLight/30 transition-colors"
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  >
                    {/* Title + slug */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {blog.featuredImage ? (
                          <img src={blog.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-surfaceLight flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-surfaceLight flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                            <BookOpen size={14} style={{ color }} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-48" title={blog.title}>{blog.title}</p>
                          <p className="text-xs font-mono text-textMuted truncate max-w-48">/blog/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* Topic */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border"
                        style={{ color, background: `${color}12`, borderColor: `${color}44` }}>
                        {blog.topic}
                      </span>
                    </td>
                    {/* Author */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-white text-xs">{blog.authorName}</p>
                      <p className="text-textMuted text-xs">{blog.authorRole}</p>
                    </td>
                    {/* Read time */}
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-textMuted font-mono">
                      {readTime(blog.content)}
                    </td>
                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(blog)}
                        title={`Click to toggle to ${blog.status === 'Published' ? 'Draft' : 'Published'}`}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                        style={blog.status === 'Published'
                          ? { color: '#22c55e', background: '#22c55e10', borderColor: '#22c55e44' }
                          : { color: '#9ca3af', background: '#9ca3af10', borderColor: '#9ca3af44' }}
                      >
                        {blog.status === 'Published' ? <Globe size={10} /> : <FileText size={10} />}
                        {blog.status}
                      </button>
                    </td>
                    {/* Updated */}
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-textMuted font-mono">
                      {fmtDate(blog.updatedAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewTarget(blog)}
                          title="Preview"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-textMuted hover:text-white hover:bg-surfaceLight transition-colors"
                        ><Eye size={13} /></button>
                        <button
                          onClick={() => { setEditTarget(blog); setFormOpen(true); }}
                          title="Edit"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-textMuted hover:text-primary hover:bg-primary/10 transition-colors"
                        ><Pencil size={13} /></button>
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          title="Delete"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-textMuted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        ><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Hint */}
      <p className="text-xs font-mono text-textMuted/50 text-center">
        Click the status badge to toggle Draft ↔ Published &nbsp;·&nbsp; Only Published posts appear on the public blog page
      </p>

      {/* Form modal */}
      {formOpen && (
        <BlogFormModal
          existing={editTarget}
          usedSlugs={allSlugs}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
        />
      )}

      {/* Preview modal */}
      {previewTarget && (
        <BlogPreviewModal
          blog={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          blog={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ManageBlogs;
