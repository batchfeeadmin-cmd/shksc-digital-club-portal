import React from 'react';
import { Trophy } from 'lucide-react';
import { achievementsData } from '../data/mockData';
import { Button } from './ui/button';
import { Reveal } from './ui/Reveal';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Achievements() {
  return (
    <section id="achievements" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-surface-sec -z-10 skew-x-12 origin-top"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" />
              Celebrating Excellence
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950">
              Proud Moments
            </h2>
          </div>
          <Button asChild variant="link" className="text-primary-600 self-start md:self-end group">
            <Link to="/clubs">
              Explore Club Pages <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {achievementsData.map((achievement, i) => (
            <Reveal key={achievement.id} delay={i * 120} className="h-full">
              <div className="group shine bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                  {achievement.image ? (
                    <img 
                      src={achievement.image} 
                      alt={achievement.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-white/40" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {achievement.year}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-accent-600 mb-2 uppercase tracking-wider">{achievement.clubName}</p>
                  <h3 className="text-xl font-heading font-bold text-primary-950 mb-2 group-hover:text-primary-700 transition-colors">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{achievement.competition}</p>
                  <div>
                    <div className="inline-block px-3 py-1 bg-primary-50 text-primary-800 font-medium rounded-md text-sm border border-primary-100 group-hover:bg-primary-900 group-hover:text-white transition-colors duration-300">
                      {achievement.position}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
