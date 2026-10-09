import re

with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

# 1. Imports and State
old_import = """import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Add body classes"""

new_import = """import React, { useEffect, useState, useMemo } from 'react';

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
  
  const priorityDeals = useMemo(() => activeDeals.filter(d => d.score >= 8.0), [activeDeals]);
  const prioritySum = useMemo(() => priorityDeals.reduce((sum, d) => sum + d.nilai_tahunan, 0), [priorityDeals]);
  const priorityPct = totalPipeline ? Math.round((prioritySum / totalPipeline) * 100) : 0;
  const priorityIDs = priorityDeals.map(d => d.id);
  
  const mappedDeals = useMemo(() => activeDeals.filter(d => d.hops > 0), [activeDeals]);
  const avgHops = mappedDeals.length ? (mappedDeals.reduce((sum, d) => sum + d.hops, 0) / mappedDeals.length).toFixed(1) : "0.0";
  
  const maxScore = activeDeals.length ? Math.max(...activeDeals.map(d => d.score)).toFixed(1) : "0.0";
  const maxDealValue = activeDeals.length ? Math.max(...activeDeals.map(d => d.nilai_tahunan)) : 1;
  
  const includedSets = paramAnalysis?.included_datasets?.length || 0;
  const totalSets = (paramAnalysis?.included_datasets?.length || 0) + (paramAnalysis?.excluded_datasets?.length || 0);

  useEffect(() => {"""

content = content.replace(old_import, new_import)

# We will stop here and write to see if it works
with open("frontend/src/App.jsx", "w") as f:
    f.write(content)

print("Import replacement successful")

# 2. Hero Stat Cards
# Lines to replace: from "{/* 4 Stat Metric Cards */}" to the end of the div
import re
with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

hero_regex = r"\{/\* 4 Stat Metric Cards \*/\}.*?\{/\* Split View: Pipeline Bar Chart \+ Key Bridges \*/\}"
new_hero = """{/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-md shadow-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{activeDeals.length} Enterprise Prospects</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{formatIDR(totalPipeline)}</div>
              <div className="text-xs text-blue-100 mt-0.5">Total Open Pipeline</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">{priorityPct}% Pipeline in {priorityIDs.join(' + ')}</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">{formatIDR(prioritySum)}</div>
              <div className="text-xs text-slate-500 mt-0.5">Priority Target Concentration</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Verified Path</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">{avgHops} Hops</div>
              <div className="text-xs text-slate-500 mt-0.5">Average Distance to Budget Owners</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{includedSets} / {totalSets} Active Signals</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">{maxScore} / 10</div>
              <div className="text-xs text-slate-500 mt-0.5">Peak Warm Intro Readiness</div>
            </div>

          </div>

          {/* Split View: Pipeline Bar Chart + Key Bridges */}"""
content = re.sub(hero_regex, new_hero, content, flags=re.DOTALL)

with open("frontend/src/App.jsx", "w") as f:
    f.write(content)
print("Hero cards replaced")
