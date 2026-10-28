import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canRecordAttendance } from "@/lib/rbac";
import { recordAuditLog } from "@/lib/audit";

const recordAttendanceSchema = z.object({
  sectionId: z.string(),
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
      remarks: z.string().optional().nullable(),
    })
  ),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (!canRecordAttendance(user.role) && user.role !== "PRINCIPAL")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  const dateStr = searchParams.get("date");

  if (!sectionId || !dateStr) {
    return NextResponse.json(
      { error: "sectionId and date are required parameters" },
      { status: 400 }
    );
  }

  try {
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    // Fetch students of this section
    const students = await db.student.findMany({
      where: { sectionId, enrollmentStatus: "ACTIVE" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNo: true,
        admissionNo: true,
      },
      orderBy: { rollNo: "asc" },
    });

    // Fetch existing attendance records for this date
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendances = await db.attendance.findMany({
      where: {
        sectionId,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    const attendanceMap = new Map(attendances.map((a) => [a.studentId, a]));

    const result = students.map((s) => ({
      studentId: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      rollNo: s.rollNo,
      admissionNo: s.admissionNo,
      status: attendanceMap.get(s.id)?.status || "PRESENT",
      remarks: attendanceMap.get(s.id)?.remarks || "",
    }));

    return NextResponse.json({ success: true, date: dateStr, students: result });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve attendance roster." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canRecordAttendance(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = recordAttendanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { sectionId, date, records } = result.data;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Batch upsert attendance records
    await db.$transaction(
      records.map((r) =>
        db.attendance.upsert({
          where: {
            studentId_date: {
              studentId: r.studentId,
              date: targetDate,
            },
          },
          update: {
            status: r.status,
            remarks: r.remarks || null,
            recordedById: user.id,
          },
          create: {
            studentId: r.studentId,
            sectionId,
            date: targetDate,
            status: r.status,
            remarks: r.remarks || null,
            recordedById: user.id,
          },
        })
      )
    );

    await recordAuditLog({
      action: "UPDATE",
      entity: "Attendance",
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: {
        sectionId,
        date,
        totalMarked: records.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Attendance marked successfully for ${records.length} students.`,
    });
  } catch (error) {
    console.error("Save attendance error:", error);
    return NextResponse.json(
      { error: "Failed to save attendance entries." },
      { status: 500 }
    );
  }
}
