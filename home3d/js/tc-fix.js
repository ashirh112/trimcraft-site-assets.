/* Buttons, WhatsApp styling, hero sky and the edge scrollbar. */
(function () {
  var WA = '<svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.31-1.96 1.36-.5.05-.97.23-3.26-.68-2.76-1.09-4.5-3.91-4.64-4.09-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34l.51.01c.16.01.38-.06.6.46.24.55.8 1.89.87 2.03.07.14.11.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.89 1.04.93 1.92 1.22 2.19 1.35.27.14.43.11.59-.07.16-.18.68-.8.86-1.07.18-.27.36-.23.61-.14.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.66-.17 1.33Z"/></svg>';
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function flow(a) {
    if (a.dataset.fb) return; a.dataset.fb = 1;
    var wa = /wa\.me|whatsapp/i.test(a.getAttribute('href') || '');
    [].slice.call(a.querySelectorAll('svg')).forEach(function (s) { s.remove(); });
    var label = a.textContent.trim();
    a.textContent = '';
    if (wa) {
      a.classList.add('wa');
      a.insertAdjacentHTML('beforeend', '<span class="fb-c"></span><span class="fb-t">' + WA + label + '</span>');
    } else {
      a.insertAdjacentHTML('beforeend', '<span class="fb-a l">' + ARROW + '</span><span class="fb-t">' + label + '</span><span class="fb-c"></span><span class="fb-a r">' + ARROW + '</span>');
      a.querySelectorAll('.fb-a').forEach(function (s) { var g = s.firstChild; g.setAttribute('class', 'fb-a ' + (s.classList.contains('l') ? 'l' : 'r')); s.replaceWith(g); });
    }
  }
  document.querySelectorAll('.cta').forEach(flow);

  var sky = null;

  // header: solid backdrop over the regular sections below the 3D story
  (function () {
    var hd = document.querySelector('header'), story = document.getElementById('story'); if (!hd || !story) return;
    var cur = '';
    function lum(el) {
      while (el && el !== document.documentElement) {
        var c = getComputedStyle(el).backgroundColor, m = c.match(/[\d.]+/g);
        if (m && (m.length < 4 || +m[3] > .5)) return (.3 * m[0] + .59 * m[1] + .11 * m[2]) / 255;
        el = el.parentElement;
      }
      return 0;
    }
    function chk() {
      var past = story.getBoundingClientRect().bottom < 90, cls = '';
      if (past) {
        hd.style.visibility = 'hidden';
        var el = document.elementFromPoint(innerWidth / 2, 60);
        hd.style.visibility = '';
        cls = lum(el) > .55 ? 'tc-solid-paper' : 'tc-solid-dark';
      }
      if (cls !== cur) { if (cur) hd.classList.remove(cur); if (cls) hd.classList.add(cls); cur = cls; }
    }
    addEventListener('scroll', function () { requestAnimationFrame(chk); }, { passive: true }); chk();
    setInterval(chk, 250);
    var lastY = scrollY;
    addEventListener('scroll', function () {
      var y = scrollY, past = story.getBoundingClientRect().bottom < 90;
      if (!past || y < lastY - 6 || hd.contains(document.activeElement)) hd.classList.remove('tc-hide');
      else if (y > lastY + 6) hd.classList.add('tc-hide');
      if (Math.abs(y - lastY) > 6) lastY = y;
    }, { passive: true });
  })();

  // brand strip: the scrolling copy is decoration, so keyboards and screen readers skip it
  (function () {
    var seen = {};
    document.querySelectorAll('.logos .track button').forEach(function (b) {
      var k = b.dataset.box; if (seen[k]) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); } seen[k] = 1;
    });
  })();

  // box popup: move focus in and back out
  (function () {
    var bv = document.querySelector('.boxview'); if (!bv) return; var back = null;
    new MutationObserver(function () {
      if (bv.classList.contains('open')) { back = document.activeElement; var x = bv.querySelector('.x'); x && setTimeout(function () { x.focus(); }, 60); }
      else if (back && back.focus) { back.focus({ preventScroll: true }); back = null; }
    }).observe(bv, { attributes: true, attributeFilter: ['class'] });
  })();

  // Space and Shift+Space scroll a screen, like a normal page
  addEventListener('keydown', function (e) {
    if (e.code !== 'Space' || e.defaultPrevented) return;
    var t = e.target, tag = t && t.tagName;
    if (/INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY|A/.test(tag) || (t && t.isContentEditable)) return;
    var L = window.__tcLenis; if (!L) return;
    e.preventDefault(); L.scrollTo(scrollY + (e.shiftKey ? -1 : 1) * innerHeight * .85, { duration: .9 });
  });

  // quote form: sends straight to Trimcraft's inbox, with any files attached
  (function () {
    var f = document.querySelector('.tc-form'); if (!f) return;
    var msg = f.querySelector('.tc-form-msg'), btn = f.querySelector('button[type=submit]');
    var fileIn = f.querySelector('input[type=file]'), list = f.querySelector('.ct-files'), drop = f.querySelector('.ct-drop'), files = [];
    var MAX = 5, MAXB = 10 * 1024 * 1024;
    function human(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
    function draw() {
      if (!list) return; list.innerHTML = '';
      files.forEach(function (x, i) {
        var s = document.createElement('span'); s.innerHTML = '<span></span><b></b><button type="button" aria-label="Remove">×</button>';
        s.firstChild.textContent = x.name; s.children[1].textContent = human(x.size);
        s.lastChild.addEventListener('click', function () { files.splice(i, 1); draw(); });
        list.appendChild(s);
      });
    }
    function add(fl) {
      var rej = [];
      Array.prototype.forEach.call(fl, function (x) {
        if (files.length >= MAX) { rej.push(x.name + ' (limit is ' + MAX + ' files)'); return; }
        if (x.size > MAXB) { rej.push(x.name + ' (over 10 MB)'); return; }
        if (!/\.(pdf|ai|jpe?g|png)$/i.test(x.name)) { rej.push(x.name + ' (PDF, AI, JPG or PNG only)'); return; }
        files.push(x);
      });
      draw();
      if (rej.length) { msg.className = 'tc-form-msg err'; msg.textContent = 'Not added: ' + rej.join(', '); } else if (msg.className.indexOf('err') > -1) { msg.className = 'tc-form-msg'; msg.textContent = ''; }
    }
    if (fileIn) {
      fileIn.addEventListener('change', function () { add(fileIn.files); fileIn.value = ''; });
      ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
      drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files); });
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f._honey && f._honey.value) return;
      if (!f.checkValidity()) { msg.className = 'tc-form-msg err'; msg.textContent = 'Please add your name, company and a valid email.'; var bad = f.querySelector(':invalid'); bad && bad.focus(); return; }
      var d = new FormData(f), fd = new FormData();
      var who = d.get('c') || d.get('n');
      fd.append('_subject', 'Quote request: ' + who); fd.append('_template', 'table'); fd.append('_captcha', 'false'); fd.append('_replyto', d.get('e'));
      fd.append('Name', d.get('n')); fd.append('Company', d.get('c')); fd.append('Email', d.get('e'));
      if (d.get('p')) fd.append('Phone or WhatsApp', d.get('p'));
      if (d.get('co')) fd.append('Country', d.get('co'));
      if (d.get('pr')) fd.append('Product', d.get('pr'));
      if (d.get('q')) fd.append('Quantity', d.get('q'));
      if (d.get('m')) fd.append('Details', d.get('m'));
      files.forEach(function (x) { fd.append('attachment', x, x.name); });
      btn.disabled = true; msg.className = 'tc-form-msg'; msg.textContent = files.length ? 'Sending with ' + files.length + ' file' + (files.length > 1 ? 's' : '') + '…' : 'Sending…';
      fetch('https://formsubmit.co/ajax/info@trimcraft.com.pk', { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw 0; }); })
        .then(function () { msg.className = 'tc-form-msg ok'; msg.textContent = 'Thank you. Your request is with our team and we will reply within one working day.'; f.reset(); files = []; draw(); })
        .catch(function () { msg.className = 'tc-form-msg err'; msg.innerHTML = 'That did not send. Please email <a href="mailto:info@trimcraft.com.pk">info@trimcraft.com.pk</a> or WhatsApp us.'; })
        .then(function () { btn.disabled = false; });
    });
  })();

  // footer sits beneath the page and is revealed as the last section scrolls away
  (function () {
    var w = document.querySelector('.tc-footwrap'), ft = w && w.querySelector('.foot'); if (!w || !ft) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function fit() { var h = ft.offsetHeight; if (h) w.style.setProperty('--fh', h + 'px'); }
    fit(); addEventListener('resize', fit); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(ft);
  })();

  // logo and back-to-top both return to the very top
  function toTop(e) {
    if (e) { e.preventDefault(); e.stopImmediatePropagation(); }
    window.__tcJ = performance.now() + 2000;
    if (scrollY < innerHeight * .5) { var L0 = window.__tcLenis; L0 ? L0.scrollTo(0, { duration: .8 }) : window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    var v = document.createElement('div'); v.className = 'tc-veil'; (document.querySelector(".tc3d-root")||document.body).appendChild(v);
    requestAnimationFrame(function () { v.classList.add('on'); });
    setTimeout(function () {
      var L = window.__tcLenis;
      if (L) L.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
      setTimeout(function () { v.classList.remove('on'); setTimeout(function () { v.remove(); }, 600); }, 350);
    }, 420);
  }
  var home = document.querySelector('header a[href="#top"]');
  if (home) home.addEventListener('click', toTop, true);
  var up = document.createElement('button');
  up.className = 'tc-top'; up.type = 'button'; up.setAttribute('aria-label', 'Back to top');
  up.innerHTML = '<span class="fb-c"></span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4"/></svg>';
  up.addEventListener('click', toTop);
  (document.querySelector(".tc3d-root")||document.body).appendChild(up);
  var upOn = false, scd = null;
  function upCheck() {
    var sc = scrollY > innerHeight * .08; if (sc !== scd) { scd = sc; document.body.classList.toggle('tc-scrolled', sc); }
    var max = document.documentElement.scrollHeight - innerHeight;
    var on = max > 0 && scrollY / max > .55;
    if (on !== upOn) { upOn = on; up.classList.toggle('on', on); }
  }
  addEventListener('scroll', function () { requestAnimationFrame(upCheck); }, { passive: true });
  upCheck();
  // footer: a clear way back up at the very end
  (function () {
    var bt = document.querySelector('.foot .bottom'); if (!bt) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tc-foot-top';
    b.innerHTML = 'Back to top <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4"/></svg>';
    b.addEventListener('click', toTop); bt.appendChild(b);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { document.body.classList.toggle('tc-atfoot', es[0].isIntersecting); }).observe(b);
  })();

  // section rail (desktop) and section sheet (tap the section label, any screen)
  (function () {
    var story = document.getElementById('story'); if (!story) return;
    var S = [
      { t: 'Home', ee: 0 }, { t: 'About', ee: .18 }, { t: 'Products', prod: 1 }, { t: 'Sustainability', ee: .53 }, { t: 'Standards', ee: .625 },
      { t: 'Our work', ee: .76 }, { t: 'Numbers', ee: .93 }, { t: 'Quality', sel: '#quality' }, { t: 'FAQ', sel: '#faq' }, { t: 'Contact', sel: '#contact' }
    ];
    function go(it) {
      var L = window.__tcLenis, P = window.__tcProd;
      if (it.prod && P) { P.toIndex(0); return; }
      var y;
      if (it.sel) { var el = document.querySelector(it.sel); if (!el) return; y = el.getBoundingClientRect().top + scrollY; }
      else if (P && P.Y) y = it.ee === 0 ? 0 : P.Y(it.ee);
      else { window.__tcGo && window.__tcGo(it.ee); return; }
      var d = Math.abs(y - scrollY) / innerHeight, dur = Math.min(2, .8 + d * .09);
      window.__tcJ = performance.now() + dur * 1000 + 500;
      if (L) L.scrollTo(y, { duration: dur, force: true }); else scrollTo({ top: y, behavior: 'smooth' });
    }
    function active() {
      var past = story.getBoundingClientRect().bottom < innerHeight * .5;
      if (!past) {
        var e = window.__tcEe || 0;
        return e < .12 ? 0 : e < .32 ? 1 : e < .49 ? 2 : e < .715 ? 3 : e < .87 ? 4 : 5;
      }
      var k = 6;
      ['#quality', '#faq', '#contact'].forEach(function (q, i) { var el = document.querySelector(q); if (el && el.getBoundingClientRect().top < innerHeight * .5) k = 6 + i; });
      var why = document.querySelector('#why'); if (k === 6 && why && why.getBoundingClientRect().top < innerHeight * .5) k = 6;
      return k;
    }
    var rail = document.createElement('nav'); rail.className = 'tc-rail'; rail.setAttribute('aria-label', 'Sections');
    S.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', it.t);
      b.innerHTML = '<span class="lb">' + it.t + '</span><i></i>';
      b.addEventListener('click', function () { go(it); });
      rail.appendChild(b);
    });
    (document.querySelector(".tc3d-root")||document.body).appendChild(rail);
    var btns = rail.querySelectorAll('button'), cur = -1, tone = '';
    function paperAt() {
      if (story.getBoundingClientRect().bottom > innerHeight * .5) return document.body.classList.contains('on-paper');
      var hd = document.querySelector('header'); return !!(hd && hd.classList.contains('tc-solid-paper'));
    }
    function upd() {
      var k = active();
      if (k !== cur) { if (cur >= 0) { btns[cur].classList.remove('on'); btns[cur].removeAttribute('aria-current'); } btns[k].classList.add('on'); btns[k].setAttribute('aria-current', 'true'); cur = k; }
      var t = paperAt() ? 'paper' : 'dark'; if (t !== tone) { if (tone) rail.classList.remove(tone); rail.classList.add(t); tone = t; }
    }
    addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    setInterval(upd, 400); upd();

    // sheet
    var cnt = document.querySelector('.hud .counter');
    var sheet = document.createElement('div'); sheet.className = 'tc-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Go to section');
    sheet.innerHTML = '<div class="pn"><p>Go to</p></div>';
    var pn = sheet.firstChild;
    S.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<span>' + String(i + 1).padStart(2, '0') + '</span>' + it.t;
      b.addEventListener('click', function () { close(); setTimeout(function () { go(it); }, 120); });
      pn.appendChild(b);
    });
    (document.querySelector(".tc3d-root")||document.body).appendChild(sheet);
    function open() { sheet.classList.add('open'); var bs = pn.querySelectorAll('button'); bs.forEach(function (b, i) { b.classList.toggle('on', i === cur); }); setTimeout(function () { (bs[cur] || bs[0]).focus(); }, 60); }
    function close() { sheet.classList.remove('open'); }
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) close(); });
    if (cnt) {
      cnt.setAttribute('role', 'button'); cnt.tabIndex = 0; cnt.setAttribute('aria-label', 'Go to section');
      cnt.addEventListener('click', open);
      cnt.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    }
  })();

  // work section: a frosted edge on the copper card, so boxes blur away as they slide under it
  (function () {
    var pnl = document.querySelector('.blk.panel.copper'); if (!pnl || window.TC_MOBILE) return;
    var bz = document.createElement('div'); bz.className = 'tc-blurz'; bz.setAttribute('aria-hidden', 'true');
    pnl.parentNode.insertBefore(bz, pnl);
    function place() {
      var r = pnl.getBoundingClientRect(); if (!r.width) return;
      window.__tcPR = r.right;
      bz.style.left = (r.right - 70) + 'px';
    }
    var on = false;
    function tick() {
      var e = window.__tcEe || 0, o = e > .738 && e < .852;
      if (o !== on) { on = o; place(); bz.classList.toggle('on', o); }
    }
    addEventListener('resize', place); place();
    setInterval(tick, 120);
  })();

  // live background: a soft light follows the cursor and the golden line brightens when it comes near
  (function () {
    var bg = document.querySelector('.tc-bg'); if (!bg || !matchMedia('(pointer:fine)').matches) return;
    var tx = innerWidth * .5, ty = innerHeight * .4, x = tx, y = ty, r = 0, rt = 0, run = 0;
    addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var dy = (e.clientY / innerHeight) - .72, dx = (e.clientX / innerWidth) - .38;
      rt = Math.max(0, 1 - Math.sqrt(dx * dx * 1.2 + dy * dy * 5) * 1.8);
      if (!run) { run = 1; requestAnimationFrame(step); }
    }, { passive: true });
    function step() {
      x += (tx - x) * .07; y += (ty - y) * .07; r += (rt - r) * .06;
      bg.style.setProperty('--bx', x.toFixed(1) + 'px'); bg.style.setProperty('--by', y.toFixed(1) + 'px'); bg.style.setProperty('--react', r.toFixed(3));
      if (Math.abs(tx - x) + Math.abs(ty - y) > .5 || Math.abs(rt - r) > .005) requestAnimationFrame(step); else run = 0;
    }
  })();

  // scrollbar that only shows near the right edge
  var sb = document.createElement('div'); sb.className = 'tc-sb'; sb.setAttribute('aria-hidden', 'true');
  var th = document.createElement('i'); sb.appendChild(th); (document.querySelector(".tc3d-root")||document.body).appendChild(sb);
  var hideT = 0, drag = null, fine = matchMedia('(pointer:fine)').matches;
  function metrics() {
    var ih = innerHeight, sh = document.documentElement.scrollHeight, h = Math.max(44, ih * ih / sh);
    return { ih: ih, sh: sh, h: h, max: sh - ih };
  }
  function paint() {
    var m = metrics();
    th.style.height = m.h + 'px';
    th.style.top = (m.max > 0 ? scrollY / m.max * (m.ih - m.h) : 0) + 'px';
    if (sky) { var p = m.max > 0 ? scrollY / m.max : 0; sky.style.setProperty('--hz', Math.max(0, 1 - p / 0.09).toFixed(3)); }
  }
  function show() { sb.classList.add('on'); clearTimeout(hideT); hideT = setTimeout(function () { if (!drag && !sb.matches(':hover')) sb.classList.remove('on'); }, 1100); }
  addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
  addEventListener('resize', paint);
  if (fine) addEventListener('mousemove', function (e) { if (e.clientX > innerWidth - 40) { paint(); show(); } }, { passive: true });
  sb.addEventListener('mouseleave', show);
  sb.addEventListener('pointerdown', function (e) {
    var m = metrics(), r = th.getBoundingClientRect();
    if (e.target !== th) window.scrollTo(0, (e.clientY - m.h / 2) / (m.ih - m.h) * m.max);
    drag = { y: e.clientY, s: e.target === th ? scrollY : (e.clientY - m.h / 2) / (m.ih - m.h) * m.max, k: m.max / (m.ih - m.h) };
    sb.classList.add('drag'); sb.setPointerCapture(e.pointerId); e.preventDefault();
  });
  sb.addEventListener('pointermove', function (e) { if (drag) window.__tcJ = performance.now() + 600; if (drag) window.scrollTo(0, drag.s + (e.clientY - drag.y) * drag.k); });
  sb.addEventListener('pointerup', function () { drag = null; sb.classList.remove('drag'); show(); });
  paint();
})();
/* header tone over the quality to FAQ sections is read from where those sections are on screen every frame,
   so a stale scroll trigger (page loaded mid-way, embedded in a frame, layout still settling) can never leave it on at the top */
(function () {
  var h = document.querySelector('header'), q = document.getElementById('quality'), f = document.getElementById('faq');
  if (!h || !q || !f) return;
  function tick() {
    var on = q.getBoundingClientRect().top <= 60 && f.getBoundingClientRect().bottom >= 60;
    if (h.classList.contains('glass') !== on) h.classList.toggle('glass', on);
  }
  addEventListener('scroll', function () { requestAnimationFrame(tick); }, { passive: true });
  addEventListener('resize', tick);
  tick();
})();
