// Cloudflare Workers entry: /api/lead goes to the lead handler, everything else is static assets from dist/.
// (On Cloudflare Pages the same handler runs from functions/api/lead.js without this file.)
import { onRequestPost } from '../functions/api/lead.js';
import { site } from './config.mjs';

const canonical = new URL(site.url);

// 301 to the custom domain from www.<domain> and from the worker's own *.workers.dev address.
// Preview builds (<version>-<name>.<account>.workers.dev) stay reachable.
function redirectTarget(url) {
  if (url.hostname === canonical.hostname || canonical.hostname.endsWith('.workers.dev')) return null;
  const fromWww = url.hostname === 'www.' + canonical.hostname;
  const fromWorkersDev = url.hostname.endsWith('.workers.dev') && !/^[0-9a-f]{8}-/.test(url.hostname);
  if (!fromWww && !fromWorkersDev) return null;
  return canonical.origin + url.pathname + url.search;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'GET' || request.method === 'HEAD') {
      const target = redirectTarget(url);
      if (target) return Response.redirect(target, 301);
    }
    if (url.pathname === '/api/lead') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return onRequestPost({ request, env, ctx });
    }
    return env.ASSETS.fetch(request);
  },
};
