# Product Requirements Document (PRD)
**Project Name:** Mifa Capital
**Document Version:** 1.0
**Date:** 28 April 2026

---

## 1. Product Overview

### Deskripsi Singkat
Mifa Capital adalah aplikasi web manajemen portofolio keuangan dan aset yang dirancang untuk membantu pemilik usaha dan individu dalam memantau aset, mengelola arus kas (cashflow), serta menyimpan data finansial dan sensitif secara terpusat, aman, dan efisien.

### Problem Statement
Pemilik bisnis kecil dan individu seringkali mengandalkan sistem manual seperti Microsoft Excel atau pencatatan kertas untuk mengelola keuangan. Hal ini menimbulkan beberapa masalah:
- **Rentan Kesalahan (Human Error):** Formula rusak atau salah input.
- **Kurangnya Visibilitas:** Sulit mendapatkan gambaran *real-time* tentang total kekayaan atau arus kas.
- **Risiko Keamanan:** Menyimpan data sensitif (NIK, detail rekening) di Excel tidak memiliki enkripsi standar, sehingga rentan bocor.

### Solution
Platform web tersentralisasi yang otomatis, aman, dan interaktif. Aplikasi ini menggantikan pencatatan manual dengan menyediakan dasbor *real-time*, manajemen aset yang terstruktur, pencatatan transaksi (deposit/withdraw) yang mudah, serta sistem keamanan standar industri untuk melindungi data sensitif pengguna.

---

## 2. Goals & Success Metrics (KPI)

### Product Goals
1. Menyederhanakan proses pencatatan aset dan cashflow harian.
2. Memberikan rasa aman kepada pengguna dalam menyimpan data sensitif.
3. Menciptakan *Single Source of Truth* untuk kesehatan finansial pengguna.

### Success Metrics (KPI)
- **User Adoption:** Mencapai 1.000 pengguna terdaftar pada kuartal pertama.
- **Engagement:** *Weekly Active Users* (WAU) mencapai minimal 40% dari total pengguna aktif.
- **Task Success Rate:** Waktu rata-rata yang dibutuhkan pengguna untuk mencatat transaksi baru < 15 detik.
- **System Reliability:** *Uptime* server dan *database* mencapai 99.9%.
- **Security:** 0 insiden kebocoran data.

---

## 3. Target User & Persona

### Persona 1: Owner Bisnis Kecil / Pengusaha Pribadi (Contoh: Mifa)
- **Karakteristik:** Sibuk, memiliki beberapa jenis aset (uang tunai, properti, inventaris), perlu mengetahui saldo cair dengan cepat.
- **Pain Points:** Terlalu banyak file Excel, kesulitan melacak riwayat uang keluar-masuk, khawatir data rekening perusahaan disalahgunakan.
- **Kebutuhan Utama:** Dasbor ringkas, laporan transaksi yang rapi, dan keamanan tingkat tinggi.

### Persona 2: Mahasiswa / *Personal Finance Enthusiast*
- **Karakteristik:** Literasi keuangan mulai tumbuh, ingin belajar mengelola uang saku atau penghasilan sampingan.
- **Pain Points:** Aplikasi keuangan yang ada di pasaran terlalu rumit atau berbayar mahal.
- **Kebutuhan Utama:** Fitur pencatatan sederhana, UI/UX yang modern dan intuitif.

---

## 4. Core Features

### MVP (Minimum Viable Product) - Phase 1
1. **Sistem Autentikasi:** Login, Register, Logout, dan Reset Password.
2. **Dashboard Keuangan:** Menampilkan total saldo uang (cash), total nilai aset, dan ringkasan transaksi terakhir.
3. **Manajemen Aset (CRUD):** Tambah, Edit, Hapus, dan Tampilkan daftar aset perusahaan/pribadi beserta estimasi nilainya.
4. **Manajemen Transaksi (Cashflow):**
   - **Deposit:** Input pemasukan dana.
   - **Withdraw:** Input pengeluaran dana.
5. **Riwayat Transaksi:** Tabel/daftar semua deposit dan withdraw yang dapat difilter/diurutkan berdasarkan tanggal.
6. **Manajemen Data User & Keamanan:** Profil pengguna untuk menyimpan data sensitif (Email, NIK, No. Rekening) dengan fitur *data masking* di antarmuka (contoh: `****-****-****-1234`).

### Future Features - Phase 2+
- Fitur *Multi-Currency* (Mata uang asing).
- Integrasi harga aset otomatis (misal: harga emas, saham, crypto API).
- Export data ke PDF/CSV untuk laporan bulanan.
- *Role-based access control* (RBAC) agar owner bisa mengundang akuntan (View Only).

---

## 5. User Flow

1. **Onboarding:** User melakukan Register $\rightarrow$ Login $\rightarrow$ Mengisi profil (termasuk setup data sensitif) $\rightarrow$ Diarahkan ke Dashboard (kosong).
2. **Manajemen Cashflow:** User klik "Add Transaction" $\rightarrow$ Pilih "Deposit" atau "Withdraw" $\rightarrow$ Input nominal dan keterangan $\rightarrow$ Simpan $\rightarrow$ Saldo di Dashboard langsung *update*.
3. **Manajemen Aset:** User masuk ke menu "Assets" $\rightarrow$ Klik "Add Asset" $\rightarrow$ Input nama aset, kategori, dan estimasi nilai $\rightarrow$ Total Nilai Aset di Dashboard bertambah.
4. **Pengecekan Rutin:** User Login $\rightarrow$ Melihat Dashboard (Grafik Cashflow & Saldo) $\rightarrow$ Mengecek Riwayat Transaksi.

---

## 6. Functional Requirements

- **Autentikasi:**
  - Sistem harus dapat memvalidasi format email yang benar.
  - Password harus memiliki minimal 8 karakter.
- **Dashboard:**
  - `Total Cash` = Total Deposit - Total Withdraw.
  - `Total Assets` = Sum dari nilai semua aset yang aktif.
- **Transaksi:**
  - Nominal deposit dan withdraw tidak boleh bernilai negatif (< 0).
  - Setiap transaksi wajib menyertakan: Tanggal, Nominal, Tipe (In/Out), dan Catatan.
- **Data Sensitif:**
  - Kolom seperti NIK dan Password di Database TIDAK BOLEH berupa *plain text*.
  - Di halaman profil, NIK dan Nomor Rekening harus disamarkan secara *default* dan hanya terbuka jika user mengklik tombol "Lihat/Show" (membutuhkan verifikasi ulang seperti PIN/Password jika perlu).

---

## 7. Non-Functional Requirements

- **Security:**
  - Enkripsi Data *At-Rest* (menggunakan algoritma AES-256 untuk NIK/Rekening).
  - Hashing Password (menggunakan Bcrypt atau Argon2).
  - Implementasi perlindungan CSRF dan XSS.
  - Wajib menggunakan HTTPS/SSL.
- **Performance:**
  - *Time to First Byte* (TTFB) < 200ms.
  - Render halaman dasbor maksimal 1.5 detik dengan data penuh.
- **Scalability:**
  - Arsitektur berbasis komponen (Next.js) yang dapat menampung peningkatan trafik.
  - Indexing pada tabel database (khususnya kolom `user_id` dan `date`) untuk mempercepat query.

---

## 8. Database Design

Menggunakan Relational Database (PostgreSQL/MySQL).

### Tabel `users`
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (Timestamp)

### Tabel `user_profiles`
- `user_id` (UUID, Foreign Key ke `users.id`)
- `full_name` (String)
- `encrypted_nik` (String)
- `encrypted_bank_details` (String)
- `iv` (String) $\rightarrow$ *Initialization Vector* untuk proses dekripsi.

### Tabel `assets`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (String)
- `category` (String) $\rightarrow$ Enum: Properti, Kendaraan, Elektronik, Lainnya
- `estimated_value` (Decimal/Numeric)
- `purchase_date` (Date)
- `created_at` (Timestamp)

### Tabel `transactions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `type` (Enum: 'DEPOSIT', 'WITHDRAW')
- `amount` (Decimal/Numeric)
- `note` (Text)
- `transaction_date` (Date)
- `created_at` (Timestamp)

---

## 9. API Design (Endpoint Utama)

*Semua endpoint membutuhkan Bearer Token (JWT / Session Cookie).*

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- **Dashboard**
  - `GET /api/dashboard/summary` $\rightarrow$ Return: `{ total_cash, total_assets, recent_transactions }`
- **Assets**
  - `GET /api/assets`
  - `POST /api/assets`
  - `PUT /api/assets/:id`
  - `DELETE /api/assets/:id`
- **Transactions**
  - `GET /api/transactions` (Bisa menerima query params `?type=DEPOSIT&sort=desc`)
  - `POST /api/transactions`
- **Profile**
  - `GET /api/profile` (Data sensitif dikirim dalam keadaan *masked* dari server, atau di-*unmask* sesuai request).
  - `PUT /api/profile`

---

## 10. UI/Pages Structure

1. **`/auth/login` & `/auth/register`**: Layout otentikasi sederhana, *clean*, dan profesional.
2. **`/dashboard`**: Halaman utama setelah login. Memiliki *Card* untuk Ringkasan Saldo dan Aset. Terdapat grafik batang/garis untuk tren *cashflow*.
3. **`/assets`**: Tabel *data grid* berisi daftar aset. Terdapat tombol "Add Asset" yang membuka *Modal/Drawer*.
4. **`/transactions`**: Menampilkan riwayat pemasukan dan pengeluaran. Tab untuk filter (Semua, Deposit, Withdraw).
5. **`/settings/profile`**: Halaman form untuk mengubah nama, mengelola NIK (dengan tombol mata untuk *unmask*), dan ganti password.

---

## 11. Edge Cases (Skenario Khusus)

- **Saldo Tidak Cukup:** Pengguna mencoba melakukan *Withdraw* yang melebihi jumlah *Total Cash* yang ada. *Sistem harus menolak atau menampilkan peringatan keras (Warning)*.
- **Race Condition:** Pengguna mengklik tombol submit "Deposit" berkali-kali dengan cepat. *Solusi: Disable tombol submit saat loading, dan implementasi Idempotency Key atau rate limit di backend.*
- **Enkripsi Hilang:** Jika `APP_SECRET` atau kunci enkripsi hilang, data NIK pengguna tidak bisa dibaca. *Solusi: Pastikan manajemen Environment Variables sangat aman (contoh: Vercel Env, AWS KMS).*

---

## 12. Scope & Development Plan

Pendekatan *Agile Development* dibagi menjadi 4 Sprint (Estimasi: 4 - 6 Minggu):

- **Phase 1 (Week 1): Foundation & Auth**
  - Setup repository, Vercel, Database (PostgreSQL).
  - Skema database (Prisma/Drizzle).
  - Implementasi NextAuth/Supabase Auth untuk Login/Register.
- **Phase 2 (Week 2): Asset & Transaction API**
  - Backend API untuk CRUD Aset dan Transaksi.
  - Implementasi logika perhitungan Saldo.
- **Phase 3 (Week 3-4): Frontend Integration & Dashboard**
  - Membangun UI Dashboard, Tabel Transaksi, dan Modal Aset.
  - Integrasi API ke Frontend menggunakan SWR/React Query.
- **Phase 4 (Week 5): Security & Polish**
  - Implementasi Enkripsi NIK & Data Masking UI.
  - Testing, perbaikan *bug*, responsivitas mobile, dan deployment rilis produksi.

---

## 13. Testing Plan

- **Unit Testing (Jest / Vitest):** Menguji fungsi kalkulasi saldo, format mata uang (Rupiah), dan utilitas enkripsi/dekripsi secara isolasi.
- **Integration Testing:** Memastikan API endpoint `/api/transactions` merespon dengan benar dan merubah database.
- **E2E Testing (Cypress / Playwright):** Mengotomatisasi simulasi *user journey* (Login $\rightarrow$ Input Deposit $\rightarrow$ Cek Saldo Dasbor).
- **Security Check:** Memastikan tidak ada data NIK / Password yang terekspos di respon *Network tab* *browser* dalam format *plain-text*.

---

## 14. Tech Stack Recommendation (Next.js Ecosystem)

Untuk membangun aplikasi web moderen, cepat, dan aman untuk "Mifa Capital", berikut adalah *tech stack* rekomendasinya:

- **Frontend / Core Framework:** Next.js (App Router, React 18+)
- **Styling / UI Library:** Tailwind CSS + Shadcn UI (memberikan tampilan *clean*, *premium*, dan sangat kustom).
- **Backend (API):** Next.js Route Handlers (Serverless API).
- **Database:** PostgreSQL (Bisa menggunakan *managed service* seperti Neon DB, Supabase, atau Vercel Postgres).
- **ORM (Object Relational Mapping):** Prisma (Sangat *developer-friendly*) atau Drizzle ORM (Performa sangat tinggi).
- **Authentication:** NextAuth.js (Auth.js v5) atau Supabase Auth.
- **State Management:** Zustand (untuk UI state ringan) dan React Query / SWR (untuk *data fetching*).
- **Security & Encryption:** Modul `crypto` bawaan Node.js (Algoritma `aes-256-gcm`) untuk enkripsi dua arah pada data NIK.

---
*Dokumen PRD ini dirancang untuk dapat langsung diserahkan kepada tim UI/UX Designer dan Software Engineer sebagai acuan *development* proyek Mifa Capital.*
