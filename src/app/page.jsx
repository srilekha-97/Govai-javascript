'use client';
import React, { useEffect, useState } from 'react';
import { GovernanceProvider, useGovernance } from '@/lib/store';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { LoginModal } from '@/components/LoginModal';
import { ModelRegistryTab } from '@/components/tabs/ModelRegistryTab';
import { VersionControlTab } from '@/components/tabs/VersionControlTab';
import { VersionComparisonTab } from '@/components/tabs/VersionComparisonTab';
import { ApprovalManagementTab } from '@/components/tabs/ApprovalManagementTab';
import { PerformanceMonitoringTab } from '@/components/tabs/PerformanceMonitoringTab';
import { FairnessAssessmentTab } from '@/components/tabs/FairnessAssessmentTab';
import { ComplianceManagementTab } from '@/components/tabs/ComplianceManagementTab';
import { AuditManagementTab } from '@/components/tabs/AuditManagementTab';
import { ShieldCheck, LockKeyhole, LoaderCircle } from 'lucide-react';
import { canAccessTab } from '@/lib/permissions';
function DashboardContent() {
    const { isAuthenticated, currentUser } = useGovernance();
    const [activeTab, setActiveTab] = useState('registry');
    const [isTabLoading, setIsTabLoading] = useState(false);
    const changeTab = (tab) => {
        if (tab === activeTab)
            return;
        setIsTabLoading(true);
        setActiveTab(tab);
        window.setTimeout(() => setIsTabLoading(false), 420);
    };
    useEffect(() => {
        if (!canAccessTab(currentUser.role, activeTab)) {
            const firstAllowed = ['registry', 'versioning', 'comparison', 'approvals', 'performance', 'fairness', 'compliance', 'audit'];
            setActiveTab(firstAllowed.find((tab) => canAccessTab(currentUser.role, tab)) || 'registry');
        }
    }, [currentUser.role, activeTab]);
    return (<div className="min-h-screen bg-[#F8F5F0] text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* If user is not authenticated, show interactive Login Modal */}
      {!isAuthenticated && <LoginModal />}

      {/* Top Header */}
      <Header />

      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-center gap-2">
        <LockKeyhole className="w-3.5 h-3.5 shrink-0"/>
        <span><strong>Prototype access control:</strong> role permissions are demonstrated in the client app. Use server-side authentication and authorization before production deployment.</span>
      </div>

      {/* 8-Module Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={changeTab}/>

      {/* Main Module Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isTabLoading ? (<div className="min-h-[48vh] flex flex-col items-center justify-center gap-4 text-center" role="status" aria-live="polite">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-200 bg-white shadow-lg shadow-orange-100">
              <div className="absolute inset-1 rounded-2xl border-2 border-orange-100"/>
              <ShieldCheck className="h-8 w-8 text-orange-600"/>
              <LoaderCircle className="absolute -right-2 -top-2 h-7 w-7 animate-spin text-orange-600"/>
            </div>
            <div>
              <p className="text-sm font-black text-stone-900">Loading governance module</p>
              <p className="mt-1 text-xs text-stone-500">Preparing your workspace…</p>
            </div>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-orange-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-orange-500 to-amber-400"/>
            </div>
          </div>) : <>
        {activeTab === 'registry' && canAccessTab(currentUser.role, 'registry') && <ModelRegistryTab />}
        {activeTab === 'versioning' && canAccessTab(currentUser.role, 'versioning') && <VersionControlTab />}
        {activeTab === 'comparison' && canAccessTab(currentUser.role, 'comparison') && <VersionComparisonTab />}
        {activeTab === 'approvals' && canAccessTab(currentUser.role, 'approvals') && <ApprovalManagementTab />}
        {activeTab === 'performance' && canAccessTab(currentUser.role, 'performance') && <PerformanceMonitoringTab />}
        {activeTab === 'fairness' && canAccessTab(currentUser.role, 'fairness') && <FairnessAssessmentTab />}
        {activeTab === 'compliance' && canAccessTab(currentUser.role, 'compliance') && <ComplianceManagementTab />}
        {activeTab === 'audit' && canAccessTab(currentUser.role, 'audit') && <AuditManagementTab />}
        </>}
      </main>

      {/* Clean Footer - Warm Beige/White/Orange/Black */}
      <footer className="bg-white border-t border-stone-200 px-4 lg:px-8 py-6 text-xs text-stone-600 mt-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-4 h-4"/>
            </div>
            <span className="font-black text-stone-900">GovAI Studio</span>
            <span className="text-stone-400">&bull;</span>
            <span>Enterprise AI Governance &amp; Model Lifecycle Management</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-stone-500 text-[11px] font-medium">
            <span>1. Registry</span>
            <span>&bull;</span>
            <span>2. Versioning</span>
            <span>&bull;</span>
            <span className="text-orange-700 font-bold">3. Version Comparison</span>
            <span>&bull;</span>
            <span>4. Approvals</span>
            <span>&bull;</span>
            <span>5. Performance</span>
            <span>&bull;</span>
            <span>6. Fairness</span>
            <span>&bull;</span>
            <span>7. Compliance</span>
            <span>&bull;</span>
            <span>8. Audit</span>
          </div>
        </div>
      </footer>
    </div>);
}
export default function Page() {
    return (<GovernanceProvider>
      <DashboardContent />
    </GovernanceProvider>);
}
