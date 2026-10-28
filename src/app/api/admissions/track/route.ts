import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicationNo = searchParams.get("ref")?.trim();

  if (!applicationNo) {
    return NextResponse.json(
      { error: "Application reference number is required." },
      { status: 400 }
    );
  }

  try {
    const application = await db.admissionApplication.findUnique({
      where: { applicationNo },
      include: {
        gradeLevel: {
          select: { name: true, code: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "No admission application found with this reference code." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      applicationNo: application.applicationNo,
      applicantName: `${application.applicantFirstName} ${application.applicantLastName}`,
      applyingForGrade: application.gradeLevel.name,
      status: application.status,
      submissionDate: application.submissionDate,
      assessmentDate: application.assessmentDate,
      interviewDate: application.interviewDate,
      adminNotes:
        application.status === "ACCEPTED"
          ? "Congratulations! Formal admission offer has been approved. Please verify documents at the Admissions Office."
          : application.status === "ASSESSMENT_SCHEDULED"
          ? "Written aptitude assessment scheduled. Please arrive 15 minutes before the time."
          : application.status === "UNDER_REVIEW"
          ? "Your documents and profile are currently under comprehensive evaluation by the admissions committee."
          : "Application received and queued for committee verification.",
    });
  } catch (error) {
    console.error("Tracking lookup error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve application status." },
      { status: 500 }
    );
  }
}
