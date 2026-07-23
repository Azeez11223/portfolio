"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    oneLiner: "",
    description: "",
    problem: "",
    solution: "",
    featuresText: "",
    techText: "",
    impactText: "",
    duration: "",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const fetchProjects = () => {
    fetch("/api/admin/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProj(null);
    setLocalImagePreview(null);
    setFormData({
      title: "",
      slug: "",
      category: "Full Stack",
      oneLiner: "",
      description: "",
      problem: "",
      solution: "",
      featuresText: "",
      techText: "",
      impactText: "",
      duration: "",
      repoUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: false,
      sortOrder: projects.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (proj: any) => {
    setEditingProj(proj);
    setLocalImagePreview(null);
    setFormData({
      title: proj.title || "",
      slug: proj.slug || "",
      category: proj.category || "Full Stack",
      oneLiner: proj.oneLiner || "",
      description: proj.description || "",
      problem: proj.problem || "",
      solution: proj.solution || "",
      featuresText: Array.isArray(proj.features) ? proj.features.join("\n") : "",
      techText: Array.isArray(proj.tech) ? proj.tech.join(", ") : "",
      impactText: Array.isArray(proj.impact) ? proj.impact.join("\n") : "",
      duration: proj.duration || "",
      repoUrl: proj.repoUrl || "",
      liveUrl: proj.liveUrl || "",
      imageUrl: proj.imageUrl || "",
      featured: !!proj.featured,
      sortOrder: proj.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately before upload completes
    const previewUrl = URL.createObjectURL(file);
    setLocalImagePreview(previewUrl);

    setUploadingImg(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Project image uploaded successfully");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
      setLocalImagePreview(null);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleQuickImageUpload = async (project: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("file", file);

    try {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        const updateRes = await fetch(`/api/admin/projects?id=${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...project,
            imageUrl: data.url,
          }),
        });

        if (updateRes.ok) {
          toast.success(`Image updated for ${project.title}`);
          fetchProjects();
        } else {
          throw new Error("Failed to update project image");
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const features = formData.featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
    const tech = formData.techText.split(",").map((s) => s.trim()).filter(Boolean);
    const impact = formData.impactText.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      slug,
      category: formData.category,
      oneLiner: formData.oneLiner,
      description: formData.description,
      problem: formData.problem,
      solution: formData.solution,
      features,
      tech,
      impact,
      duration: formData.duration || null,
      repoUrl: formData.repoUrl || null,
      liveUrl: formData.liveUrl || null,
      imageUrl: formData.imageUrl || null,
      featured: formData.featured,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      const method = editingProj ? "PUT" : "POST";
      const url = editingProj ? `/api/admin/projects?id=${editingProj.id}` : "/api/admin/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProj ? "Project updated" : "Project added");
        setModalOpen(false);
        fetchProjects();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Operation failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== deleteId));
        toast.success("Project deleted");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  const currentDisplayImage = localImagePreview || formData.imageUrl;

  return (
    <div className="space-y-6">
      <AdminHeader title="Projects" description="Manage your portfolio projects and thumbnail images">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </AdminHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl overflow-hidden flex flex-col group">
            <div className="h-44 bg-[#0f1117] border-b border-[#2a2d37] flex items-center justify-center text-gray-500 relative overflow-hidden">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span className="text-xs">No Thumbnail</span>
                </div>
              )}
              {project.featured && (
                <span className="absolute top-2 right-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-semibold z-10">
                  Featured
                </span>
              )}

              {/* Quick Image Upload Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity p-4 text-center">
                <label className="flex items-center gap-1.5 bg-amber-500 text-black px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-amber-600">
                  <Upload className="w-3.5 h-3.5" />
                  {project.imageUrl ? "Replace Image" : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQuickImageUpload(project, e)} />
                </label>
                {project.imageUrl && (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch(`/api/admin/projects?id=${project.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...project, imageUrl: null }),
                      });
                      if (res.ok) {
                        toast.success(`Image removed for ${project.title}`);
                        fetchProjects();
                      }
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white truncate">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-1 mb-4 line-clamp-2">{project.oneLiner}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[#2a2d37]">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex-1 px-3 py-2 border border-[#2a2d37] text-gray-300 hover:bg-[#0f1117] rounded-lg text-sm font-medium flex justify-center items-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setDeleteId(project.id)} className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-gray-400 p-6 bg-[#1a1d27] border border-[#2a2d37] rounded-xl text-center">
          No projects found. Add one to get started.
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-[#2a2d37] pb-3">
              <h3 className="text-lg font-semibold text-white">{editingProj ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Project Image Upload Option */}
              <div className="bg-[#0f1117] border border-[#2a2d37] rounded-xl p-4 space-y-3">
                <label className="block text-sm font-medium text-white">Upload Project Image</label>
                {currentDisplayImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-[#2a2d37] group">
                    <img src={currentDisplayImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <label className="bg-amber-500 text-black px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-amber-600">
                        Replace Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalImagePreview(null);
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                        className="bg-red-500/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#2a2d37] rounded-lg p-6 text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-gray-500 mx-auto" />
                    <p className="text-xs text-gray-400">Select an image from your local device to upload and preview</p>
                    <label className="inline-flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-amber-600">
                      <Upload className="w-4 h-4" />
                      {uploadingImg ? "Uploading..." : "Upload Project Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Or paste Image URL directly</label>
                  <input
                    className="w-full bg-[#1a1d27] border border-[#2a2d37] text-white rounded-lg px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or /uploads/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                  <input
                    required
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Real-Time Order System"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slug (URL friendly)</label>
                  <input
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. order-system"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input
                    required
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Full Stack / Backend / Microservices"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration / Timeline</label>
                  <input
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 3 Months (2024)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">One Liner Summary</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.oneLiner}
                  onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
                  placeholder="High-concurrency order processing engine with Redis & Spring Boot"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Problem Statement</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Solution Implemented</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Technologies (Comma separated)</label>
                <input
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.techText}
                  onChange={(e) => setFormData({ ...formData, techText: e.target.value })}
                  placeholder="Java, Spring Boot, PostgreSQL, Kafka, React"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Repository URL (GitHub)</label>
                  <input
                    type="url"
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Live URL (Demo)</label>
                  <input
                    type="url"
                    className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-[#0f1117] border-[#2a2d37] text-amber-500 focus:ring-0"
                  />
                  Featured Project
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2d37]">
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
                  {saving ? "Saving..." : "Save Project"}
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
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
