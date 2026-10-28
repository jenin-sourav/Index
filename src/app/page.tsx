import React from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Cpu,
  Search,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch real database notices and events
  const notices = await db.notice.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const events = await db.event.findMany({
    where: { isPublic: true },
    orderBy: { eventDate: "asc" },
    take: 3,
  });

  const news = await db.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-br from-school-navy via-school-navy to-school-navy-deep text-white py-20 lg:py-28 overflow-hidden">
          {/* Subtle geometric background motif */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6AD60_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-school-gold/15 border border-school-gold/30 text-school-gold text-xs sm:text-sm font-semibold tracking-wide">
                  <Sparkles className="w-4 h-4 text-school-gold" />
                  <span>Admissions Open for Academic Year 2026-2027</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                  Fostering Global Excellence, Character &amp; Innovation
                </h1>

                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Apex International School, Dhaka delivers an internationally benchmarked K-12
                  education. Combining academic distinction, state-of-the-art STEM facilities,
                  and holistic leadership development.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/admissions"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-school-gold text-school-navy-deep font-bold text-base hover:bg-yellow-400 shadow-lg hover:shadow-xl transition-all focus:ring-4 focus:ring-yellow-300/50"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 transition-all"
                  >
                    <span>Explore Our Campus</span>
                  </Link>
                </div>

                {/* Key Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-700/60">
                  <div>
                    <span className="block text-3xl font-extrabold text-school-gold">1,250+</span>
                    <span className="text-xs text-slate-300">Enrolled Scholars</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-school-gold">85+</span>
                    <span className="text-xs text-slate-300">Expert Educators</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-school-gold">100%</span>
                    <span className="text-xs text-slate-300">University Placement</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-school-gold">4.2 Acre</span>
                    <span className="text-xs text-slate-300">Smart Campus</span>
                  </div>
                </div>
              </div>

              {/* Right Side Card: Quick Application Status Tracker */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 sm:p-8 text-school-text shadow-2xl border border-school-border relative">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-school-blue mb-2">
                    <Search className="w-4 h-4 text-school-blue" />
                    <span>Admissions Portal</span>
                  </div>
                  <h3 className="text-xl font-bold text-school-navy mb-2">
                    Check Application Status
                  </h3>
                  <p className="text-sm text-school-text-muted mb-6">
                    Enter your application reference code (e.g. AIS-APP-2026-0301) to view review
                    status and assessment timings.
                  </p>

                  <form action="/admissions" method="GET" className="space-y-4">
                    <div>
                      <label htmlFor="ref" className="block text-xs font-semibold text-slate-700 mb-1">
                        Application Reference Number
                      </label>
                      <input
                        type="text"
                        name="ref"
                        id="ref"
                        required
                        placeholder="AIS-APP-2026-XXXX"
                        className="w-full px-4 py-3 rounded-lg border border-school-border bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-school-blue focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-lg bg-school-navy hover:bg-school-navy-deep text-white font-semibold text-sm transition-all shadow"
                    >
                      Track My Application
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>New Applicant?</span>
                    <Link href="/admissions" className="text-school-blue font-semibold hover:underline">
                      Start Online Form &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Principal's Welcome Section */}
        <section className="py-20 bg-white border-b border-school-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-school-border shadow-lg aspect-[4/5] flex items-center justify-center text-slate-400">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-school-navy text-school-gold mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow">
                      TR
                    </div>
                    <h3 className="text-lg font-bold text-school-navy">Dr. Tariq Rahman</h3>
                    <p className="text-xs text-school-teal font-semibold">
                      Ph.D. (Oxford), M.Sc.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Principal &amp; Academic Director</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-school-teal">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional Leadership</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-school-navy tracking-tight">
                  Welcome to Apex International School
                </h2>
                <blockquote className="border-l-4 border-school-gold pl-4 italic text-slate-700 text-lg leading-relaxed">
                  &ldquo;Our vision at AIS Dhaka is not merely to impart academic knowledge, but to
                  cultivate intellectual curiosity, moral fortitude, and an unwavering commitment
                  to global betterment.&rdquo;
                </blockquote>
                <p className="text-school-text-muted leading-relaxed">
                  Founded with an international vision in the heart of Dhaka, AIS balances rigorous
                  Cambridge academic frameworks with a deep celebration of Bangladeshi cultural
                  heritage and bilingual mastery. Our scholars are equipped with cutting-edge STEM
                  and robotics laboratories, extensive arts and athletics, and personalized
                  university counselling that unlocks entry to the world&apos;s leading institutions.
                </p>
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-school-blue font-semibold hover:text-blue-800 transition-colors"
                  >
                    <span>Read Full Leadership Message &amp; Institutional Policies</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Academic Programs Overview */}
        <section className="py-20 bg-school-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-school-blue">
                Academic Pathways
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-school-navy tracking-tight">
                World-Class Educational Divisions
              </h2>
              <p className="text-school-text-muted text-base">
                Carefully calibrated developmental stages supporting each student&apos;s cognitive,
                creative, and emotional growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary */}
              <div className="bg-white rounded-2xl p-8 border border-school-border shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-school-blue flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-school-navy">Primary Academy</h3>
                <p className="text-xs font-semibold text-school-teal">Grades 1 through 5</p>
                <p className="text-sm text-school-text-muted leading-relaxed">
                  Inquiry-based foundational learning developing numeracy, bilingual literacy,
                  creative arts, emotional intelligence, and scientific curiosity.
                </p>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-school-blue hover:text-blue-800"
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Middle School */}
              <div className="bg-white rounded-2xl p-8 border border-school-border shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-school-teal flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-school-navy">Middle School</h3>
                <p className="text-xs font-semibold text-school-teal">Grades 6 through 8</p>
                <p className="text-sm text-school-text-muted leading-relaxed">
                  Rigorous core academic competencies paired with hands-on computer science,
                  robotics, environmental studies, and public speaking debate clubs.
                </p>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-school-blue hover:text-blue-800"
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Senior Secondary */}
              <div className="bg-white rounded-2xl p-8 border border-school-border shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 text-school-gold flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-school-navy">Senior Secondary</h3>
                <p className="text-xs font-semibold text-school-teal">Grades 9 through 12</p>
                <p className="text-sm text-school-text-muted leading-relaxed">
                  Pre-university academic mastery with advanced STEM laboratories, Cambridge IGCSE
                  and A-Levels pathways, and dedicated international college admissions coaching.
                </p>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-school-blue hover:text-blue-800"
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live Notices & School Bulletins */}
        <section className="py-20 bg-white border-b border-school-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-school-teal">
                  Official Bulletins
                </span>
                <h2 className="text-3xl font-extrabold text-school-navy tracking-tight">
                  Latest School Notices &amp; Announcements
                </h2>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1 text-sm font-bold text-school-blue hover:underline"
              >
                <span>View All Notices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-6 rounded-xl border border-school-border bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {formatDate(n.publishedAt)}
                      </span>
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
                    <h4 className="text-base font-bold text-school-navy leading-snug">
                      {n.title}
                    </h4>
                    <p className="text-sm text-school-text-muted line-clamp-3">
                      {n.content}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/news"
                      className="text-xs font-semibold text-school-blue hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Full Notice</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Upcoming Events & School Calendar */}
        <section className="py-20 bg-school-bg border-b border-school-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-school-gold">
                  Campus Life &amp; Calendar
                </span>
                <h2 className="text-3xl font-extrabold text-school-navy tracking-tight">
                  Upcoming Institutional Events
                </h2>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 text-sm font-bold text-school-blue hover:underline"
              >
                <span>Full Academic Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-xl p-6 border border-school-border shadow-sm flex items-start gap-4"
                >
                  <div className="w-16 h-16 rounded-xl bg-school-navy text-white flex flex-col items-center justify-center flex-shrink-0 text-center shadow">
                    <span className="text-xs uppercase font-bold text-school-gold">
                      {new Date(e.eventDate).toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-extrabold leading-none">
                      {new Date(e.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {e.category}
                    </span>
                    <h4 className="text-base font-bold text-school-navy leading-snug">
                      {e.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {e.startTime} - {e.endTime} &bull; {e.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Portals Access CTA Banner */}
        <section className="py-16 bg-school-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Unified School Management Portals
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Secure digital portals for students, parents, educators, and administrators to track
              attendance, report cards, class schedules, and fee receipts in real time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/student"
                className="px-5 py-2.5 rounded-lg bg-school-teal text-white font-semibold text-sm hover:bg-teal-600 transition"
              >
                Student Portal
              </Link>
              <Link
                href="/parent"
                className="px-5 py-2.5 rounded-lg bg-school-gold text-school-navy-deep font-semibold text-sm hover:bg-yellow-400 transition"
              >
                Parent Portal
              </Link>
              <Link
                href="/teacher"
                className="px-5 py-2.5 rounded-lg bg-school-blue text-white font-semibold text-sm hover:bg-blue-700 transition"
              >
                Faculty Portal
              </Link>
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-lg bg-white/15 border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition"
              >
                Administration System
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
