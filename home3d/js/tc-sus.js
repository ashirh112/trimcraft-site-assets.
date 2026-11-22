/* Sustainability, then standards: a heading and a fan of photos per screen. The fan deals in from below, holds, then flies up and out. Scrubbed by the story progress. */
(function(){
'use strict';
if(document.getElementById('tc-sus'))return;
var A=document.documentElement.dataset.assets||'assets/';
var R=A+'../img/sust/';
var S0=.5,S1=.705;
var cl=function(v,a,b){return Math.min(b,Math.max(a,v))};
var sm=function(v,a,b){v=cl((v-a)/(b-a),0,1);return v*v*(3-2*v)};
var oc=function(v){return 1-Math.pow(1-v,3)};
var ic=function(v){return v*v*v};
var SC=[
  {cls:'ts-a',h:'Sustainability<br>you can see.',p:'70% solar energy and zero waste to landfill.',a:0,b:.34,
   img:['card-solar','card-bales']},
  {cls:'ts-b',h:'Built to<br>international standards.',p:'Fire safety, first aid and protective gear across the factory floor.',a:.5,b:.84,
   img:['card-fire','card-print','card-aid']}
];
var L=document.createElement('div');L.id='tc-sus';L.setAttribute('aria-hidden','true');
L.innerHTML=SC.map(function(s){
  return '<div class="ts-scene '+s.cls+'"><div class="ts-fan">'+s.img.map(function(m){
    return '<div class="ts-card"><img src="'+R+m+'-960.webp?v=3" alt="" draggable="false" decoding="async"></div>'}).join('')+
  '</div><div class="ts-head"><h2>'+s.h+'</h2><p>'+s.p+'</p></div></div>'}).join('');
(document.querySelector(".tc3d-root")||document.body).appendChild(L);
SC.forEach(function(s,i){var el=L.children[i];s.el=el;s.head=el.querySelector('.ts-head');s.cards=[].slice.call(el.querySelectorAll('.ts-card'))});

var W,H,cw,ch,cy,mob,spread;
function size(){
  W=innerWidth;H=innerHeight;mob=window.TC_MOBILE||W<760;
  ch=mob?Math.min(H*.34,W*.6):Math.min(H*.5,W*.3);cw=ch*.8;cy=mob?H*.6:H*.64;spread=mob?.56:.86;
  var gap=mob?10:Math.max(24,W*.022);
  SC.forEach(function(s){var n=s.cards.length;s.cw=Math.min(cw,(W*(mob?.94:.8)-(n-1)*gap)/n);s.ch=s.cw/.8;s.gap=gap;
    s.cards.forEach(function(c){c.style.width=s.cw.toFixed(1)+'px';c.style.height=s.ch.toFixed(1)+'px'})});
  last=-1;
}
var shown=false,last=-1,us=null;
size();addEventListener('resize',size);

function draw(u){
  SC.forEach(function(s){
    var n=s.cards.length,vis=u>s.a-.01&&u<s.b+.15;
    s.el.style.visibility=vis?'visible':'hidden';if(!vis)return;
    // heading
    var hi=sm(u,s.a+.01,s.a+.1),ho=sm(u,s.b,s.b+.09);
    s.head.style.opacity=(hi*(1-ho)).toFixed(3);
    s.head.style.transform='translate3d(-50%,'+((1-hi)*28-ic(ho)*H*.28).toFixed(1)+'px,0)';
    // cards
    s.cards.forEach(function(c,i){
      var k=i-(n-1)/2,j=i*.018;
      var pi=oc(cl((u-(s.a+j))/.13,0,1)),po=ic(cl((u-(s.b+.01+j))/.12,0,1));
      var cw=s.cw,ch=s.ch,dx=k*(cw+s.gap),ry=k*(n===2?10:12),rz=k*(n===2?3:2.5),dy=Math.abs(k)*.03*ch,sc=1;
      var x=W/2-cw/2+dx*(.25+.75*pi),y=cy-ch/2+dy+(1-pi)*H*.72-po*H*1.2;
      var r=rz*pi+k*7*po;
      c.style.zIndex=k?1:2;
      c.style.opacity=cl(pi*3,0,1).toFixed(3);
      c.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) rotateY('+(ry*pi).toFixed(2)+'deg) rotateZ('+r.toFixed(2)+'deg) scale('+(sc*(.9+.1*pi)).toFixed(4)+')';
    });
  });
}
function frame(){
  if (window.__tcHold) return;
  requestAnimationFrame(frame);
  var E=window.__tcEe;if(E===undefined)return;
  var on=E>S0-.006&&E<S1+.006;
  if(on!==shown){shown=on;L.style.display=on?'block':'none';if(!on)us=null}
  if(!on)return;
  var u=cl((E-S0)/(S1-S0),0,1);
  if(us===null)us=u;us+=(u-us)*.14;if(Math.abs(u-us)<.0002)us=u;
  if(us===last)return;last=us;draw(us);
}
window.__tcSusKick=function(){requestAnimationFrame(frame)};
requestAnimationFrame(frame);
})();
