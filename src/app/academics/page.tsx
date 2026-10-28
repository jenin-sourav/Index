import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Award, CheckCircle2, Calendar, FileText } from "lucide-react";

export default function AcademicsPage() {
  const gradingScale = [
    { range: "80% - 100%", grade: "A+", gpa: "5.00", remarks: "Outstanding" },
    { range: "70% - 79%", grade: "A", gpa: "4.00", remarks: "Excellent" },
    { range: "60% - 69%", grade: "A-", gpa: "3.50", remarks: "Very Good" },
    { range: "50% - 59%", grade: "B", gpa: "3.00", remarks: "Good" },
    { range: "40% - 49%", grade: "C", gpa: "2.00", remarks: "Satisfactory" },
    { range: "33% - 39%", grade: "D", gpa: "1.00", remarks: "Passing" },
    { range: "0% - 32%", grade: "F", gpa: "0.00", remarks: "Needs Improvement" },
  ];

  const academicCalendar = [
    { term: "Term 1 (Autumn)", period: "July 2026 – December 2026", exam: "Midterm: Sept 2026 | Final: Dec 2026" },
    { term: "Winter Break", period: "18 December 2026 – 2 January 2027", exam: "Institutional Recess" },
    { term: "Term 2 (Spring)", period: "January 2027 – June 2027", exam: "Midterm: March 2027 | Annual: June 2027" },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Academic Excellence &bull; K-12 Curriculum
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Curriculum, Assessment &amp; Academic Policies
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              At AIS Dhaka, our rigorous academic architecture blends the critical rigor of
              Cambridge International Assessments with Bangladeshi national curricular excellence.
            </p>
          </div>

          {/* Academic Divisions */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-school-navy">
              Curriculum Structure by Division
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary */}
              <div className="bg-white p-8 rounded-2xl border border-school-border shadow-sm space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-50 text-school-blue rounded text-xs font-bold uppercase">
                  Grades 1 – 5
                </div>
                <h3 className="text-xl font-bold text-school-navy">Primary Academy</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  Focus on early literacy in both English and Bangla, foundation mathematics, hands-on
                  natural science, music, visual arts, and emotional resilience.
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-700 space-y-1.5">
                  <p>&bull; English &amp; Phonics Mastery</p>
                  <p>&bull; Singapore Math Foundations</p>
                  <p>&bull; Bengali Heritage Studies</p>
                  <p>&bull; Introductory Coding &amp; Robotics</p>
                </div>
              </div>

              {/* Middle */}
              <div className="bg-white p-8 rounded-2xl border border-school-border shadow-sm space-y-4">
                <div className="inline-block px-3 py-1 bg-teal-50 text-school-teal rounded text-xs font-bold uppercase">
                  Grades 6 – 8
                </div>
                <h3 className="text-xl font-bold text-school-navy">Middle School</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  Deepens analytical capability in discrete sciences (Physics, Chemistry, Biology),
                  world geography, algebra, computer science, and debate.
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-700 space-y-1.5">
                  <p>&bull; Integrated Sciences &amp; Wet Labs</p>
                  <p>&bull; Pre-Algebra &amp; Geometry</p>
                  <p>&bull; Computer Science &amp; Python</p>
                  <p>&bull; Model UN &amp; Public Oratory</p>
                </div>
              </div>

              {/* High School */}
              <div className="bg-white p-8 rounded-2xl border border-school-border shadow-sm space-y-4">
                <div className="inline-block px-3 py-1 bg-yellow-50 text-school-gold rounded text-xs font-bold uppercase">
                  Grades 9 – 12
                </div>
                <h3 className="text-xl font-bold text-school-navy">Senior Secondary</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  University preparatory education offering Cambridge IGCSE and A-Levels pathways,
                  laboratory research projects, and university placement counselling.
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-700 space-y-1.5">
                  <p>&bull; Advanced STEM / Commerce Streams</p>
                  <p>&bull; Cambridge Examination Preparation</p>
                  <p>&bull; SAT &amp; IELTS Guided Preparation</p>
                  <p>&bull; Global University Portfolio Mentorship</p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Grading Scale Table */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-school-border shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-school-teal">
                Evaluation Standard
              </span>
              <h2 className="text-2xl font-bold text-school-navy mt-1">
                Official Institutional Grading Scale
              </h2>
              <p className="text-xs text-school-text-muted mt-1">
                All term examinations, progress reports, and transcripts follow this server-calculated scale.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-4">Marks Range</th>
                    <th className="py-3 px-4">Letter Grade</th>
                    <th className="py-3 px-4">Grade Point (GPA)</th>
                    <th className="py-3 px-4">Qualitative Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradingScale.map((row) => (
                    <tr key={row.grade} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{row.range}</td>
                      <td className="py-3.5 px-4 font-bold text-school-blue">{row.grade}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{row.gpa}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-school-border shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-school-gold">
                Session 2026-2027
              </span>
              <h2 className="text-2xl font-bold text-school-navy mt-1">
                Academic Calendar &amp; Assessment Schedule
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {academicCalendar.map((c) => (
                <div key={c.term} className="p-6 rounded-xl bg-slate-50 border border-school-border space-y-2">
                  <div className="flex items-center gap-2 text-school-navy font-bold text-base">
                    <Calendar className="w-4 h-4 text-school-blue" />
                    <span>{c.term}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{c.period}</p>
                  <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">{c.exam}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
