# School Administration & Portal Operations Guide
## Apex International School (AIS Dhaka)

---

## 1. Quick Authentication & Portal Entry

Navigate to `/login` to access the unified institutional portal.

### Seeded Demonstration Accounts
| Role | Email Address | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@apex-intl.edu.bd` | `Admin@AIS2026` | Full administrative control, settings, audit trail |
| **Principal** | `principal@apex-intl.edu.bd` | `Password@AIS2026` | Academic oversight, approval & publishing of grades |
| **Teacher** | `rahim@apex-intl.edu.bd` | `Password@AIS2026` | Class attendance, marks entry, timetable |
| **Student** | `student@apex-intl.edu.bd` | `Password@AIS2026` | Personal report card, timetable, attendance summary |
| **Parent** | `parent@apex-intl.edu.bd` | `Password@AIS2026` | Linked ward's report card, attendance, fee payment |
| **Accountant** | `accounts@apex-intl.edu.bd` | `Password@AIS2026` | Invoices, fee collection, bKash receipt generation |

---

## 2. Administrative Modules (`/admin`)

### Student Directory (`/admin/students`)
- **Search & Filter:** Find scholars by first name, last name, admission number, roll number, or status.
- **Enrolling a Student:** Click `+ Enroll New Student`. Supply First Name, Last Name, email, Admission ID, Roll, DOB, Gender, and Blood Group. An active student portal account is provisioned automatically with `Student@AIS2026`.

### Admissions Pipeline (`/admin/admissions`)
- **Review Workflow:** Applications submitted on `/admissions` automatically appear with unique reference codes (`AIS-APP-2026-XXXX`).
- **Scheduling Assessments:** Click `Review / Update` on any application. Change status to `ASSESSMENT_SCHEDULED` and pick a date. The public tracker updates immediately.
- **Acceptance:** Marking an application `ACCEPTED` confirms enrollment and dispatches formal admission offer instructions.

### Daily Attendance (`/admin/attendance`)
- Select target Class Section (e.g. Grade 9 Padma) and Date.
- Use quick toggle buttons (`Present`, `Absent`, `Late`, `Excused`) or `Mark All Present`.
- Click `Save Attendance Roster`. Changes are committed atomically to database and logged in audit history.

### Examinations & Marks Entry (`/admin/exams`)
- Select Exam and Subject (e.g. Term 1 Midterm Assessment - Mathematics).
- Enter raw student scores (0-100).
- The system computes letter grades (A+, A, etc.) and Grade Points (5.00, 4.00, etc.) in real-time.
- Click `Approve & Publish Results` to release report cards to student and parent portals.

### Fees & Accounting (`/admin/fees`)
- Review total billed, total collected, and outstanding receivables in BDT (৳).
- Click `Record Payment` on any invoice.
- Enter payment amount, select channel (`bKash`, `Nagad`, `Bank Transfer`, `Cash`), and enter the gateway transaction reference.
- An official payment receipt number is issued (`PAY-2026-XXXX`).

### Notices & School Bulletins (`/admin/notices`)
- Broadcast emergency announcements or circulars.
- Choose priority (`Normal`, `Important`, `Urgent`) and target audience (`All`, `Teachers`, `Students`, `Parents`).
- Real-time display on website and respective portal dashboards.

### Audit Log Viewer (`/admin/audit`)
- Inspect tamper-evident security logs detailing every administrative update, payment, grade change, or user creation.
