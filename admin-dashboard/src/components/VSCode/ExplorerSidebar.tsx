"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileJson,
  FileSpreadsheet,
  Settings2,
  Folder,
  FolderOpen,
  Sparkles,
  User,
} from "lucide-react";
import { useTabs, EditorTab } from "@/context/TabsContext";

interface ExplorerSidebarProps {
  isOpen: boolean;
}

const workspaceFiles: (EditorTab & { badge?: string })[] = [
  { name: "overview.json", url: "/", icon: FileJson, color: "text-vscode-yellow" },
  { name: "intro.json", url: "/intro", icon: Sparkles, color: "text-vscode-yellow", badge: "Hero" },
  { name: "profile.json", url: "/profile", icon: User, color: "text-vscode-purple", badge: "Sidebar" },
  { name: "projects.tsx", url: "/projects", icon: FileCode, color: "text-vscode-cyan" },
  { name: "skills.ts", url: "/skills", icon: FileCode, color: "text-vscode-blue" },
  { name: "inquiries.sql", url: "/messages", icon: FileSpreadsheet, color: "text-vscode-purple", badge: "Live" },
  { name: "settings.env", url: "/settings", icon: Settings2, color: "text-vscode-green" },
];

export const ExplorerSidebar = React.memo(function ExplorerSidebar({
  isOpen,
}: ExplorerSidebarProps) {
  const [folderOpen, setFolderOpen] = useState(true);
  const pathname = usePathname();
  const { openTab, activeTab } = useTabs();

  return (
    <aside
      className={`bg-vscode-bgDark flex flex-col select-none shrink-0 text-xs overflow-hidden transition-[width,opacity] duration-200 ease-ide will-change-[width,opacity] ${
        isOpen
          ? "w-56 opacity-100 border-r border-vscode-border"
          : "w-0 opacity-0 pointer-events-none border-none"
      }`}
    >
      <div className="w-56 flex flex-col h-full min-h-0">
        {/* Explorer Title */}
        <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold text-vscode-textLight uppercase tracking-wider border-b border-vscode-border">
          <span>Explorer</span>
          <span className="text-[10px] text-vscode-textDark font-mono">WORKSPACE</span>
        </div>

        {/* Workspace Folder Tree */}
        <div className="py-1">
          <button
            onClick={() => setFolderOpen(!folderOpen)}
            className="w-full flex items-center gap-1.5 px-2 py-1 text-vscode-textWhite font-semibold hover:bg-vscode-bgHover text-[11px] transition-colors"
          >
            {folderOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-vscode-textDark" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-vscode-textDark" />
            )}
            {folderOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-vscode-yellow" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-vscode-yellow" />
            )}
            <span className="tracking-wide">ADMIN-WORKSPACE</span>
          </button>

          {folderOpen && (
            <div className="mt-0.5 space-y-0.5 pl-3">
              {workspaceFiles.map((file) => {
                const Icon = file.icon;
                const isActive = activeTab?.url === file.url;

                return (
                  <button
                    key={file.name}
                    onClick={() => openTab(file)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-sm text-xs transition-all duration-150 text-left active:scale-[0.99] ${
                      isActive
                        ? "bg-vscode-bgHover text-vscode-textWhite font-medium border-l-2 border-vscode-blueActive shadow-xs"
                        : "text-vscode-textLight hover:text-vscode-textWhite hover:bg-vscode-bgHover/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 ${file.color}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                    {file.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-vscode-blueActive/20 text-vscode-blue font-mono">
                        {file.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Outline Section */}
        <div className="mt-auto border-t border-vscode-border p-3 text-vscode-textDark text-[11px]">
          <div className="flex items-center justify-between">
            <span>PORTFOLIO v2.0</span>
            <span className="text-vscode-green font-mono text-[10px]">FASTAPI: ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
});
