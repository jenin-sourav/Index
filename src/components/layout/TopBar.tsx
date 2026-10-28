"use client";

import React from "react";
import { Phone, Mail, Clock, Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function TopBar() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="bg-school-navy-deep text-slate-200 text-xs py-2 px-4 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 hover:text-school-gold transition-colors">
            <Phone className="w-3.5 h-3.5 text-school-gold" />
            <span>{t.phone}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 hover:text-school-gold transition-colors">
            <Mail className="w-3.5 h-3.5 text-school-gold" />
            <span>{t.email}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-school-gold" />
            <span>{t.officeHours}</span>
          </div>
        </div>

        {/* Language Switcher & Quick Links */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "bn" : "en")}
            className="flex items-center gap-1 px-2.5 py-1 bg-school-navy/80 hover:bg-school-navy border border-school-border/20 rounded font-medium text-school-gold transition-colors text-xs"
            aria-label="Toggle language between English and Bangla"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "বাংলা" : "English"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
