/* Trimcraft home: desktop 3D story.
   Loaded after the page has finished loading, only on large screens with enough power.
   The native home stays on screen until the 3D scene is ready, then the two cross-fade.
   If the visitor has already scrolled or started typing, the 3D scene is dropped. */
(function () {
  'use strict';
  var cur = document.currentScript;
  var B = (cur && cur.getAttribute('data-base')) || '';
  if (!B || window.__tc3d) return;
  window.__tc3d = 1;
  try {
    var t = document.createElement('canvas');
    if (!(t.getContext('webgl2') || t.getContext('webgl'))) return;
  } catch (e) { return; }

  var D = document, H = D.documentElement, W = window;
  var yEl = D.querySelector('.founding-year');
  var Y = ((yEl && yEl.textContent.match(/\d{4}/)) || ['1990'])[0];
  var N = new Date().getFullYear() - (+Y);
  var SCRIPTS = ['js/tc-ink.js', 'js/tc-steps.js', 'ring.js', 'js/tc-boot.js', 'app.js',
    'js/tc-ship.js', 'js/tc-shape.js', 'js/tc-arc.js', 'js/tc-sus.js', 'js/tc-fix.js', 'menu.js'];

  W.TC3D_BASE = B; W.TC3D_YEAR = Y;
  W.TC_DPR_CAP = 1.5; W.TC_IDLE = true; W.TCQ = true;

  var root, done = false, timers = [];
  function moved() {
    var a = D.activeElement;
    return W.scrollY > 50 || !!(a && a.closest && a.closest('form, .page-wrapper input, .page-wrapper textarea'));
  }
  function abort() {
    if (done) return; done = true;
    W.__tcHold = true;
    try { W.__tcLenis && W.__tcLenis.destroy(); } catch (e) {}
    timers.forEach(clearInterval);
    if (root) root.remove();
    H.classList.remove('tc3d', 'tc3d-fade', 'tc3d-on', 'lenis', 'lenis-smooth');
    H.style.overflow = '';
  }

  /* listeners the original scripts expect from page load: collected now, called once they have all run */
  var held = [], cap = true;
  function hook(T) {
    var orig = T.addEventListener;
    T.addEventListener = function (type, fn, opt) {
      if (cap && (type === 'load' || type === 'DOMContentLoaded')) { held.push([T, type, fn]); return; }
      return orig.apply(this, arguments);
    };
    return function () { delete T.addEventListener; if (T.addEventListener !== orig) T.addEventListener = orig; };
  }
  var origInterval = W.setInterval;
  function fire(type) {
    held.forEach(function (h) {
      if (h[1] !== type) return;
      try { var ev = new Event(type); typeof h[2] === 'function' ? h[2].call(h[0], ev) : h[2].handleEvent(ev); } catch (e) { console.error(e); }
    });
  }

  function load(i, end) {
    if (i >= SCRIPTS.length) return end();
    var s = D.createElement('script');
    s.src = B + SCRIPTS[i];
    s.async = false;
    s.onload = function () { load(i + 1, end); };
    s.onerror = abort;
    D.body.appendChild(s);
  }

  function ready() {
    if (done) return;
    if (moved()) return abort();
    done = true;
    H.classList.add('tc3d-fade');
    root.removeAttribute('aria-hidden');
    root.inert = false;
    setTimeout(function () {
      if (W.scrollY > 50) { W.scrollTo(0, 0); }
      H.classList.add('tc3d-on');
      H.classList.remove('tc3d-fade');
      W.dispatchEvent(new Event('resize'));
    }, 480);
  }

  function start() {
    var restoreW = hook(W), restoreD = hook(D);
    W.setInterval = function () { var id = origInterval.apply(W, arguments); timers.push(id); return id; };
    load(0, function () {
      cap = false; restoreW(); restoreD(); W.setInterval = origInterval;
      fire('DOMContentLoaded'); fire('load');
      var t0 = Date.now();
      (function wait() {
        if (done) return;
        if (moved()) return abort();
        if (W.__tcRevealAt || !root.querySelector('.loader')) return ready();
        if (Date.now() - t0 > 15000) return abort();
        setTimeout(wait, 100);
      })();
    });
  }

  H.setAttribute('data-assets', B + 'assets/');
  var link = D.createElement('link');
  link.rel = 'stylesheet';
  link.href = B + 'home3d.css';
  var cssReady = new Promise(function (res, rej) { link.onload = res; link.onerror = rej; });
  D.head.appendChild(link);

  Promise.all([
    fetch(B + 'stage.html').then(function (r) { if (!r.ok) throw 0; return r.text(); }),
    cssReady
  ]).then(function (r) {
    if (moved()) return abort();
    root = D.createElement('div');
    root.className = 'tc3d-root';
    root.setAttribute('aria-hidden', 'true');
    root.inert = true;
    root.innerHTML = r[0].split('{{B}}').join(B).split('{{Y}}').join(Y).split('{{N}}').join(String(N));
    D.body.insertBefore(root, D.body.firstChild);
    H.classList.add('tc3d');
    start();
  }).catch(abort);
})();
