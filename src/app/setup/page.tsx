"use client";

import { useState, useEffect } from "react";

interface Detection {
  binary: string | null;
  workspace: string | null;
  token: string | null;
  gatewayReachable: boolean;
}

export default function SetupPage() {
  const [orgName, setOrgName] = useState("");
  const [detection, setDetection] = useState<Detection | null>(null);
  const [detecting, setDetecting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveResult, setSaveResult] = useState<{ binary: boolean; workspace: boolean; token: boolean } | null>(null);
  const [error, setError] = useState("");

  // Auto-detect gateway on mount
  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data: Detection) => {
        setDetection(data);
        setDetecting(false);
      })
      .catch(() => {
        setDetection({ binary: null, workspace: null, token: null, gatewayReachable: false });
        setDetecting(false);
      });
  }, []);

  const handleSave = async () => {
    const trimmed = orgName.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save configuration");
        return;
      }

      setSaveResult(data.detected || null);
      setSaved(true);
    } catch {
      setError("Could not reach the server");
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────

  if (saved) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <div className="text-center max-w-md px-6">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">You&apos;re all set!</h1>
          <p className="text-[#94a3b8] text-sm mb-6">
            Configuration saved. Restart the server to apply changes.
          </p>

          {/* Detection results */}
          {saveResult && (
            <div
              className="rounded-lg p-4 mb-4 text-left text-xs space-y-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${saveResult.binary ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-[#94a3b8]">OpenClaw binary</span>
                <span className={`ml-auto ${saveResult.binary ? "text-green-400" : "text-[#64748b]"}`}>
                  {saveResult.binary ? "Auto-configured" : "Not found"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${saveResult.workspace ? "bg-green-400" : "bg-amber-400"}`} />
                <span className="text-[#94a3b8]">Workspace</span>
                <span className={`ml-auto ${saveResult.workspace ? "text-green-400" : "text-[#64748b]"}`}>
                  {saveResult.workspace ? "Auto-configured" : "Using default"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${saveResult.token ? "bg-green-400" : "bg-amber-400"}`} />
                <span className="text-[#94a3b8]">Gateway token</span>
                <span className={`ml-auto ${saveResult.token ? "text-green-400" : "text-[#64748b]"}`}>
                  {saveResult.token ? "Auto-configured" : "Set manually later"}
                </span>
              </div>
            </div>
          )}

          <div
            className="rounded-lg p-4 text-left font-mono text-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-[#64748b] mb-1"># Restart with:</p>
            <p className="text-[#3b82f6]">mission-control dev</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Setup form ──────────────────────────────────────────────

  const gatewayFound = detection?.gatewayReachable ?? false;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0e1a" }}>
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#3b82f6",
            }}
          >
            MC
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-1">Mission Control</h1>
          <p className="text-[#64748b] text-sm">Set up your AI operations command center</p>
        </div>

        {/* Setup Card */}
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Org Name Input */}
          <label className="block mb-4">
            <span className="text-xs uppercase tracking-wider text-[#64748b] mb-2 block">
              Organization Name
            </span>
            <input
              type="text"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Acme Corp"
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg text-sm text-[#f1f5f9] placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-blue-500/40"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              autoFocus
            />
          </label>

          {/* Gateway Detection Status */}
          <div
            className="rounded-lg px-4 py-3 mb-4 space-y-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${detecting ? "bg-amber-400 animate-pulse" : gatewayFound ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-xs font-medium text-[#94a3b8]">OpenClaw Binary</span>
              <span className={`ml-auto text-xs ${detecting ? "text-amber-400" : gatewayFound ? "text-green-400" : "text-red-400"}`}>
                {detecting ? "Scanning..." : gatewayFound ? "Found" : "Not found"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${detecting ? "bg-amber-400 animate-pulse" : detection?.workspace ? "bg-green-400" : "bg-amber-400"}`} />
              <span className="text-xs font-medium text-[#94a3b8]">Workspace</span>
              <span className={`ml-auto text-xs ${detecting ? "text-amber-400" : detection?.workspace ? "text-green-400" : "text-[#64748b]"}`}>
                {detecting ? "Scanning..." : detection?.workspace ? "Found" : "Will use default"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${detecting ? "bg-amber-400 animate-pulse" : detection?.token ? "bg-green-400" : "bg-amber-400"}`} />
              <span className="text-xs font-medium text-[#94a3b8]">Gateway Token</span>
              <span className={`ml-auto text-xs ${detecting ? "text-amber-400" : detection?.token ? "text-green-400" : "text-[#64748b]"}`}>
                {detecting ? "Scanning..." : detection?.token ? "Auto-detected" : "Not detected"}
              </span>
            </div>

            {!detecting && !gatewayFound && (
              <p className="text-[10px] text-[#64748b] pt-1 leading-relaxed">
                OpenClaw not found on this machine. The dashboard will run with demo data until you connect a gateway.
              </p>
            )}
            {!detecting && gatewayFound && (
              <p className="text-[10px] text-green-400/70 pt-1 leading-relaxed">
                Gateway detected — will auto-configure on save.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 mb-3">{error}</p>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !orgName.trim()}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "1px solid rgba(59,130,246,0.4)",
              boxShadow: "0 0 20px rgba(59,130,246,0.2)",
            }}
          >
            {saving ? "Configuring..." : "Save & Launch"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#475569] mt-6">
          You can change these settings later in System
        </p>
      </div>
    </div>
  );
}
