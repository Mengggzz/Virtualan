# Virtualan — Bilik Foto Virtual (Photobooth Strip)

Aplikasi web bilik foto virtual (*photobooth strip*) real-time untuk pasangan LDR, sahabat, maupun solo. Berjalan langsung di browser tanpa login, tanpa database terpusat, dan tanpa watermark.

---

## 🏗️ Arsitektur Sistem

1. **Aset Visual (`assets/`)**:
   - 14 template strip beresolusi cetak 300 DPI (600×1800 px untuk 4×1, 1800×1200 px untuk 2×2, 1200×1600 px untuk format koran).
   - 32 stiker vektor flat transparan 512×512 px dalam 5 kategori.
   - Preset filter foto CSS baku di `assets/filters.json`.
   - Font Google Fonts bebas lisensi (`Playfair Display`, `Caveat`, `Inter`).

2. **Aplikasi Web Klien (`web/`)**:
   - Dibangun dengan **React 19 + TypeScript + Vite**.
   - Penyimpanan lokal penuh di browser menggunakan **IndexedDB** (`idb`). Tidak ada foto atau video yang dikirim ke server.
   - Sistem bahasa ganda **Indonesia (ID) & Inggris (EN)** via hook `useT()`.
   - Responsive mobile-first (maksimal 430 px di desktop) dan berkemampuan **PWA** (*Add to Home Screen*).

3. **Server Sinyal & Ruangan (`server/`)**:
   - Dibangun dengan **Node.js + `ws`** murni tanpa database.
   - Mengelola pembuatan kode ruangan 6 karakter (alfabet non-ambigu).
   - Melakukan relay sinyal **WebRTC (Offer / Answer / ICE Candidates)** dan pesan status bilik foto.
   - Menegakkan TTL ruangan (15 menit untuk ruang tunggu, 5 menit untuk sesi aktif).

---

## 🚀 Cara Menjalankan Lokal

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node.js 20+)
- npm versi 9+

### 2. Jalankan Signaling Server
```bash
cd server
npm install
npm start
```
Server akan aktif di `http://localhost:8787` (HTTP health check di `/health` dan WebSocket di `ws://localhost:8787`).

### 3. Jalankan Aplikasi Web
Buka terminal baru:
```bash
cd web
npm install
npm run dev
```
Buka browser di alamat yang ditampilkan Vite (biasanya `http://localhost:5173/`).

---

## ⚙️ Variabel Lingkungan (Environment Variables)

### Server (`server/.env` atau environment host)
| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `8787` | Port yang digunakan oleh HTTP & WebSocket server. |

### Web Client (`web/.env` saat build/dev)
| Variabel | Default | Keterangan |
|---|---|---|
| `VITE_SIGNALING_URL` | `ws://<host>:8787` | Alamat WebSocket server signaling. |
| `VITE_ICE_SERVERS` | `[{"urls":"stun:stun.l.google.com:19302"}]` | Konfigurasi STUN/TURN server dalam format JSON string. |

---

## 🌐 Catatan Penerapan (Deployment)

1. **Aplikasi Web**:
   - Dapat di-hosting sebagai situs statis di Vercel, Netlify, Cloudflare Pages, atau GitHub Pages.
   - Jalankan `npm run build` di direktori `web/`; berkas statis siap saji berada di folder `web/dist/`.

2. **Signaling Server**:
   - Memerlukan lingkungan proses Node.js persisten dengan dukungan WebSocket (misal: Railway, Render, Fly.io, atau VPS Linux).

3. **Penyediaan Server TURN untuk Mode Berdua Lintas Operator**:
   - Secara default, aplikasi menyertakan server STUN publik Google untuk koneksi P2P langsung.
   - Untuk menjamin kelancaran koneksi video dan transfer foto di jaringan seluler dengan Symmetric NAT / firewall ketat, **sediakan server TURN terpisah** (misalnya menggunakan coturn self-hosted, Twilio Network Traversal, atau Xirsys) dan setel variabel `VITE_ICE_SERVERS`.
   - **PENTING:** Jangan pernah melakukan *hardcode* kredensial TURN ke dalam kode sumber repo.

---

## 📄 Lisensi & Hak Cipta
© 2026 Virtualan. Dilengkapi dengan filosofi privasi penuh tanpa akun dan gratis untuk semua pengguna.
