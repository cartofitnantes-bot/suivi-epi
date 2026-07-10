// ── API helper ────────────────────────────────────────────────
async function sb(path, method='GET', body=null) {
  const opts = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : ''
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, opts);
  if (!r.ok) { const e = await r.text(); throw new Error(e); }
  const txt = await r.text();
  return txt ? JSON.parse(txt) : null;
}

// ── Sync status ────────────────────────────────────────────────
function setSyncStatus(state,msg){
  ['sync-dot','sync-dot-m'].forEach(id=>{const el=document.getElementById(id);if(el)el.className='sync-dot '+state;});
  const txt=document.getElementById('sync-status');if(txt)txt.textContent=msg;
  const txtm=document.getElementById('sync-status-m');if(txtm)txtm.textContent=msg;
}

// ── Chargement données ─────────────────────────────────────────
async function loadAll(){
  setSyncStatus('sync','Synchronisation…');
  try{
    const [t,e,h]=await Promise.all([
      sb('techniciens?order=nom'),
      sb('epi?order=epi_key'),
      sb('histo?order=date_ctrl.desc')
    ]);
    techs=t||[]; epiData=e||[]; histoData=h||[];
    setSyncStatus('ok','Synchronisé');
    renderAll();
  }catch(err){
    setSyncStatus('err','Hors ligne');
    // Pas de toast en cas d'erreur de connexion — indicateur visuel suffit
  }
}
