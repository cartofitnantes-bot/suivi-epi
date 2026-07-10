// ── TECHS ──────────────────────────────────────────────────────
let editingTechId = null;

function renderTechs(){
  const q=(document.getElementById('search-tech').value||'').toLowerCase();
  const filtered=techs.filter(t=>!q||t.nom.toLowerCase().includes(q)||t.agence.toLowerCase().includes(q));
  const isMobile = window.innerWidth <= 768;
  const techCard = document.querySelector('#page-techs .card');
  if(!techCard) return;
  if(isMobile){
    techCard.innerHTML = filtered.map(t=>`
      <div style="padding:14px 16px;border-bottom:1px solid #F3F4F6;${t.statut==='Inactif'?'opacity:.5':''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-weight:700;font-size:15px">${t.nom}</div>
            <div style="font-size:12px;color:var(--text-s);margin-top:2px">${t.agence} · ${t.poste}</div>
          </div>
          <span class="badge ${t.statut==='Actif'?'ok':'na'}">${t.statut}</span>
        </div>
        <div style="font-size:11px;color:var(--text-s);margin-bottom:10px">${(t.hab||[]).join(' · ')||'—'}</div>
        <div style="font-size:11px;color:var(--text-s);margin-bottom:12px">Vêt. ${t.tv||'—'} · Ch. ${t.tc||'—'} · Gant ${t.tg||'—'} · Entrée : ${fmtDate(t.entree)}</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1;padding:10px" onclick="openTechModal('${t.id}')">✏️ Modifier</button>
          <button class="btn btn-danger" style="padding:10px 14px" onclick="deleteTech('${t.id}')">🗑</button>
        </div>
      </div>`).join('') || '<div class="empty-state"><div class="empty-icon">👥</div>Aucun technicien</div>';
  } else {
    techCard.innerHTML = `<table><thead><tr><th>Nom</th><th>Agence</th><th>Poste</th><th>Habilitations</th><th>Tailles</th><th>Entrée</th><th>Statut</th><th></th></tr></thead>
      <tbody>${filtered.map(t=>`
        <tr class="${t.statut==='Inactif'?'inactif-row':''}">
          <td><strong>${t.nom}</strong></td><td>${t.agence}</td><td>${t.poste}</td>
          <td style="font-size:11px">${(t.hab||[]).join(', ')}</td>
          <td style="font-size:11px">Vêt.${t.tv||'—'} Ch.${t.tc||'—'} G.${t.tg||'—'}</td>
          <td>${fmtDate(t.entree)}</td>
          <td><span class="badge ${t.statut==='Actif'?'ok':'na'}">${t.statut}</span></td>
          <td style="white-space:nowrap">
            <button class="btn btn-sm" onclick="openTechModal('${t.id}')">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTech('${t.id}')" style="margin-left:4px">🗑</button>
          </td>
        </tr>`).join('')}
      </tbody></table>`;
  }
}

function initTechForm(){
  document.getElementById('t-agence').innerHTML=AGENCES.map(a=>`<option>${a}</option>`).join('');
  document.getElementById('t-poste').innerHTML=POSTES.map(p=>`<option>${p}</option>`).join('');
  document.getElementById('t-tv').innerHTML=TAILLES_VET.map(v=>`<option>${v}</option>`).join('');
  document.getElementById('t-tc').innerHTML=TAILLES_CH.map(v=>`<option>${v}</option>`).join('');
  document.getElementById('t-tg').innerHTML=TAILLES_GANT.map(v=>`<option>${v}</option>`).join('');
  document.getElementById('hab-checks').innerHTML=HABILITATIONS.map(h=>`<label><input type="checkbox" value="${h}"> ${h}</label>`).join('');
}

function openTechModal(id){
  editingTechId=id||null;
  document.getElementById('modal-tech-title').textContent=id?'Modifier le technicien':'Nouveau technicien';
  initTechForm();
  if(id){
    const t=techs.find(x=>x.id===id);
    document.getElementById('t-nom').value=t.nom;
    document.getElementById('t-agence').value=t.agence;
    document.getElementById('t-poste').value=t.poste;
    document.getElementById('t-statut').value=t.statut;
    document.getElementById('t-entree').value=t.entree||'';
    document.getElementById('t-depart').value=t.depart||'';
    document.getElementById('t-obs').value=t.obs||'';
    document.getElementById('t-tv').value=t.tv||'—';
    document.getElementById('t-tc').value=t.tc||'—';
    document.getElementById('t-tg').value=t.tg||'—';
    document.querySelectorAll('#hab-checks input').forEach(cb=>{cb.checked=(t.hab||[]).includes(cb.value)});
  }else{
    ['t-nom','t-obs','t-depart'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('t-entree').value=new Date().toISOString().split('T')[0];
  }
  document.getElementById('modal-tech').classList.add('open');
}
function closeTechModal(){document.getElementById('modal-tech').classList.remove('open')}

async function saveTech(){
  const nom=document.getElementById('t-nom').value.trim();
  if(!nom){alert('Le nom est obligatoire');return}
  const data={
    nom, agence:document.getElementById('t-agence').value,
    poste:document.getElementById('t-poste').value,
    statut:document.getElementById('t-statut').value,
    entree:document.getElementById('t-entree').value||null,
    depart:document.getElementById('t-depart').value||null,
    obs:document.getElementById('t-obs').value,
    tv:document.getElementById('t-tv').value,
    tc:document.getElementById('t-tc').value,
    tg:document.getElementById('t-tg').value,
    hab:[...document.querySelectorAll('#hab-checks input:checked')].map(c=>c.value)
  };
  try{
    setSyncStatus('sync','Sauvegarde…');
    if(editingTechId){
      await sb(`techniciens?id=eq.${editingTechId}`,'PATCH',data);
    }else{
      await sb('techniciens','POST',data);
    }
    closeTechModal();await loadAll();
    toast(editingTechId?'✅ Technicien mis à jour':'✅ Technicien ajouté');
  }catch(e){toast('❌ Erreur : '+e.message)}
}

async function deleteTech(id){
  const t=techs.find(x=>x.id===id);
  if(!confirm(`Supprimer ${t.nom} ?`))return;
  try{
    setSyncStatus('sync','Suppression…');
    await sb(`techniciens?id=eq.${id}`,'DELETE');
    await loadAll();toast('🗑 Technicien supprimé');
  }catch(e){toast('❌ Erreur : '+e.message)}
}
