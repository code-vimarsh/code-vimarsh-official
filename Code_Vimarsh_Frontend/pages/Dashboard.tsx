import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Terminal, Edit3, Save, X, UploadCloud, MapPin, Mail, Briefcase, ChevronRight, Download, Loader2, Shield, LogOut } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';
import { Toast, useToast } from '../components/Projects';
import api from '../services/api';
import html2canvas from 'html2canvas';

const Dashboard: React.FC = () => {
  const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, participants } = useGlobalState();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [dashboardQrUrl, setDashboardQrUrl] = useState<string>('');

  useEffect(() => {
    if (selectedTicket) {
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toDataURL(selectedTicket.id, {
          margin: 1,
          width: 300,
          color: {
            dark: '#ffffff',
            light: '#00000000'
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
      const res = await api.put(`/users/${currentUser.id}`, socialLinks);
      if (res.data.success) {
        setCurrentUser(res.data.user);
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 200 * 1024) {
      showToast("Image size must be under 200KB", "error");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.patch('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setCurrentUser({ ...currentUser!, avatar: res.data.avatar });
        showToast("Profile picture updated!", "success");
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      showToast(error.response?.data?.message || "Failed to upload image", "error");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          <div className="relative group shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] p-1.5 bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/50">
              <img 
                src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.prn}`} 
                alt="Profile" 
                className={`w-full h-full rounded-[1.6rem] object-cover bg-[#0a0a0a] ${isUploadingAvatar ? 'opacity-40 blur-md' : ''} transition-all duration-300`}
              />
              
              <div 
                className="absolute inset-1.5 rounded-[1.6rem] bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingAvatar ? (
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UploadCloud className="text-white mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" size={28} />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Change Avatar</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/webp, image/jpeg, image/png" onChange={handleAvatarChange} />
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
                    <p className="text-xs text-white/40 font-mono">ID: #{ticket.id.split('_')[1] || ticket.id}</p>
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
            
            <div 
              id="dashboard-ticket-card"
              className="relative w-full max-w-sm rounded-[2rem] bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-white/10 p-8 shadow-2xl text-left overflow-hidden select-none"
            >
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary via-orange-500 to-primary" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="text-primary" size={16} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">CODE VIMARSH NEXUS</span>
                </div>
                <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  ENTRY PASS
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">EVENT TITLE</span>
                  <h3 className="text-xl font-display font-black text-white leading-tight tracking-tight uppercase italic truncate">
                    {selectedTicket.eventTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">CANDIDATE</span>
                    <p className="text-sm font-bold text-white truncate">{selectedTicket.name}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">TICKET ID</span>
                    <p className="text-xs font-mono text-primary font-bold truncate">#{selectedTicket.id.split('_')[1] || selectedTicket.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">DATE</span>
                    <p className="text-xs text-white/80 font-semibold">{selectedTicket.registeredAt}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-textMuted uppercase tracking-widest block mb-1">STATUS</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      selectedTicket.status === 'attended' 
                        ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                        : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    }`}>
                      {selectedTicket.status === 'attended' ? 'Attended' : 'Confirmed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative my-6 flex items-center justify-between">
                <div className="absolute left-0 -ml-10 w-4 h-8 bg-[#0a0a0a] rounded-r-full border-r border-y border-white/10" />
                <div className="w-full border-t border-dashed border-white/10 mx-2" />
                <div className="absolute right-0 -mr-10 w-4 h-8 bg-[#0a0a0a] rounded-l-full border-l border-y border-white/10" />
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                
                {dashboardQrUrl ? (
                  <div className="relative p-2 bg-white rounded-xl shadow-xl shadow-primary/5">
                    <img src={dashboardQrUrl} alt="QR Code Ticket" className="w-40 h-40 object-contain block" />
                  </div>
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center border border-dashed border-white/20 rounded-xl animate-pulse">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
                
                <p className="text-[9px] text-textMuted font-mono uppercase tracking-[0.15em] mt-4 text-center">
                  SCAN AT THE ENTRANCE FOR CHECK-IN
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                const el = document.getElementById('dashboard-ticket-card');
                if (!el) return;
                try {
                  const canvas = await html2canvas(el, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0a0a0a'
                  });
                  const link = document.createElement('a');
                  link.download = `CV_Ticket_${selectedTicket.name.replace(/\s+/g, '_')}.png`;
                  link.href = canvas.toDataURL('image/png');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (err) {
                  console.error('Failed to capture ticket:', err);
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