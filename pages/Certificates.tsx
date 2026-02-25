import React, { useState, useRef } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import {
    Download, Loader2, Award, Users, ChevronDown,
    CheckCircle, Maximize2, X,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import CertificateCanvas, { CertificateData, CertType } from '../components/CertificateCanvas';

const CERT_TYPES: CertType[] = ['Participation', 'Completion', 'Winner', 'Merit'];
const TYPE_COLORS: Record<CertType, string> = {
    Participation: '#ff6a00',
    Completion: '#22c55e',
    Winner: '#f59e0b',
    Merit: '#3b82f6',
};

const today = new Date().toISOString().split('T')[0];

/* ── capture helper: grabs a DOM element and triggers PNG download ── */
const captureElement = async (el: HTMLElement, filename: string) => {
    const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0c0c',
        logging: false,
        width: 900,
        height: 636,
        scrollX: 0,
        scrollY: 0,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* ════════════════════════════════════════════════════════════════════════════ */
const Certificates: React.FC = () => {
    const { events, participants } = useGlobalState();

    const [form, setForm] = useState<CertificateData>({
        recipientName: '',
        eventName: '',
        certType: 'Participation',
        date: today,
        issuedBy: 'Code Vimarsh Team',
        description: 'has successfully participated in and contributed to',
    });

    const [dlStatus, setDlStatus] = useState<'idle' | 'generating' | 'done'>('idle');
    const [bulkEventId, setBulkEventId] = useState('');
    const [bulkStatus, setBulkStatus] = useState<'idle' | 'generating' | 'done'>('idle');
    const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
    const [showPreview, setShowPreview] = useState(false);

    /*
     * CRITICAL: captureRef points to a HIDDEN, OFF-SCREEN, UN-SCALED
     * CertificateCanvas rendered at actual 900×636. This is what html2canvas
     * reads — never the scaled preview element.
     */
    const captureRef = useRef<HTMLDivElement>(null!);

    /* ── Single download ─────────────────────────────────────── */
    const handleDownload = async () => {
        const el = captureRef.current;
        if (!el) return;
        setDlStatus('generating');
        try {
            const safe = (form.recipientName || 'Certificate').replace(/\s+/g, '_');
            await captureElement(el, `CV_${form.certType}_${safe}.png`);
            setDlStatus('done');
            setTimeout(() => setDlStatus('idle'), 3000);
        } catch (err) {
            console.error('Certificate capture failed:', err);
            setDlStatus('idle');
        }
    };

    /* ── Bulk generate ───────────────────────────────────────── */
    const bulkParticipants = participants.filter(p => p.eventId === bulkEventId);

    const handleBulkGenerate = async () => {
        if (!bulkParticipants.length) return;
        setBulkStatus('generating');
        setBulkProgress({ done: 0, total: bulkParticipants.length });

        for (let i = 0; i < bulkParticipants.length; i++) {
            const p = bulkParticipants[i];

            const wrapper = document.createElement('div');
            wrapper.style.cssText =
                'position:fixed;left:-9999px;top:0;width:900px;height:636px;overflow:visible;z-index:-1;';
            document.body.appendChild(wrapper);

            const { createRoot } = await import('react-dom/client');
            const root = createRoot(wrapper);
            const certData: CertificateData = {
                ...form,
                recipientName: p.name,
                eventName: p.eventTitle,
            };
            root.render(<CertificateCanvas data={certData} />);

            // Give the browser time to fully render including fonts & images
            await new Promise<void>(r => setTimeout(r, 400));

            const el = wrapper.querySelector<HTMLElement>(':scope > div');
            if (el) {
                await captureElement(el, `CV_${form.certType}_${p.name.replace(/\s+/g, '_')}.png`);
            }

            root.unmount();
            document.body.removeChild(wrapper);
            setBulkProgress({ done: i + 1, total: bulkParticipants.length });
            await new Promise(r => setTimeout(r, 200));
        }

        setBulkStatus('done');
        setTimeout(() => setBulkStatus('idle'), 5000);
    };

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/*
       * HIDDEN CAPTURE TARGET — off-screen, full 900×636, no transform.
       * html2canvas reads this element for downloads.
       */}
            <div
                style={{
                    position: 'fixed',
                    left: -9999,
                    top: 0,
                    width: 900,
                    height: 636,
                    overflow: 'visible',
                    zIndex: -1,
                    pointerEvents: 'none',
                }}
            >
                <CertificateCanvas data={form} certRef={captureRef} />
            </div>

            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-1">Certificate Generator</h2>
                <p className="text-textMuted">Create and download branded Code Vimarsh certificates instantly.</p>
            </div>

            <div className="grid xl:grid-cols-2 gap-8 items-start">

                {/* ══ LEFT: FORM ══════════════════════════════════════════════ */}
                <div className="space-y-5">

                    {/* Type selector */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-3">
                            Certificate Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CERT_TYPES.map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setForm({ ...form, certType: t })}
                                    style={form.certType === t
                                        ? { borderColor: `${TYPE_COLORS[t]}60`, color: TYPE_COLORS[t], background: `${TYPE_COLORS[t]}15` }
                                        : {}}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${form.certType === t ? '' : 'border-surfaceLight bg-bgDark text-textMuted hover:border-white/10'
                                        }`}
                                >
                                    {t === 'Participation' && '📋 '}
                                    {t === 'Completion' && '✅ '}
                                    {t === 'Winner' && '🏆 '}
                                    {t === 'Merit' && '🌟 '}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden space-y-4">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                            <Award size={13} className="text-primary" /> Certificate Details
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Recipient Name *</label>
                            <input
                                value={form.recipientName}
                                onChange={e => setForm({ ...form, recipientName: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                placeholder="e.g. Aarya Shah"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Event Name *</label>
                            <div className="relative">
                                <select
                                    value={form.eventName}
                                    onChange={e => setForm({ ...form, eventName: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none"
                                >
                                    <option value="">Select from events…</option>
                                    {events.map(ev => <option key={ev.id} value={ev.title}>{ev.title}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                            </div>
                            <input
                                value={form.eventName}
                                onChange={e => setForm({ ...form, eventName: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all mt-1"
                                placeholder="Or type a custom event name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Achievement Line</label>
                            <input
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                placeholder="has successfully participated in and contributed to"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Issued By</label>
                                <input
                                    value={form.issuedBy}
                                    onChange={e => setForm({ ...form, issuedBy: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                    placeholder="Code Vimarsh Team"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={!form.recipientName || !form.eventName || dlStatus === 'generating'}
                            className="w-full bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-[0_0_18px_rgba(255,106,0,0.18)] hover:shadow-[0_0_28px_rgba(255,106,0,0.35)]"
                        >
                            {dlStatus === 'generating'
                                ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
                                : dlStatus === 'done'
                                    ? <><CheckCircle size={15} /> Downloaded!</>
                                    : <><Download size={15} /> Download PNG</>
                            }
                        </button>

                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full bg-surface border border-surfaceLight hover:border-primary/40 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                        >
                            <Maximize2 size={15} className="text-primary" /> Full Preview
                        </button>
                    </div>

                    {/* Bulk Generate */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden space-y-3">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                            <Users size={13} className="text-primary" /> Bulk Generate
                        </h3>
                        <p className="text-[11px] text-textMuted">Select an event → auto-download one PNG per participant.</p>

                        <div className="relative">
                            <select
                                value={bulkEventId}
                                onChange={e => setBulkEventId(e.target.value)}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none"
                            >
                                <option value="">Select event…</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title} ({participants.filter(p => p.eventId === ev.id).length} participants)
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                        </div>

                        {bulkEventId && bulkParticipants.length > 0 && (
                            <p className="text-xs font-medium" style={{ color: TYPE_COLORS[form.certType] }}>
                                📋 {bulkParticipants.length} certificate{bulkParticipants.length !== 1 ? 's' : ''} will be generated
                            </p>
                        )}

                        {bulkStatus === 'generating' && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-textMuted">
                                    <span>Generating…</span>
                                    <span className="font-mono text-primary">{bulkProgress.done}/{bulkProgress.total}</span>
                                </div>
                                <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                                        style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {bulkStatus === 'done' && (
                            <div className="flex items-center gap-2 text-green-400 text-xs font-medium">
                                <CheckCircle size={13} /> All certificates downloaded!
                            </div>
                        )}

                        <button
                            onClick={handleBulkGenerate}
                            disabled={!bulkEventId || !bulkParticipants.length || bulkStatus === 'generating'}
                            className="w-full bg-bgDark border border-surfaceLight hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                        >
                            {bulkStatus === 'generating'
                                ? <><Loader2 size={14} className="animate-spin" /> {bulkProgress.done}/{bulkProgress.total}…</>
                                : <><Download size={14} /> Bulk Download{bulkParticipants.length > 0 ? ` (${bulkParticipants.length})` : ''}</>
                            }
                        </button>
                    </div>
                </div>

                {/* ══ RIGHT: SCALED VISUAL PREVIEW ════════════════════════════ */}
                <div className="space-y-3">
                    <div className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                        <div className="w-6 h-px bg-surfaceLight" /> Live Preview
                        <button
                            onClick={() => setShowPreview(true)}
                            className="ml-auto text-primary hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                        >
                            <Maximize2 size={12} /> Expand
                        </button>
                    </div>

                    {/* CSS-scaled visual clone of the certificate — NOT used for capture */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl overflow-hidden" style={{ height: 636 * 0.575 + 24 }}>
                        <div className="p-3">
                            <div style={{ transform: 'scale(0.575)', transformOrigin: 'top left', display: 'inline-block' }}>
                                {/* This clone is visual only — captureRef is NOT here */}
                                <CertificateCanvas data={form} />
                            </div>
                        </div>
                    </div>

                    <p className="text-[11px] text-textMuted text-center">
                        Preview auto-updates. <strong>Download</strong> exports at 2× resolution from a hidden full-size element.
                    </p>
                </div>
            </div>

            {/* ══ FULL PREVIEW MODAL ═════════════════════════════════════════════════ */}
            {showPreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="flex flex-col items-center gap-6 max-w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between w-full px-1">
                            <span className="text-textMuted text-sm">Certificate Preview (actual size)</span>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
                            >
                                <X size={16} /> Close
                            </button>
                        </div>

                        {/* Actual-size certificate in modal — visual only */}
                        <div className="rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)] max-w-[95vw] overflow-x-auto">
                            <CertificateCanvas data={form} />
                        </div>

                        {/* Download from modal uses the same hidden captureRef */}
                        <button
                            onClick={() => { setShowPreview(false); setTimeout(handleDownload, 100); }}
                            disabled={!form.recipientName || !form.eventName || dlStatus === 'generating'}
                            className="bg-primary hover:bg-secondary disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 text-sm transition-all shadow-[0_0_20px_rgba(255,106,0,0.3)]"
                        >
                            <Download size={15} /> Download Certificate PNG
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
