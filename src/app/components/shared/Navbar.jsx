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
          w-full max-w-7xl bg-white/90 backdrop-blur-md 
          text-stone-800 border border-stone-200 shadow-xl shadow-stone-200/50
          transition-all duration-300 ease-in-out
          ${open ? "rounded-3xl" : "rounded-full"} 
          px-6 py-2
        `}
      >
        <div className="flex justify-between items-center h-12">
          {/* logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-emerald-100 p-2 rounded-full border border-emerald-200 group-hover:border-emerald-400 transition-all duration-500 shadow-sm">
              <BookOpen className="text-emerald-700" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight font-serif text-stone-900">
                Book<span className="text-emerald-600">Worm</span>
              </span>
            </div>
          </Link>

          {/*desktop navigation*/}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-emerald-800 bg-emerald-50 shadow-sm"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <item.icon
                    size={16}
                    className={isActive ? "text-emerald-600" : "text-stone-400"}
                  />
                  {item.name}
                </Link>
              );
            })}

            <div className="w-[1px] h-4 bg-stone-200 mx-3" />

            <button
              onClick={logout}
              className="flex items-center gap-2 text-stone-400 hover:text-red-600 px-3 py-2 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>

          {/* mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="md:hidden mt-2 pb-4 space-y-1 border-t border-stone-100 pt-4 animate-in fade-in zoom-in-95 duration-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 p-3 rounded-full transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-emerald-600" : ""}
                  />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 p-3 mt-2 text-stone-400 hover:text-red-600 text-xs font-black uppercase tracking-widest transition-colors"
            >
              <LogOut size={16} /> Logout Archive
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
