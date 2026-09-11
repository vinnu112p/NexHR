# 🌟 PeoplePay360 — Next-Gen HR & Payroll Operations Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg?logo=express)](https://expressjs.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Realtime_WS-orange.svg?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791.svg?logo=postgresql)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **PeoplePay360** is a full-stack, enterprise-grade HR & Payroll operations ecosystem built for modern businesses. Designed from the ground up to replace disconnected spreadsheets and legacy software, PeoplePay360 connects **Employee Identity**, **Contracts**, **Working Schedules**, **Live Attendance/Leaves**, **Rule-Driven Payroll Engine**, and **Real-Time WebSocket Synchronization** into one unified, auditable operational flow.

---

## 📑 Table of Contents

1. [Project Overview & Key Value Propositions](#-project-overview--key-value-propositions)
2. [High-Level System Architecture](#-high-level-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Real-Time WebSocket Subsystem](#-real-time-websocket-subsystem)
5. [End-to-End Operational Workflow](#-end-to-end-operational-workflow)
6. [Core Functional Modules](#-core-functional-modules)
   - [1. Authentication & 5-Tier RBAC](#1-authentication--5-tier-rbac)
   - [2. Employee Hub & Contract Management](#2-employee-hub--contract-management)
   - [3. Attendance & Time-Off Lifecycle](#3-attendance--time-off-lifecycle)
   - [4. Payroll Calculation Engine & Proration](#4-payroll-calculation-engine--proration)
   - [5. Payrun Batch Processing & Vector PDF Payslips](#5-payrun-batch-processing--vector-pdf-payslips)
   - [6. Email Dispatch & Audit Logs](#6-email-dispatch--audit-logs)
   - [7. Executive Dashboard & Fluid Analytics](#7-executive-dashboard--fluid-analytics)
   - [8. Modern Landing Page](#8-modern-landing-page)
7. [Database Schema & Cloud Connectivity](#-database-schema--cloud-connectivity)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Pre-Seeded Credentials & Role Matrix](#-pre-seeded-credentials--role-matrix)
10. [Automated Testing Suite](#-automated-testing-suite)
11. [REST API Endpoint Reference](#-rest-api-endpoint-reference)
12. [Project Directory Layout](#-project-directory-layout)

---

## 💡 Project Overview & Key Value Propositions

Traditional HR and Payroll systems operate in silos: attendance sits in a biometric punch kiosk, leave records live in approval emails, contracts are stored in file cabinets, and payroll is calculated via fragile spreadsheets. This fragmentation leads to:
- **Calculation Errors**: Missing mid-month hires, unpaid leaves, or overtime in wage proration.
- **Manual Overhead**: Disjointed exports, imports, and manual email attachments.
- **Security Vulnerabilities**: Lack of fine-grained role-based access control (RBAC).
- **Zero Real-Time Visibility**: Finance officers waiting days for batch payroll reconciliations.

**PeoplePay360 solves this with an integrated event-driven architecture**:
1. **Employee as the Single Source of Truth**: All operational contexts (contracts, shifts, leaves, bank accounts) anchor directly to the employee master record.
2. **Automated Mathematical Proration Engine**: Automatically calculates calendar-day and working-day proration for mid-month hires, resignations, and unpaid leaves.
3. **Dynamic Rule Evaluator with AST Execution**: Complex multi-tier salary structures (Basic, HRA, Travel, Performance Bonuses, Provident Fund, Tax brackets) evaluated through configurable mathematical expressions.
4. **Sub-second Real-Time WebSocket Synchronization**: Multi-tab and multi-user live broadcasts when attendances are clocked, leave requests submitted, or payrun batches processed.
5. **Production-Ready Seed Dataset**: Over 200 verified employee profiles, active contracts, 6-month compensation history, and attendance records pre-seeded on Supabase PostgreSQL.

---

## 🏛 High-Level System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer ["Frontend Client Layer (Vite + React 18 + TS)"]
        UI["Modern UI / Responsive Views"]
        AuthContext["Auth Context (JWT + RBAC)"]
        RealtimeCtx["RealtimeContext (WebSocket Client)"]
        LandingPage["Interactive Landing Page"]
    end

    subgraph GatewayLayer ["Networking & Ingestion"]
        HTTP["Express 4.19 REST API (/api/v1)"]
        WS["WebSocket Server (/ws)"]
        Static["Vector Static Assets & PDF Stream"]
    end

    subgraph CoreEngine ["Backend Application Core (Node.js + TS)"]
        AuthGuard["JWT Auth & Role Guard Middleware"]
        EmpModule["Identity & Employee Module"]
        TimeModule["Attendance & Leave Module"]
        PayrollEngine["Payroll Calculation Engine"]
        RuleAST["Salary Rule Evaluator"]
        ProrationEngine["Mid-Month Proration Engine"]
        PDFGen["PDFKit Vector Generator"]
        WSBroadcaster["WebSocket Event Broadcaster"]
    end

    subgraph DataLayer ["Supabase Cloud Database (PostgreSQL)"]
        DBPool["pg Connection Pool (IPv4 Pooler)"]
        Tables[("208 Employees, Contracts, Attendances, Payruns, Payslips, Email Logs")]
    end

    UI <--> |HTTP Requests| HTTP
    RealtimeCtx <--> |Bi-directional WS /ws| WS
    HTTP --> AuthGuard
    AuthGuard --> EmpModule & TimeModule & PayrollEngine
    PayrollEngine --> RuleAST & ProrationEngine
    PayrollEngine --> PDFGen
    EmpModule & TimeModule & PayrollEngine --> WSBroadcaster
    WSBroadcaster --> |Broadcast JSON Events| WS
    EmpModule & TimeModule & PayrollEngine --> DBPool
    DBPool --> Tables
```

---

## 🛠 Technology Stack

### Frontend
| Layer / Tech | Purpose | Details |
| :--- | :--- | :--- |
| **React 18.3** | View Engine | Functional components with Hooks, Concurrent Mode ready |
| **TypeScript 5.3** | Static Typing | Strict mode enabled, zero `any` across business domains |
| **Vite 5.4** | Bundler & Dev Server | Ultra-fast HMR, Rollup optimized code splitting |
| **Tailwind CSS 3.4** | Design Tokens | Custom HSL violet-indigo fintech palette (`#4F46E5`, `#5B4FE9`) |
| **Lucide React** | Vector Iconography | Clean, consistent enterprise icon system |
| **HTML5 Canvas / CSS 3D** | Interactive Visuals | Particle simulation, tilted 3D hero showcase, interactive AST slider |

### Backend
| Layer / Tech | Purpose | Details |
| :--- | :--- | :--- |
| **Node.js (v20+)** | Runtime Environment | High-performance asynchronous event loop |
| **Express 4.19** | HTTP Application Framework | Modular route controllers, input validation, CORS security |
| **TypeScript / `tsx`** | Backend Typing & Execution | Native execution without build steps during development |
| **`ws` (WebSocket)** | Real-Time Engine | RFC 6455 compliant persistent WebSocket server mounted at `/ws` |
| **`pg` (node-postgres)** | Database Driver | High-throughput connection pooling with SSL support |
| **`pdfkit`** | Document Generation | Programmatic vector PDF payslips with exact table layouts |
| **`jsonwebtoken`** | Authentication | Stateless HMAC-SHA256 JWT tokens with role claims |

### Database & Cloud
| Technology | Details |
| :--- | :--- |
| **Supabase PostgreSQL** | Cloud-hosted relational database (`aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`) |
| **Relational Integrity** | Foreign keys, cascading deletes, `TIMESTAMP WITH TIME ZONE`, `NUMERIC(12, 2)` currencies |
| **Automatic Schema DDL** | Idempotent `initDb()` bootstrap executes migrations and creates tables on startup |

---

## ⚡ Real-Time WebSocket Subsystem

PeoplePay360 features a built-in, production-grade WebSocket engine that enables multi-client real-time synchronization without manual polling or page reloads.

```mermaid
sequenceDiagram
    autonumber
    actor HR as HR Payroll Manager (Tab A)
    participant WS as Backend WebSocket (/ws)
    actor Emp as Employee (Tab B)

    HR->>WS: Process Payrun (POST /api/payroll/payruns/pr_1/validate)
    Note over WS: PayrollController executes PayrunService<br/>and generates Payslips
    WS-->>HR: HTTP 200 OK (Payrun Validated)
    WS->>WS: broadcastEvent(PAYROLL_UPDATE)
    WS-->>HR: WS Broadcast { type: 'PAYROLL_UPDATE', action: 'PAYRUN_VALIDATED' }
    WS-->>Emp: WS Broadcast { type: 'PAYROLL_UPDATE', notification: 'Payrun Validated' }
    Note over Emp: RealtimeContext receives event,<br/>displays toast notification,<br/>and triggers auto-refresh of Payslip table
```

### 1. Connection Architecture
- The WebSocket server is mounted directly alongside Express on the same HTTP server at `ws://localhost:3000/ws`.
- **Heartbeat Protocol**: A 30-second ping/pong cycle automatically prunes stale or disconnected clients.
- **Auto-Reconnection**: The client-side `RealtimeContext` employs an exponential-backoff reconnection loop if the network connection is interrupted.

### 2. Event Types & Payloads
| Event Type | Trigger | Broadcast Action & Payload |
| :--- | :--- | :--- |
| `PAYROLL_UPDATE` | Salary rule saved, payrun created, validated, or marked paid | Payrun summary, toast notification with status badge |
| `ATTENDANCE_UPDATE` | Web kiosk punch check-in, check-out, or manual correction | Employee ID, check-in timestamp, worked minutes |
| `TIMEOFF_UPDATE` | Leave request submitted, approved, or rejected | Allocation remaining days, approval officer ID |
| `EMPLOYEE_UPDATE` | Employee profile edited, contract status changed | Full employee entity payload |
| `NOTIFICATION` | System-wide announcements, compliance reminders | In-app notification bell entry |

### 3. Client-Side Subscription Hook
Components subscribe to specific events effortlessly using the custom `useRealtimeSubscription` hook:

```tsx
import { useRealtimeSubscription } from '@/context/RealtimeContext';

export const PayrunsListPage = () => {
  const [payruns, setPayruns] = useState([]);

  // Auto-refetches the list whenever any user updates payroll
  useRealtimeSubscription('PAYROLL_UPDATE', (event) => {
    console.log('Realtime event received:', event);
    fetchPayruns();
  });

  return (/* JSX */);
};
```

---

## 🔄 End-to-End Operational Workflow

PeoplePay360 models the complete employee lifecycle from recruitment to salary disbursement:

```mermaid
graph TD
    A[1. Employee Onboarding] --> B[2. Contract Creation & Wage Assignment]
    B --> C[3. Working Schedule Assignment]
    C --> D[4. Daily Attendance & Time-Off Tracking]
    D --> E[5. Payrun Generation - Select Period & Employees]
    E --> F[6. Mathematical Proration & Salary Rule AST Computation]
    F --> G[7. Two-Step Verification - Draft to Validated to Paid]
    G --> H[8. Instant Vector PDF Generation & Email Dispatch]
    H --> I[9. Financial Reconciliation & Executive Dashboard]
```

### The Standard Scenario (e.g., Amara Chen)
1. **Onboarding**: Amara Chen is created under the `dept_sales` department with job title *Sales Associate*.
2. **Contracting**: Active contract `CNT-2026-001` is attached with a base wage of `$4,500.00/mo` and salary structure `struct_3` (*Sales & Performance*).
3. **Working Schedule**: Attached to standard 40h/week schedule (`sched_std_40h`, Mon–Fri 9 AM – 5 PM).
4. **Attendance & PTO**: Amara clocks in daily via the Attendance Widget. PTO leave request of 3 days is approved by HR.
5. **Payrun Generation**: HR Payroll Officer opens September 2026 Payrun. The system scans eligible active contracts, evaluates rules (`BASIC`, `COMM`, `TA`, `PF`, `TAX`), applies proration if applicable, and computes Net Salary.
6. **Delivery**: The payrun is validated. An auditable PDF payslip is compiled, and batch email dispatch logs records into `email_logs`.

---

## 🧩 Core Functional Modules

### 1. Authentication & 5-Tier RBAC
Enforced both client-side (route guards) and server-side (middleware validation):

| Role | HR Modules (Employees, Contracts, Attendance) | Salary Structures & Rules | Payruns & Payslips | User & Role Management | Executive Dashboard |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Admin** | Full CRUD | Full CRUD | Full CRUD | Full Access | Full Access |
| **HR Payroll Manager** | Full CRUD | Full CRUD | Full CRUD | No Access | Full Access |
| **HR Payroll User** | Full CRUD | Read-Only | Create, Read, Update | No Access | View Only |
| **HR Manager** | Full CRUD | No Access | Blocked | No Access | No Access |
| **Employee** | Own profile & leaves only | No Access | No Access | No Access | No Access |

### 2. Employee Hub & Contract Management
- **Dual View Modes**: Switch between a responsive Kanban card layout and high-density data grid.
- **Contract Safety Guard**: Strictly enforces that an employee can have only **one** active (`running`) contract at any given time, preventing duplicate salary disbursements.
- **Profile Customization**: Users can update personal details, emergency contacts, bank IFSC/account numbers, and choose from curated AI/Vector avatars.

### 3. Attendance & Time-Off Lifecycle
- **Interactive Check-In / Check-Out Widget**: Real-time counter calculating worked hours, overtime, and break intervals.
- **Multi-Type Time Off**: Paid Time Off (PTO), Sick Leave, Parental Leave, and Unpaid Leave with individual balance tracking.
- **Approval Workflow**: Pending requests are flagged for HR Managers and HR Payroll Users with one-click *Approve* or *Refuse* actions and automatic leave balance reconciliation.

### 4. Payroll Calculation Engine & Proration
The engine calculates exact gross and net wages using sequential rule evaluation:
- **Computation Methods**:
  - `Fixed`: Exact dollar amounts (e.g., Base Wage = `$4,500.00`).
  - `Percentage`: Percentage of base or gross (e.g., HRA = `40%`, PF = `12%`).
  - `Formula`: Dynamic expression evaluation (e.g., `BASIC * 0.10 + 250`).
- **Proration Engine**:
  - Handles mid-month joining dates:
    $$\text{Prorated Wage} = \text{Wage} \times \left(\frac{\text{Eligible Working Days}}{\text{Total Working Days in Month}}\right)$$
  - Handles unpaid leaves by deducting proportional daily rates.

### 5. Payrun Batch Processing & Vector PDF Payslips
- **Two-Step Wizard**: Create Draft Payrun $\rightarrow$ Review & Compute $\rightarrow$ Validate $\rightarrow$ Release / Mark as Paid.
- **Vector PDF Generator**: Generates high-fidelity, printable PDF payslips with company branding, employee details, earnings breakdown, statutory deductions, and net wage summary.

### 6. Email Dispatch & Audit Logs
- Automatically dispatches payslips to employee emails upon payrun approval.
- Every outgoing email is logged in PostgreSQL with recipient, timestamp, status (`Sent` / `Failed`), and error diagnostics.

### 7. Executive Dashboard & Fluid Analytics
- **Fluid Glass Trend Chart**: Smooth SVG Bézier curve visualization showing 6-month historical net salary fund trajectories with interactive glassmorphism tooltips.
- **Cost by Department Donut**: Dynamic SVG donut chart breaking down organizational spend across Engineering, Sales, HR, and Finance.
- **Real-Time Stat Counters**: Active employee headcount, running monthly liability, average salary, and pending payruns.

### 8. Modern Landing Page
- **Light Theme**: Clean, professional design system (`#F8F9FD` canvas, `#5B4FE9` accent).
- **3D Tilted Dashboard Preview**: Perspective-transformed live dashboard mockup showcasing metrics, graphs, and transaction tables.
- **18-Second Code-Simulated Demo Video**: Interactive, choreographed viewport simulating automated payrun validation and PDF generation with zero external video dependencies.
- **3x3 Bento Grid**: Interactive AST formula slider, live punch-clock biometric simulator, vector payslip card, and security overview.

---

## 🗄 Database Schema & Cloud Connectivity

PeoplePay360 connects to a high-availability Supabase PostgreSQL database:
- **Connection Host**: `aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`
- **Fallback Engine**: The backend's `db.ts` automatically converts legacy direct connection strings to the IPv4 transaction pooler host, ensuring seamless connections across all OS environments.
- **Auto-Migrations**: The `initDb()` routine runs on server boot, guaranteeing all required tables, columns, indexes, and initial records exist.

### Core Tables
1. `users` — Authentication credentials, role bindings, avatar URLs.
2. `roles` — RBAC permission tier definitions.
3. `employees` — Master records, contact info, job position, department link.
4. `departments` — Department hierarchy, codes (`ENG`, `SALES`, `HR`, `FIN`).
5. `contracts` — Employment terms, wage, salary structure ID, running/closed status.
6. `working_schedules` & `working_schedule_days` — Shift hours and break allocations.
7. `time_off_types`, `time_off_allocations`, `time_off_requests` — Leave management.
8. `attendances` — Clock-in/out timestamps, worked hours, manual adjustments.
9. `salary_structures` & `salary_rules` — Mathematical computation rules.
10. `payruns` & `payslips` & `payslip_lines` — Processed payroll records.
11. `email_logs` — Payslip delivery tracking.
12. `audit_logs` — Traceable mutation log for security compliance.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or v20.x+
- **npm**: v9.x or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Dhruv4848l/Odoo-2026-Final.git
cd Odoo-2026-Final
```

### 2. Environment Configuration
The repository includes `.env.example` templates that connect directly to the shared Supabase cloud database.

**Backend Configuration (`backend/.env`):**
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=peoplepay360-dev-secret-key-2026

# Supabase PostgreSQL Connection Pooler
DATABASE_URL="postgresql://postgres.iejfvpcbkulrbzkfbdfu:%24OdooHackathon420@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres"
```

**Frontend Configuration (`frontend/.env`):**
```env
VITE_API_BASE_URL="/api/v1"
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start Development Servers
Open two terminal windows:

**Terminal 1 — Backend (Port 3000 & WebSocket /ws):**
```bash
cd backend
npm run dev
```
> Output confirms: `⚡ [WebSocket] Real-time engine mounted at /ws` and `Server listening on port 3000`.

**Terminal 2 — Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```
> Access the application at **`http://localhost:5173`**.

---

## 🔑 Pre-Seeded Credentials & Role Matrix

The Supabase cloud database is populated with **208 active employees** and accounts. You can log in using any of the following credentials (all use password: `password123`):

| Role | Email Address | Password | Intended Screen Experience |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@peoplepay360.com` | `password123` | Unrestricted access across all modules & settings |
| **HR Payroll Manager** | `payroll@peoplepay360.com` | `password123` | Full HR operations + Salary Rule authoring + Payruns |
| **HR Payroll User** | `hr.payroll@peoplepay360.com` | `password123` | Daily HR + Payrun processing (read-only rules) |
| **HR Manager** | `hr.manager@peoplepay360.com` | `password123` | Full HR, Attendance & Leave approval (Payroll locked) |
| **Employee** | `amara.chen@peoplepay360.com` | `password123` | Self-service attendance kiosk, PTO requests, own payslips |

> 💡 **Quick Login Tip**: The Login page features a slide-out **"Demo Credentials Drawer"** allowing one-click auto-fill for all five testing accounts.

---

## 🧪 Automated Testing Suite

The backend includes automated unit test suites for the Payroll Rule Evaluator and Proration Engine:

```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **Rule Evaluator**:
  - `Fixed` rule addition ($4,500 basic).
  - `Percentage` calculations (HRA 40%, PF 12%).
  - Capped maximum/minimum contribution boundaries.
  - Complex mathematical formulas with variable references.
- **Proration Engine**:
  - Full-month standard calculations (no deduction).
  - Mid-month onboarding date proration (e.g., hire date on 15th of month).
  - Deductions for unpaid leave occurrences against standard working days.

---

## 📡 REST API Endpoint Reference

### Authentication & Employee Identity
- `POST /api/v1/auth/login` — Authenticate and receive JWT token with role claims.
- `GET /api/v1/auth/me` — Fetch current user context and permissions.
- `GET /api/v1/employees` — Paginated list of employees with search and department filters.
- `POST /api/v1/employees` — Create a new employee master record.
- `PUT /api/v1/employees/:id` — Update employee profile and banking details.
- `GET /api/v1/contracts` — List active and archived contracts.
- `POST /api/v1/contracts` — Issue a new employment contract.

### Attendance & Leaves
- `GET /api/v1/attendance` — Fetch attendance records and daily punches.
- `POST /api/v1/attendance/check-in` — Register clock-in timestamp.
- `POST /api/v1/attendance/check-out` — Register clock-out timestamp.
- `GET /api/v1/timeoff/requests` — List leave requests with approval status.
- `POST /api/v1/timeoff/requests` — Submit leave request.
- `PATCH /api/v1/timeoff/requests/:id/approve` — Approve pending time off.

### Payroll Operations
- `GET /api/v1/payroll/structures` — List all configured salary structures.
- `POST /api/v1/payroll/structures` — Create a new salary structure.
- `POST /api/v1/payroll/rules` — Add a salary computation rule.
- `GET /api/v1/payroll/payruns` — Fetch all monthly payrun batches.
- `POST /api/v1/payroll/payruns` — Initialize a new payrun calculation.
- `PATCH /api/v1/payroll/payruns/:id/validate` — Validate draft payrun.
- `PATCH /api/v1/payroll/payruns/:id/pay` — Mark payrun as paid (releases bank funds).
- `GET /api/v1/payroll/payslips/:id/pdf` — Stream generated vector PDF payslip.
- `POST /api/v1/payroll/payruns/:id/send-payslips` — Trigger bulk email delivery.

### Reporting & Analytics
- `GET /api/v1/dashboard/overview` — High-level KPI summary cards.
- `GET /api/v1/dashboard/salary-trend` — 6-month historical net salary expenditure.
- `GET /api/v1/dashboard/cost-by-department` — Spend breakdown by department.

---

## 📂 Project Directory Layout

```text
PeoplePay360/
├── backend/                             # Express + Node.js + WebSocket Backend
│   ├── src/
│   │   ├── core/                        # DB pool, Auth middleware, WebSocket server
│   │   │   ├── auth.ts                  # JWT token verification & role guards
│   │   │   ├── db.ts                    # PostgreSQL pool connection & initDb DDL
│   │   │   └── websocket.ts             # RFC 6455 WebSocket engine & broadcaster
│   │   ├── modules/
│   │   │   ├── identity-employee/       # Employee master, contracts, schedules
│   │   │   ├── attendance-timeoff/      # Clock-in/out, leave allocations & requests
│   │   │   ├── payroll-engine/          # Payrun wizard, salary rules, AST evaluator
│   │   │   │   ├── services/
│   │   │   │   │   ├── rule-evaluator.service.ts
│   │   │   │   │   ├── proration-engine.service.ts
│   │   │   │   │   ├── pdf-generator.service.ts
│   │   │   │   │   └── payslip.service.ts
│   │   │   │   └── payroll.controller.ts
│   │   │   └── reporting-platform/      # Analytics, trends, department cost APIs
│   │   ├── scripts/                     # Reproducible seeding utilities
│   │   │   ├── seed_200_users.ts
│   │   │   ├── seed_dashboard_payroll.ts
│   │   │   └── seed_trend_history.ts
│   │   └── server.ts                    # Application bootstrap & route registration
│   ├── tests/                           # Automated unit test suites
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                            # Vite + React 18 + Tailwind Frontend
│   ├── src/
│   │   ├── components/                  # Reusable UI library & brand marks
│   │   │   ├── brand/Logo.tsx           # Continuous 360° gradient vector logo
│   │   │   ├── ui/                      # Badge, Button, Card, Input, Pagination
│   │   │   └── UserProfileModal.tsx     # Profile & avatar selector modal
│   │   ├── context/                     # Global state providers
│   │   │   ├── AuthContext.tsx          # Session persistence & RBAC permissions
│   │   │   └── RealtimeContext.tsx      # WebSocket client & event subscriptions
│   │   ├── features/                    # Domain-driven feature modules
│   │   │   ├── landing/                 # Modern landing page & interactive showcases
│   │   │   │   ├── components/          # Hero, Ecosystem, Demo Video, Bento Grid
│   │   │   │   └── pages/LandingPage.tsx
│   │   │   ├── auth-employee/           # Login, Employee Kanban/List, Contracts
│   │   │   ├── attendance-timeoff/      # Punch Widget, Attendance list, PTO overview
│   │   │   ├── payroll/                 # Payrun processing wizard, Salary structures
│   │   │   └── dashboard-reports/       # Executive dashboard, Fluid glass charts
│   │   ├── layouts/                     # Primary top navigation & secondary sub-nav
│   │   ├── lib/avatar.ts                # Avatar asset registry & fallback engine
│   │   ├── routes.config.tsx            # Protected route declarations
│   │   └── App.tsx                      # Root application wrapper
│   ├── tailwind.config.js               # Theme colors, gradients, custom shadows
│   ├── vite.config.ts                   # Proxy configuration & plugins
│   └── package.json
│
├── database/                            # Reference migrations and seeds
├── docs/                                # Project documentation assets
├── README.md                            # Comprehensive Engineering Guide
└── package.json                         # Monorepo root scripts
```

---

## 📄 License & Credits

Built with ❤️ for the **Odoo 2026 Hackathon**.  
Released under the **MIT License**.