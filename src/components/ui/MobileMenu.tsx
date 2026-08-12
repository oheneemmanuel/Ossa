"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Info,
  Compass,
  Users,
  ChevronDown,
} from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  subLinks?: { name: string; href: string }[];
}

export default function MobileMenu({ navLinks }: { navLinks: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (name: string) => {
    setExpandedGroup((current) => (current === name ? null : name));
  };

  const getIcon = (href: string) => {
    const activeColor = "text-slate-950";
    const inactiveColor = "text-slate-600";

    switch (href) {
      case "/":
        return (
          <Home
            size={19}
            className={pathname === "/" ? activeColor : inactiveColor}
          />
        );
      case "/dashboard":
        return (
          <LayoutDashboard
            size={19}
            className={pathname === "/" ? inactiveColor : activeColor}
          />
        );
      case "#about":
        return (
          <Info
            size={19}
            className={pathname === "/" ? inactiveColor : activeColor}
          />
        );
      case "#events":
        return (
          <Compass
            size={19}
            className={pathname === "/" ? inactiveColor : activeColor}
          />
        );
      case "#join":
        return (
          <Users
            size={19}
            className={pathname === "/" ? inactiveColor : activeColor}
          />
        );
      
      default:
        return <Home size={19} className={inactiveColor} />;
    }
  };

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="md:hidden rounded-lg border-2 border-slate-950 bg-white p-1.5 text-slate-950 transition hover:bg-blue-500"
        aria-label="Open navigation menu"
      >
        <Menu className="h-7 w-7" />
      </button>

      {/* Portal for Backdrop and Drawer */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            {isOpen && (
              <div
                className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm transition-opacity md:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Drawer Container */}
            <div
              className={`fixed inset-y-0 right-0 z-[70] flex w-[78vw] max-w-[290px] flex-col border-l-2 border-slate-950 bg-[#f7f5ef] transition-transform duration-300 ease-in-out md:hidden ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-950 bg-[#0b4f6c] px-5 py-4 text-white">
                <span className="text-xs font-extrabold uppercase tracking-[0.3em]">
                  OSSA Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border-2 border-transparent p-1 text-white transition hover:border-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Links Area */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="flex flex-col gap-1 px-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const isGroupActive =
                      link.subLinks?.some((subLink) => pathname === subLink.href) ?? false;

                    if (link.subLinks?.length) {
                      return (
                        <div
                          key={link.name}
                          className={`rounded-lg border-2 ${
                            isGroupActive
                              ? "border-slate-950 bg-blue-400/20"
                              : "border-transparent bg-white/70"
                          }`}
                        >
                          <div className="flex items-center justify-between px-4 py-3">
                            <Link
                              href={link.href}
                              onClick={() => {
                                setIsOpen(false);
                                setExpandedGroup(null);
                              }}
                              className={`flex flex-1 items-center gap-3.5 text-sm font-bold transition ${
                                isActive
                                  ? "text-slate-950"
                                  : "text-slate-700 hover:text-slate-950"
                                  
                              }`}
                            >
                              {getIcon(link.href)}
                              <span>{link.name}</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => toggleGroup(link.name)}
                              className="rounded-lg p-1 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                              aria-label={`Toggle ${link.name}`}
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  expandedGroup === link.name ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          {expandedGroup === link.name && (
                            <div className="border-t border-slate-200 bg-slate-50/80 px-2 pb-2 pt-2">
                              {link.subLinks.map((subLink) => {
                                const isSubActive = pathname === subLink.href;
                                return (
                                  <Link
                                    key={subLink.name}
                                    href={subLink.href}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setExpandedGroup(null);
                                    }}
                                    className={`mt-1 flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                      isSubActive
                                        ? "bg-blue-500 text-white"
                                        : "text-slate-700 hover:bg-blue-400 hover:text-slate-950"
                                    }`}
                                  >
                                    {subLink.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3.5 rounded-lg border-2 px-4 py-3 text-sm font-bold transition ${
                          isActive
                            ? "border-slate-950 bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "border-transparent text-slate-700 hover:border-slate-950 hover:bg-white hover:text-slate-950"
                        }`}
                      >
                        {getIcon(link.href)}
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
