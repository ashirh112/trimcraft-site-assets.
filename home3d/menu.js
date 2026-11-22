/* Trimcraft menus: one panel that opens from the item you point at, glides and reshapes between menus,
   and lays its rows in one after another. Shared by the home page and every inner page. */
(function () {
  'use strict';
  var DATA = {"cats": [{"slug": "paper-boxes", "name": "Paper boxes", "line": "Printed board boxes for the shelf", "img": "/assets/img/c-window.webp", "n": 10}, {"slug": "corrugated-boxes", "name": "Corrugated boxes", "line": "Stronger boxes for shipping", "img": "/assets/img/c-corr.webp", "n": 5}, {"slug": "cards-and-tags", "name": "Cards and tags", "line": "Hang tags", "img": "/assets/img/c-tags.webp", "n": 4}, {"slug": "screen-printing", "name": "Screen printing", "line": "Heat-transfer labels and pad prints", "img": "/assets/img/c-htl.webp", "n": 2}, {"slug": "labels-and-stickers", "name": "Labels and stickers", "line": "Composition and care labels", "img": "/assets/img/c-barcode.webp", "n": 2}, {"slug": "print-and-wrap", "name": "Print and wrap", "line": "Printed tissue and booklets that finish the unboxing", "img": "/assets/img/c-tissue.webp", "n": 2}], "steps": [{"slug": "design", "name": "Design and pre-press"}, {"slug": "offset-printing", "name": "Offset printing"}, {"slug": "lamination", "name": "Lamination"}, {"slug": "sheeting", "name": "Sheeting"}, {"slug": "spot-uv", "name": "Spot UV"}, {"slug": "die-cutting", "name": "Die-cutting"}, {"slug": "automatic-die-cutting", "name": "Automatic die-cutting"}, {"slug": "htl-and-pad-printing", "name": "HTL and pad printing"}, {"slug": "care-labels", "name": "Care labels"}, {"slug": "quality-control", "name": "Quality control"}, {"slug": "packing-and-dispatch", "name": "Packing and dispatch"}], "brands": [{"slug": "puma", "name": "Puma", "logo": "/assets/logos/puma.svg"}, {"slug": "boss", "name": "BOSS", "logo": "/assets/logos/boss.svg"}, {"slug": "hugo", "name": "HUGO", "logo": "/assets/logos/hugo.svg"}, {"slug": "levis", "name": "Levi's", "logo": "/assets/logos/levis.svg"}, {"slug": "polo-ralph-lauren", "name": "Polo Ralph Lauren", "logo": "/assets/logos/ralph-lauren.svg"}, {"slug": "tommy-hilfiger", "name": "Tommy Hilfiger", "logo": "/assets/logos/tommy.svg"}, {"slug": "columbia", "name": "Columbia", "logo": "/assets/logos/columbia.svg"}, {"slug": "jack-and-jones", "name": "Jack & Jones", "logo": "/assets/logos/jack-jones.svg"}, {"slug": "new-balance", "name": "New Balance", "logo": null}, {"slug": "head", "name": "HEAD", "logo": "/assets/logos/head.svg"}, {"slug": "hurley", "name": "Hurley", "logo": "/assets/logos/hurley.svg"}, {"slug": "bamigo", "name": "Bamigo", "logo": null}]};
  var D = document;
  if (!matchMedia('(min-width: 981px)').matches) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = D.querySelector('header nav'); if (!nav) return;
  var ARR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  // menu photos load the first time a menu opens, as small copies
  function sm(src) { return (window.TC3D_BASE||'/') + 'assets/w/' + src.slice(1).replace(/\//g, '_').replace(/\.webp$/, '-480.webp'); }
  var i = 0; function r() { return ' style="--i:' + (i++) + '"'; }

  var panes = {};
  i = 0;
  panes['/all-products'] = '<div class="mm-pane mm-prod" data-k="/all-products"><p class="mm-k mi"' + r() + '>Six families, 25 products</p><div class="mm-grid">' +
    DATA.cats.map(function (c) { return '<a class="mm-cat mi"' + r() + ' href="/product-families/' + c.slug + '"><span class="mm-th"><img data-src="' + sm(c.img) + '" alt=""></span><span><b>' + esc(c.name) + '</b><small>' + esc(c.line) + '</small><em>' + c.n + ' products</em></span></a>'; }).join('') +
    '</div><div class="mm-foot mi"' + r() + '><a href="/all-products">All products ' + ARR + '</a><a href="/finishes">Finishes ' + ARR + '</a><a href="/samples-and-minimums">Samples and minimums ' + ARR + '</a></div></div>';
  i = 0;
  panes['/process'] = '<div class="mm-pane mm-proc" data-k="/process"><a class="mm-feat mi"' + r() + ' href="/process"><span class="mm-ph"><img data-src="' + sm('/assets/img/autocut.webp') + '" alt=""></span><b>Built on automation.</b><small>Follow a job from artwork to dispatch.</small></a><ol class="mm-steps">' +
    DATA.steps.map(function (s, n) { return '<li class="mi"' + r() + '><a href="/process#' + s.slug + '"><i>' + (n < 9 ? '0' : '') + (n + 1) + '</i>' + esc(s.name) + '</a></li>'; }).join('') + '</ol></div>';
  i = 0;
  panes['/our-work'] = '<div class="mm-pane mm-work" data-k="/our-work"><a class="mm-feat mi"' + r() + ' href="/our-work"><span class="mm-ph mm-mos"><img data-src="' + sm('/assets/lib/levis-rigid.webp') + '" alt=""><img data-src="' + sm('/assets/lib/polo-1.webp') + '" alt=""><img data-src="' + sm('/assets/lib/head-bands.webp') + '" alt=""></span><b>The box library.</b><small>Real jobs for 60+ international brands.</small></a><div class="mm-brands">' +
    DATA.brands.map(function (b) { return '<a class="mi"' + r() + ' href="/our-work" aria-label="' + esc(b.name) + '">' + (b.logo ? '<img data-src="' + (window.TC3D_BASE||'/') + b.logo.slice(1) + '" alt="">' : '<b>' + esc(b.name) + '</b>') + '</a>'; }).join('') + '</div></div>';
  i = 0;
  var AB = [['Our story', 'Since ' + (window.TC3D_YEAR||'1990') + ', from one machine', '/about'], ['Leadership', 'The family that still leads', '/leadership'], ['Factory and capacity', '69,821 sq ft, 26M+ pieces a month', '/factory'], ['Machines', 'Presses, die-cutters, UV and lamination', '/machines'], ['Certifications', 'ISO, OEKO-TEX, FSC, Higg', '/certifications'], ['Sustainability', '70% solar energy, zero waste to landfill', '/sustainability'], ['Company profile', 'Ask for the latest copy', '/company-profile']];
  panes['/about'] = '<div class="mm-pane mm-about" data-k="/about"><a class="mm-feat mi"' + r() + ' href="/about"><span class="mm-ph"><img data-src="' + sm('/assets/img/founders.webp') + '" alt=""></span><b>Leading since ' + (window.TC3D_YEAR||'1990') + '.</b><small>The founders still lead the company.</small></a><div class="mm-list">' +
    AB.map(function (a) { return '<a class="mi"' + r() + ' href="' + a[2] + '"><b>' + a[0] + '</b><small>' + a[1] + '</small></a>'; }).join('') + '</div></div>';

  var trig = [].slice.call(nav.querySelectorAll('a[href]')).filter(function (a) { return panes[new URL(a.href, location.href).pathname]; });
  if (!trig.length) return;
  var mm = D.createElement('div'); mm.className = 'mm'; mm.setAttribute('aria-hidden', 'true');
  mm.innerHTML = '<div class="mm-bg"></div><div class="mm-car"></div><div class="mm-in">' + Object.keys(panes).map(function (k) { return panes[k]; }).join('') + '</div>';
  (document.querySelector(".tc3d-root")||document.body).appendChild(mm);
  var ind = D.createElement('div'); ind.className = 'mm-ind'; (document.querySelector(".tc3d-root")||document.body).appendChild(ind);
  var bg = mm.querySelector('.mm-bg'), car = mm.querySelector('.mm-car'), inner = mm.querySelector('.mm-in');
  var P = {}; [].forEach.call(mm.querySelectorAll('.mm-pane'), function (p) { P[p.dataset.k] = p; });
  var cur = null, curT = null, shutT = 0, openT = 0, isOpen = false;

  function size(p) { var s = p.style.visibility; p.style.visibility = 'hidden'; p.classList.add('measure'); var w = p.offsetWidth, h = p.offsetHeight; p.classList.remove('measure'); p.style.visibility = s; return [w, h]; }
  function place(t, k, first) {
    var tr = t.getBoundingClientRect(), hd = t.closest('header').getBoundingClientRect(), wh = size(P[k]), w = wh[0], h = wh[1];
    var cx = tr.left + tr.width / 2, pad = 24;
    var x = Math.max(pad, Math.min(innerWidth - w - pad, cx - w * .42)), y = Math.max(hd.bottom - 8, tr.bottom + 14);
    mm.style.setProperty('--x', x + 'px'); mm.style.setProperty('--y', y + 'px');
    mm.style.setProperty('--w', w + 'px'); mm.style.setProperty('--h', h + 'px');
    mm.style.setProperty('--ox', (cx - x) + 'px');
    car.style.setProperty('--cx', (cx - x) + 'px');
    ind.style.setProperty('--l', tr.left + 18 + 'px'); ind.style.setProperty('--iw', Math.max(8, tr.width - 36) + 'px'); ind.style.setProperty('--t', tr.bottom - 9 + 'px');
    if (first) { mm.classList.add('snap'); mm.offsetWidth; mm.classList.remove('snap'); }
  }
  function show(t) {
    clearTimeout(shutT);
    var k = new URL(t.href, location.href).pathname;
    if (k === cur && isOpen) return;
    var dir = 0;
    if (cur && isOpen) { dir = trig.indexOf(t) > trig.indexOf(curT) ? 1 : -1; }
    var old = cur && P[cur];
    place(t, k, !isOpen);
    if (old && isOpen) {
      old.classList.remove('on'); old.style.setProperty('--d', dir); old.classList.add('off');
      setTimeout(function () { old.classList.remove('off'); }, 220);
      ind.classList.remove('stretch'); ind.offsetWidth; ind.classList.add('stretch');
    }
    var np = P[k]; np.style.setProperty('--d', dir); np.classList.remove('off'); np.classList.add('on');
    trig.forEach(function (x) { x.classList.toggle('mm-cur', x === t); x.setAttribute('aria-expanded', x === t); });
    cur = k; curT = t;
    if (!mm._loaded) { mm._loaded = 1; [].forEach.call(mm.querySelectorAll('img[data-src]'), function (im) { im.src = im.dataset.src; }); }
    if (!isOpen) { oy = scrollY; isOpen = true; mm.classList.add('open'); ind.classList.add('on'); mm.setAttribute('aria-hidden', 'false'); }
  }
  function hide(now) {
    clearTimeout(openT); clearTimeout(shutT);
    shutT = setTimeout(function () {
      isOpen = false; mm.classList.remove('open'); ind.classList.remove('on'); mm.setAttribute('aria-hidden', 'true');
      trig.forEach(function (x) { x.classList.remove('mm-cur'); x.setAttribute('aria-expanded', 'false'); });
      var p = cur && P[cur]; setTimeout(function () { if (!isOpen && p) p.classList.remove('on'); }, 200);
    }, now ? 0 : 140);
  }
  // delegated, so it keeps working if the page redraws its menu
  function trigOf(el) { var a = el && el.closest && el.closest('header nav a[href]'); if (!a) return null; return panes[new URL(a.href, location.href).pathname] ? a : 'other'; }
  function syncTrig() { trig = [].slice.call(D.querySelectorAll('header nav a[href]')).filter(function (a) { return panes[new URL(a.href, location.href).pathname]; }); trig.forEach(function (t) { if (!t.hasAttribute('aria-haspopup')) { t.setAttribute('aria-haspopup', 'true'); t.setAttribute('aria-expanded', 'false'); } }); }
  syncTrig();
  D.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    var t = trigOf(e.target); if (!t) return;
    if (t === 'other') { hide(true); return; }
    syncTrig(); clearTimeout(openT); clearTimeout(shutT); openT = setTimeout(function () { show(t); }, isOpen ? 0 : 60);
  });
  D.addEventListener('pointerout', function (e) {
    var t = trigOf(e.target); if (!t || t === 'other') return;
    if (trigOf(e.relatedTarget) === t || mm.contains(e.relatedTarget)) return;
    clearTimeout(openT); hide();
  });
  D.addEventListener('focusin', function (e) { var t = trigOf(e.target); if (t && t !== 'other') { syncTrig(); show(t); } else if (t === 'other') hide(true); });
  mm.addEventListener('pointerenter', function () { clearTimeout(shutT); });
  mm.addEventListener('pointerleave', function () { hide(); });
  mm.addEventListener('focusout', function (e) { if (!mm.contains(e.relatedTarget) && trig.indexOf(e.relatedTarget) < 0) hide(true); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { hide(true); curT && curT.focus(); } });
  var oy = 0;
  addEventListener('scroll', function () { if (isOpen && Math.abs(scrollY - oy) > 40) hide(true); }, { passive: true });
  addEventListener('resize', function () { if (isOpen) hide(true); });
  if (reduce) mm.classList.add('still');
})();
