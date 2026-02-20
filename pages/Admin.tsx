import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { LayoutDashboard, Calendar, FolderHeart, ShieldAlert, Users, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const { events, addEvent, projects, addProject, admins, addAdmin } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'projects' | 'admins'>('overview');

  // New Event State
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Upcoming', description: '' });
  
  // New Project State
  const [newProject, setNewProject] = useState({ title: '', author: '', tech: '', github: '' });

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Moderator' });

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
    if (!newProject.title) return;
    addProject({
      id: Date.now().toString(),
      title: newProject.title,
      author: newProject.author,
      tech: newProject.tech.split(',').map(t => t.trim()),
      links: { github: newProject.github }
    });
    setNewProject({ title: '', author: '', tech: '', github: '' });
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
            { id: 'overview', icon: <LayoutDashboard size={18}/>, label: 'Overview' },
            { id: 'events', icon: <Calendar size={18}/>, label: 'Manage Events' },
            { id: 'projects', icon: <FolderHeart size={18}/>, label: 'Manage Projects' },
            { id: 'admins', icon: <ShieldAlert size={18}/>, label: 'Access Control' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
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
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Manage Events</h2>
                <p className="text-textMuted">Create and manage community events.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1 bg-surface border border-surfaceLight p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Plus size={18} className="mr-2 text-primary"/> Add Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Event Title</label>
                    <input required value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Next.js Workshop" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Date</label>
                    <input required value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 2024-11-20" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Status</label>
                    <select value={newEvent.type} onChange={e=>setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none text-white">
                      <option>Upcoming</option>
                      <option>Live</option>
                      <option>Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Description</label>
                    <textarea required value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} rows={3} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" placeholder="Event details..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-secondary text-black font-bold py-2 rounded-md transition-colors text-sm">Deploy Event</button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                {events.map(ev => (
                  <div key={ev.id} className="bg-surface border border-surfaceLight p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{ev.title}</h4>
                      <p className="text-xs text-textMuted font-mono">{ev.date} • {ev.type}</p>
                    </div>
                    <button className="text-textMuted hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
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
                <h3 className="font-bold text-lg mb-4 flex items-center"><Plus size={18} className="mr-2 text-primary"/> Add Project</h3>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Project Title</label>
                    <input required value={newProject.title} onChange={e=>setNewProject({...newProject, title: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Author/Team</label>
                    <input required value={newProject.author} onChange={e=>setNewProject({...newProject, author: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Tech Stack (comma separated)</label>
                    <input required value={newProject.tech} onChange={e=>setNewProject({...newProject, tech: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="React, Node, MongoDB" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">GitHub Link</label>
                    <input value={newProject.github} onChange={e=>setNewProject({...newProject, github: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="https://github.com/..." />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-secondary text-black font-bold py-2 rounded-md transition-colors text-sm">Add Project</button>
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
                    <button className="text-textMuted hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
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
                <h3 className="font-bold text-lg mb-4 flex items-center"><Users size={18} className="mr-2 text-primary"/> Grant Access</h3>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Name</label>
                    <input required value={newAdmin.name} onChange={e=>setNewAdmin({...newAdmin, name: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Email</label>
                    <input required type="email" value={newAdmin.email} onChange={e=>setNewAdmin({...newAdmin, email: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Role</label>
                    <select value={newAdmin.role} onChange={e=>setNewAdmin({...newAdmin, role: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none text-white">
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
                            <span className={`px-2 py-1 rounded text-xs border ${
                              admin.role === 'Super Admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              admin.role === 'Content Admin' ? 'bg-primary/10 text-primary border-primary/20' :
                              'bg-surfaceLight text-textMuted border-surfaceLight'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-textMuted font-mono text-xs">{admin.addedAt}</td>
                          <td className="px-4 py-3 text-right">
                             <button className="text-textMuted hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
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

      </main>
    </div>
  );
};

export default Admin;