"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Play,
  Clapperboard,
  Youtube,
  Library,
  ChevronRight,
} from "lucide-react";
import api from "@/app/lib/api";

const Tutorials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse bg-[#fdfbf7]">
        <Loader2 className="animate-spin text-stone-300 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Synchronizing Media Stream...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-40">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16 border-b-4 border-stone-900 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <Clapperboard className="text-emerald-800" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800">
              Visual Chronicles & Learning
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 italic tracking-tight leading-tight">
            Archival{" "}
            <span className="text-stone-400 underline decoration-stone-200 underline-offset-8">
              Guidance
            </span>
          </h1>
          <p className="mt-6 text-stone-500 font-serif italic text-lg max-w-2xl leading-relaxed">
            A curated collection of visual records, expert recommendations, and
            instructional discourses to aid your journey through the Grand
            Archive.
          </p>
        </header>

        {!videos.length ? (
          <div className="border-4 border-dashed border-stone-200 rounded-3xl p-24 text-center">
            <Library className="mx-auto text-stone-200 mb-6" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              No multimedia guidance assets available at this cycle.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video) => {
              const videoId = video.url.split("v=")?.[1]?.split("&")[0] || "";
              return (
                <div
                  key={video._id}
                  className="group relative flex flex-col bg-white border-[3px] border-stone-900 rounded-2xl overflow-hidden shadow-[10px_10px_0px_0px_rgba(28,25,23,0.05)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="aspect-video bg-stone-900 relative overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title}
                      allowFullScreen
                      className="grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 pointer-events-none border-b-[3px] border-stone-900" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-50 p-1.5 rounded">
                          <Youtube size={14} className="text-red-600" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                          Broadcast Record
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-stone-300 group-hover:text-stone-900 transition-colors"
                      />
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-900 italic leading-snug group-hover:text-emerald-900 transition-colors">
                      {video.title}
                    </h3>

                    <div className="mt-auto pt-6 flex items-center gap-3">
                      <div className="h-[1px] flex-1 bg-stone-100" />
                      <Play
                        size={12}
                        className="text-stone-300 fill-stone-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <footer className="mt-24 pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
            © 2026 Grand Archive Multimedia Registry
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-stone-900 cursor-help transition-colors">
              Documentation
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-stone-900 cursor-help transition-colors">
              Protocol
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Tutorials;
