"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, FileCode } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ProjectTable } from "@/components/Projects/ProjectTable";
import { ProjectModal } from "@/components/Projects/ProjectModal";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";

const CATEGORIES = ["All", "Web App", "Full Stack", "Mobile", "AI / ML"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectService.list(page, 10, search, category);
      setProjects(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleSave = React.useCallback(async (data: Partial<Project>) => {
    if (editingProject) {
      await projectService.update(editingProject.id, data);
    } else {
      await projectService.create(data);
    }
    fetchProjects();
  }, [editingProject, fetchProjects]);

  const handleDelete = React.useCallback(async (id: number) => {
    if (confirm("Are you sure you want to delete this project record?")) {
      await projectService.delete(id);
      fetchProjects();
    }
  }, [fetchProjects]);

  const handleEdit = React.useCallback((p: Project) => {
    setEditingProject(p);
    setIsModalOpen(true);
  }, []);

  const handleNewProject = React.useCallback(() => {
    setEditingProject(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-vscode-cyan" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              projects.tsx — CRUD Portfolio Showcase Records
            </h1>
          </div>

          <button
            onClick={handleNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project()</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-vscode-bgDark border border-vscode-borderLight p-3 rounded-md">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-vscode-textDark absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="filter_query..."
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1.5 text-xs text-vscode-textWhite placeholder-vscode-textDark focus:outline-none focus:border-vscode-blueActive transition-colors"
            />
          </form>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-vscode-bgLight text-vscode-cyan border border-vscode-cyan/30"
                    : "text-vscode-textDark hover:text-vscode-textLight hover:bg-vscode-bgHover"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <ProjectTable
          projects={projects}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-vscode-textDark px-1">
          <span>
            Records: <strong className="text-vscode-textLight">{projects.length}</strong> of{" "}
            <strong className="text-vscode-textLight">{total}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded border border-vscode-borderLight bg-vscode-bgDark hover:bg-vscode-bgHover disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-vscode-textLight">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded border border-vscode-borderLight bg-vscode-bgDark hover:bg-vscode-bgHover disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        project={editingProject}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
}
