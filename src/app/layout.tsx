import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/layout/LanguageContext";

export const metadata: Metadata = {
  title: "Apex International School (AIS Dhaka) | Premium K-12 Academy",
  description:
    "Apex International School is a premier international educational institution in Dhaka, Bangladesh offering world-class academics, holistic development, STEM laboratories, and bilingual mastery.",
  keywords: [
    "International School Dhaka",
    "Apex International School",
    "AIS Dhaka",
    "Cambridge School Bangladesh",
    "Gulshan English Medium School",
    "Best Schools in Dhaka",
  ],
  authors: [{ name: "Apex International School Administration" }],
  openGraph: {
    title: "Apex International School (AIS Dhaka)",
    description:
      "Fostering Global Excellence, Character & Innovation in Dhaka, Bangladesh.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased text-school-text bg-school-bg">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
