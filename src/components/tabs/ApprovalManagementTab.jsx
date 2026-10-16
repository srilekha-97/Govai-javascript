'use client';
import React, { useState } from 'react';
import { useGovernance } from '@/lib/store';
import { CheckSquare, CheckCircle2, XCircle, Send, Clock3, UserRoundCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
export function ApprovalManagementTab() {
    const { models, selectedModel, submitForReview, approveModel, rejectModel, currentUser, selectModel } = useGovernance();
    const [submitRemarks, setSubmitRemarks] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [approvalComments, setApprovalComments] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const firstPendingModel = models.find(m => m.currentApprovalStatus === 'Under Review');
    const [targetModelId, setTargetModelId] = useState(firstPendingModel?.id || selectedModel.id);
    const pendingModels = models.filter(m => m.currentApprovalStatus === 'Under Review');
    const targetModel = models.find(m => m.id === targetModelId) || selectedModel;
    const handleSubmitReview = (e) => {
        e.preventDefault();
        submitForReview(targetModel.id, submitRemarks);
        setShowSubmitModal(false);
        setSubmitRemarks('');
    };
    const handleApprove = () => {
        approveModel(targetModel.id, approvalComments);
        setShowApproveModal(false);
        setApprovalComments('');
        try {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
        catch {
            // ignore
        }
    };
    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }
        rejectModel(targetModel.id, rejectionReason);
        setShowRejectModal(false);
        setRejectionReason('');
    };
    // Collect all approval records across all models for the history table
    const allApprovalHistory = models.flatMap(m => m.approvalHistory.map(rec => ({
        ...rec,
        modelName: m.name,
        category: m.category,
    })));
    return (<div className="space-y-6">
      
      {/* Header Banner - Beige/White/Orange/Black */}
      <div className="bg-white border-2 border-stone-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Module 4
              </span>
              <span className="text-xs text-stone-500 font-medium">Stage-Gate Deployment Approvals</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-orange-600"/>
              <span>Approval Management</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Provides the formal governance review process. A model can be submitted for review with justification and then approved or rejected before production rollout.
            </p>
          </div>

          {/* Current Reviewer Persona */}
          <div className="p-3 bg-[#FAF7F2] border border-stone-200 rounded-2xl flex items-center gap-3 shrink-0">
            <span className="text-2xl p-1 bg-white rounded-xl border border-stone-200">{currentUser.avatar}</span>
            <div>
              <div className="text-xs font-bold text-stone-900">{currentUser.name}</div>
              <div className="text-[10px] text-orange-800 font-bold font-mono">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit reviewer queue: submitted models wait here for an authorized decision */}
      <section className="bg-white border-2 border-stone-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2"><UserRoundCheck className="w-4 h-4 text-orange-600"/> Pending Approval Queue</h2>
            <p className="mt-1 text-xs text-stone-500">Only Compliance Officers, AI Reviewers, and Admins can make a decision. Authors cannot approve their own submission.</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-black ${pendingModels.length ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>{pendingModels.length} awaiting review</span>
        </div>
        {pendingModels.length === 0 ? (<div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600"/>
            <p className="mt-2 text-sm font-bold text-stone-800">No models are waiting for approval</p>
            <p className="mt-1 text-xs text-stone-500">When a Data Scientist submits a Draft model for review, it will appear here.</p>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {pendingModels.map(model => {
                const request = model.approvalHistory.find(record => record.status === 'Pending Review');
                const isCurrent = targetModel.id === model.id;
                return (<button key={model.id} onClick={() => { setTargetModelId(model.id); selectModel(model.id); }} className={`text-left rounded-2xl border p-4 transition ${isCurrent ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-100' : 'border-stone-200 bg-stone-50 hover:border-orange-300 hover:bg-white'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-sm font-black text-stone-900">{model.name}</p><p className="mt-1 text-[11px] text-stone-500">Version {request?.version || model.activeVersion} · {model.riskLevel}</p></div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-900"><Clock3 className="mr-1 inline h-3 w-3"/> Pending</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-xl bg-white/80 p-2"><span className="text-stone-500">Submitted by</span><p className="mt-0.5 font-bold text-stone-800">{request?.submittedBy || model.owner}</p></div>
                    <div className="rounded-xl bg-white/80 p-2"><span className="text-stone-500">Submitted on</span><p className="mt-0.5 font-bold text-stone-800">{request?.submittedDate || '—'}</p></div>
                  </div>
                  <p className="mt-2 text-[11px] text-stone-600 line-clamp-2">{request?.reviewComments || 'No submission notes provided.'}</p>
                  <p className="mt-3 text-[11px] font-black text-orange-700">{isCurrent ? 'Selected for review' : 'Select this request →'}</p>
                </button>);
            })}
          </div>)}
      </section>

      {/* Review Action Card for Selected Model */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Model Under Review:</span>
              <select value={targetModel.id} onChange={e => {
            setTargetModelId(e.target.value);
            selectModel(e.target.value);
        }} className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
                {models.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.activeVersion}) - [{m.currentApprovalStatus}]</option>))}
              </select>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`text-xs font-black px-3 py-1 rounded-full ${targetModel.currentApprovalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            targetModel.currentApprovalStatus === 'Under Review' ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' :
                targetModel.currentApprovalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    'bg-stone-100 text-stone-700'}`}>
            Current Status: {targetModel.currentApprovalStatus}
          </span>
        </div>

        {/* Model Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Accuracy Benchmark</span>
            <div className="text-base font-black text-emerald-700 mt-0.5">{targetModel.currentAccuracy}%</div>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Fairness Metric (DIR)</span>
            <div className={`text-base font-black mt-0.5 ${targetModel.disparateImpactRatio >= 0.80 ? 'text-emerald-700' : 'text-amber-800'}`}>
              {targetModel.disparateImpactRatio} ({targetModel.fairnessStatus})
            </div>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Risk Level</span>
            <div className="text-base font-black text-rose-700 mt-0.5">{targetModel.riskLevel}</div>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Compliance Score</span>
            <div className="text-base font-black text-orange-700 mt-0.5">{targetModel.compliancePercentage}% Complete</div>
          </div>
        </div>

        {/* Review Action Controls */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {targetModel.currentApprovalStatus === 'Draft' || targetModel.currentApprovalStatus === 'Rejected' ? (<button onClick={() => setShowSubmitModal(true)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
              <Send className="w-3.5 h-3.5"/>
              <span>Submit Model for Review</span>
            </button>) : targetModel.currentApprovalStatus === 'Under Review' ? (<div className="flex items-center gap-2">
              <button onClick={() => setShowApproveModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
                <CheckCircle2 className="w-3.5 h-3.5"/>
                <span>Approve for Deployment</span>
              </button>
              <button onClick={() => setShowRejectModal(true)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
                <XCircle className="w-3.5 h-3.5"/>
                <span>Reject Model</span>
              </button>
            </div>) : (<div className="flex items-center gap-2">
              <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4"/>
                <span>This model version has been formally reviewed and approved for deployment.</span>
              </span>
              <button onClick={() => setShowSubmitModal(true)} className="ml-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold">
                Re-submit for Review
              </button>
            </div>)}
        </div>
      </div>

      {/* Historical Review & Approval Decisions Table */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
          Historical Review &amp; Approval Decisions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Model Name</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Submitted By</th>
                <th className="py-3 px-3">Reviewed By</th>
                <th className="py-3 px-3">Decision Date</th>
                <th className="py-3 px-3">Review Remarks</th>
                <th className="py-3 px-3 text-right">Decision Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {allApprovalHistory.length === 0 ? (<tr>
                  <td colSpan={7} className="py-4 text-center text-stone-500">No review records yet.</td>
                </tr>) : (allApprovalHistory.map((rec) => (<tr key={rec.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-3 font-bold text-stone-900">{rec.modelName}</td>
                    <td className="py-3 px-3 font-mono text-orange-700 font-bold">{rec.version}</td>
                    <td className="py-3 px-3 text-stone-700">{rec.submittedBy} ({rec.submittedDate})</td>
                    <td className="py-3 px-3 text-stone-700">{rec.reviewedBy || 'Pending Review'}</td>
                    <td className="py-3 px-3 text-stone-500">{rec.reviewedDate || '—'}</td>
                    <td className="py-3 px-3 text-stone-600 max-w-xs truncate" title={rec.reviewComments}>
                      {rec.reviewComments || 'None'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${rec.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                rec.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit for Review Modal */}
      {showSubmitModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"/>
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-orange-600"/>
              <span>Submit Model for Review</span>
            </h3>
            <p className="text-stone-600">
              Submit <strong>{targetModel.name} ({targetModel.activeVersion})</strong> for review and sign-off before production deployment.
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Submission Remarks &amp; Justification:</label>
                <textarea rows={3} required placeholder="e.g. Model meets baseline accuracy and fairness requirements; ready for deployment." value={submitRemarks} onChange={e => setSubmitRemarks(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white"/>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="px-3.5 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs">
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Approve Modal */}
      {showApproveModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"/>
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
              <span>Approve Model for Deployment</span>
            </h3>
            <p className="text-stone-600">
              Grant formal governance approval for <strong>{targetModel.name} ({targetModel.activeVersion})</strong> to be deployed.
            </p>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Approval Sign-Off Comments:</label>
              <textarea rows={3} placeholder="e.g. Governance verification passed; approved for production." value={approvalComments} onChange={e => setApprovalComments(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500 focus:bg-white"/>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowApproveModal(false)} className="px-3.5 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleApprove} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs">
                Confirm Approval
              </button>
            </div>
          </div>
        </div>)}

      {/* Reject Modal */}
      {showRejectModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-rose-300 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-stone-800 text-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"/>
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600"/>
              <span>Reject Model</span>
            </h3>
            <p className="text-stone-600">
              Reject <strong>{targetModel.name} ({targetModel.activeVersion})</strong> and return it to Draft status with feedback.
            </p>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Reason for Rejection *:</label>
              <textarea rows={3} required placeholder="e.g. Disparate impact ratio is below threshold; requires retraining." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-rose-500 focus:bg-white"/>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowRejectModal(false)} className="px-3.5 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleReject} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>)}

    </div>);
}
