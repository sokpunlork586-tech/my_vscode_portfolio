import { api } from "./api";
import { Experience } from "@/types";

export const experienceService = {
  list: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return api.get<Experience[]>(`/experience${params}`);
  },

  get: (id: number) => api.get<Experience>(`/experience/${id}`),

  create: (data: Partial<Experience>) => api.post<Experience>("/experience", data),

  update: (id: number, data: Partial<Experience>) =>
    api.put<Experience>(`/experience/${id}`, data),

  delete: (id: number) => api.delete<void>(`/experience/${id}`),
};

