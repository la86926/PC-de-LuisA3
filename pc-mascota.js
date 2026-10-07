/* PC · Mascota bailarina
   Aparece bailando sobre el tablero cuando se resuelve un ejercicio.
   - Pisa el borde inferior del tablero y mide 3 casillas de alto.
   - Toca la guitarra al ritmo, con notas musicales alrededor.
   - Un toque: levanta la guitarra con una sola ala durante 1 segundo y vuelve a tocar.
   - Si la arrastras mientras la tiene arriba, la baja enseguida.
   - Doble toque: se cierra. La primera vez avisa con un globo de 2 segundos.
   - Desaparece al cargar otro ejercicio (siguiente, anterior, reiniciar). */
(function(){
  'use strict';
  if (window.__pcMascota) return;
  window.__pcMascota = true;

  var ALTO_CASILLAS = 3;
  var IMAGEN_TOCA = 'mascota.png';        // tocando la guitarra
  var IMAGEN_ROCK = 'mascota-rock.png';   // guitarra en alto
  // Caja del personaje (de la cresta a las patitas). Las dos imágenes comparten
  // el mismo recorte y sobresalen de la caja para que quepa la guitarra en alto.
  var PROPORCION = 949 / 1016;
  var CLAVE_AVISO = 'pc_mascota_aviso_doble_toque';
  var TEXTO_AVISO = 'Dame doble toque para cerrarme';
  var DOBLE_TOQUE_MS = 320;
  var ARRIBA_MS = 1000;                   // tiempo con la guitarra en alto

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
  '@property --pcm-rock{syntax:"<number>";inherits:true;initial-value:0}' +
  '.pc-mascota{position:absolute;z-index:40;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;cursor:grab;transform-origin:50% 100%;animation:pcmEntrar .38s cubic-bezier(.34,1.56,.64,1) both;--pcm-rock:0;transition:--pcm-rock .3s ease}' +
  '.pc-mascota,.pc-mascota *{-webkit-tap-highlight-color:transparent;outline:none}' +
  '.pc-mascota.arrastrando{cursor:grabbing}' +
  '.pc-mascota.rockera{--pcm-rock:1}' +
  '.pc-mascota.saliendo{animation:pcmSalir .22s ease-in both;pointer-events:none}' +
  '.pc-mascota .pcm-sombra{position:absolute;left:16%;right:16%;bottom:-2.5%;height:7%;border-radius:50%;background:rgba(0,0,0,.22);filter:blur(2px);animation:pcmSombra 1s ease-in-out infinite}' +
  '.pc-mascota .pcm-baile{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmBaile 1s ease-in-out infinite}' +
  '.pc-mascota .pcm-presion{position:absolute;inset:0;transform-origin:50% 100%;transition:transform .5s cubic-bezier(.3,1.9,.5,1)}' +
  '.pc-mascota.presionada .pcm-presion{transform:scale(1.07,.84);transition:transform .11s ease-out}' +
  '.pc-mascota .pcm-salto{position:absolute;inset:0;transform-origin:50% 100%}' +
  '.pc-mascota .pcm-salto.salta{animation:pcmLevanta .5s ease-in-out}' +
  '.pc-mascota .pcm-animo{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmCelebra .5s ease-in-out infinite}' +
  '.pc-mascota .pcm-pose{position:absolute;left:-12.223%;top:-14.567%;width:114.226%;height:114.567%;max-width:none;display:block;pointer-events:none;-webkit-user-drag:none}' +
  // cambio de pose: la que entra aparece primero y la que sale se va después, sin transparencias raras
  '.pc-mascota .pcm-pose.toca{opacity:1;transition:opacity .16s ease .12s}' +
  '.pc-mascota .pcm-pose.rock{opacity:0;transition:opacity .12s ease .26s}' +
  '.pc-mascota.rockera .pcm-pose.toca{opacity:0;transition:opacity .12s ease .26s}' +
  '.pc-mascota.rockera .pcm-pose.rock{opacity:1;transition:opacity .16s ease .12s}' +
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
  // tocando la guitarra: rebote al ritmo, inclinándose a un lado y al otro
  '@keyframes pcmBaile{' +
    '0%{transform:translateY(0) rotate(0) scale(1,1)}' +
    '25%{transform:translateY(-3.5%) rotate(-3deg) scale(.98,1.025)}' +
    '50%{transform:translateY(0) rotate(0) scale(1.035,.965)}' +
    '75%{transform:translateY(-3.5%) rotate(3deg) scale(.98,1.025)}' +
    '100%{transform:translateY(0) rotate(0) scale(1,1)}}' +
  '@keyframes pcmSombra{0%,50%,100%{transform:scaleX(1);opacity:1}25%,75%{transform:scaleX(.86);opacity:.7}}' +
  // impulso al subir o bajar la guitarra (empieza y termina en reposo)
  '@keyframes pcmLevanta{' +
    '0%{transform:translateY(0) scale(1,1)}' +
    '22%{transform:translateY(0) scale(1.07,.9)}' +
    '50%{transform:translateY(-7%) scale(.96,1.06)}' +
    '78%{transform:translateY(0) scale(1.03,.97)}' +
    '100%{transform:translateY(0) scale(1,1)}}' +
  // festejo con la guitarra en alto: su amplitud depende de --pcm-rock (0 = quieto)
  '@keyframes pcmCelebra{' +
    '0%,100%{transform:translateY(0) rotate(0)}' +
    '50%{transform:translateY(calc(var(--pcm-rock) * -2.5%)) rotate(calc(var(--pcm-rock) * -2deg))}}' +
  '@media (prefers-reduced-motion:reduce){.pc-mascota .pcm-baile,.pc-mascota .pcm-sombra{animation-duration:2s}}';

  var estilo = document.createElement('style');
  estilo.id = 'pc-mascota-css';
  estilo.textContent = CSS;
  (document.head || document.documentElement).appendChild(estilo);

  // precarga para que aparezca al instante
  [IMAGEN_TOCA, IMAGEN_ROCK].forEach(function(src){ var i = new Image(); i.src = src; });

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
    el.id = 'pc-mascota';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Mascota celebrando. Doble toque para cerrarla.');
    el.innerHTML =
      '<div class="pcm-sombra"></div>' + NOTAS +
      '<div class="pcm-baile"><div class="pcm-presion"><div class="pcm-salto"><div class="pcm-animo">' +
        '<img class="pcm-pose toca" src="' + IMAGEN_TOCA + '" alt="" draggable="false">' +
        '<img class="pcm-pose rock" src="' + IMAGEN_ROCK + '" alt="" draggable="false">' +
      '</div></div></div></div>';
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
    var salto = nodo.querySelector('.pcm-salto');
    var ultimoToque = 0, tSubir = null, tBajar = null, tReanudar = null, arriba = false;

    function impulso(){
      salto.classList.remove('salta');
      void salto.offsetWidth;
      salto.classList.add('salta');
    }
    function subir(){
      clearTimeout(tReanudar); clearTimeout(tBajar);
      if (!arriba) {
        arriba = true;
        detenerSuave(baile); detenerSuave(sombra);
        nodo.classList.add('rockera');
      }
      impulso();
      tBajar = setTimeout(bajar, 260 + ARRIBA_MS);   // 1 segundo con la guitarra en alto
    }
    function bajar(){
      clearTimeout(tSubir); clearTimeout(tBajar);
      if (!arriba) return;
      arriba = false;
      nodo.classList.remove('rockera');
      impulso();
      // vuelve a tocar cuando terminó de bajar la guitarra
      tReanudar = setTimeout(function(){ if (!arriba) { reanudar(baile); reanudar(sombra); } }, 520);
    }
    nodo._limpiar = function(){ clearTimeout(tSubir); clearTimeout(tBajar); clearTimeout(tReanudar); };

    nodo.addEventListener('pointerdown', function(e){
      if (id !== null) return;
      e.preventDefault(); e.stopPropagation();
      var ahora = Date.now();
      if (ahora - ultimoToque < DOBLE_TOQUE_MS) { ultimoToque = 0; quitar(); return; }
      ultimoToque = ahora; movio = false;
      clearTimeout(tSubir);
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
        bajar();
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
      // un toque sin arrastrar: levanta la guitarra (espera un instante por si es doble toque)
      if (!movio && e.type === 'pointerup') tSubir = setTimeout(subir, DOBLE_TOQUE_MS - 60);
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
