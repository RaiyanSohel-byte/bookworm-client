"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  ShieldCheck,
  Plus,
  X,
  TriangleAlert,
  Pencil,
  BookOpen,
  Image as ImageIcon,
  Type,
  Layers,
} from "lucide-react";

import ProtectedRoute from "@/app/components/routes/ProtectedRoute";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "@/app/lib/api";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]); // New state for fetched genres
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editBook, setEditBook] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const emptyForm = {
    title: "",
    author: "",
    genre: "", // Initialized as empty for dynamic selection
    description: "",
    cover: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  // Updated useEffect to fetch both books and genres
  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const [booksRes, genresRes] = await Promise.all([
          api.get("/books"),
          api.get("/admin/genres"), // Assuming your endpoint for genres is /genres
        ]);
        setBooks(booksRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        toast.error("Archive sync failed");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setFormData((prev) => ({ ...prev, cover: e.target.files[0] }));

  const openCreateModal = () => {
    setEditBook(null);
    setFormData({
      ...emptyForm,
      genre: genres[0]?.name || "", // Default to first available genre
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      cover: null,
    });
    setIsModalOpen(true);
  };

  const submitBook = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      if (editBook) {
        const res = await api.put(`/books/${editBook._id}`, payload);
        setBooks((prev) =>
          prev.map((b) => (b._id === editBook._id ? res.data : b))
        );
        toast.success("Volume updated successfully");
      } else {
        const res = await api.post("/books", payload);
        setBooks((prev) => [...prev, res.data]);
        toast.success("New volume indexed");
      }

      setIsModalOpen(false);
      setEditBook(null);
      setFormData(emptyForm);
    } catch (err) {
      toast.error("Protocol Error: Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmStrike = async () => {
    setIsProcessing(true);
    try {
      await api.delete(`/books/${deleteId}`);
      setBooks((prev) => prev.filter((b) => b._id !== deleteId));
      toast.success("Volume struck from records");
      setDeleteId(null);
    } catch {
      toast.error("Strike Protocol Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-[#fdfbf7] py-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <header className="mb-12 border-b-4 border-stone-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-emerald-800" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800">
                  Level 4 Administrative Access
                </span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight leading-none">
                Archive Oversight
              </h1>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-stone-900 text-stone-100 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-colors shadow-xl shadow-stone-900/10"
            >
              <Plus size={16} />
              Index New Volume
            </button>
          </header>

          <div className="border-[3px] border-stone-900 rounded-2xl overflow-hidden bg-white shadow-[12px_12px_0px_0px_rgba(28,25,23,0.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-100 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-5">Index Title</th>
                  <th className="px-8 py-5 hidden md:table-cell border-l border-stone-800">
                    Scribe / Author
                  </th>
                  <th className="px-8 py-5 text-right border-l border-stone-800">
                    Directives
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="border-t border-stone-100 hover:bg-stone-50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-stone-100 border border-stone-200 flex-shrink-0 relative overflow-hidden">
                          {book.cover ? (
                            <Image
                              width={48}
                              height={48}
                              src={book.cover}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                              alt="cover"
                            />
                          ) : (
                            <BookOpen
                              size={16}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-300"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-stone-900 text-lg leading-tight italic">
                            {book.title}
                          </p>
                          <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase">
                            ID: {book._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell border-l border-stone-50">
                      <span className="text-stone-600 font-medium">
                        {book.author}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right border-l border-stone-50">
                      <div className="flex justify-end items-center gap-4">
                        <button
                          onClick={() => openEditModal(book)}
                          className="flex items-center gap-1.5 text-stone-400 hover:text-emerald-800 transition-colors text-[10px] font-black uppercase tracking-widest"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(book._id)}
                          className="flex items-center gap-1.5 text-stone-400 hover:text-red-700 transition-colors text-[10px] font-black uppercase tracking-widest"
                        >
                          <Trash2 size={14} />
                          Strike
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal (Unchanged) */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setDeleteId(null)}
            />
            <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-10 max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 border-2 border-red-200 p-4 mb-6">
                  <TriangleAlert className="text-red-700" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 italic mb-2">
                  Strike Entry?
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                  Permanent Record Deletion
                </p>
                <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                  "This action is irreversible. The volume will be purged from
                  the central registry."
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={confirmStrike}
                    className="w-full bg-red-600 text-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-colors"
                  >
                    Confirm Strike
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="w-full bg-transparent text-stone-400 py-2 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors"
                  >
                    Abort Directive
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update/Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={28} />
              </button>

              <header className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 mb-2">
                  Registry Form 12-B
                </p>
                <h2 className="text-4xl font-serif font-bold text-stone-900 italic">
                  {editBook ? "Update Volume" : "Index New Volume"}
                </h2>
              </header>

              <form className="space-y-8" onSubmit={submitBook}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                      <Type size={12} /> Title of Work
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="The Republic"
                      required
                      className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                      <ShieldCheck size={12} /> Primary Scribe
                    </label>
                    <input
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Plato"
                      required
                      className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <Layers size={12} /> Manuscript Classification
                  </label>
                  <div className="relative">
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Classification...
                      </option>
                      {genres.map((g) => (
                        <option key={g._id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow for the Select box */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <div className="border-t-4 border-l-4 border-r-4 border-t-stone-900 border-l-transparent border-r-transparent"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <BookOpen size={12} /> Manuscript Abstract
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter the foundational premise..."
                    className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <ImageIcon size={12} /> Visual Identifier (Cover)
                  </label>
                  <div className="relative border-2 border-dashed border-stone-200 p-8 text-center bg-white group hover:border-stone-900 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className="text-[11px] font-mono text-stone-400 uppercase group-hover:text-stone-900">
                      {formData.cover
                        ? formData.cover.name
                        : "Select File for Archival Upload"}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-stone-900 text-stone-100 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-800 transition-all disabled:bg-stone-400"
                >
                  {isProcessing
                    ? "Processing Protocol..."
                    : editBook
                    ? "Finalize Update"
                    : "Authorize Creation"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
