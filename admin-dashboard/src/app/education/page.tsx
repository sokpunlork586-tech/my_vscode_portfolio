"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { educationService } from "@/services/educationService";
import { Education } from "@/types";

export default function EducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Present");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      const data = await educationService.list(search);
      setItems(data);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to load education entries.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEducation();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEducation]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = useCallback(
    (item?: Education) => {
      if (item) {
        setEditingItem(item);
        setInstitution(item.institution);
        setDegree(item.degree);
        setFieldOfStudy(item.field_of_study || "");
        setStartDate(item.start_date);
        setEndDate(item.end_date);
        setGrade(item.grade || "");
        setDescription(item.description || "");
        setUrl(item.url || "");
        setOrder(item.order);
      } else {
        setEditingItem(null);
        setInstitution("");
        setDegree("");
        setFieldOfStudy("");
        setStartDate("");
        setEndDate("Present");
        setGrade("");
        setDescription("");
        setUrl("");
        setOrder(items.length + 1);
      }
      setIsModalOpen(true);
    },
    [items.length]
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate.trim()) {
      showNotify("error", "Institution, Degree, and Start Date are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        institution: institution.trim(),
        degree: degree.trim(),
        field_of_study: fieldOfStudy.trim() || undefined,
        start_date: startDate.trim(),
        end_date: endDate.trim() || "Present",
        grade: grade.trim() || undefined,
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        order: Number(order) || 0,
      };

      if (editingItem) {
        await educationService.update(editingItem.id, payload);
        showNotify("success", "Education record updated successfully!");
      } else {
        await educationService.create(payload);
        showNotify("success", "New education record created successfully!");
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to save education record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await educationService.delete(id);
      showNotify("success", "Education record deleted.");
      fetchEducation();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to delete education record.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-vscode-green" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              education.md — Academic Background & Apprenticeships
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education()</span>
            </button>
          </div>
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
              placeholder="Search by degree, institution, or keywords..."
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1 text-xs text-vscode-textWhite placeholder-vscode-textDark focus:outline-none focus:border-vscode-blueActive"
            />
          </div>
          <span className="text-[11px] text-vscode-textDark shrink-0">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Education List Table / Cards */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-vscode-textDark">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-vscode-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching education records...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-vscode-bgDark border border-vscode-borderLight rounded p-8 text-center text-vscode-textDark">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40 text-vscode-green" />
            <p>No education records found.</p>
            <p className="text-[11px] mt-1 text-vscode-textDark">Click "Add Education()" above to create your first entry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-vscode-bgDark border border-vscode-borderLight hover:border-vscode-borderHover rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-vscode-textWhite text-sm">{item.degree}</span>
                    {item.grade && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-yellow border border-vscode-border">
                        {item.grade}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-textDark">
                      Order: {item.order}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-vscode-textLight text-[11px]">
                    <div className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-vscode-blue" />
                      <span>{item.institution}</span>
                    </div>
                    {item.field_of_study && (
                      <span className="text-vscode-purple">({item.field_of_study})</span>
                    )}
                    <div className="flex items-center gap-1 text-vscode-textDark">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {item.start_date} — {item.end_date}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-vscode-textDark text-[11px] leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}

                  {item.url && (
                    <div className="pt-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-vscode-cyan hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.url}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 text-vscode-textLight hover:text-white hover:bg-vscode-bgHover rounded transition-colors"
                    title="Edit Education"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-vscode-textLight hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                    title="Delete Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-lg w-full max-w-xl shadow-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="h-10 bg-vscode-bgMid px-4 flex items-center justify-between border-b border-vscode-border select-none">
                <span className="font-bold text-vscode-textWhite">
                  {editingItem ? "Edit Education Record" : "Add Education Record"}
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-vscode-textDark hover:text-vscode-textWhite p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-5 space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Degree / Program *
                    </label>
                    <input
                      type="text"
                      required
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. Software Engineering Apprenticeship"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Institution / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. University of Technology"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Grade / Honors
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. 3.8 GPA or High Honors"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Start Date / Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      End Date / Year
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="e.g. Present or 2024"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    URL / Primary Link
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. https://example.com or /swe"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Description / Key Achievements
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of coursework, projects, or honors..."
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-vscode-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs rounded text-vscode-textLight hover:bg-vscode-bgHover"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editingItem ? "Update Education" : "Create Education"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

