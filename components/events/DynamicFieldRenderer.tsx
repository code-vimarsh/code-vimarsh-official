/**
 * DynamicFieldRenderer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single FormField as a user-facing input.
 * 100% config-driven — no hardcoded field logic in JSX.
 * Used by both FormPreview (admin) and EventRegistrationRenderer (user).
 */

import React, { useId } from 'react';
import type { FormField, FieldValue } from '../../types/formBuilder';

// ─── Shared style primitives ──────────────────────────────────────────────────

const BASE_INPUT =
  'w-full px-4 py-2.5 rounded-xl text-sm text-white/85 placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-primary/40 disabled:opacity-50';

const baseInputStyle = (hasError: boolean) => ({
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)'}`,
});

// ─── Sub-renderers ────────────────────────────────────────────────────────────

interface FieldProps {
  field: FormField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  error?: string;
  disabled?: boolean;
}

const TextInput: React.FC<FieldProps & { type?: string }> = ({ field, value, onChange, error, disabled, type = 'text' }) => (
  <input
    type={type}
    id={field.id}
    value={(value as string) ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    disabled={disabled}
    className={BASE_INPUT}
    style={{ ...baseInputStyle(!!error), ...(type === 'date' ? { colorScheme: 'light' } : {}) }}
    aria-invalid={!!error}
    aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-help` : undefined}
  />
);

const TextareaInput: React.FC<FieldProps> = ({ field, value, onChange, error, disabled }) => (
  <textarea
    id={field.id}
    value={(value as string) ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    disabled={disabled}
    rows={4}
    className={`${BASE_INPUT} resize-y`}
    style={baseInputStyle(!!error)}
    aria-invalid={!!error}
  />
);

const RadioGroup: React.FC<FieldProps> = ({ field, value, onChange, error, disabled }) => (
  <div className="space-y-2" role="radiogroup" aria-labelledby={`${field.id}-label`}>
    {(field.options ?? []).map((opt) => (
      <label
        key={opt.id}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
        style={{
          background: value === opt.value ? 'rgba(255,106,0,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${value === opt.value ? 'rgba(255,106,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
        }}
      >
        <input
          type="radio"
          name={field.id}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            value === opt.value ? 'border-primary' : 'border-white/20'
          }`}
        >
          {value === opt.value && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </span>
        <span className="text-sm text-white/80">{opt.label}</span>
      </label>
    ))}
  </div>
);

const CheckboxGroup: React.FC<FieldProps> = ({ field, value, onChange, error, disabled }) => {
  const selected: string[] = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${field.id}-label`}>
      {(field.options ?? []).map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <label
            key={opt.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
            style={{
              background: checked ? 'rgba(255,106,0,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked ? 'rgba(255,106,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <input
              type="checkbox"
              value={opt.value}
              checked={checked}
              onChange={() => toggle(opt.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked ? 'border-primary bg-primary' : 'border-white/20'
              }`}
            >
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-sm text-white/80">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

const DropdownInput: React.FC<FieldProps> = ({ field, value, onChange, error, disabled }) => (
  <div className="relative">
    <select
      id={field.id}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${BASE_INPUT} appearance-none pr-10 cursor-pointer`}
      style={baseInputStyle(!!error)}
      aria-invalid={!!error}
    >
      <option value="" style={{ background: '#111' }}>{field.placeholder ?? '— Select —'}</option>
      {(field.options ?? []).map((opt) => (
        <option key={opt.id} value={opt.value} style={{ background: '#111' }}>
          {opt.label}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" aria-hidden="true">
      ▾
    </span>
  </div>
);

const FileInput: React.FC<FieldProps> = ({ field, onChange, error, disabled }) => {
  const accept = field.validation?.allowedFileTypes?.join(',');
  return (
    <label
      className="block w-full px-4 py-4 rounded-xl text-center cursor-pointer transition-all"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px dashed ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
      }}
    >
      <input
        type="file"
        id={field.id}
        accept={accept}
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] as unknown as FieldValue)}
        className="sr-only"
      />
      <span className="block text-2xl mb-1" aria-hidden="true">📎</span>
      <span className="text-sm text-white/50">Click to upload</span>
      {accept && <span className="block text-[10px] text-textMuted mt-0.5">{accept}</span>}
    </label>
  );
};

// ─── Section / Description blocks ────────────────────────────────────────────

const SectionTitleBlock: React.FC<{ label: string }> = ({ label }) => (
  <div className="pt-4">
    <h3 className="font-display font-bold text-lg text-white leading-tight">{label}</h3>
    <div className="mt-2 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,106,0,0.4), transparent)' }} />
  </div>
);

const DescriptionBlock: React.FC<{ label: string }> = ({ label }) => (
  <p className="text-sm text-white/55 leading-relaxed">{label}</p>
);

// ─── Error message ────────────────────────────────────────────────────────────

const FieldErrorMsg: React.FC<{ id: string; message: string }> = ({ id, message }) => (
  <p id={`${id}-error`} className="text-xs text-red-400 mt-1 flex items-center gap-1" role="alert">
    <span aria-hidden="true">⚠</span> {message}
  </p>
);

// ─── Main renderer ────────────────────────────────────────────────────────────

interface DynamicFieldRendererProps {
  field: FormField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  error?: string;
  disabled?: boolean;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const sharedProps: FieldProps = { field, value, onChange, error, disabled };

  // ── Layout-only blocks ─────────────────────────────────────────────────────
  if (field.type === 'section_title') return <SectionTitleBlock label={field.label} />;
  if (field.type === 'description_block') return <DescriptionBlock label={field.label} />;

  // ── Rendered field with label + error ─────────────────────────────────────
  const renderInput = () => {
    switch (field.type) {
      case 'short_text':   return <TextInput {...sharedProps} type="text" />;
      case 'long_text':    return <TextareaInput {...sharedProps} />;
      case 'email':        return <TextInput {...sharedProps} type="email" />;
      case 'phone':        return <TextInput {...sharedProps} type="tel" />;
      case 'number':       return <TextInput {...sharedProps} type="number" />;
      case 'url':          return <TextInput {...sharedProps} type="url" />;
      case 'date':         return <TextInput {...sharedProps} type="date" />;
      case 'file':         return <FileInput {...sharedProps} />;
      case 'radio':        return <RadioGroup {...sharedProps} />;
      case 'checkbox':     return <CheckboxGroup {...sharedProps} />;
      case 'dropdown':     return <DropdownInput {...sharedProps} />;
      default:             return <TextInput {...sharedProps} type="text" />;
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label
        id={`${field.id}-label`}
        htmlFor={field.type !== 'radio' && field.type !== 'checkbox' ? field.id : undefined}
        className="block text-sm font-medium text-white/75"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-primary/80" aria-label="required">*</span>
        )}
      </label>

      {/* Help text */}
      {field.helpText && (
        <p id={`${field.id}-help`} className="text-xs text-textMuted">{field.helpText}</p>
      )}

      {/* Input */}
      {renderInput()}

      {/* Error */}
      {error && <FieldErrorMsg id={field.id} message={error} />}
    </div>
  );
};

export default DynamicFieldRenderer;
