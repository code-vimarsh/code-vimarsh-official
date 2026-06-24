import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Trophy, CheckCircle,
  Search, ArrowUp, ArrowDown,
} from 'lucide-react';
import { useGlobalState } from '../../../context/GlobalContext';
import { ManagedAchievement } from '../../../types';
import { AchievementFormModal } from './AchievementFormModal';

const CATEGORY_COLOR: Record<string, string> = {
  Founding: '#f97316',
  Hackathon: '#facc15',
  Milestone: '#a855f7',
  'Open Source': '#22c55e',
  Recognition: '#38bdf8',
  Workshop: '#34d399',
  Research: '#fb923c',
  Community: '#f43f5e',
  Other: '#9ca3af',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/** Inline delete confirm */
const DeleteConfirm: React.FC<{ a: ManagedAchievement; onConfirm: () => void; onCancel: () => void }> = ({ a, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(4,6,10,0.88)', backdropFilter: 'blur(8px)' }}
    onClick={onCancel}>
    <div className="w-full max-w-md bg-surface border border-red-500/40 rounded-2xl p-6 shadow-2xl"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center text-red-400">
          <Trash2 size={18} />
        </div>
        <div>
          <h3 className="font-bold text-white">Delete Achievement</h3>
          <p className="text-xs text-textMuted">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-1">You are about to permanently delete:</p>
      <p className="text-sm font-semibold text-red-300 mb-5 truncate">"{a.title}"</p>
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

const ManageAchievements: React.FC = () => {
  const { managedAchievements, addManagedAchievement, updateManagedAchievement, deleteManagedAchievement } = useGlobalState();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState<'order' | 'date' | 'title'>('order');
  const [sortAsc, setSortAsc] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ManagedAchievement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedAchievement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const allCategories = useMemo(() =>
    ['All', ...Array.from(new Set(managedAchievements.map(a => a.category)))],
    [managedAchievements]
  );

  const filtered = useMemo(() => {
    let list = managedAchievements.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
        || a.tag.toLowerCase().includes(search.toLowerCase())
        || a.date.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'All' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'order') cmp = a.order - b.order;
      else if (sortField === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [managedAchievements, search, filterCategory, sortField, sortAsc]);

  const nextOrder = useMemo(() =>
    managedAchievements.length > 0
      ? Math.max(...managedAchievements.map(a => a.order)) + 1
      : 1,
    [managedAchievements]
  );

  const handleSave = (a: ManagedAchievement) => {
    if (editTarget) {
      updateManagedAchievement(a);
      showToast(`"${a.title}" updated.`);
    } else {
      addManagedAchievement(a);
      showToast(`"${a.title}" added to timeline.`);
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteManagedAchievement(deleteTarget.id);
    showToast(`"${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortAsc(a => !a);
    else { setSortField(f); setSortAsc(true); }
  };

  const SortBtn: React.FC<{ field: typeof sortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 text-xs font-mono text-textMuted hover:text-white uppercase tracking-wider transition-colors"
    >
      {label}
      {sortField === field
        ? (sortAsc ? <ArrowUp size={10} className="text-orange-400" /> : <ArrowDown size={10} className="text-orange-400" />)
        : <span className="w-[10px]" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border border-green-500/40 bg-surface shadow-xl text-sm text-green-400 font-medium">
          <CheckCircle size={14} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Trophy size={22} className="text-orange-400" /> Achievements Timeline
          </h2>
          <p className="text-textMuted text-sm mt-1">Manage milestones displayed on the Hall of Achievements timeline.</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Achievement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: managedAchievements.length, color: '#f97316' },
          { label: 'Categories', val: new Set(managedAchievements.map(a => a.category)).size, color: '#a855f7' },
          { label: 'Hackathons', val: managedAchievements.filter(a => a.category === 'Hackathon').length, color: '#facc15' },
          { label: 'Milestones', val: managedAchievements.filter(a => a.category === 'Milestone').length, color: '#22c55e' },
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
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, tag, or date…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-surface border border-surfaceLight rounded-lg text-white placeholder-textMuted focus:border-orange-500/50 focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-sm bg-surface border border-surfaceLight rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
        >
          {allCategories.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-xs font-mono text-textMuted ml-auto">{filtered.length} achievement{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <Trophy size={44} className="mb-4 opacity-20" />
          <p className="font-semibold text-white">No achievements found</p>
          <p className="text-sm mt-1">Adjust filters or add a new achievement.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surfaceLight">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surfaceLight bg-surface">
                <th className="text-left px-4 py-3"><SortBtn field="order" label="#" /></th>
                <th className="text-left px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider">Icon</th>
                <th className="text-left px-4 py-3"><SortBtn field="title" label="Title" /></th>
                <th className="text-left px-4 py-3 hidden md:table-cell"><SortBtn field="date" label="Date" /></th>
                <th className="text-left px-4 py-3 hidden md:table-cell text-xs font-mono text-textMuted uppercase tracking-wider">Tag</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell text-xs font-mono text-textMuted uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell text-xs font-mono text-textMuted uppercase tracking-wider">Updated</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-textMuted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => {
                const color = CATEGORY_COLOR[a.category] ?? '#9ca3af';
                return (
                  <tr
                    key={a.id}
                    className="border-b border-surfaceLight/50 hover:bg-surfaceLight/30 transition-colors"
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  >
                    {/* Order */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold text-orange-400/80">{a.order}</span>
                    </td>
                    {/* Icon */}
                    <td className="px-4 py-3">
                      <span className="text-xl">{a.icon}</span>
                    </td>
                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white truncate max-w-52" title={a.title}>{a.title}</p>
                      <p className="text-xs text-textMuted truncate max-w-52 mt-0.5">{a.description.slice(0, 60)}…</p>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-textMuted">{a.date}</td>
                    {/* Tag */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border"
                        style={{ color, background: `${color}12`, borderColor: `${color}44` }}>
                        {a.tag}
                      </span>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-textMuted">
                      {a.category}
                    </td>
                    {/* Updated */}
                    <td className="px-4 py-3 hidden lg:table-cell text-xs font-mono text-textMuted">
                      {fmtDate(a.updatedAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setEditTarget(a); setFormOpen(true); }}
                          title="Edit"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-textMuted hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                        ><Pencil size={13} /></button>
                        <button
                          onClick={() => setDeleteTarget(a)}
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
      <p className="text-xs font-mono text-textMuted/40 text-center">
        Timeline is sorted by Order field &nbsp;·&nbsp; Changes reflect instantly on the Achievements page
      </p>

      {/* Form modal */}
      {formOpen && (
        <AchievementFormModal
          existing={editTarget}
          nextOrder={nextOrder}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          a={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ManageAchievements;
