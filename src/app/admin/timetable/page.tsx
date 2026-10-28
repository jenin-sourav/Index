import React from "react";
import { db } from "@/lib/db";
import { CalendarDays, Clock, MapPin, User, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTimetablePage() {
  const scheduleDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  const entries = await db.timetableEntry.findMany({
    include: {
      gradeLevel: true,
      section: true,
      subject: true,
      teacher: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-school-navy">Timetable Schedules</h1>
        <p className="text-xs text-school-text-muted">
          Master weekly academic period allocation and conflict-free room scheduling.
        </p>
      </div>

      <div className="space-y-8">
        {scheduleDays.map((day) => {
          const dayEntries = entries.filter((e) => e.dayOfWeek === day);

          return (
            <div key={day} className="bg-white rounded-2xl border border-school-border shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-school-border pb-3">
                <CalendarDays className="w-5 h-5 text-school-blue" />
                <h2 className="text-lg font-bold text-school-navy">{day}</h2>
              </div>

              {dayEntries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No scheduled periods for {day}.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dayEntries.map((e) => (
                    <div
                      key={e.id}
                      className="p-4 rounded-xl bg-slate-50 border border-school-border space-y-2 hover:bg-white hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-school-teal uppercase tracking-wider">
                          Period {e.periodNumber}
                        </span>
                        <span className="font-mono text-slate-500 font-semibold">
                          {e.startTime} – {e.endTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-school-navy leading-snug">
                        {e.subject.name}
                      </h3>

                      <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-school-gold" />
                          <span>{e.teacher.name}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Room: {e.room || "Main Class"}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
