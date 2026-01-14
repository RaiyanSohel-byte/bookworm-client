"use client";
import Image from "next/image";
import Link from "next/link";
import { FileSearch, Bookmark, Quote } from "lucide-react";

export default function BookCard({ book }) {
  return (
    <div className="group relative bg-white border-2 border-stone-900 p-4 transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] flex flex-col h-full">
      <div className="absolute -top-3 left-4 z-10">
        <span className="bg-stone-900 text-stone-100 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
          {book?.genre}
        </span>
      </div>

      <div className="relative aspect-[3/4] overflow-hidden border border-stone-100 mb-5">
        {book?.cover && (
          <Image
            height={48}
            width={48}
            src={book?.cover}
            className="w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            alt={book?.title || "Book"}
          />
        )}

        {book.reason && (
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm p-6 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Quote className="text-emerald-500 mb-3" size={20} />
            <p className="text-white font-serif italic text-sm text-center leading-relaxed">
              "{book.reason}"
            </p>
            <div className="mt-4 w-8 h-px bg-stone-700" />
          </div>
        )}
      </div>

      <div className="space-y-1 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif line-clamp-2 font-bold text-xl text-stone-900 italic leading-tight group-hover:text-emerald-900 transition-colors">
            {book.title}
          </h3>
          <Bookmark
            size={16}
            className="text-stone-300 group-hover:text-emerald-800 transition-colors flex-shrink-0"
          />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
          Scribe:{" "}
          <span className="text-stone-600 line-clamp-1">{book.author}</span>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-stone-200">
        <Link
          href={`/browse/${book?._id || book.bookId}`}
          className="flex items-center justify-center gap-2 w-full bg-stone-50 border border-stone-200 py-3 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
        >
          <FileSearch size={14} />
          Inspect Volume
        </Link>
      </div>

      <span className="absolute bottom-2 right-4 font-mono text-[8px] text-stone-200 uppercase">
        IDX-{book._id?.slice(-4) || "0000"}
      </span>
    </div>
  );
}
