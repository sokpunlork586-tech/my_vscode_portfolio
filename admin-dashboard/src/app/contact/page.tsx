"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Share2,
  Plus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Clock,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { contactService } from "@/services/contactService";
import { ContactInfo, SocialLink } from "@/types";

export default function ContactManagementPage() {
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Social Modal State
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [socialPlatform, setSocialPlatform] = useState("GitHub");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialIcon, setSocialIcon] = useState("faGithub");
  const [socialUsername, setSocialUsername] = useState("");
  const [socialOrder, setSocialOrder] = useState(1);
  const [socialVisible, setSocialVisible] = useState(true);
  const [savingSocial, setSavingSocial] = useState(false);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [cData, sData] = await Promise.all([
        contactService.get(),
        contactService.listSocialLinks(),
      ]);
      setContactInfo(cData);
      setSocialLinks(sData);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to load contact data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Handle Contact Info Update
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    try {
      setSavingContact(true);
      const updated = await contactService.update({
        developer_name: contactInfo.developer_name,
        professional_title: contactInfo.professional_title,
        email: contactInfo.email,
        phone: contactInfo.phone || undefined,
        location: contactInfo.location,
        timezone: contactInfo.timezone,
        preferred_method: contactInfo.preferred_method,
        response_window: contactInfo.response_window,
        availability_status: contactInfo.availability_status,
        github_url: contactInfo.github_url,
        linkedin_url: contactInfo.linkedin_url,
        bio_note: contactInfo.bio_note || undefined,
      });
      setContactInfo(updated);
      showNotify("success", "Contact details updated and synchronized with portfolio!");
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to update contact info.");
    } finally {
      setSavingContact(false);
    }
  };

  // Social Modal Handlers
  const openSocialModal = (link?: SocialLink) => {
    if (link) {
      setEditingSocial(link);
      setSocialPlatform(link.platform);
      setSocialUrl(link.url);
      setSocialIcon(link.icon);
      setSocialUsername(link.username);
      setSocialOrder(link.order);
      setSocialVisible(link.is_visible);
    } else {
      setEditingSocial(null);
      setSocialPlatform("GitHub");
      setSocialUrl("");
      setSocialIcon("faGithub");
      setSocialUsername("");
      setSocialOrder(socialLinks.length + 1);
      setSocialVisible(true);
    }
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialPlatform.trim() || !socialUrl.trim()) {
      showNotify("error", "Platform name and URL are required.");
      return;
    }

    try {
      setSavingSocial(true);
      const payload = {
        platform: socialPlatform.trim(),
        url: socialUrl.trim(),
        icon: socialIcon.trim() || "faLink",
        username: socialUsername.trim(),
        order: Number(socialOrder) || 0,
        is_visible: socialVisible,
      };

      if (editingSocial) {
        await contactService.updateSocialLink(editingSocial.id, payload);
        showNotify("success", "Social link updated.");
      } else {
        await contactService.createSocialLink(payload);
        showNotify("success", "Social link created.");
      }
      setIsSocialModalOpen(false);
      const updated = await contactService.listSocialLinks();
      setSocialLinks(updated);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to save social link.");
    } finally {
      setSavingSocial(false);
    }
  };

  const handleDeleteSocial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    try {
      await contactService.deleteSocialLink(id);
      showNotify("success", "Social link removed.");
      const updated = await contactService.listSocialLinks();
      setSocialLinks(updated);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to delete social link.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-vscode-blue" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              contact.json — Developer Contact & Social Connectivity
            </h1>
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

        {loading || !contactInfo ? (
          <div className="h-64 flex items-center justify-center text-vscode-textDark">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-vscode-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching contact & social parameters...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Contact Details Form */}
            <div className="lg:col-span-7 bg-vscode-bgDark border border-vscode-borderLight rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-vscode-yellow" />
                  <h2 className="font-bold text-vscode-textWhite text-sm">
                    Developer Contact Details
                  </h2>
                </div>
                <span className="text-[10px] text-vscode-textDark font-mono">
                  Syncs with contact.md & contact.json
                </span>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Developer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.developer_name}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, developer_name: e.target.value })
                      }
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.professional_title}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, professional_title: e.target.value })
                      }
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Primary Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, email: e.target.value })
                      }
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Phone / Mobile (Optional)
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone || ""}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, phone: e.target.value })
                      }
                      placeholder="+855 12 345 678"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      GitHub Profile URL *
                    </label>
                    <div className="relative">
                      <Github className="w-3.5 h-3.5 text-vscode-textDark absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactInfo.github_url}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, github_url: e.target.value })
                        }
                        className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      LinkedIn Profile URL *
                    </label>
                    <div className="relative">
                      <Linkedin className="w-3.5 h-3.5 text-vscode-textDark absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactInfo.linkedin_url}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, linkedin_url: e.target.value })
                        }
                        className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Location / Country *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-vscode-textDark absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactInfo.location}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, location: e.target.value })
                        }
                        className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Timezone *
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-vscode-textDark absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactInfo.timezone}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, timezone: e.target.value })
                        }
                        placeholder="e.g. ICT (UTC+7)"
                        className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Preferred Contact Method *
                    </label>
                    <select
                      value={contactInfo.preferred_method}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, preferred_method: e.target.value })
                      }
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    >
                      <option value="Email">Email</option>
                      <option value="Telegram">Telegram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Discord">Discord</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Response Window *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.response_window}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, response_window: e.target.value })
                      }
                      placeholder="e.g. Within 24 hours"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Current Availability Status *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.availability_status}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, availability_status: e.target.value })
                    }
                    placeholder="e.g. Available for full-time / freelance opportunities"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Bio Note (Shown on Contact Tab)
                  </label>
                  <textarea
                    rows={2}
                    value={contactInfo.bio_note || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, bio_note: e.target.value })
                    }
                    placeholder="Additional inquiry guidelines or messaging notes..."
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingContact}
                    className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingContact ? "Saving Changes..." : "Save Contact Details"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Social Links CRUD Management */}
            <div className="lg:col-span-5 bg-vscode-bgDark border border-vscode-borderLight rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-vscode-border">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-vscode-cyan" />
                    <h2 className="font-bold text-vscode-textWhite text-sm">
                      Social & Network Links
                    </h2>
                  </div>
                  <button
                    onClick={() => openSocialModal()}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link()</span>
                  </button>
                </div>

                <p className="text-[11px] text-vscode-textDark mb-4">
                  These links are dynamically rendered on the portfolio homepage buttons, footer bar, and contact card.
                </p>

                <div className="space-y-2.5">
                  {socialLinks.length === 0 ? (
                    <div className="p-6 text-center text-vscode-textDark border border-dashed border-vscode-border rounded">
                      No social links configured.
                    </div>
                  ) : (
                    socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-vscode-bgMid/60 border border-vscode-border rounded p-3 flex items-center justify-between gap-3 hover:border-vscode-borderHover transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-vscode-textWhite text-xs">
                              {link.platform}
                            </span>
                            <span className="text-[10px] text-vscode-textDark font-mono">
                              #{link.order}
                            </span>
                            {!link.is_visible && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-950/60 text-rose-400">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-vscode-cyan truncate">
                            {link.url}
                          </div>
                          {link.username && (
                            <div className="text-[10px] text-vscode-textDark">
                              Display: {link.username} ({link.icon})
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openSocialModal(link)}
                            className="p-1 text-vscode-textLight hover:text-white rounded"
                            title="Edit Link"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSocial(link.id)}
                            className="p-1 text-vscode-textLight hover:text-rose-400 rounded"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Link Modal */}
        {isSocialModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-lg w-full max-w-md shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
              <div className="h-10 bg-vscode-bgMid px-4 flex items-center justify-between border-b border-vscode-border select-none shrink-0">
                <span className="font-bold text-vscode-textWhite">
                  {editingSocial ? "Edit Social Link" : "Add Social Link"}
                </span>
                <button
                  onClick={() => setIsSocialModalOpen(false)}
                  className="text-vscode-textDark hover:text-vscode-textWhite p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSocial} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Platform Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    placeholder="e.g. GitHub, LinkedIn, Telegram, X, Email"
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Target URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://... or mailto:..."
                    className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Display Text / Username
                    </label>
                    <input
                      type="text"
                      value={socialUsername}
                      onChange={(e) => setSocialUsername(e.target.value)}
                      placeholder="e.g. sokpunlork586-tech"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Icon Identifier
                    </label>
                    <select
                      value={socialIcon}
                      onChange={(e) => setSocialIcon(e.target.value)}
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    >
                      <option value="faGithub">faGithub</option>
                      <option value="faLinkedin">faLinkedin</option>
                      <option value="faEnvelope">faEnvelope</option>
                      <option value="faTelegram">faTelegram</option>
                      <option value="faTwitter">faTwitter</option>
                      <option value="faLink">faLink (Generic)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={socialOrder}
                      onChange={(e) => setSocialOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="socialVis"
                      checked={socialVisible}
                      onChange={(e) => setSocialVisible(e.target.checked)}
                      className="rounded bg-vscode-inputBg border-vscode-borderLight text-vscode-blueActive focus:ring-0"
                    />
                    <label htmlFor="socialVis" className="text-vscode-textLight text-xs select-none">
                      Visible in Portfolio
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-vscode-border">
                  <button
                    type="button"
                    onClick={() => setIsSocialModalOpen(false)}
                    className="px-3 py-1.5 text-xs rounded text-vscode-textLight hover:bg-vscode-bgHover"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSocial}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors disabled:opacity-50"
                  >
                    {savingSocial ? "Saving..." : editingSocial ? "Update Link" : "Create Link"}
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

