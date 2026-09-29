import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('SHKSC portal render error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-slate-50 px-6 flex items-center justify-center text-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-5 text-2xl font-bold text-primary-950">The portal hit an unexpected error</h1>
          <p className="mt-3 text-gray-600">Your saved demo data is still available. Reload the page to try again.</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-primary-950 px-5 py-2.5 font-bold text-white hover:bg-primary-900">
            Reload portal
          </button>
        </div>
      </main>
    );
  }
}
