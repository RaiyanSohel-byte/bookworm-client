"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthButton from "@/app/components/buttons/AuthButton";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
    } catch {
      setError("We couldn't find those credentials in our records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      <div className="relative bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-stone-100 w-full max-w-md">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-moss/80"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-moss/10 p-3 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-moss" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-stone-500 text-sm mt-2 italic font-serif">
            Resume your reading journey
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl mb-6 border border-red-100 text-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-widest ml-1">
              Library Card (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                placeholder="reader@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-moss/20 focus:border-moss outline-none transition-all placeholder:text-stone-300 text-stone-700"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-widest ml-1">
                Passkey
              </label>
              <button
                type="button"
                className="text-[10px] text-moss font-bold hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-moss/20 focus:border-moss outline-none transition-all placeholder:text-stone-300 text-stone-700"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <AuthButton btnText="Sign In" loading={loading} />
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500">
            New to the collection?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-moss font-bold hover:underline underline-offset-4"
            >
              Join BookWorm
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
