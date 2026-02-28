import React from 'react';
import { Users, FolderHeart, BookOpen, Calendar, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalContext';

const DashboardOverview: React.FC = () => {
    const { events, projects, admins, videoResources, linkResources } = useGlobalState();
    const stats = {
        events: events.length,
        projects: projects.length,
        resources: videoResources.length + linkResources.length,
        admins: admins.length
    };

    const statCards: {
        label: string;
        val: number;
        icon: React.ElementType;
        iconColor: string;
        trend: string;
        color: string;
    }[] = [
            {
                label: 'Events Hosted',
                val: stats.events,
                icon: Calendar,
                iconColor: 'text-blue-400',
                trend: '+2 this month',
                color: 'from-blue-500/20 to-transparent'
            },
            {
                label: 'Projects Completed',
                val: stats.projects,
                icon: FolderHeart,
                iconColor: 'text-pink-400',
                trend: '+5 this month',
                color: 'from-pink-500/20 to-transparent'
            },
            {
                label: 'Library Resources',
                val: stats.resources,
                icon: BookOpen,
                iconColor: 'text-purple-400',
                trend: '12 new roadmaps',
                color: 'from-purple-500/20 to-transparent'
            },
            {
                label: 'Verified Admins',
                val: stats.admins,
                icon: ShieldCheck,
                iconColor: 'text-green-400',
                trend: 'System secure',
                color: 'from-green-500/20 to-transparent'
            }
        ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
                        System <span className="text-primary italic">Overview</span>
                    </h2>
                    <p className="text-textMuted max-w-md">
                        Real-time analytics and system health metrics for the Code Vimarsh ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-surfaceLight/30 border border-surfaceLight p-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-textMuted uppercase tracking-widest">System Operational</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative group bg-surface border border-surfaceLight p-6 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1`}
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div className="p-3 bg-bgDark rounded-xl border border-surfaceLight group-hover:border-primary/30 transition-colors">
                                <stat.icon className={stat.iconColor} size={20} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-textMuted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-4xl font-display font-black text-white">{stat.val}</p>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className={stat.iconColor} size={80} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for Quick Actions or Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface border border-surfaceLight rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity className="text-primary" size={22} />
                            Recent Activity
                        </h3>
                        <button className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
                            View All Logs
                        </button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { user: 'Admin Aryan', action: 'Published new project "Nexus V2"', time: '2 hours ago', icon: <TrendingUp className="text-blue-400" size={14} /> },
                            { user: 'Club Lead', action: 'Added 5 new event participants', time: '5 hours ago', icon: <Users className="text-green-400" size={14} /> },
                            { user: 'System', action: 'Backup successfully completed', time: '12 hours ago', icon: <ShieldCheck className="text-purple-400" size={14} /> }
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4 group/item">
                                <div className="w-10 h-10 rounded-xl bg-bgDark border border-surfaceLight flex items-center justify-center shrink-0 group-hover/item:border-primary/40 transition-colors">
                                    {activity.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">
                                        <span className="text-primary font-bold">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-textMuted mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Club Status</h3>
                        <p className="text-sm text-textMuted leading-relaxed">
                            Your community is growing! You have <span className="text-primary font-bold">12%</span> more engagement than last month.
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-textMuted">Project Growth</span>
                                <span className="text-primary">85%</span>
                            </div>
                            <div className="h-1.5 w-full bg-bgDark rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-textMuted">Resource Utility</span>
                                <span className="text-blue-400">62%</span>
                            </div>
                            <div className="h-1.5 w-full bg-bgDark rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 w-[62%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-white text-black font-black py-3 rounded-xl hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[0.2em]">
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
