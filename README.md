# Dealership SaaS MVP

Modern multi-tenant web application for small and medium-sized car dealerships to replace Excel-based inventory and daily workflow management.

## 1) Project Summary

This project is a scalable SaaS platform where each dealership has its own secure workspace and users can only access their dealership data.

The MVP focuses on:
- Simplicity
- Clean UI
- Fast daily operations
- Secure multi-user collaboration

Future versions will add advanced reporting, automation, integrations, and billing features.

---

## 2) MVP Goals

- Replace spreadsheet-based workflows
- Centralize vehicle inventory and related operations
- Enable multi-user collaboration inside a dealership
- Enforce strict tenant isolation (dealership-level data security)
- Deliver responsive UX for desktop and mobile browsers

---

## 3) Core MVP Features

### Authentication & Access
- Email/password authentication
- Role-based access (Owner, Manager, Staff)
- Session management
- Password reset flow

### Multi-Tenant SaaS
- Shared app infrastructure
- Isolated dealership workspace per tenant
- All business entities scoped by `dealership_id`

### Dashboard
- Inventory summary cards
- Vehicle status breakdown
- Recently updated vehicles
- Checklist completion insights

### Vehicle Management
- Vehicle list (table view)
- Add / Edit / Delete vehicles
- Search and filters
- Vehicle status management

### Vehicle Details Sections
- Financial information
- Transport information
- Customer information
- Operational notes

### Checklist Workflow
- Track readiness across:
  - Documents
  - Photos
  - Video
  - Social media

### File Management
- Photo uploads
- PDF uploads
- File metadata tracking

### UI/UX
- Responsive design for desktop and mobile
- Simple and clean interaction patterns

---

## 4) Recommended Tech Stack

### Frontend
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table
- React Hook Form + Zod
- TanStack Query

### Backend/API
- Next.js API Routes (MVP speed)
- Prisma ORM
- PostgreSQL

### Authentication & Security
- Auth.js (or equivalent)
- bcrypt/argon2 password hashing
- Role-based access control (RBAC)
- Tenant-aware authorization middleware

### File Storage
- AWS S3 (or Cloudflare R2)
- Presigned upload URLs

### DevOps & Quality
- Vercel deployment
- GitHub Actions CI
- ESLint + Prettier
- Vitest + Playwright
- Sentry monitoring

### Optional Add-ons (Post-MVP)
- Redis caching / queues
- Stripe billing and subscriptions
- Advanced search engine (Meilisearch/Elasticsearch)

---

## 5) High-Level Architecture

- **Single codebase, multi-tenant SaaS**
- **Tenant isolation strategy:** every dealership-owned table includes `dealership_id`
- **Authorization strategy:** user identity + role + dealership scope enforced on every API access
- **Storage strategy:** relational core data in PostgreSQL, binary files in object storage (S3/R2)

### Data Isolation Rules
- A user belongs to exactly one dealership in MVP
- Users can only read/write records where `record.dealership_id == user.dealership_id`
- All list endpoints are dealership-scoped by default

---

## 6) Initial Domain Model (MVP)

- `Dealership`
- `User`
- `Vehicle`
- `VehicleFile`

Planned key vehicle fields:
- Identity: stock number, VIN, make, model, year
- Status: draft/in-stock/reserved/sold/in-transit
- Finance: purchase price, list price, transport cost
- Transport: source, destination, ETA
- Customer: name, phone, email
- Checklist booleans: docs/photos/video/social
- Notes

---

## 7) Security Considerations

- Password hashing (bcrypt/argon2)
- JWT or secure session cookies
- Tenant scope checks in middleware and service layer
- Input validation with Zod
- Upload file type/size validation
- Audit logging for key mutations (post-MVP enhancement)

---

## 8) API Design Principles (MVP)

- REST-style endpoints grouped by resource
- Server-side tenant filtering on every query
- Consistent error shape and status codes
- Pagination for list endpoints
- Centralized validation and authorization

Example resources:
- `/api/auth/*`
- `/api/vehicles`
- `/api/vehicles/:id`
- `/api/vehicles/:id/files`
- `/api/dashboard/summary`

---

## 9) Development Roadmap

### Phase 1 (MVP)
1. Project setup (Next.js + Prisma + PostgreSQL)
2. Authentication + RBAC
3. Multi-tenant data model + authorization
4. Vehicle CRUD + list + filter/search
5. Checklist + details sections
6. File uploads (photos/PDF)
7. Dashboard
8. QA + deployment

### Phase 2 (Post-MVP)
- Team activity logs
- Advanced analytics and reports
- Notifications/reminders
- Billing and subscription plans
- Integrations (DMS/accounting/marketplaces)

---

## 10) Estimated Timeline (MVP)

Typical timeline: **4–6 weeks**

- Week 1: Discovery, schema, UI foundations, environment setup
- Week 2–3: Auth, tenancy, vehicle workflows, list/search/filter
- Week 4: Checklist, files, dashboard
- Week 5: QA, hardening, deployment, polish

Timeline can vary by scope changes and feedback cycles.

---

## 11) Fixed-Price Estimate (MVP)

Indicative fixed-price range:
- **USD $8,000 – $18,000** (full MVP scope)
- Leaner implementation path: **USD $6,000 – $10,000**

Final price depends on design depth, reporting requirements, and workflow complexity.

---

## 12) Repository Bootstrap Plan

This repository will be built in iterative milestones:
- Milestone 1: App scaffold + DB schema + auth base
- Milestone 2: Vehicle module + list UX
- Milestone 3: File uploads + dashboard
- Milestone 4: hardening + release prep

---

## 13) Local Development (when code scaffold is added)

Planned commands:

```bash
npm install
npm run dev
```

Prisma workflow:

```bash
npx prisma migrate dev
npx prisma generate
```

Environment variables will be documented in `.env.example`.

---

## 14) Definition of MVP Done

- Secure login for dealership users
- Strict tenant data isolation verified
- Vehicle CRUD + list + search/filter fully operational
- File upload and retrieval working for photos/PDFs
- Dashboard provides useful daily operational visibility
- Responsive UI works on common desktop and mobile viewport sizes
- Basic test and CI checks passing

---

## 15) Notes

This README is a living project contract for product scope and technical direction. As implementation proceeds, decisions and trade-offs will be documented here and in ADRs/changelog notes.
