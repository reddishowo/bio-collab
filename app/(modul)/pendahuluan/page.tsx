"use client";

import { Beaker, BookOpenCheck, ClipboardList, Dna, Flag, Info, Microscope, Sprout, Target } from "lucide-react";
import { motion, Variants } from "framer-motion";

function LearningBackgroundDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute right-0 top-2 hidden rotate-6 rounded-3xl border border-pastel-blue/30 bg-white/45 p-5 text-pastel-dark shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-sky-200 sm:block">
        <Dna className="h-14 w-14" />
      </div>
      <div className="absolute -left-3 top-44 -rotate-6 rounded-3xl border border-pastel-green/40 bg-white/50 p-4 text-pastel-green shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-emerald-200">
        <Microscope className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="absolute -right-4 top-[32rem] rotate-12 rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4 text-yellow-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-amber-200 sm:right-4">
        <Beaker className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="absolute left-2 top-[55rem] rotate-3 rounded-2xl border border-pastel-green/40 bg-white/50 p-4 text-pastel-green shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-emerald-200 sm:left-8">
        <Sprout className="h-9 w-9 sm:h-12 sm:w-12" />
      </div>
      <div className="absolute bottom-16 right-3 -rotate-6 rounded-3xl border border-pastel-blue/30 bg-white/45 p-4 text-pastel-dark shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-sky-200 sm:right-10">
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
    <div className="relative isolate transition-colors dark:text-slate-100">
      <LearningBackgroundDecorations />
      <div className="relative z-10 space-y-6 sm:space-y-8 md:space-y-10">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-50 sm:text-4xl">Pendahuluan</h1>
          <p className="text-sm leading-7 text-slate-500 dark:text-slate-300 sm:text-lg">Mari kenali arah dan tujuan pembelajaran kita sebelum menyelam lebih dalam.</p>
        </motion.div>
        {/* Kata Pengantar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-2xl border border-pastel-blue/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <BookOpenCheck className="h-6 w-6 shrink-0 text-pastel-dark sm:h-7 sm:w-7" />
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 sm:text-3xl">Kata Pengantar</h1>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-200 sm:text-base sm:leading-8">
            <p>
              Puji syukur ke hadirat Allah SWT atas segala rahmat, nikmat, dan karunia-Nya sehingga penyusunan Lembar
              Kerja Peserta Didik (LKPD) materi bakteri ini dapat diselesaikan dengan baik. LKPD ini disusun sebagai
              salah satu bahan pembelajaran untuk membantu peserta didik memahami konsep bakteri serta peranannya dalam
              kehidupan sehari-hari melalui kegiatan pembelajaran yang aktif, kolaboratif, dan bermakna.
            </p>
            <p>
              LKPD ini memuat empat kegiatan pembelajaran, yaitu peran bakteri dalam kehidupan, percobaan uji pembusukan
              makanan, bioteknologi dan pemanfaatan bakteri, serta percobaan fermentasi nata de nanas. Kegiatan
              pembelajaran disusun menggunakan pendekatan open-ended sehingga peserta didik diharapkan mampu
              mengembangkan kemampuan literasi sains dalam menyelesaikan permasalahan yang berkaitan dengan kehidupan
              nyata.
            </p>
            <p>
              Melalui LKPD ini, peserta didik tidak hanya diharapkan memahami materi secara teoritis, tetapi juga mampu
              membangun argumen ilmiah berdasarkan hasil pengamatan, diskusi, dan percobaan yang dilakukan bersama
              kelompok. Selain itu, LKPD ini diharapkan dapat membantu guru dalam menciptakan proses pembelajaran yang
              lebih interaktif dan menyenangkan.
            </p>
            <p>
              Penulis menyadari bahwa LKPD ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang
              membangun sangat diharapkan demi perbaikan dan penyempurnaan LKPD ini di masa mendatang.
            </p>
            <p>Semoga LKPD ini dapat memberikan manfaat bagi proses pembelajaran biologi, khususnya pada materi bakteri.</p>
          </div>
        </motion.div>

        {/* Capaian & Tujuan */}
        <div className="space-y-4 md:space-y-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="rounded-2xl border border-pastel-blue/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3 text-pastel-dark">
              <Target className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              <h2 className="text-lg font-bold dark:text-slate-100 sm:text-xl">Capaian Pembelajaran</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-200 sm:text-base">
              Menerapkan prinsip klasifikasi dan strategi pelestarian keanekaragaman hayati; mendeskripsikan
              peranan virus, bakteri, dan jamur dalam kehidupan; menganalisis interaksi antar komponen
              ekosistem dan pengaruhnya terhadap keseimbangan ekosistem; menggunakan sistem pengukuran
              dalam kerja ilmiah.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="rounded-2xl border border-pastel-green/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3 text-pastel-green">
              <Flag className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              <h2 className="text-lg font-bold dark:text-slate-100 sm:text-xl">Tujuan Pembelajaran</h2>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600 dark:text-slate-200 sm:text-base">
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
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <ClipboardList className="h-6 w-6 shrink-0 text-pastel-dark sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Petunjuk Penggunaan</h2>
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600 dark:text-slate-200 sm:text-base">
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
          className="rounded-3xl bg-linear-to-br from-pastel-dark to-pastel-blue p-5 text-white shadow-lg dark:from-slate-800 dark:to-slate-700 sm:p-8"
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
          className="rounded-2xl border border-pastel-green/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <Info className="h-6 w-6 shrink-0 text-pastel-green sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Informasi Penting</h2>
          </div>
          <p className="mb-4 text-sm leading-7 text-slate-600 dark:text-slate-200 sm:text-base">
            Sebelum memulai kegiatan pembelajaran, bacalah informasi penting berikut ini dengan saksama. Dapat diketahui
            bahwa kegiatan pembelajaran ini menggunakan model Open-Ended Collaborative Learning (OE-C) dengan materi pokok
            Bakteri. Proses pembelajaran didukung oleh website e-modul sebagai media utama, dan dilaksanakan melalui
            bentuk kegiatan berupa diskusi kelompok dan percobaan yang dirancang untuk mendorong kalian berpikir kritis,
            berkolaborasi, dan menemukan solusi secara mandiri.
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full table-fixed border-collapse text-left text-sm leading-7 sm:text-base">
              <colgroup>
                <col className="w-[42%] sm:w-1/3" />
                <col className="w-[58%] sm:w-2/3" />
              </colgroup>
              <thead className="bg-pastel-green text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-extrabold">Komponen</th>
                  <th scope="col" className="px-4 py-3 font-extrabold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white align-top dark:bg-slate-900">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Mata Pelajaran</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">Biologi</td>
                </tr>
                <tr className="bg-slate-50/70 align-top dark:bg-slate-800">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Model Pembelajaran</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">Open-Ended Collaborative Learning (OE-C)</td>
                </tr>
                <tr className="bg-white align-top dark:bg-slate-900">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Materi Pembelajaran</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">Bakteri</td>
                </tr>
                <tr className="bg-slate-50/70 align-top dark:bg-slate-800">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Media Pembelajaran</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">Website e-modul</td>
                </tr>
                <tr className="bg-white align-top dark:bg-slate-900">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Bentuk Kegiatan</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">Diskusi Kelompok &amp; Percobaan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Indikator Abad 21 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="rounded-2xl border border-pastel-blue/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <ClipboardList className="h-6 w-6 shrink-0 text-pastel-dark sm:h-7 sm:w-7" />
            <h2 className="text-lg font-bold sm:text-xl">Indikator Abad 21</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-[720px] border-collapse text-left text-sm leading-7 sm:text-base">
              <thead className="bg-pastel-dark text-white">
                <tr>
                  <th className="w-1/3 px-4 py-3 font-extrabold">Indikator Abad 21</th>
                  <th className="px-4 py-3 font-extrabold">Deskriptor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white align-top dark:bg-slate-900">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">Menjelaskan Fenomena Secara Ilmiah</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">
                    Siswa dapat menjelaskan fenomena terkait peran bakteri dalam kehidupan sehari-hari, baik yang
                    menguntungkan maupun merugikan, menggunakan konsep biologi yang sesuai dan disertai alasan yang
                    masuk akal.
                  </td>
                </tr>
                <tr className="bg-slate-50/70 align-top dark:bg-slate-800">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">
                    Merancang dan Mengevaluasi Desain untuk Penyelidikan Ilmiah serta Menafsirkan Data dan Bukti
                    Ilmiah secara Kritis
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">
                    Siswa dapat menyusun rancangan percobaan sederhana (uji pembusukan makanan atau fermentasi nata de
                    nanas), melaksanakannya, mencatat hasilnya, lalu mengolah dan menyimpulkan data yang diperoleh
                    berdasarkan bukti yang ada.
                  </td>
                </tr>
                <tr className="bg-white align-top dark:bg-slate-900">
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-100">
                    Meneliti, mengevaluasi, dan menggunakan informasi ilmiah untuk pengambilan keputusan dan tindakan
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">
                    Siswa dapat mencari informasi ilmiah tentang bioteknologi dan manfaat bakteri, menilai
                    kebenarannya, lalu menggunakannya sebagai dasar dalam mengambil keputusan atau merancang solusi yang
                    realistis dan bertanggung jawab.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Sumber : (PISA, 2025 : 21).</p>
        </motion.div>

      </div>
    </div>
  );
}
