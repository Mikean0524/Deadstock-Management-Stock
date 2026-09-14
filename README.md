# Deadstock Management System

A software-engineering prototype for recovering slow-moving retail inventory through a controlled, verified marketplace workflow. Vendors track stock, the system identifies ageing/deadstock items, eligible items are verified with proof, regulated cases are reviewed by an administrator, and only verified stock can appear in the buyer marketplace.

## Project overview

Deadstock is inventory that remains usable but is no longer moving through normal sales channels. This project demonstrates a practical recovery loop:

```text
Vendor inventory → ageing/deadstock flag → proof submission → rule-based verification
→ admin review when needed → verified listing → buyer marketplace
```

The prototype prioritizes an explainable workflow over advanced automation. Verification is deterministic and checklist-based; it does not use machine learning or computer vision.

## Features

- JWT-based authentication with `VENDOR`, `BUYER`, and `ADMIN` roles
- Vendor inventory CRUD with server-calculated ageing and deadstock statuses
- Proof submission and deterministic verification checks
- Verification outcomes: `PASS`, `REJECT`, `MANUAL_REVIEW`, and `VERIFIED`
- Administrator queue for regulated or ambiguous inventory
- Server-side verified-before-published guard for listings
- Buyer-facing marketplace browse and search experience
- React screens for login, registration, vendor dashboard, inventory, administrator review, and marketplace
- Prisma data model, PostgreSQL/Supabase-ready configuration, Supabase Storage integration points, tests, Postman collection, and GitHub Actions CI
- In-memory demo mode for running the prototype without external services

## Architecture

```text
React + TypeScript frontend
          ↓ REST API
Node.js + Express + TypeScript backend
 ├── Authentication and authorization
 ├── Inventory and ageing lifecycle
 ├── Verification rule engine and proof handling
 ├── Administrator review
 └── Listings and marketplace
          ↓
Prisma ORM → PostgreSQL / Supabase
          ↑
Supabase Storage for proof files
```

The application is a modular monolith. The frontend and backend are kept in separate folders under `code/` while sharing the same API and database contract.

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query |
| Backend | Node.js, Express.js, TypeScript, Zod |
| Authentication | JWT and bcrypt |
| Database | PostgreSQL with Prisma ORM; Supabase-compatible |
| File storage | Supabase Storage integration for verification proof files |
| Testing | Vitest, Supertest, React Testing Library, Postman |
| Automation | GitHub Actions CI and GitHub Pages project documentation |

## Repository layout

```text
code/
├── backend/       Express API, Prisma schema, seed data, tests, Postman collection
└── frontend/      React/Vite application and frontend tests
docs/              Diagrams, Gantt chart, presentation, and technical documents
journals/          Weekly progress journals
project-proposal/  Project proposal source and PDF
site/              GitHub Pages project documentation site
```

## Run locally

### Requirements

- Node.js 20 or newer
- npm

### 1. Start the backend

Open a terminal from the repository root:

```powershell
cd code\backend
npm install
npm run dev
```

The API starts at `http://localhost:4000`.

When `DATABASE_URL` is not configured, the backend uses its built-in in-memory demo store. This is the quickest way to run the prototype; changes reset whenever the backend restarts.

### 2. Start the frontend

Open another terminal from the repository root:

```powershell
cd code\frontend
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Vendor | `vendor@example.com` | `Vendor123!` |
| Admin | `admin@example.com` | `Admin123!` |
| Buyer | `buyer@example.com` | `Buyer123!` |

## Demo flow

1. Open the public marketplace to view a verified listing.
2. Sign in as a vendor and create or select inventory.
3. Use an item older than the deadstock threshold to demonstrate automatic deadstock flagging.
4. Submit the item for verification with proof.
5. Sign in as an administrator and review the manual-review item.
6. Approve the verification and browse the marketplace as a buyer.

## Use PostgreSQL and Supabase (optional)

For persistent data and real proof storage, create `code/backend/.env` from [`code/backend/.env.example`](code/backend/.env.example) and set the database, JWT, and Supabase values. Then run:

```powershell
cd code\backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

Create the configured Supabase Storage bucket (default: `verification-proofs`) before testing live proof uploads.

## Quality checks

Backend:

```powershell
cd code\backend
npm test
npm run typecheck
npm run build
```

Frontend:

```powershell
cd code\frontend
npm test
npm run typecheck
npm run build
```

## Documentation

- [Prototype demo guide](project-report-prototype-stage/PROTOTYPE_DEMO.md)
- [Backend foundation notes](docs/person2-foundation.md)
- [Integration contract](docs/person3-integration-contract.md)
- [Project diagrams](docs/Diagrams)
- [GitHub Pages project site](https://mikean0524.github.io/Deadstock-Management-Stock/)

## Authors

| Team member | Roll number |
| --- | --- |
| Abhilakshya Puri | 1024030445 |
| Farhan Kansal | 1024030451 |
| Aryan Gupta | 1024030455 |

---

Deadstock Management System · Software Engineering Prototype · Academic Year 2026–27
