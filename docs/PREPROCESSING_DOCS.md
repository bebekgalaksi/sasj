# Dokumentasi Preprocessing Data (KasirNusa)

Dokumen ini menjelaskan semua tahapan pembersihan data (data preprocessing) beserta **reason** penanganan nilai kosong (*missing values*) pada dataset KasirNusa. Seluruh proses dilakukan menggunakan notebook `preprocessing_data/preprocessing.ipynb`.

## 1. CRM & Contact Data

### `crm_accounts.csv`
- **`paket` (Diisi dengan `"Unknown"`)**: 
  - *Reason*: Akun tersebut belum tercatat mengambil paket langganan tertentu secara definitif di sistem, namun data profil akun tetap penting sehingga tidak boleh dihapus.
- **`champion_contact_id` (Diisi dengan `"No Champion"`)**:
  - *Reason*: Tidak semua perusahaan memiliki perwakilan khusus (champion) atau sponsor internal yang intens berkomunikasi dengan tim sales kita.
- **`nps_terakhir` & `health_score_dashboard` (Diisi dengan `"Unknown"`)**:
  - *Reason*: Karena adanya format teks campuran (seperti teks atau karakter non-numerik), nilai tidak bisa dipaksa menjadi angka (numeric) tanpa risiko kehilangan data. Dibiarkan sebagai "Unknown" untuk mencegah *error* saat komputasi statistik (seperti median).

### `crm_deals.csv`
- **`stage_sejak` & `dibuat` (Diisi dengan `2099-12-31`)**:
  - *Reason*: Format wajib berupa `datetime`. Jika tanggal kosong, *dummy date* (tanggal jauh future) digunakan agar perhitungan durasi selanjutnya tidak menghasilkan error `NaT` (Not a Time).
- **`alasan_kalah` (Diisi dengan `"Not Applicable/Unknown"`)**:
  - *Reason*: Nilai kosong pada kolom ini bermakna positif; artinya *deal* tersebut **menang** atau masih **berjalan/negosiasi**, sehingga kolom "alasan kalah" memang seharusnya kosong.
- **`kompetitor` (Diisi dengan `"No Competitor"`)**:
  - *Reason*: KasirNusa merupakan satu-satunya solusi yang sedang ditinjau prospek (monopoli peluang), sehingga memang tidak ada kompetitor untuk deal tersebut.

### `contact_employment_history.csv`
- **`account_id` (Diisi dengan `"External_Org"`)**:
  - *Reason*: Kontak tersebut sebelumnya (atau saat ini) bekerja di perusahaan pihak ketiga yang belum menjadi akun/pelanggan resmi di CRM KasirNusa.
- **`selesai` (Diisi dengan `2099-12-31`) & Kolom `is_current`**:
  - *Reason*: Tanggal selesai kerja yang kosong menandakan orang tersebut **masih aktif bekerja** di perusahaan itu hingga hari ini. Angka 2099 digunakan sebagai penanda masa depan (aktif), dan kolom baru `is_current` (T/F) diciptakan agar Machine Learning/analitik bisa langsung memfilter karyawan aktif tanpa harus membaca tanggal.

---

## 2. Product & Features Data

### `features.csv`
- **`target_awal` & `target_terkini` (Diisi dengan `"TBD"`)**:
  - *Reason*: Fitur tersebut masih dalam tahap perencanaan dan belum mendapatkan jadwal rilis yang pasti (To Be Determined) dari tim *Product*.
- **`catatan` (Diisi dengan `"No Notes"`)**:
  - *Reason*: Fitur dikembangkan sesuai rencana standar tanpa ada kendala/catatan khusus yang perlu didokumentasikan ke sistem.

### `bugs.csv`
- **`selesai` (Diisi dengan `2099-12-31`) & Kolom `is_resolved`**:
  - *Reason*: Tanggal kosong berarti bug tersebut masih **terbuka** dan belum diperbaiki oleh tim *Engineering*. Penggunaan tanggal masa depan memudahkan komputasi waktu.
- **`waktu_penyelesaian_hari` (Diisi dengan `-1`)**:
  - *Reason*: Karena bug belum diselesaikan, perhitungan (Tanggal Selesai - Tanggal Dibuat) secara default menghasilkan kosong. Nilai `-1` dipilih sebagai standar universal untuk menyatakan durasi *pending* agar kolom tetap dapat digunakan sebagai model numerik matematis.

### `product_usage_daily.csv`
- **`transaksi_offline_tersinkron` (Diisi dengan `0`)**:
  - *Reason*: Kosongnya data pada tabel *time-series* log penggunaan ini murni merepresentasikan absensinya kejadian di hari itu. Artinya, tidak ada transaksi offline yang dilakukan oleh pengguna (Nol transaksi).

---

## 3. Support & Decision Logs

### `support_tickets.csv`
- **`outlet_id` (Diisi dengan `"HQ / No Outlet"`)**:
  - *Reason*: Keluhan/tiket diajukan oleh manajemen pusat (Headquarter), bukan dari spesifik outlet/cabang tertentu di lapangan.
- **`pelapor_contact_id` (Diisi dengan `"Unknown / Anonymous"`)**:
  - *Reason*: Tiket dibuat melalui channel publik, atau dilaporankan oleh karyawan pelanggan tingkat bawah yang belum diregistrasikan ke *database* kontak.
- **`bug_id` (Diisi dengan `"No Bug"`)**:
  - *Reason*: Mayoritas tiket CS adalah keluhan administrasi, penagihan, atau pertanyaan cara pakai aplikasi—bukan insiden kerusakan (*bug*) pada sistem.
- **`diselesaikan` & `resolusi_hari` (Sama seperti Bugs)**:
  - *Reason*: Tiket belum ditutup oleh *Customer Support*, sehingga diisi nilai *dummy* `2099` dan durasi penyelesaian `-1` hari.

### `decision_log.csv`
- **`deal_id` (Diisi dengan `"Non-Deal Decision"`)**:
  - *Reason*: Keputusan yang terbit difokuskan pada manajemen akun secara umum (misal: pemberian kompensasi keluhan) dan tidak berikatan dengan peluang (deal) baru.
- **`nilai` (Diisi dengan `0`)**:
  - *Reason*: Keputusan tersebut tidak memiliki dampak transaksi finansial secara langsung.
- **`bukti_interaction_id` (Diisi dengan `"No Proof/Log"`)**:
  - *Reason*: Keputusan diambil melalui jalur komunikasi non-sistem (seperti interaksi verbal di luar kantor) sehingga log ID interaksinya memang tidak ada.
- **`fitur_dijanjikan` & `status_janji` (Diisi `"None"` / `"Not Applicable"`)**:
  - *Reason*: Perusahaan memang tidak memberikan janji pengerjaan fitur kustom (custom development) untuk klien dalam log keputusan ini.

---

## 4. Operations & Billing Data

### `contracts_billing.csv`
- **`decision_id` (Diisi dengan `"No Decision Linked"`)**:
  - *Reason*: Kontrak penagihan ini merupakan transaksi standar biasa atau *auto-renewal* berulang yang otomatis berjalan tanpa perlu melewati tahap pembuatan *decision log* (negosiasi manajerial khusus).
