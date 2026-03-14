"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!secret.trim()) {
      setError("Enter your dashboard secret");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secret.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      router.push("/");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0e1a" }}>
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#f1f5f9] mb-1">Mission Control</h1>
          <p className="text-[#64748b] text-sm">Enter your dashboard secret to continue</p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <label className="block mb-4">
            <span className="text-xs uppercase tracking-wider text-[#64748b] mb-2 block">
              Dashboard Secret
            </span>
            <input
              type="password"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Paste your DASHBOARD_SECRET"
              className="w-full px-4 py-3 rounded-lg text-sm text-[#f1f5f9] placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-blue-500/40 font-mono"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              autoFocus
            />
          </label>

          {error && (
            <p className="text-xs text-red-400 mb-3">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !secret.trim()}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "1px solid rgba(59,130,246,0.4)",
              boxShadow: "0 0 20px rgba(59,130,246,0.2)",
            }}
          >
            {loading ? "Authenticating..." : "Unlock"}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#475569] mt-6 leading-relaxed">
          Find your secret in<br />
          <span className="font-mono text-[#64748b]">~/.config/openclaw-mission-control/.env.local</span>
        </p>
      </div>
    </div>
  );
}
