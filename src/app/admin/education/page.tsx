"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function EducationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    duration: "",
    cgpa: "",
  });

  useEffect(() => {
    fetch("/api/admin/education")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (data && typeof data === "object") {
          setFormData({
            degree: data.degree || "",
            institution: data.institution || "",
            location: data.location || "",
            duration: data.duration || "",
            cgpa: data.cgpa || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Education details saved");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save education details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading education...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Education" description="Manage your academic background">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Education"}
        </button>
      </AdminHeader>

      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Degree / Qualification</label>
          <input
            type="text"
            className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="e.g. B.Tech Information Technology"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Institution / College / University</label>
          <input
            type="text"
            className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="e.g. B.S. Abdur Rahman Crescent Institute of Science & Technology"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <input
              type="text"
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Chennai, India"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Duration</label>
            <input
              type="text"
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 2022 - 2026"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">CGPA / Grade</label>
          <input
            type="text"
            className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
            placeholder="e.g. 7.28"
          />
        </div>
      </div>
    </div>
  );
}
