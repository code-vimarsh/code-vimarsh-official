import React, { useState, useRef } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import {
    Download, Loader2, Award, Users, ChevronDown,
    CheckCircle, Maximize2, X, Layout, Sparkles, Palette
} from 'lucide-react';
import html2canvas from 'html2canvas';
import CertificateCanvas from '../components/CertificateCanvas';
import { CertificateData, CertType, CertificateTemplate } from '../types';

const CERT_TYPES: CertType[] = ['Participation', 'Completion', 'Winner', 'Merit'];
const TEMPLATES: { id: CertificateTemplate; name: string; desc: string }[] = [
    { id: 'Nexus', name: 'Nexus Tech', desc: 'Modern dark tech with vibrant glows' },
    { id: 'Signature', name: 'Signature Classic', desc: 'Ivory/Gold traditional elegance' },
    { id: 'Minimal', name: 'Modern Minimal', desc: 'Clean, bold geometric design' },
    { id: 'Academic', name: 'Academic Formal', desc: 'Official blue & silver prestige' },
    { id: 'Cyber', name: 'Cyberpunk 2077', desc: 'Neon aesthetics & data-driven UI' },
    { id: 'Creative', name: 'Artistic Flow', desc: 'Organic shapes & smooth gradients' },
    { id: 'Vintage', name: 'Vintage Scroll', desc: 'Antique paper & classic calligraphy' },
    { id: 'Corporate', name: 'Enterprise Elite', desc: 'High-end corporate & sleek lines' },
    { id: 'Royal', name: 'Royal Heritage', desc: 'Majestic gold & navy blue prestige' },
    { id: 'Space', name: 'Cosmic Explorer', desc: 'Interstellar design with nebula glows' },
    { id: 'Eco', name: 'Eco Growth', desc: 'Organic green & sustainable vibes' },
    { id: 'Geometric', name: 'Neo Geometric', desc: 'Sharp edges & bold Swiss typography' },
];

const PRESET_COLORS = [
    { name: 'Original', hex: '' },
    { name: 'Volt Blue', hex: '#3b82f6' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Royal Gold', hex: '#f59e0b' },
    { name: 'Crimson', hex: '#ef4444' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Slate', hex: '#64748b' },
];

const TYPE_COLORS: Record<CertType, string> = {
    Participation: '#ff6a00',
    Completion: '#22c55e',
    Winner: '#f59e0b',
    Merit: '#3b82f6',
};

const today = new Date().toISOString().split('T')[0];

const captureElement = async (el: HTMLElement, filename: string) => {
    const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
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

const Certificates: React.FC = () => {
    const { events, participants } = useGlobalState();

    const [form, setForm] = useState<CertificateData>({
        recipientName: '',
        eventName: '',
        certType: 'Participation',
        date: today,
        issuedBy: 'Code Vimarsh Team',
        description: 'has successfully participated in and contributed to',
        templateId: 'Nexus',
        themeColor: '',
    });

    const [dlStatus, setDlStatus] = useState<'idle' | 'generating' | 'done'>('idle');
    const [bulkEventId, setBulkEventId] = useState('');
    const [bulkStatus, setBulkStatus] = useState<'idle' | 'generating' | 'done'>('idle');
    const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
    const [showPreview, setShowPreview] = useState(false);

    const captureRef = useRef<HTMLDivElement>(null!);

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

    const bulkParticipants = participants.filter(p => p.eventId === bulkEventId);

    const handleBulkGenerate = async () => {
        if (!bulkParticipants.length) return;
        setBulkStatus('generating');
        setBulkProgress({ done: 0, total: bulkParticipants.length });

        for (let i = 0; i < bulkParticipants.length; i++) {
            const p = bulkParticipants[i];
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:900px;height:636px;overflow:visible;z-index:-1;';
            document.body.appendChild(wrapper);

            const { createRoot } = await import('react-dom/client');
            const root = createRoot(wrapper);
            const certData: CertificateData = {
                ...form,
                recipientName: p.name,
                eventName: p.eventTitle,
            };
            root.render(<CertificateCanvas data={certData} />);

            await new Promise<void>(r => setTimeout(r, 800));

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HIDDEN CAPTURE TARGET */}
            <div style={{ position: 'fixed', left: -9999, top: 0, width: 900, height: 636, overflow: 'visible', zIndex: -1, pointerEvents: 'none' }}>
                <CertificateCanvas data={form} certRef={captureRef} />
            </div>

            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-1">Elite Certificate Studio</h2>
                <p className="text-textMuted">Design, customize, and dispatch premium credentials with precision.</p>
            </div>

            <div className="grid xl:grid-cols-2 gap-8 items-start">
                <div className="space-y-5">

                    {/* Template Design Selector */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-3 flex items-center gap-2">
                            <Layout size={12} className="text-primary" /> 1. Select Base Template
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setForm({ ...form, templateId: t.id })}
                                    className={`px-4 py-3 rounded-xl border text-left transition-all ${form.templateId === t.id
                                        ? 'bg-primary/10 border-primary text-white'
                                        : 'bg-bgDark border-surfaceLight text-textMuted hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${form.templateId === t.id ? 'text-primary' : 'text-white'}`}>{t.name}</span>
                                        {form.templateId === t.id && <Sparkles size={12} className="text-primary" />}
                                    </div>
                                    <p className="text-[10px] opacity-60 leading-tight">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Customization */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-3 flex items-center gap-2">
                            <Palette size={12} className="text-primary" /> 2. Design Color Palette
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => setForm({ ...form, themeColor: c.hex })}
                                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${form.themeColor === c.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent'
                                        }`}
                                    style={{ background: c.hex || (form.certType ? TYPE_COLORS[form.certType] : '#ff6a00') }}
                                    title={c.name}
                                >
                                    {form.themeColor === c.hex && <CheckCircle size={14} className="text-white" />}
                                    {!c.hex && <X size={14} className="text-white opacity-50" />}
                                </button>
                            ))}
                            <input
                                type="color"
                                value={form.themeColor || (form.certType ? TYPE_COLORS[form.certType] : '#ff6a00')}
                                onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                                className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer overflow-hidden"
                            />
                        </div>
                    </div>

                    {/* Type selector */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-3">
                            3. Select Achievement Level (Sets Initial Color)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CERT_TYPES.map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setForm({ ...form, certType: t, themeColor: '' })}
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
                            <Award size={13} className="text-primary" /> 4. Personalization
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Full Name *</label>
                            <input
                                value={form.recipientName}
                                onChange={e => setForm({ ...form, recipientName: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                placeholder="e.g. Aarya Shah"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Event or Milestone *</label>
                            <div className="relative">
                                <select
                                    value={form.eventName}
                                    onChange={e => setForm({ ...form, eventName: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select event…</option>
                                    {events.map(ev => <option key={ev.id} value={ev.title}>{ev.title}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                            </div>
                            <input
                                value={form.eventName}
                                onChange={e => setForm({ ...form, eventName: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all mt-1"
                                placeholder="Or custom event name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Achievement Description</label>
                            <textarea
                                rows={2}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Date of Issue</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                    style={{ colorScheme: 'light' }}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Authorized Signatory</label>
                                <input
                                    value={form.issuedBy}
                                    onChange={e => setForm({ ...form, issuedBy: e.target.value })}
                                    className="w-full bg-bgDark border border-surfaceLight rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={!form.recipientName || !form.eventName || dlStatus === 'generating'}
                            className="w-full bg-primary hover:bg-secondary disabled:opacity-50 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-[0_0_18px_rgba(255,106,0,0.18)]"
                        >
                            {dlStatus === 'generating'
                                ? <><Loader2 size={15} className="animate-spin" /> Rendering...</>
                                : <><Download size={15} /> Download PNG</>
                            }
                        </button>
                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full bg-surface border border-surfaceLight hover:border-primary/40 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                        >
                            <Maximize2 size={15} className="text-primary" /> Full Preview
                        </button>
                    </div>

                    {/* Bulk Generate */}
                    <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden space-y-3">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                            <Users size={13} className="text-primary" /> Bulk Generation
                        </h3>
                        <div className="relative">
                            <select
                                value={bulkEventId}
                                onChange={e => setBulkEventId(e.target.value)}
                                className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none"
                            >
                                <option value="">Select event…</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title} ({participants.filter(p => p.eventId === ev.id).length})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                        </div>
                        {bulkStatus === 'generating' && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-textMuted">
                                    <span>Processing...</span>
                                    <span className="font-mono text-primary">{bulkProgress.done}/{bulkProgress.total}</span>
                                </div>
                                <div className="h-1 bg-surfaceLight rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleBulkGenerate}
                            disabled={!bulkEventId || !bulkParticipants.length || bulkStatus === 'generating'}
                            className="w-full bg-bgDark border border-surfaceLight hover:border-primary/40 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                        >
                            <Download size={14} /> Bulk Generate
                        </button>
                    </div>
                </div>

                {/* ══ RIGHT: LIVE PREVIEW ══ */}
                <div className="space-y-4 sticky top-6">
                    <div className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                        <div className="w-6 h-px bg-surfaceLight" /> Real-time Designer Preview
                    </div>

                    <div className="bg-surface border border-surfaceLight rounded-2xl overflow-hidden shadow-2xl"
                        style={{ height: 636 * 0.58 + 24 }}>
                        <div className="p-3">
                            <div style={{ transform: 'scale(0.58)', transformOrigin: 'top left', display: 'inline-block' }}>
                                <CertificateCanvas data={form} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                        < Sparkles size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-textMuted leading-relaxed">
                            Every template is 100% customizable. Select a base design, then use the color palette to match your branding.
                            The generation engine ensures pixel-perfect clarity.
                        </p>
                    </div>
                </div>
            </div>

            {/* FULL PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setShowPreview(false)}>
                    <div className="flex flex-col items-center gap-6 max-w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between w-full px-1">
                            <span className="text-textMuted text-xs font-bold uppercase tracking-widest">Master Studio Preview</span>
                            <button onClick={() => setShowPreview(false)} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs">
                                <X size={16} /> Close
                            </button>
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-2xl max-w-[95vw] overflow-x-auto ring-1 ring-white/10">
                            <CertificateCanvas data={form} />
                        </div>
                        <button onClick={() => { setShowPreview(false); setTimeout(handleDownload, 100); }} className="bg-primary hover:bg-secondary text-black font-bold px-10 py-4 rounded-xl flex items-center gap-2 text-sm transition-all shadow-xl">
                            <Download size={16} /> Confirm & Download
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
