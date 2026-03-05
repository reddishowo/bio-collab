import { getGroupDetail, getGroupChats, getGroupEvaluations } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Users, MessageSquare, FileText, CheckCircle, ShieldAlert, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({ params }: { params: { code: string } }) {
  const { code } = await params;

  const group = await getGroupDetail(code);
  const chats = await getGroupChats(code);
  const evaluations = await getGroupEvaluations(code);

  if (!group) {
    return (
      <div className="text-center py-24">
        <ShieldAlert size={64} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Kelompok Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm mb-6">Kode kelompok tidak valid atau sudah dihapus.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-pastel-dark font-semibold hover:underline">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const lkpdSections = [
    { title: "Penataan Tugas", data: group.lkpd?.bakteri?.tugas },
    { title: "Tahap Inkubasi", data: group.lkpd?.bakteri?.inkubasi },
    { title: "Tahap Iluminasi", data: group.lkpd?.bakteri?.iluminasi },
    { title: "Tahap Verifikasi", data: group.lkpd?.bakteri?.verifikasi },
  ];

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out_forwards]">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-pastel-dark transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-extrabold text-slate-800 truncate">{group.groupName}</h2>
          <p className="text-pastel-dark font-mono font-bold text-sm mt-0.5">Kode: {group.groupCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* KOLOM KIRI */}
        <div className="lg:col-span-1 space-y-6">

          {/* Anggota & Nilai */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 bg-pastel-dark/10 rounded-xl flex items-center justify-center">
                <Users size={16} className="text-pastel-dark" />
              </div>
              Anggota & Nilai Kuis
            </h3>
            <div className="space-y-2.5">
              {group.members.map((member: string, i: number) => {
                const evalData = evaluations.find((e) => e.userName === member);
                const isKetua = i === 0;
                return (
                  <div key={i} className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${isKetua ? "bg-yellow-100 text-yellow-700" : "bg-slate-200 text-slate-500"}`}>
                        {isKetua ? "K" : i + 1}
                      </div>
                      <span className="font-medium text-slate-700 text-sm truncate">{member}</span>
                    </div>
                    {evalData ? (
                      <span className={`shrink-0 font-bold px-2.5 py-1 rounded-xl text-xs ${evalData.skorPengetahuan >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {evalData.skorPengetahuan}
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-slate-400 italic">–</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evaluasi Kelompok */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 bg-pastel-green/30 rounded-xl flex items-center justify-center">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              Evaluasi Kelompok
            </h3>
            {group.evaluasiTim ? (
              <blockquote className="text-sm text-slate-600 bg-pastel-light/60 p-4 rounded-2xl border border-pastel-blue/20 italic leading-relaxed">
                "{group.evaluasiTim}"
              </blockquote>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 italic">Ketua belum mengirimkan evaluasi.</p>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-2 space-y-6">

          {/* LKPD */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 bg-pastel-dark/10 rounded-2xl flex items-center justify-center">
                <FileText size={18} className="text-pastel-dark" />
              </div>
              Hasil LKPD — Bakteri
            </h3>

            {group.lkpd && group.lkpd.bakteri ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lkpdSections.map((sec, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pastel-dark text-white text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                      <h4 className="text-xs font-bold text-pastel-dark uppercase tracking-wide">{sec.title}</h4>
                    </div>
                    <div className="flex-1 min-h-20 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {sec.data || <span className="text-slate-400 italic">Belum diisi…</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm">Kelompok ini belum menyimpan jawaban LKPD.</p>
              </div>
            )}
          </div>

          {/* LOG DISKUSI — h-125 diperbaiki ke h-[500px] */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-125 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-pastel-dark/10 rounded-xl flex items-center justify-center">
                  <MessageSquare size={16} className="text-pastel-dark" />
                </div>
                Log Diskusi
              </h3>
              <span className="text-xs text-slate-400 font-medium">{chats.length} pesan</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar bg-[#F8FAFC]">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <MessageSquare size={36} className="mb-2" />
                  <p className="text-sm font-medium">Belum ada diskusi.</p>
                </div>
              ) : (
                chats.map((msg: any) => (
                  <div key={msg._id} className="flex flex-col items-start">
                    <div className="bg-white border border-slate-200 text-slate-700 max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm text-sm leading-relaxed">
                      <p className="font-bold text-[10px] text-pastel-dark mb-1 uppercase tracking-wide">{msg.userName}</p>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}