// ── Navigation ─────────────────────────────────────────────────
function renderAll(){renderTDB();renderTechs();renderFichesSel();renderParams();}

function goTo(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  const sideEl=document.querySelector(`[data-page="${id}"]`);
  if(sideEl)sideEl.classList.add('active');
  const bnavEl=document.querySelector(`[data-bnav="${id}"]`);
  if(bnavEl)bnavEl.classList.add('active');
  if(id==='tdb')renderTDB();
  if(id==='techs')renderTechs();
  if(id==='fiches')renderFichesSel();
  if(id==='params')renderParams();
}

// Ouvre directement la fiche d'un technicien (alertes TDB, recherche globale)
function openFiche(techId){
  goTo('fiches');
  const sel=document.getElementById('fiche-sel');
  sel.value=techId;
  renderFiche();
}
