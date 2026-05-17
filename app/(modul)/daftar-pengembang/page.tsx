"use client";

import { GraduationCap, IdCard, MapPin } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const paragraphs = [
  "Nafisa Syafaqoh merupakan mahasiswi Program Studi S1 Pendidikan Biologi, Offering B, di Universitas Negeri Malang. Penulis lahir di Tulungagung pada tanggal 11 Juli 2006 dan saat ini sedang menempuh pendidikan di Fakultas Matematika dan Ilmu Pengetahuan Alam dengan Nomor Induk Mahasiswa 240341607164. Sejak menempuh pendidikan di bangku perkuliahan, penulis memiliki ketertarikan yang besar terhadap bidang biologi, khususnya dalam memahami berbagai fenomena alam dan makhluk hidup yang ada di sekitar. Ketertarikan tersebut mendorong penulis untuk terus belajar, mengembangkan wawasan, serta meningkatkan kemampuan akademik maupun keterampilan praktis yang berkaitan dengan dunia pendidikan dan ilmu pengetahuan.",
  "Selama menjalani masa perkuliahan, penulis aktif mengikuti berbagai kegiatan pembelajaran yang mendukung pengembangan diri, baik di dalam maupun di luar kelas. Penulis percaya bahwa pendidikan tidak hanya menjadi sarana untuk memperoleh ilmu, tetapi juga sebagai proses pembentukan karakter, kedisiplinan, tanggung jawab, dan kemampuan bekerja sama dengan orang lain. Dengan semangat belajar yang tinggi, penulis berharap dapat menjadi pribadi yang bermanfaat bagi lingkungan sekitar serta mampu menerapkan ilmu yang diperoleh untuk mendukung kemajuan di bidang pendidikan dan biologi.",
  "Selain fokus pada kegiatan akademik, penulis juga berusaha untuk terus mengasah kemampuan komunikasi, berpikir kritis, dan pemecahan masalah sebagai bekal dalam menghadapi tantangan di masa depan. Penulis memiliki harapan untuk dapat berkontribusi dalam dunia pendidikan, khususnya dalam meningkatkan pemahaman masyarakat mengenai pentingnya ilmu biologi dan menjaga lingkungan hidup. Melalui pengalaman dan proses pembelajaran yang dijalani selama perkuliahan, penulis berharap dapat menjadi pendidik maupun individu yang inspiratif, kreatif, serta mampu memberikan dampak positif bagi masyarakat.",
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DaftarPengembangPage() {
  return (
    <main className="relative isolate min-h-dvh transition-colors dark:text-slate-100">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="rounded-3xl border border-pastel-green/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pastel-dark dark:text-emerald-300">
              Tentang
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50 sm:text-4xl">
              Profil Pengembang
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Profil pengembang e-modul dan LKPD pembelajaran biologi materi bakteri.
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pastel-light text-pastel-dark dark:bg-slate-800 dark:text-slate-100">
            <GraduationCap size={30} />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]"
      >
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
            <img
              src="/profile.jpeg"
              alt="Foto Profil Nafisa Syafaqoh"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-slate-50">Nafisa Syafaqoh</h2>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex gap-3">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-pastel-dark dark:text-emerald-300" />
              <span>S1 Pendidikan Biologi, Offering B, Universitas Negeri Malang</span>
            </div>
            <div className="flex gap-3">
              <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-pastel-dark dark:text-emerald-300" />
              <span>NIM 240341607164</span>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-pastel-dark dark:text-emerald-300" />
              <span>Tulungagung, 11 Juli 2006</span>
            </div>
          </div>
        </aside>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="space-y-5 text-justify text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base sm:leading-8">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </motion.section>
    </main>
  );
}
