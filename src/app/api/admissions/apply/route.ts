import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateApplicationNo } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";

const applicationSchema = z.object({
  applicantFirstName: z.string().min(2, "First name is required"),
  applicantLastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  applyingForGradeId: z.string().min(1, "Please select the applying grade"),
  parentName: z.string().min(3, "Parent/Guardian name is required"),
  parentPhone: z.string().min(10, "Valid contact telephone is required"),
  parentEmail: z.string().email("Valid parent email is required"),
  previousSchool: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify grade level exists
    const grade = await db.gradeLevel.findUnique({
      where: { id: data.applyingForGradeId },
    });

    if (!grade) {
      return NextResponse.json(
        { error: "Selected grade level is not valid." },
        { status: 400 }
      );
    }

    // Generate unique application reference code
    let applicationNo = generateApplicationNo();
    let exists = await db.admissionApplication.findUnique({ where: { applicationNo } });
    while (exists) {
      applicationNo = generateApplicationNo();
      exists = await db.admissionApplication.findUnique({ where: { applicationNo } });
    }

    const application = await db.admissionApplication.create({
      data: {
        applicationNo,
        applicantFirstName: data.applicantFirstName.trim(),
        applicantLastName: data.applicantLastName.trim(),
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        applyingForGradeId: data.applyingForGradeId,
        parentName: data.parentName.trim(),
        parentPhone: data.parentPhone.trim(),
        parentEmail: data.parentEmail.toLowerCase().trim(),
        previousSchool: data.previousSchool?.trim() || null,
        address: data.address?.trim() || null,
        status: "SUBMITTED",
        submissionDate: new Date(),
      },
    });

    await recordAuditLog({
      action: "CREATE",
      entity: "AdmissionApplication",
      entityId: application.id,
      actorEmail: data.parentEmail,
      actorRole: "APPLICANT",
      details: { applicationNo, grade: grade.name },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Please save your reference code.",
      applicationNo: application.applicationNo,
      gradeName: grade.name,
      applicantName: `${application.applicantFirstName} ${application.applicantLastName}`,
    });
  } catch (error) {
    console.error("Admissions submission error:", error);
    return NextResponse.json(
      { error: "Failed to process application. Please check your inputs and try again." },
      { status: 500 }
    );
  }
}
