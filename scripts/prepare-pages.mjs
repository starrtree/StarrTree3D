import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
// Vite rebases imports; these are the readable manifest's public media paths.
// Scope rewriting to locally built text assets, never external URLs or sources.
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (/\.(js|css|html)$/.test(file)) {
      const source = readFileSync(file, 'utf8');
      writeFileSync(file, source.replace(/(["'`(])\/(cinema|images|audio|fruit|models|fonts)\//g, '$1/StarrTree3D/$2/'));
    }
  }
}
visit('dist');
writeFileSync('dist/.nojekyll', '');
