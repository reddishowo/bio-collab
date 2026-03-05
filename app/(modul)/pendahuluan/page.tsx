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
    <div className="space-y-10">
      
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Pendahuluan</h1>
        <p className="text-slate-500 text-lg">Mari kenali arah dan tujuan pembelajaran kita sebelum menyelam lebih dalam.</p>
      </motion.div>

      {/* Grid Capaian & Tujuan */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-6 rounded-2xl shadow-sm border border-pastel-blue/20 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4 text-pastel-dark">
            <Target size={28} />
            <h2 className="text-xl font-bold">Capaian Pembelajaran</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Siswa mampu menganalisis permasalahan biologi secara kritis dan kreatif, serta mampu berkolaborasi untuk menemukan solusi inovatif melalui pendekatan pemecahan masalah (Problem Solving) di lingkungan sekitarnya.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-6 rounded-2xl shadow-sm border border-pastel-green/30 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4 text-pastel-green">
            <Flag size={28} />
            <h2 className="text-xl font-bold">Tujuan Pembelajaran</h2>
          </div>
          <ul className="text-slate-600 leading-relaxed list-disc list-inside space-y-2">
            <li>Peserta didik mampu memahami peranan bakteri dalam kehidupan.</li>
            <li>Peserta didik mampu memahami pemanfaatan bioteknologi dalam berbagai bidang kehidupan</li>
          </ul>
        </motion.div>
      </div>

      {/* Peta Konsep */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-4 text-slate-700">
          <MapIcon size={28} />
          <h2 className="text-xl font-bold">Peta Konsep</h2>
        </div>
        <div className="bg-pastel-light/50 w-full h-48 rounded-xl border border-dashed border-pastel-blue flex items-center justify-center text-pastel-dark font-medium">
          [ Area Gambar Peta Konsep Biologi ]
        </div>
      </motion.div>

      <hr className="border-pastel-blue/20" />

      {/* TAHAP 1 OE-C: MENGORIENTASI SISWA */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="bg-linear-to-br from-pastel-dark to-pastel-blue p-8 rounded-3xl shadow-lg text-white"
      >
        <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-4">
          Tahap 1: Mengorientasi Siswa
        </div>
        <h2 className="text-3xl font-bold mb-4">Apersepsi & Fenomena</h2>
        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          Pernahkah Anda memperhatikan bagaimana lingkungan di sekitar kita berubah seiring waktu? 
          Mari kita lihat fenomena berikut yang memicu pertanyaan besar tentang kelangsungan ekosistem kita.
        </p>

        {/* Video / Gambar Pemantik */}
        <div className="relative w-full aspect-video bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer border-4 border-white/10">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <PlayCircle size={64} className="text-white opacity-80 transition-transform" />
            </motion.div>
          </div>
          <p className="text-slate-400 absolute bottom-4 text-sm font-medium">Klik untuk memutar video fenomena</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 flex gap-4 items-start bg-white/10 p-5 rounded-xl"
        >
          <AlertCircle size={32} className="shrink-0 text-pastel-light" />
          <p className="text-sm font-medium italic leading-relaxed text-white/95">
            "Setelah mengamati fenomena di atas, konflik kognitif apa yang terlintas di pikiran Anda? Apakah menurut Anda alam dapat memulihkan dirinya sendiri, atau campur tangan manusia yang menjadi penyebab utamanya?"
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
}