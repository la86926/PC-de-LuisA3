(function(){
'use strict';
if(window.PC_L2_MODEL_VIDEOS)return;
window.PC_L2_MODEL_VIDEOS=true;

var VIDEOS={
 'Erizo (Hedgehog)':[
  ['XmgU77nn-sk','Entendemos la estructura Erizo! — Davinin'],
  ['_w_inEOPS-c','Diferentes formas de enfrentar con blancas el Sistema Erizo — Ajedrez Con Boudy'],
  ['iysktEN_bNg','Sistema Zukertort vs Erizo: Colle–Grünfeld 1926 — Pupilochess']
 ],
 'Bind de Maróczy':[
  ['dg4rYedWfm4','Estructura Maróczy vs Dragón Acelerado — Luis Fernández Siles'],
  ['g7z9JoNbUaA','Lazo de Maróczy: un plan fácil de recordar — Academia de Ajedrez a Distancia'],
  ['OogTSfYaSfE','Luchando contra el Maróczy — ChessTeacher']
 ],
 'Benoni':[
  ['PWjW-cZOV-k','El plan más efectivo contra la Benoni explicado paso a paso — Pupilochess'],
  ['oh2QCXXK8Wk','Spassky–Fischer, Reikiavik 1972, partida 3 — Benoni Moderna'],
  ['tg9s6mLnH1o','Korchnoi–Kasparov, Lucerna 1982 — Benoni']
 ],
 'India de Rey con centro cerrado':[
  ['Nz7nxyd4T7c','Aprende a jugar la Defensa India de Rey — Ajedrez con David Esti'],
  ['hIXE0a8BXnI','Letelier–Fischer, Leipzig 1960 — India de Rey'],
  ['d-yFg_Lfb1g','Najdorf–Gligoric: la India de Rey que asfixió a Najdorf — Ajedrez con David Esti']
 ],
 'Cadena francesa':[
  ['lRYSyp7vAug','Defensa Francesa: cadenas, rupturas y planes — Ajedrez'],
  ['WQh6-_lZzKY','Fischer–Tal, Leipzig 1960 — Defensa Francesa — Partidas Inmortales'],
  ['Ou_2448DHEM','Tal–Vaganian, Dubna 1973 — Defensa Francesa — Partidas Inmortales']
 ],
 'Carlsbad / estructura de dama':[
  ['ZPU_OQUXGqc','El ataque de minorías y el plan Carlsbad — Dama Roja 150'],
  ['u1jjSLWfSK8','Ataque de minorías — Academia de Ajedrez a Distancia'],
  ['SsCcJBj8x1Q','Ataque de minorías: ideas temáticas y estructura Carlsbad']
 ],
 'Peón dama aislado (IQP)':[
  ['vJemxsp27aI','Cómo jugar contra el peón dama aislado — Chess and Mind en Español'],
  ['L9t5v0V8XaQ','Botvinnik–Vidmar, Nottingham 1936 — modelo clásico de IQP'],
  ['eXOc9nkBNf8','Karpov–Kasparov: obra maestra con peón dama aislado']
 ],
 'Peones colgantes':[
  ['B_Emz4zHa-I','Ganar con los peones colgantes — Academia de Ajedrez a Distancia'],
  ['bzJVRdrsCoU','Jugar contra los peones colgantes — Luis Fernández Siles'],
  ['MTRTJJYDY6c','Korchnoi–Karpov, Merano 1981 — ganar con peones colgantes']
 ],
 'Stonewall (Muro de piedra)':[
  ['CVuD2-EokZc','Muro de Piedra — Ajedrez Con Sergio'],
  ['4KWxJByL37Q','Muro de Piedra para principiantes — Ajedrez Con Sergio'],
  ['emy1YXOYUhQ','El sólido Muro de Piedra para jugadores estratégicos — ChessTeacher']
 ],
 'Centro cerrado o trabado':[
  ['2oRFKbmDku0','Ataque por los flancos: cómo jugar posiciones cerradas'],
  ['8awd72wQnQ0','Petrosian–Lutikov, URSS 1959: cómo jugar posiciones cerradas — Partidas Inmortales'],
  ['Ngar4y71VGM','Ganando con el centro cerrado — Academia de Ajedrez a Distancia']
 ],
 'Centro abierto o simplificado':[
  ['0YuuhEOR364','El centro abierto en ajedrez: ideas importantes — Ajedrez en minutos'],
  ['8-bgm9TjPXA','Ideas para jugar en centro abierto — Academia de Ajedrez a Distancia'],
  ['dOuh7mbj2h8','Morphy en la Ópera, París 1858 — Partidas Inmortales']
 ],
 'Centro semiabierto y estructura dinámica':[
  ['GflUy6EbXFY','Las rupturas de peones en el medio juego'],
  ['nKx8kXoVQlc','Estrategia: las rupturas en ajedrez'],
  ['MTRTJJYDY6c','Korchnoi–Karpov, Merano 1981: la ruptura central ...d4']
 ]
};

var HISTORIA={
 'Erizo (Hedgehog)':'Partida histórica relacionada: Karpov–Andersson, Milán 1975. Andersson adoptó un Erizo y liberó su posición con 24...d5!!; terminó infligiendo a Karpov su primera derrota como campeón mundial. Es una referencia clásica para comprender por qué el Erizo parece pasivo pero puede explotar de golpe.',
 'Bind de Maróczy':'Historia de la estructura: el primer antecedente conocido del esquema se remonta a Swiderski–Maróczy, Monte Carlo 1904. Décadas después, Botvinnik convirtió la restricción c4–e4 y el control de d5 en un arma posicional de primer nivel.',
 'Benoni':'Partida histórica relacionada: Spassky–Fischer, Reikiavik 1972, partida 3. Fischer eligió una Benoni Moderna y consiguió su primera victoria de toda su carrera contra Spassky; fue además un punto de inflexión del llamado “Match del Siglo”.',
 'India de Rey con centro cerrado':'Partida histórica relacionada: Najdorf–Gligoric, Mar del Plata 1953. De esa partida procede el nombre de la célebre variante Mar del Plata de la India de Rey, modelo de centro cerrado y ataques en flancos opuestos. Letelier–Fischer, Leipzig 1960, es otra referencia clásica del contrajuego negro.',
 'Cadena francesa':'Partida modelo histórica: Nimzowitsch–Salwe, Carlsbad 1911. Es uno de los ejemplos clásicos de la Francesa de Avance y del concepto de bloqueo: la lucha gira alrededor de la cadena de peones, las casillas d4/e5 y las rupturas ...c5 y ...f6.',
 'Carlsbad / estructura de dama':'Historia y partidas modelo: Pillsbury–Tarrasch, Hastings 1895, y Capablanca–Tartakower, Nueva York 1924, son clásicos del Gambito de Dama. La estructura Carlsbad hizo del ataque de minorías b4–b5 uno de los planes estratégicos más estudiados del ajedrez.',
 'Peón dama aislado (IQP)':'Partida modelo histórica: Botvinnik–Vidmar, Nottingham 1936. Es una demostración canónica de cómo el peón dama aislado puede sostener un caballo en e5, dar actividad a las piezas y preparar un ataque antes de que su debilidad estática pese en el final.',
 'Peones colgantes':'Partida histórica relacionada: Korchnoi–Karpov, Merano 1981, primera partida del Campeonato Mundial. Karpov mostró cómo usar la movilidad de los peones colgantes y transformó la posición con la ruptura temática ...d4.',
 'Stonewall (Muro de piedra)':'Historia de la estructura: el Muro de Piedra apareció ya en partidas del siglo XIX y más tarde se convirtió en un sistema estratégico importante, tanto con blancas como dentro de la Defensa Holandesa. Su esencia es el control de casillas centrales a cambio de debilidades de color.',
 'Centro cerrado o trabado':'Partida modelo histórica: Petrosian–Lutikov, URSS 1959. Es una referencia instructiva para estudiar maniobras, preparación de rupturas y ataques por los flancos cuando el centro está bloqueado.',
 'Centro abierto o simplificado':'Partida histórica relacionada: Morphy contra el duque de Brunswick y el conde Isouard, París 1858, la célebre “Partida de la Ópera”. Es un modelo clásico de desarrollo rápido, líneas abiertas, iniciativa y coordinación de piezas.',
 'Centro semiabierto y estructura dinámica':'Partida modelo relacionada: Korchnoi–Karpov, Merano 1981. La ruptura ...d4 muestra una idea esencial de las estructuras dinámicas: no basta con tener peones móviles; hay que romper cuando la apertura de líneas mejora de inmediato la actividad de las piezas.'
};

function videoHtml(v){
 var id=v[0],titulo=v[1];
 return '<div class="pc-video-es" style="margin:.35rem 0 .7rem"><div style="font-weight:700;margin:0 0 .4rem">'+titulo+'</div><div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1" title="'+titulo.replace(/"/g,'&quot;')+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div>';
}
function card(icon,title,facts){return {icon:icon,title:title,facts:facts};}
function keyFor(p,x){
 if(+p.n===116)return 'Erizo (Hedgehog)';
 var cards=x&&x.cards||[];
 for(var i=0;i<cards.length;i++){
  var t=String(cards[i].title||'');
  if(t.indexOf('Estructura: ')===0){
   var k=t.slice(12);
   if(VIDEOS[k])return k;
  }
 }
 var chips=x&&x.chips||[];
 for(var j=0;j<chips.length;j++)if(VIDEOS[chips[j]])return chips[j];
 return 'Centro semiabierto y estructura dinámica';
}
function install(){
 if(typeof window.analizarEjercicioPosicional!=='function'||!window.PC_L2_RICH_EXPLANATIONS_INSTALLED){setTimeout(install,80);return;}
 if(window.PC_L2_MODEL_VIDEOS_INSTALLED)return;
 window.PC_L2_MODEL_VIDEOS_INSTALLED=true;
 var previous=window.analizarEjercicioPosicional;
 window.analizarEjercicioPosicional=function(p){
  var x=previous(p);
  if(!p||+p.n<1||+p.n>200||!x)return x;
  var key=keyFor(p,x),vs=VIDEOS[key]||VIDEOS['Centro semiabierto y estructura dinámica'];
  var cards=(x.cards||[]).filter(function(c){var t=String(c&&c.title||'').toLowerCase();return t.indexOf('video')<0&&t.indexOf('youtube')<0&&t!=='partida de referencia';});
  if(+p.n===116){
   cards.push(card('♜','Partida del ejercicio e historia del Erizo',[
    'El ejercicio procede de Karpov–Bellón López, Linares 1981, después de 14...Cbd7. La jugada 15.b4!? impide ...Cc5 y encaja con la lógica profiláctica del Erizo.',
    HISTORIA[key]
   ]));
  }else if(HISTORIA[key]){
   cards.push(card('♜','Historia y partida modelo',[HISTORIA[key]]));
  }
  cards.push(card('▶','Videos de esta estructura y partidas modelo',vs.slice(0,3).map(videoHtml)));
  x.cards=cards;
  return x;
 };
 window.PC_L2_MODEL_VIDEOS_QA={range:'1-200',minimumVideosPerExercise:3,version:'2026-09-05-r1'};
}
install();
})();