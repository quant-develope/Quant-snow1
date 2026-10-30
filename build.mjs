// Builds the static site into dist/: copies public/ and renders src/pages.mjs.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { site } from './src/config.mjs';
import { pages, sitemapPaths } from './src/pages.mjs';

const out = 'dist';
await rm(out, { recursive: true, force: true });
await cp('public', out, { recursive: true });

for (const [file, html] of pages()) {
  const path = join(out, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
}

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths()
    .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nDisallow: /thank-you/\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages().length} pages into ${out}/`);
