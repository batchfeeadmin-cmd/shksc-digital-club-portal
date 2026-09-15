import React from 'react';
import { cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-3xl mb-14', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.18em] mb-5',
          dark ? 'bg-white/10 text-accent-400 border border-white/15' : 'bg-accent-50 text-accent-700 border border-accent-100'
        )}
      >
        {eyebrow}
      </div>
      <h2
        className={cn(
          'text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-[1.1]',
          dark ? 'text-white' : 'text-primary-950'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-5 text-base md:text-lg leading-relaxed', dark ? 'text-primary-100/80' : 'text-gray-600')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
