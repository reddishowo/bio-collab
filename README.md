# BioCollab

BioCollab adalah media pembelajaran interaktif Biologi berbasis model **Open-Ended Collaboration (OE-C)**.
Proyek ini dirancang untuk mendukung pembelajaran kolaboratif melalui:

- orientasi fenomena,
- diskusi tim real-time,
- pengisian LKPD kolaboratif,
- evaluasi individu dan evaluasi tim.

Aplikasi dibangun dengan **Next.js App Router + Server Actions + MongoDB**.

---

## 1) Ringkasan Proyek

### Apa itu BioCollab?
BioCollab adalah e-modul Biologi yang menggabungkan konten materi dan aktivitas kolaborasi tim dalam satu aplikasi web. Siswa dapat membentuk kelompok, berdiskusi, menyusun jawaban LKPD, lalu menyelesaikan evaluasi.

### Tujuan Utama
- Meningkatkan keterampilan berpikir kritis dan kreatif siswa.
- Mendorong kolaborasi berbasis masalah open-ended.
- Menyediakan alur belajar terstruktur dari pendahuluan sampai evaluasi.

### Cakupan Materi Saat Ini
- Subbab 1: Virus
- Subbab 2: Bakteri
- Subbab 3: Jamur

---

## 2) Tech Stack

### Frontend
- **Next.js 16.1.6** (App Router)
- **React 19.2.3**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (dengan custom theme di `app/globals.css`)
- **lucide-react** untuk icon

### Backend / Data Layer
- **Next.js Server Actions** (`app/actions.ts`)
- **MongoDB Node Driver** (`mongodb` package)
- Koneksi database melalui `lib/mongodb.ts`

### Tooling
- ESLint 9 + eslint-config-next
- React Compiler diaktifkan (`next.config.ts` → `reactCompiler: true`)

---

## 3) Fitur Utama

### A. Alur Pembelajaran
1. Landing page (`/`) sebagai pintu masuk.
2. Pendahuluan (`/pendahuluan`) menampilkan capaian, tujuan, dan orientasi.
3. Materi (`/materi-virus`, `/materi-bakteri`, `/materi-jamur`) berisi fenomena + tantangan open-ended.
4. Ruang LKPD (`/lkpd`) untuk pembentukan tim, diskusi, dan lembar kerja.
5. Evaluasi (`/evaluasi`) untuk kuis individu + refleksi kelompok (khusus ketua).

### B. Kolaborasi Kelompok
- Buat kelompok dengan kode unik 6 karakter.
- Gabung kelompok menggunakan kode.
- Session user disimpan di `localStorage` dengan key `biocollab_session`.
- Auto-login session saat user kembali membuka aplikasi.

### C. Diskusi Real-Time (Polling)
- Chat per kelompok disimpan di MongoDB collection `chats`.
- Refresh pesan dilakukan polling tiap 3 detik.

### D. LKPD Multi Topik
- LKPD dipisah per topik: `virus`, `bakteri`, `jamur`.
- Tiap topik memiliki 4 bagian:
	- `tugas`
	- `inkubasi`
	- `iluminasi`
	- `verifikasi`

### E. Evaluasi
- Semua anggota mengisi kuis individu (5 soal pilihan ganda).
- Skor dihitung otomatis dalam persen.
- Ketua kelompok mengisi evaluasi tim (uraian).
- Data evaluasi disimpan/upsert per `groupCode + userName`.

---

## 4) Struktur Halaman (Route)

Karena menggunakan route group `app/(modul)`, URL tetap bersih tanpa segmen `(modul)`.

- `/` → Landing page
- `/pendahuluan`
- `/materi-virus`
- `/materi-bakteri`
- `/materi-jamur`
- `/lkpd`
- `/evaluasi`

---

## 5) Arsitektur Folder

```text
app/
	actions.ts                # Server Actions (group, chat, lkpd, evaluasi)
	layout.tsx                # Root layout + metadata
	page.tsx                  # Landing page
	globals.css               # Tailwind import + custom theme pastel
	(modul)/
		layout.tsx              # Layout modul + sidebar + GroupProvider
		pendahuluan/page.tsx
		materi-virus/page.tsx
		materi-bakteri/page.tsx
		materi-jamur/page.tsx
		lkpd/page.tsx
		evaluasi/page.tsx

components/
	GroupContext.tsx          # Session kelompok via localStorage

lib/
	mongodb.ts                # Mongo client singleton

models/
	Group.ts                  # Model Mongoose (legacy, belum dipakai actions)
```

---

## 6) Data Model (MongoDB)

### Collection `groups`
Contoh struktur:

```json
{
	"groupName": "Kelompok Alpha",
	"groupCode": "A1B2C3",
	"members": ["Nafisa", "Budi"],
	"createdAt": "2026-03-05T00:00:00.000Z",
	"lkpd": {
		"virus": {
			"tugas": "...",
			"inkubasi": "...",
			"iluminasi": "...",
			"verifikasi": "..."
		},
		"bakteri": {},
		"jamur": {}
	},
	"evaluasiTim": "Opsional, diisi ketua"
}
```

### Collection `chats`
```json
{
	"groupCode": "A1B2C3",
	"userName": "Nafisa",
	"message": "Halo tim",
	"createdAt": "2026-03-05T00:00:00.000Z"
}
```

### Collection `evaluations`
```json
{
	"groupCode": "A1B2C3",
	"userName": "Nafisa",
	"skorPengetahuan": 80,
	"evaluasiKelompok": "Opsional, hanya ketua",
	"submittedAt": "2026-03-05T00:00:00.000Z"
}
```

---

## 7) Server Actions yang Tersedia

File: `app/actions.ts`

- `createGroup(groupName, leaderName)`
	- Membuat kelompok baru dan generate `groupCode` unik.
- `joinGroup(code, memberName)`
	- Join kelompok berdasarkan kode (idempotent untuk nama yang sama).
- `getChatMessages(groupCode)`
	- Ambil chat per grup, urut waktu ascending.
- `sendChatMessage(groupCode, userName, message)`
	- Simpan pesan chat.
- `saveLKPD(groupCode, topic, lkpdData)`
	- Simpan LKPD berdasarkan topik (`virus|bakteri|jamur`).
- `getGroupData(groupCode)`
	- Ambil data group terbaru.
- `saveEvaluation(groupCode, userName, evalData)`
	- Simpan evaluasi individu dan (jika ketua) evaluasi tim.

---

## 8) Setup Lokal

### Prasyarat
- Node.js 18+ (disarankan LTS terbaru)
- MongoDB Atlas/local instance

### Instalasi
```bash
npm install
```

### Environment Variable
Buat file `.env.local` di root project:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-url/biocollab_db?retryWrites=true&w=majority
```

> `lib/mongodb.ts` akan melempar error jika `MONGODB_URI` belum diisi.

### Jalankan Development Server
```bash
npm run dev
```

Lalu buka: `http://localhost:3000`

---

## 9) Script yang Tersedia

- `npm run dev` → menjalankan aplikasi mode development
- `npm run build` → build production
- `npm run start` → menjalankan hasil build production
- `npm run lint` → menjalankan ESLint

---

## 10) Alur Penggunaan (User Journey)

1. User membuka landing page dan masuk ke modul.
2. User mempelajari pendahuluan dan salah satu subbab materi.
3. User masuk ke `LKPD`:
	 - membuat kelompok baru, atau
	 - bergabung ke kelompok dengan kode.
4. User berdiskusi di tab chat.
5. User mengisi LKPD per topik (Virus/Bakteri/Jamur).
6. User menyelesaikan evaluasi individu.
7. Jika user ketua, user menambahkan evaluasi kelompok.

---

## 11) Catatan Teknis Penting

- Session saat ini berbasis browser `localStorage` (bukan autentikasi akun).
- Real-time chat menggunakan polling 3 detik (belum WebSocket).
- `models/Group.ts` masih ada, namun alur utama saat ini menggunakan MongoDB native driver di `app/actions.ts`.

---

## 12) Pengembangan Lanjutan (Opsional)

Beberapa peningkatan yang bisa dipertimbangkan:

- migrasi polling chat ke WebSocket,
- autentikasi user (mis. NextAuth / auth provider),
- dashboard guru untuk monitoring progres kelompok,
- export hasil LKPD/evaluasi ke PDF/Excel,
- analitik hasil belajar per topik.

---

## 13) Identitas Proyek

- Nama aplikasi: **BioCollab**
- Tema: E-Modul Biologi berbasis Open-Ended Collaboration
- Metadata title saat ini: **BioCollab | E-Modul Biologi OE-C**
