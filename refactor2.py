import re

with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

# 3. Main Visualization and Stepper
bar_chart_regex = r"\{/\* Left Chart Card \(P01 - P05 Pipeline\) \*/\}.*?\{/\* Problem Statement Section \*/\}"
new_bar_chart = """{/* Left Chart Card (P01 - P05 Pipeline) */}
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
                {activeDeals.map(deal => {
                  const isReady = deal.score >= 8.0;
                  const heightPct = Math.round((deal.nilai_tahunan / maxDealValue) * 100);
                  return (
                    <div key={deal.id} className={`flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative group ${isReady ? 'cursor-pointer' : ''}`} onClick={() => isReady && window.jumpToProspect(deal.id)}>
                      <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                        {deal.id} {deal.name}: {formatIDR(deal.nilai_tahunan)} • Warm Path Ready ({deal.score}/10)
                      </div>
                      <div className={`w-full rounded-t-lg transition-colors ${isReady ? 'bg-blue-600 shadow-md shadow-blue-500/25 group-hover:bg-blue-700 animate-pulse' : 'bg-slate-200'} `} style={{ height: `${heightPct}%` }}></div>
                      <span className={`text-[11px] font-bold ${isReady ? 'text-blue-600' : 'text-slate-600'}`}>{deal.id}</span>
                      <span className="text-[9px] text-slate-400 text-center">{isReady ? deal.name : 'Cold / Unmapped'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Bridge Connectors Card -> Dynamic Stepper */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                {(() => {
                  const selectedDeal = activeDeals.find(d => d.id === currentProspectId) || activeDeals[0] || {};
                  return (
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xs text-slate-900">{selectedDeal.id} - {selectedDeal.name}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        {formatIDR(selectedDeal.nilai_tahunan || 0)} • {selectedDeal.outlets || 0} Outlets
                      </span>
                    </div>
                  );
                })()}

                <div className="space-y-2.5">
                  {pathfinderData?.best_path?.path_labels?.length >= 3 ? (() => {
                      const labels = pathfinderData.best_path.path_labels;
                      const origin = labels[0];
                      const bridge = labels[1];
                      const target = labels[labels.length - 1];
                      const edges = pathfinderData.best_path.edges_explained || [];
                      const edge1 = edges[0] || {};
                      
                      return (
                          <>
                              {/* Node 1 */}
                              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">KN</div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800">{origin}</div>
                                    <div className="text-[10px] text-slate-400">Account Manager</div>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Origin</span>
                              </div>
                              {/* Node 2 */}
                              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold font-mono">BR</div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800">{bridge}</div>
                                    <div className="text-[10px] text-slate-400">{edge1.reason}</div>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Bridge ({edge1.weight}/10)</span>
                              </div>
                              {/* Node 3 */}
                              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold font-mono">DM</div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800">{target}</div>
                                    <div className="text-[10px] text-slate-400">Decision Maker</div>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">Target</span>
                              </div>
                          </>
                      );
                  })() : <div className="text-xs text-slate-500 py-4 text-center">Select a warm path to view connections</div>}

                  {pathfinderData?.alternative_path && (
                      <details className="text-[10px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 cursor-pointer">
                        <summary className="font-semibold text-amber-700 outline-none">[+ View Avoided Bottleneck: {pathfinderData.alternative_path.path_labels[1]} (Stagnant / No Budget Authority)]</summary>
                        <p className="mt-1">{pathfinderData.alternative_path.bottleneck_reason}</p>
                      </details>
                  )}
                </div>
              </div>

              {pathfinderData?.best_path?.draft_email ? (
                  <button onClick={() => { navigator.clipboard.writeText(pathfinderData.best_path.draft_email.body); if (window.showToast) window.showToast('Draft copied to clipboard.'); }} className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center">
                    <span>Generate Warm Intro Email via {pathfinderData.best_path.path_labels[1].split(' ')[0]} ➔</span>
                  </button>
              ) : (
                  <a href="#pathfinder" className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center">
                    <span>View Paths & Generate Email ➔</span>
                  </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  </section>

  {/* Problem Statement Section */}"""

content = re.sub(bar_chart_regex, new_bar_chart, content, flags=re.DOTALL)

with open("frontend/src/App.jsx", "w") as f:
    f.write(content)
print("Bar chart replaced")
