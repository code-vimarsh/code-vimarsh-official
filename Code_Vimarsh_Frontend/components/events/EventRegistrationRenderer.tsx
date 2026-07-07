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
import { useGlobalState } from '../../context/GlobalContext';

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
  const { addParticipant } = useGlobalState();
  const [form, setForm] = useState<EventForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string>('');
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
      // Simulate backend ID generation locally
      const ticketId = 'reg-' + Math.random().toString(36).substr(2, 9);
      setSubmittedTicketId(ticketId);

      // Map dynamic form fields to Participant properties
      const nameField = form.fields.find(f => f.label.toLowerCase().includes('name'));
      const emailField = form.fields.find(f => f.type === 'email');
      const phoneField = form.fields.find(f => f.type === 'phone');
      const githubField = form.fields.find(f => f.label.toLowerCase().includes('github'));
      const expField = form.fields.find(f => f.label.toLowerCase().includes('experience'));

      const newParticipant = {
        id: ticketId,
        name: (values[nameField?.id || ''] as string) || 'Registered Guest',
        email: (values[emailField?.id || ''] as string) || 'guest@example.com',
        eventId: eventId,
        eventTitle: eventTitle || 'Special Event',
        registeredAt: new Date().toISOString().split('T')[0],
        status: 'Registered' as const,
        whatsapp_number: (values[phoneField?.id || ''] as string) || '',
        github_username: (values[githubField?.id || ''] as string) || '',
        experience_level: (values[expField?.id || ''] as string) || '',
      };

      // Add to global state so it is instantly scannable and visible in Admin panel!
      addParticipant(newParticipant);

      // Keep response list aligned
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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(submittedTicketId)}&size=200x200&ecc=M&margin=4`;

    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-5 py-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          <CheckCircle size={24} className="text-green-400" />
        </motion.div>

        <div className="space-y-1">
          <p className="text-lg font-bold text-white">You're registered! 🎉</p>
          {eventTitle && (
            <p className="text-sm text-textMuted">
              Successfully registered for <span className="text-white/70 font-medium">{eventTitle}</span>.
            </p>
          )}
        </div>

        {/* Entry Ticket Card */}
        <div className="bg-[#111] border border-surfaceLight rounded-2xl p-6 max-w-sm w-full relative overflow-hidden mt-2">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-3">Your Event Entry Pass</p>

          <div className="bg-white p-3 rounded-xl inline-block mb-3">
            <img src={qrUrl} alt="QR Entry Pass" className="w-40 h-40" />
          </div>

          <p className="text-xs text-textMuted font-mono mb-4">Ticket ID: {submittedTicketId}</p>

          <div className="border-t border-dashed border-surfaceLight pt-4 text-left space-y-1">
            <p className="text-xs text-textMuted flex justify-between">
              <span>Event:</span>
              <span className="text-white font-medium truncate max-w-[200px]">{eventTitle}</span>
            </p>
            <p className="text-xs text-textMuted flex justify-between">
              <span>Status:</span>
              <span className="text-green-400 font-medium">Active Pass</span>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-textMuted leading-relaxed max-w-xs">
          Please screenshot or save this QR code to present at check-in on the day of the event.
        </p>
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
