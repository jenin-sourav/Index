import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { recordAuditLog } from "@/lib/audit";

const noticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleBn: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  contentBn: z.string().optional(),
  priority: z.enum(["NORMAL", "IMPORTANT", "URGENT"]),
  targetRole: z.enum(["ALL", "TEACHER", "STUDENT", "PARENT"]),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canAccessAdmin(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const notices = await db.notice.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ success: true, notices });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canAccessAdmin(user.role)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = noticeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    const notice = await db.notice.create({
      data: {
        title: data.title,
        titleBn: data.titleBn || null,
        content: data.content,
        contentBn: data.contentBn || null,
        priority: data.priority,
        targetRole: data.targetRole,
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    await recordAuditLog({
      action: "CREATE",
      entity: "Notice",
      entityId: notice.id,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      details: { title: notice.title, priority: notice.priority },
    });

    return NextResponse.json({
      success: true,
      message: "Notice published successfully.",
      notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);
    return NextResponse.json(
      { error: "Failed to publish notice." },
      { status: 500 }
    );
  }
}
