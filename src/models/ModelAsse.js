import mongoose, { Schema } from 'mongoose';
// ─── Sub-schemas ─────────────────────────────────────────────────────────────
const ModelVersionSchema = new Schema({
    id: String,
    version: String,
    releaseDate: String,
    author: String,
    isActive: Boolean,
    accuracy: Number,
    precision: Number,
    recall: Number,
    f1Score: Number,
    latencyMs: Number,
    errorRatePercent: Number,
    disparateImpactRatio: Number,
    changesSummary: String,
    datasetName: String,
    datasetSize: String,
    framework: String,
}, { _id: false });
const ApprovalRecordSchema = new Schema({
    id: String,
    modelId: String,
    version: String,
    submittedBy: String,
    submittedDate: String,
    reviewedBy: String,
    reviewedDate: String,
    status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'] },
    reviewComments: String,
    targetDeploymentEnv: { type: String, enum: ['Production', 'Staging'] },
}, { _id: false });
const DemographicSliceSchema = new Schema({
    groupName: String,
    subGroup: String,
    sampleSize: Number,
    positiveRate: Number,
    disparateImpactRatio: Number,
    isBiasConcern: Boolean,
}, { _id: false });
const ComplianceCheckItemSchema = new Schema({
    id: String,
    title: String,
    category: { type: String, enum: ['Data Governance', 'Transparency', 'Human Oversight', 'Security'] },
    description: String,
    isCompliant: Boolean,
    notes: String,
}, { _id: false });
const PerformanceHistorySchema = new Schema({
    timestamp: String,
    accuracy: Number,
    latencyMs: Number,
    errorRate: Number,
}, { _id: false });
// ─── Main Model Schema ────────────────────────────────────────────────────────
const RegisteredModelSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: String,
    description: String,
    owner: String,
    createdDate: String,
    lastUpdated: String,
    framework: String,
    datasetName: String,
    datasetSize: String,
    intendedUse: String,
    riskLevel: { type: String, enum: ['High Risk', 'Moderate Risk', 'Low Risk'] },
    activeVersion: String,
    versions: [ModelVersionSchema],
    baselineAccuracy: Number,
    currentAccuracy: Number,
    precision: Number,
    recall: Number,
    f1Score: Number,
    latencyMs: Number,
    errorRatePercent: Number,
    throughputRps: Number,
    isDegraded: Boolean,
    degradationReason: String,
    performanceHistory: [PerformanceHistorySchema],
    disparateImpactRatio: Number,
    demographicParityDelta: Number,
    fairnessStatus: { type: String, enum: ['Fairness Passed', 'Bias Concern Detected'] },
    protectedSlices: [DemographicSliceSchema],
    currentApprovalStatus: {
        type: String,
        enum: ['Draft', 'Under Review', 'Approved', 'Rejected'],
    },
    approvalHistory: [ApprovalRecordSchema],
    complianceItems: [ComplianceCheckItemSchema],
    compliancePercentage: Number,
}, { timestamps: true });
// Prevent model re-compilation on hot reload
const ModelAsset = mongoose.models.ModelAsset ||
    mongoose.model('ModelAsset', RegisteredModelSchema, 'models');
export default ModelAsset;
