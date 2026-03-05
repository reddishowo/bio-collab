import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpenCheck, LogOut } from "lucide-react";
import { logoutTeacher } from "@/app/auth-actions"; // Import fungsi logout

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teacher Panel | BioCollab",
  description: "Dashboard Monitoring BioCollab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Navbar Guru */}
        <header className="bg-pastel-dark text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <BookOpenCheck size={28} />
              <h1 className="text-xl font-bold tracking-wide">BioCollab <span className="font-light hidden md:inline">| Teacher Panel</span></h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-xs md:text-sm bg-white/20 px-4 py-1.5 rounded-full font-medium hidden sm:block">
                Mode Monitoring
              </div>
              
              {/* TOMBOL LOGOUT */}
              <form action={logoutTeacher}>
                <button type="submit" className="flex items-center gap-2 text-sm bg-red-500/80 hover:bg-red-500 px-4 py-1.5 rounded-full transition-colors font-medium" title="Keluar">
                  <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}