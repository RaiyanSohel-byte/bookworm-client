"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { User, Mail, Lock, Camera, BookOpen, Loader2 } from "lucide-react";
import AuthButton from "@/app/components/buttons/AuthButton";
import Image from "next/image";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadPhoto = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data);

      return res.data.url;
    } catch (err) {
      setError("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await api.post("/register", form);
      router.push("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      {/* Decorative Background Element: Subtle book pattern or soft gradient */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      <div className="relative bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 w-full max-w-md overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-moss"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-moss/10 p-3 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-moss" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-tight">
            BookWorm
          </h1>
          <p className="text-stone-500 text-sm mt-2 italic font-serif">
            Your personal reading sanctuary awaits
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-6 border border-red-100 text-sm animate-in fade-in slide-in-from-top-1">
            <span className="shrink-0">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              name="name"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-moss/20 focus:border-moss outline-none transition-all placeholder:text-stone-400 text-stone-700"
              onChange={handleChange}
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-moss/20 focus:border-moss outline-none transition-all placeholder:text-stone-400 text-stone-700"
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-moss/20 focus:border-moss outline-none transition-all placeholder:text-stone-400 text-stone-700"
              onChange={handleChange}
            />
          </div>

          {/* Stylized File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">
              Profile Portrait
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const url = await uploadPhoto(e.target.files[0]);
                    setForm({ ...form, photo: url });
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center gap-3 p-3 border-2 border-dashed border-stone-200 rounded-xl group-hover:border-moss/50 transition-colors bg-stone-50/50">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-stone-100">
                  {form.photo ? (
                    <Image
                      height={24}
                      width={24}
                      src={form.photo}
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <Camera className="w-5 h-5 text-stone-400" />
                  )}
                </div>
                <span className="text-sm text-stone-500 truncate">
                  {form.photo ? "Portrait uploaded!" : "Select a profile photo"}
                </span>
              </div>
            </div>
          </div>

          <AuthButton btnText="Enter the Library" loading={loading} />
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500">
            Already a member?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-moss font-bold hover:underline underline-offset-4"
            >
              Sign back in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
