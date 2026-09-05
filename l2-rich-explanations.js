(function(){
'use strict';
if(window.PC_L2_RICH_EXPLANATIONS_INSTALLED)return;
var original=window.analizarEjercicioPosicional;
if(typeof original!=='function'||typeof Chess!=='function')return;
window.PC_L2_RICH_EXPLANATIONS_INSTALLED=true;
var F='abcdefgh',PN={p:'peón',n:'caballo',b:'alfil',r:'torre',q:'dama',k:'rey'},PS={n:'C',b:'A',r:'T',q:'D'};
function es(s){return String(s||'').replace(/^K/,'R').replace(/^Q/,'D').replace(/^R/,'T').replace(/^B/,'A').replace(/^N/,'C');}
function rv(c){return c==='w'?'b':'w';}
function piezas(g,c,t){var a=[],b=g.board();for(var r=0;r<8;r++)for(var f=0;f<8;f++){var p=b[r][f];if(p&&(!c||p.color===c)&&(!t||p.type===t))a.push({sq:F[f]+(8-r),type:p.type,color:p.color});}return a;}
function peones(g,c){return piezas(g,c,'p').map(function(x){return x.sq;});}
function tiene(g,s,c){var p=g.get(s);return !!p&&p.type==='p'&&p.color===c;}
function unir(a){a=(a||[]).filter(Boolean);return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' y '+a[a.length-1];}
function ctrPeon(s,c){var f=F.indexOf(s[0]),r=+s[1],d=c==='w'?1:-1,a=[];if(f>0&&r+d>0&&r+d<9)a.push(F[f-1]+(r+d));if(f<7&&r+d>0&&r+d<9)a.push(F[f+1]+(r+d));return a;}
function fenTurn(fen,c){var a=fen.split(' ');a[1]=c;return a.join(' ');}
function movRival(g,c){try{return new Chess(fenTurn(g.fen(),c)).moves({verbose:true});}catch(e){return [];}}
function aisladoD(g,c){var p=peones(g,c);return p.some(function(s){return s[0]==='d';})&&!p.some(function(s){return s[0]==='c'||s[0]==='e';});}
function colgantes(g,c){var p=peones(g,c),C=p.some(function(s){return s[0]==='c'&&(+s[1]===4||+s[1]===5);}),D=p.some(function(s){return s[0]==='d'&&(+s[1]===4||+s[1]===5);});return C&&D&&!p.some(function(s){return s[0]==='b'||s[0]==='e';});}
function centro(g,c){return peones(g,c).filter(function(s){return 'cdef'.includes(s[0])&&+s[1]>=3&&+s[1]<=6;});}
function estructura(g){
 if(tiene(g,'d6','b')&&tiene(g,'e6','b')&&(tiene(g,'a6','b')||tiene(g,'b6','b'))&&tiene(g,'c4','w')&&tiene(g,'e4','w'))return {n:'Erizo (Hedgehog)',por:'Las negras se encogen detrás de peones como a6, b6, d6 y e6; parecen pasivas, pero conservan “púas” en las rupturas ...b5 y ...d5.',w:'restringir ...b5 y ...d5, mejorar piezas con paciencia y ganar espacio con b4/a4 sin abrir líneas antes de tiempo',b:'completar la coordinación y liberarse con ...b5 o ...d5, presionando c4 y e4',q:['estructura Erizo ajedrez planes','Hedgehog chess structure model games','Karpov Erizo partidas modelo']};
 if(tiene(g,'c4','w')&&tiene(g,'e4','w')&&!tiene(g,'d4','w')&&(tiene(g,'d6','b')||tiene(g,'e6','b')||tiene(g,'c5','b')))return {n:'Bind de Maróczy',por:'Los peones blancos c4 y e4 sujetan d5. El nombre recuerda a Géza Maróczy y a este sistema clásico de restricción.',w:'mantener d5 bajo control, mejorar lentamente las piezas y convertir el espacio en presión',b:'buscar ...b5 o ...d5 para liberarse antes de quedar restringidas',q:['Maroczy Bind español planes','estructura Maróczy partidas modelo','Maroczy Bind model games']};
 if(tiene(g,'c4','w')&&tiene(g,'d5','w')&&tiene(g,'e4','w')&&tiene(g,'c5','b')&&(tiene(g,'d6','b')||tiene(g,'e6','b')))return {n:'Benoni',por:'Las blancas tienen la cuña c4-d5-e4 y las negras oponen ...c5 con presión sobre el centro. El espacio blanco se enfrenta al contrajuego negro.',w:'preparar e5, f4-f5 o b4 y presionar d6',b:'atacar la base del centro y buscar ...b5 o ...exd5',q:['Benoni estructura planes ajedrez','Benoni moderna partidas modelo','Modern Benoni positional plans']};
 if(tiene(g,'c4','w')&&tiene(g,'d5','w')&&tiene(g,'e4','w')&&tiene(g,'d6','b')&&tiene(g,'e5','b'))return {n:'India de Rey con centro cerrado',por:'d5/e4 contra d6/e5 bloquea el centro; por eso la lucha suele trasladarse a flancos opuestos.',w:'ganar terreno en el flanco de dama con b4-c5 y entrar por c7/d6',b:'jugar ...f5-f4 y, si procede, ...g5-g4 contra el rey',q:['India de Rey centro cerrado planes','Kings Indian pawn structure model games','India de Rey ataque flancos opuestos']};
 if(tiene(g,'d4','w')&&tiene(g,'e5','w')&&tiene(g,'d5','b')&&tiene(g,'e6','b'))return {n:'Cadena francesa',por:'d4-e5 contra d5-e6 forma la cadena típica francesa: se ataca la base de la cadena, no su punta.',w:'sostener d4 y buscar f4-f5 o ataque sobre e6',b:'presionar d4 con ...c5 y atacar e5 con ...f6',q:['cadena francesa ajedrez planes','Defensa Francesa estructura peones partidas modelo','French Defense pawn chain plans']};
 if((tiene(g,'c3','w')&&tiene(g,'d4','w')&&tiene(g,'c6','b')&&tiene(g,'d5','b')&&tiene(g,'e6','b'))||(tiene(g,'c4','w')&&tiene(g,'d4','w')&&tiene(g,'c6','b')&&tiene(g,'d5','b')))return {n:'Carlsbad / estructura de dama',por:'Esta familia se asocia al torneo de Carlsbad de 1923. La mayoría y minoría de peones determinan planes muy estables.',w:'usar b4-b5 como ataque de minorías o preparar e4 si las piezas lo permiten',b:'buscar actividad central con ...e5 o juego en el flanco de rey',q:['estructura Carlsbad ataque minorías','Carlsbad pawn structure model games','Gambito de Dama Carlsbad partidas modelo']};
 if(aisladoD(g,'w')||aisladoD(g,'b'))return {n:'Peón dama aislado (IQP)',por:'El peón d carece de peones propios en c y e. Es una debilidad estática, pero suele dar espacio, líneas abiertas y actividad.',w:'si tienes el aislado, actividad y avance d5; si juegas contra él, bloqueo y cambios',b:'si tienes el aislado, actividad y avance d4; si juegas contra él, bloqueo y cambios',q:['peón dama aislado IQP planes','isolated queen pawn model games','IQP Karpov partidas modelo']};
 if(colgantes(g,'w')||colgantes(g,'b'))return {n:'Peones colgantes',por:'Los peones c y d avanzan juntos sin peones vecinos en b/e. Son fuertes mientras son móviles y débiles si quedan fijados.',w:'coordinar piezas detrás de c/d y avanzar uno en el momento exacto',b:'bloquear, provocar un avance prematuro y atacar las casillas que queden detrás',q:['peones colgantes ajedrez planes','hanging pawns model games','estructura peones colgantes partidas modelo']};
 if((tiene(g,'c3','w')&&tiene(g,'d4','w')&&tiene(g,'e3','w')&&tiene(g,'f4','w'))||(tiene(g,'c6','b')&&tiene(g,'d5','b')&&tiene(g,'e6','b')&&tiene(g,'f5','b')))return {n:'Stonewall (Muro de piedra)',por:'La cadena c-d-e-f forma un “muro” de peones que controla casillas centrales, pero deja huecos del color contrario.',w:'usar los puestos avanzados y atacar sin olvidar el alfil malo y las casillas débiles',b:'cambiar piezas atacantes y golpear la base de la cadena',q:['Stonewall ajedrez planes','Muro de piedra partidas modelo','Stonewall pawn structure strategy']};
 var n=centro(g,'w').length+centro(g,'b').length;
 if(n>=5)return {n:'Centro cerrado o trabado',por:'Hay muchos peones centrales y pocas líneas directas; primero se maniobra y después se rompe.',w:'mejorar la peor pieza y preparar la ruptura en el flanco donde hay más espacio',b:'crear una ruptura antes de quedar sin casillas',q:['ajedrez centro cerrado planes rupturas','closed center chess positional plans','partidas modelo centro cerrado ajedrez']};
 if(n<=2)return {n:'Centro abierto o simplificado',por:'Hay pocos peones centrales; las columnas, diagonales y tiempos de desarrollo pesan más que las cadenas de peones.',w:'activar piezas y ocupar líneas abiertas sin descuidar el rey',b:'disputar las mismas líneas antes de que el rival las domine',q:['centro abierto ajedrez estrategia','open center chess positional play','partidas modelo columnas abiertas ajedrez']};
 return {n:'Centro semiabierto y estructura dinámica',por:'Quedan peones centrales, pero una ruptura puede abrir columnas o diagonales rápidamente.',w:'identificar la ruptura que mejore más piezas y cree un objetivo estable',b:'activar piezas antes de que el espacio o la coordinación del rival se consoliden',q:['estructuras de peones ajedrez planes','positional chess pawn breaks model games','ajedrez rupturas de peones partidas modelo']};
}
function restriccion(g,m){if(!m||m.piece!=='p')return null;var s=ctrPeon(m.to,m.color),cand=movRival(g,rv(m.color)).filter(function(x){return s.includes(x.to)&&x.piece!=='p'&&x.piece!=='k';});if(!cand.length)return null;cand.sort(function(a,b){return (a.piece==='n'?0:1)-(b.piece==='n'?0:1);});var x=cand[0];return {sq:x.to,from:x.from,p:x.piece,txt:'...'+(PS[x.piece]||'')+x.to};}
function linea(p){var g=new Chess(p.fen),a=[];(p.u||[]).forEach(function(u){try{var m=g.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});if(m)a.push(m);}catch(e){}});return a;}
function videoYT(id,titulo){
 return '<div class="pc-video-es" style="margin:.35rem 0 .55rem"><div style="font-weight:700;margin:0 0 .4rem">'+titulo+'</div><div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1" title="'+titulo.replace(/"/g,'&quot;')+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div>';
}
var VIDEOS_EXACTOS={
  /* Solo se agregan aquí videos verificados que correspondan a la partida exacta
     o a una explicación específica de la misma posición/estructura del ejercicio. */
};
function videosES(p,st){
 var exactos=VIDEOS_EXACTOS[+p.n];
 if(Array.isArray(exactos)&&exactos.length){
  return exactos.map(function(v){return videoYT(v.id,v.titulo);});
 }
 return [];
}
function card(i,t,f){return {icon:i,title:t,facts:f.filter(Boolean)};}
function uniqCards(a){var k={};return a.filter(function(c){if(!c||!c.title||!c.facts||!c.facts.length||k[c.title])return false;k[c.title]=1;c.facts=Array.from(new Set(c.facts));return true;});}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function especial116(p,base){
 var extra=[
 card('◎','Por qué 15.b4!?',['El peón de b4 controla c5. Esa es la idea concreta que conviene ver antes que cualquier cálculo largo.','Sin b4, el caballo negro de d7 dispone de ...Cc5: desde allí puede atacar el alfil de d3, presionar e4 y mejorar la coordinación negra.','Por eso b4 es profilaxis: Karpov no amenaza ganar material inmediatamente; primero le quita al rival una de sus mejores casillas de liberación.','Además gana espacio y prepara ideas como Cb3 y a3.']),
 card('▦','Cómo reconocer el Erizo',['Las negras están compactas detrás de peones como a6, b6, d6 y e6, mientras las blancas tienen más espacio con c4 y e4.','Las piezas negras parecen restringidas, pero la estructura es elástica: ...b5 y ...d5 pueden liberar la posición de golpe.','El blanco no debe confundir más espacio con victoria automática: una ruptura negra bien preparada cambia toda la posición.']),
 card('⌁','Por qué se llama “Erizo”',['La imagen es la de un erizo encogido: las negras ocupan poco espacio y mantienen las piezas detrás de una coraza de peones.','Las “púas” son sus rupturas y recursos tácticos, sobre todo ...b5 y ...d5.']),
 card('↔','Planes de ambos bandos',['Blancas: restringir ...b5 y ...d5, mejorar piezas, ganar espacio con b4/a4 y evitar abrir líneas sin necesidad.','Negras: completar la coordinación, presionar e4/c4 y buscar el momento exacto para ...b5 o ...d5.','La línea 15.b4!? Tac8 16.Cb3 Db8 17.a3 muestra la lógica: restricción → mejora de piezas → consolidación.']),
 card('◇','Qué debes memorizar',['b4 = quitar c5 al caballo negro.','Pregunta mental: “¿Qué quiere hacer mi rival?” → ...Cc5. “¿Puedo impedírselo?” → b4.','No es una combinación para ganar material ni una jugada única forzada; es una decisión posicional y profiláctica.']),
 card('▶','Partida de referencia',['Karpov – Bellón López, Linares 1981, después de 14...Cbd7.'])
 ];
 return Object.assign({},base,{objective:'Profilaxis: impedir ...Cc5 y restringir la liberación negra',summary:'15.b4!? es una jugada profiláctica: controla c5 y reduce el salto ...Cc5 del caballo negro. En el Erizo, las negras aceptan menos espacio a cambio de elasticidad y rupturas como ...b5 y ...d5; por eso Karpov primero limita el contrajuego y después mejora sus piezas.',cards:uniqCards(extra.concat(base.cards||[])),chips:Array.from(new Set((base.chips||[]).concat(['Erizo','profilaxis','c5','b4'])))});
}
function enriquecer(p,base){
 if(!p||!p.u||!p.u.length)return base;if(+p.n===116)return especial116(p,base);
 var g=new Chess(p.fen),a=new Chess(p.fen),u=p.u[0],m=a.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});if(!m)return base;
 var st=estructura(g),r=restriccion(g,m),li=linea(p),san=es(m.san),side=m.color==='w'?'blancas':'negras',opp=m.color==='w'?'negras':'blancas';
 var idea=[cap(side)+' juegan '+san+': el '+PN[m.piece]+' va de '+m.from+' a '+m.to+'. La pregunta no es solo “¿qué ataca?”, sino “¿qué casillas cambia y qué plan del rival limita?”.'];
 if(m.piece==='p')idea.push('Desde '+m.to+' el peón controla '+unir(ctrPeon(m.to,m.color))+'. Esas casillas explican parte del valor posicional del avance.');
 if(r)idea.push('Hay un detalle profiláctico concreto: el '+PN[r.p]+' rival de '+r.from+' tenía '+r.sq+' como casilla natural. '+san+' controla esa casilla y hace menos cómoda '+r.txt+'.');
 var op=[];if(r)op.push('Pregunta profiláctica: “si las '+opp+' tuvieran un turno gratis, ¿qué mejorarían?”. Aquí '+r.txt+' es una idea concreta que '+san+' restringe.');else op.push('Plan típico de las '+opp+' en esta estructura: '+(m.color==='w'?st.b:st.w)+'.');
 op.push('Antes de ejecutar tu plan, identifica la ruptura liberadora del rival; impedirla o hacerla desfavorable suele ser más importante que atacar de inmediato.');
 var plan=[];if(li[1])plan.push('La respuesta principal registrada es '+es(li[1].san)+'. Estudia '+san+' junto con esa reacción, no como una jugada aislada.');if(li[2])plan.push('La siguiente jugada del mismo bando es '+es(li[2].san)+'. Esa continuidad revela el plan real de la posición.');if(li[4])plan.push('Más adelante la línea incluye '+es(li[4].san)+', otra pista de la maniobra que el ejercicio quiere enseñar.');plan.push('Plan típico para las '+side+' en '+st.n+': '+(m.color==='w'?st.w:st.b)+'.');
 var mem=[r?(san+' = controlar '+r.sq+' y restringir '+r.txt+'.'):(san+' = mejorar una pieza, una ruptura o una casilla dentro de la estructura '+st.n+'.'),'No memorices solo la respuesta. Memoriza la cadena: estructura → plan rival → casilla/ruptura clave → jugada del ejercicio.','Pregunta de entrenamiento: “¿Qué haría mi rival con un turno gratis?”. Esa pregunta convierte la solución en conocimiento posicional reutilizable.'];
 var vids=videosES(p,st);var extra=[card('◎','Idea posicional de '+san,idea),card('▦','Estructura: '+st.n,[st.por,'Plan de blancas: '+st.w+'.','Plan de negras: '+st.b+'.']),card('⊘','Qué quiere el rival y qué debes vigilar',op),card('↗','Cómo continúa el plan',plan),card('◇','Qué debes memorizar',mem)];if(vids.length)extra.push(card('▶','Videos de esta partida o posición',vids));
 var obj=r?'Profilaxis: controlar '+r.sq+' y restringir '+r.txt:(base.objective||'Comprender el plan posicional de '+san);
 var sum=san+' debe entenderse dentro de '+st.n+'. '+(r?'La jugada restringe '+r.txt+' al controlar '+r.sq+'; primero reduce el contrajuego rival y luego permite continuar el plan propio. ':'Su valor está en cómo modifica la coordinación, la estructura y las casillas importantes. ')+'La clave es relacionar la jugada con la respuesta del rival y con la siguiente mejora de pieza o ruptura.';
 return Object.assign({},base,{objective:obj,summary:sum,cards:uniqCards(extra.concat(base.cards||[])),chips:Array.from(new Set((base.chips||[]).concat([st.n,r?'profilaxis':'plan posicional'].filter(Boolean))))});
}
window.analizarEjercicioPosicional=function(p){var b;try{b=original(p);}catch(e){return original(p);}if(!p||+p.n<1||+p.n>200)return b;try{var x=enriquecer(p,b);for(var i=0;i<2;i++){x.cards=uniqCards(x.cards);if(x.cards.length<6)x.cards=uniqCards((x.cards||[]).concat(b.cards||[]));if(!x.summary||x.summary.length<120)x.summary=(x.summary||'')+' '+(b.summary||'');}return x;}catch(e){console.warn('Explicación L2 enriquecida',e);return b;}};
window.PC_L2_EXPLAIN_QA={version:'2026-09-04-r5',range:'1-200',reviewPasses:2,installed:true};
})();
