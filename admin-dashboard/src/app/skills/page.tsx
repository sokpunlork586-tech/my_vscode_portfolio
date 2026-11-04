"use client";

import React, { useState, useEffect } from "react";
import { Plus, Cpu, Trash2, Edit2, X, FileCode } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { skillService } from "@/services/skillService";
import { Skill } from "@/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(85);
  const [order, setOrder] = useState(1);

  const fetchSkills = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await skillService.list();
      setSkills(data);
    } catch (err) {
      console.error("Failed to load skills:", err);
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
    if (editingSkill) {
      await skillService.update(editingSkill.id, { name, category, proficiency, order });
    } else {
      await skillService.create({ name, category, proficiency, order });
    }
    setIsModalOpen(false);
    fetchSkills();
  }, [editingSkill, name, category, proficiency, order, fetchSkills]);

  const handleDelete = React.useCallback(async (id: number) => {
    if (confirm("Delete this skill?")) {
      await skillService.delete(id);
      fetchSkills();
    }
  }, [fetchSkills]);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

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
                    [{skills.filter((s) => s.category === cat).length} items]
                  </span>
                </div>

                <div className="space-y-2.5">
                  {skills
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
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-3 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  placeholder="e.g. Next.js, PostgreSQL"
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
                  className="px-3.5 py-1 text-white bg-vscode-blueActive hover:bg-vscode-blue font-semibold rounded shadow"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
