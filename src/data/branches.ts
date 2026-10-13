import { items, type Item, type WorldId } from './content';
export type BranchGroup = { title: string; description: string; itemIds: string[]; parent?: string };
const explicit: Partial<Record<WorldId, BranchGroup[]>> = {
 music: [
  {title:'Listen to Music', parent:'Max Starr - Music',description:'The catalog, releases, videos and works in progress.',itemIds:['release-catalog','sharks-starrs','mypov','audio-vault','max-starr-youtube','soundcloud','bandlab-transmission','quarantine-song']},
  {title:'Create Music',description:'Find your vocal sound. Build a studio you can take anywhere.',itemIds:['bandlab-preset','studio-session','mix-master','theme-song']},
 ],
 art: [
  {title:'Create Media',description:'Creative direction for your brand, expressed through video, design and photography.',itemIds:['promo-edit','poster-design','photo-shoot']},
  {title:'Explore Media',description:'Watch, discover and step into the visual practice.',itemIds:['edited-art','instagram-art','tiktok','film-video','starrx-universe']},
 ],
};
const labels: Record<WorldId,[string,string]> = {web:['Build Your Presence','Explore the Work'],art:['Create Media','Explore Media'],ai:['Build with AI','Explore Engineering'],education:['Learn & Create','Community & Student Work'],music:['Create Music','Listen to Music'],ventures:['Ventures Taking Shape','Ideas & Collaborations'],wisdom:['Reflections','Explore Possibility']};
export function branchGroups(id:WorldId): BranchGroup[] {
 const own=items.filter(i=>i.worldId===id);
 const groups=explicit[id]?.map(g=>({...g,itemIds:g.itemIds.filter(key=>own.some(i=>i.id===key))})) ?? [
  {title:labels[id][0],description:'',itemIds:own.filter(i=>['Service','Product','Venture'].includes(i.kind)).map(i=>i.id)},
  {title:labels[id][1],description:'',itemIds:own.filter(i=>!['Service','Product','Venture'].includes(i.kind)).map(i=>i.id)},
 ];
 const known=new Set(groups.flatMap(g=>g.itemIds));
 groups[groups.length-1].itemIds.push(...own.filter(i=>!known.has(i.id)).map(i=>i.id));
 return groups.filter(g=>g.itemIds.length);
}
export const groupItems=(group:BranchGroup):Item[]=>group.itemIds.map(id=>items.find(i=>i.id===id)!).filter(Boolean);
