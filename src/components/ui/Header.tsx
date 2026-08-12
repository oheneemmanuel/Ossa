import Link from "next/link";
import Image from "next/image";
import MobileMenu from "@/components/ui/MobileMenu";
import DesktopNav from "@/components/ui/DesktopNav";

export default function Header() {
  const desktopNavLinks = [
    { name: "Home", href: "/" },

    {
      name: "Education Hub",
      href: "#education-hub",
      subLinks: [
        { name: "Our Projects", href: "/events" },
        { name: "Events & Fairs", href: "/events" },
      ],
    },

    {
      name: "About",
      href: "#about",
      subLinks: [
        { name: "Our History", href: "/about/history" },
        { name: "Our Mission", href: "/mission" },
        { name: "The Committee", href: "/team" },
        { name: "Photo Gallery", href: "/gallery" },
      ],
    },
    {
      name: 'Contact',
      href :"/contact"
    }
  ];

  const mobileNavLinks = [...desktopNavLinks, { name: "Sign In", href: "/login" }];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-950 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-4 md:flex-row md:items-center md:justify-between relative">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-2.5">
              <Image
                src="/li.jpg"
                alt="OSSA Logo"
                width={50}
                height={50}
                priority
                
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">
                OSSA
              </h1>
              <p className="hidden text-xs font-bold text-slate-500 sm:block tracking-wide text-blue-600">
                OLD SCIENCE STUDENT ASSOCIATION
              </p>
            </div>
          </Link>

          <MobileMenu navLinks={mobileNavLinks} />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-wrap justify-center col-span-1">
          <DesktopNav navLinks={desktopNavLinks} />
        </div>
        {/* RIGHT COLUMN: Action Buttons / Sign In */}
        <div className="hidden md:flex justify-end items-center gap-4 col-span-1">
          <Link
            href="/login"
            className="rounded-lg border-2 border-slate-950 bg-gray-500 px-4 py-2 text-sm font-bold text-white transition hover:scale-105 hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
