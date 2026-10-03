/** Readable site content. Commerce rules and payment links remain in commerce-catalog.json. */
export type WorldId = 'web' | 'art' | 'ai' | 'education' | 'music' | 'ventures' | 'wisdom';
export type ItemKind = 'Service' | 'Product' | 'Release' | 'Portfolio' | 'Venture' | 'Concept';
export type World = {
  id: WorldId; title: string; number: string; color: string; chakra: string;
  frequency: number; short: string; description: string; image: string;
};
export type Item = {
  id: string; worldId: WorldId; title: string; kind: ItemKind; status: string;
  description: string; image?: string; href?: string; cta?: string; serviceId?: string;
  feature?: 'mypov' | 'ep' | 'catalog' | 'vault' | 'gallery';
};

// Order here controls the seven-world overview. Frequencies are symbolic art direction.
export const worlds: World[] = [
  { id: 'web', number: '01', title: 'Web & Business', color: '#ff625f', chakra: 'Root', frequency: 396,
    short: 'Practical roots. A presence that grows.',
    description: 'Websites that feel like worlds, not templates. Strategic websites, storefronts and everyday business systems built around your story, services and audience.', image: '/images/world-tree.webp' },
  { id: 'art', number: '02', title: 'Art & Media', color: '#ff9b5b', chakra: 'Sacral', frequency: 417,
    short: 'Ideas become images. Images become worlds.',
    description: 'A living image and video library spanning generative art, editing, cinematic experiments, character design and creative direction.', image: '/images/constellation-maker.webp' },
  { id: 'ai', number: '03', title: 'AI & Engineering', color: '#f4cd63', chakra: 'Solar plexus', frequency: 528,
    short: 'Intelligent tools that turn ideas into momentum.',
    description: 'Creative technology, project systems and automations designed around the way real people think, build and get work done. Explore the engineering experiences behind the work.', image: '/images/atlas-orb.webp' },
  { id: 'education', number: '04', title: 'Education & Community', color: '#78ddb0', chakra: 'Heart', frequency: 639,
    short: 'The strongest branches grow together.',
    description: 'Future-ready learning through creative play. Creative AI education that helps young people transform their ideas into films, images, stories and real technology projects.', image: '/images/touch-the-orb.webp' },
  { id: 'music', number: '05', title: 'Music & Sound', color: '#66baff', chakra: 'Throat', frequency: 741,
    short: 'Find your sound. Follow the signal.',
    description: 'The Max Starr catalog, music videos, works in progress and practical services for vocal artists building their sound and confidence. Start with Sharks & Starrs and MyPOV.', image: '/images/polarity.webp' },
  { id: 'ventures', number: '06', title: 'Ventures & Inventions', color: '#9890ff', chakra: 'Third eye', frequency: 852,
    short: 'A place for what comes next.',
    description: 'Project systems, creative ventures and ideas taking shape. Each destination distinguishes documented work, work in progress and concepts that still need definition.', image: '/images/world-orb.webp' },
  { id: 'wisdom', number: '07', title: 'Wisdom & Exploration', color: '#ce9cff', chakra: 'Crown', frequency: 963,
    short: 'Rooted in life. Reaching toward possibility.',
    description: 'Reflections on creativity, technology, nature, discipline and the inner principles that shape the work across every StarrTree branch.', image: '/images/tree-eye.webp' },
];

/** A serviceId delegates price, capacity, payment and booking to the preserved commerce UI. */
export const items: Item[] = [
  { id: 'starter-website', worldId: 'web', title: 'Starter One-Page Website', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1NQKFYO8npob', description: 'A focused one-page business website. $750 launch price: $375 deposit and $375 before launch. Maximum three active website builds.' },
  { id: 'business-website', worldId: 'web', title: 'Multi-Page Business Website', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1OdYp4vIasak', description: 'A multi-page home for your business, starting at $1,500. $750 deposit plus final balance, with a custom scope before the full build.' },
  { id: 'shopify', worldId: 'web', title: 'Shopify / E-commerce Storefront', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1OOBkSgTknq0', description: 'A storefront from $1,500, with a $750 deposit. Product count, apps, assets and integrations determine the final quote.' },
  { id: 'website-care', worldId: 'web', title: 'Website Care Plan', kind: 'Service', status: 'Test subscription', serviceId: 'prod_VJ1OvIgnlsz6FR', description: '$99 per month for existing StarrTree-built sites or approved sites. Monthly subscription.' },
  { id: 'google-business', worldId: 'web', title: 'Google Business Profile Cleanup', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1OztN65i55mv', description: 'A clearly scoped profile cleanup for $150, paid in full. No ranking guarantees.' },
  { id: 'local-visibility', worldId: 'web', title: 'Local Visibility Setup', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1PaSZ4fDrpke', description: 'Directory, profile and local presence setup for $300, paid in full. No ranking guarantees.' },
  { id: 'payment-booking', worldId: 'web', title: 'Payment + Booking Setup', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1PflO45sDTGU', description: 'Stripe and booking setup for $450, paid in full. Third-party fees are separate.' },
  { id: 'poster-design', worldId: 'art', title: 'Poster / Flyer Design', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1Ph6qBjJes0a', description: 'A poster or flyer for $125, paid upfront, with two revision rounds. Print jobs under $250 are paid upfront.' },
  { id: 'photo-shoot', worldId: 'art', title: 'Business / Artist Photo Shoot', kind: 'Service', status: 'Paid booking · test', serviceId: 'prod_VJ1PU4tWPFnjiw', description: 'A $250 paid photo shoot. One shoot per bookable day, with delivery scope stated at checkout. Payment and Calendar booking remain separate steps.' },
  { id: 'ai-receptionist', worldId: 'ai', title: 'AI Receptionist Starter', kind: 'Service', status: 'Setup + subscription · test', serviceId: 'prod_VJ1PqpP9AwI9hI', description: '$950 setup plus a separate $199 per month recurring subscription. One active receptionist implementation at a time until the delivery system is mature.' },
  { id: 'custom-gpt', worldId: 'ai', title: 'Custom GPT / AI Assistant Starter', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1PfCK3nMWXTE', description: 'An AI assistant from $500, with a $250 deposit and remainder after scope. Higher-complexity integrations are quoted separately.' },
  { id: 'automation', worldId: 'ai', title: 'Automation Workflow Build', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1PA2sVSXUswo', description: 'Custom n8n, API and database work from $1,500. $750 deposit; discovery determines the final quote. Maximum one high-complexity automation implementation at a time.' },
  { id: 'studio-session', worldId: 'music', title: 'Studio Recording Session', kind: 'Service', status: 'Paid booking · test', serviceId: 'prod_VJ1PfymguBhIn2', description: 'A two-hour studio block for $120. Maximum one studio booking per evening. Pay first, then manually choose an available Calendar slot.' },
  { id: 'mix-master', worldId: 'music', title: 'Mix + Master — Single Song', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1PfSiyyPiLgF', description: 'A standard single-song mix and master for $75, paid upfront. Stems and source files are required.' },
  { id: 'bandlab-preset', worldId: 'music', title: 'BandLab Vocal Preset', kind: 'Product', status: 'Digital product · test', serviceId: 'prod_VJ1Q0LFoFxb9hC', description: 'A $30 digital vocal preset. Preset or download delivery follows payment; this is the catalogued BandLab product, separate from future preset collections.' },
  { id: 'theme-song', worldId: 'music', title: 'Custom Theme Song', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1QPr9b7beXTg', description: 'A custom theme from $99, with a $50 deposit. Rights and beat licensing are confirmed before production; the beat license depends on the package.' },
  { id: 'promo-edit', worldId: 'art', title: 'Short-Form Promo Edit', kind: 'Service', status: 'Test checkout', serviceId: 'prod_VJ1QZHUlEK0bwX', description: 'One short-form promo edit from supplied footage and assets for $150, paid upfront.' },
  { id: 'tech-consultation', worldId: 'education', title: 'AI / Creative Tech Consultation', kind: 'Service', status: 'Paid booking · test', serviceId: 'prod_VJ1QybXL9BGtlB', description: 'A one-hour consultation for $150. Maximum two consultations per day. Payment and the available Google Calendar appointment are separate steps.' },
  { id: 'ai-workshop', worldId: 'education', title: 'AI Workshop / Training', kind: 'Service', status: 'Discovery first', serviceId: 'prod_VJ1QYUlEhTzh36', description: 'Training from $500 for a custom audience, duration and curriculum. Deposit follows discovery; there is no direct payment link in the source catalog.' },

  { id: 'sharks-starrs', worldId: 'music', title: 'Sharks & Starrs', kind: 'Release', status: 'EP · September 18, 2026', description: 'Seven tracks by Max Starr. MyPOV + six more. Explore the EP and choose your streaming service.', image: '/images/releases/sharks-starrs.jpg', href: 'https://distrokid.com/hyperfollow/maxstarr/sharks--starrs-4', cta: 'Stream the EP', feature: 'ep' },
  { id: 'mypov', worldId: 'music', title: 'MyPOV', kind: 'Release', status: 'Music video', description: 'Max Starr featuring Drezay. The featured music video from Sharks & Starrs.', image: '/images/releases/mypov.jpg', href: 'https://youtu.be/iip5VXEFEL4', cta: 'Watch on YouTube', feature: 'mypov' },
  { id: 'release-catalog', worldId: 'music', title: 'The Max Starr Catalog', kind: 'Release', status: 'Release library', description: 'Explore the existing release catalog: hip-hop, R&B, dancehall and Afrobeats. Selected tracks include opt-in audio previews.', image: '/images/releases/cronuts.jpg', feature: 'catalog' },
  { id: 'audio-vault', worldId: 'music', title: 'Audio Vault', kind: 'Portfolio', status: 'Works in progress', description: 'Selected songs, snippets and unreleased experiments. Playback begins only when you choose a track.', feature: 'vault' },
  { id: 'max-starr-youtube', worldId: 'music', title: 'Max Starr on YouTube', kind: 'Portfolio', status: 'Artist channel', description: 'Videos, releases and the artist world.', href: 'https://www.youtube.com/channel/UCfMf248pQjZKrdbbYUoVLIA', cta: 'Open YouTube' },
  { id: 'soundcloud', worldId: 'music', title: 'SoundCloud Archive', kind: 'Portfolio', status: 'Archive', description: 'Independent releases and experiments from Max Starr.', href: 'https://soundcloud.com/max-starr-31684511', cta: 'Open SoundCloud' },
  { id: 'bandlab-transmission', worldId: 'music', title: 'BandLab Transmission', kind: 'Release', status: 'Shared track', description: 'The BandLab track linked from the existing StarrTree site.', href: 'https://www.bandlab.com/track/0daaa3d3-ff80-f011-b480-000d3aa44c65?revId=09aaa3d3-ff80-f011-b480-000d3aa44c65', cta: 'Open BandLab' },
  { id: 'quarantine-song', worldId: 'music', title: 'A 2020 Quarantine Spark', kind: 'Release', status: '2020 release', description: 'The kid-friendly COVID-19 quarantine release featured on the existing site: an early branch of the Max Starr catalog.', image: 'https://img.youtube.com/vi/yekTtcCcrkU/hqdefault.jpg', href: 'https://www.youtube.com/watch?v=yekTtcCcrkU', cta: 'Watch the video' },
  { id: 'artist-features', worldId: 'music', title: 'Artist Features', kind: 'Service', status: 'Enquire', description: 'A verse, hook or creative collaboration across hip-hop, R&B, dancehall and Afrobeats. Discuss scope and availability; the source does not provide a fixed checkout link.' },
  { id: 'future-presets', worldId: 'music', title: 'Vocal Preset Collections', kind: 'Concept', status: 'Coming soon', description: 'Additional ready-to-record vocal chains and setup guidance. The source lists this broader collection as store soon; only the separate BandLab Vocal Preset has a catalogued test checkout.' },

  { id: 'edited-art', worldId: 'art', title: 'Edited Art Library', kind: 'Portfolio', status: 'Gallery', description: 'Curated visual edits and image experiments from the existing StarrTree art library.', image: '/images/cosmic-profile.webp', feature: 'gallery' },
  { id: 'instagram-art', worldId: 'art', title: 'Instagram Visual Feed', kind: 'Portfolio', status: 'Social archive', description: 'Art, music, process and life in motion.', href: 'https://www.instagram.com/maxstarrofficial/', cta: 'Open Instagram' },
  { id: 'tiktok', worldId: 'art', title: 'TikTok Experiments', kind: 'Portfolio', status: 'Social archive', description: 'Short-form worlds, ideas and behind-the-scenes.', href: 'https://www.tiktok.com/@imaxstarrofficial', cta: 'Open TikTok' },
  { id: 'film-video', worldId: 'art', title: 'Film + Music Video', kind: 'Portfolio', status: 'Creative practice', description: 'Cinematic concepts, edits and treatments. This destination describes the existing practice; individual case studies are not supplied in the source.' },
  { id: 'starrx-universe', worldId: 'art', title: 'StarrX Universe', kind: 'Concept', status: 'Developing', description: 'Characters, mythology and visual storytelling, listed as developing on the existing site.', image: '/images/starborn.webp' },
  { id: 'creative-direction', worldId: 'art', title: 'Creative Direction', kind: 'Service', status: 'Enquire', description: 'Visual worlds, content systems, music-video concepts and generative campaigns with a clear point of view. Scope and availability are confirmed by enquiry.' },
  { id: 'interactive-3d', worldId: 'web', title: 'Interactive 3D Experiences', kind: 'Service', status: 'Enquire', description: 'Immersive WebGL and motion-led website experiences. Discuss a custom scope before commissioning.' },
  { id: 'brand-systems', worldId: 'web', title: 'Brand Systems', kind: 'Service', status: 'Enquire', description: 'Identity, messaging and a cohesive digital language, offered through a custom project conversation.' },
  { id: 'ai-web', worldId: 'ai', title: 'AI Web Experiences', kind: 'Service', status: 'Custom scope', description: 'Smart tools and generative interactions for the web, scoped around the project.' },
  { id: 'mit-biomechatronics', worldId: 'ai', title: 'MIT Biomechatronics', kind: 'Portfolio', status: 'Research experience', description: 'Max’s source-site account describes work with the MIT Media Lab Biomechatronics team around magnetomicrometry and advanced prostheses, where magnetism, human movement and invention met. This is past research experience, not a current commercial partnership.' },
  { id: 'pgs-fellowship', worldId: 'ai', title: 'Patti Grace Smith Fellowship', kind: 'Portfolio', status: '2022 fellow profile', description: 'Aerospace fellowship, mentorship and a bigger belief in the impossible. The existing site links Max’s official fellow profile.', href: 'https://www.pgsfellowship.org/maxwell-ty-starr', cta: 'Read the official profile' },

  { id: 'swac', worldId: 'education', title: 'Shoot With A Camera', kind: 'Portfolio', status: 'Documented program', description: 'AI, filmmaking and youth storytelling. The existing site describes this program; current enrollment and dates must be confirmed.' },
  { id: 'swac-films', worldId: 'education', title: 'SWAC Student Films', kind: 'Portfolio', status: 'Showcase · links pending', description: 'Videos created by youth program participants. The source names this showcase but does not supply individual film links.' },
  { id: 'creative-ai-club', worldId: 'education', title: 'Creative AI Club', kind: 'Portfolio', status: 'Documented teaching', description: 'The Bethany School creative technology lab named in the existing site. Current teaching dates are not independently verified.' },
  { id: 'bethany-videos', worldId: 'education', title: 'Bethany Student Videos', kind: 'Portfolio', status: 'Showcase · links pending', description: 'Films made by Creative AI Club students. The source names this collection but does not supply individual film links.' },
  { id: 'youth-workshops', worldId: 'education', title: 'Youth Workshops', kind: 'Service', status: 'Enquire', description: 'Hands-on creative AI sessions for ages 10–18. Discuss an audience, scope and available dates before booking.' },
  { id: 'bebrownbrave', worldId: 'education', title: 'BeBrownBrave', kind: 'Portfolio', status: 'Source-documented collaboration', description: 'Community-centered creative collaboration listed on the existing StarrTree site. The source provides no public project link or current partnership terms.' },

  { id: 'ozi', worldId: 'ventures', title: 'OZI', kind: 'Venture', status: 'Building', description: 'A generative edutainment engine, listed as building in the source site.' },
  { id: 'starrlign', worldId: 'ventures', title: 'StarrLign', kind: 'Venture', status: 'Source-listed · launch unverified', description: 'An AI-native project command system. The previous site labels it LIVE but supplies no product URL; a current public launch has not been verified.' },
  { id: 'starrboard', worldId: 'ventures', title: 'StarrBoard', kind: 'Venture', status: 'Source-listed · launch unverified', description: 'A spatial planning and focus interface. The previous site labels it LIVE but supplies no product URL; a current public launch has not been verified.' },
  { id: 'timeless', worldId: 'ventures', title: 'TIMELESS No Limit', kind: 'Venture', status: 'Documented collective', description: 'A content creation collective producing entertainment and education around physical, spiritual and social health. The source describes a mission of limitlessness, surpassing boundaries and turning hard parts of life into something useful.', href: 'https://timelessnolimit.com', cta: 'Visit TIMELESS' },
  { id: 'timeless-social', worldId: 'ventures', title: 'TIMELESS Social', kind: 'Portfolio', status: 'Collective social page', description: 'Content and collaborations from the collective’s Instagram page linked by the existing site.', href: 'https://www.instagram.com/timeless_nolimit/', cta: 'Open Instagram' },
  { id: 'starrvis', worldId: 'ventures', title: 'StarrVis', kind: 'Concept', status: 'Documentation pending', description: 'A venture named in the redesign brief. Product scope and launch status are not documented in the inspected source. The animated StarrVis head is a future hook.' },
  { id: 'starrdome', worldId: 'ventures', title: 'StarrDome', kind: 'Concept', status: 'Documentation pending', description: 'A venture named in the redesign brief. Details and launch status still need source documentation.' },
  { id: 'innergym', worldId: 'ventures', title: 'InnerGym / InnerStarrt', kind: 'Concept', status: 'Documentation pending', description: 'A venture named in the redesign brief. Scope and launch status still need source documentation.' },
  { id: 'freemix', worldId: 'ventures', title: 'FREEmix Fridays', kind: 'Concept', status: 'Proposed collaboration', description: 'A proposed collaboration named in the redesign brief. No confirmed partnership or launch is claimed.' },

  { id: 'wisdom-pieces', worldId: 'wisdom', title: 'Wisdom Pieces', kind: 'Concept', status: 'Collection planned', description: 'Short essays and lived observations. The existing site names this collection but does not include published essays; this is a place for that future work.' },
  { id: 'creative-philosophy', worldId: 'wisdom', title: 'Creative Philosophy', kind: 'Concept', status: 'Collection planned', description: 'Principles for imagination and execution. A named source-site theme, awaiting complete published pieces.' },
  { id: 'ancient-emerging', worldId: 'wisdom', title: 'Ancient + Emerging', kind: 'Concept', status: 'Collection planned', description: 'Where ancestral knowledge meets new technology. A source-site reflection theme; no scientific or healing claims are implied.' },
  { id: 'path-notes', worldId: 'wisdom', title: 'Path Notes', kind: 'Concept', status: 'Journal planned', description: 'Mindset, discipline and lessons in motion. The source names this journal, with entries still to be added.' },
];
