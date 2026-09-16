import React, { useState, useEffect } from 'react';
import { Bell, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { getCMSData, GlobalNotice } from '../services/cms/cmsService';

export function SiteAnnouncement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [notices, setNotices] = useState<GlobalNotice[]>([]);

  useEffect(() => {
    const fetchNotices = () => {
      setNotices(getCMSData().notices);
    };
    
    fetchNotices();
    window.addEventListener('shksc_state_update', fetchNotices);
    return () => window.removeEventListener('shksc_state_update', fetchNotices);
  }, []);

  return (
    <>
      {/* Top Marquee Announcement Bar */}
      {isVisible && (
        <div className="bg-primary text-primary-foreground relative z-50">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4 text-sm">
            <div className="flex-1 flex overflow-hidden whitespace-nowrap">
              <span className="font-semibold shrink-0 mr-2 flex items-center gap-2">
                <Bell className="w-4 h-4 animate-ring" />
                Latest Notice:
              </span>
              <div className="flex-1 overflow-hidden relative">
                <div className="animate-marquee whitespace-nowrap inline-block">
                  {notices.map(n => n.title).join(' • ') || 'No new announcements at this time.'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Notice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="View Notices"
        >
          <Bell className="w-6 h-6 group-hover:animate-ring" />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[10px] font-bold text-white">
              2
            </span>
          </span>
        </button>
      </div>

      {/* Notice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border shadow-2xl rounded-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Announcements</h2>
                    <p className="text-sm text-muted-foreground">Stay updated with latest news</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4">
                {notices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className={`p-4 rounded-xl border transition-all ${notice.isNew ? 'bg-primary/5 border-primary/20' : 'bg-surface border-border hover:border-border/80'}`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {notice.title}
                        {notice.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notice.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                ))}
                
                {notices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <Info className="w-12 h-12 mb-3 text-muted" />
                    <p>No new announcements</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
