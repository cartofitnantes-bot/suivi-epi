// ── RECHERCHE GLOBALE ─────────────────────────────────────────
function toggleSearch(){
  const bar=document.getElementById('global-search-bar');
  const res=document.getElementById('global-search-results');
  const visible=bar.style.display!=='none';
  bar.style.display=visible?'none':'block';
  res.style.display='none';
  if(!visible)document.getElementById('global-search-input').focus();
}

function globalSearch(q){
  q=q.toLowerCase().trim();
  const resMobile=document.getElementById('global-search-results');
  const resDesktop=document.getElementById('global-search-results-desktop');
  if(!q){resMobile.style.display='none';return;}
  const results=[];
  techs.forEach(t=>{
    if(t.nom.toLowerCase().includes(q)||t.agence.toLowerCase().includes(q)||(t.hab||[]).some(h=>h.toLowerCase().includes(q))||(t.poste||'').toLowerCase().includes(q)){
      results.push({type:'tech',label:t.nom,sub:`${t.agence} · ${t.poste}`,action:`openFiche('${t.id}')`});
    }
    const epiMap=getEpiForTech(t.id);
    EPI_DEFS.forEach(e=>{
      const ep=epiMap[e.key];
      if(!ep||ep.etat==='X')return;
      if(e.label.toLowerCase().includes(q)||(ep.classe||'').toLowerCase().includes(q)){
        results.push({type:'epi',label:`${t.nom} — ${e.label}`,sub:`${ep.etat} · ${fmtDate(ep.ci)}`,action:`openFiche('${t.id}')`});
      }
    });
  });
  const html=results.slice(0,8).map(r=>`
    <div onclick="${r.action};toggleSearch()" style="padding:10px 14px;border-bottom:1px solid #f0f0f0;cursor:pointer;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#f7f9ff'" onmouseout="this.style.background=''">
      <span style="font-size:18px">${r.type==='tech'?'👤':'🦺'}</span>
      <div><div style="font-weight:600;font-size:13px">${r.label}</div><div style="font-size:11px;color:#666">${r.sub}</div></div>
    </div>`).join('') || '<div style="padding:14px;color:#999;font-size:13px;text-align:center">Aucun résultat</div>';
  resMobile.innerHTML=html; resMobile.style.display='block';
  if(resDesktop)resDesktop.innerHTML=html;
}
