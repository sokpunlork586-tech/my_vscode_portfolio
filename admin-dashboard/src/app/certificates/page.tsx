"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Award,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Calendar,
  Building2,
  Upload,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { certificateService } from "@/services/certificateService";
import { uploadService } from "@/services/uploadService";
import { Certificate } from "@/types";

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await certificateService.list(search);
      setItems(data);
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to load certificates.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCertificates();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchCertificates]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = useCallback(
    (item?: Certificate) => {
      if (item) {
        setEditingItem(item);
        setTitle(item.title);
        setIssuer(item.issuer);
        setIssueDate(item.issue_date || "");
        setExpirationDate(item.expiration_date || "");
        setCredentialId(item.credential_id || "");
        setCredentialUrl(item.credential_url || "");
        setImageUrl(item.image_url || "");
        setDescription(item.description || "");
        setOrder(item.order);
      } else {
        setEditingItem(null);
        setTitle("");
        setIssuer("");
        setIssueDate("");
        setExpirationDate("");
        setCredentialId("");
        setCredentialUrl("");
        setImageUrl("");
        setDescription("");
        setOrder(items.length + 1);
      }
      setIsModalOpen(true);
    },
    [items.length]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadService.uploadFile(file, "certificates");
      setImageUrl(res.url);
      showNotify("success", "Certificate badge/image uploaded successfully!");
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to upload certificate image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || "Certificate";
    const finalIssuer = issuer.trim() || "Self / Issuer";

    try {
      setSubmitting(true);
      const payload = {
        title: finalTitle,
        issuer: finalIssuer,
        issue_date: issueDate.trim() || undefined,
        expiration_date: expirationDate.trim() || undefined,
        credential_id: credentialId.trim() || undefined,
        credential_url: credentialUrl.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        description: description.trim() || undefined,
        order: Number(order) || 0,
      };

      if (editingItem) {
        await certificateService.update(editingItem.id, payload);
        showNotify("success", "Certificate updated successfully!");
      } else {
        await certificateService.create(payload);
        showNotify("success", "Certificate created successfully!");
      }
      setIsModalOpen(false);
      fetchCertificates();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to save certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await certificateService.delete(id);
      showNotify("success", "Certificate deleted.");
      fetchCertificates();
    } catch (err: any) {
      showNotify("error", err?.message || "Failed to delete certificate.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-vscode-border">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-vscode-red" />
            <h1 className="text-sm font-bold text-vscode-textWhite">
              certificates.sass — Verified Credentials & Honors
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-vscode-blueActive hover:bg-vscode-blue rounded shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certificate()</span>
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
              placeholder="Search certificates by title, issuer, or credential ID..."
              className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded pl-8 pr-3 py-1 text-xs text-vscode-textWhite placeholder-vscode-textDark focus:outline-none focus:border-vscode-blueActive"
            />
          </div>
          <span className="text-[11px] text-vscode-textDark shrink-0">
            {items.length} {items.length === 1 ? "credential" : "credentials"}
          </span>
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-vscode-textDark">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-vscode-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching certificate credentials...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-vscode-bgDark border border-vscode-borderLight rounded p-8 text-center text-vscode-textDark">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-40 text-vscode-red" />
            <p>No certificates found.</p>
            <p className="text-[11px] mt-1 text-vscode-textDark">Click "Add Certificate()" above to add your certifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-vscode-bgDark border border-vscode-borderLight hover:border-vscode-borderHover rounded p-4 flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-vscode-textWhite text-sm leading-snug">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-vscode-cyan text-[11px]">
                        <Building2 className="w-3 h-3" />
                        <span>{item.issuer}</span>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-textDark shrink-0">
                      #{item.order}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-vscode-textDark text-[11px]">
                    {item.issue_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Issued: {item.issue_date}</span>
                      </div>
                    )}
                    {item.credential_id && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-vscode-bgMid text-vscode-yellow font-mono">
                        ID: {item.credential_id}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-vscode-textLight text-[11px] leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}

                  {item.image_url && (
                    <div className="pt-1.5">
                      <img
                        src={item.image_url.startsWith("http") ? item.image_url : `http://127.0.0.1:8000${item.image_url}`}
                        alt={item.title}
                        className="h-16 max-w-full rounded border border-vscode-border object-contain bg-black/40 p-1"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-vscode-border/60">
                  <div>
                    {item.credential_url && (
                      <a
                        href={item.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-vscode-blue hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Verify Credential</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal(item)}
                      className="p-1.5 text-vscode-textLight hover:text-white hover:bg-vscode-bgHover rounded transition-colors"
                      title="Edit Certificate"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-vscode-textLight hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                  {editingItem ? "Edit Certificate" : "Add Certificate"}
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
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Full-Stack Web Development Specialization"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="e.g. Coursera, Meta, Google, AWS"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Issue Date / Year
                    </label>
                    <input
                      type="text"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      placeholder="e.g. 2023 or Nov 2023"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      placeholder="e.g. No Expiration"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      placeholder="e.g. CERT-REACT-88231"
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>

                  <div>
                    <label className="block text-vscode-textLight mb-1 text-[11px]">
                      Credential Verification URL
                    </label>
                    <input
                      type="text"
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                      placeholder="e.g. https://coursera.org/verify/..."
                      className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Certificate Badge / Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="e.g. /uploads/certificates/cert_1.png or https://..."
                      className="flex-1 bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-xs text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs bg-vscode-bgMid hover:bg-vscode-bgHover border border-vscode-borderLight rounded text-vscode-textLight flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-vscode-textLight mb-1 text-[11px]">
                    Description / Learned Skills
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the curriculum or concepts mastered..."
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
                    {submitting ? "Saving..." : editingItem ? "Update Certificate" : "Create Certificate"}
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

