import React, { useState } from 'react';

const P01_NODES = [
  {
    id: 'K134',
    category: 'CONTACT',
    code: 'CONTACT - K134',
    title: 'Yoga Pratama',
    subtitle: 'New CFO Kopi Lintas (July 2026)',
    type: 'crm',
    x: 24,
    y: 20,
    file: 'crm_contacts.csv & contact_employment_history.csv',
    quote: 'CFO of Kopi Lintas Nusantara as of July 2026. Replaced prior leadership following Rina Hapsari\'s departure.',
    signal: 'competitor',
    summary: 'New CFO of C01 evaluating POS vendors and citing competing proposal from KasirPro.'
  },
  {
    id: 'E01',
    category: 'EMPLOYEE',
    code: 'EMPLOYEE - E01',
    title: 'Andi Wiratama',
    subtitle: 'CEO KasirNusa (Discount Authority)',
    type: 'crm',
    x: 24,
    y: 410,
    file: 'employees.csv:L2',
    quote: 'President Director & CEO of PT KasirNusa Teknologi. Holds strategic commercial discount approval authority.',
    signal: 'feature',
    summary: 'KasirNusa CEO who granted commercial 15% discount exception approval in D-2025-11.'
  },
  {
    id: 'I0331',
    category: 'INTERACTION',
    code: 'INTERACTION - I0331',
    title: 'Meeting with CFO Yoga Pratama',
    subtitle: 'Mentions KasirPro Proposal',
    type: 'email',
    x: 310,
    y: 20,
    file: 'interactions.jsonl:I0331',
    quote: '[2026-09-18] Sari Puspita (AM): "Introductory meeting with new CFO Yoga Pratama. Client mentioned being approached by KasirPro."',
    signal: 'competitor',
    summary: 'Written CRM interaction record showing competitor KasirPro attempting to displace KasirNusa.'
  },
  {
    id: 'I0061',
    category: 'INTERACTION',
    code: 'INTERACTION - I0061',
    title: '15% Discount Approval',
    subtitle: 'FEAT-07 Priority Commitment',
    type: 'email',
    x: 310,
    y: 150,
    file: 'interactions.jsonl:I0061',
    quote: '[2025-11-28] andi@kasirnusa.id: "Approved 15% discount for Kopi Lintas with product team commitment to prioritize FEAT-07."',
    signal: 'feature',
    summary: 'Internal email approving 15% volume discount, serving as written evidence tying into D-2025-11.'
  },
  {
    id: 'FEAT-07',
    category: 'FEATURE',
    code: 'FEATURE - FEAT-07',
    title: 'Accounting Integration (Jurnal)',
    subtitle: 'Pending Q3 2026 Commitment',
    type: 'feature',
    x: 310,
    y: 280,
    file: 'decision_log.csv / product_roadmap',
    quote: 'Automated POS daily journal sync to Mekari/Jurnal. Promised for Q3 2026 release but delayed (escalation D-2026-08).',
    signal: 'feature',
    summary: 'Feature promised to Rina Hapsari during C01 tenure, now urgently required for Mandala\'s 60 outlets (P01).'
  },
  {
    id: 'D-2025-11',
    category: 'DECISION',
    code: 'DECISION - D-2025-11',
    title: '15% Volume Discount',
    subtitle: '42-Outlet Precedent (C01)',
    type: 'decision',
    x: 310,
    y: 410,
    file: 'decision_log.csv:D-2025-11',
    quote: 'Exception: 42-outlet strategic account; accounting integration release scheduled Q3 2026. Promise status: Pending delivery.',
    signal: 'feature',
    summary: '15% volume discount precedent approved for Kopi Lintas (C01), legally reusable by Bagus for P01 (60 outlets).'
  },
  {
    id: 'KOMP-KASIR',
    category: 'COMPETITOR',
    code: 'COMPETITOR',
    title: 'KasirPro (Cloud POS)',
    subtitle: '0.5% Transaction Fee Promotion',
    type: 'crm',
    x: 610,
    y: 20,
    file: 'competitor_intel.csv',
    quote: 'Cloud POS competitor offering 0.5% transaction fee promotion and rapid onboarding.',
    signal: 'competitor',
    summary: 'Competitor cited in interaction I0331 by CFO Yoga Pratama.'
  },
  {
    id: 'I0290',
    category: 'INTERACTION',
    code: 'INTERACTION - I0290',
    title: 'Farewell Email from Rina Hapsari',
    subtitle: 'Transition to Major Retail Group',
    type: 'email',
    x: 610,
    y: 150,
    file: 'interactions.jsonl:I0290',
    quote: '[2026-08-14] rina.hapsari@kopilintas.co.id to sari@kasirnusa.id: "Thank you for an incredible 3-year partnership. Moving on to a new role at a large retail group."',
    signal: 'champion',
    summary: 'Critical evidence of champion Rina Hapsari transitioning from C01 before officially starting as GM Ops at Mandala (P01).'
  },
  {
    id: 'K017',
    category: 'CONTACT',
    code: 'CONTACT - K017',
    title: 'Rina Hapsari',
    subtitle: 'GM Operations P01 (ex-C01)',
    type: 'crm',
    x: 610,
    y: 410,
    file: 'contact_employment_history.csv:L18 & crm_contacts.csv',
    quote: 'Head of Operations C01 (2021-Aug 2026) ➔ GM Operations P01 (Sep 2026-Present). Holds commercial sign-off authority for Mandala 60-store POS procurement.',
    signal: 'champion',
    summary: 'Primary Trusted Advocate / Champion for PT KasirNusa Teknologi bridging C01 to P01.'
  },
  {
    id: 'K-C01',
    category: 'CONTRACT',
    code: 'CONTRACT - K-C01',
    title: '42-Store Legal Contract',
    subtitle: 'Active Contract with 15% Discount',
    type: 'contract',
    x: 900,
    y: 20,
    file: 'contracts_billing.csv:K-C01',
    quote: 'Active legal agreement between KasirNusa and Kopi Lintas Nusantara for 42 stores with 15% volume discount.',
    signal: 'feature',
    summary: 'Binding legal contract containing pricing precedent ready to adapt for Mandala P01.'
  },
  {
    id: 'C01',
    category: 'ACCOUNT',
    code: 'ACCOUNT - C01',
    title: 'Kopi Lintas Nusantara',
    subtitle: 'Existing Customer (42 Stores)',
    type: 'crm',
    x: 900,
    y: 150,
    file: 'crm_accounts.csv:C01',
    quote: 'KasirNusa strategic customer (42 outlets). Previous company where Rina Hapsari led operations for 5 years.',
    signal: 'champion',
    summary: 'Existing customer account serving as reference for satisfaction and product proof.'
  },
  {
    id: 'P01',
    category: 'ACCOUNT',
    code: 'ACCOUNT - P01',
    title: 'Mandala Retail Group',
    subtitle: 'Priority Target (60 Stores - Rp 252M)',
    type: 'crm',
    x: 900,
    y: 410,
    file: 'crm_accounts.csv:P01 & crm_deals.csv',
    quote: 'Priority 1 Target Prospect (60 outlets, deal value Rp 252M). Status: Proposal Stalled 20 days due to misidentified evaluator contact.',
    signal: 'champion',
    summary: 'High-priority prospect account whose key unlock is Sari Puspita (AM) providing a warm intro to Rina Hapsari.'
  }
];

const P01_EDGES = [
  { from: 'E01', to: 'D-2025-11', label: 'Approves', signal: 'feature' },
  { from: 'K134', to: 'I0331', label: 'Involved In', signal: 'competitor' },
  { from: 'I0331', to: 'KOMP-KASIR', label: 'Mentions', signal: 'competitor' },
  { from: 'I0331', to: 'C01', label: 'Account Related', signal: 'competitor' },
  { from: 'D-2025-11', to: 'I0061', label: 'Approval Evidence', signal: 'feature' },
  { from: 'D-2025-11', to: 'FEAT-07', label: 'Feature Commitment', signal: 'feature' },
  { from: 'FEAT-07', to: 'K017', label: 'Promised To', signal: 'feature' },
  { from: 'I0290', to: 'C01', label: 'Account Related', signal: 'champion' },
  { from: 'I0290', to: 'K017', label: 'Sent By', signal: 'champion' },
  { from: 'K017', to: 'C01', label: 'ex-Head of Ops', signal: 'champion' },
  { from: 'K017', to: 'P01', label: 'New GM Ops', signal: 'champion' },
  { from: 'D-2025-11', to: 'P01', label: 'Discount Precedent', signal: 'feature' },
  { from: 'C01', to: 'K-C01', label: 'Holds Contract', signal: 'feature' }
];

const P04_NODES = [
  {
    id: 'E04',
    category: 'EMPLOYEE',
    code: 'EMPLOYEE - E04',
    title: 'Bagus Prakoso',
    subtitle: 'KasirNusa Sales Rep',
    type: 'crm',
    x: 24,
    y: 150,
    file: 'employees.csv:E04',
    quote: 'KasirNusa Sales Representative managing the Nirwana Hotel & Resto prospect (P04).',
    signal: 'champion',
    summary: 'Sales rep leading commercial outreach and mapping alumni link from Budi Santoso to CEO Hartono Gunawan.'
  },
  {
    id: 'K-C06',
    category: 'CONTRACT',
    code: 'CONTRACT - K-C06',
    title: 'Enterprise Package Contract',
    subtitle: 'Active Multi-Store C06 Contract',
    type: 'contract',
    x: 310,
    y: 20,
    file: 'contracts_billing.csv:K-C06',
    quote: 'Active legal agreement for Saiyo Group Enterprise package covering multi-outlet cloud POS.',
    signal: 'champion',
    summary: 'Active contract serving as formal proof of KasirNusa\'s enterprise partnership.'
  },
  {
    id: 'C06',
    category: 'ACCOUNT',
    code: 'ACCOUNT - C06',
    title: 'Saiyo Group (12 Restos)',
    subtitle: 'Loyal Customer (NPS Score 9)',
    type: 'crm',
    x: 310,
    y: 150,
    file: 'crm_accounts.csv:C06',
    quote: 'Loyal KasirNusa customer (12 modern Padang restaurant outlets). NPS score 9, satisfied with system stability.',
    signal: 'champion',
    summary: 'Existing client willing to serve as a public advocate and reference for KasirNusa.'
  },
  {
    id: 'D-2025-06',
    category: 'DECISION',
    code: 'DECISION - D-2025-06',
    title: 'Pilot Scheme Approval',
    subtitle: '6-Outlet Pilot Precedent',
    type: 'decision',
    x: 310,
    y: 410,
    file: 'decision_log.csv:D-2025-06',
    quote: '6-outlet pilot scheme approved with standard pricing upfront, transitioning to Enterprise upon achieving satisfaction targets.',
    signal: 'feature',
    summary: 'Commercial precedent overcoming initial hesitation for multi-brand hospitality clients.'
  },
  {
    id: 'I0300',
    category: 'INTERACTION',
    code: 'INTERACTION - I0300',
    title: 'Email: 10-Branch Expansion',
    subtitle: 'CFO NPS 9 Satisfaction Review',
    type: 'email',
    x: 610,
    y: 20,
    file: 'interactions.jsonl:I0300',
    quote: '[2026-08-19] Budi Santoso (CFO): "We are very satisfied with KasirNusa and plan to expand with 10 new branches next year."',
    signal: 'champion',
    summary: 'High-satisfaction customer evidence (NPS 9) available as case study collateral.'
  },
  {
    id: 'K116',
    category: 'CONTACT',
    code: 'CONTACT - K116',
    title: 'Budi Santoso (CFO Saiyo)',
    subtitle: 'ex-Finance Mgr Sentosa Abadi',
    type: 'crm',
    x: 610,
    y: 150,
    file: 'crm_contacts.csv:K116',
    quote: 'CFO of Saiyo Group. Former Finance Manager at PT Sentosa Abadi Group for 5 years (2015-2019).',
    signal: 'champion',
    summary: 'Former peer of Hartono Gunawan (CEO P04) for 5 years, acting as a highly credible peer-to-peer sponsor.'
  },
  {
    id: 'ORG-SENTOSA',
    category: 'ALUMNI / ORG',
    code: 'ORG - SENTOSA ABADI',
    title: 'PT Sentosa Abadi Group',
    subtitle: 'Shared 5-Year Workplace',
    type: 'crm',
    x: 610,
    y: 280,
    file: 'contact_employment_history.csv:L42',
    quote: 'Company where Budi Santoso (Finance Mgr) and Hartono Gunawan (General Mgr) worked at equal seniority (2015-2019).',
    signal: 'champion',
    summary: 'Evidence of 5-year shared workplace tenure forming the foundation for a warm intro.'
  },
  {
    id: 'I0284',
    category: 'INTERACTION',
    code: 'INTERACTION - I0284',
    title: 'Nirwana Discovery Notes',
    subtitle: 'Hotel Room Billing Integration',
    type: 'email',
    x: 610,
    y: 410,
    file: 'interactions.jsonl:I0284',
    quote: '[2026-08-10] Bagus Prakoso: "Nirwana requires restaurant POS integrated into hotel room billing."',
    signal: 'feature',
    summary: 'Specific technical requirement for Nirwana addressed by the PMS module.'
  },
  {
    id: 'FEAT-09',
    category: 'FEATURE',
    code: 'FEATURE - FEAT-09',
    title: 'Hotel PMS & Room Charge',
    subtitle: 'Turnkey Integration Module',
    type: 'feature',
    x: 900,
    y: 20,
    file: 'product_roadmap.json',
    quote: 'Seamless synchronization between dining bills and hotel guest room folios without complex custom development.',
    signal: 'feature',
    summary: 'Key technical differentiator for KasirNusa over generic retail POS competitors.'
  },
  {
    id: 'I0335',
    category: 'INTERACTION',
    code: 'INTERACTION - I0335',
    title: 'Email: Reference Request',
    subtitle: 'CEO Requests F&B Endorsement',
    type: 'email',
    x: 900,
    y: 150,
    file: 'interactions.jsonl:I0335',
    quote: '[2026-09-22] yuli.astuti@nirwanahotel.co.id: "Mr. Hartono requested a reference from a fellow F&B business owner currently using the system."',
    signal: 'champion',
    summary: 'Direct email reference request from the executive assistant to CEO Hartono Gunawan.'
  },
  {
    id: 'K028',
    category: 'CONTACT',
    code: 'CONTACT - K028',
    title: 'Hartono Gunawan (CEO)',
    subtitle: 'Nirwana CEO (ex-GM Sentosa)',
    type: 'crm',
    x: 900,
    y: 280,
    file: 'crm_contacts.csv:K028',
    quote: 'President Director of Nirwana Hotel & Resto. Final decision maker for POS procurement across 15 restaurants and 4 hotels.',
    signal: 'champion',
    summary: 'Final decision maker for P04 who explicitly requested a peer reference (I0335).'
  },
  {
    id: 'P04',
    category: 'ACCOUNT',
    code: 'ACCOUNT - P04',
    title: 'Nirwana Hotel & Resto',
    subtitle: 'Prospect 35 Outlets (Rp 147M)',
    type: 'crm',
    x: 900,
    y: 410,
    file: 'crm_accounts.csv:P04 & crm_deals.csv',
    quote: 'Priority 2 Target Prospect (35 outlets: 15 restaurants & 4 hotels, deal value Rp 147M). Stage: Negotiation.',
    signal: 'champion',
    summary: 'Hospitality prospect ready to close by presenting peer reference Budi Santoso.'
  }
];

const P04_EDGES = [
  { from: 'E04', to: 'C06', label: 'Manages Account', signal: 'champion' },
  { from: 'C06', to: 'K116', label: 'Saiyo CFO', signal: 'champion' },
  { from: 'K116', to: 'ORG-SENTOSA', label: '5-Yr Alumni', signal: 'champion' },
  { from: 'ORG-SENTOSA', to: 'K028', label: 'Peer Colleague', signal: 'champion' },
  { from: 'K028', to: 'P04', label: 'President Director', signal: 'champion' },
  { from: 'K116', to: 'I0300', label: 'Sent Review', signal: 'champion' },
  { from: 'I0300', to: 'C06', label: 'NPS 9 Proof', signal: 'champion' },
  { from: 'I0335', to: 'K028', label: 'CEO Request', signal: 'champion' },
  { from: 'I0335', to: 'K116', label: 'Matches Budi', signal: 'champion' },
  { from: 'E04', to: 'D-2025-06', label: 'Proposed Pilot', signal: 'feature' },
  { from: 'D-2025-06', to: 'P04', label: 'Pilot Precedent', signal: 'feature' },
  { from: 'C06', to: 'K-C06', label: 'Holds Contract', signal: 'champion' },
  { from: 'E04', to: 'I0284', label: 'Discovery Notes', signal: 'feature' },
  { from: 'I0284', to: 'P04', label: 'PMS Requirement', signal: 'feature' },
  { from: 'FEAT-09', to: 'I0284', label: 'Module Solution', signal: 'feature' }
];

const CATEGORY_STYLES = {
  crm: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200/70',
    dot: 'bg-blue-600',
    label: 'CRM'
  },
  email: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/70',
    dot: 'bg-purple-600',
    label: 'Email & Meeting'
  },
  contract: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200/70',
    dot: 'bg-teal-600',
    label: 'Legal Contract'
  },
  decision: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200/70',
    dot: 'bg-amber-600',
    label: 'Decision Log'
  },
  feature: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    dot: 'bg-emerald-600',
    label: 'Feature & Roadmap'
  }
};

function calculateConnectorPath(fromNode, toNode) {
  const cardW = 220;
  const cardH = 66;

  // Custom collision-free routing:
  // 1. D-2025-11 to P01 (dips below K017)
  if (fromNode.id === 'D-2025-11' && toNode.id === 'P01') {
    const sX = fromNode.x + 110;
    const sY = fromNode.y + cardH;
    const eX = toNode.x + 110;
    const eY = toNode.y + cardH;
    return {
      pathD: `M ${sX} ${sY} C ${sX} ${sY + 45}, ${eX} ${eY + 45}, ${eX} ${eY}`,
      midX: (sX + eX) / 2,
      midY: sY + 45
    };
  }

  // 2. D-2025-06 to P04 (dips below I0284)
  if (fromNode.id === 'D-2025-06' && toNode.id === 'P04') {
    const sX = fromNode.x + 110;
    const sY = fromNode.y + cardH;
    const eX = toNode.x + 110;
    const eY = toNode.y + cardH;
    return {
      pathD: `M ${sX} ${sY} C ${sX} ${sY + 45}, ${eX} ${eY + 45}, ${eX} ${eY}`,
      midX: (sX + eX) / 2,
      midY: sY + 45
    };
  }

  // 3. D-2025-11 to I0061 (curves left of FEAT-07)
  if (fromNode.id === 'D-2025-11' && toNode.id === 'I0061') {
    const sX = fromNode.x;
    const sY = fromNode.y + 33;
    const eX = toNode.x;
    const eY = toNode.y + 33;
    return {
      pathD: `M ${sX} ${sY} C ${sX - 45} ${sY}, ${eX - 45} ${eY}, ${eX} ${eY}`,
      midX: sX - 45,
      midY: (sY + eY) / 2
    };
  }

  // 4. I0300 to C06 (curves from left of I0300 to top of C06)
  if (fromNode.id === 'I0300' && toNode.id === 'C06') {
    const sX = fromNode.x;
    const sY = fromNode.y + 33;
    const eX = toNode.x + cardW;
    const eY = toNode.y + 33;
    return {
      pathD: `M ${sX} ${sY} C ${sX - 50} ${sY}, ${eX + 50} ${eY}, ${eX} ${eY}`,
      midX: (sX + eX) / 2,
      midY: (sY + eY) / 2 - 15
    };
  }

  // Same column: Vertical straight connection
  if (Math.abs(fromNode.x - toNode.x) < 30) {
    if (toNode.y > fromNode.y) {
      const sX = fromNode.x + 110;
      const sY = fromNode.y + cardH;
      const eX = toNode.x + 110;
      const eY = toNode.y;
      return {
        pathD: `M ${sX} ${sY} L ${eX} ${eY}`,
        midX: sX,
        midY: (sY + eY) / 2
      };
    } else {
      const sX = fromNode.x + 110;
      const sY = fromNode.y;
      const eX = toNode.x + 110;
      const eY = toNode.y + cardH;
      return {
        pathD: `M ${sX} ${sY} L ${eX} ${eY}`,
        midX: sX,
        midY: (sY + eY) / 2
      };
    }
  }

  // Standard horizontal or angled bezier curve
  const sX = fromNode.x + cardW;
  const sY = fromNode.y + 33;
  const eX = toNode.x;
  const eY = toNode.y + 33;
  const deltaX = Math.max(35, Math.abs(eX - sX) * 0.45);

  return {
    pathD: `M ${sX} ${sY} C ${sX + deltaX} ${sY}, ${eX - deltaX} ${eY}, ${eX} ${eY}`,
    midX: (sX + eX) / 2,
    midY: (sY + eY) / 2
  };
}

export default function EvidencePath() {
  const [selectedProspect, setSelectedProspect] = useState('P01');
  const [selectedSignal, setSelectedSignal] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = selectedProspect === 'P01' ? P01_NODES : P04_NODES;
  const edges = selectedProspect === 'P01' ? P01_EDGES : P04_EDGES;

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const isHighlighted = (node) => {
    if (selectedSignal === 'all') return true;
    return node.signal === selectedSignal;
  };

  const isEdgeHighlighted = (edge) => {
    if (selectedSignal === 'all') return true;
    return edge.signal === selectedSignal;
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/90 scroll-mt-24">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="pill-badge mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Data Evidence &amp; Timeline Graph</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Evidence Path &amp; Relational Records
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                12 deterministic relationship nodes from 10 source datasets (CRM, Email Interactions, Contracts, &amp; Decision Log).
              </p>
            </div>

            {/* Target Account Switcher (P01 vs P04) */}
            <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200/90 shadow-xs self-start md:self-auto">
              <button
                onClick={() => { setSelectedProspect('P01'); setSelectedNode(null); }}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProspect === 'P01'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                P01: Mandala (Rp 252M)
              </button>
              <button
                onClick={() => { setSelectedProspect('P04'); setSelectedNode(null); }}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProspect === 'P04'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                P04: Nirwana (Rp 147M)
              </button>
            </div>
          </div>

          {/* Filter Pills & Color Legend */}
          <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Signal Filter:</span>
              <button
                onClick={() => setSelectedSignal('all')}
                className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSignal === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Signals
              </button>
              <button
                onClick={() => setSelectedSignal('champion')}
                className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSignal === 'champion'
                    ? 'bg-purple-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Champion Transition
              </button>
              <button
                onClick={() => setSelectedSignal('feature')}
                className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSignal === 'feature'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Feature Commitments
              </button>
              <button
                onClick={() => setSelectedSignal('competitor')}
                className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSignal === 'competitor'
                    ? 'bg-orange-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Competitor Intel
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> CRM
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Email &amp; Meetings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Legal Contracts
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Decision Log
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Features &amp; Roadmap
              </span>
            </div>
          </div>
        </div>

        {/* Canvas Card - Auto Fit, Responsive, Zero Inner Scrollbars on Desktop */}
        <div className="relative w-full rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-x-auto overflow-y-hidden p-6 lg:p-8 flex justify-center">
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Sized Diagram Container - Fits seamlessly within standard desktop viewport */}
          <div className="relative w-[1140px] h-[490px] shrink-0">
            
            {/* SVG Edges Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
                </marker>
              </defs>

              {edges.map((edge, idx) => {
                const fromNode = nodeMap[edge.from];
                const toNode = nodeMap[edge.to];
                if (!fromNode || !toNode) return null;

                const { pathD, midX, midY } = calculateConnectorPath(fromNode, toNode);
                const edgeActive = isEdgeHighlighted(edge);

                return (
                  <g key={idx} className={`transition-opacity duration-300 ${edgeActive ? 'opacity-100' : 'opacity-15'}`}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={edgeActive ? '#94a3b8' : '#cbd5e1'}
                      strokeWidth="1.8"
                      markerEnd="url(#arrow-default)"
                    />
                    {/* Compact Non-Obstructive Relation Label */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-44"
                        y="-8.5"
                        width="88"
                        height="17"
                        rx="8.5"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="600"
                        fill="#475569"
                      >
                        {edge.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Node Cards Layer (220px x 66px, Clean, Never Cut Off) */}
            {nodes.map(node => {
              const cat = CATEGORY_STYLES[node.type] || CATEGORY_STYLES.crm;
              const nodeActive = isHighlighted(node);
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`absolute w-[220px] h-[66px] rounded-2xl bg-white border ${
                    isSelected 
                      ? 'border-blue-600 ring-3 ring-blue-500/25 shadow-lg scale-[1.02]' 
                      : 'border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md'
                  } px-3 py-2 cursor-pointer select-none transition-all duration-150 z-10 flex flex-col justify-between ${
                    nodeActive ? 'opacity-100' : 'opacity-25 grayscale-[30%]'
                  }`}
                >
                  {/* Port Indicators */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300"></div>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300"></div>

                  {/* Header: Code & Category Label */}
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] font-bold uppercase border ${cat.badge}`}>
                      {node.code}
                    </span>
                    <span className="flex items-center gap-1 text-[8.5px] font-bold text-slate-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></span>
                      <span>{cat.label}</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <div className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                      {node.title}
                    </div>
                    <div className="text-[9.5px] text-slate-500 font-medium leading-tight truncate mt-0.5">
                      {node.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Selected Node Record Inspector */}
        {selectedNode && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm animate-fadeIn">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-xs ${
                  selectedNode.type === 'crm' ? 'bg-blue-600' :
                  selectedNode.type === 'email' ? 'bg-purple-600' :
                  selectedNode.type === 'decision' ? 'bg-amber-600' :
                  selectedNode.type === 'feature' ? 'bg-emerald-600' : 'bg-teal-600'
                }`}>
                  {selectedNode.category.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">{selectedNode.code}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono border border-slate-200">
                      {selectedNode.file}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedNode.title}</h4>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="cursor-pointer text-slate-400 hover:text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Raw Evidence &amp; Record Quotes:
                </span>
                <p className="text-slate-800 font-mono text-[11px] leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedNode.quote}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1.5">
                  Sales Intelligence Significance:
                </span>
                <p className="text-slate-700 leading-relaxed font-sans text-xs">
                  {selectedNode.summary}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
