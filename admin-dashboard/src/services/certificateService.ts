import { api } from "./api";
import { Certificate } from "@/types";

export const certificateService = {
  list: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return api.get<Certificate[]>(`/certificates${params}`);
  },

  get: (id: number) => api.get<Certificate>(`/certificates/${id}`),

  create: (data: Partial<Certificate>) => api.post<Certificate>("/certificates", data),

  update: (id: number, data: Partial<Certificate>) =>
    api.put<Certificate>(`/certificates/${id}`, data),

  delete: (id: number) => api.delete<void>(`/certificates/${id}`),
};
