import Link from "next/link";
import { BookOpenCheck, LogOut } from "lucide-react";
import { logoutTeacher } from "@/app/auth-actions"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-pastel-dark text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BookOpenCheck size={28} />
            <h1 className="text-xl font-bold tracking-wide">BioCollab <span className="font-light hidden md:inline">| Teacher Panel</span></h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-xs md:text-sm bg-white/20 px-4 py-1.5 rounded-full font-medium hidden sm:block shadow-inner">
              Mode Monitoring
            </div>
            
            <form action={logoutTeacher}>
              <button type="submit" className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5" title="Keluar">
                <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </>
  );
}