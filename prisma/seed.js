const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Apex International School (AIS Dhaka) database...');

  // Clear existing records to ensure clean state
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.feeCategory.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetableEntry.deleteMany();
  await prisma.classSubjectTeacher.deleteMany();
  await prisma.studentGuardian.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.section.deleteMany();
  await prisma.gradeLevel.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // 1. Academic Years
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2026-2027',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2027-06-30'),
      isCurrent: true,
    },
  });

  // 2. Grade Levels
  const grades = [
    { name: 'Grade 6', code: 'G6', sequenceOrder: 6 },
    { name: 'Grade 7', code: 'G7', sequenceOrder: 7 },
    { name: 'Grade 8', code: 'G8', sequenceOrder: 8 },
    { name: 'Grade 9', code: 'G9', sequenceOrder: 9 },
    { name: 'Grade 10', code: 'G10', sequenceOrder: 10 },
    { name: 'Grade 11', code: 'G11', sequenceOrder: 11 },
    { name: 'Grade 12', code: 'G12', sequenceOrder: 12 },
  ];

  const createdGrades = {};
  for (const g of grades) {
    createdGrades[g.code] = await prisma.gradeLevel.create({ data: g });
  }

  const g9 = createdGrades['G9'];
  const g10 = createdGrades['G10'];

  // 3. Sections
  const sec9A = await prisma.section.create({
    data: { name: 'Padma', gradeLevelId: g9.id, roomNumber: '301', capacity: 35 },
  });
  const sec9B = await prisma.section.create({
    data: { name: 'Meghna', gradeLevelId: g9.id, roomNumber: '302', capacity: 35 },
  });
  const sec10A = await prisma.section.create({
    data: { name: 'Jamuna', gradeLevelId: g10.id, roomNumber: '303', capacity: 35 },
  });

  // 4. Subjects
  const subMath = await prisma.subject.create({
    data: { name: 'Mathematics', code: 'MATH-101', gradeLevelId: g9.id, creditHours: 4.0 },
  });
  const subEng = await prisma.subject.create({
    data: { name: 'English Literature & Language', code: 'ENG-101', gradeLevelId: g9.id, creditHours: 4.0 },
  });
  const subBan = await prisma.subject.create({
    data: { name: 'Bengali Language & Heritage', code: 'BAN-101', gradeLevelId: g9.id, creditHours: 3.0 },
  });
  const subPhy = await prisma.subject.create({
    data: { name: 'Physics & STEM', code: 'PHY-101', gradeLevelId: g9.id, creditHours: 3.5 },
  });
  const subChem = await prisma.subject.create({
    data: { name: 'Chemistry', code: 'CHEM-101', gradeLevelId: g9.id, creditHours: 3.5 },
  });
  const subIct = await prisma.subject.create({
    data: { name: 'Computer Science & AI', code: 'CS-101', gradeLevelId: g9.id, creditHours: 3.0 },
  });

  // 5. Users & Passwords (bcrypt hashed)
  const defaultPassword = await bcrypt.hash('Password@AIS2026', 10);
  const adminPassword = await bcrypt.hash('Admin@AIS2026', 10);

  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@apex-intl.edu.bd',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // Principal
  const principalUser = await prisma.user.create({
    data: {
      email: 'principal@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'PRINCIPAL',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // Teachers
  const teacherUser1 = await prisma.user.create({
    data: {
      email: 'rahim@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'TEACHER',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  const teacherUser2 = await prisma.user.create({
    data: {
      email: 'nasrin@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'TEACHER',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // Student
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // Parent
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'PARENT',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // Accountant
  const accountantUser = await prisma.user.create({
    data: {
      email: 'accounts@apex-intl.edu.bd',
      passwordHash: defaultPassword,
      role: 'ACCOUNTANT',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    },
  });

  // 6. Teacher Profiles
  const teacherRahim = await prisma.teacher.create({
    data: {
      userId: teacherUser1.id,
      employeeId: 'T-2026-001',
      name: 'Mohammad Rahim, M.Sc',
      nameBn: 'মোহাম্মদ রহিম, এম.এসসি',
      phone: '+880 1711-123456',
      email: 'rahim@apex-intl.edu.bd',
      designation: 'Senior Mathematics & Computing Educator',
      department: 'Science & Mathematics',
      qualification: 'M.Sc in Applied Mathematics, University of Dhaka; Cambridge Certified',
      joiningDate: new Date('2021-08-15'),
      bio: 'Over 12 years of experience preparing students for Olympiads and Cambridge examinations with exemplary success rates.',
      isPublic: true,
      avatarUrl: '/images/faculty-1.jpg',
    },
  });

  const teacherNasrin = await prisma.teacher.create({
    data: {
      userId: teacherUser2.id,
      employeeId: 'T-2026-002',
      name: 'Nasrin Sultana, M.A',
      nameBn: 'নাসরিন সুলতানা, এম.এ',
      phone: '+880 1819-234567',
      email: 'nasrin@apex-intl.edu.bd',
      designation: 'Head of English & Literature',
      department: 'Languages & Humanities',
      qualification: 'M.A in English Literature, University of Oxford; CELTA Certified',
      joiningDate: new Date('2020-01-10'),
      bio: 'Specialist in comparative linguistics, creative writing, and public speaking coaching with multiple international student laureates.',
      isPublic: true,
      avatarUrl: '/images/faculty-2.jpg',
    },
  });

  // Teacher Assignments
  await prisma.classSubjectTeacher.create({
    data: { teacherId: teacherRahim.id, subjectId: subMath.id },
  });
  await prisma.classSubjectTeacher.create({
    data: { teacherId: teacherNasrin.id, subjectId: subEng.id },
  });

  // 7. Student Profiles
  const studentAyaan = await prisma.student.create({
    data: {
      userId: studentUser.id,
      admissionNo: 'AIS-2026-0101',
      rollNo: '101',
      firstName: 'Ayaan',
      lastName: 'Chowdhury',
      dateOfBirth: new Date('2011-04-12'),
      gender: 'MALE',
      gradeLevelId: g9.id,
      sectionId: sec9A.id,
      academicYearId: academicYear.id,
      enrollmentStatus: 'ACTIVE',
      bloodGroup: 'B+',
      address: 'House 42, Road 11, Banani, Dhaka-1213',
      emergencyContact: '+880 1711-998877',
      admissionDate: new Date('2024-01-15'),
    },
  });

  // Additional demonstration students
  const demoStudentsData = [
    { first: 'Samira', last: 'Haque', roll: '102', gender: 'FEMALE', blood: 'A+' },
    { first: 'Rayan', last: 'Farhan', roll: '103', gender: 'MALE', blood: 'O+' },
    { first: 'Zunairah', last: 'Islam', roll: '104', gender: 'FEMALE', blood: 'AB+' },
    { first: 'Tahmid', last: 'Ahmed', roll: '105', gender: 'MALE', blood: 'B+' },
  ];

  const createdDemoStudents = [];
  for (const s of demoStudentsData) {
    const u = await prisma.user.create({
      data: {
        email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@apex-intl.edu.bd`,
        passwordHash: defaultPassword,
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });
    const st = await prisma.student.create({
      data: {
        userId: u.id,
        admissionNo: `AIS-2026-0${s.roll}`,
        rollNo: s.roll,
        firstName: s.first,
        lastName: s.last,
        dateOfBirth: new Date('2011-06-20'),
        gender: s.gender,
        gradeLevelId: g9.id,
        sectionId: sec9A.id,
        academicYearId: academicYear.id,
        bloodGroup: s.blood,
        address: 'Gulshan-2, Dhaka',
        emergencyContact: '+880 1711-000000',
      },
    });
    createdDemoStudents.push(st);
  }

  // 8. Guardian Profile & Student Association
  const guardianMahmud = await prisma.guardian.create({
    data: {
      userId: parentUser.id,
      name: 'Mahmud Chowdhury, FCA',
      relationship: 'FATHER',
      phone: '+880 1711-998877',
      email: 'parent@apex-intl.edu.bd',
      occupation: 'Managing Director, Northstar Logistics Ltd.',
      nid: '1980269251800042',
      address: 'House 42, Road 11, Banani, Dhaka-1213',
    },
  });

  await prisma.studentGuardian.create({
    data: {
      studentId: studentAyaan.id,
      guardianId: guardianMahmud.id,
      isPrimaryContact: true,
      canPickup: true,
    },
  });

  // 9. Attendance records for recent school days
  const attendanceDates = [
    new Date('2026-10-24'),
    new Date('2026-10-25'),
    new Date('2026-10-26'),
    new Date('2026-10-27'),
    new Date('2026-10-28'),
  ];

  const allSec9AStudents = [studentAyaan, ...createdDemoStudents];
  for (const date of attendanceDates) {
    for (const [idx, st] of allSec9AStudents.entries()) {
      let status = 'PRESENT';
      if (idx === 3 && date.getDate() === 26) status = 'ABSENT';
      if (idx === 1 && date.getDate() === 27) status = 'LATE';

      await prisma.attendance.create({
        data: {
          studentId: st.id,
          sectionId: sec9A.id,
          date,
          status,
          recordedById: teacherRahim.id,
        },
      });
    }
  }

  // 10. Examination & Results
  const midtermExam = await prisma.exam.create({
    data: {
      name: 'Term 1 Midterm Assessment 2026',
      academicYearId: academicYear.id,
      term: 'Term 1',
      startDate: new Date('2026-09-15'),
      endDate: new Date('2026-09-25'),
      status: 'PUBLISHED',
    },
  });

  const exMath = await prisma.examSubject.create({
    data: {
      examId: midtermExam.id,
      subjectId: subMath.id,
      gradeLevelId: g9.id,
      maxMarks: 100,
      passMarks: 40,
      examDate: new Date('2026-09-16'),
    },
  });

  const exEng = await prisma.examSubject.create({
    data: {
      examId: midtermExam.id,
      subjectId: subEng.id,
      gradeLevelId: g9.id,
      maxMarks: 100,
      passMarks: 40,
      examDate: new Date('2026-09-18'),
    },
  });

  const exPhy = await prisma.examSubject.create({
    data: {
      examId: midtermExam.id,
      subjectId: subPhy.id,
      gradeLevelId: g9.id,
      maxMarks: 100,
      passMarks: 40,
      examDate: new Date('2026-09-20'),
    },
  });

  // Ayaan's published results
  await prisma.examResult.create({
    data: {
      examSubjectId: exMath.id,
      studentId: studentAyaan.id,
      marksObtained: 94.5,
      gradeLetter: 'A+',
      gpa: 5.0,
      remarks: 'Outstanding logical problem solving',
      status: 'PUBLISHED',
      enteredById: teacherRahim.id,
      approvedById: principalUser.id,
    },
  });

  await prisma.examResult.create({
    data: {
      examSubjectId: exEng.id,
      studentId: studentAyaan.id,
      marksObtained: 88.0,
      gradeLetter: 'A+',
      gpa: 5.0,
      remarks: 'Articulate essay analysis and vocabulary',
      status: 'PUBLISHED',
      enteredById: teacherNasrin.id,
      approvedById: principalUser.id,
    },
  });

  await prisma.examResult.create({
    data: {
      examSubjectId: exPhy.id,
      studentId: studentAyaan.id,
      marksObtained: 82.5,
      gradeLetter: 'A+',
      gpa: 5.0,
      remarks: 'Strong conceptual clarity in mechanics',
      status: 'PUBLISHED',
      enteredById: teacherRahim.id,
      approvedById: principalUser.id,
    },
  });

  // Seed remaining demo students
  for (const st of createdDemoStudents) {
    const markM = 65 + Math.floor(Math.random() * 30);
    const markE = 70 + Math.floor(Math.random() * 25);
    await prisma.examResult.create({
      data: {
        examSubjectId: exMath.id,
        studentId: st.id,
        marksObtained: markM,
        gradeLetter: markM >= 80 ? 'A+' : markM >= 70 ? 'A' : 'A-',
        gpa: markM >= 80 ? 5.0 : markM >= 70 ? 4.0 : 3.5,
        status: 'PUBLISHED',
      },
    });
    await prisma.examResult.create({
      data: {
        examSubjectId: exEng.id,
        studentId: st.id,
        marksObtained: markE,
        gradeLetter: markE >= 80 ? 'A+' : markE >= 70 ? 'A' : 'A-',
        gpa: markE >= 80 ? 5.0 : markE >= 70 ? 4.0 : 3.5,
        status: 'PUBLISHED',
      },
    });
  }

  // 11. Fees & Invoices
  const feeTuition = await prisma.feeCategory.create({
    data: { name: 'Monthly Tuition Fee', code: 'TUIT-M', description: 'Standard academic tuition and smart classroom access', isRecurring: true },
  });
  const feeLab = await prisma.feeCategory.create({
    data: { name: 'STEM & Robotics Lab Fee', code: 'STEM-LAB', description: 'Consumables, high-speed fiber internet and equipment access', isRecurring: true },
  });

  await prisma.feeStructure.create({
    data: { feeCategoryId: feeTuition.id, gradeLevelId: g9.id, academicYearId: academicYear.id, amount: 18500, dueDay: 10 },
  });

  // Invoices for Ayaan
  const invPaid = await prisma.invoice.create({
    data: {
      invoiceNo: 'INV-2026-0081',
      studentId: studentAyaan.id,
      academicYearId: academicYear.id,
      title: 'September 2026 Tuition & Activity Fee',
      subtotal: 18500,
      discount: 0,
      totalAmount: 18500,
      paidAmount: 18500,
      balance: 0,
      dueDate: new Date('2026-09-10'),
      status: 'PAID',
    },
  });

  await prisma.payment.create({
    data: {
      paymentNo: 'PAY-2026-0129',
      invoiceId: invPaid.id,
      amount: 18500,
      paymentMethod: 'BKASH',
      referenceNo: 'BK-TRX-9941028',
      transactionDate: new Date('2026-09-08'),
      receivedById: accountantUser.id,
      notes: 'Paid via bKash Merchant Gateway. Verified by Accounts.',
    },
  });

  const invDue = await prisma.invoice.create({
    data: {
      invoiceNo: 'INV-2026-0145',
      studentId: studentAyaan.id,
      academicYearId: academicYear.id,
      title: 'October 2026 Tuition & Science Lab Fee',
      subtotal: 18500,
      discount: 0,
      totalAmount: 18500,
      paidAmount: 0,
      balance: 18500,
      dueDate: new Date('2026-11-10'),
      status: 'UNPAID',
    },
  });

  // 12. Timetable Entries
  const scheduleDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  for (const day of scheduleDays) {
    await prisma.timetableEntry.create({
      data: {
        gradeLevelId: g9.id,
        sectionId: sec9A.id,
        subjectId: subMath.id,
        teacherId: teacherRahim.id,
        dayOfWeek: day,
        periodNumber: 1,
        startTime: '08:30',
        endTime: '09:15',
        room: '301',
      },
    });
    await prisma.timetableEntry.create({
      data: {
        gradeLevelId: g9.id,
        sectionId: sec9A.id,
        subjectId: subEng.id,
        teacherId: teacherNasrin.id,
        dayOfWeek: day,
        periodNumber: 2,
        startTime: '09:20',
        endTime: '10:05',
        room: '301',
      },
    });
    await prisma.timetableEntry.create({
      data: {
        gradeLevelId: g9.id,
        sectionId: sec9A.id,
        subjectId: subPhy.id,
        teacherId: teacherRahim.id,
        dayOfWeek: day,
        periodNumber: 3,
        startTime: '10:10',
        endTime: '10:55',
        room: 'STEM Lab A',
      },
    });
  }

  // 13. Admission Applications
  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'AIS-APP-2026-0301',
      applicantFirstName: 'Nabil',
      applicantLastName: 'Zaman',
      dateOfBirth: new Date('2012-03-14'),
      gender: 'MALE',
      applyingForGradeId: g9.id,
      parentName: 'Engr. Saif Zaman',
      parentPhone: '+880 1712-445566',
      parentEmail: 'saif.zaman@gmail.com',
      previousSchool: 'Scholastica, Senior Campus',
      address: 'Baridhara Diplomatic Zone, Dhaka',
      status: 'ASSESSMENT_SCHEDULED',
      assessmentDate: new Date('2026-11-05T10:00:00Z'),
      adminNotes: 'Candidate portfolio submitted. Written math assessment scheduled.',
    },
  });

  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'AIS-APP-2026-0302',
      applicantFirstName: 'Mehnaz',
      applicantLastName: 'Kabir',
      dateOfBirth: new Date('2011-11-02'),
      gender: 'FEMALE',
      applyingForGradeId: g9.id,
      parentName: 'Dr. Shahana Kabir',
      parentPhone: '+880 1819-887766',
      parentEmail: 'shahana.kabir@dhakamc.edu.bd',
      previousSchool: 'Sunbeams School',
      address: 'Uttara Sector 4, Dhaka',
      status: 'UNDER_REVIEW',
      adminNotes: 'Academic transcripts verified. Recommendation letter verified.',
    },
  });

  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'AIS-APP-2026-0303',
      applicantFirstName: 'Irfan',
      applicantLastName: 'Hossain',
      dateOfBirth: new Date('2010-08-19'),
      gender: 'MALE',
      applyingForGradeId: g10.id,
      parentName: 'Rezaul Hossain',
      parentPhone: '+880 1911-332211',
      parentEmail: 'rezaul.h@gmail.com',
      previousSchool: 'British Council English Medium',
      address: 'Dhanmondi Road 8/A, Dhaka',
      status: 'ACCEPTED',
      adminNotes: 'Formal offer letter dispatched. Seat confirmed in Grade 10 Jamuna.',
    },
  });

  // 14. Notices & Bulletins
  await prisma.notice.create({
    data: {
      title: 'Term 1 Parent-Teacher Conference & Progress Review',
      titleBn: 'প্রথম টার্ম অভিভাবক-শিক্ষক মতবিনিময় ও অগ্রগতি পর্যালোচনা',
      content: 'The Term 1 Parent-Teacher Meeting will be held on Saturday, 7 November 2026 from 9:00 AM to 1:00 PM at the Main Campus Auditorium. Individual appointment slots are available on the Parent Portal.',
      contentBn: 'প্রথম টার্মের অভিভাবক-শিক্ষক সভা আগামী শনিবার, ৭ নভেম্বর ২০২৬ সকাল ৯:০০ টা থেকে দুপুর ১:০০ টা পর্যন্ত মূল ক্যাম্পাসের অডিটোরিয়ামে অনুষ্ঠিত হবে। অভিভাবক পোর্টালে বিস্তারিত সময়সূচি পাওয়া যাবে।',
      priority: 'IMPORTANT',
      targetRole: 'ALL',
      isPublished: true,
    },
  });

  await prisma.notice.create({
    data: {
      title: 'National Mathematics Olympiad Selection Trials',
      titleBn: 'জাতীয় গণিত অলিম্পিয়াড বাছাই পর্ব',
      content: 'Selection trials for Grades 8-12 for the upcoming Bangladesh National Mathematical Olympiad will commence on 12 November 2026. Interested students should contact Mr. Mohammad Rahim.',
      contentBn: 'আসন্ন বাংলাদেশ জাতীয় গণিত অলিম্পিয়াডের জন্য ৮ম থেকে ১২শ শ্রেণির বাছাই পরীক্ষা আগামী ১২ নভেম্বর ২০২৬ অনুষ্ঠিত হবে। আগ্রহী শিক্ষার্থীদের জনাব মোহাম্মদ রহিমের সাথে যোগাযোগের পরামর্শ দেওয়া হচ্ছে।',
      priority: 'NORMAL',
      targetRole: 'STUDENT',
      isPublished: true,
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Winter Uniform Mandatory Compliance Notice',
      titleBn: 'শীতকালীন ইউনিফর্ম পরিধান সংক্রান্ত নির্দেশনা',
      content: 'Effective from 15 November 2026, all students must attend school in prescribed institutional winter navy blazers with official crest embroidery.',
      contentBn: 'আগামী ১৫ নভেম্বর ২০২৬ থেকে সকল শিক্ষার্থীকে নির্ধারিত প্রাতিষ্ঠানিক নেভি ব্লু ব্লেজার পরিধান করে ক্যাম্পাসে উপস্থিত হতে হবে।',
      priority: 'NORMAL',
      targetRole: 'ALL',
      isPublished: true,
    },
  });

  // 15. News & Events
  await prisma.newsArticle.create({
    data: {
      title: 'AIS Robotics Team Wins Silver at Asia-Pacific Youth STEM Challenge',
      titleBn: 'এশিয়া-প্যাসিফিক ইয়ুথ স্টেম চ্যালেঞ্জে এপেক্স টিমের রৌপ্য পদক জয়',
      slug: 'ais-robotics-team-wins-silver-asia-pacific-2026',
      excerpt: 'Four Grade 10 students engineered an autonomous flood rescue robot designed specifically for deltaic terrain.',
      excerptBn: '১০ম শ্রেণির চারজন শিক্ষার্থী বাংলাদেশের নদীমাতৃক অঞ্চলের উপযোগী স্বয়ংক্রিয় উদ্ধারকারী রোবট তৈরি করে এই গৌরব অর্জন করেছে।',
      content: 'Apex International School continues its legacy of technological innovation. Our delegation competing at the Asia-Pacific STEM Challenge in Singapore secured the prestigious Silver Award for their autonomous reconnaissance rover. The project was mentored by our Head of Computer Science.',
      category: 'Achievement',
      coverImage: '/images/news-robotics.jpg',
      isPublished: true,
    },
  });

  await prisma.newsArticle.create({
    data: {
      title: 'Inauguration of New Environmental Science Bio-Dome and Solar Array',
      titleBn: 'নতুন পরিবেশ বিজ্ঞান বায়োডোম ও সোলার এনার্জি প্ল্যান্টের উদ্বোধন',
      slug: 'inauguration-environmental-science-biodome',
      excerpt: 'A zero-emission experiential learning laboratory powered entirely by campus rooftop solar infrastructure.',
      excerptBn: 'ক্যাম্পাসের ছাদে স্থাপিত শতভাগ সৌরবিদ্যুৎ চালিত একটি অত্যাধুনিক পরিবেশ বিজ্ঞান গবেষণাগারের উদ্বোধন।',
      content: 'As part of our commitment to sustainability and hands-on environmental education, AIS Dhaka has officially launched a 4,000 sq ft smart greenhouse biodome allowing botany, climatology, and water filtration studies.',
      category: 'Academic',
      coverImage: '/images/news-biodome.jpg',
      isPublished: true,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Annual Inter-House Sports Meet & Track Gala 2026',
      titleBn: 'বার্ষিক আন্তঃহাউস ক্রীড়া প্রতিযোগিতা ও ট্র্যাক গালা ২০২৬',
      description: 'Competitive track and field events, house marches, and athletic records at the National Stadium complex.',
      eventDate: new Date('2026-11-20'),
      startTime: '08:30 AM',
      endTime: '04:30 PM',
      location: 'AIS Main Athletics Arena & Track',
      category: 'Sports',
      isPublic: true,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Model United Nations (AISMUN 2026)',
      titleBn: 'এপেক্স মডেল জাতিসংঘ সম্মেলন ২০২৬',
      description: 'A 3-day diplomatic debate conference featuring over 400 national and international student delegates.',
      eventDate: new Date('2026-12-10'),
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      location: 'AIS Grand Auditorium & Committee Rooms',
      category: 'Academic',
      isPublic: true,
    },
  });

  // 16. System Settings
  const settings = [
    { key: 'school_name', value: 'Apex International School, Dhaka', category: 'INSTITUTION' },
    { key: 'school_name_bn', value: 'এপেক্স ইন্টারন্যাশনাল স্কুল, ঢাকা', category: 'INSTITUTION' },
    { key: 'school_code', value: 'AIS-DHAKA-1042', category: 'INSTITUTION' },
    { key: 'official_email', value: 'info@apex-intl.edu.bd', category: 'CONTACT' },
    { key: 'admissions_email', value: 'admissions@apex-intl.edu.bd', category: 'CONTACT' },
    { key: 'phone_primary', value: '+880 2 988-1234', category: 'CONTACT' },
    { key: 'phone_mobile', value: '+880 1711-000000', category: 'CONTACT' },
    { key: 'address_line', value: 'Plot 14, Road 8, Gulshan-2, Dhaka-1212, Bangladesh', category: 'CONTACT' },
    { key: 'currency', value: 'BDT', category: 'ACADEMIC' },
    { key: 'currency_symbol', value: '৳', category: 'ACADEMIC' },
    { key: 'timezone', value: 'Asia/Dhaka', category: 'ACADEMIC' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.create({ data: s });
  }

  // 17. Audit Log Seed Record
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'System',
      actorEmail: 'admin@apex-intl.edu.bd',
      actorRole: 'SUPER_ADMIN',
      details: 'Initial institution database seed executed successfully with certified roles and demo entities.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
