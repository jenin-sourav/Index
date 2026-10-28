"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function AdmissionsContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  // Form State
  const [formData, setFormData] = useState({
    applicantFirstName: "",
    applicantLastName: "",
    dateOfBirth: "",
    gender: "MALE",
    applyingForGradeId: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    previousSchool: "",
    address: "",
  });

  const [grades, setGrades] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tracker State
  const [trackingRef, setTrackingRef] = useState(initialRef);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Fetch available grade levels for application
  useEffect(() => {
    // Populate standard grade levels
    setGrades([
      { id: "G6", name: "Grade 6 (Middle School)" },
      { id: "G7", name: "Grade 7 (Middle School)" },
      { id: "G8", name: "Grade 8 (Middle School)" },
      { id: "G9", name: "Grade 9 (Senior Secondary - IGCSE/SSC)" },
      { id: "G10", name: "Grade 10 (Senior Secondary)" },
      { id: "G11", name: "Grade 11 (A-Levels / HSC)" },
      { id: "G12", name: "Grade 12 (A-Levels / HSC)" },
    ]);

    if (initialRef) {
      handleTrackSubmit(initialRef);
    }
  }, [initialRef]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Find actual grade or default
      const res = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // If grade id was symbol, map to real grade from database
          applyingForGradeId: formData.applyingForGradeId || "G9",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitSuccess(data);
      setTrackingRef(data.applicationNo);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (codeToTrack?: string) => {
    const code = codeToTrack || trackingRef;
    if (!code.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/admissions/track?ref=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Application not found");
      }

      setTrackingResult(data);
    } catch (err: any) {
      setTrackingError(err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Banner */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-gold/20 text-school-gold text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Session 2026-2027</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Online Admissions &amp; Enrollment
              </h1>
              <p className="text-slate-300 text-base leading-relaxed">
                Welcome to Apex International School. Our transparent, merit-oriented admissions
                process identifies curious, driven students ready to thrive in a challenging global
                curriculum.
              </p>
            </div>
          </div>

          {/* Quick Nav Anchor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Online Application Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
              <div className="border-b border-school-border pb-4">
                <div className="flex items-center gap-2 text-school-blue font-bold text-xs uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Step 1 of 3</span>
                </div>
                <h2 className="text-2xl font-bold text-school-navy">Digital Admission Form</h2>
                <p className="text-xs text-school-text-muted mt-1">
                  Please fill out the candidate information accurately. All fields marked with * are required.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900">Application Submitted!</h3>
                      <p className="text-xs text-emerald-700">
                        Your application has been received and logged in our admissions database.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 space-y-2">
                    <span className="text-xs text-slate-500 font-medium">Your Reference Code:</span>
                    <p className="text-2xl font-mono font-extrabold text-school-navy">
                      {submitSuccess.applicationNo}
                    </p>
                    <p className="text-xs text-slate-600">
                      Applicant: <strong>{submitSuccess.applicantName}</strong> &bull; Grade:{" "}
                      <strong>{submitSuccess.gradeName}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Please note down this reference code. Our admissions office will review your
                    documents and notify you regarding the assessment schedule within 3 business days.
                  </p>

                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      handleTrackSubmit(submitSuccess.applicationNo);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition"
                  >
                    View Status in Live Tracker Below
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Candidate Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="applicantFirstName"
                        required
                        value={formData.applicantFirstName}
                        onChange={handleFormChange}
                        placeholder="e.g. Nabil"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="applicantLastName"
                        required
                        value={formData.applicantLastName}
                        onChange={handleFormChange}
                        placeholder="e.g. Zaman"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                  </div>

                  {/* DOB, Gender, Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Applying For Grade *
                      </label>
                      <select
                        name="applyingForGradeId"
                        required
                        value={formData.applyingForGradeId}
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                      >
                        <option value="">Select Grade</option>
                        <option value="G6">Grade 6</option>
                        <option value="G7">Grade 7</option>
                        <option value="G8">Grade 8</option>
                        <option value="G9">Grade 9</option>
                        <option value="G10">Grade 10</option>
                        <option value="G11">Grade 11</option>
                        <option value="G12">Grade 12</option>
                      </select>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="pt-2 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-school-navy">
                      Parent / Legal Guardian Information
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Parent / Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleFormChange}
                        placeholder="e.g. Engr. Saif Zaman"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Contact Telephone *
                        </label>
                        <input
                          type="tel"
                          name="parentPhone"
                          required
                          value={formData.parentPhone}
                          onChange={handleFormChange}
                          placeholder="+880 1711-XXXXXX"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="parentEmail"
                          required
                          value={formData.parentEmail}
                          onChange={handleFormChange}
                          placeholder="parent@example.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Previous School Attended (If Applicable)
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleFormChange}
                      placeholder="e.g. Scholastica, Senior Campus"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Address (Dhaka)
                    </label>
                    <textarea
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleFormChange}
                      placeholder="e.g. House 14, Road 8, Gulshan-2, Dhaka"
                      className="w-full px-3.5 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting Application..." : "Submit Formal Admission Application"}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Live Application Tracker & Admissions Workflow */}
            <div className="space-y-8">
              {/* Tracker Widget */}
              <div id="track" className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-school-teal font-bold text-xs uppercase tracking-wider mb-1">
                    <Search className="w-4 h-4" />
                    <span>Real-Time Status Verification</span>
                  </div>
                  <h2 className="text-2xl font-bold text-school-navy">Track Application Status</h2>
                  <p className="text-xs text-school-text-muted mt-1">
                    Check the current review stage, scheduled assessment time, and administrative feedback.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingRef}
                    onChange={(e) => setTrackingRef(e.target.value)}
                    placeholder="e.g. AIS-APP-2026-0301"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                  />
                  <button
                    type="button"
                    onClick={() => handleTrackSubmit()}
                    disabled={trackingLoading}
                    className="px-5 py-2.5 rounded-lg bg-school-navy hover:bg-school-navy-deep text-white font-semibold text-sm transition"
                  >
                    {trackingLoading ? "Verifying..." : "Track"}
                  </button>
                </div>

                {trackingError && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>{trackingError}</span>
                  </div>
                )}

                {trackingResult && (
                  <div className="p-6 rounded-xl bg-slate-50 border border-school-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {trackingResult.applicationNo}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          trackingResult.status === "ACCEPTED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : trackingResult.status === "ASSESSMENT_SCHEDULED"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : trackingResult.status === "UNDER_REVIEW"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {trackingResult.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-school-navy">
                        {trackingResult.applicantName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Target Grade: <strong>{trackingResult.applyingForGrade}</strong> &bull;
                        Submission Date: <strong>{formatDate(trackingResult.submissionDate)}</strong>
                      </p>
                    </div>

                    {trackingResult.assessmentDate && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Clock className="w-3.5 h-3.5 text-school-blue" />
                          <span>Aptitude Assessment Scheduled</span>
                        </div>
                        <p>{formatDate(trackingResult.assessmentDate)} at 10:00 AM (Dhaka Time)</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Admissions Committee Notes
                      </span>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                        {trackingResult.adminNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Admissions Timeline Guide */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-school-navy">Admissions Workflow Steps</h3>
                <ol className="space-y-3 text-xs text-school-text-muted">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-school-blue font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <span>
                      <strong>Application &amp; Fee Submission:</strong> Complete digital form and
                      submit birth certificate / previous academic reports.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-school-blue font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <span>
                      <strong>Age-Appropriate Aptitude Evaluation:</strong> Cognitive and
                      numeracy/literacy interaction with department faculty.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-school-blue font-bold flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <span>
                      <strong>Parent Interaction &amp; Offer Letter:</strong> Principal discussion,
                      formal seat offer, and enrollment confirmation.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-school-bg flex items-center justify-center p-8 text-school-navy text-sm font-semibold">
          Loading Admissions Portal...
        </div>
      }
    >
      <AdmissionsContent />
    </Suspense>
  );
}
