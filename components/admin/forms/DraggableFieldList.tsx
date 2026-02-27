/**
 * DraggableFieldList.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the ordered list of fields in the builder center column.
 * Each row: drag handle, type badge, label, action buttons (duplicate, delete).
 * Uses HTML5 DnD API — no external library.
 */

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Copy, Trash2, Pencil } from 'lucide-react';
import type { FormField } from '../../../types/formBuilder';
import { FIELD_TYPE_META } from '../../../types/formBuilder';

// ─── pill styling per category ────────────────────────────────────────────────

const TYPE_PILL_STYLE: Record<'input' | 'choice' | 'layout', { bg: string; text: string }> = {
  input:  { bg: 'rgba(255,106,0,0.10)',  text: '#ff9a00' },
  choice: { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc' },
  layout: { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.4)' },
};

interface DraggableFieldListProps {
  fields: FormField[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (fields: FormField[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const DraggableFieldList: React.FC<DraggableFieldListProps> = ({
  fields,
  selectedId,
  onSelect,
  onReorder,
  onDuplicate,
  onDelete,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = useCallback((i: number) => setDragIndex(i), []);

  const handleDragOver = useCallback((e: React.DragEvent, i: number) => {
    e.preventDefault();
    dragOverIndex.current = i;
  }, []);

  const handleDrop = useCallback(() => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    const reordered = [...fields];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dragOverIndex.current, 0, moved);
    const renumbered = reordered.map((f, idx) => ({ ...f, order: idx }));
    onReorder(renumbered);
    setDragIndex(null);
    dragOverIndex.current = null;
  }, [dragIndex, fields, onReorder]);

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-2xl" aria-hidden="true">📋</span>
        </div>
        <p className="text-sm text-textMuted">No fields yet</p>
        <p className="text-xs text-textMuted/50">Click "+ Add Field" to start building your form</p>
      </div>
    );
  }

  return (
    <ol className="space-y-2" aria-label="Form fields">
      <AnimatePresence initial={false}>
        {fields.map((field, i) => {
          const meta = FIELD_TYPE_META.find((m) => m.type === field.type);
          const pillStyle = TYPE_PILL_STYLE[meta?.category ?? 'input'];
          const isSelected = field.id === selectedId;
          const isDragging = dragIndex === i;

          return (
            <motion.li
              key={field.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={handleDrop}
              onDragEnd={() => setDragIndex(null)}
              onClick={() => onSelect(field.id)}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer select-none transition-all duration-150"
              style={{
                background: isSelected
                  ? 'rgba(255,106,0,0.08)'
                  : 'rgba(255,255,255,0.025)',
                border: isSelected
                  ? '1px solid rgba(255,106,0,0.25)'
                  : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Drag handle */}
              <span
                className="cursor-grab active:cursor-grabbing text-white/15 group-hover:text-white/35 transition-colors shrink-0"
                onMouseDown={(e) => e.stopPropagation()}
                aria-hidden="true"
              >
                <GripVertical size={14} />
              </span>

              {/* Order badge */}
              <span
                className="w-5 h-5 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold text-white/30"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {i + 1}
              </span>

              {/* Type pill */}
              <span
                className="shrink-0 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider"
                style={{ background: pillStyle.bg, color: pillStyle.text }}
              >
                {meta?.label ?? field.type}
              </span>

              {/* Label */}
              <span
                className={`flex-1 text-sm truncate ${isSelected ? 'text-white' : 'text-white/65 group-hover:text-white/85'} transition-colors`}
              >
                {field.label || '(untitled)'}
              </span>

              {/* Required indicator */}
              {field.required && (
                <span className="text-primary/60 text-[10px] shrink-0" aria-label="Required">●</span>
              )}

              {/* Actions (visible on hover or selected) */}
              <div
                className={`flex items-center gap-0.5 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(field.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/08 transition-colors"
                  aria-label="Edit field"
                  title="Edit"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(field.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/08 transition-colors"
                  aria-label="Duplicate field"
                  title="Duplicate"
                >
                  <Copy size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete field"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
};

export default DraggableFieldList;
