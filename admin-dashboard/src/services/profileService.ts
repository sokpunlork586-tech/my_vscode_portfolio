import { api } from "./api";
import { ProfileData } from "@/types";

export const profileService = {
  async get(): Promise<ProfileData> {
    return api.get<ProfileData>("/profile");
  },

  async update(data: Partial<ProfileData>): Promise<ProfileData> {
    return api.put<ProfileData>("/profile", data);
  },
};

