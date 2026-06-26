import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import {
  LayoutDashboard, Calendar, FolderHeart, ShieldAlert, Users,
  ArrowLeft, BookOpen, Award, Newspaper, Trophy, Megaphone, Mail,
  Settings, LogOut, ChevronRight, Activity, Bell, Search, User, GraduationCap, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

// New Refactored Components
import Certificates from './Certificates';
import ManageEvents from '../components/admin/ManageEvents';
import ManageBlogs from '../components/admin/blogs/ManageBlogs';
import ManageAchievements from '../components/admin/achievements/ManageAchievements';
import DashboardOverview from '../components/admin/DashboardOverview';
import ManageProjects from '../components/admin/ManageProjects';
import ManageAccess from '../components/admin/ManageAccess';
import ManageResources from '../components/admin/ManageResources';
import EmailBlast from '../components/admin/EmailBlast';
import ManageAlumni from '../components/admin/ManageAlumni';
import ManageTeamMembers from '../components/admin/ManageTeamMembers';
import ManageContact from '../components/admin/ManageContact';

const Admin: React.FC = () => {
  // Component is now fully modular; state is managed within sub-components via useGlobalState()
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'projects' | 'admins' | 'resources' | 'email' | 'certificates' | 'blogs' | 'achievements' | 'alumni' | 'team' | 'contact'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { currentUser } = useGlobalState();

  const menuItems = [
    { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview', desc: 'System dashboard' },
    { id: 'events', icon: <Calendar size={18} />, label: 'Manage Events', desc: 'Host & list events' },
    { id: 'projects', icon: <FolderHeart size={18} />, label: 'Manage Projects', desc: 'Curate showcase' },
    { id: 'resources', icon: <BookOpen size={18} />, label: 'Manage Resources', desc: 'Library & repos' },
    ...(currentUser?.role === 'SUPER_ADMIN' 
      ? [{ id: 'admins', icon: <ShieldAlert size={18} />, label: 'Access Control', desc: 'Permission mgmt' }] 
      : []),
    { id: 'alumni', icon: <GraduationCap size={18} />, label: 'Manage Alumni', desc: 'Alumni network' },
    { id: 'team', icon: <Users size={18} />, label: 'Manage Team', desc: 'Induct personnel' },
    { id: 'blogs', icon: <Newspaper size={18} />, label: 'Manage Blogs', desc: 'Editorial content' },
    { id: 'achievements', icon: <Trophy size={18} />, label: 'Achievements', desc: 'Club accolades' },
    { id: 'email', icon: <Megaphone size={18} />, label: 'Email Blast', desc: 'Mass comms' },
    { id: 'certificates', icon: <Award size={18} />, label: 'Certificates', desc: 'Issue docs' },
    { id: 'contact', icon: <Mail size={18} />, label: 'Contact Messages', desc: 'User inquiries' },
  ];

  return (
    <div className="min-h-screen bg-bgDark flex font-sans selection:bg-primary/30 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-80 lg:relative lg:translate-x-0 bg-surface border-r border-surfaceLight flex flex-col transition-transform duration-300 ease-in-out shadow-2xl shadow-black/40`}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-surfaceLight/50 flex flex-col gap-6">
          <Link to="/" className="group flex items-center space-x-3 text-textMuted hover:text-white transition-all w-fit">
            <div className="p-2 bg-bgDark rounded-xl border border-surfaceLight group-hover:border-primary/50 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Return to Nexus</span>
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
                <Settings className="text-primary animate-spin-slow" size={24} />
              </div>
              <button 
                className="lg:hidden p-2 bg-surfaceLight/20 hover:bg-surfaceLight/40 rounded-xl text-textMuted hover:text-white transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div>
              <h1 className="font-display font-black text-2xl text-white tracking-tighter">Control <span className="text-primary italic">Panel</span></h1>
              <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-0.5 opacity-60">Auth Engine v4.0.12</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsSidebarOpen(false);
              }}
              className={`group w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                : 'text-textMuted hover:bg-surfaceLight/40 hover:text-white'
                }`}
            >
              <div className={`shrink-0 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                {tab.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="leading-none">{tab.label}</p>
                <p className={`text-[9px] mt-1 uppercase tracking-widest leading-none ${activeTab === tab.id ? 'text-primary/70 opacity-100' : 'text-textMuted opacity-0 group-hover:opacity-60 transition-opacity'}`}>
                  {tab.desc}
                </p>
              </div>
              {activeTab === tab.id && <div className="absolute right-4"><ChevronRight size={14} className="opacity-40" /></div>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-surfaceLight/50">
          <div className="bg-bgDark/40 border border-surfaceLight p-5 rounded-3xl flex items-center gap-4 group/user hover:border-primary/20 transition-all cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-black font-black text-xl shadow-xl">
                A
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate leading-none">Admin Authority</p>
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-1 opacity-60">Super Access</p>
            </div>
            <button className="text-textMuted hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/10">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bgDark relative">
        {/* Top Navigation Bar removed per request (Admin only) */}

        {/* Dynamic Viewport */}
        <div className="flex-1 p-4 sm:p-8 lg:p-14 overflow-y-auto custom-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && <DashboardOverview />}

            {/* EVENTS TAB */}
            {activeTab === 'events' && <ManageEvents />}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && <ManageProjects />}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && <ManageResources />}

            {/* ACCESS CONTROL */}
            {activeTab === 'admins' && <ManageAccess />}

            {/* ALUMNI */}
            {activeTab === 'alumni' && <ManageAlumni />}

            {/* TEAM MEMBERS */}
            {activeTab === 'team' && <ManageTeamMembers />}

            {/* BLOGS */}
            {activeTab === 'blogs' && <ManageBlogs />}

            {/* ACHIEVEMENTS */}
            {activeTab === 'achievements' && <ManageAchievements />}

            {/* EMAIL BLAST */}
            {activeTab === 'email' && <EmailBlast />}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && <Certificates />}

            {/* CONTACT MESSAGES */}
            {activeTab === 'contact' && <ManageContact />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
