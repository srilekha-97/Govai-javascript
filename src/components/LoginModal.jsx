'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { ShieldCheck, UserCheck, ArrowRight, Sparkles, KeyRound, Building2, Mail, Lock } from 'lucide-react';
export function LoginModal() {
    const { personas, login, loginCustom } = useGovernance();
    const [activeTab, setActiveTab] = useState('inbuilt');
    // Custom login state
    const [customName, setCustomName] = useState('');
    const [customRole, setCustomRole] = useState('Data Scientist');
    const [customDept, setCustomDept] = useState('Department of Computer Science & AI');
    const [customEmail, setCustomEmail] = useState('');
    const [customPassword, setCustomPassword] = useState('••••••••');
    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customName.trim())
            return;
        loginCustom(customName.trim(), customRole, customDept, customEmail);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"/>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 shadow-sm mb-1">
            <ShieldCheck className="w-8 h-8"/>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            GovAI Studio
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Responsible AI Model Lifecycle &amp; Governance Platform. Choose a demo persona to explore role-specific workflows.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-[11px] leading-relaxed text-amber-900">
            <strong>Demo mode:</strong> quick login and custom profile selection are for evaluation only; they are not production authentication and do not verify passwords.
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#F4EFE6] border border-stone-200 rounded-xl text-xs font-semibold">
          <button type="button" onClick={() => setActiveTab('inbuilt')} className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'inbuilt'
            ? 'bg-white text-stone-900 shadow-sm border border-stone-200 font-bold'
            : 'text-stone-600 hover:text-stone-900'}`}>
            <Sparkles className="w-3.5 h-3.5 text-orange-600"/>
            <span>Inbuilt Enterprise Roles (Quick Login)</span>
          </button>
          <button type="button" onClick={() => setActiveTab('custom')} className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'custom'
            ? 'bg-white text-stone-900 shadow-sm border border-stone-200 font-bold'
            : 'text-stone-600 hover:text-stone-900'}`}>
            <KeyRound className="w-3.5 h-3.5 text-stone-600"/>
            <span>Custom User Sign-In</span>
          </button>
        </div>

        {/* Inbuilt Roles Selection */}
        {activeTab === 'inbuilt' && (<div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
              <span>Select Inbuilt Profile (Recommended for Viva)</span>
              <span className="text-orange-600 font-normal">Click to Sign In</span>
            </div>

            <div className="space-y-2.5">
              {personas.map((p) => {
                const isAris = p.name.includes('Aris');
                return (<button key={p.id} onClick={() => login(p)} className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group ${isAris
                        ? 'bg-orange-50/70 border-orange-300 hover:border-orange-500 hover:bg-orange-50 shadow-sm'
                        : 'bg-[#FAF7F2] border-stone-200 hover:border-stone-400 hover:bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-white rounded-xl border border-stone-200 shadow-xs">
                        {p.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">{p.name}</span>
                          {isAris && (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white">
                              Default Primary
                            </span>)}
                        </div>
                        <div className="text-xs font-semibold text-orange-700">{p.role}</div>
                        <div className="text-[11px] text-stone-500">{p.department}</div>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all shadow-xs">
                      <ArrowRight className="w-4 h-4"/>
                    </div>
                  </button>);
            })}
            </div>
          </div>)}

        {/* Custom User Form */}
        {activeTab === 'custom' && (<form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Full Name *</label>
              <input type="text" required placeholder="e.g. Srilekha S." value={customName} onChange={e => setCustomName(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">User Role *</label>
                <select value={customRole} onChange={e => setCustomRole(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white transition">
                  <option value="Data Scientist">Data Scientist (Model Creator)</option>
                  <option value="AI Reviewer">AI Reviewer (Independent Review)</option>
                  <option value="Compliance Officer">Compliance Officer (Auditor)</option>
                  <option value="MLOps Engineer">MLOps Engineer (Deployer)</option>
                  <option value="Auditor">Quality Assurance Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Department / College</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5"/>
                  <input type="text" value={customDept} onChange={e => setCustomDept(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5"/>
                  <input type="email" placeholder="user@college.edu" value={customEmail} onChange={e => setCustomEmail(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5"/>
                  <input type="password" value={customPassword} onChange={e => setCustomPassword(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4"/>
              <span>Sign In to Model Registry</span>
            </button>
          </form>)}

        {/* Security Notice */}
        <div className="pt-2 text-center text-[11px] text-stone-500 border-t border-stone-100">
          Role-Based Access Control (RBAC) enforced &bull; All lifecycle actions logged to Audit Ledger
        </div>

      </div>
    </div>);
}
