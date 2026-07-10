// ── Utils ──────────────────────────────────────────────────────
function getPeriod(type,epiKey){
  if(epiKey && params.epi && params.epi[epiKey]) return params.epi[epiKey];
  return params[type]||params.autre;
}
function daysSince(s){if(!s)return null;const d=new Date(s);if(isNaN(d))return null;return Math.floor((Date.now()-d)/86400000)}
function addDays(s,n){if(!s)return'—';const d=new Date(s);if(isNaN(d))return'—';d.setDate(d.getDate()+n);return d.toLocaleDateString('fr-FR')}
function fmtDate(s){if(!s)return'—';const d=new Date(s);if(isNaN(d))return s;return d.toLocaleDateString('fr-FR')}
function selOpts(arr,val){return arr.map(o=>`<option${o===val?' selected':''}>${o}</option>`).join('')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}

// EPI par technicien (index rapide)
function getEpiForTech(techId){
  const map={};
  epiData.filter(e=>e.tech_id===techId).forEach(e=>{map[e.epi_key]=e});
  EPI_DEFS.forEach(d=>{if(!map[d.key])map[d.key]={epi_key:d.key,achat:'',taille:'',classe:'',ci:'',ce:'',etat:'X'}});
  return map;
}
function getHistoForTech(techId,epiKey=null){
  return histoData.filter(h=>h.tech_id===techId&&(!epiKey||h.epi_key===epiKey))
    .sort((a,b)=>b.date_ctrl.localeCompare(a.date_ctrl));
}

function getStatus(ep,type){
  if(!ep)return'na';
  const{ci,etat}=ep;
  if(!etat||etat==='X')return'na';
  if(etat==='NOK'||etat==='A changer')return'nok';
  const p=getPeriod(type,null),ds=daysSince(ci);
  if(ds===null)return'missing';
  if(ds>p)return'overdue';
  if(ds>p-params.precoce)return'soon';
  return'ok';
}
function statusBadge(s,ep,type){
  if(s==='na')return'<span class="badge na">—</span>';
  if(s==='nok')return`<span class="badge nok">${ep.etat}</span>`;
  if(s==='missing')return'<span class="badge warn">? date</span>';
  const p=getPeriod(type,null),ds=daysSince(ep.ci);
  if(s==='overdue')return`<span class="badge nok">+${ds-p}j</span>`;
  if(s==='soon')return`<span class="badge warn">${p-ds}j</span>`;
  return'<span class="badge ok">OK</span>';
}
