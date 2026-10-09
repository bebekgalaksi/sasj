// ===== Dynamic Application State & API Controller =====

let currentProspectId = 'P01';
let cachedEntities = { companies: [], persons: [] };

document.addEventListener('DOMContentLoaded', () => {
    loadPathFinder('P01');
    loadEntitiesAndInitCalculator();
    loadParameterAnalysis();
});

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) {
        toastText.textContent = message;
        toast.classList.remove('-translate-y-16', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-16', 'opacity-0');
        }, 3000);
    }
}

// Copy to clipboard helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Draft email berhasil disalin ke clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Fetch Entities from API to Populate Calculator Select Boxes
async function loadEntitiesAndInitCalculator() {
    try {
        const response = await fetch('/api/entities');
        cachedEntities = await response.json();
        onCalcModeChange();
        runCalculatorQuery();
    } catch (err) {
        console.error("Error loading entities:", err);
    }
}

// Dynamic Populator for Calculator Select Boxes
function onCalcModeChange() {
    const modeSelect = document.getElementById('calc-mode');
    const sourceSelect = document.getElementById('calc-source');
    const targetSelect = document.getElementById('calc-target');
    const lblSource = document.getElementById('lbl-calc-source');
    const lblTarget = document.getElementById('lbl-calc-target');

    if (!modeSelect || !sourceSelect || !targetSelect) return;

    const mode = modeSelect.value;

    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';

    if (mode === 'company_to_company') {
        if (lblSource) lblSource.textContent = "2. Perusahaan Asal (From Company):";
        if (lblTarget) lblTarget.textContent = "3. Perusahaan Tujuan (To Company):";

        cachedEntities.companies.forEach(c => {
            sourceSelect.add(new Option(c.label, c.id, false, c.id === 'C01'));
            targetSelect.add(new Option(c.label, c.id, false, c.id === 'P01'));
        });

    } else if (mode === 'people_to_company') {
        if (lblSource) lblSource.textContent = "2. Orang Asal (From Person):";
        if (lblTarget) lblTarget.textContent = "3. Perusahaan Tujuan (To Company):";

        cachedEntities.persons.forEach(p => {
            sourceSelect.add(new Option(p.label, p.id, false, p.id === 'E03'));
        });
        cachedEntities.companies.forEach(c => {
            targetSelect.add(new Option(c.label, c.id, false, c.id === 'P01'));
        });

    } else { // company_to_people
        if (lblSource) lblSource.textContent = "2. Perusahaan Asal (From Company):";
        if (lblTarget) lblTarget.textContent = "3. Orang Tujuan (To Person):";

        cachedEntities.companies.forEach(c => {
            sourceSelect.add(new Option(c.label, c.id, false, c.id === 'C01'));
        });
        cachedEntities.persons.forEach(p => {
            targetSelect.add(new Option(p.label, p.id, false, p.id === 'K017'));
        });
    }
}

// Run Custom Pathfinding Calculator Query via API
async function runCalculatorQuery() {
    const modeSelect = document.getElementById('calc-mode');
    const sourceSelect = document.getElementById('calc-source');
    const targetSelect = document.getElementById('calc-target');
    const cardContainer = document.getElementById('calculator-output-card');

    if (!modeSelect || !sourceSelect || !targetSelect || !cardContainer) return;

    const mode = modeSelect.value;
    const source = sourceSelect.value;
    const target = targetSelect.value;

    cardContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400">
            <div class="inline-block animate-spin w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full mb-2"></div>
            <p class="text-xs font-medium">Menghitung jalur & bobot relasi via Python Backend...</p>
        </div>
    `;

    try {
        const response = await fetch(`/api/custom-pathfinder?mode=${mode}&source=${source}&target=${target}`);
        const data = await response.json();

        if (data.error) {
            cardContainer.innerHTML = `<div class="p-4 text-red-500 font-bold text-xs">${data.error}</div>`;
            return;
        }

        const isBestMatch = data.is_best_match;
        const geminiPowered = data.gemini_powered;

        cardContainer.innerHTML = `
            <div class="space-y-4">
                <!-- Header Score & Best Match Status -->
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Hasil Kalkulasi Graf</span>
                        ${geminiPowered ? '<span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[9px] shadow-sm">✨ Gemini AI</span>' : ''}
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-full ${isBestMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-extrabold text-[10px]">
                            ${isBestMatch ? '🏆 #1 Best Match (Golden Path)' : 'ℹ️ Alternative Path'}
                        </span>
                        <span class="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow">
                            ${data.score} / 10
                        </span>
                    </div>
                </div>

                <!-- Breadcrumb Path -->
                ${data.path_labels && data.path_labels.length > 0 ? `
                    <div class="space-y-1">
                        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">🔗 Urutan Langkah Jalur:</span>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                            ${data.path_labels.join(' ➔ ')}
                        </div>
                    </div>
                ` : ''}

                <!-- Formula / Calculation -->
                <div class="space-y-1">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">📐 Perhitungan Formula:</span>
                    <div class="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                        ${data.calculation}
                    </div>
                </div>

                <!-- Mengapa Segitu -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">💡 Mengapa Nilainya ${data.score}?</span>
                        ${geminiPowered ? '<span class="text-[10px] text-purple-600 font-bold">Generative AI Summary</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-700 leading-relaxed p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                        ${data.why_score}
                    </p>
                </div>

                <!-- Penjelasan & Perbandingan -->
                <div class="space-y-1">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">📝 Penjelasan & Perbandingan:</span>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        ${data.explanation}
                    </p>
                </div>
            </div>
        `;

        if (window.highlightCustomNodes && data.path_nodes) {
            window.highlightCustomNodes(data.path_nodes);
        }

    } catch (err) {
        console.error("Error calculating custom path:", err);
    }
}

// Fetch Path Finder Solver Data from Backend API
async function loadPathFinder(prospectId) {
    currentProspectId = prospectId;
    
    // Update Button Tabs UI
    const btnP01 = document.getElementById('btn-p01');
    const btnP04 = document.getElementById('btn-p04');
    if (btnP01 && btnP04) {
        if (prospectId === 'P01') {
            btnP01.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-blue-600 text-white shadow-md";
            btnP04.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-blue-600";
        } else {
            btnP04.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-blue-600 text-white shadow-md";
            btnP01.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-blue-600";
        }
    }

    const container = document.getElementById('pathfinder-results');
    if (!container) return;

    container.innerHTML = `
        <div class="lg:col-span-3 p-12 text-center text-slate-400">
          <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p class="text-sm font-medium">Menghitung jalur terbaik untuk ${prospectId} via Backend REST API...</p>
        </div>
    `;

    try {
        const response = await fetch(`/api/pathfinder?prospect_id=${prospectId}`);
        const data = await response.json();
        
        if (data.error) {
            container.innerHTML = `<div class="lg:col-span-3 p-6 text-red-500 font-bold">${data.error}</div>`;
            return;
        }

        const best = data.best_path;
        const alt = data.alternative_path;
        const deal = data.deal;

        container.innerHTML = `
            <!-- Left 2 Cols: Golden Path & Draft Email Card -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Golden Path Card -->
                <div class="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-xl space-y-5 relative overflow-hidden">
                    <div class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl shadow-md">
                        🔥 JALUR KONEKSI TERPERDEK & TERKUAT
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-sm flex items-center justify-center border border-blue-200">
                            ${best.score}
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-slate-900">${best.title}</h3>
                            <p class="text-xs text-slate-500">Nilai Potensi: <strong class="text-blue-600">Rp ${intComma(deal.nilai_tahunan)} / th</strong> (60 outlet) · Stage: ${deal.stage}</p>
                        </div>
                    </div>

                    <!-- Breadcrumbs Connection Sequence -->
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        ${best.path_labels.map((label, idx) => `
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">${label}</span>
                                ${idx < best.path_labels.length - 1 ? '<span class="text-blue-600 font-black">➔</span>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Decision Maker Highlight -->
                    <div class="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-purple-900 uppercase tracking-wider">🎯 Decision Maker Sebenarnya: ${best.decision_maker.name}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-800 font-extrabold text-[10px]">${best.decision_maker.title}</span>
                        </div>
                        <p class="text-xs text-purple-950 leading-relaxed">${best.decision_maker.reason}</p>
                    </div>

                    <!-- Evidence & Edge Explanation -->
                    <div class="space-y-2">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Bukti Relasi & Bobot Grafik:</h4>
                        <div class="space-y-2">
                            ${best.edges_explained.map(edge => `
                                <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between text-xs gap-3">
                                    <div>
                                        <span class="font-bold text-slate-900">${edge.from} ➔ ${edge.to}</span>
                                        <p class="text-slate-500 mt-0.5">${edge.reason}</p>
                                    </div>
                                    <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px] whitespace-nowrap">Weight: ${edge.weight}/10</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Draft Intro Email Card -->
                <div class="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <h4 class="text-sm font-bold tracking-tight">Draft Pesan Intro Kontekstual</h4>
                        </div>
                        <button onclick="copyToClipboard(\`${escapeQuote(best.draft_email.body)}\`)" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all active:scale-95 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Copy Email Text
                        </button>
                    </div>

                    <div class="space-y-2 text-xs">
                        <div class="flex items-center gap-2 text-slate-400">
                            <span class="w-16 font-mono font-bold text-slate-500 uppercase">Kepada:</span>
                            <span class="text-blue-300 font-mono">${best.draft_email.to}</span>
                        </div>
                        <div class="flex items-center gap-2 text-slate-400">
                            <span class="w-16 font-mono font-bold text-slate-500 uppercase">Subjek:</span>
                            <span class="text-white font-bold">${best.draft_email.subject}</span>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                        ${best.draft_email.body}
                    </div>
                </div>
            </div>

            <!-- Right Col: Alternative / Bottleneck Path Card -->
            <div class="space-y-6">
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 class="text-sm font-bold text-slate-900">Jalur Alternatif / Bottleneck</h3>
                        <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Score: ${alt.score}/10</span>
                    </div>

                    <h4 class="text-xs font-bold text-slate-800">${alt.title}</h4>

                    <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                        ${alt.path_labels.join(' ➔ ')}
                    </div>

                    <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span class="font-bold block uppercase tracking-wider text-[10px] text-amber-800">⚠️ Mengapa Jalur Ini Macet?</span>
                        <p class="leading-relaxed">${alt.bottleneck_reason}</p>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        console.error("Error loading pathfinder data:", err);
        container.innerHTML = `<div class="lg:col-span-3 p-6 text-red-500 font-bold">Gagal terhubung ke Backend API Python. Pastikan backend server running di port 8081.</div>`;
    }
}

// Fetch Data Parameter Breakdown from Backend API
async function loadParameterAnalysis() {
    const container = document.getElementById('parameter-details-container');
    if (!container) return;

    try {
        const response = await fetch('/api/parameter-analysis');
        const data = await response.json();

        container.innerHTML = `
            <!-- Included Data Files -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Dataset yang Digunakan (Tim 3)
                    </h3>
                    <span class="text-xs text-slate-400 font-mono">7 Dataset Files</span>
                </div>
                <div class="space-y-3">
                    ${data.included_datasets.map(ds => `
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs">
                            <span class="px-2 py-1 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px] whitespace-nowrap">${ds.file}</span>
                            <p class="text-slate-600">${ds.purpose}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Excluded Data Files & Mathematical Formulation -->
            <div class="space-y-6">
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> Dataset yang Dieliminasi (Alasan Ilmiah)
                        </h3>
                        <span class="text-xs text-slate-400 font-mono">4 Dataset Files</span>
                    </div>
                    <div class="space-y-3">
                        ${data.excluded_datasets.map(ds => `
                            <div class="p-3 rounded-xl bg-red-50/40 border border-red-100 flex items-start gap-3 text-xs">
                                <span class="px-2 py-1 rounded bg-red-100 text-red-800 font-mono font-bold text-[10px] whitespace-nowrap">${ds.file}</span>
                                <p class="text-slate-700">${ds.reason}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-blue-400">Formula Matematika Path Score</h3>
                    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                        ${data.mathematical_formula.edge_weight}<br>
                        ${data.mathematical_formula.path_score}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Error loading parameter analysis:", err);
    }
}

// Live API Tester Helper
async function testApi(endpoint) {
    const output = document.getElementById('api-response');
    if (!output) return;
    output.textContent = `// Sending request to ${endpoint}...`;
    try {
        const res = await fetch(endpoint);
        const json = await res.json();
        output.textContent = `// Response from ${endpoint}:\n\n` + JSON.stringify(json, null, 2);
    } catch (err) {
        output.textContent = `// Error fetching ${endpoint}: ` + err.message;
    }
}

// Utilities
function intComma(val) {
    if (!val) return '0';
    return parseInt(val).toLocaleString('id-ID');
}

function escapeQuote(str) {
    if (!str) return '';
    return str.replace(/`/g, '\\`').replace(/'/g, "\\'").replace(/"/g, '\\"');
}
