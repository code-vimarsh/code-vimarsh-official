/**
 * formBuilder.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical TypeScript interfaces for the Event Registration Form Builder.
 *
 * BACKEND INTEGRATION:
 *  • EventForm schema → POST /api/forms   GET /api/forms/:eventId
 *  • FormResponse     → POST /api/forms/:eventId/responses
 *  • Analytics        → GET  /api/forms/:eventId/analytics
 */

// ─── Field types ──────────────────────────────────────────────────────────────

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'date'
  | 'file'
  | 'url'
  | 'section_title'
  | 'description_block';

// ─── Option (for radio / checkbox / dropdown) ─────────────────────────────────

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

// ─── Validation rules ─────────────────────────────────────────────────────────

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;        // for number fields
  max?: number;        // for number fields
  pattern?: string;    // regex string
  patternMessage?: string;
  customErrorMessage?: string;
  allowedFileTypes?: string[];    // e.g. ['.pdf', '.png']
  maxFileSizeMB?: number;
}

// ─── Conditional visibility (future-ready) ────────────────────────────────────

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'is_filled';

export interface VisibilityCondition {
  fieldId: string;
  operator: ConditionOperator;
  value?: string;
}

// ─── Single form field ────────────────────────────────────────────────────────

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: FieldOption[];
  validation?: ValidationRules;
  defaultValue?: string | string[] | boolean;
  visibilityCondition?: VisibilityCondition;
  order: number;
}

// ─── Full event form schema ───────────────────────────────────────────────────

export interface EventForm {
  id: string;           // form UUID
  eventId: string;      // links to Event.id
  title: string;
  description?: string;
  isPublished: boolean;
  isDraft: boolean;
  createdAt: string;    // ISO date string
  updatedAt: string;
  responseLimit?: number;        // max submissions; null = unlimited
  closeDate?: string;            // ISO — stop accepting after this date
  fields: FormField[];
}

// ─── Submitted response ──────────────────────────────────────────────────────

export type FieldValue = string | string[] | boolean | null;

export interface FormResponse {
  id: string;
  formId: string;
  eventId: string;
  submittedAt: string;
  answers: Record<string, FieldValue>; // fieldId → value
}

// ─── Validation result ────────────────────────────────────────────────────────

export interface FieldError {
  fieldId: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

// ─── Field type display metadata ─────────────────────────────────────────────

export interface FieldTypeMeta {
  type: FieldType;
  label: string;
  icon: string;          // lucide icon name (string for dynamic lookup)
  category: 'input' | 'choice' | 'layout';
  hasOptions: boolean;
  description: string;
}

export const FIELD_TYPE_META: FieldTypeMeta[] = [
  { type: 'short_text',       label: 'Short Text',      icon: 'Type',          category: 'input',  hasOptions: false, description: 'Single-line text input' },
  { type: 'long_text',        label: 'Long Text',        icon: 'AlignLeft',     category: 'input',  hasOptions: false, description: 'Multi-line textarea' },
  { type: 'email',            label: 'Email',            icon: 'Mail',          category: 'input',  hasOptions: false, description: 'Email address field' },
  { type: 'phone',            label: 'Phone',            icon: 'Phone',         category: 'input',  hasOptions: false, description: 'Phone number field' },
  { type: 'number',           label: 'Number',           icon: 'Hash',          category: 'input',  hasOptions: false, description: 'Numeric input' },
  { type: 'url',              label: 'URL',              icon: 'Link',          category: 'input',  hasOptions: false, description: 'Website or link field' },
  { type: 'date',             label: 'Date',             icon: 'Calendar',      category: 'input',  hasOptions: false, description: 'Date picker' },
  { type: 'file',             label: 'File Upload',      icon: 'Paperclip',     category: 'input',  hasOptions: false, description: 'File attachment' },
  { type: 'radio',            label: 'Radio Button',     icon: 'CircleDot',     category: 'choice', hasOptions: true,  description: 'Single-choice select' },
  { type: 'checkbox',         label: 'Checkbox',         icon: 'CheckSquare',   category: 'choice', hasOptions: true,  description: 'Multi-choice select' },
  { type: 'dropdown',         label: 'Dropdown',         icon: 'ChevronDown',   category: 'choice', hasOptions: true,  description: 'Dropdown selector' },
  { type: 'section_title',    label: 'Section Title',    icon: 'Heading',       category: 'layout', hasOptions: false, description: 'Visual section header' },
  { type: 'description_block',label: 'Description Block',icon: 'FileText',      category: 'layout', hasOptions: false, description: 'Static paragraph text' },
];

// ─── Utility: generate stable field ID ────────────────────────────────────────

export const generateFieldId = (): string =>
  `field_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const generateOptionId = (): string =>
  `opt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const generateFormId = (): string =>
  `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Default field factory ────────────────────────────────────────────────────

export const createDefaultField = (type: FieldType, order: number): FormField => {
  const base: FormField = {
    id: generateFieldId(),
    type,
    label: FIELD_TYPE_META.find((m) => m.type === type)?.label ?? 'Field',
    required: false,
    order,
  };

  if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
    base.options = [
      { id: generateOptionId(), label: 'Option 1', value: 'option_1' },
      { id: generateOptionId(), label: 'Option 2', value: 'option_2' },
    ];
  }

  return base;
};
