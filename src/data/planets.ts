import type { WorldId } from './content';
/** Centers measured against the supplied Oct 22 artwork, in percent of the image.
 * Keep image and targets on the same contained artboard when changing the layout. */
export const planets: Record<WorldId, {src:string; desktop:number[]; mobile:number[]; film:number[]}> = {
  web: {src:'/planets/web.png', desktop:[34.8,41.7,9.3], mobile:[11.9,38.7,26], film:[31.5,39.8,9]},
  art: {src:'/planets/art.png', desktop:[63.8,41.8,9.5], mobile:[86.5,38.7,26], film:[68.2,39.8,9]},
  ai: {src:'/planets/ai.png', desktop:[35.4,27.9,9.5], mobile:[12.8,26.25,26], film:[33.5,25.6,9]},
  education: {src:'/planets/education.png', desktop:[63.3,27.8,9.5], mobile:[87.1,26.56,26], film:[66.2,25.6,9]},
  music: {src:'/planets/music.png', desktop:[40.6,14.6,9.6], mobile:[30.5,15.3,26], film:[40,13.3,9]},
  ventures: {src:'/planets/ventures.png', desktop:[58.7,14.8,9.6], mobile:[71,15.1,26], film:[60.4,13.3,9]},
  wisdom: {src:'/planets/wisdom.png', desktop:[49.7,7,9.6], mobile:[49.7,7.1,27], film:[50,7.4,9]},
};
