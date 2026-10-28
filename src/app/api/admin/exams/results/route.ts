import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canEnterMarks, canPublishResults } from "@/lib/rbac";
import { calculateGrade } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";

const saveMarksSchema = z.object({
  examSubjectId: z.string(),
  marks: z.array(
    z.object({
      studentId: z.string(),
      marksObtained: z.number().min(0).max(100),
      remarks: z.string().optional().nullable(),
    })
  ),
  publishImmediately: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const examSubjectId = searchParams.get("examSubjectId");

  if (!examSubjectId) {
    return NextResponse.json(
      { error: "examSubjectId is required" },
      { status: 400 }
    );
  }

  try {
    const examSubject = await db.examSubject.findUnique({
      where: { id: examSubjectId },
      include: {
        exam: true,
        subject: true,
        gradeLevel: true,
      },
    });

    if (!examSubject) {
      return NextResponse.json({ error: "Exam subject not found" }, { status: 404 });
    }

    // Get all students of this grade level
    const students = await db.student.findMany({
      where: { gradeLevelId: examSubject.gradeLevelId, enrollmentStatus: "ACTIVE" },
      select: {
        id: true,
        rollNo: true,
        admissionNo: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { rollNo: "asc" },
    });

    // Get existing results
    const results = await db.examResult.findMany({
      where: { examSubjectId },
    });
    const resultMap = new Map(results.map((r) => [r.studentId, r]));

    const roster = students.map((s) => {
      const res = resultMap.get(s.id);
      return {
        studentId: s.id,
        rollNo: s.rollNo,
        admissionNo: s.admissionNo,
        name: `${s.firstName} ${s.lastName}`,
        marksObtained: res ? res.marksObtained : null,
        gradeLetter: res ? res.gradeLetter : null,
        gpa: res ? res.gpa : null,
        remarks: res ? res.remarks : "",
        status: res ? res.status : "PENDING",
      };
    });

    return NextResponse.json({
      success: true,
      examSubject: {
        id: examSubject.id,
        examName: examSubject.exam.name,
        subjectName: examSubject.subject.name,
        gradeName: examSubject.gradeLevel.name,
        maxMarks: examSubject.maxMarks,
        passMarks: examSubject.passMarks,
      },
      roster,
    });
  } catch (error) {
    console.error("Fetch exam marks error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve examination gradebook." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canEnterMarks(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = saveMarksSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { examSubjectId, marks, publishImmediately } = result.data;

    // Check if user has permission to publish
    const status = publishImmediately && canPublishResults(user.role) ? "PUBLISHED" : "SUBMITTED";

    const examSubject = await db.examSubject.findUnique({
      where: { id: examSubjectId },
    });

    if (!examSubject) {
      return NextResponse.json({ error: "Exam subject not found" }, { status: 404 });
    }

    // Process and upsert each mark with automatic grade and GPA calculation
    await db.$transaction(
      marks.map((m) => {
        const gradeInfo = calculateGrade(m.marksObtained, examSubject.maxMarks);
        return db.examResult.upsert({
          where: {
            examSubjectId_studentId: {
              examSubjectId,
              studentId: m.studentId,
            },
          },
          update: {
            marksObtained: m.marksObtained,
            gradeLetter: gradeInfo.gradeLetter,
            gpa: gradeInfo.gpa,
            remarks: m.remarks || gradeInfo.remarks,
            status,
            enteredById: user.id,
            approvedById: status === "PUBLISHED" ? user.id : undefined,
          },
          create: {
            examSubjectId,
            studentId: m.studentId,
            marksObtained: m.marksObtained,
            gradeLetter: gradeInfo.gradeLetter,
            gpa: gradeInfo.gpa,
            remarks: m.remarks || gradeInfo.remarks,
            status,
            enteredById: user.id,
            approvedById: status === "PUBLISHED" ? user.id : undefined,
          },
        });
      })
    );

    await recordAuditLog({
      action: status === "PUBLISHED" ? "PUBLISH" : "UPDATE",
      entity: "ExamResult",
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: {
        examSubjectId,
        totalEntries: marks.length,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Marks saved successfully with status: ${status}.`,
    });
  } catch (error) {
    console.error("Save exam marks error:", error);
    return NextResponse.json(
      { error: "Failed to save examination marks." },
      { status: 500 }
    );
  }
}
