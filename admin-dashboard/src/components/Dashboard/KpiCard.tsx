"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MetricItem } from "@/types";

interface KpiCardProps {
  data: MetricItem;
  icon: React.ElementType;
}

export const KpiCard = React.memo(function KpiCard({ data, icon: Icon }: KpiCardProps) {
  const isPositive = data.change >= 0;

  return (
    <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4 hover:border-vscode-blueActive transition-all duration-150 font-mono hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-vscode-textDark">// {data.title}</span>
        <div className="w-7 h-7 rounded bg-vscode-bgLight text-vscode-blue flex items-center justify-center transition-transform group-hover:scale-105">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-vscode-textWhite tracking-tight">
          {data.value}
        </span>
        {data.change !== 0 && (
          <span
            className={`inline-flex items-center text-[10px] font-semibold ${
              isPositive ? "text-vscode-green" : "text-vscode-red"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(data.change)}%
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[11px] text-vscode-textLight opacity-80">{data.description}</p>
    </div>
  );
});
