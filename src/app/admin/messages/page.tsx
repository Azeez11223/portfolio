"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { toast } from "sonner";
import { Search, Mail, Archive, Trash2, CheckCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(res => res.ok ? res.json() : [])
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: "read" } : m));
        toast.success("Message marked as read");
      }
    } catch {
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== deleteId));
        toast.success("Message deleted");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete message");
    }
  };

  if (loading) return <div className="text-gray-400">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Messages" description="Manage your contact form submissions" />

      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2d37] flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-[#0f1117] border border-[#2a2d37] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="divide-y divide-[#2a2d37]">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No messages found.</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`p-4 flex gap-4 transition-colors ${msg.status === 'unread' ? 'bg-[#2a2d37]/30' : ''}`}>
                <div className="mt-1">
                  {msg.status === 'unread' ? (
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  ) : (
                    <Mail className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium ${msg.status === 'unread' ? 'text-white' : 'text-gray-300'}`}>{msg.name}</h4>
                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{msg.email}</p>
                  <p className={`text-sm ${msg.status === 'unread' ? 'text-gray-300' : 'text-gray-500'}`}>{msg.message}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {msg.status === 'unread' && (
                    <button onClick={() => handleMarkRead(msg.id)} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2d37] rounded-lg" title="Mark as read">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setDeleteId(msg.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
}
