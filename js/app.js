// ── Init ──────────────────────────────────────────────────────
document.getElementById('today-date').textContent=new Date().toLocaleDateString('fr-FR');
const savedParams=localStorage.getItem('epi_params');
if(savedParams){const sp=JSON.parse(savedParams);Object.assign(params,sp);if(sp.epi)params.epi=Object.assign({},params.epi,sp.epi);}
document.querySelectorAll('.modal-bg').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-bg.open').forEach(m=>m.classList.remove('open'))});
loadAll();
setInterval(loadAll,30000);
// Notifs si déjà autorisées
if(localStorage.getItem('notif_enabled') && Notification.permission==='granted') scheduleNotifCheck();
