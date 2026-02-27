import React, { useState, useRef } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { LayoutDashboard, Calendar, FolderHeart, ShieldAlert, Users, Plus, Trash2, ArrowLeft, BookOpen, Pencil, Upload, X, Save, Mail, Send, CheckCircle, AlertCircle, Loader2, Megaphone, UserPlus, UserCheck, Award, Newspaper, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';
import Certificates from './Certificates';
import ManageEvents from '../components/admin/ManageEvents';
import ManageBlogs from '../components/admin/blogs/ManageBlogs';
import ManageAchievements from '../components/admin/achievements/ManageAchievements';

const Admin: React.FC = () => {
  const {
    events, addEvent,
    projects, addProject,
    admins, addAdmin,
    videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
    linkResources, addLinkResource, updateLinkResource, deleteLinkResource,
    participants, addParticipant, removeParticipant,
    clubMembers, addClubMember, removeClubMember,
  } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'projects' | 'admins' | 'resources' | 'email' | 'certificates' | 'blogs' | 'achievements'>('overview');

  // New Event State
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Upcoming', description: '' });

  // New Project State
  const [newProject, setNewProject] = useState({
    title: '', author: '', tech: '', github: '',
    description: '', category: 'Web' as any, image: ''
  });
  const [projectImgMode, setProjectImgMode] = useState<'url' | 'upload'>('url');
  const projectImgRef = useRef<HTMLInputElement>(null);
  const projectFileToDataUrl = (file: File): Promise<string> =>
    new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Moderator' });

  // New Resource State
  const [newVideo, setNewVideo] = useState({ title: '', url: '', thumbnail: '', tags: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' });

  // ── Email Blast State ───────────────────────────────────────────────────
  const CLUB_EMAIL = 'codingclub-cse@msubaroda.ac.in';
  const BCC_CHUNK_SIZE = 40;

  // Send-mode: 'participants' | 'members' | 'specific'
  const [sendMode, setSendMode] = useState<'participants' | 'members' | 'specific'>('specific');
  // Sub-tab inside email: 'compose' | 'participants' | 'members'
  const [emailSubTab, setEmailSubTab] = useState<'compose' | 'participants' | 'members'>('compose');
  const [htmlCopied, setHtmlCopied] = useState(false);
  const [copiedChunk, setCopiedChunk] = useState<number | null>(null);

  const [emailForm, setEmailForm] = useState({
    to_name: '', to_email: '', email_type: 'Announcement', subject: '', admin_message: '',
  });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [emailLog, setEmailLog] = useState<{ label: string; count: number; subject: string; type: string; sentAt: string; batches: number }[]>([]);

  // New participant form
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '', eventId: '' });
  // New member form
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' });

  // Compute recipients based on send mode
  const bulkRecipients = sendMode === 'participants'
    ? participants.filter(p => !selectedEventId || p.eventId === selectedEventId)
    : sendMode === 'members'
      ? clubMembers
      : [];

  // Helper: chunk array into batches
  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
    return result;
  };

  // Helper: open mailto reliably (bypasses popup blockers)
  const openMailto = (href: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Build a mailto: URL with BCC batch
  const buildMailto = (bcc: string[], subject: string): string => {
    const plain = `You have a new message from Code Vimarsh.\n\nPlease view this email in a proper email client to see the full formatted version.\n\n- Code Vimarsh Team\n${CLUB_EMAIL}`;
    return `mailto:${CLUB_EMAIL}?bcc=${encodeURIComponent(bcc.join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`;
  };

  // ── HTML Email Template ───────────────────────────────────────────────────
  const typeConfig: Record<string, { accent: string; badge: string; tagline: string }> = {
    'Announcement': { accent: '#FF6A00', badge: 'ANNOUNCEMENT', tagline: 'Important update from Code Vimarsh' },
    'Event Details': { accent: '#7C3AED', badge: 'EVENT DETAILS', tagline: 'You are invited - mark your calendar!' },
    'Certificate': { accent: '#059669', badge: 'CERTIFICATE', tagline: 'Congratulations on your achievement!' },
    'Feedback': { accent: '#2563EB', badge: 'FEEDBACK', tagline: 'We value your opinion' },
    'Newsletter': { accent: '#D97706', badge: 'NEWSLETTER', tagline: "Here's what's happening at Code Vimarsh" },
    'Custom': { accent: '#FF6A00', badge: 'MESSAGE', tagline: 'A message from the Code Vimarsh team' },
  };

  const buildHtmlEmail = (name: string, message: string, type: string, subject: string): string => {
    const cfg = typeConfig[type] || typeConfig['Custom'];
    const formattedMessage = message.replace(/\n/g, '<br>');
    // Use GitHub raw URL for the logo to ensure it loads in email clients
    const logoUrl = window.location.origin.includes('localhost')
      ? 'https://raw.githubusercontent.com/Aryanbuha89/Code_Vimarsh_Frontend/main/public/CV%20LOGO.webp'
      : `${window.location.origin}/CV%20LOGO.webp`;
    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${subject}</title>
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  
  /* Mobile Specific Styles */
  @media only screen and (max-width: 600px) {
    .main-table { width: 100% !important; border-radius: 0 !important; }
    .content-padding { padding: 25px 20px !important; }
    .hero-text { font-size: 24px !important; }
    .header-stack { display: block !important; width: 100% !important; text-align: center !important; }
    .header-logo { padding-right: 0 !important; margin-bottom: 15px !important; display: inline-block !important; }
    .header-badge { text-align: center !important; margin-top: 15px !important; }
    .footer-stack { display: block !important; text-align: center !important; }
    .footer-left { margin-bottom: 20px !important; }
  }

  @media (prefers-color-scheme: dark) {
    .body-bg { background-color: #0c0c0e !important; }
    .content-bg { background-color: #1a1a1e !important; }
    .footer-bg { background-color: #0c0c0e !important; }
    .text-primary { color: #ffffff !important; }
    .text-muted { color: #a1a1aa !important; }
    .border-subtle { border-color: #27272a !important; }
  }

  /* Gmail Dark Mode Override */
  [data-ogsc] .body-bg { background-color: #0c0c0e !important; }
  [data-ogsc] .content-bg { background-color: #1a1a1e !important; }
  [data-ogsc] .footer-bg { background-color: #0c0c0e !important; }
  [data-ogsc] .text-primary { color: #ffffff !important; }
  [data-ogsc] .text-muted { color: #a1a1aa !important; }
  [data-ogsc] .border-subtle { border-color: #27272a !important; }

  body, table, td, p, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;" bgcolor="#f1f5f9">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f5f9" class="body-bg" style="background-color:#f1f5f9;">
<tr><td align="center" style="padding:40px 0;">
<table width="600" cellpadding="0" cellspacing="0" border="0" class="content-bg main-table" style="max-width:600px;width:100%;border-collapse:separate;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background-color:#ffffff;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
<!-- TOP ACCENT BAR -->
<tr><td height="4" bgcolor="${cfg.accent}" style="background-color:${cfg.accent};font-size:0;line-height:0;height:4px;">&nbsp;</td></tr>
<!-- HEADER -->
<tr><td bgcolor="#ffffff" class="content-bg content-padding" style="background-color:#ffffff;padding:30px 40px;" valign="middle">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle" class="header-stack">
      <table cellpadding="0" cellspacing="0" border="0" align="left" class="header-stack"><tr>
        <td valign="middle" style="padding-right:12px;" class="header-logo">
          <img src="${logoUrl}" width="48" height="48" alt="CV" style="display:block;border-radius:10px;border:0;margin:0 auto;" />
        </td>
        <td valign="middle">
          <p class="text-primary" style="margin:0;font-size:20px;font-weight:800;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">Code Vimarsh</p>
          <p class="text-muted" style="margin:2px 0 0;font-size:10px;color:#64748b;font-family:Arial,Helvetica,sans-serif;letter-spacing:1.5px;text-transform:uppercase;">CSE Coding Club &middot; MSU Baroda</p>
        </td>
      </tr></table>
    </td>
    <td align="right" valign="middle" class="header-stack header-badge" style="padding-top:10px;">
      <table cellpadding="0" cellspacing="0" border="0" align="right" class="header-stack"><tr>
        <td bgcolor="${cfg.accent}" style="background-color:${cfg.accent};border-radius:20px;padding:7px 16px;">
          <p style="margin:0;font-size:10px;font-weight:800;color:#0f172a;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">${cfg.badge}</p>
        </td>
      </tr></table>
    </td>
  </tr></table>
</td></tr>
<!-- HERO -->
<tr><td bgcolor="#ffffff" class="content-bg border-subtle content-padding" style="background-color:#ffffff;padding:30px 40px 20px;border-top:1px solid #f1f5f9;">
  <p class="text-primary hero-text" style="margin:0 0 10px;font-size:28px;font-weight:800;color:#0f172a;line-height:1.2;font-family:Arial,Helvetica,sans-serif;">${subject}</p>
  <p style="margin:0;font-size:14px;color:${cfg.accent};font-family:Arial,Helvetica,sans-serif;font-weight:600;">${cfg.tagline}</p>
</td></tr>
<!-- BODY -->
<tr><td bgcolor="#ffffff" class="content-bg content-padding" style="background-color:#ffffff;padding:10px 40px 30px;">
  <p class="text-primary" style="margin:0 0 20px;font-size:16px;color:#334155;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">Dear <strong class="text-primary" style="color:#0f172a;">${name}</strong>,</p>
  <p class="text-muted" style="margin:0;font-size:16px;color:#475569;line-height:1.8;font-family:Arial,Helvetica,sans-serif;">${formattedMessage}</p>
</td></tr>
<!-- SIGNATURE -->
<tr><td bgcolor="#ffffff" class="content-bg content-padding" style="background-color:#ffffff;padding:0 40px 40px;">
  <table cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="3" bgcolor="${cfg.accent}" style="background-color:${cfg.accent};border-radius:2px;width:3px;">&nbsp;</td>
    <td style="padding-left:14px;">
      <p class="text-primary" style="margin:0;font-size:14px;font-weight:700;color:#1e293b;font-family:Arial,Helvetica,sans-serif;">The Code Vimarsh Team</p>
      <p class="text-muted" style="margin:3px 0 0;font-size:12px;color:#64748b;font-family:Arial,Helvetica,sans-serif;">CSE Coding Club, MSU Baroda</p>
    </td>
  </tr></table>
</td></tr>
<!-- SOCIAL -->
<tr><td bgcolor="#f8fafc" class="footer-bg border-subtle content-padding" style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="footer-stack footer-left">
      <table cellpadding="0" cellspacing="0" border="0" align="left" class="footer-stack"><tr>
        <td style="padding-right:12px;">
          <a href="https://www.instagram.com/code_vimarsh/" style="text-decoration:none;"><img src="https://img.icons8.com/ios-glyphs/30/1e293b/instagram-new.png" class="text-primary" width="20" height="20" alt="IG" style="display:block;border:0;margin:0 auto;" /></a>
        </td>
        <td style="padding-right:12px;">
          <a href="https://www.linkedin.com/company/code-vimarsh/" style="text-decoration:none;"><img src="https://img.icons8.com/ios-glyphs/30/1e293b/linkedin.png" class="text-primary" width="20" height="20" alt="IN" style="display:block;border:0;margin:0 auto;" /></a>
        </td>
        <td style="padding-right:12px;">
          <a href="https://github.com/Aryanbuha89/Code_Vimarsh_Frontend" style="text-decoration:none;"><img src="https://img.icons8.com/ios-glyphs/30/1e293b/github.png" class="text-primary" width="20" height="20" alt="GH" style="display:block;border:0;margin:0 auto;" /></a>
        </td>
        <td>
          <a href="https://codevimarsh.vercel.app/" style="text-decoration:none;"><img src="https://img.icons8.com/ios-glyphs/30/1e293b/globe.png" class="text-primary" width="20" height="20" alt="WEB" style="display:block;border:0;margin:0 auto;" /></a>
        </td>
      </tr></table>
    </td>
    <td align="right" class="footer-stack">
      <p class="text-muted" style="margin:0;font-size:11px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">&copy; 2024 Code Vimarsh</p>
    </td>
  </tr></table>
</td></tr>
<!-- DISCLAMER -->
<tr><td bgcolor="#f8fafc" class="footer-bg content-padding" style="background-color:#f8fafc;padding:0 40px 24px;text-align:center;">
    <p class="text-muted" style="margin:0 0 14px;font-size:11px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">Code Vimarsh &middot; CSE Dept, MSU Baroda &middot; Gujarat, India</p>
    <p class="text-muted" style="margin:0;font-size:10px;color:#cbd5e1;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">You received this email because you are a registered member or participant of Code Vimarsh.</p>
</td></tr>
<!-- BOTTOM ACCENT -->
<tr><td height="4" bgcolor="${cfg.accent}" style="background-color:${cfg.accent};font-size:0;line-height:0;height:4px;">&nbsp;</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  };

  const handleLoadSample = () => {
    setEmailForm({
      ...emailForm,
      subject: 'Important Community Update & Upcoming Hackathon 📢',
      admin_message: `Hello everyone!

We have some exciting news to share with the Code Vimarsh community. Our club is growing faster than ever, and we are preparing for our flagship event: The Nexus Hackathon 2024.

Upcoming Highlights:
• New Projects: Check out the revamped Projects section on our website.
• Resource Hub: 20+ new curated roadmaps added.
• Workshop Series: Advanced development sessions starting next week.

Action Required:
If you haven't joined our official community groups yet, please do so via the website links to stay updated in real-time.

We look forward to seeing your innovative contributions!

Best Regards,
The Code Vimarsh Core Team`,
      email_type: 'Announcement'
    });
  };

  // ── Copy rich HTML to clipboard ─────────────────────────────────────────────────
  const handleCopyRichHtml = async (name: string) => {
    const { email_type, subject, admin_message } = emailForm;
    if (!subject || !admin_message) return;
    const html = buildHtmlEmail(name || 'there', admin_message, email_type, subject);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([`Dear ${name},\n\n${admin_message}\n\n- Code Vimarsh Team\n${CLUB_EMAIL}`], { type: 'text/plain' }),
        }),
      ]);
      setHtmlCopied(true);
      setTimeout(() => setHtmlCopied(false), 3000);
    } catch {
      navigator.clipboard.writeText(`Dear ${name},\n\n${admin_message}\n\n- Code Vimarsh\n${CLUB_EMAIL}`);
      setHtmlCopied(true);
      setTimeout(() => setHtmlCopied(false), 3000);
    }
  };

  const handleSendSpecific = () => {
    const { to_email, to_name, email_type, subject } = emailForm;
    if (!to_email || !subject) return;
    const fullSubject = `[Code Vimarsh | ${email_type}] ${subject}`;
    openMailto(`mailto:${to_email}?subject=${encodeURIComponent(fullSubject)}`);
    setEmailLog(prev => [{ label: to_name || to_email, count: 1, subject, type: email_type, sentAt: new Date().toLocaleTimeString(), batches: 1 }, ...prev]);
  };

  const handleOpenBulkDrafts = () => {
    const emails = bulkRecipients.map((r: any) => r.email).filter(Boolean);
    if (!emails.length || !emailForm.subject) return;
    const fullSubject = `[Code Vimarsh | ${emailForm.email_type}] ${emailForm.subject}`;
    const chunks = chunkArray(emails, BCC_CHUNK_SIZE);
    chunks.forEach((chunkEmails, idx) => {
      setTimeout(() => { openMailto(buildMailto(chunkEmails, fullSubject)); }, idx * 700);
    });
    setEmailLog(prev => [{ label: sendMode === 'members' ? 'Club Members' : 'Event Participants', count: emails.length, subject: emailForm.subject, type: emailForm.email_type, sentAt: new Date().toLocaleTimeString(), batches: chunks.length }, ...prev]);
  };

  const handleCopyEmails = (emails: string[], chunkIdx: number) => {
    navigator.clipboard.writeText(emails.join(', '));
    setCopiedChunk(chunkIdx);
    setTimeout(() => setCopiedChunk(null), 2000);
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name || !newParticipant.email || !newParticipant.eventId) return;
    const ev = events.find(ev => ev.id === newParticipant.eventId);
    addParticipant({
      id: Date.now().toString(),
      name: newParticipant.name,
      email: newParticipant.email,
      eventId: newParticipant.eventId,
      eventTitle: ev?.title ?? 'Unknown Event',
      registeredAt: new Date().toISOString().split('T')[0],
    });
    setNewParticipant({ name: '', email: '', eventId: '' });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    addClubMember({
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      joinedAt: new Date().toISOString().split('T')[0],
    });
    setNewMember({ name: '', email: '', role: 'Member' });
  };

  // Editing State
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    addEvent({
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as any,
      description: newEvent.description
    });
    setNewEvent({ title: '', date: '', type: 'Upcoming', description: '' });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.image) return;
    addProject({
      id: Date.now().toString(),
      title: newProject.title,
      author: newProject.author,
      description: newProject.description,
      category: newProject.category,
      tech: newProject.tech.split(',').map(t => t.trim()),
      image: newProject.image,
      links: { github: newProject.github }
    });
    setNewProject({ title: '', author: '', tech: '', github: '', description: '', category: 'Web', image: '' });
    setProjectImgMode('url');
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;
    addAdmin({
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role as any,
      addedAt: new Date().toISOString().split('T')[0]
    });
    setNewAdmin({ name: '', email: '', role: 'Moderator' });
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;

    if (editingVideo) {
      updateVideoResource({ id: editingVideo, ...newVideo, tags: newVideo.tags.split(',').map(t => t.trim()) });
      setEditingVideo(null);
    } else {
      addVideoResource({
        id: Date.now().toString(),
        ...newVideo,
        tags: newVideo.tags.split(',').map(t => t.trim())
      });
    }
    setNewVideo({ title: '', url: '', thumbnail: '', tags: '' });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    if (editingLink) {
      updateLinkResource({ id: editingLink, ...newLink, tags: newLink.tags.split(',').map(t => t.trim()) });
      setEditingLink(null);
    } else {
      addLinkResource({
        id: Date.now().toString(),
        ...newLink,
        tags: newLink.tags.split(',').map(t => t.trim())
      });
    }
    setNewLink({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' });
  };

  const startEditVideo = (video: any) => {
    setEditingVideo(video.id);
    setNewVideo({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      tags: video.tags?.join(', ') || ''
    });
  };

  const startEditLink = (link: any) => {
    setEditingLink(link.id);
    setNewLink({
      title: link.title,
      url: link.url,
      category: link.category,
      tags: link.tags?.join(', ') || '',
      bestFor: link.bestFor || '',
      contentType: link.contentType || ''
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'video') setNewVideo({ ...newVideo, thumbnail: url });
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-surfaceLight flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-surfaceLight">
          <Link to="/" className="flex items-center space-x-2 text-textMuted hover:text-white mb-6 transition-colors w-fit">
            <ArrowLeft size={16} /> <span className="text-sm">Back to App</span>
          </Link>
          <h1 className="font-display font-bold text-xl text-primary">Admin Control</h1>
          <p className="text-xs text-textMuted font-mono mt-1">v2.0.26_SECURE</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
            { id: 'events', icon: <Calendar size={18} />, label: 'Manage Events' },
            { id: 'projects', icon: <FolderHeart size={18} />, label: 'Manage Projects' },
            { id: 'resources', icon: <BookOpen size={18} />, label: 'Manage Resources' },
            { id: 'admins', icon: <ShieldAlert size={18} />, label: 'Access Control' },
            { id: 'email', icon: <Megaphone size={18} />, label: 'Email Blast' },
            { id: 'certificates', icon: <Award size={18} />, label: '🏆 Certificates' },
            { id: 'blogs', icon: <Newspaper size={18} />, label: 'Manage Blogs' },
            { id: 'achievements', icon: <Trophy size={18} />, label: 'Achievements' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-textMuted hover:bg-surfaceLight hover:text-white'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-surfaceLight">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
            <div>
              <p className="text-sm font-bold text-white">Admin Session</p>
              <p className="text-xs text-textMuted">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">System Overview</h2>
              <p className="text-textMuted">Real-time metrics for the Code Vimarsh platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Events', val: events.length },
                { label: 'Projects Shipped', val: projects.length },
                { label: 'Resources', val: videoResources.length + linkResources.length },
                { label: 'Active Admins', val: admins.length }
              ].map((stat, i) => (
                <div key={i} className="bg-surface border border-surfaceLight p-6 rounded-xl">
                  <p className="text-textMuted text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-4xl font-display font-bold text-white">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Manage Events</h2>
              <p className="text-textMuted">Create, edit and build registration forms for community events.</p>
            </div>
            <ManageEvents />
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Manage Projects</h2>
              <p className="text-textMuted">Approve and add community built projects.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1 bg-surface border border-surfaceLight p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Plus size={18} className="mr-2 text-primary" /> Add Project</h3>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Project Title</label>
                    <input required value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Author/Team</label>
                    <input required value={newProject.author} onChange={e => setNewProject({ ...newProject, author: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Category</label>
                    <select value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value as any })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none text-white">
                      <option>Web</option>
                      <option>Mobile</option>
                      <option>AI / ML</option>
                      <option>Systems</option>
                      <option>Open Source</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Tech Stack (comma separated)</label>
                    <input required value={newProject.tech} onChange={e => setNewProject({ ...newProject, tech: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="React, Node, MongoDB" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Description</label>
                    <textarea rows={2} required value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" placeholder="Short pitch..." />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">GitHub Link</label>
                    <input value={newProject.github} onChange={e => setNewProject({ ...newProject, github: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="https://github.com/..." />
                  </div>

                  {/* ── Project Image (compulsory) ── */}
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">
                      Project Image <span className="text-primary font-bold">*</span>
                    </label>
                    {/* Mode toggle pill */}
                    <div className="inline-flex rounded-full border border-surfaceLight overflow-hidden mb-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setProjectImgMode('url')}
                        className={`px-3 py-1 transition-colors ${projectImgMode === 'url' ? 'bg-primary text-black' : 'text-textMuted hover:text-white'}`}
                      >URL</button>
                      <button
                        type="button"
                        onClick={() => setProjectImgMode('upload')}
                        className={`px-3 py-1 transition-colors flex items-center gap-1 ${projectImgMode === 'upload' ? 'bg-primary text-black' : 'text-textMuted hover:text-white'}`}
                      ><Upload size={11} />Upload</button>
                    </div>

                    {projectImgMode === 'url' ? (
                      <input
                        value={newProject.image}
                        onChange={e => setNewProject({ ...newProject, image: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="https://example.com/project-image.png"
                      />
                    ) : (
                      <>
                        <input
                          ref={projectImgRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB'); return; }
                            const dataUrl = await projectFileToDataUrl(file);
                            setNewProject(p => ({ ...p, image: dataUrl }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => projectImgRef.current?.click()}
                          className="w-full border-2 border-dashed border-surfaceLight hover:border-primary/60 rounded-md py-3 text-xs text-textMuted hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload size={14} /> Click to choose image (max 5 MB)
                        </button>
                      </>
                    )}

                    {/* Preview */}
                    {newProject.image && (
                      <div className="relative mt-2 inline-block">
                        <img
                          src={newProject.image}
                          alt="preview"
                          className="h-16 w-24 object-cover rounded-md border border-surfaceLight"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setNewProject(p => ({ ...p, image: '' }))}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 rounded-full p-0.5"
                        ><X size={10} /></button>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={!newProject.image} className="w-full bg-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-2 rounded-md transition-colors text-sm">Add Project</button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                {projects.map(proj => (
                  <div key={proj.id} className="bg-surface border border-surfaceLight p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{proj.title}</h4>
                      <p className="text-xs text-textMuted font-mono">by {proj.author}</p>
                    </div>
                    <button className="text-textMuted hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Access Control</h2>
              <p className="text-textMuted">Manage system administrators and moderators.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1 bg-surface border border-surfaceLight p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Users size={18} className="mr-2 text-primary" /> Grant Access</h3>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Name</label>
                    <input required value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Email</label>
                    <input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Role</label>
                    <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none text-white">
                      <option>Moderator</option>
                      <option>Content Admin</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-secondary text-black font-bold py-2 rounded-md transition-colors text-sm">Provision User</button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-surface border border-surfaceLight rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surfaceLight/50 text-textMuted border-b border-surfaceLight">
                      <tr>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Date Added</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surfaceLight">
                      {admins.map(admin => (
                        <tr key={admin.id} className="hover:bg-surfaceLight/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-white">{admin.name}</p>
                            <p className="text-xs text-textMuted">{admin.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs border ${admin.role === 'Super Admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              admin.role === 'Content Admin' ? 'bg-primary/10 text-primary border-primary/20' :
                                'bg-surfaceLight text-textMuted border-surfaceLight'
                              }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-textMuted font-mono text-xs">{admin.addedAt}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-textMuted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Resource Command Center</h2>
                <p className="text-textMuted text-sm">Deploy high-quality learning assets to the community.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Videos Section */}
              <section className="space-y-8">
                <div className="bg-surface border border-surfaceLight p-8 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl flex items-center text-white">
                      {editingVideo ? <Pencil size={20} className="mr-3 text-primary animate-pulse" /> : <Plus size={20} className="mr-3 text-primary" />}
                      {editingVideo ? 'Edit Video Asset' : 'New Video Resource'}
                    </h3>
                    {editingVideo && (
                      <button
                        onClick={() => { setEditingVideo(null); setNewVideo({ title: '', url: '', thumbnail: '', tags: '' }); }}
                        className="text-textMuted hover:text-white transition-colors flex items-center text-xs"
                      >
                        <X size={14} className="mr-1" /> Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddVideo} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Video Title</label>
                      <input required value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all" placeholder="e.g. Master React in 10 mins" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Access URL</label>
                      <input required value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all" placeholder="https://youtube.com/..." />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Visual Cover (Thumbnail)</label>
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <input value={newVideo.thumbnail} onChange={e => setNewVideo({ ...newVideo, thumbnail: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all pl-10" placeholder="Image URL..." />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">
                            <BookOpen size={16} />
                          </div>
                        </div>
                        <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-surfaceLight border border-surfaceLight rounded-xl cursor-pointer hover:border-primary/50 hover:bg-surface transition-all group">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'video')} className="hidden" />
                          <Upload size={18} className="text-textMuted group-hover:text-primary transition-colors" />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Tags (Comma Separated)</label>
                      <input value={newVideo.tags} onChange={e => setNewVideo({ ...newVideo, tags: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all" placeholder="e.g. Java, OOP, Beginner" />
                    </div>

                    <button type="submit" className={`w-full ${editingVideo ? 'bg-white text-black' : 'bg-primary text-black'} font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/10`}>
                      {editingVideo ? <Save size={18} /> : <Plus size={18} />}
                      {editingVideo ? 'Apply Changes' : 'Deploy Resource'}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center">
                    <div className="w-8 h-[1px] bg-surfaceLight mr-3"></div>
                    Active Inventory ({videoResources.length})
                  </h4>
                  <div className="grid gap-3">
                    {videoResources.map(video => (
                      <div key={video.id} className={`bg-surface border ${editingVideo === video.id ? 'border-primary shadow-lg shadow-primary/5' : 'border-surfaceLight'} p-3 rounded-2xl flex justify-between items-center group transition-all hover:bg-surfaceLight/30`}>
                        <div className="flex items-center space-x-4">
                          <div className="relative overflow-hidden w-16 h-10 rounded-lg border border-surfaceLight">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white line-clamp-1">{video.title}</span>
                            <p className="text-[10px] text-textMuted font-mono truncate max-w-[150px]">{video.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditVideo(video)} className="text-textMuted hover:text-primary transition-colors p-2 rounded-lg hover:bg-bgDark">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteVideoResource(video.id)} className="text-textMuted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-bgDark">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Links Section */}
              <section className="space-y-8">
                <div className="bg-surface border border-surfaceLight p-8 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl flex items-center text-white">
                      {editingLink ? <Pencil size={20} className="mr-3 text-primary animate-pulse" /> : <Plus size={20} className="mr-3 text-primary" />}
                      {editingLink ? 'Edit Link Asset' : 'New Link Resource'}
                    </h3>
                    {editingLink && (
                      <button
                        onClick={() => { setEditingLink(null); setNewLink({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' }); }}
                        className="text-textMuted hover:text-white transition-colors flex items-center text-xs"
                      >
                        <X size={14} className="mr-1" /> Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddLink} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Label</label>
                      <input required value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. MDN Web Docs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Destination URL</label>
                      <input required value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="https://..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Tag / Category</label>
                      <input required value={newLink.category} onChange={e => setNewLink({ ...newLink, category: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. Documentation" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Best For</label>
                      <input value={newLink.bestFor} onChange={e => setNewLink({ ...newLink, bestFor: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. Complete roadmap from basics" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Content Type</label>
                      <input value={newLink.contentType} onChange={e => setNewLink({ ...newLink, contentType: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. Curated sheet + Video support" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Tags (Comma Separated)</label>
                      <input value={newLink.tags} onChange={e => setNewLink({ ...newLink, tags: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. Curated, Video Support" />
                    </div>
                    <button type="submit" className={`w-full ${editingLink ? 'bg-white text-black' : 'bg-primary text-black'} font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/10`}>
                      {editingLink ? <Save size={18} /> : <Plus size={18} />}
                      {editingLink ? 'Apply Changes' : 'Deploy Resource'}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center">
                    <div className="w-8 h-[1px] bg-surfaceLight mr-3"></div>
                    Curated Assets ({linkResources.length})
                  </h4>
                  <div className="grid gap-3">
                    {linkResources.map(link => (
                      <div key={link.id} className={`bg-surface border ${editingLink === link.id ? 'border-primary shadow-lg shadow-primary/5' : 'border-surfaceLight'} p-4 rounded-2xl flex justify-between items-center group transition-all hover:bg-surfaceLight/30`}>
                        <div>
                          <p className="text-sm font-bold text-white">{link.title}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase">{link.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditLink(link)} className="text-textMuted hover:text-primary transition-colors p-2 rounded-lg hover:bg-bgDark">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteLinkResource(link.id)} className="text-textMuted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-bgDark">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* EMAIL BLAST TAB */}
        {activeTab === 'email' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-display font-bold text-white">Email Blast</h2>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Direct Gmail | No 3rd Party
                  </span>
                </div>
                <p className="text-textMuted">Compose and send directly from <span className="text-primary font-semibold">{CLUB_EMAIL}</span></p>
              </div>
            </div>

            {/* How it works info box */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
              <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <CheckCircle size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">How it works</h4>
                <p className="text-xs text-textMuted leading-relaxed">
                  Click <strong>'Step 1 - Copy Formatted Email'</strong> to put the beautiful HTML on your clipboard. Then click <strong>'Step 2 - Open Gmail Draft'</strong>.
                  Your club Gmail will open pre-filled with recipients in BCC. Just <strong>Paste (Ctrl+V)</strong> into the body and hit Send.
                </p>
              </div>
            </div>

            {/* Sub-tab nav */}
            <div className="flex gap-2 border-b border-surfaceLight pb-0">
              {[
                { id: 'compose', icon: <Mail size={14} />, label: 'Compose & Send' },
                { id: 'participants', icon: <UserCheck size={14} />, label: `Participants (${participants.length})` },
                { id: 'members', icon: <Users size={14} />, label: `Club Members (${clubMembers.length})` },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setEmailSubTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${emailSubTab === t.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textMuted hover:text-white'
                    }`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ── COMPOSE & SEND ── */}
            {emailSubTab === 'compose' && (
              <div className="grid lg:grid-cols-5 gap-6 items-start">

                {/* Form */}
                <div className="lg:col-span-3 bg-surface border border-surfaceLight rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                  {/* Send Mode Toggle */}
                  <div className="mb-5">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-2">Send To</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'specific', label: '✉️ Specific Person' },
                        { id: 'participants', label: `📋 Event Participants` },
                        { id: 'members', label: `👥 Club Members` },
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSendMode(m.id as any)}
                          className={`px-2 py-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${sendMode === m.id
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-bgDark border-surfaceLight text-textMuted hover:border-primary/20'
                            }`}
                        >{m.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Event picker (participants mode) */}
                  {sendMode === 'participants' && (
                    <div className="mb-4 p-3 bg-bgDark border border-surfaceLight rounded-xl">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest block mb-2">Filter by Event (optional)</label>
                      <select
                        value={selectedEventId}
                        onChange={e => setSelectedEventId(e.target.value)}
                        className="w-full bg-surface border border-surfaceLight rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                      >
                        <option value="">All Events ({participants.length} registrants)</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({participants.filter(p => p.eventId === ev.id).length} registrants)
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-primary mt-2 font-medium">
                        📋 {bulkRecipients.length} recipient{bulkRecipients.length !== 1 ? 's' : ''} will receive this email
                      </p>
                    </div>
                  )}

                  {/* Members mode info */}
                  {sendMode === 'members' && (
                    <div className="mb-4 p-3 bg-bgDark border border-surfaceLight rounded-xl">
                      <p className="text-xs text-primary font-medium">👥 {clubMembers.length} club member{clubMembers.length !== 1 ? 's' : ''} will receive this email</p>
                    </div>
                  )}


                  {/* Email type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Email Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { t: 'Announcement', i: '📢' },
                        { t: 'Event Details', i: '📅' },
                        { t: 'Certificate', i: '🏆' },
                        { t: 'Feedback', i: '📝' },
                        { t: 'Newsletter', i: '📰' },
                        { t: 'Custom', i: '✉️' },
                      ].map(({ t, i }) => (
                        <button key={t} type="button"
                          onClick={() => setEmailForm({ ...emailForm, email_type: t })}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${emailForm.email_type === t
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-bgDark border-surfaceLight text-textMuted hover:border-primary/20'
                            }`}
                        >{i} {t}</button>
                      ))}
                    </div>
                  </div>

                  {/* Specific person fields */}
                  {sendMode === 'specific' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Recipient Name</label>
                        <input value={emailForm.to_name}
                          onChange={e => setEmailForm({ ...emailForm, to_name: e.target.value })}
                          className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                          placeholder="e.g. Aarya Shah" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Recipient Email *</label>
                        <input required type="email" value={emailForm.to_email}
                          onChange={e => setEmailForm({ ...emailForm, to_email: e.target.value })}
                          className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                          placeholder="aarya@example.com" />
                      </div>
                    </div>
                  )}

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Subject *</label>
                    <input value={emailForm.subject}
                      onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                      className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                      placeholder="e.g. Important update from Code Vimarsh" />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Message Body *</label>
                      <button
                        onClick={handleLoadSample}
                        className="text-[10px] font-bold text-primary hover:text-secondary uppercase tracking-widest mb-1 transition-colors flex items-center gap-1"
                      >
                        <Megaphone size={10} /> Load Professional Sample
                      </button>
                    </div>
                    <textarea rows={6} value={emailForm.admin_message}
                      onChange={e => setEmailForm({ ...emailForm, admin_message: e.target.value })}
                      className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all resize-none"
                      placeholder="Write your message here. Club signature is appended automatically." />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <button type="button"
                      onClick={() => sendMode === 'specific'
                        ? handleCopyRichHtml(emailForm.to_name || 'there')
                        : handleCopyRichHtml('Member')}
                      disabled={!emailForm.subject || !emailForm.admin_message}
                      className="w-full flex items-center justify-center gap-2 bg-surface border border-primary/30 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {htmlCopied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} className="text-primary" />}
                      <span>{htmlCopied ? 'Copied! Paste in Gmail compose' : 'Step 1 - Copy Formatted Email'}</span>
                    </button>
                    <button type="button"
                      onClick={() => sendMode === 'specific' ? handleSendSpecific() : handleOpenBulkDrafts()}
                      disabled={!emailForm.subject || (sendMode === 'specific' ? !emailForm.to_email : bulkRecipients.length === 0)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-xl transition-all text-sm shadow-[0_0_18px_rgba(255,106,0,0.2)]"
                    >
                      <ExternalLink size={14} />
                      <span>Step 2 - Open Gmail Draft</span>
                    </button>
                    <p className="text-[10px] text-textMuted text-center">Copy email &rarr; Open Gmail draft &rarr; Paste (Ctrl+V) &rarr; Send</p>
                  </div>
                </div>

                {/* Right side: preview + log */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Live preview */}
                  <div className="bg-surface border border-surfaceLight rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-textMuted uppercase tracking-widest">
                        <Mail size={12} />EMAIL PREVIEW
                      </div>
                      <span className="text-[9px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>
                    {emailForm.subject && emailForm.admin_message ? (
                      <iframe
                        srcDoc={buildHtmlEmail(emailForm.to_name || 'there', emailForm.admin_message, emailForm.email_type, emailForm.subject)}
                        className="w-full rounded-xl border border-surfaceLight"
                        style={{ height: '320px' }}
                        sandbox="allow-same-origin"
                        title="Email Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-textMuted gap-2">
                        <Mail size={24} className="opacity-30" />
                        <p className="text-xs">Fill in subject and message to see a live preview</p>
                      </div>
                    )}
                  </div>

                  {/* Session log */}
                  <div className="bg-surface border border-surfaceLight rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <h4 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Send size={12} />SESSION LOG ({emailLog.length})
                    </h4>
                    {emailLog.length === 0 ? (
                      <p className="text-xs text-textMuted italic">No emails sent yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {emailLog.map((log, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-bgDark border border-surfaceLight">
                            <CheckCircle size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{log.label}</p>
                              <p className="text-[10px] text-textMuted">{log.count} recipient{log.count !== 1 ? 's' : ''} | {log.batches} draft{log.batches !== 1 ? 's' : ''} opened</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase">{log.type}</span>
                                <span className="text-[9px] text-textMuted font-mono">{log.sentAt}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                </div>
              </div>
            )}

            {/* ── MANAGE PARTICIPANTS ── */}
            {emailSubTab === 'participants' && (
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                {/* Add form */}
                <div className="lg:col-span-2 bg-surface border border-surfaceLight rounded-2xl p-6 relative overflow-hidden h-fit">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <h3 className="font-bold text-base flex items-center gap-2 mb-5">
                    <UserPlus size={16} className="text-primary" /> Add Participant
                  </h3>
                  <form onSubmit={handleAddParticipant} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Name *</label>
                      <input required value={newParticipant.name}
                        onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                        placeholder="Participant name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Email *</label>
                      <input required type="email" value={newParticipant.email}
                        onChange={e => setNewParticipant({ ...newParticipant, email: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                        placeholder="email@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Event *</label>
                      <select required value={newParticipant.eventId}
                        onChange={e => setNewParticipant({ ...newParticipant, eventId: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none">
                        <option value="">Select event...</option>
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-black font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                      <Plus size={14} /> Add Participant
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-3 space-y-3">
                  <h4 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                    <div className="w-8 h-px bg-surfaceLight" /> All Registrants ({participants.length})
                  </h4>
                  {participants.length === 0 ? (
                    <p className="text-sm text-textMuted italic bg-surface border border-surfaceLight rounded-xl p-4">No participants yet. Add some above.</p>
                  ) : (
                    <div className="space-y-2">
                      {participants.map(p => (
                        <div key={p.id} className="bg-surface border border-surfaceLight p-3 rounded-xl flex items-center justify-between group hover:bg-surfaceLight/30 transition-all">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{p.name}</p>
                            <p className="text-[11px] text-textMuted truncate">{p.email}</p>
                            <span className="text-[9px] px-1.5 py-0.5 mt-1 inline-block rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase">{p.eventTitle}</span>
                          </div>
                          <button onClick={() => removeParticipant(p.id)} className="text-textMuted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-bgDark flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── MANAGE MEMBERS ── */}
            {emailSubTab === 'members' && (
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                {/* Add form */}
                <div className="lg:col-span-2 bg-surface border border-surfaceLight rounded-2xl p-6 relative overflow-hidden h-fit">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <h3 className="font-bold text-base flex items-center gap-2 mb-5">
                    <UserPlus size={16} className="text-primary" /> Add Club Member
                  </h3>
                  <form onSubmit={handleAddMember} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Name *</label>
                      <input required value={newMember.name}
                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                        placeholder="Member name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Email *</label>
                      <input required type="email" value={newMember.email}
                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                        placeholder="email@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Role</label>
                      <select value={newMember.role}
                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                        className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none">
                        <option>Member</option>
                        <option>Core Team</option>
                        <option>Alumni</option>
                        <option>Mentor</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-black font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                      <Plus size={14} /> Add Member
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-3 space-y-3">
                  <h4 className="text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                    <div className="w-8 h-px bg-surfaceLight" /> All Club Members ({clubMembers.length})
                  </h4>
                  {clubMembers.length === 0 ? (
                    <p className="text-sm text-textMuted italic bg-surface border border-surfaceLight rounded-xl p-4">No members yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {clubMembers.map(m => (
                        <div key={m.id} className="bg-surface border border-surfaceLight p-3 rounded-xl flex items-center justify-between group hover:bg-surfaceLight/30 transition-all">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{m.name}</p>
                            <p className="text-[11px] text-textMuted truncate">{m.email}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 mt-1 inline-block rounded font-bold uppercase border ${m.role === 'Core Team' ? 'bg-primary/10 text-primary border-primary/20' :
                              m.role === 'Alumni' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                m.role === 'Mentor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                  'bg-surfaceLight text-textMuted border-surfaceLight'
                              }`}>{m.role}</span>
                          </div>
                          <button onClick={() => removeClubMember(m.id)} className="text-textMuted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-bgDark flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <Certificates />
        )}

        {/* BLOGS TAB */}
        {activeTab === 'blogs' && (
          <div className="p-6">
            <ManageBlogs />
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="p-6">
            <ManageAchievements />
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;