"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { BookOpen, Target, TrendingUp, LibraryBig } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Image from "next/image";
import StatCard from "@/app/components/charts/StatCard";

const COLORS = ["#2f766d", "#b08968", "#7c6f64", "#a98467", "#6b705c"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/user/stats"), api.get("/recommendations")])
      .then(([statsRes, recRes]) => {
        setStats(statsRes.data);
        setRecommendations(recRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <p className="font-serif italic text-stone-400">
          Turning pages, gathering insights...
        </p>
      </div>
    );

  if (!stats) return null;

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = MONTHS.map((month, index) => {
    const found = stats.monthly.find((m) => m._id === index + 1);
    return { month, count: found ? found.count : 0 };
  });

  const genreData = stats.genres.map((g) => ({
    name: g.genre,
    value: g.count,
  }));

  const goalProgress = Math.min(
    100,
    Math.round((stats.booksRead / stats.goal) * 100)
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-36 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* HEADER */}
        <header className="border-b border-stone-200 pb-8">
          <h1 className="text-5xl font-serif font-bold italic text-stone-900">
            Reading <span className="text-emerald-700">Dashboard</span>
          </h1>
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-stone-400 mt-3">
            Your personal reading journey
          </p>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard
            icon={BookOpen}
            label="Books Read"
            value={stats.booksRead}
          />
          <StatCard
            icon={LibraryBig}
            label="Total Books"
            value={stats.totalBooks}
          />
          <StatCard icon={Target} label="Annual Goal" value={stats.goal} />
          <StatCard
            icon={TrendingUp}
            label="Goal Progress"
            value={`${goalProgress}%`}
          />
        </section>

        {/* GOAL BAR */}
        <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <h2 className="font-serif text-2xl italic mb-4 text-stone-800">
            Annual Reading Challenge
          </h2>
          <div className="w-full bg-stone-200/40 rounded-full h-4 overflow-hidden">
            <div
              className="bg-emerald-700 h-4 transition-all"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-stone-500 font-serif italic">
            {stats.booksRead} of {stats.goal} books completed
          </p>
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* MONTHLY */}
          <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-serif italic text-xl mb-6">
              Books Read Per Month
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2f766d"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* GENRES */}
          <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-serif italic text-xl mb-6">Favorite Genres</h3>

            {genreData.length === 0 ? (
              <p className="italic text-stone-400 font-serif">
                No genre data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genreData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {genreData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* RECOMMENDATIONS CAROUSEL */}
        <section className="space-y-6">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-serif font-bold italic text-stone-900">
              Recommended <span className="text-emerald-700">For You</span>
            </h2>
            <div className="h-px flex-grow bg-stone-200" />
          </div>

          {recommendations.length === 0 ? (
            <p className="italic font-serif text-stone-400">
              No recommendations available yet.
            </p>
          ) : (
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#fdfbf7] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#fdfbf7] to-transparent z-10" />

              <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {recommendations.map((book, i) => (
                  <div
                    key={i + 1}
                    className="snap-start min-w-[160px] max-w-[160px] group transition-transform hover:-translate-y-2"
                  >
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                      <Image
                        height={48}
                        width={48}
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-[220px] object-cover"
                      />
                    </div>

                    <h3 className="mt-3 font-serif font-bold italic text-stone-900 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-500">{book.author}</p>

                    {book.reason && (
                      <p className="mt-1 text-[10px] italic text-stone-400 opacity-0 group-hover:opacity-100 transition">
                        {book.reason}
                      </p>
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
