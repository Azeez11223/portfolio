"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";

export default function SeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    siteTitle: "",
    siteDescription: "",
    keywords: [],
    siteUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
  });

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: any) => setFormData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) toast.success("SEO settings updated successfully");
      else {
        const err = await res.json();
        throw new Error(err.error || "Failed to save SEO settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading SEO settings...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <AdminHeader title="SEO Settings" description="Manage search engine optimization and meta tags">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </AdminHeader>

      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">General Meta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Site Title</label>
            <input
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.siteTitle || ""}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Site Description</label>
            <textarea
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 min-h-[100px] focus:border-amber-500 focus:outline-none"
              value={formData.siteDescription || ""}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Canonical Site URL</label>
            <input
              type="text"
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-4 py-2.5 focus:border-amber-500 focus:outline-none"
              value={formData.siteUrl || ""}
              onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
              placeholder="https://mdazeezsoftdev.vercel.app"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
