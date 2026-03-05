import Link from 'next/link';
import Image from 'next/image'; 
import { Leaf, Dna, Microscope, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-pastel-light flex flex-col items-center justify-center relative overflow-hidden text-slate-800">
      
      {/* Background Ornaments (Aksen Biologi) */}
      <div className="absolute top-10 left-10 text-pastel-blue opacity-20 transform -rotate-45">
        <Dna size={120} />
      </div>
      <div className="absolute bottom-10 right-10 text-pastel-green opacity-20">
        <Leaf size={150} />
      </div>
      <div className="absolute top-1/2 right-20 text-pastel-blue opacity-10">
        <Microscope size={100} />
      </div>

      {/* Main Content Container */}
      <div className="z-10 bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-xl border border-white max-w-3xl text-center mx-4">
        
        {/* Logo / Icon Header (Telah diubah menjadi 1 logo PNG) */}
        <div className="flex justify-center items-center mb-8">
          <Image 
            src="/Lambang-UM.png" // Sesuaikan dengan nama file di folder public Anda
            alt="Logo Universitas Negeri Malang"
            width={120} // Sesuaikan lebar logo
            height={120} // Sesuaikan tinggi logo
            className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        {/* Title Section */}
        <h2 className="text-sm md:text-md font-semibold text-pastel-dark uppercase tracking-widest mb-2">
          Media Pembelajaran Interaktif
        </h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
          E-Modul Biologi <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-pastel-dark to-pastel-blue">
            Berbasis OE-C
          </span>
        </h1>
        <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
          Tingkatkan kemampuan berpikir kreatif dan kolaborasi melalui pendekatan Open-Ended Collaboration (OE-C).
        </p>

        {/* Action Button */}
        <Link href="/pendahuluan">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-pastel-dark rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-pastel-blue/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-dark">
            <span className="mr-2 text-lg">Mulai Belajar</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </Link>
        
        {/* Developer Info */}
        <div className="mt-12 text-sm text-slate-500 font-medium">
          <p>Dikembangkan oleh Nafisa Syafaqoh</p>
        </div>

      </div>
    </main>
  );
}