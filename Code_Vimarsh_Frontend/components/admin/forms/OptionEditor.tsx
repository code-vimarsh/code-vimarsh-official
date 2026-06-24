/**
 * OptionEditor.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages options list for radio / checkbox / dropdown fields.
 * Supports add, remove, edit label+value, and drag-to-reorder.
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { FieldOption } from '../../../types/formBuilder';
import { generateOptionId } from '../../../types/formBuilder';

interface OptionEditorProps {
  options: FieldOption[];
  onChange: (options: FieldOption[]) => void;
}

const OptionEditor: React.FC<OptionEditorProps> = ({ options, onChange }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ── Drag handlers (HTML5 DnD) ──────────────────────────────────────────────

  const handleDragStart = (i: number) => setDragIndex(i);

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    dragOverIndex.current = i;
  };

  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    const reordered = [...options];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dragOverIndex.current, 0, moved);
    setDragIndex(null);
    dragOverIndex.current = null;
    onChange(reordered);
  };

  // ── Option mutations ───────────────────────────────────────────────────────

  const addOption = () => {
    const n = options.length + 1;
    onChange([
      ...options,
      { id: generateOptionId(), label: `Option ${n}`, value: `option_${n}` },
    ]);
  };

  const removeOption = (id: string) => onChange(options.filter((o) => o.id !== id));

  const updateOption = (id: string, key: 'label' | 'value', val: string) => {
    onChange(options.map((o) => (o.id === id ? { ...o, [key]: val } : o)));
  };

  // ── Shared input styles ────────────────────────────────────────────────────

  const inputCls =
    'flex-1 min-w-0 bg-transparent text-xs text-white/80 placeholder-white/25 border-b border-white/[0.08] focus:border-primary/50 outline-none py-1 transition-colors';

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-textMuted/60 uppercase tracking-widest">Options</p>

      <AnimatePresence initial={false}>
        {options.map((opt, i) => (
          <motion.div
            key={opt.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={handleDrop}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors cursor-grab active:cursor-grabbing ${
              dragIndex === i ? 'opacity-40' : ''
            }`}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <GripVertical size={12} className="text-white/20 shrink-0" aria-hidden="true" />

            {/* Label */}
            <input
              value={opt.label}
              onChange={(e) => updateOption(opt.id, 'label', e.target.value)}
              placeholder="Label"
              className={inputCls}
              aria-label={`Option ${i + 1} label`}
            />

            {/* Separator */}
            <span className="text-white/15 text-xs shrink-0">→</span>

            {/* Value */}
            <input
              value={opt.value}
              onChange={(e) => updateOption(opt.id, 'value', e.target.value)}
              placeholder="value"
              className={`${inputCls} max-w-[80px] font-mono text-[10px]`}
              aria-label={`Option ${i + 1} value`}
            />

            <button
              onClick={() => removeOption(opt.id)}
              disabled={options.length <= 1}
              className="w-6 h-6 shrink-0 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              aria-label={`Remove option ${i + 1}`}
            >
              <Trash2 size={11} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addOption}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary/70 hover:text-primary transition-colors w-full justify-center"
        style={{ background: 'rgba(255,106,0,0.05)', border: '1px dashed rgba(255,106,0,0.20)' }}
      >
        <Plus size={12} />
        Add option
      </button>
    </div>
  );
};

export default OptionEditor;
