"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, LogOut, Users, X } from "lucide-react";
import { GroupProvider, useGroupSession } from "@/components/GroupContext";

const meetingItems = [
  { id: "p1", number: "01", label: "Peran Bakteri", href: "/lkpd?meeting=p1" },
  { id: "p2", number: "02", label: "Pembusukan", href: "/lkpd?meeting=p2" },
  { id: "p3", number: "03", label: "Bioteknologi", href: "/lkpd?meeting=p3" },
  { id: "p4", number: "04", label: "Nata de Nanas", href: "/lkpd?meeting=p4" },
];

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userState, logoutSession } = useGroupSession();
  const activeMeeting = searchParams.get("meeting") ?? "p1";

  return (
    <aside className="h-full flex flex-col w-64 bg-white border-r border-pastel-blue/30 shadow-xl md:shadow-sm">
      <div className="p-6 border-b border-pastel-blue/20 shrink-0">
        <h1 className="text-2xl font-bold text-pastel-dark flex items-center gap-2">
          <Users size={24} /> BioCollab
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-700">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2 px-2">Pendahuluan</p>
        <Link href="/pendahuluan" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/pendahuluan' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
          <BookOpen size={18} /> Pendahuluan
        </Link>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Pertemuan LKPD</p>
        {meetingItems.map((meeting) => {
          const isActive = pathname === "/lkpd" && activeMeeting === meeting.id;
          return (
            <Link key={meeting.id} href={meeting.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-pastel-light text-pastel-dark'}`}>
                {meeting.number}
              </span>
              {meeting.label}
            </Link>
          );
        })}
      </nav>

      {userState && (
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-pastel-blue/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pastel-green"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status: Aktif</p>
            <p className="text-sm font-bold text-pastel-dark line-clamp-1">{userState.groupName}</p>
            <div className="mt-2 rounded-lg bg-pastel-light px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Kode Kelompok</p>
              <p className="font-mono text-lg font-black tracking-widest text-pastel-dark">{userState.groupCode}</p>
            </div>
            <p className="mt-2 truncate text-xs font-medium text-slate-500">{userState.userName}</p>
            
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
    </aside>
  );
}

function MobileBottomNav() {
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
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
            className="absolute inset-x-3 bottom-24 rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-pastel-dark">Pilih LKPD</p>
                <h2 className="text-lg font-black text-slate-800">Pertemuan</h2>
              </div>
              <button type="button" onClick={() => setIsMeetingOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500">
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
                      isActive ? "border-pastel-dark bg-pastel-light text-pastel-dark" : "border-slate-100 bg-white text-slate-600"
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        {userState && (
          <div className="mx-auto mb-2 flex max-w-md items-center justify-between rounded-2xl bg-pastel-light px-3 py-2">
            <span className="truncate text-xs font-bold text-slate-500">{userState.groupName}</span>
            <span className="ml-2 rounded-lg bg-white px-2 py-1 font-mono text-xs font-black tracking-widest text-pastel-dark">{userState.groupCode}</span>
          </div>
        )}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-1">
          <Link
            href="/pendahuluan"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/pendahuluan" ? "bg-pastel-dark text-white shadow-sm" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark"
            }`}
          >
            <BookOpen size={20} />
            <span className="leading-none">Intro</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMeetingOpen(true)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
              pathname === "/lkpd" && searchParams.get("meeting") ? "bg-pastel-dark text-white shadow-sm" : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark"
            }`}
          >
            <CalendarDays size={20} />
            <span className="leading-none">Pertemuan</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function ModuleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userState } = useGroupSession();

  useEffect(() => {
    if (!userState && pathname !== "/lkpd" && pathname !== "/pendahuluan") {
      router.replace("/lkpd");
    }
  }, [pathname, router, userState]);

  return (
    <div className="relative flex min-h-dvh bg-pastel-light">
      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 md:block">
        <Suspense fallback={null}>
          <SidebarContent />
        </Suspense>
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 md:px-8 md:py-10 lg:px-12">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <MobileBottomNav />
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
