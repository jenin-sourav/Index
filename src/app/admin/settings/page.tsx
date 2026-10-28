import React from "react";
import { db } from "@/lib/db";
import { Settings, Building2, Globe, Shield, Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await db.systemSetting.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-school-navy">Institutional Parameters &amp; Settings</h1>
        <p className="text-xs text-school-text-muted">
          Configure institutional identity, contact desks, academic rules, and security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Institutional Identity */}
        <div className="bg-white rounded-2xl border border-school-border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-school-border pb-3">
            <Building2 className="w-5 h-5 text-school-navy" />
            <h2 className="text-base font-bold text-school-navy">Identity &amp; Localization</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Institution Name</label>
              <input
                type="text"
                readOnly
                defaultValue="Apex International School, Dhaka"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Timezone Configuration</label>
              <input
                type="text"
                readOnly
                defaultValue="Asia/Dhaka (UTC+06:00)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Institutional Currency</label>
              <input
                type="text"
                readOnly
                defaultValue="Bangladeshi Taka (BDT, ৳)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white rounded-2xl border border-school-border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-school-border pb-3">
            <Shield className="w-5 h-5 text-school-teal" />
            <h2 className="text-base font-bold text-school-navy">Security &amp; Session Policies</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Session Cookie Lifetime</label>
              <input
                type="text"
                readOnly
                defaultValue="7 Days (HttpOnly, SameSite=Lax, Crypto Signed)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Password Hashing Algorithm</label>
              <input
                type="text"
                readOnly
                defaultValue="bcrypt (Salt rounds: 10)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Audit Trail Policy</label>
              <input
                type="text"
                readOnly
                defaultValue="Immutable Database Persistence (All mutating calls)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
