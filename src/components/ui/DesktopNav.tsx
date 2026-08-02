"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  subLinks?: { name: string; href: string }[];
}

export default function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-wrap justify-center gap-2 lg:gap-3 items-center">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.subLinks && link.subLinks.some((s) => pathname === s.href));

        if (link.subLinks) {
          return (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-bold transition duration-150 ${
                  isActive
                    ? "text-slate-950 bg-blue-400 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-slate-700 hover:bg-blue-100 hover:text-slate-950"
                }`}
              >
                {link.name}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>

              {/* Dropdown Menu */}
              {/* Designed with a clean border and offset shadow to match the homepage cards */}
              <div className="absolute left-0 top-[100%] pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-lg border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                  {link.subLinks.map((subLink) => {
                    const isSubActive = pathname === subLink.href;
                    return (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className={`px-4 py-3 text-sm font-bold transition duration-150 border-b border-slate-100 last:border-none ${
                          isSubActive
                            ? "bg-blue-400 text-slate-950"
                            : "text-slate-700 hover:bg-blue-100 hover:text-slate-950"
                        }`}
                      >
                        {subLink.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`rounded-lg px-3 py-1.5 font-bold transition duration-150 ${
              isActive
                ? "text-slate-950 bg-blue-400 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-slate-700 hover:bg-blue-100 hover:text-slate-950"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
