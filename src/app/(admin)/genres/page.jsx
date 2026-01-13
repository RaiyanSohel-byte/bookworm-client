"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Tag,
  TriangleAlert,
  Hash,
  Database,
} from "lucide-react";
import api from "@/app/lib/api";
import toast from "react-hot-toast";

export default function ManageGenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/genres");

      const normalized = res.data.map((g) => ({ ...g, _id: g._id.toString() }));
      setGenres(normalized);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sync taxonomies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsProcessing(true);
    try {
      if (editingId) {
        const res = await api.put(`/admin/genres/${editingId}`, { name });

        const updatedGenre = { ...res.data, _id: res.data._id.toString() };

        setGenres((prev) =>
          prev.map((g) => (g._id === editingId ? updatedGenre : g))
        );

        toast.success("Classification re-indexed");
      } else {
        const res = await api.post("/admin/genres", { name });
        const newGenre = { ...res.data, _id: res.data._id.toString() };
        setGenres((prev) => [...prev, newGenre]);
        toast.success("New taxonomy authorized");
      }

      setName("");
      setEditingId(null);
    } catch (err) {
      const msg = err.response?.data || "Registry update failed";
      toast.error(typeof msg === "string" ? msg : "Update failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (genre) => {
    setEditingId(genre._id);
    setName(genre.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmPurge = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      await api.delete(`/admin/genres/${deleteId}`);
      setGenres((prev) => prev.filter((g) => g._id !== deleteId));
      toast.success("Taxonomy purged from records");
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Purge protocol failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <Loader2 className="animate-spin text-stone-300 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Loading Taxonomies...
        </p>
      </div>
    );

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-16 px-3 lg:px-0">
      <header className="border-b-4 border-stone-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-emerald-800" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800">
              System Classification Registry
            </span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight leading-none">
            Manage{" "}
            <span className="underline decoration-1 underline-offset-8 text-stone-400">
              Genres
            </span>
          </h1>
        </div>
      </header>

      {/* Form Section */}
      <section className="relative">
        <div className="absolute -top-3 left-6 px-3 bg-[#fdfbf7] z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
            {editingId ? "Edit Protocol" : "New Entry Protocol"}
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 border-2 border-stone-900 rounded-2xl overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(28,25,23,0.05)]"
        >
          <div className="flex-1 flex items-center px-6 py-4 border-b-2 sm:border-b-0 sm:border-r-2 border-stone-900">
            <Tag size={16} className="text-stone-300 mr-4" />
            <input
              type="text"
              placeholder="Assign Taxonomy Name (e.g. Existentialism)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-transparent font-serif italic text-lg text-stone-900 focus:outline-none placeholder:text-stone-300"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !name.trim()}
            className="flex items-center justify-center gap-3 bg-stone-900 text-stone-100 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" size={16} />
            ) : editingId ? (
              <Pencil size={16} />
            ) : (
              <Plus size={16} />
            )}
            {editingId ? "Update Taxonomy" : "Authorize Entry"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
              className="bg-stone-100 text-stone-500 px-6 py-5 hover:bg-red-50 hover:text-red-700 transition-colors border-l-2 border-stone-900"
            >
              <X size={20} />
            </button>
          )}
        </form>
      </section>

      {/* List Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre) => (
          <div
            key={genre._id}
            className="group relative bg-white border-2 border-stone-900 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <Hash size={14} className="text-stone-400" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(genre)}
                    className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(genre._id)}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 italic">
                  {genre.name}
                </h3>
                <p className="text-[9px] font-mono text-stone-400 uppercase tracking-tighter mt-1">
                  REF_ID: {genre._id.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {genres.length === 0 && !loading && (
        <div className="border-2 border-dashed border-stone-200 rounded-3xl p-20 text-center">
          <Database className="mx-auto text-stone-200 mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            The Classification Index is currently empty.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => !isProcessing && setDeleteId(null)}
          />
          <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-10 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 border-2 border-red-200 p-4 mb-6">
                <TriangleAlert className="text-red-700" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 italic mb-2">
                Purge Taxonomy?
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                Registry Integrity Warning
              </p>
              <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                Purging this classification may cause cataloging errors for
                volumes currently linked to this taxonomy.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmPurge}
                  disabled={isProcessing}
                  className="w-full bg-red-600 text-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing && (
                    <Loader2 className="animate-spin" size={14} />
                  )}
                  {isProcessing
                    ? "Executing Purge..."
                    : "Confirm Purge Protocol"}
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isProcessing}
                  className="w-full bg-transparent text-stone-400 py-2 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors"
                >
                  Abort Directive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
