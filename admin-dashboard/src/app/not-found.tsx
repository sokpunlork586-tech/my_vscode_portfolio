"use client";

import React from "react";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vscode-bgDark flex flex-col items-center justify-center p-4 font-mono select-none text-xs">
      <div className="bg-vscode-bgMid border border-vscode-borderLight rounded-md p-8 text-center max-w-sm w-full">
        <FileQuestion className="w-12 h-12 text-vscode-yellow mx-auto mb-3 opacity-80" />
        <h1 className="text-sm font-bold text-vscode-textWhite tracking-wide">
          404 — FILE_NOT_FOUND
        </h1>
        <p className="text-vscode-textDark mt-1 mb-4 text-[11px]">
          // The requested route or document does not exist in workspace.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blueActive hover:bg-vscode-blue text-white rounded font-semibold text-xs shadow transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to overview.json</span>
        </a>
      </div>
    </div>
  );
}
