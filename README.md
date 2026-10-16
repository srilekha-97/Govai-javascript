# GovAI Studio

**Responsible AI Model Lifecycle & Governance Platform**

GovAI Studio is a Next.js prototype for organizing AI model governance across registration, versioning, approvals, performance monitoring, fairness assessment, compliance evidence, and audit history.

## Problem statement coverage

- **Model registry:** model metadata, ownership, intended use, risk, framework, dataset, and versions.
- **Version control & comparison:** view version history, compare model versions, and switch the active version when governance status is approved.
- **Approval workflow:** submit models for review, record approval/rejection comments, and enforce a separation-of-duties check in the client workflow.
- **Performance monitoring:** inspect model metrics and history; the current demo's performance-check action simulates healthy/degraded readings.
- **Fairness assessment:** view disparate-impact and demographic-slice indicators; threshold calibration is a prototype simulation, not a substitute for evaluating real predictions and protected-group data.
- **Compliance management:** track checklist items and evidence notes.
- **Auditability:** records user actions in the demo's browser storage and supports CSV export.
- **Role-based experience:** Admin, Data Scientist, Compliance Officer, MLOps Engineer, Auditor, and AI Reviewer see role-specific navigation and have action-level checks in the client state layer.

## Roles and permissions

| Role | Intended access |
| --- | --- |
| **Admin** | All modules; platform oversight and governance actions |
| **Data Scientist** | Register models, manage model metadata/versions, submit for review, inspect performance and fairness |
| **Compliance Officer** | Review approvals, inspect fairness/compliance, update compliance evidence, review audit history |
| **MLOps Engineer** | Inspect models and performance; activate an approved version |
| **Auditor** | Read-only view of registry, comparison, performance, fairness, compliance and audit records |
| **AI Reviewer** | Independent review of approvals and fairness/compliance evidence |

Role enforcement in this repository is currently a **client-side demonstration**. The demo login allows persona selection and stores its state in `localStorage`. This is not secure authentication, and client-side checks can be bypassed. Do not use it as an access-control boundary for real users or sensitive data.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Optional MongoDB API

The `/api/models` endpoint uses Mongoose. Copy `.env.example` to `.env.local` and set `MONGODB_URI` to your own database connection string before using this API.

```bash
npm run build
npm start
```

The main dashboard currently uses seeded sample models and browser `localStorage`; the existence of MongoDB models/API does not mean the dashboard is already fully synchronized with MongoDB.

## Production-readiness work still required

Before describing this as a production governance platform:
1. Add server-side authentication (e.g. secure sessions/OIDC) and authorize every API request using the authenticated identity.
2. Enforce role permissions in server actions/API routes, not only React components or local storage.
3. Persist models, approvals, performance measurements, fairness results, compliance evidence and audit events in the database.
4. Connect monitoring to real inference/evaluation telemetry and define documented alert thresholds.
5. Compute fairness metrics from evaluated predictions and protected-group data; record dataset provenance and sample sizes.
6. Add tests for role restrictions, approval transitions, no self-approval, version activation, API validation, and persistence.
7. Configure secrets only in deployment environment settings; never commit `.env.local` or credentials.

## Technology

- Next.js 14 / React 18 / JavaScript
- Tailwind CSS
- MongoDB via Mongoose (optional API)
- Recharts and Lucide icons


## JavaScript version
This package is converted to JavaScript/JSX. Install dependencies with `npm install`, then run `npm run dev`. The project still uses Next.js and React; this is not a conversion to an Express-based MERN backend. MongoDB/Mongoose integration remains as described in the implementation status.
