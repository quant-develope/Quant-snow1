// Cloudflare Pages Function: POST /api/lead
// Delivers a quote request to every channel that is configured with
// environment variables (set them in Pages → Settings → Variables and Secrets):
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID   → message to a Telegram chat
//   RESEND_API_KEY + LEAD_EMAIL_TO (+ LEAD_EMAIL_FROM) → email via resend.com
//   LEAD_WEBHOOK_URL                        → JSON POST (Zapier, Make, Google Sheets script…)
//   CRM (service binding in wrangler.jsonc) → new lead in Toronto CRM («Звонки» → заявки с сайтов)
// At least one channel must be configured, otherwise the request fails so no lead is lost silently.

import { site } from '../../src/config.mjs';

const FIELDS = ['name', 'phone', 'email', 'address', 'city', 'property', 'service', 'message', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid', 'page'];

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const reply = (ok, status, error, detail) =>
    wantsJson
      ? Response.json(ok ? { ok } : { ok, error, detail }, { status })
      : ok
        ? Response.redirect(new URL('/thank-you/', request.url), 303)
        : new Response(`Sorry, your request could not be sent (${error}). Please call us.`, { status });

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 400, 'invalid form');
  }

  // Honeypot: bots fill the hidden field. Pretend success.
  if (form.get('company_website')) return reply(true, 200);

  const lead = {};
  for (const f of FIELDS) lead[f] = String(form.get(f) || '').trim().slice(0, f === 'message' ? 1500 : 200);

  if (!lead.name || lead.phone.replace(/\D/g, '').length < 10 || !lead.service) {
    return reply(false, 422, 'missing name, phone or service');
  }

  // Domain the lead came from, shown in every notification.
  lead.site = new URL(request.url).host;
  lead.received = new Date().toISOString();
  lead.ip_country = request.cf?.country || '';

  const jobs = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) jobs.push(sendTelegram(env, lead));
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO) jobs.push(sendEmail(env, lead));
  if (env.LEAD_WEBHOOK_URL) jobs.push(sendWebhook(env, lead));
  if (env.CRM) jobs.push(sendCrm(env, lead, request));
  if (!jobs.length) {
    console.error('lead delivery failed: no delivery channel configured');
    return reply(false, 500, 'no delivery channel configured');
  }

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((r) => r.status === 'rejected').map((r) => String(r.reason?.message || r.reason));
  failures.forEach((f) => console.error('lead delivery failed:', f));
  // One working channel is enough.
  return results.some((r) => r.status === 'fulfilled') ? reply(true, 200) : reply(false, 502, 'delivery failed', failures.join(' | ').slice(0, 300));
}

function summary(lead) {
  const source = [lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_term].filter(Boolean).join(' / ');
  return [
    `Site: ${lead.site}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.address && `Address: ${lead.address}`,
    `City: ${lead.city || '—'}`,
    lead.property && `Property: ${lead.property}`,
    `Service: ${lead.service}`,
    lead.message && `Details: ${lead.message}`,
    source && `Source: ${source}`,
    lead.gclid && 'Google Ads click: yes',
    `Page: ${lead.page || '/'}`,
  ].filter(Boolean).join('\n');
}

async function check(res, label) {
  if (!res.ok) throw new Error(`${label} ${res.status}: ${await res.text()}`);
}

async function sendTelegram(env, lead) {
  const res = await fetch(`https://api.telegram.org/bot${String(env.TELEGRAM_BOT_TOKEN).trim()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: String(env.TELEGRAM_CHAT_ID).trim(), text: `❄️ New snow removal lead\n\n${summary(lead)}` }),
  });
  await check(res, 'telegram');
}

async function sendEmail(env, lead) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_EMAIL_FROM || 'Website leads <onboarding@resend.dev>',
      to: env.LEAD_EMAIL_TO.split(',').map((s) => s.trim()),
      reply_to: lead.email || undefined,
      subject: `New snow removal lead (${lead.site}): ${lead.service} — ${lead.city || 'GTA'}`,
      text: summary(lead),
    }),
  });
  await check(res, 'resend');
}

async function sendWebhook(env, lead) {
  const res = await fetch(env.LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  await check(res, 'webhook');
}

// Toronto CRM: the lead appears in «Звонки» as «Заявка с сайта», with a button to create an order.
// Called through a Cloudflare service binding (Worker-to-Worker RPC), so no public endpoint or secret is needed.
async function sendCrm(env, lead, request) {
  await env.CRM.siteLead({ ...lead, site: new URL(request.url).host, site_phone: site.phone.tel });
}
