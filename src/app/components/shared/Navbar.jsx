"use client";

import Link from "next/link";
import { useState } from "react";

import {
  BookOpen,
  Library,
  Compass,
  GraduationCap,
  LayoutDashboard,
  BookMarked,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
  School,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass =
    "flex items-center gap-2 text-stone-300 hover:text-moss transition-colors duration-200 font-medium text-sm tracking-wide";

  return (
    <nav className="bg-[#1a1614] border-b border-stone-800 text-[#F5F2ED] px-6 py-4 shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href={user?.role === "admin" ? "/dashboard" : "/library"}
          className="group flex items-center gap-2 text-2xl font-serif font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="bg-moss p-1.5 rounded-lg shadow-inner shadow-black/20 group-hover:rotate-3 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-parchment to-stone-400 bg-clip-text text-transparent">
            BookWorm
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              {/* Role-Based Links */}
              <div className="flex items-center space-x-6 border-r border-stone-800 pr-8">
                {user.role === "user" ? (
                  <>
                    <Link href="/library" className={navLinkClass}>
                      <Library size={18} /> My Sanctuary
                    </Link>
                    <Link href="/browse" className={navLinkClass}>
                      <Compass size={18} /> The Collection
                    </Link>
                    <Link href="/tutorials" className={navLinkClass}>
                      <GraduationCap size={18} /> Study Hall
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin-dashboard" className={navLinkClass}>
                      <LayoutDashboard size={18} /> Home
                    </Link>
                    <Link href="/books" className={navLinkClass}>
                      <BookMarked size={18} /> Manage Books
                    </Link>
                    <Link href="/users" className={navLinkClass}>
                      <Users size={18} /> Manage Users
                    </Link>
                    <Link href="/reviews" className={navLinkClass}>
                      <MessageSquare size={18} /> Moderate Reviews
                    </Link>
                    <Link href="/reviews" className={navLinkClass}>
                      <School size={18} /> Manage Tutorials
                    </Link>
                  </>
                )}
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-4 pl-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 rounded-full border border-stone-800">
                  <div className="w-6 h-6 rounded-full bg-moss/20 flex items-center justify-center">
                    <User size={14} className="text-moss" />
                  </div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-tighter">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-moss/10 hover:bg-moss text-moss hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border border-moss/20 shadow-lg shadow-moss/5"
                >
                  <LogOut size={16} />
                  Leave Room
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-stone-400 hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-moss text-white px-6 py-2 rounded-full font-bold hover:bg-[#3d4d40] shadow-lg shadow-moss/20 transition-all active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-stone-400 hover:text-moss transition-colors"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1614] border-b border-stone-800 p-6 flex flex-col space-y-4 animate-in slide-in-from-top-2 duration-300">
          {user ? (
            <>
              {user.role === "user" ? (
                <>
                  <Link
                    href="/library"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <Library size={20} /> My Library
                  </Link>
                  <Link
                    href="/browse"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <Compass size={20} /> Browse
                  </Link>
                  <Link
                    href="/tutorials"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <GraduationCap size={20} /> Tutorials
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/admin-dashboard"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                  <Link
                    href="/books"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <BookMarked size={20} /> Manage Books
                  </Link>
                  <Link
                    href="/users"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <Users size={20} /> Users
                  </Link>
                </>
              )}
              <hr className="border-stone-800" />
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-900/20 text-red-400 py-3 rounded-xl border border-red-900/30"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full py-3 text-center border border-stone-800 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full py-3 text-center bg-moss text-white rounded-xl font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
