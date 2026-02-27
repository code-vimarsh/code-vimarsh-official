/**
 * FormBuilder.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Main Admin Form Builder shell — Google Forms-like 3-column layout.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Header toolbar (title | preview toggle | save/pub)  │
 *   ├────────┬────────────────────────────┬────────────────┤
 *   │  Meta  │ Field list + Add button    │  Field editor  │
 *   │ panel  │                            │  (right panel) │
 *   └────────┴────────────────────────────┴────────────────┘
 *
 * Preview mode: replaces the 3-column body with <FormPreview />.
 */

import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Save,
  Zap,
  Plus,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import type { EventForm, FormField, FieldType } from '../../../types/formBuilder';
import { createDefaultField, generateFormId } from '../../../types/formBuilder';
import { saveForm } from '../../../data/formSchemas';

import FieldTypeSelector from './FieldTypeSelector';
import DraggableFieldList from './DraggableFieldList';
import FieldEditor from './FieldEditor';
import FormPreview from './FormPreview';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormBuilderProps {
  /**
   * Pre-loaded form. Pass `null` to start with a blank form.
   */
  initialForm?: EventForm | null;
  /**
   * Event ID to associate the form with.
   * Required to save/publish the form.
   */
  eventId?: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Utility ──────────────────────────────────────────────────────────────────

const makeBlankForm = (eventId?: string): EventForm => ({
  id: generateFormId(),
  eventId: eventId ?? '',
  title: 'Event Registration Form',
  description: '',
  fields: [],
  isPublished: false,
  isDraft: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SaveBadgeProps {
  status: SaveStatus;
}

const SaveBadge: React.FC<SaveBadgeProps> = ({ status }) => {
  if (status === 'idle') return null;
  const map: Record<Exclude<SaveStatus, 'idle'>, { icon: React.ReactNode; text: string; color: string }> = {
    saving: { icon: <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />, text: 'Saving…', color: 'text-yellow-400' },
    saved:  { icon: <CheckCircle size={12} />, text: 'Saved',  color: 'text-green-400'  },
    error:  { icon: <AlertCircle size={12} />, text: 'Error',  color: 'text-red-400'    },
  };
  const { icon, text, color } = map[status as Exclude<SaveStatus, 'idle'>];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
      {icon} {text}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const FormBuilder: React.FC<FormBuilderProps> = ({ initialForm = null, eventId }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [form, setForm] = useState<EventForm>(() =>
    initialForm ? { ...initialForm } : makeBlankForm(eventId)
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedField = form.fields.find((f) => f.id === selectedFieldId) ?? null;

  // ── Field operations ───────────────────────────────────────────────────────

  const addField = useCallback((type: FieldType) => {
    setForm((prev) => {
      const newField = createDefaultField(type, prev.fields.length + 1);
      return { ...prev, fields: [...prev.fields, newField] };
    });
    setShowTypeSelector(false);
    // Auto-select the new field after state flush
    setTimeout(() => {
      setForm((prev) => {
        const last = prev.fields[prev.fields.length - 1];
        if (last) setSelectedFieldId(last.id);
        return prev;
      });
    }, 0);
  }, []);

  const updateField = useCallback((id: string, updated: FormField) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? updated : f)),
    }));
  }, []);

  const deleteField = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
    setSelectedFieldId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateField = useCallback((id: string) => {
    setForm((prev) => {
      const idx = prev.fields.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const src = prev.fields[idx];
      const copy: FormField = {
        ...JSON.parse(JSON.stringify(src)),
        id: `fld_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        label: `${src.label} (copy)`,
        order: src.order + 0.5,
      };
      const next = [...prev.fields.slice(0, idx + 1), copy, ...prev.fields.slice(idx + 1)].map(
        (f, i) => ({ ...f, order: i + 1 })
      );
      return { ...prev, fields: next };
    });
  }, []);

  const reorderFields = useCallback((reordered: FormField[]) => {
    setForm((prev) => ({ ...prev, fields: reordered }));
  }, []);

  // ── Form meta ──────────────────────────────────────────────────────────────

  const updateTitle = (v: string) => setForm((p) => ({ ...p, title: v }));
  const updateDescription = (v: string) => setForm((p) => ({ ...p, description: v }));

  // ── Save helpers ───────────────────────────────────────────────────────────

  const persist = (published: boolean) => {
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    try {
      const toSave: EventForm = {
        ...form,
        isPublished: published,
        isDraft: !published,
        updatedAt: new Date().toISOString(),
      };
      saveForm(toSave);
      setForm(toSave);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
    saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleSaveDraft = () => persist(false);
  const handlePublish   = () => persist(true);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full min-h-screen"
      style={{ background: '#0a0a0a', color: '#e0e0e0' }}
    >
      {/* ── Top toolbar ────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 px-6 py-3 flex items-center gap-4 sticky top-0 z-10"
        style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}
      >
        {/* Form title (inline edit) */}
        <input
          value={form.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Form title…"
          className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-white/85 outline-none border-b border-transparent focus:border-white/20 transition-colors py-0.5 truncate"
          aria-label="Form title"
        />

        <div className="flex items-center gap-3 shrink-0">
          <SaveBadge status={saveStatus} />

          {/* Preview toggle */}
          <button
            onClick={() => setIsPreviewMode((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: isPreviewMode ? 'rgba(255,106,0,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isPreviewMode ? 'rgba(255,106,0,0.35)' : 'rgba(255,255,255,0.10)'}`,
              color: isPreviewMode ? '#ff6a00' : '#aaa',
            }}
          >
            {isPreviewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>

          {/* Save draft */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#ccc',
            }}
          >
            <Save size={13} />
            Save Draft
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff6a00, #ff9a00)', boxShadow: '0 0 14px rgba(255,106,0,0.3)' }}
          >
            <Zap size={13} />
            {form.isPublished ? 'Re-publish' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isPreviewMode ? (
          /* ── PREVIEW MODE ──────────────────────────────────────────────── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 overflow-y-auto px-6 py-10"
          >
            <div className="max-w-lg mx-auto">
              <div className="mb-6 flex items-center gap-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold"
                  style={{ background: 'rgba(255,106,0,0.12)', color: '#ff6a00' }}
                >
                  Preview Mode
                </span>
                <span className="text-xs text-textMuted">This is exactly what registrants will see.</span>
              </div>
              <div
                className="rounded-2xl p-6"
                style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <FormPreview form={form} />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── EDITOR MODE ───────────────────────────────────────────────── */
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 min-h-0 overflow-hidden"
          >
            {/* ── Left meta panel ──────────────────────────────────────── */}
            <aside
              className="w-56 shrink-0 flex flex-col gap-5 p-5 overflow-y-auto"
              style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
            >
              <section>
                <p className="text-[10px] uppercase tracking-widest text-textMuted mb-3 font-semibold">Form Info</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => updateTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white/80 outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => updateDescription(e.target.value)}
                      rows={3}
                      placeholder="Optional description…"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white/80 outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] uppercase tracking-widest text-textMuted mb-3 font-semibold">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: form.isPublished ? '#22c55e' : '#6b7280' }}
                  />
                  <span className="text-xs text-white/60">
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </section>

              <section>
                <p className="text-[10px] uppercase tracking-widest text-textMuted mb-3 font-semibold">Fields</p>
                <div className="text-2xl font-bold text-white/90">{form.fields.length}</div>
                <div className="text-[10px] text-textMuted">total fields</div>
              </section>
            </aside>

            {/* ── Center: field list ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {/* Add field button */}
              <div className="px-6 pt-6 pb-3">
                <div className="relative">
                  <button
                    onClick={() => setShowTypeSelector((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full justify-center"
                    style={{
                      background: showTypeSelector ? 'rgba(255,106,0,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px dashed ${showTypeSelector ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.12)'}`,
                      color: showTypeSelector ? '#ff6a00' : '#888',
                    }}
                  >
                    <Plus size={16} />
                    Add Field
                    <ChevronDown
                      size={14}
                      className="transition-transform"
                      style={{ transform: showTypeSelector ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>

                  <AnimatePresence>
                    {showTypeSelector && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-20">
                        <FieldTypeSelector
                          onSelect={addField}
                          onClose={() => setShowTypeSelector(false)}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Field list */}
              <div className="flex-1 px-6 pb-10">
                <DraggableFieldList
                  fields={form.fields}
                  selectedId={selectedFieldId}
                  onSelect={setSelectedFieldId}
                  onReorder={reorderFields}
                  onDuplicate={duplicateField}
                  onDelete={deleteField}
                />
              </div>
            </div>

            {/* ── Right: field editor ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {selectedField ? (
                <motion.aside
                  key={selectedField.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="w-80 shrink-0 overflow-y-auto"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <FieldEditor
                    field={selectedField}
                    onChange={(updated) => updateField(selectedField.id, updated)}
                    onClose={() => setSelectedFieldId(null)}
                  />
                </motion.aside>
              ) : (
                <motion.aside
                  key="empty-editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-80 shrink-0 flex flex-col items-center justify-center gap-3 text-center p-8"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    ✏️
                  </div>
                  <div>
                    <p className="text-sm text-white/50 font-medium">No field selected</p>
                    <p className="text-xs text-textMuted mt-1">Click a field to edit its settings</p>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormBuilder;
