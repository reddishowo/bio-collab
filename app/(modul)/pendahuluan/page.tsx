"use client";

import { Target, Flag, Map as MapIcon, PlayCircle, AlertCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function PendahuluanPage() {
  // Definisi Variants untuk scroll reveal
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="mb-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">Pendahuluan</h1>
        <p className="text-sm leading-7 text-slate-500 sm:text-lg">Mari kenali arah dan tujuan pembelajaran kita sebelum menyelam lebih dalam.</p>
      </motion.div>

      {/* Grid Capaian & Tujuan */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="rounded-2xl border border-pastel-blue/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-pastel-dark">
            <Target className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Capaian Pembelajaran</h2>
          </div>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Siswa mampu menganalisis permasalahan biologi secara kritis dan kreatif, serta mampu berkolaborasi untuk menemukan solusi inovatif melalui pendekatan pemecahan masalah (Problem Solving) di lingkungan sekitarnya.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="rounded-2xl border border-pastel-green/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-pastel-green">
            <Flag className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Tujuan Pembelajaran</h2>
          </div>
          <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
            <li>Peserta didik mampu memahami peranan bakteri dalam kehidupan.</li>
            <li>Peserta didik mampu memahami pemanfaatan bioteknologi dalam berbagai bidang kehidupan</li>
          </ul>
        </motion.div>
      </div>

      {/* Peta Konsep */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3 text-slate-700">
          <MapIcon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
          <h2 className="text-lg font-bold sm:text-xl">Peta Konsep</h2>
        </div>
        <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-pastel-blue bg-pastel-light/50 px-4 text-center text-sm font-medium text-pastel-dark sm:h-48 sm:text-base">
          [ Area Gambar Peta Konsep Biologi ]
        </div>
      </motion.div>

      <hr className="border-pastel-blue/20" />

      {/* TAHAP 1 OE-C: MENGORIENTASI SISWA */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="rounded-3xl bg-linear-to-br from-pastel-dark to-pastel-blue p-5 text-white shadow-lg sm:p-8"
      >
        <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wide sm:text-sm">
          Tahap 1: Mengorientasi Siswa
        </div>
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Apersepsi & Fenomena</h2>
        <p className="mb-6 text-sm leading-7 text-white/90 sm:text-lg sm:leading-relaxed">
          Pernahkah Anda memperhatikan bagaimana lingkungan di sekitar kita berubah seiring waktu? 
          Mari kita lihat fenomena berikut yang memicu pertanyaan besar tentang kelangsungan ekosistem kita.
        </p>

        {/* Video / Gambar Pemantik */}
        <div className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-4 border-white/10 bg-slate-800">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all group-hover:bg-black/20">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <PlayCircle className="h-12 w-12 text-white opacity-80 transition-transform sm:h-16 sm:w-16" />
            </motion.div>
          </div>
          <p className="absolute bottom-3 px-4 text-center text-xs font-medium text-slate-400 sm:bottom-4 sm:text-sm">Klik untuk memutar video fenomena</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 flex flex-col gap-3 rounded-xl bg-white/10 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5"
        >
          <AlertCircle className="h-7 w-7 shrink-0 text-pastel-light sm:h-8 sm:w-8" />
          <p className="text-sm font-medium italic leading-7 text-white/95">
            &quot;Setelah mengamati fenomena di atas, konflik kognitif apa yang terlintas di pikiran Anda? Apakah menurut Anda alam dapat memulihkan dirinya sendiri, atau campur tangan manusia yang menjadi penyebab utamanya?&quot;
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
}
