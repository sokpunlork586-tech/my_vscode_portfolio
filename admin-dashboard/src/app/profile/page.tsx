"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User as UserIcon,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Save,
  RefreshCw,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
  Compass,
  Code2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { profileService } from "@/services/profileService";
import { ProfileData, NavItem } from "@/types";
import { useAuth } from "@/context/AuthContext";

const PRESET_SKILLS = [
  "Python",
  "FastAPI",
  "TypeScript",
  "React 18",
  "Next.js 14",
  "PostgreSQL",
  "Node.js",
  "Docker",
  "REST APIs",
  "Git",
  "Tailwind CSS",
  "GraphQL",
  "MongoDB",
  "Redis",
];

export default function ProfilePage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [name, setName] = useState("Punlork");
  const [fullName, setFullName] = useState("Punlork Sok");
  const [role, setRole] = useState("Full-Stack & Python Developer");
  const [status, setStatus] = useState("Available for projects");
  const [techStack, setTechStack] = useState<string[]>([
    "Python",
    "FastAPI",
    "TypeScript",
    "React 18",
    "Next.js 14",
    "PostgreSQL",
    "Node.js",
    "REST APIs",
    "Git",
  ]);
  const [quickNav, setQuickNav] = useState<NavItem[]>([
    { label: "Software Engineering", href: "/swe" },
    { label: "Business Administration", href: "/ba" },
    { label: "Core Skills (skills.js)", href: "/skills" },
    { label: "Projects", href: "/projects" },
    { label: "Contact (contact.json)", href: "/contact" },
  ]);

  // Skill input state
  const [newSkill, setNewSkill] = useState("");

  // Navigation input state
  const [newNavLabel, setNewNavLabel] = useState("");
  const [newNavHref, setNewNavHref] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setStatusMessage(null);
      const data = await profileService.get();
      if (data) {
        setName(data.name || "Punlork");
        setFullName(data.fullName || "Punlork Sok");
        setRole(data.role || "Full-Stack & Python Developer");
        setStatus(data.status || "Available for projects");
        setTechStack(data.techStack || []);
        if (data.quickNavigation && data.quickNavigation.length > 0) {
          setQuickNav(data.quickNavigation);
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to load profile data from backend.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Avatar source resolution
  const avatarSrc = user?.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : `${(process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1").replace(/\/api\/v1\/?$/, "")}${user.avatar_url.startsWith("/") ? "" : "/"}${user.avatar_url}`
    : "/images/profile.png";

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (techStack.includes(trimmed)) return;
    setTechStack((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechStack((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddNav = () => {
    if (!newNavLabel.trim() || !newNavHref.trim()) return;
    setQuickNav((prev) => [
      ...prev,
      { label: newNavLabel.trim(), href: newNavHref.trim() },
    ]);
    setNewNavLabel("");
    setNewNavHref("");
  };

  const handleRemoveNav = (index: number) => {
    setQuickNav((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);

      const payload: Partial<ProfileData> = {
        name,
        fullName,
        role,
        status,
        techStack,
        quickNavigation: quickNav,
      };

      await profileService.update(payload);
      setStatusMessage({
        type: "success",
        text: "Committed & Synchronized to profile.json and frontend sidebar successfully!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to save profile changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-6xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-vscode-purple" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              profile.json — Developer Identity & Sidebar Configuration
            </h1>
          </div>
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="px-2.5 py-1 text-vscode-textDark hover:text-vscode-textWhite border border-vscode-border rounded flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Reload</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`p-3 rounded border flex items-center justify-between text-xs transition-all ${
              statusMessage.type === "success"
                ? "bg-vscode-green/10 border-vscode-green/30 text-vscode-green"
                : "bg-vscode-red/10 border-vscode-red/30 text-vscode-red"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-vscode-textDark hover:text-vscode-textWhite transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Edit Form (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Identity Card */}
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-vscode-border">
                <Code2 className="w-4 h-4 text-vscode-blue" />
                <h2 className="font-bold text-vscode-textWhite text-xs">
                  // [DEVELOPER_IDENTITY_METRICS]
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                <div>
                  <label className="text-vscode-textDark block mb-1">
                    DISPLAY_NAME (Short Name):
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Punlork"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                  <span className="text-[10px] text-vscode-textDark mt-0.5 block">
                    Appears in the header of the Right Sidebar card.
                  </span>
                </div>

                <div>
                  <label className="text-vscode-textDark block mb-1">
                    FULL_NAME (Legal / Portfolio):
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Punlork Sok"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                  <span className="text-[10px] text-vscode-textDark mt-0.5 block">
                    Synchronizes with administrator account in database.
                  </span>
                </div>

                <div>
                  <label className="text-vscode-textDark block mb-1">
                    PROFESSIONAL_ROLE (Headline):
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    placeholder="e.g. Full-Stack & Python Developer"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                  <span className="text-[10px] text-vscode-textDark mt-0.5 block">
                    Displayed directly below your name in the sidebar.
                  </span>
                </div>

                <div>
                  <label className="text-vscode-textDark block mb-1">
                    STATUS_BADGE (Availability):
                  </label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    placeholder="e.g. Available for projects"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                  <span className="text-[10px] text-vscode-textDark mt-0.5 block">
                    Shows beside the pulsing green status dot.
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack Tags Card */}
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-vscode-cyan" />
                  <h2 className="font-bold text-vscode-textWhite text-xs">
                    // [TECH_STACK_TAGS] ({techStack.length} active)
                  </h2>
                </div>
                <span className="text-[10px] text-vscode-textDark">
                  RightSidebar Tech Stack Overview
                </span>
              </div>

              {/* Tag Badges List */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-vscode-inputBg/40 border border-vscode-borderLight rounded min-h-[46px]">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-vscode-bgLight text-vscode-textWhite border border-vscode-borderLight hover:border-vscode-red/50 text-[11px] group transition-colors"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(tech)}
                      className="text-vscode-textDark group-hover:text-vscode-red hover:scale-110 transition-all"
                      title={`Remove ${tech}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {techStack.length === 0 && (
                  <span className="text-vscode-textDark text-[11px] italic">
                    No tech stack tags added yet.
                  </span>
                )}
              </div>

              {/* Add Custom Tag Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(newSkill);
                    }
                  }}
                  placeholder="Type new skill tag and press Enter (e.g. Docker, PostgreSQL)..."
                  className="flex-1 bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkill)}
                  className="px-3 py-1.5 bg-vscode-bgLight hover:bg-vscode-bgDark text-vscode-textWhite border border-vscode-borderLight hover:border-vscode-blueActive rounded flex items-center gap-1 transition-colors text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5 text-vscode-cyan" />
                  <span>Add Tag</span>
                </button>
              </div>

              {/* Preset Quick Tags */}
              <div>
                <label className="text-[10px] text-vscode-textDark block mb-1.5 uppercase tracking-wide">
                  Quick Add Recommended Technologies:
                </label>
                <div className="flex flex-wrap gap-1">
                  {PRESET_SKILLS.map((preset) => {
                    const alreadyAdded = techStack.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddSkill(preset)}
                        disabled={alreadyAdded}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          alreadyAdded
                            ? "bg-vscode-bgDark/40 text-vscode-textDark border-vscode-border/40 opacity-40 cursor-default"
                            : "bg-vscode-bgLight hover:bg-vscode-bgHover text-vscode-textLight hover:text-vscode-textWhite border-vscode-borderLight cursor-pointer"
                        }`}
                      >
                        +{preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-vscode-green" />
                  <h2 className="font-bold text-vscode-textWhite text-xs">
                    // [QUICK_NAVIGATION_LINKS]
                  </h2>
                </div>
                <span className="text-[10px] text-vscode-textDark">
                  Sidebar Menu Destinations
                </span>
              </div>

              <div className="space-y-1.5">
                {quickNav.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-vscode-inputBg/60 border border-vscode-borderLight rounded text-[11px]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-vscode-purple font-mono font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-vscode-textWhite font-semibold">
                        {item.label}
                      </span>
                      <span className="text-vscode-cyan font-mono text-[10px]">
                        {item.href}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveNav(idx)}
                      className="text-vscode-textDark hover:text-vscode-red p-1 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Navigation Item */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                <input
                  type="text"
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                  placeholder="Title (e.g. Projects)"
                  className="sm:col-span-2 bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive text-[11px]"
                />
                <input
                  type="text"
                  value={newNavHref}
                  onChange={(e) => setNewNavHref(e.target.value)}
                  placeholder="Route (e.g. /projects)"
                  className="sm:col-span-2 bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleAddNav}
                  className="bg-vscode-bgLight hover:bg-vscode-bgHover text-vscode-textWhite border border-vscode-borderLight rounded flex items-center justify-center gap-1 transition-colors text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5 text-vscode-green" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>

            {/* Commit / Save Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-vscode-textDark font-mono">
                Writes to: vscode-portfolio/src/data/json/profile.json
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-vscode-blue hover:bg-vscode-blueActive text-white rounded font-medium flex items-center gap-2 transition-colors text-xs disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Update Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Mockup / Preview of Sidebar (1 col) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 text-vscode-textDark text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-vscode-yellow" />
              <span className="font-bold uppercase tracking-wider">
                Live Sidebar Preview (Portfolio)
              </span>
            </div>

            {/* Visual Sidebar Mockup Container */}
            <div className="bg-[#1e1e1e] border border-vscode-borderLight rounded-md shadow-2xl p-4 space-y-4 select-none">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#2d2d2d] text-vscode-textDark text-[11px] font-bold tracking-wider">
                <span>OUTLINE &amp; INFO</span>
                <X className="w-3.5 h-3.5 opacity-60" />
              </div>

              {/* Profile Card Mockup */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-vscode-bgDark border border-vscode-borderLight shrink-0 flex items-center justify-center">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-bold text-vscode-blue">
                      {name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-vscode-textWhite truncate">
                    {name || "Punlork"}
                  </div>
                  <div className="text-[11px] text-[#9cdcfe] truncate">
                    {role || "Full-Stack Developer"}
                  </div>
                </div>
              </div>

              {/* Status Badge Mockup */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-vscode-inputBg text-vscode-green text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-vscode-green animate-pulse"></span>
                <span>{status || "Available for projects"}</span>
              </div>

              {/* Tech Stack Mockup */}
              <div className="pt-1 space-y-1.5">
                <div className="text-[10px] font-bold text-vscode-textDark uppercase tracking-wider">
                  TECH STACK
                </div>
                <div className="flex flex-wrap gap-1">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#252526] text-vscode-textLight border border-[#333333]"
                    >
                      {tech}
                    </span>
                  ))}
                  {techStack.length === 0 && (
                    <span className="text-[10px] text-vscode-textDark italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Navigation Mockup */}
              <div className="pt-1 space-y-1.5">
                <div className="text-[10px] font-bold text-vscode-textDark uppercase tracking-wider">
                  QUICK NAVIGATION
                </div>
                <div className="space-y-1">
                  {quickNav.map((nav, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2 py-1 rounded bg-[#252526]/50 text-vscode-textLight hover:text-vscode-textWhite text-[11px]"
                    >
                      <span className="text-vscode-blue">›</span>
                      <span>{nav.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d2d2d] text-center text-[10px] text-vscode-textDark">
                Synchronized live with portfolio sidebar
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

