"use client";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import BookCard from "@/app/components/shared/BookCard";
import { Search, Compass, Hash, Filter, XCircle } from "lucide-react";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");
  const [loading, setLoading] = useState(false);

  // New filters
  const [ratingRange, setRatingRange] = useState([0, 5]); // min-max rating
  const [sortBy, setSortBy] = useState(""); // "rating" or "most_shelved"

  const limit = 10;

  // Fetch genres
  useEffect(() => {
    api
      .get("/admin/genres")
      .then((res) => setGenres(res.data))
      .catch(() => console.error("Failed to fetch genres"));
  }, []);

  // Fetch books whenever page, query, genre, ratingRange, or sort changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = `/books?page=${page}&limit=${limit}`;
        if (query) url += `&search=${encodeURIComponent(query)}`;
        if (activeGenre) url += `&genre=${encodeURIComponent(activeGenre)}`;
        if (ratingRange)
          url += `&ratingMin=${ratingRange[0]}&ratingMax=${ratingRange[1]}`;
        if (sortBy) url += `&sort=${sortBy}`;

        const res = await api.get(url);
        setBooks(res.data.books);
        setTotalBooks(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [query, activeGenre, page, ratingRange, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setActiveGenre("");
    setRatingRange([0, 5]);
    setSortBy("");
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative py-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
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

            <div className="relative w-full md:w-96">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full bg-white border-2 border-stone-200 rounded-full py-3 pl-12 pr-6 text-sm font-serif italic text-stone-800 focus:outline-none focus:border-emerald-700 transition-colors placeholder:text-stone-300"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12 items-center">
          {/* Genres */}
          {genres.map((g) => (
            <button
              key={g._id}
              onClick={() => {
                setActiveGenre(activeGenre === g.name ? "" : g.name);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full border border-stone-200 text-[10px] font-black uppercase tracking-widest transition-colors ${
                activeGenre === g.name
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "bg-stone-50 text-stone-500 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              {g.name}
            </button>
          ))}

          {/* Rating filter */}
          <div className="flex items-center gap-2 px-4 py-1 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest">
            <span>Rating:</span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={ratingRange[0]}
              onChange={(e) =>
                setRatingRange([Number(e.target.value), ratingRange[1]])
              }
              className="w-12 text-center border rounded"
            />
            <span>-</span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={ratingRange[1]}
              onChange={(e) =>
                setRatingRange([ratingRange[0], Number(e.target.value)])
              }
              className="w-12 text-center border rounded"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-1.5 rounded-full border border-stone-200 text-[10px] font-black uppercase tracking-widest"
          >
            <option value="">Sort By</option>
            <option value="rating">Rating</option>
            <option value="most_shelved">Most Shelved</option>
          </select>

          {/* Reset */}
          {(activeGenre ||
            query ||
            sortBy ||
            ratingRange[0] !== 0 ||
            ratingRange[1] !== 5) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-red-600 text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors"
            >
              <XCircle size={14} /> Reset Filter
            </button>
          )}
        </div>

        {/* Books Grid */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-1 border-l-4 border-amber-600 bg-amber-50">
              <Hash size={14} className="text-amber-700" />
              <span className="text-stone-900 text-[10px] font-black uppercase tracking-widest">
                Current Findings: {totalBooks}
              </span>
            </div>
            <div className="h-[1px] flex-grow bg-stone-200" />
          </div>

          {loading ? (
            <div className="py-24 text-center text-stone-400 font-serif italic">
              Loading manuscripts...
            </div>
          ) : books.length === 0 ? (
            <div className="py-24 border-2 border-dashed border-stone-200 rounded-[2rem] text-center bg-white/50">
              <p className="font-serif italic text-stone-400 text-lg">
                No manuscripts match your inquiry...
              </p>
            </div>
          ) : (
            <>
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

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border bg-stone-100 hover:bg-stone-200 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded border ${
                      page === i + 1
                        ? "bg-emerald-800 text-white border-emerald-800"
                        : "bg-stone-50 text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="px-3 py-1 rounded border bg-stone-100 hover:bg-stone-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
