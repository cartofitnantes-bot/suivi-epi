// ══════════════════════════════════════════════════════════════
// CONFIG SUPABASE — À REMPLACER PAR TES VRAIES CLÉS
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://pfmqqpiyjayvqhnfncna.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbXFxcGl5amF5dnFobmZuY25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTU2NjksImV4cCI6MjA5ODIzMTY2OX0.iGeA9ZN2zNsat9P-dXbmzzGt-2Hf4JrUehIREhRLZ5U';

// ── Options ───────────────────────────────────────────────────
const AGENCES = ['Nantes','Vannes'];
const POSTES = ['Technicien réseaux','Chef de chantier','Chargé d\'affaires','Topographe','Géomètre','Apprenti','Intérimaire','Autre'];
const TAILLES_VET = ['—','XS','S','M','L','XL','XXL','XXXL'];
const TAILLES_CH = ['—','36','37','38','39','40','41','42','43','44','45','46','47','48'];
const TAILLES_GANT = ['—','7','8','9','10','11','12'];
const HABILITATIONS = ['BR/BC','H2V B2V','TST','AIPR','ATEX','N1','N2','CATEC','Z724','SECUFER','PP58','APTEVA','ADNT 3002','Safety Pass'];
const ETATS = ['OK','NOK','A changer','X'];
const EPI_DEFS = [
  {key:'casque',label:'Casque',type:'autre'},
  {key:'gants_bt',label:'Gants BT',type:'gants'},
  {key:'gants_bt_s',label:'Gants BT secours',type:'gants'},
  {key:'gants_ht',label:'Gants HT',type:'gants'},
  {key:'gants_ht_s',label:'Gants HT secours',type:'gants'},
  {key:'tapis',label:'Tapis isolant',type:'tapis'},
  {key:'nappe',label:'Nappe isolante',type:'autre'},
  {key:'cadenas',label:'Cadenas consignation',type:'autre'},
  {key:'combi',label:'Combinaison ATEX',type:'atex'},
  {key:'veste',label:'Veste ATEX',type:'atex'},
  {key:'pantalon',label:'Pantalon ATEX',type:'atex'},
  {key:'detec',label:'Détecteur gaz',type:'atex'},
  {key:'chaussures',label:'Chaussures sécu',type:'autre'},
];
const HISTO_KEYS = ['casque','gants_bt','gants_bt_s','gants_ht','gants_ht_s','tapis','nappe','cadenas','combi','veste','pantalon','detec','chaussures'];
const HISTO_LABELS = {casque:'Casque',gants_bt:'Gants BT',gants_bt_s:'Gants BT secours',gants_ht:'Gants HT',gants_ht_s:'Gants HT secours',tapis:'Tapis isolant',nappe:'Nappe isolante',cadenas:'Cadenas consignation',combi:'Combinaison ATEX',veste:'Veste ATEX',pantalon:'Pantalon ATEX',detec:'Détecteur gaz',chaussures:'Chaussures sécu'};
