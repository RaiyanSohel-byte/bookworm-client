"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  X,
  Video,
  Loader2,
  ShieldCheck,
  Youtube,
  TriangleAlert,
  Link as LinkIcon,
  Play,
} from "lucide-react";
import ProtectedRoute from "@/app/components/routes/ProtectedRoute";
import toast from "react-hot-toast";
import api from "@/app/lib/api";

export default function AdminTutorials() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", url: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos");
      setVideos(res.data);
    } catch (err) {
      toast.error("Failed to sync media records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.url)
      return toast.error("Required fields missing");

    setIsProcessing(true);
    try {
      const res = await api.post("/videos", newVideo);
      setVideos([res.data, ...videos]);
      setNewVideo({ title: "", url: "" });
      setIsModalOpen(false);
      toast.success("Archival guidance indexed");
    } catch (err) {
      toast.error("Broadcast protocol failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      await api.delete(`/videos/${deleteId}`);
      setVideos(videos.filter((v) => v._id !== deleteId));
      setDeleteId(null);
      toast.success("Media record expunged");
    } catch (err) {
      toast.error("Purge protocol failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <Loader2 className="animate-spin text-stone-300 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Loading Media Index...
        </p>
      </div>
    );

  return (
    <ProtectedRoute role="admin">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-stone-900/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white border-2 border-stone-900 p-6 flex items-center gap-4 shadow-2xl animate-in zoom-in-95">
            <Loader2 className="animate-spin text-emerald-800" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">
              Processing Media Directives...
            </span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#fdfbf7] py-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <header className="mb-12 border-b-4 border-stone-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video className="text-emerald-800" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800">
                  Multimedia Guidance Oversight
                </span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight leading-none">
                Archival <span className="text-stone-400">Guidance</span>
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-stone-900 text-stone-100 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-colors shadow-xl shadow-stone-900/10"
            >
              <Plus size={16} />
              Index New Media
            </button>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const videoId = video.url.split("v=")?.[1]?.split("&")[0] || "";
              return (
                <div
                  key={video._id}
                  className="group relative bg-white border-[3px] border-stone-900 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(28,25,23,0.05)] transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="aspect-video bg-stone-100 relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title}
                      allowFullScreen
                      className="grayscale-[0.5] group-hover:grayscale-0 transition-all"
                    />
                    <button
                      onClick={() => setDeleteId(video._id)}
                      className="absolute top-4 right-4 bg-stone-900 text-stone-100 p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube size={12} className="text-red-600" />
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                        Record ID: {video._id.slice(-6)}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg italic leading-tight">
                      {video.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {videos.length === 0 && (
            <div className="border-4 border-dashed border-stone-200 rounded-3xl p-32 text-center">
              <Play className="mx-auto text-stone-200 mb-6" size={48} />
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                No multimedia assets authorized in this registry.
              </p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => !isProcessing && setIsModalOpen(false)}
            />
            <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-12 w-full max-w-2xl animate-in fade-in duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={28} />
              </button>

              <header className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 mb-2">
                  Broadcast Request Form 44-A
                </p>
                <h2 className="text-4xl font-serif font-bold text-stone-900 italic">
                  Index New Volume
                </h2>
              </header>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    Media Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Navigating the Philosophical Archives"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                    className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <LinkIcon size={12} /> Source Locator (YouTube URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    value={newVideo.url}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, url: e.target.value })
                    }
                    className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-lg focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <button
                  onClick={addVideo}
                  disabled={isProcessing}
                  className="w-full bg-stone-900 text-stone-100 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  Authorize Broadcast
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => !isProcessing && setDeleteId(null)}
            />
            <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-10 max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 border-2 border-red-200 p-4 mb-6 text-red-700">
                  <TriangleAlert size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 italic mb-2">
                  Purge Media Record?
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                  Irreversible Registry Directive
                </p>
                <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                  "This media asset will be permanently struck from the archival
                  guidance database."
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={confirmDelete}
                    disabled={isProcessing}
                    className="w-full bg-red-600 text-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing && (
                      <Loader2 className="animate-spin" size={14} />
                    )}
                    Execute Purge
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
    </ProtectedRoute>
  );
}
