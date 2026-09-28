# NexHR — Next-Gen Enterprise HR & Payroll Operations Platform

<div align="center">
  <a href="https://nexhr-platform.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Platform-nexhr--platform.vercel.app-4F46E5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Platform" />
  </a>
  <a href="https://nexhr-api-1p7e.onrender.com/health" target="_blank">
    <img src="https://img.shields.io/badge/Backend%20API-Online%20(Render)-10B981?style=for-the-badge&logo=render&logoColor=white" alt="Backend API" />
  </a>
  <img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Database" />
  <img src="https://img.shields.io/badge/Email%20Engine-Resend-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
  <br /><br />
  <img src="https://img.shields.io/badge/NexHR-Enterprise%20Edition-4F46E5?style=flat-square&logo=shield&logoColor=white" alt="NexHR Edition" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20Modular%20Monolith-06B6D4?style=flat-square&logo=diagram-next&logoColor=white" alt="Architecture" />
  <img src="https://img.shields.io/badge/Payroll%20Engine-Deterministic%20AST-10B981?style=flat-square&logo=calculator&logoColor=white" alt="Engine" />
  <img src="https://img.shields.io/badge/Real--Time-WebSocket%20Sync-F59E0B?style=flat-square&logo=websocket&logoColor=white" alt="WebSocket" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18.3-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</div>

<br />

> **NexHR** is a mission-critical, enterprise-grade HR & Payroll operations ecosystem built for high-growth modern businesses. Designed to replace disconnected spreadsheets and legacy software, NexHR unifies **Employee Identity**, **Multi-Tier RBAC**, **ServiceNow-Style User Impersonation**, **Immutable Audit Trails**, **Working Schedules**, **Live Biometric Attendance & Leaves**, **AST-Driven Mathematical Payroll Engine**, **Transactional Email Dispatch with PDF Generation**, and **Real-Time WebSocket Synchronization** into one unified, auditable operational flow.

---

## Live Production Deployment

NexHR is deployed and accessible on the public internet:

| Service | Environment | Host / Provider | Status & URL |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Production SPA | Vercel Global Edge | [nexhr-platform.vercel.app](https://nexhr-platform.vercel.app/) |
| **Backend REST API** | Node.js / Express | Render Cloud | [nexhr-api-1p7e.onrender.com](https://nexhr-api-1p7e.onrender.com) |
| **Real-Time WebSocket** | WebSocket Gateway | Render (`/ws`) | `wss://nexhr-api-1p7e.onrender.com/ws` |
| **System Diagnostics** | Health Check | Render (`/health`) | [nexhr-api-1p7e.onrender.com/health](https://nexhr-api-1p7e.onrender.com/health) |
| **Database Pooler** | PostgreSQL 15 | Supabase Mumbai (ap-south-1) | Active (16 Production Indexes) |
| **Email Subsystem** | Transactional Dispatch | Resend API | Active (`onboarding@resend.dev`) |

---

## Table of Contents

1. [Live Production Deployment](#live-production-deployment)
2. [Executive Summary & Core Value Proposition](#1-executive-summary--core-value-proposition)
3. [What's New in NexHR Enterprise Edition](#2-whats-new-in-nexhr-enterprise-edition)
4. [System Architecture](#3-system-architecture)
5. [Real-Time WebSocket Subsystem](#4-real-time-websocket-subsystem)
6. [End-to-End Operational Lifecycle](#5-end-to-end-operational-lifecycle)
7. [Core Functional Modules](#6-core-functional-modules)
   - [Authentication & 5-Tier RBAC Matrix](#authentication--5-tier-rbac-matrix)
   - [ServiceNow-Style User Impersonation](#servicenow-style-user-impersonation)
   - [Employee Directory & Contract Overlap Guard](#employee-directory--contract-overlap-guard)
   - [Attendance Kiosk & Time-Off Lifecycle](#attendance-kiosk--time-off-lifecycle)
   - [Payroll Engine, Proration & Safe AST Evaluator](#payroll-engine-proration--safe-ast-evaluator)
   - [Batch Payrun Processing & Vector PDF Payslips](#batch-payrun-processing--vector-pdf-payslips)
   - [Transactional Email Dispatch Subsystem](#transactional-email-dispatch-subsystem)
   - [Immutable Audit Trail Inspector](#immutable-audit-trail-inspector)
   - [Executive Dashboard & Fluid Analytics](#executive-dashboard--fluid-analytics)
8. [Database Architecture & 16 Production Indexes](#7-database-architecture--16-production-indexes)
9. [Pre-Seeded Credentials & Role Matrix](#8-pre-seeded-credentials--role-matrix)
10. [Local Development Setup](#9-local-development-setup)
11. [Automated Testing Suite](#10-automated-testing-suite)
12. [REST API Endpoint Reference](#11-rest-api-endpoint-reference)
13. [Project Directory Layout](#12-project-directory-layout)
14. [License & Compliance](#13-license--compliance)

---

## 1. Executive Summary & Core Value Proposition

Traditional HR and Payroll systems operate in disconnected silos: attendance sits in a physical kiosk, leave requests live in emails, contracts are stored in filing systems, and payroll is calculated via fragile spreadsheets.

**NexHR delivers five core architectural pillars**:
1. **Single Source of Truth**: All operational contexts (contracts, schedules, attendances, leaves, bank accounts) anchor directly to the employee master record.
2. **Deterministic Mathematical Proration**: Calculates exact calendar-day and working-day wages for mid-month hires, terminations, and unpaid leaves down to the exact cent.
3. **Safe AST Salary Rule Engine**: Replaces dangerous code-evaluation functions with an isolated mathematical sandbox supporting expressions, caps, and conditional rules.
4. **ServiceNow-Style User Impersonation**: Allows system administrators to securely test and troubleshoot application state from any user's perspective with full audit logging.
5. **High-Performance Architecture**: 16 dedicated B-Tree PostgreSQL indexes, connection pooling, and elimination of N+1 database queries to comfortably support thousands of active employees.

---

## 2. What's New in NexHR Enterprise Edition

- **ServiceNow-Style User Impersonation**: One-click user perspective switching with amber UI status banners, JWT impersonation claims, and anti-admin impersonation protection.
- **Full Transactional Email System**: Asynchronous SMTP and Resend dispatch with retry queue, responsive HTML templates (Welcome, Leave Approved/Rejected, Payslip), and real vector PDF attachments.
- **Immutable Audit Trail**: Mutation logging across all critical endpoints with actor tracking, timestamps, IP logging, and an interactive before/after JSON diff inspector in the UI.
- **Safe Formula Evaluator**: Replaces `new Function()` with a sandboxed AST validator supporting `min()`, `max()`, `round()`, `abs()`, and conditional formulas (`WORKED_DAYS >= 20`).
- **Database Optimization**: 16 production B-Tree indexes, pg connection pooling (`max: 20`, `idleTimeout: 30s`), server-side pagination, and parallelized dashboard analytics.
- **Security Hardening**: Standard Bcrypt password hashing with backward-compatible auto-migration, strict rate limiting, parameterization against SQL injections, and removal of insecure demo bypasses.

---

## 3. System Architecture

For a deep dive into technical specifications, design patterns, and database tuning, refer to the companion documentation: **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

```
                           +-----------------------------------+
                           |      React 18 + Vite Frontend     |
                           |   (Vercel Global Edge Network)    |
                           +-----------------+-----------------+
                                             |
                    REST API (JSON / JWT)    |    WebSocket (ws://)
                                             v
+----------------------------------------------------------------------------------+
|                             Express.js Backend Core                              |
|                          (Render Cloud Web Service)                              |
|                                                                                  |
|  +------------------------+  +------------------------+  +---------------------+ |
|  |    Identity & Auth     |  |  Impersonation Engine  |  | Rate Limiter & CORS | |
|  | (Bcrypt + 5-Tier RBAC) |  |  (JWT Claims + Audit)  |  | Security Middleware | |
|  +-----------+------------+  +-----------+------------+  +----------+----------+ |
|              |                           |                          |            |
|  +-----------v---------------------------v--------------------------v----------+ |
|  |                              Business Services                              | |
|  |  - Employee & Contract Service (Overlapping Dates Validation)               | |
|  |  - Attendance & Time-Off Lifecycle Engine                                   | |
|  |  - Payroll Engine (ProrationEngine + Safe AST Evaluator)                    | |
|  |  - Immutable Audit Trail Service (Action, Entity, JSON Diffs)               | |
|  |  - Email Queue & Transporter (Resend API + Vector PDF Generator)            | |
|  +---------------------------------------+-------------------------------------+ |
|                                          |                                       |
|  +---------------------------------------v-------------------------------------+ |
|  |                             Database Layer                                  | |
|  |  - pg.Pool (Max: 20 connections, idleTimeout: 30s)                          | |
|  |  - Supabase IPv4 Transaction Pooler (Mumbai ap-south-1)                     | |
|  +---------------------------------------+-------------------------------------+ |
+------------------------------------------+---------------------------------------+
                                           |
                                           v
                          +----------------------------------+
                          |      PostgreSQL (Supabase)       |
                          |   16 Production B-Tree Indexes   |
                          |  Relational Integrity & Schemas  |
                          +----------------------------------+
```

---

## 4. Real-Time WebSocket Subsystem

The WebSocket server is mounted alongside Express on `wss://nexhr-api-1p7e.onrender.com/ws` with a 30-second ping/pong heartbeat protocol and exponential-backoff client reconnection.

### Event Types & Payloads

| Event Type | Trigger | Broadcast Action & Payload |
| :--- | :--- | :--- |
| `PAYROLL_UPDATE` | Salary rule saved, payrun created, validated, or marked paid | Payrun summary, toast notification with status badge |
| `ATTENDANCE_UPDATE` | Web kiosk punch check-in, check-out, or manual adjustment | Employee ID, check-in timestamp, worked minutes |
| `TIMEOFF_UPDATE` | Leave request submitted, approved, or rejected | Allocation remaining days, approval officer ID |
| `EMPLOYEE_UPDATE` | Employee profile edited, contract status changed | Full employee entity payload |
| `NOTIFICATION` | System announcements, compliance reminders | In-app notification badge entry |

---

## 5. End-to-End Operational Lifecycle

```mermaid
graph TD
    A[1. Employee Onboarding] --> B[2. Contract Creation & Wage Assignment]
    B --> C[3. Working Schedule Assignment]
    C --> D[4. Daily Attendance & Time-Off Tracking]
    D --> E[5. Payrun Generation - Select Period & Employees]
    E --> F[6. Mathematical Proration & Safe AST Rule Evaluation]
    F --> G[7. Two-Step Verification - Draft to Validated to Paid]
    G --> H[8. Instant Vector PDF Generation & Bulk Email Dispatch]
    H --> I[9. Audit Trail Logging & Executive Analytics]
```

---

## 6. Core Functional Modules

### Authentication & 5-Tier RBAC Matrix
NexHR implements a strict role hierarchy enforced across client-side route guards and server-side middleware:

| Role | HR & Contracts | Salary Structures & Rules | Payruns & Payslips | User Management & Audit | Impersonation |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Admin** | Full CRUD | Full CRUD | Full CRUD | Full Access | Yes (Non-Admins) |
| **HR Payroll Manager** | Full CRUD | Full CRUD | Full CRUD | View Only | No |
| **HR Payroll User** | Full CRUD | Read-Only | Create, Read, Update | No Access | No |
| **HR Manager** | Full CRUD | No Access | Blocked | No Access | No |
| **Employee** | Own Profile Only | No Access | Own Payslips Only | No Access | No |

### ServiceNow-Style User Impersonation
- **One-Click Experience**: Administrators can click "Impersonate" from the Employee Kanban card or List view.
- **Session Banner**: An amber, high-contrast banner appears at the top of the interface displaying the target user and active role, with an instant "End Session" action.
- **Full Traceability**: All actions taken while impersonating record both the target user and the impersonator's user ID in the audit trail.
- **Security Rule**: Administrators cannot impersonate other administrators.

### Employee Directory & Contract Overlap Guard
- **Dual View Modes**: Switch seamlessly between Kanban cards and dense data tables.
- **Contract Overlap Guard**: Validates that no employee can have overlapping active contracts, preventing duplicate wage disbursements.
- **Structured Working Schedules**: Dynamic assignment of 40-hour or custom shift schedules.

### Attendance Kiosk & Time-Off Lifecycle
- **Real-Time Kiosk**: Interactive check-in/out button calculating active working hours and overtime against standard schedules.
- **Multi-Type Leave Quotas**: PTO, Sick Leave, Parental, and Unpaid Leave with automatic quota deduction.
- **Approval Workflow**: Managers approve or refuse with one click; status changes trigger automated email notifications and WebSocket updates.

### Payroll Engine, Proration & Safe AST Evaluator
- **Proration Engine**:
  - Mid-month onboarding proration:
    $$\text{Prorated Wage} = \text{Wage} \times \left(\frac{\text{Eligible Working Days}}{\text{Total Working Days in Month}}\right)$$
  - Deducts proportional daily rates for approved unpaid leave days.
- **Safe Mathematical Evaluator**:
  - Replaces `eval()` and `new Function()` with a sandboxed parser.
  - Supports arithmetic (`+`, `-`, `*`, `/`), math functions (`min`, `max`, `round`, `abs`), and conditional checks (`WORKED_DAYS >= 20`).

### Batch Payrun Processing & Vector PDF Payslips
- **Multi-Step Payrun Flow**: `Draft` -> `Computed` -> `Validated` -> `Paid`.
- **Vector PDF Generator**: Generates high-fidelity, printable PDF payslips complete with company branding, employee details, earnings breakdown, statutory deductions, net payable, and verification QR code.

### Transactional Email Dispatch Subsystem
- **Resend & SMTP Queue Engine**: Built with Resend API client and Nodemailer fallback with in-memory retry queue and persistent logging in `email_logs`.
- **Automated Dispatches**:
  - Employee Welcome & Onboarding Email.
  - Leave Request Approved/Rejected Notice.
  - Bulk Payslip Notification with attached Vector PDF.

### Immutable Audit Trail Inspector
- Real-time logging of all critical mutations across Employees, Contracts, Leave Requests, Payruns, and Impersonation sessions.
- Administrative Audit Trail viewer with search, action filters, date range selection, and interactive JSON diff inspector.

### Executive Dashboard & Fluid Analytics
- **Salary Trajectory Chart**: 6-month historical net salary fund trajectory with interactive glassmorphism tooltips.
- **Cost by Department Breakdown**: Dynamic SVG donut chart breaking down organizational expenditures.
- **Live Metrics**: Headcount, active payruns, monthly payroll liabilities, and pending approvals.

---

## 7. Database Architecture & 16 Production Indexes

NexHR connects to Supabase PostgreSQL using an IPv4 transaction pooler host with 16 production B-Tree indexes:

```sql
-- High-Traffic Performance Indexes
CREATE INDEX idx_employees_department ON employees (department_id);
CREATE INDEX idx_employees_status ON employees (status);
CREATE INDEX idx_employees_email ON employees (work_email);
CREATE INDEX idx_contracts_employee ON contracts (employee_id);
CREATE INDEX idx_contracts_status ON contracts (status);
CREATE INDEX idx_attendances_employee_date ON attendances (employee_id, attendance_date);
CREATE INDEX idx_attendances_checkin ON attendances (check_in);
CREATE INDEX idx_timeoff_requests_employee ON time_off_requests (employee_id);
CREATE INDEX idx_timeoff_requests_status ON time_off_requests (status);
CREATE INDEX idx_payslips_payrun ON payslips (payrun_id);
CREATE INDEX idx_payslips_employee ON payslips (employee_id);
CREATE INDEX idx_payslip_lines_payslip ON payslip_lines (payslip_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_employee ON users (employee_id);
CREATE INDEX idx_audit_logs_record ON audit_logs (record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
```

---

## 8. Pre-Seeded Credentials & Role Matrix

Test accounts are pre-seeded in the database (all use password: `password123`):

| Role | Email Address | Password | Intended Screen Experience |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@nexhr.com` | `password123` | Unrestricted access across all modules, Audit Logs & Impersonation |
| **HR Payroll Manager** | `payroll@nexhr.com` | `password123` | Full HR operations + Salary Rule authoring + Payrun computation |
| **HR Payroll User** | `payroll.user@nexhr.com` | `password123` | Daily HR + Payrun processing (read-only rules) |
| **HR Manager** | `hr.manager@nexhr.com` | `password123` | Full HR, Attendance & Leave approvals (Payroll locked) |
| **Employee** | `amara.chen@nexhr.com` | `password123` | Self-service attendance kiosk, PTO requests, personal payslips |

*Note: The login screen contains an integrated credentials reference drawer with one-click copy.*

---

## 9. Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or v20.x+
- **npm**: v9.x or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/vinnu112p/NexHR.git
cd NexHR
```

### 2. Environment Configuration

**Backend Configuration (`backend/.env`):**
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=nexhr-production-secret-key-2026

# Supabase PostgreSQL Connection Pooler (Auto-routed by db.ts)
DATABASE_URL="postgresql://postgres.lxhnzekslxadgdatnuar:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

# Resend Email Configuration
RESEND_API_KEY="re_..."
EMAIL_FROM="NexHR Notifications <onboarding@resend.dev>"
```

**Frontend Configuration (`frontend/.env`):**
```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Start Development Servers

**Terminal 1 — Backend (Port 3000 & WebSocket /ws):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 10. Automated Testing Suite

The backend test suite covers the mathematical rule evaluator, safety sandbox, and proration engine:

```bash
cd backend
npm test
```

### Test Highlights:
- **Rule Evaluator**: Fixed additions, percentage rules (HRA 40%), capped contribution rules (PF 12% capped at $1800), and custom mathematical formulas.
- **Condition Evaluation**: Conditional salary components (`WORKED_DAYS >= 20`).
- **Safety Sandbox**: Blocks unauthorized tokens (`process`, `require`, `eval`, `constructor`).
- **Proration Engine**: Full month, mid-month hire proration, and unpaid leave deductions.

---

## 11. REST API Endpoint Reference

### Authentication & Impersonation
- `POST /api/v1/auth/login` — Authenticate and receive JWT token.
- `GET /api/v1/auth/me` — Fetch current user context and permissions.
- `POST /api/v1/auth/impersonate` — *(Admin only)* Start user impersonation session.
- `POST /api/v1/auth/end-impersonate` — Terminate impersonation and restore admin session.
- `GET /api/v1/audit-logs` — *(Admin only)* Retrieve paginated immutable audit logs.

### Employee & Contract Operations
- `GET /api/v1/employees` — Paginated list of employees with search and department filtering.
- `POST /api/v1/employees` — Create new employee (triggers welcome email and audit log).
- `PUT /api/v1/employees/:id` — Update employee profile and bank details.
- `GET /api/v1/contracts` — List active and archived contracts.
- `POST /api/v1/contracts` — Issue a new contract (with overlap validation).

### Attendance & Leaves
- `GET /api/v1/attendance` — Paginated attendance records.
- `POST /api/v1/attendance/check-in` — Register clock-in timestamp.
- `POST /api/v1/attendance/check-out` — Register clock-out timestamp.
- `GET /api/v1/timeoff/requests` — List leave requests with approval status.
- `POST /api/v1/timeoff/requests` — Submit leave request.
- `POST /api/v1/timeoff/requests/:id/approve` — Approve leave (sends email & WebSocket event).
- `POST /api/v1/timeoff/requests/:id/refuse` — Reject leave (sends email & WebSocket event).

### Payroll & Payslips
- `GET /api/v1/payroll/structures` — List configured salary structures.
- `POST /api/v1/payroll/structures` — Create a new salary structure.
- `GET /api/v1/payroll/payruns` — Fetch monthly payrun batches.
- `POST /api/v1/payroll/payruns` — Initialize and compute a new payrun.
- `PATCH /api/v1/payroll/payruns/:id/validate` — Validate draft payrun.
- `PATCH /api/v1/payroll/payruns/:id/pay` — Mark payrun as paid.
- `GET /api/v1/payroll/payslips/:id/pdf` — Stream high-fidelity vector PDF payslip.
- `POST /api/v1/payroll/payruns/:id/send-payslips` — Bulk email payslips with PDF attachments.

---

## 12. Project Directory Layout

```text
NexHR/
├── backend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── db.ts               # Connection pool & query helpers
│   │   │   ├── schema.ts           # DDL & database structure
│   │   │   ├── seed.ts             # Initial master seed data
│   │   │   ├── audit.ts            # Immutable audit logging engine
│   │   │   ├── email.ts            # Transporter & queue dispatch (Resend/SMTP)
│   │   │   ├── email-templates.ts  # HTML email layout generators
│   │   │   ├── auth.ts             # JWT signing & verification middleware
│   │   │   ├── websocket.ts        # Real-time WebSocket event broadcaster
│   │   │   └── pdf-generator.ts    # Vector PDF payslip builder
│   │   ├── modules/
│   │   │   ├── identity/           # Users, RBAC, impersonation, audit routes
│   │   │   ├── employee-mgmt/      # Employees, departments, contracts
│   │   │   ├── time-attendance/    # Punches, shifts, leave requests
│   │   │   ├── payroll-engine/     # Payruns, payslips, rule evaluator, proration
│   │   │   └── dashboard/          # Aggregated executive analytics
│   │   └── server.ts               # Application entry point
│   └── tests/                      # Unit & integration test suites
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Shared UI components (Banner, Navbar, SubNav, Logo)
│   │   ├── context/                # AuthContext (with Impersonation state)
│   │   ├── features/
│   │   │   ├── audit/              # Audit Trail Page & JSON Diff Inspector
│   │   │   ├── employee/           # Kanban, Employee Detail, Create Wizard
│   │   │   ├── contract/           # Contract creation & timeline management
│   │   │   ├── attendance/         # Check-in/out kiosk & punch history
│   │   │   ├── timeoff/            # Leave calendar, quotas & approval dashboard
│   │   │   ├── payroll/            # Payrun wizard, batch computing, payslip PDF view
│   │   │   ├── dashboard/          # Real-time charts, KPIs & activity feeds
│   │   │   └── landing/            # Modern corporate landing page & 3D canvas
│   │   └── services/               # Axios API client & WebSocket listeners
│   └── index.html
├── ARCHITECTURE.md                 # Technical specification & architecture design
└── README.md                       # Main project documentation & setup guide
```

---

## 13. License & Compliance

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
All operational modules adhere to statutory tax calculations, data immutability, and 5-tier role-based access control guidelines.