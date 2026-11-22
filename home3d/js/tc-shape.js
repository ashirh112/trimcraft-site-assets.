/* The Trimcraft card shape, from the brand book: three small rounded corners and one large
   fold-radius corner at the top right. The fold radius is 22% of the card's short side, so a
   wide photo and a tall hang tag read as the same family. */
(function(root){
'use strict';
var SMALL=16,FOLD=.22;
function radii(w,h){
  var s=Math.min(w,h);
  return {small:Math.min(SMALL,s/4),fold:FOLD*s};
}
function path(w,h){
  var R=radii(w,h),r=R.small,F=R.fold,f=function(n){return +n.toFixed(2)};
  return 'M'+f(r)+' 0H'+f(w-F)+'A'+f(F)+' '+f(F)+' 0 0 1 '+f(w)+' '+f(F)+
    'V'+f(h-r)+'A'+f(r)+' '+f(r)+' 0 0 1 '+f(w-r)+' '+f(h)+
    'H'+f(r)+'A'+f(r)+' '+f(r)+' 0 0 1 0 '+f(h-r)+
    'V'+f(r)+'A'+f(r)+' '+f(r)+' 0 0 1 '+f(r)+' 0Z';
}
function mask(w,h){
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w.toFixed(2)+'" height="'+h.toFixed(2)+'" viewBox="0 0 '+w.toFixed(2)+' '+h.toFixed(2)+'"><path d="'+path(w,h)+'" fill="#000"/></svg>';
  return 'url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
}
var api={SMALL:SMALL,FOLD:FOLD,radii:radii,path:path,mask:mask};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TCShape=api;
})(this);
