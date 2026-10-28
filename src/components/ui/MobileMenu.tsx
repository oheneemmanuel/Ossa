"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Info,
  Compass,
  BookOpen,
  Phone,
  LogIn,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  subLinks?: { name: string; href: string }[];
}

const iconByName: Record<string, LucideIcon> = {
  Home,
  "Education Hub": BookOpen,
  About: Info,
  Contact: Phone,
  "Sign In": LogIn,
};

export default function MobileMenu({ navLinks }: { navLinks: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape to close + lock page scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const toggleGroup = (name: string) => {
    setExpandedGroup((current) => (current === name ? null : name));
  };

  const closeAll = () => {
    setIsOpen(false);
    setExpandedGroup(null);
  };

  const renderIcon = (name: string, colorClass: string) => {
    const Icon = iconByName[name] ?? Compass;
    return <Icon size={19} className={colorClass} aria-hidden="true" />;
  };

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="md:hidden rounded-lg border-2 border-slate-950 bg-white p-1.5 text-slate-950 transition hover:bg-blue-500"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="h-7 w-7" />
      </button>

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

            {/* Drawer: `invisible` when closed removes it from tab order and screen readers */}
            <div
              id="mobile-menu"
              className={`fixed inset-y-0 right-0 z-[70] flex w-[78vw] max-w-[290px] flex-col border-l-2 border-slate-950 bg-[#f7f5ef] transition-[transform,visibility] duration-300 ease-in-out md:hidden ${
                isOpen ? "visible translate-x-0" : "invisible translate-x-full"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-950 bg-[#0b4f6c] py-2 pl-5 pr-3 text-white">
                <span className="text-xs font-extrabold uppercase tracking-[0.3em]">
                  OSSA Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-transparent text-white transition hover:border-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Links Area */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav aria-label="Mobile" className="flex flex-col gap-1 px-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const isGroupActive =
                      link.subLinks?.some((s) => pathname === s.href) ?? false;

                    if (link.subLinks?.length) {
                      const isExpanded = expandedGroup === link.name;
                      return (
                        <div
                          key={link.name}
                          className={`rounded-lg border-2 ${
                            isGroupActive
                              ? "border-slate-950 bg-blue-400/20"
                              : "border-transparent bg-white/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleGroup(link.name)}
                            aria-expanded={isExpanded}
                            className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:text-slate-950"
                          >
                            <span className="flex items-center gap-3.5">
                              {renderIcon(
                                link.name,
                                isGroupActive
                                  ? "text-slate-950"
                                  : "text-slate-600",
                              )}
                              <span>{link.name}</span>
                            </span>
                            <ChevronDown
                              aria-hidden="true"
                              className={`h-5 w-5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="border-t border-slate-200 bg-slate-50/80 px-2 pb-2 pt-2">
                              {link.subLinks.map((subLink) => {
                                const isSubActive = pathname === subLink.href;
                                return (
                                  <Link
                                    key={subLink.name}
                                    href={subLink.href}
                                    onClick={closeAll}
                                    className={`mt-1 flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                      isSubActive
                                        ? "bg-blue-700 text-white"
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
                        onClick={closeAll}
                        className={`flex min-h-[44px] items-center gap-3.5 rounded-lg border-2 px-4 py-3 text-sm font-bold transition ${
                          isActive
                            ? "border-slate-950 bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "border-transparent text-slate-700 hover:border-slate-950 hover:bg-white hover:text-slate-950"
                        }`}
                      >
                        {renderIcon(
                          link.name,
                          isActive ? "text-white" : "text-slate-600",
                        )}
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
