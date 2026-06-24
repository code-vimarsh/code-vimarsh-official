import React, { useState, useRef } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { Plus, Trash2, Upload, X, Search, Filter, ExternalLink, Github, Code2, Layers, User } from 'lucide-react';

const ManageProjects: React.FC = () => {
    const { projects, addProject, deleteProject } = useGlobalState();

    // Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const [newProject, setNewProject] = useState({
        title: '', author: '', tech: '', github: '',
        description: '', category: 'Web' as any, image: ''
    });
    const [projectImgMode, setProjectImgMode] = useState<'url' | 'upload'>('url');
    const projectImgRef = useRef<HTMLInputElement>(null);

    const projectFileToDataUrl = (file: File): Promise<string> =>
        new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(file);
        });

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
        // TODO: Add toast notification
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Project <span className="text-primary">Management</span></h2>
                    <p className="text-textMuted max-w-lg">Manage and showcase community-built projects. You can approve submissions or add directly here.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                        {projects.length} Total Projects
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Creation Form */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-10 bg-surface border border-surfaceLight p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

                        <h3 className="font-bold text-xl mb-8 flex items-center text-white relative z-10">
                            <Plus size={22} className="mr-3 text-primary" />
                            Ship New Project
                        </h3>

                        <form onSubmit={handleAddProject} className="space-y-6 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Project Title</label>
                                <div className="relative">
                                    <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
                                    <input required value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all" placeholder="Nexus Platform V2" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Author / Team</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
                                    <input required value={newProject.author} onChange={e => setNewProject({ ...newProject, author: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3 text-sm focus:border-primary focus:outline-none transition-all" placeholder="The Avengers Team" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Category</label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
                                    <select value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value as any })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3 text-sm focus:border-primary focus:outline-none text-white appearance-none cursor-pointer">
                                        <option>Web</option>
                                        <option>Mobile</option>
                                        <option>AI / ML</option>
                                        <option>Systems</option>
                                        <option>Open Source</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Tech Stack</label>
                                <input required value={newProject.tech} onChange={e => setNewProject({ ...newProject, tech: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-5 py-3 text-sm focus:border-primary focus:outline-none" placeholder="React, Node, MongoDB, framer-motion" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Short Pitch / Description</label>
                                <textarea rows={3} required value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-5 py-3 text-sm focus:border-primary focus:outline-none resize-none" placeholder="A revolutionary platform for..." />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Media Cover</label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex p-1 bg-bgDark border border-surfaceLight rounded-full">
                                        <button type="button" onClick={() => setProjectImgMode('url')} className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${projectImgMode === 'url' ? 'bg-primary text-black' : 'text-textMuted hover:text-white'}`}>URL</button>
                                        <button type="button" onClick={() => setProjectImgMode('upload')} className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${projectImgMode === 'upload' ? 'bg-primary text-black' : 'text-textMuted hover:text-white'}`}><Upload size={10} /> UPLOAD</button>
                                    </div>

                                    {projectImgMode === 'url' ? (
                                        <input value={newProject.image} onChange={e => setNewProject({ ...newProject, image: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-5 py-3 text-sm focus:border-primary focus:outline-none" placeholder="https://imgur.com/..." />
                                    ) : (
                                        <button type="button" onClick={() => projectImgRef.current?.click()} className="group/btn w-full border-2 border-dashed border-surfaceLight hover:border-primary/50 rounded-xl py-6 text-xs text-textMuted hover:text-white transition-all flex flex-col items-center justify-center gap-2">
                                            <Upload size={24} className="mb-1 text-textMuted group-hover/btn:text-primary transition-colors" />
                                            <span className="font-bold">Choose a file from device</span>
                                            <span className="text-[10px] opacity-60">Max size 5 MB (PNG, JPG, WEBP)</span>
                                            <input ref={projectImgRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const dataUrl = await projectFileToDataUrl(file);
                                                    setNewProject(p => ({ ...p, image: dataUrl }));
                                                }
                                            }} />
                                        </button>
                                    )}

                                    {newProject.image && (
                                        <div className="relative group/preview mt-2 w-full h-32 rounded-2xl overflow-hidden border border-surfaceLight">
                                            <img src={newProject.image} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => setNewProject(p => ({ ...p, image: '' }))} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"><X size={16} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={!newProject.image || !newProject.title} className="w-full bg-primary hover:bg-secondary disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 text-sm uppercase tracking-widest transform active:scale-95">
                                Add Project to Hall of Fame
                            </button>
                        </form>
                    </div>
                </div>

                {/* Search and List */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-surface border border-surfaceLight p-4 rounded-3xl sticky top-10 z-20 backdrop-blur-xl bg-surface/80 shadow-2xl shadow-black/20">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects by title, author..." className="w-full bg-bgDark border border-surfaceLight rounded-2xl px-12 py-3 text-sm focus:border-primary focus:outline-none transition-all" />
                        </div>
                        <div className="flex items-center gap-2 px-4 bg-bgDark border border-surfaceLight rounded-2xl">
                            <Filter size={16} className="text-textMuted" />
                            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-transparent text-sm text-white font-bold focus:outline-none py-3 cursor-pointer">
                                <option value="All">All Categories</option>
                                <option value="Web">Web</option>
                                <option value="Mobile">Mobile</option>
                                <option value="AI / ML">AI / ML</option>
                                <option value="Systems">Systems</option>
                                <option value="Open Source">Open Source</option>
                            </select>
                        </div>
                    </div>

                    {/* Table-like List */}
                    <div className="space-y-4 pr-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: '800px' }}>
                        {filteredProjects.length === 0 ? (
                            <div className="bg-surface border border-dashed border-surfaceLight p-20 rounded-3xl flex flex-col items-center justify-center text-center opacity-60">
                                <Search size={48} className="text-textMuted mb-4" />
                                <h4 className="text-xl font-bold text-white mb-2">No projects found</h4>
                                <p className="text-sm text-textMuted">Try adjusting your search or category filter.</p>
                            </div>
                        ) : (
                            filteredProjects.map((proj, idx) => (
                                <div key={proj.id} className="bg-surface border border-surfaceLight hover:border-primary/40 p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 group hover:shadow-xl hover:shadow-black/40">
                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-48 h-28 rounded-2xl overflow-hidden border border-surfaceLight shrink-0 relative group-hover:border-primary/20 transition-colors">
                                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/80 text-[8px] font-black text-primary border border-primary/20 backdrop-blur-md uppercase tracking-widest">{proj.category}</div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors truncate">{proj.title}</h4>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-1">
                                            <span className="text-xs text-textMuted font-mono flex items-center gap-1.5"><User size={12} className="text-primary opacity-60" /> {proj.author}</span>
                                            <span className="text-xs text-textMuted font-mono bg-bgDark px-2 py-0.5 rounded-lg border border-surfaceLight flex items-center gap-1.5 truncate max-w-[200px]"><Code2 size={12} className="text-blue-400 opacity-60" /> {proj.tech.join(', ')}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {proj.links.github && (
                                            <a href={proj.links.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-bgDark border border-surfaceLight text-textMuted hover:text-white hover:bg-surfaceLight transition-all rounded-2xl" title="Github Repository">
                                                <Github size={18} />
                                            </a>
                                        )}
                                        <button onClick={() => deleteProject(proj.id)} className="p-3 bg-bgDark border border-red-500/20 text-textMuted hover:text-white hover:bg-red-500/80 transition-all rounded-2xl" title="Delete Project">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProjects;
