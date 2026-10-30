(function () {
  'use strict';
  var dl = (window.dataLayer = window.dataLayer || []);

  // Mobile menu
  var menu = document.getElementById('mobile-menu');
  var toggle = document.querySelector('.menu-toggle');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });

  // Click tracking for Google Ads / GA4 via GTM
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) dl.push({ event: el.getAttribute('data-track'), link_location: el.className || 'link' });
  });

  // Phones: after a call button, show the "You may be interested" page once the visitor comes back
  // from the phone app. Navigating while the call is still starting makes iOS block it as an
  // automatic call, so the tab only moves after it was hidden and is visible again.
  var callTapped = false, leftForCall = false;
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="tel:"]') && location.pathname.indexOf('/interested/') !== 0) callTapped = true;
  });
  document.addEventListener('visibilitychange', function () {
    if (!callTapped) return;
    if (document.visibilityState === 'hidden') leftForCall = true;
    else if (leftForCall) location.href = '/interested/';
  });

  // Keep ad click IDs and UTM params for the session so they reach the form
  var params = new URLSearchParams(location.search);
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid'];
  var store = {};
  try { store = JSON.parse(sessionStorage.getItem('attr') || '{}'); } catch (err) {}
  keys.forEach(function (k) { if (params.get(k)) store[k] = params.get(k); });
  try { sessionStorage.setItem('attr', JSON.stringify(store)); } catch (err) {}

  var form = document.querySelector('.lead-form');
  if (!form) return;
  keys.forEach(function (k) { if (store[k] && form.elements[k]) form.elements[k].value = store[k]; });
  form.elements.page.value = location.pathname;

  var status = form.querySelector('.form-status');
  var started = false;
  form.addEventListener('input', function () {
    if (!started) { started = true; dl.push({ event: 'form_start' }); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    var bad = null;
    ['name', 'phone', 'city', 'service'].forEach(function (n) {
      var f = form.elements[n];
      var ok = f.value.trim() !== '' && (n !== 'phone' || f.value.replace(/\D/g, '').length >= 10);
      f.classList.toggle('invalid', !ok);
      if (!ok && !bad) bad = f;
    });
    var email = form.elements.email;
    if (email.value && !email.checkValidity()) { email.classList.add('invalid'); bad = bad || email; }
    if (bad) {
      status.textContent = 'Please fill in the fields marked with *. The phone number needs 10 digits.';
      status.classList.add('error');
      bad.focus();
      return;
    }

    var btn = form.querySelector('button[type=submit]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok || !res.d.ok) throw new Error(res.d.error || 'Request failed');
        location.href = '/thank-you/';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        var tel = document.querySelector('a[href^="tel:"]');
        status.innerHTML = 'Sorry, the form could not be sent. Please call us at <a href="' + tel.getAttribute('href') + '">' +
          tel.getAttribute('href').replace(/^tel:\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') + '</a>.';
        status.classList.add('error');
      });
  });
})();
