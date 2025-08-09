"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/users/user.store";
import SuperAdminSidebar from "./_components/layout/SuperAdminSidebar";

export default function SuperAdminDashboard() {
  const { superAdminUser: user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!document.cookie.includes("authToken")) {
      router.push("/superadmin/auth");
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
        <p>Welcome, {user?.email || "Super Admin"}!</p>
        <p>
          Use the sidebar to manage Industry Types, Payment Methods, and Plans.
        </p>
      </main>
    </div>
  );
}
