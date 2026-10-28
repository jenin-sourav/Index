"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Shield,
  UserCheck,
  Users,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.navHome },
    { href: "/about", label: t.navAbout },
    { href: "/academics", label: t.navAcademics },
    { href: "/admissions", label: t.navAdmissions },
    { href: "/faculty", label: t.navFaculty },
    { href: "/news", label: t.navNews },
    { href: "/events", label: t.navEvents },
    { href: "/gallery", label: t.navGallery },
    { href: "/contact", label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-school-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg bg-school-navy flex items-center justify-center text-school-gold shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-school-navy group-hover:text-school-blue transition-colors">
                APEX INTERNATIONAL
              </span>
              <span className="block text-xs uppercase tracking-widest text-school-teal font-semibold">
                School &bull; Dhaka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-school-blue bg-blue-50/60 font-semibold"
                      : "text-school-text hover:text-school-blue hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Portals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                onBlur={() => setTimeout(() => setPortalDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-school-text hover:text-school-blue hover:bg-slate-50 transition-colors"
                aria-expanded={portalDropdownOpen}
              >
                <span>{t.navPortals}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/student"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-school-text hover:bg-slate-50 hover:text-school-blue"
                  >
                    <BookOpen className="w-4 h-4 text-school-teal" />
                    <span>{t.navStudentPortal}</span>
                  </Link>
                  <Link
                    href="/parent"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-school-text hover:bg-slate-50 hover:text-school-blue"
                  >
                    <Users className="w-4 h-4 text-school-gold" />
                    <span>{t.navParentPortal}</span>
                  </Link>
                  <Link
                    href="/teacher"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-school-text hover:bg-slate-50 hover:text-school-blue"
                  >
                    <UserCheck className="w-4 h-4 text-school-blue" />
                    <span>{t.navTeacherPortal}</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-school-navy hover:bg-blue-50/50"
                  >
                    <Shield className="w-4 h-4 text-school-navy" />
                    <span>{t.navAdminPortal}</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/admissions"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-md bg-school-blue text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-blue"
            >
              {t.navApplyNow}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-school-navy hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-school-blue"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "text-school-blue bg-blue-50 font-semibold"
                  : "text-school-text hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-200 pt-3 mt-2">
            <span className="block px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.navPortals}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm rounded bg-slate-50 hover:bg-slate-100 text-school-text"
              >
                {t.navStudentPortal}
              </Link>
              <Link
                href="/parent"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm rounded bg-slate-50 hover:bg-slate-100 text-school-text"
              >
                {t.navParentPortal}
              </Link>
              <Link
                href="/teacher"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm rounded bg-slate-50 hover:bg-slate-100 text-school-text"
              >
                {t.navTeacherPortal}
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm rounded bg-blue-50 font-medium text-school-blue"
              >
                {t.navAdminPortal}
              </Link>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href="/admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-md bg-school-blue text-white font-semibold shadow"
            >
              {t.navApplyNow}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
