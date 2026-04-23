import React, { useState } from 'react';
import { MapPin, Clock, Check } from 'lucide-react';

export default function EventCard({ title, dateStr, timeStr, location, category }) {
  const [isGoing, setIsGoing] = useState(false);

  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100/80 shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.04)] transition-all duration-300 cursor-pointer flex gap-5 items-center">
      
      {/* Date Badge */}
      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl w-14 h-14 shrink-0 border border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{dateStr.split(' ')[0]}</span>
        <span className="text-lg font-bold text-gray-900 leading-none">{dateStr.split(' ')[1]}</span>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-ember-dark bg-wise-mint px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-gray-900 font-semibold text-lg leading-tight mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium whitespace-nowrap">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeStr}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
        </div>
      </div>

      {/* RSVP Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsGoing(!isGoing);
        }}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.04] active:scale-[0.97] ${
          isGoing
            ? 'bg-warm-gray-100 text-bark hover:bg-warm-gray-200'
            : 'bg-ember text-ember-dark hover:bg-ember-light shadow-ring'
        }`}
      >
        {isGoing && <Check className="w-4 h-4" />}
        {isGoing ? 'Going' : 'RSVP'}
      </button>
    </div>
  );
}
