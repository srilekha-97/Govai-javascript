'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { ShieldCheck, UserCheck, ChevronDown, GraduationCap, Layers, LogOut } from 'lucide-react';
import { VivaGuideModal } from './VivaGuideModal';
export function Header() {
    const { personas, currentUser, switchPersona, logout, models, selectedModelId, selectModel } = useGovernance();
    const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
    const [showVivaGuide, setShowVivaGuide] = useState(false);
    return (<>
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Description */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center shadow-md shadow-orange-600/20 text-white font-black">
                <ShieldCheck className="w-6 h-6"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-stone-900 tracking-tight">GovAI Studio</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    Governance Suite
                  </span>
                </div>
                <p className="text-xs text-stone-600">Responsible AI Model Lifecycle &amp; Audit Platform</p>
              </div>
            </div>
          </div>

          {/* Controls: Model Selector, Viva Guide, User Profile & Logout */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
            
            {/* Active Model Selector */}
            <div className="flex items-center bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-orange-600 mr-2 shrink-0"/>
              <span className="text-xs text-stone-600 mr-1.5 hidden sm:inline font-semibold">Model:</span>
              <select aria-label="Active Model" value={selectedModelId} onChange={(e) => selectModel(e.target.value)} className="bg-transparent text-stone-900 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer pr-1">
                {models.map(m => (<option key={m.id} value={m.id} className="bg-white text-stone-900">
                    {m.name} ({m.activeVersion})
                  </option>))}
              </select>
            </div>

            {/* Viva Voce Cheatsheet Guide Button */}
            <button onClick={() => setShowVivaGuide(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all shadow-xs">
              <GraduationCap className="w-4 h-4 text-amber-700"/>
              <span>Viva Guide</span>
            </button>

            {/* Active User Persona Selector */}
            <div className="relative">
              <button onClick={() => setPersonaMenuOpen(!personaMenuOpen)} className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs transition-all text-left shadow-xs">
                <span className="text-base">{currentUser.avatar}</span>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-mono font-bold">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 ml-1"/>
              </button>

              {personaMenuOpen && (<div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1 divide-y divide-stone-100 animate-in fade-in duration-100">
                  <div className="px-3.5 py-2.5 bg-[#FAF7F2]">
                    <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-orange-600"/>
                      <span>Switch Active User Identity</span>
                    </div>
                  </div>
                  <div className="py-1">
                    {personas.map((p) => {
                const isActive = p.id === currentUser.id || p.role === currentUser.role;
                return (<button key={p.id || p.role} onClick={() => {
                        switchPersona(p.role);
                        setPersonaMenuOpen(false);
                    }} className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 transition-colors ${isActive ? 'bg-orange-50 text-stone-900 border-l-3 border-orange-600' : 'hover:bg-stone-50 text-stone-700'}`}>
                          <span className="text-xl">{p.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold flex items-center justify-between">
                              <span className={isActive ? 'text-orange-900' : 'text-stone-900'}>{p.name}</span>
                              {isActive && <span className="text-[9px] font-black text-orange-600 uppercase">Active</span>}
                            </div>
                            <div className="text-[10px] text-stone-500">{p.role} ({p.department})</div>
                          </div>
                        </button>);
            })}
                  </div>
                </div>)}
            </div>

            {/* Logout / Switch User Button */}
            <button onClick={logout} title="Log out or switch user" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition shadow-xs">
              <LogOut className="w-3.5 h-3.5 text-stone-600"/>
              <span className="hidden sm:inline">Sign Out</span>
            </button>

          </div>
        </div>
      </header>

      {/* Viva Exam Guide Modal */}
      {showVivaGuide && <VivaGuideModal onClose={() => setShowVivaGuide(false)}/>}
    </>);
}
