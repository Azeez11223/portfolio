"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    current: false,
    bulletsText: "",
    techText: "",
    sortOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const fetchExperiences = () => {
    fetch("/api/admin/experience")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setExperiences(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      role: "",
      company: "",
      duration: "",
      current: false,
      bulletsText: "",
      techText: "",
      sortOrder: experiences.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    const bullets = Array.isArray(exp.bullets) ? exp.bullets.join("\n") : "";
    const tech = Array.isArray(exp.tech) ? exp.tech.join(", ") : "";
    setFormData({
      role: exp.role || "",
      company: exp.company || "",
      duration: exp.duration || "",
      current: !!exp.current,
      bulletsText: bullets,
      techText: tech,
      sortOrder: exp.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const bullets = formData.bulletsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const tech = formData.techText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      role: formData.role,
      company: formData.company,
      duration: formData.duration,
      current: formData.current,
      bullets,
      tech,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      const method = editingExp ? "PUT" : "POST";
      const url = editingExp ? `/api/admin/experience?id=${editingExp.id}` : "/api/admin/experience";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingExp ? "Experience updated" : "Experience added");
        setModalOpen(false);
        fetchExperiences();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Operation failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/experience?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== deleteId));
        toast.success("Experience deleted");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete experience");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-gray-400">Loading experiences...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Experience" description="Manage your work experience">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Experience
        </button>
      </AdminHeader>

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-gray-400 p-6 bg-[#1a1d27] border border-[#2a2d37] rounded-xl text-center">
            No experiences found. Add one to get started.
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{exp.role}</h3>
                  {exp.current && (
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Current</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">
                  {exp.company} • {exp.duration}
                </p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                    {exp.bullets.slice(0, 2).map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(exp)} className="p-2 border border-[#2a2d37] text-gray-300 hover:bg-[#0f1117] rounded-lg">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(exp.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-[#2a2d37] pb-3">
              <h3 className="text-lg font-semibold text-white">{editingExp ? "Edit Experience" : "Add Experience"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role / Position Title</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Backend Developer Intern"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Company / Organization</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Ethical Intelligent Technologies"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <input
                    required
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. Jan 2024 - Present"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                      className="rounded bg-[#0f1117] border-[#2a2d37] text-amber-500 focus:ring-0"
                    />
                    Currently Working Here
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Key Responsibilities & Accomplishments (One per line)</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.bulletsText}
                  onChange={(e) => setFormData({ ...formData, bulletsText: e.target.value })}
                  placeholder="Developed REST APIs with Spring Boot&#10;Integrated PostgreSQL database schemas"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Technologies Used (Comma separated)</label>
                <input
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.techText}
                  onChange={(e) => setFormData({ ...formData, techText: e.target.value })}
                  placeholder="Java, Spring Boot, PostgreSQL, React"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#2a2d37] text-gray-300 hover:bg-[#0f1117] rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-600 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
      />
    </div>
  );
}
