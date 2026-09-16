import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useRegistrationState } from '../hooks/useAdminData';
import { Reveal } from './ui/Reveal';
import { getCMSData, CMSData } from '../services/cms/cmsService';

export function Hero() {
  const { state: regState } = useRegistrationState();
  const registrationOpen = regState.isOpen;
  const [cmsData, setCmsData] = useState<CMSData | null>(null);

  useEffect(() => {
    const fetchHeroData = () => {
      setCmsData(getCMSData());
    };
    
    fetchHeroData();
    window.addEventListener('shksc_state_update', fetchHeroData);
    return () => window.removeEventListener('shksc_state_update', fetchHeroData);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Animated aurora + grid background */}
      <div className="absolute inset-0 z-0 aurora-bg"></div>
      <div className="absolute inset-0 z-0 grid-overlay"></div>
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-primary-200/50 rounded-full blur-3xl z-0 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-accent-200/50 rounded-full blur-3xl z-0 animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {registrationOpen && (
              <div className="hero-word inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6" style={{ animationDelay: '60ms' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-700 tracking-wide uppercase">Registration Open</span>
              </div>
            )}
            
            <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-primary-950 leading-[1.1] mb-6">
              {cmsData?.hero.headline.split(' ').map((word, i) => (
                <span key={i} className="hero-word" style={{ animationDelay: `${i * 90 + 120}ms` }}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <p className="hero-word text-lg text-gray-600 mb-8 leading-relaxed max-w-xl" style={{ animationDelay: '540ms' }}>
              {cmsData?.hero.subHeadline}
            </p>
            
            <div className="hero-word flex flex-col sm:flex-row gap-4" style={{ animationDelay: '660ms' }}>
              {registrationOpen ? (
                <Button asChild size="lg" className="group shine">
                  <Link to="/registration">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Apply for Club Registration
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="group" disabled>
                  Registration Closed
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="group">
                <Link to="/clubs">
                  Explore Clubs
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Main image with animated border */}
            <div className="moving-border rounded-[2rem] bg-white p-2 shadow-2xl shadow-primary-900/20 z-20 relative w-full max-w-md">
              <div className="relative aspect-[4/5] rounded-[1.6rem] overflow-hidden">
                <img 
                  src="/lab-image.jpg" 
                  alt="SHKSC Science Club students conducting a chemistry experiment in the lab"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg leading-tight mb-2">"Joining the Science Club changed my entire high school experience."</p>
                  <p className="text-white/80 text-sm">— Sarah J., Class of '26</p>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl z-30 border border-gray-100 hidden sm:flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-950">13+</p>
                <p className="text-sm font-medium text-gray-500">Active Communities</p>
              </div>
            </div>

            {/* Floating gradient orb */}
            <div className="absolute top-10 -right-8 w-36 h-36 bg-accent-400 rounded-full blur-2xl opacity-30 z-10 animate-float-delayed"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
