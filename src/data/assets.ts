/** Public asset assignments. No account session or private URL is needed. */
export type FruitWorldId =
  "web" | "art" | "ai" | "education" | "music" | "ventures" | "wisdom";
export type FruitAsset = {
  model: string;
  poster: string;
  name: string;
  source: "Blender" | "adapted inherited GLB" | "StarrTree chakra GLB";
  preserveMaterials?: boolean;
  format: "glb";
  bytes: number;
};
export const fruitAssets: Record<FruitWorldId, FruitAsset> = {
  web: {model: "/planets/models/web.glb", poster: "/planets/web.png", name: "Root chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 1894384},
  art: {model: "/planets/models/art.glb", poster: "/planets/art.png", name: "Sacral chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 1750608},
  ai: {model: "/planets/models/ai.glb", poster: "/planets/ai.png", name: "Solar Plexus chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 2464144},
  education: {model: "/planets/models/education.glb", poster: "/planets/education.png", name: "Heart chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 2545532},
  music: {model: "/planets/models/music.glb", poster: "/planets/music.png", name: "Throat chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 2218700},
  ventures: {model: "/planets/models/ventures.glb", poster: "/planets/ventures.png", name: "Third Eye chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 2010448},
  wisdom: {model: "/planets/models/wisdom.glb", poster: "/planets/wisdom.png", name: "Crown chakra planet", source: "StarrTree chakra GLB", preserveMaterials: true, format: "glb", bytes: 2682920},
};
export const inheritedAssets = [
  {
    url: "/models/Meshy_AI_Auric_Orb_0804231703_texture-optimized_ehvv1v.glb",
    bytes: 3574956,
    use: "Retained; mechanical rather than optical",
  },
  {
    url: "/models/Meshy_AI_Celestial_Ascension_0812024244_texture-optimized_t1hprl.glb",
    bytes: 2370520,
    use: "Retained; future avatar hook",
  },
  {
    url: "/models/Meshy_AI_Cosmic_Arbor_0811152136_texture-optimized_au3seg.glb",
    bytes: 4628264,
    use: "Retained; future avatar hook",
  },
  {
    url: "/models/Meshy_AI_Cosmic_Arcade_Console_0717200039_texture-optimized_aexkjw.glb",
    bytes: 810796,
    use: "Restored for Music & Sound with original keyboard textures",
  },
  {
    url: "/models/Meshy_AI_Cosmic_Ascendant_0812022756_texture-optimized_ppeonk.glb",
    bytes: 3292972,
    use: "Retained; future avatar hook",
  },
  {
    url: "/models/Meshy_AI_Cronuts_A_New_Dream_0717200127_texture-optimized_rjpxfn.glb",
    bytes: 1306552,
    use: "Restored for Art & Media with original screen artwork",
  },
  {
    url: "/models/Meshy_AI_Liquid_Diamond_0804231912_texture-optimized_qeygwd.glb",
    bytes: 681696,
    use: "Reused for Art & Media; decimated and given optical material",
  },
  {
    url: "/models/Meshy_AI_Prismatic_Diamond_0804231813_texture-optimized_rem9i7.glb",
    bytes: 867740,
    use: "Reused for Ventures & Inventions; decimated and given optical material",
  },
  {
    url: "/models/orb-plant-bio-mv_fvbz1y.glb",
    bytes: 2745956,
    use: "Restored for Education & Community",
  },
  {
    url: "/models/StarrTree1-optimized_jzc43w.glb",
    bytes: 1082168,
    use: "Original StarrTree symbol preserved unchanged",
  },
  {
    url: "/models/TechRaEye_orb-optimized_navvdf.glb",
    bytes: 2728416,
    use: "Restored for third-eye Ventures & Inventions",
  },
] as const;
/** No Cloudinary delivery URL was found in the source or available full history. */
export const cloudinaryPublicUrls: readonly string[] = [];

