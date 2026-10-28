import React from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building, Sparkles, Camera, CheckCircle2 } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    {
      title: "Advanced STEM & Robotics Suite",
      titleBn: "অত্যাধুনিক স্টেম ও রোবোটিক্স ল্যাব",
      category: "Labs",
      caption: "Equipped with 3D printers, micro-controllers, and automated test benches.",
    },
    {
      title: "Interactive Smart Classrooms",
      titleBn: "ইন্টারেক্টিভ স্মার্ট ক্লাসরুম",
      category: "Campus",
      caption: "High-definition interactive boards and ergonomic modular seating.",
    },
    {
      title: "International Standard Football Arena",
      titleBn: "আন্তর্জাতিক মানের ফুটবল মাঠ",
      category: "Sports",
      caption: "FIFA-standard natural turf pitch with evening floodlights.",
    },
    {
      title: "Alexander Central Library & Study Commons",
      titleBn: "আলেকজান্ডার সেন্ট্রাল লাইব্রেরি",
      category: "Library",
      caption: "Quiet research carrels and extensive international journal collections.",
    },
    {
      title: "Multi-Purpose Performing Arts Auditorium",
      titleBn: "মাল্টি-পারপাস অডিটোরিয়াম",
      category: "Events",
      caption: "650-seat capacity with professional acoustics and theater lighting.",
    },
    {
      title: "Olympic-Size Indoor Swimming Complex",
      titleBn: "ইনডোর সুইমিং পুল কমপ্লেক্স",
      category: "Sports",
      caption: "Climate-controlled 25-meter competitive lap pool with certified lifeguards.",
    },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-school-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="bg-school-navy text-white rounded-2xl p-8 sm:p-14 shadow-lg text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-school-gold font-bold">
              Campus Environment &amp; Facilities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Campus Photographic Gallery
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              Take an interactive visual tour of our 4.2-acre smart campus in Gulshan, Dhaka.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-school-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Visual placeholder box with rich styling */}
                <div className="aspect-[16/10] bg-gradient-to-br from-school-navy via-slate-800 to-school-navy-deep flex flex-col items-center justify-center p-6 text-center text-white relative">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Camera className="w-7 h-7 text-school-gold" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-school-gold/20 text-school-gold">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-school-navy leading-snug">
                    {item.title}
                  </h3>
                  {item.titleBn && (
                    <p className="text-xs text-slate-500 font-bengali font-medium">
                      {item.titleBn}
                    </p>
                  )}
                  <p className="text-xs text-school-text-muted leading-relaxed">
                    {item.caption}
                  </p>
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
