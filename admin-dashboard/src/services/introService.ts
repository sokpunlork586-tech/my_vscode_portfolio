import { api } from "./api";
import { IntroData } from "@/types";

export const introService = {
  async get(): Promise<IntroData> {
    return api.get<IntroData>("/intro");
  },

  async update(data: IntroData): Promise<IntroData> {
    return api.put<IntroData>("/intro", data);
  },
};

