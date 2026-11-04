"use client";

import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Archive, Trash2, Clock, Inbox, Eye, FileSpreadsheet } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { messageService } from "@/services/messageService";
import { Message } from "@/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [archived, setArchived] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await messageService.list(unreadOnly, archived);
      setMessages(res.items);
      setUnreadCount(res.unread_count);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, archived]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = React.useCallback(async (msg: Message) => {
    await messageService.markAsRead(msg.id, !msg.is_read);
    fetchMessages();
  }, [fetchMessages]);

  const toggleArchive = React.useCallback(async (msg: Message) => {
    await messageService.toggleArchive(msg.id, !msg.is_archived);
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = React.useCallback(async (id: number) => {
    if (confirm("Delete this inquiry record from database?")) {
      await messageService.delete(id);
      setSelectedMessage((curr) => (curr?.id === id ? null : curr));
      fetchMessages();
    }
  }, [fetchMessages]);

  const handleOpenMessage = React.useCallback(async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await messageService.markAsRead(msg.id, true);
      fetchMessages();
    }
  }, [fetchMessages]);

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-vscode-purple" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              inquiries.sql — SELECT * FROM visitor_inquiries
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setArchived(false);
                setUnreadOnly(false);
              }}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                !archived && !unreadOnly
                  ? "bg-vscode-bgLight text-vscode-textWhite border border-vscode-borderLight"
                  : "text-vscode-textDark hover:text-white"
              }`}
            >
              all_records
            </button>
            <button
              onClick={() => {
                setArchived(false);
                setUnreadOnly(true);
              }}
              className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-colors ${
                unreadOnly
                  ? "bg-vscode-bgLight text-vscode-textWhite border border-vscode-borderLight"
                  : "text-vscode-textDark hover:text-white"
              }`}
            >
              <span>unread</span>
              {unreadCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-vscode-cyan text-vscode-bgDark text-[9px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setArchived(true);
                setUnreadOnly(false);
              }}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                archived
                  ? "bg-vscode-bgLight text-vscode-textWhite border border-vscode-borderLight"
                  : "text-vscode-textDark hover:text-white"
              }`}
            >
              archived
            </button>
          </div>
        </div>

        {/* Split Screen Master-Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 bg-vscode-bgDark border border-vscode-borderLight rounded-md overflow-hidden divide-y divide-vscode-border">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-5 h-5 border-2 border-vscode-blueActive border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-vscode-textDark">// Fetching records...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="w-7 h-7 text-vscode-textDark mx-auto mb-2 opacity-50" />
                <p className="font-medium text-vscode-textLight">No rows returned for current query</p>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenMessage(item)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    selectedMessage?.id === item.id
                      ? "bg-vscode-bgLight/80 border-l-2 border-vscode-blueActive"
                      : item.is_read
                      ? "hover:bg-vscode-bgHover"
                      : "bg-vscode-bgDark hover:bg-vscode-bgHover font-semibold"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-vscode-textWhite text-xs">{item.name}</span>
                      {!item.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-vscode-cyan"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-vscode-textDark flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-vscode-blue truncate">{item.subject}</p>
                  <p className="text-[10px] text-vscode-textDark truncate mt-0.5">{item.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Details Pane */}
          <div className="lg:col-span-6 bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 min-h-[300px]">
            {selectedMessage ? (
              <div className="space-y-3.5">
                <div className="flex items-start justify-between border-b border-vscode-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-vscode-textWhite">{selectedMessage.subject}</h3>
                    <p className="text-[11px] text-vscode-textDark mt-1">
                      Author: <span className="text-vscode-textLight font-semibold">{selectedMessage.name}</span> &lt;
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-vscode-cyan hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                      &gt;
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleRead(selectedMessage)}
                      title={selectedMessage.is_read ? "Mark unread" : "Mark read"}
                      className="p-1 rounded text-vscode-textDark hover:text-vscode-blue hover:bg-vscode-bgLight"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleArchive(selectedMessage)}
                      title={selectedMessage.is_archived ? "Unarchive" : "Archive"}
                      className="p-1 rounded text-vscode-textDark hover:text-vscode-yellow hover:bg-vscode-bgLight"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      title="Delete"
                      className="p-1 rounded text-vscode-textDark hover:text-vscode-red hover:bg-vscode-bgLight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-vscode-inputBg border border-vscode-borderLight rounded p-3 text-[11px] text-vscode-textLight leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Reply via SMTP</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-vscode-textDark">
                <Eye className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-[11px]">-- Select an inquiry record above to inspect payload --</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
