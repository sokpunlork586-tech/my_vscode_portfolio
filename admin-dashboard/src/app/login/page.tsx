"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Code2, Lock, Mail, ArrowRight, AlertCircle, Minus, Square, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vscode-bgDark flex flex-col font-mono select-none">
      {/* Top Simulated VS Code Title Bar */}
      <div className="h-8 bg-vscode-bgDark border-b border-vscode-border flex items-center justify-between px-3 text-xs select-none">
        <div className="flex items-center gap-2 text-vscode-blue">
          <Code2 className="w-4 h-4 text-vscode-blueActive" />
          <span className="text-[11px] text-vscode-textLight">Visual Studio Code</span>
        </div>
        <div className="text-[11px] text-vscode-textDark">Authentication - Sign In</div>
        <div className="flex items-center text-vscode-textDark">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-vscode-bgHover">
            <Minus className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-vscode-bgHover">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-rose-600 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Login Workbench */}
      <div className="flex-1 flex items-center justify-center p-4 bg-vscode-bgMid">
        <div className="w-full max-w-sm bg-vscode-bgDark border border-vscode-borderLight rounded-md p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded bg-vscode-bgLight text-vscode-blue flex items-center justify-center mx-auto mb-2 border border-vscode-borderLight">
              <Code2 className="w-6 h-6 text-vscode-blueActive" />
            </div>
            <h1 className="text-sm font-bold text-vscode-textWhite tracking-wide">
              ADMIN WORKBENCH
            </h1>
            <p className="text-[11px] text-vscode-textDark mt-1">
              // Authenticate session via FastAPI token service
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-vscode-red/10 border border-vscode-red/30 rounded flex items-center gap-2 text-vscode-red text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// username_or_email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-vscode-textDark absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// secret_key</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-vscode-textDark absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue shadow transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
