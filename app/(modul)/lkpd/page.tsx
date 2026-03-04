"use client";

import { useState } from "react";
import { Users, KeyRound, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function LkpdPage() {
  const [activeTab, setActiveTab] = useState<"buat" | "gabung">("buat");
  
  // State Form
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  
  // State Status
  const [loading, setLoading] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState<any>(null); // Menyimpan data jika sukses join/buat
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName, leaderName: name }),
      });
      const data = await res.json();
      
      if (data.success) {
        setJoinedGroup(data.group);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, memberName: name }),
      });
      const data = await res.json();
      
      if (data.success) {
        setJoinedGroup(data.group);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // JIKA SUDAH BERHASIL MASUK KELOMPOK
  if (joinedGroup) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
        <div className="bg-pastel-dark p-8 rounded-3xl text-white shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-2">Berhasil Masuk ke Ruang Diskusi!</h1>
          <p className="text-pastel-light text-lg">Kelompok: {joinedGroup.name}</p>
          
          <div className="mt-6 bg-white/20 inline-block px-6 py-4 rounded-2xl border border-white/30">
            <p className="text-sm uppercase tracking-widest mb-1 font-semibold text-pastel-light">Kode Akses Kelompok Anda</p>
            <p className="text-4xl font-mono font-bold tracking-widest">{joinedGroup.code}</p>
          </div>
          <p className="mt-4 text-sm text-pastel-light italic">*Bagikan kode ini ke teman anggota agar bisa bergabung</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pastel-blue/20">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-pastel-blue/20 pb-4">Anggota Terdaftar ({joinedGroup.members.length})</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {joinedGroup.members.map((member: string, i: number) => (
              <li key={i} className="bg-pastel-light/50 p-3 rounded-xl flex items-center gap-3 font-medium text-slate-700">
                <div className="bg-pastel-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  {member.charAt(0).toUpperCase()}
                </div>
                {member} {i === 0 && <span className="text-xs bg-pastel-green text-slate-800 px-2 py-1 rounded-md ml-auto">Ketua</span>}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tombol Lanjut ke Lembar Kerja (Untuk Sintaks 4 & 5 nanti) */}
        <button className="w-full flex justify-center items-center gap-2 bg-pastel-green text-slate-800 font-bold py-4 rounded-full shadow-md hover:shadow-lg transition-all">
          Mulai Mengerjakan LKPD <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  // JIKA BELUM MASUK KELOMPOK (UI FORM)
  return (
    <div className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center bg-pastel-blue/20 p-4 rounded-full mb-4 text-pastel-dark">
          <Users size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Ruang Kolaborasi (OE-C)</h1>
        <p className="text-slate-500 mt-2">Sintaks 3: Menemukan Tim Kolaboratif</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pastel-blue/20">
        {/* Tab Navigasi */}
        <div className="flex border-b border-pastel-blue/20">
          <button 
            onClick={() => setActiveTab("buat")}
            className={`flex-1 py-4 font-bold transition-colors flex justify-center items-center gap-2 ${activeTab === "buat" ? "bg-pastel-light text-pastel-dark border-b-2 border-pastel-dark" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <UserPlus size={18} /> Buat Kelompok
          </button>
          <button 
            onClick={() => setActiveTab("gabung")}
            className={`flex-1 py-4 font-bold transition-colors flex justify-center items-center gap-2 ${activeTab === "gabung" ? "bg-pastel-light text-pastel-dark border-b-2 border-pastel-dark" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <KeyRound size={18} /> Gabung Kelompok
          </button>
        </div>

        {/* Konten Form */}
        <div className="p-8">
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          {activeTab === "buat" ? (
            <form onSubmit={handleCreateGroup} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kamu (Ketua)</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full px-4 py-3 rounded-xl border border-pastel-blue/30 focus:outline-none focus:ring-2 focus:ring-pastel-dark bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kelompok</label>
                <input type="text" required value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Contoh: Kelompok Albert Einstein" className="w-full px-4 py-3 rounded-xl border border-pastel-blue/30 focus:outline-none focus:ring-2 focus:ring-pastel-dark bg-slate-50" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-pastel-dark text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors flex justify-center items-center gap-2 mt-4">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Buat & Generate Kode"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinGroup} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kamu (Anggota)</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Siti Aminah" className="w-full px-4 py-3 rounded-xl border border-pastel-blue/30 focus:outline-none focus:ring-2 focus:ring-pastel-dark bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kode Kelompok</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Masukkan 6 Digit Kode" maxLength={6} className="w-full px-4 py-3 rounded-xl border border-pastel-blue/30 focus:outline-none focus:ring-2 focus:ring-pastel-dark bg-slate-50 font-mono text-lg uppercase tracking-widest" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-pastel-green text-slate-800 font-bold py-4 rounded-xl hover:bg-emerald-300 transition-colors flex justify-center items-center gap-2 mt-4 shadow-sm">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Gabung Sekarang"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}