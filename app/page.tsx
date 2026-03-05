import Link from "next/link";
import { getAllGroups } from "@/app/actions";
import { Users, LayoutDashboard, ArrowRight, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic"; // Memastikan data selalu up-to-date saat direfresh

export default async function DashboardHome() {
  const groups = await getAllGroups();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <LayoutDashboard className="text-pastel-dark" size={32} />
          Dashboard Monitoring Kelas
        </h2>
        <p className="text-slate-600 mt-2">Pantau aktivitas, LKPD, dan evaluasi dari semua kelompok belajar.</p>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-dashed border-pastel-blue text-center shadow-sm">
          <Users size={48} className="mx-auto text-pastel-blue mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Belum ada kelompok</h3>
          <p className="text-slate-500">Siswa belum membuat kelompok di aplikasi BioCollab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-pastel-dark"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{group.groupName}</h3>
                  <p className="font-mono text-xs font-bold text-pastel-dark bg-pastel-light px-2 py-1 rounded inline-block mt-1 border border-pastel-blue/30">
                    KODE: {group.groupCode}
                  </p>
                </div>
                <div className="bg-pastel-green/20 text-pastel-dark flex items-center justify-center w-10 h-10 rounded-full font-bold">
                  {group.members.length}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Users size={16} className="text-slate-400" /> 
                  <span className="truncate">{group.members.join(", ")}</span>
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <CalendarDays size={16} />
                  {group.createdAt ? new Date(group.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>

              <Link href={`/group/${group.groupCode}`}>
                <button className="w-full bg-slate-50 text-pastel-dark font-bold py-3 rounded-xl hover:bg-pastel-dark hover:text-white transition-colors flex items-center justify-center gap-2 border border-slate-200 group-hover:border-pastel-dark">
                  Lihat Detail Aktivitas <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}