# October 22 asset and interaction pass

Review source: `refine/chakra-planets-media`, based on remote `main` 0e5b077 and merged with the unmerged `refine/branch-interactions` 882306c. Earlier branches and local main are preserved. Do not publish dist to Pages.

## Deployment mapping verified October 22
| URL | Host | Repository | Source / deployed commit |
| --- | --- | --- | --- |
| starrtree.org | Vercel, redirects to www | starrtree/StarrTree3D | main / 0e5b0774d731badcf96bd86830a093c9e9883a35 |
| www.starrtree.org | Vercel starrtree3d | starrtree/StarrTree3D | main / 0e5b0774d731badcf96bd86830a093c9e9883a35; deployment dpl_H5SHw9FoXiwsLVqQgJpk9JD4bZ2J |
| starrtree.github.io/StarrTree3D/ | GitHub Pages | starrtree/StarrTree3D | preview/cinematic-site / 1c703942f82f79bc120d03bb94d3e49f0ff5e15d; separate older built cinematic version |

Vercel deployment metadata identifies main as the current production source. No domain, branch configuration, promotion or Pages changes were made. The configured future production-branch setting was not independently re-read. See REQUEST-RECONCILIATION.md for the earlier full request list and historical verification.

## Current request checklist
- Implemented: all seven supplied JPG planets converted to transparent PNGs, verified RGBA alpha with transparent corners; mapped onto both supplied home artwork variants. Clicking a planet rolls the image layers with colored glow; hit targets and the readable seven-branch legend remain stationary.
- Implemented: Kumbayaa and Imaya removed from Orchard and dynamically generated portfolio entries. Preview chrome shows project names instead of raw URLs.
- Unclear: Dirty Breakfast already references DIRTYBREAKFAST, pushed May 7; DirtyBreakfast---M2 was pushed May 1. Retained existing URL pending the exact requested replacement. A clarification was sent; no answer received during implementation.
- Implemented: global horizontal paint clipping without introducing a vertical scrolling ancestor, constrained dialog/grid sizing, contained oversized iframe layout. Browser/mobile gesture verification remains pending.
- Implemented: all eight new scene images assigned below. Native scroll changes the homepage portrait background brightness/saturation and opacity of its accompanying copy.
- Implemented: opt-in single iframe, loading/timeout/error feedback, retry and close controls, sandbox without top navigation/popups or media/device permissions. Closing, switching projects or filters removes the frame. Decorative WebGL model is suspended while an external preview is open. An exhibition error boundary keeps optional lazy-chunk failures from replacing the branch/checkout. External sites may still block embedding; their content and browser memory behavior are outside StarrTree control.
- Implemented: final supplied film is a separate pinned homepage chapter. Seeking begins at 1.0 seconds and remains bounded to the film duration; damped spring follows native scroll, alternating authored text then a center CTA; film stays in frame until the chapter releases. No wheel interception. Chapter skip preserves the hash router. Muted export has no audio stream; near-viewport loading, static reduced-motion/error fallback and poster from 1s.
- Preserved: original combined seed intro/song, 0.95s home reveal, existing home idle loop, 1.5s StarrVerse rise pause and subsequent studio idle loop, Ventures blinking-eye backdrop, original branch models, seven-world identity, branch ordering, free-only BandLab URLs and all test commerce/capacity/manual-calendar rules.
- Superseded: prior missing planet-image status; the images are now supplied and transparent home overlays are implemented. Full textured 3D planet modeling remains a future task, not a requirement for these 2D overlays.

## Asset map
Inputs: the 15 JPGs and final MP4 in the user-named attachment folder ending `63E5A77E-E8D1-461C-B2F5-50CC1B85BCA3`. Original files were not modified.

| Input | Delivered path / use |
| --- | --- |
| 1-Photo-1 | public/planets/web.png / Root |
| 2-Photo-2 | public/planets/art.png / Sacral |
| 3-Photo-4 | public/planets/ai.png / Solar plexus |
| 4-Photo-5 | public/planets/education.png / Heart |
| 5-Photo-6 | public/planets/music.png / Throat |
| 6-Photo-7 | public/planets/ventures.png / Third eye |
| 7-Photo-8 | public/planets/wisdom.png / Crown |
| 8-Photo-8 | cinema.originDesktop / home human-at-center interlude |
| 9-Photo-9 | cinema.originMobile / same interlude, portrait |
| 10-Photo-10 | Web mobile branch backdrop |
| 11-Photo-11 | Wisdom mobile branch backdrop |
| 12-Photo-12 | Art branch backdrop and home studio teaser |
| 13-Photo-13 | cinema.portrait / About Max |
| 14-Photo-14 | cinema.mobilePoster / portrait home fallback |
| 15-Photo-15 | cinema.homePoster / desktop home fallback |
| final MP4 | cinema.journeyVideo / silent H.264 faststart, 1280x704, 9.23s, frequent keyframes; journeyPoster sampled at 1s |

Imagegen edit prompt (one source per call): remove only the outside white background; preserve original planet outline, color, surface and central symbol; centered isolated planet with true alpha, luminous antialiasing and small transparent margin. Seven generated cutouts inspected; delivered PNGs resized with FFmpeg to max 512px. JPEG-to-WebP derivatives are quality88. Generated originals remain in the calling task's generated_images directory. Planet coordinate percentages are typed in `src/data/planets.ts`; the same contained image plane positions artwork and buttons at each viewport size. The loop has its own measured coordinate set.

## Verification and limits
- Production TypeScript/Vite build passes; all five commerce checks pass.
- Desktop and mobile static React renders contain seven labelled targets, seven branch legend buttons, both fallback artwork paths and the chapter skip. Orchard render omits the two removed projects and loads zero iframes before input. This is render/content validation, not a browser layout test.
- All seven PNGs have true alpha (0..255) and transparent corners. Cutouts inspected visually. FFprobe confirms new film has one H.264 video stream and no audio stream.
- Current UI resource techniques reuse the prior Motherboard audit: pinned native-scroll film/overlays (Scroll-Scrubbed Video Hero / VANTR), stable HTML navigation over art, Liquid Glass-inspired rims without another page-capture renderer. No new runtime dependency added.
- Browser session inspection returned no browsers; attempts to create iab and Chrome reported unavailable. App browser open request was queued. Consequently this pass has no verified desktop/mobile screenshots, physical phone overflow/tilt/audio check, or browser proof of iframe error/retry behavior. These are explicitly pending review, not passed checks.
- Exact Dirty Breakfast replacement remains pending. Older outstanding items remain: Earth-textured tetrahedron model, Spline/StarrVis animation, Twitch/Star Mutation links and excerpt timestamp choices. No invented URLs or final 3D renders.

Next production action after reviewing the preview: merge this review PR into main so the existing Vercel integration deploys it. Do not promote or merge during this pass.
