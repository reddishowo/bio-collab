# BioCollab Guru

Panel monitoring guru untuk aplikasi BioCollab. Proyek ini dipakai untuk melihat aktivitas kelompok siswa, hasil LKPD, log diskusi, dan evaluasi secara terpusat melalui antarmuka web.

## Ringkasan

`biocollab-guru` adalah aplikasi dashboard berbasis Next.js App Router dengan autentikasi sederhana (password guru + cookie session). Data diambil langsung dari MongoDB melalui Server Actions, sehingga halaman dashboard menampilkan kondisi terbaru secara real-time saat di-refresh.

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Animasi | Framer Motion |
| Ikon | Lucide React |
| Database | MongoDB (native driver) |
| Auth Session | Cookie HTTP-only (`teacher_session`) |
| Linting | ESLint 9 + `eslint-config-next` |

## Fitur Utama

- Login khusus guru menggunakan password dari environment variable (`TEACHER_PASSWORD`).
- Proteksi route via `middleware.ts` agar halaman dashboard tidak bisa diakses tanpa session.
- Dashboard ringkasan semua kelompok:
	- Menampilkan nama kelompok, kode kelompok, anggota, dan tanggal dibuat.
	- Badge status LKPD (terisi/kosong) dan evaluasi tim (ada/belum).
	- Jumlah kelompok aktif.
- Halaman detail kelompok (`/group/[code]`):
	- Daftar anggota dan nilai kuis individu (`evaluations`).
	- Evaluasi kelompok (`evaluasiTim`).
	- Hasil LKPD topik bakteri (tugas, inkubasi, iluminasi, verifikasi).
	- Log diskusi/chat kelompok (`chats`) dengan timestamp.
- Empty state yang jelas untuk data kosong (belum ada kelompok, belum ada chat, LKPD belum diisi, dsb).
- UI interaktif dengan animasi ringan menggunakan Framer Motion.

## Arsitektur Aplikasi

### Peta Route

| Route | Jenis | Deskripsi |
| --- | --- | --- |
| `/login` | Public | Halaman login guru |
| `/` | Protected | Dashboard daftar kelompok (route group `app/(dashboard)`) |
| `/group/[code]` | Protected | Detail monitoring kelompok berdasarkan `groupCode` |

### Alur Auth Singkat

1. User mengirim form login pada `/login`.
2. Server Action `loginTeacher` membandingkan password input dengan `TEACHER_PASSWORD`.
3. Jika valid, server menyimpan cookie `teacher_session` (HTTP-only, max 1 hari) lalu redirect ke `/`.
4. Middleware memblokir akses ke route protected bila cookie tidak ada.
5. Logout menghapus cookie dan redirect kembali ke `/login`.

### Data Flow

1. Halaman dashboard/detail di-render server-side.
2. Server Actions (`app/actions.ts`) mengambil data dari MongoDB.
3. Data dipetakan ke format serializable (ObjectId dan Date diubah ke string).
4. Komponen client menampilkan data dan animasi UI.

## Struktur Folder

```text
.
|-- app/
|   |-- actions.ts                 # Server actions untuk fetch data MongoDB
|   |-- auth-actions.ts            # Login/logout guru
|   |-- globals.css                # Theme global + utility CSS
|   |-- layout.tsx                 # Root layout dan metadata
|   |-- login/
|   |   `-- page.tsx               # Halaman login
|   `-- (dashboard)/
|       |-- layout.tsx             # Layout protected area (header + logout)
|       |-- page.tsx               # Dashboard list kelompok
|       |-- DashboardClient.tsx    # UI client dashboard + animasi
|       `-- group/
|           `-- [code]/
|               `-- page.tsx       # Detail monitoring per kelompok
|-- lib/
|   `-- mongodb.ts                 # Inisialisasi koneksi MongoDB
|-- middleware.ts                  # Route guard berbasis cookie session
|-- next.config.ts
|-- tsconfig.json
`-- package.json
```

## Menjalankan Project Secara Lokal

### Prasyarat

- Node.js LTS (disarankan versi 20+)
- MongoDB URI aktif (Atlas/local)

### 1. Install dependency

```bash
npm install
```

### 2. Buat file environment

Buat `.env.local` di root project:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db>?retryWrites=true&w=majority
TEACHER_PASSWORD=isi-password-guru
```

### 3. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

| Variable | Wajib | Deskripsi |
| --- | --- | --- |
| `MONGODB_URI` | Ya | Connection string MongoDB |
| `TEACHER_PASSWORD` | Ya | Password untuk login panel guru |

## Dokumentasi Database (MongoDB)

Nama database yang dipakai di kode: `biocollab_db`.

### Collection: `groups`

Contoh struktur data yang dibaca aplikasi:

```json
{
	"_id": "ObjectId",
	"groupName": "Kelompok A",
	"groupCode": "ABC123",
	"members": ["Siswa 1", "Siswa 2", "Siswa 3"],
	"createdAt": "2026-03-01T10:00:00.000Z",
	"lkpd": {
		"bakteri": {
			"tugas": "...",
			"inkubasi": "...",
			"iluminasi": "...",
			"verifikasi": "..."
		}
	},
	"evaluasiTim": "Refleksi kerja tim"
}
```

### Collection: `chats`

```json
{
	"_id": "ObjectId",
	"groupCode": "ABC123",
	"userName": "Siswa 1",
	"message": "Isi chat diskusi",
	"createdAt": "2026-03-01T10:05:00.000Z"
}
```

### Collection: `evaluations`

```json
{
	"_id": "ObjectId",
	"groupCode": "ABC123",
	"userName": "Siswa 1",
	"skorPengetahuan": 85,
	"submittedAt": "2026-03-01T11:00:00.000Z"
}
```

## Script NPM

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server development |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint |

## Catatan Implementasi

- Route group `(dashboard)` dipakai untuk mengelompokkan halaman protected tanpa memengaruhi URL.
- Halaman dashboard dan detail kelompok memakai `export const dynamic = "force-dynamic"` agar data selalu fresh.
- Aplikasi ini fokus pada monitoring (read-heavy) dari data yang sudah ada di MongoDB.
- Tidak ada endpoint API khusus pada repo ini; akses data utama menggunakan Server Actions.

## Deployment Singkat

1. Set environment variable `MONGODB_URI` dan `TEACHER_PASSWORD` di platform deploy.
2. Jalankan build: `npm run build`.
3. Jalankan app: `npm run start`.

---

Jika ingin, README ini bisa saya lanjutkan dengan:
- diagram arsitektur (flow auth + alur data),
- panduan backup/restore data MongoDB,
- section troubleshooting berbasis error umum saat deploy.
