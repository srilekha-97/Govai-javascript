'use client';
import React from 'react';
import { GraduationCap, X, CheckCircle2, FolderGit2, GitBranch, GitCompare, CheckSquare, LineChart, Scale, FileCheck2, History } from 'lucide-react';
export function VivaGuideModal({ onClose }) {
    const modules = [
        {
            num: '1',
            title: 'Model Registry',
            icon: <FolderGit2 className="w-4 h-4 text-orange-600"/>,
            definition: '“The Model Registry is used to register AI models and store their details and metadata.”',
            demoTips: 'Show the model inventory, click "Register New AI Model" to onboard a model with its dataset, framework, and risk level, or click "Metadata & Card".',
        },
        {
            num: '2',
            title: 'Version Control',
            icon: <GitBranch className="w-4 h-4 text-emerald-700"/>,
            definition: '“This module tracks different versions of a model and identifies which version is currently active.”',
            demoTips: 'Show the version timeline (v1.0.0, v2.0.0, v2.1.0), the prominent "ACTIVE IN PRODUCTION" badge, and the "Promote to Active Version" switch button.',
        },
        {
            num: '3',
            title: 'Version Comparison',
            icon: <GitCompare className="w-4 h-4 text-orange-600"/>,
            definition: '“Specialized comparative evaluation module that compares candidate versions against baselines side-by-side.”',
            demoTips: 'Open the Version Comparison tab. Select Base (v1.0.0) vs Target (v2.1.0). Point out the comparative accuracy (+3.2% gain), latency speedup (-23ms), fairness delta, and the comparative bar charts.',
        },
        {
            num: '4',
            title: 'Approval Management',
            icon: <CheckSquare className="w-4 h-4 text-stone-800"/>,
            definition: '“This provides the review process. A model can be submitted for review and then approved or rejected before deployment.”',
            demoTips: 'Select RecruitTalent (Under Review) -> Click "Approve for Deployment" or "Reject Model" with comments. Show the historical approval records table.',
        },
        {
            num: '5',
            title: 'Performance Monitoring',
            icon: <LineChart className="w-4 h-4 text-rose-700"/>,
            definition: '“This module monitors model performance metrics and helps identify possible performance degradation.”',
            demoTips: 'Select MediScan Diagnostic Assistant -> Point out the active "Degradation Flagged" alert (accuracy dropped from 96.0% baseline to 93.1%). Click "Simulate Degradation" to demonstrate real-time alert updates.',
        },
        {
            num: '6',
            title: 'Fairness Assessment',
            icon: <Scale className="w-4 h-4 text-amber-700"/>,
            definition: '“This module evaluates fairness-related metrics and helps identify potential bias concerns.”',
            demoTips: 'Select CreditWise Loan Approval -> Show the failing Disparate Impact Ratio (0.71 < 0.80 benchmark). Use the "Fairness Calibration Tool" slider to adjust the threshold and watch fairness recover.',
        },
        {
            num: '7',
            title: 'Compliance Management',
            icon: <FileCheck2 className="w-4 h-4 text-stone-800"/>,
            definition: '“This module helps track governance and compliance requirements related to AI models.”',
            demoTips: 'Show the Governance Requirements Checklist with interactive checkboxes across Data, Transparency, Human Oversight, and Security. Click "Export Compliance Summary" to preview the printable report.',
        },
        {
            num: '8',
            title: 'Audit Management',
            icon: <History className="w-4 h-4 text-emerald-800"/>,
            definition: '“This records important activities and changes and maintains historical records for traceability.”',
            demoTips: 'Show the chronological activity ledger capturing every login, model registration, version activation, approval decision, and metric update with timestamps and user roles. Click "Export Audit Log (CSV)".',
        },
    ];
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl divide-y divide-stone-200 text-stone-800 relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-[#FAF7F2] sticky top-0 z-10 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold">
              <GraduationCap className="w-6 h-6"/>
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <span>College Viva Voce &amp; Presentation Cheatsheet</span>
                <span className="text-[10px] bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full font-black border border-orange-200">Governance Engine</span>
              </h2>
              <p className="text-xs text-stone-600">Quick academic definitions and live demonstration steps for examiners</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 p-1.5 rounded-xl hover:bg-stone-200 transition">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (<div key={m.num} className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-mono text-[10px] font-black flex items-center justify-center">
                    {m.num}
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-stone-900 text-xs">
                    {m.icon}
                    <span>{m.title}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl text-stone-700 italic border border-stone-200 text-[11px] leading-relaxed">
                  {m.definition}
                </div>

                <p className="text-stone-600 text-[11px] leading-relaxed">
                  <strong className="text-orange-800 font-bold">Demo Walkthrough: </strong>
                  {m.demoTips}
                </p>
              </div>))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] flex items-center justify-between">
          <span className="text-xs text-stone-600 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700"/>
            <span>Structured for high scoring in college evaluation internals</span>
          </span>
          <button onClick={onClose} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs">
            Got it, Back to Platform
          </button>
        </div>

      </div>
    </div>);
}
