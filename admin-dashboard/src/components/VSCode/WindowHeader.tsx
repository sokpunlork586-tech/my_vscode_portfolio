"use client";

import React from "react";
import { Code2, Minus, Square, X } from "lucide-react";

export const WindowHeader = React.memo(function WindowHeader() {
  const menus = ["File", "Edit", "Selection", "View", "Go", "Terminal", "Help"];

  return (
    <div className="h-8 bg-vscode-bgDark border-b border-vscode-border flex items-center justify-between px-3 text-xs select-none z-40 shrink-0">
      {/* Left: VS Code Icon & Menus */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-vscode-blue">
          <Code2 className="w-4 h-4 text-vscode-blueActive" />
        </div>

        <div className="hidden md:flex items-center space-x-1 text-vscode-textLight">
          {menus.map((menu) => (
            <button
              key={menu}
              type="button"
              className="px-2 py-0.5 rounded text-[11px] hover:bg-vscode-bgHover hover:text-vscode-textWhite transition-colors"
            >
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Window Title */}
      <div className="text-[11px] text-vscode-textMid truncate font-mono tracking-wide opacity-80 px-2 text-center">
        <span>admin-dashboard</span>
        <span className="hidden sm:inline"> — Visual Studio Code</span>
        <span className="hidden md:inline"> [Administrator]</span>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center">
        <button
          aria-label="Minimize"
          className="w-8 h-8 flex items-center justify-center text-vscode-textLight hover:bg-vscode-bgHover hover:text-white transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          aria-label="Maximize"
          className="w-8 h-8 flex items-center justify-center text-vscode-textLight hover:bg-vscode-bgHover hover:text-white transition-colors"
        >
          <Square className="w-2.5 h-2.5" />
        </button>
        <button
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center text-vscode-textLight hover:bg-rose-600 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

