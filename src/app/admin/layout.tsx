import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Enforce server-side authorization
  if (!user || !canAccessAdmin(user.role)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-school-text">
      <AdminSidebar
        currentUser={{
          email: user.email,
          role: user.role,
          name:
            user.teacher?.name ||
            (user.student ? `${user.student.firstName} ${user.student.lastName}` : null) ||
            user.guardian?.name ||
            undefined,
        }}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-school-border px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-school-navy">Administrative Management System</h2>
            <p className="text-xs text-school-text-muted">
              Institutional Session 2026-2027 &bull; Dhaka Time: Asia/Dhaka (UTC+6)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Security Clearance:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-school-blue border border-blue-200 uppercase">
              {user.role}
            </span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
