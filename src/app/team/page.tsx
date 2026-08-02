import Image from "next/image";
import Link from "next/link";

const members = [
  {
    role: "President",
    name: "Mr. Ansah Mante Hayfor",
    image: "/team/president.jpg",
  },
  {
    role: "Vice President",
    name: "Mr. Ohene Emmanuel Kwakye",
    image: "/team/vice.webp",
  },
  {
    role: "Secretary",
    name: "K. Asare",
    image: "/team/secretary.svg",
  },
  {
    role: "Programs Lead",
    name: "R. Mensah",
    image: "/team/programs-lead.svg",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f26419]">
          About OSSA
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[0.02em] text-slate-950 sm:text-4xl">
          The Committee
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
          The committee is made up of dedicated members who guide programs,
          coordinate events, and keep OSSA active and welcoming.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.role}
              className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50"
            >
              <div className="relative mx-3 mt-3 aspect-[4/5] overflow-hidden rounded-[16px] bg-slate-100 sm:mx-4 sm:mt-4">
                <Image
                  src={member.image}
                  alt={`${member.role} portrait`}
                  fill
                  className="object-cover scale-[0.96]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b4f6c]">
                  {member.role}
                </p>
                <p className="mt-2 text-lg font-medium text-slate-900">
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/gallery"
            className="rounded-xl bg-[#0b4f6c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a4258]"
          >
            View Gallery
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
