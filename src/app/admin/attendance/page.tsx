"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAttendancePage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [sectionId, setSectionId] = useState("sec9A"); // Defaults to Grade 9 Padma
  const [sections, setSections] = useState<any[]>([
    { id: "sec9A", name: "Grade 9 - Padma (Room 301)" },
    { id: "sec9B", name: "Grade 9 - Meghna (Room 302)" },
    { id: "sec10A", name: "Grade 10 - Jamuna (Room 303)" },
  ]);

  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAttendance = async () => {
    if (!sectionId || !date) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/attendance?sectionId=${sectionId}&date=${date}`);
      const data = await res.json();
      if (data.success) {
        setRoster(data.students);
      } else {
        throw new Error(data.error || "Failed to load roster");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [sectionId, date]);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, remarks } : s))
    );
  };

  const markAll = (status: string) => {
    setRoster((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        sectionId,
        date,
        records: roster.map((s) => ({
          studentId: s.studentId,
          status: s.status,
          remarks: s.remarks,
        })),
      };

      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setStatusMessage({ type: "success", text: data.message });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = roster.filter((s) => s.status === "PRESENT").length;
  const absentCount = roster.filter((s) => s.status === "ABSENT").length;
  const lateCount = roster.filter((s) => s.status === "LATE").length;
  const attendanceRate = roster.length > 0 ? Math.round((presentCount / roster.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-navy">Daily Class Attendance</h1>
          <p className="text-xs text-school-text-muted">
            Record, verify, and finalize daily student attendance for official institution records.
          </p>
        </div>

        {roster.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll("PRESENT")}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Attendance Roster"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Card */}
      <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Class Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
            >
            </input>
          </div>
        </div>

        {/* Quick Rate Telemetry */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500 block">Total Students</span>
            <span className="font-extrabold text-base text-school-navy">{roster.length}</span>
          </div>
          <div>
            <span className="text-emerald-700 block">Present</span>
            <span className="font-extrabold text-base text-emerald-700">{presentCount}</span>
          </div>
          <div>
            <span className="text-red-700 block">Absent</span>
            <span className="font-extrabold text-base text-red-700">{absentCount}</span>
          </div>
          <div>
            <span className="text-amber-700 block">Late</span>
            <span className="font-extrabold text-base text-amber-700">{lateCount}</span>
          </div>
          <div className="pl-4 border-l border-slate-200">
            <span className="text-slate-500 block">Attendance Rate</span>
            <span className="font-extrabold text-base text-school-blue">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading attendance records for {date}...
          </div>
        ) : roster.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No active students enrolled in this section.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-6">Roll No</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Admission ID</th>
                  <th className="py-3.5 px-6">Attendance Status</th>
                  <th className="py-3.5 px-6">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-school-navy">
                      {s.rollNo}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-400">
                      {s.admissionNo}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, "PRESENT")}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            s.status === "PRESENT"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, "ABSENT")}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            s.status === "ABSENT"
                              ? "bg-red-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, "LATE")}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            s.status === "LATE"
                              ? "bg-amber-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, "EXCUSED")}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            s.status === "EXCUSED"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="text"
                        value={s.remarks || ""}
                        onChange={(e) => handleRemarksChange(s.studentId, e.target.value)}
                        placeholder="Optional remarks..."
                        className="px-3 py-1 rounded border border-school-border text-xs w-full max-w-xs focus:ring-1 focus:ring-school-blue"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
