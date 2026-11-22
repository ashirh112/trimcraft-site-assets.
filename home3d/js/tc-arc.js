/* Ahead on automation: the factory photos stream round the inside of a cylinder, driven by the scroll. */
(function(){
'use strict';
if(document.getElementById('tc-arc'))return;
var A=document.documentElement.dataset.assets||'assets/';
var IMG=['autocut','press-2c','lamination-2','screen-line','autodie','vacuum-frame','press','diecut-sheet'];
var E0=.245,E1=.302;                       // the stretch of the story this owns
var MOB=window.TC_MOBILE||innerWidth<760;
var NARROW=MOB||innerWidth<1200;
var SL=NARROW?8:16,ARC=NARROW?960:1600,CAM=2.3,ASPECT=3/2,GAP=.34;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var cl=function(v,a,b){return Math.min(b,Math.max(a,v))};
var sm=function(v,a,b){v=cl((v-a)/(b-a),0,1);return v*v*(3-2*v)};

var L=document.createElement('div');L.id='tc-arc';
L.innerHTML='<div class="ta-band"></div>';
(document.querySelector(".tc3d-root")||document.body).appendChild(L);
var band=L.querySelector('.ta-band');
var tiles=IMG.map(function(n,i){
  var t=document.createElement('div');t.className='ta-tile';
  var h='';for(var k=0;k<SL;k++)h+='<div class="ta-s"><img src="'+A+'w/arc-'+n+'-'+ARC+'.webp" alt="" draggable="false" decoding="async" loading="lazy"></div>';
  t.innerHTML=h;band.appendChild(t);return t;
});

var W,H,r,unit,pitch,limit,h,bend;
function size(){
  W=innerWidth;H=innerHeight;var mob=window.TC_MOBILE||W<760;
  bend=(mob?26:52)*Math.PI/180;
  h=Math.min(H*(mob?.26:.48),(W*(mob?.8:.5))/ASPECT);
  r=W*(CAM-1+Math.cos(bend))/(2*CAM*Math.sin(bend));
  unit=(h/r)*180/Math.PI;                 // degrees one tile-height spans
  pitch=(ASPECT+GAP)*unit;
  limit=bend*180/Math.PI+ASPECT*unit/2;    // past this a tile is off-screen
  var ax=mob?H*.58:H*.63;
  band.style.perspective=(r*CAM).toFixed(1)+'px';
  band.style.perspectiveOrigin='50% '+ax.toFixed(1)+'px';
  var rp=r.toFixed(2);
  tiles.forEach(function(t){
    t.style.width=(h*ASPECT).toFixed(1)+'px';t.style.height=h.toFixed(1)+'px';
    t.style.left=(W/2-h*ASPECT/2).toFixed(1)+'px';t.style.top=(ax-h/2).toFixed(1)+'px';
    var share=ASPECT/SL,sw=h*share,mk=window.TCShape&&TCShape.mask(h*ASPECT,h);
    for(var k=0;k<SL;k++){
      var s=t.children[k],img=s.firstChild;
      // the brand's card shape, cut across the slices: each slice shows its own strip of one mask
      if(mk){s.style.webkitMaskImage=s.style.maskImage=mk;s.style.webkitMaskSize=s.style.maskSize=(h*ASPECT).toFixed(2)+'px '+h.toFixed(2)+'px';
        s.style.webkitMaskPosition=s.style.maskPosition=(-k*sw).toFixed(2)+'px 0';s.style.webkitMaskRepeat=s.style.maskRepeat='no-repeat'}
      s.style.left=((ASPECT-share)/2*h).toFixed(2)+'px';s.style.width=(k===SL-1?sw:sw+1).toFixed(2)+'px';s.style.height=h.toFixed(1)+'px';
      s.style.transform='translateZ('+rp+'px) rotateY('+((ASPECT/2-(k+.5)*share)*unit).toFixed(4)+'deg) translateZ(-'+rp+'px)';
      img.style.left=(-k*sw).toFixed(2)+'px';img.style.width=(h*ASPECT).toFixed(1)+'px';img.style.height=h.toFixed(1)+'px';
    }
  });
  last=-1;
}
size();addEventListener('resize',size);

var shown=false,last=-1,us=null;
function frame(){
  if (window.__tcHold) return;
  requestAnimationFrame(frame);
  var E=window.__tcEe;if(E===undefined)return;
  var on=E>E0-.01&&E<E1+.01;
  if(on!==shown){shown=on;L.style.display=on?'block':'none';if(!on)us=null}
  if(!on)return;
  var u=cl((E-E0)/(E1-E0),0,1);
  if(reduce)u=.5;
  if(us===null)us=u;us+=(u-us)*.1;if(Math.abs(u-us)<.0002)us=u;   // the row glides after the scroll, never jumps
  if(us===last)return;last=us;u=us;
  // the row enters from the right with its first picture just off-screen and leaves to the left with its last
  var n=tiles.length,travel=2*limit+pitch*.2+pitch*(n-1),a0=-limit-pitch*.1+travel*u;
  var rp=r.toFixed(2);
  for(var i=0;i<n;i++){
    var a=a0-i*pitch,t=tiles[i];
    if(Math.abs(a)>limit+pitch*.5){t.style.visibility='hidden';continue}
    t.style.visibility='visible';
    var near=1-Math.min(1,Math.abs(a)/limit),sc=1+.16*Math.pow(near,1.6);   // biggest in the middle, and in front
    t.style.zIndex=Math.round(near*100);
    t.style.transform='translateZ('+rp+'px) rotateY('+a.toFixed(3)+'deg) translateZ(-'+rp+'px) scale('+sc.toFixed(4)+')';
  }
  L.style.opacity=sm(E,E0,E0+.012)*(1-sm(E,E1-.012,E1));
  last=us;
}
window.__tcArcKick=function(){requestAnimationFrame(frame)};
requestAnimationFrame(frame);
})();
