import Link from 'next/link';
import { Home, FolderGit2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 Number */}
        <p className="font-display mb-4 text-8xl font-extrabold text-blue-500 animate-pulse">
          404
        </p>

        {/* Main Heading */}
        <h1 className="font-display mb-3 text-3xl font-bold uppercase tracking-wide text-gray-800">
          Page Not Found
        </h1>

        {/* Descriptive Text */}
        <p className="font-body mx-auto mb-8 max-w-md text-gray-500">
          The OSSA page or resource you&apos;re looking for isn&apos;t here. It might have been moved, renamed, or deleted.
        </p>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-8 py-3 font-body font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Home size={18} /> Go Home
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-500 px-8 py-3 font-body font-semibold text-white transition-colors 
            bg-blue-500
            hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FolderGit2 size={18} /> View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}