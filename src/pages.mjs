import { site, services, cities } from './config.mjs';
import { page, esc, icon, callBtn } from './layout.mjs';

const pic = (name, alt, { eager = false, cls = '' } = {}) =>
  `<picture><source type="image/webp" srcset="/assets/img/work/${name}.webp"><img class="${cls}" src="/assets/img/work/${name}.jpg" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;

const photoServices = services.filter((s) => s.img);
const iconServices = services.filter((s) => !s.img);

const serviceOptions = [
  'Driveway', 'Walkway, steps or porch', 'Flat roof', 'Deck, terrace or balcony', 'Icicles or ice dam',
  'Salting / ice melt', 'Car dig-out', 'Plow ridge at the curb', 'Business lot', 'Other',
];

const propertyOptions = ['Single driveway (1–2 cars)', 'Double driveway (3–4 cars)', 'Long or shared driveway', 'No driveway', 'Commercial property'];

const estimateForm = (heading = 'Request a Free Estimate') => `
<form class="lead-form" action="/api/lead" method="post" novalidate>
  <h2 class="form-title">${esc(heading)}</h2>
  <p class="form-note">Fill this out and we will call you back with a price.</p>
  <div class="form-grid">
    <label>Your name *<input name="name" autocomplete="name" required maxlength="80"></label>
    <label>Phone number *<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="30"></label>
    <label class="full">Street address<input name="address" autocomplete="street-address" maxlength="160"></label>
    <label>City *
      <select name="city" required>
        <option value="">Select</option>
        ${cities.map((c) => `<option>${c}</option>`).join('')}
        <option>Other GTA area</option>
      </select>
    </label>
    <label>Property
      <select name="property">
        <option value="">Select</option>
        ${propertyOptions.map((s) => `<option>${s}</option>`).join('')}
      </select>
    </label>
    <label class="full">Service needed *
      <select name="service" required>
        <option value="">Select a service</option>
        ${serviceOptions.map((s) => `<option>${s}</option>`).join('')}
      </select>
    </label>
    <label class="full"><span>Email <span class="opt">(optional)</span></span><input name="email" type="email" autocomplete="email" maxlength="120"></label>
    <label class="full"><span>Job details <span class="opt">(optional)</span></span><textarea name="message" rows="2" maxlength="1500"></textarea></label>
  </div>
  <input class="hp" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign">
  <input type="hidden" name="utm_term"><input type="hidden" name="gclid"><input type="hidden" name="page">
  <button class="btn btn-submit" type="submit">Get My Free Estimate</button>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>`;

// Partner cards, used on the thank-you and "You may be interested" pages.
const partners = () => `
<section id="partners" class="section partners" aria-labelledby="partners-title">
  <div class="container">
    <h2 id="partners-title" class="section-title">Our Partners</h2>
    <p class="section-intro">Trusted local companies we work alongside on Toronto homes.</p>
    <div class="partner-grid">
      <a class="partner-card" href="${site.lightsUrl}" target="_blank" rel="noopener" data-track="lights_click">
        ${pic('lights-holiday-mix', 'House with permanent multicolour lights along the roofline')}
        <div class="partner-body">
          <span class="tag">Permanent Roofline Lighting</span>
          <h3>Christmas lights without the ladder</h3>
          <p>An LED track installed once under the eaves and run from your phone: holiday colours in December, warm white or off the rest of the year.</p>
          <span class="btn btn-line">Visit Website ›</span>
        </div>
      </a>
      <a class="partner-card" href="${site.guttersUrl}" target="_blank" rel="noopener" data-track="gutters_click">
        ${pic('winter-icicles', 'Icicles hanging from a blocked eavestrough')}
        <div class="partner-body">
          <span class="tag">Eavestrough Cleaning &amp; Repair</span>
          <h3>Fewer icicles start with clean gutters</h3>
          <p>Eavestroughs cleaned out, leaks sealed and guards installed, so snowmelt drains away from the house instead of freezing along the roof edge.</p>
          <span class="btn btn-line">Visit Website ›</span>
        </div>
      </a>
    </div>
  </div>
</section>`;

const faqs = [
  ['What does snow removal cost?', 'Every property is different, so we price each job individually. The size of the driveway or roof, the depth of the snow and any ice work all count. Call or send the form and we give you a firm number before we start.'],
  ['Do I pay for each visit separately?', 'Yes. We work call by call: you contact us when you need snow cleared and we book the visit. You only pay for the jobs you ask for.'],
  ['How fast can you come?', 'Most calls are handled the same day. During a big storm the list gets longer, so call as early as you can.'],
  ['Is it safe to shovel a flat roof?', 'When done properly, yes. We use plastic shovels, leave a thin layer of snow to protect the membrane, and never chip ice off the roof surface.'],
  ['Will salt damage my concrete or hurt my dog?', 'Regular rock salt can be hard on fresh concrete and paws. Tell us when you book and we bring a gentler ice melter instead.'],
  ['How do I pay?', 'Once the job is done and you have checked it, you can pay by e-Transfer, card or cash.'],
  ['Are you insured?', 'Yes, our crew carries liability insurance for work on residential and commercial properties.'],
];

const home = () => {
  const body = `
<section class="hero">
  <picture class="hero-bg"><source srcset="/assets/img/hero.webp" type="image/webp"><img src="/assets/img/hero.jpg" alt="" width="1024" height="576" fetchpriority="high"></picture>
  <div class="container hero-inner">
    <div class="hero-text">
      <p class="hero-kicker">Local Snow Removal Company · Toronto, ON</p>
      <h1>Snow Removal &amp; Winter Handyman Services in Toronto</h1>
      <p class="hero-lead">Driveways, walkways, steps, flat roofs, decks and icicles. One phone call and a local crew takes care of it, usually the same day.</p>
      <ul class="hero-checks">
        <li>${icon('check')} Free estimates over the phone</li>
        <li>${icon('check')} Pay only for the visits you book</li>
        <li>${icon('check')} Fully insured crew</li>
        <li>${icon('check')} Evenings and weekends</li>
      </ul>
      <div class="hero-buttons">
        ${callBtn('Call Now', 'btn-lg')}
        <a class="btn btn-ghost btn-lg" href="#estimate" data-track="quote_click">Free Estimate</a>
      </div>
    </div>
    <div id="estimate" class="hero-form">${estimateForm()}</div>
  </div>
</section>

<section class="features" aria-label="Why homeowners call us">
  <div class="container feature-grid">
    <div class="feature">${icon('shield')}<div><strong>Insured</strong><span>Liability coverage on every job</span></div></div>
    <div class="feature">${icon('check')}<div><strong>Upfront Pricing</strong><span>Price agreed before we start</span></div></div>
    <div class="feature">${icon('clock')}<div><strong>7 Days a Week</strong><span>Including nights and holidays</span></div></div>
    <div class="feature">${icon('camera')}<div><strong>Photo Report</strong><span>Pictures sent when we finish</span></div></div>
  </div>
</section>

<section id="services" class="section" aria-labelledby="services-title">
  <div class="container">
    <h2 id="services-title" class="section-title">Our Services</h2>
    <p class="section-intro">Snow and ice work for houses, townhomes and small businesses across the city.</p>
    <div class="service-grid">
      ${photoServices.map((s) => `
      <article id="${s.id}" class="service-card">
        <div class="service-photo">${pic(s.img, s.alt)}</div>
        <div class="service-body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
          <a class="more-link" href="#estimate" data-track="quote_click">Request this service ›</a>
        </div>
      </article>`).join('')}
    </div>
    <h3 class="sub-title">Other Winter Jobs</h3>
    <div class="extra-grid">
      ${iconServices.map((s) => `
      <div id="${s.id}" class="extra-item"><span class="extra-icon">${icon(s.icon)}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section id="about" class="section section-grey" aria-labelledby="about-title">
  <div class="container about">
    <div class="about-photo">${pic('job-walkway', 'Cleared walkway to a Toronto home')}</div>
    <div class="about-text">
      <h2 id="about-title" class="section-title left">A Neighbourhood Crew, Not a Call Centre</h2>
      <p>${esc(site.brand)} is a small team of workers from the GTA who take on the winter chores most homeowners would rather skip. When you call, you talk to the people who schedule the work, and the price you hear is the price you pay.</p>
      <p>We bring shovels, snow blowers, roof rakes, ice choppers and salt in the truck, so whatever is waiting at your address can be handled in a single trip.</p>
      <ul class="check-list">
        <li>${icon('check')} Seniors, busy families and landlords welcome</li>
        <li>${icon('check')} We clean up after ourselves and close the gate</li>
        <li>${icon('check')} Photos sent if you are not home</li>
      </ul>
      ${callBtn('Talk to Us')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="process-title">
  <div class="container">
    <h2 id="process-title" class="section-title">How It Works</h2>
    <ol class="process">
      <li><span class="num">1</span><h3>Call or Send the Form</h3><p>Tell us the address and what needs clearing. A photo by WhatsApp helps us price it.</p></li>
      <li><span class="num">2</span><h3>Get Your Price</h3><p>We give you a fixed price and a time window. No surprises when the work is done.</p></li>
      <li><span class="num">3</span><h3>We Do the Work</h3><p>The crew clears, salts and tidies up. You check the result and pay after.</p></li>
    </ol>
  </div>
</section>

<section class="cta-band">
  <div class="container cta-inner">
    <div>
      <h2>Snowed in? We can help today.</h2>
      <p>Call for a free estimate anywhere in ${esc(site.area)}.</p>
    </div>
    ${callBtn('Call Now', 'btn-lg btn-on-orange')}
  </div>
</section>

<section id="areas" class="section section-grey" aria-labelledby="areas-title">
  <div class="container">
    <h2 id="areas-title" class="section-title">Service Areas</h2>
    <p class="section-intro">We cover the City of Toronto and nearby communities in the GTA.</p>
    <ul class="area-list">${cities.map((c) => `<li>${icon('pin')} ${c}</li>`).join('')}</ul>
    <p class="center muted">Not on the list? Call us anyway, we may still be able to come out.</p>
  </div>
</section>

<section id="faq" class="section" aria-labelledby="faq-title">
  <div class="container narrow">
    <h2 id="faq-title" class="section-title">Frequently Asked Questions</h2>
    ${faqs.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
  </div>
</section>

<section class="section section-blue contact" aria-labelledby="contact-title">
  <div class="container contact-inner">
    <div>
      <h2 id="contact-title">Contact ${esc(site.brand)}</h2>
      <p>The fastest way to book is a phone call. You can also send us a WhatsApp message with a photo of the snow.</p>
      <ul class="contact-list">
        <li>${icon('phone')} <a href="tel:${site.phone.tel}" data-track="phone_click">${site.phone.display}</a></li>
        <li>${icon('whatsapp')} <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-track="whatsapp_click">WhatsApp</a></li>
        <li>${icon('clock')} ${esc(site.hours)}</li>
      </ul>
    </div>
    <div class="contact-buttons">
      ${callBtn('Call Now', 'btn-lg')}
      <a class="btn btn-ghost btn-lg" href="#estimate" data-track="quote_click">Request Estimate</a>
    </div>
  </div>
</section>`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return page({
    path: '/',
    title: 'Snow Removal Toronto | Driveways, Walkways, Flat Roofs & Icicles | Toronto Snow Help',
    description: `Local snow removal and winter handyman services in Toronto and the GTA. Driveways, steps, flat roofs, decks, icicles and salting. Free estimate: ${site.phone.display}.`,
    body,
    schema: [faqSchema],
  });
};

const thankYou = () =>
  page({
    path: '/thank-you/',
    title: `Thank You | ${site.brand}`,
    description: 'Your estimate request was sent.',
    noindex: true,
    body: `
<section class="section page-head">
  <div class="container narrow center">
    <span class="ok-icon">${icon('check')}</span>
    <h1>Thank you! Your request has been sent.</h1>
    <p>Someone from our team will call you back shortly to confirm the details and the price. If it is urgent, call us now:</p>
    ${callBtn('Call Now', 'btn-lg')}
    <p class="muted">Meanwhile, check out <a href="#partners">our partners</a>.</p>
  </div>
</section>
${partners()}
<script>window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'generate_lead'});</script>`,
  });

// Opened in the same tab when a visitor comes back from the phone app (see main.js).
const interested = () =>
  page({
    path: '/interested/',
    title: `You May Be Interested | ${site.brand}`,
    description: 'Partner services and other winter jobs for Toronto homeowners.',
    noindex: true,
    body: `
<section class="section page-head">
  <div class="container narrow center">
    <h1>You may be interested</h1>
    <p>Thanks for calling ${esc(site.brand)}. While you are here, take a look at other services for your home from us and our partners.</p>
  </div>
</section>
${partners()}
<section class="section section-grey" aria-labelledby="also-title">
  <div class="container">
    <h2 id="also-title" class="section-title">We Can Also Do These on the Same Visit</h2>
    <div class="extra-grid">
      ${services.map((s) => `
      <a class="extra-item" href="/#${s.id}"><span class="extra-icon">${icon(s.icon || 'shovel')}</span><div><strong>${esc(s.title)}</strong></div></a>`).join('')}
    </div>
    <div class="busy-box">
      <p><strong>Could not get through?</strong> The line may be busy during a storm. Send us a WhatsApp message and we will reply as soon as possible.</p>
      <a class="btn btn-line" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} Message on WhatsApp</a>
    </div>
    <p class="center"><a href="/">‹ Back to home page</a></p>
  </div>
</section>`,
  });

const privacy = () =>
  page({
    path: '/privacy/',
    title: `Privacy Policy | ${site.brand}`,
    description: `How ${site.brand} handles the information you send through this website.`,
    body: `
<section class="section">
  <div class="container narrow text-page">
    <h1>Privacy Policy</h1>
    <p>${esc(site.brand)} follows Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) when handling information sent through this website.</p>
    <h2>Information we collect</h2>
    <p>The details you enter in the estimate form: your name, phone number, address, city, property type, the service you need, and optionally your email and job notes. If you arrived from an online ad, we also record the campaign parameters of that visit.</p>
    <h2>How we use it</h2>
    <p>Only to contact you about your request, prepare a price and schedule the work. We do not sell or rent your information to anyone.</p>
    <h2>Cookies</h2>
    <p>Advertising and analytics tools such as Google may set cookies to measure visits and ad results. You can block cookies in your browser settings or manage ad personalisation at <a href="https://adssettings.google.com" rel="noopener">adssettings.google.com</a>.</p>
    <h2>Contact</h2>
    <p>To see or delete the information we hold about you, call <a href="tel:${site.phone.tel}">${site.phone.display}</a>.</p>
  </div>
</section>`,
  });

const notFound = () =>
  page({
    path: '/404',
    title: `Page Not Found | ${site.brand}`,
    description: 'Page not found.',
    noindex: true,
    body: `
<section class="section page-head">
  <div class="container narrow center">
    <h1>Page not found</h1>
    <p>The page you are looking for may have moved. Try the home page or give us a call.</p>
    <a class="btn btn-line" href="/">Go to Home Page</a>
  </div>
</section>`,
  });

export const pages = () => [
  ['index.html', home()],
  ['thank-you/index.html', thankYou()],
  ['interested/index.html', interested()],
  ['privacy/index.html', privacy()],
  ['404.html', notFound()],
];

export const sitemapPaths = () => ['/', '/privacy/'];
