(function(){
  'use strict';

  var file=(location.pathname.split('/').pop()||'').toLowerCase();
  var isL2=file==='index2.html';
  var ownPrefix=isL2?'wp2_':'wp_';
  var lastApply=0;

  function readJson(key){
    try{var raw=localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(e){return null;}
  }

  function cargarExplicacionesL2(){
    if(!isL2)return;
    try{
      if(document.getElementById('pc-l2-rich-explanations'))return;
      var script=document.createElement('script');
      script.id='pc-l2-rich-explanations';
      script.src=new URL('l2-rich-explanations.js',location.href).href+'?v=20260904-r3';
      document.head.appendChild(script);
    }catch(e){}
  }

  function cargarTableroFlotanteExplicacion(){
    try{
      if(document.getElementById('pc-floating-explain-board-script'))return;
      var script=document.createElement('script');
      script.id='pc-floating-explain-board-script';
      script.src=new URL('pc-floating-explain-board.js',location.href).href+'?v=20260904-2';
      document.head.appendChild(script);
    }catch(e){}
  }

  function corregirBotonFlechas(){
    try{
      var boton=document.getElementById('b-anotar');
      if(!boton)return;
      var flecha='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19L19 5"/><path d="M11 5h8v8"/></svg>';
      var borrar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>';
      var cambiando=false;
      function sincronizar(){
        if(cambiando)return;
        try{
          var activo=boton.getAttribute('aria-pressed')==='true';
          var texto=(boton.textContent||'').trim();
          var deseado=activo?'Borrar':'Flechas';
          if(texto!==deseado){
            cambiando=true;
            boton.innerHTML=(activo?borrar:flecha)+deseado;
            cambiando=false;
          }
        }catch(e){cambiando=false;}
      }
      function instalarAccion(){
        if(boton.dataset.pcBorrarFlechas==='1')return;
        boton.dataset.pcBorrarFlechas='1';
        boton.onclick=function(){
          try{
            if(typeof anot!=='function')return;
            var A=anot();
            if(A.modo){
              A.lista=[];
              A.tirando=null;
              A.modo=false;
            }else{
              A.modo=true;
              A.tirando=null;
            }
            if(typeof actualizarBotonAnotar==='function')actualizarBotonAnotar();
            if(typeof pintarFlechas==='function')pintarFlechas();
            sincronizar();
          }catch(e){}
        };
      }
      instalarAccion();
      sincronizar();
      if(boton.dataset.pcFlechasCorregido)return;
      boton.dataset.pcFlechasCorregido='1';
      new MutationObserver(function(){sincronizar();}).observe(boton,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-pressed']});
    }catch(e){}
  }

  function pageState(){
    return readJson('pc_backup_page_state_v2:'+file)||{};
  }

  function refreshExercise(page){
    try{
      var n=Number(page&&page.lastExercise);
      if(!Number.isFinite(n)||n<=0){
        n=Number(localStorage.getItem(isL2?'wp2_ultimo':'wp_ultimo'));
      }
      if(Number.isFinite(n)&&n>0&&typeof jumpToNumber==='function'){
        var actual=null;
        try{actual=typeof curr==='function'?curr():null;}catch(e){}
        if(!actual||Number(actual.n)!==n) jumpToNumber(n);
      }
    }catch(e){}
  }

  function refreshRuntime(page){
    try{ solved=loadSolved(); }catch(e){}
    try{ solvedAt=loadSolvedAt(); }catch(e){}
    try{ histLog=loadHistLog(); }catch(e){}

    try{
      var r=page&&page.runtime&&typeof page.runtime==='object'?page.runtime:null;
      if(r&&typeof state!=='undefined'){
        var wantedFilter=typeof r.filter==='string'?r.filter:(typeof r.filterState==='string'?r.filterState:null);
        if(wantedFilter!==null){
          state.filter=wantedFilter;
          if(typeof buildList==='function') buildList();
        }
        if(typeof r.histTodo==='boolean') state.histTodo=r.histTodo;
      }
    }catch(e){}

    try{ if(typeof applyPageState==='function') applyPageState(); }catch(e){}
    refreshExercise(page);

    try{ if(typeof renderProgress==='function') renderProgress(); }catch(e){}
    try{ if(typeof renderHistorial==='function') renderHistorial(); }catch(e){}
    try{ if(typeof renderGrafica==='function') renderGrafica(); }catch(e){}

    if(isL2){
      cargarExplicacionesL2();
      try{
        var g=parseInt(localStorage.getItem('wp2_daily_goal'),10);
        trainingGoal=(g>=5&&g<=50)?g:10;
      }catch(e){}
      try{ errorBook=loadErrorBook(); }catch(e){}
      try{ if(typeof renderPlanEntrenamiento==='function') renderPlanEntrenamiento(); }catch(e){}
      try{
        explainThemeMode=localStorage.getItem('wp2_explain_theme')||'system';
        if(typeof aplicarTemaExplicacion==='function') aplicarTemaExplicacion(explainThemeMode);
      }catch(e){}
      try{ soundOn=localStorage.getItem('wp2_sound')!=='0'; }catch(e){}
    }else{
      try{
        exThemeMode=localStorage.getItem('wp_explain_theme')||'system';
        if(typeof exAplicarTema==='function') exAplicarTema(exThemeMode);
      }catch(e){}
      try{ soundOn=localStorage.getItem('wp_sound')!=='0'; }catch(e){}
    }

    try{
      bannerOculto=localStorage.getItem('wp_banner')==='1';
      if(typeof aplicarBanner==='function') aplicarBanner(bannerOculto);
    }catch(e){}
    corregirBotonFlechas();
    cargarTableroFlotanteExplicacion();
  }

  function dispatchStorage(keys){
    (keys||[]).forEach(function(key){
      try{window.dispatchEvent(new StorageEvent('storage',{key:key,newValue:localStorage.getItem(key)}));}catch(e){}
    });
  }

  function apply(payload){
    payload=payload||{};
    lastApply=Date.now();
    dispatchStorage(payload.changedKeys||[]);
    refreshRuntime(payload.page||pageState());
    try{window.dispatchEvent(new CustomEvent('pc-cloud-state-applied',{detail:{file:file}}));}catch(e){}
  }

  function reset(){
    lastApply=Date.now();
    try{ solved=loadSolved(); }catch(e){}
    try{ solvedAt=loadSolvedAt(); }catch(e){}
    try{ histLog=loadHistLog(); }catch(e){}
    if(isL2){
      try{trainingGoal=10;}catch(e){}
      try{errorBook={};}catch(e){}
    }
    try{
      if(typeof state!=='undefined'){
        state.filter='all';
        if(typeof buildList==='function') buildList();
        state.i=0;
        if(typeof curr==='function'&&typeof load==='function'&&curr()) load(curr());
      }
    }catch(e){
      try{if(typeof jumpToNumber==='function')jumpToNumber(1);}catch(x){}
    }
    refreshRuntime(pageState());
  }

  function relevantKey(key){
    if(!key||key.indexOf('pc_cloud_sync_')===0)return false;
    if(key.indexOf('pc_')===0)return true;
    if(key==='wp_banner')return true;
    return key.indexOf(ownPrefix)===0;
  }

  window.addEventListener('storage',function(e){
    if(!e||!relevantKey(e.key))return;
    if(Date.now()-lastApply<80)return;
    setTimeout(function(){refreshRuntime(pageState());},20);
  });

  window.PCCloudFrameBridge=Object.freeze({
    file:file,
    apply:apply,
    reset:reset,
    refresh:function(){refreshRuntime(pageState());},
    pageState:pageState
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){corregirBotonFlechas();cargarExplicacionesL2();cargarTableroFlotanteExplicacion();},{once:true});
  else {corregirBotonFlechas();cargarExplicacionesL2();cargarTableroFlotanteExplicacion();}
  window.addEventListener('load',function(){corregirBotonFlechas();cargarExplicacionesL2();cargarTableroFlotanteExplicacion();},{once:true});
})();