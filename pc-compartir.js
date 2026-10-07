/* PC · Enlace directo al ejercicio para compartir
   - pcEnlaceEjercicio(metodo, n): enlace que abre la web en ese método y ejercicio.
   - pcCopiarTexto(texto): copia al portapapeles (se llama dentro del toque del botón).
   - pcAviso(texto): aviso breve en pantalla.
   El enlace siempre apunta a la web "chess", que es la que continúa. */
(function(){
  'use strict';
  var WEB = 'https://la86926.github.io/chess/';

  window.pcEnlaceEjercicio = function(metodo, n){
    return WEB + '?metodo=' + encodeURIComponent(metodo) + '&ejercicio=' + encodeURIComponent(n);
  };

  function copiaVieja(texto){
    try{
      var ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, texto.length);
      var ok = document.execCommand('copy'); ta.remove(); return ok;
    }catch(e){ return false; }
  }
  window.pcCopiarTexto = function(texto){
    try{
      if (navigator.clipboard && navigator.clipboard.writeText){
        return navigator.clipboard.writeText(texto).then(function(){ return true; }, function(){ return copiaVieja(texto); });
      }
    }catch(e){}
    return Promise.resolve(copiaVieja(texto));
  };

  var css = document.createElement('style');
  css.textContent =
    '.pc-aviso{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(14px);opacity:0;z-index:9999;max-width:calc(100% - 32px);padding:10px 16px;border-radius:14px;background:rgba(40,40,44,.94);color:#fff;font:600 13px/1.3 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.22);pointer-events:none;transition:opacity .25s ease,transform .3s cubic-bezier(.32,.72,0,1);text-align:center}' +
    '.pc-aviso.ver{opacity:1;transform:translateX(-50%) translateY(0)}';
  (document.head || document.documentElement).appendChild(css);
  var nodo = null, reloj = null;
  window.pcAviso = function(texto){
    if (!nodo){ nodo = document.createElement('div'); nodo.className = 'pc-aviso'; nodo.setAttribute('role', 'status'); document.body.appendChild(nodo); }
    nodo.textContent = texto;
    void nodo.offsetWidth; nodo.classList.add('ver');
    clearTimeout(reloj); reloj = setTimeout(function(){ nodo.classList.remove('ver'); }, 2600);
  };
})();
