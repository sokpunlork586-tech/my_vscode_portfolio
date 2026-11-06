"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Star } from "lucide-react";
import { Project } from "@/types";

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export const ProjectTable = React.memo(function ProjectTable({
  projects,
  loading,
  onEdit,
  onDelete,
}: ProjectTableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center bg-vscode-bgDark border border-vscode-borderLight rounded-md font-mono text-xs">
        <div className="w-6 h-6 border-2 border-vscode-blueActive border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-vscode-textDark">// Querying PostgreSQL records...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center bg-vscode-bgDark border border-vscode-borderLight rounded-md font-mono text-xs">
        <p className="font-medium text-vscode-textLight">No projects found in dataset</p>
        <p className="text-vscode-textDark mt-1">// Use New Project to register a showcase entry</p>
      </div>
    );
  }

  return (
    <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-vscode-textLight min-w-[580px]">
          <thead className="bg-vscode-bgDark border-b border-vscode-border text-vscode-textDark uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-2.5 font-medium"># Title / Slug</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">Tech Stack</th>
              <th className="px-4 py-2.5 font-medium text-center">Featured</th>
              <th className="px-4 py-2.5 font-medium text-center">Order</th>
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vscode-border">
            {projects.map((item) => (
              <tr key={item.id} className="hover:bg-vscode-bgHover/70 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-vscode-textWhite flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {item.demo_url && (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-vscode-textDark hover:text-vscode-blue transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-vscode-textDark truncate max-w-xs">{item.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-vscode-bgLight border border-vscode-borderLight text-vscode-cyan">
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  <div className="flex flex-wrap gap-1">
                    {item.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-vscode-bgLight text-vscode-yellow text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.is_featured ? (
                    <span className="inline-flex items-center text-vscode-yellow gap-1 text-[10px]">
                      <Star className="w-3 h-3 fill-vscode-yellow" />
                      <span>true</span>
                    </span>
                  ) : (
                    <span className="text-vscode-textDark">false</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-vscode-purple font-mono">{item.order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit project"
                      className="p-1 rounded text-vscode-textLight hover:text-vscode-blue hover:bg-vscode-bgLight"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Delete project"
                      className="p-1 rounded text-vscode-textLight hover:text-vscode-red hover:bg-vscode-bgLight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
