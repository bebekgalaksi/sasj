import React, { useEffect, useState, useMemo } from 'react';

export default function App() {
  const [deals, setDeals] = useState([]);
  const [paramAnalysis, setParamAnalysis] = useState(null);
  const [currentProspectId, setCurrentProspectId] = useState('P01');
  const [pathfinderData, setPathfinderData] = useState(null);

  useEffect(() => {
    // Add body classes
    document.body.className = "font-sans antialiased text-slate-900 bg-white";
    
    window.jumpToReactProspect = (id) => {
        setCurrentProspectId(id);
        if (window.loadPathFinder) window.loadPathFinder(id);
    };
    window.jumpToProspect = window.jumpToReactProspect;

    const fetchData = async () => {
      try {
        const [dealsRes, paramRes] = await Promise.all([
          fetch('/api/deals').catch(() => null),
          fetch('/api/parameter-analysis').catch(() => null)
        ]);
        if (dealsRes && dealsRes.ok) setDeals(await dealsRes.json());
        if (paramRes && paramRes.ok) setParamAnalysis(await paramRes.json());
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await fetch(`/api/pathfinder?prospect_id=${currentProspectId}`);
        if (res.ok) setPathfinderData(await res.json());
      } catch (err) {}
    };
    fetchPath();
  }, [currentProspectId]);

  const activeDeals = useMemo(() => deals.filter(d => d.stage !== 'Closed Lost' && d.stage !== 'Closed Won'), [deals]);
  const totalPipeline = useMemo(() => activeDeals.reduce((sum, d) => sum + d.nilai_tahunan, 0), [activeDeals]);
  const formatIDR = (val) => "Rp " + (val / 1e6).toFixed(1) + "M";
  
  const priorityDeals = useMemo(() => activeDeals.filter(d => ['P01', 'P04'].includes(d.id)), [activeDeals]);
  const prioritySum = useMemo(() => priorityDeals.reduce((sum, d) => sum + d.nilai_tahunan, 0), [priorityDeals]);
  const priorityPct = totalPipeline ? ((prioritySum / totalPipeline) * 100).toFixed(1) : 0;
  const priorityIDs = priorityDeals.map(d => d.id);
  
  const totalOutlets = useMemo(() => activeDeals.reduce((sum, d) => sum + d.outlets, 0), [activeDeals]);
  const priorityOutlets = useMemo(() => priorityDeals.reduce((sum, d) => sum + d.outlets, 0), [priorityDeals]);
  const quotaPct = ((priorityOutlets / 150) * 100).toFixed(1);
  const expansionPct = ((totalOutlets / 620) * 100).toFixed(1);
  
  const mappedDeals = useMemo(() => activeDeals.filter(d => d.hops > 0), [activeDeals]);
  const avgHops = mappedDeals.length ? (mappedDeals.reduce((sum, d) => sum + d.hops, 0) / mappedDeals.length).toFixed(1) : "0.0";
  
  const maxScore = activeDeals.length ? Math.max(...activeDeals.map(d => d.score)).toFixed(1) : "0.0";
  const maxDealValue = activeDeals.length ? Math.max(...activeDeals.map(d => d.nilai_tahunan)) : 1;
  
  const includedSets = paramAnalysis?.included_datasets?.length || 0;
  const totalSets = (paramAnalysis?.included_datasets?.length || 0) + (paramAnalysis?.excluded_datasets?.length || 0);

  useEffect(() => {
    document.body.className = "font-sans antialiased text-slate-900 bg-white";
    
    // Initialize apps logic
    if (window.loadPathFinder) window.loadPathFinder('P01');
    if (window.loadEntitiesAndInitCalculator) window.loadEntitiesAndInitCalculator();
    if (window.loadParameterAnalysis) window.loadParameterAnalysis();
    if (window.initDynamicVisGraph) window.initDynamicVisGraph();
  }, []);

  return (
    <>


  {/* Toast Notification */}
  <div id="toast" className="fixed top-5 right-5 z-50 transform -translate-y-16 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700">
    <div id="toast-indicator" className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></div>
    <span id="toast-text" className="text-xs font-medium font-sans">Draft copied to clipboard.</span>
  </div>

  {/* Header Navigation */}
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.001 15.085A1.5 1.5 0 0 1 9 16.5" />
            <circle cx="18.5" cy="8.5" r="3.5" />
            <circle cx="7.5" cy="16.5" r="5.5" />
            <circle cx="7.5" cy="4.5" r="2.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-slate-900">DEALGRAPH<span className="text-blue-600">.</span></span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Find the people who matter</span>
        </div>
      </a>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#pathfinder" className="hover:text-blue-600 transition-colors">Path Console</a>
        <a href="#graph-view" className="hover:text-blue-600 transition-colors">Network Graph</a>
        <a href="#features" className="hover:text-blue-600 transition-colors">Core Workflow</a>
        <a href="#pipeline-matrix" className="hover:text-blue-600 transition-colors">Pipeline Matrix</a>
        <a href="#calculator" className="hover:text-blue-600 transition-colors">Path Calculator</a>
        {/* <a href="#parameter-analysis" className="hover:text-blue-600 transition-colors">Data Logic</a> */}
      </nav>

      {/* Status Indicator */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
        </span>
      </div>
    </div>
  </header>

  {/* Hero Section */}
  <section className="relative pt-12 pb-24 overflow-hidden">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="inline-block mb-4">
        <div className="pill-badge uppercase tracking-widest text-[10px]">
          Relationship Path Finder • PT KASIRNUSA TEKNOLOGI
        </div>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
        Know Who to Reach <br />
        <span className="text-blue-600">Know How to Reach Them</span>
      </h1>
      
      <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
        Find the people who matter and understand how to reach them by connecting the relationships hidden across your business data.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#pathfinder" className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-center">
          Open Path Console
        </a>
        <a href="#graph-view" className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-center">
          Explore Relationship Graph
        </a>
      </div>
    </div>

    {/* Floating Dashboard Card */}
    <div className="relative mt-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[95%] h-[340px] sm:h-[460px] bg-gradient-to-t from-blue-600 via-blue-600/70 to-transparent rounded-[50px] sm:rounded-[70px] blur-xl opacity-90 -z-10 pointer-events-none"></div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            </div>
            <span className="text-xs font-semibold text-slate-700 ml-2 font-mono">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">October 2025-September 2026</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold font-mono">
              KN
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-slate-50/30">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Hi! PT KasirNusa Teknologi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here's what's happening across your CS & Sales context</p>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            
            <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-md shadow-blue-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/20 text-white truncate ml-2">
                  {activeDeals.length} Prospects ({totalOutlets} Outlets)
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{formatIDR(totalPipeline)}</div>
                <div className="text-xs text-blue-100 mt-1">Total Pipeline at Stake</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 truncate ml-2">
                  {priorityPct}% Converted
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{formatIDR(prioritySum)}</div>
                <div className="text-xs text-slate-500 mt-1">Unlocked Pipeline</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 truncate ml-2">
                  Strategic Target
                </span>
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-900">{priorityOutlets}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-tight">Outlets Target Coverage</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-purple-50 text-purple-700 truncate ml-2">
                  Expansion 
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">+{expansionPct}%</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-tight">{totalOutlets} New Outlets Injection on 620 Base</div>
              </div>
            </div>

          </div>

          {/* Split View: Pipeline Bar Chart + Key Bridges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Chart Card (P01 - P05 Pipeline) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pipeline Value vs Warm Intro Readiness</h4>
                  <p className="text-[11px] text-slate-400">Click highlighted blue bars to compute the shortest connection path</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Warm Path Ready</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Cold / Unmapped</span>
                </div>
              </div>

              {/* Bar Visualization */}
              <div className="h-48 w-full flex items-end justify-between gap-4 pt-8 px-4">
                
                {/* P01 Bar */}
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group cursor-pointer" onClick={() => window.jumpToProspect('P01')}>
                  <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    P01: Rp 252M (60 Outlets) • Score 8.8
                  </div>
                  <div className="w-full bg-blue-600 rounded-t-lg h-[95%] shadow-md shadow-blue-500/25 group-hover:bg-blue-700 transition-colors"></div>
                  <span className="text-[11px] font-bold text-blue-600">P01</span>
                  <span className="text-[9px] text-slate-400">Mandala</span>
                </div>

                {/* P02 Bar */}
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group">
                  <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    P02: Rp 63M (15 Outlets) • Demo
                  </div>
                  <div className="w-full bg-slate-200 rounded-t-lg h-[24%]"></div>
                  <span className="text-[11px] font-semibold text-slate-600">P02</span>
                  <span className="text-[9px] text-slate-400">Teras Kafe</span>
                </div>

                {/* P03 Bar */}
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group">
                  <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    P03: Rp 38M (9 Outlets) • Discovery
                  </div>
                  <div className="w-full bg-slate-200 rounded-t-lg h-[15%]"></div>
                  <span className="text-[11px] font-semibold text-slate-600">P03</span>
                  <span className="text-[9px] text-slate-400">Pratama</span>
                </div>

                {/* P04 Bar */}
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group cursor-pointer" onClick={() => window.jumpToProspect('P04')}>
                  <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    P04: Rp 147M (35 Outlets) • Score 8.2
                  </div>
                  <div className="w-full bg-blue-600 rounded-t-lg h-[58%] shadow-md shadow-blue-500/25 group-hover:bg-blue-700 transition-colors"></div>
                  <span className="text-[11px] font-bold text-blue-600">P04</span>
                  <span className="text-[9px] text-slate-400">Nirwana</span>
                </div>

                {/* P05 Bar */}
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group">
                  <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    P05: Rp 168M (40 Units) • Lead
                  </div>
                  <div className="w-full bg-slate-200 rounded-t-lg h-[65%]"></div>
                  <span className="text-[11px] font-semibold text-slate-600">P05</span>
                  <span className="text-[9px] text-slate-400">Sumber Rejeki</span>
                </div>

              </div>
            </div>

            {/* Right Bridge Connectors Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-slate-900">Key Bridge Connectors</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">High Trust</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold font-mono">RH</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Rina Hapsari (C01 Kopi Nusantara)</div>
                        <div className="text-[10px] text-slate-400">ITB Alumni • Connects to Budi Santoso</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Weight: 9/10</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">SP</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Sari Puspita (AM KasirNusa)</div>
                        <div className="text-[10px] text-slate-400">Dedicated Account Manager for F&amp;B retail</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Weight: 9/10</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold font-mono">AW</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Andi Wiratama (VP Sales)</div>
                        <div className="text-[10px] text-slate-400">Holds enterprise discount precedent</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Precedent Log</span>
                  </div>
                </div>
              </div>

              <a href="#pathfinder" className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center">
                <span>View Paths &amp; Generate Email</span>
                <span>➔</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  </section>

  {/* Problem Statement Section */}
  <section className="py-20 bg-slate-50 border-y border-slate-100">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="pill-badge mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        <span>The Problem with Cold Outreach</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Reaching the Right Person<br />
        Isn't Always Easy
      </h2>

      <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
        Sales teams can find plenty of contacts at a target company, but figuring out who makes the decisions and how to reach them is a different story.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✕</span>
          <span>Cold emails often go unanswered.</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✕</span>
          <span>The person replying may not be the one making the decision.</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✕</span>
          <span>Useful connections are scattered across contacts and past conversations.</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✕</span>
          <span>Sales teams may overlook existing customers who could introduce them to new prospects.</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✕</span>
          <span>Deals can stall when the team spends time talking to the wrong people.</span>
        </div>
      </div>
    </div>
  </section>

  {/* Section 1: Interactive Path Finder Console */}
  <section id="pathfinder" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
      <div>
        <div className="pill-badge mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Path Finder Console</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Path Finder Console</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Select an enterprise target account to calculate the shortest connection path and generate contextual intro emails.</p>
      </div>

      {/* Account Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
        <button id="btn-p01" onClick={() => window.loadPathFinder('P01')} className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-md">
          P01: Mandala Retail Group (Rp 252M)
        </button>
        <button id="btn-p04" onClick={() => window.loadPathFinder('P04')} className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-blue-600">
          P04: Nirwana Hotel &amp; Resorts (Rp 147M)
        </button>
      </div>
    </div>

    {/* Results Injected by app.js */}
    <div id="pathfinder-results" className="w-full">
      <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-medium">Computing shortest and highest-weight path via Python REST API...</p>
      </div>
    </div>
  </section>

  {/* Section 2: Deep Blue Interactive Graph Canvas */}
  <section id="graph-view" className="py-20 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-900 text-white relative overflow-hidden scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-ping"></span>
          <span>Interactive Graph Canvas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Enterprise Relationship Graph</h2>
        <p className="mt-2 text-sm text-blue-100">
          Interactive map of KasirNusa internal reps, active client champions, alumni networks, and target decision makers.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button onClick={() => window.resetGraphView()} className="cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-blue-700 shadow-md hover:bg-blue-50 transition-all">
            ↺ Re-center Canvas
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-3xl bg-slate-900/90 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-md">
        
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-blue-200">
            NETWORK STATUS: <span className="text-emerald-400 font-bold">ONLINE</span> • ALGORITHM: <span className="text-white font-bold">Dijkstra Shortest Path</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> KasirNusa</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Decision Maker</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Prospect</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Alumni / Ex-Org</span>
        </div>

        <div id="vis-container"></div>
      </div>

    </div>
  </section>

  {/* Section 3: Core Workflow Pillars */}
  <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="pill-badge mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        <span>Core Workflow</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Three Pillars of Engine
      </h2>
      <p className="mt-3 text-sm sm:text-base text-slate-500">
        Turn scattered professional connections into warm, qualified pipeline meetings.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Card 1 */}
      <div className="bg-slate-50/70 p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between hover:shadow-card-hover transition-all">
        <div className="h-48 w-full bg-white rounded-2xl border border-slate-200/70 flex items-center justify-center relative overflow-hidden p-6 mb-6">
          <div className="w-24 h-20 bg-blue-500/10 rounded-2xl border-2 border-blue-500 flex items-center justify-center relative">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              ✓
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Multi-Hop Traversal</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Move past 1st-degree connections by cross-referencing university alumni directories, past companies, and active client relationships.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-slate-50/70 p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between hover:shadow-card-hover transition-all">
        <div className="h-48 w-full bg-white rounded-2xl border border-slate-200/70 p-4 mb-6 flex flex-col justify-center space-y-2.5">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
            <span className="font-bold text-slate-700">Opening Hook</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">Alumni Mention</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
            <span className="font-bold text-purple-900">Value Proposition</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-purple-600 text-white font-semibold">Relevant Pain Point</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs flex items-center justify-between">
            <span className="font-bold text-emerald-800">Call to Action</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold">15m Intro Call</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contextual Intro Drafter</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Generate personalized outreach emails referencing mutual connections naturally without sounding like a generic automated template.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-slate-50/70 p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between hover:shadow-card-hover transition-all">
        <div className="h-48 w-full bg-white rounded-2xl border border-slate-200/70 p-5 mb-6 flex flex-col justify-center space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Decision Maker Accuracy</span>
              <span className="text-emerald-600">96%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[96%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Path Computation Latency</span>
              <span className="text-blue-600">&lt; 150ms</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-[88%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Support Ticket Noise Filtered</span>
              <span className="text-purple-600">100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full w-[100%]"></div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Decision Authority Mapping</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Identify true budget owners and check management precedent logs for historical enterprise discount approvals.
          </p>
        </div>
      </div>

    </div>
  </section>

  {/* Section 4: Relationship Weights & Execution Flow */}
  <section className="py-20 border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      
      {/* Row 1: How Weights are Scored */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="pill-badge mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>Graph Scoring Logic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Connection Weights Are Calculated
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Each connection edge is weighted from 1 to 10 using four objective sales criteria:
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold text-xs">01</div>
              <h4 className="text-sm font-bold text-slate-900">Alumni Ties</h4>
              <p className="text-xs text-slate-500 mt-1">Graduating from the same university within close years scores up to 9/10.</p>
            </div>

            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold text-xs">02</div>
              <h4 className="text-sm font-bold text-slate-900">Client Advocacy</h4>
              <p className="text-xs text-slate-500 mt-1">High-NPS customer champions serve as the most trusted referral bridges.</p>
            </div>

            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold text-xs">03</div>
              <h4 className="text-sm font-bold text-slate-900">Recent Touchpoints</h4>
              <p className="text-xs text-slate-500 mt-1">Contacts engaged within the past 90 days take precedence over stale connections.</p>
            </div>

            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold text-xs">04</div>
              <h4 className="text-sm font-bold text-slate-900">Budget Sign-off Power</h4>
              <p className="text-xs text-slate-500 mt-1">Prioritize budget holders over technical reviewers who lack signing authority.</p>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-tr from-blue-600 to-blue-400 p-8 rounded-3xl shadow-xl">
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Verified Bridge Profiles</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600">3 Ready to Contact</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Rina Hapsari ➔ Budi Santoso</div>
                <div className="text-[10px] text-slate-400">ITB Alumni (Industrial Eng 2016) • Warm connection</div>
              </div>
              <span className="text-xs font-bold font-mono text-blue-600">9.0/10</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Sari Puspita ➔ Rina Hapsari</div>
                <div className="text-[10px] text-slate-400">AM KasirNusa to C01 Champion (NPS: 8)</div>
              </div>
              <span className="text-xs font-bold font-mono text-blue-600">8.8/10</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Andi Wiratama ➔ Hendra Wijaya</div>
                <div className="text-[10px] text-slate-400">Hotel Association Committee Member</div>
              </div>
              <span className="text-xs font-bold font-mono text-blue-600">8.2/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Execution Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 relative bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-xl">
          <div className="space-y-4 max-w-sm mx-auto">
            
            <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-blue-600">
              <div className="text-xs font-bold text-blue-600 mb-0.5">▶ Step 1: Select Target Account</div>
              <div className="text-xs font-semibold text-slate-900">Mandala Retail Group (P01) — 60 Outlets</div>
              <div className="text-[10px] text-slate-400">Deal stage: Proposal (Rp 252M / yr)</div>
            </div>

            <div className="w-0.5 h-4 bg-white/60 mx-auto"></div>

            <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-purple-600">
              <div className="text-xs font-bold text-purple-600 mb-0.5">⚡ Step 2: Dijkstra Weighted Traversal</div>
              <div className="text-xs font-semibold text-slate-900">Detect Strongest Bridge Connection</div>
              <div className="text-[10px] text-slate-400">Bypass unresponsive IT manager ➔ Trace alumni link to Budi Santoso</div>
            </div>

            <div className="w-0.5 h-4 bg-white/60 mx-auto"></div>

            <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-emerald-600">
              <div className="text-xs font-bold text-emerald-600 mb-0.5">⚐ Step 3: Contextual Intro Outreach</div>
              <div className="text-xs font-semibold text-slate-900">Personalized Email Ready to Send</div>
              <div className="text-[10px] text-slate-400">Mentions Rina Hapsari and verified POS multi-outlet rollouts</div>
            </div>

          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="pill-badge mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>Automated Resolution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Target Account <br />to First Sales Meeting
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            The engine evaluates dozens of potential relational edges in milliseconds, isolating the highest-weight path and drafting a relevant intro.
          </p>

          <ul className="mt-6 space-y-3.5 text-xs font-medium text-slate-700">
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</div>
              <span>Identify true decision makers without guessing company org charts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</div>
              <span>Bypass communication bottlenecks with non-budget-holding staff.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</div>
              <span>Produce tailored outreach drafts with conversational context.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>

  {/* Section 5: Pipeline & Readiness Matrix */}
  <section id="pipeline-matrix" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="pill-badge mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Pipeline Readiness</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pipeline Status by Intro Readiness
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Prioritize accounts with warm connection paths to accelerate sales velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Column 1: Lead / Discovery */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase">1. Lead / Discovery</span>
            <span className="text-[10px] font-mono text-slate-400">2 Accounts</span>
          </div>
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">P05: Sumber Rejeki Logistics</span>
              <span className="text-[10px] font-bold text-slate-600">Rp 168M</span>
            </div>
            <p className="text-[11px] text-slate-500">40 Units • Stage: Lead</p>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">Path: Unmapped</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">P03: Pratama Clinic</span>
              <span className="text-[10px] font-bold text-slate-600">Rp 38M</span>
            </div>
            <p className="text-[11px] text-slate-500">9 Outlets • Stage: Discovery</p>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Path: Exploration Needed</span>
          </div>
        </div>

        {/* Column 2: Demo & Evaluation */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase">2. Demo &amp; Evaluation</span>
            <span className="text-[10px] font-mono text-slate-400">1 Account</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">P02: Teras Kafe Group</span>
              <span className="text-[10px] font-bold text-slate-600">Rp 63M</span>
            </div>
            <p className="text-[11px] text-slate-500">15 Outlets • Stage: Demo</p>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Path: Weak / Partial</span>
          </div>
        </div>

        {/* Column 3: Proposal Stage (P01) */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-500 shadow-md space-y-3 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider">Priority 1</div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-900 uppercase">3. Proposal Stage</span>
            <span className="text-[10px] font-mono text-blue-600 font-bold">Golden Path</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect('P01')}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-950">P01: Mandala Retail Group</span>
              <span className="text-[10px] font-bold text-blue-700 font-mono">Rp 252M</span>
            </div>
            <p className="text-[11px] text-slate-600">60 Outlets • DM: Budi Santoso</p>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">🏆 Score: 8.8/10 (Ready)</span>
          </div>
        </div>

        {/* Column 4: Negotiation (P04) */}
        <div className="bg-white p-5 rounded-3xl border-2 border-purple-500 shadow-md space-y-3 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[9px] uppercase tracking-wider">Priority 2</div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-purple-900 uppercase">4. Negotiation Stage</span>
            <span className="text-[10px] font-mono text-purple-600 font-bold">Golden Path</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect('P04')}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-950">P04: Nirwana Hotel &amp; Resorts</span>
              <span className="text-[10px] font-bold text-purple-700 font-mono">Rp 147M</span>
            </div>
            <p className="text-[11px] text-slate-600">35 Outlets • DM: Hendra Wijaya</p>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">🏆 Score: 8.2/10 (Ready)</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  {/* Section 6: Custom Pathfinding Calculator */}
  <section id="calculator" className="py-20 bg-white border-t border-slate-100 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="pill-badge mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Simulation Mode</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Custom Path Calculator
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Simulate connection paths between any entities and review the mathematical weight breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">1. Query Mode</label>
            <select id="calc-mode" onChange={() => window.onCalcModeChange()} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="company_to_company">Company ➔ Company</option>
              <option value="people_to_company">Person ➔ Company</option>
              <option value="company_to_people">Company ➔ Person</option>
            </select>
          </div>

          <div>
            <label id="lbl-calc-source" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">2. Source Entity:</label>
            <select id="calc-source" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </select>
          </div>

          <div>
            <label id="lbl-calc-target" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">3. Target Entity:</label>
            <select id="calc-target" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </select>
          </div>

          <button onClick={() => window.runCalculatorQuery()} className="cursor-pointer w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2">
            <span>Calculate Path &amp; Edge Weights</span>
            <span className="text-sm">➔</span>
          </button>
        </div>

        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm min-h-[360px]" id="calculator-output-card">
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs font-medium">Select source and target entities on the left to review the path breakdown.</p>
          </div>
        </div>

      </div>

    </div>
  </section>

  {/* Section 7: Parameter & Data Governance
  <section id="parameter-analysis" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="pill-badge mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Data Governance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Parameter &amp; Dataset Governance
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Rationale behind dataset selection and the complete exclusion of support ticket noise to maintain clean scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="parameter-details-container">
      </div>
    </div>
  </section> */}

  {/* Footer */}
  <footer className="border-t border-slate-100 bg-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold font-mono">
          KN
        </div>
        <span className="font-bold text-sm text-slate-900">PT KasirNusa Teknologi // Team 3 Sales Intelligence</span>
      </div>

      <div className="text-xs text-slate-400 text-center sm:text-right">
        Warm Intro Path Finder Engine • 2026
      </div>
    </div>
  </footer>

    </>
  );
}
