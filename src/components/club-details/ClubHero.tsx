import React from 'react';
import { Club } from '../../types';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Trophy } from 'lucide-react';

export function ClubHero({ club }: { club: Club }) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={club.coverImage} 
          alt={club.name} 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white rounded-3xl shadow-2xl p-2 border-4 border-white/10">
            <div className="w-full h-full bg-primary-50 rounded-2xl flex items-center justify-center text-primary-900 font-heading font-bold text-5xl">
              {club.logo}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-sm font-semibold mb-4">
              {club.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4 leading-tight">
              {club.name}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl">
              {club.shortDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white border-none">
                <Link to={`/registration?club=${club.id}`}>
                  Join Club <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-400" />
                  <span className="font-medium">{club.memberCount} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent-400" />
                  <span className="font-medium">{club.achievementCount} Awards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
