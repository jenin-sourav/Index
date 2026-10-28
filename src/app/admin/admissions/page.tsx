"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  X,
  Phone,
  Mail,
  User,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Application Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/admissions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error("Fetch admissions error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleOpenReview = (app: any) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAssessmentDate(app.assessmentDate ? new Date(app.assessmentDate).toISOString().split("T")[0] : "");
    setAdminNotes(app.adminNotes || "");
    setActionSuccess(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          status: newStatus,
          assessmentDate: assessmentDate ? new Date(assessmentDate).toISOString() : null,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setActionSuccess(data.message);
      fetchApplications();
      setTimeout(() => {
        setSelectedApp(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-navy">Admissions Pipeline</h1>
          <p className="text-xs text-school-text-muted">
            Track student intake from initial registration to assessment, interview, and formal offer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
          >
            <option value="ALL">All Application Stages</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSESSMENT_SCHEDULED">Assessment Scheduled</option>
            <option value="ACCEPTED">Accepted / Offer Dispatched</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading candidate applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No applications found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-6">Reference No</th>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Grade Level</th>
                  <th className="py-3.5 px-6">Guardian Contact</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6">
                      <span className="font-mono font-bold text-school-navy block">
                        {app.applicationNo}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(app.submissionDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">
                        {app.applicantFirstName} {app.applicantLastName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {app.gender} &bull; DOB: {formatDate(app.dateOfBirth)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-school-blue">
                        {app.gradeLevel?.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs">
                      <span className="font-bold text-slate-800 block">{app.parentName}</span>
                      <span className="text-slate-500">{app.parentPhone}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
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
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1.5 rounded bg-school-navy hover:bg-school-navy-deep text-white font-medium text-xs transition"
                      >
                        Review / Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-school-border">
            <div className="flex items-center justify-between border-b border-school-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-school-navy">Review Application</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApp.applicationNo}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Candidate Summary */}
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-school-border/60">
              <p>
                <strong>Candidate:</strong> {selectedApp.applicantFirstName}{" "}
                {selectedApp.applicantLastName} ({selectedApp.gender})
              </p>
              <p>
                <strong>Target Grade:</strong> {selectedApp.gradeLevel?.name}
              </p>
              <p>
                <strong>Parent / Contact:</strong> {selectedApp.parentName} ({selectedApp.parentPhone})
              </p>
              {selectedApp.previousSchool && (
                <p>
                  <strong>Previous Institution:</strong> {selectedApp.previousSchool}
                </p>
              )}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admissions Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ASSESSMENT_SCHEDULED">Assessment Scheduled</option>
                  <option value="ACCEPTED">Accepted (Offer Letter Issued)</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {newStatus === "ASSESSMENT_SCHEDULED" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment Date &amp; Time
                  </label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Committee Feedback / Public Tracker Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Official notes visible to applicant in tracking portal..."
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
