"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/admin/toast-provider";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.unreadMessages === "number") {
            setUnreadCount(data.unreadMessages);
          }
        })
        .catch(console.error);
    }
  }, [isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white">
        <ToastProvider />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      <AdminSidebar unreadCount={unreadCount} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <ToastProvider />
        {children}
      </main>
    </div>
  );
}
