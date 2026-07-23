"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Eye, Download, RefreshCw } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export default function ResumePage() {
  const [hasResume, setHasResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchResumeStatus = () => {
    fetch("/api/admin/resume")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        setHasResume(!!data.exists);
        setResumeUrl(data.resumeUrl || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumeStatus();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Resume uploaded successfully");
        setHasResume(true);
        setResumeUrl(data.url || "/resume.pdf");
        fetchResumeStatus();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/admin/resume", { method: "DELETE" });
      if (res.ok) {
        toast.success("Resume deleted");
        setHasResume(false);
        setResumeUrl(null);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setShowDelete(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading resume status...</div>;

  const currentUrl = resumeUrl || "/resume.pdf";

  return (
    <div className="space-y-6">
      <AdminHeader title="Resume" description="Manage your CV/Resume PDF file" />

      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-10 h-10 text-amber-500" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {hasResume ? "Resume Active" : "No Resume Uploaded"}
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {hasResume
              ? "Your resume is currently active and available for visitors to view and download on your portfolio website."
              : "Upload a PDF version of your resume so portfolio visitors can view and download it."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center items-center pt-2">
          {/* Upload / Replace Button */}
          <label className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-lg font-medium hover:bg-amber-600 cursor-pointer transition-colors text-sm">
            {hasResume ? <RefreshCw className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : hasResume ? "Replace PDF" : "Upload PDF"}
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>

          {hasResume && (
            <>
              {/* Preview Button */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#2a2d37] text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-[#0f1117] transition-colors text-sm"
              >
                <Eye className="w-4 h-4" /> Preview
              </a>

              {/* Download Button */}
              <a
                href={currentUrl}
                download="Mohammed_Abdul_Azeez_Resume.pdf"
                className="flex items-center gap-2 border border-[#2a2d37] text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-[#0f1117] transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </a>

              {/* Delete Button */}
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-lg font-medium hover:bg-red-500/20 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Resume"
        description="Are you sure you want to delete your resume? Visitors will no longer be able to download it."
      />
    </div>
  );
}
