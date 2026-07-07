/**
 * ManageEvents.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Self-contained Manage Events panel rendered inside the Admin 'events' tab.
 *
 * Features
 *  • Create / Edit / Delete events
 *  • Status toggle (Upcoming → Live → Past) + Published toggle
 *  • Inline Registration Form Builder — accordion below event fields
 *  • Per-field inline editor (accordion, no side panel)
 *  • Up / Down reordering
 *
 * Architecture (everything in this one file):
 *   FieldTypeSelector   — type-picker grid
 *   FieldEditorInline   — accordion field settings
 *   FormFieldCard       — single field row
 *   FormBuilderInline   — collapsible section with field list
 *   EventEditor         — left panel (event fields + form builder)
 *   ManageEvents        — root component, exported default
 *
 * No separate routes. No modals. No new pages.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Pencil, ChevronDown, ChevronUp,
  X, Save, Check,
  Type, AlignLeft, Mail, Phone, Hash, Link2,
  Calendar, Paperclip, CircleDot, CheckSquare,
  ChevronsUpDown, FileText, Heading, Images,
  Users,
} from 'lucide-react';
import CheckInScanner from './CheckInScanner';
import ImageGalleryPicker from '../shared/ImageGalleryPicker';
import { useGlobalState } from '../../context/GlobalContext';

import type { FieldType, FormField, FieldOption } from '../../types/formBuilder';
import { FIELD_TYPE_META, generateFieldId, generateOptionId, createDefaultField } from '../../types/formBuilder';
import type { EventType } from '../../types';

// ─── Shared style constants ───────────────────────────────────────────────────

const INPUT =
  'w-full bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none text-white placeholder:text-textMuted/50 transition-colors';

const CHOICE_TYPES: FieldType[] = ['radio', 'checkbox', 'dropdown'];

// ─── Local types ──────────────────────────────────────────────────────────────

type AdminEvent = EventType;

// ─── Status appearance map ────────────────────────────────────────────────────

const STATUS_BG: Record<string, string> = {
  Upcoming: 'rgba(59,130,246,0.12)',
  Live:     'rgba(34,197,94,0.12)',
  Past:     'rgba(255,255,255,0.05)',
  upcoming: 'rgba(59,130,246,0.12)',
  live:     'rgba(34,197,94,0.12)',
  past:     'rgba(255,255,255,0.05)',
};
const STATUS_FG: Record<string, string> = {
  Upcoming: '#93c5fd',
  Live:     '#4ade80',
  Past:     '#666',
  upcoming: '#93c5fd',
  live:     '#4ade80',
  past:     '#666',
};

// ─── Icon map for field types ─────────────────────────────────────────────────

const FIELD_ICON: Partial<Record<FieldType, React.ReactNode>> = {
  short_text:        <Type size={13} />,
  long_text:         <AlignLeft size={13} />,
  email:             <Mail size={13} />,
  phone:             <Phone size={13} />,
  number:            <Hash size={13} />,
  url:               <Link2 size={13} />,
  date:              <Calendar size={13} />,
  file:              <Paperclip size={13} />,
  radio:             <CircleDot size={13} />,
  checkbox:          <CheckSquare size={13} />,
  dropdown:          <ChevronsUpDown size={13} />,
  section_title:     <Heading size={13} />,
  description_block: <FileText size={13} />,
};

const SHORT_LABEL: Partial<Record<FieldType, string>> = {
  short_text: 'Text', long_text: 'Textarea', email: 'Email', phone: 'Phone',
  number: 'Number', url: 'URL', date: 'Date', file: 'File',
  radio: 'Radio', checkbox: 'Check', dropdown: 'Select',
  section_title: 'Header', description_block: 'Block',
};

// ─── Seed helpers ─────────────────────────────────────────────────────────────

const blankEvent = (): AdminEvent => ({
  id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
  title: '',
  date: '',
  status: 'Upcoming',
  type: 'Workshop',
  description: '',
  isPublished: false,
  formFields: [],
  images: [],
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. FieldTypeSelector
// ─────────────────────────────────────────────────────────────────────────────

interface FieldTypeSelectorProps {
  onSelect: (type: FieldType) => void;
  onClose: () => void;
}

const FIELD_GROUPS = [
  { id: 'input',  label: 'Input Fields',   color: '#ff6a0030' },
  { id: 'choice', label: 'Choice Fields',  color: '#a78bfa30' },
  { id: 'layout', label: 'Layout Blocks',  color: '#3b82f630' },
] as const;

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelect, onClose }) => (
  <div
    className="rounded-xl p-5 space-y-4"
    style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.09)' }}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">
        Choose field type
      </p>
      <button
        onClick={onClose}
        className="text-textMuted hover:text-white transition-colors p-1 rounded-lg hover:bg-surfaceLight"
      >
        <X size={13} />
      </button>
    </div>

    {FIELD_GROUPS.map(({ id, label, color }) => {
      const types = FIELD_TYPE_META.filter((m) => m.category === id);
      return (
        <div key={id}>
          <p className="text-[10px] text-textMuted/50 uppercase tracking-widest mb-2 font-medium">
            {label}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {types.map((meta) => (
              <button
                key={meta.type}
                onClick={() => onSelect(meta.type)}
                className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-white/60 hover:text-white transition-all text-center group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = color;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = color.replace('30', '60');
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <span className="opacity-70">{FIELD_ICON[meta.type]}</span>
                <span className="text-[10px] leading-tight">{SHORT_LABEL[meta.type]}</span>
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. FieldEditorInline
// ─────────────────────────────────────────────────────────────────────────────

interface FieldEditorInlineProps {
  field: FormField;
  onChange: (updated: FormField) => void;
}

const FieldEditorInline: React.FC<FieldEditorInlineProps> = ({ field, onChange }) => {
  const isChoice = CHOICE_TYPES.includes(field.type);
  const isLayout = field.type === 'section_title' || field.type === 'description_block';

  const addOption = () => {
    if (!field.options) return;
    const newOpt: FieldOption = { id: generateOptionId(), label: `Option ${field.options.length + 1}` };
    onChange({ ...field, options: [...field.options, newOpt] });
  };

  const updateOption = (id: string, newLabel: string) => {
    if (!field.options) return;
    onChange({ ...field, options: field.options.map(o => o.id === id ? { ...o, label: newLabel } : o) });
  };

  const removeOption = (id: string) => {
    if (!field.options) return;
    onChange({ ...field, options: field.options.filter(o => o.id !== id) });
  };

  return (
    <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="grid grid-cols-2 gap-4">
        {/* Label edit */}
        <div className="col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-textMuted/60 mb-1.5 block">
            {isLayout ? 'Content' : 'Field Label'}
          </label>
          <input
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            className="w-full bg-black/40 border border-surfaceLight rounded-md px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Placeholder & Required */}
        {!isLayout && (
          <>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-textMuted/60 mb-1.5 block">
                Placeholder
              </label>
              <input
                value={field.placeholder || ''}
                onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
                className="w-full bg-black/40 border border-surfaceLight rounded-md px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onChange({ ...field, required: e.target.checked })}
                  className="rounded border-surfaceLight bg-black/40 text-primary focus:ring-primary focus:ring-offset-0"
                />
                Required field
              </label>
            </div>
          </>
        )}
      </div>

      {/* Options Editor (Radio, Checkbox, Select) */}
      {isChoice && field.options && (
        <div className="mt-5">
          <label className="text-[10px] uppercase tracking-wider text-textMuted/60 mb-2 block">
            Choices
          </label>
          <div className="space-y-2">
            {field.options.map((opt, i) => (
              <div key={opt.id} className="flex gap-2 items-center">
                <span className="text-textMuted/40 text-xs w-4 text-right shrink-0">{i + 1}.</span>
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  className="flex-1 bg-black/40 border border-surfaceLight rounded-md px-2 py-1 text-sm text-white focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => removeOption(opt.id)}
                  className="p-1.5 text-textMuted hover:text-red-400 rounded transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-1 ml-6"
            >
              <Plus size={12} /> Add option
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. FormFieldCard
// ─────────────────────────────────────────────────────────────────────────────

interface FormFieldCardProps {
  field: FormField;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const FormFieldCard: React.FC<FormFieldCardProps> = ({
  field, isExpanded, onToggleExpand, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast,
}) => (
  <div
    className="rounded-xl overflow-hidden transition-colors"
    style={{
      background: isExpanded ? 'rgba(255,255,255,0.03)' : '#0d0d0d',
      border: isExpanded ? '1px solid rgba(255,106,0,0.3)' : '1px solid rgba(255,255,255,0.09)',
    }}
  >
    {/* Summary row */}
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Reorder controls */}
      <div className="flex flex-col gap-0.5 shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <button onClick={onMoveUp} disabled={isFirst} className="disabled:opacity-20 hover:text-white p-0.5"><ChevronUp size={12} /></button>
        <button onClick={onMoveDown} disabled={isLast} className="disabled:opacity-20 hover:text-white p-0.5"><ChevronDown size={12} /></button>
      </div>

      {/* Field info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white/40">{FIELD_ICON[field.type]}</span>
          <span className="font-medium text-white/90 text-sm truncate">{field.label || 'Untitled Field'}</span>
          {field.required && <span className="text-red-400 text-xs">*</span>}
        </div>
        <div className="text-[10px] text-textMuted/60 uppercase tracking-wider">
          {SHORT_LABEL[field.type]} {CHOICE_TYPES.includes(field.type) && `(${field.options?.length} opts)`}
        </div>
      </div>

      {/* Expand/Edit Toggle */}
      <button
        onClick={onToggleExpand}
        className="p-1.5 rounded-lg transition-all shrink-0"
        style={{
          background: isExpanded ? 'rgba(255,106,0,0.12)' : 'transparent',
          color: isExpanded ? '#ff6a00' : '#666',
        }}
        title={isExpanded ? 'Collapse' : 'Edit field'}
      >
        <Pencil size={12} />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-textMuted/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
        title="Delete field"
      >
        <Trash2 size={12} />
      </button>
    </div>

    {/* Inline editor — accordion */}
    {isExpanded && (
      <FieldEditorInline field={field} onChange={onChange} />
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. FormBuilderInline
// ─────────────────────────────────────────────────────────────────────────────

interface FormBuilderInlineProps {
  fields: FormField[];
  eventStatus?: AdminEvent['status'];
  onChange: (fields: FormField[]) => void;
}

const FormBuilderInline: React.FC<FormBuilderInlineProps> = ({ fields, eventStatus, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const addField = (type: FieldType) => {
    const newField = createDefaultField(type, fields.length + 1);
    onChange([...fields, newField]);
    setExpandedId(newField.id);
    setShowPicker(false);
  };

  const updateField = (id: string, updated: FormField) => {
    onChange(fields.map((f) => (f.id === id ? updated : f)));
  };

  const deleteField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i + 1 })));
    if (expandedId === id) setExpandedId(null);
  };

  const moveField = (id: string, dir: 'up' | 'down') => {
    const sorted = [...fields].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === sorted.length - 1) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    const tmp = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: tmp };
    onChange(sorted.sort((a, b) => a.order - b.order));
  };

  const sorted = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      {/* Note about live status */}
      {eventStatus !== 'Live' && eventStatus !== 'live' && (
        <p
          className="text-xs px-3 py-2.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#666' }}
        >
          ⚡ Registration form only shows to users when event status is{' '}
          <span style={{ color: '#ff6a00' }}>Live</span>.
          You can build the form anytime.
        </p>
      )}

      {/* Field list */}
      {sorted.length > 0 ? (
        <div className="space-y-2">
          {sorted.map((f, i) => (
            <FormFieldCard
              key={f.id}
              field={f}
              isExpanded={expandedId === f.id}
              onToggleExpand={() => setExpandedId(expandedId === f.id ? null : f.id)}
              onChange={(updated) => updateField(f.id, updated)}
              onDelete={() => deleteField(f.id)}
              onMoveUp={() => moveField(f.id, 'up')}
              onMoveDown={() => moveField(f.id, 'down')}
              isFirst={i === 0}
              isLast={i === sorted.length - 1}
            />
          ))}
        </div>
      ) : (
        !showPicker && (
          <div
            className="text-center py-8 text-sm rounded-xl"
            style={{
              border: '1px dashed rgba(255,255,255,0.09)',
              color: '#555',
            }}
          >
            No fields yet — add your first field below
          </div>
        )
      )}

      {/* Type picker */}
      {showPicker ? (
        <FieldTypeSelector onSelect={addField} onClose={() => setShowPicker(false)} />
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            border: '1px dashed rgba(255,255,255,0.10)',
            color: 'rgba(255,106,0,0.70)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ff6a00';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,106,0,0.30)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,106,0,0.70)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)';
          }}
        >
          <Plus size={15} /> Add Field
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. EventEditor
// ─────────────────────────────────────────────────────────────────────────────

interface EventEditorProps {
  draft: AdminEvent;
  isNew: boolean;
  savedFlash: boolean;
  onDraftChange: (updated: AdminEvent) => void;
  onSave: () => void;
  onDiscard: () => void;
}

const EventEditor: React.FC<EventEditorProps> = ({
  draft, isNew, savedFlash, onDraftChange, onSave, onDiscard,
}) => {
  const [formBuilderOpen,  setFormBuilderOpen]  = useState(false);
  const [imagesOpen,       setImagesOpen]        = useState(false);

  const inp = INPUT;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Panel header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          {isNew
            ? <><Plus size={16} className="text-primary" /> Create Event</>
            : <><Pencil size={15} className="text-primary" /> Edit Event</>
          }
        </h3>
        {!isNew && (
          <button
            onClick={onDiscard}
            className="text-xs text-textMuted hover:text-white flex items-center gap-1 transition-colors"
          >
            <X size={12} /> Discard changes
          </button>
        )}
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Title */}
        <div>
          <label className="text-xs text-textMuted mb-1.5 block">Event Title *</label>
          <input
            value={draft.title}
            onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
            className={inp}
            placeholder="e.g. Next.js Workshop"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-textMuted mb-1.5 block">Date</label>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => onDraftChange({ ...draft, date: e.target.value })}
              className={inp}
              style={{ colorScheme: 'light' }}
            />
          </div>
          <div>
            <label className="text-xs text-textMuted mb-1.5 block">Status</label>
            <select
              value={draft.status}
              onChange={(e) => onDraftChange({ ...draft, status: e.target.value as AdminEvent['status'] })}
              className={inp}
            >
              <option value="upcoming" style={{ background: '#0a0a0a' }}>Upcoming</option>
              <option value="live"     style={{ background: '#0a0a0a' }}>Live</option>
              <option value="past"     style={{ background: '#0a0a0a' }}>Past</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-textMuted mb-1.5 block">Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
            rows={3}
            className={`${inp} resize-none`}
            placeholder="Short event description…"
          />
        </div>

        {/* ── Images section (ADMIN-only collapsible) ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
        >
          <button
            type="button"
            onClick={() => setImagesOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/[0.02]"
            style={{ color: imagesOpen ? '#ff6a00' : 'rgba(255,255,255,0.55)' }}
          >
            <span className="flex items-center gap-2.5">
              <Images size={14} style={{ opacity: 0.7 }} />
              Event Images
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#666' }}
              >
                {draft.images.length} {draft.images.length === 1 ? 'image' : 'images'} · Admin only
              </span>
            </span>
            {imagesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {imagesOpen && (
            <div
              className="px-4 pb-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="pt-4">
                <ImageGalleryPicker
                  images={draft.images}
                  onChange={(imgs) => onDraftChange({ ...draft, images: imgs })}
                  label="Event Gallery"
                  hint="First image is used as the event banner. JPG, PNG, WebP — max 5 MB each."
                />
              </div>
            </div>
          )}
        </div>

        {/* Published toggle */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <p className="text-sm font-medium text-white">Published</p>
            <p className="text-xs text-textMuted">Visible to the public</p>
          </div>
          <button
            type="button"
            onClick={() => onDraftChange({ ...draft, isPublished: !draft.isPublished })}
            className="relative w-11 h-6 rounded-full shrink-0 focus:outline-none"
            style={{
              background: draft.isPublished ? '#ff6a00' : 'rgba(255,255,255,0.12)',
              transition: 'background 0.2s ease',
            }}
            role="switch"
            aria-checked={draft.isPublished}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
              style={{ transition: 'transform 0.2s ease', transform: draft.isPublished ? 'translateX(20px)' : 'translateX(0px)' }}
            />
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={!draft.title.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: savedFlash ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #ff6a00, #ff9a00)',
            color: savedFlash ? '#4ade80' : '#000',
            boxShadow: savedFlash ? 'none' : '0 0 20px rgba(255,106,0,0.25)',
            border: savedFlash ? '1px solid rgba(34,197,94,0.30)' : 'none',
          }}
        >
          {savedFlash ? <><Check size={15} /> Saved!</> : <><Save size={14} /> {isNew ? 'Create Event' : 'Save Changes'}</>}
        </button>
      </div>

      {/* ── Registration Form Builder collapsible ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => setFormBuilderOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors hover:bg-white/[0.02]"
          style={{ color: formBuilderOpen ? '#ff6a00' : 'rgba(255,255,255,0.60)' }}
        >
          <span className="flex items-center gap-2.5">
            <span style={{ opacity: 0.7 }}>📋</span>
            Registration Form Builder
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#666' }}
            >
              {draft.formFields.length} {draft.formFields.length === 1 ? 'field' : 'fields'}
            </span>
          </span>
          {formBuilderOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {formBuilderOpen && (
          <div className="px-6 pb-6">
            <FormBuilderInline
              fields={draft.formFields}
              eventStatus={draft.status}
              onChange={(fields) => onDraftChange({ ...draft, formFields: fields })}
            />
          </div>
        )}
      </div>
    </div>
  );
};


const ManageEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useGlobalState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminEvent | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [checkInEvent, setCheckInEvent] = useState<AdminEvent | null>(null);

  const adminEvents = events as AdminEvent[];

  const startCreate = () => {
    setEditingId('new');
    setDraft(blankEvent());
    setDeleteConfirm(null);
  };

  const startEdit = (e: AdminEvent) => {
    setEditingId(e.id);
    setDraft({ ...e, formFields: e.formFields || [], images: e.images || [] });
    setDeleteConfirm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveDraft = () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      alert('Event title is required');
      return;
    }

    if (editingId === 'new') {
      addEvent(draft);
    } else {
      updateEvent(draft);
    }

    setSavedFlash(true);
    setTimeout(() => {
      setSavedFlash(false);
      setEditingId(null);
      setDraft(null);
    }, 1000);
  };

  const removeEvent = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteEvent(id);
    setDeleteConfirm(null);
    if (editingId === id) cancelEdit();
  };

  const togglePublish = (id: string, current: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const evt = adminEvents.find(x => x.id === id);
    if (evt) updateEvent({ ...evt, isPublished: !current });
  };

  // If an event is selected for check-in, render the scanner view
  if (checkInEvent) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <CheckInScanner event={checkInEvent} onBack={() => setCheckInEvent(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Manage Events</h2>
          <p className="text-sm text-textMuted mt-1">Create events and build custom registration forms.</p>
        </div>
        <button
          onClick={startCreate}
          disabled={editingId === 'new'}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Event List */}
        <div className={`space-y-3 ${editingId ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {adminEvents.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <p className="text-textMuted text-sm">No events found. Create one to get started.</p>
            </div>
          ) : (
            adminEvents.map((evt) => (
              <div
                key={evt.id}
                className={`rounded-xl p-4 transition-all ${editingId === evt.id ? 'ring-1 ring-primary bg-white/5' : 'bg-[#111] hover:bg-[#151515]'} border border-white/5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white truncate text-base">{evt.title}</h4>
                      {evt.isPublished && (
                        <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                          Published
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-textMuted font-medium">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          background: STATUS_BG[evt.status ?? 'Upcoming'],
                          color: STATUS_FG[evt.status ?? 'Upcoming']
                        }}
                      >
                        {evt.status}
                      </span>
                      <span>{evt.date ? new Date(evt.date).toLocaleDateString() : 'TBA'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setCheckInEvent(evt)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-medium"
                      title="View Registrations & Check-In"
                    >
                      <Users size={12} /> Check-In
                    </button>
                    <button
                      onClick={(e) => togglePublish(evt.id, !!evt.isPublished, e)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {evt.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => startEdit(evt)}
                      className="p-1.5 text-textMuted hover:text-primary transition-colors"
                      title="Edit event"
                    >
                      <Pencil size={14} />
                    </button>
                    {deleteConfirm === evt.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => removeEvent(evt.id, e)} className="text-xs text-red-400 font-bold hover:underline">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-textMuted hover:text-white"><X size={12}/></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(evt.id)}
                        className="p-1.5 text-textMuted hover:text-red-400 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Editor Panel */}
        {editingId && draft && (
          <div className="lg:col-span-7 sticky top-6">
            <EventEditor
              draft={draft}
              isNew={editingId === 'new'}
              savedFlash={savedFlash}
              onDraftChange={setDraft}
              onSave={saveDraft}
              onDiscard={cancelEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
