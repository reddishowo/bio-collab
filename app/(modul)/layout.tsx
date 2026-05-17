"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookMarked, BookOpen, CalendarDays, GraduationCap, LibraryBig, LogOut, Moon, Sun, Users, Video, X } from "lucide-react";
import { GroupProvider, useGroupSession } from "@/components/GroupContext";

const meetingItems = [
  { id: "p1", number: "01", label: "Peran Bakteri", href: "/lkpd?meeting=p1" },
  { id: "p2", number: "02", label: "Pembusukan", href: "/lkpd?meeting=p2" },
  { id: "p3", number: "03", label: "Bioteknologi", href: "/lkpd?meeting=p3" },
  { id: "p4", number: "04", label: "Nata de Nanas", href: "/lkpd?meeting=p4" },
];

const THEME_STORAGE_KEY = "biocollab-theme";

function setDocumentTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

function ThemeToggle({ compact = false, isDark, onToggle }: { compact?: boolean; isDark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        compact
          ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors hover:bg-pastel-light hover:text-pastel-dark dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          : "flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-pastel-blue/40 hover:text-pastel-dark dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
      }
      title={isDark ? "Matikan dark mode" : "Nyalakan dark mode"}
      aria-label={isDark ? "Matikan dark mode" : "Nyalakan dark mode"}
      aria-pressed={isDark}
    >
      <span className={compact ? "sr-only" : "inline-flex items-center gap-2"}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        {!compact && (isDark ? "Light mode" : "Dark mode")}
      </span>
      {compact && (isDark ? <Sun size={18} /> : <Moon size={18} />)}
      {!compact && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {isDark ? "On" : "Off"}
        </span>
      )}
    </button>
  );
}

function SidebarContent({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userState, logoutSession } = useGroupSession();
  const activeMeeting = searchParams.get("meeting") ?? "p1";

  return (
    <aside className="h-full flex flex-col w-64 bg-white border-r border-pastel-blue/30 shadow-xl md:shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="p-6 border-b border-pastel-blue/20 shrink-0 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-pastel-dark flex items-center gap-2 dark:text-slate-100">
          <Users size={24} /> BioCollab
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-700 dark:text-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2 px-2 dark:text-slate-500">Pendahuluan</p>
        <Link href="/pendahuluan" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/pendahuluan' ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
          <BookOpen size={18} /> Pendahuluan
        </Link>
        <Link href="/materi-bakteri" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/materi-bakteri' ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
          <LibraryBig size={18} /> Materi
        </Link>
        <Link href="/video-pembelajaran" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/video-pembelajaran' ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
          <Video size={18} /> Video Pembelajaran
        </Link>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2 dark:text-slate-500">Pertemuan LKPD</p>
        {meetingItems.map((meeting) => {
          const isActive = pathname === "/lkpd" && activeMeeting === meeting.id;
          return (
            <Link key={meeting.id} href={meeting.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-pastel-light text-pastel-dark dark:bg-slate-800 dark:text-slate-200'}`}>
                {meeting.number}
              </span>
              {meeting.label}
            </Link>
          );
        })}

        <p className="mb-2 mt-6 px-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tentang</p>
        <Link href="/daftar-rujukan" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/daftar-rujukan' ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
          <BookMarked size={18} /> Daftar Rujukan
        </Link>
        <Link href="/daftar-pengembang" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/daftar-pengembang' ? 'bg-pastel-dark text-white shadow-md dark:bg-slate-700' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark dark:hover:bg-slate-900 dark:hover:text-white'}`}>
          <GraduationCap size={18} /> Profil Pengembang
        </Link>
      </nav>

      {userState && (
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 dark:border-slate-800 dark:bg-slate-950">
          <div className="bg-white p-3 rounded-xl border border-pastel-blue/20 shadow-sm relative overflow-hidden dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute top-0 left-0 w-1 h-full bg-pastel-green"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 dark:text-slate-500">Status: Aktif</p>
            <p className="text-sm font-bold text-pastel-dark line-clamp-1 dark:text-slate-100">{userState.groupName}</p>
            <div className="mt-2 rounded-lg bg-pastel-light px-3 py-2 dark:bg-slate-800">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Kode Kelompok</p>
              <p className="font-mono text-lg font-black tracking-widest text-pastel-dark dark:text-slate-100">{userState.groupCode}</p>
            </div>
            <p className="mt-2 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{userState.userName}</p>
            
            <div className="mt-3 flex gap-2">
              <Link href="/lkpd?meeting=p1" className="flex-1 bg-pastel-dark text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 shadow-sm">
                Pertemuan 1
              </Link>
              <button onClick={logoutSession} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Keluar Kelompok">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </aside>
  );
}

function MobileBottomNav({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userState } = useGroupSession();
  const activeMeeting = searchParams.get("meeting") ?? "p1";

  return (
    <>
      {isMeetingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-sm md:hidden" onClick={() => setIsMeetingOpen(false)}>
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            className="absolute inset-x-3 bottom-24 rounded-3xl bg-white p-4 shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-pastel-dark dark:text-slate-300">Pilih LKPD</p>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Pertemuan</h2>
              </div>
              <button type="button" onClick={() => setIsMeetingOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-2">
              {meetingItems.map((meeting) => {
                const isActive = pathname === "/lkpd" && activeMeeting === meeting.id;
                return (
                  <Link
                    key={meeting.id}
                    href={meeting.href}
                    onClick={() => setIsMeetingOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                      isActive ? "border-pastel-dark bg-pastel-light text-pastel-dark dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "border-slate-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-dark text-xs font-black text-white">{meeting.number}</span>
                    <span className="text-sm font-bold">{meeting.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {isAboutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-sm md:hidden" onClick={() => setIsAboutOpen(false)}>
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            className="absolute inset-x-3 bottom-24 rounded-3xl bg-white p-4 shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-pastel-dark dark:text-slate-300">Tentang</p>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Informasi Modul</h2>
              </div>
              <button type="button" onClick={() => setIsAboutOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-2">
              <Link
                href="/daftar-rujukan"
                onClick={() => setIsAboutOpen(false)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  pathname === "/daftar-rujukan" ? "border-pastel-dark bg-pastel-light text-pastel-dark dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "border-slate-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-dark text-white">
                  <BookMarked size={17} />
                </span>
                <span className="text-sm font-bold">Daftar Rujukan</span>
              </Link>
              <Link
                href="/daftar-pengembang"
                onClick={() => setIsAboutOpen(false)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  pathname === "/daftar-pengembang" ? "border-pastel-dark bg-pastel-light text-pastel-dark dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "border-slate-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-dark text-white">
                  <GraduationCap size={18} />
                </span>
                <span className="text-sm font-bold">Daftar Pengembang</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
        {userState && (
          <div className="mx-auto mb-2 flex max-w-md items-center justify-between rounded-2xl bg-pastel-light px-3 py-2 dark:bg-slate-900">
            <span className="truncate text-xs font-bold text-slate-500 dark:text-slate-300">{userState.groupName}</span>
            <span className="ml-2 rounded-lg bg-white px-2 py-1 font-mono text-xs font-black tracking-widest text-pastel-dark dark:bg-slate-800 dark:text-slate-100">{userState.groupCode}</span>
          </div>
        )}
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-1">
          <Link
            href="/pendahuluan"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/pendahuluan" ? "bg-pastel-dark text-white shadow-sm dark:bg-slate-700" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen size={20} />
            <span className="leading-none">Intro</span>
          </Link>
          <Link
            href="/materi-bakteri"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/materi-bakteri" ? "bg-pastel-dark text-white shadow-sm dark:bg-slate-700" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <LibraryBig size={20} />
            <span className="leading-none">Materi</span>
          </Link>
          <Link
            href="/video-pembelajaran"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/video-pembelajaran" ? "bg-pastel-dark text-white shadow-sm dark:bg-slate-700" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <Video size={20} />
            <span className="leading-none">Video</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMeetingOpen(true)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/lkpd" && searchParams.get("meeting") ? "bg-pastel-dark text-white shadow-sm dark:bg-slate-700" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <CalendarDays size={20} />
            <span className="leading-none">Pertemuan</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/daftar-rujukan" || pathname === "/daftar-pengembang" ? "bg-pastel-dark text-white shadow-sm dark:bg-slate-700" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <BookMarked size={20} />
            <span className="leading-none">Tentang</span>
          </button>
          <ThemeToggle compact isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </nav>
    </>
  );
}

function ModuleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userState } = useGroupSession();
  const isLkpdPage = pathname === "/lkpd";
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (
      !userState &&
      pathname !== "/lkpd" &&
      pathname !== "/pendahuluan" &&
      pathname !== "/materi-bakteri" &&
      pathname !== "/video-pembelajaran" &&
      pathname !== "/daftar-rujukan" &&
      pathname !== "/daftar-pengembang"
    ) {
      router.replace("/lkpd");
    }
  }, [pathname, router, userState]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const nextIsDark = storedTheme === "dark";
    setDocumentTheme(nextIsDark);
    const frameId = requestAnimationFrame(() => setIsDark(nextIsDark));
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleTheme = () => {
    setIsDark((current) => {
      const nextIsDark = !current;
      setDocumentTheme(nextIsDark);
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
      return nextIsDark;
    });
  };

  return (
    <div className="relative flex min-h-dvh bg-pastel-light transition-colors dark:bg-slate-950">
      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 md:block">
        <Suspense fallback={null}>
          <SidebarContent isDark={isDark} onToggleTheme={toggleTheme} />
        </Suspense>
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className={isLkpdPage ? "w-full pb-24 md:pb-0" : "mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 md:px-8 md:py-10 lg:px-12"}>
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <MobileBottomNav isDark={isDark} onToggleTheme={toggleTheme} />
      </Suspense>
    </div>
  );
}

export default function ModulLayout({ children }: { children: React.ReactNode }) {
  return (
    <GroupProvider>
      <ModuleShell>{children}</ModuleShell>
    </GroupProvider>
  );
}
