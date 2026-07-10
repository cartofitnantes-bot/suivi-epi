// ── Export PDF ────────────────────────────────────────────────
function exportPDF(signTech=null,signResp=null){
  const id=document.getElementById('fiche-sel').value;
  const t=techs.find(x=>x.id===id);if(!t)return;
  const epiMap=getEpiForTech(t.id);
  const today=new Date().toLocaleDateString('fr-FR');
  const epiRows=EPI_DEFS.map(e=>{
    const ep=epiMap[e.key]||{etat:'X'};
    const s=getStatus(ep,e.type);const p=getPeriod(e.type,e.key);
    const bg=s==='nok'||s==='overdue'?'#FFF0F0':s==='soon'?'#FFFBF0':s==='na'?'#F8F8F8':'#FFF';
    const etatTxt=s==='na'?'—':s==='nok'?ep.etat:s==='overdue'?`Dépassé +${daysSince(ep.ci)-p}j`:s==='soon'?`${p-daysSince(ep.ci)}j restants`:'OK';
    const etatColor=s==='nok'||s==='overdue'?'#C0392B':s==='soon'?'#D35400':s==='na'?'#999':'#1E7E4A';
    return`<tr style="background:${bg}"><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-weight:600;font-size:12px">${e.label}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${ep.taille||'—'}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${ep.classe||'—'}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${ep.achat||'—'}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${fmtDate(ep.ci)}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${fmtDate(ep.ce)}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px">${ep.ci?addDays(ep.ci,p):'—'}</td><td style="padding:7px 10px;border-bottom:1px solid #e8e8e8;font-size:12px;font-weight:700;color:${etatColor}">${etatTxt}</td></tr>`;
  }).join('');

  let histoSection='';
  HISTO_KEYS.forEach(key=>{
    const entries=getHistoForTech(t.id,key);
    if(!entries.length)return;
    const rows=entries.map(h=>{
      const bg=h.etat==='OK'?'#F0FFF4':h.etat==='NOK'?'#FFF0F0':'#FFFBF0';
      const color=h.etat==='OK'?'#1E7E4A':h.etat==='NOK'?'#C0392B':'#D35400';
      return`<tr style="background:${bg}"><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px">${fmtDate(h.date_ctrl)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px">${h.type_ctrl}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px;font-weight:700;color:${color}">${h.etat}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px">${h.inspecteur||'—'}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px">${h.obs||'—'}</td></tr>`;
    }).join('');
    histoSection+=`<div style="margin-top:18px"><div style="font-size:12px;font-weight:700;color:#1C2B4A;background:#EEF3FB;padding:7px 12px;border-left:4px solid #2E5FAC">📜 Historique — ${HISTO_LABELS[key]}</div><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#F0F4FA"><th style="padding:6px 10px;font-size:10px;font-weight:700;color:#5A6175;text-align:left;border-bottom:1px solid #DDE3F0">Date</th><th style="padding:6px 10px;font-size:10px;font-weight:700;color:#5A6175;text-align:left;border-bottom:1px solid #DDE3F0">Type</th><th style="padding:6px 10px;font-size:10px;font-weight:700;color:#5A6175;text-align:left;border-bottom:1px solid #DDE3F0">Résultat</th><th style="padding:6px 10px;font-size:10px;font-weight:700;color:#5A6175;text-align:left;border-bottom:1px solid #DDE3F0">Inspecteur</th><th style="padding:6px 10px;font-size:10px;font-weight:700;color:#5A6175;text-align:left;border-bottom:1px solid #DDE3F0">Observations</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  });
  if(!histoSection)histoSection=`<div style="margin-top:12px;padding:12px;background:#F8F8F8;color:#999;font-size:12px;font-style:italic">Aucun historique enregistré.</div>`;

  const html=`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Fiche EPI — ${t.nom}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:13px;color:#1A1D2E;background:#fff;padding:28px 32px}@media print{body{padding:0}.no-print{display:none!important}@page{margin:15mm 12mm;size:A4 portrait}}.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1C2B4A;margin-bottom:20px}.header-left h1{font-size:22px;font-weight:700;color:#1C2B4A}.header-left .sub{font-size:12px;color:#5A6175;margin-top:4px}.header-right{text-align:right;font-size:11px;color:#5A6175}.header-right .doc-date{font-size:13px;font-weight:700;color:#1C2B4A}.info-band{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;background:#EEF3FB;border-radius:6px;padding:14px 16px;margin-bottom:20px}.info-item .lbl{font-size:10px;font-weight:700;color:#5A6175;text-transform:uppercase;letter-spacing:.4px}.info-item .val{font-size:13px;font-weight:700;color:#1C2B4A;margin-top:3px}.section-title{font-size:13px;font-weight:700;color:#fff;background:#1C2B4A;padding:8px 14px;margin-bottom:0}table{width:100%;border-collapse:collapse}th{background:#F0F4FA;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#5A6175;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #DDE3F0}.footer{margin-top:32px;border-top:1px solid #DDE3F0;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#999}.signature-zone{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:24px}.signature-box{border:1px solid #DDE3F0;border-radius:6px;padding:12px 16px;min-height:80px}.signature-box .sig-label{font-size:10px;font-weight:700;color:#5A6175;text-transform:uppercase;margin-bottom:4px}.print-btn{background:#2E5FAC;color:#fff;border:none;border-radius:6px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:20px}</style></head><body>
<button class="print-btn no-print" onclick="window.print()">🖨 Imprimer / Enregistrer en PDF</button>
<div class="header"><div class="header-left"><div style="font-size:11px;color:#5A6175;margin-bottom:6px">SUIVI DES ÉQUIPEMENTS DE PROTECTION INDIVIDUELLE</div><h1>${t.nom}</h1><div class="sub">${t.agence} · ${t.poste}</div></div><div class="header-right"><div class="doc-date">Document du ${today}</div><div style="margin-top:6px">Habilitations :<br><strong>${(t.hab||[]).join(', ')||'—'}</strong></div></div></div>
<div class="info-band"><div class="info-item"><div class="lbl">Agence</div><div class="val">${t.agence}</div></div><div class="info-item"><div class="lbl">Statut</div><div class="val">${t.statut}</div></div><div class="info-item"><div class="lbl">Tailles</div><div class="val" style="font-size:11px">Vêt.${t.tv||'—'} Ch.${t.tc||'—'} G.${t.tg||'—'}</div></div><div class="info-item"><div class="lbl">Date d'entrée</div><div class="val">${fmtDate(t.entree)}</div></div></div>
<div class="section-title">Équipements de Protection Individuelle</div>
<table><thead><tr><th>EPI</th><th>Taille</th><th>Classe</th><th>Date achat</th><th>Ctrl interne</th><th>Ctrl externe</th><th>Prochaine éch.</th><th>Statut</th></tr></thead><tbody>${epiRows}</tbody></table>
<div style="margin-top:24px"><div class="section-title">Historique des vérifications</div>${histoSection}</div>
<div class="signature-zone">
  <div class="signature-box"><div class="sig-label">Signature du technicien</div>${signTech?'<img src="'+signTech+'" style="max-width:100%;max-height:80px;margin-top:8px">':''}</div>
  <div class="signature-box"><div class="sig-label">Signature du responsable / client</div>${signResp?'<img src="'+signResp+'" style="max-width:100%;max-height:80px;margin-top:8px">':''}</div>
</div>
<div class="footer"><span>Document généré le ${today} · Suivi EPI</span><span>${t.nom} · ${t.agence}</span></div>
</body></html>`;
  const win=window.open('','_blank');win.document.write(html);win.document.close();
}

// ── EXPORT EXCEL ─────────────────────────────────────────────
function exportExcel(){
  const today = new Date().toLocaleDateString('fr-FR');
  let csvRows = [];
  // En-tête
  const headers = ['Nom','Agence','Poste','Statut','Habilitations','Taille vêt.','Taille ch.','Taille gant','Date entrée',...EPI_DEFS.map(e=>e.label+' - Taille'),...EPI_DEFS.map(e=>e.label+' - Classe'),...EPI_DEFS.map(e=>e.label+' - Ctrl interne'),...EPI_DEFS.map(e=>e.label+' - Péremption'),...EPI_DEFS.map(e=>e.label+' - État'),...EPI_DEFS.map(e=>e.label+' - Statut ctrl')];
  csvRows.push(headers.join(';'));

  techs.filter(t=>t.statut==='Actif').forEach(t=>{
    const epiMap=getEpiForTech(t.id);
    const base=[t.nom,t.agence,t.poste,t.statut,(t.hab||[]).join(', '),t.tv||'',t.tc||'',t.tg||'',fmtDate(t.entree)];
    const tailles=EPI_DEFS.map(e=>(epiMap[e.key]?.taille||''));
    const classes=EPI_DEFS.map(e=>(epiMap[e.key]?.classe||''));
    const ctrlInt=EPI_DEFS.map(e=>fmtDate(epiMap[e.key]?.ci));
    const perems=EPI_DEFS.map(e=>fmtDate(epiMap[e.key]?.perem));
    const etats=EPI_DEFS.map(e=>(epiMap[e.key]?.etat||'X'));
    const statuts=EPI_DEFS.map(e=>{
      const ep=epiMap[e.key];const s=getStatus(ep,e.type);
      if(s==='na')return'—';if(s==='nok')return'NOK';if(s==='overdue'){const p=getPeriod(e.type,e.key);return`Dépassé +${daysSince(ep.ci)-p}j`;}
      if(s==='soon'){const p=getPeriod(e.type,e.key);return`${p-daysSince(ep.ci)}j restants`;}return'OK';
    });
    csvRows.push([...base,...tailles,...classes,...ctrlInt,...perems,...etats,...statuts].map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(';'));
  });

  const bom = '﻿';
  const sep='\n';const blob = new Blob([bom+csvRows.join(sep)],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`EPI_Export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  toast('📥 Export téléchargé');
}

// ── CANVAS SIGNATURE ──────────────────────────────────────────
let signTechData=null, signRespData=null;

function initCanvas(id){
  const canvas=document.getElementById(id);
  if(!canvas||canvas._init)return;
  canvas._init=true;
  const ctx=canvas.getContext('2d');
  ctx.strokeStyle='#1C2B4A'; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.lineJoin='round';
  let drawing=false,lx=0,ly=0;
  function getPos(e){
    const r=canvas.getBoundingClientRect();
    const src=e.touches?e.touches[0]:e;
    return{x:(src.clientX-r.left)*(canvas.width/r.width),y:(src.clientY-r.top)*(canvas.height/r.height)};
  }
  function start(e){drawing=true;const p=getPos(e);lx=p.x;ly=p.y;e.preventDefault();}
  function move(e){if(!drawing)return;const p=getPos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;e.preventDefault();}
  function stop(){drawing=false;}
  canvas.addEventListener('mousedown',start);canvas.addEventListener('mousemove',move);canvas.addEventListener('mouseup',stop);canvas.addEventListener('mouseleave',stop);
  canvas.addEventListener('touchstart',start,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});canvas.addEventListener('touchend',stop);
}

function clearCanvas(id){
  const canvas=document.getElementById(id);
  if(!canvas)return;
  canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
}

function openSignModal(){
  document.getElementById('modal-sign').classList.add('open');
  setTimeout(()=>{initCanvas('sign-tech');initCanvas('sign-resp');},100);
}
function closeSignModal(){document.getElementById('modal-sign').classList.remove('open');}

function exportPDFWithSign(){
  const c1=document.getElementById('sign-tech');
  const c2=document.getElementById('sign-resp');
  signTechData=c1?c1.toDataURL():'';
  signRespData=c2?c2.toDataURL():'';
  closeSignModal();
  exportPDF(signTechData,signRespData);
  signTechData=null;signRespData=null;
}
