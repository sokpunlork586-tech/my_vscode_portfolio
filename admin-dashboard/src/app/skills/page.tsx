"use client";

import React, { useState, useEffect } from "react";
import { Plus, Cpu, Trash2, Edit2, X, FileCode, Search, CheckCircle, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { skillService } from "@/services/skillService";
import { Skill } from "@/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(85);
  const [order, setOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSkills = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await skillService.list();
      setSkills(data);
    } catch (err: any) {
      console.error("Failed to load skills:", err);
      showNotify("error", err?.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = React.useCallback((skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setName(skill.name);
      setCategory(skill.category);
      setProficiency(skill.proficiency);
      setOrder(skill.order);
    } else {
      setEditingSkill(null);
      setName("");
      setCategory("Frontend");
      setProficiency(85);
      setOrder(skills.length + 1);
    }
    setIsModalOpen(true);
  }, [skills.length]);

  const handleSave = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "New Skill";
    try {
      setSubmitting(true);
      if (editingSkill) {
        await skillService.update(editingSkill.id, { name: finalName, category, proficiency, order });
        showNotify("success", "Skill updated successfully.");
      } else {
        await skillService.create({ name: finalName, category, proficiency, order });
        showNotify("success", "Skill created successfully.");
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to save skill.");
    } finally {
      setSubmitting(false);
    }
  }, [editingSkill, name, category, proficiency, order, fetchSkills]);

  const handleDelete = React.useCallback(async (id: number) => {
    if (confirm("Delete this skill?")) {
      try {
        await skillService.delete(id);
        showNotify("success", "Skill deleted.");
        fetchSkills();
      } catch (err: any) {
        showNotify("error", err?.message || "Failed to delete skill.");
      }
    }
  }, [fetchSkills]);

  const filteredSkills = skills.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const categories = Array.from(new Set(filteredSkills.map((s) => s.category)));

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-vscode-blue" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              skills.ts — Technical Competency Stack
            </h1>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill()</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-xs border ${
              notification.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/50 text-rose-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Search Toolbar */}
        <div className="flex items-center gap-3 bg-vscode-bgDark border border-vscode-borderLight rounded p-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-vscode-textDark absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills by name or category..."
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1 text-xs text-vscode-textWhite placeholder-vscode-textDark focus:outline-none focus:border-vscode-blueActive"
            />
          </div>
          <span className="text-[11px] text-vscode-textDark shrink-0">
            {filteredSkills.length} of {skills.length} skills
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-vscode-bgDark border border-vscode-borderLight rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat} className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-vscode-border">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-vscode-blue" />
                    <h3 className="font-bold text-vscode-textWhite text-xs">namespace {cat}</h3>
                  </div>
                  <span className="text-[10px] text-vscode-textDark font-mono">
                    [{filteredSkills.filter((s) => s.category === cat).length} items]
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredSkills
                    .filter((s) => s.category === cat)
                    .map((item) => (
                      <div key={item.id} className="space-y-1 group">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-vscode-textLight">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-vscode-yellow font-mono">{item.proficiency}%</span>
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <button
                                onClick={() => openModal(item)}
                                className="text-vscode-textDark hover:text-vscode-blue"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-vscode-textDark hover:text-vscode-red"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-vscode-bgLight h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-vscode-blueActive h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-backdropFadeIn"
        >
          <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md w-full max-w-sm overflow-hidden shadow-2xl font-mono text-xs animate-modalFadeIn will-change-[transform,opacity]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-vscode-bgLight border-b border-vscode-border">
              <h3 className="font-semibold text-vscode-textWhite">
                {editingSkill ? "Edit Skill" : "Insert Skill Record"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-vscode-textLight hover:text-white p-1 rounded hover:bg-vscode-bgHover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3">
              <div>
                <label className="block text-vscode-textLight mb-1 text-[11px]">// skill_name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  placeholder="e.g. Next.js, PostgreSQL (optional)"
                />
              </div>

              <div>
                <label className="block text-vscode-textLight mb-1 text-[11px]">// category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-vscode-textLight mb-1 text-[11px]">
                  <span>// proficiency</span>
                  <span className="text-vscode-yellow font-mono">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(parseInt(e.target.value))}
                  className="w-full accent-vscode-blueActive"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-vscode-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 text-vscode-textDark hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1 text-white bg-vscode-blueActive hover:bg-vscode-blue font-semibold rounded shadow transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
