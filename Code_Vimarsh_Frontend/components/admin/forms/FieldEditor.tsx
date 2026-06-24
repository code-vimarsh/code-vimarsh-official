/**
 * FieldEditor.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Right-hand panel: full config editor for the currently selected field.
 * Every field attribute (label, placeholder, required, validation…) lives here.
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import type { FormField } from '../../../types/formBuilder';
import { FIELD_TYPE_META } from '../../../types/formBuilder';
import OptionEditor from './OptionEditor';

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2 rounded-xl text-sm text-white/85 placeholder-white/25 outline-none transition-all focus:ring-1 focus:ring-primary/40';
const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const EditorSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    className="rounded-xl p-4 space-y-3"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    <p className="text-[10px] font-semibold text-textMuted/60 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

// ─── Labeled row ──────────────────────────────────────────────────────────────

const Row: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-white/50">{label}</span>
    {children}
    {hint && <p className="text-[10px] text-textMuted/50">{hint}</p>}
  </label>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked, onChange, label,
}) => (
  <label className="flex items-center gap-3 cursor-pointer select-none group">
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
    <span className="text-sm text-white/65 group-hover:text-white/80 transition-colors">{label}</span>
  </label>
);

// ─── Number input row ─────────────────────────────────────────────────────────

const NumberRow: React.FC<{
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <Row label={label}>
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
      placeholder={placeholder ?? '—'}
      className={inputCls}
      style={inputStyle}
    />
  </Row>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface FieldEditorProps {
  field: FormField;
  onChange: (updated: FormField) => void;
  onClose: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onChange, onClose }) => {
  const meta = FIELD_TYPE_META.find((m) => m.type === field.type);
  const isLayout = field.type === 'section_title' || field.type === 'description_block';
  const isChoice = field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown';

  const update = useCallback(
    <K extends keyof FormField>(key: K, value: FormField[K]) => {
      onChange({ ...field, [key]: value });
    },
    [field, onChange]
  );

  const updateValidation = useCallback(
    <K extends keyof NonNullable<FormField['validation']>>(
      key: K,
      value: NonNullable<FormField['validation']>[K]
    ) => {
      onChange({ ...field, validation: { ...field.validation, [key]: value } });
    },
    [field, onChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col h-full overflow-y-auto"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div>
          <p className="text-xs text-textMuted">Editing field</p>
          <p className="text-sm font-semibold text-white leading-tight mt-0.5">{meta?.label ?? field.type}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/08 transition-colors"
          aria-label="Close editor"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">

        {/* ── Basic ── */}
        <EditorSection title="Basic">
          <Row label={isLayout ? 'Content / Heading' : 'Label *'}>
            <input
              value={field.label}
              onChange={(e) => update('label', e.target.value)}
              placeholder="Enter label…"
              className={inputCls}
              style={inputStyle}
            />
          </Row>

          {!isLayout && (
            <Row label="Placeholder text">
              <input
                value={field.placeholder ?? ''}
                onChange={(e) => update('placeholder', e.target.value)}
                placeholder="Hint shown inside the field…"
                className={inputCls}
                style={inputStyle}
              />
            </Row>
          )}

          <Row label="Help text (shown below the field)">
            <input
              value={field.helpText ?? ''}
              onChange={(e) => update('helpText', e.target.value)}
              placeholder="Optional guidance…"
              className={inputCls}
              style={inputStyle}
            />
          </Row>

          {!isLayout && (
            <Toggle
              checked={field.required}
              onChange={(v) => update('required', v)}
              label="Required field"
            />
          )}
        </EditorSection>

        {/* ── Options (choice fields) ── */}
        {isChoice && field.options && (
          <EditorSection title="Options">
            <OptionEditor
              options={field.options}
              onChange={(opts) => update('options', opts)}
            />
          </EditorSection>
        )}

        {/* ── Default value (non-layout, non-choice) ── */}
        {!isLayout && !isChoice && (
          <EditorSection title="Default Value">
            <Row label="Pre-filled value">
              <input
                type={field.type === 'date' ? 'date' : 'text'}
                value={(field.defaultValue as string) ?? ''}
                onChange={(e) => update('defaultValue', e.target.value)}
                placeholder="Leave blank for none…"
                className={inputCls}
                style={inputStyle}
              />
            </Row>
          </EditorSection>
        )}

        {/* ── Validation (non-layout) ── */}
        {!isLayout && (
          <EditorSection title="Validation">
            {(field.type === 'short_text' || field.type === 'long_text') && (
              <div className="grid grid-cols-2 gap-3">
                <NumberRow
                  label="Min length"
                  value={field.validation?.minLength}
                  onChange={(v) => updateValidation('minLength', v)}
                  placeholder="0"
                />
                <NumberRow
                  label="Max length"
                  value={field.validation?.maxLength}
                  onChange={(v) => updateValidation('maxLength', v)}
                  placeholder="∞"
                />
              </div>
            )}
            {field.type === 'number' && (
              <div className="grid grid-cols-2 gap-3">
                <NumberRow
                  label="Min value"
                  value={field.validation?.min}
                  onChange={(v) => updateValidation('min', v)}
                />
                <NumberRow
                  label="Max value"
                  value={field.validation?.max}
                  onChange={(v) => updateValidation('max', v)}
                />
              </div>
            )}
            {!isChoice && field.type !== 'date' && field.type !== 'file' && (
              <>
                <Row label="Regex pattern">
                  <input
                    value={field.validation?.pattern ?? ''}
                    onChange={(e) => updateValidation('pattern', e.target.value)}
                    placeholder="e.g. ^[A-Z]{3}$"
                    className={`${inputCls} font-mono text-xs`}
                    style={inputStyle}
                  />
                </Row>
                <Row label="Pattern error message">
                  <input
                    value={field.validation?.patternMessage ?? ''}
                    onChange={(e) => updateValidation('patternMessage', e.target.value)}
                    placeholder="Shown when pattern fails…"
                    className={inputCls}
                    style={inputStyle}
                  />
                </Row>
              </>
            )}
            {field.type === 'file' && (
              <>
                <Row
                  label="Max file size (MB)"
                  hint="Leave blank for unlimited"
                >
                  <input
                    type="number"
                    value={field.validation?.maxFileSizeMB ?? ''}
                    onChange={(e) =>
                      updateValidation(
                        'maxFileSizeMB',
                        e.target.value === '' ? undefined : parseFloat(e.target.value)
                      )
                    }
                    placeholder="e.g. 5"
                    className={inputCls}
                    style={inputStyle}
                  />
                </Row>
                <Row
                  label="Allowed file types"
                  hint="Comma-separated, e.g. .pdf,.png"
                >
                  <input
                    value={(field.validation?.allowedFileTypes ?? []).join(',')}
                    onChange={(e) =>
                      updateValidation(
                        'allowedFileTypes',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder=".pdf,.png,.jpg"
                    className={inputCls}
                    style={inputStyle}
                  />
                </Row>
              </>
            )}
            <Row label="Custom error message" hint="Overrides all auto-generated messages">
              <input
                value={field.validation?.customErrorMessage ?? ''}
                onChange={(e) => updateValidation('customErrorMessage', e.target.value)}
                placeholder="This field is invalid."
                className={inputCls}
                style={inputStyle}
              />
            </Row>
          </EditorSection>
        )}

        {/* ── Conditional visibility (future-ready) ── */}
        <EditorSection title="Conditional Visibility">
          <p className="text-xs text-textMuted/60 italic">
            Conditions can be added once another field is present in the form. Connect to backend to enable full conditional logic.
          </p>
          {field.visibilityCondition && (
            <div className="rounded-lg px-3 py-2 text-xs font-mono text-primary/60" style={{ background: 'rgba(255,106,0,0.07)' }}>
              Show when <strong>{field.visibilityCondition.fieldId}</strong>{' '}
              <strong>{field.visibilityCondition.operator}</strong>{' '}
              "{field.visibilityCondition.value}"
            </div>
          )}
        </EditorSection>

        {/* ── Field ID (read-only) ── */}
        <div className="px-2">
          <p className="text-[10px] text-textMuted/40 font-mono">ID: {field.id}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FieldEditor;
