import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const source = process.argv[2] || 'C:/Users/maxth/Downloads';
const ffmpeg = process.env.FFMPEG_PATH || 'C:/ffmpeg/bin/ffmpeg.exe';
const out = path.resolve('public/cinema');
mkdirSync(out, { recursive: true });
const run = (input, name, args) => execFileSync(ffmpeg, ['-hide_banner','-loglevel','error','-y','-i',path.join(source,input),...args,path.join(out,name)], { stdio:'inherit' });
const images = {
 'ChatGPT Image Sep 19, 2026, 04_40_02 AM.png':'starrverse-logo.webp',
 'Cosmic Ascension with Seven Energy Worlds.png':'home-desktop.webp',
 'StarrX Cosmic Chakra Ascension Silhouette.png':'home-mobile.webp',
 'StarrX New Hero.png':'studio-hero.webp',
 'StarrX-CloseCard.png':'starrx-card.webp',
 'Glowing Star Mascot in Orbit.png':'starrvis.webp',
 'StarrX Flies Over City.png':'flight-mobile.webp',
};
for (const [input, output] of Object.entries(images)) run(input,output,['-frames:v','1','-c:v','libwebp','-quality','88']);
for (const [input, output, extra] of [
 ['StarrX flying away.mp4','flight-away.mp4',['-t','6']],
 ['StarrX flying towards.mp4','flight-towards.mp4',['-t','6']],
 ['StarrX_Rises_Hero.mp4','studio-rise.mp4',['-g','12','-keyint_min','12']],
 ['StarrX-Hover.webm','home-hover.mp4',[]],
]) run(input,output,['-an','-vf','scale=1280:-2','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',...extra]);
run('StarrX-Hover.webm','home-poster.webp',['-ss','1','-frames:v','1','-quality','88']);
run('StarrX_Rises_Hero.mp4','studio-end.webp',['-ss','9.9','-frames:v','1','-quality','88']);
run('StarrX flying away.mp4','flight-poster.webp',['-ss','0.1','-frames:v','1','-quality','88']);
for (const [a,b] of [['scifi-impact-boom.mp3','seed-impact.mp3'],['trailer-impact-boom.mp3','arrival-impact.mp3'],['0nly_1.m4a','only-1.m4a']]) copyFileSync(path.join(source,a),path.join(out,b));
copyFileSync(path.resolve('../../outputs/starrtree-media-pack/originals/05-max-starrseed-symbol.jpg'),path.join(out,'starrseed.jpg'));
writeFileSync(path.join(out,'PROVENANCE.txt'),'User-supplied StarrTree media, October 5 2026. Derivatives prepared by scripts/prepare-cinematic-media.mjs. Original files remain in the user Downloads folder. All website video exports have their audio tracks removed. The song is unreleased user-provided material. Reference UI images are not used as interface screenshots.\n');
