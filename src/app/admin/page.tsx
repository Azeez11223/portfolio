"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FolderKanban, Briefcase, MessageSquare, Award } from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalProjects: number;
  totalExperience: number;
  unreadMessages: number;
  totalCertifications: number;
  recentMessages: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => {
        // Failing gracefully if API doesn't exist yet
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <AdminHeader title="Dashboard" description="Overview of your portfolio" />

      {loading ? (
        <div className="text-gray-400">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Projects", value: stats?.totalProjects || 0, icon: FolderKanban },
              { label: "Total Experience", value: stats?.totalExperience || 0, icon: Briefcase },
              { label: "Unread Messages", value: stats?.unreadMessages || 0, icon: MessageSquare },
              { label: "Certifications", value: stats?.totalCertifications || 0, icon: Award },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2d37]">
              <h2 className="text-xl font-semibold text-white">Recent Unread Messages</h2>
            </div>
            <div className="divide-y divide-[#2a2d37]">
              {stats?.recentMessages && stats.recentMessages.length > 0 ? (
                stats.recentMessages.map((msg: any) => (
                  <div key={msg.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{msg.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">{msg.email}</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{msg.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-gray-400 text-center">No recent unread messages.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
