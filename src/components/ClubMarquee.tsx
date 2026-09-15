import React from 'react';
import { getClubs } from '../services/clubs/clubService';

// Infinite scrolling strip of club names
export function ClubMarquee() {
  const clubs = getClubs();
  // Triple the list to ensure smooth infinite scrolling even on ultra-wide screens
  const items = [...clubs, ...clubs, ...clubs];

  return (
    <div className="relative py-8 overflow-hidden bg-white" aria-hidden="true">
      {/* Sleek Gradient Strip */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 py-5 shadow-2xl border-y border-primary-800 relative">
        {/* Soft glowing edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary-950 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary-950 to-transparent z-10"></div>
        
        <div className="marquee-track flex items-center w-max">
          {items.map((club, i) => (
            <span key={`${club.id}-${i}`} className="flex items-center shrink-0">
              <span className="mx-12 text-lg font-heading font-extrabold text-white/95 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                {club.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
