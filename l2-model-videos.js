(function(){
'use strict';
if(window.PC_L2_MODEL_VIDEOS)return;
window.PC_L2_MODEL_VIDEOS=true;

/* La partida original es la referencia principal de cada ejercicio. */
var GAMES=[null,
'Steinitz – Robey, London 1862',
'Steinitz – Blackburne, London (1) 1862',
'Steinitz – MacDonnell, Dublin 1865',
'Steinitz – Sellman, Baltimore 1885',
'Zukertort – Steinitz, USA (13) 1886',
'Zukertort – Steinitz, USA (13) 1886',
'Lasker – Bauer, Amsterdam 1889',
'Lasker – Steinitz, St. Petersburg 1895',
'Steinitz – Lasker, St. Petersburg 1895',
'Steinitz – Lasker, Moscow (3) 1896',
'Lasker – Maroczy, London 1899',
'Blackburne – Lasker, London 1899',
'Lasker – Mackay, Great Britain (Simul) 1908',
'Lasker – Cohn, St. Petersburg 1909',
'Alekhine – Cohn, Karlovy Vary 1911',
'Znosko-Borovsky – Alekhine, St. Petersburg 1913',
'Ed. Lasker – Alekhine, Scheveningen 1913',
'Mieses – Alekhine, Mannheim 1914',
'Alekhine – Teichmann, Berlin 1921',
'Alekhine – Rubinstein, The Hague 1921',
'Alekhine – Tarrasch, Hastings 1922',
'Bogoljubow – Capablanca, New York 1924',
'Alekhine – Dusek, Czechoslovakia (Simul) 1925',
'Spielmann – Euwe, Wiesbaden 1925',
'Alekhine – Grünfeld, Semmering 1926',
'Kmoch – Alekhine, Semmering 1926',
'Alekhine – Nimzowitsch, New York 1927',
'Kmoch – Alekhine, Kecskemet 1927',
'Bogoljubow – Alekhine, Germany/Netherlands (8) 1929',
'Yates – Alekhine, San Remo 1930',
'Bogoljubow – Alekhine, Germany (11) 1934',
'Alekhine – Nimzowitsch, Zurich 1934',
'Alekhine – Johner, Zurich 1934',
'Lasker – Capablanca, Moscow 1935',
'Lasker – Bogoljubow, Nottingham 1936',
'Alekhine – Alexander, Nottingham 1936',
'Lasker – Alexander, Nottingham 1936',
'Euwe – Alekhine, Netherlands (21) 1937',
'Alekhine – Capablanca, Netherlands 1938',
'Alekhine – Flohr, Netherlands 1938',
'Georgadse – Petrosian, Tbilisi 1945',
'Smyslov – Lilienthal, Budapest 1950',
'Szabo – Petrosian, Saltsjobaden 1952',
'Petrosian – Vaitonis, Saltsjobaden 1952',
'Taimanov – Petrosian, Gagra (Training) 1953',
'Geller – Smyslov, Zurich 1953',
'Smyslov – Keres, Zurich 1953',
'Stahlberg – Petrosian, Zurich 1953',
'Smyslov – Botvinnik, Moscow (17) 1954',
'Botvinnik – Smyslov, Moscow (18) 1954',
'Vesterinen – Smyslov, Amsterdam (Ol) 1954',
'Czerniak – Smyslov, Amsterdam (Ol) 1954',
'Fairhurst – Smyslov, Hastings 1955',
'Furman – Spassky, Moscow 1955',
'Smyslov – Geller, Moscow 1955',
'Smyslov – Ivkov, Zagreb 1955',
'Fuderer – Smyslov, Zagreb 1955',
'Smyslov – Trifunovic, Zagreb 1955',
'Karaklajic – Smyslov, Zagreb 1955',
'Spassky – Ravinsky, Leningrad 1957',
'Taimanov – Spassky, Moscow 1957',
'Smyslov – Botvinnik, Moscow (14) 1957',
'Tal – Dittmann, Reykjavik 1957',
'Petrosian – Taimanov, Leningrad 1959',
'Donner – Tal, Zurich 1959',
'Spassky – Lutikov, Tbilisi 1959',
'Geller – Tal, Tbilisi 1959',
'Klasups – Tal, Riga (Ol) 1959',
'Najdorf – Fischer, Mar del Plata 1959',
'Botvinnik – Tal, Moscow (17) 1961',
'Petrosian – Botvinnik, Moscow (15) 1963',
'Smyslov – Ciocaltea, Sochi 1963',
'Petrosian – Olafsson, Los Angeles 1963',
'Petrosian – Dreyer, Tel Aviv (Ol) 1964',
'Smyslov – Carrean, Tel Aviv (Ol) 1964',
'Karpov – Ravinsky, Leningrad 1966',
'Larsen – Petrosian, Santa Monica 1966',
'Petrosian – Jimenez Zerquera, Havana (Ol) 1966',
'Karpov – Lilein, Leningrad 1967',
'Petrosian – Estrin, Moscow 1968',
'Buslaev – Smyslov, Riga 1968',
'Mecking – Spassky, Palma de Mallorca 1969',
'Smyslov – Hort, Monte Carlo 1969',
'Spassky – Petrosian, Moscow (5) 1969',
'Karpov – Rashkovsky, Kuibyshev 1970',
'Hort – Petrosian, Kapfenberg 1970',
'Tal – Kolarov, Kapfenberg 1970',
'Korchnoi – Petrosian, Moscow 1971',
'Petrosian – Jansa, Sarajevo 1972',
'Spassky – Fischer, Reykjavik (5) 1972',
'Spassky – Fischer, Reykjavik (17) 1972',
'Karpov – Browne, San Antonio 1972',
'Petrosian – K. Smith, San Antonio 1972',
'Evans – Karpov, San Antonio 1972',
'Kasparov – Vasilchenko, Kyiv 1973',
'Rashkovsky – Tal, Sochi 1973',
'Tal – Szabo, Sochi 1973',
'Karpov – Spassky, Leningrad (9) 1974',
'Tal – Vaganian, Riga 1975',
'Karpov – Spassky, Riga 1975',
'Smyslov – Weinstein, Lone Pine 1976',
'Karpov – Kavalek, Montilla 1976',
'Vaganian – Karpov, Moscow 1976',
'Hort – Petrosian, Hastings 1977',
'Karpov – Hort, Bugojno 1978',
'Pavlenko – Kasparov, USSR 1979',
'Petrosian – Najdorf, Buenos Aires 1979',
'Karpov – Ljubojevic, Montreal 1979',
'Sosonko – Karpov, Waddinxveen 1979',
'Tal – Kasparov, Minsk 1979',
'Smyslov – Koch, Los Polvorines 1980',
'Karpov – Hübner, Bad Kissingen 1980',
'Petrosian – Torre, Moscow 1981',
'Karpov – Smyslov, Moscow 1981',
'Gulko – Kasparov, Frunze 1981',
'Karpov – Bellon Lopez, Linares 1981',
'Karpov – Franco Ocampos, Mar del Plata 1982',
'Portisch – Petrosian, Tilburg 1982',
'Andersson – Karpov, Tilburg 1982',
'Korchnoi – Kasparov, Lucerne (Ol) 1982',
'Agzamov – Karpov, Moscow 1983',
'Agzamov – Karpov, Moscow 1983',
'Razuvaev – Tal, Moscow 1983',
'Chandler – Anand, London 1984',
'Hübner – Smyslov, Tilburg 1984',
'Van der Wiel – Anand, Thessaloniki (Ol) 1984',
'Karpov – Martinovic, Amsterdam 1985',
'Anand – Howell, Sharjah 1985',
'Khalifman – Kengis, Minsk 1985',
'Tal – Rozentalis, Volgograd 1985',
'Anand – Jansa, Kolkata 1986',
'Karpov – Timman, Brussels 1986',
'Moussa – Anand, Doha 1986',
'Marin – Anand, Oakham 1986',
'Kasparov – Lutz, Frankfurt (Simul) 1986',
'Karpov – Ribli, Dubai (Ol) 1986',
'Kasparov – Torre, Brussels (Blitz) 1987',
'Arnason – Tal, Jurmala 1987',
'Kasparov – Short, Brussels 1987',
'Karpov – Kasparov, Seville (9) 1987',
'Karpov – Ehlvest, Mazatlan (Rapid) 1988',
'Spassky – Hort, Germany 1988',
'Karpov – Van der Wiel, Tilburg 1988',
'Kasparov – Andersson, Belfort 1988',
'Khalifman – Lau, Rotterdam 1988',
'Anand – Larsen, Cannes 1989',
'Karpov – Ljubojevic, Linares 1989',
'Yusupov – Karpov, London (6) 1989',
'Haik – Kasparov, Evry (Simul) 1989',
'Piket – Kasparov, Tilburg 1989',
'Anand – Arakhamia-Grant, Oakham 1990',
'Anand – Gurevich, Wijk aan Zee 1990',
'Karpov – Kasparov, Lyon/New York (5) 1990',
'Kramnik – Ostojic, Leningrad 1991',
'Spassky – Koch, Montpellier 1991',
'Smyslov – Blasek, Gelsenkirchen 1991',
'Topalov – Dochev, Pazardzik 1991',
'Karpov – Anand, Brussels (2) 1991',
'Karpov – Salov, Reykjavik 1991',
'Lindstedt – Kramnik, Maringa 1991',
'Karpov – Anand, Brussels (8) 1991',
'Kasparov – Garrido Fernandez, Cordoba (Simul) 1992',
'Kasparov – Tejero, Cordoba (Simul) 1992',
'Anand – Bareev, Dortmund 1992',
'Kamsky – Kasparov, Manila (Ol) 1992',
'Kramnik – Nunn, Manila (Ol) 1992',
'Kveinys – Kramnik, Debrecen 1992',
'Karpov – Lobron, Baden-Baden 1992',
'Kasparov – Dubiel, Katowice (Simul) 1993',
'Karpov – Timman, Moscow (Blitz) 1993',
'Kramnik – Short, Amsterdam 1993',
'Oll – Topalov, Groningen 1993',
'Kramnik – Kasparov, Moscow (Rapid) 1994',
'Salov – Spassky, Montpellier 1994',
'Oll – Kasparov, Moscow (Ol) 1994',
'Karpov – Polgar, Alma-Ata (Blitz) 1995',
'Hracek – Khalifman, Germany 1995',
'Anand – Kamsky, Las Palmas (3) 1995',
'Aseev – Khalifman, St. Petersburg 1995',
'Anand – Kamsky, Las Palmas 1995',
'Kamsky – Anand, Las Palmas (10) 1995',
'Karpov – Piket, Monte Carlo (Rapid) 1995',
'Ponomariov – Firman, Kyiv 1995',
'Morozevich – Anand, Moscow (Rapid) 1995',
'Kramnik – Short, Dortmund 1995',
'Vaganian – Kasparov, Horgen 1995',
'Kasparov – Frolik, Internet (Simul) 1995',
'Karpov – Fritz, The Hague 1996',
'Karpov – Salov, Belgrade 1996',
'Ulibin – Khalifman, Elista 1996',
'Anand – Timman, Amsterdam 1996',
'Kasparov – Kramnik, Amsterdam 1996',
'Short – Kramnik, Moscow (Rapid) 1996',
'Shirov – Topalov, Dortmund 1996',
'Kasparov – Maroulis, Corfu (Simul) 1996',
'Kramnik – Dreev, Linares 1997',
'Gelfand – Topalov, Novgorod 1997',
'Karpov – Mephisto, Gelsenkirchen (Rapid) 1997',
'Ptacnikova – Khalifman, Sweden 1997',
'Karpov – Adianto, Jakarta (4) 1997'
];

/* Videos verificados de la partida exacta. Español primero; inglés solo como alternativa. */
var EXACT={
  4:[['NSwfLNYLQ3A','Steinitz vs Sellman, Baltimore 1885 — partida completa','en']],
  5:[['nqxYpmsU1WY','Zukertort vs Steinitz — partida 13, Mundial 1886','en']],
  6:[['nqxYpmsU1WY','Zukertort vs Steinitz — partida 13, Mundial 1886','en']],
  7:[['L3Yy9miuhZA','Lasker vs Bauer, Ámsterdam 1889 — Partidas Inmortales','es'],['Zd0wL1_Lvwo','Lasker vs Bauer, Ámsterdam 1889 — análisis','es'],['IQXxNR8qXCM','Lasker vs Bauer, Amsterdam 1889 — análisis completo','en']],
  29:[['lNLIckYikoU','Bogoljubow vs Alekhine — partida 8, Mundial 1929','en']],
  36:[['BwQQJwoHkp0','Alekhine vs Alexander, Nottingham 1936','en']],
  44:[['LkLDAJLnLUg','Petrosian vs Vaitonis, Saltsjobaden 1952','en']],
  62:[['EGYXCbieLyU','Smyslov vs Botvinnik — partida 14, Moscú 1957','en']],
  70:[['i_ra9Yu5uLI','Botvinnik vs Tal — partida 17, Moscú 1961','en']],
  90:[['uAndXBjl9Q8','Spassky vs Fischer — partida 5, Reikiavik 1972 — Partidas Inmortales','es'],['S2bgAOET5vs','Spassky vs Fischer — game 5, Reykjavik 1972','en']],
  91:[['jqGSdaaiJYw','Spassky vs Fischer — partida 17, Reikiavik 1972 — Partidas Inmortales','es'],['3nGMipBaW8c','Spassky vs Fischer — game 17, Reykjavik 1972','en']],
  98:[['m0j23vpr-nQ','Karpov vs Spassky — partida 9, Leningrado 1974','en']],
  103:[['N1VIqzJuQG8','Vaganian vs Karpov, Moscú 1976','en']],
  108:[['IxoGhopJtFI','Karpov vs Ljubojevic, Montreal 1979','en']],
  120:[['tg9s6mLnH1o','Korchnoi vs Kasparov, Lucerna 1982 — partida completa','en'],['7GGQDxY__aY','Korchnoi vs Kasparov, Lucerne 1982 — análisis','en']]
};

/* Material secundario: solo explica la misma estructura detectada en la posición. */
var STRUCTURE={
 'Erizo (Hedgehog)':[
  ['XmgU77nn-sk','Entendemos la estructura Erizo! — Davinin'],
  ['_w_inEOPS-c','Diferentes formas de enfrentar con blancas el Sistema Erizo — Ajedrez Con Boudy']
 ],
 'Bind de Maróczy':[
  ['dg4rYedWfm4','Estructura Maróczy vs Dragón Acelerado — Luis Fernández Siles'],
  ['g7z9JoNbUaA','Lazo de Maróczy: un plan fácil de recordar — Academia de Ajedrez a Distancia'],
  ['OogTSfYaSfE','Luchando contra el Maróczy — ChessTeacher']
 ],
 'Benoni':[
  ['PWjW-cZOV-k','Plan posicional contra la Benoni — Pupilochess']
 ],
 'India de Rey con centro cerrado':[
  ['Nz7nxyd4T7c','Defensa India de Rey: planes en el centro cerrado — Ajedrez con David Esti'],
  ['d-yFg_Lfb1g','Najdorf–Gligoric y el plan de la India de Rey — Ajedrez con David Esti']
 ],
 'Cadena francesa':[
  ['lRYSyp7vAug','Defensa Francesa: cadenas, rupturas y planes']
 ],
 'Carlsbad / estructura de dama':[
  ['ZPU_OQUXGqc','Estructura Carlsbad y ataque de minorías — Dama Roja 150'],
  ['u1jjSLWfSK8','Ataque de minorías en la estructura Carlsbad — Academia de Ajedrez a Distancia'],
  ['SsCcJBj8x1Q','Ideas temáticas de la estructura Carlsbad']
 ],
 'Peón dama aislado (IQP)':[
  ['vJemxsp27aI','Cómo jugar contra el peón dama aislado — Chess and Mind en Español']
 ],
 'Peones colgantes':[
  ['B_Emz4zHa-I','Ganar con los peones colgantes — Academia de Ajedrez a Distancia'],
  ['bzJVRdrsCoU','Jugar contra los peones colgantes — Luis Fernández Siles']
 ],
 'Stonewall (Muro de piedra)':[
  ['CVuD2-EokZc','Muro de Piedra — Ajedrez Con Sergio'],
  ['4KWxJByL37Q','Muro de Piedra para principiantes — Ajedrez Con Sergio'],
  ['emy1YXOYUhQ','El sólido Muro de Piedra para jugadores estratégicos — ChessTeacher']
 ]
};

function videoHtml(v){
 var id=v[0],titulo=v[1],lang=v[2]||'es';
 var idioma=lang==='en'?' · Inglés':'';
 return '<div class="pc-video-es" style="margin:.35rem 0 .7rem"><div style="font-weight:700;margin:0 0 .4rem">'+titulo+idioma+'</div><div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1" title="'+titulo.replace(/"/g,'&quot;')+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div>';
}
function card(icon,title,facts){return {icon:icon,title:title,facts:facts};}
function keyFor(p,x){
 if(+p.n===116)return 'Erizo (Hedgehog)';
 var cards=x&&x.cards||[];
 for(var i=0;i<cards.length;i++){
  var t=String(cards[i].title||'');
  if(t.indexOf('Estructura: ')===0){var k=t.slice(12);if(STRUCTURE[k])return k;}
 }
 var chips=x&&x.chips||[];
 for(var j=0;j<chips.length;j++)if(STRUCTURE[chips[j]])return chips[j];
 return null;
}
function limpiarTarjetas(cards){
 return (cards||[]).filter(function(c){
  var t=String(c&&c.title||'').toLowerCase();
  if(t.indexOf('video')>=0||t.indexOf('youtube')>=0)return false;
  if(t==='partida de referencia')return false;
  if(t.indexOf('historia y partida modelo')>=0)return false;
  if(t.indexOf('partida del ejercicio e historia')>=0)return false;
  return true;
 });
}
function install(){
 if(typeof window.analizarEjercicioPosicional!=='function'||!window.PC_L2_RICH_EXPLANATIONS_INSTALLED){setTimeout(install,80);return;}
 if(window.PC_L2_MODEL_VIDEOS_INSTALLED)return;
 window.PC_L2_MODEL_VIDEOS_INSTALLED=true;
 var previous=window.analizarEjercicioPosicional;
 window.analizarEjercicioPosicional=function(p){
  var x=previous(p);
  if(!p||+p.n<1||+p.n>200||!x)return x;
  var n=+p.n,game=GAMES[n],key=keyFor(p,x),exact=EXACT[n]||[],secondary=key?(STRUCTURE[key]||[]):[];
  var cards=limpiarTarjetas(x.cards);
  if(game){
   var historia=['La posición de este ejercicio procede de: '+game+'.'];
   if(n===116)historia.push('En esta partida, después de 14...Cbd7, Karpov jugó 15.b4!?, impidiendo ...Cc5: la idea profiláctica central del ejercicio.');
   cards.push(card('♜','Partida original del ejercicio',historia));
  }
  if(exact.length){
   cards.push(card('▶','Videos de la partida original',exact.map(videoHtml)));
  }
  if(secondary.length){
   var usados={};exact.forEach(function(v){usados[v[0]]=1;});
   var sec=secondary.filter(function(v){return !usados[v[0]];}).slice(0,3);
   if(sec.length)cards.push(card('◎','Para comprender la estructura de esta posición',sec.map(videoHtml)));
  }
  x.cards=cards;
  x.chips=Array.from(new Set((x.chips||[]).concat(game?['partida original']:[])));
  return x;
 };
 window.PC_L2_MODEL_VIDEOS_QA={range:'1-200',version:'2026-09-05-r2',exactGamePriority:true,spanishFirst:true,englishFallback:true,noUnrelatedHistory:true};
}
install();
})();