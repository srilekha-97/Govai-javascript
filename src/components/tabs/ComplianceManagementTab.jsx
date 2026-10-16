'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { FileCheck2, ShieldCheck, Download, Layers, Printer, X } from 'lucide-react';
export function ComplianceManagementTab() {
    const { selectedModel, models, selectModel, toggleComplianceItem, currentUser } = useGovernance();
    const [showExportModal, setShowExportModal] = useState(false);
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 7
              </span>
              <span className="text-xs text-stone-500 font-medium">Model: {selectedModel.name} ({selectedModel.activeVersion})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <FileCheck2 className="w-6 h-6 text-orange-600"/>
              <span>Compliance Management</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Tracks mandatory governance controls, AI safety requirements, data provenance standards, human oversight protocols, and cybersecurity checks.
            </p>
          </div>

          {/* Export Report Action */}
          <button onClick={() => setShowExportModal(true)} className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition flex items-center gap-2 shrink-0">
            <Download className="w-4 h-4"/>
            <span>Export Compliance Summary</span>
          </button>
        </div>
      </div>

      {/* Model Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600"/>
          <span className="text-stone-700 font-bold">Model Under Compliance Audit:</span>
          <select value={selectedModel.id} onChange={e => selectModel(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-stone-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
            {models.map(m => (<option key={m.id} value={m.id}>{m.name} - [{m.compliancePercentage}% Compliant]</option>))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-bold">Risk Classification:</span>
          <span className={`font-black px-2.5 py-0.5 rounded-full text-[10px] ${selectedModel.riskLevel === 'High Risk' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
            selectedModel.riskLevel === 'Moderate Risk' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
            {selectedModel.riskLevel}
          </span>
        </div>
      </div>

      {/* Compliance Overview Progress Card */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">Overall Governance Compliance Status</h2>
            <p className="text-xs text-stone-500 mt-0.5">Verification percentage across mandatory governance controls</p>
          </div>
          <div className="text-3xl font-black text-orange-600 font-mono">
            {selectedModel.compliancePercentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-3.5 rounded-full overflow-hidden border border-stone-200">
          <div className={`h-full transition-all duration-300 ${selectedModel.compliancePercentage === 100
            ? 'bg-emerald-500'
            : selectedModel.compliancePercentage >= 75
                ? 'bg-orange-500'
                : 'bg-amber-500'}`} style={{ width: `${selectedModel.compliancePercentage}%` }}></div>
        </div>
      </div>

      {/* Governance & Compliance Requirements Checklist */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
          Governance Requirements Checklist
        </h2>

        <div className="space-y-3">
          {selectedModel.complianceItems.map((item) => (<div key={item.id} className={`p-4 rounded-2xl border transition ${item.isCompliant
                ? 'bg-stone-50/60 border-stone-200'
                : 'bg-rose-50/60 border-rose-300'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={item.isCompliant} onChange={() => toggleComplianceItem(selectedModel.id, item.id)} className="mt-1 w-4 h-4 accent-orange-600 rounded cursor-pointer"/>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-xs">{item.title}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-orange-800 border border-stone-200">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
                    <p className="text-[11px] text-stone-500 font-mono italic">Audit Note: {item.notes}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${item.isCompliant ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                  {item.isCompliant ? 'VERIFIED' : 'ACTION REQUIRED'}
                </span>
              </div>
            </div>))}
        </div>
      </div>

      {/* Export Compliance Modal */}
      {showExportModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600"/>
                <h3 className="text-base font-black text-stone-900">AI Model Governance &amp; Compliance Certification</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="space-y-3 p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 font-sans">
              <div className="text-center space-y-1 pb-3 border-b border-stone-200">
                <div className="font-black text-stone-900 text-base uppercase">{selectedModel.name}</div>
                <div className="text-stone-600 text-xs font-mono">Active Version: {selectedModel.activeVersion} | Risk Level: {selectedModel.riskLevel}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><strong>Category:</strong> {selectedModel.category}</div>
                <div><strong>Framework:</strong> {selectedModel.framework}</div>
                <div><strong>Owner:</strong> {selectedModel.owner}</div>
                <div><strong>Audited By:</strong> {currentUser.name} ({currentUser.role})</div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <div className="font-bold text-stone-900 mb-1.5">Compliance Verification Checklist Summary:</div>
                <ul className="space-y-1.5 text-stone-700">
                  {selectedModel.complianceItems.map(item => (<li key={item.id} className="flex items-center justify-between">
                      <span>&bull; {item.title}</span>
                      <span className={item.isCompliant ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                        {item.isCompliant ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </li>))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => window.print()} className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center gap-1.5 font-bold">
                <Printer className="w-3.5 h-3.5"/>
                <span>Print Summary</span>
              </button>
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs">
                Done
              </button>
            </div>
          </div>
        </div>)}

    </div>);
}
