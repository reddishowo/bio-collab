"use client";

import { ExternalLink, PlayCircle, Video } from "lucide-react";
import { motion, type Variants } from "framer-motion";

type VideoItem = {
  title: string;
  url: string;
  embedUrl: string;
};

type VideoGroup = {
  label: string;
  title: string;
  description: string;
  videos: VideoItem[];
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const videoGroups: VideoGroup[] = [
  {
    label: "LKPD 1",
    title: "Peranan Bakteri dalam Kehidupan",
    description: "Video pendukung untuk memahami peran bakteri yang menguntungkan dan merugikan dalam kehidupan.",
    videos: [
      {
        title: "Peranan bakteri dalam kehidupan",
        url: "https://youtu.be/eaEr30AuCQg?si=laJ45AAMWiH97XPt",
        embedUrl: "https://www.youtube.com/embed/eaEr30AuCQg",
      },
      {
        title: "Struktur dan peran bakteri",
        url: "https://youtu.be/v3knZsPEtvM?si=WnMnuAaXvvPDa29T",
        embedUrl: "https://www.youtube.com/embed/v3knZsPEtvM",
      },
      {
        title: "Video singkat peranan bakteri",
        url: "https://youtube.com/shorts/A38uLvQCiEo?si=_5cfikkI4Cj3VY9Z",
        embedUrl: "https://www.youtube.com/embed/A38uLvQCiEo",
      },
      {
        title: "Video singkat bakteri dalam kehidupan",
        url: "https://youtube.com/shorts/9O-HuuPTMAE?si=mv-rwlWFzlWmvzRA",
        embedUrl: "https://www.youtube.com/embed/9O-HuuPTMAE",
      },
    ],
  },
  {
    label: "LKPD 2",
    title: "Percobaan Uji Pembusukan Makanan",
    description: "Video pendukung untuk merancang dan memahami percobaan pembusukan makanan.",
    videos: [
      {
        title: "Percobaan pembusukan makanan",
        url: "https://youtu.be/4F73L7t-Lc4?si=jED-CmopJ3D6LJyE",
        embedUrl: "https://www.youtube.com/embed/4F73L7t-Lc4",
      },
      {
        title: "Uji pembusukan makanan",
        url: "https://youtu.be/bSKLE-gs47o?si=tSijrCmgQHjxCCMi",
        embedUrl: "https://www.youtube.com/embed/bSKLE-gs47o",
      },
    ],
  },
  {
    label: "LKPD 3",
    title: "Pemanfaatan Bioteknologi dalam Berbagai Bidang Kehidupan",
    description: "Video pendukung tentang pemanfaatan bakteri dalam bioteknologi pangan, kesehatan, pertanian, dan lingkungan.",
    videos: [
      {
        title: "Bioteknologi dan pemanfaatan bakteri",
        url: "https://youtu.be/pKmaBnLf5WM?si=cDTR7aZUK_q2y1ON",
        embedUrl: "https://www.youtube.com/embed/pKmaBnLf5WM",
      },
      {
        title: "Video singkat pemanfaatan bioteknologi",
        url: "https://youtube.com/shorts/w0GZG3booSE?si=-VPBNPJRpfFHRnnx",
        embedUrl: "https://www.youtube.com/embed/w0GZG3booSE",
      },
    ],
  },
  {
    label: "LKPD 4",
    title: "Percobaan Fermentasi Nata de Nanas",
    description: "Video pendukung untuk memahami percobaan sederhana bioteknologi melalui fermentasi nata de nanas.",
    videos: [
      {
        title: "Fermentasi nata de nanas",
        url: "https://youtu.be/RDHpM9s7wXQ?si=68PX_NIJoVap-V53",
        embedUrl: "https://www.youtube.com/embed/RDHpM9s7wXQ",
      },
    ],
  },
];

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-video bg-slate-950">
        <iframe
          className="h-full w-full"
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pastel-light text-pastel-dark dark:bg-slate-800 dark:text-slate-100">
            <PlayCircle size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">{video.title}</h3>
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-pastel-dark hover:underline dark:text-sky-300"
            >
              Buka di YouTube <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function VideoPembelajaranPage() {
  return (
    <main className="relative isolate min-h-dvh rounded-3xl bg-slate-100 transition-colors dark:bg-slate-950">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="rounded-3xl border border-pastel-blue/30 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pastel-dark dark:text-sky-300">
              Sumber Belajar Video
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50 sm:text-4xl">
              Video Pembelajaran
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Pilih video sesuai sub-bab LKPD. Video dapat diputar langsung di halaman ini melalui embed YouTube.
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pastel-light text-pastel-dark dark:bg-slate-800 dark:text-slate-100">
            <Video size={28} />
          </div>
        </div>
      </motion.section>

      <div className="mt-6 space-y-6">
        {videoGroups.map((group) => (
          <motion.section
            key={group.label}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-pastel-light px-3 py-1 text-xs font-black text-pastel-dark dark:bg-slate-800 dark:text-slate-100">
                  {group.label}
                </span>
                <h2 className="mt-3 text-xl font-black text-slate-900 dark:text-slate-50">{group.title}</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                  {group.description}
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.videos.length} video
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {group.videos.map((video) => (
                <VideoCard key={video.embedUrl} video={video} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </main>
  );
}
