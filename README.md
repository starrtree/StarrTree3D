# StarrTree3D

Seven worlds. One living root. An editable React/TypeScript redesign of StarrTree, preserving original branding, music, assets and TEST commerce behavior.

Start with [EDITING.md](EDITING.md). Active interface: `src/`. Content: `src/data/content.ts`. Asset assignments: `src/data/assets.ts`. Preserved commerce: `app/CommerceCatalog.tsx`, `app/commerce-catalog.json`, `app/commerce-capacity.ts`.

Source: `starrtree/StarrTreeGPT` main at `3830839583c7a0c6c3627a32d6bf8653616a405f`.
Target backup: `backup/pre-redesign-2026-10-03` at `18cb93c635c03cf2bcfa388f751a1c3c660db8f0`, remotely verified before edits.
Development branch: `redesign/seven-worlds`. Target main was left intact; no force push.

`npm ci`, `npm run dev`, `npm run build`, `npm test`. No secrets/environment variables required. No backend, live Stripe objects, DNS or production changes. Vercel deployment remains blocked by local CLI login and unavailable connector deployment tool.

See `docs/ASSETS.md`, `docs/CONTENT-SOURCES.md`, and `docs/VERIFICATION.md` for exact provenance and tested limits.
