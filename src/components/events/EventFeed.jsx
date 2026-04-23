import React, { useState } from 'react';
import EventCard from './EventCard';

const CATEGORIES = ['All', 'Academic', 'Greek Life', 'Outing Club', 'Collis After Dark', 'Free Food'];

const DEMO_EVENTS = [
  { id: 1, title: 'Thayer Tech Mixer & Networking', dateStr: 'OCT 14', timeStr: '6:00 PM - 8:00 PM', location: 'MacLean Engineering Center', category: 'Academic' },
  { id: 2, title: 'DOC Sunrise Hike to Gile', dateStr: 'OCT 15', timeStr: '5:30 AM - 8:00 AM', location: 'Collis Porch (Meetup)', category: 'Outing Club' },
  { id: 3, title: 'Midnight Breakfast', dateStr: 'OCT 15', timeStr: '11:30 PM - 1:00 AM', location: "'53 Commons", category: 'Free Food' },
  { id: 4, title: 'Green Key Planning Meeting', dateStr: 'OCT 16', timeStr: '4:00 PM - 5:00 PM', location: 'Collis Center 101', category: 'Collis After Dark' },
];

export default function EventFeed() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = activeCategory === 'All' 
    ? DEMO_EVENTS 
    : DEMO_EVENTS.filter(e => e.category === activeCategory);

  return (
    <div className="max-w-2xl text-gray-900 pb-20">
      
      {/* Page Title */}
      <h1 className="font-serif text-3xl text-bark mb-6">Dartmouth Events</h1>
      
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-[1.04] active:scale-[0.97] ${
              activeCategory === cat
                ? 'bg-ember text-ember-dark shadow-ring'
                : 'bg-white text-warm-gray-600 border border-warm-gray-200 hover:bg-wise-mint hover:text-ember-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} {...event} />
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 bg-white/40 rounded-2xl border border-gray-100">
            No events found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
