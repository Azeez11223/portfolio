"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Save, Plus, Trash2, Upload, User, Image as ImageIcon } from "lucide-react";

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState<any>({
    profile: {
      name: "",
      firstName: "",
      title: "",
      tagline: "",
      location: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      githubUsername: "",
      availability: "",
      avatarUrl: "",
      gradYear: 2026,
      cgpa: "",
    },
    objective: { short: "", long: "" },
    roles: [],
    stats: [],
  });

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: any) => {
        setFormData({
          profile: data.profile || {
            name: "",
            firstName: "",
            title: "",
            tagline: "",
            location: "",
            email: "",
            phone: "",
            linkedin: "",
            github: "",
            githubUsername: "",
            availability: "",
            avatarUrl: "",
            gradYear: 2026,
            cgpa: "",
          },
          objective: data.objective || { short: "", long: "" },
          roles: data.roles || [],
          stats: data.stats || [],
        });
      })
      .catch((err) => console.error("API error", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev: any) => ({
          ...prev,
          profile: { ...prev.profile, avatarUrl: data.url },
        }));
        toast.success("Profile photo uploaded successfully");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload profile photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profile: {
            ...formData.profile,
            gradYear: Number(formData.profile.gradYear) || 2026,
          },
        }),
      });
      if (res.ok) toast.success("Hero section & profile updated");
      else {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addRole = () => {
    setFormData({
      ...formData,
      roles: [...(formData.roles || []), { text: "", sortOrder: formData.roles?.length || 0 }],
    });
  };

  const removeRole = (index: number) => {
    const newRoles = [...formData.roles];
    newRoles.splice(index, 1);
    setFormData({ ...formData, roles: newRoles });
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...(formData.stats || []), { value: 0, suffix: "+", label: "", sortOrder: formData.stats?.length || 0 }],
    });
  };

  const removeStat = (index: number) => {
    const newStats = [...formData.stats];
    newStats.splice(index, 1);
    setFormData({ ...formData, stats: newStats });
  };

  if (loading) return <div className="text-gray-400">Loading hero data...</div>;

  const currentAvatar = formData.profile?.avatarUrl;

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader title="Hero & Profile Section" description="Manage main header, profile photo, bio, and key stats">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </AdminHeader>

      {/* Edit Profile Photo Section */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Edit Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Avatar Preview */}
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-[#0f1117] border border-[#2a2d37] flex items-center justify-center shrink-0">
            {currentAvatar ? (
              <img src={currentAvatar} alt="Profile photo preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-500">
                <User className="w-10 h-10 opacity-60" />
                <span className="text-xs">No Photo</span>
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <p className="text-sm text-gray-300">
              Upload a profile photo to display on your portfolio website.
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <label className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {uploadingAvatar ? "Uploading..." : currentAvatar ? "Replace Photo" : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>

              {currentAvatar && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev: any) => ({
                      ...prev,
                      profile: { ...prev.profile, avatarUrl: "" },
                    }))
                  }
                  className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove Photo
                </button>
              )}
            </div>
            {currentAvatar && (
              <p className="text-xs text-gray-500 truncate max-w-md">URL: {currentAvatar}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.name || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">First Name (Display)</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.firstName || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, firstName: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Professional Title</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.title || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, title: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tagline</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.tagline || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, tagline: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.location || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, location: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.email || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, email: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.phone || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, phone: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Availability Status</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.availability || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, availability: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.linkedin || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, linkedin: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.github || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, github: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Graduation Year</label>
            <input
              type="number"
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.gradYear || 2026}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, gradYear: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">CGPA</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.profile?.cgpa || ""}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, cgpa: e.target.value } })}
            />
          </div>
        </div>
      </div>

      {/* Career Objective */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Career Objective</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Short Summary (Hero tagline)</label>
          <input
            className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
            value={formData.objective?.short || ""}
            onChange={(e) => setFormData({ ...formData, objective: { ...formData.objective, short: e.target.value } })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Statement (About Section)</label>
          <textarea
            className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 min-h-[100px] focus:border-amber-500 focus:outline-none"
            value={formData.objective?.long || ""}
            onChange={(e) => setFormData({ ...formData, objective: { ...formData.objective, long: e.target.value } })}
          />
        </div>
      </div>

      {/* Hero Animated Roles */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Hero Roles (Rotating Titles)</h2>
          <button onClick={addRole} className="flex items-center gap-1 text-sm bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> Add Role
          </button>
        </div>
        <div className="space-y-3">
          {formData.roles?.map((role: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                className="flex-1 bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                value={role.text || ""}
                onChange={(e) => {
                  const updated = [...formData.roles];
                  updated[idx].text = e.target.value;
                  setFormData({ ...formData, roles: updated });
                }}
                placeholder="e.g. Java Full Stack Developer"
              />
              <button onClick={() => removeRole(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Key Stats Counter</h2>
          <button onClick={addStat} className="flex items-center gap-1 text-sm bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {formData.stats?.map((stat: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <input
                type="number"
                placeholder="Value (e.g. 5)"
                className="bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                value={stat.value ?? 0}
                onChange={(e) => {
                  const updated = [...formData.stats];
                  updated[idx].value = Number(e.target.value);
                  setFormData({ ...formData, stats: updated });
                }}
              />
              <input
                type="text"
                placeholder="Suffix (e.g. +)"
                className="bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                value={stat.suffix || ""}
                onChange={(e) => {
                  const updated = [...formData.stats];
                  updated[idx].suffix = e.target.value;
                  setFormData({ ...formData, stats: updated });
                }}
              />
              <input
                type="text"
                placeholder="Label (e.g. Projects Completed)"
                className="bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                value={stat.label || ""}
                onChange={(e) => {
                  const updated = [...formData.stats];
                  updated[idx].label = e.target.value;
                  setFormData({ ...formData, stats: updated });
                }}
              />
              <button onClick={() => removeStat(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg justify-self-start sm:justify-self-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
