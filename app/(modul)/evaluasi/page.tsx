"use client";

import { useState, useEffect } from "react";
import { useGroupSession } from "@/components/GroupContext";
import { saveEvaluation, getGroupData } from "@/app/actions";
import { Loader2, CheckCircle, ShieldAlert, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

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
       <div className="flex flex-col items-center justify-center h-[50vh] text-pastel-dark">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold">Memeriksa status Anda...</p>
      </div>
    );
  }

  // --- UI JIKA BELUM LOGIN ---
  if (!userState) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-yellow-50 border-2 border-dashed border-yellow-200 p-10 rounded-3xl min-h-[50vh]">
        <ShieldAlert className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-yellow-800">Akses Ditolak</h2>
        <p className="text-yellow-700 mt-2 max-w-md">
          Anda harus bergabung dengan kelompok di Ruang Kolaborasi (LKPD) terlebih dahulu untuk mengerjakan evaluasi.
        </p>
        <Link href="/lkpd">
          <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-full hover:bg-yellow-500 transition-all shadow-md">
            Masuk ke Ruang Kolaborasi <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  // --- UI JIKA SUDAH SUBMIT ---
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-green-50 p-10 rounded-3xl min-h-[50vh] animate-in fade-in zoom-in-95">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-green-800">Evaluasi Telah Dikirim!</h2>
        <p className="text-green-700 mt-2 text-lg">
          Terima kasih, <span className="font-bold">{userState.userName}</span>! Jawaban Anda telah berhasil kami rekam.
        </p>
        <p className="text-slate-500 mt-8 text-sm">
          Anda telah menyelesaikan seluruh rangkaian pembelajaran.
        </p>
      </div>
    );
  }

  // --- UI FORM EVALUASI UTAMA ---
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-800">Evaluasi Pembelajaran</h1>
        <p className="text-slate-500 mt-2 text-lg">Ukur pemahaman dan pengalaman belajarmu di modul ini.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Bagian 1: Evaluasi Pengetahuan (Semua Anggota) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-pastel-blue/20">
          <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">
            1. Evaluasi Pengetahuan (Individu)
          </h2>
          <div className="space-y-8">
            {quizQuestions.map((q, index) => (
              <div key={q.id}>
                <p className="font-bold text-slate-700 mb-4">{index + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map(option => (
                    <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${quizAnswers[q.id] === option ? 'border-pastel-dark bg-pastel-light/50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-pastel-blue'}`}>
                      <input 
                        type="radio" name={q.id} value={option}
                        checked={quizAnswers[q.id] === option}
                        onChange={() => handleQuizChange(q.id, option)}
                        className="w-5 h-5 accent-pastel-dark"
                      />
                      <span className="font-medium text-slate-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian 2: Evaluasi Kelompok (Hanya Ketua) */}
        {isLeader && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-pastel-green/30 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6 flex items-center gap-3">
              <Crown className="text-yellow-500" /> 2. Evaluasi Kelompok (Khusus Ketua)
            </h2>
            <div className="space-y-6">
               <div>
                  <label htmlFor="eval-kelompok" className="font-bold text-slate-700 mb-3 block">
                    Sebagai perwakilan tim, jelaskan bagaimana proses kolaborasi kelompok Anda dalam memecahkan masalah open-ended yang diberikan? (Sebutkan tantangan dan keberhasilan tim Anda).
                  </label>
                  <textarea 
                    id="eval-kelompok"
                    value={kelompokAnswer}
                    onChange={(e) => setKelompokAnswer(e.target.value)}
                    className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastel-dark focus:outline-none text-slate-700 bg-slate-50"
                    placeholder="Contoh: Kelompok kami awalnya kesulitan dalam..., namun kami berhasil... dengan cara..."
                  />
                </div>
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <div className="pt-4 text-center">
          {errorMsg && <p className="text-red-500 text-sm font-medium mb-4">{errorMsg}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full max-w-md mx-auto bg-pastel-dark text-white font-bold text-lg py-4 rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Kirim Jawaban Evaluasi'}
          </button>
        </div>
      </form>
    </div>
  );
}