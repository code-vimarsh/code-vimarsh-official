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

import React, { useState } from 'react';
import {
  Plus, Trash2, Pencil, ChevronDown, ChevronUp,
  X, Save, Check,
  Type, AlignLeft, Mail, Phone, Hash, Link2,
  Calendar, Paperclip, CircleDot, CheckSquare,
  ChevronsUpDown, FileText, Heading,
} from 'lucide-react';

import type { FieldType, FormField, FieldOption } from '../../types/formBuilder';
import { FIELD_TYPE_META, generateFieldId, generateOptionId, createDefaultField } from '../../types/formBuilder';
import { EVENTS_DATA } from '../../data/eventsData';

// ─── Shared style constants ───────────────────────────────────────────────────

const INPUT =
  'w-full bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none text-white placeholder:text-textMuted/50 transition-colors';

const CHOICE_TYPES: FieldType[] = ['radio', 'checkbox', 'dropdown'];

// ─── Local types ──────────────────────────────────────────────────────────────

interface AdminEvent {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'live' | 'past';
  description: string;
  isPublished: boolean;
  formFields: FormField[];
}

// ─── Status appearance map ────────────────────────────────────────────────────

const STATUS_BG: Record<AdminEvent['status'], string> = {
  upcoming: 'rgba(59,130,246,0.12)',
  live:     'rgba(34,197,94,0.12)',
  past:     'rgba(255,255,255,0.05)',
};
const STATUS_FG: Record<AdminEvent['status'], string> = {
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

const seedEvents = (): AdminEvent[] =>
  EVENTS_DATA.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date === 'live' ? '' : e.date,
    status: e.status,
    description: e.description,
    isPublished: e.status !== 'upcoming',
    formFields: [],
  }));

const blankEvent = (): AdminEvent => ({
  id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
  title: '',
  date: '',
  status: 'upcoming',
  description: '',
  isPublished: false,
  formFields: [],
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

  const updateOpt = (optId: string, label: string) => {
    onChange({
      ...field,
      options: field.options?.map((o) =>
        o.id === optId ? { ...o, label, value: label.toLowerCase().replace(/\s+/g, '_') } : o
      ),
    });
  };

  const addOpt = () => {
    const n = (field.options?.length ?? 0) + 1;
    const newOpt: FieldOption = { id: generateOptionId(), label: `Option ${n}`, value: `option_${n}` };
    onChange({ ...field, options: [...(field.options ?? []), newOpt] });
  };

  const removeOpt = (optId: string) => {
    if ((field.options?.length ?? 0) <= 1) return;
    onChange({ ...field, options: field.options?.filter((o) => o.id !== optId) });
  };

  return (
    <div
      className="px-4 pb-4 pt-3 space-y-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}
    >
      {/* Label */}
      <div>
        <label className="text-[10px] text-textMuted uppercase tracking-wider block mb-1.5">
          Label
        </label>
        <input
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          className={INPUT}
          placeholder="Field label…"
        />
      </div>

      {/* Placeholder + Help Text (not for layout blocks) */}
      {!isLayout && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-textMuted uppercase tracking-wider block mb-1.5">
              Placeholder
            </label>
            <input
              value={field.placeholder ?? ''}
              onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
              className={INPUT}
              placeholder="e.g. Enter your name"
            />
          </div>
          <div>
            <label className="text-[10px] text-textMuted uppercase tracking-wider block mb-1.5">
              Help Text
            </label>
            <input
              value={field.helpText ?? ''}
              onChange={(e) => onChange({ ...field, helpText: e.target.value })}
              className={INPUT}
              placeholder="Optional hint"
            />
          </div>
        </div>
      )}

      {/* Required toggle */}
      {!isLayout && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...field, required: !field.required })}
            className="relative w-9 h-5 rounded-full shrink-0 focus:outline-none"
            style={{
              background: field.required ? '#ff6a00' : 'rgba(255,255,255,0.12)',
              transition: 'background 0.2s ease',
            }}
            aria-checked={field.required}
            role="switch"
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
              style={{ transition: 'transform 0.2s ease', transform: field.required ? 'translateX(16px)' : 'translateX(0px)' }}
            />
          </button>
          <span className="text-xs text-textMuted">Required field</span>
        </div>
      )}

      {/* Options for choice fields */}
      {isChoice && (
        <div>
          <label className="text-[10px] text-textMuted uppercase tracking-wider block mb-2">
            Options
          </label>
          <div className="space-y-2">
            {(field.options ?? []).map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="text-xs text-textMuted/40 w-4 shrink-0 text-right">{i + 1}.</span>
                <input
                  value={opt.label}
                  onChange={(e) => updateOpt(opt.id, e.target.value)}
                  className={INPUT}
                  placeholder={`Option ${i + 1}`}
                />
                <button
                  onClick={() => removeOpt(opt.id)}
                  disabled={(field.options?.length ?? 0) <= 1}
                  className="text-textMuted hover:text-red-400 disabled:opacity-30 transition-colors p-1 shrink-0"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={addOpt}
              className="text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5 mt-1 font-medium"
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
  field, isExpanded, onToggleExpand, onChange, onDelete,
  onMoveUp, onMoveDown, isFirst, isLast,
}) => (
  <div
    className="rounded-xl overflow-hidden transition-all"
    style={{
      background: '#0f0f0f',
      border: isExpanded ? '1px solid rgba(255,106,0,0.25)' : '1px solid rgba(255,255,255,0.07)',
    }}
  >
    {/* Header row */}
    <div className="flex items-center gap-2.5 px-3.5 py-3">
      {/* Move up/down */}
      <div className="flex flex-col gap-0 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors leading-none"
        >
          <ChevronUp size={12} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors leading-none"
        >
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Type badge */}
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)', color: '#888', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <span className="text-white/30">{FIELD_ICON[field.type]}</span>
        {SHORT_LABEL[field.type] ?? field.type}
      </span>

      {/* Label */}
      <span className="flex-1 text-sm text-white/75 truncate min-w-0">
        {field.label || <span className="italic text-textMuted/50">Untitled field</span>}
      </span>

      {/* Required dot */}
      {field.required && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: '#ff6a00' }}
          title="Required"
        />
      )}

      {/* Edit toggle */}
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
  eventStatus: AdminEvent['status'];
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
      {eventStatus !== 'live' && (
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
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);

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

        {/* Date + Status row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-textMuted mb-1.5 block">Date</label>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => onDraftChange({ ...draft, date: e.target.value })}
              className={inp}
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. ManageEvents (root, exported)
// ─────────────────────────────────────────────────────────────────────────────

const ManageEvents: React.FC = () => {
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>(() => seedEvents());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminEvent>(() => blankEvent());
  const [isNew, setIsNew] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const selectEvent = (ev: AdminEvent) => {
    setSelectedId(ev.id);
    setDraft({ ...ev });
    setIsNew(false);
    setSavedFlash(false);
  };

  const startNew = () => {
    setSelectedId(null);
    setDraft(blankEvent());
    setIsNew(true);
    setSavedFlash(false);
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    if (isNew) {
      setAdminEvents((prev) => [...prev, draft]);
      setSelectedId(draft.id);
      setIsNew(false);
    } else {
      setAdminEvents((prev) => prev.map((ev) => (ev.id === draft.id ? draft : ev)));
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAdminEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (selectedId === id) startNew();
  };

  const handleDiscard = () => {
    if (selectedId) {
      const original = adminEvents.find((ev) => ev.id === selectedId);
      if (original) { setDraft({ ...original }); setSavedFlash(false); }
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

      {/* ── LEFT: Editor panel ── */}
      <div>
        <EventEditor
          draft={draft}
          isNew={isNew}
          savedFlash={savedFlash}
          onDraftChange={setDraft}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>

      {/* ── RIGHT: Event list ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">
            All Events
            <span className="ml-2 text-sm font-normal text-textMuted">({adminEvents.length})</span>
          </h3>
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: isNew ? 'rgba(255,106,0,0.12)' : 'rgba(255,255,255,0.05)',
              border: isNew ? '1px solid rgba(255,106,0,0.25)' : '1px solid rgba(255,255,255,0.09)',
              color: isNew ? '#ff6a00' : '#aaa',
            }}
          >
            <Plus size={13} /> New Event
          </button>
        </div>

        {adminEvents.length === 0 && (
          <div
            className="text-center py-10 rounded-xl text-textMuted text-sm"
            style={{ border: '1px dashed rgba(255,255,255,0.07)' }}
          >
            No events yet. Create your first one.
          </div>
        )}

        <div className="space-y-2">
          {adminEvents.map((ev) => {
            const isSelected = selectedId === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => selectEvent(ev)}
                className="group rounded-xl p-4 cursor-pointer transition-all"
                style={{
                  background: isSelected ? 'rgba(255,106,0,0.05)' : '#111',
                  border: isSelected
                    ? '1px solid rgba(255,106,0,0.30)'
                    : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p className="font-semibold text-white text-sm truncate leading-snug">
                      {ev.title}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {/* Status pill */}
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: STATUS_BG[ev.status],
                          color: STATUS_FG[ev.status],
                          border: `1px solid ${STATUS_FG[ev.status]}30`,
                        }}
                      >
                        {ev.status}
                      </span>

                      {/* Published badge */}
                      {ev.isPublished ? (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' }}
                        >
                          Published
                        </span>
                      ) : (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#555', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                          Draft
                        </span>
                      )}

                      {/* Form fields count */}
                      {ev.formFields.length > 0 && (
                        <span className="text-[10px] text-textMuted/60">
                          📋 {ev.formFields.length} fields
                        </span>
                      )}

                      {/* Date */}
                      {ev.date && (
                        <span className="text-[10px] font-mono text-textMuted/50">{ev.date}</span>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(ev.id, e)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-textMuted/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                    title="Delete event"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
