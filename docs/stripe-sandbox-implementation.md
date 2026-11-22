# Sandbox payment foundation — implementation handoff

## Status

Implemented locally on `feat/stripe-sandbox-foundation`; no push, deployment, account mutation or payment submitted. Production is unchanged. The signed-in Vercel dashboard verified `starrtrees-projects/starrtree3d`, repository `starrtree/StarrTree3D`, production branch `main`, source `81bf0eab82654de18570f2b78c522dbd022c60a1`, and StarrTree custom domains. The API connector remains unable to enumerate this project; browser access resolved provenance only.

## Implemented

- Existing sandbox Product/Price IDs are reused. A server registry validates USD amount, recurring interval, quantity, active price, product and expected account. Only `sk_test_` configuration is accepted. No frontend Stripe secrets or live fallback.
- Vercel functions: `/api/stripe/checkout`, `/api/stripe/status`, `/api/stripe/webhook`. API paths are excluded from the SPA rewrite. API handlers are included in TypeScript checks.
- Scoped checkout requires a reviewed invitation, stored hashed, bound to product, phase and customer email with expiry. Customer self-approval removed. The private invitation authorizes checkout but is not a reservation or proof of client identity; do not share it publicly. Full client authentication is not implemented.
- Checkout order is committed before Stripe session creation; retries reuse the order/idempotency key. Session attachment is persisted separately, and webhooks can recover an order from Stripe-generated metadata if delivery races session attachment. No in-memory production ledger.
- Status lookup uses a random order access token in the URL fragment and POST body; it returns no customer PII, download URLs or secret data. Paid status comes from a server-side Stripe read, never query parameters.
- Raw-body SDK signature verification, test-account checks, transaction-backed event deduplication, line-item validation and retrieval of current subscription state. Unsupported/untracked Payment Links stay manually verified. Webhook processing records payment state for operator review; it does not deliver files, send email or create bookings.
- PostgreSQL schema and adapter: approvals, historical capacity review, orders, event IDs, approved presets and basic per-client rate limits. No external database created. Capacity starts unknown; maximum 3 websites, 1 high-complexity automation and 1 receptionist implementation. Review expires after seven days. No automatic reservation or project-count increment is claimed.
- Receptionist stays $950 setup, with a separate $199/month invitation requiring setup delivery confirmation. Website care stays $99/month. Workshop is quote-only. The old $120 studio session is blocked by the server registry and is not mapped onto Portable Home Studio Kit.
- Optional frontend flag `VITE_COMMERCE_API_ENABLED=true` enables server checkout and status UI. Default off: existing direct test links remain manual; scoped services require owner invitation instead of checkbox access. Public catalog still contains test-only references; they are not authorization mechanisms.

## Configuration gate — must be completed before hosted testing

1. Owner approves an existing or new **dedicated sandbox PostgreSQL database** and any provider/cost. Do not point this at another app's production database. Apply `server/schema.sql` once with an operator migration role. Runtime role needs only the table operations in `server/ledger.mjs`, not schema administration. Use the provider's TLS connection settings without disabling certificate verification.
2. Configure these SERVER-ONLY variables in the intended testing environment via secure host settings or an ignored local environment file, never chat or git:
   - `STRIPE_MODE=test`
   - `STRIPE_SECRET_KEY` — sandbox secret from the intended Stripe sandbox
   - `STRIPE_ACCOUNT_ID` — expected sandbox account ID
   - `STRIPE_WEBHOOK_SECRET` — signing secret for this test endpoint; CLI and hosted endpoint secrets differ
   - `COMMERCE_DATABASE_URL` — dedicated sandbox connection
   - `COMMERCE_ORIGIN` — exact approved HTTPS preview origin, or `http://localhost:4173` for local work; no trailing slash/path
3. Set `VITE_COMMERCE_API_ENABLED=true` only for the configured test build. Do not set any Stripe secret under `VITE_*`. Missing server configuration returns unavailable; there is no fallback to live processing.
4. After explicit deployment approval, deploy to a test/review URL. No automatic branch push was made because Vercel can build pushed branches. Register a **sandbox snapshot** webhook matching the installed Stripe SDK API version for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, and `customer.subscription.deleted`. No live destination.
5. Operator reviews current capacity from the canonical X tracker and updates `commerce_capacity.active`/`reviewed_at`; do not infer counts from old source. Operator inserts approved paid preset names into `commerce_presets`; no paid links/files are embedded in the client.
6. Issue a test invitation only after actual scope, eligibility and Calendar review:
   `node --env-file=.env.local scripts/issue-test-invitation.mjs PRODUCT_ID CLIENT_EMAIL purchase "Reviewed scope and availability details"`
   For Receptionist monthly invitation use `recurring` and include `SETUP_DELIVERED` in the scope only after setup has been delivered/accepted. The CLI prints a private 24-hour invitation; share it manually with the intended test customer. No invitations were issued in this run. After a completed/expired checkout or unrecoverable old order, revoke/reissue a fresh approval rather than changing an order's amount.

## Manual operations retained

- Consultations/photo bookings: confirm availability first; verify payment; send private Google Calendar booking access; confirm actual Calendar reservation. Payment does not reserve a slot. Preserve the prior 24-hour notice/21-day horizon and activity limits pending owner review. No custom booking backend or automatic payment-gated Calendar workaround.
- Custom deposits/final balances: owner-created private **sandbox** invoices, with agreed scope/milestones and deposit credit. No generic public client-amount payment field. Do not send invoices without specific recipient authorization.
- Digital presets: confirm exact selection/license and manually deliver after verifying payment in Stripe. The schema records selection; automatic protected downloads are deferred. Free music vault remains free/public; game completion is not security.
- Subscriptions: ledger records current status for operator action only. Automatic service provisioning, dunning emails and authenticated customer portal are deferred. Use Stripe Dashboard to verify and manage test subscriptions. Do not start Receptionist recurring billing at setup checkout.
- Monitor manual fulfillment and failed webhook deliveries in Stripe. Failed event transactions roll back their event claim so Stripe can retry. Existing Payment Links do not create these app-owned orders automatically.
- Retain only necessary intake and transaction references; define retention and cleanup before enabling. Rate-limit rows and expired approvals need periodic operator cleanup. No automatic purge is configured.

## Verification evidence and limits

`npm test`: representative A-D shared rendering and server fixture tests; actual Stripe SDK signature test; wrong mode/account, altered price, forged status, missing approval and out-of-order subscription tests; schema/ledger queries tested in PGlite's PostgreSQL engine. `npm run build` includes frontend and API type checks, then Vite production build. No full hosted Postgres/network/SSL or real Stripe Checkout payment test claimed. No mobile/desktop hosted acceptance claimed. No existing service prices/Stripe objects altered.

Before acceptance: run A Poster/Flyer $125, B GPT deposit $250 toward $500+, C Care $99/month, D consultation $150/hour through the configured server on desktop/mobile; include declined/canceled/delayed/3DS cases and duplicate webhook retry, invitation reuse, unauthorized status lookup, disabled/missing config and stale/full capacity. Inspect return UI and manual Calendar handoff. Test real PostgreSQL concurrency/permissions and function routing on the review host. Do not use real card details. Test only affected flows after fixes.

## Remaining approval/configuration

- Dedicated sandbox database/provider and credentials are not configured.
- Hosting/server secrets and webhook registration are not configured.
- Publishing/review deployment is not authorized.
- Public offering/pricing/policies remain subject to the audit's owner decisions. Approval of architecture is not live-payment approval.

## Sources

- https://docs.stripe.com/checkout/fulfillment.md?ui=full-page
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/invoicing/hosted-invoice-page
- https://docs.stripe.com/customer-management
- https://vercel.com/docs/functions/runtimes/node-js

## Hosted database checkpoint — 2026-11-22

Owner authorized a free sandbox database and preview deployment. Created Supabase project `mwcouwacdkcitvmqtrkm` (StarrTree Commerce Sandbox), StarrTree organization, free plan, us-east-2. Applied `server/schema-supabase.sql` to a previously empty project. Six tables reside in the private `starrtree_commerce` schema with RLS enabled and browser-role privileges revoked. Capacity remains unconfirmed. Security advisors report only informational RLS-with-no-policy notices, intentional for this server-only schema. No public access policies were added.

The PostgreSQL adapter now selects this private schema. Runtime credentials are still required; creation through the connector did not provide a database connection secret. Sandbox Stripe credentials must likewise be entered into secure Vercel preview settings, never chat/git. No Stripe product/payment or production-domain changes made.
