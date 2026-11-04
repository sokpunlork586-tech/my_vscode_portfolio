import { api } from "./api";
import { Message, MessageListResponse } from "@/types";

export const messageService = {
  async list(unreadOnly = false, archived = false): Promise<MessageListResponse> {
    const params = new URLSearchParams();
    if (unreadOnly) params.set("unread_only", "true");
    if (archived) params.set("archived", "true");
    return api.get<MessageListResponse>(`/messages?${params.toString()}`);
  },

  async markAsRead(id: number, isRead: boolean): Promise<Message> {
    return api.patch<Message>(`/messages/${id}`, { is_read: isRead });
  },

  async toggleArchive(id: number, isArchived: boolean): Promise<Message> {
    return api.patch<Message>(`/messages/${id}`, { is_archived: isArchived });
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/messages/${id}`);
  },
};

