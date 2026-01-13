"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  ShieldAlert,
  FileText,
  User,
  Book,
  TriangleAlert,
  Search,
} from "lucide-react";
import api from "@/app/lib/api";

export default function ModerateReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load official statements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reviews/${id}`, { status });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch {
      alert("Protocol Error: Status update failed.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/reviews/${deleteId}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch {
      alert("Protocol Error: Statement removal failed.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
          Syncing Registry...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <header className="border-b-4 border-stone-900 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="text-emerald-800" size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">
            Internal Oversight Level 4
          </span>
        </div>
        <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
          Censorship{" "}
          <span className="text-stone-400 underline decoration-1 underline-offset-8">
            Registry
          </span>
        </h1>
        <p className="mt-6 text-[11px] font-serif italic text-stone-500 max-w-md">
          Sanction or redact statements submitted to the public archives.
          Approved entries will be visible in the Grand Catalog.
        </p>
      </header>

      <div className="border-2 border-stone-900 bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-900 text-stone-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                Contributor
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-l border-stone-800">
                Volume
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-l border-stone-800">
                Statement Body
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-l border-stone-800">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center border-l border-stone-800">
                Directives
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="hover:bg-stone-50 transition-colors group"
              >
                <td className="px-6 py-5 align-top">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-stone-400" />
                    <span className="text-xs font-bold text-stone-900">
                      {review.user?.name || "Anon"}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-tighter">
                    {review.user?.email}
                  </span>
                </td>

                <td className="px-6 py-5 align-top border-l border-stone-50">
                  <div className="flex items-center gap-2 text-stone-900">
                    <Book size={12} className="text-stone-400" />
                    <span className="font-serif italic text-sm font-bold">
                      {review.book?.title}
                    </span>
                  </div>
                  <div className="mt-2 text-emerald-800 text-[10px] font-black">
                    GRADE: {review?.rating}/5
                  </div>
                </td>

                <td className="px-6 py-5 align-top border-l border-stone-50 max-w-xs">
                  <p className="text-sm font-serif text-stone-600 leading-relaxed italic">
                    "{review?.comment}"
                  </p>
                </td>

                <td className="px-6 py-5 align-top border-l border-stone-50">
                  <span
                    className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${
                      review.status === "approved"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        : review.status === "rejected"
                        ? "bg-red-100 text-red-900 border border-red-200"
                        : "bg-stone-100 text-stone-500 border border-stone-200"
                    }`}
                  >
                    {review.status || "Pending"}
                  </span>
                </td>

                <td className="px-6 py-5 align-top border-l border-stone-50">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => updateStatus(review._id, "approved")}
                      className="p-2 text-stone-300 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Sanction Statement"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => updateStatus(review._id, "rejected")}
                      className="p-2 text-stone-300 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                      title="Redact Statement"
                    >
                      <XCircle size={20} />
                    </button>
                    <div className="w-px h-4 bg-stone-100 mx-1" />
                    <button
                      onClick={() => setDeleteId(review._id)}
                      className="p-2 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Strike from Registry"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviews.length === 0 && (
          <div className="p-20 text-center bg-stone-50">
            <Search className="mx-auto text-stone-200 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              No statements awaiting moderation.
            </p>
          </div>
        )}
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
                Strike Entry?
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                Permanent Registry Deletion
              </p>

              <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                Are you certain this statement should be permanently struck from
                the archival records?
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmDelete}
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
    </div>
  );
}
