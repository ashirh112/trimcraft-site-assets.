/* Products: one gesture moves exactly one product. Heading fill on section titles. */
(function () {
  'use strict';

  // ---------- products step scroll ----------
  window.__tcStepInit = function (o) {
    var Z = window.__tcPZ; if (!Z || Z.rm) return; // reduced motion: plain list, no snapping
    var n = o.qr, L = o.Fi, story = o._o;
    var vh = function () { return innerHeight / 100; };
    var base = function () { return story.getBoundingClientRect().top + scrollY; };
    function rest(k) {
      var v = k <= 0 ? Z.A + Z.hd : k >= n - 1 ? Z.A + Z.hd + Z.ho * 2 + (n - 1) * Z.st : Z.A + Z.hd + Z.ho + k * Z.st;
      return Math.round(base() + v * vh());
    }
    function rests() { var a = []; for (var k = 0; k < n; k++) a.push(rest(k)); return a; }
    function top() { return base() + (Z.A - 2) * vh(); }
    var lock = 0, need = 0, lastW = 0, lastA = 0, idleT = 0, ly = scrollY, dirY = 1;
    // story progress -> page position
    function Y(ee) {
      var M = window.__tcMap, W = M.W, X = M.X, r = 1;
      for (var i = 0; i < X.length - 1; i++) if (ee <= X[i + 1]) { var t = X[i + 1] === X[i] ? 1 : (ee - X[i]) / (X[i + 1] - X[i]); r = W[i] + (W[i + 1] - W[i]) * t; break; }
      return Math.round(base() + (story.offsetHeight - innerHeight) * r);
    }
    // camera-only stretches between sections: stopping inside one glides into a section
    function zones() {
      return [[Y(.085), Y(.151)], [Y(.228), Y(.245)], [Y(.326), rest(0)], [rest(n - 1), Y(.506)], [Y(.705), Y(.751)]];
    }
    var now = function () { return performance.now(); };
    var cur = function () { return L ? L.targetScroll : scrollY; };

    var stepT = 0, goal = 0;
    function go(y, ms) {
      ms = ms || 560;
      lock = now() + ms; need = 1; endT = lock; goal = y;
      clearTimeout(stepT); stepT = setTimeout(function () { typeof after === 'function' && after(); }, ms + 20);
      if (L) L.scrollTo(y, { duration: ms / 1000, lock: true, force: true, easing: function (t) { return 1 - Math.pow(1 - t, 3); }, __tc: 1 });
      else scrollTo({ top: y, behavior: 'smooth' });
    }
    function inZone(y) { var a = rests(); return y >= top() - 2 && y <= a[n - 1] + 4; }
    // where one step in this direction lands, or null to let the page scroll on
    function pick(y, dir) {
      var a = rests();
      if (y < top() - 2 || y > a[n - 1] + 4) return null;
      var k;
      if (dir > 0) { for (k = 0; k < n; k++) if (a[k] > y + 4) return a[k]; return null; }
      for (k = n - 1; k >= 0; k--) if (a[k] < y - 4) return a[k];
      return null;
    }
    function nearest(y) { var a = rests(), b = a[0], d = 1e9; a.forEach(function (v) { if (Math.abs(v - y) < d) { d = Math.abs(v - y); b = v; } }); return b; }
    function toIndex(k) {
      var y = rest(k), d = Math.abs(y - scrollY) / (Z.st * vh());
      go(y, Math.min(1400, 600 + 140 * d));
    }

    var fine = !Z.touch;
    if (fine) {
      // soft stepping: small scrolls add up, a mouse notch moves at once, a long spin keeps moving
      // one product at a time, and the coasting tail of a trackpad flick is ignored
      var acc = 0, queued = 0, tail = 0, endT = 0, hold = 0;
      var after = function () {
        if (!queued) return;
        var d = queued; queued = 0;
        var to = pick(goal || scrollY, d); if (to !== null) go(to);
      };
      addEventListener('wheel', function (e) {
        if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        var t = now(), dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY, ad = Math.abs(dy);
        var coasting = t - lastW < 60 && ad < lastA * .985;
        tail = coasting ? tail + 1 : 0;
        lastW = t; lastA = ad;
        var ts = L ? L.targetScroll : scrollY, a0 = rest(0), aN = rest(n - 1);
        // arriving: catch the incoming scroll on 01 (from above) or 08 (from below) and let it settle there
        if (t >= hold && t >= lock) {
          var catchTo = null;
          if (dy > 0 && scrollY < a0 - 2 && ts + dy * 1.15 >= top()) catchTo = a0;
          else if (dy < 0 && scrollY > aN + 2 && ts + dy * 1.15 <= aN + 2) catchTo = aN;
          if (catchTo !== null) {
            e.preventDefault(); e.stopImmediatePropagation();
            acc = 0; queued = 0; go(catchTo, Math.min(1100, 650 + Math.abs(catchTo - scrollY) / innerHeight * 300)); hold = lock + 450;
            return;
          }
        }
        if (t < hold) { if (inZone(scrollY) || inZone(ts)) { e.preventDefault(); e.stopImmediatePropagation(); } acc = 0; queued = 0; return; }
        if (t < lock) {
          if (!inZone(cur())) return;
          e.preventDefault(); e.stopImmediatePropagation();
          if (!coasting) { acc += dy; if (Math.abs(acc) >= 160 && !queued) { queued = acc > 0 ? 1 : -1; acc = 0; } }
          return;
        }
        if (tail > 1 && t - endT < 900 && inZone(scrollY)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
        if ((dy > 0) !== (acc > 0)) acc = 0;
        acc += dy;
        var to = pick(scrollY, dy > 0 ? 1 : -1);
        if (to === null) { acc = 0; return; } // first or last product: leave the section right away
        e.preventDefault(); e.stopImmediatePropagation();
        if (Math.abs(acc) < 36) return;
        acc = 0; go(to);
      }, { passive: false, capture: true });

      addEventListener('keydown', function (e) {
        var k = e.key, dir = k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey) ? 1 : k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey) ? -1 : 0;
        if (!dir || e.altKey || e.metaKey || e.ctrlKey) return;
        var tg = e.target, tag = tg && tg.tagName;
        if (/INPUT|TEXTAREA|SELECT/.test(tag) || (tg && tg.isContentEditable)) return;
        if (now() < lock) { if (inZone(scrollY)) { e.preventDefault(); e.stopImmediatePropagation(); } return; }
        var to = pick(scrollY, dir);
        if (to === null) return;
        e.preventDefault(); e.stopImmediatePropagation();
        need = 0; go(to);
      }, true);
    }

    // entering from above or below: settle on 01 or 08 before anything moves
    addEventListener('scroll', function () {
      var y = scrollY, a = rests(), jump = now() < (window.__tcJ || 0);
      if (fine && !jump && now() >= lock && Math.abs(y - ly) < innerHeight * 1.2) {
        if (ly < a[0] - 2 && y > a[0] + 6) go(a[0]);
        else if (ly > a[n - 1] + 2 && y < a[n - 1] - 6) go(a[n - 1]);
      }
      if (Math.abs(y - ly) > 1) dirY = y > ly ? 1 : -1;
      ly = y;
      clearTimeout(idleT);
      idleT = setTimeout(function idle() {
        if (now() < lock || now() < (window.__tcJ || 0)) { idleT = setTimeout(idle, 250); return; }
        var y2 = scrollY, a2 = rests();
        var zs = zones();
        for (var i = 0; i < zs.length; i++) {
          var lo = zs[i][0], hi = zs[i][1];
          if (y2 > lo + 3 && y2 < hi - 3) {
            var f = (y2 - lo) / (hi - lo), to2 = (dirY > 0 ? f > .2 : f > .8) ? hi : lo;
            go(to2, Math.min(1100, 520 + Math.abs(to2 - y2) / innerHeight * 500));
            return;
          }
        }
        if (y2 <= a2[0] + 2 || y2 >= a2[n - 1] - 2) return;
        var t2 = nearest(y2);
        if (Math.abs(t2 - y2) > 3) go(t2, Z.touch ? 480 : 620); // touch: a light snap to the nearest product
      }, Z.touch ? 140 : 220);
    }, { passive: true });

    // names in the list and the tags themselves jump straight to that product
    document.querySelectorAll('.plist li[data-k]').forEach(function (li) {
      var k = +li.dataset.k;
      li.tabIndex = 0; li.setAttribute('role', 'button');
      li.setAttribute('aria-label', 'Show ' + li.textContent.replace(/^\d+/, '').trim());
      li.addEventListener('click', function (e) { e.stopImmediatePropagation(); toIndex(k); }, true);
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toIndex(k); } });
    });
    document.querySelectorAll('.pring .tag').forEach(function (t, k) {
      t.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        if (Math.abs(rest(k) - scrollY) < 12 && window.__tcBox) { // the product in front opens large
          var im = t.querySelector('img'), cap = t.querySelector('figcaption');
          window.__tcBox(im.currentSrc || im.src, cap.querySelector('b').textContent, cap.querySelector('span').textContent, im.alt);
        } else toIndex(k);
      }, true);
    });
    // menu and footer links into the products land on a product, never in between
    document.querySelectorAll('[data-go]').forEach(function (a) {
      var v = +a.dataset.go; if (v < .335 || v > .4755) return;
      var k = v < .352 ? 0 : Math.round((v - .352) / ((.475 - .352) / (n - 1)));
      a.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); toIndex(k); }, true);
    });
    window.__tcProd = { rest: rest, toIndex: toIndex, Y: Y };
  };

  // ---------- heading fill: dim to solid, left to right, once on entry ----------
  var DUR = .9, DELAY = .28;
  function prep(h) {
    var spans = [].slice.call(h.querySelectorAll('.w > span'));
    if (!spans.length) return null;
    var hr = h.getBoundingClientRect();
    var W = Math.max(1, hr.width);
    var info = spans.map(function (s) { var r = s.getBoundingClientRect(); return { el: s, x0: r.left - hr.left, w: Math.max(1, r.width) }; });
    return { W: W, info: info, w0: innerWidth };
  }
  function tone(h) {
    var sec = h.closest('[data-in]'), a = sec ? +sec.dataset.in : 0;
    var paper = a >= .13 && a < .32 && !h.closest('.panel.copper'); // About and automation sit on paper
    h.style.setProperty('--tf-on', paper ? '#172B46' : '#ffffff');
    h.style.setProperty('--tf-dim', paper ? 'rgba(23,43,70,.2)' : 'rgba(255,255,255,.26)');
  }
  function paint(h, f) {
    var d = h.__tf;
    if (!d || d.w0 !== innerWidth) d = h.__tf = prep(h);
    if (!d) return;
    var front = f * d.W * 1.04;
    for (var i = 0; i < d.info.length; i++) {
      var it = d.info[i], v = Math.min(1, Math.max(0, (front - it.x0) / it.w));
      if (it.v !== v) { it.v = v; it.el.style.setProperty('--fp', v.toFixed(3)); }
    }
  }
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  // story headings: driven by the reveal clock in the main loop (t = seconds since entry, -1 when away)
  window.__tcFill = function (el, t) {
    var h = el.querySelector('h1,h2,h3'); if (!h || h.classList.contains('hero')) return;
    if (!h.__tfOn) { h.__tfOn = 1; h.classList.add('tcf'); }
    if (t < 0) { if (h.__tfS !== 0) { h.__tfS = 0; paint(h, 0); } return; }
    if (t < .05 || h.__tfS === 0) { tone(h); h.__tfS = 1; }
    var f = ease(Math.min(1, Math.max(0, (t - DELAY) / DUR)));
    if (f !== h.__tfL) { h.__tfL = f; paint(h, f); }
  };
  // headings below the story: play once when they scroll into view
  function wrapWords(h) {
    if (h.querySelector('.w')) return;
    var walk = function (node) {
      [].slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var o = document.createElement('span'); o.className = 'w'; var i = document.createElement('span'); i.textContent = p; o.appendChild(i); frag.appendChild(o);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    };
    walk(h);
  }
  function play(h) {
    h.__tf = null; var dark = !!h.closest('.navybg,.contact');
    h.style.setProperty('--tf-on', dark ? '#ffffff' : '#172B46');
    h.style.setProperty('--tf-dim', dark ? 'rgba(255,255,255,.26)' : 'rgba(23,43,70,.2)');
    var t0 = 0;
    (function f(ts) {
      if (!t0) t0 = ts;
      var t = (ts - t0) / 1000, v = ease(Math.min(1, Math.max(0, (t - DELAY) / DUR)));
      paint(h, v);
      if (v < 1) requestAnimationFrame(f);
    })(performance.now());
  }
  function initMain() {
    var hs = [].slice.call(document.querySelectorAll('main .head h2, main .contact h2'));
    if (!hs.length || !('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); play(e.target); } });
    }, { threshold: .6 });
    hs.forEach(function (h) { wrapWords(h); h.classList.add('tcf'); var dark = !!h.closest('.navybg,.contact'); h.style.setProperty('--tf-on', dark ? '#ffffff' : '#172B46'); h.style.setProperty('--tf-dim', dark ? 'rgba(255,255,255,.26)' : 'rgba(23,43,70,.2)'); paint(h, 0); io.observe(h); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMain); else initMain();
})();
