"use client";

import Link from "next/link";
import { Users, LayoutDashboard, ArrowRight, CalendarDays, BookOpen, ClipboardCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function DashboardClient({ groups }: { groups: any[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-pastel-dark rounded-2xl flex items-center justify-center shadow-md">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              Dashboard Monitoring
            </h2>
          </div>
          <p className="text-slate-500 ml-13">
            Pantau aktivitas, LKPD, dan evaluasi dari semua kelompok belajar.
          </p>
        </div>

        {groups.length > 0 && (
          <div className="ml-13 sm:ml-0 bg-pastel-dark/10 border border-pastel-blue/40 text-pastel-dark font-semibold text-sm px-4 py-2 rounded-full">
            {groups.length} Kelompok Aktif
          </div>
        )}
      </motion.div>

      {/* Konten */}
      {groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-3xl border-2 border-dashed border-pastel-blue/50 text-center shadow-sm"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
            <Users size={52} className="mx-auto text-pastel-blue mb-5" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada kelompok</h3>
          <p className="text-slate-400 text-sm">Siswa belum membuat kelompok di aplikasi BioCollab.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {groups.map((group) => {
            const hasLkpd = group.lkpd && group.lkpd.bakteri;
            const hasEval = !!group.evaluasiTim;

            return (
              <motion.div
                variants={item}
                key={group._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Accent bar top */}
                <div className="h-1.5 w-full bg-linear-to-r from-pastel-dark to-pastel-blue shrink-0" />

                <div className="p-6 flex flex-col flex-1 gap-5">
                  {/* Nama & Kode */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-extrabold text-slate-800 line-clamp-1 leading-snug">
                        {group.groupName}
                      </h3>
                      <span className="inline-block font-mono text-[11px] font-bold text-pastel-dark bg-pastel-light px-2.5 py-0.5 rounded-md mt-1.5 border border-pastel-blue/30 tracking-wide">
                        {group.groupCode}
                      </span>
                    </div>
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-pastel-dark/10 flex items-center justify-center">
                      <span className="text-lg font-extrabold text-pastel-dark">{group.members.length}</span>
                    </div>
                  </div>

                  {/* Anggota & Tanggal */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Users size={15} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-snug">{group.members.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={13} className="shrink-0" />
                      {group.createdAt
                        ? new Date(group.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${hasLkpd ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      <BookOpen size={11} />
                      LKPD {hasLkpd ? "Terisi" : "Kosong"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${hasEval ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      <ClipboardCheck size={11} />
                      Evaluasi {hasEval ? "Ada" : "Belum"}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/group/${group.groupCode}`} className="mt-auto">
                    <button className="w-full bg-pastel-light text-pastel-dark font-bold py-3 rounded-2xl hover:bg-pastel-dark hover:text-white transition-all duration-200 flex items-center justify-center gap-2 border border-pastel-blue/40 group-hover:border-pastel-dark text-sm">
                      Lihat Detail Aktivitas
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}