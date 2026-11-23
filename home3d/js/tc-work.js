/* Phone only. The work photos are HTML images, one at a time, instead of
   a WebGL texture per card. Desktop never loads this file. */
(function () {
  if (!window.TC_MOBILE) return;
  var css = document.createElement("style");
  css.textContent = [
    "#tc-work{position:fixed;z-index:40;left:50%;top:100px;width:min(84vw,360px);transform:translateX(-50%);pointer-events:none}",
    "#tc-work[hidden]{display:none!important}",
    "#tc-work figure{margin:0;background:#f4f1ea;border-radius:16px 42px 16px 16px;overflow:hidden;box-shadow:0 22px 44px -20px rgba(0,0,0,.45)}",
    "#tc-work img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:contain;background:#f4f1ea}",
    "#tc-work figcaption{padding:12px 16px 16px;border-top:1px solid rgba(23,43,70,.12)}",
    "#tc-work figcaption span{display:block;font:600 11px/1 Manrope,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d867c}",
    "#tc-work figcaption b{display:block;margin-top:6px;font:800 26px/1.05 Manrope,system-ui,sans-serif;color:#172b46}"
  ].join("");
  document.head.appendChild(css);

  var root = document.createElement("div");
  root.id = "tc-work";
  root.hidden = true;
  root.innerHTML = '<figure><img alt="" decoding="async"><figcaption><span>Category</span><b></b></figcaption></figure>';
  (document.querySelector(".tc3d-root")||document.body).appendChild(root);
  var img = root.querySelector("img");
  var name = root.querySelector("b");
  var shown = -1;
  var pre = new Image();

  function tick() {
    if (window.__tcDead) { root.hidden = true; return; }
    var list = window.__tcWork || [];
    var ee = window.__tcEe || 0;
    var on = list.length && ee >= 0.728 && ee <= 0.86 && typeof window.__tcWorkT === "number";
    root.hidden = !on;
    if (on) {
      var i = Math.round(window.__tcWorkT * (list.length - 1));
      if (i < 0) i = 0;
      if (i > list.length - 1) i = list.length - 1;
      if (i !== shown) {
        shown = i;
        img.alt = list[i].name;
        name.textContent = list[i].name;
        img.src = list[i].src;
        var nxt = list[i + 1];
        if (nxt) pre.src = nxt.src;
      }
    } else if (shown !== -1 && (ee < 0.7 || ee > 0.88)) {
      shown = -1;
      img.removeAttribute("src");
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
