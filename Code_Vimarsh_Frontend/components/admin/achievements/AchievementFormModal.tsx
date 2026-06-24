import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ManagedAchievement } from '../../../types';

interface Props {
  existing?: ManagedAchievement | null;
  nextOrder: number;
  onSave: (a: ManagedAchievement) => void;
  onClose: () => void;
}

const ICON_PRESETS = ['🏛', '⚔️', '👑', '🏆', '🔥', '🚀', '🌐', '🥇', '⭐', '💻', '🎯', '🎖️', '🌟', '🛡️', '⚡', '🔮', '🏅', '📜'];
const CATEGORY_PRESETS = ['Founding', 'Hackathon', 'Milestone', 'Open Source', 'Recognition', 'Workshop', 'Research', 'Community', 'Other'];

const inputCls = 'w-full px-3 py-2 text-sm bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-orange-500/60 focus:outline-none transition-colors';
const labelCls = 'block text-xs font-mono uppercase tracking-widest text-orange-400/70 mb-1.5';

const empty = (nextOrder: number): Omit<ManagedAchievement, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  description: '',
  date: '',
  tag: '',
  icon: '🏆',
  category: 'Recognition',
  order: nextOrder,
});

export const AchievementFormModal: React.FC<Props> = ({ existing, nextOrder, onSave, onClose }) => {
  const isEdit = !!existing;

  const [form, setForm] = useState(existing ? {
    title: existing.title,
    description: existing.description,
    date: existing.date,
    tag: existing.tag,
    icon: existing.icon,
    category: existing.category,
    order: existing.order,
  } : empty(nextOrder));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date.trim()) e.date = 'Date is required';
    if (!form.tag.trim()) e.tag = 'Tag is required';
    if (!form.icon.trim()) e.icon = 'Icon is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (form.order < 1) e.order = 'Order must be ≥ 1';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const achievement: ManagedAchievement = {
        id: existing?.id ?? `ma_${Date.now()}`,
        ...form,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      onSave(achievement);
      setSaving(false);
    }, 400);
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,10,0.90)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0d1117] border border-orange-500/20 rounded-2xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="font-bold text-white text-base">
              {isEdit ? 'Edit Achievement' : 'New Achievement'}
            </h2>
            <p className="text-xs text-white/30 font-mono mt-0.5">
              {isEdit ? `Editing: ${existing!.title}` : 'Add a new milestone to the timeline'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#f9731620 transparent' }}>

          {/* Icon picker */}
          <div>
            <label className={labelCls}>Icon</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ICON_PRESETS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => set('icon', ic)}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all"
                  style={{
                    borderColor: form.icon === ic ? '#f97316' : 'rgba(255,255,255,0.08)',
                    background: form.icon === ic ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                    transform: form.icon === ic ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
            <input
              value={form.icon}
              onChange={e => set('icon', e.target.value)}
              placeholder="Or type a custom emoji…"
              className={`${inputCls} text-lg`}
            />
            {errors.icon && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.icon}</p>}
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-orange-500">*</span></label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Smart India Hackathon Winners"
              className={inputCls}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description <span className="text-orange-500">*</span></label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="A short paragraph describing this milestone…"
              className={inputCls}
              style={{ resize: 'vertical', minHeight: 72 }}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.description}</p>}
          </div>

          {/* Date + Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date <span className="text-orange-500">*</span> <span className="text-white/20 normal-case">(e.g. JAN 2022)</span></label>
              <input
                value={form.date}
                onChange={e => set('date', e.target.value.toUpperCase())}
                placeholder="MMM YYYY"
                className={inputCls}
              />
              {errors.date && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.date}</p>}
            </div>
            <div>
              <label className={labelCls}>Order <span className="text-orange-500">*</span> <span className="text-white/20 normal-case">(timeline pos.)</span></label>
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={e => set('order', parseInt(e.target.value, 10) || 1)}
                className={inputCls}
              />
              {errors.order && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.order}</p>}
            </div>
          </div>

          {/* Tag + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tag <span className="text-orange-500">*</span></label>
              <input
                value={form.tag}
                onChange={e => set('tag', e.target.value)}
                placeholder="e.g. Hackathon"
                className={inputCls}
              />
              {errors.tag && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.tag}</p>}
            </div>
            <div>
              <label className={labelCls}>Category <span className="text-orange-500">*</span></label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORY_PRESETS.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.category}</p>}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
          <p className="text-xs text-white/20 font-mono">Order determines timeline position</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-5 py-2 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-black rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
              {saving ? 'Saving…' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementFormModal;
