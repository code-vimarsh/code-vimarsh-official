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
        iconColor: string;
        color: string;
    }[] = [
            {
                label: 'Events Hosted',
                val: stats.events,
                icon: Calendar,
                iconColor: 'text-blue-400',
                color: 'from-blue-500/20 to-transparent'
            },
            {
                label: 'Projects Completed',
                val: stats.projects,
                icon: FolderHeart,
                iconColor: 'text-pink-400',
                color: 'from-pink-500/20 to-transparent'
            },
            {
                label: 'Library Resources',
                val: stats.resources,
                icon: BookOpen,
                iconColor: 'text-purple-400',
                color: 'from-purple-500/20 to-transparent'
            },
            {
                label: 'Verified Admins',
                val: stats.admins,
                icon: ShieldCheck,
                iconColor: 'text-green-400',
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

            {/* End Stats Grid */}
        </div>
    );
};

export default DashboardOverview;
