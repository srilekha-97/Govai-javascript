'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { History, Search, Download, Filter } from 'lucide-react';
export function AuditManagementTab() {
    const { auditLogs, exportAuditCSV } = useGovernance();
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });
    const actions = [
        'ALL',
        'User Login',
        'Model Registered',
        'Version Activated',
        'Submitted for Review',
        'Model Approved',
        'Model Rejected',
        'Performance Check',
        'Fairness Calibrated',
        'Compliance Updated',
    ];
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 8
              </span>
              <span className="text-xs text-stone-500 font-medium">Total Recorded Audit Events: {auditLogs.length}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <History className="w-6 h-6 text-orange-600"/>
              <span>Audit Management</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Maintains an immutable historical record of all lifecycle events, model registrations, reviewer approvals, threshold updates, and user logins for full traceability.
            </p>
          </div>

          {/* Export CSV Action */}
          <button onClick={exportAuditCSV} className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition flex items-center gap-2 shrink-0">
            <Download className="w-4 h-4"/>
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-2xl text-xs shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5"/>
          <input type="text" placeholder="Search by action, model name, user, or details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white transition"/>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-500"/>
          <span className="text-stone-600 font-bold text-[11px]">Filter Action:</span>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition">
            {actions.map(act => (<option key={act} value={act}>{act}</option>))}
          </select>
        </div>
      </div>

      {/* Traceability Activity Ledger Table */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Historical Traceability Ledger
          </h2>
          <span className="text-xs text-stone-500 font-medium">{filteredLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Target Asset</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Actor &amp; Role</th>
                <th className="py-3 px-3">Audit Details &amp; Change Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (<tr>
                  <td colSpan={6} className="py-6 text-center text-stone-500">No audit events match your search criteria.</td>
                </tr>) : (filteredLogs.map((entry) => (<tr key={entry.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-3 font-mono text-stone-500 whitespace-nowrap text-[11px]">
                      {entry.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${entry.action === 'Model Approved' ? 'bg-emerald-100 text-emerald-800' :
                entry.action === 'Model Rejected' ? 'bg-rose-100 text-rose-800' :
                    entry.action === 'Submitted for Review' ? 'bg-amber-100 text-amber-800' :
                        entry.action === 'Performance Check' ? 'bg-rose-100 text-rose-800' :
                            entry.action === 'Version Activated' ? 'bg-orange-100 text-orange-800' :
                                entry.action === 'User Login' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-stone-100 text-stone-800'}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-stone-900">
                      {entry.modelName}
                    </td>
                    <td className="py-3 px-3 font-mono text-orange-700 font-bold text-[11px]">
                      {entry.version}
                    </td>
                    <td className="py-3 px-3 text-stone-800 whitespace-nowrap">
                      <div className="font-bold">{entry.userName}</div>
                      <div className="text-[10px] text-stone-500">{entry.userRole}</div>
                    </td>
                    <td className="py-3 px-3 text-stone-600 leading-relaxed max-w-md">
                      {entry.details}
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

    </div>);
}
