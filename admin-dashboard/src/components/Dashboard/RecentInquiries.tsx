"use client";

import React from "react";
import Link from "next/link";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Message } from "@/types";

interface RecentInquiriesProps {
  messages: Message[];
}

export const RecentInquiries = React.memo(function RecentInquiries({ messages }: RecentInquiriesProps) {
  return (
    <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 flex flex-col font-mono text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-vscode-border">
        <div>
          <h2 className="text-xs font-semibold text-vscode-textWhite">
            inbox.inquiries.recent
          </h2>
          <p className="text-[10px] text-vscode-textDark">Visitor contact transmissions</p>
        </div>
        <Link
          href="/messages"
          className="text-[11px] text-vscode-blue hover:underline flex items-center gap-1"
        >
          <span>view_all()</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-vscode-border flex-1">
        {messages.length === 0 ? (
          <p className="text-[11px] text-vscode-textDark py-6 text-center">/* No pending inquiries */</p>
        ) : (
          messages.slice(0, 4).map((msg) => (
            <div key={msg.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.is_read
                      ? "bg-vscode-bgLight text-vscode-textDark"
                      : "bg-vscode-blueActive/20 text-vscode-blue border border-vscode-blueActive/30"
                  }`}
                >
                  <Mail className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold text-vscode-textWhite truncate">{msg.name}</p>
                    {!msg.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-vscode-cyan"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-vscode-blue truncate">{msg.subject}</p>
                  <p className="text-[10px] text-vscode-textDark truncate max-w-xs">{msg.message}</p>
                </div>
              </div>

              <div className="text-[10px] text-vscode-textDark flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
