"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Library,
  Compass,
  GraduationCap,
  LogOut,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "My Library", href: "/library", icon: Library },
    { name: "Browse", href: "/browse", icon: Compass },
    { name: "Tutorials", href: "/tutorials", icon: GraduationCap },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav
        className={`
          w-full max-w-6xl bg-[#1a1614]/95 backdrop-blur-md 
          text-stone-200 border border-stone-800/60 shadow-2xl 
          transition-all duration-300 ease-in-out
          ${open ? "rounded-3xl" : "rounded-full"} 
          px-6 py-2
        `}
      >
        <div className="flex justify-between items-center h-12">
          {/* logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-yellow-900/30 p-2 rounded-full border border-yellow-800/40 group-hover:border-yellow-500/50 transition-all duration-500">
              <BookOpen className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight font-serif text-stone-100">
                Book<span className="text-yellow-400">Worm</span>
              </span>
            </div>
          </Link>

          {/*  Desktop Navigation  */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-amber-200 bg-stone-800 shadow-inner"
                      : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/40"
                  }`}
                >
                  <item.icon
                    size={16}
                    className={isActive ? "text-amber-500" : "text-stone-500"}
                  />
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  )}
                </Link>
              );
            })}

            <div className="w-[1px] h-4 bg-stone-800 mx-3" />

            <button
              onClick={logout}
              className="flex items-center gap-2 text-stone-500 hover:text-red-400 px-3 py-2 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-stone-400 hover:bg-stone-800 rounded-full transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 pb-4 space-y-1 border-t border-stone-800 pt-4 animate-in fade-in zoom-in-95 duration-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 p-3 rounded-full transition-all ${
                    isActive
                      ? "bg-emerald-950/30 text-emerald-400 border border-emerald-800/40"
                      : "text-stone-400 hover:bg-stone-800/40"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-emerald-500" : ""}
                  />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 p-3 mt-2 text-stone-500 hover:text-red-400 text-xs font-black uppercase tracking-widest"
            >
              <LogOut size={16} /> Logout Archive
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
