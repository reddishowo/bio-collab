"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Map, CheckCircle, Users, Bug, Dna, Sprout, Menu, X, ArrowRight, LogOut } from "lucide-react";
import { GroupProvider, useGroupSession } from "@/components/GroupContext";

function SidebarContent({ setIsSidebarOpen }: { setIsSidebarOpen: (v: boolean) => void }) {
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
        <Link href="/pendahuluan" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/pendahuluan' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
          <BookOpen size={18} /> Pendahuluan
        </Link>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Materi Pembelajaran</p>
        {daftarMateri.map((materi) => {
          const Icon = materi.icon;
          const isActive = pathname === `/materi-${materi.id}`;
          return (
            <Link key={materi.id} href={`/materi-${materi.id}`} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
              <Icon size={18} /> {materi.title}
            </Link>
          );
        })}

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Penutup</p>
        <Link href="/evaluasi" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${pathname === '/evaluasi' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}`}>
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
              <Link href="/lkpd" onClick={() => setIsSidebarOpen(false)} className="flex-1 bg-pastel-dark text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 shadow-sm">
                Ke LKPD <ArrowRight size={12} />
              </Link>
              <button onClick={() => { logoutSession(); setIsSidebarOpen(false); }} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Keluar Kelompok">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function ModulLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <GroupProvider>
      <div className="flex min-h-screen bg-pastel-light relative">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-pastel-dark text-white p-2 rounded-lg shadow-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        <div className={`fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <SidebarContent setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-8 pt-16 md:pt-12 lg:p-12 max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </GroupProvider>
  );
}