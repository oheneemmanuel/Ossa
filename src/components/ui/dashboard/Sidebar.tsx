"use client";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import {
  House,
  LayoutDashboard,
  PiggyBank,
  Settings,

  LogOutIcon,
  UserCheck2Icon,
  Menu,
  X,
  Users,
  KeyRound,
  Wallet,
  Package
} from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: House },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Finance", href: "/dashboard/finance", icon: PiggyBank },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
 
];
const adminLinks = [
  { name: "Reset Requests", href: "/admin/reset-requests", icon: KeyRound },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Finance (Admin)", href: "/admin/finance", icon: Wallet },
  {name: "Project Management", href:"/admin/projects", icon:Package },
];

const accountLinks = [
  { name: "Profile", href: "/dashboard/settings", icon: UserCheck2Icon },
];

type SidebarUser = {
  firstName: string;
  lastName: string;
  role: string;
  profileImageUrl: string | null;
};

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateSidebarState = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
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

  const { showToast } = useToast();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  useEffect(() => {
    if (!confirmingLogout) return;

    const timeout = window.setTimeout(() => setConfirmingLogout(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [confirmingLogout]);

  const handleSignOut = async () => {
    if (!confirmingLogout) {
      showToast("Are you sure you want to logout? Click again to confirm.", "info");
      setConfirmingLogout(true);
      return;
    }

    await signOut({ callbackUrl: "/login" });
  };

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            <Image
              src="/li.jpg"
              alt="OSSA Logo"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <h1 className="text-base font-semibold text-black">OSSA</h1>
        </div>
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
        <div className="flex h-14 items-center gap-3 border-b border-gray-200 px-4 md:h-16">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            <Image
              src="/li.jpg"
              alt="OSSA Logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">OSSA</h1>
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 py-4">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
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
          {user.role === "ADMIN" && (
            <>
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Admin
              </p>
              <nav className="mt-1 flex flex-col gap-1">
                {adminLinks.map((link) => {
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
                        className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-gray-500"}`}
                      />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </>
          )}

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
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

              {/* Logout as a real action, not a dead link */}
              <button
                type="button"
                onClick={handleSignOut}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  confirmingLogout
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <LogOutIcon
                  className={`h-5 w-5 shrink-0 ${
                    confirmingLogout ? "text-red-600" : "text-gray-500"
                  }`}
                />
                <span>{confirmingLogout ? "Confirm Logout" : "Logout"}</span>
              </button>
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