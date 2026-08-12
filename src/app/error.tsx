'use client'; // error.tsx MUST be a Client Component

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the runtime error to your analytics or logging service
    console.error('OSSA App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <AlertTriangle size={40} />
        </div>

        {/* Main Heading */}
        <h1 className="font-display mb-3 text-3xl font-bold uppercase tracking-wide text-blue-900">
          Something Went Wrong
        </h1>

        {/* Descriptive Text */}
        <p className="font-body mx-auto mb-8 max-w-md text-blue-600">
          An unexpected server error occurred in the OSSA application.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Try Again button calls the reset() function provided by Next.js */}
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3 font-body font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw size={18} /> Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-600 bg-white px-8 py-3 font-body font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home size={18} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}