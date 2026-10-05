# Kartu ulang tahun Nabila

Kartu interaktif: amplop → ucapan → surat → doa. Akses publik terkunci hingga **10 Oktober 2026 pukul 00.00 WIB**, lalu tetap terbuka. Server tidak mengirim isi surat sebelum waktunya. `/admin` menyediakan login, editor dan pratinjau dengan sesi 8 jam.

## Menjalankan lokal

Salin `.env.example` ke `.env.local`, isi `ADMIN_PASSWORD` dan `SESSION_SECRET` dengan nilai acak yang kuat (minimal 32 karakter untuk secret). Jalankan `npm run dev`. Buka http://localhost:3000 dan http://localhost:3000/admin. Tanpa Redis, perubahan lokal disimpan ke `.local/card.json`.

## Vercel

1. Dari folder ini jalankan `npx vercel login`, lalu `npx vercel link` dan buat proyek baru `nabila-birthday` (framework Other).
2. Di Vercel Marketplace hubungkan Upstash Redis ke proyek ini. Pastikan environment variables `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` tersedia. Redis menyimpan ucapan dan membatasi percobaan login. Tidak ada fallback filesystem di Vercel.
3. Tambahkan `ADMIN_PASSWORD` dan `SESSION_SECRET` sebagai environment variables production. Gunakan kata sandi privat dan secret acak minimal 32 karakter. Jangan kirim atau masukkan secret ke berkas publik.
4. Jalankan `npx vercel --prod`. Konfigurasi build dan API sudah tersedia dalam `vercel.json`. Kirim URL utama ke Nabila; simpan URL `/admin` untukmu sendiri.
5. Masuk editor, isi nama pengirim dan ucapan, simpan, kemudian buka pratinjau. Cek tautan publik di mode incognito: sebelum tanggal pembukaan yang tampil hanya hitung mundur. Pratinjau setelah login menggunakan cookie admin pada browser yang sama.

Hanya folder `public` yang masuk output statis. `.env.local`, `lib`, dan `.local` tidak masuk hasil build publik. Ucapan awal masih contoh dan tidak mengasumsikan umur Nabila. Proyek lama `../birthday-card` dipertahankan.

## Pemeriksaan

`npm test` memeriksa batas waktu WIB, tidak bocornya isi melalui API saat terkunci, otorisasi edit, sesi palsu/kedaluwarsa, origin dan validasi isi. `npm run build` menghasilkan berkas statis di `dist`.

Referensi runtime: https://vercel.com/docs/functions/runtimes/node-js
Referensi penyimpanan: https://upstash.com/docs/redis/features/restapi
