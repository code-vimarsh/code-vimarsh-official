/**
 * FieldTypeSelector.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel that lets admin pick a field type to add to the form.
 * Groups types by category: Input → Choice → Layout
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Type, AlignLeft, Mail, Phone, Hash, Link, Calendar, Paperclip,
  CircleDot, CheckSquare, ChevronDown, Heading, FileText, X,
} from 'lucide-react';
import type { FieldType, FieldTypeMeta } from '../../../types/formBuilder';
import { FIELD_TYPE_META } from '../../../types/formBuilder';

// ─── Icon lookup (string → component) ────────────────────────────────────────

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Type, AlignLeft, Mail, Phone, Hash, Link, Calendar, Paperclip,
  CircleDot, CheckSquare, ChevronDown, Heading, FileText,
};

const FieldIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 15, className }) => {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon size={size} className={className} /> : <Type size={size} className={className} />;
};

// ─── Group fields by category ─────────────────────────────────────────────────

const CATEGORIES: Record<FieldTypeMeta['category'], string> = {
  input:  'Input Fields',
  choice: 'Choice Fields',
  layout: 'Layout Blocks',
};

interface FieldTypeSelectorProps {
  onSelect: (type: FieldType) => void;
  onClose: () => void;
}

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelect, onClose }) => {
  const grouped = (['input', 'choice', 'layout'] as const).map((cat) => ({
    category: cat,
    label: CATEGORIES[cat],
    types: FIELD_TYPE_META.filter((m) => m.category === cat),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="absolute top-12 left-0 z-50 w-[320px] rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'rgba(14,14,14,0.97)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
          Choose Field Type
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/08 transition-colors"
          aria-label="Close type selector"
        >
          <X size={13} />
        </button>
      </div>

      {/* Groups */}
      <div className="p-3 space-y-1 max-h-[420px] overflow-y-auto scrollbar-hide">
        {grouped.map(({ category, label, types }) => (
          <div key={category}>
            <p className="px-2 py-1.5 text-[10px] font-semibold text-textMuted/60 uppercase tracking-widest">
              {label}
            </p>
            {types.map((meta) => (
              <button
                key={meta.type}
                onClick={() => { onSelect(meta.type); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group transition-all duration-150 hover:bg-white/[0.05]"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/15"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <FieldIcon name={meta.icon} size={14} className="text-primary/70 group-hover:text-primary" />
                </span>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white/85 group-hover:text-white leading-tight">
                    {meta.label}
                  </p>
                  <p className="text-[10px] text-textMuted truncate">{meta.description}</p>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FieldTypeSelector;
