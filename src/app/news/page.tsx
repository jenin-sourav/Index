import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Bell, Newspaper, Calendar, Sparkles } from "lucide-react";

export const revalidate = 60;

const FALLBACK_NOTICES = [
  {
    id: "n-1",
    title: "Admissions Open for Academic Session 2026-2027",
    content: "Online registration and assessment booking are now active across Cambridge Primary, Lower Secondary, and IGCSE programs. Apply early as class seats are strictly capped.",
    publishedAt: new Date("2026-10-15T09:00:00Z"),
    targetRole: "ALL",
  },
  {
    id: "n-2",
    title: "Mid-Term Examination Schedule & Syllabus Circular",
    content: "The official timetable for Term 1 examinations has been published on the student and parent portals. Please review syllabus coverage.",
    publishedAt: new Date("2026-10-10T09:00:00Z"),
    targetRole: "STUDENT",
  },
  {
    id: "n-3",
    title: "Tuition Fee Schedule for Term 2",
    content: "Parents and guardians can view tuition invoices and pay digitally through the Parent Portal with instant receipt generation.",
    publishedAt: new Date("2026-10-01T09:00:00Z"),
    targetRole: "GUARDIAN",
  },
];

const FALLBACK_NEWS = [
  {
    id: "nw-1",
    title: "AIS Students Excel at National Math Olympiad 2026",
    summary: "Three students from Grade 10 earned top divisional honours at the Bangladesh National Mathematical Olympiad.",
    content: "Apex International School is proud to celebrate the stellar performance of our students at the 2026 National Mathematical Olympiad. The team demonstrated exceptional analytical problem-solving skills under the guidance of our mathematics department.",
    publishedAt: new Date("2026-10-12T10:00:00Z"),
    author: "Academic Affairs Desk",
  },
  {
    id: "nw-2",
    title: "New Advanced Robotics & AI Learning Hub Inaugurated",
    summary: "State-of-the-art laboratory equipped with IoT microcontrollers, 3D printing, and automation kits opened on campus.",
    content: "In line with our commitment to next-generation pedagogical standards, AIS Dhaka has inaugurated a 2,500 sq ft Robotics & AI Hub to foster hands-on engineering principles from Grade 6 upwards.",
    publishedAt: new Date("2026-10-02T10:00:00Z"),
    author: "Campus Life Editorial",
  },
];

export default async function NewsPage() {
  let notices: any[] = [];
  let news: any[] = [];

  try {
    notices = await db.notice.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    news = await db.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    // Graceful fallback for serverless build without active DB connection
  }

  if (!notices || notices.length === 0) notices = FALLBACK_NOTICES;
  if (!news || news.length === 0) news = FALLBACK_NEWS;

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Campus Communications
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              News, Announcements &amp; Institutional Bulletins
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              Stay informed with official circulars, student achievements, academic bulletins, and
              community notices.
            </p>
          </div>

          {/* Official Notices */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-school-teal" />
              <h2 className="text-2xl font-bold text-school-navy">Official School Notices</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="bg-white p-6 rounded-2xl border border-school-border shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{formatDate(n.publishedAt)}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          n.priority === "URGENT"
                            ? "bg-red-100 text-red-700"
                            : n.priority === "IMPORTANT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {n.priority}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-school-navy leading-snug">
                      {n.title}
                    </h3>

                    {n.titleBn && (
                      <p className="text-xs text-slate-600 font-bengali font-medium">
                        {n.titleBn}
                      </p>
                    )}

                    <p className="text-xs text-school-text-muted leading-relaxed line-clamp-4">
                      {n.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    Audience: <strong>{n.targetRole}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Articles */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-school-blue" />
              <h2 className="text-2xl font-bold text-school-navy">Campus News &amp; Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-school-border shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-school-blue uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-school-navy leading-tight">
                      {item.title}
                    </h3>

                    {item.titleBn && (
                      <p className="text-xs text-slate-600 font-bengali font-medium">
                        {item.titleBn}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-school-text-muted leading-relaxed">
                      {item.content}
                    </p>
                  </div>
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
