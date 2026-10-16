'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { canPerform } from '@/lib/permissions';
import { FolderGit2, Search, Plus, Database, Cpu, User, Calendar, FileText, X, CheckCircle2, Send, Clock3, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
export function ModelRegistryTab() {
    const { models, selectedModel, selectModel, registerModel, submitForReview, currentUser } = useGovernance();
    const canRegister = canPerform(currentUser.role, 'register-model');
    const canSubmitReview = canPerform(currentUser.role, 'submit-review');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedDetailsModel, setSelectedDetailsModel] = useState(null);
    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Credit Scoring & Lending');
    const [framework, setFramework] = useState('XGBoost 2.0');
    const [datasetName, setDatasetName] = useState('Credit_Training_Dataset.parquet');
    const [datasetSize, setDatasetSize] = useState('250,000 records');
    const [intendedUse, setIntendedUse] = useState('Automated credit scoring and underwriting evaluation.');
    const [description, setDescription] = useState('');
    const [riskLevel, setRiskLevel] = useState('High Risk');
    const [baselineAccuracy, setBaselineAccuracy] = useState(91.5);
    const filteredModels = models.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.framework.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!name.trim())
            return;
        registerModel({
            name,
            category,
            framework,
            datasetName,
            datasetSize,
            intendedUse,
            description: description || `Production model for ${category}.`,
            riskLevel,
            baselineAccuracy,
        });
        setShowRegisterModal(false);
        setName('');
        setDescription('');
        try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        catch {
            // ignore
        }
    };
    const categories = ['ALL', ...Array.from(new Set(models.map(m => m.category)))];
    return (<div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 1
              </span>
              <span className="text-xs text-stone-500 font-medium">Total Registered AI Models: {models.length}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <FolderGit2 className="w-6 h-6 text-orange-600"/>
              <span>Model Registry</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              The central catalog for registering enterprise AI models, tracking dataset provenance, algorithm architectures, training parameters, and risk classifications.
            </p>
          </div>

          {/* Registration is restricted to authorized roles */}
          {canRegister ? (<button onClick={() => setShowRegisterModal(true)} className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2 shrink-0">
              <Plus className="w-4 h-4"/>
              <span>Register New AI Model</span>
            </button>) : (<div className="max-w-xs rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-[11px] text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-stone-500"/>
              Registration is limited to Admins and Data Scientists.
            </div>)}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5"/>
          <input type="text" placeholder="Search by model name, category, or framework..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-600 font-bold text-[11px]">Category:</span>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition">
            {categories.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
      </div>

      {/* Model Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModels.map((m) => {
            const isSelected = m.id === selectedModel.id;
            return (<div key={m.id} className={`bg-white border-2 rounded-3xl p-5 sm:p-6 space-y-4 transition shadow-xs ${isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/10'
                    : 'border-stone-200 hover:border-stone-300'}`}>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-stone-900 text-base">{m.name}</h3>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                      {m.activeVersion}
                    </span>
                  </div>
                  <span className="text-xs text-orange-700 font-bold">{m.category}</span>
                </div>

                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${m.riskLevel === 'High Risk' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    m.riskLevel === 'Moderate Risk' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                  {m.riskLevel}
                </span>
              </div>

              {/* Visible lifecycle stage */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black ${m.currentApprovalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    m.currentApprovalStatus === 'Under Review' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        m.currentApprovalStatus === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                            'bg-stone-100 text-stone-700 border-stone-200'}`}>
                  <Clock3 className="w-3 h-3"/> {m.currentApprovalStatus}
                </span>
                {m.currentApprovalStatus === 'Under Review' && <span className="text-[10px] text-amber-800 font-semibold">Waiting for independent review</span>}
                {m.currentApprovalStatus === 'Draft' && <span className="text-[10px] text-stone-500">Not submitted for deployment approval</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{m.description}</p>

              {/* Metadata Badges Container */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-orange-600 shrink-0"/>
                  <span className="truncate">{m.framework}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                  <Database className="w-3.5 h-3.5 text-amber-700 shrink-0"/>
                  <span className="truncate" title={m.datasetName}>{m.datasetName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0"/>
                  <span className="truncate">Owner: <strong>{m.owner}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0"/>
                  <span>Created: {m.createdDate}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <button onClick={() => setSelectedDetailsModel(m)} className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl flex items-center gap-1.5 font-bold transition">
                  <FileText className="w-3.5 h-3.5 text-orange-600"/>
                  <span>Metadata &amp; Card</span>
                </button>

                <div className="flex items-center gap-2">
                  {canSubmitReview && (m.currentApprovalStatus === 'Draft' || m.currentApprovalStatus === 'Rejected') && (<button onClick={() => {
                        selectModel(m.id);
                        const remarks = window.prompt(`Why should ${m.name} be reviewed for deployment?`, 'Please review model performance, fairness, and compliance before production deployment.');
                        if (remarks !== null)
                            submitForReview(m.id, remarks);
                    }} className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5"/> Submit for Review
                    </button>)}
                  <button onClick={() => selectModel(m.id)} className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'}`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5"/>}
                    <span>{isSelected ? 'Active Selection' : 'Select Model'}</span>
                  </button>
                </div>
              </div>

            </div>);
        })}
      </div>

      {/* Model Metadata Details Modal */}
      {selectedDetailsModel && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <span>{selectedDetailsModel.name}</span>
                  <span className="text-xs font-mono bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">{selectedDetailsModel.activeVersion}</span>
                </h2>
                <p className="text-xs text-orange-700 font-bold">{selectedDetailsModel.category}</p>
              </div>
              <button onClick={() => setSelectedDetailsModel(null)} className="text-stone-400 hover:text-stone-900 p-1 rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <span className="font-bold text-stone-900">Intended Operational Scope:</span>
                <p className="text-stone-600 mt-0.5 leading-relaxed">{selectedDetailsModel.intendedUse}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-500 font-bold">ML Framework:</span>
                  <div className="font-bold text-stone-900 mt-0.5">{selectedDetailsModel.framework}</div>
                </div>
                <div>
                  <span className="text-stone-500 font-bold">Statutory Risk Level:</span>
                  <div className="font-bold text-rose-700 mt-0.5">{selectedDetailsModel.riskLevel}</div>
                </div>
                <div>
                  <span className="text-stone-500 font-bold">Training Dataset:</span>
                  <div className="font-bold text-stone-900 mt-0.5 truncate">{selectedDetailsModel.datasetName}</div>
                </div>
                <div>
                  <span className="text-stone-500 font-bold">Dataset Volume:</span>
                  <div className="font-bold text-stone-900 mt-0.5">{selectedDetailsModel.datasetSize}</div>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-900">Baseline Performance Benchmarks:</span>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span>Accuracy: <strong className="text-emerald-700">{selectedDetailsModel.baselineAccuracy}%</strong></span>
                  <span>F1 Score: <strong className="text-stone-900">{selectedDetailsModel.f1Score}</strong></span>
                  <span>Avg Latency: <strong className="text-orange-700">{selectedDetailsModel.latencyMs} ms</strong></span>
                  <span>DIR: <strong className="text-stone-900">{selectedDetailsModel.disparateImpactRatio}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button onClick={() => setSelectedDetailsModel(null)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-xs">
                Close Model Card
              </button>
            </div>
          </div>
        </div>)}

      {/* Register New Model Modal */}
      {showRegisterModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-orange-600"/>
                <h2 className="text-base font-black text-stone-900">Register New AI Model Asset</h2>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-center gap-2.5">
              <span className="text-lg">{currentUser.avatar}</span>
              <div>
                <span className="font-bold text-stone-900">Registering as Owner: </span>
                <span className="text-orange-800 font-bold">{currentUser.name} ({currentUser.role})</span>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Model Name *</label>
                  <input type="text" required placeholder="e.g. FraudShield Classifier" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category / Domain</label>
                  <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">ML Framework</label>
                  <input type="text" value={framework} onChange={e => setFramework(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Risk Classification</label>
                  <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none focus:border-orange-500 focus:bg-white">
                    <option value="High Risk">High Risk</option>
                    <option value="Moderate Risk">Moderate Risk</option>
                    <option value="Low Risk">Low Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Training Dataset</label>
                  <input type="text" value={datasetName} onChange={e => setDatasetName(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Dataset Sample Size</label>
                  <input type="text" value={datasetSize} onChange={e => setDatasetSize(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Intended Operational Scope</label>
                <input type="text" value={intendedUse} onChange={e => setIntendedUse(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Baseline Accuracy Benchmark (%)</label>
                <input type="number" step="0.1" min="50" max="99.9" value={baselineAccuracy} onChange={e => setBaselineAccuracy(parseFloat(e.target.value) || 90.0)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs">
                  Register Model
                </button>
              </div>
            </form>
          </div>
        </div>)}

    </div>);
}
