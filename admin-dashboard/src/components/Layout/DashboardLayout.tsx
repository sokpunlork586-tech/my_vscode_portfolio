"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "./AuthGuard";
import { WindowHeader } from "../VSCode/WindowHeader";
import { ActivityBar } from "../VSCode/ActivityBar";
import { ExplorerSidebar } from "../VSCode/ExplorerSidebar";
import { EditorTabs } from "../VSCode/EditorTabs";
import { IntegratedTerminal } from "../VSCode/IntegratedTerminal";
import { StatusBar } from "../VSCode/StatusBar";
import { useTabs } from "@/context/TabsContext";
import { Code2, Command, Terminal, FolderTree } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const pathname = usePathname();
  const { openTabs, openTab, initialAvailableTabs } = useTabs();

  const isCurrentTabOpen = openTabs.some((tab) => tab.url === pathname);

  const handleToggleExplorer = React.useCallback(() => setExplorerOpen((prev) => !prev), []);
  const handleToggleTerminal = React.useCallback(() => setTerminalOpen((prev) => !prev), []);
  const handleCloseTerminal = React.useCallback(() => setTerminalOpen(false), []);

  // Keyboard shortcut support:
  // - Ctrl+B: Toggle Explorer
  // - Ctrl+`: Toggle Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setExplorerOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AuthGuard>
      <div className="h-screen w-screen bg-vscode-bgDark flex flex-col overflow-hidden font-sans select-none">
        {/* 1. Window Title Bar */}
        <WindowHeader />

        {/* 2. Main Workbench Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Activity Bar */}
          <ActivityBar
            explorerOpen={explorerOpen}
            onToggleExplorer={handleToggleExplorer}
            terminalOpen={terminalOpen}
            onToggleTerminal={handleToggleTerminal}
          />

          {/* Explorer Sidebar */}
          <ExplorerSidebar isOpen={explorerOpen} />

          {/* Main Editor Workbench */}
          <div className="flex-1 flex flex-col min-w-0 bg-vscode-bgMid overflow-hidden">
            {/* Editor Tabs & Breadcrumbs */}
            <EditorTabs />

            {/* Scrollable Content Canvas */}
            <div className="flex-1 overflow-y-auto p-6 text-vscode-textLight">
              {isCurrentTabOpen ? (
                <div key={pathname} className="animate-pageFadeIn will-change-[transform,opacity]">
                  {children}
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center select-none animate-pageFadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-vscode-bgDark/80 border border-vscode-border flex items-center justify-center mb-4 text-vscode-blue shadow-lg">
                    <Code2 className="w-8 h-8 opacity-80" />
                  </div>
                  <h2 className="text-base font-semibold text-vscode-textWhite tracking-wide">
                    Portfolio Admin Console
                  </h2>
                  <p className="text-xs text-vscode-textDark mt-1 mb-6 font-mono">
                    All editors closed. Select a file from the Explorer or click below:
                  </p>

                  {/* Quick File Selectors */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg w-full mb-8">
                    {initialAvailableTabs.map((file) => {
                      const Icon = file.icon;
                      return (
                        <button
                          key={file.name}
                          onClick={() => openTab(file)}
                          className="flex items-center gap-2 px-3 py-2 bg-vscode-bgDark/60 hover:bg-vscode-bgHover border border-vscode-border rounded text-xs font-mono text-vscode-textLight hover:text-white transition-all active:scale-[0.98] group text-left"
                        >
                          <Icon className={`w-4 h-4 ${file.color} group-hover:scale-110 transition-transform`} />
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Keyboard Shortcuts Hint */}
                  <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-vscode-textDark pt-4 border-t border-vscode-border/50">
                    <div className="flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>Explorer:</span>
                      <kbd className="px-1.5 py-0.5 bg-vscode-bgDark border border-vscode-border rounded text-vscode-textLight">
                        Ctrl+B
                      </kbd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Terminal:</span>
                      <kbd className="px-1.5 py-0.5 bg-vscode-bgDark border border-vscode-border rounded text-vscode-textLight">
                        Ctrl+`
                      </kbd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Command className="w-3.5 h-3.5" />
                      <span>Close Tab:</span>
                      <kbd className="px-1.5 py-0.5 bg-vscode-bgDark border border-vscode-border rounded text-vscode-textLight">
                        Ctrl+W
                      </kbd>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Integrated Terminal */}
            <IntegratedTerminal
              isOpen={terminalOpen}
              onClose={handleCloseTerminal}
            />
          </div>
        </div>

        {/* 3. Bottom Status Bar */}
        <StatusBar
          terminalOpen={terminalOpen}
          onToggleTerminal={handleToggleTerminal}
        />
      </div>
    </AuthGuard>
  );
}
