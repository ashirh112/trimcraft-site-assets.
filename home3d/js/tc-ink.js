/* Loader: ink dots run the nest pattern, then gather into the solid Trimcraft wordmark. */
(function () {
  function uncover(failed) {
    if (failed) document.documentElement.classList.add('no-webgl');
    var el = document.querySelector('.loader');
    if (!el) return;
    el.remove();
    document.body.classList.add('ready');
  }
  /* If the 3D scene never starts, the wordmark must not stay on top of the page. */
  var cap = (window.TC_MOBILE || (window.innerWidth || 1200) < 768) ? 6000 : 9000;
  setTimeout(function () { if (document.querySelector('.loader')) uncover(!window.__tcTL); }, cap);
  window.addEventListener('error', function (ev) {
    var t = ev && ev.target;
    var src = t && t.src || '';
    var msg = (ev && ev.message) || '';
    var appFailed = t && t.tagName === 'SCRIPT' && /app\.js/.test(src);
    var glFailed = /webgl/i.test(msg) || (window.__tcBoot && !window.__tcTL && msg);
    if (appFailed || glFailed) uncover(true);
  }, true);

  var box = document.querySelector('.loader .ink');
  if (!box) return;
  var cv = box.querySelector('canvas'), solid = box.querySelector('.solid');
  var loader = box.closest('.loader');
  window.__tcInk = 0;
  var finished = false;
  function done() {
    if (finished) return; finished = true;
    window.__tcInk = 1;
    solid.style.opacity = 1;
    var T = window.__tcTL;
    if (window.__tcReadyAt && T && T.paused()) T.play();
  }
  setTimeout(done, (window.TC_MOBILE || (window.innerWidth || 1200) < 768) ? 1200 : 3200);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var quick = !!window.TCQ;
  var pathEl = document.querySelector('#tc-logo path');
  if (reduce || !pathEl || !window.Path2D) { done(); return; }

  var VW = 1485.183, VH = 200;
  var ctx = cv.getContext('2d');
  var dpr = Math.min(devicePixelRatio || 1, 2);
  var W, H, lw, lh, lx, ly, dots = [];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  function setup() {
    var r = loader.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var s = solid.getBoundingClientRect();
    lw = s.width; lh = s.height; lx = s.left - r.left; ly = s.top - r.top;

    // sample the wordmark
    var sc = 0.32, ow = Math.ceil(VW * sc), oh = Math.ceil(VH * sc);
    var oc = document.createElement('canvas'); oc.width = ow; oc.height = oh;
    var o = oc.getContext('2d');
    o.scale(sc, sc); o.fill(new Path2D(pathEl.getAttribute('d')), 'evenodd');
    var data = o.getImageData(0, 0, ow, oh).data;
    var step = W < 700 ? 4 : 3, targets = [];
    for (var y = 0; y < oh; y += step) for (var x = 0; x < ow; x += step)
      if (data[(y * ow + x) * 4 + 3] > 128) targets.push([lx + (x + .5) / ow * lw, ly + (y + .5) / oh * lh]);

    // nest pattern: quarter arcs around a grid of corners, three rings each
    if (!W || !H) return;
    var cell = Math.max(W, H) / (W < 700 ? 3 : 4.2), arcs = [];
    for (var gx = 0; gx <= W / cell + 1; gx++) for (var gy = 0; gy <= H / cell + 1; gy++) {
      var q = (gx + gy) % 4, a0 = q * Math.PI / 2;
      [.35, .5, .65].forEach(function (k) { arcs.push({ cx: gx * cell, cy: gy * cell, r: k * cell, a0: a0, dir: (gx + gy) % 2 ? 1 : -1 }); });
    }
    dots = targets.map(function (t, i) {
      var a = arcs[(Math.random() * arcs.length) | 0];
      return {
        tx: t[0], ty: t[1], a: a, off: rand(0, Math.PI / 2), run: rand(.8, 1.5),
        d: (t[0] - lx) / lw * .28 + rand(0, .08), // gather left to right
        r: rand(1.3, 2.4), c: Math.random() < .07 ? '#B66A43' : '#FFFFFF'
      };
    });
  }

  var T0 = 0, DUR = window.__tcInkDur || (quick ? 900 : 2100);
  function frame(now) {
    if (!T0) T0 = now;
    var p = (now - T0) / DUR;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var spread = clamp((p - .78) / .2); // ink spreads into the solid mark
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], a = d.a;
      var ang = a.a0 + a.dir * (d.off + d.run * Math.min(p, .45) * 3.2);
      var sx = a.cx + Math.cos(ang) * a.r, sy = a.cy + Math.sin(ang) * a.r;
      var g = ease(clamp((p - .3 - d.d) / .42));
      var x = sx + (d.tx - sx) * g, y = sy + (d.ty - sy) * g;
      var rr = d.r * (1 - g) + 1.6 * g + spread * 2.4;
      ctx.globalAlpha = (p < .08 ? p / .08 : 1) * (1 - spread) * (g > 0 ? 1 : .75);
      ctx.fillStyle = g > .9 ? '#FFFFFF' : d.c;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.2832); ctx.fill();
    }
    solid.style.opacity = spread.toFixed(3);
    if (p < 1) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); done(); }
  }
  function start() { try { setup(); } catch (e) { dots = []; } if (!dots.length || !W) { solid.style.opacity = 1; done(); return; } requestAnimationFrame(frame); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
