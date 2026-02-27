/**
 * formSchemas.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * In-memory mock "database" for event form schemas and responses.
 *
 * BACKEND INTEGRATION:
 *  Replace these helpers with API calls:
 *    getFormByEventId   → GET  /api/forms?eventId=:id
 *    saveForm           → POST /api/forms  |  PUT /api/forms/:id
 *    submitResponse     → POST /api/forms/:formId/responses
 *    getResponses       → GET  /api/forms/:formId/responses
 */

import {
  EventForm,
  FormResponse,
  generateFieldId,
  generateFormId,
  generateOptionId,
} from '../types/formBuilder';

// ─── Seed data — one published form for the live event ───────────────────────

const SEED_FORMS: EventForm[] = [
  {
    id: 'form_seed_001',
    eventId: 'evt-001',
    title: 'Open Source Sprint – Registration',
    description: 'Join us for the live sprint! Fill in your details to get your Discord role and contribution tracking set up.',
    isPublished: true,
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: generateFieldId(),
        type: 'short_text',
        label: 'Full Name',
        placeholder: 'e.g. Aryan Buha',
        required: true,
        helpText: 'As it should appear on your certificate',
        order: 0,
        validation: { minLength: 2, maxLength: 80 },
      },
      {
        id: generateFieldId(),
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true,
        order: 1,
      },
      {
        id: generateFieldId(),
        type: 'phone',
        label: 'WhatsApp Number',
        placeholder: '+91 XXXXX XXXXX',
        required: false,
        helpText: "We'll send event updates here",
        order: 2,
      },
      {
        id: generateFieldId(),
        type: 'short_text',
        label: 'GitHub Username',
        placeholder: 'e.g. octocat',
        required: true,
        order: 3,
        validation: { pattern: '^[a-zA-Z0-9-]{1,39}$', patternMessage: 'Enter a valid GitHub username' },
      },
      {
        id: generateFieldId(),
        type: 'dropdown',
        label: 'Experience Level',
        required: true,
        order: 4,
        options: [
          { id: generateOptionId(), label: 'Beginner (< 6 months)', value: 'beginner' },
          { id: generateOptionId(), label: 'Intermediate (6m – 2y)', value: 'intermediate' },
          { id: generateOptionId(), label: 'Advanced (2+ years)', value: 'advanced' },
        ],
      },
      {
        id: generateFieldId(),
        type: 'checkbox',
        label: 'Areas of Interest',
        required: false,
        helpText: 'Select all that apply',
        order: 5,
        options: [
          { id: generateOptionId(), label: 'Frontend (React / Vue)', value: 'frontend' },
          { id: generateOptionId(), label: 'Backend (Node / Python)', value: 'backend' },
          { id: generateOptionId(), label: 'DevOps / CI-CD', value: 'devops' },
          { id: generateOptionId(), label: 'Documentation', value: 'docs' },
          { id: generateOptionId(), label: 'Testing / QA', value: 'testing' },
        ],
      },
      {
        id: generateFieldId(),
        type: 'long_text',
        label: 'Why do you want to participate?',
        placeholder: 'Tell us briefly what motivates you...',
        required: false,
        order: 6,
        validation: { maxLength: 300 },
      },
      {
        id: generateFieldId(),
        type: 'description_block',
        label: 'By submitting this form you agree to abide by the Code Vimarsh Code of Conduct and participate respectfully.',
        required: false,
        order: 7,
      },
    ],
  },
];

// ─── Runtime stores (replaces DB) ────────────────────────────────────────────

let _forms: EventForm[] = [...SEED_FORMS];
let _responses: FormResponse[] = [];

// ─── Form CRUD helpers ────────────────────────────────────────────────────────

/** Return the form config for a given eventId, or null */
export const getFormByEventId = (eventId: string): EventForm | null =>
  _forms.find((f) => f.eventId === eventId) ?? null;

/** Return form by its own id */
export const getFormById = (formId: string): EventForm | null =>
  _forms.find((f) => f.id === formId) ?? null;

/** Return all forms */
export const getAllForms = (): EventForm[] => [..._forms];

/**
 * Upsert a form schema.
 * If a form for the same eventId already exists it is replaced.
 */
export const saveForm = (form: Omit<EventForm, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): EventForm => {
  const now = new Date().toISOString();
  const existing = _forms.find((f) => f.eventId === form.eventId);

  const saved: EventForm = {
    ...form,
    id: form.id ?? existing?.id ?? generateFormId(),
    createdAt: existing?.createdAt ?? form.createdAt ?? now,
    updatedAt: now,
    isPublished: form.isPublished,
    isDraft: form.isDraft,
  };

  if (existing) {
    _forms = _forms.map((f) => (f.eventId === form.eventId ? saved : f));
  } else {
    _forms = [..._forms, saved];
  }

  return saved;
};

/** Delete a form by eventId */
export const deleteFormByEventId = (eventId: string): void => {
  _forms = _forms.filter((f) => f.eventId !== eventId);
};

// ─── Response helpers ─────────────────────────────────────────────────────────

export const submitResponse = (response: Omit<FormResponse, 'id' | 'submittedAt'>): FormResponse => {
  const saved: FormResponse = {
    ...response,
    id: `resp_${Date.now().toString(36)}`,
    submittedAt: new Date().toISOString(),
  };
  _responses = [..._responses, saved];
  return saved;
};

export const getResponsesByFormId = (formId: string): FormResponse[] =>
  _responses.filter((r) => r.formId === formId);

export const getResponsesByEventId = (eventId: string): FormResponse[] =>
  _responses.filter((r) => r.eventId === eventId);
