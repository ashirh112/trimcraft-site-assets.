/* Phone only: "Boxes we make for global brands" as four large, still photos (two by two) with the brand and the
   product under each, and a button to every job on the Our work page. Nothing moves with the scroll, so each
   piece can be seen in full colour and detail; a tap opens it large. Desktop never loads this file. */
(function () {
  if (!window.TC_MOBILE) return;
  var D = document, W = window;
  var BRAND = { levis: "Levi's", polo: 'Polo Ralph Lauren', boss: 'BOSS', hugo: 'HUGO', puma: 'Puma', jack: 'Jack & Jones',
    head: 'HEAD', columbia: 'Columbia', hurley: 'Hurley', tommy: 'Tommy Hilfiger', bamigo: 'Bamigo' };
  var PICK = ['levis-rigid', 'polo-2', 'puma-bands', 'hugo-gift'];
  var A = 0.728, B = 0.86; // where the work part of the story starts and ends

  var css = D.createElement('style');
  css.textContent = [
    '#tc-work{position:fixed;z-index:400;left:16px;right:16px;top:92px;bottom:var(--wb,46vh);display:flex;flex-direction:column;',
    'justify-content:center;gap:12px;opacity:0;visibility:hidden;pointer-events:none;transform:translate3d(0,14px,0);',
    'transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1),visibility 0s .35s}',
    '#tc-work.on{opacity:1;visibility:visible;pointer-events:auto;transform:none;transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1),visibility 0s}',
    '#tc-work .grid{flex:0 1 auto;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:minmax(0,1fr);gap:10px;min-height:0;height:100%;max-height:calc(100% - 56px)}',
    '#tc-work button{display:flex;flex-direction:column;position:relative;width:100%;min-height:0;padding:0;border:0;margin:0;cursor:pointer;',
    'background:#fff;border-radius:12px 24px 12px 12px;overflow:hidden;box-shadow:0 14px 30px -16px rgba(0,0,0,.6);text-align:left;',
    '-webkit-tap-highlight-color:transparent;transition:transform .25s cubic-bezier(.16,1,.3,1)}',
    '#tc-work button:active{transform:scale(.97)}',
    '#tc-work button:focus-visible{outline:2px solid #e8a56c;outline-offset:2px}',
    '#tc-work img{display:block;flex:1 1 0;min-height:0;width:100%;height:0;object-fit:cover;padding:0;box-sizing:border-box;background:#fff;filter:none;opacity:1}',
    '#tc-work small{display:block;flex:none;padding:0 10px 9px;font:800 12px/1.2 Manrope,system-ui,sans-serif;color:#172B46;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#tc-work small i{display:block;font-style:normal;font-weight:700;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#B66A43;margin-bottom:2px}',
    '#tc-work a.all{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:999px;',
    'background:#fff;color:#172B46;font:800 14px/1 Manrope,system-ui,sans-serif;text-decoration:none}',
    
    '@media (prefers-reduced-motion:reduce){#tc-work,#tc-work.on{transition:none;transform:none}}'
  ].join('');
  D.head.appendChild(css);

  var root = D.createElement('div');
  root.id = 'tc-work';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Boxes we make for global brands');
  (D.querySelector('.tc3d-root') || D.body).appendChild(root);

  var built = false, on = false;

  function keyOf(src) { return ((src.split('/').pop() || '').split('.')[0] || '').toLowerCase(); }
  function brandOf(k) { return BRAND[k.split('-')[0]] || ''; }
  function small(src) { return src.replace(/lib\/([\w-]+)\.webp.*$/, 'w/assets_lib_$1-480.webp'); }

  function build(list) {
    built = true;
    var byKey = {};
    list.forEach(function (w) { byKey[keyOf(w.src)] = w; });
    var picks = PICK.map(function (k) { return byKey[k]; }).filter(Boolean);
    list.forEach(function (w) { if (picks.length < 6 && picks.indexOf(w) < 0) picks.push(w); });
    var grid = D.createElement('div');
    grid.className = 'grid';
    picks.slice(0, 4).forEach(function (w) {
      var k = keyOf(w.src), b = brandOf(k), btn = D.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', (b ? b + ' ' : '') + w.name + ', see it large');
      var img = D.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.src = small(w.src);
      img.onerror = function () { img.onerror = null; img.src = w.src; };
      var cap = D.createElement('small');
      cap.innerHTML = '<i></i>';
      cap.firstChild.textContent = b || 'Made by Trimcraft';
      cap.appendChild(D.createTextNode(w.name));
      btn.appendChild(img);
      btn.appendChild(cap);
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (W.__tcBox) W.__tcBox(w.src, b || w.name, b ? w.name : 'Made by Trimcraft', (b ? b + ' ' : '') + w.name.toLowerCase());
      });
      grid.appendChild(btn);
    });
    var all = D.createElement('a');
    all.className = 'all';
    all.href = '/our-work';
    all.textContent = 'See all our work →';
    root.appendChild(grid);
    root.appendChild(all);
    measure();
  }

  // the photos sit between the header and the "Boxes we make" panel
  function measure() {
    var p = D.querySelector('.blk.panel.copper');
    var ph = p ? p.offsetHeight : 0;
    root.style.setProperty('--wb', (ph ? ph + 86 + 16 : Math.round(innerHeight * 0.4)) + 'px');
  }

  function tick() {
    if (W.__tcDead) { root.classList.remove('on'); return; }
    var list = W.__tcWork || [], ee = W.__tcEe || 0;
    if (!built && list.length && ee > A - 0.12) build(list);
    var show = built && ee >= A && ee <= B;
    if (show !== on) { on = show; root.classList.toggle('on', on); if (on) measure(); }
    requestAnimationFrame(tick);
  }
  W.addEventListener('resize', function () { if (built) measure(); });
  requestAnimationFrame(tick);
})();
