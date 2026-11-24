/* Phone only: "Boxes we make for global brands" as a wall of every piece, three across, that moves with the scroll.
   Replaces the single card that changed photo every few pixels: all the work passes in the same scroll, a dozen
   pieces are on screen at once, and a tap opens the piece large with its brand. Desktop never loads this file. */
(function () {
  if (!window.TC_MOBILE) return;
  var D = document, W = window;
  var BRAND = { levis: "Levi's", polo: 'Polo Ralph Lauren', boss: 'BOSS', hugo: 'HUGO', puma: 'Puma', jack: 'Jack & Jones',
    head: 'HEAD', columbia: 'Columbia', hurley: 'Hurley', tommy: 'Tommy Hilfiger', bamigo: 'Bamigo' };
  var A = 0.728, B = 0.86; // where the work part of the story starts and ends

  var css = D.createElement('style');
  css.textContent = [
    '#tc-work{position:fixed;z-index:40;left:14px;right:14px;top:96px;bottom:var(--wb,46vh);overflow:hidden;opacity:0;visibility:hidden;',
    'transition:opacity .4s cubic-bezier(.16,1,.3,1),visibility 0s .4s;',
    '-webkit-mask:linear-gradient(transparent,#000 7%,#000 90%,transparent);mask:linear-gradient(transparent,#000 7%,#000 90%,transparent)}',
    '#tc-work.on{opacity:1;visibility:visible;transition:opacity .4s cubic-bezier(.16,1,.3,1),visibility 0s}',
    '#tc-work .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-items:start}',
    '#tc-work .col{display:flex;flex-direction:column;gap:10px;will-change:transform}',
    '#tc-work button{display:block;position:relative;width:100%;padding:0;border:0;margin:0;cursor:pointer;background:#f4f1ea;',
    'border-radius:10px 22px 10px 10px;overflow:hidden;box-shadow:0 12px 26px -14px rgba(0,0,0,.55);-webkit-tap-highlight-color:transparent;',
    'transition:transform .25s cubic-bezier(.16,1,.3,1)}',
    '#tc-work button:active{transform:scale(.96)}',
    '#tc-work button:focus-visible{outline:2px solid #e8a56c;outline-offset:2px}',
    '#tc-work img{display:block;width:100%;aspect-ratio:1/1;object-fit:contain;padding:6%;box-sizing:border-box;background:#f4f1ea}',
    '#tc-work small{display:block;padding:0 6px 7px;font:700 10px/1.2 Manrope,system-ui,sans-serif;letter-spacing:.02em;color:#5b6470;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}',
    '@media (prefers-reduced-motion:reduce){#tc-work,#tc-work.on{transition:none}}'
  ].join('');
  D.head.appendChild(css);

  var root = D.createElement('div');
  root.id = 'tc-work';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Boxes we make for global brands');
  (D.querySelector('.tc3d-root') || D.body).appendChild(root);

  var built = false, cols = [], travel = [0, 0, 0], start = [0, 0, 0], lastT = -1, on = false;

  function brandOf(src) {
    var f = (src.split('/').pop() || '').toLowerCase();
    var k = f.split(/[-.]/)[0];
    return BRAND[k] || '';
  }

  function build(list) {
    built = true;
    var wrap = D.createElement('div');
    wrap.className = 'cols';
    for (var c = 0; c < 3; c++) {
      var col = D.createElement('div');
      col.className = 'col';
      wrap.appendChild(col);
      cols.push(col);
    }
    list.forEach(function (w, i) {
      var b = brandOf(w.src), btn = D.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', (b ? b + ' ' : '') + w.name);
      var img = D.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.src = w.src;
      var cap = D.createElement('small');
      cap.textContent = b || w.name;
      btn.appendChild(img);
      btn.appendChild(cap);
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (W.__tcBox) W.__tcBox(w.src, b || w.name, b ? w.name : 'Made by Trimcraft', (b ? b + ' ' : '') + w.name.toLowerCase());
      });
      cols[i % 3].appendChild(btn);
    });
    root.appendChild(wrap);
    measure();
  }

  // the wall sits between the header and the "Boxes we make" panel; each column travels its full length over the part
  function measure() {
    var p = D.querySelector('.blk.panel.copper');
    var ph = p ? p.offsetHeight : 0;
    root.style.setProperty('--wb', (ph ? ph + 86 + 18 : Math.round(innerHeight * 0.4)) + 'px');
    var h = root.clientHeight || 1;
    cols.forEach(function (col, i) {
      var t = Math.max(0, col.scrollHeight - h);
      start[i] = i === 1 ? 46 : 0; // the middle column starts a little lower, so the rows are staggered
      travel[i] = t + start[i];
    });
    lastT = -1;
  }

  function tick() {
    if (W.__tcDead) { root.classList.remove('on'); return; }
    var list = W.__tcWork || [], ee = W.__tcEe || 0;
    if (!built && list.length && ee > A - 0.08) build(list);
    var show = built && ee >= A && ee <= B && typeof W.__tcWorkT === 'number';
    if (show !== on) { on = show; root.classList.toggle('on', on); if (on) measure(); }
    if (on) {
      var T = Math.min(1, Math.max(0, W.__tcWorkT));
      if (Math.abs(T - lastT) > 0.0005) {
        lastT = T;
        for (var i = 0; i < 3; i++) cols[i].style.transform = 'translate3d(0,' + (start[i] - T * travel[i]).toFixed(1) + 'px,0)';
      }
    }
    requestAnimationFrame(tick);
  }
  W.addEventListener('resize', function () { if (built) measure(); });
  requestAnimationFrame(tick);
})();
