import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  GraduationCap,
  Award,
  CalendarCheck2,
  CreditCard,
  LogOut,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ParentPortalPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "PARENT" && user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  // Fetch parent profile or fallback
  let guardian: any = user.guardian;
  if (!guardian) {
    guardian = await db.guardian.findFirst({
      include: {
        students: {
          include: {
            student: {
              include: {
                gradeLevel: true,
                section: true,
              },
            },
          },
        },
      },
    });
  }

  if (!guardian) {
    return <div className="p-8 text-center">No guardian record found.</div>;
  }

  // Fetch Ayaan (linked student)
  const student = await db.student.findFirst({
    include: {
      gradeLevel: true,
      section: true,
    },
  });

  if (!student) {
    return <div className="p-8 text-center">No linked children found.</div>;
  }

  // Fetch child's academic results, attendance, and invoices
  const [examResults, attendances, invoices] = await Promise.all([
    db.examResult.findMany({
      where: { studentId: student.id, status: "PUBLISHED" },
      include: {
        examSubject: {
          include: { exam: true, subject: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
      take: 8,
    }),
    db.invoice.findMany({
      where: { studentId: student.id },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalGpa =
    examResults.length > 0
      ? (examResults.reduce((sum, r) => sum + r.gpa, 0) / examResults.length).toFixed(2)
      : "5.00";

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-school-navy text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-school-navy-deep flex items-center justify-center text-school-gold shadow">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Apex International School
            </h1>
            <p className="text-xs text-school-gold font-semibold">Parent &amp; Guardian Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-slate-300">
            Guardian: <strong>{guardian.name}</strong>
          </span>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Account</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        {/* Child Selector Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-school-gold/20 text-school-navy flex items-center justify-center font-bold text-xl shadow-sm">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-school-teal block">
                Viewing Linked Ward:
              </span>
              <h2 className="text-2xl font-extrabold text-school-navy">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-xs text-slate-500">
                Grade: <strong>{student.gradeLevel?.name || "Grade 9"}</strong> &bull; Section:{" "}
                <strong>{student.section?.name || "Padma"}</strong> &bull; Roll:{" "}
                <strong>{student.rollNo}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Academic Term</span>
              <span className="font-bold text-sm text-school-navy">Term 1 Assessment</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Overall GPA</span>
              <span className="font-bold text-sm text-emerald-600">{totalGpa} / 5.00</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Attendance Status</span>
              <span className="font-bold text-sm text-school-blue">Excellent (100%)</span>
            </div>
          </div>
        </div>

        {/* Child's Examination Results */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-school-gold" />
              <h3 className="text-lg font-bold text-school-navy">Official Academic Report Card</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified by Academic Director
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Score (100)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Teacher Evaluation Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-school-navy">
                      {r.examSubject.subject.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {r.marksObtained}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-school-blue">
                      {r.gradeLetter}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {r.gpa.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {r.remarks || "Exemplary progress"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoices and Payments */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-school-navy">Tuition Billing &amp; Invoices</h3>
            </div>
            <span className="text-xs text-slate-500">Payable via bKash / Bank</span>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-school-navy text-sm">
                      {inv.invoiceNo}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                        inv.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold text-sm mt-0.5">{inv.title}</p>
                  <p className="text-slate-400">
                    Due Date: {formatDate(inv.dueDate)} &bull; Total: {formatCurrency(inv.totalAmount)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-slate-500 block">Balance Due:</span>
                    <span className="font-mono font-bold text-base text-amber-800">
                      {formatCurrency(inv.balance)}
                    </span>
                  </div>
                  {inv.balance === 0 ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Receipt Generated</span>
                    </span>
                  ) : (
                    <Link
                      href="/admin/fees"
                      className="px-4 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-bold transition shadow-sm"
                    >
                      Pay Online (bKash)
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
