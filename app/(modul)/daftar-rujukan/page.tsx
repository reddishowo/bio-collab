"use client";

import { BookMarked } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const references = [
  "Campbell, N. A., Reece, J. B., & Mitchell, L. G. (2010). Biologi (Jilid 2, Edisi 8). Erlangga.",
  "Dwijoseputro, D. (2005). Dasar-dasar mikrobiologi. Djambatan.",
  "Hadioetomo, R. S. (2013). Mikrobiologi dasar dalam praktek: Teknik dan prosedur dasar laboratorium. Gramedia Pustaka Utama.",
  "Irianto, K. (2013). Mikrobiologi medis. Alfabeta.",
  "Jawetz, E., Melnick, J. L., & Adelberg, E. A. (2014). Mikrobiologi kedokteran (Edisi 27). EGC.",
  "Kementerian Pendidikan dan Kebudayaan. (2016). Biologi untuk SMA/MA kelas X. Pusat Kurikulum dan Perbukuan Balitbang Kemdikbud.",
  "Pelczar, M. J., & Chan, E. C. S. (2008). Dasar-dasar mikrobiologi (Jilid 1). UI Press.",
  "Pratiwi, D. A., Maryati, S., Srikini, Suharno, & Bambang. (2014). Biologi untuk SMA/MA kelas X. Erlangga.",
  "Purves, W. K., Sadava, D., Orians, G. H., & Heller, H. C. (2004). Biologi (Edisi 7). Erlangga.",
  "Subandi. (2014). Mikrobiologi: Kajian dalam perspektif Islam (Edisi 2). Remaja Rosdakarya.",
  "Suryati, S., & Budiwati, N. (2019). Pemanfaatan bakteri Acetobacter xylinum dalam pembuatan nata de pina berbahan dasar sari nanas. Jurnal Biologi dan Pembelajaran Biologi, 4(1), 45-52.",
  "Waluyo, L. (2016). Mikrobiologi umum. UMM Press.",
  "Waluyo, L. (2019). Mikrobiologi lingkungan. UMM Press.",
  "Widodo, W. (2017). Ilmu pengetahuan alam (Kelas VII). Pusat Kurikulum dan Perbukuan Balitbang Kemdikbud.",
  "Yuwono, T. (2012). Bioteknologi pertanian. Gadjah Mada University Press.",
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DaftarRujukanPage() {
  return (
    <main className="relative isolate min-h-dvh transition-colors dark:text-slate-100">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="rounded-3xl border border-pastel-blue/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pastel-dark dark:text-sky-300">
              Tentang
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50 sm:text-4xl">
              Daftar Rujukan
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Sumber pustaka yang digunakan sebagai acuan penyusunan materi, LKPD, dan aktivitas pembelajaran.
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pastel-light text-pastel-dark dark:bg-slate-800 dark:text-slate-100">
            <BookMarked size={28} />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        <ol className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
          {references.map((reference, index) => (
            <li key={reference} className="grid grid-cols-[2.25rem_1fr] gap-2">
              <span className="font-black text-pastel-dark dark:text-sky-300">{index + 1}.</span>
              <span>{reference}</span>
            </li>
          ))}
        </ol>
      </motion.section>
    </main>
  );
}
