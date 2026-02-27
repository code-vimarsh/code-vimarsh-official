import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Github,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Upload,
} from 'lucide-react';
import { ProjectFormData, ProjectFormErrors } from './types';
import { ProjectType } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: ProjectFormData = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  techStack: '',
  features: [''],
  githubUrl: '',
  imageFile: null,
  imagePreview: '',
  authorName: '',
  isPublished: true,
};

const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/.+/i;
const URL_RE    = /^https?:\/\/.+/i;

function validate(form: ProjectFormData): ProjectFormErrors {
  const e: ProjectFormErrors = {};

  if (!form.title.trim())
    e.title = 'Project title is required.';
  else if (form.title.trim().length < 3)
    e.title = 'Title must be at least 3 characters.';

  if (!form.shortDescription.trim())
    e.shortDescription = 'Short description is required.';
  else if (form.shortDescription.trim().length < 20)
    e.shortDescription = 'Short description must be at least 20 characters.';

  if (!form.fullDescription.trim())
    e.fullDescription = 'Full description is required.';
  else if (form.fullDescription.trim().length < 50)
    e.fullDescription = 'Full description must be at least 50 characters.';

  if (!form.techStack.trim())
    e.techStack = 'Enter at least one technology.';

  const filledFeatures = form.features.filter((f) => f.trim().length > 0);
  if (filledFeatures.length === 0)
    e.features = 'Add at least one key feature.';

  if (!form.githubUrl.trim())
    e.githubUrl = 'GitHub repository URL is required.';
  else if (!URL_RE.test(form.githubUrl))
    e.githubUrl = 'Enter a valid URL starting with http:// or https://';
  else if (!GITHUB_RE.test(form.githubUrl))
    e.githubUrl = 'URL must point to a GitHub repository.';

  if (!form.imagePreview)
    e.imageFile = 'Project image is required.';

  if (!form.authorName.trim())
    e.authorName = 'Author name is required.';

  return e;
}

function isFormValid(errors: ProjectFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

const Field: React.FC<FieldProps> = ({ label, required, error, children, hint }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-sm font-medium text-textMain">
      {label}
      {required && <span className="text-primary text-xs">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-textMuted">{hint}</p>}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-400">
        <AlertCircle size={11} />
        {error}
      </p>
    )}
  </div>
);

const inputCls = (error?: string) => `
  w-full bg-bgDark border rounded-lg px-4 py-2.5 text-sm text-textMain
  placeholder-textMuted focus:outline-none
  transition-colors duration-200
  ${error
    ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
    : 'border-surfaceLight focus:border-primary/60 focus:ring-1 focus:ring-primary/20'
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectType) => void;
  defaultAuthor?: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultAuthor = '',
}) => {
  const [form, setForm]             = useState<ProjectFormData>({ ...EMPTY_FORM, authorName: defaultAuthor });
  const [errors, setErrors]         = useState<ProjectFormErrors>({});
  const [touched, setTouched]       = useState<Partial<Record<keyof ProjectFormData, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, authorName: defaultAuthor });
      setErrors({});
      setTouched({});
      setSubmitted(false);
    }
  }, [open, defaultAuthor]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Validation (live after first submit attempt) ──
  useEffect(() => {
    if (submitted) setErrors(validate(form));
  }, [form, submitted]);

  // ── Field updater helpers ──
  const setField = useCallback(
    <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => ({ ...prev, [key]: true }));
    },
    []
  );

  // ── Image upload ──
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, imageFile: 'Please select a valid image file.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageFile: 'Image must be smaller than 5 MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm((prev) => ({ ...prev, imageFile: file, imagePreview: result }));
      setTouched((prev) => ({ ...prev, imageFile: true }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Features list helpers ──
  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, ''] }));

  const updateFeature = (idx: number, val: string) =>
    setForm((p) => {
      const arr = [...p.features];
      arr[idx] = val;
      return { ...p, features: arr };
    });

  const removeFeature = (idx: number) =>
    setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      // Simulate async save (replace with Supabase call when integrated)
      await new Promise((res) => setTimeout(res, 900));

      const techArray = form.techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newProject: ProjectType = {
        id: `proj-${Date.now()}`,
        title: form.title.trim(),
        description: form.shortDescription.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        features: form.features.filter((f) => f.trim()),
        category: 'Web', // default; can be extended with a category picker
        tech: techArray,
        author: form.authorName.trim(),
        image: form.imagePreview || undefined,
        isPublished: form.isPublished,
        links: {
          github: form.githubUrl.trim(),
        },
      };

      onSubmit(newProject);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // Derived: is button enabled?
  const canSubmit = submitted ? isFormValid(errors) : true;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm px-4 py-8 sm:py-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-2xl
              bg-[#0d0d0f] border border-surfaceLight rounded-2xl
              shadow-[0_24px_80px_rgba(0,0,0,0.8)]
            "
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-surfaceLight">
              <div>
                <h2 className="text-lg font-display font-bold text-textMain">Submit a Project</h2>
                <p className="text-xs text-textMuted mt-0.5 font-mono">All fields are required</p>
              </div>
              <button
                onClick={onClose}
                className="text-textMuted hover:text-textMain transition-colors p-1.5 hover:bg-surfaceLight rounded-lg"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Form Body ── */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Project Title */}
                <Field label="Project Title" required error={errors.title}>
                  <input
                    type="text"
                    placeholder="e.g. Nexus OS"
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    className={inputCls(errors.title)}
                    maxLength={80}
                  />
                </Field>

                {/* Short Description */}
                <Field
                  label="Short Description"
                  required
                  error={errors.shortDescription}
                  hint="2–3 sentence preview shown on the project card."
                >
                  <textarea
                    rows={2}
                    placeholder="Brief overview of your project…"
                    value={form.shortDescription}
                    onChange={(e) => setField('shortDescription', e.target.value)}
                    className={`${inputCls(errors.shortDescription)} resize-none`}
                    maxLength={200}
                  />
                </Field>

                {/* Full Description */}
                <Field
                  label="Full Description"
                  required
                  error={errors.fullDescription}
                  hint="Detailed explanation shown in the expanded card view."
                >
                  <textarea
                    rows={4}
                    placeholder="Describe architecture, motivation, and impact…"
                    value={form.fullDescription}
                    onChange={(e) => setField('fullDescription', e.target.value)}
                    className={`${inputCls(errors.fullDescription)} resize-none`}
                  />
                </Field>

                {/* Tech Stack */}
                <Field
                  label="Tech Stack"
                  required
                  error={errors.techStack}
                  hint="Comma-separated list, e.g. React, TypeScript, Node.js"
                >
                  <input
                    type="text"
                    placeholder="React, TypeScript, Supabase, Tailwind CSS"
                    value={form.techStack}
                    onChange={(e) => setField('techStack', e.target.value)}
                    className={inputCls(errors.techStack)}
                  />
                </Field>

                {/* Features */}
                <Field
                  label="Key Features"
                  required
                  error={errors.features}
                  hint="Add individual feature bullet points."
                >
                  <div className="space-y-2">
                    {form.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Feature ${idx + 1}…`}
                          value={feat}
                          onChange={(e) => updateFeature(idx, e.target.value)}
                          className={`${inputCls(idx === 0 ? errors.features : undefined)} flex-1`}
                        />
                        {form.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="p-2.5 rounded-lg border border-surfaceLight text-textMuted hover:text-red-400 hover:border-red-500/40 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-secondary font-mono transition-colors"
                    >
                      <Plus size={13} /> Add Feature
                    </button>
                  </div>
                </Field>

                {/* GitHub URL */}
                <Field label="GitHub Repository" required error={errors.githubUrl}>
                  <div className="relative">
                    <Github
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
                    />
                    <input
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={form.githubUrl}
                      onChange={(e) => setField('githubUrl', e.target.value)}
                      className={`${inputCls(errors.githubUrl)} pl-9`}
                    />
                  </div>
                </Field>

                {/* Project Image */}
                <Field
                  label="Project Image"
                  required
                  error={errors.imageFile}
                  hint="JPG, PNG, or WebP — max 5 MB."
                >
                  <div
                    className={`
                      relative rounded-xl border-2 border-dashed cursor-pointer overflow-hidden
                      transition-colors duration-200
                      ${errors.imageFile
                        ? 'border-red-500/40 hover:border-red-500/60'
                        : 'border-surfaceLight hover:border-primary/40'
                      }
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.imagePreview ? (
                      <div className="relative">
                        <img
                          src={form.imagePreview}
                          alt="Project preview"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-bgDark/80 backdrop-blur border border-surfaceLight rounded-lg px-3 py-2 text-xs text-textMain flex items-center gap-2">
                            <Upload size={13} /> Change Image
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center gap-2 text-textMuted">
                        <ImageIcon size={28} className="opacity-40" />
                        <p className="text-sm">Click to upload project image</p>
                        <p className="text-xs opacity-60">PNG, JPG, WebP • max 5 MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </Field>

                {/* Author Name */}
                <Field label="Author Name" required error={errors.authorName}>
                  <input
                    type="text"
                    placeholder="Your name or team name"
                    value={form.authorName}
                    onChange={(e) => setField('authorName', e.target.value)}
                    className={inputCls(errors.authorName)}
                  />
                </Field>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surfaceLight">
                  <div>
                    <p className="text-sm font-medium text-textMain">Publish Immediately</p>
                    <p className="text-xs text-textMuted mt-0.5">
                      Published projects appear in the public projects section.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isPublished}
                    onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))}
                    className={`
                      relative inline-flex h-6 w-11 shrink-0 rounded-full border-2
                      transition-colors duration-200 focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-primary/60
                      ${form.isPublished ? 'bg-primary border-primary' : 'bg-bgDark border-surfaceLight'}
                    `}
                  >
                    <motion.span
                      animate={{ x: form.isPublished ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow"
                    />
                  </button>
                </div>

              </div>

              {/* ── Footer ── */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-surfaceLight">
                <p className="text-xs text-textMuted font-mono">
                  <span className="text-primary">*</span> All fields required
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-textMuted border border-surfaceLight hover:border-primary/40 hover:text-textMain transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="
                      inline-flex items-center gap-2
                      px-6 py-2.5 rounded-lg text-sm font-semibold
                      bg-primary text-white
                      hover:bg-secondary
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-[0_0_16px_rgba(255,106,0,0.3)]
                      hover:shadow-[0_0_24px_rgba(255,106,0,0.5)]
                      active:scale-95
                      transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                    "
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
