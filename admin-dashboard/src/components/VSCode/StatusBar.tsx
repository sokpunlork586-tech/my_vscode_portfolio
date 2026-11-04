"use client";

import React from "react";
import { GitBranch, AlertCircle, AlertTriangle, Terminal, Bell, Database, Check } from "lucide-react";

interface StatusBarProps {
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export const StatusBar = React.memo(function StatusBar({
  terminalOpen,
  onToggleTerminal,
}: StatusBarProps) {
  return (
    <footer className="h-6 bg-vscode-bgDark border-t border-vscode-border px-3 flex items-center justify-between text-[11px] font-mono select-none text-vscode-textLight shrink-0 z-40">
      {/* Left side items */}
      <div className="flex items-center space-x-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <GitBranch className="w-3 h-3 text-vscode-blueActive" />
          <span>main*</span>
        </a>

        <div className="flex items-center gap-2 text-vscode-textDark">
          <span className="flex items-center gap-0.5 hover:text-white cursor-pointer">
            <AlertCircle className="w-3 h-3 text-vscode-textDark" />
            <span>0</span>
          </span>
          <span className="flex items-center gap-0.5 hover:text-white cursor-pointer">
            <AlertTriangle className="w-3 h-3 text-vscode-yellow" />
            <span>0</span>
          </span>
        </div>

        <button
          onClick={onToggleTerminal}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
            terminalOpen ? "bg-vscode-bgLight text-white" : "hover:bg-vscode-bgHover hover:text-white"
          }`}
          title="Toggle Terminal"
        >
          <Terminal className="w-3 h-3 text-vscode-blue" />
          <span>Terminal</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-vscode-border">
          <Database className="w-3 h-3 text-vscode-green" />
          <span className="text-[10px] text-vscode-green">PostgreSQL: Live</span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-3 text-vscode-textDark">
        <span className="hidden md:inline hover:text-white cursor-pointer">Ln 14, Col 2</span>
        <span className="hidden md:inline hover:text-white cursor-pointer">Spaces: 2</span>
        <span className="hidden sm:inline hover:text-white cursor-pointer">UTF-8</span>
        <span className="hover:text-white cursor-pointer text-vscode-cyan">TypeScript React</span>
        <span className="hidden lg:flex items-center gap-1 text-vscode-textLight">
          <Check className="w-3 h-3 text-vscode-blue" />
          <span>Prettier</span>
        </span>
        <button
          aria-label="Notification bell"
          className="p-1 hover:text-white rounded hover:bg-vscode-bgHover"
        >
          <Bell className="w-3 h-3 text-vscode-textLight" />
        </button>
      </div>
    </footer>
  );
});

