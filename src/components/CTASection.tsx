import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Reveal } from './ui/Reveal';
import { Link } from 'react-router-dom';
import { useRegistrationState } from '../hooks/useAdminData';
import { isRegistrationCurrentlyOpen } from '../services/clubs/clubService';

export function CTASection() {
  const { state: regState } = useRegistrationState();
  const registrationOpen = isRegistrationCurrentlyOpen(regState);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-60 animate-float"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
          <div className="moving-border bg-primary-950 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Animated gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-950 to-primary-900 bg-[length:200%_200%] animate-gradient-x"></div>
            {/* Floating shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600 rounded-full blur-3xl opacity-25 -translate-x-1/2 translate-y-1/2 animate-float-delayed"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                Ready to Find <span className="text-accent-400">Your Club?</span>
              </h2>
              <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Explore your interests, meet like-minded students and become part of the SHKSC club community.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto px-8 shine">
                  <Link to="/clubs">Explore Clubs</Link>
                </Button>
                {registrationOpen ? (
                  <Button asChild size="lg" className="w-full sm:w-auto px-8 bg-white text-primary-950 hover:bg-gray-100 shine">
                    <Link to="/registration">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto px-8 bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400">
                    Registration Closed
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
