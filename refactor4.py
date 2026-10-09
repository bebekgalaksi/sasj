import re

with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

# 5. Kanban Board
kanban_regex = r"\{/\* Column 1: Lead / Discovery \*/\}.*?\{/\* Section 6: Custom Pathfinding Calculator \*/\}"
new_kanban = """{/* Column 1: Cold / Unmapped */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase">1. Cold / Unmapped</span>
            <span className="text-[10px] font-mono text-slate-400">{activeDeals.filter(d => d.score < 4.0).length} Accounts</span>
          </div>
          
          {activeDeals.filter(d => d.score < 4.0).map(deal => (
            <div key={deal.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect(deal.id)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{deal.id}: {deal.name}</span>
                <span className="text-[10px] font-bold text-slate-600">{formatIDR(deal.nilai_tahunan)}</span>
              </div>
              <p className="text-[11px] text-slate-500">{deal.outlets} Outlets • Stage: {deal.stage}</p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">Path: Unmapped ({deal.score}/10)</span>
            </div>
          ))}
        </div>

        {/* Column 2: Bridge Identified */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase">2. Bridge Identified</span>
            <span className="text-[10px] font-mono text-slate-400">{activeDeals.filter(d => d.score >= 4.0 && d.score < 7.0).length} Accounts</span>
          </div>

          {activeDeals.filter(d => d.score >= 4.0 && d.score < 7.0).map(deal => (
            <div key={deal.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect(deal.id)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{deal.id}: {deal.name}</span>
                <span className="text-[10px] font-bold text-slate-600">{formatIDR(deal.nilai_tahunan)}</span>
              </div>
              <p className="text-[11px] text-slate-500">{deal.outlets} Outlets • Stage: {deal.stage}</p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Partial Path ({deal.score}/10)</span>
            </div>
          ))}
        </div>

        {/* Column 3: Warm Path Ready */}
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-md space-y-3 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider">Ready to Engage</div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-900 uppercase">3. Warm Path Ready</span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">{activeDeals.filter(d => d.score >= 7.0 && d.stage !== 'Proposal').length} Accounts</span>
          </div>

          {activeDeals.filter(d => d.score >= 7.0 && d.stage !== 'Proposal').map(deal => (
            <div key={deal.id} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect(deal.id)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950">{deal.id}: {deal.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 font-mono">{formatIDR(deal.nilai_tahunan)}</span>
              </div>
              <p className="text-[11px] text-slate-600">{deal.outlets} Outlets • Stage: {deal.stage}</p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">🏆 Score: {deal.score}/10</span>
            </div>
          ))}
        </div>

        {/* Column 4: Decision Maker In-Flight */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-500 shadow-md space-y-3 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider">High Priority</div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-900 uppercase">4. DM In-Flight</span>
            <span className="text-[10px] font-mono text-blue-600 font-bold">{activeDeals.filter(d => d.score >= 7.0 && d.stage === 'Proposal').length} Accounts</span>
          </div>

          {activeDeals.filter(d => d.score >= 7.0 && d.stage === 'Proposal').map(deal => (
            <div key={deal.id} className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 cursor-pointer" onClick={() => window.jumpToProspect(deal.id)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-950">{deal.id}: {deal.name}</span>
                <span className="text-[10px] font-bold text-blue-700 font-mono">{formatIDR(deal.nilai_tahunan)}</span>
              </div>
              <p className="text-[11px] text-slate-600">{deal.outlets} Outlets • Stage: {deal.stage}</p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-bold">🚀 Score: {deal.score}/10 (Active)</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>

  {/* Section 6: Custom Pathfinding Calculator */}"""

content = re.sub(kanban_regex, new_kanban, content, flags=re.DOTALL)

with open("frontend/src/App.jsx", "w") as f:
    f.write(content)
print("Kanban Board replaced")
