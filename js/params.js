// ── Params ────────────────────────────────────────────────────
function renderParams(){
  const epiRows = EPI_DEFS.map(e => `
    <div class="param-row">
      <label>${e.label}<span class="param-desc">${e.type}</span></label>
      <input type="number" id="pepi-${e.key}" min="1" value="${(params.epi&&params.epi[e.key])||getPeriod(e.type,null)}">
      <span class="param-unit">jours</span>
    </div>`).join('');

  document.getElementById('params-content').innerHTML = `
    <div class="card" style="max-width:580px;margin-bottom:16px">
      <div class="card-header"><h2>⏱ Périodicité par EPI</h2></div>
      <div style="padding:16px 18px">${epiRows}</div>
    </div>
    <div class="card" style="max-width:580px">
      <div class="card-header"><h2>⚙️ Réglages généraux</h2></div>
      <div style="padding:16px 18px">
        <div class="param-row"><label>Alerte précoce<span class="param-desc">Avertissement avant la date limite</span></label><input type="number" id="p-precoce" min="1" value="${params.precoce}"><span class="param-unit">jours avant</span></div>
        <div style="margin-top:16px"><button class="btn btn-primary" onclick="saveParams()">✔ Enregistrer</button></div>
      </div>
    </div>`;
}

function saveParams(){
  if(!params.epi) params.epi = {};
  EPI_DEFS.forEach(e => {
    const val = +document.getElementById('pepi-'+e.key)?.value;
    if(val) params.epi[e.key] = val;
  });
  params.precoce = +document.getElementById('p-precoce').value||30;
  localStorage.setItem('epi_params',JSON.stringify(params));
  renderTDB(); renderFiche();
  toast('✅ Paramètres enregistrés');
}
