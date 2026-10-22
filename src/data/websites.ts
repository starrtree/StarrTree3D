/** Web showcase metadata. A repository is not proof of a completed client launch.
 * Hosted preview URLs sourced from GitHub repo homepage/CNAME or Pages conventions;
 * opening, embedding and client approval need browser verification before sales claims.
 */
export type WebsiteProject = {
  id: string;
  name: string;
  category: string;
  stage: "Concept" | "Prototype" | "Studio project";
  description: string;
  repoUrl: string;
  previewUrl: string;
  previewSource: "homepage" | "pages-candidate" | "cname-candidate";
  colors: [string, string];
};

export const websiteProjects: WebsiteProject[] = [
  {
    id: "crowns", name: "Crown's Pizza & Wings", category: "Restaurant", stage: "Concept",
    description: "Cinematic restaurant experience built around comfort favorites and West African cuisine, with ordering paths and a navigable menu.",
    repoUrl: "https://github.com/starrtree/CrownAfricanCuisine",
    previewUrl: "https://starrtree.github.io/CrownAfricanCuisine/", previewSource: "pages-candidate",
    colors: ["#f3b45d", "#38211a"],
  },
  {
    id: "jz", name: "JZ Inkz", category: "Artist / Beauty", stage: "Prototype",
    description: "A warm, editorial tattoo-artist portfolio with botanical ink illustrations, curated work and a booking handoff.",
    repoUrl: "https://github.com/starrtree/jz",
    previewUrl: "https://jz-lovat.vercel.app/", previewSource: "homepage",
    colors: ["#e9b2bb", "#593948"],
  },
  {
    id: "sure", name: "SURE Mechanical", category: "Contractor", stage: "Prototype",
    description: "A commercial contractor web presence emphasizing capabilities, credibility and project navigation.",
    repoUrl: "https://github.com/starrtree/SureMechanical-v1",
    previewUrl: "https://starrtree.github.io/SureMechanical-v1/", previewSource: "pages-candidate",
    colors: ["#aecde0", "#284b5c"],
  },
  {
    id: "cac", name: "Cincinnati Air Conditioning", category: "Contractor", stage: "Concept",
    description: "A more polished, conversion-focused homepage concept for an established commercial mechanical contractor.",
    repoUrl: "https://github.com/starrtree/CAC-updated-clone",
    previewUrl: "https://starrtree.github.io/CAC-updated-clone/", previewSource: "homepage",
    colors: ["#c5d8ec", "#204669"],
  },
  {
    id: "heritage", name: "Heritage Africa", category: "Retail / Culture", stage: "Prototype",
    description: "Heritage-centered brand storytelling and a bold online identity.",
    repoUrl: "https://github.com/starrtree/Heritage-Africa-LAUNCH",
    previewUrl: "https://heritageafricabrand.com/", previewSource: "cname-candidate",
    colors: ["#dfc28b", "#63401c"],
  },
  {
    id: "timeless", name: "TIMELESS No Limit", category: "Lifestyle", stage: "Studio project",
    description: "A visual identity and web experience for a culture-forward creative collective.",
    repoUrl: "https://github.com/starrtree/TIMELESS",
    previewUrl: "https://timeless-neon.vercel.app/", previewSource: "homepage",
    colors: ["#b995ed", "#33205d"],
  },
  {
    id: "dirtybreakfast", name: "Dirty Breakfast", category: "Creative", stage: "Prototype",
    description: "Scroll-directed cinematic motion and frame-by-frame visual storytelling.",
    repoUrl: "https://github.com/starrtree/DIRTYBREAKFAST",
    previewUrl: "https://starrtree.github.io/DIRTYBREAKFAST/", previewSource: "pages-candidate",
    colors: ["#ffba78", "#703522"],
  },
  {
    id: "factz", name: "Factz Over Feelingz", category: "Media", stage: "Prototype",
    description: "A bold editorial storefront with experimental interactions and unapologetic typography.",
    repoUrl: "https://github.com/starrtree/FactzOverFeelingz",
    previewUrl: "https://starrtree.github.io/FactzOverFeelingz/", previewSource: "pages-candidate",
    colors: ["#ef7d81", "#5b1827"],
  },
  {
    id: "alean", name: "ALEAN", category: "Interactive", stage: "Prototype",
    description: "Playable web interactions and audio-reactive digital craft.",
    repoUrl: "https://github.com/starrtree/ALEAN",
    previewUrl: "https://starrtree.github.io/ALEAN/", previewSource: "pages-candidate",
    colors: ["#92e9ca", "#235d59"],
  },
  {
    id: "starrtree-origin", name: "StarrTree Origin", category: "Agency", stage: "Studio project",
    description: "An earlier iteration of the StarrTree creative studio experience.",
    repoUrl: "https://github.com/starrtree/StarrTree",
    previewUrl: "https://starrtree.github.io/StarrTree/", previewSource: "pages-candidate",
    colors: ["#ead6a5", "#69512c"],
  },
];
