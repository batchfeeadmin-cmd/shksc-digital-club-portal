import React, { useEffect, useState } from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { CalendarDays } from 'lucide-react';
import { getCMSData, GlobalNotice } from '../services/cms/cmsService';

export function HomeNotices() {
  const [notices, setNotices] = useState<GlobalNotice[]>([]);

  useEffect(() => {
    const data = getCMSData();
    setNotices(data.notices.slice(0, 4)); // Get top 4 notices
    
    const handleUpdate = () => {
      setNotices(getCMSData().notices.slice(0, 4));
    };
    
    window.addEventListener('shksc_state_update', handleUpdate);
    return () => window.removeEventListener('shksc_state_update', handleUpdate);
  }, []);

  if (notices.length === 0) return null;

  return (
    <section id="notices" className="py-20 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading 
            eyebrow="Announcements"
            title="Notice Board & Updates"
            subtitle="Stay informed with the latest announcements and upcoming events."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notices.map((notice, index) => (
            <Reveal key={notice.id} delay={index * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-primary-600 text-sm font-bold bg-primary-50 px-3 py-1 rounded-full">
                    <CalendarDays className="w-4 h-4" />
                    <span>{notice.date}</span>
                  </div>
                  {notice.isNew && (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {notice.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-1 flex-1">
                  {notice.content}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
