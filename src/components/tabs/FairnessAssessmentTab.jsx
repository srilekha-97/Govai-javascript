'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { Scale, AlertTriangle, CheckCircle2, Sliders, Users, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
export function FairnessAssessmentTab() {
    const { selectedModel, models, selectModel, calibrateFairnessThreshold } = useGovernance();
    const [thresholdShift, setThresholdShift] = useState(-0.08);
    const handleCalibrate = () => {
        calibrateFairnessThreshold(selectedModel.id, thresholdShift);
        try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        catch {
            // ignore
        }
    };
    const isBiasDetected = selectedModel.fairnessStatus === 'Bias Concern Detected';
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 6
              </span>
              <span className="text-xs text-stone-500 font-medium">Model: {selectedModel.name} ({selectedModel.activeVersion})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-orange-600"/>
              <span>Fairness Assessment</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Evaluates algorithmic demographic fairness (Disparate Impact Ratio, Parity Differences) across protected groups and flags potential bias concerns.
            </p>
          </div>

          {/* Fairness Status Badge */}
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 shrink-0 shadow-xs ${isBiasDetected
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'}`}>
            {isBiasDetected ? (<AlertTriangle className="w-7 h-7 text-amber-600 shrink-0"/>) : (<CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0"/>)}
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {selectedModel.fairnessStatus}
              </div>
              <div className="text-[11px] font-medium opacity-90">
                {isBiasDetected
            ? 'Disparate impact ratio is below 0.80 benchmark'
            : 'Meets standard 80% four-fifths rule threshold'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection Bar */}
      <div className="flex items-center justify-between bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600"/>
          <span className="text-stone-700 font-bold">Select Model to Audit:</span>
          <select value={selectedModel.id} onChange={e => selectModel(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-stone-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
            {models.map(m => (<option key={m.id} value={m.id}>{m.name} - [{m.fairnessStatus}]</option>))}
          </select>
        </div>
      </div>

      {/* Fairness Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white border-2 border-stone-200 rounded-3xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">Disparate Impact Ratio (DIR)</span>
          <div className={`text-3xl font-black ${selectedModel.disparateImpactRatio >= 0.80 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {selectedModel.disparateImpactRatio}
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between pt-2 border-t border-stone-100 font-medium">
            <span>Standard Target: &ge; 0.80 (80% Rule)</span>
            <span className={`font-black ${selectedModel.disparateImpactRatio >= 0.80 ? 'text-emerald-700' : 'text-amber-800'}`}>
              {selectedModel.disparateImpactRatio >= 0.80 ? 'PASS' : 'BIAS ALERT'}
            </span>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-stone-200 rounded-3xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">Demographic Parity Difference</span>
          <div className="text-3xl font-black text-stone-900">
            {selectedModel.demographicParityDelta}
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between pt-2 border-t border-stone-100 font-medium">
            <span>Acceptable Target: &le; 0.10</span>
            <span className="text-orange-700 font-bold">Parity Delta</span>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-stone-200 rounded-3xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">Protected Demographic Groups</span>
          <div className="text-3xl font-black text-orange-600">
            {selectedModel.protectedSlices.length} <span className="text-xs font-medium text-stone-500">Slices</span>
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between pt-2 border-t border-stone-100 font-medium">
            <span>Demographic Slices Monitored</span>
            <span className="text-emerald-700 font-bold">Active Auditing</span>
          </div>
        </div>
      </div>

      {/* Identified Bias Concerns Table */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600"/>
            <span>Demographic Groups &amp; Bias Evaluation</span>
          </h2>
        </div>

        {selectedModel.protectedSlices.length === 0 ? (<div className="p-6 bg-[#FAF7F2] rounded-2xl text-xs text-stone-500 text-center font-medium">
            No sensitive demographic attributes utilized in this model.
          </div>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Demographic Slice</th>
                  <th className="py-3 px-4">Groups Evaluated</th>
                  <th className="py-3 px-4 font-mono">Sample Count</th>
                  <th className="py-3 px-4">Positive Acceptance Rate</th>
                  <th className="py-3 px-4">Disparate Impact</th>
                  <th className="py-3 px-4 text-right">Fairness Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {selectedModel.protectedSlices.map((slice, idx) => (<tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">{slice.groupName}</td>
                    <td className="py-3 px-4 text-stone-700">{slice.subGroup}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{slice.sampleSize.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{(slice.positiveRate * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono font-black">
                      <span className={slice.disparateImpactRatio >= 0.80 ? 'text-emerald-700' : 'text-amber-800'}>
                        {slice.disparateImpactRatio}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${slice.isBiasConcern ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'}`}>
                        {slice.isBiasConcern ? 'Bias Alert Flagged' : 'Passed'}
                      </span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>

      {/* Threshold Calibration Tool */}
      <div className="bg-[#FAF7F2] border-2 border-orange-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-orange-600"/>
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Interactive Bias Mitigation &amp; Threshold Calibration
          </h2>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Calibrate the classification threshold for the unprivileged group to mitigate adverse disparity and satisfy the 80% four-fifths rule standard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700">Threshold Calibration Shift (&Delta; &theta;):</span>
              <span className="text-orange-700 font-mono font-black text-sm">{thresholdShift > 0 ? `+${thresholdShift}` : thresholdShift}</span>
            </div>
            <input type="range" min="-0.15" max="0.05" step="0.01" value={thresholdShift} onChange={e => setThresholdShift(parseFloat(e.target.value))} className="w-full accent-orange-600 cursor-pointer h-2 bg-stone-200 rounded-lg"/>
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>-0.15 (Equalize unprivileged acceptance)</span>
              <span>0.00 (Unmitigated)</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={handleCalibrate} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 transition flex items-center gap-2">
              <Sparkles className="w-4 h-4"/>
              <span>Apply Threshold Calibration</span>
            </button>
          </div>
        </div>
      </div>

    </div>);
}
