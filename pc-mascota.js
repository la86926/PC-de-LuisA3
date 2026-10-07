/* PC · Mascota bailarina
   Aparece bailando sobre el tablero cuando se resuelve un ejercicio.
   - Pisa el borde inferior del tablero y mide 3 casillas de alto.
   - Un toque: se hunde como si la empujaran y le dan cosquillas: se ríe a carcajadas.
   - La risa se le pasa sola a los 2 segundos, o antes si la arrastras.
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
  var RISA_MS = 2000;

  // Capa de la carcajada, en las mismas coordenadas que la imagen recortada (955 × 1227).
  var RISA = '' +
  '<svg class="pcm-risa" viewBox="0 0 955 1227" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
    '<defs>' +
      '<radialGradient id="pcmCaraI"><stop offset="80%" stop-color="#FAEEDD"/><stop offset="100%" stop-color="#FAEEDD" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pcmCaraD"><stop offset="80%" stop-color="#F5E6D4"/><stop offset="100%" stop-color="#F5E6D4" stop-opacity="0"/></radialGradient>' +
      '<filter id="pcmRubor" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12"/></filter>' +
    '</defs>' +
    // tapa los ojos abiertos con el color de la cara
    '<ellipse cx="292" cy="588" rx="100" ry="102" fill="url(#pcmCaraI)"/>' +
    '<ellipse cx="668" cy="588" rx="100" ry="102" fill="url(#pcmCaraD)"/>' +
    // ojos cerrados de risa
    '<g fill="none" stroke="#3B2A26" stroke-width="22" stroke-linecap="round">' +
      '<path d="M236 614 Q292 540 348 614"/>' +
      '<path d="M612 614 Q668 540 724 614"/>' +
    '</g>' +
    // lágrimas de risa
    '<g class="pcm-lagrimas" fill="#9FD3F5" stroke="#7BB9E6" stroke-width="3">' +
      '<path d="M212 618 q-28 42 0 62 q28 -20 0 -62Z"/>' +
      '<path d="M748 618 q-28 42 0 62 q28 -20 0 -62Z"/>' +
    '</g>' +
    // mejillas sonrojadas
    '<ellipse cx="227" cy="700" rx="60" ry="44" fill="#FF7F98" opacity=".6" filter="url(#pcmRubor)"/>' +
    '<ellipse cx="729" cy="697" rx="60" ry="44" fill="#FF7F98" opacity=".6" filter="url(#pcmRubor)"/>' +
    // ¡ja! ¡ja!
    '<g font-family="-apple-system,BlinkMacSystemFont,Avenir Next,Arial Rounded MT Bold,sans-serif" font-weight="800" fill="#FF8FA8" stroke="#fff" stroke-width="10" paint-order="stroke" text-anchor="middle">' +
      '<text class="pcm-ja pcm-ja1" x="830" y="250" font-size="120" transform="rotate(14 830 250)">¡ja!</text>' +
      '<text class="pcm-ja pcm-ja2" x="120" y="330" font-size="100" fill="#B9A4F2" transform="rotate(-14 120 330)">¡ja!</text>' +
    '</g>' +
  '</svg>';

  // Notas musicales de fiesta que suben alrededor de la mascota.
  function nota(color, doble){
    return doble
      ? '<svg viewBox="0 0 40 40"><path d="M14 30V9l20-5v21" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 13l20-5" stroke="' + color + '" stroke-width="5"/><ellipse cx="10" cy="30" rx="6" ry="5" fill="' + color + '"/><ellipse cx="30" cy="25" rx="6" ry="5" fill="' + color + '"/></svg>'
      : '<svg viewBox="0 0 40 40"><path d="M22 30V6q8 2 10 9" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round"/><ellipse cx="17" cy="30" rx="7" ry="5.5" fill="' + color + '"/></svg>';
  }
  var NOTAS = '<div class="pcm-notas" aria-hidden="true">' +
    '<span class="pcm-nota n1">' + nota('#FF9FB0', false) + '</span>' +
    '<span class="pcm-nota n2">' + nota('#B9A4F2', true) + '</span>' +
    '<span class="pcm-nota n3">' + nota('#8CC4EC', false) + '</span>' +
    '<span class="pcm-nota n4">' + nota('#F5C96A', true) + '</span>' +
    '<span class="pcm-nota n5">' + nota('#FF9FB0', true) + '</span>' +
  '</div>';

  var CSS = '' +
  '@property --pcm-risa{syntax:"<number>";inherits:true;initial-value:0}' +
  '.pc-mascota{position:absolute;z-index:40;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;cursor:grab;transform-origin:50% 100%;animation:pcmEntrar .38s cubic-bezier(.34,1.56,.64,1) both;--pcm-risa:0;transition:--pcm-risa .45s ease}' +
  '.pc-mascota,.pc-mascota *{-webkit-tap-highlight-color:transparent;outline:none}' +
  '.pc-mascota.arrastrando{cursor:grabbing}' +
  '.pc-mascota.riendo{--pcm-risa:1}' +
  '.pc-mascota.saliendo{animation:pcmSalir .22s ease-in both;pointer-events:none}' +
  '.pc-mascota .pcm-sombra{position:absolute;left:16%;right:16%;bottom:-2.5%;height:7%;border-radius:50%;background:rgba(0,0,0,.22);filter:blur(2px);animation:pcmSombra 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-baile{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmBaile 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-presion{position:absolute;inset:0;transform-origin:50% 100%;transition:transform .5s cubic-bezier(.3,1.9,.5,1)}' +
  '.pc-mascota.presionada .pcm-presion{transform:scale(1.07,.84);transition:transform .11s ease-out}' +
  '.pc-mascota .pcm-animo{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmCarcajada .3s ease-in-out infinite}' +
  '.pc-mascota img,.pc-mascota .pcm-risa{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}' +
  '.pc-mascota img{object-fit:contain;object-position:50% 100%}' +
  '.pc-mascota .pcm-risa{opacity:var(--pcm-risa);overflow:visible}' +
  '.pc-mascota .pcm-lagrimas{transform-box:fill-box;transform-origin:50% 0;animation:pcmLagrima .6s ease-in-out infinite alternate}' +
  '.pc-mascota .pcm-ja{transform-box:fill-box;transform-origin:center;animation:pcmJa .6s ease-in-out infinite}' +
  '.pc-mascota .pcm-ja2{animation-delay:-.3s}' +
  '.pc-mascota .pcm-globo{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%) translateY(6px) scale(.85);transform-origin:50% 100%;opacity:0;pointer-events:none;white-space:nowrap;padding:8px 13px;border-radius:16px;background:#fff;color:#3a3a40;font:600 13px/1.25 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05);transition:opacity .28s ease,transform .32s cubic-bezier(.34,1.56,.64,1)}' +
  '.pc-mascota .pcm-globo:after{content:"";position:absolute;left:50%;top:100%;margin-left:-7px;border:7px solid transparent;border-top-color:#fff}' +
  '.pc-mascota .pcm-globo.visible{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}' +
  'html[data-modo="oscuro"] .pc-mascota .pcm-globo{background:#2c2c30;color:#f2f2f5;box-shadow:0 6px 18px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.08)}' +
  'html[data-modo="oscuro"] .pc-mascota .pcm-globo:after{border-top-color:#2c2c30}' +
  '.pc-mascota .pcm-notas{position:absolute;inset:-6% -22% 20% -22%;pointer-events:none}' +
  '.pc-mascota .pcm-nota{position:absolute;bottom:0;width:22%;max-width:34px;aspect-ratio:1;opacity:0;animation:pcmNotaSube 2.6s ease-out infinite}' +
  '.pc-mascota .pcm-nota svg{width:100%;height:100%;display:block;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.15))}' +
  '.pc-mascota .pcm-nota.n1{left:2%;animation-delay:0s}' +
  '.pc-mascota .pcm-nota.n2{right:0;animation-delay:-.55s}' +
  '.pc-mascota .pcm-nota.n3{left:12%;animation-delay:-1.1s;width:17%}' +
  '.pc-mascota .pcm-nota.n4{right:10%;animation-delay:-1.65s;width:18%}' +
  '.pc-mascota .pcm-nota.n5{left:0;animation-delay:-2.1s;width:16%}' +
  '@keyframes pcmNotaSube{0%{opacity:0;transform:translate(0,0) rotate(-10deg) scale(.6)}15%{opacity:1}50%{transform:translate(10px,-60%) rotate(10deg) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-6px,-130%) rotate(-8deg) scale(.9)}}' +
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
  // carcajada: su amplitud depende de --pcm-risa (0 = quieto, así entra y sale sin saltos)
  '@keyframes pcmCarcajada{' +
    '0%,100%{transform:translateY(0) rotate(0) scale(1,1)}' +
    '25%{transform:translateY(calc(var(--pcm-risa) * -2.5%)) rotate(calc(var(--pcm-risa) * -3deg)) scale(calc(1 - var(--pcm-risa) * .02),calc(1 + var(--pcm-risa) * .03))}' +
    '50%{transform:translateY(0) rotate(0) scale(calc(1 + var(--pcm-risa) * .04),calc(1 - var(--pcm-risa) * .04))}' +
    '75%{transform:translateY(calc(var(--pcm-risa) * -2.5%)) rotate(calc(var(--pcm-risa) * 3deg)) scale(calc(1 - var(--pcm-risa) * .02),calc(1 + var(--pcm-risa) * .03))}}' +
  '@keyframes pcmLagrima{from{transform:translateY(0) scale(1)}to{transform:translateY(12px) scale(1.1)}}' +
  '@keyframes pcmJa{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.12)}}' +
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
      '<div class="pcm-sombra"></div>' + NOTAS +
      '<div class="pcm-baile"><div class="pcm-presion"><div class="pcm-animo">' +
        '<img src="' + IMAGEN + '" alt="" draggable="false">' + RISA +
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
    var ultimoToque = 0, tRisa = null, tFinRisa = null, tCalma = null, riendo = false;

    function reir(){
      clearTimeout(tCalma);
      clearTimeout(tFinRisa);
      tFinRisa = setTimeout(calmar, RISA_MS);   // se le pasa sola a los 2 segundos
      if (riendo) return;
      riendo = true;
      detenerSuave(baile); detenerSuave(sombra);
      nodo.classList.add('riendo');
    }
    function calmar(){
      clearTimeout(tRisa); clearTimeout(tFinRisa);
      if (!riendo) return;
      riendo = false;
      nodo.classList.remove('riendo');
      // vuelve a bailar cuando la risa ya se desvaneció
      tCalma = setTimeout(function(){ if (!riendo) { reanudar(baile); reanudar(sombra); } }, 420);
    }
    nodo._limpiar = function(){ clearTimeout(tRisa); clearTimeout(tFinRisa); clearTimeout(tCalma); };

    nodo.addEventListener('pointerdown', function(e){
      if (id !== null) return;
      e.preventDefault(); e.stopPropagation();
      var ahora = Date.now();
      if (ahora - ultimoToque < DOBLE_TOQUE_MS) { ultimoToque = 0; quitar(); return; }
      ultimoToque = ahora; movio = false;
      clearTimeout(tRisa);
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
      // un toque sin arrastrar: cosquillas (espera un instante por si es doble toque)
      if (!movio && e.type === 'pointerup') tRisa = setTimeout(reir, DOBLE_TOQUE_MS - 60);
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
