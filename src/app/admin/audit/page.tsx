import React from "react";
import { db } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import { ShieldAlert, Terminal, Lock, User, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-school-navy">
            <ShieldAlert className="w-6 h-6 text-school-blue" />
            <h1 className="text-2xl font-bold">Tamper-Evident Audit Trail</h1>
          </div>
          <p className="text-xs text-school-text-muted mt-0.5">
            Immutable application activity log capturing authentication, grade modifications, financial receipts, and administrative changes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-white px-3 py-2 rounded-lg border border-school-border">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Integrity Guard: Server-Enforced</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3.5 px-6">Timestamp (Dhaka)</th>
                <th className="py-3.5 px-6">Action &amp; Target</th>
                <th className="py-3.5 px-6">Actor Credentials</th>
                <th className="py-3.5 px-6">Origin IP</th>
                <th className="py-3.5 px-6">Transaction Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-6 text-slate-600">
                    <span className="block font-bold text-slate-800">
                      {formatDate(log.createdAt)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatTime(log.createdAt)}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mr-2 ${
                        log.action === "DELETE"
                          ? "bg-red-100 text-red-800"
                          : log.action === "PAYMENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action === "PUBLISH"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800 font-sans">
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">
                    <span className="block font-semibold">
                      {log.actorEmail || "SYSTEM ENGINE"}
                    </span>
                    <span className="text-[10px] text-school-blue font-bold uppercase tracking-wider">
                      {log.actorRole || "DAEMON"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">{log.ipAddress || "127.0.0.1"}</td>
                  <td className="py-3.5 px-6">
                    <pre className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 max-w-sm truncate whitespace-pre-wrap font-mono">
                      {log.details || "{}"}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
