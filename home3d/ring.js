/* Products: white hang tags on a wide arc, joined by liquid strings.
   The circle sits far off to the left (below, on phones), so only a sliver of it
   crosses the screen and one tag faces the viewer at a time. Scrolling turns it.
   Under the tags is one WebGL pass that draws the tags' silhouettes and the
   strings as a single field with a smooth minimum, so a string grows out of a
   tag edge, thins at its waist as the tags pull apart and parts on its own. */
(function () {
  'use strict';
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var inOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  var MAXC = 12;
  // all sizes are multiples of the tag width
  var SPACING = 1.42;   // centre to centre along the arc, in tag lengths along the arc
  var FUSE = 0.09;      // blend between neighbouring tags
  var STRAND = 0.19;    // string end thickness (half width), in tag widths
  var SNAP = 1.15;      // gaps wider than this, in tag lengths, have parted
  var WAIST = 0.33;
  var SAG = 0.02;
  var WELD = 0.05;
  var CURSOR_FUSE = 0.09, CURSOR_REACH = 0.7;
  var PULL = 0.032, SWELL = 0.04, REACH = 1.7, GRAB = 0.14, RELEASE = 0.06;
  var N_PUSH = 0.03, N_SCALE = 0.015, N_DIM = 0.06, N_REACH = 2.4;
  var WAVE = 0, WAVE_FREQ = 20, WAVE_SPEED = 7;
  var WOBBLE = 0;
  var ENTRY_MS = 2200;

  var VERT = '#version 300 es\nin vec2 aPos;out vec2 vUv;void main(){vUv=aPos;gl_Position=vec4(aPos*2.0-1.0,0.0,1.0);}';
  var FRAG = '#version 300 es\nprecision highp float;\n#define MAXC ' + MAXC + '\n' +
    'in vec2 vUv;out vec4 o;\n' +
    'uniform vec2 uRes;uniform float uCount;uniform vec2 uC[MAXC];uniform float uA[MAXC];\n' +
    'uniform vec4 uS[MAXC];\n' + // xy half size px, z brightness, w alpha
    'uniform vec2 uR;\n' +       // corner radius small, fold radius (px at scale 1 of each tag, scaled in xy)
    'uniform float uSN;uniform vec2 uSA[MAXC];uniform vec2 uSB[MAXC];uniform vec4 uSP[MAXC];\n' +
    'uniform float uFuse;uniform float uJit;uniform float uTime;uniform vec4 uCur;uniform vec4 uWake;\n' +
    'float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n' +
    'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y)*2.0-1.0;}\n' +
    // rounded box with its own radius per corner: r = (top-right, bottom-right, top-left, bottom-left), y up
    'float sdTag(vec2 p,vec2 b,vec4 r){r.xy=(p.x>0.0)?r.xy:r.zw;r.x=(p.y>0.0)?r.x:r.y;vec2 q=abs(p)-b+r.x;return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r.x;}\n' +
    'float sdStr(vec2 p,vec2 a,vec2 b,float rE,float rM,float sag){vec2 ba=b-a;float L=length(ba);if(L<0.001)return 1e6;vec2 d=ba/L,n=vec2(-d.y,d.x);vec2 q=p-(a+b)*0.5;float al=dot(q,d),ac=dot(q,n);float h=clamp(al/L+0.5,0.0,1.0);float bell=sin(3.14159265*h);ac+=sag*bell*n.y;float r=mix(rM,rE,pow(1.0-bell,1.7));return max(abs(al)-L*0.5,abs(ac)-r);}\n' +
    'float smin(float a,float b,float k){if(k<=0.0001)return min(a,b);float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}\n' +
    'void main(){vec2 p=(vUv-0.5)*uRes;float tc=length(p-uCur.xy);float k=uFuse;\n' +
    ' if(uCur.z>0.001){float t=1.0-smoothstep(0.0,max(uWake.x,1.0),tc);k+=uCur.w*uCur.z*t*t;}\n' +
    ' float d=1e6,d0=1e6,d1=1e6,b0=1.0,b1=1.0,a0=1.0,a1=1.0;\n' +
    ' for(int i=0;i<MAXC;i++){if(float(i)>=uCount)break;vec4 s=uS[i];if(s.w<=0.002)continue;vec2 q=p-uC[i];float cull=length(s.xy)+k+uJit+10.0;if(dot(q,q)>cull*cull)continue;\n' +
    '  float ca=cos(uA[i]),sa=sin(uA[i]);q=vec2(q.x*ca+q.y*sa,-q.x*sa+q.y*ca);\n' +
    '  float sc=s.x/max(uR.y,0.001);float rs=min(uR.x*sc,min(s.x,s.y));float rf=min(0.44*s.x,min(s.x,s.y));\n' +
    '  float di=sdTag(q,s.xy,vec4(rf,rs,rs,rs));d=smin(d,di,k);\n' +
    '  if(di<d0){d1=d0;b1=b0;a1=a0;d0=di;b0=s.z;a0=s.w;}else if(di<d1){d1=di;b1=s.z;a1=s.w;}}\n' +
    ' for(int i=0;i<MAXC;i++){if(float(i)>=uSN)break;vec4 sp=uSP[i];if(sp.x<=-3.0)continue;vec2 a=uSA[i],b=uSB[i];vec2 m=(a+b)*0.5;float sp2=length(b-a)*0.5+sp.x+sp.w+10.0;if(dot(p-m,p-m)>sp2*sp2)continue;d=smin(d,sdStr(p,a,b,sp.x,sp.y,sp.z),sp.w);}\n' +
    ' if(uJit>0.001)d+=vn(p*0.012+vec2(uTime*0.22,-uTime*0.17))*uJit;\n' +
    ' if(uWake.y>0.001)d+=sin(tc*uWake.z-uTime*uWake.w)*uWake.y*exp(-tc/max(uWake.x,1.0));\n' +
    ' float aa=clamp(fwidth(d),0.5,2.0);float al=1.0-smoothstep(-aa,aa,d);if(al<=0.001)discard;\n' +
    ' float nr=smoothstep(-12.0,12.0,d1-d0);float br=mix(b1,b0,nr);float op=max(a0,a1);\n' +
    ' o=vec4(vec3(br),al*op);}';

  function build(gl) {
    var pr = gl.createProgram();
    [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]].forEach(function (x) {
      var sh = gl.createShader(x[0]); gl.shaderSource(sh, x[1]); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(sh));
      gl.attachShader(pr, sh);
    });
    gl.bindAttribLocation(pr, 0, 'aPos'); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(pr)); return null; }
    return pr;
  }

  var S = null; // lazily built state
  function init(tags) {
    var ring = tags[0].parentNode;
    var cv = document.createElement('canvas');
    cv.className = 'pgoo'; cv.setAttribute('aria-hidden', 'true');
    ring.insertBefore(cv, ring.firstChild);
    var gl = null;
    var st = { ring: ring, cv: cv, gl: gl, prog: null, U: {}, n: tags.length, entry: 1, lastT: 0, eased: null, px: -1, py: -1, pspeed: 0, hovered: -1, clock: 0, dirty: true,
      leanX: new Float32Array(tags.length), leanY: new Float32Array(tags.length), swell: new Float32Array(tags.length), dim: new Float32Array(tags.length),
      reduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
    if (gl) {
      st.prog = build(gl);
      if (st.prog) {
        st.vao = gl.createVertexArray(); gl.bindVertexArray(st.vao);
        var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        ['uRes', 'uCount', 'uC', 'uA', 'uS', 'uR', 'uSN', 'uSA', 'uSB', 'uSP', 'uFuse', 'uJit', 'uTime', 'uCur', 'uWake'].forEach(function (k) { st.U[k] = gl.getUniformLocation(st.prog, k); });
      }
    }
    st.C = new Float32Array(MAXC * 2); st.A = new Float32Array(MAXC); st.SS = new Float32Array(MAXC * 4);
    st.SA = new Float32Array(MAXC * 2); st.SB = new Float32Array(MAXC * 2); st.SP = new Float32Array(MAXC * 4);
    addEventListener('resize', function () { st.dirty = true; });
    addEventListener('pointermove', function (e) {
      var nx = e.clientX, ny = e.clientY;
      st.pspeed = st.px < 0 ? 0 : Math.hypot(nx - st.px, ny - st.py);
      st.px = nx; st.py = ny;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { st.px = st.py = -1; });
    return st;
  }

  function measure(st, tags) {
    st.dirty = false;
    var rr = st.ring.getBoundingClientRect();
    st.rx = rr.left; st.ry = rr.top;
    var t = tags[0];
    st.ax = t.offsetLeft; st.ay = t.offsetTop; // anchor: the front tag's centre
    st.w = t.offsetWidth; st.h = t.offsetHeight;
  }

  function update(tags, c, mobile, now, fade) {
    if (!S) S = init(tags);
    var st = S;
    if (st.reduce) { // reduced motion: a plain grid, nothing moves
      if (!st.grid) { st.grid = 1; tags.forEach(function (el) { el.style.transform = ''; el.style.opacity = '1'; el.style.visibility = 'visible'; el.style.zIndex = ''; }); }
      return;
    }
    if (st.dirty || st.mob !== mobile) { measure(st, tags); st.mob = mobile; }
    var t = performance.now();
    var dt = st.lastT ? Math.min((t - st.lastT) / 1000, 0.05) : 0;
    // the section was off screen: replay the arrival, deck fused at the front
    if (!st.lastT || t - st.lastT > 400) st.eased = c;
    // the section was off screen: the deck waits fused at the front and spreads once it shows
    if (fade < 0.05 || !st.lastT || t - st.lastT > 2500) st.entry = st.reduce ? 1 : 0;
    else if (fade > 0.3) st.entry = Math.min(1, st.entry + Math.min(t - st.lastT, 250) / ENTRY_MS);
    st.lastT = t; st.clock += dt;
    var spread = inOut(st.entry);
    st.eased += (c - st.eased) * (1 - Math.pow(0.0008, dt));
    var lag = Math.abs(c - st.eased);

    var w = st.w, h = st.h, n = st.n;
    var along = mobile ? w : h;               // tag length along the arc
    var across = mobile ? h : w;              // ...and across it
    var R = mobile ? Math.max(innerWidth * 2.4, 900) : Math.max(innerWidth * 1.05, innerHeight * 1.6);
    var step = along * SPACING / R;

    // canvas covers a band around the arc, not the whole screen
    var cw, ch, cx0, cy0;
    if (mobile) { cw = innerWidth; ch = h * 2.2; cx0 = -st.rx; cy0 = st.ay - ch / 2; }
    else { cw = w * 3.4; ch = innerHeight; cx0 = st.ax - w * 2.2; cy0 = -st.ry; }
    var dpr = Math.min(devicePixelRatio || 1, 2);
    if (st.cw !== cw || st.ch !== ch) {
      st.cw = cw; st.ch = ch;
      st.cv.style.width = cw + 'px'; st.cv.style.height = ch + 'px';
      st.cv.width = Math.round(cw * dpr); st.cv.height = Math.round(ch * dpr);
    }
    st.cv.style.transform = 'translate3d(' + cx0.toFixed(1) + 'px,' + cy0.toFixed(1) + 'px,0)';

    // cursor, in ring coordinates
    var present = st.px >= 0 && !mobile ? 1 : 0;
    var mx = st.px - st.rx, my = st.py - st.ry;

    var at = st.at || (st.at = tags.map(function () { return { x: 0, y: 0, a: 0, s: 1 }; }));
    for (var i = 0; i < n; i++) {
      var sl = i - c, ang = sl * step * spread;
      at[i].a = ang;
      if (mobile) { at[i].x = st.ax + Math.sin(ang) * R; at[i].y = st.ay + (1 - Math.cos(ang)) * R; }
      else { at[i].x = st.ax - (1 - Math.cos(ang)) * R; at[i].y = st.ay + Math.sin(ang) * R; }
    }
    // hover: the tag under a slow cursor
    if (present && st.pspeed < 24) {
      st.hovered = -1; var best = 1e9;
      for (i = 0; i < n; i++) {
        var dx0 = Math.abs(mx - at[i].x), dy0 = Math.abs(my - at[i].y);
        if (dx0 > w / 2 || dy0 > h / 2) continue;
        if (dx0 + dy0 < best) { best = dx0 + dy0; st.hovered = i; }
      }
    } else if (!present) st.hovered = -1;
    st.pspeed *= 0.85;
    var hv = st.hovered;

    for (i = 0; i < n; i++) {
      var dx = mx - at[i].x, dy = my - at[i].y;
      var pull = present ? Math.max(0, 1 - Math.hypot(dx, dy) / (w * REACH)) : 0;
      var tx = dx * pull * pull * PULL * w * 0.02, ty = dy * pull * pull * PULL * w * 0.02;
      st.leanX[i] += (tx - st.leanX[i]) * (pull > 0 ? GRAB : RELEASE);
      st.leanY[i] += (ty - st.leanY[i]) * (pull > 0 ? GRAB : RELEASE);
      var push = 0, dimT = 0;
      if (hv >= 0 && i !== hv) {
        var off = Math.max(0, 1 - Math.abs(i - hv) / N_REACH);
        push = (i > hv ? 1 : -1) * off * N_PUSH * along;
        dimT = off * N_DIM;
      }
      st.dim[i] += (dimT - st.dim[i]) * (dimT > st.dim[i] ? GRAB : RELEASE);
      var sw = pull * pull * SWELL + (i === hv ? N_SCALE : 0) - (N_DIM ? dimT * (N_SCALE / N_DIM) : 0);
      st.swell[i] += (sw - st.swell[i]) * (sw > st.swell[i] ? GRAB : RELEASE);
      at[i].x += st.leanX[i] + (mobile ? push : 0);
      at[i].y += st.leanY[i] + (mobile ? 0 : push);
      at[i].s = (0.2 + 0.8 * spread) * (1 + st.swell[i]);
    }

    // place the tags
    var sideFade = mobile ? 1.15 : 0.62;
    for (i = 0; i < n; i++) {
      var ad = Math.abs(i - c);
      var op = 1 + (clamp(1.6 - ad * sideFade, 0, 1) - 1) * spread; // the whole deck shows while it is fused
      var bright = 1 - st.dim[i];
      at[i].op = op; at[i].b = bright;
      var el = tags[i], k = el.__k || (el.__k = {});
      var vis = op > 0.01 ? 'visible' : 'hidden', opS = op.toFixed(3), zS = String(100 - Math.round(ad * 10));
      var tr = 'translate3d(calc(-50% + ' + (at[i].x - st.ax).toFixed(1) + 'px),calc(-50% + ' + (at[i].y - st.ay).toFixed(1) + 'px),0) rotate(' + (at[i].a * 57.2958).toFixed(2) + 'deg) scale(' + at[i].s.toFixed(4) + ')';
      var fl = bright < 0.999 ? 'brightness(' + bright.toFixed(2) + ')' : '';
      if (k.v !== vis) el.style.visibility = k.v = vis;
      if (k.o !== opS) el.style.opacity = k.o = opS;
      if (k.z !== zS) el.style.zIndex = k.z = zS;
      if (k.t !== tr) el.style.transform = k.t = tr;
      if (k.f !== fl) { el.firstElementChild.style.filter = k.f = fl; if (!k.cleared) { el.firstElementChild.style.transform = ''; k.cleared = 1; } }
    }

    var gl = st.gl;
    if (st.cv.style.display !== 'none') st.cv.style.display = 'none';
    if (true) return;
    if (!gl || !st.prog) return;
    // strings: while the deck spreads, while the arc turns, and either side of the tag under the cursor
    var nS = 0, turning = clamp(lag * 2.4, 0, 1);
    for (i = 0; i < n - 1; i++) {
      var j = i + 1;
      var gap = Math.hypot(at[j].x - at[i].x, at[j].y - at[i].y);
      var opening = (gap - along * Math.max(at[i].s, at[j].s)) / (along * SNAP);
      if (opening > 1) continue;
      var strength = Math.max(1 - spread, turning * 0.85, (hv === i || hv === j) ? 1 : 0);
      strength *= Math.min(at[i].op, at[j].op);
      if (strength < 0.02) continue;
      var rE = across * Math.min(at[i].s, at[j].s) * STRAND * strength * (1 - clamp(opening, 0, 1));
      if (rE <= 0.5) continue;
      st.SA[nS * 2] = at[i].x - cx0 - cw / 2; st.SA[nS * 2 + 1] = -(at[i].y - cy0 - ch / 2);
      st.SB[nS * 2] = at[j].x - cx0 - cw / 2; st.SB[nS * 2 + 1] = -(at[j].y - cy0 - ch / 2);
      st.SP[nS * 4] = rE; st.SP[nS * 4 + 1] = rE * WAIST; st.SP[nS * 4 + 2] = SAG * across * clamp(opening, 0, 1); st.SP[nS * 4 + 3] = WELD * across;
      nS++;
    }
    var inset = 1.5;
    for (i = 0; i < n; i++) {
      st.C[i * 2] = at[i].x - cx0 - cw / 2; st.C[i * 2 + 1] = -(at[i].y - cy0 - ch / 2);
      st.A[i] = -at[i].a; // y is flipped in the field
      st.SS[i * 4] = Math.max(0, w / 2 * at[i].s - inset); st.SS[i * 4 + 1] = Math.max(0, h / 2 * at[i].s - inset);
      st.SS[i * 4 + 2] = at[i].b; st.SS[i * 4 + 3] = at[i].op;
    }

    var jit = st.reduce ? 0 : WOBBLE * w * clamp(lag * 2 + (1 - spread), 0, 1);
    var wake = st.reduce ? 0 : WAVE * w * clamp(st.pspeed / 40, 0, 1);
    var sig = nS + '|' + present + '|' + Math.round(mx) + ',' + Math.round(my) + '|' + spread.toFixed(4) + '|' + cw + 'x' + ch;
    for (i = 0; i < n * 4; i++) sig += ',' + Math.round(st.SS[i] * 10);
    for (i = 0; i < n * 2; i++) sig += ',' + Math.round(st.C[i] * 4);
    for (i = 0; i < nS * 4; i++) sig += ',' + Math.round(st.SP[i] * 10);
    if (jit < 0.01 && wake < 0.01 && sig === st.sig) return;
    st.sig = sig;
    gl.viewport(0, 0, st.cv.width, st.cv.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(st.prog); gl.bindVertexArray(st.vao);
    var U = st.U;
    gl.uniform2f(U.uRes, cw, ch);
    gl.uniform1f(U.uCount, n);
    gl.uniform2fv(U.uC, st.C); gl.uniform1fv(U.uA, st.A); gl.uniform4fv(U.uS, st.SS);
    gl.uniform2f(U.uR, 12, w / 2);
    gl.uniform1f(U.uSN, nS); gl.uniform2fv(U.uSA, st.SA); gl.uniform2fv(U.uSB, st.SB); gl.uniform4fv(U.uSP, st.SP);
    gl.uniform1f(U.uFuse, FUSE * w * (0.15 + 0.85 * clamp(spread / 0.35, 0, 1)) * (1 - 0.4 * spread));
    gl.uniform1f(U.uJit, jit);
    gl.uniform1f(U.uTime, st.clock);
    gl.uniform4f(U.uCur, mx - cx0 - cw / 2, -(my - cy0 - ch / 2), present, CURSOR_FUSE * w);
    gl.uniform4f(U.uWake, CURSOR_REACH * w, wake, WAVE_FREQ / w, WAVE_SPEED);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  window.TCRing = { update: update };
})();
/* frame-rate probe for embeds: the parent page asks, this frame answers */
addEventListener('message', function (e) {
  if (e.data && e.data.tcProbe === 2) {
    var nv = performance.getEntriesByType('navigation')[0] || {};
    var rs = performance.getEntriesByType('resource').map(function (r) { return [r.name.split('/').slice(3).join('/').slice(0, 50), Math.round(r.startTime), Math.round(r.responseEnd), Math.round(r.transferSize / 1024), Math.round(r.encodedBodySize / 1024)]; });
    e.source && e.source.postMessage({ tcTiming: { html: [Math.round(nv.requestStart), Math.round(nv.responseEnd)], dcl: Math.round(nv.domContentLoadedEventEnd), load: Math.round(nv.loadEventEnd), ready: window.__tcReadyAt || null, reveal: window.__tcRevealAt || null, paints: performance.getEntriesByType('paint').map(function (p) { return p.name + ':' + Math.round(p.startTime); }), res: rs } }, '*');
    return;
  }
  if (!e.data || e.data.tcProbe !== 1) return;
  var n = 0, t0 = performance.now(), ms = e.data.ms || 2000;
  (function f() { n++; if (performance.now() - t0 < ms) requestAnimationFrame(f); else e.source && e.source.postMessage({ tcFps: +(1000 * n / (performance.now() - t0)).toFixed(1), w: innerWidth, h: innerHeight, dpr: devicePixelRatio, cw: (document.getElementById('gl') || {}).width }, '*'); })();
});
/* startup profiler, only with ?tcprof in the address */
(function () {
  if (location.search.indexOf('tcprof') < 0) return;
  var P = window.__tcProf = { gl: {}, marks: [], t0: performance.now() };
  var G = WebGL2RenderingContext.prototype;
  ['compileShader', 'linkProgram', 'getProgramParameter', 'getShaderParameter', 'texImage2D', 'texSubImage2D', 'generateMipmap', 'drawElements', 'drawArrays', 'readPixels', 'getError', 'getProgramInfoLog', 'getShaderInfoLog', 'bufferData', 'texStorage2D'].forEach(function (k) {
    var f = G[k]; if (!f) return;
    G[k] = function () { var a = performance.now(); var r = f.apply(this, arguments); var d = performance.now() - a; var o = P.gl[k] || (P.gl[k] = [0, 0]); o[0]++; o[1] += d; return r; };
  });
  var C = CanvasRenderingContext2D.prototype, di = C.drawImage;
  C.drawImage = function () { var a = performance.now(); var r = di.apply(this, arguments); var o = P.gl['2d.drawImage'] || (P.gl['2d.drawImage'] = [0, 0]); o[0]++; o[1] += performance.now() - a; return r; };
  document.addEventListener('DOMContentLoaded', function () { P.dcl = performance.now(); });
  try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { P.marks.push([Math.round(e.startTime), Math.round(e.duration)]); }); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
})();
