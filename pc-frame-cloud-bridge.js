(function(){
  'use strict';

  var file=(location.pathname.split('/').pop()||'').toLowerCase();
  var isL2=file==='index2.html';
  var ownPrefix=isL2?'wp2_':'wp_';
  var lastApply=0;

  function readJson(key){
    try{var raw=localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(e){return null;}
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
})();
