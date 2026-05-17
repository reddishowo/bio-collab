"use client";

import type { ReactNode } from "react";
import { BookOpenCheck, Dna, FlaskConical, Microscope } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const shapeRows = [
  ["Kokus (bulat)", "Monococcus, Diplococcus, Streptococcus, Staphylococcus, Tetracoccus, Sarcina", "Streptococcus pyogenes, Staphylococcus aureus"],
  ["Basil (batang)", "Monobasil, Diplobasil, Streptobasil", "Bacillus anthracis, Escherichia coli"],
  ["Spirilum (spiral)", "Spirilum, spirochaeta, vibrio", "Vibrio cholerae, Treponema pallidum"],
];

const mainStructures = [
  ["Dinding sel", "Tersusun dari peptidoglikan; memberi bentuk dan perlindungan pada sel bakteri."],
  ["Membran plasma", "Lapisan fosfolipid bilayer yang mengatur keluar masuknya zat."],
  ["Sitoplasma", "Cairan koloid tempat berlangsungnya reaksi metabolisme sel."],
  ["Nukleoid (DNA)", "DNA sirkuler tanpa membran pembungkus sebagai materi genetik utama."],
  ["Ribosom", "Tempat sintesis protein, tersusun dari subunit 30S dan 50S."],
];

const extraStructures = [
  ["Kapsul", "Melindungi bakteri dari fagositosis dan kekeringan."],
  ["Flagel", "Alat gerak berupa cambuk."],
  ["Pilus / Fimbriae", "Alat perlekatan dan konjugasi."],
  ["Plasmid", "DNA kecil di luar kromosom; sering membawa gen resistensi antibiotik."],
  ["Endospora", "Bentuk dorman yang tahan panas, kekeringan, dan bahan kimia."],
  ["Mesosom", "Lekukan membran plasma; berperan dalam respirasi dan pembelahan sel."],
];

const transferRows = [
  ["Konjugasi", "Transfer DNA dari sel donor ke sel resipien melalui pilus seks.", "Resistensi antibiotik pada Staphylococcus"],
  ["Transformasi", "Penyerapan fragmen DNA bebas dari lingkungan.", "Streptococcus pneumoniae"],
  ["Transduksi", "Transfer DNA melalui perantara virus bakteriofag.", "Salmonella typhi"],
];

const benefitRows = [
  ["Pertanian", "Rhizobium leguminosarum", "Fiksasi nitrogen di akar tanaman legum."],
  ["Pertanian", "Azotobacter chroococcum", "Fiksasi nitrogen bebas di tanah."],
  ["Pangan", "Lactobacillus bulgaricus", "Fermentasi susu menjadi yogurt dan keju."],
  ["Pangan", "Acetobacter xylinum", "Fermentasi air nanas/kelapa menjadi nata."],
  ["Kesehatan", "Escherichia coli", "Menghasilkan vitamin K dan B12 di usus besar."],
  ["Industri", "E. coli rekayasa genetika", "Produksi insulin, hormon pertumbuhan, dan antibiotik."],
  ["Lingkungan", "Pseudomonas putida", "Bioremediasi limbah dan polutan organik."],
  ["Lingkungan", "Methanobacterium", "Menghasilkan biogas dari limbah organik."],
];

const pathogenRows = [
  ["Tuberkulosis", "Mycobacterium tuberculosis", "Udara / droplet", "Vaksin BCG, antibiotik"],
  ["Tifus", "Salmonella typhi", "Makanan/minuman terkontaminasi", "Vaksin, antibiotik"],
  ["Kolera", "Vibrio cholerae", "Air/makanan terkontaminasi", "Sanitasi, rehidrasi oral"],
  ["Diare", "Escherichia coli O157:H7", "Makanan terkontaminasi", "Sanitasi, antibiotik"],
  ["Tetanus", "Clostridium tetani", "Luka terbuka", "Vaksin TT, antibiotik"],
  ["Pneumonia", "Streptococcus pneumoniae", "Udara / droplet", "Vaksin, antibiotik"],
];

const biotechRows = [
  ["Pangan", "Yogurt, keju, kecap, nata de pina", "Lactobacillus, Acetobacter xylinum", "Fermentasi"],
  ["Pertanian", "Pupuk hayati, pestisida biologis", "Rhizobium, Azotobacter, Bacillus thuringiensis", "Fiksasi N2, produksi toksin insektisida"],
  ["Kesehatan", "Insulin, vaksin, antibiotik", "E. coli rekayasa, Streptomyces", "Rekayasa genetika, fermentasi"],
  ["Lingkungan", "Biogas, bioplastik, bioremediasi", "Methanobacterium, Pseudomonas", "Fermentasi anaerobik, degradasi polutan"],
];

const glossary = [
  ["Aerob", "Kondisi yang memerlukan oksigen untuk metabolisme."],
  ["Anaerob", "Kondisi yang tidak memerlukan oksigen."],
  ["Antibiotik", "Senyawa yang menghambat atau membunuh bakteri."],
  ["Autotrof", "Organisme yang membuat makanan sendiri dari karbon anorganik."],
  ["Bioremediasi", "Pemanfaatan organisme untuk mengurai atau mendetoksifikasi polutan."],
  ["Endospora", "Struktur dorman tahan panas, kekeringan, dan bahan kimia."],
  ["Fermentasi", "Metabolisme anaerobik yang mengubah senyawa organik menjadi produk sederhana."],
  ["Fiksasi nitrogen", "Pengubahan N2 atmosfer menjadi amonia yang dapat digunakan tumbuhan."],
  ["Konjugasi", "Transfer materi genetik melalui pilus seks."],
  ["Peptidoglikan", "Polimer penyusun dinding sel bakteri."],
  ["Plasmid", "DNA sirkuler kecil di luar kromosom utama."],
  ["Resistensi antibiotik", "Kemampuan bakteri bertahan meskipun terpapar antibiotik."],
  ["Transduksi", "Transfer DNA melalui bakteriofag."],
  ["Transformasi", "Masuknya DNA bebas dari lingkungan ke sel bakteri."],
  ["Vibrio", "Bentuk bakteri seperti koma, contohnya Vibrio cholerae."],
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900 text-white dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border border-slate-800 px-3 py-3 font-black dark:border-slate-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/70">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="border border-slate-200 px-3 py-3 align-top text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:px-8"
    >
      <p className="text-xs font-black uppercase tracking-wider text-pastel-dark dark:text-emerald-300">{kicker}</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">{title}</h2>
      <div className="mt-5 space-y-5 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">{children}</div>
    </motion.section>
  );
}

function MateriBackgroundDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute right-4 top-8 hidden rotate-6 rounded-3xl border border-pastel-green/40 bg-white/55 p-4 text-pastel-green shadow-sm dark:border-emerald-400/20 dark:bg-slate-800/70 dark:text-emerald-300 sm:block">
        <Dna className="h-12 w-12" />
      </div>
      <div className="absolute -left-4 top-56 -rotate-6 rounded-3xl border border-pastel-blue/30 bg-white/55 p-4 text-pastel-dark shadow-sm dark:border-sky-400/20 dark:bg-slate-800/70 dark:text-sky-300">
        <Microscope className="h-10 w-10" />
      </div>
      <div className="absolute bottom-10 right-8 rotate-3 rounded-2xl border border-yellow-200 bg-yellow-50/75 p-4 text-yellow-600 shadow-sm dark:border-amber-400/20 dark:bg-slate-800/70 dark:text-amber-300">
        <FlaskConical className="h-10 w-10" />
      </div>
    </div>
  );
}

export default function MateriBakteriPage() {
  const chapters = [
    ["bab-1", "Pengertian & Ciri"],
    ["bab-2", "Struktur Sel"],
    ["bab-3", "Reproduksi"],
    ["bab-4", "Metabolisme"],
    ["bab-5", "Peran Bakteri"],
    ["bab-6", "Bioteknologi"],
    ["glosarium", "Glosarium"],
  ];

  return (
    <main className="relative isolate min-h-dvh rounded-3xl bg-slate-100 p-0 transition-colors dark:bg-slate-950">
      <MateriBackgroundDecorations />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-10 rounded-3xl border border-pastel-green/30 bg-[#E7F0EA] px-5 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pastel-dark dark:text-emerald-300">Materi Pembelajaran</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
              Bakteri
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">
              Materi Biologi Kelas X SMA/MA, Kurikulum 2013. Disusun sebagai ringkasan belajar lengkap dari konsep dasar,
              struktur, reproduksi, metabolisme, peran, bioteknologi, dan glosarium.
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-pastel-dark dark:text-emerald-300">
              <BookOpenCheck className="h-5 w-5" />
              <p className="text-sm font-black text-slate-900 dark:text-slate-50">Fokus Belajar</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Pahami konsep, bandingkan contoh, lalu gunakan tabel sebagai referensi saat mengerjakan LKPD.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-0 py-6 sm:px-0 lg:grid-cols-[14rem_1fr]">
        <motion.aside
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-6"
        >
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Daftar Bab</p>
          <nav className="mt-3 grid gap-1">
            {chapters.map(([href, label]) => (
              <a key={href} href={`#${href}`} className="rounded-xl border-l-2 border-transparent px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-pastel-dark hover:bg-pastel-light hover:text-pastel-dark dark:text-slate-300 dark:hover:border-emerald-300 dark:hover:bg-slate-800 dark:hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </motion.aside>

        <div className="space-y-5">
          <Section id="bab-1" kicker="Bab 1" title="Pengertian dan Ciri-Ciri Bakteri">
            <p>
              Bakteri adalah organisme prokariotik bersel tunggal yang tidak memiliki membran inti. Bakteri dapat
              ditemukan hampir di semua lingkungan, mulai dari tanah, air, udara, tubuh manusia, hingga lingkungan ekstrem.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Prokariotik", "Uniseluler", "Dinding sel peptidoglikan", "Reproduksi pembelahan biner", "DNA sirkuler di nukleoid", "Dapat membentuk endospora"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">{item}</div>
              ))}
            </div>
            <DataTable columns={["Bentuk", "Variasi", "Contoh Spesies"]} rows={shapeRows} />
          </Section>

          <Section id="bab-2" kicker="Bab 2" title="Struktur Sel Bakteri">
            <p>Struktur bakteri dibagi menjadi struktur utama yang selalu ada dan struktur tambahan yang hanya dimiliki bakteri tertentu.</p>
            <DataTable columns={["Struktur Utama", "Fungsi"]} rows={mainStructures} />
            <DataTable columns={["Struktur Tambahan", "Fungsi"]} rows={extraStructures} />
            <div className="rounded-2xl border-l-4 border-pastel-dark bg-pastel-light p-4 dark:border-emerald-300 dark:bg-slate-800">
              <p className="font-black text-slate-900 dark:text-slate-50">Gram positif vs Gram negatif</p>
              <p className="mt-2">
                Gram positif memiliki peptidoglikan tebal dan berwarna ungu saat pewarnaan Gram. Gram negatif memiliki
                peptidoglikan tipis dengan membran luar lipopolisakarida dan tampak merah muda.
              </p>
            </div>
          </Section>

          <Section id="bab-3" kicker="Bab 3" title="Reproduksi Bakteri">
            <p>
              Bakteri bereproduksi utama secara aseksual melalui pembelahan biner. Dalam kondisi ideal, satu sel dapat
              membelah setiap 20 menit sehingga populasinya meningkat sangat cepat.
            </p>
            <DataTable columns={["Mekanisme Transfer Gen", "Cara Kerja", "Contoh"]} rows={transferRows} />
            <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 dark:border-red-400 dark:bg-red-950/40">
              <p className="font-black text-red-700 dark:text-red-200">Kaitan dengan resistensi antibiotik</p>
              <p className="mt-2 text-red-700 dark:text-red-100">
                Transfer gen, terutama konjugasi melalui plasmid, dapat menyebarkan gen resistensi antibiotik. Karena itu,
                penggunaan antibiotik sembarangan sangat berbahaya.
              </p>
            </div>
          </Section>

          <Section id="bab-4" kicker="Bab 4" title="Metabolisme Bakteri">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <h3 className="font-black text-slate-900 dark:text-slate-50">Berdasarkan sumber energi</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Fotoautotrof: energi dari cahaya, karbon dari CO2. Contoh: Cyanobacteria.</li>
                  <li>Kemoautotrof: energi dari oksidasi senyawa anorganik. Contoh: Nitrosomonas.</li>
                  <li>Fotoheterotrof dan kemoheterotrof memanfaatkan senyawa organik sebagai sumber karbon.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <h3 className="font-black text-slate-900 dark:text-slate-50">Berdasarkan kebutuhan oksigen</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Aerob obligat: membutuhkan oksigen.</li>
                  <li>Anaerob obligat: tidak dapat hidup dengan oksigen.</li>
                  <li>Anaerob fakultatif: dapat hidup dengan atau tanpa oksigen.</li>
                  <li>Mikroaerofilik: membutuhkan oksigen kadar rendah.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="bab-5" kicker="Bab 5" title="Peran Bakteri dalam Kehidupan">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">Bakteri Menguntungkan</h3>
            <DataTable columns={["Bidang", "Nama Bakteri", "Peran"]} rows={benefitRows} />
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">Bakteri Merugikan</h3>
            <DataTable columns={["Penyakit", "Bakteri Penyebab", "Cara Penularan", "Pencegahan"]} rows={pathogenRows} />
          </Section>

          <Section id="bab-6" kicker="Bab 6" title="Bioteknologi Berbasis Bakteri">
            <p>
              Bioteknologi adalah pemanfaatan organisme hidup atau bagian-bagiannya untuk menghasilkan produk atau jasa
              yang bermanfaat. Bakteri sering digunakan karena mudah dimanipulasi, cepat berkembang biak, dan mampu
              menghasilkan berbagai senyawa penting.
            </p>
            <DataTable columns={["Bidang", "Produk", "Bakteri", "Mekanisme"]} rows={biotechRows} />
            <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:border-amber-300 dark:bg-amber-950/30">
              <p className="font-black text-slate-900 dark:text-slate-50">Fermentasi Nata de Pina</p>
              <p className="mt-2">
                Nata de pina dibuat dari fermentasi sari nanas oleh Acetobacter xylinum. Bakteri ini mengubah gula dalam
                sari nanas menjadi selulosa ekstraseluler yang membentuk lapisan kenyal.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Kadar gula optimal 5-10%.</li>
                <li>pH asam sekitar 3-4.</li>
                <li>Suhu inkubasi optimal 28-30 derajat C.</li>
                <li>Starter sekitar 10% dari volume media.</li>
                <li>Kebersihan alat mencegah kontaminasi.</li>
              </ul>
            </div>
          </Section>

          <Section id="glosarium" kicker="Referensi" title="Glosarium">
            <div className="grid gap-3 md:grid-cols-2">
              {glossary.map(([term, definition]) => (
                <div key={term} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="font-black text-slate-900 dark:text-slate-50">{term}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{definition}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
