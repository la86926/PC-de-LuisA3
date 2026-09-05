(function(){
'use strict';
if(window.PC_L2_EXACT_VIDEO_OVERRIDES)return;
window.PC_L2_EXACT_VIDEO_OVERRIDES=true;

/* Videos comprobados de la partida original del ejercicio. Español primero;
   inglés solo cuando no se encontró una opción equivalente en español. */
var EXACT={
  2:[['1J6kBbrc6FE','Steinitz vs Blackburne — Londres 1862, partida 1','en']],
  4:[['NSwfLNYLQ3A','Steinitz vs Sellman, Baltimore 1885 — partida completa','en'],['wpbwhL4cVaY','Steinitz vs Sellman, Baltimore 1885','en']],
  5:[['nqxYpmsU1WY','Zukertort vs Steinitz — partida 13, Mundial 1886','en']],
  6:[['nqxYpmsU1WY','Zukertort vs Steinitz — partida 13, Mundial 1886','en']],
  7:[['L3Yy9miuhZA','Lasker vs Bauer, Ámsterdam 1889 — Partidas Inmortales','es'],['Zd0wL1_Lvwo','Lasker vs Bauer, Ámsterdam 1889 — análisis','es'],['IQXxNR8qXCM','Lasker vs Bauer, Amsterdam 1889 — análisis completo','en']],
  10:[['Xh52obbC6OU','Lasker vs Steinitz — partida 3, Mundial 1896-97','en']],
  20:[['2wOYNCq4IqU','Alekhine vs Rubinstein, La Haya 1921 — partida comentada','en']],
  27:[['bqE5fmjpUQM','Alekhine vs Nimzowitsch, Nueva York 1927','en']],
  29:[['lNLIckYikoU','Bogoljubow vs Alekhine — partida 8, Mundial 1929','en']],
  30:[['GvSD6hiQRas','Yates vs Alekhine, San Remo 1930 — análisis de la partida','en']],
  34:[['SIp4_yyB_nM','Lasker vs Capablanca, Moscú 1935','en']],
  36:[['BwQQJwoHkp0','Alekhine vs Alexander, Nottingham 1936 — análisis','en'],['AMNvbaWsNws','Alekhine vs Alexander, Nottingham 1936 — partida','en'],['ktsLBynein8','Alekhine vs Alexander, Nottingham 1936 — Bogo-India','en']],
  44:[['LkLDAJLnLUg','Petrosian vs Vaitonis, Saltsjöbaden 1952','en']],
  58:[['UPXXvoQ3jNo','Smyslov vs Trifunovic, Zagreb 1955','en']],
  62:[['EGYXCbieLyU','Smyslov vs Botvinnik — partida 14, Moscú 1957','en']],
  70:[['i_ra9Yu5uLI','Botvinnik vs Tal — partida 17, Moscú 1961','en']],
  84:[['sVl9-4iV-Ug','Spassky vs Petrosian 1969 — contexto y análisis de la partida 5','en']],
  90:[['uAndXBjl9Q8','Spassky vs Fischer — partida 5, Reikiavik 1972 — Partidas Inmortales','es'],['S2bgAOET5vs','Spassky vs Fischer — partida 5, Reikiavik 1972','en']],
  91:[['jqGSdaaiJYw','Spassky vs Fischer — partida 17, Reikiavik 1972 — Partidas Inmortales','es'],['3nGMipBaW8c','Spassky vs Fischer — partida 17, Reikiavik 1972','en']],
  92:[['cLJYnRxqxoc','Karpov vs Browne, San Antonio 1972 — partida completa','en'],['ezU_ezee23w','Karpov vs Browne, San Antonio 1972','en']],
  95:[['9YWUvcGmIdQ','Kasparov vs Vasilchenko, Kiev 1973','en']],
  98:[['m0j23vpr-nQ','Karpov vs Spassky — partida 9, Leningrado 1974','en']],
  103:[['N1VIqzJuQG8','Vaganian vs Karpov, Moscú 1976','en']],
  105:[['NCznfrDDC9g','Karpov vs Hort, Bugojno 1978 — partida completa','en']],
  108:[['IxoGhopJtFI','Karpov vs Ljubojevic, Montreal 1979','en']],
  120:[['tg9s6mLnH1o','Korchnoi vs Kasparov, Lucerna 1982 — partida completa','en'],['7GGQDxY__aY','Korchnoi vs Kasparov, Lucerna 1982 — análisis','en'],['TZ3x2nWJsr8','Korchnoi vs Kasparov, Olimpiada de Lucerna 1982','en']],
  132:[['FvdVzW036pQ','Karpov vs Timman, Bruselas 1986','en']],
  136:[['CfK6tFv2SRg','Karpov vs Ribli, Olimpiada de Dubái 1986','en']],
  147:[['FmpWeeIQJ7A','Karpov vs Ljubojevic, Linares 1989 — partida completa','en'],['j6rZE2wodTE','Karpov vs Ljubojevic, Linares 1989 — ataque de minorías, partida comentada','en']],
  150:[['TO-JHwCJNxY','Piket vs Kasparov, Tilburg 1989 — India de Rey','en']],
  166:[['SdHCJIfYI7c','Kramnik vs Nunn, Olimpiada de Manila 1992','en']],
  173:[['2VPzggTh4NI','Kramnik vs Kasparov, Moscú Rapid 1994','en']],
  184:[['Wa1k4hGDOUY','Morozevich vs Anand, Moscú 1995','en']],
  185:[['YxfN8-XLgXI','Kramnik vs Short, Dortmund 1995','en']],
  196:[['zeb4FJSP5a4','Kramnik vs Dreev, Linares 1997 — ronda 9','en']]
};

function videoHtml(v){
 var id=v[0],titulo=v[1],lang=v[2]||'es';
 var idioma=lang==='en'?' · Inglés':'';
 return '<div class="pc-video-es" style="margin:.35rem 0 .7rem"><div style="font-weight:700;margin:0 0 .4rem">'+titulo+idioma+'</div><div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1" title="'+titulo.replace(/"/g,'&quot;')+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div>';
}
function card(icon,title,facts){return {icon:icon,title:title,facts:facts};}
function install(){
 if(typeof window.analizarEjercicioPosicional!=='function'||!window.PC_L2_MODEL_VIDEOS_INSTALLED){setTimeout(install,80);return;}
 if(window.PC_L2_EXACT_VIDEO_OVERRIDES_INSTALLED)return;
 window.PC_L2_EXACT_VIDEO_OVERRIDES_INSTALLED=true;
 var previous=window.analizarEjercicioPosicional;
 window.analizarEjercicioPosicional=function(p){
  var x=previous(p);
  if(!p||+p.n<1||+p.n>200||!x)return x;
  var n=+p.n,exact=EXACT[n]||[];
  var cards=(x.cards||[]).filter(function(c){return String(c&&c.title||'')!=='Videos de la partida original';});
  if(n===116){
   for(var h=0;h<cards.length;h++){
    if(String(cards[h]&&cards[h].title||'')==='Partida original del ejercicio'){
     var facts=Array.isArray(cards[h].facts)?cards[h].facts.slice():[];
     facts.push('Contexto histórico: Bellón, con negras, hizo tablas con Karpov en 60 jugadas en la octava ronda de Linares 1981. Una crónica de EL PAÍS destacó la valiente lucha de Bellón en el medio juego y que Karpov tuvo que mantenerse a la defensiva en la fase final.');
     cards[h]=card(cards[h].icon||'♜',cards[h].title,facts);
     break;
    }
   }
  }
  if(exact.length){
   var pos=cards.findIndex(function(c){return String(c&&c.title||'').indexOf('Para comprender la estructura')===0;});
   var nueva=card('▶','Videos de la partida original',exact.map(videoHtml));
   if(pos<0)cards.push(nueva);else cards.splice(pos,0,nueva);
  }
  x.cards=cards;
  return x;
 };
 window.PC_L2_EXACT_VIDEO_QA={range:'1-200',version:'2026-09-05-r5',verifiedOnly:true,spanishFirst:true,englishFallback:true};
}
install();
})();