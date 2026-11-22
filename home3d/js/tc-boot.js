/* Phone and tablet boot: smaller textures, a loader that cannot trap taps,
   and a still page when WebGL never starts or the context is lost.
   Desktop pauses the same loop once nothing is moving it. */
(function () {
  var phone = !!(window.TC_MOBILE || (window.innerWidth || 1200) < 768);
  var small = !!(window.TC_SMALL_TEX || phone);
  var desk = !small && !phone && (window.innerWidth || 0) >= 1200;

  var HAS960 = { "bamigo-mailer": 1, barcode: 1, "boss-gift": 1, "boss-rigid": 1, "corr-gift": 1, "grinch-slider": 1, "head-bands": 1, "hugo-gift": 1, "hurley-gift": 1, labels: 1, "levis-bands": 1, "levis-cascade": 1, "levis-rigid": 1, "levis-slider": 1, "polo-2": 1, "polo-3": 1, "puma-bands": 1, "slider-box": 1, stickers: 1, "tags-board": 1, tissue: 1, "tommy-tags": 1 };

  function isPhone() { return !!(window.TC_MOBILE || (window.innerWidth || 1200) < 768); }

  function rewrite(url) {
    if ((!small && !desk) || typeof url !== "string" || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) return url;
    var hash = "", q = "", s = url, h = s.indexOf("#");
    if (h >= 0) { hash = s.slice(h); s = s.slice(0, h); }
    var qi = s.indexOf("?");
    if (qi >= 0) { q = s.slice(qi); s = s.slice(0, qi); }
    var lib = s.match(/(?:^|\/)lib\/([^/]+)\.webp$/);
    if (desk) {
      if (lib && HAS960[lib[1]]) return s.replace(/lib\/[^/]+\.webp$/, "w/assets_lib_" + lib[1] + "-960.webp") + q + hash;
      return url;
    }
    var t = isPhone() ? "480" : "960";
    if (lib) {
      var name = lib[1];
      /* Work cards are large on a phone, so keep about 960px. Full size when no 960 exists. */
      if (!HAS960[name]) return url;
      return s.replace(/lib\/[^/]+\.webp$/, "w/assets_lib_" + name + "-960.webp") + q + hash;
    }
    /* Hero machine frames stay at 960 on phones and tablets. */
    if (/\/w\/arc-[a-z0-9-]+-1600\.webp$/.test(s) || /(?:^|\/)w\/arc-[a-z0-9-]+-1600\.webp$/.test(s))
      return s.replace("-1600.webp", "-960.webp") + q + hash;
    if (/img\/sust\/(?:solar-roof|bales)-1600\.webp$/.test(s))
      return s.replace("-1600.webp", "-" + t + ".webp") + q + hash;
    if (t === "480" && /img\/sust\/card-[a-z0-9-]+-960\.webp$/.test(s))
      return s.replace("-960.webp", "-480.webp") + q + hash;
    return url;
  }

  if (small || desk) {
    var proto = HTMLImageElement.prototype;
    var desc = Object.getOwnPropertyDescriptor(proto, "src");
    if (desc && desc.set && desc.get) {
      Object.defineProperty(proto, "src", {
        configurable: true,
        enumerable: desc.enumerable,
        get: function () { return desc.get.call(this); },
        set: function (v) { desc.set.call(this, rewrite(v)); }
      });
    }
    var setAttr = proto.setAttribute;
    proto.setAttribute = function (n, v) {
      if (typeof n === "string" && n.toLowerCase() === "src") v = rewrite(v);
      return setAttr.call(this, n, v);
    };
  }

  function reveal(failed) {
    if (failed) document.documentElement.classList.add("no-webgl");
    var loader = document.querySelector(".loader");
    if (loader) loader.remove();
    document.body.classList.add("ready");
    window.__tcHold = !!failed;
  }
  window.__tcReveal = reveal;

  var gl = document.getElementById("gl");
  if (gl) {
    gl.addEventListener("webglcontextlost", function (e) {
      e.preventDefault();
      window.__tcDead = true;
      window.__tcHold = true;
      window.__tcBootQ = [];
      var card = document.getElementById("tc-work");
      if (card) card.hidden = true;
      reveal(true);
    }, false);
  }

  /* Phones: one WebGL context, textures no wider than 1024, and later
     sections' photos wait until the story reaches them. */
  if (isPhone()) {
    window.__tcGpu = { contexts: 0, bytes: 0 };
    var MAX = 1024;
    var scaled = new WeakMap();
    function potDown(n, cap) {
      var p = 1;
      while (p * 2 <= n && p * 2 <= cap) p *= 2;
      return p;
    }
    function fitSize(w, h) {
      var long = Math.max(w, h);
      var side = potDown(long, MAX);
      var s = side / long;
      return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
    }
    function scaleTo(src) {
      if (!src || scaled.has(src)) return scaled.get(src) || src;
      var w = src.width || src.videoWidth || 0, h = src.height || src.videoHeight || 0;
      if (!w || !h || Math.max(w, h) <= MAX) { scaled.set(src, src); return src; }
      var d = fitSize(w, h);
      var c = document.createElement("canvas");
      c.width = d.w; c.height = d.h;
      var g = c.getContext("2d");
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(src, 0, 0, d.w, d.h);
      scaled.set(src, c);
      return c;
    }
    window.__tcFit = function (img) { return scaleTo(img); };
    var origGet = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      var glc = origGet.apply(this, arguments);
      if (!glc || !/webgl/i.test(String(type)) || this.__tcCap) return glc;
      this.__tcCap = 1;
      window.__tcGpu.contexts++;
      var caps = new WeakMap();
      function drawing(w, h) {
        var cw = glc.drawingBufferWidth || 0, ch = glc.drawingBufferHeight || 0;
        return (w === cw && h === ch) || (w === ch && h === cw);
      }
      function need(w, h) { return w > 8 && h > 8 && Math.max(w, h) > MAX && !drawing(w, h); }
      var store = glc.texStorage2D.bind(glc);
      glc.texStorage2D = function (target, levels, internalFormat, width, height) {
        if (need(width, height)) {
          var d = fitSize(width, height);
          var tex = glc.getParameter(glc.TEXTURE_BINDING_2D);
          if (tex) caps.set(tex, d);
          var lv = Math.max(1, Math.floor(Math.log2(Math.max(d.w, d.h))) + 1);
          window.__tcGpu.bytes += d.w * d.h * 4;
          return store(target, Math.min(levels, lv), internalFormat, d.w, d.h);
        }
        if (width > 0 && height > 0) window.__tcGpu.bytes += width * height * 4;
        return store(target, levels, internalFormat, width, height);
      };
      var image2d = glc.texImage2D.bind(glc);
      glc.texImage2D = function () {
        var a = arguments;
        if (a.length === 6 && a[5] && (a[5].width || a[5].videoWidth) && need(a[5].width || a[5].videoWidth, a[5].height || a[5].videoHeight)) {
          var c = scaleTo(a[5]);
          window.__tcGpu.bytes += c.width * c.height * 4;
          return image2d(a[0], a[1], a[2], a[3], a[4], c);
        }
        return image2d.apply(glc, a);
      };
      var sub2d = glc.texSubImage2D.bind(glc);
      glc.texSubImage2D = function () {
        var a = arguments;
        if (a.length === 7 && a[1] === 0 && a[6] && (a[6].width || a[6].videoWidth)) {
          var tex = glc.getParameter(glc.TEXTURE_BINDING_2D);
          var d = tex && caps.get(tex);
          if (d) {
            var c = scaleTo(a[6]);
            return sub2d(a[0], 0, 0, 0, a[4], a[5], c);
          }
        }
        return sub2d.apply(glc, a);
      };
      return glc;
    };
    window.__tcDrain = function (n) {
      if (window.__tcDead) return;
      var q = window.__tcBootQ;
      if (!q || !q.length) return;
      var take = q.splice(0, n);
      take.forEach(function (f, i) { setTimeout(f, 40 + i * 50); });
    };
    var sent = { a: 0, b: 0, c: 0 };
    addEventListener("scroll", function () {
      var ee = window.__tcEe || 0;
      if (ee > 0.2 && !sent.a) { sent.a = 1; window.__tcDrain(6); }
      if (ee > 0.45 && !sent.b) { sent.b = 1; window.__tcDrain(6); }
      if (ee > 0.68 && !sent.c) { sent.c = 1; window.__tcDrain(99); }
    }, { passive: true });
  }

  /* Desktop textures stay at most 2048 on the long side. Work-card canvases
     are already under that, so this only catches the oversized label plates. */
  if (desk) {
    (function () {
      var MAX = 2048;
      var scaled = new WeakMap();
      function potDown(n) {
        var p = 1;
        while (p * 2 <= n && p * 2 <= MAX) p *= 2;
        return p;
      }
      function fitSize(w, h) {
        var long = Math.max(w, h);
        var side = potDown(long);
        var s = side / long;
        return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
      }
      function scaleTo(src) {
        if (!src || scaled.has(src)) return scaled.get(src) || src;
        var w = src.width || src.videoWidth || 0, h = src.height || src.videoHeight || 0;
        if (!w || !h || Math.max(w, h) <= MAX) { scaled.set(src, src); return src; }
        var d = fitSize(w, h);
        var c = document.createElement("canvas");
        c.width = d.w; c.height = d.h;
        var g = c.getContext("2d");
        g.imageSmoothingEnabled = true;
        g.imageSmoothingQuality = "high";
        g.drawImage(src, 0, 0, d.w, d.h);
        scaled.set(src, c);
        return c;
      }
      window.__tcGpu = window.__tcGpu || { contexts: 0, bytes: 0 };
      var origGet = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type) {
        var glc = origGet.apply(this, arguments);
        if (!glc || !/webgl/i.test(String(type)) || this.__tcCap) return glc;
        this.__tcCap = 1;
        window.__tcGpu.contexts++;
        var caps = new WeakMap();
        function drawing(w, h) {
          var cw = glc.drawingBufferWidth || 0, ch = glc.drawingBufferHeight || 0;
          return (w === cw && h === ch) || (w === ch && h === cw);
        }
        function need(w, h) { return w > 8 && h > 8 && Math.max(w, h) > MAX && !drawing(w, h); }
        if (glc.texStorage2D) {
          var store = glc.texStorage2D.bind(glc);
          glc.texStorage2D = function (target, levels, internalFormat, width, height) {
            if (need(width, height)) {
              var d = fitSize(width, height);
              var tex = glc.getParameter(glc.TEXTURE_BINDING_2D);
              if (tex) caps.set(tex, d);
              var lv = Math.max(1, Math.floor(Math.log2(Math.max(d.w, d.h))) + 1);
              window.__tcGpu.bytes += d.w * d.h * 4;
              return store(target, Math.min(levels, lv), internalFormat, d.w, d.h);
            }
            if (width > 0 && height > 0) window.__tcGpu.bytes += width * height * 4;
            return store(target, levels, internalFormat, width, height);
          };
        }
        var image2d = glc.texImage2D.bind(glc);
        glc.texImage2D = function () {
          var a = arguments;
          if (a.length === 6 && a[5] && (a[5].width || a[5].videoWidth) && need(a[5].width || a[5].videoWidth, a[5].height || a[5].videoHeight)) {
            var c = scaleTo(a[5]);
            window.__tcGpu.bytes += c.width * c.height * 4;
            return image2d(a[0], a[1], a[2], a[3], a[4], c);
          }
          return image2d.apply(glc, a);
        };
        var sub2d = glc.texSubImage2D.bind(glc);
        glc.texSubImage2D = function () {
          var a = arguments;
          if (a.length === 7 && a[1] === 0 && a[6] && (a[6].width || a[6].videoWidth)) {
            var tex = glc.getParameter(glc.TEXTURE_BINDING_2D);
            var d = tex && caps.get(tex);
            if (d) return sub2d(a[0], 0, 0, 0, a[4], a[5], scaleTo(a[6]));
          }
          return sub2d.apply(glc, a);
        };
        return glc;
      };
    })();
  }

  /* Menu button on the desktop home below 1024px. The phone home uses the same control. */
  function bindMenu() {
    var btn = document.querySelector(".tc-mb");
    var sheet = document.querySelector(".tc-pg");
    if (!btn || !sheet || btn.dataset.tcMenu) return;
    btn.dataset.tcMenu = "1";
    var x = sheet.querySelector(".tc-pgx");
    function setOpen(o) {
      sheet.classList.toggle("open", o);
      sheet.setAttribute("aria-hidden", o ? "false" : "true");
      btn.setAttribute("aria-expanded", o ? "true" : "false");
      document.documentElement.style.overflow = o ? "hidden" : "";
      if (o && x) x.focus(); else btn.focus();
    }
    btn.addEventListener("click", function () { setOpen(true); });
    if (x) x.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("open")) setOpen(false);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindMenu);
  else bindMenu();

  /* Stop drawing about a second after input stops. A running intro
     timeline keeps the loop alive. A hidden tab or an off-screen canvas
     stops it immediately. */
  if (window.TC_IDLE) {
    var idleTimer = 0, held = false, canvasOn = true, canvasSeen = false;
    function moving() {
      var tl = window.__tcTL;
      return !!(tl && tl.isActive && tl.isActive());
    }
    function pause() {
      held = true;
      window.__tcHold = true;
      clearTimeout(idleTimer);
    }
    function kick() {
      clearTimeout(idleTimer);
      if (document.hidden || !canvasOn) { pause(); return; }
      if (held) {
        held = false;
        window.__tcHold = false;
        if (typeof window.__tcLoop === "function") window.__tcLoop();
        if (typeof window.__tcArcKick === "function") window.__tcArcKick();
        if (typeof window.__tcSusKick === "function") window.__tcSusKick();
        if (typeof window.__tcShipKick === "function") window.__tcShipKick();
      }
      idleTimer = setTimeout(function () {
        if (document.hidden || !canvasOn) return;
        if (!document.body.classList.contains("ready")) { kick(); return; }
        if (document.documentElement.classList.contains("no-webgl")) return;
        if (moving()) { kick(); return; }
        pause();
      }, 1000);
    }
    addEventListener("scroll", kick, { passive: true });
    addEventListener("pointerdown", kick, { passive: true });
    addEventListener("pointermove", kick, { passive: true });
    addEventListener("touchstart", kick, { passive: true });
    addEventListener("keydown", kick);
    addEventListener("wheel", kick, { passive: true });
    addEventListener("resize", kick);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause();
      else kick();
    });
    var canvas = document.getElementById("gl");
    if (canvas && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var hit = entries.some(function (e) { return e.isIntersecting; });
        canvasSeen = canvasSeen || hit;
        canvasOn = hit || !canvasSeen;
        if (!canvasOn) pause();
        else kick();
      }).observe(canvas);
    }
    addEventListener("load", function () { setTimeout(kick, 2800); });
  }
})();
