"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Users,
  FolderGit2,
  Mail,
  Cpu,
  RefreshCw,
  Plus,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { KpiCard } from "@/components/Dashboard/KpiCard";
import { RecentInquiries } from "@/components/Dashboard/RecentInquiries";
import { dashboardService } from "@/services/dashboardService";
import { messageService } from "@/services/messageService";
import { DashboardOverview, Message } from "@/types";

const TrafficChart = dynamic(
  () => import("@/components/Dashboard/TrafficChart").then((mod) => mod.TrafficChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 flex items-center justify-center font-mono text-xs text-vscode-textDark">
        // Loading telemetry chart...
      </div>
    ),
  }
);

export default function DashboardOverviewPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const [overviewRes, msgRes] = await Promise.all([
        dashboardService.getOverview(),
        messageService.list(),
      ]);
      setData(overviewRes);
      setRecentMessages(msgRes.items || []);
    } catch (err) {
      console.error("Failed to load dashboard overview:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto font-mono">
        {/* Editor Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <span className="text-vscode-yellow text-sm font-bold">{`{ }`}</span>
            <h1 className="text-sm font-bold text-vscode-textWhite">
              overview.json — System Telemetry & Statistics
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-vscode-textLight bg-vscode-bgDark border border-vscode-borderLight rounded hover:bg-vscode-bgHover hover:text-white transition-all active:scale-[0.98]"
            >
              <ExternalLink className="w-3 h-3 text-vscode-blue" />
              <span>Public Showcase (3000)</span>
            </a>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-vscode-textLight bg-vscode-bgDark border border-vscode-borderLight rounded hover:bg-vscode-bgHover hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
              <span>sync()</span>
            </button>

            <Link
              href="/projects"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-all active:scale-[0.98]"
            >
              <Plus className="w-3 h-3" />
              <span>New Project</span>
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-vscode-bgDark border border-vscode-borderLight rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : (
          data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard data={data.metrics.visitors} icon={Users} />
              <KpiCard data={data.metrics.projects} icon={FolderGit2} />
              <KpiCard data={data.metrics.inquiries} icon={Mail} />
              <KpiCard data={data.metrics.skills} icon={Cpu} />
            </div>
          )
        )}

        {/* Traffic Chart and Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-[326px] bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 animate-pulse flex flex-col justify-between">
                <div className="h-4 w-48 bg-vscode-bgLight rounded mb-4" />
                <div className="h-56 w-full bg-vscode-bgLight/40 rounded" />
              </div>
            ) : (
              data && <TrafficChart data={data.traffic_trends} />
            )}
          </div>
          <div className="lg:col-span-1">
            {loading ? (
              <div className="h-[326px] bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 animate-pulse space-y-3">
                <div className="h-4 w-36 bg-vscode-bgLight rounded" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-vscode-bgLight/40 rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <RecentInquiries messages={recentMessages} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
