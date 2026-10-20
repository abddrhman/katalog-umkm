# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01. Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase. Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat `lib/supabase/server.js` dan `lib/supabase/index.js` untuk inisialisasi client Supabase server.
- Halaman `app/page.jsx` diubah mengambil data dari tabel `produk` di sisi server.
- `CatatanBelumAktif` dihapus, penanganan pesan error dan kondisi "Belum ada produk" berhasil diimplementasikan.

**Perbaikan:**
Format pemanggilan environment variable dibersihkan dan disanitasi dari spasi / kutip.

---

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- `app/produk/[id]/page.jsx` mengambil satu produk dari Supabase dengan `params` berupa Promise (Next.js 16).
- Memanggil `notFound()` jika data tidak ditemukan.
- `CatatanBelumAktif` dihapus, tombol WhatsApp dipertahankan.

**Perbaikan:**
Memastikan pemanggilan `notFound()` berada di luar blok `try-catch` agar tidak diintersepsi sebagai error runtime biasa.

---

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- `components/TombolWhatsApp.jsx` diubah menjadi elemen `<a>` dengan styling tombol yang sama.
- Tautan membuka `https://wa.me/` nomor dari `lib/toko.js` dengan format pesan nama dan harga rupiah menggunakan `encodeURIComponent`.
- Tautan dibuka di tab baru (`target="_blank" rel="noopener noreferrer"`).

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

---

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Dibuat `lib/supabase/auth.js` menggunakan `@supabase/ssr` dan cookie storage Next.js.
- Dibuat `loginAction` dan `logoutAction` di `app/admin/actions.js`.
- Form login `app/admin/login/page.jsx` disambungkan menggunakan `useActionState` dan menampilkan error.
- Tombol keluar di `components/NavAdmin.jsx` difungsikan untuk logout.

**Perbaikan:**
Tidak ada kendala, build berhasil tanpa error.

---

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat Server Action `changePasswordAction` dengan validasi server (login check, min 8 karakter, kecocokan konfirmasi).
- Form di `app/admin/password/page.jsx` menampilkan notifikasi sukses/gagal.
- `CatatanBelumAktif` dihapus dari halaman ganti password.

**Perbaikan:**
Tidak ada kendala.

---

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat `proxy.js` di root dengan `matcher: ["/admin/:path*"]` yang memproteksi seluruh rute admin via `@supabase/ssr`.
- Semua Server Action pengubah data memverifikasi user auth di server.
- `CatatanBelumAktif` dihapus dari `app/admin/page.jsx`.

**Perbaikan:**
Tidak ada kendala.

---

## Debugging dan fitur bonus

### [SENDIRI] Analisa Mengapa Tabel Kosong pada US-01
**Prompt:**
kondisi tabel sekarang kan kosong. coba anda ganti dari .env.example ke .env.local dan analisa kenapa bsia kosong

**Hasil & Perbaikan:**
- Menganalisis penyebab data kosong: nilai `SUPABASE_SECRET_KEY` di `.env.local` keliru diisi dengan `publishable key`, sehingga RLS memblokir pembacaan publik dan mengembalikan array kosong.
- Merapikan struktur `.env.local` dan memberikan panduan pengisian `service_role key`.

---

### US-07 List Produk
**Prompt:**
Lanjutkan ke US-07 List Produk

**Hasil & Perbaikan:**
- Mengubah `app/admin/page.jsx` menjadi async Server Component yang mengambil produk langsung dari database Supabase dengan client sesi admin.
- Menghapus ketergantungan pada `lib/data-contoh.js`.

---

### US-08 Tambah produk
**Prompt:**
Lanjutkan ke US-08 Tambah produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `createProductAction` di `app/admin/actions.js` terlindungi auth.
- Menghubungkan `components/FormProduk.jsx` dan `app/admin/produk/baru/page.jsx`.
- Menghapus `CatatanBelumAktif`.

---

### US-09 Ubah produk
**Prompt:**
Lanjutkan ke US-09 Ubah produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `updateProductAction` di `app/admin/actions.js`.
- Mengambil data produk lama di `app/admin/produk/[id]/ubah/page.jsx` dan mengisikannya ke form.

---

### US-10 Hapus produk
**Prompt:**
Lanjutkan ke US-10 Hapus produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `deleteProductAction` di `app/admin/actions.js`.
- Menambahkan dialog konfirmasi hapus (`window.confirm`) pada `components/TabelProduk.jsx`.

---

### US-11 Filter kategori atau pencarian
**Prompt:**
Lanjutkan ke US-11 Filter kategori atau pencarian

**Hasil & Perbaikan:**
- Menambahkan filter kategori dinamis dan pencarian teks nama produk di `app/page.jsx` langsung pada query database Supabase (`.ilike()` dan `.eq()`).

---

### US-12 Pilih jumlah atau varian
**Prompt:**
US-12 Pilih jumlah atau varian

**Hasil & Perbaikan:**
- Menambahkan pemilih jumlah (+/-), kalkulasi total harga otomatis, serta input varian/catatan di `components/TombolWhatsApp.jsx`.
- Pilihan jumlah dan catatan disertakan dalam pesan otomatis WhatsApp.

---

### US-13 PWA
**Prompt:**
Lanjutkan ke US-13 PWA

**Hasil & Perbaikan:**
- Membuat `app/manifest.js` yang mengarah ke `/icons/icon-192.png` dan `/icons/icon-512.png`.
- Mengonfigurasi `metadata` dan `viewport` di `app/layout.jsx` agar katalog dapat dipasang di layar utama ponsel.

---

### US-14 Deskripsi produk dibuat AI
**Prompt:**
Lanjutkan ke US-14 Deskripsi produk dibuat AI

**Hasil & Perbaikan:**
- Menambahkan Server Action `generateProductDescriptionAction` yang memanggil Google Gemini API dari server.
- Menambahkan tombol "✨ Buat dengan AI" di `components/FormProduk.jsx` untuk mengisi kolom deskripsi secara otomatis.
- Memperbaiki parsing error akibat duplikasi kurung penutup di `app/admin/actions.js`.

---

### US-15 Urutkan produk
**Prompt:**
Lanjutkan ke US-15 Urutkan produk

**Hasil & Perbaikan:**
- Menambahkan opsi urutan (Termurah, Termahal, Terbaru) pada `app/page.jsx` yang diterapkan langsung di level query database.

---

### US-16 Paginasi atau muat lebih banyak
**Prompt:**
Lanjutkan ke US-16 Paginasi atau muat lebih banyak

**Hasil & Perbaikan:**
- Membatasi 6 produk per halaman menggunakan `.range()` dan count di database pada `app/page.jsx`.
- Menambahkan navigasi nomor halaman dan tombol Sebelumnya/Selanjutnya yang sinkron dengan filter dan query.

---

### US-17 Produk terkait di halaman detail
**Prompt:**
Lanjukan ke US-17 Produk terkait di halaman detail

**Hasil & Perbaikan:**
- Mengambil maksimal 3 produk lain dengan kategori yang sama di `app/produk/[id]/page.jsx` dan mengecualikan produk yang sedang dilihat.

---

### US-18 Galeri beberapa foto produk
**Prompt:**
Lanjutkan ke US-18 Galeri beberapa foto produk. dan juga isi file PROMPT.MD YAA DAN SETERUS NYA JIKA SAYA KASI US DI ISI YA

**Hasil & Perbaikan:**
- Membuat komponen interaktif `components/GaleriProduk.jsx` yang menampilkan foto utama dan thumbnail gambar kecil untuk berganti foto.
- Mendukung produk dengan lebih dari satu foto serta tetap menampilkan normal jika hanya memiliki satu foto.

**Hasil & Perbaikan:**
- Menganalisis penyebab data kosong: nilai `SUPABASE_SECRET_KEY` di `.env.local` keliru diisi dengan `publishable key`, sehingga RLS memblokir pembacaan publik dan mengembalikan array kosong.
- Merapikan struktur `.env.local` dan memberikan panduan pengisian `service_role key`.

---

### US-07 List Produk
**Prompt:**
Lanjutkan ke US-07 List Produk

**Hasil & Perbaikan:**
- Mengubah `app/admin/page.jsx` menjadi async Server Component yang mengambil produk langsung dari database Supabase dengan client sesi admin.
- Menghapus ketergantungan pada `lib/data-contoh.js`.

---

### US-08 Tambah produk
**Prompt:**
Lanjutkan ke US-08 Tambah produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `createProductAction` di `app/admin/actions.js` terlindungi auth.
- Menghubungkan `components/FormProduk.jsx` dan `app/admin/produk/baru/page.jsx`.
- Menghapus `CatatanBelumAktif`.

---

### US-09 Ubah produk
**Prompt:**
Lanjutkan ke US-09 Ubah produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `updateProductAction` di `app/admin/actions.js`.
- Mengambil data produk lama di `app/admin/produk/[id]/ubah/page.jsx` dan mengisikannya ke form.

---

### US-10 Hapus produk
**Prompt:**
Lanjutkan ke US-10 Hapus produk

**Hasil & Perbaikan:**
- Menambahkan Server Action `deleteProductAction` di `app/admin/actions.js`.
- Menambahkan dialog konfirmasi hapus (`window.confirm`) pada `components/TabelProduk.jsx`.

---

### US-11 Filter kategori atau pencarian
**Prompt:**
Lanjutkan ke US-11 Filter kategori atau pencarian

**Hasil & Perbaikan:**
- Menambahkan filter kategori dinamis dan pencarian teks nama produk di `app/page.jsx` langsung pada query database Supabase (`.ilike()` dan `.eq()`).

---

### US-12 Pilih jumlah atau varian
**Prompt:**
US-12 Pilih jumlah atau varian

**Hasil & Perbaikan:**
- Menambahkan pemilih jumlah (+/-), kalkulasi total harga otomatis, serta input varian/catatan di `components/TombolWhatsApp.jsx`.
- Pilihan jumlah dan catatan disertakan dalam pesan otomatis WhatsApp.

---

### US-13 PWA
**Prompt:**
Lanjutkan ke US-13 PWA

**Hasil & Perbaikan:**
- Membuat `app/manifest.js` yang mengarah ke `/icons/icon-192.png` dan `/icons/icon-512.png`.
- Mengonfigurasi `metadata` dan `viewport` di `app/layout.jsx` agar katalog dapat dipasang di layar utama ponsel.

---

### US-14 Deskripsi produk dibuat AI
**Prompt:**
Lanjutkan ke US-14 Deskripsi produk dibuat AI

**Hasil & Perbaikan:**
- Menambahkan Server Action `generateProductDescriptionAction` yang memanggil Google Gemini API dari server.
- Menambahkan tombol "✨ Buat dengan AI" di `components/FormProduk.jsx` untuk mengisi kolom deskripsi secara otomatis.
- Memperbaiki parsing error akibat duplikasi kurung penutup di `app/admin/actions.js`.

---

### US-15 Urutkan produk
**Prompt:**
Lanjutkan ke US-15 Urutkan produk

**Hasil & Perbaikan:**
- Menambahkan opsi urutan (Termurah, Termahal, Terbaru) pada `app/page.jsx` yang diterapkan langsung di level query database.

---

### US-16 Paginasi atau muat lebih banyak
**Prompt:**
Lanjutkan ke US-16 Paginasi atau muat lebih banyak

**Hasil & Perbaikan:**
- Membatasi 6 produk per halaman menggunakan `.range()` dan count di database pada `app/page.jsx`.
- Menambahkan navigasi nomor halaman dan tombol Sebelumnya/Selanjutnya yang sinkron dengan filter dan query.

---

### US-17 Produk terkait di halaman detail
**Prompt:**
Lanjukan ke US-17 Produk terkait di halaman detail

**Hasil & Perbaikan:**
- Mengambil maksimal 3 produk lain dengan kategori yang sama di `app/produk/[id]/page.jsx` dan mengecualikan produk yang sedang dilihat.

---

### US-18 Galeri beberapa foto produk
**Prompt:**
Lanjutkan ke US-18 Galeri beberapa foto produk. dan juga isi file PROMPT.MD YAA DAN SETERUS NYA JIKA SAYA KASI US DI ISI YA

**Hasil & Perbaikan:**
- Membuat komponen interaktif `components/GaleriProduk.jsx` yang menampilkan foto utama dan thumbnail gambar kecil untuk berganti foto.
- Mendukung produk dengan lebih dari satu foto serta tetap menampilkan normal jika hanya memiliki satu foto.

