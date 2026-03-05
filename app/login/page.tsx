"use client";

import { useState } from "react";
import { loginTeacher } from "@/app/auth-actions";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginTeacher(formData);
      // Jika loginTeacher mengembalikan sesuatu, berarti error (karena kalau sukses dia akan redirect)
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      // Catch jika terjadi redirect error bawaan Next.js
      if ((err as Error).message !== "NEXT_REDIRECT") {
        setError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ornamen Background */}
      <div className="absolute top-20 left-20 opacity-10 transform -rotate-12">
        <ShieldCheck size={200} className="text-pastel-dark" />
      </div>

      <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-white max-w-md w-full z-10 text-center">
        <div className="w-20 h-20 bg-pastel-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
          <Lock size={32} className="text-pastel-dark" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Area Guru</h1>
        <p className="text-slate-500 text-sm mb-8">
          Masukkan *password* administrator untuk mengakses panel monitoring BioCollab.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              name="password"
              placeholder="Masukkan Password Rahasia..." 
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pastel-dark/50 bg-slate-50 text-slate-800 tracking-widest transition-all"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-bold bg-red-50 py-2 px-4 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pastel-dark text-white font-bold py-4 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-pastel-blue/50 flex items-center justify-center gap-2"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"} 
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}