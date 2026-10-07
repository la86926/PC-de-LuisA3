/* PC · Mascota bailarina
   Aparece bailando sobre el tablero cuando se resuelve un ejercicio.
   - Pisa el borde inferior del tablero y mide 3 casillas de alto.
   - Un toque: se hunde como si la empujaran y se enoja.
   - Si está enojada y la arrastras, se calma y vuelve a bailar.
   - Doble toque: se cierra. La primera vez avisa con un globo de 2 segundos.
   - Desaparece al cargar otro ejercicio (siguiente, anterior, reiniciar). */
(function(){
  'use strict';
  if (window.__pcMascota) return;
  window.__pcMascota = true;

  var ALTO_CASILLAS = 3;
  var IMAGEN = 'mascota.png';
  var PROPORCION = 955 / 1227;        // ancho / alto de mascota.png
  var CLAVE_AVISO = 'pc_mascota_aviso_doble_toque';
  var TEXTO_AVISO = 'Dame doble toque para cerrarme';
  var DOBLE_TOQUE_MS = 320;

  // Capa del enojo, en las mismas coordenadas que la imagen recortada (955 × 1227).
  var ENOJO = '' +
  '<svg class="pcm-enojo" viewBox="0 0 955 1227" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
    '<defs><filter id="pcmSuave" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>' +
    '<filter id="pcmRubor" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12"/></filter>' +
    '<filter id="pcmLeve" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5"/></filter></defs>' +
    // tapa las cejas alegres con el color de la cara
    '<ellipse cx="281" cy="449" rx="44" ry="27" fill="#FCF1E1" filter="url(#pcmSuave)"/>' +
    '<ellipse cx="679" cy="449" rx="44" ry="27" fill="#F9EDDD" filter="url(#pcmSuave)"/>' +
    // cejas fruncidas
    '<g class="pcm-cejas">' +
      '<path d="M232 438 Q285 452 330 486" fill="none" stroke="#3B2A26" stroke-width="17" stroke-linecap="round"/>' +
      '<path d="M723 438 Q670 452 625 486" fill="none" stroke="#3B2A26" stroke-width="17" stroke-linecap="round"/>' +
    '</g>' +
    // boca cerrada en puchero (tapa la sonrisa abierta)
    '<g class="pcm-boca">' +
      '<path d="M414 651 Q483 628 552 651 Q546 690 483 708 Q420 690 414 651Z" fill="#FAC862" filter="url(#pcmLeve)"/>' +
      '<path d="M432 664 Q483 646 534 664" fill="none" stroke="#DB9A45" stroke-width="7" stroke-linecap="round"/>' +
    '</g>' +
    // mejillas más rojas
    '<ellipse cx="227" cy="692" rx="58" ry="44" fill="#FF6F88" opacity=".7" filter="url(#pcmRubor)"/>' +
    '<ellipse cx="729" cy="689" rx="58" ry="44" fill="#FF6F88" opacity=".7" filter="url(#pcmRubor)"/>' +
    // símbolo de enojo
    '<g class="pcm-vena" transform="translate(770 300) scale(1.7)">' +
      '<g fill="none" stroke="#FF5C77" stroke-width="15" stroke-linecap="round">' +
        '<path d="M-14 -44 Q-12 -14 -44 -14"/><path d="M14 -44 Q12 -14 44 -14"/>' +
        '<path d="M-14 44 Q-12 14 -44 14"/><path d="M14 44 Q12 14 44 14"/>' +
      '</g>' +
    '</g>' +
  '</svg>';

  var CSS = '' +
  '@property --pcm-enojo{syntax:"<number>";inherits:true;initial-value:0}' +
  '.pc-mascota{position:absolute;z-index:40;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;cursor:grab;transform-origin:50% 100%;animation:pcmEntrar .38s cubic-bezier(.34,1.56,.64,1) both;--pcm-enojo:0;transition:--pcm-enojo .45s ease}' +
  '.pc-mascota,.pc-mascota *{-webkit-tap-highlight-color:transparent;outline:none}' +
  '.pc-mascota.arrastrando{cursor:grabbing}' +
  '.pc-mascota.enojada{--pcm-enojo:1}' +
  '.pc-mascota.saliendo{animation:pcmSalir .22s ease-in both;pointer-events:none}' +
  '.pc-mascota .pcm-sombra{position:absolute;left:16%;right:16%;bottom:-2.5%;height:7%;border-radius:50%;background:rgba(0,0,0,.22);filter:blur(2px);animation:pcmSombra 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-baile{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmBaile 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-presion{position:absolute;inset:0;transform-origin:50% 100%;transition:transform .5s cubic-bezier(.3,1.9,.5,1)}' +
  '.pc-mascota.presionada .pcm-presion{transform:scale(1.07,.84);transition:transform .11s ease-out}' +
  '.pc-mascota .pcm-animo{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmResopla .9s ease-in-out infinite}' +
  '.pc-mascota img,.pc-mascota .pcm-enojo{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}' +
  '.pc-mascota img{object-fit:contain;object-position:50% 100%}' +
  '.pc-mascota .pcm-enojo{opacity:var(--pcm-enojo);overflow:visible}' +
  '.pc-mascota .pcm-cejas{transform:translateY(calc((1 - var(--pcm-enojo)) * -30px))}' +
  '.pc-mascota .pcm-vena>g{transform-box:fill-box;transform-origin:center;transform:scale(calc(.4 + var(--pcm-enojo) * .6));animation:pcmVena .7s ease-in-out infinite}' +
  '.pc-mascota .pcm-globo{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%) translateY(6px) scale(.85);transform-origin:50% 100%;opacity:0;pointer-events:none;white-space:nowrap;padding:8px 13px;border-radius:16px;background:#fff;color:#3a3a40;font:600 13px/1.25 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05);transition:opacity .28s ease,transform .32s cubic-bezier(.34,1.56,.64,1)}' +
  '.pc-mascota .pcm-globo:after{content:"";position:absolute;left:50%;top:100%;margin-left:-7px;border:7px solid transparent;border-top-color:#fff}' +
  '.pc-mascota .pcm-globo.visible{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}' +
  'html[data-modo="oscuro"] .pc-mascota .pcm-globo{background:#2c2c30;color:#f2f2f5;box-shadow:0 6px 18px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.08)}' +
  'html[data-modo="oscuro"] .pc-mascota .pcm-globo:after{border-top-color:#2c2c30}' +
  '@keyframes pcmEntrar{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}' +
  '@keyframes pcmSalir{to{opacity:0;transform:scale(.6)}}' +
  '@keyframes pcmBaile{' +
    '0%{transform:translateY(0) rotate(0) scale(1,1)}' +
    '10%{transform:translateY(0) rotate(0) scale(1.07,.93)}' +
    '22%{transform:translateY(-11%) rotate(-8deg) scale(.96,1.05)}' +
    '34%{transform:translateY(0) rotate(-4deg) scale(1.06,.94)}' +
    '50%{transform:translateY(0) rotate(0) scale(1,1)}' +
    '60%{transform:translateY(0) rotate(0) scale(1.07,.93)}' +
    '72%{transform:translateY(-11%) rotate(8deg) scale(.96,1.05)}' +
    '84%{transform:translateY(0) rotate(4deg) scale(1.06,.94)}' +
    '100%{transform:translateY(0) rotate(0) scale(1,1)}}' +
  '@keyframes pcmSombra{0%,10%,34%,50%,60%,84%,100%{transform:scaleX(1);opacity:1}22%,72%{transform:scaleX(.7);opacity:.55}}' +
  // resoplido de enojo: su amplitud depende de --pcm-enojo (0 = quieto, sin saltos)
  '@keyframes pcmResopla{' +
    '0%,100%{transform:translateX(0) scale(1,1)}' +
    '20%{transform:translateX(calc(var(--pcm-enojo) * -1.2%)) scale(calc(1 + var(--pcm-enojo) * .035),calc(1 - var(--pcm-enojo) * .03))}' +
    '40%{transform:translateX(calc(var(--pcm-enojo) * 1.2%)) scale(1,1)}' +
    '60%{transform:translateX(calc(var(--pcm-enojo) * -.8%)) scale(calc(1 + var(--pcm-enojo) * .02),calc(1 - var(--pcm-enojo) * .02))}' +
    '80%{transform:translateX(calc(var(--pcm-enojo) * .8%)) scale(1,1)}}' +
  '@keyframes pcmVena{0%,100%{scale:1}50%{scale:1.14}}' +
  '@media (prefers-reduced-motion:reduce){.pc-mascota .pcm-baile{animation-duration:4s}}';

  var estilo = document.createElement('style');
  estilo.id = 'pc-mascota-css';
  estilo.textContent = CSS;
  (document.head || document.documentElement).appendChild(estilo);

  // precarga para que aparezca al instante
  var precarga = new Image(); precarga.src = IMAGEN;

  var el = null;      // nodo de la mascota
  var dx = 0, dy = 0; // desplazamiento por arrastre, en casillas

  function tablero(){ return document.getElementById('board'); }

  function medidas(){
    var b = tablero();
    if (!b || !b.parentElement) return null;
    var cont = b.parentElement;
    var rb = b.getBoundingClientRect(), rc = cont.getBoundingClientRect();
    if (!rb.width) return null;
    var casilla = rb.width / 8;
    var alto = casilla * ALTO_CASILLAS, ancho = alto * PROPORCION;
    return {
      cont: cont, rb: rb, rc: rc, casilla: casilla, alto: alto, ancho: ancho,
      x0: rb.left - rc.left + (rb.width - ancho) / 2,
      y0: rb.bottom - rc.top - alto
    };
  }

  function limitar(m){
    var bl = m.rb.left - m.rc.left, bt = m.rb.top - m.rc.top;
    var x = Math.min(bl + m.rb.width - m.ancho, Math.max(bl, m.x0 + dx * m.casilla));
    var y = Math.min(bt + m.rb.height - m.alto, Math.max(bt, m.y0 + dy * m.casilla));
    dx = (x - m.x0) / m.casilla; dy = (y - m.y0) / m.casilla;
    return { x: x, y: y };
  }

  function colocar(){
    if (!el) return;
    var m = medidas();
    if (!m) return;
    if (el.parentElement !== m.cont) m.cont.appendChild(el);
    var p = limitar(m);
    el.style.width = m.ancho + 'px';
    el.style.height = m.alto + 'px';
    el.style.left = p.x + 'px';
    el.style.top = p.y + 'px';
  }

  function quitar(){
    if (!el) return;
    var viejo = el; el = null;
    if (viejo._limpiar) viejo._limpiar();
    viejo.classList.add('saliendo');
    setTimeout(function(){ if (viejo.parentElement) viejo.parentElement.removeChild(viejo); }, 240);
  }

  // Detiene una animación CSS desde la pose en que está y la lleva suave a reposo.
  function detenerSuave(nodo){
    var cs = getComputedStyle(nodo);
    nodo.style.transform = cs.transform === 'none' ? '' : cs.transform;
    nodo.style.opacity = cs.opacity;
    nodo.style.animation = 'none';
    void nodo.offsetWidth;
    nodo.style.transition = 'transform .35s ease-out, opacity .35s ease-out';
    nodo.style.transform = 'none';
    nodo.style.opacity = '1';
  }
  // Reanuda desde el inicio del ciclo, que es la pose de reposo: no hay salto.
  function reanudar(nodo){
    nodo.style.transition = '';
    nodo.style.transform = '';
    nodo.style.opacity = '';
    nodo.style.animation = '';
  }

  function avisoVisto(){ try { return localStorage.getItem(CLAVE_AVISO) === '1'; } catch (e) { return true; } }
  function marcarAviso(){ try { localStorage.setItem(CLAVE_AVISO, '1'); } catch (e) {} }

  function mostrar(){
    if (el) { if (el._limpiar) el._limpiar(); el.parentElement && el.parentElement.removeChild(el); el = null; }
    var m = medidas();
    if (!m) return;
    dx = 0; dy = 0;
    el = document.createElement('div');
    el.className = 'pc-mascota';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Mascota celebrando. Doble toque para cerrarla.');
    el.innerHTML =
      '<div class="pcm-sombra"></div>' +
      '<div class="pcm-baile"><div class="pcm-presion"><div class="pcm-animo">' +
        '<img src="' + IMAGEN + '" alt="" draggable="false">' + ENOJO +
      '</div></div></div>';
    activarInteraccion(el);
    m.cont.appendChild(el);
    colocar();

    if (!avisoVisto()) {
      marcarAviso();
      var globo = document.createElement('div');
      globo.className = 'pcm-globo';
      globo.textContent = TEXTO_AVISO;
      el.appendChild(globo);
      var nodo = el;
      setTimeout(function(){ globo.classList.add('visible'); }, 450);
      setTimeout(function(){ globo.classList.remove('visible'); }, 450 + 2000);
      setTimeout(function(){ if (globo.parentElement === nodo) nodo.removeChild(globo); }, 450 + 2000 + 400);
    }
  }

  function activarInteraccion(nodo){
    var baile = nodo.querySelector('.pcm-baile');
    var sombra = nodo.querySelector('.pcm-sombra');
    var id = null, sx = 0, sy = 0, bx = 0, by = 0, movio = false;
    var ultimoToque = 0, tEnojo = null, tCalma = null, enojada = false;

    function enojar(){
      clearTimeout(tCalma);
      if (enojada) return;
      enojada = true;
      detenerSuave(baile); detenerSuave(sombra);
      nodo.classList.add('enojada');
    }
    function calmar(){
      clearTimeout(tEnojo);
      if (!enojada) return;
      enojada = false;
      nodo.classList.remove('enojada');
      // vuelve a bailar cuando el enojo ya se desvaneció
      tCalma = setTimeout(function(){ if (!enojada) { reanudar(baile); reanudar(sombra); } }, 420);
    }
    nodo._limpiar = function(){ clearTimeout(tEnojo); clearTimeout(tCalma); };

    nodo.addEventListener('pointerdown', function(e){
      if (id !== null) return;
      e.preventDefault(); e.stopPropagation();
      var ahora = Date.now();
      if (ahora - ultimoToque < DOBLE_TOQUE_MS) { ultimoToque = 0; quitar(); return; }
      ultimoToque = ahora; movio = false;
      clearTimeout(tEnojo);
      id = e.pointerId; sx = e.clientX; sy = e.clientY; bx = dx; by = dy;
      try { nodo.setPointerCapture(id); } catch (err) {}
      nodo.classList.add('presionada');
    });
    nodo.addEventListener('pointermove', function(e){
      if (e.pointerId !== id) return;
      e.preventDefault(); e.stopPropagation();
      var m = medidas(); if (!m) return;
      if (!movio && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 8) {
        movio = true; ultimoToque = 0;
        nodo.classList.remove('presionada');
        nodo.classList.add('arrastrando');
        calmar();
      }
      if (!movio) return;
      dx = bx + (e.clientX - sx) / m.casilla;
      dy = by + (e.clientY - sy) / m.casilla;
      colocar();
    });
    function soltar(e){
      if (e.pointerId !== id) return;
      e.stopPropagation();
      id = null;
      nodo.classList.remove('presionada');
      nodo.classList.remove('arrastrando');
      // un toque sin arrastrar: se enoja (espera un instante por si es doble toque)
      if (!movio && e.type === 'pointerup') tEnojo = setTimeout(enojar, DOBLE_TOQUE_MS - 60);
    }
    nodo.addEventListener('pointerup', soltar);
    nodo.addEventListener('pointercancel', soltar);
    // que el toque no llegue al tablero (selección de piezas, flechas)
    ['mousedown','touchstart','click','dblclick','contextmenu'].forEach(function(t){
      nodo.addEventListener(t, function(e){ e.stopPropagation(); if (t !== 'mousedown' && t !== 'touchstart') e.preventDefault(); }, { passive: false });
    });
  }

  window.addEventListener('resize', colocar);
  window.addEventListener('orientationchange', function(){ setTimeout(colocar, 250); });

  // Enganche con la app: onSolved() muestra, load() (cambio de ejercicio) oculta.
  function enganchar(){
    if (typeof window.onSolved !== 'function' || typeof window.load !== 'function') return false;
    var solvedOriginal = window.onSolved;
    var loadOriginal = window.load;
    window.onSolved = function(){
      var r = solvedOriginal.apply(this, arguments);
      try { mostrar(); } catch (e) {}
      return r;
    };
    window.load = function(){
      try { quitar(); } catch (e) {}
      return loadOriginal.apply(this, arguments);
    };
    return true;
  }
  if (!enganchar()) document.addEventListener('DOMContentLoaded', enganchar, { once: true });

  window.pcMascota = { mostrar: mostrar, quitar: quitar };
})();
