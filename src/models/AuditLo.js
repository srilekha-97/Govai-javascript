import mongoose, { Schema } from 'mongoose';
const AuditLogSchema = new Schema({
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    userRole: {
        type: String,
        enum: ['Admin', 'AI Reviewer', 'Data Scientist', 'Compliance Officer', 'MLOps Engineer', 'Auditor'],
        required: true,
    },
    userName: { type: String, required: true },
    action: {
        type: String,
        enum: [
            'Model Registered',
            'Version Activated',
            'Submitted for Review',
            'Model Approved',
            'Model Rejected',
            'Performance Check',
            'Fairness Calibrated',
            'Compliance Updated',
            'User Login',
        ],
        required: true,
    },
    modelName: String,
    version: String,
    details: String,
}, { timestamps: true });
const AuditLog = mongoose.models.AuditLog ||
    mongoose.model('AuditLog', AuditLogSchema, 'auditlogs');
export default AuditLog;
