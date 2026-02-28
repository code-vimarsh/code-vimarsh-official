import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { Plus, Pencil, Trash2, BookOpen, Video, Link, Search, Filter, Save, X, Upload, ExternalLink, Globe, Youtube, GraduationCap } from 'lucide-react';

const ManageResources: React.FC = () => {
    const {
        videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
        linkResources, addLinkResource, updateLinkResource, deleteLinkResource
    } = useGlobalState();

    const [activeSubTab, setActiveSubTab] = useState<'videos' | 'links'>('videos');
    const [searchQuery, setSearchQuery] = useState('');

    // Video State
    const [newVideo, setNewVideo] = useState({ title: '', url: '', thumbnail: '', tags: '' });
    const [editingVideo, setEditingVideo] = useState<string | null>(null);

    // Link State
    const [newLink, setNewLink] = useState({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' });
    const [editingLink, setEditingLink] = useState<string | null>(null);

    const handleAddVideo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVideo.title || !newVideo.url) return;
        if (editingVideo) {
            updateVideoResource({ id: editingVideo, ...newVideo, tags: newVideo.tags.split(',').map(t => t.trim()) });
            setEditingVideo(null);
        } else {
            addVideoResource({ id: Date.now().toString(), ...newVideo, tags: newVideo.tags.split(',').map(t => t.trim()) });
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
            addLinkResource({ id: Date.now().toString(), ...newLink, tags: newLink.tags.split(',').map(t => t.trim()) });
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

    const filteredVideos = videoResources.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredLinks = linkResources.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Resource <span className="text-primary italic">Command Center</span></h2>
                    <p className="text-textMuted max-w-lg">Curate high-quality learning materials, documentation, and tutorials for the club repository.</p>
                </div>

                {/* Resource Type Switcher */}
                <div className="flex p-1.5 bg-surface border border-surfaceLight rounded-3xl shadow-xl shadow-black/20">
                    <button
                        onClick={() => setActiveSubTab('videos')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'videos' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-textMuted hover:text-white'}`}
                    >
                        <Video size={16} /> Multimedia
                    </button>
                    <button
                        onClick={() => setActiveSubTab('links')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'links' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-textMuted hover:text-white'}`}
                    >
                        <Globe size={16} /> Knowledge base
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Dynamic Form Area */}
                <div className="lg:col-span-4">
                    <div className="sticky top-10 bg-surface border border-surfaceLight p-8 rounded-3xl relative overflow-hidden group shadow-2xl shadow-black/30">
                        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full -mr-16 -mt-16 bg-primary transition-all`}></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="font-bold text-xl flex items-center text-white">
                                {activeSubTab === 'videos' ? <Video size={22} className="mr-3 text-primary" /> : <Link size={22} className="mr-3 text-primary" />}
                                {editingVideo || editingLink ? 'Edit Asset' : 'Deploy Asset'}
                            </h3>
                            {(editingVideo || editingLink) && (
                                <button onClick={() => { setEditingVideo(null); setEditingLink(null); setNewVideo({ title: '', url: '', thumbnail: '', tags: '' }); setNewLink({ title: '', url: '', category: '', tags: '', bestFor: '', contentType: '' }); }} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-red-400 flex items-center gap-1 transition-colors">
                                    <X size={12} /> Abandon
                                </button>
                            )}
                        </div>

                        {activeSubTab === 'videos' ? (
                            <form onSubmit={handleAddVideo} className="space-y-6 relative z-10">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] pl-1">Visual Label (Title)</label>
                                    <input required value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="Mastering Next.js in 2024" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] pl-1">Resource Blueprint (URL)</label>
                                    <div className="relative">
                                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 opacity-60" size={16} />
                                        <input required value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="https://youtube.com/watch?v=..." />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] pl-1">Thumbnail Cover</label>
                                    <input value={newVideo.thumbnail} onChange={e => setNewVideo({ ...newVideo, thumbnail: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="https://imgur.com/thumbnail.png" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] pl-1">Taxonomies (Tags)</label>
                                    <input value={newVideo.tags} onChange={e => setNewVideo({ ...newVideo, tags: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="React, Frontend, Advanced (separated by comma)" />
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-secondary text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 text-[11px] uppercase tracking-[0.2em] transform active:scale-95 group">
                                    {editingVideo ? 'Apply Delta Changes' : 'Propagate Resource'}
                                    <Save size={14} className="inline ml-2 group-hover:animate-bounce" />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddLink} className="space-y-5 relative z-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.1em] pl-1">Label</label>
                                    <input required value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="MDN Documentation" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.1em] pl-1">Destination URL</label>
                                    <input required value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="https://developer.mozilla.org" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.1em] pl-1">Broad Category</label>
                                    <input required value={newLink.category} onChange={e => setNewLink({ ...newLink, category: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="Frontend Dev / Roadmap" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.1em] pl-1">Best Utility For</label>
                                    <input value={newLink.bestFor} onChange={e => setNewLink({ ...newLink, bestFor: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="Complete JS mastery from scratch" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.1em] pl-1">Resource Format</label>
                                    <input value={newLink.contentType} onChange={e => setNewLink({ ...newLink, contentType: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="Curated Sheet / Video Hybrid" />
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-secondary text-black font-black py-3 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 text-[10px] uppercase tracking-[0.15em] transform active:scale-95 flex items-center justify-center gap-2">
                                    {editingLink ? <Save size={14} /> : <Plus size={14} />}
                                    {editingLink ? 'SYNC CHANGES' : 'DEPLOY ASSET'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* List & Search Area */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="flex gap-4 mb-8 bg-surface border border-surfaceLight p-4 rounded-3xl sticky top-10 z-20 backdrop-blur-xl bg-surface/80">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted opacity-50" size={18} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`Search ${activeSubTab === 'videos' ? 'multimedia' : 'knowledge'} repository...`} className="w-full bg-bgDark border border-surfaceLight rounded-2xl px-12 py-3 text-sm focus:border-primary focus:outline-none transition-all" />
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="grid gap-4 pr-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: '800px' }}>
                        {activeSubTab === 'videos' ? (
                            filteredVideos.length === 0 ? (
                                <div className="bg-surface border border-dashed border-surfaceLight p-20 rounded-3xl text-center flex flex-col items-center justify-center opacity-40">
                                    <Video size={48} className="mb-4" />
                                    <p className="font-bold text-lg">No multimedia found</p>
                                </div>
                            ) : filteredVideos.map(video => (
                                <div key={video.id} className={`bg-surface border ${editingVideo === video.id ? 'border-primary shadow-xl shadow-primary/10' : 'border-surfaceLight'} p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-5 group transition-all hover:bg-surfaceLight/10`}>
                                    <div className="w-full sm:w-40 h-24 rounded-2xl overflow-hidden border border-surfaceLight shrink-0 relative transition-all group-hover:border-primary/30">
                                        <img src={video.thumbnail || 'https://via.placeholder.com/300x200?text=Workshop'} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink size={20} className="text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors truncate">{video.title}</h4>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                            {video.tags?.map((tag, idx) => (
                                                <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-bgDark border border-surfaceLight text-textMuted font-black uppercase tracking-widest">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button onClick={() => startEditVideo(video)} className="p-3 bg-bgDark border border-surfaceLight text-textMuted hover:text-white hover:bg-surfaceLight transition-all rounded-2xl" title="Edit Metadata">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => deleteVideoResource(video.id)} className="p-3 bg-bgDark border border-red-500/20 text-textMuted hover:text-white hover:bg-red-500/80 transition-all rounded-2xl" title="Delete Resource">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredLinks.length === 0 ? (
                                <div className="bg-surface border border-dashed border-surfaceLight p-20 rounded-3xl text-center flex flex-col items-center justify-center opacity-40">
                                    <Globe size={48} className="mb-4" />
                                    <p className="font-bold text-lg">Knowledge base is empty</p>
                                </div>
                            ) : (
                                <div className="bg-surface border border-surfaceLight rounded-3xl overflow-hidden shadow-2xl">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-bgDark/50 text-textMuted border-b border-surfaceLight">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Knowledge Link</th>
                                                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Metadata</th>
                                                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surfaceLight/30">
                                            {filteredLinks.map(link => (
                                                <tr key={link.id} className="hover:bg-surfaceLight/10 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <p className="font-bold text-white group-hover:text-primary transition-colors">{link.title}</p>
                                                            <p className="text-[10px] text-textMuted mt-0.5 max-w-[200px] truncate">{link.url}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-black uppercase text-primary tracking-tighter flex items-center gap-1.5"><GraduationCap size={10} /> {link.category}</span>
                                                            <span className="text-[9px] text-textMuted italic max-w-[150px] truncate">{link.bestFor}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => startEditLink(link)} className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"> <Pencil size={14} /></button>
                                                            <button onClick={() => deleteLinkResource(link.id)} className="p-2 text-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"> <Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageResources;
