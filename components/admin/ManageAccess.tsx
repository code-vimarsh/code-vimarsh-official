import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { ShieldAlert, Users, Trash2, ShieldCheck, Mail, Calendar, Search, UserPlus } from 'lucide-react';

const ManageAccess: React.FC = () => {
    const { admins, addAdmin, deleteAdmin } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState('');
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Moderator' });

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

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Access <span className="text-secondary italic">Control</span></h2>
                    <p className="text-textMuted max-w-lg">Manage system administrators, moderators, and content managers. Provision new users or revoke access instantly.</p>
                </div>
                <div className="flex -space-x-3">
                    {admins.slice(0, 5).map((a, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-bgDark flex items-center justify-center text-xs font-bold text-primary shadow-xl">
                            {a.name.charAt(0)}
                        </div>
                    ))}
                    {admins.length > 5 && (
                        <div className="w-10 h-10 rounded-full bg-surface border-2 border-bgDark flex items-center justify-center text-xs font-bold text-textMuted">
                            +{admins.length - 5}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-4">
                    <div className="bg-surface border border-surfaceLight p-8 rounded-3xl relative overflow-hidden group shadow-2xl shadow-black/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors"></div>

                        <h3 className="font-bold text-xl mb-8 flex items-center text-white relative z-10">
                            <UserPlus size={22} className="mr-3 text-secondary" /> Grant Permissions
                        </h3>

                        <form onSubmit={handleAddAdmin} className="space-y-6 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Full Name</label>
                                <input required value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-5 py-3.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 focus:outline-none transition-all placeholder:opacity-50" placeholder="e.g. John Doe" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Institutional Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted opacity-50" size={16} />
                                    <input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3.5 text-sm focus:border-secondary focus:outline-none transition-all" placeholder="name@msubaroda.ac.in" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest pl-1">Access Level</label>
                                <div className="relative">
                                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted opacity-50" size={16} />
                                    <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-12 py-3.5 text-sm focus:border-secondary focus:outline-none text-white appearance-none cursor-pointer">
                                        <option>Moderator</option>
                                        <option>Content Admin</option>
                                        <option>Super Admin</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-textMuted italic px-1 mt-1">Super Admins have full control over the system.</p>
                            </div>

                            <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-secondary/20 hover:shadow-secondary/30 text-sm uppercase tracking-widest active:scale-95">
                                Provision System User
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-8 flex flex-col">
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter administrators by name or email..." className="w-full bg-surface border border-surfaceLight rounded-2xl px-12 py-3.5 text-sm focus:border-secondary focus:outline-none transition-all shadow-xl shadow-black/10" />
                    </div>

                    <div className="bg-surface border border-surfaceLight rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-bgDark/50 text-textMuted border-b border-surfaceLight">
                                        <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px]">User Profile</th>
                                        <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px]">Clearance Level</th>
                                        <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px]">Provisioned On</th>
                                        <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surfaceLight/30">
                                    {filteredAdmins.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-textMuted italic">
                                                No administrators found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : filteredAdmins.map(admin => (
                                        <tr key={admin.id} className="hover:bg-surfaceLight/10 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${admin.role === 'Super Admin' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                        admin.role === 'Content Admin' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                                                            'bg-surfaceLight border-surfaceLight text-textMuted'
                                                        }`}>
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white group-hover:text-secondary transition-colors">{admin.name}</p>
                                                        <p className="text-xs text-textMuted">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${admin.role === 'Super Admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    admin.role === 'Content Admin' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                        'bg-surfaceLight/50 text-textMuted border-surfaceLight'
                                                    }`}>
                                                    {admin.role === 'Super Admin' && <ShieldAlert size={10} />}
                                                    {admin.role === 'Content Admin' && <ShieldCheck size={10} />}
                                                    {admin.role === 'Moderator' && <Users size={10} />}
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-textMuted font-mono text-xs italic">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {admin.addedAt}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button onClick={() => deleteAdmin(admin.id)} className="p-2.5 bg-bgDark border border-surfaceLight text-textMuted hover:text-white hover:bg-red-500/80 hover:border-red-500/20 transition-all rounded-xl" title="Revoke Access">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] text-textMuted text-center font-bold uppercase tracking-widest">Showing {filteredAdmins.length} system administrators</p>
                </div>
            </div>
        </div>
    );
};

export default ManageAccess;
