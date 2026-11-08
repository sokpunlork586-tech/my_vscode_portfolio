"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Server,
  Database,
  ShieldCheck,
  User as UserIcon,
  Settings2,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { resolveMediaUrl } from "@/services/api";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [isSavingName, setIsSavingName] = useState<boolean>(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user?.full_name]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Compute active avatar source
  const currentAvatarSrc = resolveMediaUrl(user?.avatar_url);

  const displayAvatar = previewUrl || currentAvatarSrc;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpe?g|webp|gif)$/i)) {
      setStatusMessage({
        type: "error",
        text: "Please select a valid image file (PNG, JPG, WEBP, or GIF).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({
        type: "error",
        text: "Image file size exceeds the 5MB limit.",
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setStatusMessage(null);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      await authService.uploadAvatar(selectedFile);
      await refreshUser();
      setSelectedFile(null);
      setStatusMessage({
        type: "success",
        text: "Avatar uploaded successfully! Updated in admin bar & synced to portfolio.",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to upload avatar image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSavingName(true);
    setStatusMessage(null);

    try {
      await authService.updateProfile(user.id, { full_name: fullName });
      await refreshUser();
      setStatusMessage({
        type: "success",
        text: "Administrator profile details updated successfully.",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to update profile information.",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-4xl mx-auto font-mono text-xs">
        {/* Editor Bar Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-vscode-border">
          <Settings2 className="w-4 h-4 text-vscode-green" />
          <h1 className="text-sm font-bold text-vscode-textWhite">
            settings.env — System Environment & Administrator Profile
          </h1>
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
                <Check className="w-4 h-4 shrink-0" />
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

        {/* Administrator Profile & Avatar Card */}
        <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-vscode-border">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-vscode-blue" />
              <h2 className="font-bold text-vscode-textWhite text-xs">
                // [ADMINISTRATOR_PROFILE_&_AVATAR]
              </h2>
            </div>
            <span className="text-[10px] text-vscode-textDark font-mono">
              uid#{user?.id || 1}
            </span>
          </div>

          {/* Avatar Upload Interactive Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-vscode-inputBg/40 border border-vscode-borderLight/60 rounded-md p-4">
            {/* Avatar Visual Preview */}
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-vscode-blueActive shadow-lg bg-vscode-bgDark flex items-center justify-center">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-vscode-blue font-sans">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                  title="Click to select new image"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Change</span>
                </button>
              </div>

              <span className="text-[10px] text-vscode-textDark">
                {selectedFile ? "Preview (Unsaved)" : "Current Avatar"}
              </span>
            </div>

            {/* Upload Controls & Details */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-vscode-textWhite font-semibold block text-xs mb-1">
                  Profile Photo Upload
                </label>
                <p className="text-[11px] text-vscode-textDark leading-relaxed">
                  Upload an image for your administrator avatar. It will display in the VS Code Activity Bar and automatically synchronize to your public portfolio page.
                </p>
                <p className="text-[10px] text-vscode-cyan mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Formats: PNG, JPG, WEBP, GIF (Max size: 5MB)
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-vscode-bgDark hover:bg-vscode-bgLight text-vscode-textLight hover:text-vscode-textWhite border border-vscode-borderLight rounded flex items-center gap-1.5 transition-colors text-[11px]"
                >
                  <Upload className="w-3.5 h-3.5 text-vscode-blue" />
                  <span>{selectedFile ? "Select Another Image" : "Choose Image File"}</span>
                </button>

                {selectedFile && (
                  <>
                    <button
                      type="button"
                      onClick={handleUploadAvatar}
                      disabled={isUploading}
                      className="px-3.5 py-1.5 bg-vscode-blue hover:bg-vscode-blueActive text-white rounded font-medium flex items-center gap-1.5 transition-colors text-[11px] disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Upload Avatar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelSelection}
                      disabled={isUploading}
                      className="px-2.5 py-1.5 text-vscode-textDark hover:text-vscode-red transition-colors text-[11px]"
                      title="Cancel preview"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              {selectedFile && (
                <div className="text-[10px] text-vscode-green font-mono">
                  Ready to upload: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>

          {/* Profile Metadata & Edit Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
              <div>
                <label className="text-vscode-textDark block mb-1">FULL_NAME:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Punlork Doe"
                  className="w-full bg-vscode-inputBg border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textWhite focus:outline-none focus:border-vscode-blueActive text-[11px]"
                />
              </div>

              <div>
                <label className="text-vscode-textDark block mb-1">EMAIL_ADDRESS:</label>
                <input
                  type="email"
                  value={user?.email || "admin@portfolio.com"}
                  disabled
                  className="w-full bg-vscode-bgLight border border-vscode-borderLight rounded px-2.5 py-1.5 text-vscode-textDark cursor-not-allowed text-[11px]"
                />
              </div>

              <div>
                <label className="text-vscode-textDark block mb-1">RBAC_ROLE:</label>
                <div className="flex items-center gap-2 py-1.5">
                  <span className="text-vscode-cyan font-bold">
                    {user?.role?.toUpperCase() || "ADMIN"}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-blue/10 text-vscode-blue border border-vscode-blue/20">
                    Full Privileges
                  </span>
                </div>
              </div>

              <div>
                <label className="text-vscode-textDark block mb-1">SESSION_STATUS:</label>
                <div className="py-1.5 flex items-center gap-1.5 text-vscode-green font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-vscode-green animate-pulse"></span>
                  <span>JWT_ACTIVE (HS256)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-vscode-border">
              <span className="text-[10px] text-vscode-textDark">
                Last updated: {user?.updated_at ? new Date(user.updated_at).toLocaleString() : "Recently"}
              </span>

              <button
                type="submit"
                disabled={isSavingName}
                className="px-3 py-1.5 bg-vscode-bgLight hover:bg-vscode-bgDark text-vscode-textWhite border border-vscode-borderLight hover:border-vscode-blueActive rounded flex items-center gap-1.5 transition-colors text-[11px] disabled:opacity-50"
              >
                {isSavingName ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-vscode-green" />
                    <span>Update Name</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* System Architecture Telemetry */}
        <div className="bg-vscode-bgDark border border-vscode-borderLight rounded-md p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-vscode-border">
            <Server className="w-4 h-4 text-vscode-blue" />
            <h2 className="font-bold text-vscode-textWhite text-xs">
              // [RUNTIME_INFRASTRUCTURE_STACK]
            </h2>
          </div>

          <div className="mt-3 space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2.5 bg-vscode-inputBg rounded border border-vscode-borderLight">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-vscode-textLight" />
                <div>
                  <p className="text-vscode-textWhite font-semibold">FASTAPI_BACKEND_SERVICE</p>
                  <p className="text-vscode-textDark font-mono">
                    http://127.0.0.1:8000/api/v1 (Uvicorn Workers + Static /uploads)
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-vscode-green/10 text-vscode-green text-[10px]">
                ONLINE: 200 OK
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-vscode-inputBg rounded border border-vscode-borderLight">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-vscode-textLight" />
                <div>
                  <p className="text-vscode-textWhite font-semibold">RELATIONAL_DATA_STORE</p>
                  <p className="text-vscode-textDark font-mono">
                    PostgreSQL / SQLite Database with Avatar Support
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-vscode-blue/10 text-vscode-blue text-[10px]">
                SYNCHRONIZED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-vscode-inputBg rounded border border-vscode-borderLight">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-vscode-textLight" />
                <div>
                  <p className="text-vscode-textWhite font-semibold">ENCRYPTION_AND_SECURITY</p>
                  <p className="text-vscode-textDark font-mono">
                    OAuth2 Bearer Token + BCrypt Password Hasher
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-vscode-purple/10 text-vscode-purple text-[10px]">
                VALIDATED
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
