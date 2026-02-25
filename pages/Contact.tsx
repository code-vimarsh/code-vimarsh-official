import React, { useState, useRef } from 'react';
import {
  Mail, MapPin, Send, Github, Linkedin,
  Loader2, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

/* ── ENV helper (avoids TS ImportMeta complaints) ─────────────── */
const env = (import.meta as any).env ?? {};
const SVC = env.VITE_EMAILJS_SERVICE_ID ?? 'service_txnmfop';
const TPL = env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_n53eny7';
const KEY = env.VITE_EMAILJS_PUBLIC_KEY ?? 'dc2UOFd7SrfFFz4ok';

/* ── Social links ─────────────────────────────────────────────── */
const SOCIALS = [
  {
    label: 'GitHub', href: 'https://github.com/code-vimarsh',
    icon: <Github size={18} className="text-white/70" />,
    hover: 'hover:border-white/40 hover:bg-white/5',
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/company/code-vimarsh',
    icon: <Linkedin size={18} className="text-[#0A66C2]" />,
    hover: 'hover:border-blue-500/40 hover:bg-blue-500/5',
  },
  {
    label: 'WhatsApp', href: 'https://chat.whatsapp.com/L7IN0PRX9Q61UQYQfzhEpX',
    icon: (
      <svg className="w-[18px] h-[18px] fill-current text-green-400" viewBox="0 0 448 512">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
      </svg>
    ),
    hover: 'hover:border-green-500/40 hover:bg-green-500/5',
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/code_vimarsh/',
    icon: (
      <svg className="w-[18px] h-[18px] fill-current text-pink-400" viewBox="0 0 448 512">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    ),
    hover: 'hover:border-pink-500/40 hover:bg-pink-500/5',
  },
];

const inputBase =
  'w-full px-4 py-3 bg-bgDark border border-surfaceLight rounded-xl text-white text-sm placeholder-textMuted ' +
  'focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 hover:border-primary/30 transition-all duration-200';

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
      const res = await emailjs.sendForm(SVC, TPL, form, KEY);
      if (res.status === 200 || res.text === 'OK') {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 6000);
      } else throw new Error('Unexpected response');
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.text ?? err.message ?? 'Something went wrong. Try again.');
      setTimeout(() => { setStatus('idle'); setErrMsg(''); }, 6000);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark relative overflow-hidden">

      {/* ── Ambient glows ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] bg-orange-700/4 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,106,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-28 pb-24">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-mono mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.1] mb-4">
            Let's Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Something Great.
            </span>
          </h1>
          <p className="text-textMuted text-base md:text-lg leading-relaxed">
            Have a question, idea, or want to collaborate? We respond to every message within 24 hours.
          </p>
        </motion.div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: Form (3 cols) ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-surface border border-surfaceLight rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* orange accent top line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <h2 className="text-lg font-bold text-white mb-1">Send a Message</h2>
              <p className="text-textMuted text-sm mb-8">Every message is read and replied to personally.</p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

                {/* error */}
                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-semibold text-sm">Failed to Send</p>
                      <p className="text-red-400/70 text-xs mt-0.5">{errMsg}</p>
                    </div>
                  </motion.div>
                )}

                {/* name + email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Name *</label>
                    <input type="text" name="user_name" required className={inputBase} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Email *</label>
                    <input type="email" name="user_email" required className={inputBase} placeholder="john@example.com" />
                  </div>
                </div>

                {/* subject */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Subject *</label>
                  <input type="text" name="subject" required className={inputBase} placeholder="What's this about?" />
                </div>

                {/* message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Message *</label>
                  <textarea name="message" required rows={5}
                    className={`${inputBase} resize-none`}
                    placeholder="Tell us what's on your mind..." />
                </div>

                {/* submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: status === 'sending' ? 1 : 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative w-full py-3.5 bg-primary hover:bg-secondary text-black font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:shadow-[0_0_36px_rgba(255,106,0,0.45)] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {status === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin relative z-10" /><span className="relative z-10">Sending…</span></>
                  ) : (
                    <><span className="relative z-10">Send Message</span><Send size={15} className="relative z-10 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </motion.button>

                {/* success */}
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/25">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold text-sm">Message Sent!</p>
                      <p className="text-green-400/70 text-xs mt-0.5">We'll get back to you soon.</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* ── RIGHT: Sidebar (2 cols) ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Logo card */}
            <div className="bg-surface border border-surfaceLight rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-center gap-4 mb-5">
                <img src="/CV LOGO.webp" alt="Code Vimarsh" className="h-14 w-auto object-contain" />
              </div>
              <p className="text-textMuted text-sm leading-relaxed">
                The official coding club of MSU Baroda — fostering innovation, engineering excellence, and a collaborative dev community.
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-surface border border-surfaceLight rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-5">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-200">
                    <Mail size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="text-[10px] text-textMuted uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:codingclub-cse@msubaroda.ac.in"
                      className="text-white text-sm hover:text-primary transition-colors break-all">
                      codingclub-cse@msubaroda.ac.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-200">
                    <MapPin size={15} className="text-primary" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] text-textMuted uppercase tracking-widest mb-1">Location</p>
                    <p className="text-white text-sm leading-relaxed">MSU Baroda, CSE Dept<br />Vadodara, Gujarat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="bg-surface border border-surfaceLight rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-5">Connect With Us</h3>
              <div className="space-y-2">
                {SOCIALS.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-surfaceLight bg-bgDark transition-all duration-200 group ${s.hover}`}
                  >
                    <span className="flex-shrink-0">{s.icon}</span>
                    <span className="text-sm font-medium text-textMuted group-hover:text-white transition-colors">{s.label}</span>
                    <ArrowRight size={13} className="ml-auto text-textMuted opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </motion.a>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;