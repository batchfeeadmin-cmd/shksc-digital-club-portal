import React from 'react';
import { clubsData } from '../data/mockData';
import { ClubCard } from './ClubCard';
import { Button } from './ui/button';
import { Reveal } from './ui/Reveal';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClubShowcase() {
  return (
    <section id="clubs" className="py-24 bg-surface-sec relative overflow-hidden">
      <div className="absolute -top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60 animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Student Communities
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-4">
            Explore Our Clubs
          </h2>
          <p className="text-lg text-gray-600">
            Find the community that matches your interests, talents, and ambitions.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clubsData.map((club, i) => (
            <Reveal key={club.id} delay={(i % 4) * 90} className="h-full">
              <ClubCard club={club} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center" delay={120}>
          <Button asChild variant="outline" size="lg" className="bg-white shine group">
            <Link to="/clubs">
              View All Clubs <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </Reveal>

      </div>
    </section>
  );
}
