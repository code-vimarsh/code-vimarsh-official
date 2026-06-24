/**
 * FormPreview.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Read-only/interactive preview rendered inside the admin builder.
 * Re-uses DynamicFieldRenderer and ValidationEngine — same as user form.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { EventForm, FieldValue } from '../../../types/formBuilder';
import DynamicFieldRenderer from '../../events/DynamicFieldRenderer';
import { validateForm, buildInitialValues, isFieldVisible } from '../../events/ValidationEngine';

interface FormPreviewProps {
  form: EventForm;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [values, setValues] = useState<Record<string, FieldValue>>(
    () => buildInitialValues(form.fields)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const visibleFields = form.fields
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((f) => isFieldVisible(f, values));

  const handleChange = (fieldId: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) setErrors((prev) => { const n = { ...prev }; delete n[fieldId]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(form.fields, values);
    if (!result.valid) {
      const map: Record<string, string> = {};
      result.errors.forEach((err) => { map[err.fieldId] = err.message; });
      setErrors(map);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          ✓
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Preview submission successful</p>
          <p className="text-sm text-textMuted mt-1">This is how users will see the success state.</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setValues(buildInitialValues(form.fields)); setErrors({}); }}
          className="text-sm text-primary/70 hover:text-primary transition-colors underline underline-offset-4"
        >
          Reset preview
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Form header */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-white">{form.title}</h2>
        {form.description && (
          <p className="text-sm text-textMuted mt-2 leading-relaxed">{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {visibleFields.map((field, i) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
          >
            <DynamicFieldRenderer
              field={field}
              value={values[field.id] ?? ''}
              onChange={(v) => handleChange(field.id, v)}
              error={errors[field.id]}
            />
          </motion.div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #ff6a00, #ff9a00)',
            boxShadow: '0 0 24px rgba(255,106,0,0.3)',
          }}
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default FormPreview;
