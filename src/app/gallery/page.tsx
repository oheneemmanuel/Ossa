"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

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
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-6 sm:px-8 sm:py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* HEADER SECTION (Flat layout without outer card) */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#FF6B35]">
            About OSSA
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
            Photo Gallery
          </h1>
          <p className="mt-2 text-sm sm:text-base font-semibold text-slate-600">
            A collection of memorable moments from OSSA activities, projects,
            and community events.
          </p>
        </div>

        {/* MAIN VIEWER CONTAINER */}
        <div className="rounded-2xl border-2 border-slate-950 bg-white p-3 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* IMAGE BOX */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-slate-950 bg-slate-100">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* CAPTION & NAVIGATION CONTROLS */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0b4f6c]">
                Image {activeIndex + 1} of {galleryItems.length}
              </span>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-950">
                {activeImage.title}
              </h2>
            </div>

            {/* PREV / NEXT BUTTONS */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={showPrevious}
                className="flex items-center gap-1 rounded-xl border-2 border-slate-950 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={showNext}
                className="flex items-center gap-1 rounded-xl border-2 border-slate-950 bg-[#FF6B35] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PROGRESS INDICATORS */}
          <div className="mt-4 flex gap-1.5 sm:gap-2">
            {galleryItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 flex-1 rounded-full border-2 border-slate-950 transition-all ${
                  index === activeIndex ? "bg-[#FF6B35]" : "bg-slate-200"
                }`}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION LINKS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/about/history"
            className="rounded-xl border-2 border-slate-950 bg-[#0b4f6c] px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Learn Our History
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border-2 border-slate-950 bg-white px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
