"use client";

import React, { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(data.message);
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Institutional Communications
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Contact &amp; Campus Location
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              We welcome prospective parents, scholars, and educational partners to connect with
              our administration or visit our Gulshan campus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-school-navy">Campus Administration</h2>

                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-school-blue flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-school-navy">Campus Address</h4>
                      <p className="text-xs text-school-text-muted mt-0.5 leading-relaxed">
                        Plot 14, Road 8, Gulshan-2, Dhaka-1212, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-school-teal flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-school-navy">Telephone &amp; Admissions Desk</h4>
                      <p className="text-xs text-school-text-muted mt-0.5">
                        +880 2 988-1234 (PABX)
                      </p>
                      <p className="text-xs text-school-text-muted">
                        +880 1711-000000 (Admissions Hotline)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 text-school-gold flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-school-navy">Official Email Desks</h4>
                      <p className="text-xs text-school-text-muted mt-0.5">
                        General: <strong>info@apex-intl.edu.bd</strong>
                      </p>
                      <p className="text-xs text-school-text-muted">
                        Admissions: <strong>admissions@apex-intl.edu.bd</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-school-navy">Institutional Office Hours</h4>
                      <p className="text-xs text-school-text-muted mt-0.5">
                        Sunday through Thursday: <strong>8:00 AM – 4:00 PM</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Friday &amp; Saturday: Closed for academic recess
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-5 rounded-2xl bg-school-navy-deep text-white text-xs space-y-2 border border-slate-700">
                <div className="flex items-center gap-2 text-school-gold font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Campus Visitor Protocol</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  All prospective visitors must carry photo identification (NID / Passport) and
                  report directly to the Security Reception at Gate 1 for a visitor badge.
                </p>
              </div>
            </div>

            {/* Right: Working Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-school-blue">
                  Online Inquiry Desk
                </span>
                <h2 className="text-2xl font-bold text-school-navy mt-1">Send an Inquiry</h2>
                <p className="text-xs text-school-text-muted mt-1">
                  Have questions about our academic curriculum, admission criteria, or school tours?
                  Fill out the form below.
                </p>
              </div>

              {success ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-bold text-base text-emerald-900">Message Delivered</h3>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">{success}</p>
                  <button
                    onClick={() => setSuccess(null)}
                    className="text-xs font-semibold text-emerald-900 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Dr. Mahmudul Hasan"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="user@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telephone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1711-XXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Grade 9 Admission Requirements"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please enter your specific question or request..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
