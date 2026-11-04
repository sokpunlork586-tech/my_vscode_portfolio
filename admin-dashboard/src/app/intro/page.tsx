"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Check,
  Save,
  RefreshCw,
  ExternalLink,
  Eye,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { introService } from "@/services/introService";
import { IntroData } from "@/types";

export default function IntroPage() {
  const [mainLine, setMainLine] = useState("Hi! I'm Punlork.");
  const [typedLines, setTypedLines] = useState<string[]>([
    "I'm a Developer.",
    "I'm an INTJ-T through and through.",
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live simulation state
  const [currentTypedIndex, setCurrentTypedIndex] = useState(0);

  const fetchIntro = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await introService.get();
      setMainLine(data.main_line || "Hi! I'm Punlork.");
      setTypedLines(data.typed || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load intro data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntro();
  }, [fetchIntro]);

  // Interval to cycle through phrases in the preview simulation
  useEffect(() => {
    if (typedLines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTypedIndex((prev) => (prev + 1) % typedLines.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [typedLines.length]);

  const handleAddLine = React.useCallback(() => {
    setTypedLines((prev) => [...prev, "New headline phrase..."]);
  }, []);

  const handleUpdateLine = React.useCallback((index: number, val: string) => {
    setTypedLines((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }, []);

  const handleDeleteLine = React.useCallback((index: number) => {
    setTypedLines((prev) => {
      if (prev.length <= 1) {
        alert("At least one phrase is required.");
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSave = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      await introService.update({
        main_line: mainLine,
        typed: typedLines.filter((l) => l.trim().length > 0),
      });
      setSuccessMessage("Committed & Synchronized to static.json successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to save intro data.");
    } finally {
      setSaving(false);
    }
  }, [mainLine, typedLines]);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl mx-auto font-mono text-xs">
        {/* Editor Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vscode-yellow" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              intro.json — Hero Greeter & Title Editor
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-vscode-textLight bg-vscode-bgDark border border-vscode-borderLight rounded hover:bg-vscode-bgHover hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-vscode-blue" />
              <span>Preview Live (3000)</span>
            </a>

            <button
              onClick={fetchIntro}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-vscode-textLight bg-vscode-bgDark border border-vscode-borderLight rounded hover:bg-vscode-bgHover hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>reload()</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-3 bg-vscode-green/10 border border-vscode-green/30 rounded flex items-center gap-2 text-vscode-green text-xs animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-vscode-red/10 border border-vscode-red/30 rounded flex items-center gap-2 text-vscode-red text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Split: Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Form Editor */}
          <div className="lg:col-span-7 bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-vscode-border">
              <span className="font-bold text-vscode-textWhite text-xs">// [STATIC_JSON_PAYLOAD]</span>
              <span className="text-[10px] text-vscode-textDark font-mono">vscode-portfolio/src/data/json/static.json</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* 1. Main Heading */}
              <div>
                <label className="block text-vscode-textLight mb-1 text-[11px]">
                  "mainLine": &quot;{mainLine}&quot;
                </label>
                <input
                  type="text"
                  required
                  value={mainLine}
                  onChange={(e) => setMainLine(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-2 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive transition-colors"
                  placeholder="e.g. Hi! I'm Punlork."
                />
                <p className="text-[10px] text-vscode-textDark mt-1">
                  // Main greeting header displayed at the top of the screen
                </p>
              </div>

              {/* 2. Typed lines */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-vscode-textLight text-[11px]">
                    "typed": [{typedLines.length} phrases]
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="flex items-center gap-1 text-[11px] text-vscode-blue hover:text-white px-2 py-0.5 rounded bg-vscode-bgLight hover:bg-vscode-bgHover transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Phrase</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {typedLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-vscode-textDark w-5 text-right font-mono text-[10px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        required
                        value={line}
                        onChange={(e) => handleUpdateLine(idx, e.target.value)}
                        className="flex-1 bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive transition-colors"
                        placeholder="Typewriter phrase (HTML supported)..."
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(idx)}
                        title="Delete phrase"
                        className="p-1.5 text-vscode-textDark hover:text-vscode-red rounded hover:bg-vscode-bgLight transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-vscode-textDark">
                  // Supports raw text or inline links (e.g. &lt;a href=&apos;/swe&apos;&gt;Software Engineer&lt;/a&gt;)
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-vscode-border flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Writing payload..." : "Commit & Sync to static.json"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Greeter Screen Simulation */}
          <div className="lg:col-span-5 bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-vscode-border mb-4">
                <div className="flex items-center gap-1.5 text-vscode-cyan">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-bold text-xs">// [LIVE_SIMULATION]</span>
                </div>
                <span className="text-[10px] text-vscode-textDark font-mono">VS CODE GREETER VIEW</span>
              </div>

              {/* Simulated Screen */}
              <div className="bg-[#282c34] border border-[#181a1f] rounded-lg p-6 text-center my-4 shadow-inner min-h-[180px] flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold text-white tracking-wide mb-2 font-mono">
                  {mainLine || "Hi! I'm..."}
                </h2>
                <div className="text-xs text-vscode-textLight font-mono flex items-center justify-center gap-1 min-h-[24px]">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: typedLines[currentTypedIndex] || "I'm a Developer.",
                    }}
                  />
                  <span className="w-2 h-4 bg-vscode-blue animate-pulse inline-block align-middle ml-0.5"></span>
                </div>

                {/* Dummy Buttons */}
                <div className="mt-5 flex items-center justify-center gap-2 opacity-70">
                  <span className="px-2.5 py-1 rounded bg-[#333842] text-[10px] text-vscode-textLight border border-[#3a3f4b]">
                    Follow @github
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#333842] text-[10px] text-vscode-textLight border border-[#3a3f4b]">
                    ★ Star 0
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#007acc] text-[10px] text-white">
                    ✉ Contact Me
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-vscode-inputBg rounded border border-vscode-border text-[11px] text-vscode-textDark">
              <p className="text-vscode-textLight font-semibold mb-0.5">// Instant Synchronized Pipeline:</p>
              When you click <strong>Commit & Sync</strong>, the FastAPI backend immediately updates <code className="text-vscode-yellow">static.json</code>. Next.js hot-reload updates the live showcase at port 3000 in real time!
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

