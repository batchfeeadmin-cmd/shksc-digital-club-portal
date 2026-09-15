import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'activities', label: 'Activities' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'journey', label: 'Journey' },
  { id: 'programs', label: 'Programs' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'join', label: 'Join' }
];

export function ScienceSectionNav() {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-30 bg-surface/85 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Science Club sections"
        >
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300',
                active === item.id
                  ? 'bg-primary-950 text-accent-400 shadow-md'
                  : 'text-gray-500 hover:text-primary-950 hover:bg-primary-50'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
