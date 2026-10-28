import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordAuditLog } from "@/lib/audit";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Record audit log of incoming inquiry
    await recordAuditLog({
      action: "CONTACT_FORM_SUBMISSION",
      entity: "Inquiry",
      actorEmail: data.email,
      actorRole: "VISITOR",
      details: {
        name: data.fullName,
        subject: data.subject,
        phone: data.phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Apex International School. Our administration will respond within 24 business hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
