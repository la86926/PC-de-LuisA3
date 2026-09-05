import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp, runTransaction
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCGcl98D7288m_iyOWlc_ffTISg85-LVpw',
  authDomain: 'chess86926.firebaseapp.com',
  projectId: 'chess86926',
  storageBucket: 'chess86926.firebasestorage.app',
  messagingSenderId: '341510503521',
  appId: '1:341510503521:web:b2afc3127bcd78326a7e20',
  measurementId: 'G-KVZQ4ET5KH'
};

const COLLECTION = 'progresos';
const SYNC_CODE_KEY = 'pc_cloud_sync_code_v1';
const CLIENT_KEY = 'pc_cloud_sync_client_v1';
const DEVICE_MODE_KEY = 'pc_modo_dispositivo_v1';
const PAGE1_KEY = 'pc_backup_page_state_v2:index1.html';
const PAGE2_KEY = 'pc_backup_page_state_v2:index2.html';
const CODE_RE = /^[A-Za-z0-9]{4,32}$/;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentCode = '';
let currentRef = null;
let stopSnapshot = null;
let applyingRemote = false;
let uploadTimer = null;
let pendingScopes = new Set();
let lastUploadAt = 0;
let statusState = 'busy';
let statusText = 'Conectando…';

function makeClientId(){
  try{
    let id=localStorage.getItem(CLIENT_KEY);
    if(id)return id;
    id=(crypto&&crypto.randomUUID)?crypto.randomUUID():'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
    localStorage.setItem(CLIENT_KEY,id);
    return id;
  }catch(e){return 'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
}
const clientId=makeClientId();

function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,function(ch){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];});
}
function cleanCode(value){return String(value||'').trim();}
function codeId(value){return cleanCode(value).toLowerCase();}
function validCode(value){return CODE_RE.test(cleanCode(value));}
function randomCode(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=new Uint8Array(12);
  try{crypto.getRandomValues(bytes);}catch(e){for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);}
  return Array.from(bytes,b=>alphabet[b%alphabet.length]).join('');
}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms));}

function isExcludedKey(key){
  return !key || key===SYNC_CODE_KEY || key===CLIENT_KEY || key===DEVICE_MODE_KEY || key.indexOf('pc_cloud_sync_')===0;
}
function isL2Key(key){
  return !isExcludedKey(key) && (key.indexOf('wp2_')===0 || key===PAGE2_KEY);
}
function isL1Key(key){
  if(isExcludedKey(key)||isL2Key(key))return false;
  return key.indexOf('wp_')===0 || key.indexOf('pc_')===0;
}
function scopeForKey(key){
  if(isL2Key(key))return 'l2';
  if(isL1Key(key))return 'l1';
  return null;
}
function captureStorage(scope){
  const out={};
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      const include=scope==='l2'?isL2Key(key):isL1Key(key);
      if(include)out[key]=localStorage.getItem(key);
    }
  }catch(e){}
  return out;
}
function readPage(scope){
  const key=scope==='l2'?PAGE2_KEY:PAGE1_KEY;
  try{
    const raw=localStorage.getItem(key);
    const obj=raw?JSON.parse(raw):null;
    return obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:{};
  }catch(e){return {};}
}
function captureScope(scope){
  return {storage:captureStorage(scope),page:readPage(scope)};
}
function captureProfile(){
  return {l1:captureScope('l1'),l2:captureScope('l2')};
}

function clearCookie(name){
  try{document.cookie=encodeURIComponent(name)+'=;Max-Age=0;path=/;SameSite=Lax';}catch(e){}
  try{
    const base=location.pathname.replace(/[^/]*$/,'')||'/';
    document.cookie=encodeURIComponent(name)+'=;Max-Age=0;path='+base+';SameSite=Lax';
  }catch(e){}
}
function clearAllAppState(){
  const keys=[];
  try{for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));}catch(e){}
  keys.forEach(key=>{
    if(isL1Key(key)||isL2Key(key)){
      try{localStorage.removeItem(key);}catch(e){}
      clearCookie(key);
    }
  });
  try{
    (document.cookie||'').split(/;\s*/).forEach(part=>{
      const idx=part.indexOf('=');
      const key=decodeURIComponent(idx>=0?part.slice(0,idx):part);
      if(isL1Key(key)||isL2Key(key))clearCookie(key);
    });
  }catch(e){}
  try{window.dispatchEvent(new StorageEvent('storage',{key:'pc_modo',newValue:null}));}catch(e){}
}

function applyStorage(scope,remote){
  const changed=[];
  const map=(remote&&typeof remote==='object'&&!Array.isArray(remote))?remote:{};
  const existing=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if((scope==='l2'?isL2Key(key):isL1Key(key)))existing.push(key);
    }
  }catch(e){}
  existing.forEach(key=>{
    if(!Object.prototype.hasOwnProperty.call(map,key)){
      try{localStorage.removeItem(key);changed.push(key);}catch(e){}
    }
  });
  Object.keys(map).forEach(key=>{
    if(!(scope==='l2'?isL2Key(key):isL1Key(key)))return;
    const value=map[key]==null?'':String(map[key]);
    try{
      if(localStorage.getItem(key)!==value){localStorage.setItem(key,value);changed.push(key);}
    }catch(e){}
  });
  return changed;
}

function injectBridge(frame){
  try{
    const docu=frame&&frame.contentDocument;
    if(!docu||!docu.head||docu.getElementById('pc-cloud-frame-bridge'))return;
    const script=docu.createElement('script');
    script.id='pc-cloud-frame-bridge';
    script.src=new URL('pc-frame-cloud-bridge.js',location.href).href+'?v=3';
    docu.head.appendChild(script);
  }catch(e){}
}
function installFrameBridges(){
  document.querySelectorAll('.app-frame').forEach(frame=>{
    frame.addEventListener('load',()=>setTimeout(()=>injectBridge(frame),0));
    try{if(frame.contentDocument&&frame.contentDocument.readyState!=='loading')injectBridge(frame);}catch(e){}
  });
}
function callBridge(frameId,payload,method='apply'){
  const frame=document.getElementById(frameId);
  const run=()=>{
    try{
      injectBridge(frame);
      const bridge=frame&&frame.contentWindow&&frame.contentWindow.PCCloudFrameBridge;
      if(bridge&&typeof bridge[method]==='function'){bridge[method](payload);return true;}
    }catch(e){}
    return false;
  };
  if(!run())setTimeout(run,140);
}
function resetFrames(){
  callBridge('app-frame-1',null,'reset');
  callBridge('app-frame-2',null,'reset');
}

async function applyRemote(data){
  if(!data||typeof data!=='object')return;
  applyingRemote=true;
  clearTimeout(uploadTimer);
  pendingScopes.clear();
  try{
    const c1=applyStorage('l1',data.l1&&data.l1.storage);
    const c2=applyStorage('l2',data.l2&&data.l2.storage);
    const changed=[...new Set(c1.concat(c2))];

    const active=localStorage.getItem('pc_l3_active_app');
    if(active==='1'||active==='2'){
      const button=document.querySelector('.app-choice[data-app="'+active+'"]');
      if(button&&!button.classList.contains('active'))button.click();
    }

    callBridge('app-frame-1',{page:(data.l1&&data.l1.page)||{},changedKeys:changed});
    callBridge('app-frame-2',{page:(data.l2&&data.l2.page)||{},changedKeys:changed});
    setStatus('Sincronizado','ok');
  }finally{
    setTimeout(()=>{applyingRemote=false;},650);
  }
}

function setStatus(text,state){
  statusText=text;
  statusState=state||'busy';
  const fab=document.getElementById('pc-sync-fab');
  if(fab){fab.dataset.state=statusState;fab.title=currentCode?('Sincronización · '+statusText):'Configurar sincronización';}
  const line=document.getElementById('pc-sync-live-status');
  if(line){line.className='pc-sync-statusline '+statusState;line.innerHTML='<i></i><span>'+escapeHtml(statusText)+'</span>';}
}

function queueUpload(scope){
  if(!currentRef||applyingRemote||!scope)return;
  pendingScopes.add(scope);
  clearTimeout(uploadTimer);
  setStatus('Guardando…','busy');
  uploadTimer=setTimeout(pushPending,420);
}
async function pushPending(){
  if(!currentRef||applyingRemote||!pendingScopes.size)return;
  const scopes=[...pendingScopes];
  pendingScopes.clear();
  const patch={timestamp:serverTimestamp(),updatedBy:clientId,schemaVersion:1};
  if(scopes.includes('l1'))patch.l1=captureScope('l1');
  if(scopes.includes('l2'))patch.l2=captureScope('l2');
  try{
    lastUploadAt=Date.now();
    await setDoc(currentRef,patch,{merge:true});
    setStatus('Sincronizado','ok');
  }catch(e){
    console.error('PC cloud sync:',e);
    setStatus('Error al guardar','error');
  }
}

function stopListening(){
  if(stopSnapshot){try{stopSnapshot();}catch(e){}stopSnapshot=null;}
}
function startListening(){
  stopListening();
  if(!currentRef)return;
  stopSnapshot=onSnapshot(currentRef,snapshot=>{
    if(!snapshot.exists()){
      setStatus('Perfil no disponible','error');
      return;
    }
    if(snapshot.metadata&&snapshot.metadata.hasPendingWrites){
      setStatus('Guardando…','busy');
      return;
    }
    const data=snapshot.data();
    if(data&&data.updatedBy===clientId&&Date.now()-lastUploadAt<1800){
      setStatus('Sincronizado','ok');
      return;
    }
    applyRemote(data);
  },error=>{
    console.error('PC cloud sync listener:',error);
    setStatus('Sin conexión','error');
  });
}

async function refFor(code){return doc(db,COLLECTION,codeId(code));}
async function connectExisting(code,snapshot){
  code=cleanCode(code);
  const ref=await refFor(code);
  const snap=snapshot||await getDoc(ref);
  if(!snap.exists())throw new Error('Ese código no existe.');
  stopListening();
  applyingRemote=true;
  currentCode=code;
  currentRef=ref;
  try{localStorage.setItem(SYNC_CODE_KEY,currentCode);}catch(e){}
  await applyRemote(snap.data());
  startListening();
  closeModal();
  setStatus('Sincronizado','ok');
}

async function createCurrentProfile(code){
  code=cleanCode(code);
  const ref=await refFor(code);
  const existing=await getDoc(ref);
  if(existing.exists()){await connectExisting(code,existing);return;}
  const state=captureProfile();
  await setDoc(ref,{...state,timestamp:serverTimestamp(),updatedBy:clientId,schemaVersion:1});
  currentCode=code;
  currentRef=ref;
  try{localStorage.setItem(SYNC_CODE_KEY,currentCode);}catch(e){}
  startListening();
  closeModal();
  setStatus('Sincronizado','ok');
}

async function createFreshProfile(code){
  code=cleanCode(code);
  const ref=await refFor(code);
  const existing=await getDoc(ref);
  if(existing.exists()){await connectExisting(code,existing);return;}
  stopListening();
  applyingRemote=true;
  clearAllAppState();
  resetFrames();
  const l1=document.querySelector('.app-choice[data-app="1"]');
  if(l1&&!l1.classList.contains('active'))l1.click();
  await wait(180);
  const state=captureProfile();
  await setDoc(ref,{...state,timestamp:serverTimestamp(),updatedBy:clientId,schemaVersion:1});
  currentCode=code;
  currentRef=ref;
  try{localStorage.setItem(SYNC_CODE_KEY,currentCode);}catch(e){}
  applyingRemote=false;
  startListening();
  closeModal();
  setStatus('Sincronizado','ok');
}

async function switchCode(code){
  code=cleanCode(code);
  if(!validCode(code))throw new Error('Usa solo letras y números, entre 4 y 32 caracteres.');
  if(codeId(code)===codeId(currentCode))return;
  const ref=await refFor(code);
  const snap=await getDoc(ref);
  if(!snap.exists())throw new Error('Ese código no existe.');
  stopListening();
  applyingRemote=true;
  clearAllAppState();
  currentCode=code;
  currentRef=ref;
  try{localStorage.setItem(SYNC_CODE_KEY,currentCode);}catch(e){}
  await applyRemote(snap.data());
  startListening();
  closeModal();
}

async function renameCode(nextCode){
  nextCode=cleanCode(nextCode);
  if(!validCode(nextCode))throw new Error('Usa solo letras y números, entre 4 y 32 caracteres.');
  if(!currentRef||!currentCode)throw new Error('No hay un perfil activo.');
  if(codeId(nextCode)===codeId(currentCode))throw new Error('Es el mismo código.');
  const oldRef=currentRef;
  const newRef=await refFor(nextCode);
  await runTransaction(db,async tx=>{
    const oldSnap=await tx.get(oldRef);
    if(!oldSnap.exists())throw new Error('El perfil actual ya no existe.');
    const newSnap=await tx.get(newRef);
    if(newSnap.exists())throw new Error('Ese nuevo código ya existe.');
    const data=oldSnap.data();
    tx.set(newRef,{...data,timestamp:serverTimestamp(),updatedBy:clientId,schemaVersion:1});
    tx.delete(oldRef);
  });
  stopListening();
  currentCode=nextCode;
  currentRef=newRef;
  try{localStorage.setItem(SYNC_CODE_KEY,currentCode);}catch(e){}
  startListening();
  showSettings();
  setStatus('Sincronizado','ok');
}

function ensureUi(){
  if(document.getElementById('pc-sync-root'))return;
  const root=document.createElement('div');
  root.id='pc-sync-root';
  root.innerHTML=`
    <button id="pc-sync-fab" class="pc-sync-fab" data-state="busy" type="button" aria-label="Sincronización" title="Sincronización">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 18.2h9.4a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.5-1.6A4.8 4.8 0 0 0 7.2 18.2Z"/><path d="m9.2 13.1 1.7 1.7 3.9-4.2"/></svg><span class="pc-sync-dot"></span>
    </button>
    <div id="pc-sync-modal-bg" class="pc-sync-modal-bg" aria-hidden="true"><div id="pc-sync-modal" class="pc-sync-modal" role="dialog" aria-modal="true"></div></div>`;
  document.body.appendChild(root);
  document.getElementById('pc-sync-fab').addEventListener('click',()=>currentCode?showSettings():showCodeModal());
  document.getElementById('pc-sync-modal-bg').addEventListener('click',e=>{if(e.target.id==='pc-sync-modal-bg')closeModal();});
}
function openModal(html){
  ensureUi();
  const modal=document.getElementById('pc-sync-modal');
  modal.innerHTML=html;
  const bg=document.getElementById('pc-sync-modal-bg');
  bg.classList.add('open');bg.setAttribute('aria-hidden','false');
  modal.querySelectorAll('[data-pc-sync-close]').forEach(b=>b.addEventListener('click',closeModal));
}
function closeModal(){
  const bg=document.getElementById('pc-sync-modal-bg');
  if(bg){bg.classList.remove('open');bg.setAttribute('aria-hidden','true');}
}
function head(title,subtitle,closable=true){
  return `<div class="pc-sync-head"><div class="pc-sync-head-text"><h3>${escapeHtml(title)}</h3>${subtitle?`<p>${escapeHtml(subtitle)}</p>`:''}</div>${closable?'<button class="pc-sync-x" type="button" data-pc-sync-close aria-label="Cerrar">×</button>':''}</div>`;
}
function message(el,text,type=''){
  if(!el)return;
  el.className='pc-sync-msg '+type;
  el.textContent=text||'';
}

function showCodeModal(prefill=''){
  openModal(head('Código de sincronización','Un solo código guardará PC de L1 y PC de L2.')+`
    <label class="pc-sync-field"><span>CÓDIGO</span><input id="pc-sync-code-input" class="pc-sync-input" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="32" placeholder="Ej. Luis09" value="${escapeHtml(prefill)}"></label>
    <div class="pc-sync-row"><button id="pc-sync-generate" class="pc-sync-btn" type="button">Generar código</button><button id="pc-sync-continue" class="pc-sync-btn primary" type="button">Continuar</button></div>
    <p class="pc-sync-note">Solo letras y números. Un código largo es más difícil de adivinar.</p><div id="pc-sync-msg" class="pc-sync-msg"></div>`);
  const input=document.getElementById('pc-sync-code-input');
  const go=document.getElementById('pc-sync-continue');
  const msg=document.getElementById('pc-sync-msg');
  document.getElementById('pc-sync-generate').onclick=()=>{input.value=randomCode();input.focus();input.select();};
  const submit=async()=>{
    const code=cleanCode(input.value);
    if(!validCode(code)){message(msg,'Usa solo letras y números, entre 4 y 32 caracteres.','error');return;}
    go.disabled=true;message(msg,'Comprobando…');
    try{
      const ref=await refFor(code);
      const snap=await getDoc(ref);
      if(snap.exists())await connectExisting(code,snap);else showNewCodeChoice(code);
    }catch(e){message(msg,e&&e.message?e.message:'No se pudo conectar.','error');go.disabled=false;}
  };
  go.onclick=submit;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  setTimeout(()=>input.focus(),20);
}

function showNewCodeChoice(code){
  openModal(head('Código nuevo','Todavía no existe un perfil con este código.')+`
    <div class="pc-sync-code">${escapeHtml(code)}</div>
    <button id="pc-sync-keep" class="pc-sync-btn primary" style="width:100%;margin-bottom:9px" type="button">Vincular y conservar datos actuales</button>
    <button id="pc-sync-fresh" class="pc-sync-btn" style="width:100%" type="button">Iniciar perfil desde cero</button>
    <div id="pc-sync-msg" class="pc-sync-msg"></div>`);
  const msg=document.getElementById('pc-sync-msg');
  document.getElementById('pc-sync-keep').onclick=async function(){
    this.disabled=true;message(msg,'Guardando tu avance actual…');
    try{await createCurrentProfile(code);}catch(e){message(msg,e&&e.message?e.message:'No se pudo crear el perfil.','error');this.disabled=false;}
  };
  document.getElementById('pc-sync-fresh').onclick=()=>showFreshConfirm(code);
}

function showFreshConfirm(code){
  openModal(head('Iniciar desde cero','Confirma antes de restablecer este dispositivo.')+`
    <div class="pc-sync-warning"><strong>Aviso:</strong> Se restablecerá el avance visible en este dispositivo</div>
    <div class="pc-sync-row"><button class="pc-sync-btn" type="button" id="pc-sync-back">Cancelar</button><button class="pc-sync-btn danger" type="button" id="pc-sync-confirm-fresh">Restablecer y crear</button></div>
    <div id="pc-sync-msg" class="pc-sync-msg"></div>`);
  document.getElementById('pc-sync-back').onclick=()=>showNewCodeChoice(code);
  const btn=document.getElementById('pc-sync-confirm-fresh');
  const msg=document.getElementById('pc-sync-msg');
  btn.onclick=async()=>{
    btn.disabled=true;message(msg,'Restableciendo…');
    try{await createFreshProfile(code);}catch(e){applyingRemote=false;message(msg,e&&e.message?e.message:'No se pudo crear el perfil.','error');btn.disabled=false;}
  };
}

function copyCode(){
  const text=currentCode;
  if(!text)return Promise.resolve(false);
  if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(text).then(()=>true);
  return new Promise(resolve=>{
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{resolve(document.execCommand('copy'));}catch(e){resolve(false);}finally{ta.remove();}
  });
}

function showSettings(){
  openModal(head('Sincronización','Un perfil para PC de L1 y PC de L2.')+`
    <div class="pc-sync-section"><h4>Código activo</h4><div class="pc-sync-code">${escapeHtml(currentCode||'Sin código')}</div><div id="pc-sync-live-status" class="pc-sync-statusline ${statusState}"><i></i><span>${escapeHtml(statusText)}</span></div><div class="pc-sync-row" style="margin-top:12px"><button id="pc-sync-copy" class="pc-sync-btn" type="button">Copiar código</button></div><div id="pc-sync-copy-msg" class="pc-sync-msg"></div></div>
    <div class="pc-sync-sep"></div>
    <div class="pc-sync-section"><h4>Cambiar a otro código existente</h4><label class="pc-sync-field"><input id="pc-sync-switch-input" class="pc-sync-input" autocomplete="off" maxlength="32" placeholder="Código existente"></label><button id="pc-sync-switch" class="pc-sync-btn primary" style="width:100%" type="button">Cambiar código</button><div id="pc-sync-switch-msg" class="pc-sync-msg"></div></div>
    <div class="pc-sync-sep"></div>
    <div class="pc-sync-section"><h4>Renombrar código actual</h4><label class="pc-sync-field"><input id="pc-sync-rename-input" class="pc-sync-input" autocomplete="off" maxlength="32" placeholder="Nuevo código"></label><button id="pc-sync-rename" class="pc-sync-btn" style="width:100%" type="button">Renombrar</button><div id="pc-sync-rename-msg" class="pc-sync-msg"></div></div>`);

  document.getElementById('pc-sync-copy').onclick=async()=>{
    const ok=await copyCode();message(document.getElementById('pc-sync-copy-msg'),ok?'Código copiado.':'No se pudo copiar.',ok?'ok':'error');
  };
  document.getElementById('pc-sync-switch').onclick=async function(){
    const msg=document.getElementById('pc-sync-switch-msg');
    const code=cleanCode(document.getElementById('pc-sync-switch-input').value);
    this.disabled=true;message(msg,'Comprobando…');
    try{await switchCode(code);}catch(e){message(msg,e&&e.message?e.message:'No se pudo cambiar.','error');this.disabled=false;}
  };
  document.getElementById('pc-sync-rename').onclick=async function(){
    const msg=document.getElementById('pc-sync-rename-msg');
    const code=cleanCode(document.getElementById('pc-sync-rename-input').value);
    this.disabled=true;message(msg,'Renombrando…');
    try{await renameCode(code);}catch(e){message(msg,e&&e.message?e.message:'No se pudo renombrar.','error');this.disabled=false;}
  };
}

function installChangeWatchers(){
  window.addEventListener('storage',e=>{
    if(applyingRemote||!e||!e.key)return;
    const scope=scopeForKey(e.key);
    if(scope)queueUpload(scope);
  });
  document.addEventListener('click',e=>{
    if(!currentRef||applyingRemote)return;
    if(e.target.closest&&e.target.closest('.app-choice'))setTimeout(()=>queueUpload('l1'),10);
    if(e.target.closest&&e.target.closest('#tema button'))setTimeout(()=>queueUpload('l1'),10);
  },true);
  window.addEventListener('pagehide',()=>{
    if(currentRef&&!applyingRemote){pendingScopes.add('l1');pendingScopes.add('l2');pushPending();}
  });
}

async function boot(){
  ensureUi();
  installFrameBridges();
  installChangeWatchers();
  setStatus('Conectando…','busy');
  try{
    await signInAnonymously(auth);
  }catch(e){
    console.error('PC cloud auth:',e);
    setStatus('Sin conexión','error');
    return;
  }
  let stored='';
  try{stored=cleanCode(localStorage.getItem(SYNC_CODE_KEY));}catch(e){}
  if(stored&&!validCode(stored)){
    try{localStorage.removeItem(SYNC_CODE_KEY);}catch(e){}
    stored='';
  }
  if(!stored){
    currentCode='';currentRef=null;setStatus('Sin código','busy');showCodeModal();return;
  }
  try{
    const ref=await refFor(stored);
    const snap=await getDoc(ref);
    if(snap.exists())await connectExisting(stored,snap);else{currentCode='';currentRef=null;setStatus('Código pendiente','busy');showNewCodeChoice(stored);}
  }catch(e){
    console.error('PC cloud boot:',e);
    setStatus('Sin conexión','error');
  }
}

boot();
