import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import seo from '../src/data/seo.json' with { type: 'json' };
import towns from '../src/data/towns.json' with { type: 'json' };
import posts from '../src/data/posts.json' with { type: 'json' };

import { allTownRoutes } from '../src/data/town-routes.mjs';
import { postRoutes } from '../src/data/post-routes.mjs';

/**
 * The title and description of every route, written down once.
 *
 * useSeo() needs this list in the browser: navigation after boot is
 * client-side and never fetches HTML again, so without it the tab keeps
 * whichever title was loaded first. It was composing the list itself, from
 * the entry chunk carried every blog post's body, every car's luggage
 * capacity and the prose for twelve town pages, on every page of the site,
 * to end up with a path, a title and a sentence. Seventy kilobytes of
 * object literal for eleven kilobytes of answer, evaluated before anything
 * on screen could respond to a tap.
 *
 * So the list is composed here instead, at build time, from exactly the same
 * four files and the same four helpers prerender-seo.mjs uses -- and both
 * read what this writes, so the routes the app titles and the routes the
 * build renders cannot drift apart.
 */

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(dirname(here), 'src/data/seo-routes.json');

const routes = [
  ...seo.routes,
  ...allTownRoutes(towns.towns, seo.site),
  ...postRoutes(posts.posts),
];

const seen = new Map();
for (const r of routes) {
  if (seen.has(r.path)) {
    console.error(`seo-routes: two routes claim ${r.path}; the later one wins, which is probably not what anybody meant`);
  }
  seen.set(r.path, r);
}

await writeFile(
  OUT,
  JSON.stringify({
    routes,
  }, null, 2) + '\n',
);

console.log(`seo-routes: ${routes.length} routes written`);
