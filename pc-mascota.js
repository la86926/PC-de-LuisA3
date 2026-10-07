/* PC · Mascota bailarina
   Aparece bailando sobre el tablero cuando se resuelve un ejercicio.
   - Pisa el borde inferior del tablero (fila de abajo) y mide 3 casillas de alto.
   - Se puede arrastrar con el dedo o el mouse.
   - Desaparece al cargar otro ejercicio (siguiente, anterior, reiniciar).
   - El baile es un ciclo de 2 segundos que se repite.
   Si existe mascota.png en la misma carpeta, se usa esa imagen;
   si no, se dibuja la mascota original en SVG que va aquí abajo. */
(function(){
  'use strict';
  if (window.__pcMascota) return;
  window.__pcMascota = true;

  var ALTO_CASILLAS = 3;      // alto de la mascota en casillas
  var PROPORCION = 0.84;      // ancho / alto
  var IMAGEN = 'mascota.png'; // imagen opcional (fondo transparente)

  var SVG = '' +
  '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g class="pcm-cuerpo">' +
      '<g class="pcm-cola"><path d="M64 178 C40 196 36 214 44 226 C56 214 66 204 78 196Z" fill="#7FB8E6"/></g>' +
      '<g class="pcm-pies">' +
        '<path d="M74 222 q-4 12 -14 16 h28 q-2 -8 -4 -16Z" fill="#FFD77A"/>' +
        '<path d="M126 222 q4 12 14 16 h-28 q2 -8 4 -16Z" fill="#FFD77A"/>' +
      '</g>' +
      '<ellipse cx="100" cy="150" rx="66" ry="78" fill="#A9D6F5"/>' +
      '<ellipse cx="100" cy="172" rx="44" ry="50" fill="#FFF6E3"/>' +
      '<g class="pcm-ala-izq"><path d="M40 140 C14 146 8 176 22 196 C38 190 50 170 52 150Z" fill="#8CC4EC"/></g>' +
      '<g class="pcm-ala-der"><path d="M160 140 C186 146 192 176 178 196 C162 190 150 170 148 150Z" fill="#8CC4EC"/></g>' +
      '<g class="pcm-cresta">' +
        '<path d="M100 70 C92 46 98 28 112 18 C112 36 116 50 112 70Z" fill="#FF9FB0"/>' +
        '<path d="M92 72 C80 54 80 38 88 28 C92 44 98 56 102 70Z" fill="#FFB8C6"/>' +
        '<path d="M110 72 C120 56 132 50 142 52 C134 60 126 68 118 76Z" fill="#FFB8C6"/>' +
      '</g>' +
      '<g class="pcm-ojos">' +
        '<ellipse cx="76" cy="126" rx="11" ry="14" fill="#2B2B33"/>' +
        '<ellipse cx="124" cy="126" rx="11" ry="14" fill="#2B2B33"/>' +
        '<circle cx="80" cy="120" r="4.2" fill="#fff"/><circle cx="73" cy="131" r="2" fill="#fff"/>' +
        '<circle cx="128" cy="120" r="4.2" fill="#fff"/><circle cx="121" cy="131" r="2" fill="#fff"/>' +
      '</g>' +
      '<ellipse cx="58" cy="148" rx="11" ry="7" fill="#FFB8C6" opacity=".85"/>' +
      '<ellipse cx="142" cy="148" rx="11" ry="7" fill="#FFB8C6" opacity=".85"/>' +
      '<path d="M88 142 Q100 136 112 142 Q104 158 100 160 Q96 158 88 142Z" fill="#FFE08A"/>' +
      '<path d="M93 146 Q100 151 107 146" fill="none" stroke="#E8B94E" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M100 184 l-6 -6 a4.2 4.2 0 0 1 6 -6 a4.2 4.2 0 0 1 6 6Z" fill="#FF9FB0"/>' +
    '</g>' +
    '<g class="pcm-nota pcm-n1"><path d="M30 60 v-22 l14 -4 v20" fill="none" stroke="#C3B1F0" stroke-width="3" stroke-linecap="round"/><circle cx="27" cy="61" r="5" fill="#C3B1F0"/><circle cx="41" cy="55" r="5" fill="#C3B1F0"/></g>' +
    '<g class="pcm-nota pcm-n2"><path d="M168 46 v-20" fill="none" stroke="#FF9FB0" stroke-width="3" stroke-linecap="round"/><path d="M168 26 q10 4 8 14" fill="none" stroke="#FF9FB0" stroke-width="3" stroke-linecap="round"/><circle cx="164" cy="47" r="5" fill="#FF9FB0"/></g>' +
  '</svg>';

  var CSS = '' +
  '.pc-mascota{position:absolute;z-index:40;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;cursor:grab;transform-origin:50% 100%;animation:pcmEntrar .38s cubic-bezier(.34,1.56,.64,1) both}' +
  '.pc-mascota.arrastrando{cursor:grabbing}' +
  '.pc-mascota.saliendo{animation:pcmSalir .22s ease-in both;pointer-events:none}' +
  '.pc-mascota .pcm-sombra{position:absolute;left:18%;right:18%;bottom:-3%;height:8%;border-radius:50%;background:rgba(0,0,0,.22);filter:blur(2px);animation:pcmSombra 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-baile{position:absolute;inset:0;transform-origin:50% 100%;animation:pcmBaile 2s ease-in-out infinite}' +
  '.pc-mascota svg,.pc-mascota img{width:100%;height:100%;display:block;overflow:visible;pointer-events:none;-webkit-user-drag:none}' +
  '.pc-mascota .pcm-ala-izq{transform-box:fill-box;transform-origin:100% 15%;animation:pcmAlaI .5s ease-in-out infinite alternate}' +
  '.pc-mascota .pcm-ala-der{transform-box:fill-box;transform-origin:0% 15%;animation:pcmAlaD .5s ease-in-out infinite alternate}' +
  '.pc-mascota .pcm-cresta{transform-box:fill-box;transform-origin:30% 100%;animation:pcmCresta 1s ease-in-out infinite alternate}' +
  '.pc-mascota .pcm-ojos{transform-box:fill-box;transform-origin:50% 50%;animation:pcmParpadeo 2s infinite}' +
  '.pc-mascota .pcm-cola{transform-box:fill-box;transform-origin:100% 0%;animation:pcmCola .5s ease-in-out infinite alternate}' +
  '.pc-mascota .pcm-nota{animation:pcmNota 2s ease-in-out infinite}' +
  '.pc-mascota .pcm-n2{animation-delay:-1s}' +
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
  '@keyframes pcmAlaI{from{transform:rotate(12deg)}to{transform:rotate(-38deg)}}' +
  '@keyframes pcmAlaD{from{transform:rotate(-12deg)}to{transform:rotate(38deg)}}' +
  '@keyframes pcmCresta{from{transform:rotate(-7deg)}to{transform:rotate(9deg)}}' +
  '@keyframes pcmCola{from{transform:rotate(-8deg)}to{transform:rotate(10deg)}}' +
  '@keyframes pcmParpadeo{0%,44%,50%,100%{transform:scaleY(1)}47%{transform:scaleY(.1)}}' +
  '@keyframes pcmNota{0%{opacity:0;transform:translateY(10px)}25%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateY(-16px)}}' +
  '@media (prefers-reduced-motion:reduce){.pc-mascota .pcm-baile{animation-duration:4s}}';

  var estilo = document.createElement('style');
  estilo.id = 'pc-mascota-css';
  estilo.textContent = CSS;
  (document.head || document.documentElement).appendChild(estilo);

  // ¿Hay una imagen propia (mascota.png)? Se comprueba una sola vez.
  var usarImagen = false;
  var prueba = new Image();
  prueba.onload = function(){ usarImagen = prueba.naturalWidth > 0; };
  prueba.src = IMAGEN;

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
      // centrado horizontal y con los pies en el borde inferior del tablero
      x0: rb.left - rc.left + (rb.width - ancho) / 2,
      y0: rb.bottom - rc.top - alto
    };
  }

  function limitar(m){
    // que no se salga del recuadro del tablero
    var minX = rb0(m).left, maxX = rb0(m).left + m.rb.width - m.ancho;
    var minY = rb0(m).top,  maxY = rb0(m).top + m.rb.height - m.alto;
    var x = Math.min(maxX, Math.max(minX, m.x0 + dx * m.casilla));
    var y = Math.min(maxY, Math.max(minY, m.y0 + dy * m.casilla));
    dx = (x - m.x0) / m.casilla; dy = (y - m.y0) / m.casilla;
    return { x: x, y: y };
  }
  function rb0(m){ return { left: m.rb.left - m.rc.left, top: m.rb.top - m.rc.top }; }

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
    viejo.classList.add('saliendo');
    setTimeout(function(){ if (viejo.parentElement) viejo.parentElement.removeChild(viejo); }, 240);
  }

  function mostrar(){
    if (el) { el.parentElement && el.parentElement.removeChild(el); el = null; }
    var m = medidas();
    if (!m) return;
    dx = 0; dy = 0;
    el = document.createElement('div');
    el.className = 'pc-mascota';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Mascota celebrando');
    var dibujo = usarImagen
      ? '<img src="' + IMAGEN + '" alt="" draggable="false">'
      : SVG;
    el.innerHTML = '<div class="pcm-sombra"></div><div class="pcm-baile">' + dibujo + '</div>';
    activarArrastre(el);
    m.cont.appendChild(el);
    colocar();
  }

  function activarArrastre(nodo){
    var id = null, sx = 0, sy = 0, bx = 0, by = 0;
    nodo.addEventListener('pointerdown', function(e){
      if (id !== null) return;
      e.preventDefault(); e.stopPropagation();
      id = e.pointerId; sx = e.clientX; sy = e.clientY; bx = dx; by = dy;
      try { nodo.setPointerCapture(id); } catch (err) {}
      nodo.classList.add('arrastrando');
    });
    nodo.addEventListener('pointermove', function(e){
      if (e.pointerId !== id) return;
      e.preventDefault(); e.stopPropagation();
      var m = medidas(); if (!m) return;
      dx = bx + (e.clientX - sx) / m.casilla;
      dy = by + (e.clientY - sy) / m.casilla;
      colocar();
    });
    function soltar(e){
      if (e.pointerId !== id) return;
      e.stopPropagation();
      id = null;
      nodo.classList.remove('arrastrando');
    }
    nodo.addEventListener('pointerup', soltar);
    nodo.addEventListener('pointercancel', soltar);
    // evita que el toque llegue al tablero (selección de piezas, flechas)
    ['mousedown','touchstart','click','contextmenu'].forEach(function(t){
      nodo.addEventListener(t, function(e){ e.stopPropagation(); if (t === 'contextmenu') e.preventDefault(); }, { passive: false });
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
