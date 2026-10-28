import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Award,
  BookOpen,
  HeartHandshake,
  Building,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Our Heritage &bull; Founded 2018
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              About Apex International School
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              Established to bridge international educational excellence with moral leadership,
              AIS Dhaka provides an unparalleled learning sanctuary empowering young minds to shape
              a dynamic global future.
            </p>
          </div>

          {/* Vision & Mission Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-school-border shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-school-blue flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-school-navy">Our Vision</h2>
              <p className="text-sm text-school-text-muted leading-relaxed">
                To be the foremost center of academic distinction, research curiosity, and ethical
                integrity in South Asia, preparing articulate, compassionate, and visionary leaders
                who impact society with innovation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-school-border shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-school-teal flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-school-navy">Our Mission</h2>
              <p className="text-sm text-school-text-muted leading-relaxed">
                To provide a transformative, learner-centered environment fostering critical
                thinking, bilingual fluency, cross-cultural empathy, and cutting-edge STEM literacy
                within a safe, inclusive campus culture.
              </p>
            </div>
          </div>

          {/* Educational Philosophy */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-school-border shadow-sm space-y-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-school-teal">
                Pedagogy &amp; Values
              </span>
              <h2 className="text-3xl font-extrabold text-school-navy mt-1">
                Our Educational Philosophy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-school-border space-y-3">
                <CheckCircle2 className="w-6 h-6 text-school-teal" />
                <h3 className="text-base font-bold text-school-navy">Inquiry-Led Discovery</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  Students are active investigators, encouraged to formulate hypotheses, conduct
                  experimental science, and test solutions rather than memorizing textbooks.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-school-border space-y-3">
                <CheckCircle2 className="w-6 h-6 text-school-teal" />
                <h3 className="text-base font-bold text-school-navy">Bilingual Fluency &amp; Heritage</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  Rigorous English immersion alongside deep command of Bangla language and literature,
                  instilling cultural pride with seamless global mobility.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-school-border space-y-3">
                <CheckCircle2 className="w-6 h-6 text-school-teal" />
                <h3 className="text-base font-bold text-school-navy">Safeguarding &amp; Wellbeing</h3>
                <p className="text-xs text-school-text-muted leading-relaxed">
                  Strict zero-tolerance child protection protocols, psychological counselling, and
                  nurturing mentorship ensuring each child thrives physically and emotionally.
                </p>
              </div>
            </div>
          </div>

          {/* Campus Infrastructure */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-school-border shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-school-gold">
                Smart Facilities
              </span>
              <h2 className="text-3xl font-extrabold text-school-navy mt-1">
                State-of-the-Art Infrastructure
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl border border-school-border bg-slate-50">
                <Building className="w-6 h-6 text-school-navy mb-2" />
                <h4 className="font-bold text-sm text-school-navy">Smart Classrooms</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Equipped with 4K interactive touch displays and acoustic sound baffling.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-school-border bg-slate-50">
                <Building className="w-6 h-6 text-school-navy mb-2" />
                <h4 className="font-bold text-sm text-school-navy">Advanced STEM Labs</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Dedicated physics, chemistry, biology, and robotics research suites.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-school-border bg-slate-50">
                <Building className="w-6 h-6 text-school-navy mb-2" />
                <h4 className="font-bold text-sm text-school-navy">Central Library</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Over 18,000 physical volumes plus JSTOR and Oxford digital academic subscriptions.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-school-border bg-slate-50">
                <Building className="w-6 h-6 text-school-navy mb-2" />
                <h4 className="font-bold text-sm text-school-navy">Athletics Arena</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Full-size football pitch, indoor gymnasium, basketball court, and swimming pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
