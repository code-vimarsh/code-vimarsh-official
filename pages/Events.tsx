import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const Events: React.FC = () => {
  const { events } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Live' | 'Past'>('All');
  
  const filteredEvents = events.filter(e => activeTab === 'All' || e.type === activeTab);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-display font-bold">Club Events</h1>
        <p className="text-textMuted max-w-2xl">Workshops, hackathons, and tech talks to accelerate your learning.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-surfaceLight pb-4 overflow-x-auto">
        {['All', 'Upcoming', 'Live', 'Past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-primary text-black' 
                : 'text-textMuted hover:text-white hover:bg-surfaceLight'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Event */}
      {(activeTab === 'All' || activeTab === 'Upcoming') && events.find(e => e.type === 'Upcoming') ? (
        <div className="bg-surface border border-primary/30 rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-6 tracking-wide uppercase">
            Featured Event
          </div>
          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl font-bold mb-4">{events.find(e => e.type === 'Upcoming')?.title}</h2>
            <p className="text-textMuted mb-8">{events.find(e => e.type === 'Upcoming')?.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono mb-8">
              <div className="flex items-center text-textMain"><Calendar size={16} className="mr-2 text-primary"/> {events.find(e => e.type === 'Upcoming')?.date}</div>
              <div className="flex items-center text-textMain"><MapPin size={16} className="mr-2 text-primary"/> MSUB Campus</div>
            </div>
            <button className="bg-white text-black hover:bg-gray-200 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center">
              Register Now <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Event Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-surface border border-surfaceLight rounded-xl p-6 hover:-translate-y-1 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  event.type === 'Live' ? 'bg-red-500/20 text-red-500 animate-pulse' :
                  event.type === 'Upcoming' ? 'bg-accentBlue/20 text-accentBlue' :
                  'bg-surfaceLight text-textMuted'
                }`}>
                  {event.type}
                </span>
                <span className="text-xs text-textMuted font-mono">{event.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
              <p className="text-sm text-textMuted line-clamp-3 mb-4">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center text-textMuted py-10 border border-dashed border-surfaceLight rounded-xl">
          No events found for this category.
        </div>
      )}
    </div>
  );
};

export default Events;