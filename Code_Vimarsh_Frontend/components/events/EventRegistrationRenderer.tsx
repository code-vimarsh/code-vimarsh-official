/**
 * EventRegistrationRenderer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * User-facing registration form.
 * Loaded inside EventDetails for events with status === 'live'.
 * Fetches the published EventForm config via getFormByEventId and renders it.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { EventForm, FieldValue } from '../../types/formBuilder';
import { getFormByEventId, submitResponse } from '../../data/formSchemas';
import { validateForm, buildInitialValues, isFieldVisible } from './ValidationEngine';
import DynamicFieldRenderer from './DynamicFieldRenderer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventRegistrationRendererProps {
  /** The ID of the event (maps to EventForm.eventId) */
  eventId: string;
  /** Optional: caller's event title for the success message */
  eventTitle?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EventRegistrationRenderer: React.FC<EventRegistrationRendererProps> = ({
  eventId,
  eventTitle,
}) => {
  const [form, setForm] = useState<EventForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Load form config ───────────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    setSubmitted(false);
    setValues({});
    setErrors({});
    setSubmitError(null);

    // Simulated async load (replace with: const res = await fetch(`/api/forms/event/${eventId}`) )
    const t = setTimeout(() => {
      const fetched = getFormByEventId(eventId);
      setForm(fetched ?? null);
      if (fetched) setValues(buildInitialValues(fetched.fields));
      setLoading(false);
    }, 80);

    return () => clearTimeout(t);
  }, [eventId]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (fieldId: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSubmitError(null);

    // Validate
    const result = validateForm(form.fields, values);
    if (!result.valid) {
      const map: Record<string, string> = {};
      result.errors.forEach((err) => { map[err.fieldId] = err.message; });
      setErrors(map);
      // Scroll to first error
      const firstId = result.errors[0]?.fieldId;
      if (firstId) {
        document.getElementById(firstId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    try {
      // Replace with: await fetch(`/api/forms/${form.id}/respond`, { method: 'POST', body: JSON.stringify({ values }) })
      submitResponse({ formId: form.id, eventId, answers: values });
      setSubmitted(true);
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 gap-3 text-textMuted">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading registration form…</span>
      </div>
    );
  }

  // ── No published form ──────────────────────────────────────────────────────

  if (!form || !form.isPublished) {
    return (
      <div className="space-y-4 py-2">
        <div
          className="rounded-xl px-5 py-5 flex items-start gap-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-2xl mt-0.5" aria-hidden="true">📋</span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white/80">Registration form coming soon</p>
            <p className="text-xs text-textMuted leading-relaxed">
              The online registration form has not been published yet for this event.
              Please check back later or reach out via the contact page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-5 py-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          <CheckCircle size={32} className="text-green-400" />
        </motion.div>

        <div className="space-y-1">
          <p className="text-lg font-bold text-white">You're registered! 🎉</p>
          {eventTitle && (
            <p className="text-sm text-textMuted">
              Successfully registered for <span className="text-white/70 font-medium">{eventTitle}</span>.
            </p>
          )}
          <p className="text-xs text-textMuted mt-2">Check your email for confirmation details.</p>
        </div>
      </motion.div>
    );
  }

  // ── Visible fields ─────────────────────────────────────────────────────────

  const visibleFields = form.fields
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((f) => isFieldVisible(f, values));

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      {form.description && (
        <p className="text-sm text-textMuted leading-relaxed mb-6">{form.description}</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <AnimatePresence initial={false}>
          {visibleFields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ delay: i * 0.03, duration: 0.22 }}
            >
              <DynamicFieldRenderer
                field={field}
                value={values[field.id] ?? ''}
                onChange={(v) => handleChange(field.id, v)}
                error={errors[field.id]}
                disabled={submitting}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Global submit error */}
        {submitError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
            <span aria-hidden="true">⚠</span> {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #ff6a00, #ff9a00)',
            boxShadow: '0 0 28px rgba(255,106,0,0.25)',
          }}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? 'Submitting…' : 'Register Now'}
        </button>
      </form>
    </div>
  );
};

export default EventRegistrationRenderer;
