import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Terminal, Edit3, Save, X, UploadCloud, MapPin, Mail, Briefcase, ChevronRight } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';
import { Toast, useToast } from '../components/Projects';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { currentUser, setCurrentUser } = useGlobalState();
  const { toast, showToast, hideToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [socialLinks, setSocialLinks] = useState({
    github_url: '',
    linkedin_url: '',
    leetcode_url: ''
  });

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