// ===== Graph Data: Nodes, Edges, Paths, and Query Answers =====
// Built from 6 interconnected data sources:
// 1. CRM Accounts (40 active + 5 prospects)
// 2. CRM Contacts & Employment History (160 contacts, 200+ roles)
// 3. Interactions (350 emails, internal notes, meeting logs)
// 4. Contracts & Billing (40 contracts, renewals, pricing)
// 5. Decision Log (30 executive approval & exception precedents)
// 6. Product Usage & Support Tickets (620 outlets, bugs, feature roadmap)

const GRAPH_DATA = {
    // ===== NODES =====
    nodes: [
        // --- KasirNusa Internal Team ---
        { id: 'E01', label: 'Andi Wiratama', type: 'kasirnusa', role: 'VP Sales', group: 'kasirnusa' },
        { id: 'E02', label: 'Dewi Lestari', type: 'kasirnusa', role: 'Head of Customer Success', group: 'kasirnusa' },
        { id: 'E03', label: 'Sari Puspita', type: 'kasirnusa', role: 'Account Manager (AM C01, C03)', group: 'kasirnusa' },
        { id: 'E04', label: 'Wahyu Nugroho', type: 'kasirnusa', role: 'Account Manager (AM C06 Saiyo)', group: 'kasirnusa' },
        { id: 'E05', label: 'Lina Marlina', type: 'kasirnusa', role: 'Account Manager (AM C02, C05)', group: 'kasirnusa' },
        { id: 'E06', label: 'Bagus Prakoso', type: 'kasirnusa', role: 'Sales Executive (Owner P01 & P04)', group: 'kasirnusa' },
        { id: 'E07', label: 'Citra Ayuningtyas', type: 'kasirnusa', role: 'Sales Executive (Owner P02)', group: 'kasirnusa' },
        { id: 'E08', label: 'Doni Saputra', type: 'kasirnusa', role: 'Sales Executive (Owner P03)', group: 'kasirnusa' },
        { id: 'E09', label: 'Arif Setiawan', type: 'kasirnusa', role: 'Head of Product', group: 'kasirnusa' },
        { id: 'E10', label: 'Maya Kusuma', type: 'kasirnusa', role: 'Support Lead', group: 'kasirnusa' },

        // --- Prospect P01: Grup Ritel Mandala (Minimarket · 60 Outlet · Rp 252 jt/th) ---
        { id: 'P01', label: 'Grup Ritel Mandala', type: 'prospect', role: 'Minimarket · 60 outlet · Rp 252M', group: 'prospect' },
        { id: 'K089', label: 'Steven Wijaya', type: 'dm', role: 'Direktur Utama P01', group: 'prospect' },
        { id: 'K017', label: 'Rina Hapsari', type: 'dm', role: 'GM Operations P01 (ex-Head of Ops C01)', group: 'prospect' },
        { id: 'K052', label: 'Fajar Nugraha', type: 'contact', role: 'IT Manager P01', group: 'prospect' },

        // --- Prospect P04: Nirwana Hotel & Resto (Hospitality · 35 Outlet · Rp 147 jt/th) ---
        { id: 'P04', label: 'Nirwana Hotel & Resto', type: 'prospect', role: 'Hospitality · 35 outlet · Rp 147M', group: 'prospect' },
        { id: 'K028', label: 'Hartono Gunawan', type: 'dm', role: 'Direktur Utama P04 (ex-GM Sentosa Abadi)', group: 'prospect' },
        { id: 'K065', label: 'Yuli Astuti', type: 'contact', role: 'Purchasing Manager P04', group: 'prospect' },

        // --- Prospect P02: Teras Kafe Group (F&B · 15 Outlet · Rp 63 jt/th) ---
        { id: 'P02', label: 'Teras Kafe Group', type: 'prospect', role: 'F&B · 15 outlet · Rp 63M', group: 'prospect' },
        { id: 'K076', label: 'Teddy Kurniawan', type: 'dm', role: 'Pemilik Teras Kafe P02', group: 'prospect' },

        // --- Prospect P03: Klinik Pratama Medika (Klinik + Apotek · 9 Outlet · Rp 38 jt/th) ---
        { id: 'P03', label: 'Klinik Pratama Medika', type: 'prospect', role: 'Klinik & Apotek · 9 outlet · Rp 38M', group: 'prospect' },
        { id: 'K049', label: 'Ratna Dewi', type: 'contact', role: 'Kepala Apotek P03', group: 'prospect' },
        { id: 'K114', label: 'Hanif Maulana', type: 'dm', role: 'Direktur Klinik P03', group: 'prospect' },

        // --- Prospect P05: PT Distribusi Sumber Rejeki (Distributor · 40 Gudang · Rp 168 jt/th) ---
        { id: 'P05', label: 'PT Distribusi Sumber Rejeki', type: 'prospect', role: 'Distributor · 40 gudang · Rp 168M', group: 'prospect' },

        // --- Key Customers (Focus & Reference) ---
        // Customer C01: Kopi Lintas Nusantara (Enterprise · 42 Outlet)
        { id: 'C01', label: 'Kopi Lintas Nusantara', type: 'customer', role: 'Enterprise · 42 outlet · Klien Strategis', group: 'customer' },
        { id: 'K056', label: 'Michael Tanoto', type: 'contact', role: 'Direktur Utama C01', group: 'customer' },
        { id: 'K134', label: 'Yoga Pratama', type: 'contact', role: 'CFO C01 (Baru, ex-Boga Rasa)', group: 'customer' },
        { id: 'K050', label: 'Fikri Ramadhan', type: 'contact', role: 'IT Supervisor C01', group: 'customer' },

        // Customer C06: Saiyo Group (Enterprise · 30 Outlet · Golden Reference)
        { id: 'C06', label: 'Saiyo Group', type: 'customer', role: 'Resto Padang · Enterprise · 30 outlet · NPS 9', group: 'customer' },
        { id: 'K116', label: 'Budi Santoso', type: 'contact', role: 'CFO C06 (ex-Finance Mgr Sentosa Abadi)', group: 'customer' },
        { id: 'K153', label: 'Rahmat Hidayat', type: 'contact', role: 'Manajer Operasional C06', group: 'customer' },

        // Customer C03: Apotek Sehat Sentosa (Growth · 18 Outlet)
        { id: 'C03', label: 'Apotek Sehat Sentosa', type: 'customer', role: 'Apotek · Growth · 18 outlet · Isu Sinkron', group: 'customer' },
        { id: 'K079', label: 'Nurul Aini', type: 'contact', role: 'Manajer Operasional C03', group: 'customer' },
        { id: 'K021', label: 'Bambang', type: 'contact', role: 'Staf IT C03', group: 'customer' },

        // Customer C02: TB Sinar Jaya (Growth · 25 Outlet)
        { id: 'C02', label: 'TB Sinar Jaya', type: 'customer', role: 'Toko Bangunan · Growth · 25 outlet · 9 Tiket', group: 'customer' },
        { id: 'K111', label: 'Hendra Setiawan', type: 'contact', role: 'Pemilik TB Sinar Jaya C02', group: 'customer' },

        // Customer C05: Minimarket Berkah (Growth · 24 Outlet)
        { id: 'C05', label: 'Minimarket Berkah', type: 'customer', role: 'Ritel Minimarket · Growth · 24 outlet', group: 'customer' },
        { id: 'K001', label: 'Eko Prasetyo', type: 'contact', role: 'Operations Manager C05', group: 'customer' },

        // --- Shared Past Organizations ---
        { id: 'ORG_SENTOSA', label: 'PT Sentosa Abadi Group', type: 'org', role: 'Tempat Kerja Bersama K116 & K028 (2015–2019)', group: 'org' },

        // --- Deals ---
        { id: 'DL-001', label: 'Deal P01 (Mandala)', type: 'deal', role: 'Proposal · 60 outlet · Rp 252 jt/th', group: 'deal' },
        { id: 'DL-004', label: 'Deal P04 (Nirwana)', type: 'deal', role: 'Negosiasi · 35 outlet · Rp 147 jt/th', group: 'deal' },
        { id: 'DL-002', label: 'Deal P02 (Teras Kafe)', type: 'deal', role: 'Demo (45 hari) · 15 outlet · Rp 63 jt/th', group: 'deal' },
        { id: 'DL-003', label: 'Deal P03 (Pratama)', type: 'deal', role: 'Discovery · 9 outlet · Rp 38 jt/th', group: 'deal' },

        // --- Key Precedent Decisions ---
        { id: 'D-2025-11', label: 'Preseden D-2025-11', type: 'decision', role: 'Approval Diskon 15% C01 (Volume 42 outlet)', group: 'decision' },
        { id: 'D-2025-02', label: 'Preseden D-2025-02', type: 'decision', role: 'Tolak Diskon 20% C23 (Merusak harga pasar)', group: 'decision' },
        { id: 'D-2025-06', label: 'Preseden D-2025-06', type: 'decision', role: 'Strategi Alternatif C23 (Starter Pilot → Menang)', group: 'decision' },

        // --- Products, Bugs, & Competitor ---
        { id: 'FEAT-07', label: 'FEAT-07 (Integrasi Akuntansi)', type: 'feature', role: 'Dijanjikan Q3 2026 · Tertunda API Accurate', group: 'feature' },
        { id: 'BUG-412', label: 'BUG-412 (Sinkronisasi Offline)', type: 'feature', role: 'Penyebab Drop Transaksi di C03 & C05', group: 'feature' },
        { id: 'COMP_KASIRPRO', label: 'Kompetitor KasirPro', type: 'competitor', role: 'Pesaing Harga Murah (Tawaran -20% di P02, dilirik C01)', group: 'competitor' },
    ],

    // ===== EDGES =====
    edges: [
        // === P01 Core Path (Sari E03 -> Rina K017 -> Steven K089) ===
        { from: 'E03', to: 'K017', label: 'AM selama 3+ tahun (13 interaksi)', type: 'strong', weight: 10, evidence: ['I0107','I0159','I0223','I0290'] },
        { from: 'K017', to: 'P01', label: 'BEKERJA_DI (GM Operations, 1 Sep 2026)', type: 'works_at', weight: 9 },
        { from: 'K017', to: 'C01', label: 'PERNAH_BEKERJA_DI (Head of Ops 2021–Agu 2026)', type: 'worked_at', weight: 8 },
        { from: 'E03', to: 'C01', label: 'DIPEGANG_OLEH (Account Manager)', type: 'manages', weight: 8 },
        { from: 'K089', to: 'P01', label: 'BEKERJA_DI (Direktur Utama)', type: 'works_at', weight: 9 },
        { from: 'K017', to: 'K089', label: 'Lapor ke Dirut (DM Operasional Pengadaan)', type: 'reports_to', weight: 7, evidence: ['I0343'] },
        { from: 'K052', to: 'P01', label: 'BEKERJA_DI (IT Manager)', type: 'works_at', weight: 6 },
        { from: 'E06', to: 'K052', label: '4 interaksi teknis (demo)', type: 'medium', weight: 5, evidence: ['I0279','I0310','I0325','I0343'] },
        { from: 'E06', to: 'DL-001', label: 'Owner deal', type: 'owns', weight: 5 },
        { from: 'DL-001', to: 'P01', label: 'Deal untuk', type: 'deal_for', weight: 5 },
        { from: 'E06', to: 'E03', label: 'Kolaborasi Internal (Sales + CS AM)', type: 'collaborates', weight: 8 },

        // === P04 Core Path (Wahyu E04 -> Budi K116 -> Hartono K028) ===
        { from: 'E04', to: 'K116', label: 'AM C06 (Relasi Aktif, NPS 9)', type: 'strong', weight: 9, evidence: ['I0260','I0263','I0300'] },
        { from: 'E04', to: 'C06', label: 'DIPEGANG_OLEH (Account Manager)', type: 'manages', weight: 8 },
        { from: 'K116', to: 'C06', label: 'BEKERJA_DI (CFO & Champion)', type: 'works_at', weight: 9 },
        { from: 'K116', to: 'ORG_SENTOSA', label: 'PERNAH_BEKERJA_DI (Finance Mgr 2015–2019)', type: 'worked_at', weight: 8 },
        { from: 'K028', to: 'ORG_SENTOSA', label: 'PERNAH_BEKERJA_DI (General Mgr 2015–2019)', type: 'worked_at', weight: 8 },
        { from: 'K116', to: 'K028', label: 'SALING_KENAL (Ex-Kolega 5 Tahun PT Sentosa Abadi)', type: 'knows', weight: 10, evidence: ['Employment History Overlap'] },
        { from: 'K028', to: 'P04', label: 'BEKERJA_DI (Direktur Utama)', type: 'works_at', weight: 9 },
        { from: 'K065', to: 'P04', label: 'BEKERJA_DI (Purchasing Manager)', type: 'works_at', weight: 6 },
        { from: 'E06', to: 'K065', label: '3 interaksi (Stuck butuh referensi)', type: 'medium', weight: 4, evidence: ['I0284','I0314','I0335'] },
        { from: 'E06', to: 'DL-004', label: 'Owner deal', type: 'owns', weight: 5 },
        { from: 'DL-004', to: 'P04', label: 'Deal untuk', type: 'deal_for', weight: 5 },
        { from: 'E06', to: 'E04', label: 'Kolaborasi Internal (Bagus SE + Wahyu AM)', type: 'collaborates', weight: 8 },
        { from: 'E04', to: 'K153', label: 'Interaksi rutin', type: 'medium', weight: 6, evidence: ['I0077','I0119'] },
        { from: 'K153', to: 'C06', label: 'BEKERJA_DI (Manajer Ops)', type: 'works_at', weight: 6 },

        // === P02 & Competitor Context ===
        { from: 'E07', to: 'K076', label: 'Demo & Negosiasi', type: 'medium', weight: 6, evidence: ['I0272','I0294','I0347'] },
        { from: 'K076', to: 'P02', label: 'BEKERJA_DI (Pemilik)', type: 'works_at', weight: 9 },
        { from: 'E07', to: 'DL-002', label: 'Owner deal', type: 'owns', weight: 5 },
        { from: 'DL-002', to: 'P02', label: 'Deal untuk', type: 'deal_for', weight: 5 },
        { from: 'COMP_KASIRPRO', to: 'P02', label: 'Tawaran diskon 20%', type: 'competes', weight: 7, evidence: ['I0294'] },
        { from: 'COMP_KASIRPRO', to: 'C01', label: 'Dievaluasi CFO baru Yoga', type: 'competes', weight: 7, evidence: ['I0331'] },

        // === P03 Context (Klinik + Apotek) ===
        { from: 'E08', to: 'K049', label: 'Discovery meeting (Butuh ref apotek)', type: 'medium', weight: 6, evidence: ['I0334'] },
        { from: 'K049', to: 'P03', label: 'BEKERJA_DI (Kepala Apotek)', type: 'works_at', weight: 7 },
        { from: 'K114', to: 'P03', label: 'BEKERJA_DI (Direktur Klinik)', type: 'works_at', weight: 9 },
        { from: 'K049', to: 'K114', label: 'Lapor ke Direktur', type: 'reports_to', weight: 6 },
        { from: 'E08', to: 'DL-003', label: 'Owner deal', type: 'owns', weight: 5 },
        { from: 'DL-003', to: 'P03', label: 'Deal untuk', type: 'deal_for', weight: 5 },

        // === Customer C01 & Churn Risk Edges ===
        { from: 'K056', to: 'C01', label: 'BEKERJA_DI (Dirut)', type: 'works_at', weight: 8 },
        { from: 'K134', to: 'C01', label: 'BEKERJA_DI (CFO Baru, Jul 2026)', type: 'works_at', weight: 8 },
        { from: 'K050', to: 'C01', label: 'BEKERJA_DI (IT Supervisor)', type: 'works_at', weight: 5 },
        { from: 'E03', to: 'C03', label: 'DIPEGANG_OLEH (AM Apotek)', type: 'manages', weight: 7 },
        { from: 'K079', to: 'C03', label: 'BEKERJA_DI (Manajer Ops)', type: 'works_at', weight: 7 },
        { from: 'K021', to: 'C03', label: 'BEKERJA_DI (Staf IT)', type: 'works_at', weight: 5 },
        { from: 'C03', to: 'BUG-412', label: 'DISEBABKAN_OLEH (Issue sync offline)', type: 'caused_by', weight: 6, evidence: ['I0312'] },
        { from: 'C05', to: 'BUG-412', label: 'DISEBABKAN_OLEH (Issue sync offline)', type: 'caused_by', weight: 5 },

        // === Decision Log Precedents ===
        { from: 'E01', to: 'D-2025-11', label: 'MENYETUJUI (Diskon 15% C01 volume 42)', type: 'approves', weight: 6, evidence: ['I0061'] },
        { from: 'D-2025-11', to: 'C01', label: 'Untuk akun', type: 'decision_for', weight: 5 },
        { from: 'D-2025-11', to: 'FEAT-07', label: 'MENJANJIKAN (Rilis Q3 2026)', type: 'promises', weight: 6 },
        { from: 'FEAT-07', to: 'C01', label: 'Klien menagih janji', type: 'promised', weight: 6, evidence: ['I0223','I0258','I0315'] },
        { from: 'E09', to: 'FEAT-07', label: 'Head of Product (API delay)', type: 'responsible', weight: 5, evidence: ['I0258'] },
        { from: 'E01', to: 'D-2025-02', label: 'MENOLAK (Diskon 20% C23 merusak pasar)', type: 'approves', weight: 6 },
        { from: 'E01', to: 'D-2025-06', label: 'MENYETUJUI (Alternatif Starter pilot C23)', type: 'approves', weight: 6 },
        { from: 'E07', to: 'D-2025-06', label: 'Menang Deal C23 Sep 2025', type: 'owns', weight: 6 },
    ],

    // ===== CURATED RELATIONSHIP PATHS =====
    paths: {
        p01_best: {
            title: 'Jalur Terbaik ke Decision Maker P01 (Grup Ritel Mandala)',
            score: 9.2,
            nodes: ['E03', 'K017', 'K089'],
            labels: ['Sari Puspita (AM KasirNusa)', 'Rina Hapsari (GM Operations P01)', 'Steven Wijaya (Dirut P01)'],
            edges: [
                { label: 'AM C01 selama 3+ tahun, 13 interaksi positif', strength: 'strong' },
                { label: 'DM Operasional Pengadaan Sistem (I0343)', strength: 'strong' }
            ],
            evidence: [
                { id: 'I0107', text: 'QBR meeting Sari-Rina di C01 — Klien sangat puas dengan performa 42 outlet.' },
                { id: 'I0290', text: 'Email pamit Rina dari C01 (14 Agu 2026): "Terima kasih banyak atas kerja sama yang luar biasa."' },
                { id: 'Employment', text: 'K017 menjabat Head of Ops C01 (2021–Agu 2026) lalu resmi jadi GM Ops P01 per 1 Sep 2026.' },
                { id: 'I0343', text: 'Fajar (IT Mgr P01): "Proposal sudah saya teruskan ke GM Ops baru. Keputusan pengadaan kasir ada di beliau."' }
            ]
        },
        p01_alt: {
            title: 'Jalur Alternatif P01 (Bagus SE via Fajar IT Mgr)',
            score: 6.5,
            nodes: ['E06', 'K052', 'K089'],
            labels: ['Bagus Prakoso (Sales Executive)', 'Fajar Nugraha (IT Mgr P01)', 'Steven Wijaya (Dirut P01)'],
            edges: [
                { label: '4 interaksi teknis demo, respons positif', strength: 'medium' },
                { label: 'Bukan decision maker, proposal tertahan 20 hari', strength: 'weak' }
            ],
            evidence: [
                { id: 'I0279', text: 'Discovery meeting Bagus & Fajar — 60 gerai minimarket, sistem lama sering error.' },
                { id: 'I0343', text: 'Fajar menegaskan: "Saya hanya menilai sisi teknis, tidak punya wewenang komersial."' }
            ]
        },
        p04_best: {
            title: 'Jalur Terbaik ke Decision Maker P04 (Nirwana Hotel & Resto)',
            score: 8.5,
            nodes: ['E04', 'K116', 'K028'],
            labels: ['Wahyu Nugroho (AM KasirNusa)', 'Budi Santoso (CFO Saiyo Group C06)', 'Hartono Gunawan (Dirut P04)'],
            edges: [
                { label: 'AM C06 Saiyo Group, relasi prima, NPS 9, 10+ interaksi', strength: 'strong' },
                { label: 'Ex-Kolega 5 tahun di PT Sentosa Abadi Group (Finance Mgr & GM)', strength: 'strong' }
            ],
            evidence: [
                { id: 'Employment', text: 'K116: Finance Manager di PT Sentosa Abadi Group (2015–2019).' },
                { id: 'Employment', text: 'K028: General Manager di PT Sentosa Abadi Group (2015–2019) → 5 tahun overlap!' },
                { id: 'I0300', text: 'Budi Santoso → Wahyu (19 Agu 2026): "Kami berencana buka 10 outlet di Jakarta... tetap pakai KasirNusa."' },
                { id: 'I0335', text: 'Yuli Astuti (P04 Purchasing): "Dirut kami minta rekomendasi dari pengguna sejenis sebelum tanda tangan."' }
            ]
        },
        p04_alt: {
            title: 'Jalur Alternatif P04 (Bagus SE via Yuli Purchasing)',
            score: 5.0,
            nodes: ['E06', 'K065', 'K028'],
            labels: ['Bagus Prakoso (Sales Executive)', 'Yuli Astuti (Purchasing P04)', 'Hartono Gunawan (Dirut P04)'],
            edges: [
                { label: '3 interaksi negosiasi harga', strength: 'medium' },
                { label: 'Stuck 30 hari di stage Negosiasi karena butuh peer reference', strength: 'weak' }
            ],
            evidence: [
                { id: 'I0335', text: 'Yuli: "Kami tunda dulu sampai ada referensi rekanan."' }
            ]
        }
    },

    // ===== QUERY ANSWERS & INSIGHTS =====
    queryAnswers: {
        path_p01: {
            title: '🔍 Jalur Terbaik ke Decision Maker P01 (Grup Ritel Mandala · Rp 252 Jt)',
            path: 'Sari Puspita (E03, AM) ➔ [AM C01 3+ thn] ➔ Rina Hapsari (K017, GM Ops) ➔ [DM Operasional] ➔ Steven Wijaya (K089, Dirut)',
            explanation: `
                <p><strong>Temuan Kunci:</strong> Fajar Nugraha (IT Mgr) mengonfirmasi via email <span class="evidence-tag">I0343</span> bahwa <em>"Keputusan pengadaan sistem kasir ada di GM Operations baru yang bergabung awal September."</em></p>
                <p>Berdasarkan <strong>contact_employment_history.csv</strong>, GM Operations baru tersebut adalah <strong>Rina Hapsari (K017)</strong>, mantan Head of Operations <strong>Kopi Lintas Nusantara (C01)</strong> selama 2021–Agustus 2026.</p>
                <p><strong>Jalur Terkuat:</strong> Sari Puspita (AM KasirNusa, E03) mengelola akun C01 selama 3+ tahun dengan lebih dari 13 interaksi langsung dan hubungan sangat hangat <span class="evidence-tag">I0290</span>. Rina sudah sangat memahami performa KasirNusa di 42 outlet.</p>
                <div class="insight-box" style="margin-top: 10px; padding: 10px; background: rgba(108, 99, 255, 0.1); border-left: 3px solid var(--accent-purple);">
                    <strong>💡 Rekomendasi Taktis:</strong> Sari mengirim pesan hangat memberi selamat atas posisi baru Rina, lalu menawarkan presentasi bersama Bagus Prakoso (Sales).<br>
                    <strong>⚠️ Preseden & Risiko:</strong> Rina mengetahui janji fitur Integrasi Akuntansi (FEAT-07) di C01 belum rilis <span class="evidence-tag">D-2025-11</span>. Tim harus transparan dan tidak mengulang janji kosong.
                </div>
            `
        },
        path_p04: {
            title: '🔍 Jalur Terbaik ke Decision Maker P04 (Nirwana Hotel & Resto · Rp 147 Jt)',
            path: 'Wahyu Nugroho (E04, AM) ➔ [AM C06] ➔ Budi Santoso (K116, CFO C06) ➔ [Ex-Kolega 5 thn] ➔ Hartono Gunawan (K028, Dirut P04)',
            explanation: `
                <p><strong>Akar Masalah:</strong> Deal P04 macet di Negosiasi selama 30 hari karena Yuli Astuti (Purchasing) menyatakan: <em>"Direktur Utama kami minta rekomendasi dari pengguna yang mirip dengan kami sebelum tanda tangan"</em> <span class="evidence-tag">I0335</span>.</p>
                <p>Direktur Utama P04 adalah <strong>Hartono Gunawan (K028)</strong>. Analisis multi-sumber membuktikan Hartono adalah General Manager di <strong>PT Sentosa Abadi Group (2015–2019)</strong>.</p>
                <p>Di periode yang sama persis (2015–2019), <strong>Budi Santoso (K116)</strong> menjabat sebagai Finance Manager di PT Sentosa Abadi Group! Keduanya adalah rekan kerja level eksekutif selama 5 tahun penuh.</p>
                <p>Saat ini Budi Santoso adalah CFO <strong>Saiyo Group (C06)</strong> — pelanggan Enterprise KasirNusa di sektor F&B (Resto Padang 30 outlet) dengan NPS 9, health score Hijau, bahkan sedang ekspansi 10 cabang baru ke Jakarta <span class="evidence-tag">I0300</span>!</p>
                <div class="insight-box" style="margin-top: 10px; padding: 10px; background: rgba(0, 217, 255, 0.1); border-left: 3px solid var(--accent-cyan);">
                    <strong>💡 Rekomendasi Dua Langkah:</strong><br>
                    1. Wahyu Nugroho (AM C06) meminta kesediaan Budi Santoso memberikan referensi rekanan.<br>
                    2. Bagus Prakoso (SE) meneruskan kontak referensi Budi ke Hartono/Yuli, membuka jalan penandatanganan kontrak Rp 147 juta.
                </div>
            `
        },
        who_knows_who: {
            title: '🔍 Koneksi SALING_KENAL Tersembunyi dari Riwayat Kerja',
            path: 'contact_employment_history.csv ➔ PT Sentosa Abadi Group & Multi-Organization Links',
            explanation: `
                <p>Dengan menggabungkan <strong>contact_employment_history.csv</strong> dan data akun, terungkap relasi yang tidak tercatat di CRM biasa:</p>
                <ul>
                    <li><strong>Budi Santoso (K116) ↔ Hartono Gunawan (K028)</strong>: Keduanya bekerja di <em>PT Sentosa Abadi Group</em> (2015–2019). Budi (Finance Mgr) dan Hartono (GM) punya kedekatan profesional 5 tahun ➔ <strong>Kunci unblock deal P04</strong>.</li>
                    <li><strong>Rina Hapsari (K017)</strong>: Head of Operations di C01 (Kopi Lintas) selama 5 tahun ➔ Pindah jadi GM Operations di P01 (Grup Ritel Mandala) pada September 2026 ➔ <strong>Kunci direct warm intro P01</strong>.</li>
                    <li><strong>Yoga Pratama (K134)</strong>: CFO baru di C01 per Juli 2026, mantan PT Boga Rasa Indonesia. Karena belum kenal KasirNusa, ia mulai melirik kompetitor KasirPro <span class="evidence-tag">I0331</span>.</li>
                </ul>
            `
        },
        cross_track: {
            title: '🔍 Temuan Lintas Track Mandiri: CS Churn ↔ Sales Growth (Bonus +5)',
            path: 'C01 Churn Risk ➔ K017 ➔ P01 Opportunity | C06 CS Success ➔ K116 ➔ P04 Acceleration',
            explanation: `
                <p><strong>1. Dinamika C01 (Churn Risk) ke P01 (Sales Opportunity):</strong></p>
                <ul>
                    <li>Kepergian Rina Hapsari (K017) dari C01 melemahkan posisi KasirNusa di C01. CFO baru (Yoga Pratama, K134) meninjau vendor dan menimbang KasirPro <span class="evidence-tag">I0331</span>, diperparah oleh keterlambatan FEAT-07 <span class="evidence-tag">I0258</span>.</li>
                    <li>Namun kepindahan Rina ke P01 menjadi <strong>peluang emas Sales</strong>: Rina membawa kepercayaan produk ke 60 gerai Mandala bernilai Rp 252 juta/tahun.</li>
                </ul>
                <p><strong>2. CS Customer Advocacy C06 Menyelamatkan Pipeline Sales P04:</strong></p>
                <ul>
                    <li>Keberhasilan CS mengawal Saiyo Group C06 (NPS 9, ekspansi 10 cabang) dikonversi langsung menjadi amunisi referral oleh tim Sales untuk closing Nirwana Hotel P04.</li>
                </ul>
            `
        },
        precedent: {
            title: '🔍 Preseden Log Keputusan: Diskon Volume vs Bahaya Perang Harga',
            path: 'decision_log.csv ➔ D-2025-11, D-2025-02, D-2025-06, D-2024-01',
            explanation: `
                <p>Analisis 30 baris log keputusan mengungkapkan aturan baku dan preseden VP Sales Andi Wiratama:</p>
                <ul>
                    <li><strong>D-2025-11 (Disetujui 15% untuk C01, 42 outlet)</strong>: Justifikasi volume besar (>30 outlet) dan komitmen tahunan. Preseden ini menjadi dasar hukum yang sah untuk menawarkan diskon 15%–18% pada <strong>P01 (60 outlet)</strong>.</li>
                    <li><strong>D-2025-02 (DITOLAK 20% untuk C23)</strong>: Permintaan diskon 20% demi menyamai kompetitor ditolak tegas: <em>"Di atas batas 15%; menyamai harga kompetitor merusak harga pasar."</em> Deal sempat kalah.</li>
                    <li><strong>D-2025-06 (Disetujui Solusi Alternatif C23)</strong>: KasirNusa menawarkan paket Starter pilot 6 outlet tanpa diskon, dan akhirnya menang besar di September 2025! ➔ <strong>Pelajaran untuk P02 (Teras Kafe) yang minta diskon 20% karena KasirPro</strong>: Jangan beri 20%, tawarkan pilot atau paket bertahap!</li>
                </ul>
            `
        },
        risk_p01: {
            title: '🔍 Analisis Risiko Tersembunyi: Dampak Keterlambatan FEAT-07',
            path: 'D-2025-11 ➔ FEAT-07 ➔ I0258 ➔ K017 (Rina Hapsari)',
            explanation: `
                <p><strong>Risiko Kredibilitas:</strong> Pada renewal C01 November 2025, integrasi akuntansi (FEAT-07) dijanjikan rilis Q3 2026 atas permintaan langsung Rina Hapsari <span class="evidence-tag">D-2025-11</span>.</p>
                <p>Namun pada Juni 2026, rilis tertunda akibat perombakan API Accurate <span class="evidence-tag">I0258</span>, dan per 1 Oktober 2026 belum ada kepastian tanggal rilis.</p>
                <p><strong>Mitigasi Sales:</strong> Jangan janjikan integrasi akuntansi sebagai janji lisan baru ke Rina di P01. Jelaskan roadmap secara realistis dan tonjolkan keunggulan multi-outlet inventory yang sudah terbukti stabil di 60 gerai.</p>
            `
        },
        tim2_dm: {
            title: '🔍 Stakeholder Mapping & Decision Maker Discovery di P01 & P03 (Tugas Tim 2)',
            path: 'P01: Fajar (Teknis) ➔ Rina (DM Ops) ➔ Steven (Dirut) | P03: Ratna (Apotek) ➔ Hanif (Dirut)',
            explanation: `
                <p><strong>P01 (Grup Ritel Mandala):</strong></p>
                <ul>
                    <li>Fajar Nugraha (K052, IT Mgr): Evaluator teknis, tidak berwenang memutuskan komersial.</li>
                    <li><strong>Rina Hapsari (K017, GM Operations)</strong>: Decision maker operasional utama (<span class="evidence-tag">I0343</span>: "Keputusan ada di beliau").</li>
                    <li>Steven Wijaya (K089, Dirut): Penandatangan kontrak formal atas rekomendasi Rina.</li>
                </ul>
                <p><strong>P03 (Klinik Pratama Medika):</strong></p>
                <ul>
                    <li>Ratna Dewi (K049, Kepala Apotek): User champion yang butuh modul apotek dan minta referensi.</li>
                    <li><strong>Hanif Maulana (K114, Direktur Klinik)</strong>: Pemegang keputusan penganggaran final.</li>
                </ul>
            `
        },
        tim4_accel: {
            title: '🔍 Deal Acceleration: Prioritas Pipeline & Langkah Nyata (Tugas Tim 4)',
            path: 'P01 (Rp 252 jt) & P04 (Rp 147 jt) = Rp 399 jt (60% Total Pipeline)',
            explanation: `
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.85rem;">
                    <tr style="border-bottom: 1px solid var(--border-active); color: var(--accent-cyan);">
                        <th style="padding: 6px; text-align: left;">Prospek</th>
                        <th style="padding: 6px;">Potensi</th>
                        <th style="padding: 6px;">Status</th>
                        <th style="padding: 6px;">Langkah Akselerasi Berbasis Graph</th>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 6px;"><strong>P01</strong> (Mandala)</td>
                        <td style="padding: 6px; color: var(--accent-green);">Rp 252 Jt</td>
                        <td style="padding: 6px;">Prioritas 1</td>
                        <td style="padding: 6px;">Sari kontak Rina Hapsari + ajukan diskon 15% (Preseden D-2025-11).</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 6px;"><strong>P04</strong> (Nirwana)</td>
                        <td style="padding: 6px; color: var(--accent-green);">Rp 147 Jt</td>
                        <td style="padding: 6px;">Prioritas 2</td>
                        <td style="padding: 6px;">Wahyu minta referensi Budi Santoso (C06) untuk Hartono Gunawan.</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 6px;"><strong>P02</strong> (Teras Kafe)</td>
                        <td style="padding: 6px;">Rp 63 Jt</td>
                        <td style="padding: 6px;">Prioritas 3</td>
                        <td style="padding: 6px;">Tolak diskon 20% (Preseden D-2025-02); tawarkan pilot Starter (Preseden D-2025-06).</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><strong>P03</strong> (Pratama)</td>
                        <td style="padding: 6px;">Rp 38 Jt</td>
                        <td style="padding: 6px;">Prioritas 4</td>
                        <td style="padding: 6px;">Berikan referensi pelanggan apotek yang stabil.</td>
                    </tr>
                </table>
            `
        },
        tim5_expansion: {
            title: '🔍 Account Expansion: Peluang Tambahan Pelanggan Aktif (Tugas Tim 5)',
            path: 'C06 Saiyo Group ➔ 10 Outlet Baru Jakarta (Rp 42 Jt/th tambahan)',
            explanation: `
                <p><strong>Saiyo Group (C06):</strong> Pada 19 Agustus 2026, CFO Budi Santoso secara proaktif mengabarkan rencana penambahan 10 outlet di Jakarta pada Q2 2027 <span class="evidence-tag">I0300</span>.</p>
                <p>Potensi nilai ekspansi: 10 outlet × Rp 350.000 × 12 bulan = <strong>Rp 42.000.000 per tahun</strong> tambahan pendapatan berulang!</p>
                <p><strong>TB Sinar Jaya (C02):</strong> Jangan lakukan ekspansi sebelum 9 tiket bug diselesaikan oleh tim Product/Support, agar tidak memicu churn.</p>
            `
        },
        tim1_churn: {
            title: '🔍 Churn Early Warning: Akun Paling Berisiko Churn (Tugas Tim 1)',
            path: 'C01 (Kopi Lintas) & C03 (Apotek Sehat Sentosa)',
            explanation: `
                <p><strong>1. C01 (Kopi Lintas Nusantara) — Risiko Sangat Tinggi:</strong></p>
                <ul>
                    <li>Kehilangan internal champion (Rina Hapsari pindah ke P01).</li>
                    <li>CFO baru Yoga Pratama mengevaluasi vendor lain (KasirPro) <span class="evidence-tag">I0331</span>.</li>
                    <li>Janji integrasi akuntansi FEAT-07 tertunda <span class="evidence-tag">I0258</span>. Tanggal renewal: 15 Desember 2026!</li>
                </ul>
                <p><strong>2. C03 (Apotek Sehat Sentosa) — Risiko Sedang-Tinggi:</strong></p>
                <ul>
                    <li>Penurunan transaksi 35% di 6 outlet akibat kendala sinkronisasi offline (BUG-412). Butuh penanganan cepat dari support lead Maya Kusuma.</li>
                </ul>
            `
        }
    }
};

// Export to window
window.GRAPH_DATA = GRAPH_DATA;
