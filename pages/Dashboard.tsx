import React from 'react';
import { Flame, Star, Award, Activity, Code } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="bg-surface border border-surfaceLight rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="relative">
          <img src="https://picsum.photos/200/200?random=99" alt="User" className="w-24 h-24 rounded-full border-2 border-primary" />
          <div className="absolute -bottom-2 -right-2 bg-bgDark border border-primary text-primary text-xs font-bold px-2 py-1 rounded-md">
            Lvl 12
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-display font-bold">Alex Developer</h1>
          <p className="text-textMuted mb-4 font-mono text-sm">@alex_dev • Joined Fall 2023</p>
          
          {/* XP Bar */}
          <div className="max-w-md w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-primary font-bold">2,450 XP</span>
              <span className="text-textMuted">3,000 XP to Lvl 13</span>
            </div>
            <div className="h-2 bg-bgDark rounded-full overflow-hidden border border-surfaceLight">
              <div className="h-full bg-gradient-to-r from-primary to-secondary w-[80%] rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 z-10">
          <div className="bg-bgDark border border-surfaceLight p-3 rounded-xl flex flex-col items-center justify-center min-w-[80px]">
            <Flame className="text-secondary mb-1" size={20} />
            <span className="font-bold">14</span>
            <span className="text-[10px] text-textMuted uppercase">Streak</span>
          </div>
          <div className="bg-bgDark border border-surfaceLight p-3 rounded-xl flex flex-col items-center justify-center min-w-[80px]">
            <Star className="text-yellow-500 mb-1" size={20} />
            <span className="font-bold">Top 5%</span>
            <span className="text-[10px] text-textMuted uppercase">Rank</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col: Badges & Trophies */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface border border-surfaceLight rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Award className="mr-2 text-primary" size={20} /> Trophy Case
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="aspect-square rounded-lg bg-bgDark border border-primary/20 flex items-center justify-center relative group cursor-help">
                  <Code size={24} className={i < 4 ? "text-primary" : "text-surfaceLight"} />
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-surfaceLight text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {i < 4 ? 'Hackathon Winner' : 'Locked Badge'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Activity Graph */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-surfaceLight rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Activity className="mr-2 text-primary" size={20} /> Contribution Activity
            </h2>
            {/* Mock GitHub style heatmap */}
            <div className="flex flex-col gap-2 overflow-x-auto pb-2">
              <div className="flex gap-1">
                {Array.from({ length: 20 }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                      // Randomize intensity
                      const intensity = Math.random();
                      let bg = 'bg-bgDark';
                      if (intensity > 0.8) bg = 'bg-primary';
                      else if (intensity > 0.6) bg = 'bg-primary/70';
                      else if (intensity > 0.4) bg = 'bg-primary/40';
                      else if (intensity > 0.2) bg = 'bg-primary/20';

                      return (
                        <div key={rowIndex} className={`w-3 h-3 rounded-sm ${bg} border border-surfaceLight/50`} />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center text-xs text-textMuted space-x-2 mt-2">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-bgDark border border-surfaceLight"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;