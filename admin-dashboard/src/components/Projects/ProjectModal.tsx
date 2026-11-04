"use client";

import React, { useState, useEffect } from "react";
import { X, Code2 } from "lucide-react";
import { Project } from "@/types";

interface ProjectModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}

export function ProjectModal({ isOpen, project, onClose, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    slug: "",
    description: "",
    category: "Web App",
    tags: "",
    demo_url: "",
    github_url: "",
    image_url: "",
    is_featured: false,
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        category: "Web App",
        tags: "",
        demo_url: "",
        github_url: "",
        image_url: "",
        is_featured: false,
        order: 0,
      });
    }
    setError(null);
  }, [project, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.description) {
      setError("Title, slug, and description are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: project ? prev.slug : autoSlug,
    }));
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-backdropFadeIn"
    >
      <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md w-full max-w-lg overflow-hidden shadow-2xl font-mono text-xs animate-modalFadeIn will-change-[transform,opacity]">
        {/* Modal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-vscode-bgLight border-b border-vscode-border">
          <div className="flex items-center gap-2 text-vscode-textWhite font-semibold">
            <Code2 className="w-4 h-4 text-vscode-blueAccent" />
            <span>{project ? `Edit: ${project.slug}` : "New Project Document"}</span>
          </div>
          <button
            onClick={onClose}
            className="text-vscode-textLight hover:text-white p-1 rounded hover:bg-vscode-bgHover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-vscode-red/10 border border-vscode-red/30 rounded text-vscode-red text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-vscode-textLight mb-1 text-[11px]">// project_title</label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
              placeholder="e.g. Next.js SaaS Analytics"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// slug_identifier</label>
              <input
                type="text"
                required
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                placeholder="project-slug"
              />
            </div>
            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// category</label>
              <select
                value={formData.category || "Web App"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
              >
                <option value="Web App">Web App</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Mobile">Mobile</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-vscode-textLight mb-1 text-[11px]">// description_markdown</label>
            <textarea
              rows={3}
              required
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
              placeholder="Detailed description..."
            />
          </div>

          <div>
            <label className="block text-vscode-textLight mb-1 text-[11px]">// tech_stack_tags</label>
            <input
              type="text"
              value={formData.tags || ""}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
              placeholder="Next.js, FastAPI, PostgreSQL, Tailwind"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// live_demo_url</label>
              <input
                type="url"
                value={formData.demo_url || ""}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-vscode-textLight mb-1 text-[11px]">// github_repository_url</label>
              <input
                type="url"
                value={formData.github_url || ""}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-vscode-textLight">
              <input
                type="checkbox"
                checked={!!formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded bg-vscode-inputBg border-vscode-borderLight text-vscode-blueActive focus:ring-0"
              />
              <span>is_featured = true</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-vscode-textLight">order_priority:</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-16 bg-vscode-inputBg border border-vscode-borderLight rounded px-2 py-1 text-xs text-vscode-textWhite"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-vscode-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-vscode-textDark hover:text-vscode-textWhite hover:bg-vscode-bgHover rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-white bg-vscode-blueActive hover:bg-vscode-blue font-semibold rounded shadow transition-colors disabled:opacity-50"
            >
              {loading ? "Writing..." : project ? "Commit Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
