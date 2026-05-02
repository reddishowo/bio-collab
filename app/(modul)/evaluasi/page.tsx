"use client";

import { useState, useEffect } from "react";
import { useGroupSession } from "@/components/GroupContext";
import { saveEvaluation, getGroupData } from "@/app/actions";
import { Loader2, CheckCircle, ShieldAlert, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- DATA KUIS INDIVIDU (DITAMBAH) ---
const quizQuestions = [
  {
    id: 'q1',
    question: 'Virus Corona (SARS-CoV-2) dapat terus bermutasi karena perubahan pada struktur...',
    options: ['Dinding Sel', 'Protein Spike', 'Membran Plasma', 'RNA Polimerase'],
    correctAnswer: 'Protein Spike'
  },
  {
    id: 'q2',
    question: 'Penyebab utama bakteri TBC menjadi kebal obat (MDR-TB) adalah...',
    options: ['Vaksinasi yang tidak lengkap', 'Pengobatan antibiotik yang tidak tuntas', 'Lingkungan yang terlalu bersih', 'Mutasi acak tanpa sebab'],
    correctAnswer: 'Pengobatan antibiotik yang tidak tuntas'
  },
  {
    id: 'q3',
    question: 'Jamur Rhizopus stolonifer pada roti dan Rhizopus oligosporus pada tempe menunjukkan bahwa genus yang sama dapat memiliki peran...',
    options: ['Hanya sebagai parasit', 'Hanya sebagai pengurai', 'Merugikan dan menguntungkan', 'Tidak berpengaruh pada makanan'],
    correctAnswer: 'Merugikan dan menguntungkan'
  },
  {
    id: 'q4',
    question: 'Kemampuan virus untuk hanya menginfeksi sel inang tertentu disebut...',
    options: ['Spesifisitas Inang', 'Siklus Litik', 'Virulensi', 'Kapsid'],
    correctAnswer: 'Spesifisitas Inang'
  },
  {
    id: 'q5',
    question: 'Manakah dari berikut ini yang BUKAN merupakan peran menguntungkan dari bakteri bagi manusia?',
    options: ['Produksi vitamin K di usus', 'Pembuatan yoghurt', 'Penyebab penyakit Tifus', 'Pengurai sampah organik'],
    correctAnswer: 'Penyebab penyakit Tifus'
  }
];

export default function EvaluasiPage() {
  const { userState } = useGroupSession();
  
  const [isLeader, setIsLeader] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [kelompokAnswer, setKelompokAnswer] = useState(''); // Jawaban uraian kelompok
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cek apakah user adalah ketua kelompok
  useEffect(() => {
    if (userState) {
      const checkLeaderStatus = async () => {
        const groupData = await getGroupData(userState.groupCode);
        if (groupData && groupData.members && groupData.members[0] === userState.userName) {
          setIsLeader(true);
        }
        setLoading(false);
      };
      checkLeaderStatus();
    } else {
      setLoading(false);
    }
  }, [userState]);

  const handleQuizChange = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi
    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      setErrorMsg('Harap isi semua pertanyaan evaluasi pengetahuan.');
      return;
    }
    if (isLeader && !kelompokAnswer.trim()) {
      setErrorMsg('Sebagai ketua, harap isi evaluasi kelompok.');
      return;
    }

    setIsSubmitting(true);

    // 1. Hitung Skor Pengetahuan
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) correctCount++;
    });
    const skorPengetahuan = Math.round((correctCount / quizQuestions.length) * 100);

    // 2. Siapkan data untuk dikirim
    const evaluationData: { skorPengetahuan: number; evaluasiKelompok?: string } = { skorPengetahuan };
    if (isLeader) {
      evaluationData.evaluasiKelompok = kelompokAnswer;
    }

    // 3. Kirim ke server
    if (userState) {
      const result = await saveEvaluation(userState.groupCode, userState.userName, evaluationData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg('Gagal menyimpan evaluasi. Coba lagi nanti.');
      }
    }
    
    setIsSubmitting(false);
  };

  // --- UI LOADING SAAT CEK STATUS KETUA ---
  if (loading) {
    return (
       <div className="flex h-[50vh] flex-col items-center justify-center text-center text-pastel-dark">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold">Memeriksa status Anda...</p>
      </div>
    );
  }

  // --- UI JIKA BELUM LOGIN ---
  if (!userState) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-yellow-200 bg-yellow-50 p-6 text-center sm:p-10">
        <ShieldAlert className="mb-4 h-14 w-14 text-yellow-400 sm:h-16 sm:w-16" />
        <h2 className="text-xl font-bold text-yellow-800 sm:text-2xl">Akses Ditolak</h2>
        <p className="mt-2 max-w-md text-sm leading-7 text-yellow-700 sm:text-base">
          Anda harus bergabung dengan kelompok di Ruang Kolaborasi (LKPD) terlebih dahulu untuk mengerjakan evaluasi.
        </p>
        <Link href="/lkpd" className="w-full sm:w-auto">
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-yellow-900 shadow-md transition-all hover:bg-yellow-500 sm:w-auto sm:px-6 sm:text-base">
            Masuk ke Ruang Kolaborasi <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  // --- UI JIKA SUDAH SUBMIT ---
  if (isSubmitted) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl bg-green-50 p-6 text-center animate-in fade-in zoom-in-95 sm:p-10">
        <CheckCircle className="mb-6 h-16 w-16 text-green-500 sm:h-20 sm:w-20" />
        <h2 className="text-2xl font-extrabold text-green-800 sm:text-3xl">Evaluasi Telah Dikirim!</h2>
        <p className="mt-2 text-sm leading-7 text-green-700 sm:text-lg">
          Terima kasih, <span className="font-bold">{userState.userName}</span>! Jawaban Anda telah berhasil kami rekam.
        </p>
        <p className="mt-8 text-sm text-slate-500">
          Anda telah menyelesaikan seluruh rangkaian pembelajaran.
        </p>
      </div>
    );
  }

  // --- UI FORM EVALUASI UTAMA ---
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Evaluasi Pembelajaran</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-lg">Ukur pemahaman dan pengalaman belajarmu di modul ini.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
        <div className="rounded-3xl border border-pastel-blue/20 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <h2 className="mb-6 border-b border-slate-200 pb-4 text-xl font-bold text-slate-800 sm:text-2xl">
            1. Evaluasi Pengetahuan (Individu)
          </h2>
          <div className="space-y-7 sm:space-y-8">
            {quizQuestions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              >
                <p className="mb-4 text-sm font-bold leading-7 text-slate-700 sm:text-base">{index + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map(option => (
                    <motion.label 
                      key={option} 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all sm:p-4 ${quizAnswers[q.id] === option ? 'border-pastel-dark bg-pastel-light/50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-pastel-blue'}`}
                    >
                      <input 
                        type="radio" name={q.id} value={option}
                        checked={quizAnswers[q.id] === option}
                        onChange={() => handleQuizChange(q.id, option)}
                        className="h-5 w-5 shrink-0 accent-pastel-dark"
                      />
                      <span className="text-sm font-medium leading-6 text-slate-600 sm:text-base">{option}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bagian 2: Evaluasi Kelompok (Hanya Ketua) */}
        {isLeader && (
          <div className="rounded-3xl border border-pastel-green/30 bg-white p-5 shadow-sm animate-in fade-in sm:p-6 md:p-8">
            <h2 className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4 text-xl font-bold text-slate-800 sm:text-2xl">
              <Crown className="shrink-0 text-yellow-500" /> 2. Evaluasi Kelompok (Khusus Ketua)
            </h2>
            <div className="space-y-6">
               <div>
                  <label htmlFor="eval-kelompok" className="mb-3 block text-sm font-bold leading-7 text-slate-700 sm:text-base">
                    Sebagai perwakilan tim, jelaskan bagaimana proses kolaborasi kelompok Anda dalam memecahkan masalah open-ended yang diberikan? (Sebutkan tantangan dan keberhasilan tim Anda).
                  </label>
                  <textarea 
                    id="eval-kelompok"
                    value={kelompokAnswer}
                    onChange={(e) => setKelompokAnswer(e.target.value)}
                    className="h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastel-dark sm:text-base"
                    placeholder="Contoh: Kelompok kami awalnya kesulitan dalam..., namun kami berhasil... dengan cara..."
                  />
                </div>
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <div className="pt-4 text-center">
          {errorMsg && <p className="text-red-500 text-sm font-medium mb-4">{errorMsg}</p>}
          <button type="submit" disabled={isSubmitting} className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-pastel-dark py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-blue-600 hover:shadow-xl disabled:opacity-70 sm:py-4 sm:text-lg">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Kirim Jawaban Evaluasi'}
          </button>
        </div>
      </form>
    </div>
  );
}
