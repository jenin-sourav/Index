# Apex International School (AIS Dhaka)
## Premium International School Website, Secure School Management System & Multi-Role Portals

[![Tests Passing](https://img.shields.io/badge/tests-16%2F16%20passing-brightgreen)]()
[![Production Build](https://img.shields.io/badge/next.js%20build-passing-brightgreen)]()
[![Database](https://img.shields.io/badge/database-Prisma%20%7C%20SQLite%20%26%20Postgres-blue)]()
[![Security](https://img.shields.io/badge/security-HMAC--SHA256%20%7C%20Bcrypt-gold)]()
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjenin-sourav%2FIndex&env=SESSION_SECRET,NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_SCHOOL_NAME,NEXT_PUBLIC_TIMEZONE,NEXT_PUBLIC_CURRENCY)

A complete, production-oriented International School Website and unified School Management System (SMS) built with Next.js 14, TypeScript, Tailwind CSS, and Prisma ORM, tailored for the Bangladesh market with international academic and engineering standards.

---

## 🌟 Institutional Overview

- **Institution Name:** Apex International School, Dhaka (AIS Dhaka) *(Configurable)*
- **Primary Market:** Bangladesh (Dhaka) with international Cambridge benchmark standards
- **Default Language:** English, with instant bilingual toggle for Bangla (বাংলা)
- **Currency:** Bangladeshi Taka (BDT, ৳)
- **Timezone:** Asia/Dhaka (UTC+6) &bull; **Date Format:** `DD MMM YYYY`
- **Color Identity:** Institutional Navy (`#142D4E`), Deep Navy (`#0B1F36`), Academic Blue (`#2457A7`), Elegant Teal (`#168C88`), Warm Gold (`#D6AD60`)

---

## 🚀 Key Functional Modules

### 1. Public International Website
- **Dynamic Homepage:** Top announcement bar, institutional crest, hero mission with live statistics, Principal's welcome, academic program highlights, school notices, calendar events, application tracker, and comprehensive footer.
- **About the School:** Vision, mission, pedagogical philosophy, safeguarding & child protection, campus infrastructure.
- **Academics:** Curriculum structures (Primary, Middle, Senior Secondary), credit hours, dual-pathway details, official GPA grading conversion table, and academic calendar.
- **Admissions Portal:**
  - Multi-step online application form with automated reference code generation (`AIS-APP-2026-XXXX`).
  - Real-time application tracking tool (checks review stage, assessment schedule, and committee notes).
- **Faculty Directory:** Filterable educator directory with qualifications, departments, and biographies.
- **News, Events & Campus Gallery:** Academic circulars, sporting galas, smart robotics labs, and facilities.
- **Contact Desk:** Interactive inquiry form with server-side validation and audit logging.

### 2. Secure Administration Console (`/admin`)
- **Dashboard Telemetry:** Enrolled students, active teachers, pending admissions queue, fee collections vs receivables in BDT, and real-time audit logs.
- **Student Management:** Directory with search, class filtering, and interactive enrollment modal.
- **Admissions Pipeline:** Application review workflow with status transitions (`SUBMITTED` &rarr; `UNDER_REVIEW` &rarr; `ASSESSMENT_SCHEDULED` &rarr; `ACCEPTED` / `REJECTED`).
- **Daily Attendance Taker:** Section-based roll call with status shortcuts (`Present`, `Absent`, `Late`, `Excused`) and batch persistence.
- **Examinations & Gradebook:** Marks entry with automatic server-side letter grade and GPA computation; approval and publication to student/parent portals.
- **Fees & Financial Management:** Invoicing, partial payments, outstanding balance tracking, and payment recording with receipts.
- **Timetable Schedules:** Class period schedules (Sunday to Thursday) with room conflict guards.
- **Notices & Bulletins:** Role-targeted circulars with priority tags (`Urgent`, `Important`, `Normal`).
- **Tamper-Evident Audit Trail:** Detailed log of all user activities, mutations, and origin IP addresses.
- **Institutional Settings:** Master identity, localization, currency, and security parameters.

### 3. Role-Specific User Portals
- **Student Portal (`/student`):** Personal academic profile, published report cards, timetable, and attendance rate.
- **Parent Portal (`/parent`):** Linked children selector, official term grades, attendance records, and tuition payments.
- **Teacher Portal (`/teacher`):** Assigned class rosters, instructional schedules, marks entry, and roll call.

---

## 🔐 Security Architecture

- **Cryptographic Sessions:** Signed HMAC-SHA256 session tokens with `crypto.timingSafeEqual` signature verification.
- **Secure Cookies:** `HttpOnly`, `SameSite=Lax`, and `Secure` (in production) flags.
- **Password Security:** Salted `bcryptjs` hashing with 10 work factor rounds.
- **Role-Based Access Control (RBAC):** Server-side clearance guards on every protected route.
- **Input Validation:** Universal Zod schema validation on client and server.
- **Parameterized SQL:** Prisma ORM prevents SQL injection.

---

## 💻 Quick Start & Installation

### 1. Prerequisites
- Node.js v18.18+ (Node 20+ LTS recommended)
- npm v9+

### 2. Setup & Database Initialization
```bash
# Clone or navigate to the workspace
cd School

# Install dependencies
npm install

# Push schema to relational database (SQLite local / PostgreSQL ready)
npx prisma db push

# Seed rich institutional demonstration data
node prisma/seed.js
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build & Start Server
```bash
# Production Build
npm run build

# Start Production Server
npm start

# Or Development Mode
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Demonstration Credentials

| Role | Email Address | Password | Designated Portal |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@apex-intl.edu.bd` | `Admin@AIS2026` | `/admin` |
| **Principal** | `principal@apex-intl.edu.bd` | `Password@AIS2026` | `/admin` |
| **Teacher** | `rahim@apex-intl.edu.bd` | `Password@AIS2026` | `/teacher` |
| **Student** | `student@apex-intl.edu.bd` | `Password@AIS2026` | `/student` |
| **Parent** | `parent@apex-intl.edu.bd` | `Password@AIS2026` | `/parent` |
| **Accountant** | `accounts@apex-intl.edu.bd` | `Password@AIS2026` | `/admin/fees` |

---

## 📚 Technical Documentation Directory
- [`docs/ARCHITECTURE.md`](file:///c:/Users/UESR/Downloads/School/docs/ARCHITECTURE.md) - System architecture & technical model.
- [`docs/DATABASE.md`](file:///c:/Users/UESR/Downloads/School/docs/DATABASE.md) - ER diagram, 26 entity schemas & PostgreSQL migration guide.
- [`docs/SECURITY.md`](file:///c:/Users/UESR/Downloads/School/docs/SECURITY.md) - Cryptographic sessions, RBAC, and OWASP defenses.
- [`docs/DEPLOYMENT.md`](file:///c:/Users/UESR/Downloads/School/docs/DEPLOYMENT.md) - Production Nginx, PM2, and Docker guidelines.
- [`docs/BACKUP-RECOVERY.md`](file:///c:/Users/UESR/Downloads/School/docs/BACKUP-RECOVERY.md) - Encrypted backup script and disaster recovery procedures.
- [`docs/ADMIN-USER-GUIDE.md`](file:///c:/Users/UESR/Downloads/School/docs/ADMIN-USER-GUIDE.md) - Operational guide for school administrators.
- [`docs/TESTING.md`](file:///c:/Users/UESR/Downloads/School/docs/TESTING.md) - Automated test results & QA verification.
