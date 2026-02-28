import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { Plus, Pencil, Trash2, Users, UserPlus, Mail, Linkedin, Github, ImageIcon, X, Image as ImageIconLucide, Search, Filter, ShieldCheck, Palette, Code, Settings, Upload } from 'lucide-react';
import { TeamMember } from '../../types';

const ManageTeamMembers: React.FC = () => {
    const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useGlobalState();

    const [searchQuery, setSearchQuery] = useState('');
    const [editingTeamMember, setEditingTeamMember] = useState<string | null>(null);
    const [newTeamMember, setNewTeamMember] = useState({
        name: '', section: '' as TeamMember['section'] | '', role: '', image: '', email: '', linkedin: '', github: ''
    });

    const handleAddTeamMember = (e: React.FormEvent) => {
        e.preventDefault();
        const section = newTeamMember.section as TeamMember['section'];
        if (!newTeamMember.name || !newTeamMember.role || !section) return;

        const memberData: TeamMember = {
            id: editingTeamMember || Date.now().toString(),
            name: newTeamMember.name,
            role: newTeamMember.role,
            section,
            image: newTeamMember.image,
            email: newTeamMember.email,
            linkedin: newTeamMember.linkedin,
            github: newTeamMember.github,
        };

        if (editingTeamMember) {
            updateTeamMember(memberData);
            setEditingTeamMember(null);
        } else {
            addTeamMember(memberData);
        }
        setNewTeamMember({ name: '', section: '', role: '', image: '', email: '', linkedin: '', github: '' });
    };

    const startEditTeamMember = (member: TeamMember) => {
        setEditingTeamMember(member.id);
        setNewTeamMember({
            name: member.name,
            section: member.section,
            role: member.role,
            image: member.image,
            email: member.email,
            linkedin: member.linkedin || '',
            github: member.github || ''
        });
    };

    const SectionConfig: Record<TeamMember['section'], { icon: React.ReactNode, color: string, description: string }> = {
        'Team Leads': { icon: <ShieldCheck className="text-primary" size={20} />, color: 'primary', description: 'Core vision and strategic guidance.' },
        'Web Team': { icon: <Code className="text-blue-400" size={20} />, color: 'blue-400', description: 'Architects of the digital landscape.' },
        'Management': { icon: <Settings className="text-purple-400" size={20} />, color: 'purple-400', description: 'Operations and logistical masterminds.' },
        'Design Team': { icon: <Palette className="text-pink-400" size={20} />, color: 'pink-400', description: 'Visual storytellers and UI wizards.' }
    };

    const filteredTeam = team.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Team <span className="text-primary italic">Command</span></h2>
                    <p className="text-textMuted max-w-lg">Curate the brilliant minds behind Code Vimarsh. Changes are instantaneously synchronized with the public directory.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-surfaceLight px-5 py-2.5 rounded-2xl shadow-xl shadow-black/20">
                    <Users className="text-primary" size={20} />
                    <span className="text-sm font-black text-white uppercase tracking-widest">{team.length} Active Personnel</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Recruitment Form */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-10 bg-surface border border-surfaceLight p-8 rounded-3xl relative overflow-hidden group shadow-2xl shadow-black/40">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="font-bold text-xl flex items-center text-white">
                                {editingTeamMember ? <Pencil size={22} className="mr-3 text-primary animate-pulse" /> : <UserPlus size={22} className="mr-3 text-primary" />}
                                {editingTeamMember ? 'Sync Personnel Data' : 'Recruit Personnel'}
                            </h3>
                            {editingTeamMember && (
                                <button onClick={() => { setEditingTeamMember(null); setNewTeamMember({ name: '', section: '', role: '', image: '', email: '', linkedin: '', github: '' }); }} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-red-400 transition-colors flex items-center gap-1">
                                    <X size={12} /> Cencel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleAddTeamMember} className="space-y-6 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Functional Division</label>
                                <select required value={newTeamMember.section} onChange={e => setNewTeamMember({ ...newTeamMember, section: e.target.value as any })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none text-white appearance-none cursor-pointer group-hover:border-primary/30">
                                    <option value="">Select Department...</option>
                                    <option value="Team Leads">🏆 Team Leads</option>
                                    <option value="Web Team">💻 Web Team</option>
                                    <option value="Management">⚙️ Management</option>
                                    <option value="Design Team">🎨 Design Team</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Organizational Designation (Role)</label>
                                <input required value={newTeamMember.role} onChange={e => setNewTeamMember({ ...newTeamMember, role: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all" placeholder="e.g. Lead System Architect" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Full Name</label>
                                    <input required value={newTeamMember.name} onChange={e => setNewTeamMember({ ...newTeamMember, name: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none" placeholder="Aryan Buha" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Institutional Email</label>
                                    <input required type="email" value={newTeamMember.email} onChange={e => setNewTeamMember({ ...newTeamMember, email: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none" placeholder="name@domain.com" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1">Visual Identity (Photo)</label>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex-1">
                                        <ImageIconLucide className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted opacity-40" size={16} />
                                        <input value={newTeamMember.image} onChange={e => setNewTeamMember({ ...newTeamMember, image: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3.5 text-sm focus:border-primary focus:outline-none transition-all placeholder:opacity-40" placeholder="/Path.jpg or Image URL" />
                                    </div>
                                    <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-surfaceLight/30 border border-surfaceLight rounded-xl cursor-pointer hover:border-primary/50 hover:bg-bgDark transition-all group/upload">
                                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => setNewTeamMember(prev => ({ ...prev, image: reader.result as string }));
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                        <Upload size={18} className="text-textMuted group-hover/upload:text-primary transition-colors" />
                                    </label>
                                </div>
                                {newTeamMember.image && (
                                    <div className="mt-3 relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/20 shadow-xl group/preview">
                                        <img src={newTeamMember.image} alt="preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity">
                                            <button type="button" onClick={() => setNewTeamMember(p => ({ ...p, image: '' }))} className="text-white hover:text-red-400 transition-colors"><X size={14} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1 flex items-center gap-1.5"><Linkedin size={10} className="text-blue-400" /> LinkedIn</label>
                                    <input value={newTeamMember.linkedin} onChange={e => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-xs focus:border-blue-400 focus:outline-none transition-all" placeholder="linkedin.com/in/..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-1 flex items-center gap-1.5"><Github size={10} className="text-white" /> GitHub</label>
                                    <input value={newTeamMember.github} onChange={e => setNewTeamMember({ ...newTeamMember, github: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-3 text-xs focus:border-white focus:outline-none transition-all" placeholder="github.com/..." />
                                </div>
                            </div>

                            <button type="submit" className={`w-full ${editingTeamMember ? 'bg-white text-black' : 'bg-primary text-black'} font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 text-[11px] uppercase tracking-[0.2em] transform active:scale-95`}>
                                {editingTeamMember ? 'Propagate Updates' : 'Induct into Core Team'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Directory Area */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                    <div className="flex gap-4 mb-8 bg-surface border border-surfaceLight p-4 rounded-3xl sticky top-10 z-20 backdrop-blur-xl bg-surface/80">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted opacity-50" size={18} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Locate personnel by name, role or division..." className="w-full bg-bgDark border border-surfaceLight rounded-2xl px-12 py-3 text-sm focus:border-primary focus:outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-10 pr-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: '800px' }}>
                        {(['Team Leads', 'Web Team', 'Management', 'Design Team'] as const).map(sec => {
                            const sectionMembers = filteredTeam.filter(m => m.section === sec);
                            if (sectionMembers.length === 0) return null;
                            const config = SectionConfig[sec];

                            return (
                                <div key={sec} className="animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="flex items-center gap-4 mb-6 border-l-4 border-primary pl-4">
                                        <div className="p-2 bg-surfaceLight/30 rounded-xl">
                                            {config.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-display font-black text-white uppercase tracking-widest">{sec}</h4>
                                            <p className="text-[10px] text-textMuted font-bold uppercase tracking-[0.15em] opacity-60">{config.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sectionMembers.map(member => (
                                            <div key={member.id} className="group bg-surface border border-surfaceLight hover:border-primary/40 p-5 rounded-3xl flex items-center justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] -mr-12 -mt-12 transition-all group-hover:bg-primary/10"></div>

                                                <div className="flex items-center space-x-4 relative z-10">
                                                    <div className="relative w-14 h-14 shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors"></div>
                                                        <img src={member.image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full rounded-full object-cover p-0.5 border-2 border-transparent" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white text-base group-hover:text-primary transition-colors truncate">{member.name}</p>
                                                        <p className="text-xs font-bold text-textMuted uppercase tracking-widest mt-0.5">{member.role}</p>

                                                        <div className="flex items-center gap-3 mt-3 opacity-60 group-hover:opacity-100 transition-all">
                                                            {member.email && <a href={`mailto:${member.email}`} className="text-textMuted hover:text-white transition-colors" title={member.email}><Mail size={12} /></a>}
                                                            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-blue-400 transition-colors"><Linkedin size={12} /></a>}
                                                            {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-white transition-colors"><Github size={12} /></a>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0 relative z-10">
                                                    <button onClick={() => startEditTeamMember(member)} className="p-2.5 bg-bgDark border border-surfaceLight text-textMuted hover:text-primary hover:bg-surfaceLight transition-all rounded-xl" title="Modify Clearance">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => deleteTeamMember(member.id)} className="p-2.5 bg-bgDark border border-surfaceLight text-textMuted hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl" title="Revoke Induction">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTeamMembers;
