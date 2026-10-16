'use client';
import React from 'react';
import { FolderGit2, GitBranch, GitCompare, CheckSquare, LineChart, Scale, FileCheck2, History } from 'lucide-react';
import { useGovernance } from '@/lib/store';
import { canAccessTab } from '@/lib/permissions';
export function Navigation({ activeTab, onTabChange }) {
    const { selectedModel, models, currentUser } = useGovernance();
    // Status badges
    const pendingReviewCount = models.filter(m => m.currentApprovalStatus === 'Under Review').length;
    const isPerformanceDegraded = selectedModel.isDegraded;
    const isBiasDetected = selectedModel.fairnessStatus === 'Bias Concern Detected';
    const tabs = [
        {
            id: 'registry',
            number: '1',
            label: 'Model Registry',
            icon: <FolderGit2 className="w-4 h-4"/>,
            badge: `${models.length} Models`,
            badgeColor: 'bg-stone-200 text-stone-800',
        },
        {
            id: 'versioning',
            number: '2',
            label: 'Version Control',
            icon: <GitBranch className="w-4 h-4"/>,
            badge: selectedModel.activeVersion,
            badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        },
        {
            id: 'comparison',
            number: '3',
            label: 'Version Comparison',
            icon: <GitCompare className="w-4 h-4"/>,
            badge: 'Side-by-Side Diff',
            badgeColor: 'bg-orange-100 text-orange-800 border border-orange-200',
        },
        {
            id: 'approvals',
            number: '4',
            label: 'Approval Management',
            icon: <CheckSquare className="w-4 h-4"/>,
            badge: pendingReviewCount > 0 ? `${pendingReviewCount} Pending` : 'All Reviewed',
            badgeColor: pendingReviewCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'bg-stone-200 text-stone-700',
        },
        {
            id: 'performance',
            number: '5',
            label: 'Performance Monitoring',
            icon: <LineChart className="w-4 h-4"/>,
            badge: isPerformanceDegraded ? 'Degradation Alert' : 'Healthy',
            badgeColor: isPerformanceDegraded ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold' : 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        },
        {
            id: 'fairness',
            number: '6',
            label: 'Fairness Assessment',
            icon: <Scale className="w-4 h-4"/>,
            badge: isBiasDetected ? 'Bias Alert' : 'Passed',
            badgeColor: isBiasDetected ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold' : 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        },
        {
            id: 'compliance',
            number: '7',
            label: 'Compliance Management',
            icon: <FileCheck2 className="w-4 h-4"/>,
            badge: `${selectedModel.compliancePercentage}%`,
            badgeColor: 'bg-stone-200 text-stone-800',
        },
        {
            id: 'audit',
            number: '8',
            label: 'Audit Management',
            icon: <History className="w-4 h-4"/>,
        },
    ];
    return (<div className="bg-[#FAF7F2] border-b border-stone-200 px-4 lg:px-8 py-2 sticky top-[65px] z-30 backdrop-blur-md overflow-x-auto scrollbar-none shadow-xs">
      <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-max">
        {tabs.filter((tab) => canAccessTab(currentUser.role, tab.id)).map((tab) => {
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25 font-bold'
                    : 'text-stone-700 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200'}`}>
              {tab.icon}
              <span>{tab.number}. {tab.label}</span>
              {tab.badge && (<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : tab.badgeColor}`}>
                  {tab.badge}
                </span>)}
            </button>);
        })}
      </div>
    </div>);
}
