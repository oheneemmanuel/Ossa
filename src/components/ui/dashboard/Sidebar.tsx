"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  House,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Users,
  LogOutIcon,
  UserCheck2Icon,
  Menu,
  X,
} from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: House },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Finance", href: "/dashboard/finance", icon: PiggyBank },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Team", href: "/dashboard/team", icon: Users },
];

const accountLinks = [
  { name: "Profile", href: "/profile", icon: UserCheck2Icon },
  { name: "Logout", href: "/logout", icon: LogOutIcon },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  // Track hydration completion to avoid SSR/Client class mismatches
  useEffect(() => {
    setMounted(true);

    const updateSidebarState = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Mobile drawer doesn't need to stay open on desktop breakpoints
      }
    };

    window.addEventListener("resize", updateSidebarState);
    return () => window.removeEventListener("resize", updateSidebarState);
  }, []);

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
  const initials =
    status === "authenticated"
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : "";

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
        <h1 className="text-base font-semibold text-gray-900">OSSA</h1>
        <button
          type="button"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="rounded-md border border-gray-200 p-2 text-gray-700 active:bg-gray-100"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-20 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out md:static md:w-64 md:max-w-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-14 items-center justify-center border-b border-gray-200 md:h-16">
          <h1 className="text-lg font-semibold text-gray-900">OSSA</h1>
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 py-4">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              // Ensure active state only evaluates post-hydration on client
              const isActive = mounted && pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <link.icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                {status === "loading" ? "…" : initials || "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {status === "loading"
                    ? "Loading..."
                    : session?.user
                      ? `${firstName} ${lastName}`
                      : "Guest"}
                </p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {accountLinks.map((link) => {
                const isActive = mounted && pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <link.icon
                      className={`h-5 w-5 shrink-0 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-10 bg-black/30 backdrop-blur-[1px] transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
