"use client";
import GenrePieChart from "@/app/components/charts/GenrePieChart";
import ProtectedRoute from "@/app/components/routes/ProtectedRoute";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";

import {
  Users,
  BookText,
  ClipboardCheck,
  LayoutDashboard,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-stone-500">
        <Loader2 className="w-10 h-10 animate-spin text-moss mb-4" />
        <p className="font-serif italic text-lg text-stone-600">
          Consulting the archives...
        </p>
      </div>
    );

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
        <header className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-moss/10 p-2 rounded-lg text-moss">
              <LayoutDashboard size={24} />
            </div>
            <span className="text-moss font-bold tracking-widest text-xs uppercase">
              Curator Overview
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-800">
            Librarian's Ledger
          </h1>
          <p className="text-stone-500 italic font-serif mt-1">
            Managing the heartbeat of the BookWorm sanctuary.
          </p>
        </header>

        <main className="max-w-6xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users Card */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-stone-100 shadow-sm transition-hover hover:shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={64} className="text-moss" />
              </div>
              <div className="flex flex-col">
                <span className="text-stone-400 text-sm font-semibold uppercase tracking-wider mb-1">
                  Total Readers
                </span>
                <span className="text-4xl font-bold text-stone-800">
                  {stats.users.toLocaleString()}
                </span>
                <div className="mt-4 flex items-center text-xs text-moss font-medium">
                  <Sparkles size={12} className="mr-1" /> Active members
                </div>
              </div>
            </div>

            {/* Books Card */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-stone-100 shadow-sm transition-hover hover:shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BookText size={64} className="text-moss" />
              </div>
              <div className="flex flex-col">
                <span className="text-stone-400 text-sm font-semibold uppercase tracking-wider mb-1">
                  Volume Collection
                </span>
                <span className="text-4xl font-bold text-stone-800">
                  {stats.books.toLocaleString()}
                </span>
                <div className="mt-4 flex items-center text-xs text-stone-500">
                  Total titles on shelves
                </div>
              </div>
            </div>

            {/* Pending Reviews Card */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-moss/5 shadow-sm transition-hover hover:shadow-md border-l-4 border-l-moss">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ClipboardCheck size={64} className="text-moss" />
              </div>
              <div className="flex flex-col">
                <span className="text-stone-400 text-sm font-semibold uppercase tracking-wider mb-1">
                  Pending Curation
                </span>
                <span className="text-4xl font-bold text-moss">
                  {stats.pendingReviews}
                </span>
                <div className="mt-4">
                  <button className="text-xs bg-moss text-white px-3 py-1 rounded-full hover:bg-[#3d4d40] transition-colors">
                    Review Queue →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-800">
                    Collection by Genre
                  </h2>
                  <p className="text-sm text-stone-500 italic">
                    Distribution of literary works across the library
                  </p>
                </div>
                <div className="bg-stone-50 px-4 py-2 rounded-lg border border-stone-100">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Global View
                  </span>
                </div>
              </div>

              <div className="h-[400px] w-full flex items-center justify-center">
                <GenrePieChart data={stats.genres || []} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
