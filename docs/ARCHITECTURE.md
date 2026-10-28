# System Architecture & Technical Specification
## Apex International School (AIS Dhaka)

---

## 1. High-Level Architectural Model

Apex International School Management System & Public Portal is built on a modern, decoupled monolithic Next.js App Router architecture with strict server-side authorization, type safety, and relational database persistence.

```
+-------------------------------------------------------------------------+
|                              Client Layer                               |
|   - Public Website (Visitors, Applicants)                               |
|   - Administrative Dashboard (/admin)                                   |
|   - Educator / Faculty Portal (/teacher)                                |
|   - Student Academic Portal (/student)                                  |
|   - Parent & Guardian Portal (/parent)                                  |
+------------------------------------+------------------------------------+
                                     | (HTTPS / Encrypted Session Cookies)
+------------------------------------v------------------------------------+
|                         Server-Side Application Layer                   |
|   - Next.js Server Components & Server-Rendered Layouts                 |
|   - Route Handlers (/api/auth, /api/admissions, /api/admin/*)           |
|   - Zod Input Validation & Sanitization                                 |
|   - Cryptographic HMAC-SHA256 Timing-Safe Session Verification          |
|   - Role-Based Access Control (RBAC) & Record-Level Guards              |
|   - Audit Logging Engine                                                |
+------------------------------------+------------------------------------+
                                     | (Prisma Client ORM)
+------------------------------------v------------------------------------+
|                         Relational Database Layer                       |
|   - SQLite (Local turnkey self-contained execution)                     |
|   - PostgreSQL (Production ready via DATABASE_URL swap)                 |
|   - 26 Normalized Tables with Foreign Key Constraints & Cascades        |
+-------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
c:\Users\UESR\Downloads\School
├── prisma/
│   ├── schema.prisma           # Complete database model (26 entities)
│   ├── seed.js                 # Rich development seed script
│   └── school.db               # SQLite relational database
├── src/
│   ├── app/
│   │   ├── (public pages)      # Home, About, Academics, Admissions, Faculty, News, Events, Gallery, Contact
│   │   ├── login/              # Unified authentication portal
│   │   ├── admin/              # Secure administrative control panel
│   │   │   ├── students/       # Student directory & enrollment
│   │   │   ├── admissions/     # Pipeline management & review
│   │   │   ├── attendance/     # Daily roster attendance taker
│   │   │   ├── exams/          # Gradebook & marks entry
│   │   │   ├── fees/           # Invoices & payment collection
│   │   │   ├── timetable/      # Class schedules
│   │   │   ├── notices/        # Broadcast bulletins
│   │   │   ├── audit/          # Tamper-evident audit trail
│   │   │   └── settings/       # Institutional settings
│   │   ├── teacher/            # Teacher & staff portal
│   │   ├── student/            # Student academic dashboard
│   │   ├── parent/             # Parent & guardian dashboard
│   │   └── api/                # Protected JSON API route handlers
│   ├── components/
│   │   └── layout/             # TopBar, Navbar, Footer, AdminSidebar, LanguageContext
│   └── lib/
│       ├── db.ts               # PrismaClient singleton
│       ├── auth.ts             # HMAC-SHA256 session token management & cookies
│       ├── rbac.ts             # Authorization roles & record guards
│       ├── audit.ts            # Tamper-evident audit logging
│       ├── utils.ts            # Formatting (BDT currency, Dhaka dates, Grade logic)
│       └── translations.ts     # Bilingual English & Bangla dictionary
├── scripts/
│   └── run-tests.js            # Automated unit and security test suite
├── docs/                       # Technical and operational manuals
└── package.json
```

---

## 3. Core Architectural Principles

1. **Server-Enforced Authorization:** Every sensitive action (grading, invoicing, attendance, enrollments) enforces identity and role clearance on the server. Frontend hidden buttons are never considered an authorization barrier.
2. **Deterministic Grading Engine:** All grade letters (A+, A, B, etc.) and GPA figures (5.00, 4.00, etc.) are computed server-side using the official grading threshold functions in `src/lib/utils.ts`.
3. **Auditability by Design:** Every mutation (INSERT, UPDATE, DELETE, PAYMENT, PUBLISH) emits an audit log record into `AuditLog` capturing actor identity, action type, target entity, timestamp, and metadata.
4. **Localization & Culture:** Native support for the Asia/Dhaka timezone, Bangladeshi Taka (`BDT`, `৳`), Bangladesh phone formats, and instant bilingual switching between English and Bangla.
