import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  GraduationCap,
  FileCheck2,
  CreditCard,
  CalendarCheck2,
  Award,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  // Aggregate real institutional statistics
  const [
    studentCount,
    teacherCount,
    pendingAppsCount,
    invoices,
    recentAudits,
    recentApps,
  ] = await Promise.all([
    db.student.count({ where: { enrollmentStatus: "ACTIVE" } }),
    db.teacher.count(),
    db.admissionApplication.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    db.invoice.findMany({ select: { totalAmount: true, paidAmount: true, balance: true } }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.admissionApplication.findMany({
      orderBy: { submissionDate: "desc" },
      take: 4,
      include: { gradeLevel: true },
    }),
  ]);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-school-navy via-school-navy to-school-navy-deep rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
            Institutional Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Apex International School &bull; Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time metric telemetry, admissions workflow queue, and financial status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/students"
            className="px-4 py-2 rounded-lg bg-school-gold text-school-navy-deep text-xs font-bold hover:bg-yellow-400 shadow transition"
          >
            + Enroll Student
          </Link>
          <Link
            href="/admin/admissions"
            className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/25 transition"
          >
            Review Admissions ({pendingAppsCount})
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Students */}
        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <p className="text-3xl font-extrabold text-school-navy mt-1">{studentCount}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Active in Session 2026-2027
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-school-blue flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Faculty Count */}
        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty &amp; Staff
            </span>
            <p className="text-3xl font-extrabold text-school-navy mt-1">{teacherCount}</p>
            <span className="text-[11px] text-school-teal font-semibold">
              Certified Instructors
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-school-teal flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Admissions */}
        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Admissions
            </span>
            <p className="text-3xl font-extrabold text-school-gold mt-1">{pendingAppsCount}</p>
            <span className="text-[11px] text-amber-700 font-semibold">
              Requires Review &amp; Assessment
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-school-gold flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Fee Collected */}
        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fee Collections (BDT)
            </span>
            <p className="text-2xl font-extrabold text-school-navy mt-1">
              {formatCurrency(totalCollected)}
            </p>
            <span className="text-[11px] text-slate-500">
              Outstanding: {formatCurrency(totalOutstanding)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Admission Applications Pipeline */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-school-border shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div>
              <h3 className="text-base font-bold text-school-navy">Recent Admission Applications</h3>
              <p className="text-xs text-school-text-muted">
                Candidate registrations submitted via the online admission portal.
              </p>
            </div>
            <Link
              href="/admin/admissions"
              className="text-xs font-bold text-school-blue hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentApps.map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-school-navy">
                      {app.applicantFirstName} {app.applicantLastName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({app.applicationNo})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Applying for: <strong>{app.gradeLevel.name}</strong> &bull; Parent:{" "}
                    {app.parentName}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      app.status === "ACCEPTED"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "ASSESSMENT_SCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "UNDER_REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {formatDate(app.submissionDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Audit Trail */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-school-border shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-school-navy" />
              <h3 className="text-base font-bold text-school-navy">Tamper-Evident Audit Trail</h3>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs font-bold text-school-blue hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-4">
            {recentAudits.map((a) => (
              <div key={a.id} className="text-xs space-y-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-school-blue uppercase tracking-wider text-[10px]">
                    {a.action} &bull; {a.entity}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(a.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-slate-700 truncate font-mono text-[11px]">
                  {a.actorEmail || "System Engine"} ({a.actorRole || "SYSTEM"})
                </p>
                {a.details && (
                  <p className="text-slate-500 text-[11px] line-clamp-1">
                    {a.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
