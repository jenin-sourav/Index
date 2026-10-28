import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { recordAuditLog } from "@/lib/audit";

const studentCreateSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid student email is required"),
  admissionNo: z.string().min(3, "Admission number is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  dateOfBirth: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  gradeLevelId: z.string(),
  sectionId: z.string(),
  academicYearId: z.string(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (!canAccessAdmin(user.role) && user.role !== "TEACHER")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const gradeLevelId = searchParams.get("gradeLevelId");
  const status = searchParams.get("status");

  try {
    const whereClause: any = {};

    if (gradeLevelId && gradeLevelId !== "ALL") {
      whereClause.gradeLevelId = gradeLevelId;
    }

    if (status && status !== "ALL") {
      whereClause.enrollmentStatus = status;
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { admissionNo: { contains: search } },
        { rollNo: { contains: search } },
      ];
    }

    const students = await db.student.findMany({
      where: whereClause,
      include: {
        gradeLevel: { select: { id: true, name: true, code: true } },
        section: { select: { id: true, name: true } },
        academicYear: { select: { name: true } },
        guardians: {
          include: {
            guardian: {
              select: { name: true, phone: true, email: true, relationship: true },
            },
          },
        },
      },
      orderBy: { rollNo: "asc" },
    });

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve student directory." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canAccessAdmin(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = studentCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check unique admissionNo
    const existing = await db.student.findUnique({
      where: { admissionNo: data.admissionNo },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A student with this admission number already exists." },
        { status: 400 }
      );
    }

    // Check unique email
    const existingEmail = await db.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "This email address is already assigned to an existing user." },
        { status: 400 }
      );
    }

    const defaultPassword = await bcrypt.hash("Student@AIS2026", 10);

    // Atomic transaction: create User + Student
    const newStudent = await db.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          passwordHash: defaultPassword,
          role: "STUDENT",
          status: "ACTIVE",
        },
      });

      const s = await tx.student.create({
        data: {
          userId: u.id,
          admissionNo: data.admissionNo.trim(),
          rollNo: data.rollNo.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          gradeLevelId: data.gradeLevelId,
          sectionId: data.sectionId,
          academicYearId: data.academicYearId,
          bloodGroup: data.bloodGroup || null,
          address: data.address || null,
          emergencyContact: data.emergencyContact || null,
          enrollmentStatus: "ACTIVE",
        },
        include: {
          gradeLevel: true,
          section: true,
        },
      });

      return s;
    });

    await recordAuditLog({
      action: "CREATE",
      entity: "Student",
      entityId: newStudent.id,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: {
        admissionNo: newStudent.admissionNo,
        name: `${newStudent.firstName} ${newStudent.lastName}`,
        grade: newStudent.gradeLevel.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student enrolled successfully with active portal credentials.",
      student: newStudent,
    });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: "Failed to enroll student. Please check database constraints." },
      { status: 500 }
    );
  }
}
