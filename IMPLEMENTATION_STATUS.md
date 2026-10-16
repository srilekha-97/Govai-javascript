# GovAI Studio — implementation and verification notes

## Included in this update

- Added **Admin** and **AI Reviewer** demo personas.
- Added a central role permission map (`src/lib/permissions.ts`).
- Filtered dashboard navigation by role and prevented rendering a tab when the current demo role lacks access.
- Added action-level checks in the client state layer for registration, review submission, approval/rejection, version activation, performance checks, fairness calibration and compliance updates.
- Added separation-of-duties validation to block a user from reviewing their own pending submission.
- Prevented activating a model version unless its model's current governance status is `Approved`.
- Added an `.env.example` template and refreshed the README with setup, roles, scope, and limitations.
- Added visible demo-mode disclosures to the login and dashboard.

## Current role behavior

- **Admin:** all modules and governance actions.
- **Data Scientist:** registry, versioning, comparison, performance and fairness; can register and submit for review.
- **Compliance Officer:** registry, comparison, approvals, performance, fairness, compliance and audit; can review and update compliance evidence.
- **MLOps Engineer:** registry, versioning, comparison and performance; can activate approved versions.
- **Auditor:** read-only navigation for registry, comparison, performance, fairness, compliance and audit.
- **AI Reviewer:** registry, comparison, performance, fairness, compliance and approvals; can review approval requests and calibrate fairness.

## Important limitations — do not misrepresent these as finished production security

This project remains a prototype. The login flow is persona selection, not password verification. Role checks are implemented in client-side state and can be bypassed by a technically capable user. The MongoDB `/api/models` endpoint does not yet enforce authenticated user roles, and the dashboard still uses seeded sample records and browser `localStorage` instead of a fully synchronized database workflow.

Performance check and fairness calibration actions are demo simulations. They must be connected to real evaluation/prediction telemetry and protected-group data before being treated as production measurements.

## Manual smoke test

1. Run `npm install`, then `npm run dev`.
2. Log in as each persona and confirm the navigation tabs differ by role.
3. As Data Scientist, register a model and submit it for review.
4. Switch to Compliance Officer or AI Reviewer and approve/reject a pending request. Confirm the submitter cannot review their own request.
5. As MLOps Engineer, try activating an approved model version; confirm a non-approved model cannot be activated.
6. As Compliance Officer, update a compliance checklist item.
7. As Auditor, verify that governance action controls reject unauthorized actions.
8. Export audit history and verify that the actions appear.
9. Refresh the page to verify the current browser's demo state persists.

## Follow-up UI and approval workflow update
- Restricted the visible **Register New AI Model** action to Admin and Data Scientist roles; other roles see an explanation instead of the registration button.
- Added lifecycle status labels to model cards and a **Submit for Review** action for Draft/Rejected models for authorized model authors.
- Added a dedicated **Pending Approval Queue** in Approval Management showing model, version, submitter, submission date, and review notes.
- Approval module automatically selects the first model awaiting review, making the approve/reject workflow easier to discover.
- Added an animated governance loading indicator when navigating between modules.
- These are still client-side prototype controls. Do not represent them as production-grade server-side security.
