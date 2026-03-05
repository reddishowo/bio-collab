"use client";

import { useState } from "react";
import { loginTeacher } from "@/app/auth-actions";
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State Hide/Unhide Password

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginTeacher(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if ((err as Error).message !== "NEXT_REDIRECT") {
        setError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-light flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ornamen Background Animasi */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 opacity-10"
      >
        <ShieldCheck size={300} className="text-pastel-dark" />
      </motion.div>

      {/* Kotak Login Animasi */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-white max-w-md w-full z-10 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-20 h-20 bg-pastel-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm"
        >
          <Lock size={32} className="text-pastel-dark" />
        </motion.div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Area Guru</h1>
        <p className="text-slate-500 text-sm mb-8">
          Masukkan sandi administrator untuk mengakses panel monitoring BioCollab.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Masukkan Password..." 
              required
              className="w-full pl-5 pr-14 py-4 rounded-2xl border border-slate-200 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pastel-dark/50 bg-slate-50 text-slate-800 tracking-widest transition-all"
            />
            {/* Tombol Hide/Unhide Password */}
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-pastel-dark transition-colors rounded-full hover:bg-slate-200/50"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm font-bold bg-red-50 py-3 px-4 rounded-xl border border-red-100 overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-pastel-dark text-white font-bold py-4 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-pastel-blue/30 flex items-center justify-center gap-2"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"} 
            {!loading && <ArrowRight size={20} />}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}