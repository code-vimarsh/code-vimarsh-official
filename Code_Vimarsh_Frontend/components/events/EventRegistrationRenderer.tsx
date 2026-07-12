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
import { downloadBoardingPass } from '../../utils/downloadBoardingPass';

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
      const fetchedForm = {
        eventId: event.id,
        isPublished: event.isPublished ?? false,
        fields: event.formFields || [],
      } as EventForm;
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
        (p) =>
          p.eventId === eventId &&
          ((p.email && p.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            (p.userId && p.userId === currentUser.id))
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
    let didSync = false;
    try {
      const nameField = form.fields.find(f => f.label.toLowerCase().includes('name'));
      // Only fallback to first short_text if not logged in
      const finalNameField = nameField || (!currentUser ? form.fields.find(f => f.type === 'short_text') : undefined);
      const nameVal = finalNameField ? (values[finalNameField.id] as string) : (currentUser?.name || 'Participant');

      const emailField = form.fields.find(f => f.label.toLowerCase().includes('email') || f.type === 'email');
      const emailVal = emailField ? (values[emailField.id] as string) : (currentUser?.email || '');

      const isAlreadyRegistered = participants.some(
        (p) => p.eventId === eventId && (
          (emailVal && p.email?.toLowerCase() === emailVal.toLowerCase()) ||
          (currentUser && p.userId === currentUser.id)
        )
      );
      if (isAlreadyRegistered) {
        setSubmitError('You have already registered for this event.');
        setSubmitting(false);
        return;
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

        didSync = true;
        newPart = {
          id: data.id,
          userId: data.user_id,
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
          userId: currentUser?.id,
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
      addParticipant(newPart, didSync);
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
    if (!qrCodeUrl) return;
    const event = events.find(e => e.id === eventId);
    const t = event?.type?.toLowerCase() || '';
    const typeAcronym = t.includes('hack') ? 'HCK' : t.includes('meet') ? 'MTP' : 'WKS';
    try {
      await downloadBoardingPass({
        participantName: registeredParticipant?.name || '',
        ticketCode: registeredParticipant?.ticketCode || registeredParticipant?.id?.slice(0, 4) || '',
        registeredAt: registeredParticipant?.registeredAt || '',
        venue: event?.location || 'MSU Baroda',
        eventType: event?.type || 'Workshop',
        typeAcronym,
        qrCodeDataUrl: qrCodeUrl,
      });
    } catch (err) {
      console.error('Failed to download ticket:', err);
    }
  };

  if (submitted) {
    const event = events.find(e => e.id === eventId);
    const typeAcronym = (() => {
      const t = event?.type?.toLowerCase() || '';
      if (t.includes('hack')) return 'HCK';
      if (t.includes('meet')) return 'MTP';
      return 'WKS';
    })();

    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-6 text-center w-full"
      >
        <div className="container-cards-ticket select-none">
          <div
            ref={ticketRef}
            className="card-ticket"
          >
            {/* Left QR Code Container */}
            <div className="qr-left-container">
              <div className="qr-code-wrapper-left">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code Ticket" className="qr-code-img-left" />
                ) : (
                  <div className="w-[80px] h-[80px] flex items-center justify-center border border-dashed border-neutral-300 rounded-md animate-pulse">
                    <Loader2 className="animate-spin text-neutral-400" size={16} />
                  </div>
                )}
              </div>
              <p className="qr-scan-text-left">SCAN TO CHECK-IN</p>
            </div>

            {/* Separator 1 */}
            <div className="ticket-separator">
              <span className="line"></span>
            </div>

            {/* Main content body */}
            <div className="content-ticket">
              <div className="content-data">
                {/* Destination line (Organizer -> Event Type) */}
                <div className="destination items-center">
                  <div className="dest start">
                    <p className="country">Organizer</p>
                    <p className="acronym">CV</p>
                    <p className="hour">Code Vimarsh</p>
                  </div>
                  <div className="flex items-center gap-1 flex-1 px-4 relative">
                    <div className="flex-1 border-b border-dashed border-neutral-300 relative flex items-center justify-end">
                      <div className="absolute right-0 w-1.5 h-1.5 border-t border-r border-neutral-400 transform rotate-45" style={{ marginRight: '-1px' }} />
                    </div>
                    <img
                      src="/CV LOGO.webp"
                      alt="CV Logo"
                      className="w-9 h-9 object-contain rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 border-b border-dashed border-neutral-300 relative flex items-center justify-end">
                      <div className="absolute right-0 w-1.5 h-1.5 border-t border-r border-neutral-400 transform rotate-45" style={{ marginRight: '-1px' }} />
                    </div>
                  </div>
                  <div className="dest end text-right">
                    <p className="country">Event Type</p>
                    <p className="acronym">{typeAcronym}</p>
                    <p className="hour">{event?.type || 'Workshop'}</p>
                  </div>
                </div>

                {/* Sub-divider */}
                <div style={{ borderBottom: '2px solid #edf2f7', margin: '2px 0' }} />

                {/* Info Grid */}
                <div className="ticket-data-grid">
                  <div className="ticket-data-row">
                    <div className="ticket-data-item">
                      <p className="title">Passenger / Candidate</p>
                      <p className="subtitle">{registeredParticipant?.name}</p>
                    </div>
                    <div className="ticket-data-item" style={{ textAlign: 'right' }}>
                      <p className="title">Ticket ID</p>
                      <p className="subtitle">#{registeredParticipant?.ticketCode || registeredParticipant?.id?.slice(0, 4)}</p>
                    </div>
                  </div>

                  <div className="ticket-data-row">
                    <div className="ticket-data-item">
                      <p className="title">Date</p>
                      <p className="subtitle">{registeredParticipant?.registeredAt}</p>
                    </div>
                    <div className="ticket-data-item" style={{ textAlign: 'right' }}>
                      <p className="title">Venue</p>
                      <p className="subtitle" style={{ maxWidth: '140px' }}>{event?.location || 'MSU Baroda'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator 2 */}
              <div className="ticket-separator">
                <span className="line"></span>
              </div>

              {/* Right Brand Strip */}
              <div className="brand-strip-container">
                <div className="strip-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="strip-logo-wrapper">
                  <span className="strip-logo-text">CV</span>
                  <div className="strip-logo-underline"></div>
                </div>
              </div>
            </div>
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
