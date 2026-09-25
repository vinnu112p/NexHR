# 🏛 NexHR — System Architecture & Technical Specification

> **NexHR** is a mission-critical, enterprise-grade HR & Payroll operations ecosystem built for modern businesses. It combines fine-grained **Identity & Impersonation**, **Multi-Tier RBAC**, **Automated Mathematical Proration**, **AST-Based Payroll Execution**, **Real-Time WebSocket Synchronization**, **Transactional Email Dispatch with PDF Generation**, and an **Immutable Audit Trail**.

---

## 📑 Table of Contents
1. [Executive Summary & Architectural Goals](#1-executive-summary--architectural-goals)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Core Subsystems](#3-core-subsystems)
   - [Identity, RBAC & ServiceNow-Style Impersonation](#identity-rbac--servicenow-style-impersonation)
   - [Employee Hub & Contract Lifecycle](#employee-hub--contract-lifecycle)
   - [Time, Attendance & Overtime Engine](#time-attendance--overtime-engine)
   - [Leave & Time-Off Lifecycle](#leave--time-off-lifecycle)
   - [Payroll Engine, Proration & Safe AST Evaluator](#payroll-engine-proration--safe-ast-evaluator)
   - [Transactional Email & PDF Generation Subsystem](#transactional-email--pdf-generation-subsystem)
   - [Immutable Audit Trail Subsystem](#immutable-audit-trail-subsystem)
   - [Real-Time WebSocket Event Bus](#real-time-websocket-event-bus)
4. [Database Design & Performance Hardening](#4-database-design--performance-hardening)
   - [PostgreSQL Indexing Strategy](#postgresql-indexing-strategy)
   - [Connection Pooling & IPv4 Pooler Routing](#connection-pooling--ipv4-pooler-routing)
   - [N+1 Query Elimination & Bulk Batching](#n1-query-elimination--bulk-batching)
5. [Security Architecture](#5-security-architecture)
6. [Directory Structure](#6-directory-structure)

---

## 1. Executive Summary & Architectural Goals

NexHR was architected to solve the endemic fragmentation of enterprise HR and payroll operations, where attendance, leave approvals, contracts, and compensation calculation historically run in separate silos or fragile spreadsheets.

### Primary Architectural Objectives:
- **Zero Calculation Discrepancies**: Mathematical proration engine computes calendar-day and working-day wages for mid-month hires, resignations, and unpaid leaves down to the exact cent.
- **Enterprise-Grade Security**: Bcrypt-hashed credentials, mandatory JWT signatures, SQL injection parameterization, and isolated mathematical sandboxing.
- **Sub-Second Performance at Scale**: 16 dedicated B-Tree indexes, server-side pagination, parallelized dashboard execution, and elimination of N+1 database roundtrips.
- **Operational Transparency**: Complete audit trails capturing before-and-after states for every critical entity mutation.
- **Support & Troubleshooting Efficiency**: ServiceNow-style User Impersonation enabling administrators to view and diagnose the application directly from the perspective of any employee or manager.

---

## 2. High-Level Architecture Diagram

```
                              ┌───────────────────────────────────┐
                              │     React 18 + Vite Frontend      │
                              │  (TailwindCSS + Lucide + Canvas)  │
                              └─────────────────┬─────────────────┘
                                                │
                       REST API (JSON / JWT)    │     WebSocket (ws://)
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                 Express.js Backend Core                              │
│                                                                                       │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────┐ │
│  │     Identity & Auth     │  │     Impersonation Engine │  │   Rate Limiting (IP)  │ │
│  │ (Bcrypt + 5-Tier RBAC)  │  │  (JWT Claims + Audit)    │  │   & CORS Security     │ │
│  └────────────┬────────────┘  └─────────────┬────────────┘  └───────────┬───────────┘ │
│               │                             │                           │             │
│  ┌────────────▼─────────────────────────────▼───────────────────────────▼───────────┐ │
│  │                               Business Services                                   │ │
│  │  • Employee & Contract Service (Overlap Validation)                              │ │
│  │  • Attendance & Time-Off Engine                                                  │ │
│  │  • Payroll Engine (ProrationEngine + Safe AST Evaluator)                         │ │
│  │  • Audit Logging Service (pg-backed JSON diffs)                                  │ │
│  │  • Email Queue & Transporter (Nodemailer + Vector PDF Generator)                 │ │
│  └──────────────────────────────────────────┬───────────────────────────────────────┘ │
│                                             │                                         │
│  ┌──────────────────────────────────────────▼───────────────────────────────────────┐ │
│  │                                Core DB Layer                                     │ │
│  │  • Supabase Connection Pool (pg.Pool, max: 20, idleTimeout: 30s)                 │ │
│  │  • IPv4 Pooler Auto-Rewriter (aws-0-ap-south-1.pooler.supabase.com:6543)          │ │
│  └──────────────────────────────────────────┬───────────────────────────────────────┘ │
└─────────────────────────────────────────────┼─────────────────────────────────────────┘
                                              │
                                              ▼
                             ┌───────────────────────────────────┐
                             │       PostgreSQL (Supabase)       │
                             │  16 Optimized Indexes + Foreign   │
                             │  Key Constraints & Audit Tables   │
                             └───────────────────────────────────┘
```

---

## 3. Core Subsystems

### Identity, RBAC & ServiceNow-Style Impersonation
- **5-Tier Role-Based Access Control**:
  - `Admin`: Full organizational control, system configurations, audit log inspection, user impersonation.
  - `HR Manager`: Employee lifecycle, contract authoring, salary structure definition, payrun processing.
  - `Payroll Officer`: Batch computation, payslip approval, vector PDF generation, email dispatch.
  - `Department Manager`: Direct report attendance approvals, leave request approval/rejection.
  - `Employee`: Self-service portal, check-in/out, leave applications, personal payslip downloads.
- **ServiceNow-Style Impersonation Engine**:
  - Administrators can initiate an impersonation session via `POST /api/v1/auth/impersonate` targeting any non-admin employee.
  - The server issues a cryptographically signed JWT containing:
    ```json
    {
      "id": "emp_target_user_id",
      "email": "target@nexhr.internal",
      "role": "Employee",
      "employee_id": "emp_042",
      "impersonatedBy": {
        "id": "admin_user_id",
        "email": "admin@nexhr.com",
        "name": "Vinayak Patel"
      }
    }
    ```
  - Both initiation and termination (`POST /api/v1/auth/end-impersonate`) are recorded in the audit trail.
  - While impersonating, the frontend displays an amber high-visibility session banner with an instant "End Impersonation" action.
  - Guard: Administrators are strictly prohibited from impersonating other administrators.

### Employee Hub & Contract Lifecycle
- Supports both Kanban and dense Data Table views for complete organizational oversight.
- **Contract Overlap Prevention**: When creating or renewing employment contracts, the backend validates that no two `running` contracts exist for the same employee over conflicting date ranges.
- Dynamic wage anchoring, structured working schedules, and salary structure linking.

### Time, Attendance & Overtime Engine
- Real-time check-in and check-out tracking with automated worked hours computation.
- Overtime calculation against standard weekly schedules (40h/week or 8h/day baseline).
- High-performance indexing on `(employee_id, attendance_date)` ensures rapid monthly time card aggregation during payroll processing.

### Leave & Time-Off Lifecycle
- Configurable leave types (Paid Vacation, Sick Leave, Unpaid Leave, Maternity, Bereavement).
- Direct deduction against allocated employee quotas upon manager approval.
- Integrated automated email dispatch upon status change (`Approved` / `Rejected`).

### Payroll Engine, Proration & Safe AST Evaluator
- **Deterministic Two-Phase Execution**:
  1. **Phase 1: Proration Engine (`ProrationEngine`)**:
     - Determines exact calendar days in the pay period.
     - Computes active service days for mid-month hires and terminations.
     - Subtracts approved unpaid leave days.
     - Produces prorated base wage and calculates overtime pay multipliers.
  2. **Phase 2: Dynamic Salary Rule Execution (`RuleEvaluator` + `SafeEvaluator`)**:
     - Eliminates unsafe `eval()` and `new Function()` vulnerabilities.
     - Uses an isolated AST/token validator allowing safe mathematical expressions (`+`, `-`, `*`, `/`, `%`, `min()`, `max()`, `round()`, `abs()`) and conditional evaluations (`WORKED_DAYS >= 20`, `job_position == 'Store Supervisor'`).
     - Supports sequential rule dependencies (e.g., `BASIC` -> `HRA` (40%) -> `GROSS` -> `PF` (12% capped at $1800) -> `NET`).

### Transactional Email & PDF Generation Subsystem
- **Asynchronous Mailer Queue**:
  - Backed by Nodemailer SMTP with automatic in-memory retry queue.
  - Logs all outgoing dispatches to `email_logs` table (`PENDING`, `SENT`, `FAILED`).
- **Responsive HTML Templates**:
  - `employee-welcome.html`: Onboarding credentials, portal link, security guidance.
  - `leave-status.html`: Real-time notification of approved or rejected time-off requests.
  - `payslip-notification.html`: Pay period summary with embedded vector PDF payslip attachment.
- **PDF Payslip Engine**:
  - High-fidelity vector PDF generation featuring NexHR enterprise branding, line-by-line earnings, statutory deductions, net payable amount, and verification QR code.

### Immutable Audit Trail Subsystem
- Captures all write operations (`POST`, `PUT`, `DELETE`) across Employees, Contracts, Leave Requests, and Payrun status transitions.
- Stores:
  - `actor_id` & `actor_email` (including `impersonated_by` if applicable).
  - `action` (`CREATE`, `UPDATE`, `APPROVE`, `REJECT`, `VALIDATE_PAYRUN`, `PAY_PAYRUN`, `IMPERSONATE_START`, `IMPERSONATE_END`).
  - `entity_type` & `entity_id`.
  - `old_values` & `new_values` as structured JSON.
  - Client IP address and timestamp.
- Frontend includes an administrative Audit Trail Inspector with search, action filtering, date ranges, and interactive JSON diff expansion.

### Real-Time WebSocket Event Bus
- Native WebSocket subsystem (`ws://`) transmitting live notifications across clients.
- Events:
  - `ATTENDANCE_PUNCH`: Instant team dashboard attendance update.
  - `LEAVE_STATUS_CHANGED`: Manager approval broadcast to employee.
  - `PAYRUN_COMPUTED`: Batch calculation completion notification to finance teams.

---

## 4. Database Design & Performance Hardening

NexHR uses PostgreSQL hosted on Supabase, heavily optimized for high concurrency and sub-second query latency.

### PostgreSQL Indexing Strategy
The following 16 B-Tree indexes were created and verified in production:

```sql
-- Employee indexes
CREATE INDEX idx_employees_department ON employees (department_id);
CREATE INDEX idx_employees_status ON employees (status);
CREATE INDEX idx_employees_email ON employees (work_email);

-- Contract indexes
CREATE INDEX idx_contracts_employee ON contracts (employee_id);
CREATE INDEX idx_contracts_status ON contracts (status);

-- Attendance & Time-off indexes
CREATE INDEX idx_attendances_employee_date ON attendances (employee_id, attendance_date);
CREATE INDEX idx_attendances_checkin ON attendances (check_in);
CREATE INDEX idx_timeoff_requests_employee ON time_off_requests (employee_id);
CREATE INDEX idx_timeoff_requests_status ON time_off_requests (status);

-- Payroll & Payslip indexes
CREATE INDEX idx_payslips_payrun ON payslips (payrun_id);
CREATE INDEX idx_payslips_employee ON payslips (employee_id);
CREATE INDEX idx_payslip_lines_payslip ON payslip_lines (payslip_id);

-- Identity & Audit indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_employee ON users (employee_id);
CREATE INDEX idx_audit_logs_record ON audit_logs (record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
```

### Connection Pooling & IPv4 Pooler Routing
- Configured using `pg.Pool` with connection reuse:
  - `max: 20` concurrent active connections.
  - `idleTimeoutMillis: 30000`.
  - `connectionTimeoutMillis: 10000`.
- Implements automatic hostname rewriting for Supabase pooled connections (`aws-0-ap-south-1.pooler.supabase.com:6543`) to guarantee compatibility across IPv4 and IPv6 network stacks.

### N+1 Query Elimination & Bulk Batching
- Replaced sequential per-payslip and per-line queries in `payslip.service.ts` with bulk `WHERE ... = ANY($1)` array queries.
- Aggregates payrun results in memory using a fast hash map lookup, dropping database roundtrips from 400+ down to **2** for a standard batch payrun.
- Parallelized executive dashboard queries (`/summary` and `/alerts`) using `Promise.all`.

---

## 5. Security Architecture

| Security Domain | Implementation Standard |
| :--- | :--- |
| **Password Storage** | Bcrypt with work factor salt (automatic lazy-migration for legacy hashes) |
| **Token Authentication** | Cryptographically signed JWTs (HMAC-SHA256) with strict expiration |
| **API Rate Limiting** | 100 requests per 15-minute window on authentication endpoints |
| **Formula Sandboxing** | Strict AST token validation blocking `eval`, `process`, `require`, `constructor` |
| **SQL Safety** | 100% parameterized queries ($1, $2, ...) eliminating SQL injection vectors |
| **Impersonation Safety** | Non-admin targets only; audit logs record both impersonator and target |
| **CORS & Headers** | Restricted origin policies with explicit JSON body size thresholds |

---

## 6. Directory Structure

```
NexHR/
├── backend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── db.ts               # Connection pool & query helpers
│   │   │   ├── schema.ts           # DDL & database structure
│   │   │   ├── seed.ts             # Initial master seed data
│   │   │   ├── audit.ts            # Immutable audit logging engine
│   │   │   ├── email.ts            # Transporter & queue dispatch
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
│   │   ├── components/             # Shared UI components (Banner, Navbar, SubNav)
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
└── ARCHITECTURE.md                 # Complete system technical specification
```
