/**
 * ValidationEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure validation logic — zero JSX, zero side-effects.
 * Driven entirely by FormField config; renderer never needs hardcoded rules.
 */

import type {
  FormField,
  FieldValue,
  FieldError,
  ValidationResult,
} from '../../types/formBuilder';

// ─── Validate a single field value ────────────────────────────────────────────

export const validateField = (field: FormField, value: FieldValue): string | null => {
  const v = field.validation;
  const customMsg = v?.customErrorMessage;

  // Layout fields are never validated
  if (field.type === 'section_title' || field.type === 'description_block') return null;

  // ── Required ──────────────────────────────────────────────────────────────
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return customMsg ?? `${field.label} is required.`;
  }

  // Nothing to validate if empty and not required
  if (isEmpty) return null;

  const strVal = typeof value === 'string' ? value : '';

  // ── Email ─────────────────────────────────────────────────────────────────
  if (field.type === 'email') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(strVal)) return customMsg ?? 'Enter a valid email address.';
  }

  // ── Phone ─────────────────────────────────────────────────────────────────
  if (field.type === 'phone') {
    const phoneRe = /^[+\d][\d\s\-().]{6,19}$/;
    if (!phoneRe.test(strVal)) return customMsg ?? 'Enter a valid phone number.';
  }

  // ── URL ───────────────────────────────────────────────────────────────────
  if (field.type === 'url') {
    try {
      new URL(strVal);
    } catch {
      return customMsg ?? 'Enter a valid URL (include https://).';
    }
  }

  // ── Number ────────────────────────────────────────────────────────────────
  if (field.type === 'number') {
    const num = parseFloat(strVal);
    if (isNaN(num)) return customMsg ?? 'Enter a valid number.';
    if (v?.min !== undefined && num < v.min) return customMsg ?? `Minimum value is ${v.min}.`;
    if (v?.max !== undefined && num > v.max) return customMsg ?? `Maximum value is ${v.max}.`;
  }

  // ── String length ─────────────────────────────────────────────────────────
  if (typeof value === 'string') {
    if (v?.minLength !== undefined && value.length < v.minLength)
      return customMsg ?? `Minimum ${v.minLength} characters required.`;
    if (v?.maxLength !== undefined && value.length > v.maxLength)
      return customMsg ?? `Maximum ${v.maxLength} characters allowed.`;
  }

  // ── Regex pattern ─────────────────────────────────────────────────────────
  if (v?.pattern && typeof value === 'string') {
    try {
      const re = new RegExp(v.pattern);
      if (!re.test(value)) return v.patternMessage ?? customMsg ?? 'Invalid format.';
    } catch {
      // malformed regex — skip silently
    }
  }

  // ── File upload ───────────────────────────────────────────────────────────
  if (field.type === 'file' && value instanceof File) {
    const file = value as unknown as File;
    if (v?.maxFileSizeMB && file.size > v.maxFileSizeMB * 1024 * 1024) {
      return customMsg ?? `File must be smaller than ${v.maxFileSizeMB} MB.`;
    }
    if (v?.allowedFileTypes && v.allowedFileTypes.length > 0) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!v.allowedFileTypes.includes(ext)) {
        return customMsg ?? `Allowed types: ${v.allowedFileTypes.join(', ')}.`;
      }
    }
  }

  return null;
};

// ─── Validate entire form ─────────────────────────────────────────────────────

export const validateForm = (
  fields: FormField[],
  values: Record<string, FieldValue>
): ValidationResult => {
  const errors: FieldError[] = [];

  for (const field of fields) {
    const value = values[field.id] ?? null;
    const message = validateField(field, value);
    if (message) errors.push({ fieldId: field.id, message });
  }

  return { valid: errors.length === 0, errors };
};

// ─── Check conditional visibility ────────────────────────────────────────────

export const isFieldVisible = (
  field: FormField,
  values: Record<string, FieldValue>
): boolean => {
  if (!field.visibilityCondition) return true;

  const { fieldId, operator, value: condValue } = field.visibilityCondition;
  const sourceValue = values[fieldId];

  switch (operator) {
    case 'equals':
      return sourceValue === condValue;
    case 'not_equals':
      return sourceValue !== condValue;
    case 'contains':
      return Array.isArray(sourceValue)
        ? sourceValue.includes(condValue as string)
        : typeof sourceValue === 'string' && sourceValue.includes(condValue ?? '');
    case 'is_filled':
      return sourceValue !== null && sourceValue !== undefined && sourceValue !== '';
    default:
      return true;
  }
};

// ─── Build initial values map ─────────────────────────────────────────────────

export const buildInitialValues = (fields: FormField[]): Record<string, FieldValue> => {
  const map: Record<string, FieldValue> = {};
  for (const field of fields) {
    if (field.type === 'section_title' || field.type === 'description_block') continue;
    if (field.defaultValue !== undefined) {
      map[field.id] = field.defaultValue as FieldValue;
    } else if (field.type === 'checkbox') {
      map[field.id] = [];
    } else {
      map[field.id] = '';
    }
  }
  return map;
};
