import { db } from "./db";

export interface AuditLogParams {
  action: string; // CREATE, UPDATE, DELETE, LOGIN, EXPORT, PUBLISH, PAYMENT
  entity: string; // Student, Attendance, ExamResult, Invoice, Payment, User, Notice
  entityId?: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  details?: Record<string, any> | string;
}

export async function recordAuditLog(params: AuditLogParams) {
  try {
    const detailsStr =
      typeof params.details === "object"
        ? JSON.stringify(params.details)
        : params.details;

    await db.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        actorId: params.actorId,
        actorEmail: params.actorEmail,
        actorRole: params.actorRole,
        ipAddress: params.ipAddress || "127.0.0.1",
        details: detailsStr,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // Non-blocking for primary transaction, but logged
  }
}
