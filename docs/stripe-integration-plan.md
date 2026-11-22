# StarrTree Stripe integration audit and implementation plan

Status: architecture review required; no payment implementation authorized.
Audit date: 2026-11-15. Legal business: The StarrTer LLC. Public brand: StarrTree.
Repository: https://github.com/starrtree/StarrTree3D, main at `81bf0eab82654de18570f2b78c522dbd022c60a1`.

## Executive finding

Reuse the existing sandbox catalog and hosted Stripe Checkout. Do not rebuild the website or duplicate products. Keep low-volume fulfillment manual initially. Add a small server-side payment layer only for enforceable approval, verified status, subscription lifecycle handling and protected digital delivery after approval of this plan. All prices below are existing sandbox configurations, not approval to publish or sell them.

## 1. Repository and infrastructure audit

- Actual entry: `index.html` → `src/main.tsx` → `src/App.tsx`; React 19 + TypeScript + Vite 8, Three.js/react-three-fiber/drei and GSAP. This is a static SPA, not a currently running Next.js/Vinext application.
- `package.json`: build runs TypeScript then Vite; output `dist`. `vite.config.ts` uses the React plugin. `vercel.json` specifies Vite and a SPA fallback. A separate `build:pages` script supports a `/StarrTree3D/` GitHub Pages build. Do not treat those two deployment targets as interchangeable.
- HTTP inspection: `starrtree.org` redirects to `www.starrtree.org`, returning the Vite shell with `/assets/index-B19GXtxW.js`; response includes a Vercel identifier. Exact deployed commit/project is unverified: Vercel project lookup for the historical `starrtree3d` name returned 404, including one retry with the connected team scope. This is a deployment-provenance blocker, not evidence that the website is down.
- No AGENTS.md found in the repository tree. No Stripe SDK dependency, server functions, checkout creation API, payment verification route or webhook handler found in the tracked tree.
- `src/App.tsx` imports the existing `app/CommerceCatalog.tsx` ServiceCard and `app/commerce-catalog.json`. The older `app/` directory is not wholly dead code: some components are reused. Its old `app/page.tsx` form is not the current entry point.
- `src/data/content.ts` connects world items to products using `serviceId`; customer opens a fruit detail dialog and sees the shared ServiceCard. Current worlds: Web & Business, Art & Media, AI & Engineering, Education & Community, Music & Sound, Ventures & Inventions, Wisdom & Exploration.
- ServiceCard uses hardcoded public test Payment Links and product/price IDs from JSON. These IDs/URLs are not secret credentials. `testCheckout()` restricts outgoing links to Stripe test URL syntax. It is a UX safeguard, not server authorization.
- Scope/eligibility is acknowledged by a customer-ticked checkbox. Capacity is operator-managed in `app/commerce-capacity.ts`, last annotated 2026-09-30: websites 1/3, automation 0/1, receptionist 0/1. These are historical code values, not verified current capacity. Unknown/full states show Request Next Opening / Join Project Queue.
- Intake and post-checkout follow-up use prefilled `mailto:hello@starrtree.org`. No current on-site intake submission backend or automatic booking integration found. Google Calendar remains the stated availability authority; booking links are deliberately withheld pending manual payment verification.
- No site payment success page exists. The Stripe API confirms all 19 active links use hosted_confirmation with no custom next-step message. Site return UI explicitly says returning does not confirm payment; it does not claim payment success.
- Environment convention: Vite `import.meta.env.BASE_URL` for asset paths; no Stripe env configuration found. `.gitignore` excludes `.env*`, `.vercel/`, `dist/`, `node_modules/`. No tracked environment credential file found. Pattern scan found no Stripe secret, restricted, publishable or webhook key tokens in current source. This is not a full Git-history or host-secret audit.
- Music vault/media are browser-delivered assets, including files under `public/audio/`. The game is an experience gate, not an access-control or anti-download boundary. Do not sell exclusivity based on it.
- Existing `npm test` script targets five commerce rendering assertions, including A-D and test URL guard. These do not prove payment settlement, actual approval, webhook processing or delivery. No payment was submitted during this audit.

## 2. Stripe read-only reconciliation

The connected account is The StarrTer sandbox, `livemode=false`. Read-only API lists returned complete pages: 19 active products, 20 active prices, 19 active Payment Links, and zero webhook endpoints. All 20 catalog price references resolve to the expected product; all 19 linked checkouts contain the expected price at quantity one. Two prices recur monthly: Website Care $99 and Receptionist $199; Receptionist has a separate $950 one-time setup. Workshop has a $500 starting-price object but no payment link. Studio has a test link but is intentionally not attached to the newer portable-kit offer.

All active links currently have no custom intake fields, no required terms acceptance and automatic tax disabled. Their use of generic hosted confirmations leaves next steps dependent on the site/email. These are launch decisions, not permission to change account settings. No customer, charge, bank credential or secret was retrieved.

## 3. Proposed architecture

### Stage A: hosted payments with explicit manual operations

Keep the existing approved fixed-scope test links; Stripe owns price collection. Use operator verification in Stripe before delivery. Intake must establish deliverables, deadline, permissions and acceptance before payment when scope varies. Deposits do not reserve labor. Use private client-specific invoices for custom amounts and remaining balances, created by the owner in Stripe Dashboard; reuse existing products where applicable rather than making a generic public pay-any-amount button.

For bookable work: confirm scope and availability → test payment → operator verifies actual payment in Stripe → send private Google Calendar invitation/link → customer books → send booking confirmation. Payment is not a reservation. Preserve 24-hour notice, 21-day horizon and 24-hour cancellation/reschedule rules as existing defaults pending owner review; photo maximum one/day, consultation maximum two/day, studio maximum one/evening. Do not research or build automatic payment-gated Calendar controls or a custom booking backend.

### Stage B: minimal server support, after approval

If Vercel ownership is confirmed, add serverless functions in this same repository, keeping the Vite frontend and visual design. No framework migration. Reserve `/api/` from the current SPA catch-all and test routing; use same-origin endpoints. Proposed components:

- Server-only service registry: service slug, sandbox Product/Price/Payment Link IDs, payment type, permitted quantity, currency, approval requirement, fulfillment policy. Client sends service slug/approval token, never a trusted amount or arbitrary Price ID. Retrieve and verify active Stripe objects and `livemode=false` server-side. Maintain a distinct explicit live configuration only in a separately authorized future run.
- For discovery/eligibility-dependent checkout, use a server-recorded approval plus an expiring, unguessable, client-bound invitation. Generate a Checkout Session with the existing allowlisted price only after approval/capacity review. A browser checkbox or hidden shared Payment Link cannot enforce approval. Do not expose public immediate checkout for these services.
- `POST /api/stripe/webhook`: verify raw bytes with the endpoint signing secret and Stripe-Signature; reject malformed/invalid requests. Validate account/environment, line items, expected currency, quantity, amount and order mapping. Handle paid completion and asynchronous success/failure, plus invoice paid/payment failed and subscription updated/deleted for recurring access. Checkout completion alone does not authorize delivery of an unpaid delayed transaction.
- Durable minimal ledger (provider requires owner approval): orders, approvals, fulfillment and processed event IDs, with unique constraints on event/session and transactional claims. No CRM. Record paid state before acknowledging, retry failed fulfillment safely, tolerate duplicate/out-of-order events, and reconcile through Stripe retrieval. Never depend on function memory/filesystem for persistence.
- Verified status endpoint and return UI: retrieve session server-side, disclose only minimal authorized status; distinguish unpaid/pending/paid/failed/canceled. Redirect/query parameter alone grants nothing. A public session ID must not reveal customer PII or paid files. Webhooks remain the reliable background path even if customer never returns.
- Manual fulfillment remains adequate for custom services. Automated digital delivery later uses a verified order, authenticated customer or expiring delivery token and private storage/signed URL. Bind preset selection to the order, with clear personal-use/license terms. Never place paid masters in `public/` or trust localStorage/game progress as entitlement.
- Use Stripe's hosted customer portal for subscription management, backed by verified customer identity when issuing portal sessions; do not accept an arbitrary customer ID from the browser. Start Receptionist monthly billing only after setup delivery/acceptance through a separate invitation; no automatic $199 charge upon setup checkout.
- Server secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`; mode variable `STRIPE_MODE=test`. Store in host secret settings, never `VITE_*`/client bundle. Keep production live credentials absent for this project phase. Use secretless `.env.example` only if later authorized; current ignore excludes it unless explicitly excepted. Restrict access and redact logs.

## 4. Service-to-Stripe integration matrix

All website locations mean world → fruit → detail dialog in `src/data/content.ts`/`src/App.tsx`, with shared ServiceCard. IDs and amounts were reconciled to sandbox on the audit date. CTA column is proposed policy, not a change made by this audit. Booking windows in code are illustrative historical defaults; check Google Calendar rather than treating them as current availability.

| Service / website location | Existing product | Existing price / payment type | Required intake | Scheduling / approval | Fulfillment / appropriate CTA |
|---|---|---|---|---|---|
| Starter One-Page Website / Web & Business | `prod_VJ1NQKFYO8npob` | `price_1UIPKuR3m5Mdthc79GjrwMbI`; $375; One-time deposit | Name/email, brief, assets, deadline | Discovery and written scope approval; capacity review; Max 3 active website builds at once | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Multi-Page Business Website / Web & Business | `prod_VJ1OdYp4vIasak` | `price_1UIPLzR3m5Mdthc7tlyIM1y9`; $750; One-time deposit | Name/email, brief, assets, deadline | Discovery and written scope approval; capacity review; Custom scope before full build | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Shopify / E-commerce Storefront / Web & Business | `prod_VJ1OOBkSgTknq0` | `price_1UIPM3R3m5Mdthc7IhqgVp4V`; $750; One-time deposit | Name/email, brief, assets, deadline | Discovery and written scope approval; capacity review; Product count, apps, assets and integrations affect final price | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Website Care Plan / Web & Business | `prod_VJ1OvIgnlsz6FR` | `price_1UIPM6R3m5Mdthc7VXnL7Sjn`; $99/month; Recurring monthly | Client/site URL, eligibility, support scope | Owner site approval | Monthly agreed care; approved invitation → Subscribe; portal manages billing |
| Google Business Profile Cleanup / Web & Business | `prod_VJ1OztN65i55mv` | `price_1UIPM9R3m5Mdthc7RPkg9KFX`; $150; One-time direct purchase | Name/email, brief, assets, deadline | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| Local Visibility Setup / Web & Business | `prod_VJ1PaSZ4fDrpke` | `price_1UIPMSR3m5Mdthc7ZfOIqCg5`; $300; One-time direct purchase | Name/email, brief, assets, deadline | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| Payment + Booking Setup / Web & Business | `prod_VJ1PflO45sDTGU` | `price_1UIPMVR3m5Mdthc7AvyGdQuM`; $450; One-time direct purchase | Name/email, brief, assets, deadline | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| Poster / Flyer Design / Art & Media | `prod_VJ1Ph6qBjJes0a` | `price_1UIPMZR3m5Mdthc7voV53dJD`; $125; One-time direct purchase | Name/email, brief, assets, deadline | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| Business / Artist Photo Shoot / Art & Media | `prod_VJ1PU4tWPFnjiw` | `price_1UIPMcR3m5Mdthc7D0ffiGi6`; $250; One-time payment + manual booking | Name/email, purpose, preferred timing, location/duration | Availability confirmation; Calendar after verified payment | Private Calendar invitation, then booking confirmation; Confirm Availability → Book Session |
| AI Receptionist Starter / AI & Engineering | `prod_VJ1PqpP9AwI9hI` | `price_1UIPMfR3m5Mdthc71YmWBRY2`; setup `price_1UIPPJR3m5Mdthc70y5BUg0e`; $199/month + $950 separate setup; One-time setup + recurring monthly | Business, call handling, hours, consent/data needs, integration scope | Discovery; one active receptionist implementation; One active receptionist implementation at a time until delivery system is mature | Setup delivery/acceptance → private monthly invitation; Start Project → Pay Setup → Subscribe |
| Custom GPT / AI Assistant Starter / AI & Engineering | `prod_VJ1PfCK3nMWXTE` | `price_1UIPMxR3m5Mdthc7JskZAKgA`; $250; One-time deposit | Name/email, brief, assets, deadline | Discovery and written scope approval; capacity review | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Automation Workflow Build / AI & Engineering | `prod_VJ1PA2sVSXUswo` | `price_1UIPN1R3m5Mdthc7trOlQNfz`; $750; One-time deposit | Name/email, brief, assets, deadline | Discovery and written scope approval; capacity review; Custom n8n/API/database work requires discovery | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Studio Recording Session / Not bound: portable-kit fruit has no serviceId | `prod_VJ1PfymguBhIn2` | `price_1UIPN5R3m5Mdthc7JXMVSkDA`; $120; One-time payment + manual booking | Name/email, purpose, preferred timing, location/duration | Legacy offering: withhold until explicitly approved | Do not repurpose $120/2h checkout for portable kit; Enquire |
| Mix + Master — Single Song / Music & Sound | `prod_VJ1PfSiyyPiLgF` | `price_1UIPN8R3m5Mdthc7JKyjLtLD`; $75; One-time direct purchase | Stems/files, song length, rights, target, revision scope | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| BandLab Vocal Preset / Music & Sound | `prod_VJ1Q0LFoFxb9hC` | `price_1UIPNCR3m5Mdthc76Wvj1N0d`; $30; One-time direct purchase | Preset selection ID, email, compatibility and license | Scope/turnaround confirmation | Manual selected preset delivery after payment; select preset → Buy |
| Custom Theme Song / Music & Sound | `prod_VJ1QPr9b7beXTg` | `price_1UIPNbR3m5Mdthc7ms4hKWYt`; $50; One-time deposit | Brief, usage rights, beat license, scope and deadline | Discovery and written scope approval; capacity review | Deposit credited to agreed project; intake/kickoff then balance invoice; Start Project → Pay Deposit |
| Short-Form Promo Edit / Art & Media | `prod_VJ1QZHUlEK0bwX` | `price_1UIPNgR3m5Mdthc7iv0eGQLc`; $150; One-time direct purchase | Name/email, brief, assets, deadline | Scope/turnaround confirmation | Manual delivery after verified payment; Buy after scope confirmation |
| AI / Creative Tech Consultation / Education & Community | `prod_VJ1QybXL9BGtlB` | `price_1UIPNkR3m5Mdthc74ZUV9aGg`; $150; One-time payment + manual booking | Name/email, purpose, preferred timing, location/duration | Availability confirmation; Calendar after verified payment | Private Calendar invitation, then booking confirmation; Confirm Availability → Book Consultation |
| AI Workshop / Training / Education & Community | `prod_VJ1QYUlEhTzh36` | `price_1UIPNpR3m5Mdthc71JbuxyO6`; $500; Starting price; discovery-led | Audience, dates, duration, curriculum | Discovery and agreed quote; Calendar | Owner invoice after scope; Start Project (no public $500 checkout) |

Additional flows without approved fixed products:

| Flow | Stripe mapping | Intake / schedule / fulfillment | CTA |
|---|---|---|---|
| Custom client invoices and final balances | Private hosted Stripe invoice; reuse project product; owner sets agreed balance after deposit reconciliation | Client + project ID, scope, milestone, deposit credit, due date; manual verification first | Pay Invoice, private client link |
| Portable Home Studio Kit | No approved mapping; legacy studio product is not equivalent | Equipment/travel/package quote and availability confirmation first | Request Quote |
| Artist feature / collaboration | No fixed product in catalog | Usage rights, stems, credit and availability agreement; private quote/invoice | Discuss Collaboration |
| Song downloads / vault monetization | No existing approved music-download price or entitlement system | Owner must approve rights, licensing, selection, price and delivery policy; retain free vault experience | Listen; optional future Buy Download only after approval |

## 5. Risks and required controls

| Priority | Finding | Required control |
|---|---|---|
| P0 | Deployed source identity not fully proven | Confirm current Vercel project/domain/Git commit before implementation or publishing; do not use Pages as substitute |
| P0 | Catalog is sandbox inventory, not approved commercial menu | Owner approves which offers, prices, scope and public purchase paths remain |
| P0 | Checkbox and shared public links bypass approval | Private owner invoice or server-authorized session for scoped/eligible work; no client-only security claim |
| P0 | No automated payment verification/webhooks | Manual Stripe verification now; signed/idempotent handlers before automatic entitlement or subscription fulfillment |
| P0 | Capacity counts stale and non-atomic | Review X tracker; fail closed when unconfirmed; preserve website cap 3 and high-complexity automation cap 1; do not invent current counts |
| P1 | Receptionist recurring URL sits in client JSON, although not rendered | Treat as discoverable public URL; private invitation authorization is needed before live billing |
| P1 | Paid preset selection not bound to payment | Record chosen preset with order; compatibility and license approval; test incorrect/missing selection |
| P1 | Mailto follow-up requires customer email app and action | Approve lightweight intake with persisted submission/reference and accessible confirmation; payment confirmation includes clear next step |
| P1 | Public audio URLs can be copied | Retain free vault; private storage/entitlements for future paid downloads; no promise of copy prevention |
| P1 | Generic Stripe confirmation, no terms consent, unspecified price tax behavior | Owner approves policies, tax treatment and service delivery/cancellation wording before any live launch |
| P1 | SPA rewrite may swallow new API endpoints | Explicit API exclusion/routing and raw-body webhook test |
| P2 | Existing tests exercise shared legacy component, not current navigation or payment lifecycle | Add representative current-app tests plus focused server security/integration cases in approved implementation phase |

## 6. Prioritized implementation plan (not started)

1. **P0: provenance and commercial review.** Confirm Vercel mapping and production commit; reconcile this audit against any newer branch; approve matrix, current capacity, scope, refund/cancellation/turnaround terms, tax approach and studio exclusion. No deployment changes.
2. **P1: smallest manual sandbox flow.** Preserve links and design. Agree intake schema and operational owner. Improve confirmation/next-step copy and private scoped checkout issuance after approval. Use Dashboard-hosted test invoices for bespoke balances. No product duplication.
3. **P1: server foundation, only after architecture approval.** Implement sandbox registry, serverless routing, secrets setup, minimum durable ledger, approval check and signed webhook/status endpoint. Pin API/SDK versions after consulting current Stripe docs. Do not deploy without separate approval.
4. **P2: lifecycle and delivery.** Implement customer portal plus recurring-state reconciliation, setup-to-subscription invitation, optional private digital fulfillment and authorized downloads. Keep human-delivered work and Calendar booking manual.
5. **P2: focused verification.** A: Poster/Flyer $125 one-time. B: Custom GPT $250 deposit toward $500+. C: Care $99/month. D: consultation $150/hour and manual Calendar handoff. Verify current desktop/mobile navigation, checkout amount/type and accurate next step. Add failed/canceled/delayed payment cases, forged return URL, altered price/quantity/currency, invalid signature, wrong mode, duplicate/out-of-order event, missing approval, stale/full capacity, unauthorized status/download and recurring failure/cancellation. Never use a real card. Fix/retest affected paths only; no need to exhaustively pay all 19 products.
6. **Release gate.** Run production build and applicable tests; scan tracked files and built assets for secrets; present diff, test evidence and rollback steps. Owner reviews architecture first and later authorizes deployment. Live activation is a separate future decision and not included in this run.

## 7. Owner decisions

- Which sandbox offers/prices are approved for public sale and which stay quote-only? Approve broad design/promo fruit copy against narrow purchasable scope.
- Are legacy fixed studio sessions retired? Approve portable-kit scope separately.
- Current capacity from the canonical X tracker; who keeps it current? Keep caps 3 website builds and 1 high-complexity automation implementation.
- Approve manual-first hosted payment/invoice model, or server approval/session gate for scoped services; approve durable ledger provider/cost before adding it.
- Approve refund/deposit credit, cancellation, revisions, delivery deadlines, recurring cancellation and Receptionist monthly start terms; tax review as appropriate.
- Approve intake data retention, receipt/follow-up channel, digital licenses and preset selection requirements.
- Confirm current Vercel project and deployment source. Separately approve implementation and later publication. No live permission inferred from business verification or bank linking.

## 8. Verification scope and blockers

Completed: complete tracked-tree inspection; entry/import and CTA tracing; sandbox read-only catalog/price/link reconciliation; zero-webhook check; current-source key-pattern scan; live HTTP shell/redirect inspection. No API writes, products, payments, subscriptions, messages, host settings, code behavior or DNS changed. No screenshot-based customer walkthrough or new payment test claimed. Existing tests/build were inspected as scripts; not run for this documentation-only change.

Blocker before implementation: exact current Vercel project and deployed Git commit could not be verified through the connected project lookup after one scoped recovery attempt. Repository audit remains valid for the named SHA; validate deployment parity before making code changes. Architecture and offering approval is intentionally pending, not a technical failure.

## Official Stripe references

- [Checkout and Payment Links fulfillment](https://docs.stripe.com/checkout/fulfillment.md?ui=full-page): manual low-volume operations; verified payment state and reliable automatic fulfillment.
- [Webhook signature handling and retries](https://docs.stripe.com/events/manage-webhook-endpoints): raw-body verification, duplicate delivery and recovery.
- [Hosted invoice page](https://docs.stripe.com/invoicing/hosted-invoice-page): private client invoices without building a billing UI.
- [Customer portal](https://docs.stripe.com/customer-management): hosted subscription, payment-method and invoice management.

These sources informed the proposed design. No automatic fulfillment, invoice or portal code has been implemented.

## Implementation checkpoint

See `stripe-sandbox-implementation.md` for the local sandbox foundation and remaining configuration gates. Browser access subsequently verified the production repository, branch, commit and domains; the historical Vercel connector visibility issue remains, but deployment provenance is resolved. No live activation or deployment occurred.
