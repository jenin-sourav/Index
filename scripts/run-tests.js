const assert = require('assert');
const crypto = require('crypto');

// 1. Grading Calculation Logic
function calculateGrade(marksObtained, maxMarks = 100) {
  if (maxMarks <= 0) return { percentage: 0, gradeLetter: 'F', gpa: 0, remarks: 'Invalid Max Marks' };
  const percentage = (marksObtained / maxMarks) * 100;
  const roundedPct = Math.round(percentage * 10) / 10;

  if (roundedPct >= 80) {
    return { percentage: roundedPct, gradeLetter: 'A+', gpa: 5.0, remarks: 'Outstanding' };
  } else if (roundedPct >= 70) {
    return { percentage: roundedPct, gradeLetter: 'A', gpa: 4.0, remarks: 'Excellent' };
  } else if (roundedPct >= 60) {
    return { percentage: roundedPct, gradeLetter: 'A-', gpa: 3.5, remarks: 'Very Good' };
  } else if (roundedPct >= 50) {
    return { percentage: roundedPct, gradeLetter: 'B', gpa: 3.0, remarks: 'Good' };
  } else if (roundedPct >= 40) {
    return { percentage: roundedPct, gradeLetter: 'C', gpa: 2.0, remarks: 'Satisfactory' };
  } else if (roundedPct >= 33) {
    return { percentage: roundedPct, gradeLetter: 'D', gpa: 1.0, remarks: 'Passing' };
  } else {
    return { percentage: roundedPct, gradeLetter: 'F', gpa: 0.0, remarks: 'Needs Improvement' };
  }
}

// 2. Session Token Logic
const SESSION_SECRET = 'test_secret_key_ais_dhaka_2026';
function signSession(payload, secret = SESSION_SECRET, durationMs = 3600000) {
  const exp = Date.now() + durationMs;
  const fullPayload = { ...payload, exp };
  const payloadStr = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

function verifySession(token, secret = SESSION_SECRET) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// 3. RBAC Helpers
const ADMIN_ROLES = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'ADMISSION_OFFICER'];
function canAccessAdmin(role) {
  return ADMIN_ROLES.includes(role);
}

function canManageFees(role) {
  return ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(role);
}

function canPublishResults(role) {
  return ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(role);
}

// Test Runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✖ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('Running Apex International School Automated Test Suite...\n');

// Group A: Academic Grading Scale
console.log('--- Suite 1: Academic Grading Scale & GPA Computation ---');
test('Grades 80-100 must yield A+ and 5.00 GPA', () => {
  const res = calculateGrade(94.5, 100);
  assert.strictEqual(res.gradeLetter, 'A+');
  assert.strictEqual(res.gpa, 5.0);
  assert.strictEqual(res.remarks, 'Outstanding');
});

test('Boundary 80.0 must yield A+', () => {
  const res = calculateGrade(80.0, 100);
  assert.strictEqual(res.gradeLetter, 'A+');
  assert.strictEqual(res.gpa, 5.0);
});

test('Marks 70-79.9 must yield A and 4.00 GPA', () => {
  const res = calculateGrade(78.0, 100);
  assert.strictEqual(res.gradeLetter, 'A');
  assert.strictEqual(res.gpa, 4.0);
});

test('Marks 60-69.9 must yield A- and 3.50 GPA', () => {
  const res = calculateGrade(65.0, 100);
  assert.strictEqual(res.gradeLetter, 'A-');
  assert.strictEqual(res.gpa, 3.5);
});

test('Marks 50-59.9 must yield B and 3.00 GPA', () => {
  const res = calculateGrade(55.0, 100);
  assert.strictEqual(res.gradeLetter, 'B');
  assert.strictEqual(res.gpa, 3.0);
});

test('Marks 40-49.9 must yield C and 2.00 GPA', () => {
  const res = calculateGrade(45.0, 100);
  assert.strictEqual(res.gradeLetter, 'C');
  assert.strictEqual(res.gpa, 2.0);
});

test('Marks 33-39.9 must yield D (Passing) and 1.00 GPA', () => {
  const res = calculateGrade(35.0, 100);
  assert.strictEqual(res.gradeLetter, 'D');
  assert.strictEqual(res.gpa, 1.0);
});

test('Marks below 33 must yield F and 0.00 GPA', () => {
  const res = calculateGrade(28.0, 100);
  assert.strictEqual(res.gradeLetter, 'F');
  assert.strictEqual(res.gpa, 0.0);
});

// Group B: Security & Cryptographic Sessions
console.log('\n--- Suite 2: Cryptographic Session Security & Tamper Detection ---');
test('Valid session token verifies successfully with decoded payload', () => {
  const token = signSession({ userId: 'u-123', email: 'test@apex.edu', role: 'SUPER_ADMIN' });
  const verified = verifySession(token);
  assert.ok(verified);
  assert.strictEqual(verified.userId, 'u-123');
  assert.strictEqual(verified.role, 'SUPER_ADMIN');
});

test('Tampered token payload must be rejected by timing-safe signature comparison', () => {
  const token = signSession({ userId: 'u-123', email: 'test@apex.edu', role: 'STUDENT' });
  const [payloadStr, sig] = token.split('.');
  // Tamper role from STUDENT to SUPER_ADMIN
  const decoded = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
  decoded.role = 'SUPER_ADMIN';
  const tamperedPayloadStr = Buffer.from(JSON.stringify(decoded)).toString('base64url');
  const tamperedToken = `${tamperedPayloadStr}.${sig}`;

  const verified = verifySession(tamperedToken);
  assert.strictEqual(verified, null, 'Tampered token must evaluate to null');
});

test('Expired token must be rejected', () => {
  // Signed with negative duration (already expired)
  const token = signSession({ userId: 'u-123', email: 'test@apex.edu', role: 'TEACHER' }, SESSION_SECRET, -1000);
  const verified = verifySession(token);
  assert.strictEqual(verified, null, 'Expired session token must evaluate to null');
});

test('Token signed with wrong secret must be rejected', () => {
  const token = signSession({ userId: 'u-123', role: 'SUPER_ADMIN' }, 'wrong_secret_123');
  const verified = verifySession(token, SESSION_SECRET);
  assert.strictEqual(verified, null, 'Mismatched secret key token must evaluate to null');
});

// Group C: Role-Based Access Control (RBAC)
console.log('\n--- Suite 3: Role-Based Authorization & Boundaries ---');
test('Admin roles can access administrative dashboard', () => {
  assert.strictEqual(canAccessAdmin('SUPER_ADMIN'), true);
  assert.strictEqual(canAccessAdmin('SCHOOL_ADMIN'), true);
  assert.strictEqual(canAccessAdmin('PRINCIPAL'), true);
  assert.strictEqual(canAccessAdmin('ACCOUNTANT'), true);
  assert.strictEqual(canAccessAdmin('ADMISSION_OFFICER'), true);
});

test('Student and Parent roles CANNOT access admin dashboard', () => {
  assert.strictEqual(canAccessAdmin('STUDENT'), false);
  assert.strictEqual(canAccessAdmin('PARENT'), false);
});

test('Only Accountant and Admins can record financial adjustments', () => {
  assert.strictEqual(canManageFees('ACCOUNTANT'), true);
  assert.strictEqual(canManageFees('SUPER_ADMIN'), true);
  assert.strictEqual(canManageFees('TEACHER'), false);
  assert.strictEqual(canManageFees('STUDENT'), false);
});

test('Only Principal and Admins can publish official examination results', () => {
  assert.strictEqual(canPublishResults('PRINCIPAL'), true);
  assert.strictEqual(canPublishResults('SUPER_ADMIN'), true);
  assert.strictEqual(canPublishResults('TEACHER'), false);
  assert.strictEqual(canPublishResults('PARENT'), false);
});

// Summary
console.log('\n=======================================');
console.log(`Total Tests Run: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('=======================================\n');

if (failed > 0) {
  process.exit(1);
}
