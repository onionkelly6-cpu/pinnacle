# How Pinnacle Legal & Business Law Works

This document explains what this application is, how its pieces fit
together, and where to look in the code for each part. It's meant for
anyone picking up this repo for the first time — technical or not.

## What this is

A two-sided legal services web app with three audiences:

1. **Public marketing site** — home, about, practice areas, attorney
   bios, case results, FAQ, office locations, and a contact form.
2. **Client portal** — a signed-in area where a client tracks their
   own legal matters: case status, shared documents, and messages
   with their attorney.
3. **Firm workspace** — a signed-in area for attorneys (and, for some
   sections, staff/admin) to manage matters, share documents, message
   clients, and handle lead intake.

Everything lives in one Next.js app; which of the three a visitor sees
depends on the URL and, for the portal/workspace, who's signed in.

## Tech stack, in plain terms

- **Next.js (App Router)** — the framework. Pages are React
  components that can run on the server (most of them, here) or in
  the browser (only where interactivity is needed — forms, buttons
  that call an API, live-updating indicators).
- **TypeScript** — JavaScript with type checking, so mismatched data
  shapes get caught before they ship.
- **Tailwind CSS** — utility classes for styling, no separate CSS
  files per component.
- **Auth.js (NextAuth)** — handles sign-in sessions and cookies.
- **Upstash Redis** — the actual data store right now (see "About the
  data" below) — reachable over plain HTTPS, which matters because
  this app runs on Vercel's serverless functions.
- **Prisma + Postgres** — wired up but not yet used. This is where
  real, permanent data models will live once the app moves off demo
  data (see "Where this is headed").

## Where things live in the code

```
src/
  app/
    (marketing)/        Public site: home, about, contact, etc.
    (portal)/            Client-only pages: dashboard, matter detail, settings
    firm/                Attorney/staff/admin pages: matters, clients,
                         attorneys, leads, admin
    api/                 API routes the browser calls (upload a document,
                         send a message, convert a lead, etc.)
    login/, signup/      Sign-in and self-registration
  components/
    ui/                  Generic building blocks (Button, Card, Tabs...)
    portal/              Feature-specific pieces (document list, message
                         thread, docket board, account forms...)
  lib/
    auth.ts              Sign-in logic (checks email/password, issues a session)
    demo-*.ts            The data layer — see below, this is the heart of
                         "how it works" today
    rate-limit.ts        Limits how often the public contact form can be
                         submitted
    redis.ts             The shared connection to Upstash Redis
proxy.ts                 Runs before every request to a protected page;
                         decides who's allowed where
```

## Signing in and roles

There are four roles: **client**, **attorney**, **staff**, **admin**.
`proxy.ts` (Next.js middleware) checks every request to `/dashboard`,
`/matters`, `/settings`, and `/firm/*`:

- Not signed in → redirected to `/login`.
- Signed in as a client, but visiting a `/firm/*` page → redirected to
  the client dashboard (and vice versa).
- Within the firm workspace, some pages (`/firm/matters`,
  `/firm/clients`, `/firm/attorneys`) are attorney-only — staff and
  admin can't touch case data, only leads and account admin.

That's the coarse check. The finer one — *this specific client owns
this specific matter*, or *this specific attorney is assigned to this
specific matter* — happens again inside each page and API route,
because the middleware only knows the role, not which record someone
is trying to reach. You'll see this pattern repeated throughout the
API routes: check who's signed in, then check they actually own or
are assigned to the thing they're asking for.

**Demo accounts** (see `src/lib/demo-accounts.ts` and the login page)
let you sign in as each role without creating an account:
`client@demo.pinnaclelegal.example`,
`attorney@demo.pinnaclelegal.example`,
`staff@demo.pinnaclelegal.example`,
`admin@demo.pinnaclelegal.example` — passwords are on the login
page.

## About the data: "demo" storage, not a real database yet

This is the single most important thing to understand about the
current codebase. There's a Postgres/Prisma setup ready to go, but it
has zero models defined yet. Every piece of data you see in the
app — matters, documents, messages, leads, client and attorney
accounts — is actually stored in **Upstash Redis**, through a set of
files named `demo-*.ts` in `src/lib/`:

| File | Holds |
|---|---|
| `demo-matters.ts` | Legal matters/cases — status, assigned attorney, which client owns it |
| `demo-clients.ts` | Client records (name, email) that matters point to |
| `demo-documents/` | Document metadata shared on a matter (not real file storage yet — see below) |
| `demo-messages.ts` | Messages exchanged on a matter's Messages tab |
| `demo-leads.ts` | Contact-form submissions |
| `client-accounts.ts` / `attorney-accounts.ts` | Login credentials, separate from the client/attorney *records* above |

Why Redis and not an in-memory array? Because this app deploys to
Vercel, where each request can be handled by a different, short-lived
server instance with no shared memory — an in-memory array would
"forget" data between requests. Redis, reached over plain HTTPS, is
consistent no matter which instance answers a given request.

Why "demo" in the name? Because this is explicitly a stand-in for real
`Matter`, `Client`, `Message`, `Lead` database tables that will
eventually live in Postgres via Prisma. The `demo-*.ts` files are
written to be easy to swap out later — the rest of the app just calls
functions like `getMatterById()` or `createLead()` without caring what's
underneath.

**One deliberate gap:** a client/attorney *login* (in
`client-accounts.ts`) and a client/attorney *record* (in
`demo-clients.ts`) are two separate things. Creating a login for
someone only shows them their matters if the email matches an existing
client record. This is what makes "convert a lead into a client + case
first, then grant portal access" a natural two-step flow (see below).

## Documents: metadata is real, files are not

Uploading a document through the firm workspace really does save its
name, size, uploader, and who can see it (internal-only vs. shared
with the client). But no actual file bytes are stored anywhere —
Vercel's serverless functions don't have persistent disk to write to.
Downloading an uploaded (non-seeded) document serves generated
placeholder text instead of the real file. The whole upload → signed
download link → download flow works end-to-end; it's only the "real
bytes on real storage" part that's still pending (that's what the S3
client already in `package.json` is for, once wired up).

## "Live" updates without a persistent connection

Status changes, shared documents, and new messages all appear on the
other person's screen without them refreshing the page — but this
isn't a permanently-open connection (a normal serverless function
can't hold one open). Instead:

1. Every matter has a version counter in Redis, bumped by any change
   to that matter (new status, new document, new message).
2. A small client-side component polls a version-check endpoint every
   few seconds.
3. When the version changes, it tells Next.js to re-fetch that page's
   data — the "Live" indicator you see on a matter page is showing
   this polling loop is working.

See `src/components/portal/live-matter-updates.tsx` and
`bumpMatterVersion` in `demo-matters.ts`.

## Walking through a real flow: a new client, start to finish

This ties several pieces together:

1. Someone fills out the **public contact form**
   (`/contact`) → creates a `Lead` record, rate-limited to 3
   submissions per minute per visitor.
2. An attorney (or staff) opens **`/firm/leads`** and sees it. Anyone
   on the firm side can mark it "Contacted"; only an attorney can
   **Convert to Matter**.
3. Converting creates a real client record and a new matter in one
   step — case number generated from the practice area (e.g.
   `BC-2026-36840` for Business & Corporate), status "Filed", assigned
   directly to the attorney who converted it.
4. The attorney grants the client actual portal access from
   **`/firm/clients`** — since the email now matches a real client
   record, the client's matter shows up the moment they sign in.
5. From there, everything above applies: the attorney shares
   documents, updates status, and messages the client — all visible
   live on the client's dashboard.

## Known limitations (by design, for now)

- No real database — everything demo-data / Redis-backed, as above.
- No real file storage for documents.
- `src/lib/rbac.ts` is an unimplemented placeholder — don't be
  surprised it just throws; authorization is actually enforced
  per-route instead (see "Signing in and roles").
- Email notifications aren't sent yet (Resend is installed, not wired
  up).
- Client/attorney names are treated as unique identifiers in a few
  places (e.g. a matter's `attorney` field is a name, not an ID) —
  fine for a demo, not something a real multi-tenant system would do.

## Running it locally

```bash
npm install
cp .env.example .env   # fill in real values, see below
npx prisma generate
npm run dev
```

You need `AUTH_SECRET` and an Upstash Redis URL/token
(`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) for anything
beyond the public marketing pages to work — that's where every
account, matter, document, message, and lead actually lives. Run
`npm run upstash:check` after setting those to confirm the app can
reach your Redis instance.

## Where this is headed

The main `README.md` in this repo tracks progress milestone by
milestone (real database models, real auth, real file storage, email
notifications, and a final polish pass). This document explains how
the *current* system works; that one tracks what's left to make it
production-real.
