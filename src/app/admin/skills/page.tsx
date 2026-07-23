"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export default function SkillsPage() {
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    skillsText: "",
    sortOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const fetchSkills = () => {
    fetch("/api/admin/skills")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSkillGroups(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingGroup(null);
    setFormData({
      category: "",
      skillsText: "",
      sortOrder: skillGroups.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (group: any) => {
    setEditingGroup(group);
    const skillsList = Array.isArray(group.skills)
      ? group.skills.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
      : "";
    setFormData({
      category: group.category || "",
      skillsText: skillsList,
      sortOrder: group.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const skills = formData.skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, tier: "Core" }));

    const payload = {
      category: formData.category,
      skills,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      const method = editingGroup ? "PUT" : "POST";
      const url = editingGroup ? `/api/admin/skills?id=${editingGroup.id}` : "/api/admin/skills";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingGroup ? "Skill group updated" : "Skill group added");
        setModalOpen(false);
        fetchSkills();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Operation failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save skill group");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setSkillGroups(skillGroups.filter((s) => s.id !== deleteId));
        toast.success("Skill group deleted");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete skill group");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-gray-400">Loading skills...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Skills" description="Manage your skill categories and items">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Skill Group
        </button>
      </AdminHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.length === 0 ? (
          <div className="col-span-full text-gray-400 p-6 bg-[#1a1d27] border border-[#2a2d37] rounded-xl text-center">
            No skill groups found.
          </div>
        ) : (
          skillGroups.map((group) => (
            <div key={group.id} className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white text-lg">{group.category}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(group)} className="p-2 border border-[#2a2d37] text-gray-300 hover:bg-[#0f1117] rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(group.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills?.map((skill: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#0f1117] border border-[#2a2d37] text-gray-300 rounded-full text-sm">
                    {typeof skill === "string" ? skill : skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#2a2d37] pb-3">
              <h3 className="text-lg font-semibold text-white">{editingGroup ? "Edit Skill Group" : "Add Skill Group"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category / Title</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Backend Development / Frameworks"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Skills (Comma separated)</label>
                <textarea
                  rows={3}
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.skillsText}
                  onChange={(e) => setFormData({ ...formData, skillsText: e.target.value })}
                  placeholder="Java, Spring Boot, REST APIs, Microservices, PostgreSQL"
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
        title="Delete Skill Group"
        description="Are you sure you want to delete this skill group?"
      />
    </div>
  );
}
