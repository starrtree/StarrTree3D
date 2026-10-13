# Reconciled StarrTree requests — October 13, 2026

Source of truth: human requests in this chat, then the latest explicit cloud-review instructions. NEXT-REFINEMENT.md exists in the parent task directory. `git log --all -- NEXT-REFINEMENT.md` returned no committed version. That local note predates the completed idle and blink films; its Pages publishing instructions are superseded by this preview-only pass. The original clean local redesign branch remains untouched. The older local main (fac6cea) was preserved; current remote main was used.

## Deployment reconciliation
- starrtree.org: Vercel project starrtree3d, redirects 308 to www.starrtree.org. Alias points to dpl_BaFzxr6vXawCbsHvcCZich78KCWW, built from starrtree/StarrTree3D main at a14b68e32aedf9398a9787e0814aa8f988fced08.
- www.starrtree.org: same Vercel production deployment. Domain API shows no branch-specific domain override. Latest production metadata says main. Vercel environment settings UI was blocked by a 2FA recommendation; automatic review rejected dismissing it. The separate configured future production-branch field was not readable. No settings or protection were changed.
- starrtree.github.io/StarrTree3D/: GitHub Pages settings verified Deploy from a branch, preview/cinematic-site / root, no custom domain. Branch head 1c703942f82f79bc120d03bb94d3e49f0ff5e15d (Delete CNAME); last Pages deployment shown October 8. This is the separately built older cinematic site, including the original idle/blink work, not the new cloud review or this refinement. No Pages changes in this pass.
- Cloud review a2a777f: refine/checkout-seed-fruit, draft PR1. Its ancestor is current remote main; fast-forwarded into new review branch refine/branch-interactions. No main/Pages updates, reset, force push, branch deletion or DNS changes.

## One recovered checklist
| Request | Status | Result / exact remaining work |
|---|---|---|
| Seven ordered branches, center StarrX, exact logos, Explore/Services/All Items/Search | Already implemented | Order remains Web & Business; Art & Media; AI & Engineering; Education & Community; Music & Sound; Ventures & Inventions; Wisdom & Exploration. |
| Original compressed TV, bio-orb, keyboard/piano console, Eye of Ra | Already implemented | Reused local inherited GLBs and original textures; compact transparent posters. Eye is Ventures/third eye. Web root lattice, AI solar gyroscope and Wisdom crown lenses retained. |
| Earth-textured blue/green tetrahedron | Missing asset | Exact model/file URL still unidentified. No invented replacement assignment. |
| Final chakra planet renders / transparent cutouts / textured models | Missing asset | User said images would be supplied later. Preserve manifest swap hook; no new Blender work required in this pass. |
| 0.95s home reveal; uninterrupted combined intro into home loop | Already implemented | Preserved; added cloud combined film+0nly_1 file. |
| Gold/green seed click and two flight angles | Superseded | Latest cloud-review direction: only exact StarrSeed and Collect CTA, grows/backglow/white floodlight, one combined film. Original files remain preserved. |
| Intro timestamp-zero song synchronization | Implemented | Kept combined media from cloud review; original click primes AudioContext, browser-required Play film retry remains. Seed/arrival impacts retained. No audio before input. |
| StarrVerse play halfway then scrub | Superseded | Explicit confirmed pause at 1.5s, logo visible initially, scrolling fades logo and reveals vision card. |
| Studio video stays in frame as UI passes; rest of page moves only after chapter | Already implemented | Sticky rise chapter, eased scroll seeking, user-supplied idle loop follows and stays pinned. |
| New blinking-eye movie stays pinned in Ventures | Already implemented | Preserved supplied WebM derivative with muted fixed scroll seeking and extracted still. |
| Black-background stars orbit slowly with depth, tiny sparks | Implemented | One decorative canvas with perspective-projected orbit, light sparks, static motion-off fallback. |
| Fruit grows quickly into dim cropped planet backdrop and relocates/rotates with capsules | Implemented | Same hero sculpture moves into fixed low-opacity background; alternates edges, grows and rotates as nearest capsule changes. Reduced motion retains static hero. Stars layer behind it. |
| Yellow capsule edge burst, branch-colored scanning shine | Implemented | Web specular scan, Art glitch bars, Music waveform, AI pixel grid, Education vine lines/firefly lift, Ventures spectral dispersion, Wisdom violet/orange plasma glow. CSS interpretations; no claim of physical optical accuracy. |
| Mouse tilt and optional phone orientation | Already implemented | Kept accessible controls and explicit permission flow. Physical phone sensor test still needed. |
| Elastic/momentum settling between capsules | Implemented | Optional Soft snap in Branch trail; nearby settling after native scroll ends. Keyboard is never snapped. Compact At a glance remains default. |
| Music catalog label, remove Single Song, plural Presets, replace Studio Recording with Portable Kit | Implemented | Max Starr - Music Catalog; Mix + Master; BandLab Vocal Presets; Portable Home Studio Kit. Legacy Stripe catalog remains unchanged; kit uses enquiry until package scope/pricing supplied. |
| Music parent hierarchy and priority | Implemented | Listen to Music / Max Starr - Music: catalog, Sharks & Starrs, MyPOV first; other listening destinations follow in inherited order. Create Music: BandLab Vocal Presets, Portable Home Studio Kit, Mix + Master, Custom Theme Song, then remaining artist/preset concepts. No All/Service/Product type filter at branch level. |
| Media hierarchy/order and remove Creative Direction capsule | Implemented | Create Media: Short-Form Promo Videos, Image Marketing & Brand Design, Brand & Artist Photography. Creative direction is section framing. Explore Media retains existing gallery/social/film/concept items. Existing $150/$125 checkouts explicitly retain supplied-edit/poster scopes; added formats are quoted separately. |
| Human hierarchies on remaining five branches | Implemented | Typed groups use existing item order; build/explore, learn/community, ventures/ideas, reflections. No new unverified portfolio entries. |
| StarrVerse logo always clickable outside its page | Implemented | Home teaser and Music logo link to Art/Media. On Art the logo is current-page identity. |
| Background swaps | Implemented | Ventures uses eye film/poster; AI uses former Ventures world-orb; Music uses former AI atlas-orb instead of studio override. Wisdom unchanged because no replacement was requested. |
| Two free BandLab presets, paid names only until payment | Implemented | Free kp and Ad Libs (light); all 18 supplied names listed. Paid URLs omitted entirely from public source/build. Original pasted attachment remains private/local. Manual paid delivery only. |
| Continue song when exiting a detail/branch; song snippets | Implemented | Shared catalog/vault player survives detail/branch navigation, 30s provisional previews from start. Full synchronized intro and ambient 0nly_1 retained for latest cinematic brief. Cannot continue after browser closes. Exact excerpt timestamps remain to be supplied. |
| Animated StarrVis / Spline tutorial style | Superseded/deferred | Original run explicitly deferred Spline/head; no service connection. AI pixel response is local code; future guide animation hook remains. |
| Optional CapCut intro generation | Superseded | Supplied combined and idle films used; no credits/account session needed. |
| Twitch URL, Star Mutation music video | Missing assets | Streaming URL and album film not supplied. Current existing music/MyPOV remain. |
| Existing commerce and capacity/manual-calendar gate | Already implemented / preserved | 19 catalog rows compared with Revenue OS; TEST links, $950 setup and $199/month separate invitation, max3 websites/max1 complex automation retained. Persistent checkout follow-up retained from cloud. Monthly Receptionist URL stored separately without exposing premature subscription CTA. |

## Current resource Motherboard used
Read 🌐 Web Assets from the current supplied sheet. Specific techniques: Liquid Glass JS rim/scan vocabulary (CSS adaptation, no page-capture dependency); React Three Fiber for reused model rotation; Scroll-Scrubbed Video Hero/VANTR for pinned native-scroll film and authored overlays. Existing visual-resource-audit.md retained. No Figma/Spline/paid generators needed.

## Validation / limits
Production build and five commerce tests passed. Representative browser checks: Music ordering/compact layout, mobile no overflow, free-only preset links, expanded branch scan, large cropped model background, catalog preview continues after closing detail. Mobile/desktop intro, motion-off and Ventures film checks recorded in the final handoff below. Desktop/browser emulation does not verify physical phone gyro or speaker sound quality. No payment submitted. No new booking backend.

## Single production step
After approving the new review preview, merge its review PR into main; the existing Vercel production integration should deploy main. Confirm that integration's production branch in Vercel when its environment settings can be read. Do not copy source into the built Pages branch.
