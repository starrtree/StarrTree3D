# Editing StarrTree3D

This is a normal React + TypeScript + Vite project. Editing does not require Astra, Work mode, Blender, Spline, a Cloudinary account or any secret environment variable.

## Run and build

The phone preview uses GitHub Pages at `https://starrtree.github.io/StarrTree3D/`. Source remains on `redesign/seven-worlds`; the separate `preview/cinematic-site` branch contains the built site only. Use `npm run build:pages` for that host. `scripts/prepare-pages.mjs` rebases public media URLs for the repository subdirectory. Publish the contents of `dist` to the deployment branch, including `.nojekyll`; never copy a `CNAME` or change starrtree.org.

The combined intro is `cinema.introVideo` in `src/data/cinema.ts`. `homeRevealSeconds: 0.95` controls the homepage reveal and second impact; the same video continues until its end, then the idle loop starts. The original video audio is removed. StudioArrival autoplays to halfway and then uses a damped spring for scroll seeking. ScrollTrigger animates the logo/text and media parallax while the page itself moves normally; nothing is pinned.

Use Node.js 22.13+ (tested with Node 24). In the repository folder:

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

Development and preview default to http://127.0.0.1:4173. Stop the development server before using the default preview port, or use `npm run preview -- --port 4174`. Hash routes work on static hosting.

## Change text, status or labels

Edit `src/data/content.ts`. `worlds` holds world titles, summaries, descriptions, symbolic frequency labels and order. `items` holds destination text, type, status, image and links. Keep `id` stable so bookmarks and references keep working. Types distinguish Service, Product, Release, Portfolio, Venture and Concept. Do not mark an unverified launch or proposed collaboration as live.

Some original homepage copy is in `src/App.tsx`; the original logo remains `public/images/starrtree-gold-logo.png`. Its source model is unchanged in `public/models/StarrTree1-optimized_jzc43w.glb`.

## Add a service

1. Add its record to `app/commerce-catalog.json`, following an existing item. This is the one authority for price, terms, payment links, booking windows and capacity group. Use only an already-created Stripe TEST payment link. Leave a link null for discovery-only work.
2. Add an `items` entry in `src/data/content.ts` with kind `Service` (or `Product`), its `worldId`, and `serviceId` matching the catalog ID. Search and world pages include it automatically.
3. Shared `ServiceCard` in `app/CommerceCatalog.tsx` preserves approval, deposit, subscription, manual booking and test-mode controls. Do not bypass it in a new card.
4. Update the operator-reviewed counts in `app/commerce-capacity.ts` only after reviewing real projects. Null means unknown and blocks checkout. Limits are three website builds and one automation implementation; receptionist implementation also has its own one-at-a-time gate. A full group shows Join Project Queue; unknown shows Request Next Opening.
5. Run build/tests and check the service detail. No payment is needed.

AI Receptionist is $950 setup plus a separate $199/month subscription invitation after delivery. No public recurring link was supplied in the source. Do not invent one. Payment does not reserve a Calendar slot; StarrTree sends the private Calendar invitation after manual verification. Calendar remains availability truth; listed typical windows are informational.

## Replace a sculpture

Put a web-ready `.glb` and its still PNG/WebP poster in `public/fruit/`. Change `model`, `poster`, `bytes` and provenance in `src/data/assets.ts`. All assignments are public paths. `StarrFruit.tsx` shows the poster; `OpticalScene.tsx` loads on the optional 3D button and applies optical materials. The poster remains available if WebGL fails, and reduced-motion uses the still image.

Blender is optional for future edits. If needed, editable sources are `public/fruit/starrfruit-source.blend`; `scripts/fruit-build.py` rebuilds the seven exports in a separate Blender process. Frequency labels are symbolic, not simulation parameters or healing claims. No Cloudinary session is required.

## Reorder worlds

Move entries in the `worlds` array in `src/data/content.ts`, then adjust the `number` labels if desired. The overview follows array order. Desktop positions belong to `.st-node-0` through `.st-node-6` in `src/styles.css`; mobile uses a readable grid. StarrX/About is the central button and is never an eighth world.

## Music and layout

`app/musicReleases.ts` and `app/vaultTracks.ts` contain the original release/track records. `app/ReleasePromotion.tsx` contains exact MyPOV and Sharks & Starrs links. Audio is opt-in. `src/App.tsx` owns shared navigation, world pages, filters and accessible HTML dialogs. `src/styles.css` owns the redesign; `src/legacy-features.css` contains only preserved music, vault and commerce styles. Other old `app/` page/3D files are reference source, not the running homepage.

## Deploy a Vercel preview

The local CLI was logged out during this run. No Vercel project, domain or production deployment was changed. From this repository, after signing into the intended StarrTree Vercel account:

```sh
npx vercel login
npx vercel link --project starrtree3d --scope starrtrees-projects
npx vercel deploy
```

If `starrtree3d` does not exist, create that project during linking and connect it to `starrtree/StarrTree3D`, branch `redesign/seven-worlds`. Review the selected project before deploy. `vercel.json` uses Vite's `dist` output. Do not use `--prod`, attach starrtree.org, or alter StarrTreeGPT. Verify the returned preview URL loads on desktop and mobile before claiming deployment complete.

Future hooks: original StarrX models and legacy intro implementation remain available. A full intro video, Spline integration and animated StarrVis head were deliberately deferred.
# Cinematic media and motion (October 5, 2026)

The new experience is normal React + CSS + GSAP. No external editor or account is needed to change it.

- **Replace films, music, posters, or the studio logo:** edit `src/data/cinema.ts`. Files live in `public/cinema/`. Videos must have no source audio; the soundtrack and effects are separate, opt-in audio.
- **Entrance:** `src/components/SeedEntrance.tsx` controls the original StarrSeed, its green/gold activation, the combined intro film and its 0.95-second homepage reveal, and Skip film. Session key `starrtree:cinema:v3` prevents repeating the intro; Replay welcome reopens it.
- **Home composition:** `src/components/CinematicHome.tsx` and `src/cinematic.css`. Desktop uses a muted film; mobile uses the portrait artwork with gentle motion to preserve all seven worlds. World labels never move.
- **Studio scroll film:** `src/components/StudioArrival.tsx`. GSAP ScrollTrigger maps scroll to video time and fades to the supplied still at the end. Pause motion / reduced motion uses the still. Art and Music link to each other as StarrVerse Studios.
- **Sound:** `src/components/Experience.tsx`. “Enter with sound” opts into the unreleased `0nly_1` soundtrack and impact effects. Silent entry remains silent. Opening an item pauses the soundtrack so release players can be used without overlap. The fixed player can resume it.
- **3D:** existing exported models and posters remain in `src/data/assets.ts`. `OpticalScene.tsx` provides optical materials and gentle movement. World pages enable one model at a time; Pause motion, reduced motion and WebGL failure retain the poster.
- **Regenerate optimized media:** `node scripts/prepare-cinematic-media.mjs "C:/path/to/originals"`. Requires FFmpeg (`FFMPEG_PATH` can override its location). This is optional preparation; serving and editing the finished site needs only Node. Original filenames are recorded in that script, and source originals are not modified.

## Existing content and commerce editing guide



## October 6 visual refinement
World pages now use `src/components/HudDestinations.tsx` and `hud.css`: alternating glass title capsules, expandable descriptions, pointer highlights and optional permission-gated phone tilt. Services and All Items retain their direct searchable directory layout. All labels remain HTML.
`StudioArrival.tsx` now holds its video in a sticky viewport for a 260svh chapter. First-half autoplay, spring-smoothed second-half seeking and overlay motion are retained. It releases into the page at the chapter end. A second film is pending a supplied asset.
Four preserved original GLBs are assigned in `src/data/assets.ts`; `preserveMaterials: true` keeps their texture maps. The third-eye Eye of Ra is assigned to Ventures. The Earth-textured tetrahedron is not identified, so AI retains its existing sculpture. No private Cloudinary login is required for these local copies. Transparent posters were rendered from the original models using `scripts/model-poster-preview.html` (open through Vite; call `renderModel('/models/filename.glb')`, then export the canvas as PNG). Local Draco decoder files remove the runtime decoder CDN dependency.
Phone sensor behavior needs a physical device check; browser emulation verifies layout and touch-sized controls only. Reduced motion keeps the still and readable HTML.
