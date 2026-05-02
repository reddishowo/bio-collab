"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CheckCircle, Users, Dna, ArrowRight, LogOut, FileText } from "lucide-react";
import { GroupProvider, useGroupSession } from "@/components/GroupContext";

const navItems = [
  { href: "/pendahuluan", label: "Intro", fullLabel: "Pendahuluan", icon: BookOpen },
  { href: "/materi-bakteri", label: "Materi", fullLabel: "Bakteri", icon: Dna },
  { href: "/lkpd", label: "LKPD", fullLabel: "LKPD", icon: FileText },
  { href: "/evaluasi", label: "Evaluasi", fullLabel: "Evaluasi", icon: CheckCircle },
];

function SidebarContent() {
  const pathname = usePathname();
  const { userState, logoutSession } = useGroupSession();

  const daftarMateri = [
    { id: "bakteri", title: "Bakteri", icon: Dna },
  ];

  return (
    <aside className="h-full flex flex-col w-64 bg-white border-r border-pastel-blue/30 shadow-xl md:shadow-sm">
      <div className="p-6 border-b border-pastel-blue/20 shrink-0">
        <h1 className="text-2xl font-bold text-pastel-dark flex items-center gap-2">
          <Users size={24} /> BioCollab
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-700">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2 px-2">Daftar Isi</p>
        <Link href="/pendahuluan" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/pendahuluan' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
          <BookOpen size={18} /> Pendahuluan
        </Link>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Materi Pembelajaran</p>
        {daftarMateri.map((materi) => {
          const Icon = materi.icon;
          const isActive = pathname === `/materi-${materi.id}`;
          return (
            <Link key={materi.id} href={`/materi-${materi.id}`} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
              <Icon size={18} /> {materi.title}
            </Link>
          );
        })}

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Penutup</p>
        <Link href="/evaluasi" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${pathname === '/evaluasi' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
          <CheckCircle size={18} /> Evaluasi
        </Link>
      </nav>

      {/* --- KARTU STATUS KELOMPOK (Muncul Jika Sudah Login) --- */}
      {userState && (
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-pastel-blue/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pastel-green"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status: Aktif</p>
            <p className="text-sm font-bold text-pastel-dark line-clamp-1">{userState.groupName}</p>
            <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
               👦 {userState.userName}
            </p>
            
            <div className="mt-3 flex gap-2">
              <Link href="/lkpd" className="flex-1 bg-pastel-dark text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 shadow-sm">
                Ke LKPD <ArrowRight size={12} />
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
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
                isActive
                  ? "bg-pastel-dark text-white shadow-sm"
                  : "text-slate-500 hover:bg-pastel-light hover:text-pastel-dark"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.6 : 2.2} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function ModulLayout({ children }: { children: React.ReactNode }) {
  return (
    <GroupProvider>
      <div className="relative flex min-h-dvh bg-pastel-light">
        <div className="sticky top-0 z-30 hidden h-dvh shrink-0 md:block">
          <SidebarContent />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 md:px-8 md:py-10 lg:px-12">
            {children}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </GroupProvider>
  );
}
