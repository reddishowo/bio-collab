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
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2 } } }} className="space-y-6 sm:space-y-8">
      <motion.div variants={slideUp} className="border-b border-pastel-blue/30 pb-5 sm:pb-6">
        <div className="mb-2 flex items-center gap-3 text-pastel-dark">
          <Dna className="h-6 w-6 shrink-0" />
          <h2 className="text-sm font-semibold uppercase tracking-widest sm:text-lg">Materi</h2>
        </div>
        <h1 className="mb-4 text-2xl font-extrabold leading-tight text-slate-800 sm:text-3xl md:text-4xl">
          Bakteri TBC: Musuh Tak Terlihat di Paru-paru
        </h1>
        <p className="text-sm leading-7 text-slate-600 sm:text-lg">
          Tujuan: Menganalisis bakteri patogen, memahami dampak infeksi tuberkulosis, dan merancang solusi.
        </p>
      </motion.div>

      {/* Orientasi */}
      <motion.div variants={slideUp} className="rounded-3xl border-l-4 border-l-pastel-green bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center gap-3 text-pastel-green">
          <Eye className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">1. Orientasi Fenomena</h2>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-center md:gap-8">
          <div className="space-y-4">
            <p className="text-sm leading-7 text-slate-600 sm:text-base md:text-justify">
              Indonesia adalah salah satu negara dengan beban kasus <strong>Tuberkulosis (TBC)</strong> tertinggi di dunia...
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-pastel-blue/20 bg-pastel-light p-4">
            <Lightbulb className="mb-2 h-10 w-10 text-pastel-dark opacity-50 sm:h-12 sm:w-12" />
            <span className="px-4 text-center text-sm font-medium text-pastel-dark">
              [ Gambar: Paru-paru terinfeksi TBC ]
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Masalah Open Ended */}
      <motion.div variants={slideUp} className="relative mt-8 overflow-hidden rounded-3xl bg-pastel-dark p-5 text-white shadow-lg sm:p-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -top-10 opacity-10">
          <HelpCircle size={200} />
        </motion.div>
        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wide sm:text-sm">
            Tahap 2: Pemberian Masalah Open-Ended
          </div>
          <h2 className="mb-5 text-2xl font-bold sm:mb-6 sm:text-3xl">Tantangan Pemberantasan TBC</h2>
          <div className="rounded-2xl border-l-4 border-l-pastel-blue bg-white p-4 text-sm font-medium leading-7 text-slate-800 shadow-inner sm:p-6 sm:text-lg sm:leading-relaxed">
            &quot;Bagaimana Anda merancang desain pencahayaan rumah sehat alami, atau sistem &apos;Pengingat Minum Obat&apos; inovatif?&quot;
          </div>
        </div>
      </motion.div>

      {/* Button LKPD */}
      <motion.div variants={slideUp} className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-pastel-dark bg-pastel-light/50 p-5 text-center sm:mt-10 sm:p-8">
        <Users className="mb-4 h-10 w-10 text-pastel-dark sm:h-12 sm:w-12" />
        <h3 className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">Bentuk Tim Kolaborasi</h3>
        <Link href="/lkpd" className="w-full sm:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-pastel-dark bg-white px-5 py-3.5 text-sm font-bold text-pastel-dark shadow-md sm:w-auto sm:px-8 sm:py-4 sm:text-base">
            Masuk ke Ruang LKPD Kolaboratif <ArrowRight size={20} />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
