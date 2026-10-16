'use client';
import React from 'react';
import { useGovernance } from '@/lib/store';
import { LineChart, AlertTriangle, CheckCircle2, TrendingDown, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
export function PerformanceMonitoringTab() {
    const { selectedModel, models, selectModel, simulatePerformanceCheck } = useGovernance();
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 5
              </span>
              <span className="text-xs text-stone-500 font-medium">Model: {selectedModel.name} ({selectedModel.activeVersion})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <LineChart className="w-6 h-6 text-orange-600"/>
              <span>Performance Monitoring</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Monitors model performance metrics (accuracy, precision, recall, latency) in real time and automatically identifies possible performance degradation.
            </p>
          </div>

          {/* Degradation Status Indicator */}
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 shrink-0 shadow-xs ${selectedModel.isDegraded
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
            {selectedModel.isDegraded ? (<AlertTriangle className="w-7 h-7 text-rose-600 shrink-0"/>) : (<CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0"/>)}
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {selectedModel.isDegraded ? 'Degradation Detected' : 'Performance Healthy'}
              </div>
              <div className="text-[11px] font-medium opacity-90">
                {selectedModel.isDegraded ? 'Current accuracy dropped below baseline target' : 'Operating within nominal thresholds'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection & Simulation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600"/>
          <span className="text-stone-700 font-bold">Select Model to Monitor:</span>
          <select value={selectedModel.id} onChange={e => selectModel(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-stone-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
            {models.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.activeVersion}) - {m.isDegraded ? '[DEGRADED]' : '[HEALTHY]'}</option>))}
          </select>
        </div>

        {/* Simulation Controls for Viva Demo */}
        <div className="flex items-center gap-2">
          <button onClick={() => simulatePerformanceCheck(selectedModel.id, false)} className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 transition">
            Healthy Check
          </button>
          <button onClick={() => simulatePerformanceCheck(selectedModel.id, true)} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5"/>
            <span>Simulate Degradation</span>
          </button>
        </div>
      </div>

      {/* Primary Performance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Current Accuracy</span>
          <div className={`text-2xl font-black ${selectedModel.isDegraded ? 'text-rose-600' : 'text-emerald-700'}`}>
            {selectedModel.currentAccuracy}%
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Target: {selectedModel.baselineAccuracy}%</span>
        </div>

        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Precision</span>
          <div className="text-2xl font-black text-stone-900">{selectedModel.precision}</div>
          <span className="text-[10px] text-stone-500 font-medium">Positive predictive</span>
        </div>

        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Recall</span>
          <div className="text-2xl font-black text-stone-900">{selectedModel.recall}</div>
          <span className="text-[10px] text-stone-500 font-medium">True positive rate</span>
        </div>

        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">F1 Score</span>
          <div className="text-2xl font-black text-orange-600">{selectedModel.f1Score}</div>
          <span className="text-[10px] text-stone-500 font-medium">Harmonic balance</span>
        </div>

        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Inference Latency</span>
          <div className="text-2xl font-black text-stone-900">{selectedModel.latencyMs} <span className="text-xs text-stone-500">ms</span></div>
          <span className="text-[10px] text-stone-500 font-medium">Avg runtime</span>
        </div>

        <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Error Rate</span>
          <div className="text-2xl font-black text-stone-900">{(selectedModel.errorRatePercent * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-stone-500 font-medium">Failure frequency</span>
        </div>
      </div>

      {/* Degradation Analysis Section */}
      <div className={`p-6 rounded-3xl border-2 space-y-3 shadow-xs ${selectedModel.isDegraded
            ? 'bg-rose-50/70 border-rose-300'
            : 'bg-white border-stone-200'}`}>
        <div className="flex items-center gap-2">
          <TrendingDown className={`w-5 h-5 ${selectedModel.isDegraded ? 'text-rose-600' : 'text-emerald-600'}`}/>
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Automated Performance Degradation Analysis
          </h2>
        </div>

        {selectedModel.isDegraded ? (<div className="p-4 bg-white border border-rose-200 rounded-2xl text-xs space-y-1.5 text-rose-950">
            <strong className="font-bold flex items-center gap-1.5 text-rose-700">
              <AlertTriangle className="w-4 h-4"/>
              <span>Degradation Flagged:</span>
            </strong>
            <p className="leading-relaxed">{selectedModel.degradationReason}</p>
            <p className="text-[11px] text-rose-800 pt-1 font-semibold">
              Recommendation: Trigger retraining or evaluate earlier checkpoints in the Version Comparison tab.
            </p>
          </div>) : (<div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
            <span className="font-bold text-emerald-800">No Degradation Detected: </span>
            Current accuracy ({selectedModel.currentAccuracy}%) is stable compared to baseline benchmark ({selectedModel.baselineAccuracy}%).
          </div>)}
      </div>

      {/* Historical Trend Charts */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
          Performance Accuracy Trajectory Over Time
        </h2>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={selectedModel.performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4"/>
              <XAxis dataKey="timestamp" stroke="#78716c" fontSize={11}/>
              <YAxis stroke="#78716c" fontSize={11} domain={[80, 100]}/>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e7e5e4', borderRadius: '0.75rem', fontSize: '12px' }}/>
              <Line type="monotone" dataKey="accuracy" stroke="#ea580c" strokeWidth={3} name="Accuracy (%)" dot={{ fill: '#ea580c', r: 4 }}/>
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>);
}
