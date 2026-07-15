// ── FICHES ─────────────────────────────────────────────────────
function renderFichesSel(){
  const actifs=techs.filter(t=>t.statut==='Actif');
  const sel=document.getElementById('fiche-sel');
  const prev=sel.value;
  sel.innerHTML=actifs.map(t=>`<option value="${t.id}">${t.nom}</option>`).join('');
  if(prev)sel.value=prev;
  renderFiche();
}

function renderFiche(){
  const id=document.getElementById('fiche-sel').value;
  const t=techs.find(x=>x.id===id);
  if(!t){document.getElementById('fiche-content').innerHTML='';return}
  const epiMap=getEpiForTech(t.id);

  const epiRows=EPI_DEFS.map(e=>{
    const ep=epiMap[e.key]||{etat:'X'};
    const s=getStatus(ep,e.type);
    const p=getPeriod(e.type,e.key);
    const cls=s==='na'?'epi-row-na':s==='nok'||s==='overdue'?'epi-row-nok':s==='soon'?'epi-row-warn':'';

    let histoBlock='';
    if(HISTO_KEYS.includes(e.key)){
      const entries=getHistoForTech(t.id,e.key);
      const nbEntries=entries.length;
      const histoRows=entries.length?entries.map(h=>{
        const resCls=h.etat==='OK'?'ok':h.etat==='NOK'?'nok':'warn';
        return`<tr><td style="padding:3px 8px;font-size:11px;border-bottom:1px solid #F3F4F6;color:var(--text-s)">${fmtDate(h.date_ctrl)}</td><td style="padding:3px 8px;font-size:11px;border-bottom:1px solid #F3F4F6"><span class="badge blue" style="font-size:10px">${h.type_ctrl}</span></td><td style="padding:3px 8px;font-size:11px;border-bottom:1px solid #F3F4F6"><span class="badge ${resCls}" style="font-size:10px">${h.etat}</span></td><td style="padding:3px 8px;font-size:11px;border-bottom:1px solid #F3F4F6;color:var(--text-s)">${h.inspecteur||'—'}</td><td style="padding:3px 8px;font-size:11px;border-bottom:1px solid #F3F4F6;color:var(--text-s)">${h.obs||'—'}</td><td style="padding:3px 6px"><button onclick="deleteHistoEntry('${h.id}')" style="background:none;border:none;cursor:pointer;color:#aaa;font-size:12px">🗑</button></td></tr>`;
      }).join(''):`<tr><td colspan="6" style="padding:6px 10px;font-size:11px;color:var(--text-s);font-style:italic">Aucune vérification</td></tr>`;
      const hid='h-'+t.id.slice(-6)+'-'+e.key;
      histoBlock=`<div style="display:contents"><div style="grid-column:1/-1;background:#F0F4FF;border-bottom:1px solid var(--border)"><div onclick="toggleHisto('${hid}')" style="display:flex;align-items:center;justify-content:space-between;padding:4px 10px;cursor:pointer;user-select:none"><span style="font-size:10px;font-weight:700;color:var(--blue)">📜 Contrôles (${nbEntries})</span><div style="display:flex;align-items:center;gap:6px"><button onclick="event.stopPropagation();openAddHistoFromFiche('${t.id}','${e.key}')" style="background:var(--blue);color:#fff;border:none;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700;cursor:pointer">+ Ajouter</button><span id="arr-${hid}" style="font-size:11px;color:var(--blue)">▶</span></div></div><div id="${hid}" style="display:none"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:3px 8px;font-size:10px;font-weight:700;color:var(--text-s);text-align:left;background:#EEF3FB;border-bottom:1px solid var(--border)">Date</th><th style="padding:3px 8px;font-size:10px;font-weight:700;color:var(--text-s);text-align:left;background:#EEF3FB;border-bottom:1px solid var(--border)">Type</th><th style="padding:3px 8px;font-size:10px;font-weight:700;color:var(--text-s);text-align:left;background:#EEF3FB;border-bottom:1px solid var(--border)">Résultat</th><th style="padding:3px 8px;font-size:10px;font-weight:700;color:var(--text-s);text-align:left;background:#EEF3FB;border-bottom:1px solid var(--border)">Inspecteur</th><th style="padding:3px 8px;font-size:10px;font-weight:700;color:var(--text-s);text-align:left;background:#EEF3FB;border-bottom:1px solid var(--border)">Obs.</th><th style="background:#EEF3FB;border-bottom:1px solid var(--border)"></th></tr></thead><tbody>${histoRows}</tbody></table></div></div></div>`;
    }
    const peremExpired = ep.perem && new Date(ep.perem) < new Date();
    const peremTxt = ep.perem ? `<span style="color:${peremExpired?'#C0392B':'#1E7E4A'};font-weight:${peremExpired?'700':'400'}">${fmtDate(ep.perem)}${peremExpired?' ⚠':''}</span>` : '—';
    return`<div style="display:contents"><div class="epi-cell ${cls}"><span class="epi-name">${e.label}</span><span class="epi-type-tag">${e.type}·${p}j</span></div><div class="epi-cell ${cls}">${ep.taille||'—'}</div><div class="epi-cell ${cls}">${ep.classe||'—'}</div><div class="epi-cell ${cls}">${fmtDate(ep.ci)}</div><div class="epi-cell ${cls}">${ep.ci?addDays(ep.ci,p):'—'}</div><div class="epi-cell ${cls}">${peremTxt}</div><div class="epi-cell ${cls}">${statusBadge(s,ep,e.type)}</div></div>${histoBlock}`;
  }).join('');

  document.getElementById('fiche-content').innerHTML=`<div class="fiche-tech"><div class="fiche-head"><div><div class="name">${t.nom}</div><div class="meta">${t.agence}·${t.poste}</div></div><div style="text-align:right"><div class="badges">${(t.hab||[]).map(h=>`<span class="badge blue" style="font-size:10px">${h}</span>`).join('')}</div><div class="meta" style="margin-top:6px">Vêt.${t.tv||'—'}·Ch.${t.tc||'—'}·Gant ${t.tg||'—'}</div></div></div><div style="display:grid;grid-template-columns:170px 80px 90px 110px 110px 100px 110px;overflow-x:auto"><div class="epi-hdr">EPI</div><div class="epi-hdr">Taille</div><div class="epi-hdr">Classe</div><div class="epi-hdr">Ctrl interne</div><div class="epi-hdr">Prochaine éch.</div><div class="epi-hdr">Péremption</div><div class="epi-hdr">Statut</div>${epiRows}</div></div>`;
}

function toggleHisto(id){
  const el=document.getElementById(id);
  const arr=document.getElementById('arr-'+id);
  if(!el)return;
  const open=el.style.display==='none';
  el.style.display=open?'table':'none';
  if(arr)arr.textContent=open?'▼':'▶';
}

// ── EPI modal ─────────────────────────────────────────────────
// Taille par défaut d'un EPI : celle indiquée sur la fiche du technicien
function tailleParDefaut(t,epiKey){
  const v=k=>(t[k]&&t[k]!=='—')?t[k]:'';
  if(epiKey.startsWith('gants'))return v('tg');
  if(epiKey==='chaussures')return v('tc');
  if(['combi','veste','pantalon'].includes(epiKey))return v('tv');
  return'';
}
function openEPIModal(){
  const id=document.getElementById('fiche-sel').value;
  const t=techs.find(x=>x.id===id);
  if(!t)return;
  const epiMap=getEpiForTech(t.id);
  document.getElementById('modal-epi-title').textContent=`EPI — ${t.nom}`;
  document.getElementById('epi-form-content').innerHTML=EPI_DEFS.map(e=>{
    const ep=epiMap[e.key]||{};
    return`<div style="border-bottom:1px solid var(--border);padding:12px 0"><div style="font-weight:700;font-size:12px;color:var(--navy);margin-bottom:8px">${e.label} <span style="font-size:10px;color:var(--text-s);font-weight:400">${e.type}·${getPeriod(e.type,e.key)}j</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><div class="form-group"><label>Taille/Dim.</label><input name="epi_${e.key}_taille" value="${ep.taille||tailleParDefaut(t,e.key)}"></div><div class="form-group"><label>Classe/Tension</label><select name="epi_${e.key}_classe"><option value="">—</option><option${ep.classe==='Classe 00'?' selected':''}>Classe 00</option><option${ep.classe==='Classe 0'?' selected':''}>Classe 0</option><option${ep.classe==='Classe 1'?' selected':''}>Classe 1</option><option${ep.classe==='Classe 2'?' selected':''}>Classe 2</option><option${ep.classe==='Classe 3'?' selected':''}>Classe 3</option><option${ep.classe==='Classe 4'?' selected':''}>Classe 4</option><option${ep.classe==='1000V'?' selected':''}>1000V</option><option${ep.classe==='750V'?' selected':''}>750V</option><option${ep.classe==='690V'?' selected':''}>690V</option><option${ep.classe==='ATEX'?' selected':''}>ATEX</option><option${ep.classe&&!['Classe 00','Classe 0','Classe 1','Classe 2','Classe 3','Classe 4','1000V','750V','690V','ATEX',''].includes(ep.classe)?' selected':''} value="${ep.classe||''}">${ep.classe||'Autre'}</option></select></div><div class="form-group"><label>Date achat</label><input name="epi_${e.key}_achat" value="${ep.achat||''}" placeholder="MM/AAAA"></div><div class="form-group"><label>Ctrl interne</label><input type="date" name="epi_${e.key}_ci" value="${ep.ci||''}"></div><div class="form-group"><label>Ctrl externe</label><input type="date" name="epi_${e.key}_ce" value="${ep.ce||''}"></div><div class="form-group"><label>État</label><select name="epi_${e.key}_etat">${selOpts(ETATS,ep.etat||'X')}</select></div><div class="form-group"><label>Date péremption</label><input type="date" name="epi_${e.key}_perem" value="${ep.perem||''}" title="Date limite de vie de l'EPI"></div></div></div>`;
  }).join('');
  document.getElementById('modal-epi').classList.add('open');
}
function closeEPIModal(){document.getElementById('modal-epi').classList.remove('open')}

async function saveEPI(){
  const id=document.getElementById('fiche-sel').value;
  const t=techs.find(x=>x.id===id);if(!t)return;
  const m=document.getElementById('epi-form-content');
  const epiMap=getEpiForTech(t.id);
  const ops=[];
  EPI_DEFS.forEach(e=>{
    const g=f=>(m.querySelector(`[name="epi_${e.key}_${f}"]`)?.value||'');
    const existing=epiData.find(x=>x.tech_id===t.id&&x.epi_key===e.key);
    const row={tech_id:t.id,epi_key:e.key,achat:g('achat'),taille:g('taille'),classe:g('classe'),ci:g('ci')||null,ce:g('ce')||null,etat:g('etat'),perem:g('perem')||null};
    if(existing){ops.push(sb(`epi?id=eq.${existing.id}`,'PATCH',row));}
    else{ops.push(sb('epi','POST',row));}
  });
  try{setSyncStatus('sync','Sauvegarde…');await Promise.all(ops);closeEPIModal();await loadAll();renderFiche();toast('✅ EPI mis à jour');}
  catch(e){toast('❌ Erreur : '+e.message)}
}

// ── Histo ─────────────────────────────────────────────────────
function openAddHistoFromFiche(techId,epiKey){
  const actifs=techs.filter(t=>t.statut==='Actif');
  document.getElementById('h-tech').innerHTML=actifs.map(t=>`<option value="${t.id}">${t.nom}</option>`).join('');
  document.getElementById('h-tech').value=techId;
  document.getElementById('h-epi').value=epiKey;
  document.getElementById('h-date').value=new Date().toISOString().split('T')[0];
  document.getElementById('h-obs').value='';
  document.getElementById('h-etat').value='OK';
  document.getElementById('h-inspecteur').innerHTML=`<option value="">— Choisir —</option>`+actifs.map(t=>`<option value="${t.nom}">${t.nom}</option>`).join('');
  document.getElementById('modal-histo').classList.add('open');
}
function closeHistoModal(){document.getElementById('modal-histo').classList.remove('open')}

async function saveHisto(){
  const date=document.getElementById('h-date').value;
  const techId=document.getElementById('h-tech').value;
  if(!date||!techId){alert('Technicien et date obligatoires');return}
  const epiKey=document.getElementById('h-epi').value;
  const etat=document.getElementById('h-etat').value;
  const obsText=document.getElementById('h-obs').value.trim();
  const row={tech_id:techId,epi_key:epiKey,type_ctrl:document.getElementById('h-type').value,date_ctrl:date,etat,inspecteur:document.getElementById('h-inspecteur').value,obs:obsText};
  // Mettre à jour aussi la date ctrl sur l'EPI
  const existing=epiData.find(x=>x.tech_id===techId&&x.epi_key===epiKey);
  const update=row.type_ctrl==='Interne'?{ci:date,etat}:{ce:date,etat};
  try{
    setSyncStatus('sync','Sauvegarde…');
    await sb('histo','POST',row);
    if(existing){
      await sb(`epi?id=eq.${existing.id}`,'PATCH',update);
    } else {
      // Créer la ligne EPI si elle n'existe pas encore
      const newEpi={tech_id:techId,epi_key:epiKey,etat,...update};
      await sb('epi','POST',newEpi);
    }
    closeHistoModal();await loadAll();renderFiche();toast('✅ Vérification enregistrée');
  }catch(e){toast('❌ Erreur : '+e.message)}
}

async function deleteHistoEntry(id){
  if(!confirm('Supprimer cette vérification ?'))return;
  try{setSyncStatus('sync','Suppression…');await sb(`histo?id=eq.${id}`,'DELETE');await loadAll();renderFiche();toast('🗑 Supprimé');}
  catch(e){toast('❌ Erreur : '+e.message)}
}
