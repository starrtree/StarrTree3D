# The Website Orchard — Web & Business StarrFruit

## Scope

The portfolio lives in `src/data/websites.ts`, renders through `src/components/WebsiteOrchard.tsx`, and is styled in `src/website-orchard.css`. It appears **only** when opening Web & Business (`#/world/web`), before that world's existing commerce/service destinations. Projects are also indexed into the global item search. The other six worlds and test checkout paths are unchanged.

## Interaction

- Entering the Web StarrFruit reveals an animated halo and browser stage, with a scanner line, constellation glyph, category filters and a selection rail.
- Select a project to update the colored browser stage. The illustrated standby is intentionally **not** presented as a real screenshot.
- Click **Load homepage preview** to request exactly one external website iframe. No hidden iframe autoplay, background crawl, remote thumbnail service or paid preview API. The preview is view-only and does not capture visitors' data.
- Click the site link to open its real hosted address in a new tab, or GitHub for source. Some sites block embedding with CSP/X-Frame-Options and some GitHub Pages paths may not host a current build. There is no reliable cross-origin way for the embed to determine whether a page refused to display.
- Resizing uses ResizeObserver to fit a 1280px virtual browser width into the visual frame. The external site remains responsive when opened in full.
- Animations obey the site's Motion toggle and prefers-reduced-motion; keyboard navigation uses native buttons and focus styles.

## Provenance and editorial limits

12 web projects are sourced from the public `starrtree` GitHub repositories. JZ Inkz, TIMELESS and CAC have `homepage` URLs recorded in repo metadata; these are *source-listed*, **not independently live/visual verified**. Heritage Africa uses a repo CNAME domain. Other GitHub Pages preview URLs are inferred from a repository with `has_pages: true`, not confirmed as reachable. All are marked appropriately in the interface.

The `Kumbayaa_Beauty` repo currently contains only image assets and no website entrypoint. `Jessikafeliz` is empty. Neither is presented as a completed website. All visible projects are labeled as Concept, Prototype or Studio project. Do not claim client approval, a paid contract, measured business impact, deployment success, or completed checkout without documented evidence.

## Manual acceptance checklist

1. Visit Vercel preview and navigate Home → Web & Business StarrFruit → Website Orchard; confirm entry animation, heading, graphics, horizontal browser carousel and mobile layout.
2. Select each project, try opt-in preview, and use **Open website / Try hosted preview**. Verify domain, embed permission, current version and browser console. Prefer approved real screenshots when embedding fails.
3. Check buttons using keyboard and iPhone Safari; test motion pause and reduced-motion settings.
4. Verify `#/search` finds JZ Inkz and Crown's Pizza & Wings; verify Services and payment / booking test guards retain the original behavior.
5. Get client/artist permission for public examples and any screenshots; promote only genuinely approved case studies to the official marketing showcase.
6. After QA, merge the PR to `main` and check production deployment and live custom domains. Do not move DNS or alter pricing to release this feature.
