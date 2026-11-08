"use client";

import React from "react";
import {
  Files,
  Search,
  GitBranch,
  Database,
  Terminal,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resolveMediaUrl } from "@/services/api";

interface ActivityBarProps {
  explorerOpen: boolean;
  onToggleExplorer: () => void;
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export const ActivityBar = React.memo(function ActivityBar({
  explorerOpen,
  onToggleExplorer,
  terminalOpen,
  onToggleTerminal,
}: ActivityBarProps) {
  const { user, logout } = useAuth();

  const avatarSrc = resolveMediaUrl(user?.avatar_url);

  return (
    <div className="w-12 bg-vscode-bgDark border-r border-vscode-border flex flex-col justify-between py-2 items-center select-none shrink-0 z-30">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={onToggleExplorer}
          title="Explorer (Ctrl+Shift+E)"
          className={`w-full h-11 flex items-center justify-center relative transition-colors ${
            explorerOpen
              ? "text-vscode-textWhite"
              : "text-vscode-textDark hover:text-vscode-textLight"
          }`}
        >
          {explorerOpen && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-vscode-blueActive rounded-r" />
          )}
          <Files className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleTerminal}
          title="Integrated Terminal (Ctrl+`)"
          className={`w-full h-11 flex items-center justify-center relative transition-colors ${
            terminalOpen
              ? "text-vscode-textWhite"
              : "text-vscode-textDark hover:text-vscode-textLight"
          }`}
        >
          {terminalOpen && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-vscode-blueActive rounded-r" />
          )}
          <Terminal className="w-5 h-5" />
        </button>

        <button
          title="Source Control (Git)"
          className="w-full h-11 flex items-center justify-center relative text-vscode-textDark hover:text-vscode-textLight transition-colors"
        >
          <GitBranch className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-3.5 h-3.5 bg-vscode-blueActive text-[9px] font-bold text-white rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        <button
          title="PostgreSQL & FastAPI Telemetry"
          className="w-full h-11 flex items-center justify-center relative text-vscode-textDark hover:text-vscode-textLight transition-colors"
        >
          <Database className="w-5 h-5" />
          <span className="absolute bottom-2.5 right-2.5 w-2 h-2 bg-vscode-green rounded-full"></span>
        </button>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        <a
          href="/settings"
          title="Manage Settings"
          className="w-full h-11 flex items-center justify-center text-vscode-textDark hover:text-vscode-textLight transition-colors"
        >
          <Settings className="w-5 h-5" />
        </a>

        <div className="relative group w-full flex justify-center">
          <button
            title={`Logged in as ${user?.email || "Admin"}`}
            className="w-8 h-8 rounded-full bg-vscode-bgLight text-vscode-blue flex items-center justify-center text-xs font-bold border border-vscode-borderLight hover:border-vscode-blueActive transition-colors overflow-hidden"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.email || "Admin"}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.email?.charAt(0).toUpperCase() || "A"
            )}
          </button>

          {/* Quick profile popup */}
          <div className="absolute left-12 bottom-0 hidden group-hover:flex flex-col bg-vscode-bgDark border border-vscode-borderLight rounded-md shadow-2xl p-2.5 w-52 text-xs z-50">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-vscode-border">
              <div className="w-8 h-8 rounded-full bg-vscode-bgLight overflow-hidden shrink-0 border border-vscode-borderLight flex items-center justify-center text-xs font-bold text-vscode-blue">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.email || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.email?.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-vscode-textWhite font-medium truncate">{user?.full_name || user?.email}</p>
                <p className="text-[10px] text-vscode-textDark uppercase font-mono">{user?.role || "ADMIN"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="pt-1 text-vscode-red hover:underline flex items-center gap-1.5 text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

