import Link from "next/link";

const eventTypes = [
  "Distribution of learning materials and resources",
  "Science fairs and innovation showcases",
  "Career talks with industry and academic guests",
  "Social and networking gatherings for members",
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f26419]">
          Education Hub
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[0.02em] text-slate-950">
          Events & Fairs
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          Our events create spaces for learning, collaboration, and community
          engagement across the academic year.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {eventTypes.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-xl bg-[#0b4f6c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a4258]"
          >
            View Projects
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
