"use client";
import { useEffect, useState } from "react";
import ReadingProgressChart from "@/app/components/charts/ReadingProgressChart";
import BookCard from "@/app/components/shared/BookCard";
import { Trophy, Flame, Library } from "lucide-react";
import api from "@/app/lib/api";
import GenrePieChart from "@/app/components/charts/GenrePieChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    api.get("/user/stats").then((res) => setStats(res.data));
    api.get("/recommendations").then((res) => setRecommendations(res.data));
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="animate-pulse font-serif italic text-stone-400">
          Unrolling the scrolls...
        </div>
      </div>
    );

  const progressPercentage = Math.min(
    (stats.booksRead / stats.goal) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-stone-800">
        {/*header*/}
        <header className="mb-12 border-l-4 border-emerald-700 pl-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
            The Reader's <span className="text-emerald-700">Ledger</span>
          </h1>
          <p className="text-stone-500 text-xs uppercase tracking-[0.4em] font-black mt-3">
            Archive Entry: {formattedDate} • Status: Active
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* left col : goals */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl shadow-stone-200/50 relative group overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-amber-200 rounded-tr-2xl" />

              <h2 className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Trophy size={14} className="text-amber-600" /> Annual Objective
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-6xl font-serif font-bold text-stone-900">
                  {stats.booksRead}
                </span>
                <span className="text-stone-400 font-serif italic text-lg">
                  / {stats.goal} volumes
                </span>
              </div>

              {/* Enhanced Progress Track */}
              <div className="relative w-full h-2 bg-stone-100 rounded-full mt-8 overflow-hidden border border-stone-200">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 shadow-[2px_0_8px_rgba(16,185,129,0.2)] transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-4 italic font-serif leading-relaxed">
                {progressPercentage >= 100
                  ? "Distinguished achievement. The archive is complete."
                  : `A total of ${
                      stats.goal - stats.booksRead
                    } volumes remain to be cataloged.`}
              </p>
            </div>

            {/* quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 border border-stone-200 p-5 rounded-2xl flex flex-col items-center group hover:bg-white transition-all shadow-sm">
                <Flame
                  className="text-orange-600 mb-2 transition-transform group-hover:scale-110"
                  size={24}
                />
                <span className="text-2xl font-serif font-bold text-stone-900">
                  12 Days
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Vigilance Streak
                </span>
              </div>
              <div className="bg-white/80 border border-stone-200 p-5 rounded-2xl flex flex-col items-center group hover:bg-white transition-all shadow-sm">
                <Library
                  className="text-amber-600 mb-2 transition-transform group-hover:scale-110"
                  size={24}
                />
                <span className="text-2xl font-serif font-bold text-stone-900">
                  {stats.totalBooks || "142"}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Total Archive
                </span>
              </div>
            </div>
          </div>

          {/* right colo : analytics */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl shadow-stone-200/50">
              <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b border-stone-100 pb-4">
                I. Literary Genre Analytics
              </h3>
              <div className="h-[280px]">
                <GenrePieChart data={stats.genres} />
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl shadow-stone-200/50">
              <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b border-stone-100 pb-4">
                II. Temporal Reading Progress
              </h3>
              <div className="h-[280px]">
                <ReadingProgressChart monthly={stats.monthly} />
              </div>
            </div>
          </div>
        </div>

        {/* recommendations */}
        <section className="mt-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-serif font-bold italic text-stone-900 whitespace-nowrap">
              Curated <span className="text-amber-700">Selection</span>
            </h2>
            <div className="h-px w-full bg-stone-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {recommendations.map((book) => (
              <div
                key={book._id}
                className="group relative transition-all duration-500 hover:-translate-y-3"
              >
                <div className="absolute inset-0 bg-stone-200/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
