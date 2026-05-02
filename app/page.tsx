"use client";

import Link from 'next/link';
import Image from 'next/image'; 
import { Leaf, Dna, Microscope, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  // Menggunakan tipe Variants untuk mengatasi error TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-pastel-light px-4 py-8 text-slate-800 sm:px-6">
      
      {/* Background Ornaments (Floating Animations) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-10 top-8 -rotate-45 text-pastel-blue opacity-15 sm:left-10 sm:opacity-20"
      >
        <Dna className="h-20 w-20 sm:h-32 sm:w-32" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-8 -right-8 text-pastel-green opacity-15 sm:bottom-10 sm:right-10 sm:opacity-20"
      >
        <Leaf className="h-28 w-28 sm:h-40 sm:w-40" />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-2 top-1/2 hidden text-pastel-blue sm:block lg:right-20"
      >
        <Microscope size={100} />
      </motion.div>

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="z-10 w-full max-w-3xl rounded-3xl border border-white bg-white/70 p-6 text-center shadow-xl backdrop-blur-md sm:p-10 md:p-16"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center sm:mb-8">
            <Image 
              src="/Lambang-UM.png" 
              alt="Logo Universitas Negeri Malang" 
              width={120} 
              height={120} 
              className="h-24 w-24 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105 sm:h-[120px] sm:w-[120px]" 
              priority
            />
          </motion.div>

          <motion.h2 variants={itemVariants} className="mb-2 text-xs font-semibold uppercase tracking-widest text-pastel-dark sm:text-sm md:text-base">
            Media Pembelajaran Interaktif
          </motion.h2>
          
          <motion.h1 variants={itemVariants} className="mb-4 text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl md:text-5xl">
            E-Modul Biologi <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pastel-dark to-pastel-blue">
              Berbasis OE-C
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mx-auto mb-8 max-w-xl text-sm leading-7 text-slate-600 sm:text-lg">
            Tingkatkan kemampuan berpikir kreatif dan kolaborasi melalui pendekatan Open-Ended Collaboration (OE-C).
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link href="/pendahuluan">
              <button className="group relative inline-flex w-full items-center justify-center rounded-full bg-pastel-dark px-6 py-3.5 font-bold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-pastel-blue/50 focus:outline-none focus:ring-2 focus:ring-pastel-dark focus:ring-offset-2 sm:w-auto sm:px-8 sm:py-4">
                <span className="mr-2 text-base sm:text-lg">Mulai Belajar</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8 text-xs font-medium text-slate-500 sm:mt-12 sm:text-sm">
            <p>Dikembangkan oleh Nafisa Syafaqoh</p>
          </motion.div>

        </motion.div>
      </motion.div>
    </main>
  );
}
