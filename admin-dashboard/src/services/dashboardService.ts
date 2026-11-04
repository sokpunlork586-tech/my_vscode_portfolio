import { api } from "./api";
import { DashboardOverview } from "@/types";

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return api.get<DashboardOverview>("/dashboard/overview");
  },
};

