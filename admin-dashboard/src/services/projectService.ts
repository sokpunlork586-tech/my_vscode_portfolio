import { api } from "./api";
import { Project, ProjectListResponse } from "@/types";

export const projectService = {
  async list(page = 1, pageSize = 10, search = "", category = "All"): Promise<ProjectListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);

    return api.get<ProjectListResponse>(`/projects?${params.toString()}`);
  },

  async getById(id: number): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  },

  async create(data: Partial<Project>): Promise<Project> {
    return api.post<Project>("/projects", data);
  },

  async update(id: number, data: Partial<Project>): Promise<Project> {
    return api.put<Project>(`/projects/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/projects/${id}`);
  },
};

