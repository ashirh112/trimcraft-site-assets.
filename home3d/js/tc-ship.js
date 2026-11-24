/* Packed and shipped: the Trimcraft truck pulls in beside the carton, takes it, and drives off. Scrubbed by the story progress. */
(function(){
'use strict';
if(document.getElementById('tc-ship'))return;
var A=document.documentElement.dataset.assets||'assets/';
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('tc-nums');return}
var cl=function(v,a,b){return Math.min(b,Math.max(a,v))};
var sm=function(v,a,b){v=cl((v-a)/(b-a),0,1);return v*v*(3-2*v)};
var oc=function(v){return 1-Math.pow(1-v,3)};
var ic=function(v){return v*v*v};
var V=function(e,a,b){return cl((e-a)/(b-a),0,1)};

var L=document.createElement('div');L.id='tc-ship';
L.innerHTML='<div class="ts-dust"></div><div class="ts-truck"><img src="'+A+'img/truck.webp" alt=""></div>';
(document.querySelector(".tc3d-root")||document.body).appendChild(L);
var truck=L.querySelector('.ts-truck'),dust=L.querySelector('.ts-dust');
var W,H,TW,TH,mob;
function size(){W=innerWidth;H=innerHeight;mob=window.TC_MOBILE||W<760;TW=mob?W*.95:cl(W*.64,520,1180);TH=TW*.4767;truck.style.width=TW+'px'}
size();addEventListener('resize',size);

var shown=false,TX=null,TY=null,last=-1;
function frame(){
  if (window.__tcHold) return;
  requestAnimationFrame(frame);
  var E=window.__tcEe;if(E===undefined)return;
  document.body.classList.toggle('tc-nums',E>.968);
  var on=E>.9&&E<.975;
  if(on!==shown){shown=on;L.style.display=on?'block':'none';if(!on){TX=null;window.__tcTruckRear=undefined}}
  if(!on)return;
  if(E===last)return;last=E;
  var R=window.__tcBoxR;
  if(E<.925&&R){TX=R.l-W*.03-TW*.985;TY=R.b+TW*.015-TH*.955;}
  if(TX===null){TX=W*.04-TW*.985+W*.6;TY=H*.5-TH*.45}
  window.__tcTruckRear=TX+TW*.985;
  var tIn=oc(V(E,.903,.922)),x=W+40+(TX-W-40)*tIn;
  var rock=Math.sin(V(E,.917,.927)*Math.PI)*-.7;
  var dip=Math.sin(V(E,.938,.95)*Math.PI)*TW*.004;
  var go=V(E,.948,.97);
  if(go>0){x=TX+TW*.02*Math.sin(cl(go/.25,0,1)*Math.PI)-(TW+W)*ic(cl((go-.2)/.8,0,1));rock=.5*Math.sin(cl((go-.2)/.4,0,1)*Math.PI)}
  truck.style.transform='translate3d('+x.toFixed(1)+'px,'+(TY+dip).toFixed(1)+'px,0) rotate('+rock.toFixed(2)+'deg)';
  var d=Math.sin(tIn*Math.PI)*.7+Math.sin(cl((go-.15)/.6,0,1)*Math.PI)*.6;
  dust.style.opacity=d;dust.style.transform='translate3d('+(x+TW*.92).toFixed(0)+'px,'+(TY+TH*.86).toFixed(0)+'px,0)';
}
window.__tcShipKick=function(){requestAnimationFrame(frame)};
requestAnimationFrame(frame);
})();
