"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-school-navy-deep text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Institutional Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-school-navy flex items-center justify-center text-school-gold shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  APEX INTERNATIONAL
                </span>
                <span className="block text-xs uppercase tracking-widest text-school-gold font-semibold">
                  School &bull; Dhaka
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated to academic rigor, character leadership, and technological innovation.
              Empowering students to excel in top global universities and lead with ethical vision.
            </p>
            <div className="flex items-center gap-2 text-xs text-school-teal">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified International Educational Standard</span>
            </div>
          </div>

          {/* Quick Academic Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide border-b border-slate-700/60 pb-2">
              Academic Divisions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/academics" className="hover:text-school-gold transition-colors">
                  Primary Academy (Grades 1-5)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-school-gold transition-colors">
                  Middle School (Grades 6-8)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-school-gold transition-colors">
                  Senior Secondary (Grades 9-12)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-school-gold transition-colors">
                  STEM Robotics & Computing Lab
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-school-gold transition-colors">
                  Academic Calendar 2026-2027
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions & Portals */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide border-b border-slate-700/60 pb-2">
              Admissions & Portals
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admissions" className="hover:text-school-gold transition-colors">
                  Online Admission Application
                </Link>
              </li>
              <li>
                <Link href="/admissions#track" className="hover:text-school-gold transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-school-gold transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/parent" className="hover:text-school-gold transition-colors">
                  Parent & Guardian Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-school-gold transition-colors">
                  Faculty & Staff Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-school-gold transition-colors">
                  Administrative System
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Campus Location */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide border-b border-slate-700/60 pb-2">
              Gulshan Campus
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-school-gold mt-1 flex-shrink-0" />
                <span>{t.addressShort}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-school-gold flex-shrink-0" />
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-school-gold flex-shrink-0" />
                <span>{t.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-school-gold flex-shrink-0" />
                <span>{t.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Apex International School (AIS Dhaka). All institutional rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Privacy & Safeguarding Policy
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Terms of Enrollment
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Campus Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
