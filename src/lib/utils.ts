import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Bangladeshi Taka (BDT, ৳)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace("BDT", "৳");
}

/**
 * Format dates in DD MMM YYYY (Asia/Dhaka timezone)
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "N/A";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format time in Asia/Dhaka
 */
export function formatTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Educational Grading Scale (Standard Bangladesh & International Curriculum)
 * 80 - 100: A+ (GPA 5.00)
 * 70 - 79:  A  (GPA 4.00)
 * 60 - 69:  A- (GPA 3.50)
 * 50 - 59:  B  (GPA 3.00)
 * 40 - 49:  C  (GPA 2.00)
 * 33 - 39:  D  (GPA 1.00)
 * 0  - 32:  F  (GPA 0.00)
 */
export interface GradeCalculation {
  percentage: number;
  gradeLetter: string;
  gpa: number;
  remarks: string;
}

export function calculateGrade(marksObtained: number, maxMarks: number = 100): GradeCalculation {
  if (maxMarks <= 0) return { percentage: 0, gradeLetter: "F", gpa: 0, remarks: "Invalid Max Marks" };
  const percentage = (marksObtained / maxMarks) * 100;
  const roundedPct = Math.round(percentage * 10) / 10;

  if (roundedPct >= 80) {
    return { percentage: roundedPct, gradeLetter: "A+", gpa: 5.0, remarks: "Outstanding" };
  } else if (roundedPct >= 70) {
    return { percentage: roundedPct, gradeLetter: "A", gpa: 4.0, remarks: "Excellent" };
  } else if (roundedPct >= 60) {
    return { percentage: roundedPct, gradeLetter: "A-", gpa: 3.5, remarks: "Very Good" };
  } else if (roundedPct >= 50) {
    return { percentage: roundedPct, gradeLetter: "B", gpa: 3.0, remarks: "Good" };
  } else if (roundedPct >= 40) {
    return { percentage: roundedPct, gradeLetter: "C", gpa: 2.0, remarks: "Satisfactory" };
  } else if (roundedPct >= 33) {
    return { percentage: roundedPct, gradeLetter: "D", gpa: 1.0, remarks: "Passing" };
  } else {
    return { percentage: roundedPct, gradeLetter: "F", gpa: 0.0, remarks: "Needs Improvement" };
  }
}

/**
 * Generate friendly unique IDs
 */
export function generateApplicationNo(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AIS-APP-${year}-${randomSuffix}`;
}

export function generateInvoiceNo(count: number): string {
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, "0");
  return `INV-${year}-${seq}`;
}

export function generatePaymentNo(count: number): string {
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, "0");
  return `PAY-${year}-${seq}`;
}
