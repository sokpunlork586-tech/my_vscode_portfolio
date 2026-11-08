import { api, setAuthToken, removeAuthToken } from "./api";
import { AuthResponse, User } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<User>("/users/me/avatar", formData);
  },

  async updateProfile(userId: number, data: Partial<{ full_name: string; email: string; password?: string }>): Promise<User> {
    return api.put<User>(`/users/${userId}`, data);
  },

  logout(): void {
    removeAuthToken();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  },
};


