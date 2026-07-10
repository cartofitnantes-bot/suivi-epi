// ── NOTIFICATIONS PUSH ────────────────────────────────────────
async function requestNotifPermission(){
  if(!('Notification' in window)){toast('❌ Notifications non supportées sur ce navigateur');return;}
  const perm=await Notification.requestPermission();
  if(perm==='granted'){
    localStorage.setItem('notif_enabled','1');
    toast('🔔 Notifications activées');
    scheduleNotifCheck();
  } else {
    toast('❌ Notifications refusées');
  }
}

function scheduleNotifCheck(){
  checkAndNotify();
  setInterval(checkAndNotify, 3600000); // toutes les heures
}

function checkAndNotify(){
  if(Notification.permission!=='granted')return;
  if(!localStorage.getItem('notif_enabled'))return;
  const actifs=techs.filter(t=>t.statut==='Actif');
  const alerts=[];
  actifs.forEach(t=>{
    const epiMap=getEpiForTech(t.id);
    EPI_DEFS.forEach(e=>{
      const s=getStatus(epiMap[e.key],e.type);
      if(s==='overdue'||s==='nok')alerts.push(`${t.nom} — ${e.label}`);
      else if(s==='soon'){const p=getPeriod(e.type,e.key),ds=daysSince(epiMap[e.key].ci);alerts.push(`${t.nom} — ${e.label} : ${p-ds}j`);}
    });
  });
  if(alerts.length>0){
    new Notification('⚡ Suivi EPI — '+alerts.length+' alerte(s)',{
      body:alerts.slice(0,3).join(' | ')+(alerts.length>3?' +'+( alerts.length-3)+' autres':''),
      icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'
    });
  }
}
