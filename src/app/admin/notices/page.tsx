"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    content: "",
    contentBn: "",
    priority: "NORMAL",
    targetRole: "ALL",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notices");
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create notice");

      setSuccess(data.message);
      fetchNotices();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
        setFormData({
          title: "",
          titleBn: "",
          content: "",
          contentBn: "",
          priority: "NORMAL",
          targetRole: "ALL",
        });
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-navy">Notices &amp; School Bulletins</h1>
          <p className="text-xs text-school-text-muted">
            Broadcast emergency updates, circulars, and reminders across all institutional portals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{formatDate(n.publishedAt)}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    n.priority === "URGENT"
                      ? "bg-red-100 text-red-700"
                      : n.priority === "IMPORTANT"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {n.priority}
                </span>
              </div>

              <h3 className="text-base font-bold text-school-navy leading-snug">
                {n.title}
              </h3>

              {n.titleBn && (
                <p className="text-xs text-slate-500 font-bengali font-medium">
                  {n.titleBn}
                </p>
              )}

              <p className="text-xs text-school-text-muted leading-relaxed line-clamp-4">
                {n.content}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Target: <strong>{n.targetRole}</strong></span>
              <span className="text-emerald-700 font-semibold">Live &bull; Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Publish Notice */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-school-border">
            <div className="flex items-center justify-between border-b border-school-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-school-navy">Publish New Bulletin</h3>
                <p className="text-xs text-slate-500">
                  Broadcast institutional notice to student, parent, and teacher portals.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Headline (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule for Annual Science Fair 2026"
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বাংলা শিরোনাম (Bangla Headline - Optional)
                </label>
                <input
                  type="text"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="যেমন: বার্ষিক বিজ্ঞান মেলার সময়সূচি ২০২৬"
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue font-bengali"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Marker *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent (Emergency Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Portal Audience *
                  </label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                  >
                    <option value="ALL">All Portals (Public &amp; Internal)</option>
                    <option value="TEACHER">Faculty &amp; Staff Only</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="PARENT">Parents &amp; Guardians Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bulletin Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed text of circular..."
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Broadcast Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
