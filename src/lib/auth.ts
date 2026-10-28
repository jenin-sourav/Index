import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "ais_session_token";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_ais_secret_key_2026_default";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Sign payload using HMAC-SHA256
 */
export function signSession(payload: Omit<SessionPayload, "exp">): string {
  const exp = Date.now() + SESSION_DURATION_MS;
  const fullPayload: SessionPayload = { ...payload, exp };
  const payloadStr = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${signature}`;
}

/**
 * Verify signed session token securely with timing-safe comparison
 */
export function verifySession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadStr)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Retrieve current authenticated user from request cookie (Server Component or Server Action)
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const session = verifySession(sessionToken);
  if (!session) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        preferredLanguage: true,
        teacher: {
          select: { id: true, name: true, employeeId: true, designation: true },
        },
        student: {
          select: {
            id: true,
            admissionNo: true,
            rollNo: true,
            firstName: true,
            lastName: true,
            gradeLevelId: true,
            sectionId: true,
            gradeLevel: { select: { name: true, code: true } },
            section: { select: { name: true } },
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
            phone: true,
            students: {
              select: {
                student: {
                  select: {
                    id: true,
                    admissionNo: true,
                    firstName: true,
                    lastName: true,
                    gradeLevel: { select: { name: true } },
                    section: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== "ACTIVE") return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in response headers
 */
export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clear session cookie upon logout
 */
export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
