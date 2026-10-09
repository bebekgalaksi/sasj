# KasirNusa Context Graph — Relationship Path Finder (Tim 3)

Dashboard analitik dan visualisasi cerdas berbasis **Context Graph** untuk challenge **"Context Graphs in Customer Success and Sales Track"** — PT KasirNusa Teknologi.

Aplikasi web ini menggunakan sistem desain dan palet warna modern dari [base_design.html](file:///home/joo/Documents/hackathon%20pens/base_design.html) (Cobalt Blue `#2563EB`, Slate `#0F172A`, tipografi Plus Jakarta Sans, *curved glowing mesh*, dan kanvas graf interaktif berkecepatan tinggi).

---

## 📁 Struktur Direktori Proyek

Struktur direktori telah dirapikan secara modular dan terorganisir:

```text
├── dataset/                     # Dataset mentah asli (lengkap dengan bugs.csv & README)
│   ├── bugs.csv
│   ├── contact_employment_history.csv
│   ├── contracts_billing.csv
│   ├── crm_accounts.csv
│   ├── crm_contacts.csv
│   ├── crm_deals.csv
│   ├── decision_log.csv
│   ├── employees.csv
│   ├── feature_usage_monthly.csv
│   ├── features.csv
│   ├── interactions.jsonl
│   ├── outlets.csv
│   ├── product_usage_daily.csv
│   ├── releases.csv
│   ├── support_tickets.csv
│   └── README.md
├── dataset_clean/               # Dataset hasil pembersihan (handling missing values)
│   ├── bugs.csv
│   ├── contact_employment_history.csv
│   ├── contracts_billing.csv
│   ├── crm_accounts.csv
│   ├── crm_contacts.csv
│   ├── crm_deals.csv
│   ├── decision_log.csv
│   ├── feature_usage_monthly.csv
│   ├── features.csv
│   ├── product_usage_daily.csv
│   ├── releases.csv
│   └── support_tickets.csv
├── preprocessing_data/          # Jupyter Notebook pembersihan data
│   └── preprocessing.ipynb
├── docs/                        # Dokumen studi kasus dan dokumentasi preprocessing
│   ├── 1.pdf
│   ├── PREPROCESSING_DOCS.md
│   └── Studi Kasus Hackathon_PESERTA.pdf
├── js/                          # Script frontend modular
│   └── graph-data.js            # Node, edge, bobot koneksi, dan query paths
├── base_design.html             # Template acuan desain & token visual
├── index.html                   # Aplikasi web utama (Relationship Path Finder)
├── context_graph_for_cs_sales_agently_style.html # Redirect kompatibilitas ke index.html
├── PREPROCESSING_DOCS.md        # Dokumentasi lengkap imputasi nilai kosong
├── requirements.txt             # Dependensi Python untuk preprocessing
├── Dockerfile                   # Konfigurasi container Nginx
├── docker-compose.yml           # Orkestrasi Docker container & Cloudflare tunnel
├── nginx.conf                   # Konfigurasi server Nginx
├── .dockerignore
└── .gitignore
```

---

## 🎨 Desain & Palet Warna (`base_design.html`)

Aplikasi web [index.html](file:///home/joo/Documents/hackathon%20pens/index.html) dibangun menggunakan palet warna dan komponen visual dari [base_design.html](file:///home/joo/Documents/hackathon%20pens/base_design.html):

- **Brand Primary Blue**:
  - `brand-50`: `#EFF6FF`
  - `brand-500`: `#3B82F6`
  - `brand-600`: `#2563EB` (Cobalt Royal Blue)
  - `brand-700`: `#1D4ED8`
- **Slate Dark Contrast**: `#0F172A` / `#151E2E`
- **Tipografi**: `Plus Jakarta Sans` (sans-serif) & `Space Grotesk` (mono/technical)
- **Komponen Kunci**:
  - *Curved Ambient Backdrop Glow* di balik hero dashboard mockup
  - 4 *Executive Stat Cards* (Pipeline prioritas Rp 399 Jt, skor golden path, akselerasi closing)
  - Tabel Analisis Komparatif (*Cold Gatekeeper vs Context Graph*)
  - Deep Dive Bento Cards untuk **P01 Mandala** dan **P04 Nirwana** dilengkapi tombol 1-klik salin draft email
  - Widget interaktif **Path Finder** berbasis algoritma pencarian jalur terpendek/terkuat (BFS + Weighted Edge Scoring)
  - Kanvas fisika graf interaktif berbasis HTML5 Canvas dengan simulasi pegas, partikel aktif, dan drawer inspektur entitas
  - Kartu preseden log keputusan diskon VP Sales (**D-2025-11**, **D-2025-02**, **D-2025-06**)

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Langsung (Python / Live Server)
```bash
# Menggunakan Python HTTP Server
python3 -m http.server 8080

# Buka browser di http://localhost:8080
```

### 2. Menggunakan Docker & Docker Compose
```bash
# Build dan jalankan Nginx container
docker compose up --build -d

# Akses aplikasi di http://localhost:8080
```

---

## 📊 Ringkasan Temuan Challenge (Tim 3 Sales Track)

### 1. Prospek P01 — Grup Ritel Mandala (60 Outlet · Rp 252 Jt/th)
- **Status Stuck**: Tertahan 20 hari di stage Proposal karena Bagus (Sales) hanya mengevaluasi teknis dengan Fajar (IT Manager). Fajar bukan pemegang keputusan komersial (`I0343`).
- **Decision Maker Sebenarnya**: **Rina Hapsari (K017)** — baru menjabat GM Operations per September 2026.
- **Jalur Terkuat (Skor: 9.2 / 10)**:
  $$\text{Sari Puspita (AM C01)} \xrightarrow{\text{3+ thn kerja erat (13 interaksi)}} \text{Rina Hapsari (GM Ops)} \xrightarrow{\text{Lapor langsung}} \text{Steven Wijaya (Dirut)}$$
- **Preseden Eksekutif**: Ajukan diskon volume 15%–18% mengacu pada preseden **D-2025-11** (disetujui VP Sales untuk 42 outlet C01). Waspadai isu tertundanya integrasi akuntansi `FEAT-07`.

### 2. Prospek P04 — Nirwana Hotel & Resto (35 Outlet · Rp 147 Jt/th)
- **Status Stuck**: Tertahan 30 hari di stage Negosiasi karena Dirut meminta referensi rekanan sejenis sebelum tanda tangan (`I0335`).
- **Decision Maker**: **Hartono Gunawan (K028)** — Direktur Utama P04.
- **Jalur Terkuat (Skor: 8.5 / 10)**:
  $$\text{Wahyu Nugroho (AM C06)} \xrightarrow{\text{AM}} \text{Budi Santoso (CFO C06)} \xrightarrow{\text{Rekan alumni 5 thn di PT Sentosa Abadi}} \text{Hartono Gunawan (Dirut P04)}$$
- **Strategi Kolaborasi Sales-CS**: Wahyu menghubungi Budi Santoso (C06 Saiyo Group, NPS 9, puas dan sedang ekspansi) untuk meminta izin menjadi kontak referensi bagi Hartono Gunawan.

---

## 📑 Kamus Dataset KasirNusa

Dataset sintetis periode operasional 1 Oktober 2025 – 30 September 2026 (snapshot 1 Oktober 2026):

| File | Sumber | Baris | Isi Utama |
| --- | --- | --- | --- |
| `crm_accounts.csv` | CRM | 45 | 40 pelanggan aktif + 5 prospek |
| `crm_contacts.csv` | CRM | 160 | Kontak dan jabatan saat ini |
| `contact_employment_history.csv` | CRM | ±200 | Riwayat jabatan dan organisasi lintas waktu |
| `crm_deals.csv` | CRM | ±25 | Deal baru, renewal, ekspansi |
| `employees.csv` | Internal | 10 | Karyawan KasirNusa (Sales, AM, Produk, Support) |
| `interactions.jsonl` | Komunikasi | 350 | Email eksternal, internal, dan catatan meeting |
| `outlets.csv` | Produk | 620 | Daftar outlet pelanggan |
| `product_usage_daily.csv` | Produk | ±226k | Log transaksi harian per outlet |
| `feature_usage_monthly.csv` | Produk | ±1.100 | Pengguna aktif per fitur per bulan |
| `support_tickets.csv` | Support | 640 | Tiket keluhan dan layanan |
| `bugs.csv` / `releases.csv` | Produk | 4 / 3 | Bug yang diketahui dan versi aplikasi |
| `features.csv` | Produk | 8 | Roadmap fitur KasirNusa |
| `contracts_billing.csv` | Billing | 40 | Kontrak aktif dan ketentuan pembayaran |
| `decision_log.csv` | Log Keputusan | 30 | Approval diskon, pengecualian, dan janji fitur |

Dokumentasi detail mengenai imputasi nilai kosong dapat dibaca di [PREPROCESSING_DOCS.md](file:///home/joo/Documents/hackathon%20pens/PREPROCESSING_DOCS.md).
