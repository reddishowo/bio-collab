"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Map, CheckCircle, Users, Bug, Dna, Sprout, Menu, X } from "lucide-react";

export default function ModulLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // Untuk menandai menu yang aktif
  
  // Daftar Materi Biologi
  const daftarMateri = [
    { id: "virus", title: "Subbab 1: Virus", icon: Bug },
    { id: "bakteri", title: "Subbab 2: Bakteri", icon: Dna },
    { id: "jamur", title: "Subbab 3: Jamur", icon: Sprout },
  ];

  return (
    <div className="flex min-h-screen bg-pastel-light relative">
      
      {/* Tombol Toggle Mobile (Muncul hanya di layar kecil) */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-pastel-dark text-white p-2 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay Background saat Sidebar terbuka di Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Daftar Isi */}
      <aside className={`
        fixed md:sticky top-0 h-screen z-50 w-64 bg-white border-r border-pastel-blue/30 shadow-xl md:shadow-sm flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-pastel-blue/20">
          <h1 className="text-2xl font-bold text-pastel-dark flex items-center gap-2">
            <Users size={24} /> BioCollab
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-700">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Daftar Isi</p>
          
          <Link 
            href="/pendahuluan" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium
              ${pathname === '/pendahuluan' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}
            `}
          >
            <BookOpen size={18} /> Pendahuluan
          </Link>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Materi Pembelajaran</p>
          
          {/* Mapping Materi Virus, Bakteri, Jamur */}
          {daftarMateri.map((materi) => {
            const Icon = materi.icon;
            const isActive = pathname === `/materi-${materi.id}`;
            return (
              <Link 
                key={materi.id} 
                href={`/materi-${materi.id}`} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                  ${isActive ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}
                `}
              >
                <Icon size={18} /> {materi.title}
              </Link>
            );
          })}

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Penutup</p>
          <Link 
            href="/evaluasi" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
              ${pathname === '/evaluasi' ? 'bg-pastel-dark text-white shadow-md' : 'hover:bg-pastel-blue/10 hover:text-pastel-dark'}
            `}
          >
            <CheckCircle size={18} /> Evaluasi
          </Link>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Padding ekstra di layar kecil agar teks tidak tertutup tombol hamburger */}
        <div className="p-8 pt-16 md:pt-12 lg:p-12 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}