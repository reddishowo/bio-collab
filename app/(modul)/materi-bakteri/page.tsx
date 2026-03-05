"use client"; // Tambahkan ini

import Link from "next/link";
import { Dna, Eye, HelpCircle, Users, ArrowRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function MateriBakteriPage() {
  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2 } } }} className="space-y-8">
      <motion.div variants={slideUp} className="border-b border-pastel-blue/30 pb-6">
        <div className="flex items-center gap-3 text-pastel-dark mb-2">
          <Dna size={24} />
          <h2 className="text-lg font-semibold uppercase tracking-widest">Materi</h2>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
          Bakteri TBC: Musuh Tak Terlihat di Paru-paru
        </h1>
        <p className="text-slate-600 text-lg">
          Tujuan: Menganalisis bakteri patogen, memahami dampak infeksi tuberkulosis, dan merancang solusi.
        </p>
      </motion.div>

      {/* Orientasi */}
      <motion.div variants={slideUp} className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-l-pastel-green">
        <div className="flex items-center gap-3 mb-4 text-pastel-green">
          <Eye size={28} />
          <h2 className="text-2xl font-bold text-slate-800">1. Orientasi Fenomena</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed text-justify">
              Indonesia adalah salah satu negara dengan beban kasus <strong>Tuberkulosis (TBC)</strong> tertinggi di dunia...
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-pastel-light rounded-2xl p-4 border border-pastel-blue/20 flex flex-col items-center justify-center aspect-video relative overflow-hidden group">
            <Lightbulb size={48} className="text-pastel-dark opacity-50 mb-2" />
            <span className="text-sm text-pastel-dark font-medium text-center px-4">
              [ Gambar: Paru-paru terinfeksi TBC ]
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Masalah Open Ended */}
      <motion.div variants={slideUp} className="relative bg-pastel-dark p-8 rounded-3xl shadow-lg text-white overflow-hidden mt-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -top-10 opacity-10">
          <HelpCircle size={200} />
        </motion.div>
        <div className="relative z-10">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-4">
            Tahap 2: Pemberian Masalah Open-Ended
          </div>
          <h2 className="text-3xl font-bold mb-6">Tantangan Pemberantasan TBC</h2>
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-inner text-lg leading-relaxed font-medium border-l-4 border-l-pastel-blue">
            "Bagaimana Anda merancang desain pencahayaan rumah sehat alami, atau sistem 'Pengingat Minum Obat' inovatif?"
          </div>
        </div>
      </motion.div>

      {/* Button LKPD */}
      <motion.div variants={slideUp} className="flex flex-col items-center justify-center p-8 mt-10 bg-pastel-light/50 rounded-3xl border border-dashed border-pastel-dark">
        <Users size={48} className="text-pastel-dark mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Bentuk Tim Kolaborasi</h3>
        <Link href="/lkpd">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 mt-4 px-8 py-4 bg-white text-pastel-dark border-2 border-pastel-dark rounded-full font-bold shadow-md">
            Masuk ke Ruang LKPD Kolaboratif <ArrowRight size={20} />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}