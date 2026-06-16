"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      toast.success("Login successful! Redirecting...");
      setTimeout(() => { window.location.href = "/"; }, 1000);
    }
  }

  const inputCls =
    "w-full h-11 pl-10 pr-4 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors bg-white";
  const inputStyle = { border: "1.5px solid #d0eded" };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f0fafa" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/Monaax.png" alt="Monaax" width={150} height={44} priority className="object-contain" />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Order Tracker
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8 space-y-5"
          style={{ border: "1.5px solid #d0eded", boxShadow: "0 4px 24px rgba(43,188,188,0.08)" }}
        >
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#0D2B2B" }}>
              Welcome back
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ backgroundColor: "#2BBCBC" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          💍 Monaax © 2026
        </p>
      </div>
    </div>
  );
}
