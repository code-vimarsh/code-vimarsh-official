import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { LayoutDashboard, Calendar, FolderHeart, ShieldAlert, Users, Plus, Trash2, ArrowLeft, BookOpen, Pencil, Upload, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const {
    events, addEvent,
    projects, addProject,
    admins, addAdmin,
    videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
    linkResources, addLinkResource, updateLinkResource, deleteLinkResource
  } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'projects' | 'admins' | 'resources'>('overview');

  // New Event State
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Upcoming', description: '' });

  // New Project State
  const [newProject, setNewProject] = useState({ title: '', author: '', tech: '', github: '' });

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Moderator' });

  // New Resource State
  const [newVideo, setNewVideo] = useState({ title: '', url: '', thumbnail: '', tags: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' });

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
            { id: 'admins', icon: <ShieldAlert size={18} />, label: 'Access Control' }
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
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Manage Events</h2>
                <p className="text-textMuted">Create and manage community events.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1 bg-surface border border-surfaceLight p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Plus size={18} className="mr-2 text-primary" /> Add Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Event Title</label>
                    <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Next.js Workshop" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Date</label>
                    <input required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 2024-11-20" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Status</label>
                    <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none text-white">
                      <option>Upcoming</option>
                      <option>Live</option>
                      <option>Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">Description</label>
                    <textarea required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} rows={3} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" placeholder="Event details..."></textarea>
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
                    <button className="text-textMuted hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
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
                    <label className="text-xs text-textMuted mb-1 block">Tech Stack (comma separated)</label>
                    <input required value={newProject.tech} onChange={e => setNewProject({ ...newProject, tech: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="React, Node, MongoDB" />
                  </div>
                  <div>
                    <label className="text-xs text-textMuted mb-1 block">GitHub Link</label>
                    <input value={newProject.github} onChange={e => setNewProject({ ...newProject, github: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="https://github.com/..." />
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

      </main>
    </div>
  );
};

export default Admin;