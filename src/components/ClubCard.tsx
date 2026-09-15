import React from 'react';
import { Users, Trophy, ArrowRight } from 'lucide-react';
import { Club } from '../types';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface ClubCardProps {
  club: Club;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <div className="group shine bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {club.coverImage ? (
          <img 
            src={club.coverImage} 
            alt={club.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-primary-800 flex items-center justify-center">
            <span className="text-6xl font-heading font-bold text-white/40 select-none">{club.logo}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/10 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full">
            {club.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col relative">
        {/* Avatar/Logo */}
        <div className="absolute -top-10 right-6 w-16 h-16 bg-white rounded-xl shadow-md border border-gray-100 p-1 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg overflow-hidden">
          {club.logo.startsWith('/') ? (
            <img src={club.logo} alt={club.name} className="w-full h-full rounded-lg object-cover" />
          ) : (
            <div className="w-full h-full bg-primary-50 rounded-lg flex items-center justify-center text-primary-900 font-heading font-bold text-xl">
              {club.logo}
            </div>
          )}
        </div>

        <h3 className="text-xl font-heading font-bold text-primary-950 mb-2 mt-2 pr-16 group-hover:text-primary-700 transition-colors">{club.name}</h3>
        <p className="text-gray-600 text-sm mb-6 flex-1">{club.shortDescription || 'Club details coming soon.'}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
            <Users className="w-4 h-4 text-primary-500" />
            <span>{club.memberCount} Members</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
            <Trophy className="w-4 h-4 text-accent-500" />
            <span>{club.achievementCount} Awards</span>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full mt-4 group-hover:bg-primary-900 group-hover:text-white transition-colors">
          <Link to={`/clubs/${club.slug}`}>
            View Club <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
