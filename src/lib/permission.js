export const ROLE_LABELS = {
    'Admin': 'Platform administrator',
    'Data Scientist': 'Model author',
    'Compliance Officer': 'Governance reviewer',
    'MLOps Engineer': 'Release operator',
    'Auditor': 'Read-only auditor',
    'AI Reviewer': 'Independent AI reviewer',
};
const ACCESS = {
    'Admin': ['registry', 'versioning', 'comparison', 'approvals', 'performance', 'fairness', 'compliance', 'audit'],
    'Data Scientist': ['registry', 'versioning', 'comparison', 'performance', 'fairness'],
    'Compliance Officer': ['registry', 'comparison', 'approvals', 'performance', 'fairness', 'compliance', 'audit'],
    'MLOps Engineer': ['registry', 'versioning', 'comparison', 'performance'],
    'Auditor': ['registry', 'comparison', 'performance', 'fairness', 'compliance', 'audit'],
    'AI Reviewer': ['registry', 'comparison', 'performance', 'fairness', 'compliance', 'approvals'],
};
export function canAccessTab(role, tab) {
    return ACCESS[role]?.includes(tab) ?? false;
}
export function canPerform(role, action) {
    switch (action) {
        case 'register-model': return ['Admin', 'Data Scientist'].includes(role);
        case 'submit-review': return ['Admin', 'Data Scientist'].includes(role);
        case 'review-approval': return ['Admin', 'Compliance Officer', 'AI Reviewer'].includes(role);
        case 'activate-version': return ['Admin', 'MLOps Engineer'].includes(role);
        case 'run-performance-check': return ['Admin', 'MLOps Engineer', 'Data Scientist'].includes(role);
        case 'calibrate-fairness': return ['Admin', 'Compliance Officer', 'AI Reviewer'].includes(role);
        case 'update-compliance': return ['Admin', 'Compliance Officer'].includes(role);
        case 'manage-users': return role === 'Admin';
    }
}
