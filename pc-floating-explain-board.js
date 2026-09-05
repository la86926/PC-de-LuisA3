(function(){
'use strict';
if(window.PC_FLOATING_EXPLAIN_BOARD)return;
window.PC_FLOATING_EXPLAIN_BOARD=true;

var root=null,bubble=null,toggle=null,source=null,observer=null;
var state={open:false,min:false,w:Math.min(360,window.innerWidth-24),left:null,top:72};
var pointers=new Map(),dragStart=null,pinchStart=null,moved=false;

function css(){
 if(document.getElementById('pc-float-board-css'))return;
 var s=document.createElement('style');s.id='pc-float-board-css';
 s.textContent=`
 .pc-float-toggle{display:inline-flex;align-items:center;gap:.38rem;border:1px solid var(--ex-card-border,var(--line));background:var(--ex-card,var(--panel));color:var(--ex-ink,var(--ink));padding:.46rem .66rem;border-radius:12px;font:600 .78rem system-ui,-apple-system,sans-serif;cursor:pointer}
 .pc-float-toggle[aria-pressed="true"]{border-color:var(--acento-tema,var(--gold));color:var(--acento-txt,var(--gold))}
 .pc-float-board{position:fixed;z-index:12050;touch-action:none;user-select:none;-webkit-user-select:none;background:var(--ex-bg,var(--panel));border:1px solid var(--ex-card-border,var(--line));border-radius:16px;box-shadow:0 20px 55px rgba(0,0,0,.34);overflow:hidden;min-width:140px;max-width:86vw}
 .pc-float-head{height:38px;display:flex;align-items:center;gap:.4rem;padding:0 .45rem 0 .7rem;background:var(--ex-card,var(--panel2));border-bottom:1px solid var(--ex-card-border,var(--line));cursor:grab;touch-action:none}
 .pc-float-head:active{cursor:grabbing}
 .pc-float-title{font:700 .72rem system-ui,-apple-system,sans-serif;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
 .pc-float-btn{width:29px;height:29px;border:1px solid var(--ex-card-border,var(--line));border-radius:9px;background:transparent;color:inherit;display:grid;place-items:center;padding:0;font-size:16px;line-height:1;cursor:pointer;touch-action:manipulation}
 .pc-float-stage{width:100%;aspect-ratio:1/1;overflow:hidden;background:var(--panel);touch-action:none}
 .pc-float-stage>*{width:100%!important;height:100%!important;max-width:none!important;margin:0!important;box-sizing:border-box!important}
 .pc-float-stage .explain-board,.pc-float-stage [id*="board"],.pc-float-stage .board{width:100%!important;aspect-ratio:1/1!important}
 .pc-float-bubble{position:fixed;z-index:12050;width:66px;height:66px;border-radius:14px;border:1px solid var(--ex-card-border,var(--line));background:var(--ex-bg,var(--panel));box-shadow:0 12px 32px rgba(0,0,0,.3);padding:4px;overflow:hidden;touch-action:none;cursor:grab}
 .pc-float-bubble .pc-bubble-board{width:100%;height:100%;overflow:hidden;border-radius:9px;pointer-events:none}
 .pc-float-bubble .pc-bubble-board>*{width:100%!important;height:100%!important;max-width:none!important;margin:0!important}
 @media(max-width:560px){.pc-float-board{max-width:92vw}.pc-float-toggle{font-size:.72rem;padding:.42rem .56rem}}
 `;
 document.head.appendChild(s);
}
function explanationOpen(){
 return !!document.querySelector('.explanation-bg.open,.workspace-bg.open[id*="explain"],#explain-modal.open,[class*="explain"][class*="open"]');
}
function findModal(){
 return document.querySelector('#explain-modal,.explanation-bg,[id*="explain"][class*="workspace"],[class*="explanation"][class*="bg"]');
}
function findSource(){
 var modal=findModal(), candidates=[];
 if(modal)candidates=[
  modal.querySelector('#explain-board'),
  modal.querySelector('.explain-board'),
  modal.querySelector('[id*="explain"][id*="board"]'),
  modal.querySelector('[class*="explain"][class*="board"]'),
  modal.querySelector('[id*="board"]'),
  modal.querySelector('.board')
 ];
 candidates=candidates.filter(Boolean);
 if(candidates.length)return candidates[0];
 return document.querySelector('#board,.board');
}
function findActions(){
 var modal=findModal();if(!modal)return null;
 return modal.querySelector('.explanation-topbar-actions,.workspace-topbar-actions,.workspace-topbar,.explanation-topbar,.explain-topbar,[class*="topbar"]');
}
function cloneBoard(){
 source=findSource();if(!source)return null;
 var c=source.cloneNode(true);
 c.removeAttribute('id');
 c.querySelectorAll('[id]').forEach(function(n){n.removeAttribute('id');});
 c.style.pointerEvents='none';
 return c;
}
function refreshClone(){
 if(root){
  var st=root.querySelector('.pc-float-stage'),c=cloneBoard();
  if(st&&c){st.innerHTML='';st.appendChild(c);}
 }
 if(bubble){
  var bs=bubble.querySelector('.pc-bubble-board'),bc=cloneBoard();
  if(bs&&bc){bs.innerHTML='';bs.appendChild(bc);}
 }
 watchSource();
}
function watchSource(){
 if(observer){observer.disconnect();observer=null;}
 source=findSource();
 if(source){
  observer=new MutationObserver(function(){setTimeout(refreshClone,0);});
  observer.observe(source,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
 }
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function defaultLeft(w){return Math.max(8,(window.innerWidth-w)/2);}
function positionRoot(){
 if(!root)return;
 var w=clamp(state.w,140,Math.min(560,window.innerWidth*.92));
 state.w=w;
 if(state.left==null)state.left=defaultLeft(w);
 state.left=clamp(state.left,6,Math.max(6,window.innerWidth-w-6));
 state.top=clamp(state.top,Math.max(6,envTop()),Math.max(6,window.innerHeight-w-50));
 root.style.width=w+'px';root.style.left=state.left+'px';root.style.top=state.top+'px';
}
function envTop(){return 8;}
function createRoot(){
 if(root)return root;
 root=document.createElement('div');root.className='pc-float-board';
 root.innerHTML='<div class="pc-float-head"><span class="pc-float-title">Posición del ejercicio</span><button class="pc-float-btn pc-min" type="button" aria-label="Minimizar">−</button><button class="pc-float-btn pc-close" type="button" aria-label="Cerrar">×</button></div><div class="pc-float-stage"></div>';
 document.body.appendChild(root);
 root.querySelector('.pc-min').onclick=function(e){e.stopPropagation();minimize();};
 root.querySelector('.pc-close').onclick=function(e){e.stopPropagation();closeAll();};
 bindGestures(root,root.querySelector('.pc-float-head'));
 refreshClone();positionRoot();
 return root;
}
function openFloat(){
 css();state.open=true;state.min=false;
 if(toggle)toggle.setAttribute('aria-pressed','true');
 if(bubble){bubble.remove();bubble=null;}
 createRoot();root.style.display='block';refreshClone();positionRoot();
}
function minimize(){
 if(!root)return;
 var rect=root.getBoundingClientRect();
 state.left=rect.left;state.top=rect.top;state.w=rect.width;
 root.remove();root=null;state.min=true;
 bubble=document.createElement('button');bubble.type='button';bubble.className='pc-float-bubble';bubble.setAttribute('aria-label','Restaurar tablero flotante');
 bubble.innerHTML='<div class="pc-bubble-board"></div>';document.body.appendChild(bubble);
 var bw=66; bubble.style.left=clamp(state.left,6,window.innerWidth-bw-6)+'px';bubble.style.top=clamp(state.top,6,window.innerHeight-bw-6)+'px';
 refreshClone();bindBubble(bubble);
}
function restore(){
 if(!bubble)return;
 var r=bubble.getBoundingClientRect();state.left=r.left;state.top=r.top;
 bubble.remove();bubble=null;state.min=false;createRoot();positionRoot();
}
function closeAll(){
 state.open=false;state.min=false;
 if(root){root.remove();root=null;}if(bubble){bubble.remove();bubble=null;}
 if(toggle)toggle.setAttribute('aria-pressed','false');
}
function bindBubble(el){
 var pid=null,sx=0,sy=0,l=0,t=0,wasMoved=false;
 el.addEventListener('pointerdown',function(e){pid=e.pointerId;sx=e.clientX;sy=e.clientY;var r=el.getBoundingClientRect();l=r.left;t=r.top;wasMoved=false;el.setPointerCapture(pid);e.preventDefault();});
 el.addEventListener('pointermove',function(e){if(e.pointerId!==pid)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.hypot(dx,dy)>5)wasMoved=true;el.style.left=clamp(l+dx,4,window.innerWidth-el.offsetWidth-4)+'px';el.style.top=clamp(t+dy,4,window.innerHeight-el.offsetHeight-4)+'px';e.preventDefault();});
 el.addEventListener('pointerup',function(e){if(e.pointerId!==pid)return;try{el.releasePointerCapture(pid);}catch(x){}pid=null;if(!wasMoved)restore();e.preventDefault();});
}
function bindGestures(el,handle){
 function down(e){
  if(e.target.closest('.pc-float-btn'))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  try{el.setPointerCapture(e.pointerId);}catch(x){}
  moved=false;
  if(pointers.size===1){
   var r=el.getBoundingClientRect();dragStart={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};
   pinchStart=null;
  }else if(pointers.size===2){
   var a=[...pointers.values()],r2=el.getBoundingClientRect();
   pinchStart={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),w:r2.width,cx:(a[0].x+a[1].x)/2,cy:(a[0].y+a[1].y)/2,left:r2.left,top:r2.top};
   dragStart=null;
  }
  e.preventDefault();
 }
 function move(e){
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size>=2&&pinchStart){
   var a=[...pointers.values()].slice(0,2),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
   if(pinchStart.d>0){
    var nw=clamp(pinchStart.w*(d/pinchStart.d),140,Math.min(560,window.innerWidth*.92));
    var ratio=nw/pinchStart.w;
    state.w=nw;
    state.left=pinchStart.cx-(pinchStart.cx-pinchStart.left)*ratio;
    state.top=pinchStart.cy-(pinchStart.cy-pinchStart.top)*ratio;
    positionRoot();moved=true;
   }
  }else if(pointers.size===1&&dragStart&&dragStart.id===e.pointerId){
   var dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;
   if(Math.hypot(dx,dy)>3)moved=true;
   state.left=dragStart.left+dx;state.top=dragStart.top+dy;positionRoot();
  }
  e.preventDefault();
 }
 function up(e){
  pointers.delete(e.pointerId);try{el.releasePointerCapture(e.pointerId);}catch(x){}
  if(pointers.size<2)pinchStart=null;
  if(pointers.size===1){
   var item=[...pointers.entries()][0],r=el.getBoundingClientRect();
   dragStart={id:item[0],x:item[1].x,y:item[1].y,left:r.left,top:r.top};
  }else if(!pointers.size)dragStart=null;
  e.preventDefault();
 }
 el.addEventListener('pointerdown',down,{passive:false});
 el.addEventListener('pointermove',move,{passive:false});
 el.addEventListener('pointerup',up,{passive:false});
 el.addEventListener('pointercancel',up,{passive:false});
}
function installToggle(){
 css();var actions=findActions();if(!actions)return;
 toggle=document.getElementById('pc-float-board-toggle');
 if(toggle)return;
 toggle=document.createElement('button');toggle.id='pc-float-board-toggle';toggle.type='button';toggle.className='pc-float-toggle';toggle.setAttribute('aria-pressed','false');
 toggle.innerHTML='▣ <span>Tablero flotante</span>';
 toggle.onclick=function(){state.open?closeAll():openFloat();};
 actions.insertBefore(toggle,actions.firstChild);
}
function sync(){
 if(explanationOpen()){installToggle();if(state.open)refreshClone();}
 else if(state.open)closeAll();
}
new MutationObserver(function(){setTimeout(sync,20);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
window.addEventListener('resize',function(){if(root)positionRoot();if(bubble){var r=bubble.getBoundingClientRect();bubble.style.left=clamp(r.left,4,window.innerWidth-bubble.offsetWidth-4)+'px';bubble.style.top=clamp(r.top,4,window.innerHeight-bubble.offsetHeight-4)+'px';}});
document.addEventListener('DOMContentLoaded',sync,{once:true});setTimeout(sync,120);
})();