"use client";

import React, { useState } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Trash2 } from "lucide-react";

interface IntegratedTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegratedTerminal = React.memo(function IntegratedTerminal({
  isOpen,
  onClose,
}: IntegratedTerminalProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "fastapi" | "postgres">("fastapi");

  return (
    <div
      className={`bg-vscode-bgDark flex flex-col shrink-0 select-none font-mono text-xs z-30 overflow-hidden transition-[height,opacity] duration-200 ease-ide will-change-[height,opacity] ${
        isOpen
          ? "h-44 opacity-100 border-t border-vscode-border"
          : "h-0 opacity-0 pointer-events-none border-none"
      }`}
    >
      <div className="h-44 flex flex-col w-full">
        {/* Terminal Titlebar */}
        <div className="h-8 px-3 border-b border-vscode-border flex items-center justify-between bg-vscode-bgDark shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`text-[11px] uppercase tracking-wider py-1 transition-colors ${
                activeTab === "terminal"
                  ? "text-vscode-textWhite border-b border-vscode-blueAccent font-semibold"
                  : "text-vscode-textDark hover:text-vscode-textLight"
              }`}
            >
              TERMINAL
            </button>
            <button
              onClick={() => setActiveTab("fastapi")}
              className={`text-[11px] uppercase tracking-wider py-1 flex items-center gap-1.5 transition-colors ${
                activeTab === "fastapi"
                  ? "text-vscode-textWhite border-b border-vscode-blueAccent font-semibold"
                  : "text-vscode-textDark hover:text-vscode-textLight"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-vscode-green"></span>
              FASTAPI LOG
            </button>
            <button
              onClick={() => setActiveTab("postgres")}
              className={`text-[11px] uppercase tracking-wider py-1 flex items-center gap-1.5 transition-colors ${
                activeTab === "postgres"
                  ? "text-vscode-textWhite border-b border-vscode-blueAccent font-semibold"
                  : "text-vscode-textDark hover:text-vscode-textLight"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-vscode-blue"></span>
              POSTGRESQL LOG
            </button>
          </div>

          <div className="flex items-center space-x-2 text-vscode-textDark">
            <button
              onClick={onClose}
              title="Close Panel (Ctrl+`)"
              className="p-1 hover:text-white rounded hover:bg-vscode-bgHover transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Logs Output */}
        <div className="flex-1 p-3 overflow-y-auto bg-vscode-bgMid/80 text-[11px] leading-relaxed space-y-1 font-mono text-vscode-textLight">
          {activeTab === "fastapi" && (
            <>
              <p className="text-vscode-textDark">
                <span className="text-vscode-yellow">[INFO]</span> 127.0.0.1:8000 — Application startup complete.
              </p>
              <p className="text-vscode-textDark">
                <span className="text-vscode-yellow">[INFO]</span> Uvicorn running on <span className="text-vscode-blue">http://0.0.0.0:8000</span> (Press CTRL+C to quit)
              </p>
              <p>
                <span className="text-vscode-green">200 OK</span> POST <span className="text-vscode-cyan">/api/v1/auth/login</span> (JWT Issued, Bearer HS256)
              </p>
              <p>
                <span className="text-vscode-green">200 OK</span> GET <span className="text-vscode-cyan">/api/v1/dashboard/overview</span> (HTTP/1.1)
              </p>
            </>
          )}

          {activeTab === "postgres" && (
            <>
              <p className="text-vscode-textDark">
                <span className="text-vscode-blue">[DB:PG]</span> Dialect: PostgreSQL / SQLAlchemy 2.0 ORM Engine
              </p>
              <p className="text-vscode-green">
                <span className="text-vscode-green">[HEALTH]</span> Connection pool active. 5 models synchronized (users, projects, skills, messages, metrics).
              </p>
              <p className="text-vscode-textDark">
                <span className="text-vscode-green">[READY]</span> Admin user validated and ready.
              </p>
            </>
          )}

          {activeTab === "terminal" && (
            <>
              <p className="text-vscode-textDark">Microsoft Windows [Version 10.0.26100.3458]</p>
              <p className="text-vscode-textWhite">
                PS C:\Users\Data Science\Documents\Project Done\My Portfolio 10_30_26\admin-dashboard&gt;
              </p>
              <p className="text-vscode-blue">Ready for CLI operations.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

