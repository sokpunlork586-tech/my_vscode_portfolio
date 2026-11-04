import { api } from "./api";
import { Skill } from "@/types";

export const skillService = {
  async list(): Promise<Skill[]> {
    return api.get<Skill[]>("/skills");
  },

  async create(data: Partial<Skill>): Promise<Skill> {
    return api.post<Skill>("/skills", data);
  },

  async update(id: number, data: Partial<Skill>): Promise<Skill> {
    return api.put<Skill>(`/skills/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/skills/${id}`);
  },
};

