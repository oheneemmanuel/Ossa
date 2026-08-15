import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold uppercase tracking-[0.3em] text-blue-500">
          About OSSA
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[0.02em] text-slate-950">
          Our History
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          The Old Science Student Association was established in 2023 by Mr.
          Hayford Ansah Mante and Emmanuel Ohene Kwakye. What started as a small
          group has expanded significantly, thanks to the continuous commitment
          of our leadership board and members.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/mission"
            className="rounded-xl bg-[#0b4f6c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a4258]"
          >
            Read Our Mission
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
