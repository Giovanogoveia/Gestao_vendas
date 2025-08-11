<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

  // ========= Helpers =========
  const $ = (q,root=document)=>root.querySelector(q);
  const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));
  function showToast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
  function normalizeNumber(v){ if(v===''||v==null) return null; const n=Number(v.toString().replace(',','.')); return isFinite(n)?n:v; }

  // ========= DADOS DO USUARIO DO Supabase AO PROJETO =========
  const SUPABASE_URL = 'https://dylziaqkyavkfwjepqkp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHppYXFreWF2a2Z3amVwcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTc1OTgsImV4cCI6MjA2ODAzMzU5OH0.gy5jXxKOTgeCf0Rwq7ktLTz1pyoZ8dJjZOK9UB9rHCM';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ========= FONFIGURAÇÃO PARA ACESSO AO BANCO DE DADOS SALVAR =========
  const dbConfig = {
  soja: {
    table: 'soja',
    orderBy: 'timestamp',
    map: {
      estoque:     'estoqueatual',      // <- minúsculo
      meta:        'meta',
      recebimento: 'recebimento',
      percentual:  'percentual_metal'   // <- igual ao DB
    }
  },
   
    // milho TABELAS CONFORME BANCO DE DADOS
    milho: { table: 'milho', orderBy: 'timestamp',
      map: { estoque:'estoqueatual', meta:'meta', recebimento:'recebimento', percentual:'percentual_metal' } },
    
    // TRIGO: TABELAS CONFORME BANCO DE DADOS 
    trigo: { table:'trigo', orderBy:'id',
    map:{ estoque:'estoque', meta:'meta', recebimento:'recebimento', percentual:'percentual' } },

  // ✅ LENHA TABELA CONFORME BANCO DE DADOS
    lenha: { table:'lenha', orderBy:'id',
    map:{ estoque:'compra_anual_lenha', meta:'media_compra_lenha', recebimento:'baixa_lenha', percentual:'estoque_atual_lenha' } },

  // ARMAZENAMENTO, TABELAS CONFORME BANCO DE DADOS 
    armazenamento: { table: 'capacidade_estatica_unidade', orderBy: 'id',
      map: { capacidade:'capacidade_estatica', utilizado:'capacidade_real', disponivel:'estoque_atual' } },
    
    // PESSOAS TABELAS CONFORME BANCO DE DADOS   
    pessoa: { table: 'funcionario_employer', orderBy: 'id',
      map: { total:'quantidade_orcado', ativos:'quantidade_ativo', inativos:'quantidade_funcionario_employer' } },
      
    geral: { table: 'geral', orderBy: 'created_at',
      map: { estoque_total:'estoque_total', entrada:'entrada', saida:'saida', saldo:'saldo' } },
  };

  // ========= FORMULARIO ONDE SERAM DIGITADOS OS VALORES QUE SERAM DIRECIONADOS AO BANCO DE DADOS. =========
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

  // ========= Materiais QUE COMPOE A PAGINDA DE NOTICIAS SOBRE O AGRO  =========
  const materials = [
    { title:'Conab – Acompanhamento de Safras', url:'https://www.conab.gov.br/', tag:'Safras', desc:'Boletins, estimativas e preços.' },
    { title:'EMBRAPA – Tecnologias e Sistemas de Produção', url:'https://www.embrapa.br/', tag:'Tecnologia', desc:'Boas práticas, cultivares e manejo.' },
    { title:'MAPA – Ministério da Agricultura', url:'https://www.gov.br/agricultura/pt-br', tag:'Políticas', desc:'Regulações, programas e notícias.' },
    { title:'Cepea/Esalq – Indicadores de Preços', url:'https://www.cepea.esalq.usp.br/', tag:'Mercado', desc:'Indicadores de soja, milho, boi, etc.' },
    { title:'CNA – Canal do Produtor', url:'https://www.cnabrasil.org.br/', tag:'CNA', desc:'Conteúdos e serviços para produtores.' }
  ];
  const grid = $('#materialsGrid');
  grid.innerHTML = materials.map(m=>`<article class="res-card"><span class="tag">${m.tag}</span><a href="${m.url}" target="_blank" rel="noopener">${m.title}</a><span class="desc">${m.desc}</span></article>`).join('');

    
  // ========= State & Mappers =========
  // STATE ELE GUARDA SEMPRE UM OBJETO E SEMPRE COMECA VAZIO...
  const state = { soja:{}, milho:{}, trigo:{}, lenha:{}, armazenamento:{}, pessoa:{}, geral:{}, _series:{} };

  //CAMINHO CONTRATIO EMTRE O BANCO DE A INTERFACE
  const invert = (obj)=>Object.fromEntries(Object.entries(obj).map(([a,b])=>[b,a]));

  // ELE TROCA O DADOS DA INTERFACE PARA O BANCO
  const toDb = (key, uiRow)=>{ const map=dbConfig[key].map||{}; const out={}; Object.entries(uiRow).forEach(([k,v])=>out[map[k]||k]=v); return out; };
    
  //converte os dados do BANCO PARA INTERFACE
  const fromDb = (key, dbRow)=>{ const rev=invert(dbConfig[key].map||{}); const out={}; Object.entries(dbRow||{}).forEach(([k,v])=>out[rev[k]||k]=v); return out; };
  //
  const mapFieldToDb = (key, uiField)=> (dbConfig[key].map||{})[uiField] || uiField;

  // ========= UI Refs =========
  const overlay = $('#overlay');
  const form = $('#form');
  const fieldsBox = form.querySelector('.fields');
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
    kpisEl.style.display = (cat==='operacao') ? 'grid' : 'none';
    $$('.main .card').forEach(card=>{
      const c = card.dataset.cat || 'operacao';
      const show = cat==='operacao' ? true : (c===cat);
      card.style.display = show ? 'grid' : 'none';
    });
  }
  tabs.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tab');
    if(!btn) return;
    setTab(btn.dataset.cat);
  });
  setTab(localStorage.getItem('tab') || 'operacao');

  // ========= Tema =========
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) document.body.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click',()=>{
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
    if(k==='t') return themeToggle.click();
    if(k==='r') return refreshBtn.click();
    if(k==='n') return openForm('soja');
  });

  // ========= Formulário =========
  function openForm(key){
    const schema = schemas[key]; if(!schema) return;
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
    fieldsBox.querySelectorAll('input').forEach(i=>{ const k=i.dataset.key; if(current[k]!=null) i.value=current[k]; });
    maybeWirePercentCalc();
    maybeWireStorageCalc();
    showOverlay();
    fieldsBox.querySelector('input:not([readonly])')?.focus();
  }
  function maybeWirePercentCalc(){
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
  overlay.addEventListener('click',e=>{ if(e.target===overlay) hideOverlay(); });
  form.querySelector('.close').addEventListener('click', hideOverlay);
  form.querySelector('[data-cancel]').addEventListener('click', hideOverlay);
  window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&overlay.classList.contains('active')) hideOverlay(); });

  // Submit -> insert (com validação)
  form.addEventListener('submit', async (e)=>{
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

    // (re)calcula campos derivados antes de enviar
    // Percentual = recebimento / meta * 100 (estoque NÃO entra)
    const metaI = fieldsBox.querySelector('input[data-key="meta"]');
    const recI  = fieldsBox.querySelector('input[data-key="recebimento"]');
    const pctI  = fieldsBox.querySelector('input[data-key="percentual"]');
    if(pctI && metaI && recI){
      const m = parseFloat(metaI.value);
      const r = parseFloat(recI.value);
      pctI.value = (isFinite(m) && isFinite(r) && m > 0) ? ((r / m) * 100).toFixed(1) : '';
    }

    // Armazenamento: disponível = capacidade - utilizado
    const capI = fieldsBox.querySelector('input[data-key="capacidade"]');
    const utiI = fieldsBox.querySelector('input[data-key="utilizado"]');
    const dispI= fieldsBox.querySelector('input[data-key="disponivel"]');
    if(capI && utiI && dispI){
      const c = parseFloat(capI.value), u = parseFloat(utiI.value);
      dispI.value = (isFinite(c) && isFinite(u)) ? Math.max(0, c - u).toFixed(2) : '';
    }

    const uiRow = Object.fromEntries(inputs.map(i=>[i.dataset.key, normalizeNumber(i.value)]));

    // Segurança extra: se não houver valor numérico válido para percentual, remove do payload
    if('percentual' in uiRow){
      const v = Number(uiRow.percentual);
      if(!isFinite(v)) delete uiRow.percentual;
    }

    // Monta linha de DB respeitando o mapeamento (ex.: milho -> pencentual_metal)
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

  // ========= Fetch & Realtime =====
  function primaryDbColumnForSeries(key){
    if(['soja','milho','trigo','lenha'].includes(key)) return mapFieldToDb(key,'estoque');
    if(key==='geral') return mapFieldToDb(key,'estoque_total');
    if(key==='armazenamento') return mapFieldToDb(key,'utilizado');
    if(key==='pessoa') return mapFieldToDb(key,'total');
    return null;
  }

  async function fetchLatest(key){
    const { table, orderBy } = dbConfig[key];
    let { data, error } = await supabase.from(table).select('*').order(orderBy,{ascending:false}).limit(1);
    if(!error && data && data[0]){ state[key]=fromDb(key, data[0]); updateCard(key); }
    const col = primaryDbColumnForSeries(key); if(!col) return;
    const sel = `${col}`;
    const { data: series, error: sErr } = await supabase.from(table).select(sel).order(orderBy,{ascending:false}).limit(12);
    if(!sErr && series){
      const arr = series.map(r=>Number(r[col])).filter(n=>isFinite(n)).reverse();
      state._series[key]=arr; drawSpark(key, arr);
    }
  }

  async function loadAll(){
    $$('.card').forEach(c=>c.classList.add('loading'));
    await Promise.all(Object.keys(dbConfig).map(k=>fetchLatest(k)));
    $$('.card').forEach(c=>c.classList.remove('loading'));
    updateKpis();
    updateBadges();
  }

  // Realtime INSERT
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
    $('#kpi-estoque').textContent = somaEstoque? new Intl.NumberFormat('pt-BR').format(somaEstoque) : '--';
    $('#kpi-estoque-hint').textContent = 'atualizado ' + new Date().toLocaleString('pt-BR');

    // Meta média (%) = recebimento / meta * 100
    const percentuais = keysEstoque.map(k=>{
      const m=Number(state[k]?.meta);
      const r=Number(state[k]?.recebimento);
      return (isFinite(m) && isFinite(r) && m>0) ? (r/m*100) : null;
    }).filter(v=>v!=null);
    const media = percentuais.length? (percentuais.reduce((a,b)=>a+b,0)/percentuais.length) : null;
    $('#kpi-meta').textContent = media? media.toFixed(1)+'%' : '--%';

    const u=Number(state.armazenamento?.utilizado), c=Number(state.armazenamento?.capacidade);
    const occ=(isFinite(u)&&isFinite(c)&&c>0)?(u/c*100):null;
    $('#kpi-armazenamento').textContent = occ? occ.toFixed(1)+'%' : '--%';

    const a=Number(state.pessoa?.ativos), t=Number(state.pessoa?.total);
    const ativ=(isFinite(a)&&isFinite(t)&&t>0)?(a/t*100):null;
    $('#kpi-pessoas').textContent = ativ? ativ.toFixed(1)+'%' : '--%';
  }

  function setProgressBar(i, pct){
    i.classList.remove('bad','warn','ok');
    if(pct < 50) i.classList.add('bad');
    else if(pct < 90) i.classList.add('warn');
    else i.classList.add('ok');
    i.style.width = pct + '%';
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

    // preço (pega primeiro número como destaque)
    const price = card.querySelector('.price');
    if(price){
      const numbers = Object.values(data||{}).map(v=>Number(v)).filter(v=>isFinite(v));
      price.textContent = numbers.length?`R$: ${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(numbers[0])}`:'R$: --';
    }

    // spark
    if(state._series[key]) drawSpark(key, state._series[key]);

    updateKpis();
    updateBadges();
  }

  // ========= Bind Botões =========
  $$('.btn[data-open]').forEach(btn=>btn.addEventListener('click',()=>openForm(btn.dataset.open)));
  refreshBtn.addEventListener('click',()=>{ loadAll(); showToast('Atualizado'); });

  // ========= Start =========
  (async()=>{ await loadAll(); })();

  // ========= Testes rápidos (sanidade) =========
  (function runSelfTests(){
    try{
      console.group('%cSanidade do Dashboard','color:#22c55e;font-weight:900');
      // Teste 1: Tabs alternam categorias
      setTab('estoques');
      const allCards = $$('.main .card');
      const hiddenOk = allCards.every(c => (c.dataset.cat==='estoques') ? (c.style.display!=='none') : (c.style.display==='none'));
      console.assert(hiddenOk, '[Tabs] deveria filtrar por categoria');
      setTab('operacao');

      // Teste 2: Form de milho renderiza campos esperados
      openForm('milho');
      const hasMeta = !!fieldsBox.querySelector('input[data-key="meta"]');
      const hasReceb = !!fieldsBox.querySelector('input[data-key="recebimento"]');
      const hasPct = !!fieldsBox.querySelector('input[data-key="percentual"]');
      console.assert(hasMeta && hasReceb && hasPct,'[Form] campos meta/recebimento/percentual presentes');

      // Teste 3: Cálculo percentual = recebimento/meta*100 (estoque não entra)
      const m = fieldsBox.querySelector('input[data-key="meta"]');
      const r = fieldsBox.querySelector('input[data-key="recebimento"]');
      const p = fieldsBox.querySelector('input[data-key="percentual"]');
      m.value='200'; r.value='400';
      m.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('input'));
      console.assert(p.value==='200.0','[Percentual] esperado 200.0 quando meta=200 receb=400');
      // Teste 3b: meta=0 => vazio
      m.value='0'; r.value='100';
      m.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('input'));
      console.assert(p.value==='','[Percentual] quando meta=0 deve ficar vazio');
      hideOverlay();

      console.groupEnd();
    }catch(err){ console.error('Falha nos testes de sanidade', err); }
  })();

  // ========= Funções auxiliares =========
  function updateBadges(){
    // Atualiza badges e barras com base no estado
    ['soja','milho','trigo','lenha'].forEach(key=>{
      const card = document.querySelector(`.card[data-key="${key}"]`); if(!card) return;
      const span = card.querySelector('[data-f="percentual"]');
      let pct = Number(state[key]?.percentual);
      if(!isFinite(pct)){
        const m = Number(state[key]?.meta); const r = Number(state[key]?.recebimento);
        pct = (isFinite(m) && isFinite(r) && m>0) ? (r/m*100) : NaN;
      }
      if(isFinite(pct)){
        span.textContent = Number(pct).toFixed(1);
        const bar = card.querySelector(`[data-prog="${key}"]`); if(bar) setProgressBar(bar, Math.max(0,Math.min(100,pct)));
      }
    });
    // Armazenamento
    (function(){
      const key='armazenamento'; const card=document.querySelector(`.card[data-key="${key}"]`); if(!card) return;
      const u=Number(state[key]?.utilizado), c=Number(state[key]?.capacidade);
      const pct=isFinite(u)&&isFinite(c)&&c>0?(u/c*100):NaN; const bar=card.querySelector('[data-prog="armazenamento"]');
      if(bar&&isFinite(pct)) setProgressBar(bar, Math.max(0,Math.min(100,pct)));
    })();
    // Pessoas
    (function(){
      const key='pessoa'; const card=document.querySelector(`.card[data-key="${key}"]`); if(!card) return;
      const a=Number(state[key]?.ativos), t=Number(state[key]?.total);
      const pct=isFinite(a)&&isFinite(t)&&t>0?(a/t*100):NaN; const bar=card.querySelector('[data-prog="pessoa"]');
      if(bar&&isFinite(pct)) setProgressBar(bar, Math.max(0,Math.min(100,pct)));
    })();
  }

