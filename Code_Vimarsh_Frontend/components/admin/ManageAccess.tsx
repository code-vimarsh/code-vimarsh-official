import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { ShieldAlert, Users, Trash2, ShieldCheck, Mail, Calendar, Search, UserPlus } from 'lucide-react';
import { Toast, useToast } from '../Projects';

const ManageAccess: React.FC = () => {
    const { admins, clubMembers, deleteAdmin, changeUserRole } = useGlobalState();
    const { toast, showToast, hideToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'USER'>('ALL');
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'User' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDisplayRole = (role: string) => {
        if (role === 'SUPER_ADMIN' || role === 'Super Admin') return 'Super Admin';
        if (role === 'CONTENT_ADMIN' || role === 'Content Admin') return 'Content Admin';
        if (role === 'USER' || role === 'Member') return 'User';
        return role;
    };

    const handleSelectUser = (user: any) => {
        setNewAdmin({
            name: user.name,
            email: user.email,
            role: user.role === 'SUPER_ADMIN' || user.role === 'Super Admin' ? 'Super Admin' :
                  user.role === 'CONTENT_ADMIN' || user.role === 'Content Admin' ? 'Content Admin' : 'User'
        });
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdmin.email) return;
        
        // Find user by email in clubMembers (all users)
        const targetUser = clubMembers.find(m => m.email.toLowerCase() === newAdmin.email.toLowerCase());
        if (!targetUser) {
            showToast("No user found with that email. They must sign up first!", "error");
            return;
        }

        const roleMap: Record<string, string> = {
            'User': 'USER',
            'Content Admin': 'CONTENT_ADMIN',
            'Super Admin': 'SUPER_ADMIN'
        };

        setIsSubmitting(true);
        try {
            await changeUserRole(targetUser.id, roleMap[newAdmin.role] as any);
            showToast("Permissions granted successfully!", "success");
            setNewAdmin({ name: '', email: '', role: 'User' });
        } catch (err: any) {
            console.error("Failed to upgrade user:", err);
            showToast("Failed to grant permissions: " + err.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevokeAdmin = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to revoke admin access for ${name}?`)) {
            try {
                await deleteAdmin(id);
                showToast(`Admin access revoked for ${name}`, "success");
            } catch (err: any) {
                showToast(`Failed to revoke access: ${err.message}`, "error");
            }
        }
    };

    const filteredMembers = clubMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              member.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (selectedRoleFilter === 'ALL') return matchesSearch;
        
        const mappedRole = member.role === 'SUPER_ADMIN' || member.role === 'Super Admin' ? 'SUPER_ADMIN' :
                           member.role === 'CONTENT_ADMIN' || member.role === 'Content Admin' ? 'CONTENT_ADMIN' : 'USER';
                           
        return matchesSearch && mappedRole === selectedRoleFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Access <span className="text-secondary italic">Control</span></h2>
                    <p className="text-textMuted max-w-lg">Manage system administrators, users, and content managers. Provision new users or revoke access instantly.</p>
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
                                        <option>User</option>
                                        <option>Content Admin</option>
                                        <option>Super Admin</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-textMuted italic px-1 mt-1">Super Admins have full control over the system.</p>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-secondary hover:bg-secondary/80 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-secondary/20 hover:shadow-secondary/30 text-sm uppercase tracking-widest active:scale-95 disabled:opacity-50">
                                {isSubmitting ? 'Provisioning...' : 'Provision System User'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-8 flex flex-col">
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter profiles by name or email..." className="w-full bg-surface border border-surfaceLight rounded-2xl px-12 py-3.5 text-sm focus:border-secondary focus:outline-none transition-all shadow-xl shadow-black/10" />
                    </div>

                    {/* Role Filter Toggles */}
                    <div className="flex flex-wrap gap-2 mb-6 font-display">
                        {(['ALL', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'USER'] as const).map((filter) => {
                            const labelMap = {
                                ALL: 'All',
                                SUPER_ADMIN: 'Super Admin',
                                CONTENT_ADMIN: 'Content Admin',
                                USER: 'User'
                            };
                            const isActive = selectedRoleFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setSelectedRoleFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                                        isActive
                                            ? 'bg-secondary text-black border-secondary shadow-lg shadow-secondary/20 font-black'
                                            : 'bg-surface/50 text-textMuted border-surfaceLight hover:text-white hover:border-textMuted/50'
                                    }`}
                                >
                                    {labelMap[filter]}
                                </button>
                            );
                        })}
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
                                    {filteredMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-textMuted italic">
                                                No users found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : filteredMembers.map(member => (
                                        <tr key={member.id} onClick={() => handleSelectUser(member)} className="hover:bg-surfaceLight/10 transition-colors group cursor-pointer">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${member.role === 'SUPER_ADMIN' || member.role === 'Super Admin' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                        member.role === 'CONTENT_ADMIN' || member.role === 'Content Admin' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                                                            'bg-surfaceLight border-surfaceLight text-textMuted'
                                                        }`}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white group-hover:text-secondary transition-colors">{member.name}</p>
                                                        <p className="text-xs text-textMuted">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${member.role === 'SUPER_ADMIN' || member.role === 'Super Admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    member.role === 'CONTENT_ADMIN' || member.role === 'Content Admin' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                        'bg-surfaceLight/50 text-textMuted border-surfaceLight'
                                                    }`}>
                                                    {(member.role === 'SUPER_ADMIN' || member.role === 'Super Admin') && <ShieldAlert size={10} />}
                                                    {(member.role === 'CONTENT_ADMIN' || member.role === 'Content Admin') && <ShieldCheck size={10} />}
                                                    {(member.role === 'USER' || member.role === 'Member') && <Users size={10} />}
                                                    {getDisplayRole(member.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-textMuted font-mono text-xs italic">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {member.joinedAt}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {member.role !== 'USER' && member.role !== 'Member' && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleRevokeAdmin(member.id, member.name); }} className="p-2.5 bg-bgDark border border-surfaceLight text-textMuted hover:text-white hover:bg-red-500/80 hover:border-red-500/20 transition-all rounded-xl" title="Revoke Access">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] text-textMuted text-center font-bold uppercase tracking-widest">Showing {filteredMembers.length} registered profiles</p>
                </div>
            </div>
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
        </div>
    );
};

export default ManageAccess;
