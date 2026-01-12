"use client";

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
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: "Ledger Home", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Volume Archive", href: "/books", icon: BookMarked },
    { name: "Reader Registry", href: "/users", icon: Users },
    { name: "Curation Queue", href: "/reviews", icon: MessageSquare },
    { name: "Study Hall Editor", href: "/adminTutorials", icon: School },
  ];

  return (
    <aside className="w-72 bg-[#1a1614] min-h-screen text-[#F5F2ED] flex flex-col border-r border-stone-800/50 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-moss/50 via-transparent to-moss/50 opacity-30"></div>

      <div className="p-8">
        <div className="flex items-center gap-2 text-moss mb-10 pl-2">
          <ShieldCheck
            size={18}
            className="drop-shadow-[0_0_8px_rgba(131,145,121,0.4)]"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
            Head Curator
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-moss text-white shadow-lg shadow-moss/20 ring-1 ring-white/10"
                    : "text-stone-400 hover:bg-stone-800/50 hover:text-parchment"
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon
                    size={20}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-stone-500 group-hover:text-moss"
                    } transition-colors`}
                  />
                  <span className="text-sm font-medium tracking-wide">
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
      </div>

      {/* Footer Section */}
      <div className="mt-auto p-6 space-y-6">
        {/* Curator Quote: Adds to the cozy library vibe */}
        <div className="px-4 py-4 rounded-2xl bg-stone-900/40 border border-stone-800/50 hidden lg:block">
          <p className="text-[11px] text-stone-500 italic leading-relaxed font-serif">
            "Everything you need for a better future and success has already
            been written."
          </p>
          <div className="h-px w-8 bg-moss/30 my-2"></div>
          <p className="text-[9px] text-stone-600 font-bold uppercase tracking-widest">
            Archive Wisdom
          </p>
        </div>

        <button
          onClick={logout}
          className="group flex items-center gap-3 bg-stone-900 hover:bg-red-900/20 text-stone-400 hover:text-red-400 w-full px-4 py-3 rounded-xl border border-stone-800 transition-all duration-300 active:scale-[0.98]"
        >
          <div className="p-1.5 rounded-lg bg-stone-800 group-hover:bg-red-900/20 transition-colors">
            <LogOut size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight">Leave Study</span>
        </button>
      </div>
    </aside>
  );
}
