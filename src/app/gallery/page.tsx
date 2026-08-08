"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  X,
} from "lucide-react";

const galleryItems = [
  {
    title: "School Visit",
    src: "/gallery/visit.png",
    alt: "OSSA members visiting a school",
  },
  {
    title: "Science Fair",
    src: "/gallery/ossa-2.svg",
    alt: "Science fair highlights with OSSA participation",
  },
  {
    title: "Community Outreach",
    src: "/gallery/ossa-3.svg",
    alt: "Community outreach event by OSSA",
  },
  {
    title: "Committee Celebration",
    src: "/gallery/ossa-4.svg",
    alt: "Committee celebration and social event",
  },
];

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % galleryItems.length);
  };

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryItems.length - 1 : current - 1,
    );
  };

  const activeImage = galleryItems[activeIndex];

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-8 sm:px-8 sm:py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              About OSSA
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Photo Gallery
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              A collection of memorable moments from OSSA activities, projects,
              and community events.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back Home</span>
          </Link>
        </div>

        {/* MAIN VIEWER CONTAINER */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          {/* IMAGE CONTAINER */}
          <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:aspect-[16/9]">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              priority
            />

            {/* Lightbox / Zoom Trigger Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              aria-label="Expand image"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Floating Navigation Controls */}
            <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <button
                type="button"
                onClick={showPrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-sm hover:bg-white active:scale-95 transition dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-sm hover:bg-white active:scale-95 transition dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CAPTION & COUNTER */}
          <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {activeImage.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeImage.alt}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {activeIndex + 1} / {galleryItems.length}
            </span>
          </div>

          {/* THUMBNAIL NAVIGATOR */}
          <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
            {galleryItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-[16/10] w-full overflow-hidden rounded-lg border transition-all ${
                  index === activeIndex
                    ? "border-blue-600 ring-2 ring-blue-600/20 dark:border-blue-500"
                    : "border-slate-200 opacity-60 hover:opacity-100 dark:border-slate-800"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION LINKS */}
        <div className="flex justify-end gap-3">
          <Link
            href="/about/history"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            Learn Our History
          </Link>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
