"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", issuer: "", credentialUrl: "", sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const fetchCerts = () => {
    fetch("/api/admin/certifications")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCertifications(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({ name: "", issuer: "", credentialUrl: "", sortOrder: certifications.length });
    setModalOpen(true);
  };

  const openEditModal = (cert: any) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name || "",
      issuer: cert.issuer || "",
      credentialUrl: cert.credentialUrl || "",
      sortOrder: cert.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingCert ? "PUT" : "POST";
      const url = editingCert ? `/api/admin/certifications?id=${editingCert.id}` : "/api/admin/certifications";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sortOrder: Number(formData.sortOrder) || 0 }),
      });

      if (res.ok) {
        toast.success(editingCert ? "Certification updated" : "Certification added");
        setModalOpen(false);
        fetchCerts();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Operation failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/certifications?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setCertifications(certifications.filter((c) => c.id !== deleteId));
        toast.success("Certification deleted");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete certification");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-gray-400">Loading certifications...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Certifications" description="Manage your achievements">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Certification
        </button>
      </AdminHeader>

      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-gray-400 p-6 bg-[#1a1d27] border border-[#2a2d37] rounded-xl text-center">
            No certifications found.
          </div>
        ) : (
          certifications.map((cert) => (
            <div key={cert.id} className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{cert.name}</h3>
                <p className="text-gray-400 text-sm">{cert.issuer}</p>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-500 hover:underline">
                    View Credential
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(cert)} className="p-2 border border-[#2a2d37] text-gray-300 hover:bg-[#0f1117] rounded-lg">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(cert.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
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
              <h3 className="text-lg font-semibold text-white">{editingCert ? "Edit Certification" : "Add Certification"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Certification Name</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Java SE 11 Developer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Issuer / Organization</label>
                <input
                  required
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g. Oracle / HackerRank"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Credential URL (Optional)</label>
                <input
                  type="url"
                  className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
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
        title="Delete Certification"
        description="Are you sure you want to delete this certification?"
      />
    </div>
  );
}
