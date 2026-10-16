# Kantin OS (Web Statis + Google Sheets Backend) 🛒✨
> **Solusi Price Checker & Self-Checkout QRIS Kantin Kantor Berbiaya Nol (Rp 0 / Bulan)**
> Arsitektur: **HTML5 + CSS3 + Vanilla JavaScript** di **GitHub Pages** & Admin via **Google Sheets + Apps Script**.

---

## 📁 Struktur Berkas

```
kantin-os-web/
├── index.html                  # Halaman web utama pembeli (super cepat, tanpa login)
├── styles.css                  # Desain modern, responsif mobile-first ala Ranger AURA
├── app.js                      # Instant search, cart, QRIS modal & sinkronisasi Google Sheets
├── sample-qris.svg             # Template gambar QRIS statis kantin
├── CNAME                       # (Opsional) Berkas konfigurasi custom domain Anda
├── google-apps-script/
│   └── Code.gs                 # Skrip backend siap tempel di Google Sheets
└── README.md                   # Panduan lengkap setup & deployment
```

---

## 🛠️ Langkah 1: Setup Backend Google Sheets (Hanya 3 Menit)

1. Buat Google Spreadsheet baru di [https://sheets.new](https://sheets.new). Beri nama spreadsheet: `Database Kantin OS`.
2. Di menu atas Google Sheets, klik **Extensions (Ekstensi)** -> **Apps Script**.
3. Hapus semua kode bawaan di editor, lalu **Copy & Paste** seluruh isi file:
   [`google-apps-script/Code.gs`](file:///C:/Users/Dani/.gemini/antigravity/scratch/kantin-os-web/google-apps-script/Code.gs)
4. Klik tombol **Deploy (Terapkan)** di pojok kanan atas -> pilih **New deployment (Penerapan baru)**.
5. Klik ikon gerigi (Select type) -> pilih **Web app**.
6. Atur konfigurasi berikut:
   - **Description:** `Kantin OS API v1`
   - **Execute as:** `Me (email@gmail.com)`
   - **Who has access:** `Anyone` *(PENTING: Pilih "Anyone" agar pembeli kantin bisa melihat harga tanpa wajib login akun Google)*.
7. Klik **Deploy**, klik **Authorize access**, lalu izinkan akun Google Anda.
8. Salin **Web App URL** yang muncul (contoh: `https://script.google.com/macros/s/AKfycbx.../exec`).
9. Buka file [`app.js`](file:///C:/Users/Dani/.gemini/antigravity/scratch/kantin-os-web/app.js), tempel URL tersebut di baris ke-9:
   ```javascript
   const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```

> **Keajaiban Inisialisasi Otomatis:** Saat pertama kali diakses, Google Apps Script akan otomatis membuat 3 Sheet di Google Sheets Anda:
> 1. **`Menu`**: Tempat staf GA mengubah harga snack, mengganti foto, atau mengubah status *"Tersedia"* / *"Stok Habis"*.
> 2. **`Transaksi`**: Setiap kali pembeli transfer QRIS dan menekan tombol *"Saya Sudah Bayar"*, baris baru akan otomatis tercatat di sini lengkap dengan tanggal, nama pembeli, jajanan, dan nominal!
> 3. **`Pengaturan`**: Untuk mengubah nama kantin, nama rekening QRIS, dan NMID.

---

## 🚀 Langkah 2: Deploy ke GitHub Pages (Gratis Selamanya)

1. Buat repository baru di [GitHub](https://github.com/new) (misal: `kantin-os`).
2. Upload semua file dari folder `kantin-os-web` ke repository tersebut:
   ```bash
   cd C:\Users\Dani\.gemini\antigravity\scratch\kantin-os-web
   git init
   git add .
   git commit -m "Initial commit Kantin OS"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/kantin-os.git
   git push -u origin main
   ```
3. Buka repository Anda di GitHub, klik tab **Settings** -> pilih menu **Pages** di sebelah kiri.
4. Di bagian **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** Pilih `main` dan folder `/ (root)`
   - Klik **Save**.
5. Tunggu 1–2 menit, website Anda sudah langsung online di `https://USERNAME.github.io/kantin-os/`!

---

## 🌐 Langkah 3: Menghubungkan Custom Domain yang Anda Beli

Setelah Anda membeli domain (misal: `kantinos.my.id` atau subdomain `kantin.kantoranda.com`):

1. **Di DNS Manager Registrar Domain Anda (misal Niagahoster / Cloudflare):**
   - Tambahkan CNAME record:
     - **Type:** `CNAME`
     - **Host / Name:** `@` (atau `kantin` jika subdomain)
     - **Value / Target:** `USERNAME.github.io`
2. **Di GitHub Repository:**
   - Buka **Settings** -> **Pages** -> kolom **Custom domain**.
   - Masukkan domain Anda (misal: `kantinos.my.id`).
   - Centang **Enforce HTTPS** (GitHub otomatis memasang sertifikat SSL gembok hijau gratis).

---

## 📱 Langkah 4: Operasional Kantin

1. **Untuk Karyawan (Pembeli):**
   - Cetak stiker QR Code yang mengarah ke link domain Anda, lalu tempel di rak kantin:
     > *"Bingung harganya? Scan di sini untuk cek harga & bayar QRIS"*
   - Karyawan buka web, cari snack, dan bayar mandiri. **Sama sekali tidak perlu login!** Nama pembeli otomatis tersimpan di HP setelah transaksi pertama.
2. **Untuk Staf GA (Admin Kantin):**
   - Cukup buka aplikasi Google Sheets di HP atau laptop.
   - Mau naikkan harga Chitato? Tinggal ganti angka di baris Chitato pada kolom *Harga*.
   - Mau tandai snack habis? Tinggal ganti tulisan di kolom *Status* jadi *"Habis"*.
   - Web pembeli akan langsung menampilkan harga baru secara otomatis!
