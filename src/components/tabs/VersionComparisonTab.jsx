'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { GitCompare, Layers, Sparkles, CheckCircle2, TrendingUp, TrendingDown, Minus, ArrowLeftRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';
export function VersionComparisonTab() {
    const { models, selectedModel, selectModel, setActiveVersion } = useGovernance();
    const [versionAId, setVersionAId] = useState(selectedModel.versions.length > 1 ? selectedModel.versions[0].id : selectedModel.versions[0]?.id || '');
    const [versionBId, setVersionBId] = useState(selectedModel.versions.length > 1 ? selectedModel.versions[selectedModel.versions.length - 1].id : selectedModel.versions[0]?.id || '');
    // Sync if selectedModel changes
    const vA = selectedModel.versions.find(v => v.id === versionAId) || selectedModel.versions[0];
    const vB = selectedModel.versions.find(v => v.id === versionBId) || selectedModel.versions[selectedModel.versions.length - 1];
    const handleSwap = () => {
        const temp = versionAId;
        setVersionAId(versionBId);
        setVersionBId(temp);
    };
    const handlePromote = (versionId) => {
        setActiveVersion(selectedModel.id, versionId);
        try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }
        catch {
            // ignore
        }
    };
    if (!vA || !vB) {
        return (<div className="p-8 text-center text-stone-600 bg-white border border-stone-200 rounded-2xl">
        No versions available for comparison.
      </div>);
    }
    // Calculate deltas (vB compared to vA)
    const accDelta = Number((vB.accuracy - vA.accuracy).toFixed(2));
    const precDelta = Number((vB.precision - vA.precision).toFixed(3));
    const recDelta = Number((vB.recall - vA.recall).toFixed(3));
    const f1Delta = Number((vB.f1Score - vA.f1Score).toFixed(3));
    const latDelta = vB.latencyMs - vA.latencyMs;
    const dirDelta = Number((vB.disparateImpactRatio - vA.disparateImpactRatio).toFixed(2));
    // Chart data
    const chartData = [
        { metric: 'Accuracy (%)', [vA.version]: vA.accuracy, [vB.version]: vB.accuracy },
        { metric: 'Precision (x100)', [vA.version]: Math.round(vA.precision * 100), [vB.version]: Math.round(vB.precision * 100) },
        { metric: 'Recall (x100)', [vA.version]: Math.round(vA.recall * 100), [vB.version]: Math.round(vB.recall * 100) },
        { metric: 'F1 Score (x100)', [vA.version]: Math.round(vA.f1Score * 100), [vB.version]: Math.round(vB.f1Score * 100) },
    ];
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Specialized Comparison Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">Model: {selectedModel.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <GitCompare className="w-6 h-6 text-orange-600"/>
              <span>Multi-Version Comparison &amp; Evaluation Engine</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Perform deep side-by-side comparative analysis of model versions to evaluate accuracy gains, latency impact, demographic fairness drift, and architecture changes before promotion.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-stone-500">Active Production Version</div>
              <div className="text-sm font-black text-orange-600 font-mono">{selectedModel.activeVersion}</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Model & Version Selector */}
      <div className="bg-white border border-stone-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600 shrink-0"/>
            <span className="text-xs font-bold text-stone-700">Target Model:</span>
            <select value={selectedModel.id} onChange={(e) => {
            selectModel(e.target.value);
            const target = models.find(m => m.id === e.target.value);
            if (target && target.versions.length > 1) {
                setVersionAId(target.versions[0].id);
                setVersionBId(target.versions[target.versions.length - 1].id);
            }
            else if (target) {
                setVersionAId(target.versions[0]?.id || '');
                setVersionBId(target.versions[0]?.id || '');
            }
        }} className="bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 cursor-pointer">
              {models.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.versions.length} versions)</option>))}
            </select>
          </div>

          {/* Version Pair Selectors with Swap */}
          <div className="flex items-center flex-wrap gap-2.5 bg-[#FAF7F2] p-2 rounded-xl border border-stone-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500">Base (V1):</span>
              <select value={versionAId} onChange={(e) => setVersionAId(e.target.value)} className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-stone-900 font-mono font-bold focus:outline-none focus:border-orange-500">
                {selectedModel.versions.map(v => (<option key={v.id} value={v.id}>{v.version} {v.isActive ? '(Active)' : ''}</option>))}
              </select>
            </div>

            <button onClick={handleSwap} title="Swap Base and Comparison Versions" className="p-1.5 rounded-lg bg-white hover:bg-orange-50 border border-stone-300 text-stone-700 hover:text-orange-600 transition">
              <ArrowLeftRight className="w-3.5 h-3.5"/>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-orange-700">Target (V2):</span>
              <select value={versionBId} onChange={(e) => setVersionBId(e.target.value)} className="bg-white border border-orange-300 rounded-lg px-2.5 py-1 text-orange-900 font-mono font-bold focus:outline-none focus:border-orange-500">
                {selectedModel.versions.map(v => (<option key={v.id} value={v.id}>{v.version} {v.isActive ? '(Active)' : ''}</option>))}
              </select>
            </div>
          </div>

        </div>

        {/* Quick Executive Summary Verdict */}
        <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200 text-xs flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"/>
          <div className="space-y-1">
            <div className="font-bold text-stone-900">
              Comparative Analysis Verdict: <span className="text-orange-700 font-mono">{vB.version}</span> vs <span className="text-stone-700 font-mono">{vA.version}</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {accDelta >= 0 ? (<>Version <strong className="text-stone-900">{vB.version}</strong> demonstrates a <strong className="text-emerald-700">+{accDelta}% accuracy gain</strong> over {vA.version}. </>) : (<>Version <strong className="text-stone-900">{vB.version}</strong> shows a <strong className="text-rose-700">{accDelta}% accuracy drop</strong> compared to {vA.version}. </>)}
              {latDelta < 0 ? (<>Inference latency is <strong className="text-emerald-700">{Math.abs(latDelta)}ms faster</strong>. </>) : latDelta > 0 ? (<>Inference latency increased by <strong className="text-amber-700">+{latDelta}ms</strong>. </>) : (<>Inference latency is identical. </>)}
              Fairness Disparate Impact Ratio shifted by <strong className={dirDelta >= 0 ? 'text-emerald-700' : 'text-amber-700'}>{dirDelta >= 0 ? `+${dirDelta}` : dirDelta}</strong> ({vA.disparateImpactRatio} &rarr; {vB.disparateImpactRatio}).
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Matrix Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-orange-600"/>
            <span>Comprehensive Metric Differential Matrix</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">Comparative Baseline: {vA.version}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-center font-mono text-stone-800">Base: {vA.version}</th>
                <th className="py-3 px-4 text-center font-mono text-orange-700">Target: {vB.version}</th>
                <th className="py-3 px-4 text-center">Net Delta (&Delta;)</th>
                <th className="py-3 px-4 text-right">Evaluation Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              
              {/* Accuracy */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>Validation Accuracy</div>
                  <div className="text-[10px] text-stone-500 font-normal">Classification correctness on holdout dataset</div>
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-stone-800">{vA.accuracy}%</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-orange-600">{vB.accuracy}%</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${accDelta > 0 ? 'bg-emerald-100 text-emerald-800' : accDelta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                    {accDelta > 0 ? <TrendingUp className="w-3 h-3"/> : accDelta < 0 ? <TrendingDown className="w-3 h-3"/> : <Minus className="w-3 h-3"/>}
                    <span>{accDelta > 0 ? `+${accDelta}%` : `${accDelta}%`}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accDelta > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'}`}>
                    {accDelta > 0 ? 'Performance Gain' : accDelta === 0 ? 'Parity' : 'Degradation'}
                  </span>
                </td>
              </tr>

              {/* Precision */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>Model Precision</div>
                  <div className="text-[10px] text-stone-500 font-normal">Positive predictive value (TP / [TP + FP])</div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-800">{vA.precision}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-stone-900">{vB.precision}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${precDelta > 0 ? 'bg-emerald-100 text-emerald-800' : precDelta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                    {precDelta > 0 ? `+${precDelta}` : `${precDelta}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${precDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {precDelta >= 0 ? 'Positive' : 'Attention Required'}
                  </span>
                </td>
              </tr>

              {/* Recall */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>Model Recall (Sensitivity)</div>
                  <div className="text-[10px] text-stone-500 font-normal">True positive discovery rate (TP / [TP + FN])</div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-800">{vA.recall}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-stone-900">{vB.recall}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${recDelta > 0 ? 'bg-emerald-100 text-emerald-800' : recDelta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                    {recDelta > 0 ? `+${recDelta}` : `${recDelta}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${recDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {recDelta >= 0 ? 'Sensitivity Up' : 'Drop'}
                  </span>
                </td>
              </tr>

              {/* F1 Score */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>F1 Score</div>
                  <div className="text-[10px] text-stone-500 font-normal">Harmonic mean of precision and recall</div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-800">{vA.f1Score}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-orange-600">{vB.f1Score}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${f1Delta > 0 ? 'bg-emerald-100 text-emerald-800' : f1Delta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                    {f1Delta > 0 ? `+${f1Delta}` : `${f1Delta}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f1Delta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {f1Delta >= 0 ? 'Harmonic Improvement' : 'Lower F1'}
                  </span>
                </td>
              </tr>

              {/* Latency */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>Inference Latency</div>
                  <div className="text-[10px] text-stone-500 font-normal">Mean API response execution time in milliseconds</div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-800">{vA.latencyMs} ms</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-stone-900">{vB.latencyMs} ms</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${latDelta < 0 ? 'bg-emerald-100 text-emerald-800' : latDelta > 0 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>
                    {latDelta < 0 ? `${latDelta}ms (Faster)` : latDelta > 0 ? `+${latDelta}ms (Slower)` : '0ms'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${latDelta <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {latDelta <= 0 ? 'Optimized' : 'Higher Overhead'}
                  </span>
                </td>
              </tr>

              {/* Fairness Disparate Impact */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>Disparate Impact Ratio (DIR)</div>
                  <div className="text-[10px] text-stone-500 font-normal">Four-fifths rule demographic parity (Target: &ge; 0.80)</div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-800">{vA.disparateImpactRatio}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-stone-900">{vB.disparateImpactRatio}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${dirDelta > 0 ? 'bg-emerald-100 text-emerald-800' : dirDelta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                    {dirDelta > 0 ? `+${dirDelta}` : `${dirDelta}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vB.disparateImpactRatio >= 0.80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {vB.disparateImpactRatio >= 0.80 ? 'Bias Compliant' : 'Disparity Flag'}
                  </span>
                </td>
              </tr>

              {/* Dataset & Framework */}
              <tr className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-bold text-stone-900">
                  <div>ML Framework &amp; Dataset</div>
                  <div className="text-[10px] text-stone-500 font-normal">Core architecture framework and training source</div>
                </td>
                <td className="py-3 px-4 text-center text-stone-700 font-medium">
                  <div>{vA.framework}</div>
                  <div className="text-[10px] text-stone-500 truncate max-w-[150px] mx-auto">{vA.datasetName}</div>
                </td>
                <td className="py-3 px-4 text-center text-orange-950 font-bold">
                  <div>{vB.framework}</div>
                  <div className="text-[10px] text-orange-700 truncate max-w-[150px] mx-auto">{vB.datasetName}</div>
                </td>
                <td className="py-3 px-4 text-center text-stone-600 font-mono text-[11px]">
                  {vB.datasetSize || 'Upgraded'}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    Arch Revision
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Comparative Visual Metric Breakdown
            </h2>
            <p className="text-xs text-stone-500">Benchmark comparison of accuracy and core classification metrics</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded bg-stone-400 inline-block"/>
              <span>Base: {vA.version}</span>
            </span>
            <span className="flex items-center gap-1.5 text-orange-600">
              <span className="w-3 h-3 rounded bg-orange-600 inline-block"/>
              <span>Target: {vB.version}</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4"/>
              <XAxis dataKey="metric" stroke="#78716c" fontSize={11}/>
              <YAxis stroke="#78716c" fontSize={11} domain={[60, 100]}/>
              <Tooltip contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e7e5e4',
            borderRadius: '0.75rem',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}/>
              <Legend />
              <Bar dataKey={vA.version} fill="#a8a29e" radius={[4, 4, 0, 0]}/>
              <Bar dataKey={vB.version} fill="#ea580c" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Release Notes & Promotion Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Version A Card */}
        <div className="bg-[#FAF7F2] border border-stone-300 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-stone-900 font-mono">{vA.version}</span>
              {vA.isActive && (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active Live
                </span>)}
            </div>
            <span className="text-xs text-stone-500 font-medium">Released: {vA.releaseDate}</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            <strong>Release Summary: </strong>{vA.changesSummary}
          </p>
          <div className="text-[11px] text-stone-600 space-y-1">
            <div><strong>Author:</strong> {vA.author}</div>
            <div><strong>Training Data:</strong> {vA.datasetName} ({vA.datasetSize})</div>
            <div><strong>Framework:</strong> {vA.framework}</div>
          </div>
          {!vA.isActive && (<div className="pt-2">
              <button onClick={() => handlePromote(vA.id)} className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition">
                Promote {vA.version} to Active Production
              </button>
            </div>)}
        </div>

        {/* Version B Card */}
        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-orange-200">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-orange-950 font-mono">{vB.version}</span>
              {vB.isActive ? (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active Live
                </span>) : (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  Candidate Target
                </span>)}
            </div>
            <span className="text-xs text-stone-500 font-medium">Released: {vB.releaseDate}</span>
          </div>
          <p className="text-xs text-stone-800 leading-relaxed">
            <strong>Release Summary: </strong>{vB.changesSummary}
          </p>
          <div className="text-[11px] text-stone-700 space-y-1">
            <div><strong>Author:</strong> {vB.author}</div>
            <div><strong>Training Data:</strong> {vB.datasetName} ({vB.datasetSize})</div>
            <div><strong>Framework:</strong> {vB.framework}</div>
          </div>
          {!vB.isActive ? (<div className="pt-2">
              <button onClick={() => handlePromote(vB.id)} className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5"/>
                <span>Promote {vB.version} to Active Production</span>
              </button>
            </div>) : (<div className="pt-2 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4"/>
              <span>Currently Serving Live Traffic</span>
            </div>)}
        </div>

      </div>

    </div>);
}
