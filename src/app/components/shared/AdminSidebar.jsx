"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookMarked,
  Users,
  MessageSquare,
  School,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  BookOpen,
  Tag,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Manage Books", href: "/books", icon: BookMarked },
    { name: "Manage Genres", href: "/genres", icon: Tag },
    { name: "Manage Users", href: "/users", icon: Users },
    { name: "Moderate Reviews", href: "/reviews", icon: MessageSquare },
    { name: "Manage Tutorials", href: "/tutorials", icon: School },
  ];

  return (
    <>
      <header className="lg:hidden w-full bg-[#1a1614] border-b border-stone-800 text-[#F5F2ED] px-6 py-4 flex items-center justify-between sticky top-0 z-[60] shadow-md">
        <Link href="/admin-dashboard" className="flex items-center gap-2 group">
          <div className="bg-moss p-1.5 rounded-lg shadow-sm group-hover:rotate-3 transition-transform">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">
            BookWorm{" "}
            <span className="text-stone-500 font-sans text-xs uppercase tracking-widest ml-1">
              Admin
            </span>
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-stone-400 hover:text-moss hover:bg-stone-900 rounded-xl border border-stone-800 transition-all active:scale-90"
          aria-label="Open Archive Menu"
        >
          <Menu size={24} />
        </button>
      </header>
      <div
        className={`
          fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-80 w-72 bg-[#1a1614] text-[#F5F2ED] flex flex-col border-r border-stone-800/50 shadow-2xl transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-screen lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-moss/40 via-transparent to-moss/40 opacity-20"></div>

        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-moss pl-2">
            <ShieldCheck
              size={20}
              className="drop-shadow-[0_0_8px_rgba(131,145,121,0.4)]"
            />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
              Head Curator
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-stone-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-moss text-white shadow-lg shadow-moss/20 ring-1 ring-white/10"
                    : "text-stone-400 hover:bg-stone-800/50 hover:text-parchment"
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon
                    size={18}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-stone-500 group-hover:text-moss"
                    } transition-colors`}
                  />
                  <span className="text-sm font-medium tracking-wide font-serif">
                    {item.name}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight
                    size={14}
                    className="text-white/70 animate-in slide-in-from-left-2"
                  />
                )}

                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-6 mt-auto">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="group flex items-center gap-3 bg-stone-900 hover:bg-red-900/20 text-stone-400 hover:text-red-400 w-full px-4 py-3.5 rounded-xl border border-stone-800 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="p-1.5 rounded-lg bg-stone-800 group-hover:bg-red-900/20 transition-colors">
              <LogOut size={16} />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Leave Study
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
