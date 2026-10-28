export type UserRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "ACCOUNTANT"
  | "ADMISSION_OFFICER";

// Allowed roles for administrative dashboard
export const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "PRINCIPAL",
  "ACCOUNTANT",
  "ADMISSION_OFFICER",
];

export function canAccessAdmin(role: string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}

export function canManageFees(role: string): boolean {
  return ["SUPER_ADMIN", "SCHOOL_ADMIN", "ACCOUNTANT"].includes(role);
}

export function canManageAdmissions(role: string): boolean {
  return ["SUPER_ADMIN", "SCHOOL_ADMIN", "PRINCIPAL", "ADMISSION_OFFICER"].includes(role);
}

export function canPublishResults(role: string): boolean {
  return ["SUPER_ADMIN", "SCHOOL_ADMIN", "PRINCIPAL"].includes(role);
}

export function canEnterMarks(role: string): boolean {
  return ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(role);
}

export function canRecordAttendance(role: string): boolean {
  return ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(role);
}

/**
 * Record-level security: Verify if parent is linked to student
 */
export async function verifyParentStudentRelation(
  parentUserId: string,
  studentId: string,
  prismaClient: any
): Promise<boolean> {
  const link = await prismaClient.studentGuardian.findFirst({
    where: {
      studentId: studentId,
      guardian: {
        userId: parentUserId,
      },
    },
  });
  return Boolean(link);
}
