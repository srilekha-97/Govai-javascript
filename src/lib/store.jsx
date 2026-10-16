'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REGISTERED_MODELS, INITIAL_PERSONAS, INITIAL_AUDIT_LOGS } from './initial-models';
import { canPerform } from './permissions';
const GovernanceContext = createContext(undefined);
export function GovernanceProvider({ children }) {
    const [personas, setPersonas] = useState(INITIAL_PERSONAS);
    const [currentUser, setCurrentUser] = useState(INITIAL_PERSONAS[0]); // default to Dr. Aris Thorne
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [models, setModels] = useState(INITIAL_REGISTERED_MODELS);
    const [selectedModelId, setSelectedModelId] = useState(INITIAL_REGISTERED_MODELS[0].id);
    const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
    // Load / Sync with localStorage
    useEffect(() => {
        try {
            const savedModels = localStorage.getItem('clean_govai_models');
            const savedLogs = localStorage.getItem('clean_govai_logs');
            const savedAuth = localStorage.getItem('clean_govai_auth');
            const savedPersonaId = localStorage.getItem('clean_govai_user_id');
            const customUsers = localStorage.getItem('clean_govai_custom_users');
            let currentPersonas = INITIAL_PERSONAS;
            if (customUsers) {
                const parsedCustom = JSON.parse(customUsers);
                currentPersonas = [...INITIAL_PERSONAS, ...parsedCustom];
                setPersonas(currentPersonas);
            }
            if (savedModels)
                setModels(JSON.parse(savedModels));
            if (savedLogs)
                setAuditLogs(JSON.parse(savedLogs));
            if (savedPersonaId) {
                const found = currentPersonas.find(p => p.id === savedPersonaId || p.role === savedPersonaId);
                if (found)
                    setCurrentUser(found);
            }
            if (savedAuth === 'true') {
                setIsAuthenticated(true);
            }
        }
        catch {
            // ignore
        }
    }, []);
    const saveState = (updatedModels, updatedLogs) => {
        try {
            localStorage.setItem('clean_govai_models', JSON.stringify(updatedModels));
            localStorage.setItem('clean_govai_logs', JSON.stringify(updatedLogs));
        }
        catch {
            // ignore
        }
    };
    const logAudit = (action, modelName, version, details) => {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
        const newEntry = {
            id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
            timestamp,
            userRole: currentUser.role,
            userName: currentUser.name,
            action,
            modelName,
            version,
            details,
        };
        const newLogs = [newEntry, ...auditLogs];
        setAuditLogs(newLogs);
        return newLogs;
    };
    const login = (persona) => {
        setCurrentUser(persona);
        setIsAuthenticated(true);
        try {
            localStorage.setItem('clean_govai_auth', 'true');
            localStorage.setItem('clean_govai_user_id', persona.id);
        }
        catch {
            // ignore
        }
        const newLogs = logAudit('User Login', 'Governance Platform', 'System', `User ${persona.name} (${persona.role}) signed in successfully.`);
        saveState(models, newLogs);
    };
    const loginCustom = (name, role, department, email) => {
        const newPersona = {
            id: `usr-custom-${Date.now().toString(36)}`,
            name,
            role,
            department: department || 'AI Engineering Department',
            avatar: role === 'Data Scientist' ? '👨‍🔬' : role === 'Compliance Officer' ? '⚖️' : role === 'MLOps Engineer' ? '⚙️' : '🔍',
            email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@enterprise.ai`,
        };
        const updatedPersonas = [...personas, newPersona];
        setPersonas(updatedPersonas);
        setCurrentUser(newPersona);
        setIsAuthenticated(true);
        try {
            localStorage.setItem('clean_govai_auth', 'true');
            localStorage.setItem('clean_govai_user_id', newPersona.id);
            localStorage.setItem('clean_govai_custom_users', JSON.stringify([newPersona]));
        }
        catch {
            // ignore
        }
        const newLogs = logAudit('User Login', 'Governance Platform', 'System', `Custom user ${name} (${role}) signed in to workspace.`);
        saveState(models, newLogs);
    };
    const logout = () => {
        setIsAuthenticated(false);
        try {
            localStorage.setItem('clean_govai_auth', 'false');
        }
        catch {
            // ignore
        }
    };
    const switchPersona = (role) => {
        const found = personas.find(p => p.role === role);
        if (found) {
            setCurrentUser(found);
            try {
                localStorage.setItem('clean_govai_user_id', found.id);
            }
            catch {
                // ignore
            }
            const newLogs = logAudit('User Login', 'Governance Platform', 'System', `Switched active persona to ${found.name} (${found.role}).`);
            saveState(models, newLogs);
        }
    };
    const selectedModel = models.find(m => m.id === selectedModelId) || models[0];
    const deny = (message) => {
        if (typeof window !== 'undefined')
            window.alert(message);
    };
    const allowed = (action, message) => {
        if (canPerform(currentUser.role, action))
            return true;
        deny(message);
        return false;
    };
    // 1. Model Registry: Register New Model
    const registerModel = (newModelData) => {
        if (!allowed('register-model', 'Only Admins and Data Scientists can register models.'))
            return;
        const newId = `mod-custom-${Date.now().toString(36)}`;
        const versionTag = 'v1.0.0';
        const acc = newModelData.baselineAccuracy || 91.0;
        const newModel = {
            id: newId,
            name: newModelData.name || 'New Machine Learning Model',
            category: newModelData.category || 'Predictive Risk Intelligence',
            description: newModelData.description || 'Production machine learning model for business decision intelligence.',
            owner: currentUser.name,
            createdDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            framework: newModelData.framework || 'Scikit-Learn',
            datasetName: newModelData.datasetName || 'Training_Dataset_Cleaned.csv',
            datasetSize: newModelData.datasetSize || '150,000 samples',
            intendedUse: newModelData.intendedUse || 'Automated inference for decision support.',
            riskLevel: newModelData.riskLevel || 'Moderate Risk',
            activeVersion: versionTag,
            versions: [
                {
                    id: `ver-${Date.now()}`,
                    version: versionTag,
                    releaseDate: new Date().toISOString().split('T')[0],
                    author: currentUser.name,
                    isActive: true,
                    accuracy: acc,
                    precision: Number((acc / 100 - 0.01).toFixed(3)),
                    recall: Number((acc / 100 - 0.015).toFixed(3)),
                    f1Score: Number((acc / 100 - 0.012).toFixed(3)),
                    latencyMs: 38,
                    errorRatePercent: 0.02,
                    disparateImpactRatio: 0.86,
                    changesSummary: 'Initial model baseline registration and training checkpoint.',
                    datasetName: newModelData.datasetName || 'Training_Dataset_Cleaned.csv',
                    datasetSize: newModelData.datasetSize || '150,000 samples',
                    framework: newModelData.framework || 'Scikit-Learn',
                }
            ],
            baselineAccuracy: acc,
            currentAccuracy: acc,
            precision: Number((acc / 100 - 0.01).toFixed(3)),
            recall: Number((acc / 100 - 0.015).toFixed(3)),
            f1Score: Number((acc / 100 - 0.012).toFixed(3)),
            latencyMs: 38,
            errorRatePercent: 0.02,
            throughputRps: 150,
            isDegraded: false,
            performanceHistory: [
                { timestamp: 'Initial Run', accuracy: acc, latencyMs: 38, errorRate: 0.02 }
            ],
            disparateImpactRatio: 0.86,
            demographicParityDelta: 0.06,
            fairnessStatus: 'Fairness Passed',
            protectedSlices: [
                {
                    groupName: 'Demographic Group',
                    subGroup: 'Majority vs Underrepresented Demographic',
                    sampleSize: 15000,
                    positiveRate: 0.52,
                    disparateImpactRatio: 0.86,
                    isBiasConcern: false,
                }
            ],
            currentApprovalStatus: 'Draft',
            approvalHistory: [],
            compliancePercentage: 100,
            complianceItems: [
                { id: 'c1', title: 'Dataset Documentation & Provenance', category: 'Data Governance', description: 'Dataset source and features are documented.', isCompliant: true, notes: 'Verified.' },
                { id: 'c2', title: 'Bias & Fairness Testing', category: 'Data Governance', description: 'Model tested for adverse disparate impact.', isCompliant: true, notes: 'Verified.' },
                { id: 'c3', title: 'Model Architecture & Card Transparency', category: 'Transparency', description: 'Clear metadata recorded in registry.', isCompliant: true, notes: 'Verified.' },
                { id: 'c4', title: 'Human Oversight & Override Switch', category: 'Human Oversight', description: 'Human operator can override model predictions.', isCompliant: true, notes: 'Verified.' },
                { id: 'c5', title: 'Cybersecurity & Input Sanitization', category: 'Security', description: 'Input payload is sanitized against malicious payloads.', isCompliant: true, notes: 'Verified.' },
            ],
        };
        const updated = [newModel, ...models];
        const newLogs = logAudit('Model Registered', newModel.name, versionTag, `New AI model registered under ${newModel.category} by ${currentUser.name}.`);
        setModels(updated);
        setSelectedModelId(newId);
        saveState(updated, newLogs);
    };
    // 2. Version Control: Set which version is active
    const setActiveVersion = (modelId, versionId) => {
        if (!allowed('activate-version', 'Only Admins and MLOps Engineers can activate versions.'))
            return;
        const modelForActivation = models.find(m => m.id === modelId);
        if (modelForActivation && modelForActivation.currentApprovalStatus !== 'Approved') {
            deny('This model version cannot be activated until it has an Approved governance status.');
            return;
        }
        let activatedVersionTag = '';
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const updatedVersions = m.versions.map(v => {
                const isTarget = v.id === versionId;
                if (isTarget)
                    activatedVersionTag = v.version;
                return { ...v, isActive: isTarget };
            });
            const activeObj = updatedVersions.find(v => v.isActive);
            return {
                ...m,
                activeVersion: activatedVersionTag || m.activeVersion,
                versions: updatedVersions,
                currentAccuracy: activeObj?.accuracy || m.currentAccuracy,
                latencyMs: activeObj?.latencyMs || m.latencyMs,
                f1Score: activeObj?.f1Score || m.f1Score,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Version Activated', targetModel?.name || modelId, activatedVersionTag, `Version ${activatedVersionTag} set as the active production version by ${currentUser.name}.`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 3. Approval Management: Submit for review
    const submitForReview = (modelId, remarks) => {
        if (!allowed('submit-review', 'Only Admins and Data Scientists can submit models for review.'))
            return;
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const newRecord = {
                id: `app-${Date.now()}`,
                modelId: m.id,
                version: m.activeVersion,
                submittedBy: `${currentUser.name} (${currentUser.role})`,
                submittedDate: new Date().toISOString().split('T')[0],
                status: 'Pending Review',
                reviewComments: remarks || 'Submitted for formal review before deployment.',
                targetDeploymentEnv: 'Production',
            };
            return {
                ...m,
                currentApprovalStatus: 'Under Review',
                approvalHistory: [newRecord, ...m.approvalHistory],
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Submitted for Review', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', `Submitted for deployment review by ${currentUser.name}. Remarks: "${remarks}"`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 3. Approval Management: Approve model
    const approveModel = (modelId, comments) => {
        if (!allowed('review-approval', 'Only Admins, Compliance Officers, and AI Reviewers can review approvals.'))
            return;
        const pendingModel = models.find(m => m.id === modelId);
        const pendingRecord = pendingModel?.approvalHistory.find(rec => rec.status === 'Pending Review');
        if (!pendingRecord) {
            deny('There is no pending approval request for this model.');
            return;
        }
        if (pendingRecord.submittedBy?.startsWith(currentUser.name)) {
            deny('Separation of duties: you cannot approve your own submission.');
            return;
        }
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const updatedHistory = m.approvalHistory.map((rec, idx) => {
                if (idx === 0 && rec.status === 'Pending Review') {
                    return {
                        ...rec,
                        status: 'Approved',
                        reviewedBy: `${currentUser.name} (${currentUser.role})`,
                        reviewedDate: new Date().toISOString().split('T')[0],
                        reviewComments: comments || 'Model approved for deployment.',
                    };
                }
                return rec;
            });
            return {
                ...m,
                currentApprovalStatus: 'Approved',
                approvalHistory: updatedHistory,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Model Approved', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', `Approved for deployment by ${currentUser.name} (${currentUser.role}). Comments: "${comments}"`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 3. Approval Management: Reject model
    const rejectModel = (modelId, reason) => {
        if (!allowed('review-approval', 'Only Admins, Compliance Officers, and AI Reviewers can review approvals.'))
            return;
        const pendingModel = models.find(m => m.id === modelId);
        const pendingRecord = pendingModel?.approvalHistory.find(rec => rec.status === 'Pending Review');
        if (!pendingRecord) {
            deny('There is no pending approval request for this model.');
            return;
        }
        if (pendingRecord.submittedBy?.startsWith(currentUser.name)) {
            deny('Separation of duties: you cannot reject/review your own submission.');
            return;
        }
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const updatedHistory = m.approvalHistory.map((rec, idx) => {
                if (idx === 0 && rec.status === 'Pending Review') {
                    return {
                        ...rec,
                        status: 'Rejected',
                        reviewedBy: `${currentUser.name} (${currentUser.role})`,
                        reviewedDate: new Date().toISOString().split('T')[0],
                        reviewComments: reason || 'Model rejected.',
                    };
                }
                return rec;
            });
            return {
                ...m,
                currentApprovalStatus: 'Rejected',
                approvalHistory: updatedHistory,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Model Rejected', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', `Rejected by ${currentUser.name} (${currentUser.role}). Reason: "${reason}"`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 4. Performance Monitoring: Performance check & degradation simulation
    const simulatePerformanceCheck = (modelId, induceDegradation = false) => {
        if (!allowed('run-performance-check', 'Only Admins, MLOps Engineers, and Data Scientists can run performance checks.'))
            return;
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const newAccuracy = induceDegradation ? Number((m.baselineAccuracy - 3.2).toFixed(1)) : m.baselineAccuracy;
            const isDegraded = newAccuracy < m.baselineAccuracy - 1.5;
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const newPoint = {
                timestamp: timeStr,
                accuracy: newAccuracy,
                latencyMs: induceDegradation ? m.latencyMs + 40 : m.latencyMs,
                errorRate: induceDegradation ? 0.07 : 0.01,
            };
            return {
                ...m,
                currentAccuracy: newAccuracy,
                isDegraded,
                degradationReason: isDegraded ? `Accuracy dropped to ${newAccuracy}% (more than 1.5% below baseline ${m.baselineAccuracy}%).` : undefined,
                performanceHistory: [...m.performanceHistory.slice(-5), newPoint],
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Performance Check', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', induceDegradation
            ? 'Performance check flagged accuracy degradation below baseline threshold.'
            : 'Performance telemetry verified healthy against baseline metrics.');
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 5. Fairness Assessment: Calibrate threshold to fix bias
    const calibrateFairnessThreshold = (modelId, thresholdShift) => {
        if (!allowed('calibrate-fairness', 'Only Admins, Compliance Officers, and AI Reviewers can calibrate fairness thresholds.'))
            return;
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const improvedDIR = Number(Math.min(0.96, m.disparateImpactRatio + Math.abs(thresholdShift) * 1.5).toFixed(2));
            const updatedSlices = m.protectedSlices.map(s => ({
                ...s,
                disparateImpactRatio: improvedDIR,
                isBiasConcern: improvedDIR < 0.80,
            }));
            const isPassed = improvedDIR >= 0.80;
            return {
                ...m,
                disparateImpactRatio: improvedDIR,
                fairnessStatus: isPassed ? 'Fairness Passed' : 'Bias Concern Detected',
                protectedSlices: updatedSlices,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Fairness Calibrated', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', `Applied threshold calibration (shift: ${thresholdShift}). Disparate Impact Ratio updated.`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 6. Compliance Management: Toggle item
    const toggleComplianceItem = (modelId, itemId) => {
        if (!allowed('update-compliance', 'Only Admins and Compliance Officers can update compliance evidence.'))
            return;
        const updated = models.map(m => {
            if (m.id !== modelId)
                return m;
            const updatedItems = m.complianceItems.map(item => {
                if (item.id === itemId)
                    return { ...item, isCompliant: !item.isCompliant };
                return item;
            });
            const compliantCount = updatedItems.filter(i => i.isCompliant).length;
            const percentage = Math.round((compliantCount / updatedItems.length) * 100);
            return {
                ...m,
                complianceItems: updatedItems,
                compliancePercentage: percentage,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
        });
        const targetModel = models.find(m => m.id === modelId);
        const newLogs = logAudit('Compliance Updated', targetModel?.name || modelId, targetModel?.activeVersion || 'v1.0.0', `Updated compliance requirement verification item for ${targetModel?.name}.`);
        setModels(updated);
        saveState(updated, newLogs);
    };
    // 7. Audit Management: Export CSV
    const exportAuditCSV = () => {
        const headers = ['Audit ID', 'Timestamp', 'User Role', 'User Name', 'Action', 'Model Name', 'Version', 'Details'];
        const rows = auditLogs.map(l => [
            l.id,
            l.timestamp,
            l.userRole,
            `"${l.userName}"`,
            l.action,
            `"${l.modelName}"`,
            l.version,
            `"${l.details.replace(/"/g, '""')}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ai_governance_audit_log_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<GovernanceContext.Provider value={{
            isAuthenticated,
            currentUser,
            personas,
            login,
            loginCustom,
            logout,
            switchPersona,
            models,
            selectedModelId,
            selectedModel,
            selectModel: setSelectedModelId,
            registerModel,
            setActiveVersion,
            submitForReview,
            approveModel,
            rejectModel,
            simulatePerformanceCheck,
            calibrateFairnessThreshold,
            toggleComplianceItem,
            auditLogs,
            exportAuditCSV,
        }}>
      {children}
    </GovernanceContext.Provider>);
}
export function useGovernance() {
    const context = useContext(GovernanceContext);
    if (!context) {
        throw new Error('useGovernance must be used within a GovernanceProvider');
    }
    return context;
}
