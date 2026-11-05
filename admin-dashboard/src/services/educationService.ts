import { api } from "./api";
import { Education } from "@/types";

export const educationService = {
  list: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return api.get<Education[]>(`/education${params}`);
  },

  get: (id: number) => api.get<Education>(`/education/${id}`),

  create: (data: Partial<Education>) => api.post<Education>("/education", data),

  update: (id: number, data: Partial<Education>) =>
    api.put<Education>(`/education/${id}`, data),

  delete: (id: number) => api.delete<void>(`/education/${id}`),
};

