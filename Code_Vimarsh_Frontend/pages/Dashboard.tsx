import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Terminal, Edit3, Save, X, MapPin, Mail, Briefcase, ChevronRight, Download, Loader2, Shield, LogOut } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';
import { Toast, useToast } from '../components/Projects';
import { supabase } from '../services/supabase';
import { downloadBoardingPass } from '../utils/downloadBoardingPass';

const Dashboard: React.FC = () => {
  const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, participants, events } = useGlobalState();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [dashboardQrUrl, setDashboardQrUrl] = useState<string>('');

  useEffect(() => {
    if (selectedTicket) {
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toDataURL(selectedTicket.id, {
          margin: 1,
          width: 300,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
          .then(url => setDashboardQrUrl(url))
          .catch(err => console.error(err));
      });
    } else {
      setDashboardQrUrl('');
    }
  }, [selectedTicket]);

  const [socialLinks, setSocialLinks] = useState({
    github_url: '',
    linkedin_url: '',
    leetcode_url: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (currentUser) {
      setSocialLinks({
        github_url: currentUser.github_url || '',
        linkedin_url: currentUser.linkedin_url || '',
        leetcode_url: currentUser.leetcode_url || ''
      });
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    try {
      if (!currentUser) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          github_url: socialLinks.github_url,
          linkedin_url: socialLinks.linkedin_url,
          leetcode_url: socialLinks.leetcode_url,
        })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentUser({
          ...currentUser,
          github_url: data.github_url,
          linkedin_url: data.linkedin_url,
          leetcode_url: data.leetcode_url,
        });
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    }
  };



  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-textMuted tracking-widest uppercase">Loading Core</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* --- Ultra Modern Hero Banner --- */}
      <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl mb-12">
        {/* Dynamic Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-primary/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[100%] bg-blue-600/10 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 min-h-[360px]">
          
          {/* Avatar System */}
          <div className="relative shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] p-1.5 bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl transform transition-transform duration-500">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-[1.6rem] object-cover bg-[#0a0a0a] transition-all duration-300"
                />
              ) : (
                <div 
                  className="w-full h-full rounded-[1.6rem] bg-gradient-to-br from-primary/20 via-[#ff6a00]/5 to-transparent border border-white/5 flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-primary tracking-wider select-none font-display">
                    {(() => {
                      const name = currentUser.name || '';
                      const parts = name.trim().split(/\s+/);
                      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
                    })()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Minimal Role Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                {currentUser.role === 'USER' ? 'Student Developer' : currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Identity Information */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-2 leading-none">
                {currentUser.name}
              </h1>
              <p className="text-lg md:text-xl text-white/60 font-light flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center md:justify-start">
                <span>PRN {currentUser.prn}</span>
                <span className="hidden md:inline text-white/20">•</span>
                <span>{currentUser.email}</span>
              </p>
            </div>

            {/* Quick Meta Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <Briefcase size={14} className="text-primary" />
                <span className="text-xs font-medium text-white/80">Code Vimarsh Member</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <MapPin size={14} className="text-blue-400" />
                <span className="text-xs font-medium text-white/80">MSU Baroda</span>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all cursor-pointer font-bold text-xs"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Developer Presence Grid --- */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Developer Presence</h2>
            <p className="text-sm text-white/50 mt-1">Manage your connected social platforms</p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-sm font-medium text-white hover:shadow-lg hover:shadow-white/5"
            >
              <Edit3 size={16} className="text-white/60 group-hover:text-white transition-colors" />
              <span>Edit Links</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-6 py-3 rounded-2xl bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 text-sm font-medium text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile} 
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-black border border-primary hover:bg-white hover:border-white transition-all duration-300 text-sm font-bold shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* GitHub Card */}
          <div className="group relative rounded-[2rem] p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-500 group-hover:bg-white/10"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Github size={28} className="text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">GitHub</h3>
            
            {isEditing ? (
              <div className="mt-6 relative">
                <input
                  type="url"
                  value={socialLinks.github_url}
                  onChange={(e) => setSocialLinks({...socialLinks, github_url: e.target.value})}
                  placeholder="https://github.com/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
                />
              </div>
            ) : (
              <div className="mt-6">
                {currentUser.github_url ? (
                  <a href={currentUser.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group/link">
                    <span className="truncate max-w-[200px]">{currentUser.github_url.replace('https://github.com/', '')}</span>
                    <ChevronRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <span className="text-sm text-white/20 italic">Not connected</span>
                )}
              </div>
            )}
          </div>

          {/* LinkedIn Card */}
          <div className="group relative rounded-[2rem] p-8 bg-[#0a0a0a] border border-white/5 hover:border-[#0a66c2]/30 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a66c2]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-500 group-hover:bg-[#0a66c2]/20"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-[#0a66c2]/10 border border-[#0a66c2]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Linkedin size={28} className="text-[#0a66c2]" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">LinkedIn</h3>
            
            {isEditing ? (
              <div className="mt-6 relative">
                <input
                  type="url"
                  value={socialLinks.linkedin_url}
                  onChange={(e) => setSocialLinks({...socialLinks, linkedin_url: e.target.value})}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0a66c2]/50 transition-colors placeholder:text-white/20"
                />
              </div>
            ) : (
              <div className="mt-6">
                {currentUser.linkedin_url ? (
                  <a href={currentUser.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#0a66c2] transition-colors group/link">
                    <span className="truncate max-w-[200px]">{currentUser.linkedin_url.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', '')}</span>
                    <ChevronRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <span className="text-sm text-white/20 italic">Not connected</span>
                )}
              </div>
            )}
          </div>

          {/* LeetCode Card */}
          <div className="group relative rounded-[2rem] p-8 bg-[#0a0a0a] border border-white/5 hover:border-[#ffa116]/30 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffa116]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-500 group-hover:bg-[#ffa116]/20"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-[#ffa116]/10 border border-[#ffa116]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Terminal size={28} className="text-[#ffa116]" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">LeetCode</h3>
            
            {isEditing ? (
              <div className="mt-6 relative">
                <input
                  type="url"
                  value={socialLinks.leetcode_url}
                  onChange={(e) => setSocialLinks({...socialLinks, leetcode_url: e.target.value})}
                  placeholder="https://leetcode.com/u/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffa116]/50 transition-colors placeholder:text-white/20"
                />
              </div>
            ) : (
              <div className="mt-6">
                {currentUser.leetcode_url ? (
                  <a href={currentUser.leetcode_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#ffa116] transition-colors group/link">
                    <span className="truncate max-w-[200px]">{currentUser.leetcode_url.replace('https://leetcode.com/u/', '')}</span>
                    <ChevronRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <span className="text-sm text-white/20 italic">Not connected</span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- Event Tickets Section --- */}
      <div className="mt-12">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">My Event Passes</h2>
          <p className="text-sm text-white/50 mt-1">Show your QR code passes at the venue check-in desk</p>
        </div>

        {(() => {
          const myTickets = participants.filter(p => p.email.toLowerCase() === currentUser?.email?.toLowerCase());
          if (myTickets.length === 0) {
            return (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-[2rem] bg-[#0a0a0a]/50">
                <p className="text-sm text-white/40 italic">You haven't registered for any events yet.</p>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className="group relative rounded-[2rem] p-6 bg-[#0a0a0a] border border-white/5 hover:border-primary/20 transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white leading-tight uppercase italic">{ticket.eventTitle}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        ticket.status === 'attended' 
                          ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                          : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                      }`}>
                        {ticket.status === 'attended' ? 'Attended' : 'Registered'}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 font-mono">ID: #{ticket.ticketCode || ticket.id?.split('_')[1]?.slice(0, 4) || ticket.id?.slice(0, 4)}</p>
                    <p className="text-xs text-white/60">Registered on {ticket.registeredAt}</p>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 text-xs font-bold text-white shrink-0 uppercase tracking-wider"
                  >
                    View Ticket Pass
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* TICKET POPUP MODAL */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            className="flex flex-col items-center gap-6 max-w-full my-8" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full max-w-sm px-2">
              <span className="text-textMuted text-xs font-bold uppercase tracking-widest">Entry Pass Portal</span>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                <X size={16} /> Close
              </button>
            </div>
            
            {(() => {
              const event = events?.find(e => e.title === selectedTicket?.eventTitle);
              const typeAcronym = (() => {
                const t = event?.type?.toLowerCase() || '';
                if (t.includes('hack')) return 'HCK';
                if (t.includes('meet')) return 'MTP';
                return 'WKS';
              })();

              return (
                <div className="container-cards-ticket select-none">
                  <div
                    id="dashboard-ticket-card"
                    className="card-ticket"
                  >
                    {/* Left QR Code Container */}
                    <div className="qr-left-container">
                      <div className="qr-code-wrapper-left">
                        {dashboardQrUrl ? (
                          <img src={dashboardQrUrl} alt="QR Code Ticket" className="qr-code-img-left" />
                        ) : (
                          <div className="w-[80px] h-[80px] flex items-center justify-center border border-dashed border-neutral-300 rounded-md animate-pulse">
                            <Loader2 className="animate-spin text-neutral-400" size={16} />
                          </div>
                        )}
                      </div>
                      <p className="qr-scan-text-left">SCAN TO CHECK-IN</p>
                    </div>

                    {/* Separator 1 */}
                    <div className="ticket-separator">
                      <span className="line"></span>
                    </div>

                    {/* Main content body */}
                    <div className="content-ticket">
                      <div className="content-data">
                        {/* Destination line (Organizer -> Event Type) */}
                        <div className="destination items-center">
                          <div className="dest start">
                            <p className="country">Organizer</p>
                            <p className="acronym">CV</p>
                            <p className="hour">Code Vimarsh</p>
                          </div>
                          <div className="flex items-center gap-1 flex-1 px-4 relative">
                            <div className="flex-1 border-b border-dashed border-neutral-300 relative flex items-center justify-end">
                              <div className="absolute right-0 w-1.5 h-1.5 border-t border-r border-neutral-400 transform rotate-45" style={{ marginRight: '-1px' }} />
                            </div>
                            <img
                              src="/CV LOGO.webp"
                              alt="CV Logo"
                              className="w-9 h-9 object-contain rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 border-b border-dashed border-neutral-300 relative flex items-center justify-end">
                              <div className="absolute right-0 w-1.5 h-1.5 border-t border-r border-neutral-400 transform rotate-45" style={{ marginRight: '-1px' }} />
                            </div>
                          </div>
                          <div className="dest end text-right">
                            <p className="country">Event Type</p>
                            <p className="acronym">{typeAcronym}</p>
                            <p className="hour">{event?.type || 'Workshop'}</p>
                          </div>
                        </div>

                        {/* Sub-divider */}
                        <div style={{ borderBottom: '2px solid #edf2f7', margin: '2px 0' }} />

                        {/* Info Grid */}
                        <div className="ticket-data-grid">
                          <div className="ticket-data-row">
                            <div className="ticket-data-item">
                              <p className="title">Passenger / Candidate</p>
                              <p className="subtitle">{selectedTicket.name}</p>
                            </div>
                            <div className="ticket-data-item" style={{ textAlign: 'right' }}>
                              <p className="title">Ticket ID</p>
                              <p className="subtitle">#{selectedTicket.ticketCode || selectedTicket.id?.split('_')[1]?.slice(0, 4) || selectedTicket.id?.slice(0, 4)}</p>
                            </div>
                          </div>

                          <div className="ticket-data-row">
                            <div className="ticket-data-item">
                              <p className="title">Date</p>
                              <p className="subtitle">{selectedTicket.registeredAt}</p>
                            </div>
                            <div className="ticket-data-item" style={{ textAlign: 'right' }}>
                              <p className="title">Venue</p>
                              <p className="subtitle" style={{ maxWidth: '140px' }}>{event?.location || 'MSU Baroda'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Separator 2 */}
                      <div className="ticket-separator">
                        <span className="line"></span>
                      </div>

                      {/* Right Brand Strip */}
                      <div className="brand-strip-container">
                        <div className="strip-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                          </svg>
                        </div>
                        <div className="strip-logo-wrapper">
                          <span className="strip-logo-text">CV</span>
                          <div className="strip-logo-underline"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={async () => {
                if (!dashboardQrUrl || !selectedTicket) return;
                const event = events?.find(e => e.title === selectedTicket.eventTitle);
                const t = event?.type?.toLowerCase() || '';
                const typeAcronym = t.includes('hack') ? 'HCK' : t.includes('meet') ? 'MTP' : 'WKS';
                try {
                  await downloadBoardingPass({
                    participantName: selectedTicket.name || '',
                    ticketCode: selectedTicket.ticketCode || selectedTicket.id?.split('_')[1]?.slice(0, 4) || selectedTicket.id?.slice(0, 4) || '',
                    registeredAt: selectedTicket.registeredAt || '',
                    venue: event?.location || 'MSU Baroda',
                    eventType: event?.type || 'Workshop',
                    typeAcronym,
                    qrCodeDataUrl: dashboardQrUrl,
                  });
                } catch (err) {
                  console.error('Failed to download ticket:', err);
                }
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-black bg-primary hover:bg-secondary hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <Download size={14} /> Download Pass Image
            </button>
          </div>
        </div>
      )}
 
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
};
 
export default Dashboard;