import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <section className="min-h-[70vh] px-6 pt-36 pb-20 flex items-center justify-center text-center">
      <div className="max-w-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-accent-600">404 · Page not found</p>
        <h1 className="mt-3 text-4xl font-heading font-bold text-primary-950">This page is not part of the portal</h1>
        <p className="mt-4 text-gray-600">The address may be outdated or typed incorrectly.</p>
        <Button asChild className="mt-8">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to homepage</Link>
        </Button>
      </div>
    </section>
  );
}
