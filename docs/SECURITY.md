# Security Architecture & Threat Mitigation
## Apex International School (AIS Dhaka)

---

## 1. Authentication & Session Architecture

### Session Generation & Cryptographic Verification
- Sessions are issued as cryptographically signed tokens containing `{ userId, email, role, exp }`.
- Tokens are signed with **HMAC-SHA256** using the `SESSION_SECRET` environment variable.
- Signature verification is conducted using **`crypto.timingSafeEqual`** to prevent side-channel timing analysis attacks.
- Tokens are set in HTTP cookies with the following security attributes:
  - `httpOnly: true` (prevents malicious client-side JavaScript from accessing session tokens).
  - `sameSite: "lax"` (mitigates Cross-Site Request Forgery).
  - `secure: process.env.NODE_ENV === "production"` (enforces HTTPS transport in production).
  - `maxAge: 7 * 24 * 60 * 60` (7 days duration, automatically invalidated if expired).

### Password Hashing
- User passwords are never stored in plaintext.
- Hashing is enforced via `bcryptjs` with salt work factor of 10 rounds.
- Brute force protection is implemented by rejecting invalid authentication and logging failed attempts.

---

## 2. Role-Based Access Control (RBAC) & Boundary Enforcement

The system implements strict server-enforced role checking:
- **`SUPER_ADMIN`**: Full institutional control, user management, audit logs, and settings.
- **`SCHOOL_ADMIN`**: Student enrollment, class schedules, timetable, notices.
- **`PRINCIPAL`**: Academic director authorization, approval and publication of examination marks.
- **`TEACHER`**: Assigned class roster access, attendance recording, gradebook marks entry.
- **`ACCOUNTANT`**: Tuition invoicing, fee collection, bKash / bank transaction verification.
- **`ADMISSION_OFFICER`**: Online application pipeline reviews and assessment scheduling.
- **`STUDENT`**: View-only personal profile, timetable, published results, and fee balances.
- **`PARENT`**: Scoped access strictly to linked wards; access to any other child's records is rejected.

---

## 3. Defense Against OWASP Top 10 Vulnerabilities

1. **SQL Injection (SQLi):** Mitigated by Prisma ORM which universally parameterizes all queries and prevents SQL string concatenation.
2. **Broken Access Control & IDOR:** Protected by verifying guardian-student relationship (`verifyParentStudentRelation`) and user role on every mutating API route handler.
3. **Cross-Site Scripting (XSS):** React and Next.js perform automatic context-aware HTML entity encoding. Unescaped `dangerouslySetInnerHTML` is prohibited.
4. **Mass Assignment:** All API route handlers explicitly parse and filter request payloads through strict Zod schemas (`studentCreateSchema`, `saveMarksSchema`, `recordPaymentSchema`), ignoring unmodeled fields.
5. **Session Hijacking:** Sessions expire after 7 days, are rotated upon login, and are securely cleared on logout.
6. **Financial Tampering:** Fee payments cannot exceed the outstanding balance (`amount <= invoice.balance`). Payments are wrapped in database transactions to prevent double-spending or race conditions.

---

## 4. Tamper-Evident Audit Logging

Every write operation records an immutable record in `AuditLog`:
- **Actor:** User ID, email, role.
- **Action:** `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `PAYMENT`, `PUBLISH`.
- **Entity & Target:** Entity name, ID, and descriptive JSON metadata.
- **Timestamp & Network:** UTC timestamp and client origin IP.
- Ordinary administrators are prohibited from modifying or deleting audit history.
