export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-slate-950 bg-[#0b4f6c] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f7c59f]">
            OSSA
          </p>
          <p className="mt-1 text-sm text-white/80">
            © {new Date().getFullYear()} Old Science Student Association.
            Building a stronger science student community.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <a href="#about" className="transition hover:text-[#f7c59f]">
            About
          </a>
          <a href="#events" className="transition hover:text-[#f7c59f]">
            Events
          </a>
          <a href="#join" className="transition hover:text-[#f7c59f]">
            Join Us
          </a>
        </div>
      </div>
    </footer>
  );
}
