import re

with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

# 4. Bento Features
bento_regex = r"\{/\* Card 1 \*/\}.*?\{/\* Section 4: Relationship Weights & Execution Flow \*/\}"
new_bento = """{/* Card 1 */}
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
          <h3 className="text-lg font-bold text-slate-900">Graph Traversal Beyond 1st-Degree</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Uncover hidden alumni connections, past executive tenures, and mutual client champions up to 3 hops away to bypass gatekeepers.
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
          <h3 className="text-lg font-bold text-slate-900">Zero-Cold Outreach Copilot</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Automatically draft tailored introduction messages citing verified mutual connection context with 1-click clipboard synchronization.
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
          <h3 className="text-lg font-bold text-slate-900">Budget Authority & Precedent Validation</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Verify contract signing authority and cross-reference KasirNusa's historical decision logs to pre-validate acceptable commercial terms.
          </p>
        </div>
      </div>

    </div>
  </section>

  {/* Section 4: Relationship Weights & Execution Flow */}"""
content = re.sub(bento_regex, new_bento, content, flags=re.DOTALL)

with open("frontend/src/App.jsx", "w") as f:
    f.write(content)
print("Bento Features replaced")
