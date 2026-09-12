# Pinnacle Legal & Business Law — Legal Services Web App

A two-sided legal services application: a public marketing site and a
secure client portal (with a matching firm-side workspace) for tracking
legal matters in real time. See [SECURITY.md](./SECURITY.md) before
pointing this at any real client data.

## Build status

Being delivered in milestones, each checked in before moving on:

1. **Project scaffold** — done
2. Database schema + migrations + seed data — not started
3. Auth + role-based access control — **partially done ahead of schedule**: a
   working demo login gates the portal/workspace by role (see below), but
   it checks a hardcoded account list, not a database — see
   [SECURITY.md](./SECURITY.md)
4. **Public marketing site content — done**: home, about, practice areas,
   attorney bios, case results, FAQ, locations, and a live contact form
   that creates a real `Lead` record (rate-limited, see below)
5. Client portal — **dashboard and case detail are ownership-scoped and
   live** (see below), ahead of schedule; still demo data, not a real
   `Client`/`Matter` table
6. Firm-side workspace — **document sharing, status updates, live case
   tracking, and case-scoped messaging all work end to end** between an
   attorney and their assigned client (see below) — this is now
   **attorney + client only**; staff/admin keep the rest of the firm
   workspace (leads, account admin) but no longer touch matters/documents/
   docket/messages. Messages are demo data (Redis-backed, see
   `src/lib/demo-messages.ts`), not a real `Message` table yet
7. **Lead intake → inbox → convert-to-matter — done**: the public contact
   form creates a `Lead` (Redis-backed, `src/lib/demo-leads.ts`,
   rate-limited via `intakeRateLimit`); `/firm/leads` is a real inbox open
   to every firm role for triage ("Mark Contacted"), but "Convert to
   Matter" is attorney-only and creates a real `DemoClient` + `DemoMatter`
   in one step, auto-assigned to the converting attorney. Granting the new
   client an actual portal login is still the separate, deliberate step at
   `/firm/clients` (as before)
8. Notifications (email) — not started
9. Polish pass (empty/error/loading states, mobile QA) — not started

Every stub page in the app says, in place, what milestone will make it
real — that's intentional so the site is reviewable end to end at every
stage rather than half-broken.

## Tech stack

- **Next.js 16** (App Router) + TypeScript, Turbopack
- **Tailwind CSS v4** — two theme scopes (`.theme-marketing` dark
  navy/library-green/brass, `.theme-portal` light "ledger paper") driven by
  CSS custom properties in `src/app/globals.css`, so components never
  branch on which site they're in
- **Prisma ORM 7** targeting PostgreSQL, via the `@prisma/adapter-pg`
  driver adapter (portable across Neon, RDS, Supabase, or local Postgres)
- **Auth.js (NextAuth v5)** — Credentials (email/password) provider is live
  against a **hardcoded demo account list** (`src/lib/demo-accounts.ts`),
  roles: `client` / `attorney` / `staff` / `admin`. The Resend magic-link
  provider is written but disabled — it needs a database adapter that
  doesn't exist yet
- **Icons/imagery**: `lucide-react` for icons, initials-based avatar
  components for attorneys (no stock photos of real people used as
  placeholders for fictional attorneys), a generated monogram favicon
- **Storage**: `src/lib/storage` defines a `StorageProvider` interface,
  implemented against the S3 API (works unmodified against AWS S3,
  Cloudflare R2, or local MinIO)
- **Email**: Resend
- **Data store**: Upstash Redis (`src/lib/redis.ts`) — not just rate
  limiting anymore. Client/attorney accounts and demo matters/documents
  are all read and written through it (`src/lib/client-accounts.ts`,
  `src/lib/attorney-accounts.ts`, `src/lib/demo-matters.ts`,
  `src/lib/demo-documents/data.ts`), specifically so this deploys cleanly
  to Vercel's serverless functions, which have no writable disk outside
  `/tmp` and no memory shared across instances
- **Rate limiting**: Upstash Redis + `@upstash/ratelimit`
- **Validation**: zod (added per-form/route as they're built)

Hosting target: Vercel (app) + Upstash (Redis), both free-tier friendly to
start. Postgres/Neon is scaffolded (`prisma/schema.prisma`) for the real
`Matter`/`Client`/`User` models in Milestone 2, but nothing reads or
writes through it yet.

## Local setup

Prerequisites: Node.js 20.9+ (Node 24 recommended), npm, a PostgreSQL
database (local, Docker, or a free Neon project).

```bash
npm install
cp .env.example .env   # then fill in real values, see below
npx prisma generate    # regenerates src/generated/prisma after schema changes
npm run dev
```

Open http://localhost:3000.

### Environment variables

See [.env.example](./.env.example) for the full list with explanations.
You can browse the public marketing pages without any env vars set, but
`AUTH_SECRET` and `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` are
required to sign in or use any portal/firm feature — accounts and demo
matters/documents live in Upstash now (see below), not a local file.
Upstash's free tier is enough; create a database at
[upstash.com](https://upstash.com) and copy its REST URL/token in.
After adding those two values, run `npm run upstash:check` to verify this
app can reach your Redis instance before signing in.
`DATABASE_URL`, `RESEND_API_KEY`, and the S3 vars only become necessary
once their respective milestone wires them up.

### Demo login

The portal and firm workspace are gated by a working sign-in flow, but it
checks a hardcoded list, not a database (see
[SECURITY.md](./SECURITY.md)). `AUTH_SECRET` must be set and `AUTH_URL`
must be a real value (an **empty string breaks Auth.js's trusted-host
check** — leave it unset instead if you don't want to set it).
[/login](http://localhost:3000/login) is framed as the client portal sign-in
(only the client demo account gets a quick-fill button there), but the same
form authenticates every role — attorney/staff/admin all sign in on that
same page by typing their own credentials, or:

| Role      | Email                                     | Password           |
| --------- | ------------------------------------------ | ------------------- |
| client    | client@demo.pinnaclelegal.example       | ClientDemo123!       |
| attorney  | attorney@demo.pinnaclelegal.example     | AttorneyDemo123!     |
| staff     | staff@demo.pinnaclelegal.example        | StaffDemo123!        |
| admin     | admin@demo.pinnaclelegal.example         | AdminDemo123!        |

`client` lands in the portal (`/dashboard`); `attorney` lands in the firm
workspace (`/firm/matters`); `staff`/`admin` land in `/firm/leads` — they
no longer have access to matters/documents/docket (see below). `src/proxy.ts`
redirects each role away from paths it doesn't belong on.

### Client accounts, backed by Upstash Redis

The four accounts above are hardcoded and stay that way — but real client
logins don't have to be, in two ways:

1. **Clients can sign themselves up.** Open
   [/signup](http://localhost:3000/signup) — no invitation, no attorney
   involved — enter a name, email, and password, and you're immediately
   signed in at `/dashboard`. This is genuinely open registration; see
   [SECURITY.md](./SECURITY.md) for why that's a real gap to close before
   any of this touches actual client data.
2. **Attorneys can create client accounts on someone's behalf.** Sign in
   as `attorney` and open
   [/firm/clients](http://localhost:3000/firm/clients) (attorney-only,
   same restriction as `/firm/matters`) to create additional client portal
   accounts the same way — name, email, password, no verification step,
   since the attorney creating it is already the authenticated, trusted
   party.

Both paths call the same `createClientAccount` (`src/lib/client-accounts.ts`)
and land in `src/lib/auth.ts`'s `authorize` right alongside the four
hardcoded demo accounts.

The key difference from every other "demo data" list in this app: these
are **persisted to Upstash Redis**, not a local file or an in-memory
array. Earlier this was a JSON file on disk, which worked fine for local
dev but would either crash on write or silently disagree with itself
between requests once deployed to Vercel, whose serverless functions have
no writable disk outside `/tmp` and no memory shared across instances.
Upstash's REST API (plain HTTPS, no persistent connection needed) works
identically from any instance, so this now actually survives a real
deployment. It still isn't a full production user table (no migrations,
no audit trail of who created/revoked which account — see
[SECURITY.md](./SECURITY.md)), but it's genuinely functional, not a stub.

If the email you use matches one of `src/lib/demo-clients.ts`'s existing
records (e.g. `morgan.reyes@example.com`, `casey.fumero@example.com`),
that client's existing matters show up on the new login's dashboard
immediately — `getClientByEmail` is what ties a session back to a client
record, the same lookup the original `client@demo...` login already goes
through.

### Attorney accounts, invited by an existing attorney

Attorneys aren't self-service the way clients are — a law firm doesn't
let the public sign up as an attorney. Instead, sign in as `attorney` and
open [/firm/attorneys](http://localhost:3000/firm/attorneys)
(attorney-only) to create another attorney's login: name, email,
password. It's the same Upstash-backed pattern as client accounts, just a
separate key namespace (`src/lib/attorney-accounts.ts`) and a separate,
not-open-to-the-public creation surface. A newly created attorney signs
in at the same `/login` page and can immediately self-assign to any
unclaimed matter from `/firm/matters` (matters `5` and `6` start
unassigned for exactly this).

### Case data is attorney + client only

Matters, documents, and the docket board are scoped to exactly one
attorney and one client each — modeled in `src/lib/demo-matters.ts`
(matter → assigned attorney + linked client) and `src/lib/demo-clients.ts`
(demo client records; only `client-1`/Jordan Alvarez has a real login).
Matter `3` (`EP-2026-00041`, Revocable Living Trust) is assigned to
`attorney@demo...` (Richard Worsfold) and linked to `client@demo...`
(Jordan Alvarez) — that's the pair to use for testing the full
attorney ↔ client flow below with two real logins. `staff`/`admin` can no
longer view, share, or download anything on this matter; `src/proxy.ts`
redirects them away from `/firm/matters*` entirely, and every route
handler underneath (`/api/matters/[id]/documents`,
`/api/documents/[id]/download`, `/api/matters/[id]/status`,
`/api/matters/[id]/version`) re-checks the same ownership rule
server-side, not just in the UI.

Matters `5` (`BC-2026-00204`) and `6` (`IM-2026-00077`) start **unassigned**
(`attorney: null`) — sign in as `attorney` and `/firm/matters` shows them
under "Available Clients" with an "Assign to Me" button. This is the
"attorney picks up a client themselves" workflow, via
`POST /api/matters/[id]/assign` (attorney-only, only works while the
matter is still unassigned — it's a claim action, not a general reassign-
anyone-to-anyone admin tool). Once claimed, the matter behaves like any
other: it moves into the attorney's own docket and everything above
applies.

### Document sharing, status, and live case tracking (demo)

Sign in as `attorney` and open one of your assigned matters (matter `3`
if using the demo account) to reach the Documents tab. Downloads go
through `/api/documents/[id]/download`, which requires a session,
validates a short-lived signed token (`src/lib/demo-documents/sign.ts`),
and only allows the assigned attorney (any document) or the linked client
(only documents marked `client`-visible) — everyone else gets a 403.

Uploads go through `POST /api/matters/[id]/documents`, attorney-only and
only on matters assigned to that attorney. Only `.pdf`, `.doc`, and
`.docx` are accepted (validated by MIME type, capped at 10 MB); the
uploader picks a visibility (`internal` or `client`). **No file bytes are
written anywhere** — Vercel's serverless functions have no writable disk
to put them on — only the metadata (filename, size, uploader, visibility)
is recorded, in Upstash Redis via `src/lib/demo-documents/data.ts`.
Downloading a document you uploaded returns generated placeholder text
explaining as much; downloading one of the four seed documents (committed
under `data/demo-documents/`) returns its real content, since reading a
file that shipped with the deployed bundle is fine even on Vercel; it's
only writing new ones that isn't. The document list flags which is which
("placeholder content").

Status updates go through `PATCH /api/matters/[id]/status`, same
attorney-only + ownership restriction, mutating the matter's record in
Upstash.

Both of those also bump a per-matter version counter in Upstash Redis
(`bumpMatterVersion`, `src/lib/demo-matters.ts`), which
`GET /api/matters/[id]/version` reports back to anyone polling it
(attorney or the linked client, same ownership check). `LiveMatterUpdates`
(`src/components/portal/live-matter-updates.tsx`) polls that endpoint
every 3 seconds from both the attorney's and the client's matter page and
calls `router.refresh()` whenever the version changes — sign in as both
`attorney` and `client` in two browser sessions, open matter `3` on each
side, and upload a document or change the status as the attorney: the
client's page updates within a few seconds, no manual refresh. This used
to be a persistent SSE connection backed by a plain in-memory
`EventEmitter`, which only worked within a single server process — on
Vercel a publish and a subscribe landing on different serverless
instances would simply never meet, and the connection itself would get
cut whenever the function hit its execution timeout. Polling against a
counter that lives in Upstash (reachable identically from every instance)
is what actually survives a real multi-instance deployment; the tradeoff
is a few seconds of latency and a small steady stream of poll requests
instead of instant push, both fine at this app's scale.

### Database migrations & seed data (from Milestone 2 onward)

```bash
npx prisma migrate dev   # create/apply a migration from prisma/schema.prisma
npx prisma db seed       # run prisma/seed.ts
```

`prisma/seed.ts` will populate placeholder demo content (the "Pinnacle
Legal & Business Law" firm, fictional attorneys, sample matters) — kept clearly
separate from real firm data so it's obvious what to delete before this
goes live with a real client's information.

## Project structure

```
src/
  app/
    (marketing)/   public site — dark theme (home, about, practice areas,
                   attorneys, case results, faq, locations, contact, legal)
    (portal)/      client portal — ledger-paper theme, auth-gated
    firm/          attorney workspace for case data, staff/admin for
                    leads/account admin — ledger-paper theme, auth-gated
    login/         shared sign-in page, framed as client sign-in but
                    authenticates every role (outside the auth-gated groups)
    signup/        public client self-registration (no invite required)
    api/auth/      Auth.js route handler
    api/documents/[id]/download/  signed demo-document download route
                    (attorney: any of theirs; client: their client-visible docs only)
    api/matters/[id]/documents/   demo document upload route (PDF/DOC/DOCX, attorney-only)
    api/matters/[id]/status/      matter status update route (attorney-only)
    api/matters/[id]/version/     polled live-update endpoint (attorney or linked client)
    api/clients/                  create/revoke local client portal accounts (attorney-only)
    api/attorneys/                create/revoke local attorney accounts (attorney-only)
    icon.tsx       generated favicon (no binary asset needed)
  components/
    ui/            design-system primitives (Button, Card, Tabs, Accordion, ...)
    marketing/      PracticeAreaIcon, AttorneyAvatar
    portal/         Docket Board, Case Timeline, DocumentList, DocumentUploadForm,
                    MatterStatusControl, LiveMatterUpdates,
                    CreateClientAccountForm, ClientAccountRow,
                    CreateAttorneyAccountForm, AttorneyAccountRow, ...
  lib/
    prisma.ts       Prisma client singleton (driver adapter, not wired to
                    anything live yet — see Milestone 2)
    redis.ts        shared Upstash Redis client (Redis.fromEnv()) — the
                    app's actual data store, see below
    auth.ts         Auth.js config (demo Credentials provider + Upstash-backed
                    client/attorney accounts)
    auth-actions.ts sign-out server action
    demo-accounts.ts hardcoded demo login accounts (see above)
    client-accounts.ts client login accounts, persisted to Upstash Redis;
                    written to by both /signup and /firm/clients
    attorney-accounts.ts attorney login accounts, same Upstash pattern;
                    written to only by /firm/attorneys — not open registration
    demo-matters.ts demo matters (each tied to one attorney + one client),
                    persisted to Upstash Redis, seeded on first read; also
                    owns the per-matter version counter live updates poll
    demo-clients.ts hardcoded client records (only one has a real login by default)
    demo-documents/ document metadata persisted to Upstash Redis (seeded on
                    first read) + signed-token + upload helpers; uploaded
                    files are metadata-only, see above
    rbac.ts         ownership check placeholder (M3 — coarse role gating lives
                     in proxy.ts, per-matter ownership now lives inline in each
                     route/page against demo-matters.ts/demo-clients.ts)
    storage/        StorageProvider interface + S3 implementation (for
                     real uploads later — demo uploads/downloads use local disk)
    email/          Resend wrapper
    rate-limit.ts   Upstash rate limiters (shares the client in redis.ts)
  types/
    next-auth.d.ts  adds `role` to the Auth.js Session/JWT types
  proxy.ts          session + role gating (Next.js 16 renamed `middleware` to `proxy`)
prisma/
  schema.prisma     datasource + generator only until Milestone 2
data/
  demo-documents/   the actual demo .docx/.pdf/.png files (not in `public/`,
                    so they're only reachable through the signed route)
```

## What's a placeholder vs. real, right now

- All copy, attorney names, and the firm name are placeholder demo
  content — see `src/lib/content/`.
- Sign-in is real (Auth.js, bcrypt-hashed comparison, JWT sessions,
  role-based redirects) but checks a **hardcoded account list**, not a
  database — see [SECURITY.md](./SECURITY.md).
- The `(portal)` and `firm/*` routes are now access-controlled by role,
  but every client sees the same fixed placeholder matters — there's no
  per-client data yet, because there's no `Matter` model yet.
- Document downloads are real (signed short-lived URLs, session + role
  check) for the four seed documents; anything uploaded through the app
  serves generated placeholder content instead, since no file storage is
  wired up yet (`src/lib/storage`, Milestone 6).
- The contact form and firm-side action buttons are visually complete but
  disabled — no server action is wired up yet.
- The Resend magic-link provider is written but disabled (needs a
  database adapter). No MFA, no password reset, no login rate limiting.

## Not built at all yet (flagged from the original spec)

Payment processing, e-filing integration, e-signature, and SMS
notifications were never in scope for this build and have no scaffolding
in place — flagging here so they aren't mistaken for oversights later.
