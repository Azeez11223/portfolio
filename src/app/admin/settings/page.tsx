"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Save, Eye, EyeOff, Layout } from "lucide-react";

interface SectionConfig {
  key: string;
  name: string;
  description: string;
}

const MODULES_LIST: SectionConfig[] = [
  { key: "hero", name: "Hero / Header Section", description: "Main greeting, professional title, and animated role titles" },
  { key: "about", name: "About Me Section", description: "Career objective overview, profile photo, and key facts" },
  { key: "experience", name: "Work Experience Section", description: "Internships, roles, and accomplishments timeline" },
  { key: "education", name: "Education Section", description: "Degree, institution, duration, and CGPA overview" },
  { key: "skills", name: "Skills & Tech Stack Section", description: "Categorized technical skill badges and groups" },
  { key: "projects", name: "Projects Section", description: "Portfolio project cards, thumbnails, Live Demos & GitHub links" },
  { key: "github", name: "GitHub Activity Section", description: "Live GitHub activity contribution calendar widget" },
  { key: "certifications", name: "Certifications Section", description: "Verified credentials and achievements list" },
  { key: "resume", name: "Resume Download Button", description: "Download Resume buttons in Header Navbar and Hero section" },
  { key: "contact", name: "Contact Form Section", description: "Interactive contact message form and contact information" },
  { key: "socialLinks", name: "Social Media Links", description: "LinkedIn, GitHub, and email icon links in Hero & Footer" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    defaultTheme: "dark",
    logoText: "MA",
    faviconUrl: "",
    sectionsVisibility: {
      hero: true,
      about: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      github: true,
      certifications: true,
      resume: true,
      contact: true,
      socialLinks: true,
    },
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: any) => {
        setFormData({
          defaultTheme: data.defaultTheme || "dark",
          logoText: data.logoText || "MA",
          faviconUrl: data.faviconUrl || "",
          sectionsVisibility: data.sectionsVisibility || {
            hero: true,
            about: true,
            experience: true,
            education: true,
            skills: true,
            projects: true,
            github: true,
            certifications: true,
            resume: true,
            contact: true,
            socialLinks: true,
          },
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Site settings & module visibility saved!");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [key]: !prev.sectionsVisibility?.[key],
      },
    }));
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader title="Site Settings & Module Visibility" description="Configure global website branding and module visibility toggles">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </AdminHeader>

      {/* Global Settings */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Global Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Logo Text</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
              value={formData.logoText || ""}
              onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Theme Mode</label>
            <select
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
              value={formData.defaultTheme || "dark"}
              onChange={(e) => setFormData({ ...formData, defaultTheme: e.target.value })}
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </div>
        </div>
      </div>

      {/* Module Manager / Section Visibility ON/OFF Toggles */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2a2d37] pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-amber-500" /> Module Visibility Manager (ON / OFF)
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Turn sections ON or OFF. Turning a section OFF hides it from your website without deleting any saved data.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#2a2d37]">
          {MODULES_LIST.map((mod) => {
            const isVisible = formData.sectionsVisibility?.[mod.key] !== false;
            return (
              <div key={mod.key} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base">{mod.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        isVisible
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {isVisible ? "VISIBLE (ON)" : "HIDDEN (OFF)"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{mod.description}</p>
                </div>

                {/* ON / OFF Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleSection(mod.key)}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isVisible ? "bg-amber-500" : "bg-[#0f1117] border-[#2a2d37]"
                  }`}
                  role="switch"
                  aria-checked={isVisible}
                >
                  <span className="sr-only">Toggle {mod.name}</span>
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      isVisible ? "translate-x-7 bg-black text-amber-500" : "translate-x-0 bg-gray-600 text-gray-300"
                    }`}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
