# MailCare — Cleaner Inboxes. Healthier Data.

> **Cloud-Native Multi-Tenant Email Cleaning & Enterprise B2B Data Hygiene Platform**
> Designed & Built by **Edry de Guzman**

---

## Overview

**MailCare** is a full-stack, offline-capable Progressive Web App (PWA) and API-first email hygiene platform combining two core engines in a unified luxury obsidian-and-gold interface:

1. **Consumer Inbox Management (`/consumer-inbox`):**
   - Smart categorization (`Newsletters`, `Promotions`, `Social`, `Updates`, `Forums`)
   - **RFC 8058 One-Click Unsubscribe** & bulk archive/delete mutations
   - **Tracking-Pixel Privacy Proxy** (strips hidden 1×1 spy pixels and routes assets through a privacy proxy)
   - **Structured AST Automation Rules** (`IF category == "Newsletters" && age_days > 14 THEN ARCHIVE`)

2. **Enterprise B2B Email Verification (`/email-verification` & `/batch-jobs`):**
   - `<1.0s` real-time multi-stage verification pipeline (`Syntax → Domain/DNS → MX Record → SMTP Handshake → Catch-All ML`)
   - Streaming bulk list processing partitioned into **10,000-record worker chunks** with restartable checkpoints and Dead-Letter Queue (DLQ) replay
   - Multi-tenant PostgreSQL Row-Level Security (`RLS`) & immutable audit logging

---

## Portfolio Privacy & Security Guarantees

This repository is pre-configured with **Portfolio Safe Mode** enabled by default:
- **Automatic Email Masking:** Personal email addresses are masked (`edry***@gmail.com`) across the UI by default so public web scrapers cannot harvest contact details (toggleable via the **`Portfolio Safe (Email Masked)`** button in the top header).
- **Zero Secrets or Private Data:** No passwords (`NFA-15`), OAuth tokens, or private email bodies (`NFA-14`) are stored in the repository. All inbox threads shown by default are safe portfolio simulation records.
- **Isolated Client Storage:** Any interactive edits made by portfolio visitors are scoped strictly to their own browser `localStorage`.

---

## Monorepo Architecture

```text
mailcare-platform/
├── apps/
│   ├── web/                  # Next.js 15 App Router UI + PWA Service Worker + /api/v1/* routes
│   ├── api-gateway/          # OpenAPI 3.1 Gateway, Rate Limiter, Idempotency & Tenant Guard
│   ├── workers-consumer/     # Consumer inbox sync, RFC 8058 unsubscribe & mutation workers
│   ├── workers-enterprise/   # 10k-partition verification workers & CRM sync
│   └── ml-service/           # Advisory Catch-All XGBoost scoring service (Python)
├── packages/
│   ├── shared-types/         # Canonical TypeScript domain contracts
│   ├── database/             # 17-table Prisma schema, PostgreSQL RLS DDL & repositories
│   ├── privacy-engine/       # 1x1 spy-pixel HTML sanitizer & asset proxy rewriter
│   ├── mail-adapters/        # Passwordless OAuth 2.0 provider interfaces (Gmail, M365)
│   ├── crm-adapters/         # HubSpot, Salesforce, Mailchimp, SendGrid, Marketo adapters
│   ├── cache-queue/          # Isolated consumer.* and enterprise.* queue definitions
│   └── observability/        # PII redaction logger & ML circuit breaker
└── tests/
    └── run-all-acceptance.spec.mjs  # 9 End-to-End & Architectural Acceptance Suites
```

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the Next.js 15 development server on http://localhost:3000
npm run dev

# 3. Run the 9 automated E2E acceptance test suites
npm test
```

---

## How to Publish to Your Portfolio (GitHub + Vercel)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: MailCare Email Cleaning & Verification Platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mailcare-platform.git
   git push -u origin main
   ```
2. **Deploy to Vercel (Free, 1-Click):**
   - Go to [vercel.com/new](https://vercel.com/new) and import your `mailcare-platform` GitHub repository.
   - Vercel will automatically detect [`vercel.json`](./vercel.json) and deploy your live portfolio URL (`https://mailcare-platform.vercel.app`)!
