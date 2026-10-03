/** Public asset assignments. No account session or private URL is needed. */
export type FruitWorldId =
  "web" | "art" | "ai" | "education" | "music" | "ventures" | "wisdom";
export type FruitAsset = {
  model: string;
  poster: string;
  name: string;
  source: "Blender" | "adapted inherited GLB";
  format: "glb";
  bytes: number;
};
export const fruitAssets: Record<FruitWorldId, FruitAsset> = {
  web: {
    model: "/fruit/web.glb",
    poster: "/fruit/web.png",
    name: "Root lattice",
    source: "Blender",
    format: "glb",
    bytes: 169772,
  },
  art: {
    model: "/fruit/art.glb",
    poster: "/fruit/art.png",
    name: "Liquid prism",
    source: "adapted inherited GLB",
    format: "glb",
    bytes: 248156,
  },
  ai: {
    model: "/fruit/ai.glb",
    poster: "/fruit/ai.png",
    name: "Solar gyroscope",
    source: "Blender",
    format: "glb",
    bytes: 169748,
  },
  education: {
    model: "/fruit/education.glb",
    poster: "/fruit/education.png",
    name: "Shared orbit",
    source: "Blender",
    format: "glb",
    bytes: 132372,
  },
  music: {
    model: "/fruit/music.glb",
    poster: "/fruit/music.png",
    name: "Resonance membrane",
    source: "Blender",
    format: "glb",
    bytes: 132368,
  },
  ventures: {
    model: "/fruit/ventures.glb",
    poster: "/fruit/ventures.png",
    name: "Prismatic seed",
    source: "adapted inherited GLB",
    format: "glb",
    bytes: 241588,
  },
  wisdom: {
    model: "/fruit/wisdom.glb",
    poster: "/fruit/wisdom.png",
    name: "Crown lenses",
    source: "Blender",
    format: "glb",
    bytes: 244744,
  },
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
    use: "Retained; literal arcade does not fit membrane family",
  },
  {
    url: "/models/Meshy_AI_Cosmic_Ascendant_0812022756_texture-optimized_ppeonk.glb",
    bytes: 3292972,
    use: "Retained; future avatar hook",
  },
  {
    url: "/models/Meshy_AI_Cronuts_A_New_Dream_0717200127_texture-optimized_rjpxfn.glb",
    bytes: 1306552,
    use: "Retained; literal television does not fit membrane family",
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
    use: "Retained; literal foliage does not fit brief",
  },
  {
    url: "/models/StarrTree1-optimized_jzc43w.glb",
    bytes: 1082168,
    use: "Original StarrTree symbol preserved unchanged",
  },
  {
    url: "/models/TechRaEye_orb-optimized_navvdf.glb",
    bytes: 2728416,
    use: "Retained; eye icon does not fit membrane family",
  },
] as const;
/** No Cloudinary delivery URL was found in the source or available full history. */
export const cloudinaryPublicUrls: readonly string[] = [];
