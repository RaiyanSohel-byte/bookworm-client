"use client";
import { useEffect, useState } from "react";
import {
  Trash2,
  ShieldCheck,
  Plus,
  BookText,
  AlertCircle,
  X,
  Upload,
  BookOpen,
  TriangleAlert,
} from "lucide-react";
import api from "@/app/lib/api";
import ProtectedRoute from "@/app/components/routes/ProtectedRoute";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Tracks book to be deleted

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "Philosophy",
    description: "",
    cover: null,
  });

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, cover: e.target.files[0] }));
  };

  const submitBook = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("author", formData.author);
    payload.append("genre", formData.genre);
    payload.append("description", formData.description);
    if (formData.cover) payload.append("cover", formData.cover);

    const res = await api.post("/books", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setBooks((prev) => [...prev, res.data]);
    setFormData({
      title: "",
      author: "",
      genre: "Philosophy",
      description: "",
      cover: null,
    });
    setIsModalOpen(false);
  };

  const confirmStrike = async () => {
    if (!deleteId) return;
    await api.delete(`/books/${deleteId}`);
    setBooks((prev) => prev.filter((b) => b._id !== deleteId));
    setDeleteId(null);
  };

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-[#fdfbf7] py-20 pb-32 font-sans">
        <div className="max-w-6xl mx-auto px-6">
          <header className="mb-12 border-b-4 border-stone-900 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-emerald-800" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">
                  Administrative Access Granted
                </span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
                Archive{" "}
                <span className="text-stone-500 underline decoration-1 underline-offset-8">
                  Oversight
                </span>
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors border-none cursor-pointer"
            >
              <Plus size={16} />
              Index New Volume
            </button>
          </header>

          <div className="flex items-center gap-4 mb-8 bg-stone-100 border-2 border-stone-200 p-5 rounded-2xl">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-stone-300 rounded-lg">
              <BookText size={14} className="text-stone-600" />
              <span className="text-[10px] font-bold text-stone-900 uppercase tracking-tight">
                Current Records: {books.length}
              </span>
            </div>
            <p className="text-[11px] font-serif italic text-stone-500">
              Strike volumes only if they are no longer fit for the public
              collection.
            </p>
          </div>

          <div className="border-2 border-stone-900 rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    Manuscript Title
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest hidden md:table-cell border-l border-stone-800">
                    Scribe/Author
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-stone-100">
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-stone-50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-serif font-bold text-stone-900 text-xl group-hover:text-emerald-800 transition-colors">
                        {book.title}
                      </span>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell border-l border-stone-100">
                      <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                        {book.author || "Unknown Scribe"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setDeleteId(book._id)}
                        className="inline-flex items-center gap-2 text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Strike Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <div className="relative w-full max-w-md bg-[#fdfbf7] border-[6px] border-stone-900 p-10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 border-2 border-red-200 p-4 mb-6">
                  <TriangleAlert className="text-red-700" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 italic mb-2">
                  Striking Verification
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                  Archive Removal Protocol
                </p>

                <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                  Are you certain you wish to permanently strike this volume
                  from the Grand Catalog? This action cannot be undone.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={confirmStrike}
                    className="w-full bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors border-none cursor-pointer"
                  >
                    Confirm Strike
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="w-full bg-transparent text-stone-400 py-3 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors border-none cursor-pointer"
                  >
                    Keep Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full max-w-2xl bg-[#fdfbf7] border-[6px] border-stone-900 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X size={28} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="bg-amber-100 p-3 border-2 border-amber-200">
                  <BookOpen className="text-amber-800" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-stone-900 italic">
                    Indexing Form
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">
                    Formal Archive Entry
                  </p>
                </div>
              </div>

              <form className="space-y-8" onSubmit={submitBook}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Manuscript Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-stone-200 px-4 py-3 font-serif text-lg text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                      placeholder="The Divine Comedy"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Primary Scribe
                    </label>
                    <input
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-stone-200 px-4 py-3 font-serif text-lg text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                      placeholder="Dante Alighieri"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Classification
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-stone-200 px-4 py-3 font-serif text-stone-900 focus:outline-none focus:border-stone-900 appearance-none transition-colors cursor-pointer"
                    >
                      <option>Philosophy</option>
                      <option>Classic Literature</option>
                      <option>History</option>
                      <option>Poetry</option>
                      <option>Scientific Journal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Visual Cover
                    </label>
                    <label className="flex items-center justify-between w-full bg-white border-2 border-dashed border-stone-300 px-4 py-3 text-stone-400 cursor-pointer hover:border-stone-900 hover:text-stone-900 transition-all">
                      <span className="text-sm font-serif italic truncate">
                        {formData.cover
                          ? formData.cover.name
                          : "Select parchment image..."}
                      </span>
                      <Upload size={18} />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                    Manuscript Abstract
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white border-2 border-stone-200 px-4 py-4 font-serif text-stone-900 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                    placeholder="Describe the significance..."
                  />
                </div>

                <div className="flex justify-end gap-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    className="bg-stone-900 text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-colors border-none cursor-pointer"
                  >
                    Commit to Archive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
