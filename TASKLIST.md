# Task List Lengkap — Virtualan (Aset + Aplikasi, Satu Berkas)

**Untuk:** agent pelaksana
**Sumber kebenaran:** `prd-photobooth.md` v1.2 (semua nomor FR merujuk ke sana)
**Lampiran referensi (WAJIB dibaca):** `inventaris-template-stiker-virtualan.md` (deskripsi & contoh dari 3 situs referensi), `mockup-photobooth-1-masuk.png` s.d. `mockup-photobooth-6-hasil.png` (acuan visual per layar), `logo-virtualan-icon.png`.
**Isi berkas ini:** Paket 1 — Aset Visual (**Task 1–24**) dan Paket 2 — Aplikasi Web (**Task 25–46**) digabung dengan penomoran menyatu. Berkas ini menggantikan dua task list terpisah (`tasklist-virtualan-aset.md` & `tasklist-virtualan-aplikasi.md`) untuk penyerahan tunggal — isinya sama, hanya dinomori ulang.

## Sambungan (urutan eksekusi gabungan)

1. **Task 1–3 (Aset-A) dulu** — fondasi aset: struktur folder, geometri layout, font. Semua angka geometri di berkas ini berasal dari Task 2.
2. **Task 4–24 (Aset-B s.d. Aset-E)** — 14 template, 32 stiker, preset filter, diakhiri verifikasi aset (Task 24). Boleh paralel antar-template/stiker setelah Task 2.
3. **Task 25–28 (App-A) boleh mulai segera setelah Task 2 selesai** (tidak perlu menunggu seluruh aset). **Task 29** (pemuat aset) membutuhkan folder `assets/` dari Paket 1; bila aset belum lengkap, pakai template yang sudah ada (minimal `film-hitam` & `koran-harian`).
4. **Task 30–36 (App-B)** — mode Sendiri end-to-end (milestone M1). Setelah ini aplikasi sudah bisa dipakai solo secara utuh.
5. **Task 37–42 (App-C)** — mode Berdua: server signaling, WebRTC, jepret sinkron (M2), memakai ulang layar & render dari App-B.
6. **Task 43–46 (App-D)** — koleksi, PWA/ketahanan, halaman statis, verifikasi akhir aplikasi (M3–M4).
7. Dua gerbang kualitas yang terpisah: **Task 24** (verifikasi aset) dan **Task 46** (verifikasi aplikasi). Keduanya wajib lulus dengan laporan tertulis.

## Aturan global (berlaku untuk kedua paket)

- **Dilarang membuat login, akun, pembayaran, watermark, atau fitur terkunci dalam bentuk apa pun** (keputusan produk di PRD Bagian 12). Semua fitur gratis; semua pengguna tamu; koleksi hanya di perangkat pengguna.
- Aset digambar/dibangun dari spesifikasi di berkas ini (SVG → PNG). **Dilarang** mengunduh atau menjiplak file gambar dari photobooth-io.cc, jepreto.com, atau momotoldr.com. Karakter berlisensi & referensi lagu (Task 15, 16, 17, 22) tetap dikerjakan sesuai keputusan pemilik produk.
- Stack aplikasi baku: **React 18 + Vite + TypeScript** (`web/`) dan **Node.js 20 + `ws`** (`server/`). Tanpa database.
- Semua teks UI aplikasi wajib lewat kamus i18n (Task 27) — tidak ada string tampilan hardcoded di komponen.
- Geometri strip, format `template.json`, dan nama file mengikuti Task 1–2 persis di mana pun dipakai (aset maupun render di aplikasi).
- Video tidak pernah direkam dan tidak pernah dikirim ke server; server hanya relay sinyal WebRTC & status ruangan.
- Penamaan file persis seperti tertulis di tiap task — jangan improvisasi nama.
- Setiap task selesai bila perilakunya bisa didemonstrasikan sesuai kalimat terakhir task-nya.

---

## Paket 1 — Aset Visual (Task 1–24)

## Aset-A — Fondasi

### Task 1 — Struktur folder & indeks aset

Buat struktur berikut di repo/direktori aset proyek:

```
assets/
  templates/
    <template-id>/
      frame-4x1.png      (overlay transparan, 600×1800)
      frame-2x2.png      (overlay transparan, 1800×1200 — hanya template yang disebut di Task 16)
      thumb-4x1.png      (200×600)
      thumb-2x2.png      (450×300 — bila ada frame-2x2)
      template.json
    templates-index.json (daftar semua template: id, nama, layout tersedia, kategori)
  stickers/
    <sticker-id>.png     (512×512 transparan)
    stickers-index.json  (daftar semua stiker: id, nama, kategori)
  filters.json           (dari Task 23)
```

### Task 2 — Geometri layout (ANGKA BAKU — semua template mengikuti ini)

Rasio dasar: **satu frame orang = 3:4 portrait**; **satu foto pasangan (duo) = dua frame orang berdampingan = 3:2 landscape**. Mode Sendiri memakai slot yang sama, diisi satu orang (center-crop 3:2).

**Layout 4×1 — kanvas 600×1800 px (2×6 inci @300 DPI):**

| Elemen | Nilai |
|---|---|
| Margin kiri/kanan | 40 px |
| Zona header | y 0–180 |
| Slot foto | x=40, lebar 520, tinggi 347 |
| Posisi y slot ke-1..4 | 180, 543, 906, 1269 (pitch 363, celah antar-slot 16) |
| Zona footer | y 1616–1800 (tinggi 184) |
| Sub-slot orang (duo) | di dalam slot: orang A x-offset 0 lebar 256; orang B x-offset 264 lebar 256 (celah 8); tinggi 347 |

**Layout 2×2 — kanvas 1800×1200 px (6×4 inci @300 DPI, landscape):**

| Elemen | Nilai |
|---|---|
| Margin | 60 px (kiri/kanan), 48 px (atas), 24 px (bawah) |
| Slot foto | lebar 828, tinggi 552 |
| Posisi slot (x,y) | (60,48), (912,48), (60,624), (912,624) — celah 24 |
| Sub-slot orang (duo) | orang A x-offset 0 lebar 408; orang B x-offset 420 lebar 408 (celah 12); tinggi 552 |

**Format `template.json` per template:**

```json
{
  "id": "film-hitam",
  "name": "Film Hitam",
  "category": "klasik",
  "layouts": ["4x1", "2x2"],
  "canvas": { "4x1": [600, 1800], "2x2": [1800, 1200] },
  "slots": { "4x1": [{"x":40,"y":180,"w":520,"h":347,"shape":"rect"}], "2x2": [] },
  "bg": "#141414",
  "footerText": ""
}
```

`shape` hanya `"rect"`, kecuali template Hati (Task 11) yang memakai `"heart"`.

### Task 3 — Font & aturan tipografi template

- Unduh font Google Fonts (lisensi terbuka) dan simpan di `assets/fonts/`: **Playfair Display** (900 — judul koran/serif), **Caveat** (700 — tulisan tangan/script), **Inter** (600/800 — label & footer kecil).
- Teks brand di footer template selalu: `VIRTUALAN` (Inter 800, letter-spacing lebar) — tidak ada nama situs lain di aset mana pun.
- Teks di dalam desain template hanya yang tertulis di task masing-masing; jangan menambah teks sendiri.

---

## Aset-B — Template (layout 4×1 dulu)

Setiap task menghasilkan untuk template-nya: `frame-4x1.png` (overlay: latar + dekorasi + bingkai, slot foto transparan sesuai Task 2), `thumb-4x1.png` (pratinjau memakai 4 foto contoh warna-warni sederhana), dan `template.json`.

### Task 4 — Template "Film Hitam" (id: `film-hitam`, kategori: klasik)
- Latar: `#141414`. Sisi kiri & kanan strip: kolom perforasi film — lubang persegi panjang rounded warna `#F5F2EA`, ukuran 18×26 px, jarak vertikal 44 px, di x=8 dan x=574 (di dalam margin).
- Tiap slot: bingkai garis putih `#FFFFFF` 4 px mengelilingi slot.
- Footer: teks `VIRTUALAN` putih, Inter 800, 28 px, di tengah zona footer.

### Task 5 — Template "Film Putih" (id: `film-putih`, kategori: klasik)
- Latar: `#FAF8F3`. Perforasi sama seperti Task 4 tetapi warna `#D9D5CB`.
- Bingkai slot: garis `#CFC9BB` 3 px. Footer: `VIRTUALAN` warna `#8A8171`.

### Task 6 — Template "Polos Krem" (id: `polos-krem`, kategori: klasik)
- Latar polos `#F7F1E3`, tanpa perforasi/dekorasi. Bingkai slot: bayangan lembut saja (shadow hitam 12% blur 12).
- Footer: kutipan Caveat 40 px warna `#6B5E4F`: "hari ini, kita." di atas teks `VIRTUALAN` Inter 800 24 px warna `#B09A7A`.

### Task 7 — Template "Koran Harian" (id: `koran-harian`, kategori: koran)
- Latar `#FDFBF4`, tinta `#141414`, aksen merah `#C0392B`.
- Zona header: judul Playfair Display 900, 64 px, di tengah: `KABAR HARI INI`; di atasnya garis ganda (3 px + 1 px) selebar konten; di bawah judul baris kecil Inter 600 20 px: `EDISI HARI INI • SPESIAL DUA ORANG`.
- Bingkai slot: garis tinta 3 px.
- Zona footer: garis ganda seperti header; kutipan Playfair italic 34 px: `"Hari ini milik kita."`; di bawahnya `VIRTUALAN` Inter 800 22 px.

### Task 8 — Template "Senja" (id: `senja`, kategori: warna)
- Latar gradasi vertikal: `#F6B17A` (atas) → `#EE7B9B` (55%) → `#7E6BA8` (bawah).
- Bagian bawah (y 1560–1800): dua lapis gelombang (path sinus) warna `#5B4A8A` dan `#463A6E`.
- Bingkai slot: garis `#FFF7EC` 4 px, sudut rounded 12. Footer: `VIRTUALAN` warna `#FFF7EC` di atas gelombang.

### Task 9 — Template "Pita Biru" (id: `pita-biru`, kategori: warna)
- Latar `#2456A6`. Pita diagonal kuning `#F2C230` melintang di zona header dan zona footer (rotasi −6°), berisi teks berulang Inter 800 26 px warna `#141414`: `MOMEN KITA ★ MOMEN KITA ★`.
- Bingkai slot: garis putih `#FFFFFF` 5 px. (Footer tanpa teks brand terpisah — sudah di pita.)

### Task 10 — Template "Marun Script" (id: `marun-script`, kategori: elegan)
- Latar `#5E2129`. Zona header: tulisan Caveat 700, 84 px, warna `#F3D9CF`, di tengah: `kita`; di bawahnya garis tipis emas `#C9A227` 2 px selebar 200 px di tengah.
- Bingkai slot: garis `#E8CFC0` 3 px. Footer: `VIRTUALAN` warna `#C9A227`.

### Task 11 — Template "Hati" (id: `hati`, kategori: cinta)
- Latar `#FBD9E4`. Slot foto berbentuk **hati** (`shape: "heart"`): tiap slot Task 2 diganti jalur hati yang mengisi persegi slot (lebar 520, tinggi 347, simetris, lekukan atas di tengah).
- Aksen: hati kecil `#D6336C` berserak di zona header & footer (5–7 buah, ukuran 16–30 px, rotasi acak ringan).
- Footer: Caveat 44 px warna `#D6336C`: `untuk kita`.

### Task 12 — Template "Peringatan Kuning" (id: `peringatan-kuning`, kategori: lucu)
- Latar `#111111`. Pita peringatan diagonal (strip hitam-kuning bergantian 45°) selebar 54 px melintang zona header dan footer (rotasi −8°).
- Di tengah zona header, di atas pita: label kuning `#FFD21F` persegi panjang dengan teks Inter 900 30 px `#111111`: `AWAS KEBAHAGIAAN`.
- Bingkai slot: garis `#FFD21F` 4 px. Footer: segitiga peringatan kuning kecil + `VIRTUALAN` warna `#FFD21F`.

### Task 13 — Template "Polkadot Safari" (id: `polkadot`, kategori: pola)
- Latar `#8A5A3B`; polkadot besar `#A8C6E8` diameter 64 px tersebar teratur (grid offset) di seluruh latar, di belakang slot.
- Bingkai slot: garis krem `#F3E5CF` 6 px, rounded 14. Footer: `VIRTUALAN` warna `#F3E5CF`.

### Task 14 — Template "Musiman: Tahun Baru" (id: `musiman-tahun-baru`, kategori: musiman)
- Latar `#10182B`. Confetti titik & bintang kecil emas `#E8C468` dan perak `#C0C6D4` berserak (30–40 buah, 6–14 px).
- Zona header: teks Inter 800 40 px warna `#E8C468`: `TAHUN BARU`.
- Bingkai slot: garis `#E8C468` 3 px. Footer: `VIRTUALAN` warna `#C0C6D4`.
- Catatan di `template.json`: `"seasonal": true` (template ini contoh pola untuk tema musiman berikutnya).

### Task 15 — Template "Snoopy" (id: `snoopy`, kategori: karakter) — KARAKTER BERLISENSI
- Latar krem `#FBF6EA`. Merujuk deskripsi template "snoopy" di lampiran (Bagian C2): strip vertikal, ilustrasi Snoopy (anjing putih, telinga hitam) berbaring santai di zona header di atas slot pertama; bintang `#F2B33D` dan bunga kecil berserak; zona footer: ilustrasi Snoopy & kelinci (Woodstock/teman kelinci) di perahu kertas di bawah bulan sabit dan bintang.
- Bingkai slot: garis `#20242A` 3 px, rounded 10. Footer brand kecil `VIRTUALAN` warna `#8A8171` di sudut kanan bawah zona footer (jangan menimpa ilustrasi).

### Task 16 — Template "Miffy" (id: `miffy`, kategori: karakter) — KARAKTER BERLISENSI + adaptasi 2×2
- **Miffy (4×1):** latar `#FDFDFB`; panel aksen pastel `#FDECEF` di zona header & footer; ilustrasi Miffy (kelinci putih minimalis, telinga panjang, wajah × hidung khas) di zona header kanan; aksen balon `#F6A8C1`, `#8EC9E8`, `#F9D976`. Bingkai slot: garis `#E8B4C4` 4 px rounded 12. Footer: `VIRTUALAN` warna `#C48AA0`.
- **Adaptasi 2×2 (berlaku juga sebagai pola untuk template lain):** buat `frame-2x2.png` + `thumb-2x2.png` untuk 6 template prioritas: `film-hitam`, `film-putih`, `polos-krem`, `koran-harian`, `senja`, `hati` — memakai warna, font, dan elemen yang sama dengan versi 4×1, disusun pada kanvas 1800×1200 dengan slot Task 2 (header/footer menjadi area margin atas/bawah/bingkai luar; teks judul koran di margin atas, kutipan di margin bawah). Perforasi Film Hitam/Putih di 2×2: hanya di tepi atas & bawah kanvas (horizontal). Perbarui `layouts` dan `slots.2x2` di `template.json` masing-masing.

---

### Task 17 — Template "Koran Musik: About You" (id: `koran-musik`, kategori: koran) — REFERENSI LAGU/MEREK
Pengecualian geometri: template ini **lembar koran tersendiri**, tidak memakai geometri Task 2. Kanvas khusus **1200×1600 px**; catat kanvas & slot khusus ini di `template.json` (`"layouts": ["koran"]`).
- Latar `#F7F2E7`, tinta `#141414`. Margin kiri/kanan 70.
- Masthead (y 56–140): teks serif italic Playfair 54 px di tengah: `The 1975`; garis tinta 3 px di bawahnya selebar konten.
- Judul (y 170–300): Playfair Display 900, 118 px, di tengah: `ABOUT YOU`.
- Baris kutipan (y 316–366): Playfair italic 34 px di tengah: `"DO YOU THINK I HAVE FORGOTTEN ABOUT YOU?"`
- Foto: slot besar (x=70, y=430, 640×427) dan slot kecil (x=750, y=430, 380×253), bingkai garis tinta 3 px; di bawah slot kecil caption Inter 20 px: `masih tentangmu.`
- Paragraf (y 920–1160, dua kolom, Inter 24 px, rata kiri-kanan): `Lagu About You menceritakan tentang nostalgia dan kerinduan seseorang terhadap mantan kekasihnya — tentang ingatan yang tidak benar-benar pergi, dan seseorang yang diam-diam masih berharap diingat kembali.`
- Zona footer (y 1460–1560): garis tinta 3 px; di bawahnya `VIRTUALAN • EDISI MUSIK` Inter 800 24 px di tengah.
- Thumbnail: `thumb-koran.png` (300×400) menggantikan `thumb-4x1.png` untuk template ini.

## Aset-C — Stiker

Aturan semua task stiker: gambar sebagai SVG vektor gaya flat illustration (garis bersih, tanpa gradasi rumit), ekspor **PNG transparan 512×512**, subjek mengisi ±80% kanvas, gaya konsisten antar-stiker (ketebalan garis ±10 px, palet cerah). Setelah semua task selesai, buat `stickers-index.json` berisi id, nama, kategori untuk seluruh stiker.

### Task 18 — Stiker kategori "Hewan & Ekspresi" (8 stiker)
1. `kucing` — kepala kucing oranye, telinga segitiga, mata senang tertutup, kumis 3 garis.
2. `anjing` — kepala anjing cokelat muda, telinga turun, lidah menjulur senang.
3. `bebek` — bebek kuning utuh tampak samping, paruh oranye, sayap kecil.
4. `beruang` — kepala beruang cokelat, telinga bulat, moncong krem.
5. `kelinci` — kepala kelinci putih, telinga panjang (satu tegak satu menekuk), hidung pink.
6. `panda` — kepala panda putih, lingkar mata & telinga hitam.
7. `wajah-ngantuk` — wajah bulat kuning, mata setengah tertutup, gelembung "Z z" biru muda.
8. `wajah-cinta` — wajah bulat kuning tersenyum, mata berbentuk hati merah.

### Task 19 — Stiker kategori "Dekorasi" (8 stiker)
1. `bintang` — bintang kuning 5 sudut dengan wajah tersenyum kecil.
2. `sparkle` — kilau 4 sudut (✦) warna pink `#F2789F` + satu kilau kecil putih.
3. `hati` — hati merah mengkilap dengan sorotan putih.
4. `pita` — pita merah muda simpul tengah, gaya kawaii.
5. `bunga` — bunga sakura 5 kelopak pink muda, putik kuning.
6. `balon` — balon merah bentuk hati dengan tali melengkung.
7. `mahkota` — mahkota kuning emas 3 ujung, lingkaran merah di tengah.
8. `kacamata` — kacamata hitam gaya retro, gagang tebal.

### Task 20 — Stiker kategori "Makanan" (4 stiker)
1. `kopi` — gelas kopi take-away putih, tutup cokelat, logo hati kecil, uap melengkung.
2. `boba` — gelas bubble tea susu cokelat muda, mutiara hitam di dasar, sedotan pink besar.
3. `eskrim` — es krim cone: wafel cokelat muda, scoop pink + cokelat, ceri di atas.
4. `donat` — donat cokelat dengan taburan meses warna-warni.

### Task 21 — Stiker kategori "Teks Tempel" (4 stiker)
Font Caveat 700, teks besar memenuhi kanvas, diberi outline putih tebal (stroke 14 px) + bayangan warna di belakang teks:
1. `teks-bestie` — teks `BESTIE`, huruf pink `#F2789F`, bayangan `#FBD3DD`.
2. `teks-ldr` — teks `LDR CLUB`, huruf biru `#2456A6`, bayangan `#B9CFE8`.
3. `teks-ketemu` — teks dua baris `AKHIRNYA` / `KETEMU`, huruf hijau `#1E9E6A`, bayangan `#C9F2D8`.
4. `teks-pose` — teks `POSE!`, huruf oranye `#F08C1E`, bayangan `#FDEBD2`.

### Task 22 — Stiker karakter berlisensi (8 stiker) — KARAKTER BERLISENSI
Flat illustration semirip referensi di lampiran; tetap diekspor dengan aturan Bagian C:
1. `snoopy-baring` — Snoopy berbaring tengkurap, dagu di atas kedua kaki depan.
2. `snoopy-duduk` — Snoopy duduk profil, telinga hitam panjang.
3. `snoopy-topi` — Snoopy memakai topi pesta segitiga warna-warni.
4. `woodstock` — burung kecil kuning (Woodstock) berdiri, paruh oranye.
5. `miffy-berdiri` — Miffy berdiri, gaun oranye.
6. `miffy-biru` — Miffy gaun biru, memegang balon merah.
7. `miffy-bunga` — Miffy memegang seikat bunga pink.
8. `miffy-gelombang` — Miffy melambai satu tangan, gaun hijau.

---

## Aset-D — Preset Filter

### Task 23 — File `assets/filters.json` (8 filter)
Tulis file JSON berisi array filter; tiap entri: `id`, `name`, `cssFilter` (string filter CSS yang diterapkan ke foto), `note`. Nilai baku:

| id | name | cssFilter |
|---|---|---|
| `asli` | Asli | `none` |
| `hitam-putih` | Hitam Putih | `grayscale(1)` |
| `sepia` | Sepia | `sepia(0.65)` |
| `vintage` | Vintage | `sepia(0.4) contrast(0.92) brightness(1.06) saturate(0.85)` |
| `hangat` | Hangat | `sepia(0.25) saturate(1.15) brightness(1.03) hue-rotate(-8deg)` |
| `sejuk` | Sejuk | `saturate(0.92) brightness(1.04) hue-rotate(12deg)` |
| `pudar` | Pudar | `contrast(0.88) brightness(1.12) saturate(0.75)` |
| `vhs` | VHS | `saturate(1.3) contrast(1.05)` — note: "efek garis scan & geser warna RGB ditambah di kode render, bukan di preset ini" |

---

## Aset-E — Verifikasi

### Task 24 — Render uji & checklist akhir
1. Buat skrip render uji: ambil 8 foto contoh (4 pasang warna berbeda), kompositkan ke **setiap** `frame-4x1.png` dan `frame-2x2.png`, ekspor hasil ke folder `preview-check/` (di luar `assets/`).
2. Periksa satu per satu dan laporkan dalam file `preview-check/LAPORAN.md`:
   - [ ] Slot transparan persis di koordinat Task 2 (foto tidak tertutup dekorasi, tidak ada celah latar di dalam slot).
   - [ ] Sub-slot duo sejajar: garis tengah pasangan lurus di semua slot.
   - [ ] Teks template terbaca dan tidak terpotong kanvas (judul koran, pita, label peringatan).
   - [ ] Template Hati: foto terpotong bentuk hati simetris, tidak ada sisa persegi.
   - [ ] Semua stiker latar transparan, tidak ada sisa latar putih, tepi bersih di 512×512.
   - [ ] `templates-index.json` dan `stickers-index.json` berisi semua aset yang dibuat (14 template, 32 stiker) dan semua `template.json` valid JSON.
   - [ ] Tidak ada aset yang memakai nama/teks situs referensi (photobooth-io, Momoto, jepreto, "HAPPEN TODAY").
3. Sertakan tangkapan hasil render uji untuk minimal 4 template (film-hitam, koran-harian, hati, snoopy) di laporan.

**Selesai =** semua item checklist tercentang dan laporan render uji tersedia. Item yang gagal diperbaiki di task asetnya masing-masing, lalu Task 24 diulang untuk item itu saja.

---

## Paket 2 — Aplikasi Web (Task 25–46)

## App-A — Fondasi

### Task 25 — Scaffold proyek
- Buat struktur: `web/` (Vite React TS) dan `server/` (Node, entry `server/index.js`, `npm start`, port dari env `PORT`, default 8787).
- Di `web/src/`: folder `pages/`, `components/`, `services/`, `state/`, `i18n/`.
- Root `README.md`: cara menjalankan lokal (install, `npm run dev` untuk web, `npm start` untuk server, variabel env yang dikenal).
- Selesai bila: web dev server terbuka menampilkan halaman kosong berjudul "Virtualan" dan server menjawab health-check HTTP 200 di `/health`.

### Task 26 — Design system & komponen dasar
- Terapkan gaya visual mockup sebagai CSS variables & komponen: latar `#FBFAF7`; kartu putih radius 24, border `#EFEDEA`, bayangan lembut; teks `#111827`; abu `#6B7280`; CTA hitam `#0B0B12` radius 18; pill hijau `#DCF5E5` / teks `#15803D`; pink brand `#F2789F`; font Inter (400/600/700/800/900).
- Komponen: `Header` (logo ikon Virtualan + teks "Virtualan.", ikon Koleksi dengan badge jumlah, toggle EN/ID, menu), `StatusPill`, `CtaButton`, `GhostButton`, `Modal` dasar, `Toast`.
- Selesai bila: halaman contoh internal menampilkan semua komponen sesuai proporsi mockup 2 (header) — header ini dipakai semua halaman (FR-7.5), tanpa tombol login/avatar.

### Task 27 — i18n (Indonesia / Inggris)
- `i18n/id.ts` dan `i18n/en.ts` dengan kunci yang sama untuk semua teks layar (masuk, menunggu, lobi, sesi, edit, hasil, koleksi, tips, error).
- Context + hook `useT()`; bahasa default `id`; pilihan disimpan di `localStorage` kunci `virtualan.lang`; toggle di Header mengganti seluruh UI seketika (FR-9.1).
- Selesai bila: mengganti toggle EN/ID mengubah semua teks di halaman Masuk tanpa reload.

### Task 28 — Penyimpanan lokal (IndexedDB)
- Pakai library `idb`. DB `virtualan` versi 1: store `strips` (keyPath `id`, index `by-created`) berisi `{id, pngBlob, thumbBlob, templateId, layout, createdAt}`; store `settings` (keyPath `key`) untuk preferensi (tips opt-out, bahasa cadangan).
- Fungsi service: `saveStrip()`, `listStrips()`, `countStrips()`, `getStrip()`, `deleteStrip()`, `getSetting()`, `setSetting()`.
- Saat penyimpanan strip pertama, panggil `navigator.storage.persist()` (mitigasi PRD Bagian 10). Tidak ada satu pun fungsi yang mengirim data ke jaringan.
- Selesai bila: strip contoh yang disimpan tetap ada setelah browser ditutup-dibuka (uji manual dicatat di Task 46).

### Task 29 — Pemuatan aset (template, stiker, filter)
- Skrip `prebuild`/`predev` menyalin folder `assets/` (hasil Paket 1 file ini) ke `web/public/assets/`.
- Service `loadCatalog()`: fetch `templates-index.json`, `stickers-index.json`, `filters.json`; simpan di state global (zustand atau React context — pilih satu, konsisten); frame PNG & stiker dimuat lazy per kebutuhan.
- Bila indeks tidak ditemukan: tampilkan halaman peringatan dev yang jelas berisi path yang dicari (bukan layar putih/crash).
- Selesai bila: mengganti isi `templates-index.json` (tanpa ubah kode) mengubah daftar template yang tampil di pemilih template Task 31.

---

## App-B — Mode Sendiri (M1)

### Task 30 — Halaman Masuk (route `/`)
- Sesuai mockup 1 & FR-1.1/1.2/1.3: kartu **Sendiri** → `/booth?solo=1`; kartu **Berdua** → buat ruangan (Task 38; sampai Bagian C selesai, tombol ini menampilkan status "menghubungkan" saja); kolom "Sudah punya kode?" + tombol **Gabung** → validasi format (6 karakter) → gabung ruangan (Task 38).
- Kode tidak valid/kedaluwarsa/ruangan penuh → pesan error spesifik dari server ditampilkan di bawah kolom (FR-1.3, FR-1.4).
- Footer: tautan Syarat & Ketentuan serta Kebijakan Privasi (Task 45) + baris "Virtualan — Jepret, susun, bagikan."
- Selesai bila: alur Sendiri bisa diklik sampai ke booth; input kode kosong/5 karakter ditolak dengan pesan sebelum ke server.

### Task 31 — Booth & kamera (dipakai solo dan duo)
- Minta izin kamera + mikrofon **setelah** penjelasan singkat di layar (FR-2.1): `getUserMedia({video:{facingMode:'user', width:{ideal:1280}, height:{ideal:960}}, audio:true})`. Bila ditolak: panel panduan cara mengaktifkan izin di browser + tombol Coba lagi. Bedakan error "ditolak" vs "perangkat tidak ditemukan".
- Panel video lokal; toggle mic (enable/disable track audio lokal); chip status "Kamera nyala / Mic nyala" (FR-2.3).
- Pemilih template (FR-3.3, sebelum sesi): toggle layout 4×1/2×2 + carousel thumbnail dari katalog Task 29 (hanya template yang menyediakan layout terpilih; template `koran-musik` tampil sebagai pilihan format Koran tersendiri).
- Pratinjau strip live (FR-2.5): di samping panel video, tampilkan rangka strip template terpilih dengan video lokal mengisi slot berikutnya.
- Selesai bila: mengganti template mengubah bentuk pratinjau strip seketika, dan mic toggle mematikan indikator mic.

### Task 32 — Sesi foto (capture engine, dipakai solo & duo)
- Fungsi `captureFrame(videoEl)`: gambar frame saat ini ke canvas, crop tengah rasio **3:4** (frame orang), target simpan 1080×1440 (atau resolusi asli video bila lebih kecil), hasil blob JPEG kualitas 0.92.
- Alur sesi: tombol **Mulai Sesi** → untuk foto ke-1..4: tampilkan countdown angka besar 3-2-1 (sesuai mockup 4) → capture → simpan blob di state sesi (memori saja, FR-4.5) → jeda ganti pose 2,5 detik → lanjut. Progres "Foto i dari 4" + indikator slot di strip pratinjau.
- Komposit slot: mode solo = satu frame orang di-center-crop menjadi slot 3:2; mode duo = dua frame orang berdampingan (diisi Task 40).
- Selesai bila: 4 kali jepret menghasilkan 4 blob berbeda yang tampil berurutan di pratinjau strip.

### Task 33 — Timer sesi
- Timer 5:00 (FR-1.6). Solo: mulai saat sesi pertama dimulai. Duo: mulai dari `sessionEndsAt` yang diberikan server (Task 37) — klien hanya me-render sisa waktu dari timestamp itu, bukan menghitung sendiri.
- Tampilan "SISA m:ss" selalu terlihat di booth & layar edit; pada < 1:00 berubah warna peringatan + teks "Kurang dari 1 menit".
- Saat 0: pengambilan foto berhenti; bila strip belum final → dialog "Waktu habis — sesi ditutup", foto sesi dibersihkan, kembali ke Halaman Masuk. (Finalisasi memang dirancang terjadi sebelum timer habis, sesuai alur PRD Bagian 5.)
- Selesai bila: timer yang dipasang 10 detik (mode uji) menutup sesi tepat pada 0 dengan perilaku di atas.

### Task 34 — Render strip (canvas)
- Fungsi murni `renderStrip({photos, template, filter, stickers})` → `Promise<Blob PNG>` pada ukuran kanvas template persis (600×1800, 1800×1200, atau 1200×1600 untuk koran).
- Urutan gambar: (1) foto per slot mengikuti koordinat `template.json` — duo: dua sub-slot orang sesuai geometri Task 2; solo: satu slot penuh; template `hati`: clip jalur hati per slot sebelum menggambar foto; (2) filter: terapkan string `cssFilter` dari `filters.json` ke foto via `ctx.filter` saat menggambar (bila `ctx.filter` tidak didukung browser: gambar tanpa filter dan beri `console.warn` — jangan gagal); (3) overlay `frame-*.png`; (4) stiker menurut state edit `{stickerId, x, y, scale, rotation}` dalam koordinat kanvas.
- Satu fungsi untuk dua pemakaian: pratinjau edit (render di kanvas tampil, resolusi penuh tidak masalah) dan finalisasi.
- Selesai bila: render uji dengan 4 foto contoh menghasilkan PNG 600×1800 yang slotnya terisi penuh tanpa celah dan overlay sejajar (bandingkan dengan hasil render uji Paket 1 (Task 24) bila tersedia).

### Task 35 — Layar Review & Edit
- Sesuai mockup 5 & FR-5: strip pratinjau (Task 34), foto bernomor 1–4, kamera tetap menyala di panel kecil (ruangan masih terbuka selama timer berjalan).
- Susun ulang: seret foto (pointer events; sentuh & mouse) untuk menukar urutan (FR-5.1).
- Retake per foto: tombol ↺ di tiap foto → capture ulang satu slot itu saja (Task 32 mode satu slot), template & filter tidak berubah (FR-5.2). **Ambil ulang semua** → kembali ke Task 32 dari foto 1 (FR-5.3).
- Tab **Filter**: daftar dari `filters.json`, thumbnail pratinjau memakai foto pertama sesi; filter aktif diterapkan ke seluruh strip (FR-5.4).
- Tab **Stiker**: palet per kategori dari `stickers-index.json`; ketuk = tempel di tengah atas strip; seret badan = pindah; gagang sudut kanan-bawah = ubah ukuran; gagang sudut kiri-bawah = putar; tombol × = hapus (FR-5.5 + pola interaksi terverifikasi di inventaris Bagian C3).
- Selesai bila: urutan, filter, dan satu stiker yang ditempel/digeser/diputar tampil sama di pratinjau dan di hasil render Task 34.

### Task 36 — Finalisasi, Hasil & Tips
- Tombol **Buat strip** → dialog konfirmasi (FR-6.1): teks menyatakan strip final tidak bisa diubah lagi; tombol **Ya, buat** / **Lanjut edit**.
- "Ya, buat" → render resolusi penuh (Task 34) → buat thumbnail lebar 360 → `saveStrip()` (Task 28) → layar Hasil (mockup 6): badge "Tersimpan di Koleksi", strip tampil, tombol **Bagikan** (`navigator.share` dengan File PNG; fallback otomatis ke unduh bila share tak didukung), tombol **Unduh PNG** (nama file `virtualan-strip-<yyyymmdd-hhmmss>.png`), tautan "Buat strip lagi".
- Modal Tips (FR-8) sebagai komponen `TipsModal` dengan 3 set isi: (a) menunggu teman, (b) di dalam booth, (c) strip sudah jadi — teks dari kamus i18n mengikuti isi tips pada mockup 2 & alur PRD; checkbox "jangan tampilkan lagi" menyimpan opt-out per momen via Task 28 settings.
- Selesai bila: strip yang difinalisasi muncul di Koleksi (Task 43) setelah reload, dan modal tips tidak muncul lagi setelah checkbox dicentang.

---

## App-C — Mode Berdua (M2)

### Task 37 — Server signaling & ruangan (`server/`)
- WebSocket server dengan pesan JSON bertipe. Endpoint HTTP hanya `/health`.
- Perintah dari klien: `create` → buat ruangan: kode 6 karakter dari alfabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (tanpa karakter ambigu 0/O/1/I/L), unik di antara ruangan aktif; balas `{roomCode, role:'host', serverNow}`.
- `join {code}` → validasi: tidak ada → error `ROOM_NOT_FOUND`; sudah ada 2 peserta → `ROOM_FULL`; kedaluwarsa → `ROOM_EXPIRED`. Berhasil: peserta kedua terdaftar, server menetapkan `sessionEndsAt = now + 5 menit`, broadcast `guest-joined {sessionEndsAt, serverNow}` ke host dan guest.
- Relay WebRTC: `offer` / `answer` / `ice` diteruskan hanya ke peserta lain dalam ruangan yang sama. Relay status: `template-changed {templateId, layout}` (dari host), `session-started`, `room-closed`.
- TTL ruangan menunggu (belum ada guest): 15 menit sejak dibuat. Ruangan dihapus saat `sessionEndsAt` tercapai, host menutup, atau TTL habis. Server **tidak** menyimpan gambar, log isi sesi, atau data pengguna apa pun (hanya state ruangan di memori).
- Estimasi offset jam: setiap pesan `join-ack`/`guest-joined` menyertakan `serverNow` agar klien menghitung offset untuk Task 40.
- Selesai bila: dua klien WebSocket uji bisa create → join → saling relay offer, dan klien ketiga ditolak `ROOM_FULL`.

### Task 38 — Klien ruangan: buat, gabung, menunggu
- Dari Halaman Masuk: **Berdua** → kirim `create`, tampilkan Layar Menunggu (mockup 2): kode besar (ketuk = salin ke clipboard + toast "Kode tersalin"), StatusPill "Menghubungkan…" → "Menunggu teman…", modal tips menunggu (Task 36), tombol **Selesai** (tutup ruangan, kembali ke `/`).
- **Gabung** dengan kode → kirim `join`; error server diterjemahkan ke pesan manusiawi di bawah kolom kode (FR-1.3/1.4).
- Saat `guest-joined`: kedua sisi pindah ke Booth (Task 31 versi duo: panel Kamu + Teman), toast "Temanmu bergabung", StatusPill "Teman terhubung", timer mulai dari `sessionEndsAt` (Task 33).
- Pilihan template hanya bisa diubah **host**; perubahan di-broadcast dan diterapkan di sisi guest (FR: host memegang sesi, PRD Bagian 4).
- Selesai bila: dua tab browser berbeda bisa bertemu di booth yang sama memakai kode, dan guest melihat template berubah saat host mengganti template.

### Task 39 — WebRTC video dua arah
- `RTCPeerConnection` dengan `iceServers` dari env build `VITE_ICE_SERVERS` (JSON). Default bawaan kode: STUN `stun:stun.l.google.com:19302`; TURN dibiarkan kosong secara default dan diisi lewat env (jangan hardcode kredensial TURN apa pun).
- Host menjadi offerer segera setelah `guest-joined`; guest menjawab. Tampilkan video remote di panel Teman; status koneksi jujur: `connecting` → "Menghubungkan…", `connected` → "Teman terhubung", `disconnected/failed` → "Terputus".
- Mic toggle hanya memengaruhi track sendiri (Task 31).
- Terputus (FR-1.7): sisi yang masih terhubung melihat banner "Teman terputus" dengan pilihan **Tunggu** (timer tetap berjalan) atau **Akhiri sesi** (tutup ruangan). Guest yang terputus dapat **gabung ulang dengan kode yang sama** selama timer belum habis — server menerima join ke slot guest yang kosong (ruangan ditandai `guestDisconnected`, bukan dihapus).
- Selesai bila: mematikan jaringan satu tab selama 10 detik lalu menyambung ulang mengembalikan video di kedua sisi tanpa membuat ruangan baru.

### Task 40 — Jepret sinkron (inti mode Berdua)
- Data channel `capture` (reliable) dibuat host bersama peer connection.
- Protokol untuk foto ke-i: host mengirim `{type:'capture', slot:i, at}` dengan `at` = waktu server (sudah dikoreksi offset) + 3000 ms. Kedua klien menjalankan countdown lokal menuju `at` (angka 3-2-1 tampil sinkron), dan **tepat pada `at`** masing-masing menjalankan `captureFrame()` (Task 32).
- Hasil tangkapan dikirim ke peer lewat data channel dalam potongan 16 KB: pesan header `{type:'photo', slot:i, size}` lalu chunk biner, diakhiri `{type:'photo-end', slot:i}`. Penerima merakit blob dan memasangkan ke slot yang sama. Target selisih waktu jepret antar kedua sisi < 300 ms (FR-4.2).
- Jeda antar foto: capture berikutnya dijadwalkan `at + 2500 ms` (waktu ganti pose). Bila foto peer belum lengkap 4 detik setelah `at`: tampilkan "Menunggu foto teman…" di slot itu + tombol **Kirim ulang** di sisi pengirim.
- Retake per slot (dari Task 35) memakai protokol yang sama dengan satu slot saja; retake hanya bisa dimulai host, guest menerima countdown yang sama.
- Setelah 4 slot lengkap di kedua sisi: kedua klien masuk Review (Task 35) dengan pasangan foto yang identik.
- Selesai bila: uji dua perangkat menunjukkan 4 pasang foto terambil dengan pose yang tampak serentak, dan tidak ada slot yang tertukar urutannya.

### Task 41 — Edit bersama & finalisasi duo
- Keputusan implementasi (dicatat karena PRD tidak merinci): state edit (urutan foto, filter aktif, daftar stiker) **disinkronkan dua arah** lewat data channel pesan `{type:'edit', state}` — perubahan dari salah satu sisi diterapkan di sisi lain (last-write-wins berdasarkan nomor urut pesan).
- Hanya **host** yang dapat menekan **Buat strip** (FR-4.1 diperluas ke finalisasi, sesuai Peran di PRD Bagian 4). Setelah final: host mengirim file PNG hasil render ke guest lewat data channel (chunking sama seperti Task 40), guest menyimpannya ke koleksinya sendiri (Task 28) dan menampilkan layar Hasil yang sama.
- Tombol **Selesai** di salah satu sisi menutup ruangan untuk keduanya (pesan `room-closed`), kamera dimatikan, kembali ke Halaman Masuk.
- Selesai bila: stiker yang ditempel guest muncul di layar host, dan setelah host finalisasi, strip yang sama persis tersimpan di koleksi kedua perangkat.

### Task 42 — Kasus tepi duo (wajib semua tercakup)
- Kode salah format / tidak ditemukan / kedaluwarsa / ruangan penuh → pesan masing-masing yang berbeda dan bisa dipahami (memakai kode error Task 37).
- Izin kamera ditolak setelah ruangan terbuat → ruangan tidak hang: tampilkan panduan izin (Task 31) dan tombol Keluar ruangan.
- Timer habis saat sesi/edit → perilaku Task 33 berlaku untuk kedua sisi (pesan penutup dari server berdasarkan `sessionEndsAt`).
- Salah satu sisi me-refresh halaman di tengah sesi → sisi lain melihat status terputus (Task 39), bukan layar beku.
- Selesai bila: kelima skenario di atas lulus uji manual dan hasilnya dicatat di Task 46.

---

## App-D — Koleksi & Rilis (M3–M4)

### Task 43 — Halaman Koleksi (route `/koleksi`)
- Grid thumbnail dari `listStrips()` (terbaru dulu) (FR-7.1). Ketuk strip → tampilan besar dengan tombol **Unduh PNG** (resolusi penuh dari blob tersimpan, FR-7.3) dan **Hapus** (dialog konfirmasi; menghapus dari IndexedDB).
- Badge angka di ikon Koleksi pada Header selalu sama dengan `countStrips()`.
- Di atas grid, tampilkan catatan FR-7.4 persis maknanya: koleksi hanya tersimpan di perangkat & browser ini; ganti perangkat berarti koleksi tidak ikut; unduh PNG untuk memindahkan strip.
- Keadaan kosong: teks ajakan + tombol "Buat strip pertamamu" → ke `/`.
- Tidak ada tombol unggah, sinkron, atau bagikan-koleksi apa pun di halaman ini.
- Selesai bila: strip hasil Task 36 bisa diunduh ulang dari sini dalam ukuran penuh dan hilang dari daftar setelah dihapus.

### Task 44 — PWA & ketahanan perangkat
- `manifest.webmanifest`: nama "Virtualan", `display: standalone`, `theme_color #FBFAF7`, ikon dari `logo-virtualan-icon.png` (ekspor 192 & 512) — aplikasi bisa di-"Tambah ke Layar Utama".
- Layout responsif mobile-first: kolom konten maks 430 px di layar lebar (tengah), semua target sentuh ≥ 44 px.
- Deteksi lingkungan bermasalah (PRD Bagian 10): bila `navigator.mediaDevices` tidak ada (in-app browser Instagram/Facebook/WhatsApp atau konteks tidak aman) → halaman panduan "Buka halaman ini di Chrome/Safari" dengan tombol salin tautan. Jangan tampilkan error mentah.
- Selesai bila: membuka aplikasi dari hasil "Tambah ke Layar Utama" berjalan standalone, dan membuka dari in-app browser Instagram menampilkan halaman panduan (bukan booth rusak).

### Task 45 — Halaman statis & footer
- Route `/syarat` dan `/privasi` dengan teks ringkas berbahasa Indonesia (masuk kamus i18n sekadar judul; isi boleh statis ID + EN dalam satu halaman): poin wajib privasi — tanpa akun; video tidak direkam; foto hanya ada di perangkat pengguna dan bertukar antar dua peserta sesi; strip & koleksi hanya di IndexedDB perangkat; server hanya meneruskan sinyal koneksi; cara menghapus data (hapus data situs di browser / tombol Hapus di Koleksi).
- Footer global di halaman Masuk & Koleksi: "© 2026 Virtualan" + tautan kedua halaman statis itu.
- Selesai bila: kedua halaman bisa dibuka dari footer dan isinya memuat semua poin di atas.

### Task 46 — Verifikasi akhir & panduan menjalankan
1. `npm run build` (web) lulus tanpa error; server start bersih; tulis hasil di `HASIL-UJI.md` di root repo bersama checklist di bawah (centang + catatan singkat per item):
   - [ ] Solo end-to-end: masuk → pilih template → sesi 4 foto → edit (susun ulang, retake 1, ganti filter, tempel & putar stiker) → final → strip ada di Koleksi setelah reload → unduh PNG 600×1800 (atau sesuai template).
   - [ ] Duo end-to-end di **dua perangkat/jaringan berbeda**: buat ruangan → gabung pakai kode → ganti template (guest mengikuti) → sesi sinkron 4 foto → edit bersama → host finalisasi → strip tersimpan di koleksi **kedua** perangkat.
   - [ ] Kasus tepi Task 42 (5 skenario) lulus.
   - [ ] Timer: peringatan < 1 menit tampil; sesi tertutup pada 0.
   - [ ] Ganti bahasa EN/ID mengubah seluruh UI; pilihan tersimpan setelah reload.
   - [ ] Tidak ada satu pun layar yang meminta login/membayar/menampilkan watermark (pemeriksaan visual menyeluruh).
2. Lengkapi `README.md`: arsitektur singkat (web statis + server signaling), daftar env (`PORT`, `VITE_ICE_SERVERS`, alamat server signaling untuk build web), dan catatan deploy: web bisa di-hosting statis di mana saja; server Node perlu proses persisten; **TURN wajib disediakan terpisah untuk pemakaian lintas operator** (sebutkan opsi coturn self-host atau layanan TURN berbayar — tanpa kredensial apa pun di repo).
3. Item checklist yang gagal diperbaiki di task asalnya, lalu item itu diuji ulang dan hasilnya diperbarui di `HASIL-UJI.md`.

**Selesai =** build lulus, semua item checklist tercentang dengan catatan, dan README cukup untuk menjalankan aplikasi dari nol.
