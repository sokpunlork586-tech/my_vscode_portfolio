"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Code2,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { experienceService } from "@/services/experienceService";
import { Experience } from "@/types";

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Present");
  const [isCurrent, setIsCurrent] = useState(true);
  const [technologies, setTechnologies] = useState("");
  const [description, setDescription] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [order, setOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      const data = await experienceService.list(search);
      setItems(data);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to load experience records.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExperience();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchExperience]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = useCallback(
    (item?: Experience) => {
      if (item) {
        setEditingItem(item);
        setCompany(item.company);
        setPosition(item.position);
        setLocation(item.location || "");
        setEmploymentType(item.employment_type || "Full-time");
        setStartDate(item.start_date);
        setEndDate(item.end_date);
        setIsCurrent(item.is_current);
        setTechnologies(item.technologies || "");
        setDescription(item.description);
        setCompanyUrl(item.company_url || "");
        setOrder(item.order);
      } else {
        setEditingItem(null);
        setCompany("");
        setPosition("");
        setLocation("");
        setEmploymentType("Full-time");
        setStartDate("");
        setEndDate("Present");
        setIsCurrent(true);
        setTechnologies("");
        setDescription("");
        setCompanyUrl("");
        setOrder(items.length + 1);
      }
      setIsModalOpen(true);
    },
    [items.length]
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim() || !startDate.trim() || !description.trim()) {
      showNotify("error", "Company, Position, Start Date, and Description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        company: company.trim(),
        position: position.trim(),
        location: location.trim() || undefined,
        employment_type: employmentType.trim() || "Full-time",
        start_date: startDate.trim(),
        end_date: isCurrent ? "Present" : endDate.trim(),
        is_current: isCurrent,
        technologies: technologies.trim(),
        description: description.trim(),
        company_url: companyUrl.trim() || undefined,
        order: Number(order) || 0,
      };

      if (editingItem) {
        await experienceService.update(editingItem.id, payload);
        showNotify("success", "Experience record updated successfully!");
      } else {
        await experienceService.create(payload);
        showNotify("success", "New experience record added successfully!");
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to save experience record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await experienceService.delete(id);
      showNotify("success", "Experience record deleted.");
      fetchExperience();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to delete experience record.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-vscode-yellow" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              experience.json — Professional Engineering Positions
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience()</span>
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
              placeholder="Search by position, company, or technologies..."
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1 text-xs text-vscode-textWhite placeholder-vscode-textDark focus:outline-none focus:border-vscode-blueActive"
            />
          </div>
          <span className="text-[11px] text-vscode-textDark shrink-0">
            {items.length} {items.length === 1 ? "position" : "positions"}
          </span>
        </div>

        {/* Experience List */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-vscode-textDark">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-vscode-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching experience records...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-vscode-bgDark border border-vscode-borderLight rounded p-8 text-center text-vscode-textDark">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40 text-vscode-yellow" />
            <p>No experience records found.</p>
            <p className="text-[11px] mt-1 text-vscode-textDark">Click "Add Experience()" above to record your roles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-vscode-bgDark border border-vscode-borderLight hover:border-vscode-borderHover rounded p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-vscode-textWhite text-sm">{item.position}</span>
                    <span className="text-vscode-textDark font-normal">@</span>
                    {item.company_url ? (
                      <a
                        href={item.company_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-vscode-cyan hover:underline inline-flex items-center gap-1"
                      >
                        <span>{item.company}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-semibold text-vscode-cyan">{item.company}</span>
                    )}

                    {item.is_current && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                        Current Role
                      </span>
                    )}

                    {item.employment_type && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-textLight border border-vscode-border">
                        {item.employment_type}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-vscode-textDark text-[11px]">
                    <div className="flex items-center gap-1 text-vscode-textLight">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {item.start_date} — {item.end_date}
                      </span>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </div>
                    )}

                    <span className="text-[10px]">Order: {item.order}</span>
                  </div>

                  <div className="text-vscode-textLight text-[11px] leading-relaxed whitespace-pre-line bg-vscode-bgMid/40 rounded p-2.5 border border-vscode-border/50">
                    {item.description}
                  </div>

                  {item.technologies && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Code2 className="w-3 h-3 text-vscode-textDark" />
                      {item.technologies.split(",").map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-blue border border-vscode-borderLight"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 text-vscode-textLight hover:text-white hover:bg-vscode-bgHover rounded transition-colors"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-vscode-textLight hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                    title="Delete Experience"
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
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-lg w-full max-w-xl shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="h-10 bg-vscode-bgMid px-4 flex items-center justify-between border-b border-vscode-border select-none shrink-0">
                <span className="font-bold text-vscode-textWhite">
                  {editingItem ? "Edit Experience Record" : "Add Experience Record"}
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-vscode-textDark hover:text-vscode-textWhite p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Job Title / Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Full-Stack Developer"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Tech Innovators Lab"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Phnom Penh, Cambodia or Remote"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Employment Type
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Start Date / Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="e.g. 2023"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      End Date / Year
                    </label>
                    <input
                      type="text"
                      disabled={isCurrent}
                      value={isCurrent ? "Present" : endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive disabled:opacity-50"
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCurrentRole"
                    checked={isCurrent}
                    onChange={(e) => {
                      setIsCurrent(e.target.checked);
                      if (e.target.checked) setEndDate("Present");
                    }}
                    className="rounded bg-vscode-inputBg border-vscode-borderLight text-vscode-blueActive focus:ring-0"
                  />
                  <label htmlFor="isCurrentRole" className="text-vscode-textLight text-xs select-none">
                    Currently working in this role
                  </label>
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Company Website / URL
                  </label>
                  <input
                    type="text"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="e.g. https://example.com"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Technologies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g. Python, FastAPI, Next.js, PostgreSQL, Docker"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Responsibilities & Impact *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key achievements, technical implementations, microservices deployed, team leadership..."
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
                    {submitting ? "Saving..." : editingItem ? "Update Experience" : "Create Experience"}
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

