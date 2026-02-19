"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Brief delay for UX polish
    setTimeout(() => {
      if (login(password)) {
        router.push("/");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1C252C 0%, #0D1117 60%, #0A0F14 100%)",
        }}
      />
      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,69,190,0.12) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-xl opacity-25 blur-xl"
              style={{ background: "#FFED31" }}
            />
            <div className="relative flex items-center">
              <div className="bg-bby-yellow rounded-l-md px-4 py-2.5 font-display font-extrabold text-lg text-bby-dark tracking-tight leading-none">
                BEST
              </div>
              <div className="bg-bby-yellow rounded-r-md px-4 py-2.5 font-display font-extrabold text-lg text-bby-dark tracking-tight leading-none border-l border-black/10">
                BUY
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-white font-extrabold text-xl tracking-wide">
            Tech Debt Heatmap
          </h1>
          <p className="text-white/30 text-xs mt-2 font-body">
            Technology Strategy & Transformation
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <label className="block text-white/50 text-[11px] font-display font-bold uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter access password"
              autoFocus
              className="w-full px-4 py-3 rounded-lg text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-bby-blue/50 transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: error
                  ? "1px solid #DC2626"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#DC2626] text-xs mt-2 font-body"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-4 px-4 py-3 rounded-lg font-display font-bold text-sm text-bby-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
              style={{
                background: loading
                  ? "#FFED31"
                  : "linear-gradient(135deg, #FFED31 0%, #FFE100 100%)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 16px rgba(255,237,49,0.25)",
              }}
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-[10px] mt-6 font-body">
          All data is illustrative — intended to prompt discussion, not assert findings.
        </p>
      </motion.div>
    </div>
  );
}
