// Cloudflare Workers entry: /api/lead goes to the lead handler, everything else is static assets from dist/.
// (On Cloudflare Pages the same handler runs from functions/api/lead.js without this file.)
import { onRequestPost } from '../functions/api/lead.js';

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/lead') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return onRequestPost({ request, env, ctx });
    }
    return env.ASSETS.fetch(request);
  },
};
