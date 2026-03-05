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
    <main className="min-h-screen bg-pastel-light flex flex-col items-center justify-center relative overflow-hidden text-slate-800">
      
      {/* Background Ornaments (Floating Animations) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-pastel-blue opacity-20 transform -rotate-45"
      >
        <Dna size={120} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-10 text-pastel-green opacity-20"
      >
        <Leaf size={150} />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-20 text-pastel-blue"
      >
        <Microscope size={100} />
      </motion.div>

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="z-10 bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-xl border border-white max-w-3xl text-center mx-4"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          
          <motion.div variants={itemVariants} className="flex justify-center items-center mb-8">
            <Image 
              src="/Lambang-UM.png" 
              alt="Logo Universitas Negeri Malang" 
              width={120} 
              height={120} 
              className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" 
              priority
            />
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-sm md:text-md font-semibold text-pastel-dark uppercase tracking-widest mb-2">
            Media Pembelajaran Interaktif
          </motion.h2>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            E-Modul Biologi <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pastel-dark to-pastel-blue">
              Berbasis OE-C
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-slate-600 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
            Tingkatkan kemampuan berpikir kreatif dan kolaborasi melalui pendekatan Open-Ended Collaboration (OE-C).
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link href="/pendahuluan">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-pastel-dark rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-pastel-blue/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-dark">
                <span className="mr-2 text-lg">Mulai Belajar</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-12 text-sm text-slate-500 font-medium">
            <p>Dikembangkan oleh Nafisa Syafaqoh</p>
          </motion.div>

        </motion.div>
      </motion.div>
    </main>
  );
}