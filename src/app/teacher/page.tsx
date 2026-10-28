import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  GraduationCap,
  CalendarCheck2,
  Award,
  BookOpen,
  CalendarDays,
  LogOut,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherPortalPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "TEACHER" && user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  let teacher: any = user.teacher;
  if (!teacher) {
    teacher = await db.teacher.findFirst();
  }

  if (!teacher) {
    return <div className="p-8 text-center">No teacher record linked.</div>;
  }

  const [timetable, students] = await Promise.all([
    db.timetableEntry.findMany({
      where: { teacherId: teacher.id },
      include: { gradeLevel: true, section: true, subject: true },
      orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
    }),
    db.student.findMany({
      where: { enrollmentStatus: "ACTIVE" },
      take: 8,
      include: { gradeLevel: true, section: true },
      orderBy: { rollNo: "asc" },
    }),
  ]);

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
            <p className="text-xs text-school-teal font-semibold">Faculty &amp; Educator Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-slate-300">
            Instructor: <strong>{teacher.name}</strong>
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
        {/* Profile Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-school-navy text-school-gold flex items-center justify-center text-2xl font-bold shadow">
              {teacher.name
                .split(" ")
                .slice(0, 2)
                .map((n: string) => n[0])
                .join("")}
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-school-teal text-xs font-bold uppercase tracking-wider mb-1">
                Faculty Member
              </div>
              <h2 className="text-2xl font-extrabold text-school-navy">{teacher.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {teacher.designation} &bull; Dept: <strong>{teacher.department}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/attendance"
              className="px-4 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Mark Class Attendance</span>
            </Link>
            <Link
              href="/admin/exams"
              className="px-4 py-2 rounded-lg bg-school-navy hover:bg-school-navy-deep text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Enter Exam Marks</span>
            </Link>
          </div>
        </div>

        {/* Teaching Timetable */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-school-teal" />
              <h3 className="text-lg font-bold text-school-navy">Weekly Instructional Schedule</h3>
            </div>
            <span className="text-xs text-slate-500">Academic Year 2026-2027</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timetable.slice(0, 6).map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-school-blue uppercase tracking-wider block">
                  {t.dayOfWeek} &bull; Period {t.periodNumber}
                </span>
                <p className="font-bold text-sm text-school-navy">{t.subject.name}</p>
                <p className="text-slate-600">
                  Target: {t.gradeLevel.name} ({t.section.name}) &bull; Room {t.room || "301"}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  {t.startTime} – {t.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Class Student Roster */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-school-border pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-school-blue" />
              <h3 className="text-lg font-bold text-school-navy">Assigned Class Roster (Grade 9)</h3>
            </div>
            <Link href="/admin/students" className="text-xs font-bold text-school-blue hover:underline">
              Full Directory &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission ID</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Enrollment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-school-navy">
                      {s.rollNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      {s.admissionNo}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {s.section.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {s.enrollmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
