"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Shield,
  Key,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Redirect to designated portal
      router.push(data.redirectPath || "/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl bg-school-navy flex items-center justify-center text-school-gold shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-school-navy tracking-tight">
          Apex International School
        </h1>
        <p className="text-xs text-school-text-muted">
          Institutional Management System &bull; Unified Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-school-border space-y-6">
          <div>
            <h2 className="text-lg font-bold text-school-navy">Sign In to Your Portal</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your authorized email address and password to continue.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apex-intl.edu.bd"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-school-border text-sm focus:ring-2 focus:ring-school-blue"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-school-blue hover:bg-blue-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In Securely"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demonstration Accounts Quick-Fill Panel */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Demonstration Test Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoAccount("admin@apex-intl.edu.bd", "Admin@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Super Admin</span>
                <span className="text-[10px] text-slate-500">Full System Access</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("principal@apex-intl.edu.bd", "Password@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Principal</span>
                <span className="text-[10px] text-slate-500">Academic Director</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("rahim@apex-intl.edu.bd", "Password@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Teacher (Rahim)</span>
                <span className="text-[10px] text-slate-500">Maths &amp; Attendance</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("student@apex-intl.edu.bd", "Password@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Student (Ayaan)</span>
                <span className="text-[10px] text-slate-500">Grade 9 Padma</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("parent@apex-intl.edu.bd", "Password@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Parent (Mahmud)</span>
                <span className="text-[10px] text-slate-500">Ayaan&apos;s Father</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("accounts@apex-intl.edu.bd", "Password@AIS2026")}
                className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition"
              >
                <span className="block font-bold text-school-navy">Accountant</span>
                <span className="text-[10px] text-slate-500">Fees &amp; Invoices</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-school-blue underline">
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
