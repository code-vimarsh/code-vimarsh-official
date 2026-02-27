/**
 * AdminFormBuilder.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /admin/forms
 *         /admin/forms/:eventId
 *
 * Wraps <FormBuilder /> with the admin dark shell (back nav, page header).
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { EventForm } from '../types/formBuilder';
import { getFormByEventId } from '../data/formSchemas';
import FormBuilder from '../components/admin/forms/FormBuilder';

// ─── Component ────────────────────────────────────────────────────────────────

const AdminFormBuilder: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();

  const [existingForm, setExistingForm] = useState<EventForm | null | undefined>(undefined);

  useEffect(() => {
    if (!eventId) {
      setExistingForm(null); // blank new form
      return;
    }
    // Replace with: fetch(`/api/forms/event/${eventId}`)
    const form = getFormByEventId(eventId);
    setExistingForm(form ?? null);
  }, [eventId]);

  // Still resolving
  if (existingForm === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0a' }}
      >
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* ── Page-level nav bar ────────────────────────────────────────────── */}
      <div
        className="px-6 py-3 flex items-center gap-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Admin
        </button>

        {eventId && (
          <>
            <span className="text-white/20">|</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,106,0,0.10)', color: '#ff9a00' }}
            >
              Event: {eventId}
            </span>
          </>
        )}
      </div>

      {/* ── Builder ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">
        <FormBuilder initialForm={existingForm} eventId={eventId} />
      </div>
    </div>
  );
};

export default AdminFormBuilder;
