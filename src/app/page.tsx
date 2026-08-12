import Link from "next/link";
import Image from "next/image";
import {
  Atom,
  FlaskConical,
  Users,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const focusAreas = [
  {
    title: "Educational Impact",
    description:
      "We design, build, and fund physical science education projects, laboratory updates, and mentorship resources for regional schools.",
    icon: <FlaskConical className="w-8 h-8 text-emerald-600" />,
  },
  {
    title: "Alumni Network",
    description:
      "OSSA reconnects Old science students, helping old classmates share career ideas, industry resources, and structural support.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Scholarship & Service",
    description:
      "We award academic excellence, provide funding paths for bright science students, and sponsor local STEM outreach activities.",
    icon: <Award className="w-8 h-8 text-amber-500" />,
  },
];

const stats = [
  { label: "Active Members", value: "100+" },
  { label: "Lab Projects", value: "14" },
  { label: "Dues & Grants", value: "GH₵ 6K+" },
  { label: "STEM Scholarships", value: "25" },
];

export default function Home() {
  return (
    <main className="flex flex-col bg-[#f7f5ef] text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b-2 border-slate-950 bg-[#0b4f6c] text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-8 md:grid-cols-2 items-center">
          <Image
            src="/science.jpg"
            alt="OSSA Hero Banner"
            width={900}
            height={700}
            priority
            className="absolute inset-0 h-full w-full object-cover opacity-10 md:opacity-20"
          />
          <Reveal>
            <p className="mb-3 text-lg font-black uppercase tracking-[0.35em] text-white">
              Old Science Student Association
            </p>

            <h1 className="mb-6 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl text-white">
              Advancing science <br />
              <span className="text-[#FF6B35]">education & service.</span>
            </h1>

            <p className="mb-8 max-w-2xl text-base sm:text-lg text-white/85 font-medium leading-relaxed">
              OSSA reunites old science students to empower new generations. We
              build school laboratories, fund STEM resources, and maintain a
              lifelong network of scientific excellence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#about"
                className="bg-blue-600 text-white px-6 py-3 border-2 border-slate-950 rounded-xl font-bold tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
              >
                Our Mission
              </Link>

              <Link
                href="/dashboard"
                className="bg-white text-slate-950 px-6 py-3 border-2 border-slate-950 rounded-xl font-bold tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </Reveal>

          {/* Right Banner Card */}
          <Reveal
            delay={120}
            className="rounded-2xl border-2 border-slate-950 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-slate-950"
          >
            <div className="flex items-center gap-2 mb-4">
              <Atom className="w-5 h-5 text-emerald-600 animate-[spin_8s_linear_infinite]" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                Current Objectives
              </p>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
              Active school lab infrastructure development.
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Donated lab material kits</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>High school mentorship tracks</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Annual OSSA STEM Exhibition</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* QUICK STATISTICS BAR */}
      <section className="border-b-2 border-slate-950 bg-gray-400 py-6 text-slate-950">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border-2 border-slate-950 bg-white px-3 py-2.5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section id="events" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mb-14 max-w-3xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-blue-600">
              Upcoming Events
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
              Join OSSA's community events for learning and collaboration.
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal>
              <article className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 text-slate-950">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    STEM Exhibition
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Annual OSSA STEM Exhibition
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  Celebrate innovation with school projects, science
                  demonstrations, and alumni mentorship sessions.
                </p>
              </article>
            </Reveal>

            <Reveal delay={80}>
              <article className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 text-slate-950">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Materials Drive
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Lab Resource Distribution
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  Support regional science classrooms with donated lab kits,
                  textbooks, and teaching resources.
                </p>
              </article>
            </Reveal>

            <Reveal delay={160}>
              <article className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 text-slate-950">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Career Talk
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Alumni Career Conversations
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  Hear from science professionals and educators about careers,
                  research, and community impact.
                </p>
              </article>
            </Reveal>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition hover:bg-blue-700"
            >
              See All Events
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT / FOCUS AREAS */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mb-14 max-w-3xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-blue-600">
              Why OSSA Matters
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
              A dedicated collective of science graduates helping schools excel.
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {focusAreas.map((item, idx) => (
              <Reveal
                key={item.title}
                delay={(idx + 1) * 85}
                className="rounded-2xl border-2 border-slate-950 bg-[#f7f5ef] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 bg-white border-2 border-slate-950 p-2.5 inline-block rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {item.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-700">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CALL OUT */}
      <section
        id="join"
        className="bg-[#0a3143] py-20 text-slate-950 border-t-2 border-slate-950 relative overflow-hidden"
      >
        <Reveal className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight sm:text-4xl text-white">
            Ready to empower future scientists?
          </h2>
          <p className="mb-8 mx-auto max-w-xl text-base font-bold text-[#FFE600] leading-relaxed">
            Whether you graduated years ago or recently entered a scientific
            field, your insight and contribution can reshape educational
            outcomes.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-slate-950 px-8 py-4 border-2 border-slate-950 rounded-xl font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Register Membership
          </Link>
          <Link
            href="/contact"
            className="bg-white text-slate-950 px-6 py-3 border-2 border-slate-950 rounded-xl font-bold tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-center ml-6"
          >
            Contact Us
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
