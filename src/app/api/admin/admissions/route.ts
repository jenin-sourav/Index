import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageAdmissions } from "@/lib/rbac";
import { recordAuditLog } from "@/lib/audit";

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "ASSESSMENT_SCHEDULED",
    "ACCEPTED",
    "REJECTED",
  ]),
  assessmentDate: z.string().optional().nullable(),
  interviewDate: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageAdmissions(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const gradeLevelId = searchParams.get("gradeLevelId");

  try {
    const whereClause: any = {};
    if (status && status !== "ALL") whereClause.status = status;
    if (gradeLevelId && gradeLevelId !== "ALL") whereClause.applyingForGradeId = gradeLevelId;

    const applications = await db.admissionApplication.findMany({
      where: whereClause,
      include: {
        gradeLevel: { select: { id: true, name: true, code: true } },
      },
      orderBy: { submissionDate: "desc" },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Admissions list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission applications." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageAdmissions(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, status, assessmentDate, interviewDate, adminNotes } = result.data;

    const updated = await db.admissionApplication.update({
      where: { id },
      data: {
        status,
        assessmentDate: assessmentDate ? new Date(assessmentDate) : undefined,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
      include: {
        gradeLevel: true,
      },
    });

    await recordAuditLog({
      action: "UPDATE",
      entity: "AdmissionApplication",
      entityId: id,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: {
        applicationNo: updated.applicationNo,
        newStatus: status,
        notes: adminNotes,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Application ${updated.applicationNo} updated to ${status}.`,
      application: updated,
    });
  } catch (error) {
    console.error("Update admission error:", error);
    return NextResponse.json(
      { error: "Failed to update admission application status." },
      { status: 500 }
    );
  }
}
