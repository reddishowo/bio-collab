"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Save, MessageSquare, FileText, Loader2, Check, Bug, Dna, Sprout } from "lucide-react";
import { createGroup, joinGroup, getChatMessages, sendChatMessage, saveLKPD, getGroupData, type GroupData, type ChatMessage, type LKPDItem } from "@/app/actions";

// Tipe data untuk topik yang valid
type Topic = 'virus' | 'bakteri' | 'jamur';

export default function LkpdWorkspacePage() {
  // --- STATE LOGIN/JOIN ---
  const [activeTab, setActiveTab] = useState<"buat" | "gabung">("buat");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [joinedGroup, setJoinedGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- STATE WORKSPACE ---
  const [workspaceTab, setWorkspaceTab] = useState<"diskusi" | "lkpd">("diskusi");
  
  // STATE BARU: Materi yang sedang dipilih
  const [currentTopic, setCurrentTopic] = useState<Topic>("virus");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // State Form Jawaban LKPD
  const [lkpdData, setLkpdData] = useState<LKPDItem>({
    tugas: "", inkubasi: "", iluminasi: "", verifikasi: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentGroupCode = joinedGroup?.groupCode ?? "";

  // Fungsi helper untuk mengambil data LKPD spesifik dari database
  const loadLKPDByTopic = async (topic: Topic) => {
    if (!currentGroupCode) return;
    
    // Ambil data terbaru dari server agar sinkron
    const groupData = await getGroupData(currentGroupCode);
    
    // Ambil data spesifik berdasarkan topik (virus/bakteri/jamur)
    // Gunakan Optional Chaining (?.) dan Nullish Coalescing (??) untuk keamanan
    const data = groupData?.lkpd?.[topic];
    
    setLkpdData({
      tugas: data?.tugas ?? "",
      inkubasi: data?.inkubasi ?? "",
      iluminasi: data?.iluminasi ?? "",
      verifikasi: data?.verifikasi ?? ""
    });
  };

  // --- EFEK: LOAD DATA AWAL ---
  useEffect(() => {
    if (!currentGroupCode) return;

    const initData = async () => {
      // 1. Load Chat
      const msgs = await getChatMessages(currentGroupCode);
      setMessages(msgs);
      // 2. Load LKPD sesuai topik awal (virus)
      await loadLKPDByTopic(currentTopic);
    };

    initData();
  }, [currentGroupCode]);

  // --- EFEK: GANTI TOPIK ---
  // Setiap kali user ganti Tab Topik (Virus -> Bakteri), load data baru
  useEffect(() => {
    if (currentGroupCode) {
      loadLKPDByTopic(currentTopic);
    }
  }, [currentTopic, currentGroupCode]);

  // --- EFEK: POLLING CHAT (Interval) ---
  useEffect(() => {
    if (!currentGroupCode) return;
    const interval = setInterval(async () => {
      const msgs = await getChatMessages(currentGroupCode);
      setMessages(msgs);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentGroupCode]);

  // Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- HANDLERS LOGIN ---
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createGroup(groupName, name);
    if (result.success) setJoinedGroup(result.group as GroupData);
    else setErrorMsg(result.message || "Gagal");
    setLoading(false);
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await joinGroup(code, name);
    if (result.success) {
      setJoinedGroup(result.group as GroupData);
    }
    else setErrorMsg(result.message || "Gagal");
    setLoading(false);
  };

  // --- HANDLERS WORKSPACE ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentGroupCode) return;
    setIsSending(true);
    await sendChatMessage(currentGroupCode, name, newMessage);
    setNewMessage("");
    setIsSending(false);
    const msgs = await getChatMessages(currentGroupCode);
    setMessages(msgs);
  };

  const handleSaveLKPD = async () => {
    if (!currentGroupCode) return;
    setIsSaving(true);
    // Simpan dengan mengirimkan topik saat ini (currentTopic)
    await saveLKPD(currentGroupCode, currentTopic, lkpdData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };


  // ================= TAMPILAN WORKSPACE (LOGIN SUKSES) =================
  if (joinedGroup && currentGroupCode) {
    const members = joinedGroup.members ?? [];

    return (
      <div className="-mx-4 md:mx-0 flex flex-col h-[calc(100dvh-5rem)] md:h-[calc(100vh-8rem)] bg-white md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">

        {/* HEADER KELOMPOK */}
        <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between z-10 shrink-0 shadow-sm">
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1">{joinedGroup.groupName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-pastel-light text-pastel-dark px-2 py-0.5 rounded font-mono font-bold tracking-widest border border-pastel-blue/30">
                {currentGroupCode}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{members.length} Anggota</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member: string, i: number) => (
              <div key={i} className="w-7 h-7 rounded-full bg-pastel-blue text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                {member.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* TAB UTAMA (Diskusi vs LKPD) */}
        <div className="flex bg-slate-50 border-b border-slate-100 shrink-0">
          <button
            onClick={() => setWorkspaceTab("diskusi")}
            className={`flex-1 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${workspaceTab === "diskusi" ? "bg-white text-pastel-dark border-b-2 border-pastel-dark" : "text-slate-400"}`}
          >
            <MessageSquare size={16} /> Diskusi
          </button>
          <button
            onClick={() => setWorkspaceTab("lkpd")}
            className={`flex-1 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${workspaceTab === "lkpd" ? "bg-white text-pastel-dark border-b-2 border-pastel-dark" : "text-slate-400"}`}
          >
            <FileText size={16} /> Lembar Kerja
          </button>
        </div>

        {/* KONTEN: DISKUSI */}
        {workspaceTab === "diskusi" && (
          <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                  <MessageSquare size={40} className="mb-2" />
                  <p className="text-sm font-medium">Mulai diskusi kelompokmu!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.userName === name;
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-pastel-dark text-white rounded-br-sm" : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"}`}>
                        {!isMe && <p className="font-bold text-[10px] text-pastel-dark mb-0.5">{msg.userName}</p>}
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="bg-white p-3 border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue/50 text-slate-700" />
                <button type="submit" disabled={isSending || !newMessage.trim()} className="bg-pastel-dark text-white p-2.5 rounded-full">
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* KONTEN: LKPD (MULTI TOPIC) */}
        {workspaceTab === "lkpd" && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* SUB-TAB PILIH MATERI (Virus / Bakteri / Jamur) */}
            <div className="flex px-4 py-3 gap-2 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'virus', label: 'Virus', icon: Bug },
                { id: 'bakteri', label: 'Bakteri', icon: Dna },
                { id: 'jamur', label: 'Jamur', icon: Sprout }
              ].map((item) => {
                const isActive = currentTopic === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTopic(item.id as Topic)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap
                      ${isActive 
                        ? "bg-pastel-dark text-white border-pastel-dark shadow-md" 
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* FORM LKPD (Isinya berubah sesuai materi yang dipilih) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              {/* Judul Form Dinamis */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 text-xs font-medium flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                Anda sedang mengerjakan LKPD: <span className="font-bold uppercase">{currentTopic}</span>
              </div>

              {/* SINTAKS 4 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-pastel-green/30 text-pastel-dark w-5 h-5 flex items-center justify-center rounded-full text-[10px]">4</span>
                  Penataan Tugas (Jobdesk)
                </h3>
                <textarea
                  value={lkpdData.tugas} onChange={(e) => setLkpdData({ ...lkpdData, tugas: e.target.value })}
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pastel-blue/50 transition-all outline-none resize-none placeholder:text-slate-400"
                  placeholder={`Pembagian tugas untuk materi ${currentTopic}...`}
                />
              </div>

              {/* SINTAKS 5.1 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-pastel-blue/30 text-pastel-dark w-5 h-5 flex items-center justify-center rounded-full text-[10px]">5a</span>
                  Tahap Inkubasi (Strategi Awal)
                </h3>
                <textarea
                  value={lkpdData.inkubasi} onChange={(e) => setLkpdData({ ...lkpdData, inkubasi: e.target.value })}
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pastel-blue/50 transition-all outline-none resize-none placeholder:text-slate-400"
                  placeholder={`Ide solusi untuk masalah ${currentTopic}...`}
                />
              </div>

              {/* SINTAKS 5.2 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-pastel-blue/30 text-pastel-dark w-5 h-5 flex items-center justify-center rounded-full text-[10px]">5b</span>
                  Tahap Iluminasi (Eksplorasi Solusi)
                </h3>
                <textarea
                  value={lkpdData.iluminasi} onChange={(e) => setLkpdData({ ...lkpdData, iluminasi: e.target.value })}
                  className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pastel-blue/50 transition-all outline-none resize-none placeholder:text-slate-400"
                  placeholder="Langkah-langkah detail solusi..."
                />
              </div>

              {/* SINTAKS 5.3 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-pastel-blue/30 text-pastel-dark w-5 h-5 flex items-center justify-center rounded-full text-[10px]">5c</span>
                  Tahap Verifikasi (Kesimpulan)
                </h3>
                <textarea
                  value={lkpdData.verifikasi} onChange={(e) => setLkpdData({ ...lkpdData, verifikasi: e.target.value })}
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pastel-blue/50 transition-all outline-none resize-none placeholder:text-slate-400"
                  placeholder="Kesimpulan akhir..."
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="bg-white p-3 border-t border-slate-100 shrink-0">
              <button
                onClick={handleSaveLKPD}
                disabled={isSaving}
                className={`w-full max-w-3xl mx-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${saveSuccess ? "bg-green-500 text-white" : "bg-pastel-green text-slate-800 hover:bg-[#a1ceb4]"}`}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                {saveSuccess ? `Tersimpan (${currentTopic.toUpperCase()})` : `Simpan LKPD ${currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)}`}
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // TAMPILAN LOGIN (Tetap Sama)
  return (
    <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 mt-4 md:mt-10">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Ruang Kolaborasi</h1>
        <p className="text-slate-500 text-sm mt-1">Sintaks 3: Pembentukan Tim</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button onClick={() => setActiveTab("buat")} className={`flex-1 py-3.5 text-sm font-bold transition-colors ${activeTab === "buat" ? "text-pastel-dark border-b-2 border-pastel-dark bg-slate-50" : "text-slate-400 hover:text-slate-600"}`}>Buat Kelompok</button>
          <button onClick={() => setActiveTab("gabung")} className={`flex-1 py-3.5 text-sm font-bold transition-colors ${activeTab === "gabung" ? "text-pastel-dark border-b-2 border-pastel-dark bg-slate-50" : "text-slate-400 hover:text-slate-600"}`}>Gabung Kelompok</button>
        </div>
        <div className="p-6">
          {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-xs font-medium border border-red-100">{errorMsg}</div>}
          {activeTab === "buat" ? (
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kamu (Ketua)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue/50 bg-slate-50" /></div>
              <div><input type="text" required value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Nama Kelompok" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue/50 bg-slate-50" /></div>
              <button type="submit" disabled={loading} className="w-full bg-pastel-dark text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors flex justify-center items-center gap-2 mt-2 text-sm">{loading ? <Loader2 className="animate-spin" size={16} /> : "Buat & Dapatkan Kode"}</button>
            </form>
          ) : (
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kamu (Anggota)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue/50 bg-slate-50" /></div>
              <div><input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Kode Kelompok (6 Digit)" maxLength={6} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue/50 bg-slate-50 font-mono tracking-widest uppercase" /></div>
              <button type="submit" disabled={loading} className="w-full bg-pastel-green text-slate-800 font-bold py-3 rounded-xl hover:bg-[#a1ceb4] transition-colors flex justify-center items-center gap-2 mt-2 text-sm shadow-sm">{loading ? <Loader2 className="animate-spin" size={16} /> : "Gabung Sekarang"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}