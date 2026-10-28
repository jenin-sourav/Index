import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().email("Invalid institutional email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        teacher: true,
        student: true,
        guardian: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is inactive or suspended. Contact administration." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create signed session token
    const token = signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    setSessionCookie(token);

    // Record audit log
    await recordAuditLog({
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: { role: user.role },
    });

    // Determine redirect path
    let redirectPath = "/admin";
    if (user.role === "TEACHER") redirectPath = "/teacher";
    else if (user.role === "STUDENT") redirectPath = "/student";
    else if (user.role === "PARENT") redirectPath = "/parent";

    return NextResponse.json({
      success: true,
      role: user.role,
      redirectPath,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name:
          user.teacher?.name ||
          (user.student ? `${user.student.firstName} ${user.student.lastName}` : null) ||
          user.guardian?.name ||
          "Staff Member",
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
