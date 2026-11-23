/* Trimcraft home: the 3D story, on every screen size, as on the original site.
   Phones (under 768px) get the original phone home (stage-m.html, home3d-m.css, phone settings and menu),
   tablets and laptops (768 to 1199px) the main home with the lighter settings, desktops the main home.
   A navy veil (html.tc3d-hold, set in the page head) covers the page while the scene loads; the scene then
   fades in over it with its own loader. If the scene cannot start, the veil lifts and the native home stays. */
(function () {
  'use strict';
  var cur = document.currentScript;
  var B = (cur && cur.getAttribute('data-base')) || '';
  var D = document, H = D.documentElement, W = window;
  function lift() {
    if (!H.classList.contains('tc3d-hold')) return;
    H.classList.add('tc3d-lift');
    setTimeout(function () { H.classList.remove('tc3d-hold', 'tc3d-lift'); }, 650);
  }
  if (!B || W.__tc3d) return;
  W.__tc3d = 1;
  try {
    var t = D.createElement('canvas');
    if (!(t.getContext('webgl2') || t.getContext('webgl'))) return lift();
  } catch (e) { return lift(); }

  var yEl = D.querySelector('.founding-year');
  var Y = ((yEl && yEl.textContent.match(/\d{4}/)) || ['1990'])[0];
  var N = new Date().getFullYear() - (+Y);
  var w = W.innerWidth || H.clientWidth || 9999;
  var phone = w < 768;
  var coarse = (W.matchMedia && matchMedia('(pointer:coarse)').matches) || navigator.maxTouchPoints > 0;
  var SFX = phone ? '-m' : '';
  var SCRIPTS = phone
    ? ['js/tc-ink.js', 'js/tc-steps.js', 'ring.js', 'js/tc-boot.js', 'app.js', 'js/tc-work.js',
      'js/tc-ship.js', 'js/tc-shape.js', 'js/tc-arc.js', 'js/tc-sus.js', 'js/tc-fix.js']
    : ['js/tc-ink.js', 'js/tc-steps.js', 'ring.js', 'js/tc-boot.js', 'app.js',
      'js/tc-ship.js', 'js/tc-shape.js', 'js/tc-arc.js', 'js/tc-sus.js', 'js/tc-fix.js', 'menu.js'];

  // every script starts downloading now, side by side; they still run one after another, in order, from the cache
  SCRIPTS.forEach(function (f) {
    var l = D.createElement('link');
    l.rel = 'preload'; l.as = 'script'; l.href = B + f;
    D.head.appendChild(l);
  });

  /* Touch screens: the address bar slides in and out while you scroll, which changes the window height and
     fires resize. The scene would rebuild its canvas and re-measure every part each time, so scrolling hitches.
     Here the height the scene sees is the full screen height (the same height CSS vh uses), and resizes that
     only come from the address bar are not passed on. A real change (rotation, new width) still is. */
  if (coarse) {
    H.classList.add('tc3d-touch');
    var probe = D.createElement('div');
    probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
    H.appendChild(probe);
    var ihDesc = Object.getOwnPropertyDescriptor(Window.prototype, 'innerHeight') || Object.getOwnPropertyDescriptor(W, 'innerHeight');
    var rawH = function () { return ihDesc && ihDesc.get ? ihDesc.get.call(W) : H.clientHeight; };
    var LH = Math.max(probe.offsetHeight || 0, rawH()), lastW = W.innerWidth, skip = false;
    try { Object.defineProperty(W, 'innerHeight', { configurable: true, get: function () { return Math.max(LH, rawH()); } }); } catch (e) {}
    // runs before every other resize listener and decides whether this resize is real
    W.addEventListener('resize', function () {
      var nw = W.innerWidth;
      if (nw === lastW) { skip = true; return; }
      skip = false; lastW = nw; LH = Math.max(probe.offsetHeight || 0, rawH());
    });
    var addRaw = W.addEventListener;
    W.addEventListener = function (type, fn, opt) {
      if (type === 'resize' && fn) {
        var f = fn;
        fn = function (e) { if (skip) return; return typeof f === 'function' ? f.call(this, e) : f.handleEvent(e); };
      }
      return addRaw.call(this, type, fn, opt);
    };
  }

  W.TC3D_BASE = B; W.TC3D_YEAR = Y;
  // the same settings the original pages set in their head
  if (phone) {
    W.TC_MOBILE = true; W.TCAA = true; W.TC_DPR_CAP = 1.5; W.TC_TEX_SCALE = 0.5; W.TC_SMALL_TEX = true;
    W.TC_IDLE = true; W.TC_NATIVE_SCROLL = true; W.TCQ = true; W.__tcInkDur = 700; W.TC_REVEAL_MS = 900;
    H.dataset.phone = '1';
  } else {
    if (w < 1200) {
      W.TCAA = false; W.TC_DPR_CAP = 1.35; W.TC_TEX_SCALE = 0.85; W.TC_SMALL_TEX = true; W.TC_IDLE = true;
      if (coarse || w < 1024) W.TC_NATIVE_SCROLL = true;
    } else { W.TC_DPR_CAP = 2; W.TC_IDLE = true; }
    W.TCQ = true; // the short opening (the same one phones and returning visitors get), so the story starts sooner
  }

  /* Laptops and tablets: after the opening, the photos the scene still needs (work cards and the rest) load one at a
     time in quiet moments. While you scroll they wait, apart from one every 300 ms, so the first scrolls never stall. */
  if (!phone) {
    var lastInput = 0;
    ['wheel', 'scroll', 'keydown', 'touchmove', 'pointerdown'].forEach(function (t) {
      W.addEventListener(t, function () { lastInput = performance.now(); }, { passive: true });
    });
    W.__tcQueue = function () {
      var lastForced = performance.now();
      function step() {
        var q = W.__tcBootQ;
        if (!q || !q.length || W.__tcDead) return;
        var now = performance.now();
        if (now - lastInput < 350 && now - lastForced < 300) { setTimeout(step, 120); return; }
        lastForced = now;
        try { q.shift()(); } catch (e) {}
        if (W.requestIdleCallback) requestIdleCallback(step, { timeout: 400 }); else setTimeout(step, 60);
      }
      setTimeout(step, 400);
    };
  }

  var root, done = false, timers = [];
  function abort() {
    if (done) return; done = true;
    W.__tcHold = true;
    try { W.__tcLenis && W.__tcLenis.destroy(); } catch (e) {}
    timers.forEach(clearInterval);
    if (root) root.remove();
    H.classList.remove('tc3d', 'tc3d-fade', 'tc3d-on', 'lenis', 'lenis-smooth');
    H.style.overflow = '';
    lift();
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

  // the scene takes over the screen with its own loader, as the original page opens
  function show() {
    if (done) return;
    done = true;
    if (W.scrollY) W.scrollTo(0, 0);
    H.classList.add('tc3d-fade');
    root.removeAttribute('aria-hidden');
    root.inert = false;
    setTimeout(function () {
      if (W.scrollY) W.scrollTo(0, 0);
      H.classList.add('tc3d-on');
      H.classList.remove('tc3d-fade', 'tc3d-hold', 'tc3d-lift');
      W.dispatchEvent(new Event('resize'));
      if (coarse) tint();
    }, 260);
  }

  /* Phones colour the strip under the browser bars from the page background, not from the 3D scene. While the scene
     is on screen the page background follows the scene's own background (navy, paper, ...), so that strip always
     matches; past the scene the page's own colours come back. */
  function tint() {
    var last = '', queued = false;
    function run() {
      queued = false;
      var c = W.__tcHF, inScene = root && W.scrollY < root.offsetHeight - (W.innerHeight || 0) * 0.5;
      var v = c && inScene ? '#' + c.getHexString() : '';
      if (v === last) return;
      last = v;
      H.style.backgroundColor = v; D.body.style.backgroundColor = v;
    }
    function q() { if (!queued) { queued = true; requestAnimationFrame(run); } }
    W.addEventListener('scroll', q, { passive: true });
    var idle; W.addEventListener('scroll', function () { clearTimeout(idle); idle = setTimeout(q, 160); }, { passive: true });
    run(); setTimeout(q, 900);
  }

  function start() {
    var restoreW = hook(W), restoreD = hook(D);
    W.setInterval = function () { var id = origInterval.apply(W, arguments); timers.push(id); return id; };
    var guard = setTimeout(abort, 20000);
    load(0, function () {
      clearTimeout(guard);
      cap = false; restoreW(); restoreD(); W.setInterval = origInterval;
      fire('DOMContentLoaded'); fire('load');
      show();
    });
  }

  H.setAttribute('data-assets', B + 'assets/');
  var link = D.createElement('link');
  link.rel = 'stylesheet';
  link.href = B + 'home3d' + SFX + '.css';
  var cssReady = new Promise(function (res, rej) { link.onload = res; link.onerror = rej; });
  D.head.appendChild(link);

  Promise.all([
    fetch(B + 'stage' + SFX + '.html').then(function (r) { if (!r.ok) throw 0; return r.text(); }),
    cssReady
  ]).then(function (r) {
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
