# Database Architecture & Entity Specifications
## Apex International School (AIS Dhaka)

---

## 1. Relational Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o| Teacher : "provisions"
    User ||--o| Student : "provisions"
    User ||--o| Guardian : "provisions"
    User ||--o{ AuditLog : "records"

    AcademicYear ||--o{ Student : "enrolled_in"
    AcademicYear ||--o{ Exam : "schedules"
    AcademicYear ||--o{ FeeStructure : "defines"
    AcademicYear ||--o{ Invoice : "bills"

    GradeLevel ||--o{ Section : "contains"
    GradeLevel ||--o{ Subject : "teaches"
    GradeLevel ||--o{ Student : "contains"
    GradeLevel ||--o{ AdmissionApplication : "applies_for"

    Section ||--o{ Student : "contains"
    Section ||--o{ Attendance : "records"
    Section ||--o{ TimetableEntry : "schedules"

    Teacher ||--o{ ClassSubjectTeacher : "assigned_to"
    Subject ||--o{ ClassSubjectTeacher : "assigned_to"

    Student ||--o{ StudentGuardian : "linked_to"
    Guardian ||--o{ StudentGuardian : "linked_to"

    Student ||--o{ Attendance : "marks"
    Student ||--o{ ExamResult : "receives"
    Student ||--o{ Invoice : "billed"

    Exam ||--o{ ExamSubject : "schedules"
    Subject ||--o{ ExamSubject : "evaluated_in"
    ExamSubject ||--o{ ExamResult : "records"

    FeeCategory ||--o{ FeeStructure : "configures"
    Invoice ||--o{ Payment : "receipted_by"
```

---

## 2. Table Specifications (26 Core Entities)

### Core Authentication & Auditing
- **`User`**: System authentication identity. Columns: `id`, `email` (unique), `passwordHash`, `role`, `status` (`ACTIVE`, `SUSPENDED`), `preferredLanguage`, `lastLoginAt`, timestamps.
- **`AuditLog`**: Immutable event record. Columns: `id`, `action` (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `PAYMENT`, `PUBLISH`), `entity`, `entityId`, `actorId`, `actorEmail`, `actorRole`, `ipAddress`, `details` (JSON string), `createdAt`.

### Academic Structure
- **`AcademicYear`**: `id`, `name` (e.g. "2026-2027"), `startDate`, `endDate`, `isCurrent`.
- **`GradeLevel`**: `id`, `name` ("Grade 9"), `code` ("G9"), `sequenceOrder`.
- **`Section`**: `id`, `name` ("Padma"), `gradeLevelId`, `roomNumber`, `capacity`.
- **`Subject`**: `id`, `name` ("Mathematics"), `code` ("MATH-101"), `gradeLevelId`, `creditHours`.
- **`ClassSubjectTeacher`**: Maps teacher assignments to subjects with `@@unique([teacherId, subjectId])`.

### Faculty, Students & Guardians
- **`Teacher`**: `id`, `userId`, `employeeId` (unique), `name`, `nameBn`, `phone`, `email`, `designation`, `department`, `qualification`, `joiningDate`, `bio`, `isPublic`.
- **`Student`**: `id`, `userId`, `admissionNo` (unique), `rollNo`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `gradeLevelId`, `sectionId`, `academicYearId`, `enrollmentStatus`, `bloodGroup`, `address`, `emergencyContact`.
- **`Guardian`**: `id`, `userId`, `name`, `relationship`, `phone`, `email`, `occupation`, `nid`, `address`.
- **`StudentGuardian`**: Join table linking student and guardian with `isPrimaryContact` and `canPickup`.

### Attendance & Examinations
- **`Attendance`**: `id`, `studentId`, `sectionId`, `date`, `status` (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`), `remarks`, `recordedById`. Indexed by `@@unique([studentId, date])`.
- **`Exam`**: `id`, `name`, `academicYearId`, `term`, `startDate`, `endDate`, `status` (`UPCOMING`, `ONGOING`, `COMPLETED`, `PUBLISHED`).
- **`ExamSubject`**: `id`, `examId`, `subjectId`, `gradeLevelId`, `maxMarks`, `passMarks`, `examDate`.
- **`ExamResult`**: `id`, `examSubjectId`, `studentId`, `marksObtained`, `gradeLetter`, `gpa`, `remarks`, `status` (`DRAFT`, `SUBMITTED`, `PUBLISHED`). Indexed by `@@unique([examSubjectId, studentId])`.

### Financial Billing & Accounting
- **`FeeCategory`**: `id`, `name`, `code`, `description`, `isRecurring`.
- **`FeeStructure`**: `id`, `feeCategoryId`, `gradeLevelId`, `academicYearId`, `amount` (in BDT ৳), `dueDay`.
- **`Invoice`**: `id`, `invoiceNo` (unique), `studentId`, `academicYearId`, `title`, `subtotal`, `discount`, `totalAmount`, `paidAmount`, `balance`, `dueDate`, `status` (`UNPAID`, `PARTIAL`, `PAID`, `OVERDUE`).
- **`Payment`**: `id`, `paymentNo` (unique), `invoiceId`, `amount`, `paymentMethod` (`BKASH`, `NAGAD`, `BANK_TRANSFER`, `CASH`), `referenceNo`, `transactionDate`, `receivedById`, `notes`.

### Public Portal & CMS
- **`AdmissionApplication`**: `id`, `applicationNo` (unique), `applicantFirstName`, `applicantLastName`, `dateOfBirth`, `gender`, `applyingForGradeId`, `parentName`, `parentPhone`, `parentEmail`, `previousSchool`, `address`, `status`, `assessmentDate`, `adminNotes`.
- **`Notice`**: `id`, `title`, `titleBn`, `content`, `contentBn`, `priority` (`NORMAL`, `IMPORTANT`, `URGENT`), `targetRole`, `isPublished`.
- **`NewsArticle`**: `id`, `title`, `titleBn`, `slug`, `excerpt`, `content`, `category`, `coverImage`, `isPublished`.
- **`Event`**: `id`, `title`, `titleBn`, `description`, `eventDate`, `startTime`, `endTime`, `location`, `category`.
- **`GalleryItem`**: `id`, `title`, `category`, `imageUrl`, `caption`, `isFeatured`.
- **`SystemSetting`**: `id`, `key` (unique), `value`, `category`, `description`.

---

## 3. Switching from SQLite to PostgreSQL

To deploy on PostgreSQL:
1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@hostname:5432/apex_school?schema=public"
   ```
3. Run migrations and seed:
   ```bash
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```
