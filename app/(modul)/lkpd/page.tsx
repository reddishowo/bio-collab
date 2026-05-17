"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Dna,
  Loader2,
  LogOut,
  Save,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  createGroup,
  getGroupData,
  joinGroup,
  saveLKPD,
  type GroupData,
  type LKPDItem,
} from "@/app/actions";
import { useGroupSession } from "@/components/GroupContext";
import { isLkpdDemoModeEnabled } from "@/lib/lkpdDemo";

type Topic = "bakteri";
type MeetingId = "p1" | "p2" | "p3" | "p4";
type AnswerMap = Record<string, string>;
type ExtendedLKPDItem = LKPDItem & { answers?: AnswerMap };

const meetings: Array<{
  id: MeetingId;
  number: string;
  label: string;
  title: string;
  subtitle: string;
}> = [
  {
    id: "p1",
    number: "01",
    label: "Peran Bakteri",
    title: "Peran Bakteri dalam Kehidupan",
    subtitle: "Menguntungkan, merugikan, dan solusi berbasis bakteri",
  },
  {
    id: "p2",
    number: "02",
    label: "Pembusukan",
    title: "Uji Pembusukan Makanan",
    subtitle: "Merancang percobaan pembusukan makanan",
  },
  {
    id: "p3",
    number: "03",
    label: "Bioteknologi",
    title: "Bioteknologi dan Pemanfaatan Bakteri",
    subtitle: "Produk, mekanisme, keunggulan, dan risiko",
  },
  {
    id: "p4",
    number: "04",
    label: "Nata de Nanas",
    title: "Percobaan Fermentasi Nata de Nanas",
    subtitle: "Faktor fermentasi dan pengamatan hasil",
  },
];

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function getMeetingId(value: string | null): MeetingId {
  return value === "p1" || value === "p2" || value === "p3" || value === "p4" ? value : "p1";
}

function seedAnswers(data?: ExtendedLKPDItem): AnswerMap {
  if (data?.answers) return data.answers;

  return {
    "p1-roles-summary": data?.tugas ?? "",
    "p1-team-result": data?.iluminasi ?? "",
    "p1-reflection-new": data?.verifikasi ?? "",
    "p1-hypothesis": data?.inkubasi ?? "",
  };
}

type WorksheetTheme = {
  outer: string;
  border: string;
  header: string;
  phase: string;
  accent: string;
};

const worksheetThemes: Record<MeetingId, WorksheetTheme> = {
  p1: {
    outer: "bg-[#FFF8B8] dark:bg-[#6F6424]",
    border: "border-[#24395B]",
    header: "border-[#24395B] text-[#101827] dark:border-slate-100 dark:text-slate-50",
    phase: "border-[#24395B] text-[#9E2F2F] dark:border-amber-200 dark:text-amber-100",
    accent: "text-[#E53935]",
  },
  p2: {
    outer: "bg-[#D3DC92] dark:bg-[#58652E]",
    border: "border-[#24395B]",
    header: "border-[#24395B] text-[#101827] dark:border-slate-100 dark:text-slate-50",
    phase: "border-[#24395B] text-[#9E2F2F] dark:border-lime-200 dark:text-lime-100",
    accent: "text-[#E53935]",
  },
  p3: {
    outer: "bg-[#D9F0D3] dark:bg-[#315F38]",
    border: "border-[#7B2E35]",
    header: "border-[#7B2E35] text-[#7B2E35] dark:border-emerald-100 dark:text-emerald-50",
    phase: "border-[#7B2E35] text-[#7B2E35] dark:border-emerald-200 dark:text-emerald-100",
    accent: "text-[#E53935]",
  },
  p4: {
    outer: "bg-[#C7E5F7] dark:bg-[#295C78]",
    border: "border-[#7B2E35]",
    header: "border-[#7B2E35] text-[#7B2E35] dark:border-sky-100 dark:text-sky-50",
    phase: "border-[#7B2E35] text-[#7B2E35] dark:border-sky-200 dark:text-sky-100",
    accent: "text-[#E53935]",
  },
};

const meetingMeta: Record<MeetingId, {
  coverTitle: string;
  headerTitle: string;
  intro: string[];
  objective: string;
  source: string;
}> = {
  p1: {
    coverTitle: "Struktur & Ciri-Ciri Bakteri",
    headerTitle: "STRUKTUR & CIRI CIRI BAKTERI",
    intro: [
      "Puji syukur ke hadirat Allah SWT atas segala nikmat dan kemudahan yang diberikan sehingga Lembar Kerja Peserta Didik (LKPD) Pertemuan 1 ini dapat tersusun dengan baik.",
      "LKPD Pertemuan 1 ini dirancang untuk membantu kalian memahami peran bakteri dalam kehidupan sehari-hari, baik yang menguntungkan maupun merugikan.",
      "Melalui kegiatan diskusi dan eksplorasi masalah open-ended, kalian diajak untuk mengembangkan literasi sains dalam menganalisis fenomena nyata di sekitar kalian mulai dari bakteri yang menyelamatkan jiwa melalui produksi insulin, hingga bakteri yang menjadi penyebab wabah penyakit.",
      "Kalian akan bekerja bersama tim kolaborasi yang kalian bentuk sendiri berdasarkan minat dan fokus investigasi. Tidak ada satu jawaban yang paling benar; yang dinilai adalah kualitas argumen dan bukti ilmiah yang kalian bangun bersama.",
    ],
    objective: "Mengidentifikasi contoh bakteri yang menguntungkan dan merugikan dalam kehidupan sehari-hari serta menerapkan literasi sains secara teladan.",
    source: "https://youtu.be/v3knZsPEtvM?si=HQiyAE85OLBKY-rF",
  },
  p2: {
    coverTitle: "Uji Pembusukan Makanan",
    headerTitle: "UJI PEMBUSUKAN MAKANAN",
    intro: [
      "Puji syukur ke hadirat Allah SWT atas limpahan rahmat-Nya sehingga LKPD Pertemuan 2 ini dapat hadir untuk mendampingi proses belajar kalian.",
      "LKPD Pertemuan 2 ini mengajak kalian untuk terjun langsung dalam kegiatan penyelidikan ilmiah melalui percobaan uji pembusukan makanan.",
      "Kalian akan merancang prosedur, mengamati perubahan, mencatat data, dan menarik kesimpulan berdasarkan bukti nyata.",
      "Melalui percobaan ini, kalian akan memahami secara langsung bagaimana bakteri berperan dalam proses pembusukan makanan, serta faktor-faktor apa saja yang memengaruhi kecepatan pembusukan tersebut.",
    ],
    objective: "Merancang dan melakukan percobaan uji pembusukan makanan untuk mengetahui faktor yang memengaruhi pertumbuhan bakteri pembusuk.",
    source: "https://youtu.be/bSKLE-gs47o?si=2nrqWXFnVjVN5PaR",
  },
  p3: {
    coverTitle: "Bioteknologi dan Pemanfaatan Bakteri",
    headerTitle: "BIOTEKNOLOGI DAN PEMANFAATAN BAKTERI",
    intro: [
      "Puji syukur ke hadirat Allah SWT atas segala karunia-Nya sehingga LKPD Pertemuan 3 ini dapat kalian gunakan sebagai panduan belajar.",
      "LKPD Pertemuan 3 ini membawa kalian menjelajahi dunia bioteknologi, yaitu bidang yang memanfaatkan kemampuan bakteri untuk menghasilkan produk bermanfaat.",
      "Mulai dari yogurt dan tempe yang kalian konsumsi sehari-hari, hingga insulin yang menyelamatkan penderita diabetes, semuanya melibatkan peran bakteri yang bekerja secara senyap namun sangat berdampak.",
      "Dalam pertemuan ini, kalian akan berdiskusi secara kritis tentang keunggulan dan risiko penerapan bioteknologi, serta bagaimana ilmu pengetahuan dapat menjadi dasar pengambilan keputusan yang bertanggung jawab.",
    ],
    objective: "Menganalisis pemanfaatan bakteri dalam bidang bioteknologi beserta manfaat dan risikonya dalam kehidupan sehari-hari.",
    source: "https://youtu.be/pKmaBnLf5WM?si=cDTR7aZUK_q2y1ON",
  },
  p4: {
    coverTitle: "Percobaan Fermentasi Nata de Nanas",
    headerTitle: "PERCOBAAN FERMENTASI NATA DE NANAS",
    intro: [
      "Puji syukur ke hadirat Allah SWT atas berkah dan kemudahan-Nya sehingga LKPD Pertemuan 4 ini dapat hadir sebagai panduan percobaan kalian.",
      "LKPD Pertemuan 4 ini memandu kalian melakukan percobaan fermentasi nata de nanas dengan memanfaatkan Acetobacter xylinum.",
      "Melalui percobaan ini, kalian akan menyaksikan sendiri bagaimana bakteri mampu mengubah air nanas biasa menjadi produk makanan bertekstur kenyal yang bernilai gizi dan ekonomi.",
      "Kalian akan merancang percobaan, menentukan variabel, melakukan pengamatan selama beberapa hari, dan menganalisis hasilnya secara ilmiah.",
    ],
    objective: "Melakukan percobaan fermentasi nata de nanas dan menganalisis faktor yang memengaruhi keberhasilan fermentasi.",
    source: "https://youtu.be/dJ8OM4n_XRk?si=HAJV6Xz77iDcLb_2",
  },
};

const commonIntro = [
  "Bakteri merupakan organisme prokariotik bersel tunggal yang ditemukan hampir di semua lingkungan di bumi.",
  "Melalui LKPD ini, kalian akan menjelajahi empat aspek utama biologi bakteri: peran bakteri, uji pembusukan makanan, bioteknologi, dan fermentasi nata de nanas.",
  "Kalian akan bekerja dalam tim kolaborasi dengan pendekatan masalah open-ended. Yang dinilai adalah kualitas argumen dan bukti ilmiah yang kalian bangun bersama.",
];

const scienceIndicators = [
  {
    indicator: "Menjelaskan Fenomena Secara Ilmiah",
    descriptor:
      "Siswa dapat menjelaskan fenomena terkait peran bakteri dalam kehidupan sehari-hari menggunakan konsep biologi yang sesuai dan disertai alasan yang masuk akal.",
  },
  {
    indicator: "Merancang dan Mengevaluasi Desain untuk Penyelidikan Ilmiah serta Menafsirkan Data dan Bukti Ilmiah secara Kritis",
    descriptor:
      "Siswa dapat menyusun rancangan percobaan sederhana, melaksanakannya, mencatat hasilnya, lalu mengolah dan menyimpulkan data berdasarkan bukti.",
  },
  {
    indicator: "Meneliti, mengevaluasi, dan menggunakan informasi ilmiah untuk pengambilan keputusan dan tindakan",
    descriptor:
      "Siswa dapat mencari informasi ilmiah, menilai kebenarannya, lalu menggunakannya sebagai dasar pengambilan keputusan atau rancangan solusi.",
  },
];

const demoGroup: GroupData = {
  _id: "DEMO",
  groupName: "Preview LKPD Dosen",
  groupCode: "DEMO",
  members: ["Dosen Penguji"],
  lkpd: {},
};

const subscribeToDemoMode = () => () => {};
const getDemoModeServerSnapshot = () => process.env.NEXT_PUBLIC_LKPD_DEMO_MODE === "true";

function getTheme(meetingId: MeetingId) {
  return worksheetThemes[meetingId];
}

function DottedTextarea({
  id,
  label,
  answers,
  onChange,
  rows = 5,
}: {
  id: string;
  label: string;
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black underline decoration-[#24395B] decoration-1 underline-offset-2 dark:decoration-slate-200 dark:text-slate-100">
        {label}
      </span>
      <textarea
        value={answers[id] ?? ""}
        onChange={(event) => onChange(id, event.target.value)}
        rows={rows}
        className="w-full resize-y border border-current bg-white/30 p-3 text-sm font-semibold leading-7 text-[#24395B] outline-none placeholder:text-slate-400 focus:bg-white/60 dark:bg-slate-950/20 dark:text-slate-50 dark:placeholder:text-slate-300 dark:focus:bg-slate-950/35"
      />
    </label>
  );
}

function WorksheetTable({
  tableId,
  columns,
  rows,
  answers,
  onChange,
  dense = false,
}: {
  tableId: string;
  columns: string[];
  rows: string[][];
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
  dense?: boolean;
}) {
  return (
    <div className="overflow-hidden border border-black bg-white dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full table-fixed border-collapse text-center text-[11px] leading-4 text-black dark:text-slate-100 sm:text-xs">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="border border-black px-2 py-2 font-black dark:border-slate-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${tableId}-${rowIndex}`}>
              {columns.map((_, cellIndex) => {
                const cell = row[cellIndex] ?? "";
                const key = `${tableId}-${rowIndex}-${cellIndex}`;
                return (
                  <td key={key} className={cx("border border-black px-2 py-2 align-top dark:border-slate-700", dense ? "h-14" : "h-24")}>
                    {cell ? (
                      <span className={cellIndex === 0 ? "font-black" : "font-semibold"}>{cell}</span>
                    ) : (
                      <textarea
                        value={answers[key] ?? ""}
                        onChange={(event) => onChange(key, event.target.value)}
                        rows={dense ? 2 : 4}
                        className="h-full min-h-12 w-full resize-y border-0 bg-transparent text-left text-xs leading-5 outline-none dark:text-slate-100 dark:placeholder:text-slate-300"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorksheetChoiceTable({
  tableId,
  options,
  answers,
  onChange,
}: {
  tableId: string;
  options: Array<{ value: string; description: string }>;
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
}) {
  const selected = answers[`${tableId}-selected`] ?? "";

  return (
    <div className="overflow-hidden border border-black bg-white dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full table-fixed border-collapse text-center text-[11px] leading-4 text-black dark:text-slate-100 sm:text-xs">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[62%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="border border-black px-2 py-2 font-black dark:border-slate-700">Fokus</th>
            <th className="border border-black px-2 py-2 font-black dark:border-slate-700">Deskripsi</th>
            <th className="border border-black px-2 py-2 font-black dark:border-slate-700">Pilih</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <tr key={option.value}>
                <td className="border border-black px-2 py-3 font-semibold dark:border-slate-700">Fokus {option.value}</td>
                <td className="border border-black px-2 py-3 dark:border-slate-700">{option.description}</td>
                <td className="border border-black px-2 py-3 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onChange(`${tableId}-selected`, option.value)}
                    className={cx(
                      "mx-auto flex h-7 w-7 items-center justify-center border border-black transition",
                      isSelected ? "bg-[#24395B] text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-transparent hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800",
                    )}
                    aria-label={`Pilih fokus ${option.value}`}
                  >
                    <Check size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RoleTable({
  tableId,
  roles,
  answers,
  onChange,
}: {
  tableId: string;
  roles: string[];
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <WorksheetTable
      tableId={tableId}
      columns={["Peran", "Nama Anggota"]}
      rows={roles.map((role) => [role, ""])}
      answers={answers}
      onChange={onChange}
      dense
    />
  );
}

function WorksheetHeader({ meeting, theme }: { meeting: MeetingId; theme: WorksheetTheme }) {
  const meta = meetingMeta[meeting];
  return (
    <div className="mb-5">
      <div className={cx("inline-block border-b-2 pb-2 pr-8 text-left text-xs font-black uppercase leading-4", theme.header)}>
        <p>PERTEMUAN {Number(meetings.find((item) => item.id === meeting)?.number ?? "1")}</p>
        <p>{meta.headerTitle}</p>
      </div>
    </div>
  );
}

function PhaseTitle({
  number,
  title,
  theme,
}: {
  number: string;
  title: string;
  theme: WorksheetTheme;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-black uppercase text-black dark:text-slate-100">FASE {number}</p>
      <div className={cx("mt-1 inline-block border-l-4 pl-3 text-sm font-black uppercase leading-4", theme.phase)}>
        {title}
      </div>
    </div>
  );
}

function WorksheetPage({
  meeting,
  phase,
  phaseTitle,
  children,
  className,
}: {
  meeting: MeetingId;
  phase?: string;
  phaseTitle?: string;
  children: ReactNode;
  className?: string;
}) {
  const theme = getTheme(meeting);

  return (
    <section className={cx("w-full border-b border-black/10 px-4 py-8 transition-colors dark:border-white/10 sm:px-8 lg:px-10", theme.outer, className)}>
      <div className="mx-auto w-full max-w-6xl">
        <WorksheetHeader meeting={meeting} theme={theme} />
        {phase && phaseTitle && <PhaseTitle number={phase} title={phaseTitle} theme={theme} />}
        <div className="space-y-4 text-sm font-semibold leading-6 text-black dark:text-slate-100 sm:text-base sm:leading-7">{children}</div>
      </div>
    </section>
  );
}

function WorksheetCoverPage({ meeting, group }: { meeting: MeetingId; group: GroupData }) {
  const theme = getTheme(meeting);
  const meta = meetingMeta[meeting];
  const number = meetings.find((item) => item.id === meeting)?.number ?? "01";

  return (
    <section className={cx("w-full border-b border-black/10 px-4 py-10 transition-colors dark:border-white/10 sm:px-8 lg:px-10", theme.outer)}>
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
        <div>
        <div className="flex items-center gap-3">
          <Image src="/Lambang-UM.png" alt="Lambang UM" width={42} height={42} className="h-10 w-10 object-contain" />
          <div className="border-b-2 border-current pb-1 text-sm font-black uppercase">Lembar Kerja Peserta Didik</div>
        </div>
        <div className="mt-12">
          <p className="text-6xl font-black leading-none text-[#6F2A35] sm:text-7xl">BIOLOGI</p>
          <p className="mt-6 text-xl font-black">Pertemuan {Number(number)}</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{meta.coverTitle}</h1>
          <p className="mt-3 text-lg font-bold">Kelas X</p>
        </div>
        </div>
        <div className="border-l-4 border-current bg-white/40 px-5 py-4 text-sm leading-6 dark:bg-slate-950/25">
          <p>
            <span className="font-semibold">Kelompok:</span> {group.groupName}
          </p>
          <p className="font-semibold">Anggota:</p>
          <ol className="list-decimal pl-5">
            {(group.members.length ? group.members : ["Belum ada anggota"]).map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TextLead({ children }: { children: ReactNode }) {
  return <p className="text-justify text-sm font-bold leading-6 text-[#24395B] dark:text-slate-100">{children}</p>;
}

function FrontMatterPages({ meeting }: { meeting: MeetingId }) {
  const meta = meetingMeta[meeting];

  return (
    <>
      <WorksheetPage meeting={meeting}>
        <h2 className="text-xl font-black uppercase text-[#24395B]">Kata Pengantar</h2>
        {meta.intro.map((paragraph) => (
          <TextLead key={paragraph}>{paragraph}</TextLead>
        ))}
        <TextLead>
          Selamat belajar, berdiskusi, dan berkolaborasi dengan menggunakan bukti ilmiah sebagai dasar argumen.
        </TextLead>
        <div className="pt-6 text-right text-sm font-bold text-[#24395B]">
          <p>Malang, 7 Mei 2026</p>
          <p className="mt-6">Penulis</p>
        </div>
      </WorksheetPage>

      <WorksheetPage meeting={meeting}>
        <h2 className="text-base font-black text-[#24395B]">Capaian Pembelajaran:</h2>
        <TextLead>
          Menerapkan prinsip klasifikasi dan strategi pelestarian keanekaragaman hayati; mendeskripsikan peranan
          virus, bakteri, dan jamur dalam kehidupan; menganalisis interaksi antar komponen ekosistem dan pengaruhnya
          terhadap keseimbangan ekosistem; menggunakan sistem pengukuran dalam kerja ilmiah.
        </TextLead>
        <h2 className="text-base font-black text-[#24395B]">Tujuan Pembelajaran:</h2>
        <TextLead>Melalui pembelajaran berbasis OE-C, peserta didik mampu {meta.objective}</TextLead>
        <h2 className="text-base font-black text-[#24395B]">Sumber Belajar:</h2>
        <TextLead>Video pembelajaran pendukung: {meta.source}</TextLead>
      </WorksheetPage>

      <WorksheetPage meeting={meeting}>
        <h2 className="text-base font-black text-[#24395B]">Pengantar:</h2>
        {commonIntro.map((paragraph) => (
          <TextLead key={paragraph}>{paragraph}</TextLead>
        ))}
        <h2 className="pt-3 text-base font-black text-[#24395B]">Petunjuk Penggunaan:</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm font-bold leading-6 text-[#24395B]">
          <li>Berdoalah sebelum mengerjakan LKPD.</li>
          <li>Bacalah dan pelajari LKPD secara berurutan sesuai aktivitas pembelajaran.</li>
          <li>Bacalah petunjuk dan perintah pada setiap aktivitas dengan teliti.</li>
          <li>Kerjakan LKPD secara individu dan berkelompok sesuai instruksi.</li>
          <li>Kumpulkan LKPD tepat waktu.</li>
        </ol>
      </WorksheetPage>

      <WorksheetPage meeting={meeting}>
        <h2 className="text-base font-black underline text-[#24395B]">Informasi Penting:</h2>
        <TextLead>
          Sebelum memulai kegiatan pembelajaran, bacalah informasi penting berikut ini dengan saksama. Kegiatan
          pembelajaran menggunakan model Open-Ended Collaborative Learning (OE-C) dengan materi pokok Bakteri.
        </TextLead>
        <WorksheetTable
          tableId={`info-${meeting}`}
          columns={["Komponen", "Keterangan"]}
          rows={[
            ["Model Pembelajaran", "Open-Ended Collaborative Learning (OE-C)"],
            ["Materi Pembelajaran", "Bakteri"],
            ["Media Pembelajaran", "Website e-modul"],
            ["Bentuk Kegiatan", "Diskusi kelompok & percobaan"],
          ]}
          answers={{}}
          onChange={() => undefined}
          dense
        />
      </WorksheetPage>

      <WorksheetPage meeting={meeting}>
        <h2 className="text-base font-black underline text-[#24395B]">Keterampilan Abad 21: Literasi Sains</h2>
        <WorksheetTable
          tableId={`indicator-${meeting}`}
          columns={["Indikator Abad 21", "Deskriptor"]}
          rows={scienceIndicators.map((item) => [item.indicator, item.descriptor])}
          answers={{}}
          onChange={() => undefined}
          dense
        />
        <p className="pt-2 text-sm font-bold text-[#24395B]">Sumber : (PISA, 2025 : 21)</p>
      </WorksheetPage>
    </>
  );
}

function MeetingOnePages({ answers, onAnswerChange }: { answers: AnswerMap; onAnswerChange: (id: string, value: string) => void }) {
  return (
    <>
      <WorksheetPage meeting="p1" phase="1" phaseTitle="Mengorientasi Siswa">
        <p>
          Bacalah artikel tentang wabah kolera dan pemanfaatan bakteri dalam produksi insulin yang telah disajikan.
          <span className="font-black text-red-500"> Identifikasilah kemungkinan keterlibatan bakteri pada kedua fenomena tersebut</span> berdasarkan konsep ilmiah yang telah kamu pelajari.
        </p>
        <div className="border border-[#24395B] bg-white/40 p-3">
          <p className="font-black underline">Berita nyata:</p>
          <p className="break-all text-xs font-bold text-[#24395B]">
            https://media.neliti.com/media/publications-test/75542-diagnosa-vibrio-cholerae-dengan-metode-k-9b513091.pdf
          </p>
          <ol className="list-decimal pl-5">
            <li>Bakteri digunakan untuk menghasilkan insulin bagi penderita diabetes dan menyelamatkan jutaan jiwa.</li>
            <li>Wabah kolera menewaskan ribuan orang di negara berkembang setiap tahunnya.</li>
          </ol>
        </div>
        <p className="text-base font-black text-[#24395B]">
          Mengapa makhluk yang sama bisa menyelamatkan jiwa sekaligus mengancam nyawa? Kembangkan penjelasanmu menjadi hipotesis yang dapat diuji.
        </p>
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="1" phaseTitle="Mengorientasi Siswa">
        <DottedTextarea id="p1-opinion" label="Jawaban:" rows={10} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="2" phaseTitle="Pemberian Masalah Open-Ended">
        <p>Berdasarkan masalah desa terpencil yang disajikan, rumuskan dugaan awalmu tentang penyebab tanah tidak subur dan air yang menyebabkan diare.</p>
        <p>Sebutkan kemungkinan peran bakteri di balik kedua masalah tersebut.</p>
        <p className="font-black text-red-500">Susunlah solusimu:</p>
        <ol className="list-decimal pl-5">
          <li>Bakteri apa yang dapat membantu, dan bagaimana mekanismenya?</li>
          <li>Tuliskan dalam bentuk hipotesis yang jelas.</li>
        </ol>
        <p>Carilah informasi dari minimal dua sumber berbeda untuk memperkuat atau menguji prediksimu. Tentukan mana yang didukung bukti ilmiah dan mana yang hanya berupa pendapat umum.</p>
        <DottedTextarea id="p1-hypothesis" label="Hipotesis (dugaan awal):" rows={9} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="3" phaseTitle="Menemukan Tim Kolaborasi">
        <p>
          <span className="font-black text-red-500">Diskusikan bersama anggota timmu informasi ilmiah</span> yang telah ditemukan, lalu pilih fokus investigasi kelompok.
        </p>
        <WorksheetChoiceTable
          tableId="p1-focus"
          options={[
            { value: "A", description: "Bakteri menguntungkan di bidang pertanian (Rhizobium, Azotobacter)" },
            { value: "B", description: "Bakteri menguntungkan di bidang kesehatan & industri" },
            { value: "C", description: "Bakteri patogen & penyakit yang ditimbulkan" },
            { value: "D", description: "Upaya pencegahan & pengendalian bakteri patogen" },
          ]}
          answers={answers}
          onChange={onAnswerChange}
        />
        <DottedTextarea id="p1-focus-reason" label="Alasan:" rows={4} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="4" phaseTitle="Penataan Tugas Belajar">
        <p>
          <span className="font-black text-red-500">Susunlah langkah-langkah penyelidikan secara runtut</span> bersama kelompokmu sesuai peran masing-masing.
        </p>
        <RoleTable
          tableId="p1-roles"
          roles={[
            "Peneliti Manfaat - mencari spesies bakteri & mekanisme yang relevan",
            "Analis Risiko - mengidentifikasi potensi risiko dari solusi",
            "Perancang Solusi - menyusun langkah implementasi solusi",
            "Penyaji - mempresentasikan rancangan solusi",
          ]}
          answers={answers}
          onChange={onAnswerChange}
        />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Tim">
        <p className="font-black">(Tahap Persiapan)</p>
        <p>Tentukan tujuan diskusi timmu dan kumpulkan kembali pengetahuan awal setiap anggota.</p>
        <p className="font-black">(Tahap Inkubasi)</p>
        <p>Diskusikan berbagai kemungkinan solusi dari masalah open-ended yang diberikan.</p>
        <p className="font-black">(Tahap Iluminasi)</p>
        <p>Laksanakan strategi yang disepakati dan sajikan informasi dari berbagai sumber untuk memperkuat argumen.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Tim">
        <p className="font-black underline text-[#24395B]">Panduan diskusi:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Spesies bakteri apa yang akan digunakan? Jelaskan mekanisme kerjanya secara ilmiah.</li>
          <li>Bagaimana memastikan bakteri yang digunakan tidak membahayakan warga?</li>
          <li>Bandingkan solusi kalian dengan solusi konvensional.</li>
          <li>Apakah ada kondisi saat solusi berbasis bakteri tidak disarankan?</li>
        </ol>
        <DottedTextarea id="p1-discussion-answer" label="Jawaban:" rows={7} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Tim">
        <p className="font-black underline text-[#24395B]">Tabel Manfaat Bakteri:</p>
        <WorksheetTable tableId="p1-benefit-map" columns={["Bidang", "Nama Bakteri", "Manfaat"]} rows={Array.from({ length: 4 }, () => ["", "", ""])} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Tim">
        <p className="font-black underline text-[#24395B]">Tabel Bakteri Patogen Penyebab Penyakit:</p>
        <WorksheetTable tableId="p1-pathogen-map" columns={["Penyakit", "Bakteri Penyebab", "Cara Penularan", "Pencegahan"]} rows={Array.from({ length: 5 }, () => ["", "", "", ""])} answers={answers} onChange={onAnswerChange} dense />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Tim">
        <p>Bandingkan solusi timmu dengan solusi tim lain melalui diskusi kelas dan tunjukkan apakah argumen sudah didukung bukti yang kuat.</p>
        <DottedTextarea id="p1-team-result" label="Hasil Diskusi Kelompok:" rows={9} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p1" phase="6" phaseTitle="Evaluasi dan Grading">
        <p>Presentasikan hasil diskusi kelompokmu di depan kelas dengan bahasa yang jelas, runtut, dan didukung konsep biologi yang tepat.</p>
        <p>Pertahankan solusi dan kesimpulan kelompokmu dengan argumen logis berdasarkan data dan informasi ilmiah.</p>
        <p>Gunakan informasi ilmiah yang telah kamu kumpulkan untuk menanggapi pertanyaan atau sanggahan dari kelompok lain secara kritis dan berdasarkan bukti.</p>
        <p>Identifikasi kelemahan argumen yang kurang didukung bukti, baik dari presentasi kelompokmu sendiri maupun kelompok lain, lalu berikan koreksi atau penyempurnaan yang tepat.</p>
        <p className="font-black underline text-[#24395B]">Refleksi Kelompok Pertemuan 1:</p>
        <WorksheetTable tableId="p1-reflection" columns={["Hal baru yang dipelajari", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
    </>
  );
}

function MeetingTwoPages({ answers, onAnswerChange }: { answers: AnswerMap; onAnswerChange: (id: string, value: string) => void }) {
  return (
    <>
      <WorksheetPage meeting="p2" phase="1" phaseTitle="Mengorientasi">
        <p>Amatilah kondisi apel dan roti yang mengalami pembusukan pada gambar yang disajikan.</p>
        <p>Identifikasilah kemungkinan keterlibatan bakteri berdasarkan konsep ilmiah yang telah dipelajari, kemudian jelaskan secara singkat apa yang sebenarnya terjadi pada makanan tersebut.</p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/apel.jpeg" alt="Apel segar dan membusuk" width={600} height={401} className="h-32 w-full bg-white/40 object-contain" />
          <Image src="/roti_jamur.jpeg" alt="Roti berjamur" width={571} height={366} className="h-32 w-full bg-white/40 object-contain" />
        </div>
        <p>
          <span className="font-black text-red-500">Berdasarkan pengamatanmu, kembangkan hipotesis:</span> siapa pelaku di balik pembusukan tersebut dan mengapa proses itu bisa terjadi?
        </p>
        <DottedTextarea id="p2-answer" label="Jawaban:" rows={6} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="2" phaseTitle="Pemberian Masalah Open-Ended">
        <Image src="/orang_roti_jamur.jpeg" alt="Pedagang memegang roti berjamur" width={974} height={1024} className="mx-auto h-48 w-full max-w-xs bg-white/40 object-contain" />
        <p className="font-black">Kasus:</p>
        <p>Seorang pedagang makanan mengeluhkan rotinya selalu berjamur dan berbau dalam 2 hari, padahal disimpan di tempat tertutup. Ia bertanya-tanya apakah suhu, kelembapan, atau jenis kemasan yang memengaruhi kecepatan pembusukan.</p>
        <p className="font-black text-red-500">Rumuskan dugaan awalmu:</p>
        <ol className="list-decimal pl-5">
          <li>Faktor apa yang paling mungkin menjadi penyebab cepatnya pembusukan?</li>
          <li>Jelaskan dasar pemikiranmu secara ilmiah.</li>
        </ol>
        <p>Susunlah prediksimu secara sederhana: jika faktor yang kamu duga diubah atau dikendalikan, bagaimana pengaruhnya terhadap kecepatan pembusukan?</p>
        <p>Carilah informasi dari minimal dua sumber berbeda tentang faktor-faktor yang memengaruhi pertumbuhan bakteri pembusuk dan cara menghambatnya.</p>
        <DottedTextarea id="p2-hypothesis" label="Hipotesis:" rows={8} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="3" phaseTitle="Menemukan Tim Kolaborasi">
        <p>Gunakan informasi ilmiah sebagai dasar untuk menyepakati fokus percobaan.</p>
        <WorksheetChoiceTable
          tableId="p2-focus"
          options={[
            { value: "A", description: "Pengaruh suhu terhadap kecepatan pembusukan" },
            { value: "B", description: "Pengaruh kemasan/paparan udara terhadap pembusukan" },
            { value: "C", description: "Pengaruh kadar air atau kelembapan terhadap pembusukan" },
          ]}
          answers={answers}
          onChange={onAnswerChange}
        />
        <DottedTextarea id="p2-focus-reason" label="Alasan:" rows={5} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="4" phaseTitle="Penataan Tugas Belajar">
        <p>Susunlah langkah penyelidikan mulai dari perancangan percobaan, pelaksanaan, pencatatan data, hingga analisis.</p>
        <RoleTable
          tableId="p2-roles"
          roles={["Perancang Percobaan - menyusun prosedur uji", "Pengamat & Pencatat - mengamati dan mencatat perubahan", "Analis Data - mengolah hasil pengamatan", "Penyaji - mempresentasikan hasil percobaan"]}
          answers={answers}
          onChange={onAnswerChange}
        />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black">(Tahap Persiapan)</p>
        <p>Tentukan tujuan percobaan timmu, atur jadwal pengamatan selama 3-4 hari, dan kumpulkan pengetahuan awal tentang faktor yang memengaruhi pembusukan.</p>
        <p className="font-black">(Tahap Inkubasi)</p>
        <p>Diskusikan dan putuskan strategi percobaan: cara membuat sampel terkontrol, hal yang diamati setiap hari, dan cara mencatat data secara sistematis.</p>
        <p className="font-black">(Tahap Iluminasi)</p>
        <p>Laksanakan percobaan sesuai rancangan, catat perubahan setiap sampel pada tabel pengamatan, dan telusuri literatur pendukung untuk memperkuat analisis.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black underline text-[#24395B]">Rancangan Percobaan:</p>
        <WorksheetTable tableId="p2-design" columns={["Komponen", "Isi"]} rows={[["Judul Percobaan", ""], ["Tujuan", ""], ["Alat dan bahan", ""], ["Prosedur kerja", ""]]} answers={answers} onChange={onAnswerChange} dense />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black underline text-[#24395B]">Tabel Hasil Pengamatan:</p>
        <p className="text-xs font-bold">(amati: warna, bau, tekstur, ada/tidaknya lendir atau jamur)</p>
        <WorksheetTable tableId="p2-observation" columns={["Hari ke-", "Kondisi Sampel A", "Kondisi Sampel B", "Kondisi Sampel C", "Keterangan"]} rows={["1", "2", "3", "4"].map((day) => [day, "", "", "", ""])} answers={answers} onChange={onAnswerChange} dense />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p>Olah data hasil pengamatanmu dan tarik kesimpulan berdasarkan bukti yang diperoleh.</p>
        <DottedTextarea id="p2-analysis" label="Analisis data dan Kesimpulan:" rows={9} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p2" phase="6" phaseTitle="Evaluasi dan Grading">
        <p>Presentasikan hasil percobaan kelompokmu secara sistematis: rancangan, data, dan kesimpulan.</p>
        <p>Pertahankan kesimpulan kelompokmu dengan argumen logis berdasarkan data pengamatan yang telah dikumpulkan selama 3-4 hari.</p>
        <p>Gunakan data dan literatur ilmiah untuk menanggapi pertanyaan atau sanggahan dari kelompok lain secara kritis.</p>
        <p>Identifikasi kelemahan pada rancangan percobaan atau argumen yang kurang didukung data, lalu berikan saran perbaikan yang tepat.</p>
        <p className="font-black underline text-[#24395B]">Refleksi Kelompok Pertemuan 2:</p>
        <WorksheetTable tableId="p2-reflection" columns={["Hal yang sudah dipahami", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
    </>
  );
}

function MeetingThreePages({ answers, onAnswerChange }: { answers: AnswerMap; onAnswerChange: (id: string, value: string) => void }) {
  return (
    <>
      <WorksheetPage meeting="p3" phase="1" phaseTitle="Mengorientasi Siswa">
        <p>Amatilah produk-produk bioteknologi yang disajikan (yogurt, tempe, pupuk hayati, biogas). Identifikasilah kesamaan prinsip ilmiah di balik semua produk tersebut berdasarkan pengetahuan biologimu tentang peran bakteri.</p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/yogurt.jpeg" alt="Yogurt" width={600} height={400} className="h-28 w-full bg-white/40 object-contain" />
          <Image src="/tempe.jpeg" alt="Tempe" width={600} height={400} className="h-28 w-full bg-white/40 object-contain" />
          <Image src="/pupuk_hayati.jpeg" alt="Pupuk hayati" width={600} height={400} className="h-28 w-full bg-white/40 object-contain" />
          <Image src="/biogas.jpeg" alt="Biogas" width={600} height={400} className="h-28 w-full bg-white/40 object-contain" />
        </div>
        <ol className="list-decimal pl-5">
          <li>Apa kesamaan dari semua produk bioteknologi tersebut?</li>
          <li>Mengapa manusia memanfaatkan bakteri dan bukan membuatnya sendiri secara kimiawi?</li>
        </ol>
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="1" phaseTitle="Mengorientasi Siswa">
        <DottedTextarea id="p3-answer" label="Jawaban:" rows={10} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="2" phaseTitle="Pemberian Masalah Open-Ended">
        <p>Berdasarkan kasus startup yang ingin memproduksi pupuk hayati dan biogas, rumuskan dugaan awalmu.</p>
        <p className="font-black text-red-500">Bakteri apa yang paling mungkin tepat digunakan untuk masing-masing tujuan, dan mengapa?</p>
        <p>Susunlah prediksimu secara sederhana: apa keunggulan yang mungkin dimiliki produk bioteknologi ini dibandingkan pupuk kimia atau bahan bakar konvensional?</p>
        <p>Carilah informasi dari minimal dua sumber berbeda tentang spesies bakteri yang relevan, mekanisme kerjanya, dan bukti keberhasilan penerapannya.</p>
        <p>Dari informasi yang kamu temukan, tentukan mana yang merupakan bukti ilmiah dari penelitian terverifikasi dan mana yang masih berupa klaim atau promosi produk semata.</p>
        <DottedTextarea id="p3-hypothesis" label="Hipotesis:" rows={9} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="3" phaseTitle="Menemukan Tim Kolaborasi">
        <p><span className="font-black text-red-500">Diskusikan bersama anggota timmu informasi ilmiah</span> yang telah dikumpulkan, kemudian pilih bidang bioteknologi yang menjadi fokus investigasi.</p>
        <WorksheetChoiceTable
          tableId="p3-focus"
          options={[
            { value: "A", description: "Bioteknologi pangan - fermentasi yogurt, keju, tempe, kecap" },
            { value: "B", description: "Bioteknologi pertanian - pupuk hayati & fiksasi nitrogen" },
            { value: "C", description: "Bioteknologi kesehatan - insulin, vaksin, antibiotik" },
            { value: "D", description: "Bioteknologi lingkungan - biogas & pengolahan limbah" },
          ]}
          answers={answers}
          onChange={onAnswerChange}
        />
        <DottedTextarea id="p3-focus-reason" label="Alasan:" rows={4} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="4" phaseTitle="Penataan Tugas Belajar">
        <p><span className="font-black text-red-500">Susunlah langkah-langkah penyelidikan timmu secara runtut</span> sesuai peran masing-masing anggota.</p>
        <RoleTable tableId="p3-roles" roles={["Peneliti - mencari spesies bakteri & mekanisme bioteknologi", "Analis Keunggulan - membandingkan dengan metode konvensional", "Analis Risiko - mengidentifikasi risiko penerapan skala besar", "Penyaji - mempresentasikan hasil diskusi"]} answers={answers} onChange={onAnswerChange} />
        <p><span className="font-black text-red-500">Rancanglah strategi penyelidikanmu:</span> sumber informasi apa yang akan digunakan, bagaimana cara menyajikan perbandingan keunggulan dan risiko, serta bagaimana hasilnya akan dikomunikasikan kepada kelas.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black">(Tahap Persiapan)</p>
        <p>Tentukan tujuan diskusi, pembagian waktu, dan pengetahuan awal tentang bioteknologi bakteri.</p>
        <p className="font-black">(Tahap Inkubasi)</p>
        <p>Diskusikan spesies bakteri, mekanisme biokimia, keunggulan, dan risiko penerapannya.</p>
        <p className="font-black">(Tahap Iluminasi)</p>
        <p>Isi Tabel Peta Bioteknologi Bakteri berdasarkan sumber ilmiah yang ditelusuri timmu.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black underline text-[#24395B]">Tabel Peta Bioteknologi Bakteri:</p>
        <WorksheetTable tableId="p3-biotech-map" columns={["Bidang", "Nama Bakteri", "Produk", "Keunggulan"]} rows={Array.from({ length: 4 }, () => ["", "", "", ""])} answers={answers} onChange={onAnswerChange} dense />
        <p className="font-black">(Tahap Verifikasi)</p>
        <p>Rumuskan kesimpulan kelompok berdasarkan data yang telah dikumpulkan, dan berikan alasan ilmiah yang kuat atas setiap keputusan yang diambil timmu sebagai kontribusi nyata terhadap isu bioteknologi dalam kehidupan.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p>Rumuskan kesimpulan kelompok berdasarkan data yang telah dikumpulkan dan berikan alasan ilmiah yang kuat.</p>
        <DottedTextarea id="p3-conclusion" label="Kesimpulan kelompok:" rows={9} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p3" phase="6" phaseTitle="Evaluasi dan Grading">
        <p>Presentasikan hasil diskusi bioteknologi kelompokmu dengan bahasa yang jelas dan didukung konsep biologi yang tepat.</p>
        <p>Sertakan data dan sumber ilmiah yang mendukung. Pertahankan kesimpulan dan rekomendasi kelompokmu dengan argumen yang logis berdasarkan informasi ilmiah yang telah dikumpulkan.</p>
        <p>Gunakan informasi ilmiah untuk menanggapi pertanyaan, sanggahan, atau pandangan berbeda dari kelompok lain secara kritis dan berbasis bukti.</p>
        <p>Identifikasi argumen milik timmu maupun tim lain yang masih lemah karena kurang didukung bukti ilmiah, lalu berikan koreksi atau penguatan yang tepat.</p>
        <p className="font-black underline text-[#24395B]">Refleksi Kelompok Pertemuan 3:</p>
        <WorksheetTable tableId="p3-reflection" columns={["Hal yang sudah dipahami", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
    </>
  );
}

function MeetingFourPages({ answers, onAnswerChange }: { answers: AnswerMap; onAnswerChange: (id: string, value: string) => void }) {
  return (
    <>
      <WorksheetPage meeting="p4" phase="1" phaseTitle="Mengorientasi Siswa">
        <p>Perhatikan gambar nata de nanas yang disajikan. Berdasarkan pengetahuan biologimu, identifikasilah peran Acetobacter xylinum dalam mengubah air nanas menjadi lapisan kenyal yang kita kenal sebagai nata.</p>
        <Image src="/nata_de_pina.jpeg" alt="Nata de nanas" width={600} height={400} className="mx-auto h-48 w-full max-w-sm bg-white/40 object-contain" />
        <p className="font-black text-red-500">Kembangkan hipotesismu: proses biokimia apa yang terjadi sehingga bakteri mampu membentuk lapisan selulosa padat dari cairan nanas?</p>
        <DottedTextarea id="p4-answer" label="Jawaban:" rows={6} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="2" phaseTitle="Pemberian Masalah Open-Ended">
        <p className="font-black">Masalah Open-Ended:</p>
        <p>Seorang pengusaha ingin memproduksi nata de nanas dalam skala rumahan. Ia mempertanyakan apakah perbedaan kadar gula, suhu fermentasi, atau ketebalan lapisan starter (Acetobacter xylinum) akan memengaruhi kualitas dan ketebalan nata yang dihasilkan.</p>
        <p className="font-black text-red-500">Berdasarkan masalah tersebut, rumuskan dugaan awalmu: faktor mana yang paling berpengaruh terhadap keberhasilan fermentasi, kadar gula, suhu, atau konsentrasi starter?</p>
        <p>Jelaskan dasar pemikiranmu secara ilmiah. Carilah informasi dari minimal dua sumber berbeda tentang peran Acetobacter xylinum dalam fermentasi dan faktor-faktor yang memengaruhi keberhasilan produksi nata.</p>
        <p>Dari informasi yang kamu temukan, pilah mana yang merupakan temuan ilmiah terverifikasi dan mana yang sekadar panduan praktis tanpa dasar penelitian yang jelas.</p>
        <DottedTextarea id="p4-hypothesis" label="Jawaban:" rows={10} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="3" phaseTitle="Menemukan Tim Kolaborasi">
        <p><span className="font-black text-red-500">Diskusikan bersama anggota timmu informasi ilmiah</span> sebagai dasar memilih fokus variabel yang akan diuji.</p>
        <WorksheetChoiceTable
          tableId="p4-focus"
          options={[
            { value: "A", description: "Pengaruh kadar gula terhadap ketebalan nata" },
            { value: "B", description: "Pengaruh suhu inkubasi terhadap kualitas nata" },
            { value: "C", description: "Pengaruh konsentrasi starter terhadap keberhasilan fermentasi" },
            { value: "D", description: "Perbandingan nata de nanas dan nata de coco" },
          ]}
          answers={answers}
          onChange={onAnswerChange}
        />
        <DottedTextarea id="p4-focus-reason" label="Alasan:" rows={4} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="4" phaseTitle="Penataan Tugas Belajar">
        <p>Susunlah langkah penyelidikan mulai dari perancangan percobaan, pelaksanaan, pengamatan berkala, pengolahan data, hingga pelaporan.</p>
        <p>Rancanglah percobaan fermentasi nata de nanas yang sesuai dengan fokus variabel yang dipilih: tentukan perlakuan yang akan diuji, variabel kontrol, parameter yang diamati, dan jadwal pengamatan.</p>
        <RoleTable tableId="p4-roles" roles={["Perancang Percobaan - menyusun prosedur fermentasi", "Pelaksana & Pengamat - menyiapkan bahan dan mengamati proses", "Analis Data - mengolah dan menafsirkan hasil pengamatan", "Penyaji - melaporkan hasil percobaan"]} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black">(Tahap Persiapan)</p>
        <p>Tentukan tujuan percobaan timmu, atur jadwal pengamatan selama 7-10 hari, dan pastikan setiap anggota memahami prosedur fermentasi serta peran masing-masing sebelum percobaan dimulai.</p>
        <p className="font-black">(Tahap Inkubasi)</p>
        <p>Diskusikan dan putuskan strategi percobaan yang paling tepat: bagaimana menyiapkan sampel dengan perlakuan berbeda, apa parameter yang diamati setiap 2 hari, dan bagaimana cara mencatat data secara konsisten.</p>
        <p className="font-black">(Tahap Iluminasi)</p>
        <p>Laksanakan percobaan fermentasi sesuai prosedur yang telah dirancang. Amati dan catat perkembangan nata pada tabel pengamatan setiap 2 hari, serta telusuri literatur pendukung untuk memperkuat analisis data.</p>
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black underline text-[#24395B]">Prosedur Percobaan Fermentasi Nata de Nanas:</p>
        <p className="font-black">Alat & Bahan:</p>
        <ul className="list-disc pl-5">
          <li>Air perasan nanas segar 500 mL</li>
          <li>Gula pasir 50 gram</li>
          <li>Cuka makan / asam asetat untuk mengatur pH</li>
          <li>Starter Acetobacter xylinum (nata jadi sebagai inokulum)</li>
          <li>Wadah plastik / nampan tertutup</li>
          <li>Kain bersih, termometer, timbangan, dan penggaris</li>
        </ul>
        <p className="font-black">Langkah Kerja:</p>
        <ol className="list-decimal pl-5">
          <li>Panaskan air nanas hingga mendidih, tambahkan gula, aduk hingga larut.</li>
          <li>Dinginkan hingga sekitar 30 derajat C, tambahkan cuka hingga pH 3-4.</li>
          <li>Tuang ke dalam wadah bersih setinggi 3-4 cm.</li>
          <li>Tambahkan starter Acetobacter xylinum secukupnya, sekitar 10 persen dari volume.</li>
          <li>Tutup wadah dengan kain bersih, ikat rapat.</li>
          <li>Inkubasi di tempat gelap dan tidak terganggu selama 7-10 hari pada suhu ruang.</li>
          <li>Amati perkembangan setiap 2 hari.</li>
        </ol>
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black underline text-[#24395B]">Tabel Rancangan Percobaan:</p>
        <WorksheetTable tableId="p4-design" columns={["Komponen", "Isi"]} rows={[["Judul Percobaan", ""], ["Tujuan", ""], ["Perlakuan yang Diuji", ""]]} answers={answers} onChange={onAnswerChange} dense />
        <p className="font-black underline text-[#24395B]">Tabel Pengamatan:</p>
        <WorksheetTable tableId="p4-observation" columns={["Hari ke-", "Ketebalan nata (cm)", "Warna", "Tekstur", "Bau", "Keterangan"]} rows={["2", "4", "6", "8"].map((day) => [day, "", "", "", "", ""])} answers={answers} onChange={onAnswerChange} dense />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <p className="font-black">(Tahap Verifikasi)</p>
        <p className="font-black text-red-500">Analisis hasil pengamatanmu:</p>
        <ol className="list-decimal pl-5">
          <li>Hubungkan data yang diperoleh dengan faktor yang memengaruhi fermentasi.</li>
          <li>Jelaskan peran Acetobacter xylinum berdasarkan bukti yang ada.</li>
          <li>Berikan alasan ilmiah atas kesimpulan yang dirumuskan timmu.</li>
        </ol>
        <DottedTextarea id="p4-analysis-role" label="Peran Acetobacter xylinum:" rows={5} answers={answers} onChange={onAnswerChange} />
        <DottedTextarea id="p4-analysis-factor" label="Hubungan hasil dengan faktor fermentasi:" rows={5} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="5" phaseTitle="Memfasilitasi Aktivitas Open-Ended Dalam Kelompok">
        <DottedTextarea id="p4-conclusion" label="Kesimpulan:" rows={10} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
      <WorksheetPage meeting="p4" phase="6" phaseTitle="Evaluasi dan Grading">
        <p>Presentasikan hasil percobaan fermentasi kelompokmu secara sistematis: rancangan, data pengamatan, analisis, dan kesimpulan.</p>
        <p>Pertahankan kesimpulan kelompokmu dengan argumen yang logis berdasarkan data pengamatan fermentasi yang telah dikumpulkan selama 7-10 hari.</p>
        <p>Gunakan data percobaan dan literatur ilmiah untuk menanggapi pertanyaan atau sanggahan dari kelompok lain secara kritis dan berbasis bukti.</p>
        <p>Identifikasi kelemahan pada rancangan percobaan atau kesimpulan yang kurang didukung data, baik milik timmu maupun tim lain, dan berikan koreksi atau saran perbaikan yang tepat.</p>
        <p className="font-black underline text-[#24395B]">Refleksi Kelompok Pertemuan 4:</p>
        <WorksheetTable tableId="p4-reflection" columns={["Hal yang sudah dipahami", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
      </WorksheetPage>
    </>
  );
}

function LkpdContent({
  activeMeeting,
  joinedGroup,
  answers,
  onAnswerChange,
}: {
  activeMeeting: MeetingId;
  joinedGroup: GroupData;
  currentGroupCode: string;
  answers: AnswerMap;
  onAnswerChange: (id: string, value: string) => void;
}) {
  const meeting = meetings.find((item) => item.id === activeMeeting) ?? meetings[0];

  return (
    <div className={cx("flex-1 overflow-y-auto", getTheme(meeting.id).outer)}>
      <motion.section
        key={meeting.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 p-4 md:p-6"
      >
        <WorksheetCoverPage meeting={meeting.id} group={joinedGroup} />
        <FrontMatterPages meeting={meeting.id} />
        {meeting.id === "p1" && <MeetingOnePages answers={answers} onAnswerChange={onAnswerChange} />}
        {meeting.id === "p2" && <MeetingTwoPages answers={answers} onAnswerChange={onAnswerChange} />}
        {meeting.id === "p3" && <MeetingThreePages answers={answers} onAnswerChange={onAnswerChange} />}
        {meeting.id === "p4" && <MeetingFourPages answers={answers} onAnswerChange={onAnswerChange} />}
      </motion.section>
    </div>
  );
}

export default function LkpdWorkspacePage() {
  const { userState, loginSession, logoutSession } = useGroupSession();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"buat" | "gabung">("buat");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [joinedGroup, setJoinedGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentTopic] = useState<Topic>("bakteri");
  const activeMeeting = getMeetingId(searchParams.get("meeting"));
  const isDemoMode = useSyncExternalStore(
    subscribeToDemoMode,
    isLkpdDemoModeEnabled,
    getDemoModeServerSnapshot,
  );

  const [lkpdData, setLkpdData] = useState<ExtendedLKPDItem>({
    tugas: "",
    inkubasi: "",
    iluminasi: "",
    verifikasi: "",
    answers: {},
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [membersOpen, setMembersOpen] = useState(false);
  const currentGroupCode = joinedGroup?.groupCode ?? "";

  useEffect(() => {
    if (isDemoMode) return;

    if (userState && !joinedGroup) {
      const autoJoin = async () => {
        setLoading(true);
        const groupData = await getGroupData(userState.groupCode);

        if (groupData) {
          setJoinedGroup(groupData);
          setName(userState.userName);
        } else {
          logoutSession();
        }
        setLoading(false);
      };
      autoJoin();
    }
  }, [userState, joinedGroup, logoutSession, isDemoMode]);

  const loadLKPDByTopic = useCallback(async (topic: Topic) => {
    if (!currentGroupCode) return;
    const groupData = await getGroupData(currentGroupCode);
    const data = groupData?.lkpd?.[topic] as ExtendedLKPDItem | undefined;
    setLkpdData({
      tugas: data?.tugas ?? "",
      inkubasi: data?.inkubasi ?? "",
      iluminasi: data?.iluminasi ?? "",
      verifikasi: data?.verifikasi ?? "",
      answers: seedAnswers(data),
    });
  }, [currentGroupCode]);

  useEffect(() => {
    if (!currentGroupCode) return;
    const initData = async () => {
      await loadLKPDByTopic(currentTopic);
    };
    initData();
  }, [currentGroupCode, currentTopic, loadLKPDByTopic]);

  const updateAnswer = (id: string, value: string) => {
    setLkpdData((current) => ({
      ...current,
      answers: {
        ...(current.answers ?? {}),
        [id]: value,
      },
    }));
  };

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const result = await createGroup(groupName, name);
    if (result.success) {
      setJoinedGroup(result.group as GroupData);
      loginSession(name, result.group.groupCode, result.group.groupName);
    } else {
      setErrorMsg(result.message || "Gagal membuat kelompok");
    }
    setLoading(false);
  };

  const handleJoinGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const result = await joinGroup(code, name);
    if (result.success) {
      setJoinedGroup(result.group as GroupData);
      loginSession(name, result.group.groupCode, result.group.groupName);
    } else {
      setErrorMsg(result.message || "Gagal bergabung");
    }
    setLoading(false);
  };

  const handleSaveLKPD = async () => {
    if (!currentGroupCode) return;
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const nextData: ExtendedLKPDItem = {
      ...lkpdData,
      tugas: lkpdData.answers?.["p1-roles-summary"] ?? lkpdData.tugas,
      inkubasi: lkpdData.answers?.["p1-hypothesis"] ?? lkpdData.inkubasi,
      iluminasi: lkpdData.answers?.["p1-team-result"] ?? lkpdData.iluminasi,
      verifikasi: lkpdData.answers?.["p4-conclusion"] ?? lkpdData.verifikasi,
    };

    const result = await saveLKPD(currentGroupCode, currentTopic, nextData);
    setIsSaving(false);

    if (!result.success) {
      setSaveError(result.message || "Gagal menyimpan LKPD");
      return;
    }

    setLkpdData(nextData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari kelompok ini di perangkat ini?")) {
      logoutSession();
      setJoinedGroup(null);
      setName("");
      setMembersOpen(false);
    }
  };

  if (isDemoMode || (joinedGroup && currentGroupCode)) {
    const activeGroup = isDemoMode ? demoGroup : joinedGroup;
    if (!activeGroup) return null;

    const members = activeGroup.members ?? [];
    const activeGroupCode = isDemoMode ? demoGroup.groupCode : currentGroupCode;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-[calc(100dvh-5.5rem)] flex-col overflow-hidden bg-white dark:bg-slate-950 md:h-dvh"
      >
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h2 className="line-clamp-1 text-sm font-bold text-slate-800 dark:text-slate-100 md:text-base">{activeGroup.groupName}</h2>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded border border-pastel-blue/30 bg-pastel-light px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-pastel-dark dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                {activeGroupCode}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                {isDemoMode ? "Mode Pratinjau" : `${members.length} Anggota`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMembersOpen((open) => !open)}
                className="flex -space-x-2 rounded-full outline-none ring-pastel-blue/40 transition hover:brightness-95 focus-visible:ring-2"
                title="Lihat anggota kelompok"
                aria-label="Lihat anggota kelompok"
                aria-expanded={membersOpen}
              >
                {members.slice(0, 3).map((member: string) => (
                  <span
                    key={member}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pastel-blue text-[10px] font-bold text-white shadow-sm dark:border-slate-950 dark:bg-slate-700"
                    title={member}
                  >
                    {member.charAt(0).toUpperCase()}
                  </span>
                ))}
                {members.length > 3 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 dark:border-slate-950 dark:bg-slate-800 dark:text-slate-200">
                    +{members.length - 3}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {membersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-10 z-30 w-64 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <Users size={15} className="text-pastel-dark" />
                        Anggota Kelompok
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {members.length}
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                      {members.map((member: string) => (
                        <div key={member} className="flex items-center gap-3 rounded-lg px-2 py-2 dark:hover:bg-slate-800">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pastel-blue text-xs font-bold text-white dark:bg-slate-700">
                            {member.charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{member}</span>
                          {!isDemoMode && member === name && (
                            <span className="rounded-full bg-pastel-light px-2 py-0.5 text-[10px] font-bold text-pastel-dark dark:bg-slate-800 dark:text-slate-200">
                              Kamu
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isDemoMode && (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 p-2 text-red-400 transition-colors hover:text-red-600"
                title="Keluar Kelompok"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
          <span className="inline-flex items-center gap-2 rounded-full bg-pastel-dark px-4 py-2 text-xs font-bold text-white dark:bg-slate-700">
            <Dna size={14} /> Bakteri
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Pilih pertemuan dari sidebar atau tombol bawah</span>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#F8FAFC] dark:bg-slate-950">
          <div className="absolute inset-0 flex flex-col bg-white dark:bg-slate-950">
            <LkpdContent
              activeMeeting={activeMeeting}
              joinedGroup={activeGroup}
              currentGroupCode={activeGroupCode}
              answers={lkpdData.answers ?? {}}
              onAnswerChange={updateAnswer}
            />

            {isDemoMode ? (
              <div className="shrink-0 border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="mx-auto max-w-3xl rounded-lg border border-pastel-blue/30 bg-pastel-light px-3 py-2 text-center text-xs font-bold text-pastel-dark dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  Mode pratinjau dosen: LKPD dapat dibuka tanpa membuat kelompok. Jawaban yang diketik tidak disimpan.
                </p>
              </div>
            ) : (
              <div className="shrink-0 border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveLKPD}
                  disabled={isSaving}
                  className={cx(
                    "mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300",
                    saveSuccess ? "bg-green-500 text-white" : "bg-pastel-green text-slate-800 hover:bg-[#a1ceb4] dark:bg-emerald-700 dark:text-white dark:hover:bg-emerald-600",
                  )}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                  {saveSuccess ? "LKPD Bakteri tersimpan" : "Simpan LKPD Bakteri"}
                </motion.button>
                {saveError && (
                  <p className="mx-auto mt-2 max-w-3xl rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
                    {saveError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (loading && userState && !joinedGroup) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-pastel-dark">
        <Loader2 className="mb-4 animate-spin" size={40} />
        <p className="font-bold">Memuat ruang kerja Anda...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
        className="mx-auto mt-2 max-w-md sm:mt-4 md:mt-10"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 md:text-3xl">Ruang Kolaborasi</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sintaks 3: Pembentukan Tim</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("buat")}
            className={cx(
              "flex-1 py-3.5 text-sm font-bold transition-colors",
              activeTab === "buat" ? "bg-slate-50 text-pastel-dark dark:bg-slate-800 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
          >
            Buat Kelompok
          </button>
          <button
            onClick={() => setActiveTab("gabung")}
            className={cx(
              "flex-1 py-3.5 text-sm font-bold transition-colors",
              activeTab === "gabung" ? "bg-slate-50 text-pastel-dark dark:bg-slate-800 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
          >
            Gabung Kelompok
          </button>

          <motion.div
            className="absolute bottom-0 h-0.5 w-1/2 bg-pastel-dark"
            animate={{ left: activeTab === "buat" ? "0%" : "50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="p-6">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-500 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
              >
                {errorMsg}
              </motion.div>
            )}

            {activeTab === "buat" ? (
              <motion.form
                key="form-buat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCreateGroup}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama Kamu (Ketua)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Nama Kelompok"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-pastel-dark py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Buat & Dapatkan Kode"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="form-gabung"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleJoinGroup}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama Kamu (Anggota)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="Kode Kelompok (6 Digit)"
                  maxLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-pastel-blue/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-pastel-green py-3 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-[#a1ceb4] dark:bg-emerald-700 dark:text-white dark:hover:bg-emerald-600"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Gabung Sekarang"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
