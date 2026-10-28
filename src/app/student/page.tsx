import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  GraduationCap,
  CalendarCheck2,
  Award,
  CreditCard,
  CalendarDays,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentPortalPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "STUDENT" && user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  // Fetch student details or fallback to first student for admin preview
  let student: any = user.student;
  if (!student) {
    student = await db.student.findFirst({
      include: {
        gradeLevel: true,
        section: true,
      },
    });
  }

  if (!student) {
    return <div className="p-8 text-center">No student record linked to account.</div>;
  }

  // Fetch student academic data
  const [examResults, attendances, invoices, timetable] = await Promise.all([
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
      take: 10,
    }),
    db.invoice.findMany({
      where: { studentId: student.id },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    }),
    db.timetableEntry.findMany({
      where: { sectionId: student.sectionId },
      include: { subject: true, teacher: true },
      orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
    }),
  ]);

  // Aggregate stats
  const totalDays = attendances.length;
  const presentDays = attendances.filter((a) => a.status === "PRESENT").length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

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
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Apex International School
            </h1>
            <p className="text-xs text-school-teal font-semibold">Student Academic Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-slate-300">
            Welcome, <strong>{student.firstName} {student.lastName}</strong>
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
        {/* Student Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-school-blue text-white flex items-center justify-center text-2xl font-bold shadow">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-school-blue text-xs font-bold uppercase tracking-wider mb-1">
                Active Student
              </div>
              <h2 className="text-2xl font-extrabold text-school-navy">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Admission ID: <span className="font-mono text-slate-700">{student.admissionNo}</span> &bull;
                Class Roll: <span className="font-mono text-slate-700">{student.rollNo}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Class / Grade</span>
              <span className="font-bold text-sm text-school-navy">Grade 9 (Padma)</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Cumulative GPA</span>
              <span className="font-bold text-sm text-emerald-600">{totalGpa} / 5.00</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider">Attendance</span>
              <span className="font-bold text-sm text-school-blue">{attendanceRate}%</span>
            </div>
          </div>
        </div>

        {/* Exam Results & Report Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-school-gold" />
              <h3 className="text-lg font-bold text-school-navy">Published Examination Results</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">Term 1 Assessment 2026</span>
          </div>

          {examResults.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No published results yet for this term.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Marks (100)</th>
                    <th className="py-3 px-4">Letter Grade</th>
                    <th className="py-3 px-4">GPA</th>
                    <th className="py-3 px-4">Faculty Feedback</th>
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
                        {r.remarks || "Satisfactory"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Weekly Timetable */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-school-border pb-4">
            <CalendarDays className="w-5 h-5 text-school-teal" />
            <h3 className="text-lg font-bold text-school-navy">My Class Timetable (Grade 9 Padma)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timetable.slice(0, 6).map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-school-blue uppercase tracking-wider block">
                  {t.dayOfWeek} &bull; Period {t.periodNumber} ({t.startTime} - {t.endTime})
                </span>
                <p className="font-bold text-sm text-school-navy">{t.subject.name}</p>
                <p className="text-slate-500">Instructor: {t.teacher.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tuition Invoices */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-school-border pb-4">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-school-navy">Tuition Invoices &amp; Receipts</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-school-navy block">{inv.invoiceNo}</span>
                  <p className="text-slate-700 font-semibold">{inv.title}</p>
                  <span className="text-slate-400">Due: {formatDate(inv.dueDate)}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900 block">
                    {formatCurrency(inv.totalAmount)}
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
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
