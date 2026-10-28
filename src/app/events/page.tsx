import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: { isPublic: true },
    orderBy: { eventDate: "asc" },
  });

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              School Community &amp; Life
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Calendar of Institutional Events
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              Explore upcoming academic Olympiads, inter-house athletics meets, cultural galas, and
              parent conferences.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-school-border shadow-sm flex items-start gap-6 hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-2xl bg-school-navy text-white flex flex-col items-center justify-center flex-shrink-0 text-center shadow-md">
                  <span className="text-xs uppercase font-extrabold text-school-gold">
                    {new Date(e.eventDate).toLocaleString("en-US", { month: "short" })}
                  </span>
                  <span className="text-3xl font-extrabold leading-none mt-1">
                    {new Date(e.eventDate).getDate()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(e.eventDate).getFullYear()}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-school-blue">
                    {e.category}
                  </div>

                  <h3 className="text-lg font-bold text-school-navy leading-snug">
                    {e.title}
                  </h3>

                  {e.titleBn && (
                    <p className="text-xs text-slate-500 font-bengali font-medium">
                      {e.titleBn}
                    </p>
                  )}

                  <p className="text-xs text-school-text-muted leading-relaxed">
                    {e.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-school-gold" />
                      <span>{e.startTime} - {e.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-school-teal" />
                      <span>{e.location}</span>
                    </div>
                  </div>
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
