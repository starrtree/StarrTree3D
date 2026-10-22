// Single media timeline: the first video frame and 0nly_1 begin at timestamp zero.
// Existing muted film and full song are preserved for ambient playback/fallback.
import { spawnSync } from 'node:child_process';
const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', [
  '-y', '-i', 'public/cinema/starrtree-intro.mp4', '-i', 'public/cinema/only-1.m4a',
  '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
  '-af', 'asetpts=PTS-STARTPTS', '-shortest', '-movflags', '+faststart',
  'public/cinema/starrtree-intro-sound.mp4',
], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
