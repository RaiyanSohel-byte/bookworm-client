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
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="animate-pulse font-serif italic text-stone-400">
          Cataloging your collection...
        </div>
      </div>
    );

  const shelfConfig = {
    reading: {
      label: "Currently Studying",
      icon: Glasses,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    want: {
      label: "Desired Manuscripts",
      icon: Bookmark,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    read: {
      label: "Completed Archives",
      icon: CheckCircle2,
      color: "text-stone-600",
      bg: "bg-stone-100",
      border: "border-stone-200",
    },
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden py-20 pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/*header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
              The Private <span className="text-emerald-700">Collection</span>
            </h1>
            <p className="text-stone-500 text-xs uppercase tracking-[0.4em] font-black mt-3 flex items-center gap-2">
              <Library size={14} className="text-emerald-800" /> Logged in
              Archive: 2026.01.13
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-serif font-light text-stone-300">
              {Object.values(library).flat().length}{" "}
              <span className="text-sm uppercase tracking-widest font-bold text-stone-400">
                Total Volumes
              </span>
            </span>
          </div>
        </header>

        {/* Shelf */}
        <div className="space-y-24">
          {["reading", "want", "read"].map((shelfKey) => {
            const config = shelfConfig[shelfKey];
            const books = library[shelfKey] || [];

            return (
              <section key={shelfKey} className="relative">
                <div className="flex items-center gap-4 mb-12">
                  <div
                    className={`flex items-center gap-3 px-6 py-2 rounded-full border shadow-sm ${config.bg} ${config.border} backdrop-blur-md`}
                  >
                    <config.icon className={config.color} size={18} />
                    <h2 className="text-stone-900 text-sm font-black uppercase tracking-[0.2em]">
                      {config.label}
                    </h2>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white text-stone-400 text-[10px] font-bold border border-stone-200 shadow-inner">
                      {books.length}
                    </span>
                  </div>
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-stone-200 to-transparent" />
                </div>

                {/*book grid*/}
                {books.length === 0 ? (
                  <div className="py-16 px-8 rounded-[2rem] border border-dashed border-stone-200 text-center bg-stone-50/50">
                    <p className="font-serif italic text-stone-400">
                      This shelf remains unoccupied...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                    {books.map((book, index) => (
                      <div
                        key={`${shelfKey}-${book._id || book.bookId || index}`}
                        className="group relative transition-all duration-500 hover:-translate-y-3"
                      >
                        <div
                          className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full ${config.bg}`}
                        />

                        <BookCard book={book} />

                        {/* Completion Badge */}
                        {shelfKey === "read" && (
                          <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 p-1.5 rounded-full border border-emerald-200 shadow-sm">
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
