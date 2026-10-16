'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { GitBranch, CheckCircle2, GitCompare, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
export function VersionControlTab() {
    const { selectedModel, setActiveVersion, models, selectModel } = useGovernance();
    const [comparingVersions, setComparingVersions] = useState(null);
    const handleActivateVersion = (versionId) => {
        setActiveVersion(selectedModel.id, versionId);
        try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        catch {
            // ignore
        }
    };
    const handleOpenCompare = () => {
        if (selectedModel.versions.length >= 2) {
            setComparingVersions({
                v1: selectedModel.versions[0],
                v2: selectedModel.versions[selectedModel.versions.length - 1],
            });
        }
    };
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 2
              </span>
              <span className="text-xs text-stone-500 font-medium">Model: {selectedModel.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <GitBranch className="w-6 h-6 text-orange-600"/>
              <span>Version Control</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Tracks the sequential version history of models, release notes, validation accuracy, and identifies which version is currently active in live deployment.
            </p>
          </div>

          {/* Currently Active Version Badge */}
          <div className="p-3.5 bg-[#FAF7F2] border border-stone-200 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
              <CheckCircle2 className="w-6 h-6"/>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Currently Active Version</div>
              <div className="text-base font-black text-emerald-800 font-mono">{selectedModel.activeVersion}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600"/>
          <span className="text-stone-700 font-bold">Inspecting Model:</span>
          <select value={selectedModel.id} onChange={e => selectModel(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-stone-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
            {models.map(m => (<option key={m.id} value={m.id}>{m.name} (Active: {m.activeVersion})</option>))}
          </select>
        </div>

        {selectedModel.versions.length >= 2 && (<button onClick={handleOpenCompare} className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl flex items-center gap-1.5 font-bold transition shadow-xs">
            <GitCompare className="w-4 h-4 text-orange-600"/>
            <span>Quick Compare Diff</span>
          </button>)}
      </div>

      {/* Version History List */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
          Version History &amp; Release Lineage
        </h2>

        <div className="space-y-3">
          {selectedModel.versions.map((ver) => {
            const isActive = ver.isActive || ver.version === selectedModel.activeVersion;
            return (<div key={ver.id} className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-xs ${isActive
                    ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10'
                    : 'bg-white border-stone-200 hover:border-stone-300'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-black text-stone-900">{ver.version}</span>
                    {isActive ? (<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        <span>ACTIVE IN PRODUCTION</span>
                      </span>) : (<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                        Historical Version
                      </span>)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-600">
                    <span>Release Date: <strong className="text-stone-900">{ver.releaseDate}</strong></span>
                    <span className="text-stone-300">&bull;</span>
                    <span>Author: <strong className="text-stone-900">{ver.author}</strong></span>
                  </div>
                </div>

                <div className="py-3 text-xs space-y-2.5">
                  <p className="text-stone-700 leading-relaxed">
                    <strong className="text-stone-900 font-bold">Release Summary: </strong>
                    {ver.changesSummary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                      <div className="text-[10px] text-stone-500 font-bold uppercase">Accuracy</div>
                      <div className="text-sm font-black text-emerald-700">{ver.accuracy}%</div>
                    </div>
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                      <div className="text-[10px] text-stone-500 font-bold uppercase">F1 Score</div>
                      <div className="text-sm font-black text-stone-900">{ver.f1Score}</div>
                    </div>
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                      <div className="text-[10px] text-stone-500 font-bold uppercase">Latency</div>
                      <div className="text-sm font-black text-orange-700">{ver.latencyMs} ms</div>
                    </div>
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200 truncate" title={ver.datasetName}>
                      <div className="text-[10px] text-stone-500 font-bold uppercase">Dataset</div>
                      <div className="text-xs font-bold text-stone-800 truncate">{ver.datasetName}</div>
                    </div>
                  </div>
                </div>

                {/* Footer Action: Set as Active */}
                <div className="pt-2 border-t border-stone-100 flex justify-end">
                  {isActive ? (<div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4"/>
                      <span>Currently Serving Live Traffic</span>
                    </div>) : (<button onClick={() => handleActivateVersion(ver.id)} className="px-4 py-2 bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600 group-hover:text-white"/>
                      <span>Promote to Active Version</span>
                    </button>)}
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* Version Comparison Diff Modal */}
      {comparingVersions && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-orange-600"/>
                <h3 className="text-base font-black text-stone-900">Side-by-Side Version Comparison</h3>
              </div>
              <button onClick={() => setComparingVersions(null)} className="text-stone-400 hover:text-stone-900 p-1">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center font-bold text-stone-600 pb-2 border-b border-stone-200 text-xs">
              <div className="text-left text-stone-500 font-bold">Metric / Attribute</div>
              <div className="text-stone-800 font-mono">{comparingVersions.v1.version}</div>
              <div className="text-orange-700 font-mono">{comparingVersions.v2.version} (Latest)</div>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-3 gap-4 items-center p-3 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <div className="font-bold text-stone-900">Accuracy</div>
                <div className="text-center font-mono text-stone-800">{comparingVersions.v1.accuracy}%</div>
                <div className="text-center font-mono text-emerald-700 font-black">
                  {comparingVersions.v2.accuracy}% (+{(comparingVersions.v2.accuracy - comparingVersions.v1.accuracy).toFixed(1)}%)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center p-3 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <div className="font-bold text-stone-900">Inference Latency</div>
                <div className="text-center font-mono text-stone-800">{comparingVersions.v1.latencyMs} ms</div>
                <div className="text-center font-mono text-emerald-700 font-black">
                  {comparingVersions.v2.latencyMs} ms (Faster)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center p-3 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <div className="font-bold text-stone-900">Training Dataset</div>
                <div className="text-center truncate text-[11px] text-stone-600">{comparingVersions.v1.datasetName}</div>
                <div className="text-center truncate text-[11px] text-orange-800 font-bold">{comparingVersions.v2.datasetName}</div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button onClick={() => setComparingVersions(null)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-xs">
                Close Comparison
              </button>
            </div>
          </div>
        </div>)}

    </div>);
}
