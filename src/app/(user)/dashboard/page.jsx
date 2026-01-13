"use client";
import { useEffect, useState } from "react";
import ReadingProgressChart from "@/app/components/charts/ReadingProgressChart";
import GenrePieChart from "@/app/components/charts/GenrePieChart";
import BookCard from "@/app/components/shared/BookCard";
import { Trophy, Flame, Library } from "lucide-react";
import api from "@/app/lib/api";

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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="animate-pulse font-serif italic text-stone-400">
          Unrolling the scrolls...
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    (stats.booksRead / stats.goal) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-stone-800">
        {/* Header */}
        <header className="mb-12 border-l-4 border-emerald-700 pl-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
            The Reader's <span className="text-emerald-700">Ledger</span>
          </h1>
          <p className="text-stone-500 text-xs uppercase tracking-[0.4em] font-black mt-3">
            Archive Entry: {formattedDate} • Status: Active
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl shadow-stone-200/50">
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

              <div className="relative w-full h-2 bg-stone-100 rounded-full mt-8 overflow-hidden border border-stone-200">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 p-5 rounded-2xl text-center">
                <Flame className="mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-serif font-bold">12 Days</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">
                  Streak
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-5 rounded-2xl text-center">
                <Library className="mx-auto text-amber-600 mb-2" />
                <div className="text-2xl font-serif font-bold">
                  {stats.totalBooks || 142}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">
                  Archive
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl">
              <h3 className="text-[10px] uppercase tracking-widest mb-6">
                Genre Analytics
              </h3>
              <div className="h-[280px]">
                <GenrePieChart data={stats.genres} />
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-8 rounded-4xl shadow-xl">
              <h3 className="text-[10px] uppercase tracking-widest mb-6">
                Reading Progress
              </h3>
              <div className="h-[280px]">
                <ReadingProgressChart monthly={stats.monthly} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Carousel */}
        <section className="mt-24 relative">
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-serif font-bold italic text-stone-900">
              Curated <span className="text-amber-700">Selection</span>
            </h2>
            <div className="h-px flex-grow bg-stone-200" />
          </div>

          {recommendations.length === 0 ? (
            <p className="italic text-stone-400">
              No recommendations available yet.
            </p>
          ) : (
            <div className="relative">
              {/* Fade edges */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#fdfbf7] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#fdfbf7] to-transparent z-10" />

              <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {recommendations.map((book, i) => (
                  <div
                    key={i + 1}
                    className="snap-start min-w-[160px] max-w-[160px] group relative transition-transform duration-300 hover:-translate-y-2"
                    title={book.reason}
                  >
                    <BookCard book={book} />
                    {book.reason && (
                      <div className="mt-2 text-[10px] text-stone-400 italic opacity-0 group-hover:opacity-100 transition-opacity">
                        {book.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
