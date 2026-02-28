import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { Mail, Send, CheckCircle, Copy, ExternalLink, Megaphone, Info, AlertCircle, Eye, History, UserPlus, Users, Sparkles } from 'lucide-react';

const CLUB_EMAIL = 'codingclub-cse@msubaroda.ac.in';
const BCC_CHUNK_SIZE = 40;

const EmailBlast: React.FC = () => {
    const { participants, events, team } = useGlobalState();

    // -- Email Blast State ---------------------------------------------------
    const [sendMode, setSendMode] = useState<'participants' | 'members' | 'specific'>('specific');
    const [emailForm, setEmailForm] = useState({
        to_name: '', to_email: '', email_type: 'Announcement', subject: '', admin_message: '',
    });
    const [selectedEventId, setSelectedEventId] = useState('');
    const [emailLog, setEmailLog] = useState<{ label: string; count: number; subject: string; type: string; sentAt: string; batches: number }[]>([]);
    const [htmlCopied, setHtmlCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    // Compute recipients based on send mode
    const bulkRecipients = sendMode === 'participants'
        ? participants.filter(p => !selectedEventId || p.eventId === selectedEventId)
        : sendMode === 'members'
            ? team.map(m => ({ id: m.id, name: m.name, email: m.email || '', eventId: '', eventTitle: m.role, registeredAt: '' }))
            : [];

    const typeConfig: Record<string, { accent: string; badge: string; tagline: string; icon: string }> = {
        'Announcement': { accent: '#FF6A00', badge: 'ANNOUNCEMENT', tagline: 'Important update from Code Vimarsh', icon: '📢' },
        'Event Details': { accent: '#7C3AED', badge: 'EVENT DETAILS', tagline: 'You are invited - mark your calendar!', icon: '📅' },
        'Certificate': { accent: '#059669', badge: 'CERTIFICATE', tagline: 'Congratulations on your achievement!', icon: '🏆' },
        'Feedback': { accent: '#2563EB', badge: 'FEEDBACK', tagline: 'We value your opinion', icon: '💬' },
        'Newsletter': { accent: '#D97706', badge: 'NEWSLETTER', tagline: "Here's what's happening at Code Vimarsh", icon: '📰' },
        'Custom': { accent: '#FF6A00', badge: 'MESSAGE', tagline: 'A message from the Code Vimarsh team', icon: '✏️' },
    };

    const buildHtmlEmail = (name: string, message: string, type: string, subject: string): string => {
        const cfg = typeConfig[type] || typeConfig['Custom'];
        const formattedMessage = message.replace(/\n/g, '<br>');
        const logoUrl = 'https://raw.githubusercontent.com/Aryanbuha89/Code_Vimarsh_Frontend/main/public/CV%20LOGO.webp';
        return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:20px;background-color:#f1f5f9;font-family:sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="height:4px;background:${cfg.accent};"></div>
        <div style="padding:30px;">
            <div style="display:flex;align-items:center;">
                <img src="${logoUrl}" width="40" height="40" style="border-radius:8px;margin-right:12px;" />
                <div>
                    <div style="font-weight:bold;color:#1e293b;font-size:18px;">Code Vimarsh</div>
                    <div style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">CSE Coding Club • MSU Baroda</div>
                </div>
            </div>
            <div style="margin-top:25px;font-size:24px;font-weight:bold;color:#0f172a;line-height:1.2;">${subject}</div>
            <div style="margin-top:5px;font-size:12px;color:${cfg.accent};font-weight:bold;">${cfg.tagline}</div>
            <div style="margin-top:25px;font-size:16px;color:#475569;line-height:1.6;">
                Dear <strong>${name}</strong>,<br><br>${formattedMessage}
            </div>
            <div style="margin-top:30px;padding-top:20px;border-top:1px solid #f1f5f9;">
                <div style="font-weight:bold;color:#1e293b;font-size:14px;">The Code Vimarsh Team</div>
                <div style="color:#64748b;font-size:12px;">CSE Dept, MSU Baroda</div>
            </div>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;">
            © 2024 Code Vimarsh • Vadodara, Gujarat<br>Sent from the official coding club platform.
        </div>
    </div>
</body></html>`;
    };

    const handleCopyRichHtml = async (name: string) => {
        const { email_type, subject, admin_message } = emailForm;
        if (!subject || !admin_message) return;
        const html = buildHtmlEmail(name || 'there', admin_message, email_type, subject);
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([`Dear ${name},\n\n${admin_message}\n\n- Code Vimarsh Team`], { type: 'text/plain' }),
                }),
            ]);
            setHtmlCopied(true);
            setTimeout(() => setHtmlCopied(false), 2000);
        } catch {
            navigator.clipboard.writeText(`Dear ${name},\n\n${admin_message}\n\n- Code Vimarsh`);
        }
    };

    const openMailto = (href: string) => {
        const a = document.createElement('a');
        a.href = href; a.style.display = 'none';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const handleOpenBulkDrafts = () => {
        const emails = bulkRecipients.map(r => r.email).filter(Boolean);
        if (!emails.length || !emailForm.subject) return;
        const fullSubject = `[Code Vimarsh | ${emailForm.email_type}] ${emailForm.subject}`;
        const chunks = [];
        for (let i = 0; i < emails.length; i += BCC_CHUNK_SIZE) chunks.push(emails.slice(i, i + BCC_CHUNK_SIZE));

        chunks.forEach((chunk, idx) => {
            setTimeout(() => {
                const body = `You have a new message from Code Vimarsh. Please check the formatted HTML message.`;
                openMailto(`mailto:${CLUB_EMAIL}?bcc=${encodeURIComponent(chunk.join(','))}&subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`);
            }, idx * 700);
        });

        setEmailLog(prev => [{ label: sendMode === 'members' ? 'Club Members' : 'Event Participants', count: emails.length, subject: emailForm.subject, type: emailForm.email_type, sentAt: new Date().toLocaleTimeString(), batches: chunks.length }, ...prev]);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Email <span className="text-primary italic border-b-2 border-primary/20">Blast</span></h2>
                    <p className="text-textMuted max-w-lg">Direct communication with your community. No 3rd parties, just pure Gmail efficiency.</p>
                </div>
                <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">Institutional Direct Link</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Composer */}
                <div className="lg:col-span-7">
                    <div className="bg-surface border border-surfaceLight rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-black/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Sparkles className="text-primary" size={20} />
                                Message Composer
                            </h3>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {/* Audience Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest flex items-center gap-2">
                                    <Users size={12} /> Target Audience
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'specific', label: 'Single Recipient', icon: <Send size={14} /> },
                                        { id: 'participants', label: 'Event Participants', icon: <Users size={14} /> },
                                        { id: 'members', label: 'Core Team', icon: <Info size={14} /> },
                                    ].map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSendMode(m.id as any)}
                                            className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 text-center ${sendMode === m.id ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' : 'bg-bgDark/50 border-surfaceLight text-textMuted hover:border-primary/30'}`}
                                        >
                                            {m.icon}
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Event Filter */}
                            {sendMode === 'participants' && (
                                <div className="p-5 bg-bgDark border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-300">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Filter by Active Event</label>
                                    <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="w-full bg-surface border border-surfaceLight rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer">
                                        <option value="">All Registered Participants ({participants.length})</option>
                                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                                    </select>
                                    <p className="mt-3 text-[10px] text-textMuted font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Users size={10} className="text-primary" /> {bulkRecipients.length} Recipient(s) Targeted
                                    </p>
                                </div>
                            )}

                            {/* Type Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={12} /> Email Classification
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {Object.entries(typeConfig).map(([key, cfg]) => (
                                        <button key={key} onClick={() => setEmailForm({ ...emailForm, email_type: key })} className={`px-4 py-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${emailForm.email_type === key ? 'bg-bgDark border-primary text-primary shadow-lg' : 'bg-bgDark/40 border-surfaceLight text-textMuted hover:border-primary/20'}`}>
                                            {cfg.icon} {key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-1 gap-6">
                                {sendMode === 'specific' && (
                                    <div className="grid sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] px-1">Full Name</label>
                                            <input value={emailForm.to_name} onChange={e => setEmailForm({ ...emailForm, to_name: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] px-1">Email Address</label>
                                            <input value={emailForm.to_email} onChange={e => setEmailForm({ ...emailForm, to_email: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] px-1">Subject Header</label>
                                    <input value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm font-bold focus:border-primary focus:outline-none transition-all placeholder:font-normal" placeholder="e.g. Exciting Hackathon Coming Soon!" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Message Body</label>
                                        <button onClick={() => setEmailForm({ ...emailForm, admin_message: 'Sample message content...' })} className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                                            <Megaphone size={10} /> Load Template
                                        </button>
                                    </div>
                                    <textarea rows={8} value={emailForm.admin_message} onChange={e => setEmailForm({ ...emailForm, admin_message: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-2xl px-5 py-4 text-sm focus:border-primary focus:outline-none transition-all resize-none leading-relaxed" placeholder="Write your community message here..." />
                                </div>
                            </div>

                            {/* Big Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleCopyRichHtml(emailForm.to_name || 'there')}
                                    disabled={!emailForm.subject || !emailForm.admin_message}
                                    className="p-4 bg-surface border border-primary/30 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/10 transition-all flex flex-col items-center gap-2 group disabled:opacity-30 disabled:grayscale"
                                >
                                    {htmlCopied ? <CheckCircle className="text-green-500 animate-bounce" size={24} /> : <Copy className="text-primary group-hover:scale-110 transition-transform" size={24} />}
                                    {htmlCopied ? 'Email Copied!' : '1. Copy Rich HTML'}
                                </button>
                                <button
                                    onClick={() => sendMode === 'specific' ? openMailto(`mailto:${emailForm.to_email}?subject=${encodeURIComponent(emailForm.subject)}`) : handleOpenBulkDrafts()}
                                    disabled={!emailForm.subject || (sendMode === 'specific' ? !emailForm.to_email : bulkRecipients.length === 0)}
                                    className="p-4 bg-primary rounded-2xl text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex flex-col items-center gap-2 disabled:opacity-30 disabled:grayscale"
                                >
                                    <ExternalLink size={24} />
                                    2. Draft in Gmail
                                </button>
                            </div>
                            <div className="p-4 bg-bgDark border border-surfaceLight rounded-2xl flex gap-3 items-start">
                                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                                <p className="text-[10px] text-textMuted leading-relaxed">
                                    <strong className="text-white">Workflow:</strong> Copy the HTML message first, then open the Gmail draft. Paste (Ctrl+V) into the body and hit send. BCC chunking is handled automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview & Log */}
                <div className="lg:col-span-5 space-y-6">
                    <div className={`bg-surface border border-surfaceLight rounded-3xl overflow-hidden shadow-2xl transition-all duration-500`}>
                        <div className="p-6 border-b border-surfaceLight flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-textMuted flex items-center gap-2">
                                <Eye size={14} className="text-primary" /> Real-time Preview
                            </h4>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]"></div>
                            </div>
                        </div>
                        {emailForm.subject && emailForm.admin_message ? (
                            <div className="p-4 bg-bgDark">
                                <iframe
                                    srcDoc={buildHtmlEmail(emailForm.to_name || 'Member', emailForm.admin_message, emailForm.email_type, emailForm.subject)}
                                    className="w-full rounded-2xl border border-surfaceLight bg-white"
                                    style={{ height: '500px' }}
                                    title="Email Live Preview"
                                />
                            </div>
                        ) : (
                            <div className="h-[500px] flex flex-col items-center justify-center text-center p-10 bg-bgDark/40">
                                <Mail size={48} className="text-textMuted mb-4 opacity-20" />
                                <h5 className="font-bold text-lg text-white mb-2">Empty Canvas</h5>
                                <p className="text-xs text-textMuted">Fill the composer to see your masterpiece here.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-surface border border-surfaceLight rounded-3xl p-6 shadow-2xl">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-textMuted mb-6 flex items-center gap-2">
                            <History size={14} className="text-secondary" /> Transmission Logs
                        </h4>
                        {emailLog.length === 0 ? (
                            <div className="p-8 border border-dashed border-surfaceLight rounded-2xl text-center">
                                <p className="text-xs text-textMuted italic">No transmission data recorded for this session.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {emailLog.map((log, i) => (
                                    <div key={i} className="p-4 bg-bgDark border border-surfaceLight rounded-2xl flex gap-4 transition-all hover:border-secondary/30">
                                        <div className="w-10 h-10 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Send size={16} className="text-secondary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs font-black text-white truncate">{log.label}</p>
                                                <span className="text-[9px] font-mono text-textMuted shrink-0">{log.sentAt}</span>
                                            </div>
                                            <p className="text-[10px] text-textMuted mt-1">{log.count} recipients in {log.batches} batch(es)</p>
                                            <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-secondary">{log.type}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailBlast;
