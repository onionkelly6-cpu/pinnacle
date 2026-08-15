# Security Notice

This application is being built to hold **confidential legal client data**
(matter details, documents, messages between clients and their attorneys).
Treat everything in this repository as pre-production until the checklist
below is complete — do not point it at real client data before then.

## Status: Milestone 1 (scaffold) + a demo login added ahead of schedule

**Authentication now exists, but it is a demo shortcut, not real auth.**
`src/proxy.ts` gates the `(portal)` and `firm/*` routes behind a signed-in
session and coarse role check (client vs. attorney/staff/admin). But:

- Credentials are checked against a **hardcoded list**
  (`src/lib/demo-accounts.ts`), not a database. There is no real `User`
  table yet — that's still Milestone 2.
- **Ownership-based access control now exists for matters/documents, ahead
  of schedule — but against demo data, not a real database.**
  `src/lib/demo-matters.ts` and `src/lib/demo-clients.ts` model which
  attorney is assigned to which matter and which client is linked to it;
  every matter/document/status/event route checks that server-side (see
  below), and `src/proxy.ts` additionally restricts `/firm/matters*` to
  the `attorney` role only (`staff`/`admin` keep the rest of the firm
  workspace, not case data). This is real logic, just sitting on top of a
  hardcoded, in-memory list instead of the `Matter`/`Client` models and
  `src/lib/rbac.ts` (currently a placeholder that throws if called) that
  land in Milestone 2/3.
- No MFA, no password reset, no rate limiting on the login endpoint, no
  account lockout. The Resend magic-link provider is disabled entirely
  (it requires a database adapter Auth.js doesn't have yet).
- Document storage (`src/lib/storage`) is stubbed against the S3 API but
  not connected to any real bucket or access-control policy.
- Rate limiting (`src/lib/rate-limit.ts`) is configured but not yet applied
  to any route, including the login endpoint above.

**Do not reuse the demo credentials pattern for real users.** It exists
solely so the portal/workspace UI can be clicked through before the real
data layer lands.

- **Attorneys can create client portal logins themselves**
  (`/firm/clients`, attorney role only), persisted to Upstash Redis via
  `src/lib/client-accounts.ts` — not a local file, not a relational
  database. Passwords are bcrypt-hashed before being written, the same as
  the hardcoded demo accounts, but there is intentionally **no email
  verification step**: setting the password is enough, because the
  attorney creating the account is already an authenticated, trusted actor
  in this demo's threat model. This is a deliberate architecture choice,
  not an oversight: Vercel's serverless functions have no writable disk
  outside `/tmp` and no memory shared across instances, so the original
  local-JSON-file approach would either crash on write or silently
  disagree with itself between requests once actually deployed there.
  Upstash's REST API works identically from any instance. There is still
  no password reset, no MFA, no rate limiting, and no audit log for who
  created or revoked which account.
- **Clients can also self-register at `/signup`, with no gate at all.**
  This is genuinely open registration — anyone who reaches that URL can
  create a client-role account with any name/email/password, no
  verification of any kind, and it lands in the same Upstash-backed store
  above (`createClientAccount` is shared by both paths). This is a
  deliberate, requested tradeoff for this demo ("password should be
  enough"), but it is the single biggest gap versus a real client intake
  process: a real deployment must add email verification (or an
  attorney-issued invite requirement) before this goes anywhere near
  actual client data, since right now nothing stops someone from
  registering with an email they don't own.
- **Attorneys can create other attorney accounts** (`/firm/attorneys`,
  attorney role only, not open registration), persisted to Upstash Redis
  via `src/lib/attorney-accounts.ts` — same bcrypt-hashing, same "no audit
  log" caveats as the client-accounts store above. Because this grants
  full firm-workspace access (matters, documents, status changes, the
  ability to invite further attorneys), it is intentionally **not**
  self-service the way client signup is: only an already-authenticated
  attorney can create one.

**Document uploads/downloads and live case tracking
(`src/lib/demo-documents`, `/api/documents/[id]/download`,
`/api/matters/[id]/documents`, `/api/matters/[id]/status`,
`/api/matters/[id]/version`) are also a demo shortcut layered on real
security mechanics.** Every one of those routes requires an authenticated
session and re-checks the same ownership rule as the pages: the assigned
attorney can act on their own matters; the linked client can only download
documents explicitly marked `client`-visible on their own matter;
everyone else (including `staff`/`admin`) gets a 403. Downloads
additionally validate a short-lived HMAC-signed token before reading the
file — the same "authenticate + verify a signed URL, never expose a
permanent public link" shape production will use, just against demo
metadata instead of a real `Document` table and object storage. The token
reuses `AUTH_SECRET`; give document-download tokens their own secret
before this becomes real. Document metadata itself lives in Upstash
Redis (same reasoning as the account stores above), but **no uploaded
file's actual bytes are stored anywhere** — only the four seed documents
(committed under `data/demo-documents/`) serve real content; anything
uploaded through the app gets a generated placeholder on download
instead. That sidesteps the "no writable disk on Vercel" problem
entirely for uploads, at the cost of uploads not being real, which is a
deliberate, requested tradeoff for now, not a bug. Live case tracking
(`LiveMatterUpdates`) used to be a persistent SSE connection backed by an
in-memory `EventEmitter`, which only worked within a single server
process; it's now short-interval polling (every 3 seconds) against a
per-matter version counter in Upstash Redis (`getMatterVersion`/
`bumpMatterVersion` in `src/lib/demo-matters.ts`), bumped by every status
change, document upload, and self-assignment. That survives Vercel's
serverless model correctly: no persistent connection to hold open, and
every instance reads the same counter. The tradeoff is latency (up to
~3 seconds instead of instant push) and a small constant stream of poll
requests for as long as a matter page stays open, both acceptable for
this app's scale.

## What real production use will require, beyond finishing the build

Building the features correctly is necessary but not sufficient. Before
this application handles real client data, the firm should also arrange:

1. **An independent security/compliance review** by someone who did not
   write the code — including a review of state bar rules on client data
   handling and attorney advertising for every jurisdiction the firm
   practices in.
2. **Penetration testing** against the deployed application, not just the
   source code.
3. **Vendor data-processing agreements** (a BAA-equivalent for legal
   services) with every third party that will touch client data: the
   hosting provider (Vercel), database provider (Neon or equivalent),
   object storage provider, and email provider (Resend). Read each
   vendor's DPA/subprocessor terms — don't assume a generic "enterprise
   plan" satisfies a law firm's confidentiality obligations.
4. **A records-retention and deletion policy** for closed matters,
   agreed with the firm, not assumed by the engineering team.
5. **Incident response and breach-notification procedures**, since legal
   client data carries specific notification obligations in most
   jurisdictions.

## Security properties this build targets (tracked per milestone)

- Every API route/server action enforces both authentication _and_
  ownership (a client must never reach another client's matter by
  guessing an ID) — lands in Milestone 3.
- Document downloads only ever go through short-lived signed URLs, never
  permanent public storage links — demonstrated end to end against demo
  documents now; wired to the real `Document` model and object storage in
  Milestone 6.
- Passwords hashed with bcrypt; MFA required for attorney/staff/admin
  roles — lands in Milestone 3.
- All mutating actions (status changes, visibility changes) get an audit
  log entry — lands alongside the relevant model in Milestone 2/6.
- CSRF protection and zod validation on every form/API boundary.
- Rate limiting on auth endpoints and the public intake form — configured
  in Milestone 1, applied in Milestone 3/7.

## Reporting a concern

This is an internal project repository, not a public product with a
disclosed vulnerability program. If you find a security issue, raise it
directly with the project owner rather than filing a public issue.
