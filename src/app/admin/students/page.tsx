"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    admissionNo: "",
    rollNo: "",
    dateOfBirth: "",
    gender: "MALE",
    gradeLevelId: "",
    sectionId: "",
    academicYearId: "",
    bloodGroup: "B+",
    address: "",
    emergencyContact: "",
  });

  // Reference data
  const [grades, setGrades] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (gradeFilter !== "ALL") params.set("gradeLevelId", gradeFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (e) {
      console.error("Fetch students error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // Find default Grade 9 and Padma section IDs if not selected
      const grade = grades.find((g) => g.code === "G9") || grades[0];
      const section = sections[0];

      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gradeLevelId: formData.gradeLevelId || (grade ? grade.id : "G9"),
          sectionId: formData.sectionId || (section ? section.id : "sec9A"),
          academicYearId: formData.academicYearId || "2026-2027",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create student");
      }

      setFormSuccess(data.message);
      fetchStudents();
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-navy">Student Directory</h1>
          <p className="text-xs text-school-text-muted">
            Manage student registrations, academic rolls, guardian links, and enrollment status.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              admissionNo: `AIS-2026-0${100 + students.length + 1}`,
              rollNo: String(students.length + 101),
              dateOfBirth: "2011-05-15",
              gender: "MALE",
              gradeLevelId: "",
              sectionId: "",
              academicYearId: "",
              bloodGroup: "B+",
              address: "Gulshan-2, Dhaka",
              emergencyContact: "+880 1711-000000",
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-school-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, or admission ID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-school-navy hover:bg-school-navy-deep text-white font-medium text-sm transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading student records from database...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-6">Roll &amp; ID</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Class &amp; Section</th>
                  <th className="py-3.5 px-6">Guardian Info</th>
                  <th className="py-3.5 px-6">Blood Grp</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6">
                      <span className="font-mono font-bold text-school-navy block">
                        Roll: {s.rollNo}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {s.admissionNo}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">
                        {s.firstName} {s.lastName}
                      </span>
                      <span className="text-xs text-slate-500">
                        DOB: {formatDate(s.dateOfBirth)} &bull; {s.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-school-blue block">
                        {s.gradeLevel?.name || "Grade 9"}
                      </span>
                      <span className="text-xs text-slate-500">
                        Section: {s.section?.name || "Padma"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs">
                      {s.guardians && s.guardians[0]?.guardian ? (
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {s.guardians[0].guardian.name}
                          </span>
                          <span className="text-slate-500">
                            {s.guardians[0].guardian.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Self / Contact pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {s.bloodGroup || "O+"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          s.enrollmentStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {s.enrollmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Enroll New Student */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-school-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-school-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-school-navy">Enroll New Student</h3>
                <p className="text-xs text-school-text-muted">
                  Create academic student profile and provisioning portal login.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="firstname.lastname@apex-intl.edu.bd"
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm font-mono focus:ring-2 focus:ring-school-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm font-mono focus:ring-2 focus:ring-school-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
                >
                  {formSubmitting ? "Enrolling..." : "Confirm & Save Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
