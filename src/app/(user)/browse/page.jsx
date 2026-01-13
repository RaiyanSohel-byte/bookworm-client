"use client";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import BookCard from "@/app/components/shared/BookCard";
import { Search, Compass, Hash, Filter } from "lucide-react";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get(`/books?search=${query}`).then((res) => setBooks(res.data));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative py-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16 border-b-2 border-stone-200 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
                The Grand <span className="text-emerald-800">Catalog</span>
              </h1>
              <p className="text-stone-500 text-xs uppercase tracking-[0.4em] font-black mt-3 flex items-center gap-2">
                <Compass size={14} className="text-amber-700" /> Discovering New
                Knowledge
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full bg-white border-2 border-stone-200 rounded-full py-3 pl-12 pr-6 text-sm font-serif italic text-stone-800 focus:outline-none focus:border-emerald-700 transition-colors placeholder:text-stone-300"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {["Philosophy", "History", "Science", "Classic", "Poetry"].map(
            (tag) => (
              <button
                key={tag}
                className="px-4 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:border-emerald-700 hover:text-emerald-800 transition-colors"
              >
                {tag}
              </button>
            )
          )}
          <div className="w-[1px] h-6 bg-stone-200 mx-2 hidden md:block" />
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-900 bg-stone-900 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-emerald-800 hover:border-emerald-800">
            <Filter size={12} /> Detailed Filter
          </button>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-1 border-l-4 border-amber-600 bg-amber-50">
              <Hash size={14} className="text-amber-700" />
              <span className="text-stone-900 text-[10px] font-black uppercase tracking-widest">
                Current Findings: {books.length}
              </span>
            </div>
            <div className="h-[1px] flex-grow bg-stone-200" />
          </div>

          {books.length === 0 ? (
            <div className="py-24 border-2 border-dashed border-stone-200 rounded-[2rem] text-center bg-white/50">
              <p className="font-serif italic text-stone-400 text-lg">
                No manuscripts match your inquiry...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="group relative transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="border border-transparent group-hover:border-stone-200 rounded-xl transition-colors">
                    <BookCard book={book} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
