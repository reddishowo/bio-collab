"use client";

import { Beaker, BookOpenCheck, ClipboardList, Dna, Flag, Info, Microscope, Sprout, Target } from "lucide-react";
import { motion, Variants } from "framer-motion";

function LearningBackgroundDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute right-0 top-2 hidden rotate-6 rounded-3xl border border-pastel-blue/30 bg-white/45 p-5 text-pastel-dark shadow-sm sm:block">
        <Dna className="h-14 w-14" />
      </div>
      <div className="absolute -left-3 top-44 -rotate-6 rounded-3xl border border-pastel-green/40 bg-white/50 p-4 text-pastel-green shadow-sm">
        <Microscope className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="absolute -right-4 top-[32rem] rotate-12 rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4 text-yellow-500 shadow-sm sm:right-4">
        <Beaker className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="absolute left-2 top-[55rem] rotate-3 rounded-2xl border border-pastel-green/40 bg-white/50 p-4 text-pastel-green shadow-sm sm:left-8">
        <Sprout className="h-9 w-9 sm:h-12 sm:w-12" />
      </div>
      <div className="absolute bottom-16 right-3 -rotate-6 rounded-3xl border border-pastel-blue/30 bg-white/45 p-4 text-pastel-dark shadow-sm sm:right-10">
        <BookOpenCheck className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>

      <div className="absolute left-16 top-20 h-10 w-24 rotate-[-8deg] rounded-full border border-pastel-blue/20 bg-white/35" />
      <div className="absolute right-20 top-[44rem] h-8 w-20 rotate-12 rounded-full border border-pastel-green/30 bg-white/35" />
      <div className="absolute bottom-6 left-8 h-8 w-28 rotate-3 rounded-full border border-yellow-200 bg-yellow-50/50" />
    </div>
  );
}

export default function PendahuluanPage() {
  // Definisi Variants untuk scroll reveal
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative isolate">
      <LearningBackgroundDecorations />
      <div className="relative z-10 space-y-6 sm:space-y-8 md:space-y-10">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="mb-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">Pendahuluan</h1>
        <p className="text-sm leading-7 text-slate-500 sm:text-lg">Mari kenali arah dan tujuan pembelajaran kita sebelum menyelam lebih dalam.</p>
      </motion.div>

      {/* Capaian & Tujuan */}
      <div className="space-y-4 md:space-y-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="rounded-2xl border border-pastel-blue/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-pastel-dark">
            <Target className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Capaian Pembelajaran</h2>
          </div>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Menerapkan prinsip klasifikasi dan strategi pelestarian keanekaragaman hayati; mendeskripsikan
            peranan virus, bakteri, dan jamur dalam kehidupan; menganalisis interaksi antar komponen
            ekosistem dan pengaruhnya terhadap keseimbangan ekosistem; menggunakan sistem pengukuran
            dalam kerja ilmiah.
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
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600 sm:text-base">
            <li>Peserta didik mampu memahami peranan bakteri dalam kehidupan.</li>
            <li>Peserta didik mampu melakukan percobaan/uji pembusukan makanan untuk memahami peranan bakteri merugikan.</li>
            <li>Peserta didik mampu memahami pemanfaatan bioteknologi dalam berbagai bidang kehidupan.</li>
            <li>Peserta didik mampu melakukan percobaan sederhana bioteknologi (contoh: fermentasi nata de nanas).</li>
          </ol>
        </motion.div>
      </div>

      {/* Petunjuk Penggunaan */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3 text-slate-700">
          <ClipboardList className="h-6 w-6 shrink-0 text-pastel-dark sm:h-7 sm:w-7" />
          <h2 className="text-lg font-bold sm:text-xl">Petunjuk Penggunaan</h2>
        </div>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600 sm:text-base">
          <li>Berdoalah sebelum mengerjakan LKPD.</li>
          <li>Bacalah dan pelajari LKPD secara berurutan sesuai dengan aktivitas pembelajaran dengan menuliskan jawaban pada kolom yang sudah disediakan.</li>
          <li>Bacalah petunjuk dan perintah yang ada pada setiap aktivitas secara teliti sebelum mengerjakannya.</li>
          <li>Lakukan aktivitas sesuai dengan petunjuk dan perintah yang ada.</li>
          <li>Kerjakan LKPD secara individu dan berkelompok sesuai instruksi.</li>
          <li>Apabila terdapat hal yang kurang jelas, silahkan bertanya pada Guru.</li>
          <li>Kumpulkan LKPD tepat waktu.</li>
          <li>Selamat mengerjakan.</li>
        </ol>
      </motion.div>

      <hr className="border-pastel-blue/20" />

      {/* Pengantar */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="rounded-3xl bg-linear-to-br from-pastel-dark to-pastel-blue p-5 text-white shadow-lg sm:p-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <BookOpenCheck className="h-7 w-7 shrink-0 text-pastel-light sm:h-8 sm:w-8" />
          <h2 className="text-2xl font-bold sm:text-3xl">Pengantar</h2>
        </div>
        <p className="text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
          Bakteri merupakan organisme prokariotik bersel tunggal yang ditemukan hampir di semua lingkungan
          di bumi. Mereka memiliki struktur unik yang memungkinkan adaptasi luar biasa dari tanah subur
          hingga sumber air panas bersuhu ekstrem. Bakteri bereproduksi dengan sangat cepat dan dapat
          bertukar materi genetik, yang menjadi dasar resistensi antibiotik.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
          Melalui LKPD ini, kalian akan menjelajahi empat aspek utama biologi bakteri:
        </p>
        <ul className="mt-4 space-y-2 rounded-2xl bg-white/10 p-4 text-sm leading-7 text-white/95 sm:text-base">
          <li><strong>Pertemuan 1</strong> — Peran bakteri dalam kehidupan (menguntungkan & merugikan)</li>
          <li><strong>Pertemuan 2</strong> — Percobaan uji pembusukan makanan</li>
          <li><strong>Pertemuan 3</strong> — Bioteknologi dan pemanfaatan bakteri</li>
          <li><strong>Pertemuan 4</strong> — Percobaan fermentasi nata de nanas.</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
          Kalian akan bekerja dalam tim kolaborasi dengan pendekatan masalah open-ended — tidak ada satu
          jawaban benar, yang dinilai adalah kualitas argumen dan bukti ilmiah yang kalian bangun bersama.
        </p>
      </motion.div>

      {/* Informasi Penting */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="rounded-2xl border border-pastel-green/30 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3 text-slate-700">
          <Info className="h-6 w-6 shrink-0 text-pastel-green sm:h-7 sm:w-7" />
          <h2 className="text-lg font-bold sm:text-xl">Informasi Penting</h2>
        </div>
        <dl className="grid gap-3 text-sm leading-7 sm:text-base md:grid-cols-[13rem_1fr]">
          <dt className="font-bold text-slate-700">Mata Pelajaran</dt>
          <dd className="text-slate-600">Biologi</dd>
          <dt className="font-bold text-slate-700">Kelas / Semester</dt>
          <dd className="text-slate-600">X / Gasal</dd>
          <dt className="font-bold text-slate-700">Kurikulum</dt>
          <dd className="text-slate-600">Kurikulum 2013</dd>
          <dt className="font-bold text-slate-700">Model Pembelajaran</dt>
          <dd className="text-slate-600">Open-Ended Collaborative Learning (6 Sintaks)</dd>
          <dt className="font-bold text-slate-700">Jumlah Pertemuan</dt>
          <dd className="text-slate-600">4 Pertemuan (2 x 45 menit)</dd>
          <dt className="font-bold text-slate-700">Kompetensi Dasar</dt>
          <dd className="text-slate-600">3.5 — Mengidentifikasi struktur, cara hidup, reproduksi, dan peran bakteri</dd>
        </dl>
      </motion.div>

      </div>
    </div>
  );
}
