import { getGroupDetail, getGroupChats, getGroupEvaluations } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Users, MessageSquare, FileText, CheckCircle, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({ params }: { params: { code: string } }) {
  // Tunggu params resolve sesuai standar Next.js 15
  const { code } = await params;
  
  const group = await getGroupDetail(code);
  const chats = await getGroupChats(code);
  const evaluations = await getGroupEvaluations(code);

  if (!group) {
    return (
      <div className="text-center py-20">
        <ShieldAlert size={64} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Kelompok Tidak Ditemukan</h2>
        <Link href="/" className="text-pastel-dark hover:underline mt-4 inline-block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">{group.groupName}</h2>
          <p className="text-pastel-dark font-mono font-bold">Kode: {group.groupCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Anggota & Evaluasi */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Users size={20} className="text-pastel-dark" /> Anggota & Nilai Kuis
            </h3>
            <div className="space-y-3">
              {group.members.map((member: string, i: number) => {
                const evalData = evaluations.find(e => e.userName === member);
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-700">{member} {i === 0 && <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded ml-2">Ketua</span>}</span>
                    {evalData ? (
                      <span className={`font-bold px-3 py-1 rounded-lg text-xs ${evalData.skorPengetahuan >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Skor: {evalData.skorPengetahuan}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum Ujian</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
              <CheckCircle size={20} className="text-pastel-green" /> Evaluasi Kelompok (Ketua)
            </h3>
            {group.evaluasiTim ? (
              <p className="text-sm text-slate-600 bg-pastel-light/50 p-4 rounded-xl border border-pastel-blue/20 italic leading-relaxed">
                "{group.evaluasiTim}"
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic text-center p-4">Ketua belum mengirimkan evaluasi kelompok.</p>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: LKPD & CHAT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* BAGIAN LKPD */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <FileText size={24} className="text-pastel-dark" /> Hasil LKPD (Bakteri)
            </h3>
            
            {group.lkpd && group.lkpd.bakteri ? (
              <div className="space-y-5">
                {[
                  { title: "Penataan Tugas", data: group.lkpd.bakteri.tugas },
                  { title: "Tahap Inkubasi", data: group.lkpd.bakteri.inkubasi },
                  { title: "Tahap Iluminasi", data: group.lkpd.bakteri.iluminasi },
                  { title: "Tahap Verifikasi", data: group.lkpd.bakteri.verifikasi },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-sm font-bold text-pastel-dark uppercase tracking-wider">{item.title}</h4>
                    <div className="w-full min-h-20 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">
                      {item.data || <span className="text-slate-400 italic">Belum diisi...</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                 <p className="text-slate-500">Kelompok ini belum menyimpan jawaban LKPD.</p>
               </div>
            )}
          </div>

          {/* BAGIAN LOG DISKUSI (CHAT) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-125 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={20} className="text-pastel-dark" /> Log Diskusi (Monitoring Chat)
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                  <MessageSquare size={40} className="mb-2" />
                  <p className="text-sm font-medium">Belum ada diskusi.</p>
                </div>
              ) : (
                chats.map((msg: any) => (
                  <div key={msg._id} className="flex flex-col items-start">
                    <div className="bg-white border border-slate-200 text-slate-700 max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm text-sm">
                      <p className="font-bold text-[10px] text-pastel-dark mb-0.5">{msg.userName}</p>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
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