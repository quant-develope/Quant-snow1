import { site, services } from './config.mjs';

// Cache-busting suffix for CSS/JS (they are served with a long cache lifetime).
const v = Date.now().toString(36);

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const icons = {
  phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
  drop: '<path d="M12 2s-7 7.6-7 12.5A7 7 0 0 0 12 21.5a7 7 0 0 0 7-7C19 9.6 12 2 12 2z"/>',
  house: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z"/>',
  check: '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>',
  menu: '<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>',
  warn: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
  snow: '<path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>',
  shield: '<path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
  clock: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>',
  camera: '<path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>',
  whatsapp: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.88 9.88 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41z"/>',
  truck: '<path d="M20 8h-3V4H3a2 2 0 0 0-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-3-4zM6 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm13.5-9 1.96 2.5H17V9.5h2.5zM18 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>',
  shovel: '<path d="M20.7 3.3a1 1 0 0 0-1.4 0l-1.6 1.6-.7-.7-1.4 1.4.7.7-5.6 5.6-1.4-1.4L3 16.8a3 3 0 0 0 0 4.2 3 3 0 0 0 4.2 0l6.3-6.3-1.4-1.4 5.6-5.6.7.7 1.4-1.4-.7-.7 1.6-1.6a1 1 0 0 0 0-1.4z"/>',
  road: '<path d="M2 20 7.5 4h2L9 8h2V4h2v4h2l-.5-4h2L22 20h-8v-4h-4v4H2zm8.2-6h3.6l-.4-4h-2.8l-.4 4z"/>',
  building: '<path d="M3 21V3h12v4h6v14h-8v-4h-2v4H3zm2-2h4v-4h6v4h4V9h-6V5H5v14zm2-12h2v2H7V7zm4 0h2v2h-2V7zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2zm6 0h2v2h-2v-2zm0 4h2v2h-2v-2z"/>',
  close: '<path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>',
};

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]}</svg>`;

// Call button: orange label with the phone icon in a darker square on the left.
export const callBtn = (label = 'Call Now', cls = '') =>
  `<a class="btn btn-call ${cls}" href="tel:${site.phone.tel}" data-track="phone_click"><span class="btn-ico">${icon('phone')}</span><span class="btn-txt"><small>${esc(label)}</small>${site.phone.display}</span></a>`;

const gtmHead = () =>
  site.gtmId
    ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script>`
    : '<script>window.dataLayer=window.dataLayer||[];</script>';

const gtmBody = () =>
  site.gtmId
    ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
    : '';

const logo = () => `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="4" fill="#1f4e79"/><path d="M6 20 20 8l14 12h-4v12H10V20z" fill="#fff"/><path d="M6 20 20 8l14 12" fill="none" stroke="#e8590c" stroke-width="3" stroke-linejoin="round"/><g stroke="#1f4e79" stroke-width="1.6" stroke-linecap="round"><path d="M20 17v12M14.8 20l10.4 6M14.8 26l10.4-6"/></g></svg>`;

const nav = [
  ['/#services', 'Services'],
  ['/#about', 'About'],
  ['/#areas', 'Service Areas'],
  ['/#faq', 'FAQ'],
  ['/#estimate', 'Free Estimate'],
];

const header = () => `
<div class="topbar">
  <div class="container topbar-inner">
    <span>${icon('pin')} Serving ${esc(site.area)}</span>
    <span class="topbar-hours">${icon('clock')} ${esc(site.hours)}</span>
    <a href="tel:${site.phone.tel}" data-track="phone_click">${icon('phone')} ${site.phone.display}</a>
  </div>
</div>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/" aria-label="${esc(site.brand)} home">${logo()}<span class="logo-text"><strong>${esc(site.brand)}</strong><small>Driveways · Walkways · Roofs · Ice</small></span></a>
    <nav class="main-nav" aria-label="Main menu">
      ${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
    </nav>
    ${callBtn('Call Today', 'header-call')}
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${icon('menu')}</button>
  </div>
  <nav id="mobile-menu" class="mobile-menu" hidden aria-label="Mobile menu">
    <div class="container">
      ${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
      ${services.map((s) => `<a class="sub" href="/#${s.id}">${esc(s.title)}</a>`).join('')}
    </div>
  </nav>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <p class="footer-brand">${esc(site.brand)}</p>
      <p>A local crew for snow and ice jobs around the house: driveways, walks, steps, flat roofs, decks and icicles, done when you call us.</p>
    </div>
    <div>
      <p class="footer-heading">Services</p>
      <ul>${services.slice(0, 6).map((s) => `<li><a href="/#${s.id}">${esc(s.title)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="footer-heading">Contact</p>
      <ul>
        <li><a href="tel:${site.phone.tel}" data-track="phone_click">${icon('phone')} ${site.phone.display}</a></li>
        <li><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} WhatsApp message</a></li>
        <li>${icon('clock')} ${esc(site.hours)}</li>
        <li>${icon('pin')} ${esc(site.area)}</li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; ${new Date().getFullYear()} ${esc(site.brand)}. All rights reserved.</span>
    <a href="/privacy/">Privacy Policy</a>
  </div>
</footer>
<div class="mobile-bar" role="region" aria-label="Contact us">
  <a class="mobile-bar-call" href="tel:${site.phone.tel}" data-track="phone_click">${icon('phone')} Call Now</a>
  <a class="mobile-bar-quote" href="/#estimate" data-track="quote_click">Free Estimate</a>
</div>
<a class="fab-whatsapp" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')}<span class="sr-only">Message us on WhatsApp</span></a>`;

const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: site.brand,
  description: 'Residential snow removal and winter handyman services in Toronto and the GTA',
  url: site.url,
  telephone: site.phone.tel,
  areaServed: { '@type': 'City', name: 'Toronto' },
  openingHours: 'Mo-Su 00:00-23:59',
});

export function page({ path, title, description, body, schema = [], noindex = false }) {
  const canonical = site.url + path;
  const ld = [orgSchema(), ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('');
  return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/img/hero.jpg">
<meta name="theme-color" content="#1f4e79">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto+Condensed:wght@700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${v}">
${gtmHead()}
${ld}
</head>
<body>
${gtmBody()}
<a class="skip-link" href="#main">Skip to content</a>
${header()}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js?v=${v}" defer></script>
</body>
</html>
`;
}
