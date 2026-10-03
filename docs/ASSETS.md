# StarrFruit assets

The public asset assignments live in `src/data/assets.ts`. The ordinary React site uses committed files and needs no Blender installation or Cloudinary login to run or edit content.

## Visual family

| World | Sculpture | Source | GLB bytes |
| --- | --- | --- | ---: |
| Web & Business | Fourfold root lattice | New Blender membrane geometry | 169,772 |
| Art & Media | Liquid prism | Inherited Liquid Diamond, simplified and rematerialized | 248,156 |
| AI & Engineering | Solar gyroscope | New Blender membrane geometry | 169,748 |
| Education & Community | Shared, intersecting orbits | New Blender membrane geometry | 132,372 |
| Music & Sound | Concentric resonance membranes | New Blender membrane geometry | 132,368 |
| Ventures & Inventions | Prismatic seed | Inherited Prismatic Diamond, simplified and rematerialized | 241,588 |
| Wisdom & Exploration | Stacked crown lenses | New Blender membrane geometry | 244,744 |

Each has a transparent 640px PNG poster, a self-contained GLB, and an editable scene in `public/fruit/starrfruit-source.blend`. The source Blender file is about 1.2 MB. The five new forms deliberately use simple membranes and toroidal geometry. Their category associations and frequencies are symbolic art direction, not scientific cymatic simulations or therapeutic claims.

Compact sculptures always use static posters. The opened world offers an explicit optical 3D toggle; only that world creates a WebGL context. Reduced-motion users retain the static poster. The canvas renders on demand, contains no navigation labels, and falls back to the poster on errors or context loss. All controls remain HTML. Audio is independent and never started by this component.

Blender transmission does not exactly match web rendering. `StarrFruit.tsx` supplies Three.js physical glass, iridescence, clear coat, a category-colored interior, and a local procedural studio environment. No remote HDRI is needed. Static posters are rendered in Blender Cycles.

## Reproduction

From the repository root with Blender 5.2:

```sh
blender -b --python scripts/fruit-build.py
```

The script creates isolated scenes in a separate process, exports all models and posters, and saves the editable source. It does not edit the user's open Blender session. Update manifest byte counts from `public/fruit/build-report.json` after changing geometry. A regeneration may leave Blender's `.blend1` backup; do not commit that backup.

To audit original inherited meshes:

```sh
blender -b --python scripts/fruit-audit.py
```

`public/fruit/inherited-audit.png` shows all 11 original assets, ordered alphabetically left to right, then top to bottom. All imported successfully, including their Draco-compressed geometry and WebP textures. Source format is glTF 2 binary (`.glb`), with `KHR_draco_mesh_compression` and `EXT_texture_webp`. Exact original file sizes and public paths are retained in the manifest. The render and metadata report establish appearance, successful loading, and format.

The two diamond meshes support the optical sculpture direction and were reused. The arcade console, television, figurines, biological garden, mechanical eye, and mechanical orb remain preserved in `public/models`; they were not chosen as category sculptures. The exact StarrTree logo mesh and existing logo image remain unchanged.

## Public Cloudinary references

StarrTreeGPT's current `app/OrbitalPortfolio.tsx` references the 11 models via local `/models/...glb` URLs. A search of current source, documented references, QA notes, and its available full Git history for `res.cloudinary.com` returned no delivery URLs. No Cloudinary URL is invented or inferred from the filename suffixes. `cloudinaryPublicUrls` is therefore empty. Local copies are public, preserved, and sufficient for this implementation. No private Cloudinary account access or credentials were requested or used.

## Verification and limits

- Blender MCP read-only scene check and addon status succeeded: Blender 5.2.2 LTS, current addon.
- All 11 inherited models were imported and visually inspected in the audit render.
- Seven poster renders and seven GLBs exported successfully; exported GLBs contain only the intended active scene's selected sculpture meshes.
- TypeScript compilation passed for the component and manifest.
- The live Blender scene still contains exactly the original Cube, Camera, and Light after the separate rendering process; a follow-up scene check and viewport screenshot confirmed it was preserved.
- Browser integration and desktop/mobile visual QA belong to the final site verification. Do not infer those checks solely from Blender output.

Future hooks: replace a manifest model and matching poster to change a sculpture; add a richer inner-world scene behind the HTML UI if desired. The preserved avatar assets are available for a future StarrVis head, which is intentionally deferred. No Spline dependency is present.
