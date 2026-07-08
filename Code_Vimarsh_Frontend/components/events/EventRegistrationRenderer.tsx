/**
 * EventRegistrationRenderer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * User-facing registration form.
 * Loaded inside EventDetails for events with status === 'live'.
 * Fetches the published EventForm config via getFormByEventId and renders it.
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Download, Shield } from 'lucide-react';
import type { EventForm, FieldValue } from '../../types/formBuilder';
import { getFormByEventId, submitResponse } from '../../data/formSchemas';
import { validateForm, buildInitialValues, isFieldVisible } from './ValidationEngine';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { useGlobalState } from '../../context/GlobalContext';
import { supabase } from '../../services/supabase';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

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
  const { currentUser, events, participants, addParticipant } = useGlobalState();
  const [form, setForm] = useState<EventForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredParticipant, setRegisteredParticipant] = useState<any | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  // ── Load form config ───────────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    setSubmitted(false);
    setValues({});
    setErrors({});
    setSubmitError(null);

    const event = events.find(e => e.id === eventId);
    if (event) {
      const fetchedForm: EventForm = {
        eventId: event.id,
        isPublished: event.isPublished ?? false,
        fields: event.formFields || [],
      };
      setForm(fetchedForm);
      
      const initialVals = buildInitialValues(fetchedForm.fields);
      if (currentUser) {
        fetchedForm.fields.forEach(f => {
          if (f.type === 'email' || f.label.toLowerCase().includes('email')) {
            initialVals[f.id] = currentUser.email || '';
          } else if (f.label.toLowerCase().includes('name') || f.label.toLowerCase().includes('full name') || f.label.toLowerCase() === 'fullname') {
            initialVals[f.id] = currentUser.name || '';
          }
        });
      }
      setValues(initialVals);
    } else {
      setForm(null);
    }
    setLoading(false);
  }, [eventId, events, currentUser]);

  useEffect(() => {
    if (submitted && registeredParticipant) {
      QRCode.toDataURL(registeredParticipant.id, {
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err));
    }
  }, [submitted, registeredParticipant]);

  useEffect(() => {
    if (currentUser) {
      const existing = participants.find(
        (p) => p.eventId === eventId && p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (existing) {
        setRegisteredParticipant(existing);
        setSubmitted(true);
      }
    }
  }, [currentUser, participants, eventId]);

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
      const nameField = form.fields.find(f => f.label.toLowerCase().includes('name') || f.type === 'short_text');
      const emailField = form.fields.find(f => f.label.toLowerCase().includes('email') || f.type === 'email');
      const nameVal = nameField ? (values[nameField.id] as string) : 'Participant';
      const emailVal = emailField ? (values[emailField.id] as string) : '';

      if (emailVal) {
        const isAlreadyRegistered = participants.some(
          (p) => p.eventId === eventId && p.email.toLowerCase() === emailVal.toLowerCase()
        );
        if (isAlreadyRegistered) {
          setSubmitError('You have already registered for this event.');
          setSubmitting(false);
          return;
        }
      }

      let newPart: any = null;

      try {
        const phoneField = form.fields.find(f => f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('whatsapp') || f.label.toLowerCase().includes('contact'));
        const phoneVal = phoneField ? (values[phoneField.id] as string) : '';

        // Check if event ID is a valid UUID. Pre-seeded mock events (like evt-6) use mock IDs.
        const isValidUUID = (uuidStr: string) => {
          const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return regex.test(uuidStr);
        };

        if (!isValidUUID(eventId)) {
          throw new Error(`The event ID "${eventId}" is not a valid UUID format. Bypassing database insert and simulating locally.`);
        }

        const ticketCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Query: Insert registration details into Supabase event_registrations
        const { data, error } = await supabase
          .from('event_registrations')
          .insert([{
            event_id: eventId,
            user_id: currentUser?.id || null,
            full_name: nameVal,
            email: emailVal,
            phone: phoneVal,
            custom_answers: values,
            status: 'registered',
            ticket_code: ticketCode,
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Supabase insert succeeded but RLS prevented selecting the row.');
        }

        newPart = {
          id: data.id,
          ticketCode: data.ticket_code || ticketCode,
          name: data.full_name,
          email: data.email,
          eventId: data.event_id,
          eventTitle: eventTitle || 'Event',
          registeredAt: new Date(data.registered_at).toISOString().split('T')[0],
          status: data.status as 'registered' | 'attended',
          customAnswers: data.custom_answers || {},
        };
      } catch (dbErr) {
        console.warn('Supabase registration bypassed/failed:', dbErr);
        const localCode = Math.floor(1000 + Math.random() * 9000).toString();
        newPart = {
          id: `reg_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
          ticketCode: localCode,
          name: nameVal,
          email: emailVal,
          eventId: eventId,
          eventTitle: eventTitle || 'Event',
          registeredAt: new Date().toISOString().split('T')[0],
          status: 'registered' as const,
          customAnswers: values
        };
      }

      submitResponse({ formId: form.id, eventId, answers: values });
      addParticipant(newPart);
      setRegisteredParticipant(newPart);
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

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a'
      });
      const link = document.createElement('a');
      link.download = `CV_Ticket_${registeredParticipant.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to capture ticket:', err);
    }
  };

  if (submitted) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-6 text-center"
      >
        <div
          ref={ticketRef}
          className="relative w-full max-w-sm rounded-[2rem] bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-white/10 p-8 shadow-2xl text-left overflow-hidden select-none"
        >
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary via-orange-500 to-primary" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="text-primary" size={16} />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">CODE VIMARSH NEXUS</span>
            </div>
            <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
              ENTRY PASS
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">EVENT TITLE</span>
              <h3 className="text-xl font-display font-black text-white leading-normal tracking-tight uppercase italic pb-1.5">
                {eventTitle || 'CONFERENCE'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">CANDIDATE</span>
                <p className="text-sm font-bold text-white leading-normal pb-1">{registeredParticipant?.name}</p>
              </div>
              <div>
                <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">TICKET ID</span>
                <p className="text-xs font-mono text-primary font-bold leading-normal pb-1 truncate">
                  #{registeredParticipant?.ticketCode || registeredParticipant?.id?.slice(0, 4) || ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">DATE</span>
                <p className="text-xs text-white/80 font-semibold leading-normal pb-1">{registeredParticipant?.registeredAt}</p>
              </div>
              <div>
                <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">STATUS</span>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full inline-block leading-none mt-1">
                  CONFIRMED
                </span>
              </div>
            </div>
          </div>

          <div className="relative my-6 flex items-center justify-between">
            <div className="absolute left-0 -ml-10 w-4 h-8 bg-[#0a0a0a] rounded-r-full border-r border-y border-white/10" />
            <div className="w-full border-t border-dashed border-white/10 mx-2" />
            <div className="absolute right-0 -mr-10 w-4 h-8 bg-[#0a0a0a] rounded-l-full border-l border-y border-white/10" />
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            {qrCodeUrl ? (
              <div className="relative p-2 bg-white rounded-xl shadow-xl shadow-primary/5">
                <img src={qrCodeUrl} alt="QR Code Ticket" className="w-40 h-40 object-contain block" />
              </div>
            ) : (
              <div className="w-40 h-40 flex items-center justify-center border border-dashed border-white/20 rounded-xl animate-pulse">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            )}
            
            <p className="text-[9px] text-textMuted font-mono uppercase tracking-[0.15em] mt-4 text-center">
              SCAN FOR ATTENDANCE CHECK-IN
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadTicket}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-black bg-primary hover:bg-secondary hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            <Download size={14} /> Download Pass
          </button>
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
                disabled={submitting || (currentUser && (field.type === 'email' || field.label.toLowerCase().includes('email') || field.label.toLowerCase().includes('name')))}
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
