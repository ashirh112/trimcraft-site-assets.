if (document.documentElement.classList.contains('js')) {
/* Trimcraft motion for the Webflow build: the same motion code as the original site.
   Elements carry their original class names in data-v; inline custom properties travel in data-vs. */
(function () {
  'use strict';
  var D = document;
  function $$(s, r) { return [].slice.call((r || D).querySelectorAll(s)); }
  // where the Designer did not keep an element's data-v, give it the motion role its class stands for
  /*VMAP*/[[".t-stk .t-meta", "meta"], [".t-meta", "rv"], [".t-acts", "acts"], [".t-acts-2", "acts"], [".t-blogo", "blogo"], [".t-card", "card"], [".t-card-2", "card rv"], [".t-card-3", "card rv"], [".t-card-4", "card rv"], [".t-card-5", "card rv"], [".t-card-bcard", "bcard card"], [".t-card-person", "card person rv"], [".t-chip", "chip"], [".t-chip-2", "chip"], [".t-chip-3", "chip"], [".t-chip-4", "chip"], [".t-close", "close"], [".t-cols", "cols"], [".t-contact-list", "contact-list"], [".t-crumbs", "crumbs"], [".t-cta-dark", "cta"], [".t-cta-dark-flow", "cta rv"], [".t-cta-dark-flow-2", "cta"], [".t-cta-dark-flow-3", "cta"], [".t-cta-dark-flow-4", "cta"], [".t-cta-dark-flow-5", "cta"], [".t-cta-flow", "cta"], [".t-cta-flow-2", "cta"], [".t-cta-flow-3", "cta"], [".t-faq", "faq rv"], [".t-faq-2", "faq rv"], [".t-filters", "filters rv"], [".t-ft", "ft"], [".t-grid-g4-lib", "lib"], [".t-hd", "hd"], [".t-hero", "hero"], [".t-hero-hero-split", "hero hero-split"], [".t-ht", "ht"], [".t-ht-bar", "ht-bar"], [".t-ht-count", "ht-count"], [".t-ht-side", "ht-side rv"], [".t-ht-stage", "ht-stage"], [".t-ht-track", "ht-track"], [".t-intro", "intro rv"], [".t-intro-2", "intro rv"], [".t-intro-3", "intro"], [".t-intro-4", "intro"], [".t-lede-serif", "lede"], [".t-long", "long"], [".t-menu-btn", "menu-btn"], [".t-meta-2", "meta"], [".t-n", "n"], [".t-n-2", "n"], [".t-ph", "ph"], [".t-ph-sh", "ph"], [".t-ph-sh-2", "ph"], [".t-ph-sh-3", "ph"], [".t-ph-sh-wide-seq-mob", "ph seq-mob"], [".t-ph-sh-wide-wide", "ph rv wide"], [".t-ph-sh-wide-wide-2", "ph wide"], [".t-qf", "rv"], [".t-sec", "sec"], [".t-sec-2", "sec"], [".t-sec-head-h2", "rv"], [".t-sec-tight", "sec"], [".t-sec-tight-2", "sec"], [".t-sec-white", "sec"], [".t-seq", "seq"], [".t-seq-count", "seq-count"], [".t-seq-cur", "seq-cur"], [".t-seq-fill", "seq-fill"], [".t-seq-knob", "seq-knob"], [".t-seq-line", "seq-line"], [".t-seq-m", "seq-m"], [".t-seq-m-seq-year", "seq-m seq-year"], [".t-seq-media-sh-wide", "seq-media"], [".t-seq-stage", "seq-stage"], [".t-seq-t", "seq-t"], [".t-seq-text", "seq-text"], [".t-seq-yr", "seq-yr"], [".t-sheet", "sheet"], [".t-spec", "spec"], [".t-spec-2", "spec"], [".t-spec-3", "spec"], [".t-spec-scroll", "rv spec-scroll"], [".t-stack", "stack"], [".t-stats", "stats"], [".t-stats-div", "rv"], [".t-steps", "steps"], [".t-steps-2", "rv steps"], [".t-steps-3", "rv steps"], [".t-stk", "stk"], [".t-stk-list", "stk-list"], [".t-stk-ph", "stk-ph"], [".t-stk-tx", "stk-tx"], [".t-txt", "txt"], [".t-txt-2", "txt"], [".t-txt-3", "rv txt"], [".t-txt-4", "txt"], [".t-wrap", "wrap"], [".t-wrap-2", "wrap"], [".t-wrap-3", "wrap"], [".t-wrap-4", "wrap"], [".t-wrap-5", "wrap"], [".t-wrap-6", "wrap"], [".t-wrap-div", "rv"], [".t-wrap-div-3", "rv"], [".t-wrap-div-4", "rv"], [".t-wrap-grid-g2", "wrap"], [".t-wrap-grid-g2-2", "wrap"], [".t-wrap-grid-g2-div", "rv"], [".t-wrap-grid-g3", "wrap"], [".t-wrap-ht-head", "ht-head wrap"], [".t-wrap-ht-head-h2", "rv"], [".t-wrap-prose", "prose wrap"], [".t-wrap-qwrap", "wrap"], [".t-wrap-seq-grid", "seq-grid wrap"], [".t-wrap-seq-rail", "seq-rail wrap"], [".t-x", "x"]].forEach(function (r) {
    $$(r[0]).forEach(function (e) { if (!e.hasAttribute('data-v')) e.setAttribute('data-v', r[1]); });
  });
  // text pieces the Designer keeps as divs go back to their original tags
  $$('[data-v~="ht-count"]>div').forEach(function (d) { var b = D.createElement('b'); b.className = d.className; b.textContent = d.textContent; d.replaceWith(b, ' '); });
  // quote buttons on product pages open the quote form with the product filled in
  $$('a[data-q]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?product=' + encodeURIComponent(a.getAttribute('data-q'))); });
  // the quote form picks up the product named in the link
  var qp = new URLSearchParams(location.search).get('product'), qs = D.querySelector('select[name="Product"]');
  if (qp && qs) {
    var hit = [].filter.call(qs.options, function (o) { return o.text.toLowerCase() === qp.toLowerCase(); })[0];
    if (!hit) { hit = new Option(qp, qp); qs.insertBefore(hit, qs.options[1] || null); }
    qs.value = hit.value || hit.text; hit.selected = true;
  }
  $$('[data-vs]').forEach(function (e) { e.style.cssText += ';' + e.getAttribute('data-vs'); });
  $$('[data-v~="stk"]').forEach(function (c, i) { if (!c.style.getPropertyValue('--k')) c.style.setProperty('--k', i); });
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // menu sheet on small screens
  var sh = D.querySelector('[data-v~="sheet"]'), mb = D.querySelector('[data-v~="menu-btn"]');
  if (sh && mb) {
    var open = function (v) { sh.classList.toggle('open', v); mb.setAttribute('aria-expanded', v); D.body.style.overflow = v ? 'hidden' : ''; if (v) { var a = sh.querySelector('a[href]'); a && a.focus(); } else mb.focus(); };
    mb.addEventListener('click', function (e) { e.preventDefault(); open(true); });
    var x = sh.querySelector('[data-v~="x"]'); x && x.addEventListener('click', function (e) { e.preventDefault(); open(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && sh.classList.contains('open')) open(false); });
  }
  // reveal on scroll, a short stagger inside each group
  var els = $$('[data-v~="rv"]');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(function (e) { e.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var e = en.target, sib = e.parentNode ? [].slice.call(e.parentNode.children).filter(function (x) { return x.matches('[data-v~="rv"]'); }) : [e];
        e.style.transitionDelay = Math.min(240, sib.indexOf(e) * 50) + 'ms'; e.classList.add('in'); io.unobserve(e);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  // work library filters
  var fl = D.querySelector('[data-v~="filters"]'), lib = D.querySelector('[data-v~="lib"]');
  if (fl && lib) fl.addEventListener('click', function (e) {
    var b = e.target.closest('button,a'); if (!b) return; e.preventDefault();
    [].forEach.call(fl.querySelectorAll('button,a'), function (x) { x.setAttribute('aria-pressed', x === b); });
    var k = b.dataset.k, v = b.dataset.v2 || b.getAttribute('data-val');
    [].forEach.call(lib.children, function (c) { c.hidden = !(v === 'all' || (c.dataset[k] || '').split('|').indexOf(v) > -1); });
  });
  // wide spec tables: the fade and the label show that the row continues sideways
  $$('[data-v~="spec-scroll"]').forEach(function (el) {
    el.addEventListener('scroll', function () { el.classList.toggle('scrolled', el.scrollLeft > 12); }, { passive: true });
  });
})();
/* Trimcraft inner pages: motion. Headline words, button fills, cursor lean, page veil,
   staggered groups, counting numbers, photo parallax and the work library shuffle. */
(function () {
  'use strict';
  var D = document, H = D.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $$(s, r) { return [].slice.call((r || D).querySelectorAll(s)); }
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  // headlines: each word in its own mask, so it can rise into place
  $$('[data-v~="hero"] h1, [data-v~="sec"] h2, [data-v~="chap"] h2, [data-v~="close"] h2, [data-v~="seq-t"] h2, [data-v~="stk"] h2, [data-v~="ht"] h2').forEach(function (el) {
    if (el.children.length || el.dataset.split) return;
    var t = el.textContent.trim(); if (!t) return;
    el.dataset.split = 1; el.setAttribute('aria-label', t);
    el.innerHTML = t.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + esc(w) + '</span></span>';
    }).join(' ');
    if (el.matches('[data-v~="rv"]')) el.classList.add('w-host');
  });

  // buttons: the same copper flood and sliding arrow as the home page
  var ARR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  $$('[data-v~="cta"]').forEach(function (a) {
    if (a.tagName !== 'A' && a.tagName !== 'BUTTON') return;
    if (a.dataset.fb || a.querySelector('[class*="fb-t"]')) return; a.dataset.fb = 1;
    $$('svg', a).forEach(function (s) { s.remove(); });
    var label = a.textContent.trim(); a.textContent = '';
    a.classList.add('flow');
    a.insertAdjacentHTML('beforeend', '<span class="fb-a l">' + ARR + '</span><span class="fb-t">' + esc(label) + '</span><span class="fb-c"></span><span class="fb-a r">' + ARR + '</span>');
    $$('.fb-a', a).forEach(function (s) { var g = s.firstChild; g.setAttribute('class', 'fb-a ' + (s.classList.contains('l') ? 'l' : 'r')); s.replaceWith(g); });
  });

  // groups that settle one item after another
  function group(el, kind) { if (!el || el.classList.contains('m-g')) return; el.classList.add('m-g'); if (kind) el.classList.add(kind); [].forEach.call(el.children, function (c, i) { c.style.setProperty('--i', i); }); }
  $$('[data-v~="spec"] [data-v~="tbody"]').forEach(function (e) { group(e, 'm-x'); });
  $$('[data-v~="steps"]').forEach(function (e) { group(e, 'm-x'); });
  $$('[data-v~="stats"], [data-v~="contact-list"], [data-v~="ft"] [data-v~="cols"]').forEach(function (e) { group(e); });
  $$('[data-v~="meta"], [data-v~="filters"]').forEach(function (e) { if (!e.closest('[data-v~="seq"], [data-v~="ht"]')) group(e, 'm-pop'); });
  $$('[data-v~="seq-t"] [data-v~="meta"]').forEach(function (e) { [].forEach.call(e.children, function (c, i) { c.style.setProperty('--i', i); }); });
  $$('[data-v~="stk-tx"]').forEach(function (e) { group(e); });
  $$('div').forEach(function (d) { if (d.closest('[data-v~="seq"], [data-v~="ht"], [data-v~="stk"]')) return; if (d.children.length > 2 && d.querySelectorAll(':scope>[data-v~="chip"]').length === d.children.length) group(d, 'm-pop'); });
  var groups = $$('.m-g, [data-v~="close"], [data-v~="stk"]');

  // numbers count up when they come into view
  var nums = $$('[data-v~="stats"] b').map(function (b) {
    var m = b.textContent.match(/^([\d,]*\.?\d+)(.*)$/); if (!m) return null;
    var v = parseFloat(m[1].replace(/,/g, '')), dec = (m[1].split('.')[1] || '').length, comma = m[1].indexOf(',') > -1;
    return { b: b, v: v, dec: dec, comma: comma, tail: m[2], done: false };
  }).filter(Boolean);
  function fmt(n, o) { var s = n.toFixed(o.dec); if (o.comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return s + o.tail; }
  function count(o) {
    if (o.done) return; o.done = true; if (reduce) return;
    var t0 = performance.now(), dur = 1500;
    o.b.textContent = fmt(0, o);
    (function step(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(2, -10 * p); o.b.textContent = fmt(p >= 1 ? o.v : o.v * e, o); if (p < 1) requestAnimationFrame(step); })(t0);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    groups.forEach(function (g) { g.classList.add('m-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; var g = en.target; g.classList.add('m-in'); io.unobserve(g);
        nums.forEach(function (o) { if (g.contains(o.b)) count(o); });
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    groups.forEach(function (g) { io.observe(g); });
    nums.forEach(function (o) { var g = o.b.closest('.m-g'); if (!g) io.observe(o.b.parentNode); });
  }

  if (reduce) return;

  // page veil: links inside the site close the page behind the navy veil before the next one opens
  addEventListener('pageshow', function (e) { if (e.persisted) H.classList.remove('leaving'); });
  function inSite(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download') || /^(mailto|tel):/.test(a.getAttribute('href') || '')) return null;
    var u = new URL(a.href, location.href); return u.origin === location.origin ? u : null;
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || e.defaultPrevented) return;
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var u = inSite(a); if (!u) return;
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return;
    e.preventDefault(); H.classList.add('leaving');
    setTimeout(function () { location.href = u.href; }, 300);
  });
  // the next page starts loading as soon as you point at its link
  var pre = {};
  function prefetch(e) {
    var a = e.target.closest && e.target.closest('a[href]'), u = inSite(a); if (!u || u.pathname === location.pathname || pre[u.pathname]) return;
    pre[u.pathname] = 1; var l = D.createElement('link'); l.rel = 'prefetch'; l.href = u.pathname; D.head.appendChild(l);
  }
  D.addEventListener('pointerover', prefetch, { passive: true }); D.addEventListener('touchstart', prefetch, { passive: true });

  // photo parallax: big photos drift a little slower than the page
  var plx = $$('[data-v~="chap"] [data-v~="ph"] img, [data-v~="ph"][data-v~="wide"] img, [data-v~="person"] [data-v~="ph"] img, [data-v~="hero-split"] [data-v~="wrap"]>[data-v~="ph"] img').filter(function (i) {
    return !/\/(c-|lib\/|inlay|cert-|tags\/)/.test(i.getAttribute('src') || '');
  });
  plx.forEach(function (i) { i.classList.add('plx'); });
  $$('[data-v~="hero-split"] [data-v~="wrap"]>[data-v~="ph"] img').forEach(function (i) { if (!i.classList.contains('plx')) i.style.setProperty('--rest', 1); });
  function watch(list, set) {
    if (!list.length) return;
    var o = new IntersectionObserver(function (es) { es.forEach(function (en) { en.isIntersecting ? set.add(en.target) : set.delete(en.target); }); }, { rootMargin: '10% 0px' });
    list.forEach(function (x) { o.observe(x); });
  }
  var vis = new Set(); watch(plx, vis);
  var heroes = $$('[data-v~="hero"]'), mx = 0, my = 0, tx = 0, ty = 0;

  // things you can click lean toward the cursor (only the ones on screen are measured)
  var mag = $$('[data-v~="hd"] nav a, [data-v~="cta"], a[data-v~="chip"], [data-v~="filters"] button, [data-v~="filters"] a, [data-v~="ft"] a, [data-v~="txt"], [data-v~="crumbs"] a'), magVis = new Set(), px = -1e4, py = -1e4;
  var scrolled = true, moved = false;
  if (fine) { watch(mag, magVis); addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; tx = px / innerWidth - .5; ty = py / innerHeight - .5; moved = true; }, { passive: true }); }
  addEventListener('scroll', function () { scrolled = true; }, { passive: true });
  addEventListener('resize', function () { scrolled = true; });

  function frame() {
    var vh = innerHeight, writes = [];
    if (scrolled) {
      vis.forEach(function (i) { var r = i.parentNode.getBoundingClientRect(); writes.push([i, 'translate', '0 ' + ((r.top + r.height / 2 - vh / 2) / vh * -6).toFixed(2) + '%']); });
    }
    if (fine) {
      var ease = Math.abs(tx - mx) + Math.abs(ty - my) > .001;
      if (ease) {
        mx += (tx - mx) * .06; my += (ty - my) * .06;
        heroes.forEach(function (h) { writes.push([h, '--px', mx.toFixed(3)], [h, '--py', my.toFixed(3)]); });
      }
      if (moved || scrolled) {
        magVis.forEach(function (el) {
          var r = el.getBoundingClientRect(); if (!r.width) return;
          var cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = px - cx, dy = py - cy;
          var reach = 90 + Math.max(r.width, r.height) * .5, l = Math.max(0, Math.min(1, 1 - Math.hypot(dx, dy) / reach)), k = l * l * (3 - 2 * l);
          if (!k && !el._m) return; el._m = k > 0;
          writes.push([el, '--mz', (1 + k * .08).toFixed(3)], [el, '--mx', (dx * k * .14).toFixed(1) + 'px'], [el, '--my', (dy * k * .18).toFixed(1) + 'px']);
        });
      }
    }
    // all measuring above, all writing here, so the browser lays the page out once per frame
    for (var w = 0; w < writes.length; w++) { var x = writes[w]; if (x[1] === 'translate') x[0].style.translate = x[2]; else x[0].style.setProperty(x[1], x[2]); }
    scrolled = moved = false;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // work library: cards glide to their new places when a filter changes, new ones fly in
  var fl = D.querySelector('[data-v~="filters"]'), lib = D.querySelector('[data-v~="lib"]');
  if (fl && lib && Element.prototype.animate) {
    var first = null;
    fl.addEventListener('click', function () {
      first = new Map(); [].forEach.call(lib.children, function (c) { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });
      setTimeout(function () {
        var n = 0;
        [].forEach.call(lib.children, function (c) {
          if (c.hidden) return; c.classList.add('in');
          var a = first.get(c), b = c.getBoundingClientRect();
          if (a) c.animate([{ transform: 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)' }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' });
          else if (b.top < innerHeight) c.animate([{ opacity: 0, transform: 'translate3d(0,48px,0) rotate(-1.4deg) scale(.96)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 900, delay: Math.min(n++, 10) * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        });
      }, 0);
    }, true);
  }

  // faq: the answer slides down as it opens
  $$('[data-v~="faq"] details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      var p = d.querySelector('p'); if (!d.open || !p || !p.animate) return;
      p.animate([{ opacity: 0, transform: 'translate3d(0,-12px,0)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  });
})();

/* Cinematic layouts: the pinned sequence, the stacking cards and the pinned horizontal track */
(function () {
  'use strict';
  var D = document;
  function $$(s, r) { return [].slice.call((r || D).querySelectorAll(s)); }
  function cl(v) { return Math.max(0, Math.min(1, v)); }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var wide = matchMedia('(min-width: 861px)');
  var ticks = [];

  // ---- pinned sequence: the page holds still while the steps change one by one ----
  $$('[data-v~="seq"]').forEach(function (sq) {
    var ms = $$('[data-v~="seq-m"]', sq), ts = $$('[data-v~="seq-t"]', sq), lis = $$('[data-v~="seq-rail"] li', sq), knob = sq.querySelector('[data-v~="seq-knob"]'), cur = sq.querySelector('[data-v~="seq-cur"]'), n = ts.length, act = -1;
    function set(k) {
      if (k === act) return; var prev = act; act = k;
      ms.forEach(function (m, i) { m.classList.toggle('on', i === k); m.classList.toggle('past', i < k); });
      ts.forEach(function (t, i) { t.classList.toggle('on', i === k); t.classList.toggle('past', i < k); t.setAttribute('aria-hidden', i !== k); });
      lis.forEach(function (l, i) { l.classList.toggle('on', i === k); });
      if (knob && lis[k]) {
        var lr = lis[k].getBoundingClientRect(), tr = knob.parentNode.getBoundingClientRect();
        knob.style.translate = (lr.left - tr.left) + 'px 0';
        if (prev >= 0) { knob.classList.remove('go'); void knob.offsetWidth; knob.classList.add('go'); }
      }
      if (cur && prev >= 0) { cur.textContent = ts[k].querySelector('[data-v~="n"]').textContent; cur.classList.remove('roll'); void cur.offsetWidth; cur.classList.add('roll'); }
    }
    function posFor(k) { var r = sq.getBoundingClientRect(), tot = r.height - innerHeight; return scrollY + r.top + tot * (k + .5) / n; }
    sq._go = function (id) { var k = ts.findIndex(function (t) { return t.id === id; }); if (k < 0) return false; scrollTo({ top: posFor(k), behavior: 'smooth' }); return true; };
    D.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a || !wide.matches) return;
      var u = new URL(a.href, location.href); if (u.pathname !== location.pathname || !u.hash) return;
      if (sq._go(u.hash.slice(1))) { e.preventDefault(); history.replaceState(null, '', u.hash); }
    }, true);
    if (location.hash && wide.matches) setTimeout(function () { var k = ts.findIndex(function (t) { return '#' + t.id === location.hash; }); if (k > -1) scrollTo(0, posFor(k)); }, 60);
    ticks.push(function () {
      if (!wide.matches) { if (act !== -2) { act = -2; ms.concat(ts).forEach(function (x) { x.classList.remove('on', 'past'); x.removeAttribute('aria-hidden'); }); } return; }
      var r = sq.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) { if (act < 0) set(0); return; }
      var p = cl(-r.top / (r.height - innerHeight));
      sq.style.setProperty('--p', p.toFixed(4));
      set(Math.min(n - 1, Math.floor(p * n)));
    });
  });

  // ---- stacking cards: each card pins, the next slides over it and the one beneath sinks back ----
  var stks = $$('[data-v~="stk"]');
  if (stks.length) ticks.push(function () {
    if (!wide.matches) { stks.forEach(function (c) { c.style.scale = ''; c.style.removeProperty('--dim'); }); return; }
    for (var i = 0; i < stks.length; i++) {
      var c = stks[i], nx = stks[i + 1];
      if (!nx) { c.style.scale = ''; c.style.setProperty('--dim', 0); continue; }
      var r = c.getBoundingClientRect(), nr = nx.getBoundingClientRect();
      var cov = cl(1 - (nr.top - r.top) / r.height);
      c.style.scale = (1 - cov * .07).toFixed(4);
      c.style.setProperty('--dim', (cov * .38).toFixed(3));
    }
  });

  // ---- pinned horizontal track: scrolling down carries the row sideways, new cards arc in from the right ----
  $$('[data-v~="ht"]').forEach(function (h) {
    var tr = h.querySelector('[data-v~="ht-track"]'), cnt = h.querySelector('[data-v~="ht-count"] b'), items = [].slice.call(tr.children), dist = 0, lastK = -1;
    items.forEach(function (it) { it.classList.remove('rv'); it.classList.add('in'); it.style.transition = 'none'; });
    function measure() {
      items.forEach(function (it) { it._ox = null; });
      if (!wide.matches) { h.style.height = ''; tr.style.transform = ''; items.forEach(function (it) { it.style.transform = ''; it.style.opacity = ''; }); return; }
      var pad = parseFloat(getComputedStyle(tr).paddingLeft) || 0;
      dist = Math.max(0, tr.scrollWidth - innerWidth + pad);
      h.style.height = (innerHeight + dist) + 'px';
    }
    measure(); addEventListener('resize', measure); addEventListener('load', measure);
    ticks.push(function () {
      if (!wide.matches) return;
      var r = h.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
      var p = dist ? cl(-r.top / (r.height - innerHeight)) : 0;
      tr.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      h.style.setProperty('--p', p.toFixed(4));
      var vw = innerWidth, x0 = tr.getBoundingClientRect().left - (-p * dist);
      items.forEach(function (it) {
        if (it._ox == null) it._ox = it.offsetLeft;
        var e = cl((x0 + it._ox - p * dist - vw * .8) / (vw * .32));
        it.style.transform = e ? 'translate3d(' + (e * 40).toFixed(1) + 'px,' + (e * e * 110).toFixed(1) + 'px,0) rotate(' + (e * 8).toFixed(2) + 'deg)' : '';
        it.style.opacity = (1 - e * .85).toFixed(3);
      });
      if (cnt) { var k = Math.min(items.length, Math.max(1, Math.round(p * (items.length - 1)) + 1)); if (k !== lastK) { lastK = k; cnt.textContent = (k < 10 ? '0' : '') + k; } }
    });
  });

  if (!ticks.length) return;
  // these scenes only change when the page scrolls or resizes, so they only run then
  var dirty = true;
  addEventListener('scroll', function () { dirty = true; }, { passive: true });
  addEventListener('resize', function () { dirty = true; });
  function frame() { if (dirty) { dirty = false; ticks.forEach(function (t) { t(); }); } requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();
}
