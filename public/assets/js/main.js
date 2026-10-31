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

  // After a tap on a call button, move this tab to the "You may be interested" page.
  // The tab never navigates while the dialer or the iOS "Call?" prompt is opening (iOS
  // reports that as "site blocked automatic call initiation"): it waits until the
  // visitor is back on the page and it has stayed on screen for a moment. The tap is
  // also remembered in sessionStorage, so the page still opens if the browser reloaded
  // the tab while the visitor was on the call. Where nothing leaves the page (desktop
  // without a phone app), it moves on after a short pause.
  var NEXT = '/interested/', KEY = 'callTapAt';
  var onNext = location.pathname === NEXT;
  var tapped = false, left = false, timer = 0;
  var markCall = function (v) { try { v ? sessionStorage.setItem(KEY, String(Date.now())) : sessionStorage.removeItem(KEY); } catch (err) {} };
  var go = function () {
    clearTimeout(timer);
    if (!tapped || document.hidden) return;
    tapped = false;
    markCall(false);
    location.href = NEXT;
  };
  var away = function () { if (tapped) { left = true; clearTimeout(timer); } };
  var back = function () { if (tapped && left && !document.hidden) { clearTimeout(timer); timer = setTimeout(go, 1200); } };
  if (onNext) markCall(false);
  else {
    document.addEventListener('click', function (e) {
      if (!e.target.closest('a[href^="tel:"]')) return;
      tapped = true; left = false;
      markCall(true);
      clearTimeout(timer);
      timer = setTimeout(function () { if (!left) go(); }, 2500);
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? away() : back(); });
    window.addEventListener('blur', away);
    window.addEventListener('focus', back);
    window.addEventListener('pageshow', function () {
      var at = 0;
      try { at = +sessionStorage.getItem(KEY) || 0; } catch (err) {}
      if (at && Date.now() - at < 30 * 60 * 1000) { tapped = true; left = true; back(); }
      else markCall(false);
    });
  }

  // Bottom call bar: shown only while none of the page's own call buttons is on screen
  var bar = document.querySelector('.mobile-bar');
  var calls = document.querySelectorAll('main .btn-call');
  if (bar && calls.length && 'IntersectionObserver' in window) {
    var visible = [];
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var i = visible.indexOf(en.target);
        if (en.isIntersecting && i < 0) visible.push(en.target);
        if (!en.isIntersecting && i >= 0) visible.splice(i, 1);
      });
      bar.classList.toggle('show', visible.length === 0);
    });
    calls.forEach(function (el) { barIO.observe(el); });
    document.documentElement.classList.add('bar-auto');
  }

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
