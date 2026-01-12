"use client";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import BookCard from "@/app/components/shared/BookCard";
import { Bookmark, Glasses, CheckCircle2, Library } from "lucide-react";

export default function MyLibrary() {
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    api.get("/library").then((res) => setLibrary(res.data));
  }, []);

  if (!library)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <div className="animate-pulse font-serif italic text-stone-600">
          Cataloging your collection...
        </div>
      </div>
    );

  const shelfConfig = {
    want: {
      label: "Desired Manuscripts",
      icon: Bookmark,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    reading: {
      label: "Currently Studying",
      icon: Glasses,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    read: {
      label: "Completed Archives",
      icon: CheckCircle2,
      color: "text-stone-400",
      bg: "bg-stone-400/10",
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] relative overflow-hidden py-20 pb-20">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/*header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/60 pb-8">
          <div>
            <h1 className="text-5xl font-serif font-bold text-stone-100 italic tracking-tight">
              The Private <span className="text-emerald-600">Collection</span>
            </h1>
            <p className="text-stone-500 text-xs uppercase tracking-[0.4em] font-black mt-3 flex items-center gap-2">
              <Library size={14} /> Logged in Archive: 2026.01.13
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-serif font-light text-stone-700">
              {Object.values(library).flat().length}{" "}
              <span className="text-sm uppercase tracking-widest font-bold">
                Total Volumes
              </span>
            </span>
          </div>
        </header>

        {/* shelf */}
        <div className="space-y-20">
          {["reading", "want", "read"].map((shelfKey) => {
            const config = shelfConfig[shelfKey];

            const books = library[shelfKey] || [];

            return (
              <section key={shelfKey} className="relative">
                <div className="flex items-center gap-4 mb-10">
                  <div
                    className={`flex items-center gap-3 px-6 py-2 rounded-full border border-stone-800/60 ${config.bg} backdrop-blur-md shadow-xl`}
                  >
                    <config.icon className={config.color} size={18} />
                    <h2 className="text-stone-100 text-sm font-black uppercase tracking-[0.2em]">
                      {config.label}
                    </h2>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-stone-900 text-stone-500 text-[10px] font-bold border border-stone-800">
                      {books.length}
                    </span>
                  </div>
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-stone-800/80 to-transparent" />
                </div>

                {/* Empty State */}
                {books.length === 0 ? (
                  <div className="py-12 px-8 rounded-[2rem] border border-dashed border-stone-800/60 text-center">
                    <p className="font-serif italic text-stone-600">
                      This shelf remains unoccupied...
                    </p>
                  </div>
                ) : (
                  // book grid
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {books.map((book) => (
                      <div
                        key={book._id}
                        className="group relative transition-all duration-500 hover:-translate-y-3"
                      >
                        <div
                          className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-10 transition-opacity rounded-full ${config.bg}`}
                        />

                        <BookCard book={book} />

                        {shelfKey === "read" && (
                          <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 p-1 rounded-full backdrop-blur-md border border-emerald-500/30">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
