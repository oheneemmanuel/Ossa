import Image from "next/image";
import Link from "next/link";

const members = [
  {
    role: "President",
    name: "Mr. Hayford Ansah Mante",
    image: "/team/president.webp",
  },
  {
    role: "Vice President",
    name: "Mr. Emmanuel Kwakye Ohene",
    image: "/team/vice.webp",
  },
  {
    role: "Chairman",
    name: "Mr. Evans Ketu",
    image: "/team/image.png",
  },

  {
    role: "Secretary",
    name: "Mr. Dennis K. Lartey",
    image: "/team/dennis.webp",
  },
  {
    role: "Programs Lead",
    name: "Mr.Patrick N. Gyamfi",
    image: "/team/dangote.webp",
  },
  {
    role: "D.C and Organizer",
    name: "Mr.Joshua Arhin",
    image: "/team/dc.webp",
  },
  {
    role: "Secretary",
    name: "Mad.Naomi Amanianpon",
    image: "/team/naomi.webp",
  },
  {
    role: "Organizer",
    name: "Mad.Gyamfua Princess",
    image: "/team/image.png",
  },
  {
    role: "Project Manager",
    name: "Mr.Ansah Samuel",
    image: "/team/shadow.webp",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-lg font-semibold uppercase tracking-[0.3em] text-blue-500">
          About OSSA
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[0.02em] text-slate-950 sm:text-4xl">
          The Committee
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
          The committee is made up of dedicated members who guide programs,
          coordinate events, and keep OSSA active and welcoming.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.role}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              <div className="relative mx-2.5 mt-2.5 aspect-square overflow-hidden rounded-xl bg-slate-100 sm:mx-3 sm:mt-3">
                <Image
                  src={member.image}
                  alt={`${member.role} portrait`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="p-3 sm:p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0b4f6c] sm:text-xs">
                  {member.role}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-900 sm:text-base">
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
