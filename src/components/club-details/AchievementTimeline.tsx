import React from 'react';
import { Achievement } from '../../types';
import { Trophy } from 'lucide-react';

export function AchievementTimeline({ achievements }: { achievements: Achievement[] }) {
  if (!achievements || achievements.length === 0) {
    return <p className="text-gray-500 italic">No achievements recorded yet.</p>;
  }

  return (
    <div className="relative border-l-2 border-primary-100 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
      {achievements.map((achievement, index) => (
        <div key={achievement.id} className="relative">
          {/* Timeline Marker */}
          <div className="absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 bg-white border-4 border-primary-100 rounded-full flex items-center justify-center shadow-sm">
            <Trophy className="w-4 h-4 text-accent-500" />
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-shadow">
            <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden">
              <img 
                src={achievement.image} 
                alt={achievement.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary-900">
                {achievement.year}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-accent-50 text-accent-700 text-xs font-bold rounded-md mb-3 self-start">
                {achievement.position}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-500 font-medium">{achievement.competition}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
