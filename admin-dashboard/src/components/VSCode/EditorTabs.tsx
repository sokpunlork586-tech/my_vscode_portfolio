"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, File } from "lucide-react";
import { useTabs } from "@/context/TabsContext";

export function EditorTabs() {
  const pathname = usePathname();
  const { openTabs, activeTab, closeTab } = useTabs();

  const handleCloseTab = (e: React.MouseEvent, tabUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    closeTab(tabUrl);
  };

  return (
    <div className="bg-vscode-bgDark border-b border-vscode-border select-none shrink-0">
      {/* Tabs Strip */}
      <div className="flex items-center overflow-x-auto no-scrollbar min-h-[36px]">
        {openTabs.length === 0 ? (
          <div className="px-4 py-2 text-[11px] text-vscode-textDark font-mono italic">
            // No open editors (Press Ctrl+B to open files from explorer)
          </div>
        ) : (
          openTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.url;

            return (
              <Link
                key={tab.name}
                href={tab.url}
                className={`h-9 flex items-center gap-2 px-3.5 border-r border-vscode-border text-xs font-mono transition-colors group relative shrink-0 ${
                  isActive
                    ? "bg-vscode-bgMid text-vscode-textWhite"
                    : "bg-vscode-bgDark text-vscode-textDark hover:bg-vscode-bgHover hover:text-vscode-textLight"
                }`}
              >
                {/* Active Tab Top Blue Indicator */}
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-vscode-blueAccent" />
                )}

                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span className="text-[11px]">{tab.name}</span>

                {/* Close 'X' Button */}
                <button
                  type="button"
                  onClick={(e) => handleCloseTab(e, tab.url)}
                  className={`p-0.5 rounded hover:bg-vscode-bgLight text-vscode-textDark hover:text-white transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  title="Close Tab (Ctrl+W)"
                >
                  <X className="w-3 h-3" />
                </button>
              </Link>
            );
          })
        )}
      </div>

      {/* Breadcrumbs Row */}
      <div className="h-6 px-4 bg-vscode-bgMid border-b border-vscode-border flex items-center text-[11px] text-vscode-textDark font-mono space-x-1.5">
        <span>admin-dashboard</span>
        <ChevronRight className="w-3 h-3 text-vscode-borderLight" />
        <span>src</span>
        {activeTab && (
          <>
            <ChevronRight className="w-3 h-3 text-vscode-borderLight" />
            <span className="text-vscode-textLight flex items-center gap-1 font-semibold">
              <activeTab.icon className={`w-3 h-3 ${activeTab.color}`} />
              {activeTab.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
