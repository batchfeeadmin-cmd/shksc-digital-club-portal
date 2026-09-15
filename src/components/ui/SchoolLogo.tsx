import React from 'react';

// School branding logo — replace /public/school-logo.jpg to update everywhere
export function SchoolLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/school-logo.jpg"
      alt="SHKSC Logo"
      className={`object-contain ${className}`}
    />
  );
}
