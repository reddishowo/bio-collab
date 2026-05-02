"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Check,
  ClipboardList,
  Dna,
  Lightbulb,
  Loader2,
  LogOut,
  Save,
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

function InfoPanel({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-pastel-light text-pastel-dark flex items-center justify-center border border-pastel-blue/30">
          {icon}
        </div>
        <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
      </div>
      <div className="text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function PhaseSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 bg-pastel-dark px-4 py-3 text-white">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-black">
          {number}
        </span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Sintaks {number}</p>
          <h3 className="text-sm font-extrabold">{title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-4 md:p-5">{children}</div>
    </section>
  );
}

function PromptBox({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: ReactNode;
  tone?: "blue" | "green" | "yellow";
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-4 text-sm leading-7",
        tone === "green" && "bg-pastel-green/20 border-pastel-green/60 text-slate-700",
        tone === "yellow" && "bg-yellow-50 border-yellow-200 text-slate-700",
        tone === "blue" && "bg-pastel-light border-pastel-blue/40 text-slate-700",
      )}
    >
      <p className="mb-2 font-extrabold text-pastel-dark">{title}</p>
      {children}
    </div>
  );
}

function AnswerArea({
  id,
  label,
  placeholder,
  rows = 4,
  answers,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  rows?: number;
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-extrabold text-slate-800">{label}</span>
      <textarea
        value={answers[id] ?? ""}
        onChange={(event) => onChange(id, event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-pastel-dark focus:bg-white focus:ring-2 focus:ring-pastel-blue/40 placeholder:text-slate-400"
      />
    </label>
  );
}

function EditableTable({
  tableId,
  columns,
  rows,
  answers,
  onChange,
}: {
  tableId: string;
  columns: string[];
  rows: string[][];
  answers: AnswerMap;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-pastel-dark text-white">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-extrabold whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${tableId}-${rowIndex}`} className="border-t border-slate-200 odd:bg-white even:bg-slate-50/70">
              {columns.map((_, cellIndex) => {
                const cell = row[cellIndex] ?? "";
                const key = `${tableId}-${rowIndex}-${cellIndex}`;
                return (
                  <td key={key} className="min-w-40 px-3 py-2 align-top text-slate-700">
                    {cell ? (
                      <span className={cellIndex === 0 ? "font-bold text-slate-800" : ""}>{cell}</span>
                    ) : (
                      <textarea
                        value={answers[key] ?? ""}
                        onChange={(event) => onChange(key, event.target.value)}
                        rows={2}
                        className="h-16 w-full min-w-44 resize-y rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-pastel-dark focus:ring-2 focus:ring-pastel-blue/40"
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

function ChoiceTable({
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
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-pastel-dark text-white">
          <tr>
            <th className="px-3 py-3 font-extrabold">Fokus</th>
            <th className="px-3 py-3 font-extrabold">Deskripsi</th>
            <th className="px-3 py-3 font-extrabold">Pilih</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <tr key={option.value} className="border-t border-slate-200 odd:bg-white even:bg-slate-50/70">
                <td className="px-3 py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pastel-light text-xs font-black text-pastel-dark">
                    {option.value}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700">{option.description}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onChange(`${tableId}-selected`, option.value)}
                    className={cx(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                      isSelected
                        ? "border-pastel-dark bg-pastel-dark text-white"
                        : "border-slate-200 bg-white text-slate-400 hover:border-pastel-dark hover:text-pastel-dark",
                    )}
                    aria-label={`Pilih fokus ${option.value}`}
                  >
                    {isSelected && <Check size={16} />}
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
    <EditableTable
      tableId={tableId}
      columns={["Peran", "Nama Anggota"]}
      rows={roles.map((role) => [role, ""])}
      answers={answers}
      onChange={onChange}
    />
  );
}

function Rubric({ items }: { items: string[] }) {
  return (
    <PromptBox title="Rubrik Penilaian" tone="green">
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </PromptBox>
  );
}

function LkpdContent({
  activeMeeting,
  joinedGroup,
  currentGroupCode,
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
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="space-y-5 p-4 md:p-6">
        <section className="rounded-2xl border border-pastel-blue/30 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-pastel-dark">LKPD Bakteri</p>
              <h2 className="mt-1 text-xl font-black text-slate-800 md:text-2xl">Lembar Kerja Peserta Didik</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Kelas X SMA/MA, Kurikulum 2013, model Open-Ended Collaborative Learning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-pastel-light p-3 text-xs text-slate-600 md:min-w-64">
              <span className="font-bold text-slate-500">Kelompok</span>
              <span className="text-right font-black text-pastel-dark">{joinedGroup.groupName}</span>
              <span className="font-bold text-slate-500">Kode</span>
              <span className="text-right font-mono font-black tracking-widest text-pastel-dark">{currentGroupCode}</span>
              <span className="font-bold text-slate-500">Anggota</span>
              <span className="text-right font-black text-pastel-dark">{joinedGroup.members.length}</span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoPanel icon={<ClipboardList size={18} />} title="Capaian Pembelajaran">
            Menerapkan prinsip klasifikasi, mendeskripsikan peranan bakteri dalam kehidupan, dan menggunakan
            kerja ilmiah untuk menganalisis data serta bukti.
          </InfoPanel>
          <InfoPanel icon={<Lightbulb size={18} />} title="Tujuan Pembelajaran">
            Siswa memahami peranan bakteri, merancang uji pembusukan makanan, memahami bioteknologi, dan
            melakukan percobaan fermentasi nata de nanas.
          </InfoPanel>
          <InfoPanel icon={<BookOpen size={18} />} title="Petunjuk Penggunaan">
            Kerjakan LKPD secara berurutan melalui menu Pertemuan, diskusikan secara langsung bersama kelompok,
            lalu simpan pekerjaan sebelum berpindah perangkat.
          </InfoPanel>
        </div>

        <motion.section
          key={meeting.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-2xl bg-pastel-green p-5 text-slate-800 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider opacity-70">Pertemuan {meeting.number}</p>
            <h2 className="mt-1 text-xl font-black">{meeting.title}</h2>
            <p className="mt-1 text-sm font-semibold opacity-80">{meeting.subtitle} | 2 x 45 menit</p>
          </div>

          {meeting.id === "p1" && (
            <>
              <PhaseSection number="01" title="Mengorientasi Siswa">
                <div className="grid gap-3 md:grid-cols-2">
                  <PromptBox title="Berita 1" tone="green">
                    Bakteri digunakan untuk menghasilkan insulin bagi penderita diabetes sehingga membantu
                    menyelamatkan banyak pasien.
                  </PromptBox>
                  <PromptBox title="Berita 2" tone="yellow">
                    Wabah kolera dapat menewaskan ribuan orang di negara berkembang setiap tahun.
                  </PromptBox>
                </div>
                <PromptBox title="Pertanyaan Pemantik">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Makhluk yang sama bisa menyelamatkan jiwa sekaligus mengancam nyawa. Bagaimana hal ini bisa terjadi?</li>
                    <li>Apakah semua bakteri berbahaya?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p1-opinion" label="Pendapat Awal" placeholder="Tulis pendapat awal kelompokmu..." answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="02" title="Pemberian Masalah Open-Ended">
                <PromptBox title="Masalah Open-Ended" tone="yellow">
                  Sebuah desa terpencil mengalami dua masalah: tanah pertanian tidak subur karena kekurangan
                  nitrogen, dan warga sering terserang diare akibat air yang terkontaminasi bakteri. Rancanglah
                  dua solusi berbasis bakteri untuk masalah pertanian dan kesehatan.
                </PromptBox>
                <PromptBox title="Pertanyaan">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Bakteri apa yang dapat membantu pertanian? Bagaimana mekanismenya?</li>
                    <li>Bakteri apa yang menyebabkan diare? Bagaimana pencegahannya?</li>
                    <li>Apakah solusimu bisa menimbulkan risiko baru?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p1-hypothesis" label="Hipotesis" placeholder="Tuliskan hipotesis dan alasan ilmiahnya..." rows={5} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="03" title="Menemukan Tim Kolaborasi">
                <ChoiceTable
                  tableId="p1-focus"
                  options={[
                    { value: "A", description: "Bakteri menguntungkan di bidang pertanian (Rhizobium, Azotobacter)" },
                    { value: "B", description: "Bakteri menguntungkan di bidang kesehatan dan industri" },
                    { value: "C", description: "Bakteri patogen dan penyakit yang ditimbulkan" },
                    { value: "D", description: "Upaya pencegahan dan pengendalian bakteri patogen" },
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="04" title="Penataan Tugas Belajar">
                <RoleTable
                  tableId="p1-roles"
                  roles={[
                    "Peneliti Manfaat - mencari spesies bakteri dan mekanisme yang relevan",
                    "Analis Risiko - mengidentifikasi potensi risiko dari solusi",
                    "Perancang Solusi - menyusun langkah implementasi solusi",
                    "Penyaji - mempresentasikan rancangan solusi kepada kelas",
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
                <AnswerArea id="p1-roles-summary" label="Catatan Pembagian Tugas" placeholder="Tambahkan catatan pembagian tugas kelompok..." answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="05" title="Memfasilitasi Aktivitas Open-Ended dalam Tim">
                <PromptBox title="Panduan Diskusi">
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>Spesies bakteri apa yang akan digunakan? Jelaskan mekanisme kerjanya secara ilmiah.</li>
                    <li>Bagaimana memastikan bakteri yang digunakan tidak membahayakan warga?</li>
                    <li>Bandingkan solusi kalian dengan solusi konvensional.</li>
                    <li>Apakah ada kondisi saat solusi berbasis bakteri tidak disarankan?</li>
                  </ol>
                </PromptBox>
                <EditableTable tableId="p1-benefit-map" columns={["Bidang", "Nama Bakteri", "Manfaat"]} rows={Array.from({ length: 4 }, () => ["", "", ""])} answers={answers} onChange={onAnswerChange} />
                <EditableTable tableId="p1-pathogen-map" columns={["Penyakit", "Bakteri Penyebab", "Cara Penularan", "Pencegahan"]} rows={Array.from({ length: 5 }, () => ["", "", "", ""])} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p1-team-result" label="Hasil Diskusi Kelompok" placeholder="Rangkum solusi, risiko, dan keputusan kelompok..." rows={6} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="06" title="Evaluasi dan Grading">
                <Rubric items={["4 = Solusi kreatif, ilmiah, mempertimbangkan risiko secara kritis", "3 = Solusi tepat secara ilmiah, risiko kurang dipertimbangkan", "2 = Solusi ada namun justifikasi ilmiah lemah", "1 = Solusi tidak relevan atau tidak ada justifikasi"]} />
                <EditableTable tableId="p1-reflection" columns={["Hal baru yang kami pelajari", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>
            </>
          )}

          {meeting.id === "p2" && (
            <>
              <PhaseSection number="01" title="Mengorientasi Siswa">
                <PromptBox title="Stimulus" tone="yellow">
                  Guru menampilkan makanan segar dan makanan yang telah membusuk seperti roti, buah, dan daging.
                </PromptBox>
                <PromptBox title="Pertanyaan Pemantik">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Pernahkah kamu menyimpan makanan di luar kulkas lalu keesokannya berbau atau berlendir?</li>
                    <li>Apa yang sebenarnya terjadi? Siapa penyebabnya?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p2-answer" label="Jawaban" placeholder="Tulis jawaban awal kelompokmu..." answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="02" title="Pemberian Masalah Open-Ended">
                <PromptBox title="Masalah Open-Ended" tone="yellow">
                  Seorang pedagang makanan mengeluhkan rotinya selalu berjamur dan berbau dalam dua hari
                  walaupun disimpan tertutup. Ia ingin mengetahui apakah suhu, kelembapan, atau jenis kemasan
                  memengaruhi kecepatan pembusukan.
                </PromptBox>
                <PromptBox title="Pertanyaan">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Faktor apa saja yang memengaruhi kecepatan pembusukan makanan?</li>
                    <li>Bagaimana merancang percobaan sederhana untuk membuktikannya?</li>
                    <li>Bagaimana cara menghambat pertumbuhan bakteri pembusuk?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p2-hypothesis" label="Hipotesis" placeholder="Tuliskan dugaan dan variabel percobaan..." rows={5} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="03" title="Menemukan Tim Kolaborasi">
                <ChoiceTable
                  tableId="p2-focus"
                  options={[
                    { value: "A", description: "Pengaruh suhu terhadap kecepatan pembusukan" },
                    { value: "B", description: "Pengaruh kemasan atau paparan udara terhadap pembusukan" },
                    { value: "C", description: "Pengaruh kadar air atau kelembapan terhadap pembusukan" },
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="04" title="Penataan Tugas Belajar">
                <RoleTable
                  tableId="p2-roles"
                  roles={[
                    "Perancang Percobaan - menyusun prosedur uji",
                    "Pengamat dan Pencatat - mengamati serta mencatat perubahan",
                    "Analis Data - mengolah dan menafsirkan hasil pengamatan",
                    "Penyaji - mempresentasikan hasil percobaan",
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="05" title="Memfasilitasi Aktivitas Open-Ended dalam Tim">
                <EditableTable tableId="p2-design" columns={["Komponen", "Isi"]} rows={[["Judul Percobaan", ""], ["Tujuan", ""], ["Alat dan Bahan", ""], ["Prosedur Kerja", ""]]} answers={answers} onChange={onAnswerChange} />
                <p className="text-xs font-semibold italic text-slate-500">Amati warna, bau, tekstur, ada atau tidaknya lendir/jamur selama 3-4 hari.</p>
                <EditableTable tableId="p2-observation" columns={["Hari ke-", "Kondisi Sampel A", "Kondisi Sampel B", "Kondisi Sampel C", "Keterangan"]} rows={["1", "2", "3", "4"].map((day) => [day, "", "", "", ""])} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p2-analysis" label="Analisis dan Kesimpulan" placeholder="Jelaskan pola data dan simpulan percobaan..." rows={6} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="06" title="Evaluasi dan Grading">
                <Rubric items={["4 = Rancangan percobaan lengkap, data akurat, analisis ilmiah dan kritis", "3 = Rancangan tepat, data ada, analisis kurang mendalam", "2 = Rancangan kurang sistematis, data tidak lengkap", "1 = Percobaan tidak dirancang atau tidak ada data"]} />
                <EditableTable tableId="p2-reflection" columns={["Hal yang sudah dipahami", "Hal yang belum dipahami"]} rows={[["", ""], ["", ""]]} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>
            </>
          )}

          {meeting.id === "p3" && (
            <>
              <PhaseSection number="01" title="Mengorientasi Siswa">
                <PromptBox title="Stimulus" tone="green">
                  Guru menampilkan produk bioteknologi seperti yogurt, tempe, biogas, insulin, dan pupuk hayati.
                </PromptBox>
                <PromptBox title="Pertanyaan Pemantik">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Apa kesamaan produk-produk tersebut?</li>
                    <li>Mengapa manusia memanfaatkan bakteri dan bukan membuat semuanya secara kimiawi?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p3-answer" label="Jawaban" placeholder="Tulis hasil diskusi awal..." answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="02" title="Pemberian Masalah Open-Ended">
                <PromptBox title="Masalah Open-Ended" tone="green">
                  Sebuah startup ingin memproduksi pupuk hayati ramah lingkungan dari bakteri pengikat nitrogen
                  dan mengolah limbah organik menjadi biogas menggunakan bakteri metanogen.
                </PromptBox>
                <PromptBox title="Pertanyaan">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Bakteri apa yang tepat digunakan untuk masing-masing tujuan?</li>
                    <li>Apa keunggulan produk bioteknologi dibanding produk kimia konvensional?</li>
                    <li>Apa tantangan dan risikonya jika diterapkan dalam skala besar?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p3-hypothesis" label="Hipotesis" placeholder="Tuliskan dugaan, mekanisme, dan alasan..." rows={5} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="03" title="Menemukan Tim Kolaborasi">
                <ChoiceTable
                  tableId="p3-focus"
                  options={[
                    { value: "A", description: "Bioteknologi pangan - fermentasi yogurt, keju, tempe, kecap" },
                    { value: "B", description: "Bioteknologi pertanian - pupuk hayati dan fiksasi nitrogen" },
                    { value: "C", description: "Bioteknologi kesehatan - insulin, vaksin, antibiotik" },
                    { value: "D", description: "Bioteknologi lingkungan - biogas dan pengolahan limbah" },
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="04" title="Penataan Tugas Belajar">
                <RoleTable
                  tableId="p3-roles"
                  roles={[
                    "Peneliti - mencari spesies bakteri dan mekanisme bioteknologi",
                    "Analis Keunggulan - membandingkan dengan metode konvensional",
                    "Analis Risiko - mengidentifikasi risiko penerapan skala besar",
                    "Penyaji - mempresentasikan hasil diskusi",
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="05" title="Memfasilitasi Aktivitas Open-Ended dalam Tim">
                <PromptBox title="Soal Diskusi Kelompok" tone="green">
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>Spesies bakteri apa yang digunakan dalam bidang fokus tim?</li>
                    <li>Bagaimana mekanisme biokimia yang terjadi?</li>
                    <li>Apa keunggulannya dibanding cara konvensional?</li>
                    <li>Apakah ada risiko kesehatan atau ekologi?</li>
                  </ol>
                </PromptBox>
                <EditableTable tableId="p3-biotech-map" columns={["Bidang", "Nama Bakteri", "Produk", "Keunggulan"]} rows={Array.from({ length: 4 }, () => ["", "", "", ""])} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p3-conclusion" label="Kesimpulan Kelompok" placeholder="Tuliskan kesimpulan berdasarkan peta bioteknologi..." rows={6} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="06" title="Evaluasi dan Grading">
                <Rubric items={["4 = Mekanisme bioteknologi tepat, analisis keunggulan dan risiko lengkap", "3 = Mekanisme tepat, analisis risiko kurang", "2 = Mekanisme sebagian tepat, keunggulan tidak dianalisis", "1 = Tidak ada penjelasan mekanisme atau tidak relevan"]} />
                <EditableTable tableId="p3-reflection" columns={["Hal yang sudah dipahami", "Hal yang belum dipahami"]} rows={[["", ""]]} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>
            </>
          )}

          {meeting.id === "p4" && (
            <>
              <PhaseSection number="01" title="Mengorientasi Siswa">
                <PromptBox title="Stimulus" tone="green">
                  Guru menampilkan produk nata de nanas yang sudah jadi beserta air nanas segar sebagai bahan baku.
                </PromptBox>
                <PromptBox title="Pertanyaan Pemantik">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Pernahkah kamu makan nata? Tahukah kamu lapisan kenyal itu dibuat oleh bakteri?</li>
                    <li>Bagaimana bakteri mengubah air nanas menjadi makanan bertekstur kenyal?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p4-answer" label="Jawaban" placeholder="Tulis jawaban awal kelompokmu..." answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="02" title="Pemberian Masalah Open-Ended">
                <PromptBox title="Masalah Open-Ended" tone="yellow">
                  Seorang pengusaha ingin memproduksi nata de nanas skala rumahan. Ia ingin mengetahui apakah
                  kadar gula, suhu fermentasi, atau ketebalan lapisan starter Acetobacter xylinum memengaruhi
                  kualitas dan ketebalan nata.
                </PromptBox>
                <PromptBox title="Pertanyaan">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Faktor apa yang paling berpengaruh terhadap keberhasilan fermentasi nata?</li>
                    <li>Bagaimana peran Acetobacter xylinum dalam membentuk lapisan nata?</li>
                    <li>Bagaimana merancang percobaan sederhana untuk menjawab pertanyaan tersebut?</li>
                  </ul>
                </PromptBox>
                <AnswerArea id="p4-hypothesis" label="Jawaban / Hipotesis" placeholder="Tulis jawaban dan rancangan awal..." rows={5} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="03" title="Menemukan Tim Kolaborasi">
                <ChoiceTable
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
              </PhaseSection>

              <PhaseSection number="04" title="Penataan Tugas Belajar">
                <RoleTable
                  tableId="p4-roles"
                  roles={[
                    "Perancang Percobaan - menyusun prosedur fermentasi",
                    "Pelaksana dan Pengamat - menyiapkan bahan dan mengamati proses",
                    "Analis Data - mengolah dan menafsirkan hasil pengamatan",
                    "Penyaji - melaporkan hasil percobaan kepada kelas",
                  ]}
                  answers={answers}
                  onChange={onAnswerChange}
                />
              </PhaseSection>

              <PhaseSection number="05" title="Memfasilitasi Aktivitas Open-Ended dalam Tim">
                <PromptBox title="Prosedur Percobaan Fermentasi Nata de Nanas" tone="green">
                  <p className="font-bold">Alat dan bahan: air perasan nanas 500 mL, gula 50 gram, cuka/asam asetat, starter Acetobacter xylinum, wadah, kain bersih, termometer, timbangan, dan penggaris.</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    <li>Panaskan air nanas hingga mendidih, tambahkan gula, lalu aduk hingga larut.</li>
                    <li>Dinginkan hingga sekitar 30 derajat C, tambahkan cuka hingga pH 3-4.</li>
                    <li>Tuang ke wadah bersih setinggi 3-4 cm dan tambahkan starter 10 persen volume.</li>
                    <li>Tutup dengan kain bersih dan inkubasi 7-10 hari pada suhu ruang.</li>
                    <li>Amati dan catat perkembangan setiap dua hari.</li>
                  </ol>
                </PromptBox>
                <EditableTable tableId="p4-design" columns={["Komponen", "Isi"]} rows={[["Judul Percobaan", ""], ["Tujuan", ""], ["Perlakuan yang Diuji", ""]]} answers={answers} onChange={onAnswerChange} />
                <p className="text-xs font-semibold italic text-slate-500">Amati warna, bau, tekstur, dan ketebalan nata.</p>
                <EditableTable tableId="p4-observation" columns={["Hari ke-", "Ketebalan Nata (cm)", "Warna", "Tekstur", "Bau", "Keterangan"]} rows={["2", "4", "6", "8"].map((day) => [day, "", "", "", "", ""])} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p4-analysis-role" label="Peran Acetobacter xylinum" placeholder="Jelaskan peran bakteri dalam pembentukan lapisan nata..." rows={4} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p4-analysis-factor" label="Hubungan Hasil dengan Faktor Fermentasi" placeholder="Hubungkan hasil pengamatan dengan faktor yang diuji..." rows={4} answers={answers} onChange={onAnswerChange} />
                <AnswerArea id="p4-conclusion" label="Kesimpulan" placeholder="Tuliskan kesimpulan akhir percobaan..." rows={4} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>

              <PhaseSection number="06" title="Evaluasi dan Grading">
                <Rubric items={["4 = Percobaan terlaksana, data lengkap, analisis ilmiah mendalam dan kritis", "3 = Percobaan terlaksana, data ada, analisis cukup", "2 = Percobaan dilakukan namun data tidak lengkap atau analisis dangkal", "1 = Percobaan tidak dilakukan atau laporan tidak ada"]} />
                <EditableTable tableId="p4-reflection" columns={["Yang sudah dipahami", "Yang masih membingungkan", "Ingin tahu lebih lanjut"]} rows={[["", "", ""]]} answers={answers} onChange={onAnswerChange} />
              </PhaseSection>
            </>
          )}
        </motion.section>
      </div>
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

  const [lkpdData, setLkpdData] = useState<ExtendedLKPDItem>({
    tugas: "",
    inkubasi: "",
    iluminasi: "",
    verifikasi: "",
    answers: {},
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const currentGroupCode = joinedGroup?.groupCode ?? "";

  useEffect(() => {
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
  }, [userState, joinedGroup, logoutSession]);

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

    const nextData: ExtendedLKPDItem = {
      ...lkpdData,
      tugas: lkpdData.answers?.["p1-roles-summary"] ?? lkpdData.tugas,
      inkubasi: lkpdData.answers?.["p1-hypothesis"] ?? lkpdData.inkubasi,
      iluminasi: lkpdData.answers?.["p1-team-result"] ?? lkpdData.iluminasi,
      verifikasi: lkpdData.answers?.["p4-conclusion"] ?? lkpdData.verifikasi,
    };

    await saveLKPD(currentGroupCode, currentTopic, nextData);
    setLkpdData(nextData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari kelompok ini di perangkat ini?")) {
      logoutSession();
      setJoinedGroup(null);
      setName("");
    }
  };

  if (joinedGroup && currentGroupCode) {
    const members = joinedGroup.members ?? [];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="-mx-4 -mt-5 flex h-[calc(100dvh-6.75rem)] flex-col overflow-hidden border border-slate-100 bg-white shadow-sm sm:mx-0 sm:mt-0 sm:h-[calc(100dvh-8rem)] md:h-[calc(100vh-8rem)] md:rounded-3xl"
      >
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div>
            <h2 className="line-clamp-1 text-sm font-bold text-slate-800 md:text-base">{joinedGroup.groupName}</h2>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded border border-pastel-blue/30 bg-pastel-light px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-pastel-dark">
                {currentGroupCode}
              </span>
              <span className="text-[10px] font-medium text-slate-400">{members.length} Anggota</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member: string) => (
                <div
                  key={member}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pastel-blue text-[10px] font-bold text-white shadow-sm"
                  title={member}
                >
                  {member.charAt(0).toUpperCase()}
                </div>
              ))}
              {members.length > 3 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600">
                  +{members.length - 3}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-50 p-2 text-red-400 transition-colors hover:text-red-600"
              title="Keluar Kelompok"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-100 bg-white px-4 py-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-pastel-dark px-4 py-2 text-xs font-bold text-white">
            <Dna size={14} /> Bakteri
          </span>
          <span className="text-xs font-semibold text-slate-400">Pilih pertemuan dari sidebar atau tombol bawah</span>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#F8FAFC]">
          <div className="absolute inset-0 flex flex-col bg-white">
            <LkpdContent
              activeMeeting={activeMeeting}
              joinedGroup={joinedGroup}
              currentGroupCode={currentGroupCode}
              answers={lkpdData.answers ?? {}}
              onAnswerChange={updateAnswer}
            />

            <div className="shrink-0 border-t border-slate-100 bg-white p-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveLKPD}
                disabled={isSaving}
                className={cx(
                  "mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300",
                  saveSuccess ? "bg-green-500 text-white" : "bg-pastel-green text-slate-800 hover:bg-[#a1ceb4]",
                )}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                {saveSuccess ? "LKPD Bakteri tersimpan" : "Simpan LKPD Bakteri"}
              </motion.button>
            </div>
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
        <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">Ruang Kolaborasi</h1>
        <p className="mt-1 text-sm text-slate-500">Sintaks 3: Pembentukan Tim</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("buat")}
            className={cx(
              "flex-1 py-3.5 text-sm font-bold transition-colors",
              activeTab === "buat" ? "bg-slate-50 text-pastel-dark" : "text-slate-400 hover:text-slate-600",
            )}
          >
            Buat Kelompok
          </button>
          <button
            onClick={() => setActiveTab("gabung")}
            className={cx(
              "flex-1 py-3.5 text-sm font-bold transition-colors",
              activeTab === "gabung" ? "bg-slate-50 text-pastel-dark" : "text-slate-400 hover:text-slate-600",
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
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50"
                />
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Nama Kelompok"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pastel-blue/50"
                />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="Kode Kelompok (6 Digit)"
                  maxLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-pastel-blue/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-pastel-green py-3 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-[#a1ceb4]"
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
