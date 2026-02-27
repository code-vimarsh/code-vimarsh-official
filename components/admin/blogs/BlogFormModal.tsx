import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, AlertCircle, CheckCircle, Loader2, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { ManagedBlog, BlogTopic, BlogStatus } from '../../../types';

interface Props {
  existing?: ManagedBlog | null;
  usedSlugs: string[];
  onSave: (blog: ManagedBlog) => void;
  onClose: () => void;
}

const TOPICS: BlogTopic[] = [
  'Web Development', 'AI / ML', 'DSA', 'Hackathon',
  'Workshop', 'Club Activity', 'Announcement', 'DevOps',
  'Mobile', 'Open Source', 'Other',
];


const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const empty = (): Omit<ManagedBlog, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  slug: '',
  topic: 'Web Development',
  shortDescription: '',
  content: '',
  featuredImage: '',
  images: [],
  authorName: 'Admin',
  authorRole: 'Admin',
  tags: [],
  status: 'Draft',
});

export const BlogFormModal: React.FC<Props> = ({ existing, usedSlugs, onSave, onClose }) => {
  const isEdit = !!existing;
  const [form, setForm] = useState(existing ? {
    title: existing.title,
    slug: existing.slug,
    topic: existing.topic,
    shortDescription: existing.shortDescription,
    content: existing.content,
    featuredImage: existing.featuredImage,
    images: existing.images,
    authorName: existing.authorName,
    authorRole: existing.authorRole,
    tags: existing.tags,
    status: existing.status,
  } : empty());

  const [tagInput, setTagInput] = useState('');
  const [extraImageInput, setExtraImageInput] = useState('');
  const [slugError, setSlugError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Image mode toggles
  const [featuredMode, setFeaturedMode] = useState<'url' | 'upload'>('url');
  const [extraMode, setExtraMode] = useState<'url' | 'upload'>('url');

  // File input refs
  const featuredFileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFeaturedFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    set('featuredImage', dataUrl);
    e.target.value = '';
  };

  const handleExtraFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    set('images', [...form.images, ...dataUrls]);
    e.target.value = '';
  };

  // Validate slug on change
  useEffect(() => {
    const s = form.slug;
    if (!s) { setSlugError(''); return; }
    if (!SLUG_REGEX.test(s)) {
      setSlugError('Only lowercase letters, numbers, and hyphens. No spaces or leading/trailing hyphens.');
      return;
    }
    const duplicate = usedSlugs.filter(u => !isEdit || u !== existing?.slug).includes(s);
    if (duplicate) {
      setSlugError('This slug is already in use. Please choose a unique one.');
      return;
    }
    setSlugError('');
  }, [form.slug, usedSlugs, isEdit, existing?.slug]);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => set('tags', form.tags.filter(x => x !== t));

  const addExtraImage = () => {
    const url = extraImageInput.trim();
    if (url) set('images', [...form.images, url]);
    setExtraImageInput('');
  };

  const removeExtraImage = (idx: number) =>
    set('images', form.images.filter((_, i) => i !== idx));

  const isValid =
    form.title.trim() !== '' &&
    form.slug.trim() !== '' &&
    form.shortDescription.trim() !== '' &&
    form.content.trim() !== '' &&
    slugError === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const now = new Date().toISOString();
    const blog: ManagedBlog = {
      id: existing?.id ?? Date.now().toString(),
      ...form,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(blog);
    setSaving(false);
    setSaved(true);
    setTimeout(() => onClose(), 700);
  };

  const inputCls = 'w-full bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none placeholder-textMuted transition-colors';
  const labelCls = 'block text-xs font-mono text-textMuted mb-1.5 uppercase tracking-wider';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,10,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-surface border border-surfaceLight rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surfaceLight flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
            </h2>
            <p className="text-xs text-textMuted font-mono mt-0.5">
              {isEdit ? `Editing: ${existing?.slug}` : 'Fill all required fields — slug must be unique'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surfaceLight flex items-center justify-center text-textMuted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,106,0,0.3) transparent' } as React.CSSProperties}
        >
          {/* Row: Title + Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Title <span className="text-primary">*</span></label>
              <input
                required
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Mastering Dynamic Programming"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as BlogStatus)}
                className={inputCls}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>
              Slug <span className="text-primary">*</span>
              <span className="ml-2 text-textMuted normal-case tracking-normal font-sans">
                (admin-controlled · must be unique)
              </span>
            </label>
            <input
              required
              value={form.slug}
              onChange={e => set('slug', e.target.value.toLowerCase())}
              placeholder="e.g. code-vimarsh-hackathon-2026"
              className={`${inputCls} ${slugError ? 'border-red-500' : form.slug && !slugError ? 'border-green-500' : ''}`}
            />
            {slugError && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1.5">
                <AlertCircle size={11} /> {slugError}
              </p>
            )}
            {form.slug && !slugError && (
              <p className="text-xs text-green-400 flex items-center gap-1 mt-1.5">
                <CheckCircle size={11} /> Slug looks good — will route to /blog/{form.slug}
              </p>
            )}
            <p className="text-xs text-textMuted mt-1 font-mono">
              Format: lowercase, hyphens only — example: <em>my-awesome-blog-post-2026</em>
            </p>
          </div>

          {/* Row: Topic + Author Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Topic <span className="text-primary">*</span></label>
              <select
                value={form.topic}
                onChange={e => set('topic', e.target.value as BlogTopic)}
                className={inputCls}
              >
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Author Name <span className="text-primary">*</span></label>
              <input
                required
                value={form.authorName}
                onChange={e => set('authorName', e.target.value)}
                placeholder="e.g. Aryan Shah"
                className={inputCls}
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className={labelCls}>Short Description <span className="text-primary">*</span> <span className="text-textMuted normal-case font-sans">(card preview — 2-3 sentences)</span></label>
            <textarea
              required
              rows={2}
              value={form.shortDescription}
              onChange={e => set('shortDescription', e.target.value)}
              placeholder="Brief preview shown on blog cards…"
              className={`${inputCls} resize-none`}
            />
            <p className="text-xs text-textMuted mt-1">{form.shortDescription.length} / 200 chars recommended</p>
          </div>

          {/* Full Content */}
          <div>
            <label className={labelCls}>
              Full Content <span className="text-primary">*</span>
              <span className="ml-2 text-textMuted normal-case font-sans">(Markdown supported)</span>
            </label>
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder={'# Your Blog Title\n\nWrite your full blog content here in Markdown...\n\n## Section Heading\n\nParagraph text...\n\n```js\n// code block\n```'}
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>

          {/* Featured Image */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls + ' mb-0'}>
                <ImageIcon size={11} className="inline mr-1" />
                Featured Image URL <span className="text-textMuted normal-case font-sans">(used as card thumbnail)</span>
              </label>
              {/* Toggle */}
              <div className="flex items-center gap-1 bg-bgDark border border-surfaceLight rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setFeaturedMode('url')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    featuredMode === 'url' ? 'bg-primary text-black font-bold' : 'text-textMuted hover:text-white'
                  }`}
                >
                  <LinkIcon size={10} /> URL
                </button>
                <button
                  type="button"
                  onClick={() => { setFeaturedMode('upload'); featuredFileRef.current?.click(); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    featuredMode === 'upload' ? 'bg-primary text-black font-bold' : 'text-textMuted hover:text-white'
                  }`}
                >
                  <Upload size={10} /> Upload
                </button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={featuredFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFeaturedFileChange}
            />

            {featuredMode === 'url' ? (
              <input
                value={form.featuredImage}
                onChange={e => set('featuredImage', e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className={inputCls}
              />
            ) : (
              <button
                type="button"
                onClick={() => featuredFileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-primary/40 hover:border-primary rounded-lg py-4 text-sm text-textMuted hover:text-primary transition-colors"
              >
                <Upload size={16} />
                {form.featuredImage && form.featuredImage.startsWith('data:')
                  ? 'Replace uploaded photo'
                  : 'Click to upload a photo'}
              </button>
            )}

            {form.featuredImage && (
              <div className="relative mt-2 group w-full">
                <img
                  src={form.featuredImage}
                  alt="preview"
                  className="h-24 w-full object-cover rounded-lg border border-surfaceLight"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                <button
                  type="button"
                  onClick={() => set('featuredImage', '')}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            )}
          </div>

          {/* Extra Images */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls + ' mb-0'}>Extra Images (gallery)</label>
              {/* Toggle */}
              <div className="flex items-center gap-1 bg-bgDark border border-surfaceLight rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setExtraMode('url')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    extraMode === 'url' ? 'bg-primary text-black font-bold' : 'text-textMuted hover:text-white'
                  }`}
                >
                  <LinkIcon size={10} /> URL
                </button>
                <button
                  type="button"
                  onClick={() => { setExtraMode('upload'); extraFileRef.current?.click(); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    extraMode === 'upload' ? 'bg-primary text-black font-bold' : 'text-textMuted hover:text-white'
                  }`}
                >
                  <Upload size={10} /> Upload
                </button>
              </div>
            </div>

            {/* Hidden multi-file input */}
            <input
              ref={extraFileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleExtraFilesChange}
            />

            {extraMode === 'url' ? (
              <div className="flex gap-2">
                <input
                  value={extraImageInput}
                  onChange={e => setExtraImageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExtraImage(); } }}
                  placeholder="Paste image URL and press Enter or Add"
                  className={`${inputCls} flex-1`}
                />
                <button type="button" onClick={addExtraImage}
                  className="px-3 py-2 bg-surfaceLight hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => extraFileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-primary/40 hover:border-primary rounded-lg py-4 text-sm text-textMuted hover:text-primary transition-colors"
              >
                <Upload size={16} />
                Click to upload photos (multiple allowed)
              </button>
            )}

            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="h-16 w-24 object-cover rounded-lg border border-surfaceLight" onError={e => (e.currentTarget.style.display = 'none')} />
                    <button type="button" onClick={() => removeExtraImage(idx)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add a tag and press Enter"
                className={`${inputCls} flex-1`}
              />
              <button type="button" onClick={addTag}
                className="px-3 py-2 bg-surfaceLight hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-colors">
                <Plus size={14} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/25 text-primary text-xs rounded-full font-mono">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surfaceLight flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-textMuted hover:text-white border border-surfaceLight hover:border-white/30 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || saving || saved}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-black font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : null}
            {saved ? 'Saved!' : saving ? 'Saving…' : isEdit ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};
