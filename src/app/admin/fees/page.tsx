"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  Download,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminFeesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalBilled: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    invoiceCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Record Payment Modal
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BKASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchFeesData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/fees?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesData();
  }, [statusFilter]);

  const handleOpenPayment = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentAmount(String(inv.balance));
    setReferenceNo(`BK-TRX-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setPaymentNotes("Verified by school accountant");
    setActionSuccess(null);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setSubmittingPayment(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: parseFloat(paymentAmount),
          paymentMethod,
          referenceNo,
          notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment recording failed");

      setActionSuccess(data.message);
      fetchFeesData();
      setTimeout(() => {
        setSelectedInvoice(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-navy">Fee Accounting &amp; Invoices</h1>
          <p className="text-xs text-school-text-muted">
            Manage tuition billing, receive verified payments, and review outstanding accounts.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="UNPAID">Unpaid Invoices</option>
          <option value="PARTIAL">Partially Paid</option>
          <option value="PAID">Fully Cleared (Paid)</option>
        </select>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Billed Revenue
          </span>
          <p className="text-2xl font-extrabold text-school-navy mt-1">
            {formatCurrency(metrics.totalBilled)}
          </p>
          <span className="text-xs text-slate-400">Total institutional invoices issued</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Total Collected Funds
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {formatCurrency(metrics.totalCollected)}
          </p>
          <span className="text-xs text-slate-400">Received via bKash / Bank</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-school-border shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Outstanding Receivables
          </span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">
            {formatCurrency(metrics.totalOutstanding)}
          </p>
          <span className="text-xs text-slate-400">Unsettled student accounts</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading invoices and financial transactions...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No invoices found for the current selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-6">Invoice No</th>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Title / Month</th>
                  <th className="py-3.5 px-6">Total Billed</th>
                  <th className="py-3.5 px-6">Paid</th>
                  <th className="py-3.5 px-6">Balance Due</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-school-navy">
                      {inv.invoiceNo}
                      <span className="block text-xs font-normal text-slate-400">
                        Due: {formatDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-900 block">
                        {inv.student.firstName} {inv.student.lastName}
                      </span>
                      <span className="text-xs text-slate-400">
                        Roll: {inv.student.rollNo} ({inv.student.gradeLevel?.name})
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-700">{inv.title}</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-emerald-700 font-bold">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-amber-800 font-bold">
                      {formatCurrency(inv.balance)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {inv.balance > 0 ? (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="px-3 py-1.5 rounded bg-school-blue hover:bg-blue-700 text-white font-medium text-xs transition shadow-sm"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-school-border">
            <div className="flex items-center justify-between border-b border-school-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-school-navy">Record Official Payment</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedInvoice.invoiceNo}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
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

            <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-school-border/60">
              <p>
                <strong>Student:</strong> {selectedInvoice.student.firstName}{" "}
                {selectedInvoice.student.lastName}
              </p>
              <p>
                <strong>Invoice Title:</strong> {selectedInvoice.title}
              </p>
              <p className="text-sm font-bold text-amber-800 pt-1">
                Outstanding Balance: {formatCurrency(selectedInvoice.balance)}
              </p>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (BDT ৳) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedInvoice.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm font-mono font-bold focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Gateway / Channel *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm bg-white focus:ring-2 focus:ring-school-blue"
                >
                  <option value="BKASH">bKash Merchant Pay</option>
                  <option value="NAGAD">Nagad Direct</option>
                  <option value="BANK_TRANSFER">Bank Wire / EFT (Standard Chartered / City)</option>
                  <option value="CASH">Institutional Cash Counter</option>
                  <option value="CARD">Debit / Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gateway Transaction ID / Bank Reference
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. BK-TRX-9941028"
                  className="w-full px-3 py-2 rounded-lg border border-school-border text-sm font-mono focus:ring-2 focus:ring-school-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
                >
                  {submittingPayment ? "Processing..." : "Generate Receipt & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
