# Setup Google Spreadsheet untuk Setia Rasa

## Langkah-langkah:

### 1. Buat Google Spreadsheet
- Buka https://sheets.google.com
- Buat spreadsheet baru, beri nama "Pesanan Setia Rasa"

### 2. Buka Google Apps Script
- Di spreadsheet, klik menu **Extensions → Apps Script**
- Hapus kode default yang ada
- Salin seluruh isi file `google-apps-script.js` ke editor
- Klik **Save** (ikon disket)

### 3. Deploy sebagai Web App
- Klik **Deploy → New deployment**
- Pilih type: **Web app**
- Isi deskripsi: "Setia Rasa Order API"
- Execute as: **Me**
- Who has access: **Anyone**
- Klik **Deploy**
- **Salin URL** yang muncul (bentuknya: https://script.google.com/macros/s/XXXX/exec)

### 4. Pasang URL ke Website
- Buka file `app.js`
- Ganti baris ini:
  ```
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/GANTI_DENGAN_URL_ANDA/exec';
  ```
  Dengan URL yang kamu salin tadi.

### 5. Tambah Foto Produk
- Buat folder `img/` di direktori yang sama dengan `index.html`
- Masukkan foto produk dengan nama file:
  - `img/jenang-ketan.jpg`
  - `img/wajik-hijau.jpg`
  - `img/madumongso.jpg`
  - `img/kembang-gula.jpg`
  - `img/enting-enting.jpg`
  - `img/permen-tape.jpg`
  - `img/brem.jpg`

### 6. Tambah Gambar QRIS
- Simpan gambar QRIS kamu sebagai `qris-placeholder.png` di folder yang sama

### 7. Update Nomor Rekening
- Buka `index.html`
- Cari bagian "Informasi Transfer Bank"
- Ganti nomor rekening dengan nomor rekening asli toko

---
Selesai! Setiap pesanan akan otomatis masuk ke Google Spreadsheet.
