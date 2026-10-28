import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageFees } from "@/lib/rbac";
import { generatePaymentNo } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";

const recordPaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive("Payment amount must be greater than zero"),
  paymentMethod: z.enum(["BKASH", "NAGAD", "BANK_TRANSFER", "CASH", "CARD"]),
  referenceNo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (!canManageFees(user.role) && user.role !== "PRINCIPAL")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const whereClause: any = {};
    if (status && status !== "ALL") whereClause.status = status;

    const invoices = await db.invoice.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            rollNo: true,
            gradeLevel: { select: { name: true } },
            section: { select: { name: true } },
          },
        },
        payments: {
          orderBy: { transactionDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate aggregated metrics
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalBilled,
        totalCollected,
        totalOutstanding,
        invoiceCount: invoices.length,
      },
      invoices,
    });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve invoices." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageFees(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = recordPaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { invoiceId, amount, paymentMethod, referenceNo, notes } = result.data;

    // Fetch existing invoice
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: { student: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    if (amount > invoice.balance) {
      return NextResponse.json(
        { error: `Payment amount (${amount} BDT) exceeds outstanding balance (${invoice.balance} BDT).` },
        { status: 400 }
      );
    }

    const paymentCount = await db.payment.count();
    const paymentNo = generatePaymentNo(paymentCount);

    const updatedInvoice = await db.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          paymentNo,
          invoiceId,
          amount,
          paymentMethod,
          referenceNo: referenceNo || null,
          transactionDate: new Date(),
          receivedById: user.id,
          notes: notes || "Recorded via School Accounts Module",
        },
      });

      const newPaid = invoice.paidAmount + amount;
      const newBalance = invoice.totalAmount - newPaid;
      const newStatus = newBalance <= 0 ? "PAID" : "PARTIAL";

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaid,
          balance: newBalance,
          status: newStatus,
        },
      });

      return { payment, invoice: updated };
    });

    await recordAuditLog({
      action: "PAYMENT",
      entity: "Invoice",
      entityId: invoice.id,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: {
        paymentNo,
        amount,
        paymentMethod,
        studentName: `${invoice.student.firstName} ${invoice.student.lastName}`,
        referenceNo,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Payment of ৳${amount} recorded successfully. Receipt No: ${paymentNo}`,
      payment: updatedInvoice.payment,
      invoice: updatedInvoice.invoice,
    });
  } catch (error) {
    console.error("Record payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment." },
      { status: 500 }
    );
  }
}
