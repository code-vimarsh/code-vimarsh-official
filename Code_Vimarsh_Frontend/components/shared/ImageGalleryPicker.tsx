/**
 * ImageGalleryPicker.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable component for picking/managing multiple images in admin forms.
 *
 * Supports:
 *   • Uploading files from the device (with size + type validation)
 *   • Pasting/entering image URLs
 *   • Preview thumbnails with hover-remove button
 *   • Optional role-gating via `disabled` prop
 *
 * Used by:
 *   - ManageEvents  (ADMIN only — pass disabled={false})
 *   - ProjectForm   (USER + ADMIN — pass disabled={false})
 */

import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Plus, X, ImageOff, AlertCircle } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES   = 'image/jpeg,image/png,image/webp,image/gif,image/avif';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isValidImageUrl = (url: string) =>
  /^https?:\/\/.+/i.test(url.trim());

// ─── Component ───────────────────────────────────────────────────────────────

interface ImageGalleryPickerProps {
  /** Current list of images (URLs or data-URIs)         */
  images: string[];
  /** Called whenever the list changes                   */
  onChange: (images: string[]) => void;
  /** When true renders a "not permitted" notice instead */
  disabled?: boolean;
  /** Shown above the picker                             */
  label?: string;
  /** Shown beneath the label                            */
  hint?: string;
}

type Mode = 'url' | 'upload';

const ImageGalleryPicker: React.FC<ImageGalleryPickerProps> = ({
  images,
  onChange,
  disabled = false,
  label   = 'Images',
  hint,
}) => {
  const [mode,      setMode]      = useState<Mode>('url');
  const [urlInput,  setUrlInput]  = useState('');
  const [urlError,  setUrlError]  = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Handlers ───────────────────────────────────────────────────────────

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!isValidImageUrl(url)) {
      setUrlError('Enter a valid URL starting with http:// or https://');
      return;
    }
    if (images.includes(url)) {
      setUrlError('This URL is already in the gallery.');
      return;
    }
    onChange([...images, url]);
    setUrlInput('');
    setUrlError('');
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addUrl(); }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const results: string[] = [];
    const errors: string[]  = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB.`);
        continue;
      }
      try {
        const dataUrl = await fileToDataUrl(file);
        results.push(dataUrl);
      } catch {
        errors.push(`Failed to read "${file.name}".`);
      }
    }

    if (results.length) onChange([...images, ...results]);
    if (errors.length)  setUrlError(errors.join(' '));
    else                setUrlError('');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = (idx: number) =>
    onChange(images.filter((_, i) => i !== idx));

  // ── Disabled state ────────────────────────────────────────────────────

  if (disabled) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm text-textMuted flex items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <AlertCircle size={14} className="shrink-0 text-yellow-500/70" />
        Only administrators can manage images for this item.
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Label row + mode toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-textMuted uppercase tracking-wider">{label}</p>
          {hint && <p className="text-[11px] text-textMuted/60 mt-0.5 font-sans normal-case">{hint}</p>}
        </div>
        {/* URL / Upload pill toggle */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {(['url', 'upload'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setUrlError(''); if (m === 'upload') fileRef.current?.click(); }}
              className={`
                flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-150
                ${mode === m
                  ? 'bg-primary text-black font-bold shadow'
                  : 'text-textMuted hover:text-white'}
              `}
            >
              {m === 'url' ? <LinkIcon size={10} /> : <Upload size={10} />}
              {m === 'url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Active input */}
      {mode === 'url' ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setUrlError(''); }}
            onKeyDown={handleUrlKeyDown}
            placeholder="Paste image URL and press Enter or +"
            className="
              flex-1 bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm
              text-white placeholder-textMuted/50
              focus:border-primary focus:outline-none transition-colors
            "
          />
          <button
            type="button"
            onClick={addUrl}
            className="
              px-3 py-2 rounded-lg border border-primary/30 text-primary
              bg-primary/5 hover:bg-primary/15 transition-colors
            "
            title="Add URL"
          >
            <Plus size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="
            w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm text-textMuted
            border-2 border-dashed border-primary/30 hover:border-primary hover:text-primary
            transition-all duration-200 disabled:opacity-50
          "
        >
          <Upload size={16} />
          {uploading ? 'Processing…' : `Click to upload photos (multiple, max ${MAX_FILE_SIZE_MB} MB each)`}
        </button>
      )}

      {/* Validation error */}
      {urlError && (
        <p className="flex items-start gap-1.5 text-xs text-red-400 font-sans">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          {urlError}
        </p>
      )}

      {/* Gallery preview thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-surfaceLight shrink-0"
              style={{ width: 80, height: 60 }}
            >
              <img
                src={src}
                alt={`gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextSibling as HTMLElement)?.setAttribute('style', 'display:flex');
                }}
              />
              {/* Error fallback */}
              <div
                className="absolute inset-0 items-center justify-center bg-bgDark text-textMuted"
                style={{ display: 'none' }}
              >
                <ImageOff size={16} />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label={`Remove image ${idx + 1}`}
                className="
                  absolute top-0.5 right-0.5 w-5 h-5 rounded-full
                  bg-red-600 hover:bg-red-500 text-white
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150
                "
              >
                <X size={10} />
              </button>
              {/* Index label */}
              <div className="absolute bottom-0 left-0 right-0 text-[9px] font-mono text-center bg-black/50 text-white/60 py-0.5">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-[11px] text-textMuted/40 font-mono text-center py-1">
          No images added yet
        </p>
      )}
    </div>
  );
};

export default ImageGalleryPicker;
