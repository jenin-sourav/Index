"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  CalendarCheck2,
  Award,
  CreditCard,
  CalendarDays,
  Bell,
  ShieldAlert,
  Settings,
  LogOut,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  currentUser?: {
    email: string;
    role: string;
    name?: string;
  };
}

export default function AdminSidebar({ currentUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const navItems = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/students", label: "Student Directory", icon: Users },
    { href: "/admin/admissions", label: "Admissions Pipeline", icon: FileCheck2 },
    { href: "/admin/attendance", label: "Daily Attendance", icon: CalendarCheck2 },
    { href: "/admin/exams", label: "Examinations & Marks", icon: Award },
    { href: "/admin/fees", label: "Fees & Invoices", icon: CreditCard },
    { href: "/admin/timetable", label: "Timetable Schedules", icon: CalendarDays },
    { href: "/admin/notices", label: "Notices & Bulletins", icon: Bell },
    { href: "/admin/audit", label: "Audit Logs", icon: ShieldAlert },
    { href: "/admin/settings", label: "Institutional Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-school-navy text-slate-200 flex flex-col min-h-screen border-r border-slate-700/60 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-school-navy-deep flex items-center justify-center text-school-gold shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              AIS DHAKA
            </h1>
            <p className="text-xs text-school-teal uppercase tracking-widest font-semibold">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* User Status Badge */}
      <div className="px-5 py-3.5 bg-school-navy-deep/60 border-b border-slate-700/40">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Signed in as:</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-school-gold/20 text-school-gold uppercase tracking-wider">
            {currentUser?.role || "ADMINISTRATOR"}
          </span>
        </div>
        <p className="text-sm font-semibold text-white truncate mt-1">
          {currentUser?.name || currentUser?.email || "Administrative Officer"}
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-school-blue text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 text-slate-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700/60 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out Securely</span>
        </button>
      </div>
    </aside>
  );
}
