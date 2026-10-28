import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { GraduationCap, Mail, Phone, BookOpen, Award } from "lucide-react";

export const revalidate = 60;

const FALLBACK_FACULTY = [
  {
    id: "f-1",
    name: "Dr. Tariq Rahman",
    designation: "Principal & Head of Institution",
    department: "Administration",
    email: "principal@ais.edu.bd",
    phone: "+880 1711 000001",
    qualification: "Ph.D. in Educational Leadership (Cambridge), M.Sc. Physics (DU)",
    bio: "Over 22 years of pedagogical leadership in Cambridge international curriculum frameworks across South Asia.",
  },
  {
    id: "f-2",
    name: "Mohammad Abdur Rahim",
    designation: "Senior Mathematics Educator & Academic Coordinator",
    department: "Mathematics",
    email: "rahim.teacher@ais.edu.bd",
    phone: "+880 1711 000002",
    qualification: "M.Sc. in Applied Mathematics (DU), Cambridge Assessment Certified",
    bio: "Pioneering interactive analytical reasoning and Olympiad mathematics coaching for 14 years.",
  },
  {
    id: "f-3",
    name: "Fatima Farhana",
    designation: "Head of Science & Cambridge Coordinator",
    department: "Natural Sciences",
    email: "fatima.farhana@ais.edu.bd",
    phone: "+880 1711 000003",
    qualification: "M.Sc. in Biochemistry (Nottingham), B.Sc. (Hons)",
    bio: "Specializing in STEM curriculum integration, robotics lab supervision, and national Olympiad mentorship.",
  },
  {
    id: "f-4",
    name: "Nusrat Jahan",
    designation: "Senior English Literature Educator",
    department: "English Language & Humanities",
    email: "nusrat.jahan@ais.edu.bd",
    phone: "+880 1711 000004",
    qualification: "M.A. in English Literature (Warwick), CELTA Certified",
    bio: "Passionate about debate society coaching, rhetorical analysis, and creative writing workshops.",
  },
];

export default async function FacultyPage() {
  let teachers: any[] = [];
  try {
    teachers = await db.teacher.findMany({
      where: { isPublic: true },
      orderBy: { designation: "asc" },
    });
  } catch (err) {
    // Graceful fallback for serverless build without active DB connection
  }

  if (!teachers || teachers.length === 0) teachers = FALLBACK_FACULTY;

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Pedagogical Leadership
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Distinguished Faculty &amp; Academic Staff
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              Our faculty comprises accomplished educators holding advanced degrees from leading
              institutions worldwide. Dedicated to inspiring curiosity, critical inquiry, and character.
            </p>
          </div>

          {/* Teacher Directory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-school-navy-deep text-school-gold flex items-center justify-center font-bold text-xl shadow flex-shrink-0">
                      {t.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-school-navy leading-snug">
                        {t.name}
                      </h3>
                      {t.nameBn && (
                        <p className="text-xs text-slate-500 font-bengali font-medium">
                          {t.nameBn}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-school-teal mt-0.5">
                        {t.designation}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-school-border/60">
                    <p className="font-semibold text-slate-800">
                      Department: <span className="text-school-blue">{t.department}</span>
                    </p>
                    <p className="text-slate-600 line-clamp-2">
                      <strong>Qualification:</strong> {t.qualification}
                    </p>
                  </div>

                  {t.bio && (
                    <p className="text-xs text-school-text-muted leading-relaxed line-clamp-3">
                      {t.bio}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-school-gold" />
                    <span>{t.email}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{t.employeeId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
