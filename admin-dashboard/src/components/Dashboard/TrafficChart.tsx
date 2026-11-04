"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MonthlyDataPoint } from "@/types";

interface TrafficChartProps {
  data: MonthlyDataPoint[];
}

export const TrafficChart = React.memo(function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 transition-colors">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-vscode-border">
        <div>
          <h2 className="text-xs font-semibold text-vscode-textWhite font-mono">
            telemetry.analytics.traffic_chart
          </h2>
          <p className="text-[11px] text-vscode-textDark font-mono">Monthly impressions & engagement trends</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-vscode-blue"></span>
            <span className="text-vscode-textLight">Pageviews</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-vscode-green"></span>
            <span className="text-vscode-textLight">Visitors</span>
          </div>
        </div>
      </div>

      <div className="h-60 w-full font-mono">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#61afef" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#61afef" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#98c379" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#98c379" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21252b" />
            <XAxis dataKey="month" stroke="#5c6370" fontSize={10} tickLine={false} />
            <YAxis stroke="#5c6370" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#21252b",
                borderColor: "#3a3f4b",
                borderRadius: "4px",
                color: "#abb2bf",
                fontFamily: "Consolas, monospace",
                fontSize: "11px",
              }}
            />
            <Area
              type="monotone"
              dataKey="pageviews"
              stroke="#61afef"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPageviews)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#98c379"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVisitors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
