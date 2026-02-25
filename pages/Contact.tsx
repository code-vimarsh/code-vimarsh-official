import React, { useState, useRef } from 'react';
import { Mail, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

/* ── ENV helper ─────────────────────────────────────────────── */
const env = (import.meta as any).env ?? {};
const SVC = env.VITE_EMAILJS_SERVICE_ID ?? 'service_txnmfop';
const TPL = env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_n53eny7';       // admin notification
const TPL_REPLY = 'template_o4gbipr';                                   // auto-reply to user
const KEY = env.VITE_EMAILJS_PUBLIC_KEY ?? 'dc2UOFd7SrfFFz4ok';

const inputBase =
  'w-full px-3.5 py-2.5 bg-bgDark border border-surfaceLight rounded-lg text-white text-sm placeholder-textMuted ' +
  'focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 hover:border-primary/30 transition-all duration-200';

/* ── Social icons ───────────────────────────────────────────── */
const SOCIALS = [
  {
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/L7IN0PRX9Q61UQYQfzhEpX',
    bgColor: '#25D366',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" height="1.1em">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/code-vimarsh',
    bgColor: '#0A66C2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" height="1.1em">
        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/code-vimarsh',
    bgColor: '#24292e',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" height="1.1em">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/code_vimarsh/',
    bgColor: '#E4405F',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" height="1.1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────── */
const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    const form = e.currentTarget;
    try {
      // Send both emails in parallel: admin notification + user auto-reply
      const [res] = await Promise.all([
        emailjs.sendForm(SVC, TPL, form, KEY),
        emailjs.sendForm(SVC, TPL_REPLY, form, KEY),
      ]);
      if (res.status === 200 || res.text === 'OK') {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else throw new Error('Unexpected response');
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.text ?? err.message ?? 'Something went wrong. Try again.');
      setTimeout(() => { setStatus('idle'); setErrMsg(''); }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark relative overflow-hidden">

      {/* ── Ambient glows ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-orange-700/4 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,106,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,0.02)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-16 max-w-2xl">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-3">
            Let's Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Something Great.
            </span>
          </h1>
          <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Have a question or want to collaborate? We reply within 24 hours.
          </p>
        </motion.div>

        {/* ── Form Card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-surface border border-surfaceLight rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <h2 className="text-base font-bold text-white mb-0.5">Send a Message</h2>
            <p className="text-textMuted text-xs mb-6">Every message is read and replied to personally.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

              {/* error */}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/25">
                  <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-semibold text-xs">Failed to Send</p>
                    <p className="text-red-400/70 text-xs mt-0.5">{errMsg}</p>
                  </div>
                </motion.div>
              )}

              {/* name + email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">Name *</label>
                  <input type="text" name="user_name" required className={inputBase} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">Email *</label>
                  <input type="email" name="user_email" required className={inputBase} placeholder="john@example.com" />
                </div>
              </div>

              {/* subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">Subject *</label>
                <input type="text" name="subject" required className={inputBase} placeholder="What's this about?" />
              </div>

              {/* message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">Message *</label>
                <textarea name="message" required rows={4}
                  className={`${inputBase} resize-none`}
                  placeholder="Tell us what's on your mind..." />
              </div>

              {/* submit */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: status === 'sending' ? 1 : 1.012 }}
                whileTap={{ scale: 0.985 }}
                className="relative w-full py-3 bg-primary hover:bg-secondary text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_18px_rgba(255,106,0,0.22)] hover:shadow-[0_0_30px_rgba(255,106,0,0.42)] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
                {status === 'sending' ? (
                  <><Loader2 size={14} className="animate-spin relative z-10" /><span className="relative z-10">Sending…</span></>
                ) : (
                  <><span className="relative z-10">Send Message</span><Send size={13} className="relative z-10 group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>

              {/* success */}
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-green-500/10 border border-green-500/25">
                  <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-semibold text-xs">Message Sent!</p>
                    <p className="text-green-400/70 text-xs mt-0.5">We'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}

              {/* ── Social Icons ─────────────────────────────────── */}
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-surfaceLight" />
                  <p className="text-[10px] font-semibold text-textMuted uppercase tracking-widest whitespace-nowrap">
                    Connect With Us
                  </p>
                  <div className="flex-1 h-px bg-surfaceLight" />
                </div>
                <ul className="flex justify-center gap-3 list-none p-0 m-0">
                  {SOCIALS.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="social-icon-btn"
                        style={{ '--social-color': s.bgColor } as React.CSSProperties}
                      >
                        <span className="social-tooltip">{s.label}</span>
                        <span className="social-icon-inner">{s.icon}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </form>
          </div>
        </motion.div>

        {/* ── Contact Details row ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 grid sm:grid-cols-2 gap-3"
        >
          {/* Email */}
          <div className="bg-surface border border-surfaceLight rounded-xl p-4 relative overflow-hidden group hover:border-primary/25 transition-colors duration-200">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-200">
                <Mail size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-textMuted uppercase tracking-widest mb-0.5">Email</p>
                <a href="mailto:codingclub-cse@msubaroda.ac.in"
                  className="text-white text-xs hover:text-primary transition-colors truncate block">
                  codingclub-cse@msubaroda.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-surface border border-surfaceLight rounded-xl p-4 relative overflow-hidden group hover:border-primary/25 transition-colors duration-200">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-200">
                <MapPin size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-textMuted uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-white text-xs leading-snug">MSU Baroda, CSE Dept · Vadodara, Gujarat</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;