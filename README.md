# SHKSC Digital Club Portal

A React/Vite demo for club discovery, student registration, school verification, payments, and role-based administration for Shamsul Hoque Khan School & College.

## Run locally

```bash
npm install
npm run dev
```

Useful scripts: `npm run typecheck`, `npm run build`, `npm run check`, `npm run preview`, and `npm run clean`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Root admin | `admin@shksc.edu` | `admin123` |
| Club admin | `science@shksc.edu` | `club123` |
| Student | `student@shksc.edu` | `student123` |

The app currently uses localStorage-backed demo services. It is suitable for a stakeholder demo, not production authentication or data storage.

## Registration demo

When the master student database contains records, registration verifies the official school ID and fills the student's name, class, roll, and section. The seeded IDs include `SHKSC-2026-001` through `SHKSC-2026-005`; the first seeded student is already registered, so use `SHKSC-2026-004` for a fresh walkthrough.

The payment step is explicitly simulated. No gateway credentials or real charge are used in the browser. A backend implementation should create and verify payment sessions server-side, hash passwords, validate webhooks, and persist records in a real database before launch.

## Main areas

- Public landing page, notices, clubs, achievements, FAQ, and registration
- Root admin: users, clubs, payments, reports, CMS, master student import, academic year, and settings
- Club admin: club profile, students, fees, notices, events, committee, certificates, and communications
- Student portal: profile, registration, club, payment, receipt, and notices
- Finance workflow: monthly honorarium requests, separate club expenses, Root Admin approval, printable vouchers, recipient signatures, and expense-proof follow-up
- Batch workflow: club-specific class/batch requests, day/time and instructor assignment, Root Admin approval, daily present/absent/late attendance, and cross-club reporting

## Backend handoff roadmap

1. Replace localStorage services with authenticated API calls and a database.
2. Move password hashing, role/permission checks, payment creation, and webhook verification to the server.
3. Add audit logging, rate limiting, backups, and server-side validation.
4. Replace demo content and placeholder contact data with institution-approved records and verified social URLs.
