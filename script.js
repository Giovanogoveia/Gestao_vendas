import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ========= Helpers =========
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));
function showToast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
function normalizeNumber(v){ if(v===''||v==null) return null; const n=Number(v.toString().replace(',','.')); return isFinite(n)?n:v; }

// ========= Supabase =========
const SUPABASE_URL = 'https://dylziaqkyavkfwjepqkp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHppYXFreWF2a2Z3amVwcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTc1OTgsImV4cCI6MjA2ODAzMzU5OH0.gy5jXxKOTgeCf0Rwq7ktLTz1pyoZ8dJjZOK9UB9rHCM';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========= Config DB (com fallbacks) =========
const dbConfig = {
  soja: { table: 'soja', orderBy: 'id',
    map: { estoque:'estoque', meta:'meta', recebimento:'recebimento', percentual:'percentual' } },

  milho: { table: 'milho', orderBy: 'id',
    map: { estoque:'estoqueatual', meta:'meta', recebimento:'recebimento', percentual:'pencentual_metal' } },

  trigo: { table: 'trigo', orderBy: 'id',
    map: { estoque:'estoque', meta:'meta', recebimento:'recebimento', percentual:'percentual' } },

  lenha: { table: 'lenha', orderBy: 'id',
    map: { estoque:'estoque', meta:'meta', recebimento:'recebimento', percentual:'percentual' } },

  armazenamento: { table: 'armazenamento', orderBy: 'id',
    map: { capacidade:'capacidade', utilizado:'utilizado', disponivel:'disponivel' } },

  // tenta 'pessoa' e, se não existir, 'pessoas'
  pessoa: { table: 'pessoa', altTables: ['pessoas'], orderBy: 'id',
    map: { total:'total', ativos:'ativos', inativos:'inativos' } },

  geral: { table: 'geral', orderBy: 'id',
    map: { estoque_total:'estoque_total', entrada:'entrada', saida:'saida', saldo:'saldo' } },
};

// ========= Schemas de formulário =========
const schemas = {
  soja:{title:'Cadastro Soja',fields:[
    {key:'estoque',label:'Estoque Atual',type:'number',required:true,step:'0.01',hint:'Quantidade atual (t)'},
    {key:'meta',label:'Meta',type:'number',required:true,step:'0.01',hint:'Objetivo (t)'},
    {key:'recebimento',label:'Recebimento',type:'number',required:true,step:'0.01',hint:'Entrada prevista (t)'},
    {key:'percentual',label:'Percentual Meta (%)',type:'number',readonly:true,hint:'Calculado automaticamente'}
  ]},
  milho:{title:'Cadastro Milho',fields:[
    {key:'estoque',label:'Estoque Atual',type:'number',required:true,step:'0.01',hint:'Quantidade atual (t)'},
    {key:'meta',label:'Meta',type:'number',required:true,step:'0.01',hint:'Objetivo (t)'},
    {key:'recebimento',label:'Recebimento',type:'number',required:true,step:'0.01',hint:'Entrada prevista (t)'},
    {key:'percentual',label:'Percentual Meta (%)',type:'number',readonly:true,hint:'Calculado automaticamente'}
  ]},
  trigo:{title:'Cadastro Trigo',fields:[
    {key:'estoque',label:'Estoque Atual',type:'number',required:true,step:'0.01',hint:'Quantidade atual (t)'},
    {key:'meta',label:'Meta',type:'number',required:true,step:'0.01',hint:'Objetivo (t)'},
    {key:'recebimento',label:'Recebimento',type:'number',required:true,step:'0.01',hint:'Entrada prevista (t)'},
    {key:'percentual',label:'Percentual Meta (%)',type:'number',readonly:true,hint:'Calculado automaticamente'}
  ]},
  lenha:{title:'Cadastro Lenha',fields:[
    {key:'estoque',label:'Estoque Atual',type:'number',required:true,step:'0.01',hint:'Quantidade atual'},
    {key:'meta',label:'Meta',type:'number',required:true,step:'0.01',hint:'Objetivo'},
    {key:'recebimento',label:'Recebimento',type:'number',required:true,step:'0.01',hint:'Entrada prevista'},
    {key:'percentual',label:'Percentual Meta (%)',type:'number',readonly:true,hint:'Calculado automaticamente'}
  ]},
  armazenamento:{title:'Cadastro Armazenamento',fields:[
    {key:'capacidade',label:'Capacidade Total',type:'number',required:true,step:'0.01',hint:'Capacidade dos silos (t)'},
    {key:'utilizado',label:'Utilizado',type:'number',required:true,step:'0.01',hint:'Volume ocupado (t)'},
    {key:'disponivel',label:'Disponível',type:'number',required:false,readonly:true,step:'0.01',hint:'Calculado: capacidade - utilizado'}
  ]},
  pessoa:{title:'Cadastro Pessoa',fields:[
    {key:'total',label:'Total de Funcionários',type:'number',required:true,step:'1',hint:'Quantidade total'},
    {key:'ativos',label:'Ativos',type:'number',required:true,step:'1',hint:'Funcionando no momento'},
    {key:'inativos',label:'Inativos',type:'number',required:true,step:'1',hint:'Afastados ou férias'}
  ]},
  geral:{title:'Cadastro Estoque Geral',fields:[
    {key:'estoque_total',label:'Estoque Total',type:'number',required:true,step:'0.01',hint:'Consolidado (t)'},
    {key:'entrada',label:'Entrada',type:'number',required:true,step:'0.01',hint:'Entradas no período'},
    {key:'saida',label:'Saída',type:'number',required:true,step:'0.01',hint:'Saídas no período'},
    {key:'saldo',label:'Saldo',type:'number',required:true,step:'0.01',hint:'Total - Saídas + Entradas'}
  ]}
};

// ========= Materiais =========
const materials = [
  { title:'Conab – Acompanhamento de Safras', url:'https://www.conab.gov.br/', tag:'Safras', desc:'Boletins, estimativas e preços.' },
  { title:'EMBRAPA – Tecnologias e Sistemas de Produção', url:'https://www.embrapa.br/', tag:'Tecnologia', desc:'Boas práticas, cultivares e manejo.' },
  { title:'MAPA – Ministério da Agricultura', url:'https://www.gov.br/agricultura/pt-br', tag:'Políticas', desc:'Regulações, programas e notícias.' },
  { title:'Cepea/Esalq – Indicadores de Preços', url:'https://www.cepea.esalq.usp.br/', tag:'Mercado', desc:'Indicadores de soja, milho, boi, etc.' },
  { title:'CNA – Canal do Produtor', url:'https://www.cnabrasil.org.br/', tag:'CNA', desc:'Conteúdos e serviços para produtores.' }
];
const grid = $('#materialsGrid');
if (grid) {
  grid.innerHTML = materials.map(m=>`<article class="res-card"><span class="tag">${m.tag}</span><a href="${m.url}" target="_blank" rel="noopener">${m.title}</a><span class="desc">${m.desc}</span></article>`).join('');
}

// ========= State & Mappers =========
const state = { soja:{}, milho:{}, trigo:{}, lenha:{}, armazenamento:{}, pessoa:{}, geral:{}, _series:{} };
const invert = (obj)=>Object.fromEntries(Object.entries(obj).map(([a,b])=>[b,a]));
const toDb = (key, uiRow)=>{ const map=dbConfig[key].map||{}; const out={}; Object.entries(uiRow).forEach(([k,v])=>out[map[k]||k]=v); return out; };
const fromDb = (key, dbRow)=>{ const rev=invert(dbConfig[key].map||{}); const out={}; Object.entries(dbRow||{}).forEach(([k,v])=>out[rev[k]||k]=v); return out; };
const mapFieldToDb = (key, uiField)=> (dbConfig[key].map||{})[uiField] || uiField;

// ========= UI Refs =========
const overlay = $('#overlay');
const form = $('#form');
const fieldsBox = form?.querySelector('.fields');
const formTitle = $('#form-title');
const contextInput = $('#context');
const themeToggle = $('#themeToggle');
const refreshBtn = $('#refreshBtn');
const tabs = $('#tabs');
const kpisEl = $('#kpis');

// ========= Tabs =========
function setTab(cat){
  $$('.tab').forEach(b=>b.classList.toggle('active', b.dataset.cat===cat));
  localStorage.setItem('tab',cat);
  if (kpisEl) kpisEl.style.display = (cat==='operacao') ? 'grid' : 'none';
  $$('.main .card').forEach(card=>{
    const c = card.dataset.cat || 'operacao';
    const show = cat==='operacao' ? true : (c===cat);
    card.style.display = show ? 'grid' : 'none';
  });
}
tabs?.addEventListener('click', (e)=>{
  const btn = e.target.closest('.tab');
  if(!btn) return;
  setTab(btn.dataset.cat);
});
setTab(localStorage.getItem('tab') || 'operacao');

// ========= Tema =========
const savedTheme = localStorage.getItem('theme');
if(savedTheme) document.body.setAttribute('data-theme', savedTheme);
themeToggle?.addEventListener('click',()=>{
  const next = document.body.getAttribute('data-theme')==='dark' ? '' : 'dark';
  if(next) document.body.setAttribute('data-theme', next); else document.body.removeAttribute('data-theme');
  localStorage.setItem('theme', next);
});

// ========= Atalhos =========
window.addEventListener('keydown', (e)=>{
  if(e.altKey||e.ctrlKey||e.metaKey) return;
  const k=e.key.toLowerCase();
  if(k==='1') return setTab('operacao');
  if(k==='2') return setTab('estoques');
  if(k==='3') return setTab('pessoas');
  if(k==='4') return setTab('armazenagem');
  if(k==='t') return themeToggle?.click();
  if(k==='r') return refreshBtn?.click();
  if(k==='n') return openForm('soja');
});

// ========= Formulário =========
function openForm(key){
  const schema = schemas[key]; if(!schema || !fieldsBox) return;
  formTitle.textContent = schema.title; contextInput.value = key; fieldsBox.innerHTML='';
  const frag = document.createDocumentFragment();
  schema.fields.forEach(f=>{
    const id = `f_${key}_${f.key}`;
    const wrap = document.createElement('div'); wrap.className='field';
    wrap.innerHTML = `<label for="${id}" class="label">${f.label}${f.required?' *':''}</label>
      <input id="${id}" class="input" inputmode="decimal" ${f.readonly?'readonly':''} type="${f.type}" data-key="${f.key}" ${f.required?'required':''} ${f.step?`step="${f.step}"`:''}/>`+
      `${f.hint?`<div class="hint">${f.hint}</div>`:''}`+
      `<div class="error-msg" data-err="${f.key}"></div>`;
    frag.appendChild(wrap);
  });
  fieldsBox.appendChild(frag);
  const current = state[key] || {};
  fieldsBox.querySelectorAll('input').forEach(i=>{
    const k=i.dataset.key; if(current[k]!=null) i.value=current[k];
    const wrap=i.closest('.field'); if(wrap && i.value!=='' && i.value!=null) wrap.classList.add('is-filled');
    i.addEventListener('input',()=>{
      const w=i.closest('.field'); if(!w) return; if(i.value!==''&&i.value!=null) w.classList.add('is-filled'); else w.classList.remove('is-filled');
    });
  });
  maybeWirePercentCalc();
  maybeWireStorageCalc();
  showOverlay();
  fieldsBox.querySelector('input:not([readonly])')?.focus();
}
function maybeWirePercentCalc(){
  if(!fieldsBox) return;
  const pct = fieldsBox.querySelector('input[data-key="percentual"]'); if(!pct) return;
  const meta = fieldsBox.querySelector('input[data-key="meta"]');
  const recebimento = fieldsBox.querySelector('input[data-key="recebimento"]');
  const calc = ()=>{
    const m = parseFloat(meta?.value);
    const r = parseFloat(recebimento?.value);
    pct.value = (isFinite(m) && isFinite(r) && m > 0) ? ((r / m) * 100).toFixed(1) : '';
  };
  meta?.addEventListener('input', calc);
  recebimento?.addEventListener('input', calc);
  calc();
}
function maybeWireStorageCalc(){
  if(!fieldsBox) return;
  const cap = fieldsBox.querySelector('input[data-key="capacidade"]');
  const uti = fieldsBox.querySelector('input[data-key="utilizado"]');
  const disp = fieldsBox.querySelector('input[data-key="disponivel"]');
  if(!cap||!uti||!disp) return;
  const calc = ()=>{
    const c = parseFloat(cap.value), u = parseFloat(uti.value);
    disp.value = (isFinite(c)&&isFinite(u)) ? Math.max(0, c - u).toFixed(2) : '';
  };
  cap.addEventListener('input',calc); uti.addEventListener('input',calc); calc();
}
function showOverlay(){ overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function hideOverlay(){ overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; form.reset(); fieldsBox.innerHTML=''; }
overlay?.addEventListener('click',e=>{ if(e.target===overlay) hideOverlay(); });
form?.querySelector('.close')?.addEventListener('click', hideOverlay);
form?.querySelector('[data-cancel]')?.addEventListener('click', hideOverlay);
window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&overlay?.classList.contains('active')) hideOverlay(); });

// Submit -> insert (com validação)
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const key = contextInput.value; const { table } = dbConfig[key];
  const inputs = [...fieldsBox.querySelectorAll('input')];

  // limpa erros
  let firstError=null; inputs.forEach(i=>{ const el=fieldsBox.querySelector(`[data-err="${i.dataset.key}"]`); if(el) el.textContent=''; i.classList.remove('error'); });
  // valida
  for(const i of inputs){
    if(i.hasAttribute('required') && !i.value){
      fieldsBox.querySelector(`[data-err="${i.dataset.key}"]`).textContent='Campo obrigatório';
      i.classList.add('error'); if(!firstError) firstError=i;
    }
    if(i.type==='number' && i.value){ const n=Number(i.value.replace(',','.')); if(Number.isNaN(n)){ fieldsBox.querySelector(`[data-err="${i.dataset.key}"]`).textContent='Número inválido'; i.classList.add('error'); if(!firstError) firstError=i; }}
  }
  if(firstError){ firstError.focus(); return; }

  // (re)calcula campos derivados
  const metaI = fieldsBox.querySelector('input[data-key="meta"]');
  const recI  = fieldsBox.querySelector('input[data-key="recebimento"]');
  const pctI  = fieldsBox.querySelector('input[data-key="percentual"]');
  if(pctI && metaI && recI){
    const m = parseFloat(metaI.value);
    const r = parseFloat(recI.value);
    pctI.value = (isFinite(m) && isFinite(r) && m > 0) ? ((r / m) * 100).toFixed(1) : '';
  }
  const capI = fieldsBox.querySelector('input[data-key="capacidade"]');
  const utiI = fieldsBox.querySelector('input[data-key="utilizado"]');
  const dispI= fieldsBox.querySelector('input[data-key="disponivel"]');
  if(capI && utiI && dispI){
    const c = parseFloat(capI.value), u = parseFloat(utiI.value);
    dispI.value = (isFinite(c) && isFinite(u)) ? Math.max(0, c - u).toFixed(2) : '';
  }

  const uiRow = Object.fromEntries(inputs.map(i=>[i.dataset.key, normalizeNumber(i.value)]));
  if('percentual' in uiRow){
    const v = Number(uiRow.percentual);
    if(!isFinite(v)) delete uiRow.percentual;
  }
  const dbRow = toDb(key, uiRow);

  submitBtn.disabled=true; const oldText=submitBtn.textContent; submitBtn.textContent='Salvando...';
  const { data, error } = await supabase.from(table).insert(dbRow).select().single();
  submitBtn.disabled=false; submitBtn.textContent=oldText;

  if(error){ showToast('Erro ao salvar: '+error.message); return; }
  state[key] = fromDb(key, data);
  updateCard(key);
  hideOverlay();
  showToast('Salvo com sucesso.');
});

// ========= Fetch & Realtime (com fallbacks) =====
function primaryDbColumnForSeries(key){
  if(['soja','milho','trigo','lenha'].includes(key)) return mapFieldToDb(key,'estoque');
  if(key==='geral') return mapFieldToDb(key,'estoque_total');
  if(key==='armazenamento') return mapFieldToDb(key,'utilizado');
  if(key==='pessoa') return mapFieldToDb(key,'total');
  return null;
}

async function fetchLatest(key){
  const cfg = dbConfig[key];
  const orderCandidates = [cfg.orderBy, 'id', 'timestamp'].filter(Boolean);
  const tablesToTry = [cfg.table, ...(cfg.altTables || [])];

  let lastErr = null;
  for (const tableName of tablesToTry) {
    for (const ord of orderCandidates) {
      try {
        // último registro
        let { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(ord, { ascending:false })
          .limit(1);

        if (error) throw error;
        if (data && data[0]) {
          state[key]=fromDb(key, data[0]);
          updateCard(key);
        }

        // série para sparkline
        const col = primaryDbColumnForSeries(key);
        if (col) {
          const { data: series, error: sErr } = await supabase
            .from(tableName)
            .select(col)
            .order(ord, { ascending:false })
            .limit(12);
          if (sErr) throw sErr;
          const arr = (series||[])
            .map(r=>Number(r[col]))
            .filter(n=>isFinite(n))
            .reverse();
          state._series[key]=arr; drawSpark(key, arr);
        }
        return; // ok, sai
      } catch (err) {
        lastErr = err;
        const msg = String(err?.message || '');
        // 404 => tenta próxima tabela
        if (msg.includes('404') || err?.code === 'PGRST116') break;
        // 400 (coluna inexistente) => tenta próximo 'ord'
      }
    }
    // próxima tabela (ex.: 'pessoas')
  }
  console.warn(`[fetchLatest] ${key}: falha após tentativas`, lastErr?.message || lastErr);
}

async function loadAll(){
  $$('.card').forEach(c=>c.classList.add('loading'));
  await Promise.all(Object.keys(dbConfig).map(k=>fetchLatest(k)));
  $$('.card').forEach(c=>c.classList.remove('loading'));
  updateKpis();
  updateBadges();
}

// Realtime INSERT (tabelas existentes)
Object.entries(dbConfig).forEach(([key,{table}])=>{
  supabase.channel(`realtime:${table}`)
    .on('postgres_changes',{ event:'INSERT', schema:'public', table },(payload)=>{
      state[key]=fromDb(key, payload.new);
      updateCard(key);
    })
    .subscribe();
});

// ========= UI Update =========
function drawSpark(key, arr){
  const svg = document.querySelector(`[data-spark="${key}"]`); if(!svg) return;
  const w=120, h=36; if(!arr || arr.length<2){ svg.innerHTML=''; return; }
  const min=Math.min(...arr), max=Math.max(...arr); const pad=3;
  const scaleX = (i)=> (i/(arr.length-1))*(w-2*pad)+pad;
  const scaleY = (v)=> h-pad - (max===min?0:( (v-min)/(max-min) )*(h-2*pad));
  const d = arr.map((v,i)=> (i?'L':'M')+scaleX(i)+','+scaleY(v)).join(' ');
  svg.innerHTML = `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" opacity="0.85"/>
                   <circle cx="${scaleX(arr.length-1)}" cy="${scaleY(arr[arr.length-1])}" r="2.5" fill="currentColor"/>`;
}

function updateKpis(){
  const keysEstoque=['soja','milho','trigo','lenha'];
  const somaEstoque = keysEstoque.map(k=>Number(state[k]?.estoque)).filter(n=>isFinite(n)).reduce((a,b)=>a+b,0);
  $('#kpi-estoque')?.textContent = somaEstoque? new Intl.NumberFormat('pt-BR').format(somaEstoque) : '--';
  $('#kpi-estoque-hint')?.textContent = 'atualizado ' + new Date().toLocaleString('pt-BR');

  // Meta média (%) = recebimento / meta * 100
  const percentuais = keysEstoque.map(k=>{
    const m=Number(state[k]?.meta);
    const r=Number(state[k]?.recebimento);
    return (isFinite(m) && isFinite(r) && m>0) ? (r/m*100) : null;
  }).filter(v=>v!=null);
  const media = percentuais.length? (percentuais.reduce((a,b)=>a+b,0)/percentuais.length) : null;
  $('#kpi-meta')?.textContent = media? media.toFixed(1)+'%' : '--%';

  const u=Number(state.armazenamento?.utilizado), c=Number(state.armazenamento?.capacidade);
  const occ=(isFinite(u)&&isFinite(c)&&c>0)?(u/c*100):null;
  $('#kpi-armazenamento')?.textContent = occ? occ.toFixed(1)+'%' : '--%';

  const a=Number(state.pessoa?.ativos), t=Number(state.pessoa?.total);
  const ativ=(isFinite(a)&&isFinite(t)&&t>0)?(a/t*100):null;
  $('#kpi-pessoas')?.textContent = ativ? ativ.toFixed(1)+'%' : '--%';
}

function setProgressBar(i, pct){
  i.classList.remove('bad','warn','ok');
  if(pct < 50) i.classList.add('bad');
  else if(pct < 90) i.classList.add('warn');
  else i.classList.add('ok');
  i.style.width = pct + '%';
}

function updateBadges(){
  const counts = {
    operacao: $('.main .card')?.length || 0,
    estoques: $$('.main .card[data-cat="estoques"]').length,
    pessoas: $$('.main .card[data-cat="pessoas"]').length,
    armazenagem: $$('.main .card[data-cat="armazenagem"]').length
  };
  $$('.tabs .tab').forEach(tab=>{
    let b = tab.querySelector('.badge-pill');
    if(!b){ b=document.createElement('span'); b.className='badge-pill'; tab.appendChild(b); }
    b.textContent = counts[tab.dataset.cat] ?? 0;
  });
}

function updateCard(key){
  const card = document.querySelector(`.card[data-key="${key}"]`); if(!card) return;
  const data = state[key] || {};
  card.querySelectorAll('[data-f]').forEach(span=>{
    const k=span.getAttribute('data-f');
    let val=data?.[k];
    if(typeof val==='number') val=new Intl.NumberFormat('pt-BR').format(val);
    span.textContent=(val??'--');
  });

  // progressos
  const i = card.querySelector(`[data-prog="${key}"]`);
  if(i){
    let pct = 0;
    if(['soja','milho','trigo','lenha'].includes(key)){
      const m = Number(data?.meta); const r = Number(data?.recebimento);
      pct = isFinite(m) && isFinite(r) && m>0 ? Math.max(0, Math.min(100, (r/m)*100)) : 0;
    }
    if(key==='armazenamento'){
      const u = Number(data?.utilizado); const c = Number(data?.capacidade);
      pct = isFinite(u)&&isFinite(c)&&c>0 ? Math.max(0, Math.min(100, (u/c)*100)) : 0;
    }
    if(key==='pessoa'){
      const a = Number(data?.ativos); const t = Number(data?.total);
      pct = isFinite(a)&&isFinite(t)&&t>0 ? Math.max(0, Math.min(100, (a/t)*100)) : 0;
    }
    setProgressBar(i, pct);
    const pctSpan = card.querySelector('[data-f="percentual"]');
    if(pctSpan && !pctSpan.textContent.trim()) pctSpan.textContent = pct.toFixed(1);
  }

  if(state._series[key]) drawSpark(key, state._series[key]);
  updateKpis();
}

// Botões (delegação)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-open]');
  if(btn){ e.preventDefault(); openForm(btn.dataset.open); }
});
refreshBtn?.addEventListener('click', loadAll);

// Carregamento inicial
loadAll();

