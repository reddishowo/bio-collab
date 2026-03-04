import Link from "next/link";
import { Bug, Eye, HelpCircle, Users, ArrowRight, Lightbulb } from "lucide-react";

export default function MateriVirusPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-pastel-blue/30 pb-6">
        <div className="flex items-center gap-3 text-pastel-dark mb-2">
          <Bug size={24} />
          <h2 className="text-lg font-semibold uppercase tracking-widest">Subbab 1</h2>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
          Virus Corona: Ancaman Pandemi Global
        </h1>
        <p className="text-slate-600 text-lg">
          Tujuan: Menganalisis struktur, replikasi, dan penyebaran virus, serta merancang solusi inovatif untuk menekan laju transmisi virus di masyarakat.
        </p>
      </div>

      {/* Orientasi */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-l-pastel-green">
        <div className="flex items-center gap-3 mb-4 text-pastel-green">
          <Eye size={28} />
          <h2 className="text-2xl font-bold text-slate-800">1. Orientasi Fenomena</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed text-justify">
              Pada awal tahun 2020, dunia diguncang oleh wabah penyakit pernapasan akut yang menyebar sangat cepat, disebabkan oleh <strong>SARS-CoV-2 (Virus Corona)</strong>. Virus ini menyebar melalui *droplet* (percikan liur) di udara ketika penderita batuk atau berbicara.
            </p>
            <p className="text-slate-600 leading-relaxed text-justify">
              Meskipun vaksin telah ditemukan, virus ini terus bermutasi (mengubah struktur protein *spike*-nya) sehingga varian baru bermunculan yang lebih kebal. Jika mutasi ini terus terjadi dan aktivitas masyarakat kembali normal tanpa batasan ketat, risiko ledakan kasus tetap membayangi.
            </p>
          </div>
          <div className="bg-pastel-light rounded-2xl p-4 border border-pastel-blue/20 flex flex-col items-center justify-center aspect-video relative overflow-hidden group">
            <Lightbulb size={48} className="text-pastel-dark opacity-50 mb-2" />
            <span className="text-sm text-pastel-dark font-medium text-center px-4">
              [ Gambar: Struktur Virus Corona (Protein Spike, Kapsid, RNA) ]
            </span>
          </div>
        </div>
      </div>

      {/* Masalah Open Ended */}
      <div className="relative bg-pastel-dark p-8 rounded-3xl shadow-lg text-white overflow-hidden mt-8">
        <div className="absolute -right-10 -top-10 opacity-10">
          <HelpCircle size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-4">
            Tahap 2: Pemberian Masalah Open-Ended
          </div>
          <h2 className="text-3xl font-bold mb-6">Tantangan Pengendalian Virus</h2>
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-inner text-lg leading-relaxed font-medium border-l-4 border-l-pastel-blue">
            "Mengingat virus ini bermutasi dengan cepat dan menyebar via udara (*airborne*), bagaimana Anda dan tim merancang purwarupa teknologi penyaring udara sederhana, sistem tata ruang kelas yang memutus transmisi, atau program mitigasi kesehatan yang efektif menggunakan sumber daya lokal di sekolah/lingkungan Anda?"
          </div>
        </div>
      </div>

      {/* Button LKPD */}
      <div className="flex flex-col items-center justify-center p-8 mt-10 bg-pastel-light/50 rounded-3xl border border-dashed border-pastel-dark">
        <Users size={48} className="text-pastel-dark mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Bentuk Tim Kolaborasi</h3>
        <Link href="/lkpd">
          <button className="flex items-center gap-2 mt-4 px-8 py-4 bg-white text-pastel-dark border-2 border-pastel-dark rounded-full font-bold hover:bg-pastel-dark hover:text-white transition-all shadow-md hover:shadow-lg">
            Masuk ke Ruang LKPD Kolaboratif <ArrowRight size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
}