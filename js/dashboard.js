// ── TDB ────────────────────────────────────────────────────────
function renderTDB(){
  const agenceFilter=(document.getElementById('tdb-agence-filter')?.value||'');
  const actifs=techs.filter(t=>t.statut==='Actif'&&(!agenceFilter||t.agence===agenceFilter));
  let nok=0,soon=0,ok=0,alerts=[];
  actifs.forEach(t=>{
    const epiMap=getEpiForTech(t.id);
    EPI_DEFS.forEach(e=>{
      const s=getStatus(epiMap[e.key],e.type);
      if(s==='nok'||s==='overdue'){nok++;alerts.push({t,e,s,ep:epiMap[e.key]});}
      else if(s==='soon'){soon++;alerts.push({t,e,s,ep:epiMap[e.key]});}
      else if(s==='ok')ok++;
    });
  });
  document.getElementById('stats-grid').innerHTML=`
    <div class="stat-card"><div class="stat-icon red">🚨</div><div><div class="num red">${nok}</div><div class="lbl">EPI NOK / dépassés</div></div></div>
    <div class="stat-card"><div class="stat-icon orange">⏰</div><div><div class="num orange">${soon}</div><div class="lbl">Contrôles à prévoir</div></div></div>
    <div class="stat-card"><div class="stat-icon green">✅</div><div><div class="num green">${ok}</div><div class="lbl">EPI conformes</div></div></div>
    <div class="stat-card"><div class="stat-icon blue">👥</div><div><div class="num blue">${actifs.length}</div><div class="lbl">Techniciens actifs</div></div></div>`;
  document.getElementById('alert-count').textContent=alerts.length;
  document.getElementById('alert-count').className='badge '+(alerts.length>0?'nok':'ok');
  const al=document.getElementById('alerts-list');
  al.innerHTML=alerts.length?alerts.map(({t,e,s,ep})=>{
    const p=getPeriod(e.type,e.key),ds=daysSince(ep.ci);
    const msg=s==='nok'?`État : ${ep.etat}`:s==='overdue'?`Dépassé de ${ds-p}j`:`Échéance dans ${p-ds}j`;
    return`<div class="alert-item ${s==='soon'?'warn':'nok'}" onclick="openFiche('${t.id}')" title="Ouvrir la fiche de ${t.nom}"><span style="font-size:16px">${s==='soon'?'⏰':'🚨'}</span><div><div class="a-main">${t.nom} — ${e.label}</div><div class="a-sub">${msg}</div></div><span class="a-badge">${statusBadge(s,ep,e.type)}</span></div>`;
  }).join(''):'<div class="empty-state"><div class="empty-icon">✅</div>Aucune alerte active</div>';
  document.getElementById('tdb-tech-table').innerHTML=`<table><thead><tr><th>Technicien</th><th>Agence</th><th>Alertes</th><th>Statut</th></tr></thead><tbody>${
    actifs.map(t=>{
      const al=alerts.filter(a=>a.t.id===t.id).length;
      return`<tr onclick="openFiche('${t.id}')" style="cursor:pointer" title="Ouvrir la fiche"><td><strong>${t.nom}</strong></td><td>${t.agence}</td><td>${al>0?('<span class="badge '+(al>2?'nok':'warn')+'">'+al+'</span>'):'<span class="badge ok">0</span>'}</td><td><span class="badge ${al===0?'ok':al<=2?'warn':'nok'}">${al===0?'Conforme':al<=2?'À surveiller':'Non conforme'}</span></td></tr>`;
    }).join('')
  }</tbody></table>`;
}
