(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const pages = { overview:'Executive Overview', performance:'Performance Intelligence', rootcause:'Root Cause Explorer', decisions:'Decision Center', forecast:'Revenue Forecast', scenario:'Scenario Lab', benefits:'Key Benefits' };
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  const rev = [8.9,9.2,9.6,10.4,10.1,10.8,11,10.7,11.4,11.9,12.1,12.48];
  const profit = [2.12,2.18,2.29,2.42,2.36,2.54,2.58,2.47,2.73,2.92,3.02,3.17];
  const datasets = {
    all:{revenue:12.48,profit:3.17,customers:48291,aov:2584,growth:8.4},
    north:{revenue:3.86,profit:1.06,customers:15180,aov:2690,growth:18.4},
    south:{revenue:3.12,profit:.69,customers:13210,aov:2360,growth:-4.8},
    east:{revenue:2.74,profit:.72,customers:10480,aov:2510,growth:9.7},
    west:{revenue:2.76,profit:.70,customers:9421,aov:2580,growth:6.2}
  };
  let charts = {};

  const style = document.createElement('style');
  style.textContent = `
    .pulse-overlay{position:fixed;inset:0;z-index:1000;background:rgba(3,5,8,.72);backdrop-filter:blur(18px);display:grid;place-items:center;padding:20px;opacity:0;pointer-events:none;transition:.28s ease}.pulse-overlay.open{opacity:1;pointer-events:auto}.pulse-modal{width:min(1100px,100%);max-height:min(88vh,900px);overflow:auto;background:linear-gradient(145deg,#11151b,#0b0d11);border:1px solid rgba(255,255,255,.12);border-radius:24px;box-shadow:0 40px 120px rgba(0,0,0,.55);padding:28px}.pulse-modal-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:24px}.pulse-modal-head h2{font:500 clamp(28px,4vw,46px)/1 'Space Grotesk';letter-spacing:-.05em;margin:7px 0}.pulse-close{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:#171a20;color:#aaa}.workspace-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}.workspace-card{background:#0d1015;border:1px solid rgba(255,255,255,.08);border-radius:17px;padding:20px}.workspace-card h3{font:500 17px 'Space Grotesk';margin:0 0 15px;letter-spacing:-.03em}.employee{display:flex;gap:14px;align-items:center;padding:13px;border:1px solid rgba(255,255,255,.06);border-radius:12px;margin-bottom:8px;background:rgba(255,255,255,.02)}.employee .avatar{flex:none}.employee strong{display:block;font-size:13px}.employee small{color:#737a85;font-size:10px}.employee-score{margin-left:auto;font:500 16px 'Space Grotesk'}.workspace-statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.workspace-stat{padding:13px;border-radius:11px;background:#15181e}.workspace-stat small{display:block;color:#6e7580;font-size:9px}.workspace-stat strong{display:block;font:500 20px 'Space Grotesk';margin-top:6px}.workspace-input{display:flex;gap:8px;margin-top:12px}.workspace-input input,.workspace-input select{min-width:0;flex:1;background:#171a20;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 12px;color:#eee;outline:none}.workspace-input input:focus{border-color:#69d7d2}.workspace-output{margin-top:12px;padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(255,216,77,.08),rgba(105,215,210,.06));border:1px solid rgba(255,255,255,.08);color:#cdd1d8;font-size:12px;line-height:1.65;min-height:70px}.workspace-tags{display:flex;gap:6px;flex-wrap:wrap}.workspace-tag{padding:6px 9px;border-radius:999px;background:#181b21;color:#949ba6;font-size:9px}.benefits-live{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.benefit-live{position:relative;min-height:260px;padding:23px;border-radius:18px;overflow:hidden;background:#0e1014;border:1px solid rgba(255,255,255,.08);transition:.25s}.benefit-live:hover{transform:translateY(-5px);border-color:rgba(255,255,255,.17)}.benefit-live .pulse-orb{position:absolute;width:160px;height:160px;border-radius:50%;right:-50px;top:-50px;background:radial-gradient(circle,#ffe16a,rgba(255,216,77,.08) 55%,transparent 70%);filter:blur(3px);animation:benefitPulse 4s ease-in-out infinite}.benefit-live:nth-child(2) .pulse-orb{background:radial-gradient(circle,#69d7d2,rgba(105,215,210,.08) 55%,transparent 70%);animation-delay:.7s}.benefit-live:nth-child(3) .pulse-orb{background:radial-gradient(circle,#5ce18a,rgba(92,225,138,.08) 55%,transparent 70%);animation-delay:1.4s}.benefit-live h3{font:500 22px 'Space Grotesk';margin:35px 0 10px}.benefit-live p{color:#858c97;font-size:12px;line-height:1.65;max-width:350px}.benefit-live .metric{margin-top:20px;font:500 28px 'Space Grotesk'}.benefit-live .metric small{font:400 10px 'DM Sans';color:#737b85}.live-control{display:flex;gap:8px;align-items:center;margin-top:16px}.live-control input{flex:1;accent-color:#69d7d2}.live-control button{border:1px solid rgba(255,255,255,.1);background:#171a20;border-radius:9px;padding:8px 11px;font-size:10px}.analyst-entry{cursor:pointer;transition:.22s}.analyst-entry:hover{background:rgba(255,255,255,.07)!important;transform:translateX(3px)}
    .live-chart-note{display:flex;align-items:center;gap:8px;color:#6f7782;font-size:10px;margin-top:8px}.live-chart-dot{width:6px;height:6px;border-radius:50%;background:#5ce18a;box-shadow:0 0 10px #5ce18a}.analysis-composer{margin-top:15px;padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#0b0d11}.analysis-composer textarea{width:100%;min-height:80px;resize:vertical;background:transparent;border:0;outline:0;color:#e9ecf0;font:13px/1.5 'DM Sans'}.analysis-actions{display:flex;justify-content:space-between;align-items:center;gap:8px}.analysis-actions button{border:0;border-radius:9px;padding:9px 13px;background:#f2f3f5;color:#08090b;font-size:11px;font-weight:600}.analysis-result{margin-top:12px;padding:14px;border-left:2px solid #69d7d2;background:rgba(105,215,210,.04);color:#b9c0c9;font-size:12px;line-height:1.65}
    @keyframes benefitPulse{0%,100%{transform:scale(.9);opacity:.65}50%{transform:scale(1.15);opacity:1}}
    @media(max-width:850px){.workspace-grid,.benefits-live{grid-template-columns:1fr}.workspace-statgrid{grid-template-columns:repeat(2,1fr)}.pulse-modal{padding:20px}}
  `;
  document.head.appendChild(style);

  function toast(message){
    const t=$('#toast'); if(!t)return;
    t.textContent=message; t.classList.add('show'); clearTimeout(window.__pulseToast);
    window.__pulseToast=setTimeout(()=>t.classList.remove('show'),2400);
  }

  function go(name){
    const target=$('#page-'+name);
    if(!target)return;
    $$('.page').forEach(x=>x.classList.remove('active','page-active'));
    target.classList.add('active');
    $$('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===name));
    $('#pageTitle').textContent=pages[name]||pages.overview;
    $('.sidebar')?.classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(()=>window.lucide?.createIcons?.(),0);
    if(name==='performance') startLivePerformance();
  }

  function enter(){
    const s=$('#splash'); if(!s)return;
    s.classList.add('leaving'); s.style.pointerEvents='none';
    setTimeout(()=>{$('#splash')?.classList.add('hidden');$('#app')?.classList.remove('hidden');document.body.classList.add('entered')},650);
  }

  function chart(id,type,data,options={}){
    const c=document.getElementById(id); if(!c || typeof Chart==='undefined')return null;
    try{return charts[id]=new Chart(c,{type,data,options:{responsive:true,maintainAspectRatio:false,animation:{duration:700},interaction:{mode:'index',intersect:false},plugins:{legend:{display:false}},...options}})}catch(e){console.warn('Chart init failed',id,e);return null}
  }

  function chartsInit(){
    if(typeof Chart==='undefined')return;
    chart('revenueChart','line',{labels:months,datasets:[{data:rev,label:'Revenue',borderColor:'#ffd84d',backgroundColor:'rgba(255,216,77,.08)',fill:true,tension:.42,pointRadius:0,borderWidth:2},{data:profit,label:'Profit',borderColor:'#69d7d2',fill:false,tension:.42,pointRadius:0,borderWidth:2}]},{scales:{x:{grid:{display:false},ticks:{color:'#5c6980',font:{size:9}}},y:{grid:{color:'rgba(70,86,115,.12)'},ticks:{color:'#5c6980',font:{size:9}},border:{display:false}}}});
    chart('performanceChart','line',{labels:months,datasets:[{label:'Revenue',data:rev,borderColor:'#ffd84d',backgroundColor:'rgba(255,216,77,.09)',fill:true,tension:.4,pointRadius:3,borderWidth:2}]},{scales:{x:{grid:{display:false},ticks:{color:'#5c6980',font:{size:9}}},y:{grid:{color:'rgba(70,86,115,.12)'},ticks:{color:'#5c6980',font:{size:9}},border:{display:false}}}});
    chart('channelChart','doughnut',{labels:['Online','Retail','Partner'],datasets:[{data:[54,31,15],backgroundColor:['#ffd84d','#a17df2','#56c6d6'],borderWidth:0}]},{cutout:'74%'});
    const labels=[...months,'Sep','Oct','Nov','Dec','Jan','Feb'];
    chart('forecastChart','line',{labels,datasets:[{label:'Actual',data:[...rev,null,null,null,null,null,null],borderColor:'#ffd84d',backgroundColor:'rgba(255,216,77,.07)',fill:true,tension:.4,pointRadius:0},{label:'Forecast',data:[null,null,null,null,null,null,null,null,null,null,12.1,12.48,12.75,13.02,13.28,13.55,13.83,14.02],borderColor:'#69d7d2',backgroundColor:'rgba(105,215,210,.05)',fill:true,tension:.4,pointRadius:0,borderDash:[6,5]}]});
    chart('scenarioChart','line',{labels:['Current','Scenario 1','Scenario 2','Scenario 3','Scenario 4'],datasets:[{label:'Revenue',data:[12.48,12.72,12.94,13.18,13.31],borderColor:'#ffd84d',backgroundColor:'rgba(255,216,77,.08)',fill:true,tension:.4,pointRadius:3},{label:'Profit',data:[3.17,3.22,3.31,3.42,3.48],borderColor:'#69d7d2',fill:false,tension:.4,pointRadius:3}]});
  }

  function applyFilters(){
    const r=($('#regionFilter')?.value||'All Regions').toLowerCase().replace('all regions','all');
    const category=$('#categoryFilter')?.value||'All categories'; const period=$('#periodFilter')?.value||'Last 12 months';
    let d={...(datasets[r]||datasets.all)}; const factor=period==='Last 6 months'?.94:period==='Last 90 days'?.91:1;
    if(category!=='All categories'){const f={Electronics:1.14,Furniture:.82,'Home & Kitchen':1.05,Fashion:1.01,Sports:.97}[category]||1;d.revenue*=f;d.profit*=f*.98;d.customers=Math.round(d.customers*(.85+f*.15));d.aov=Math.round(d.aov*(.95+f*.05));d.growth+=(f-1)*10}
    const revenue=d.revenue*factor, p=d.profit*factor, customers=Math.round(d.customers*factor), aov=d.aov;
    const vals=[`₹${revenue.toFixed(2)}<span>Cr</span>`,`₹${p.toFixed(2)}<span>Cr</span>`,customers.toLocaleString(),`₹${aov.toLocaleString()}`];
    $$('.kpi-value').forEach((x,i)=>x.innerHTML=vals[i]||x.innerHTML);
    $$('.kpi-change').forEach((x,i)=>{if(i===0)x.innerHTML=`↗ ${d.growth.toFixed(1)}% <em>filtered view</em>`});
    if(charts.revenueChart){const m=revenue/12.48;charts.revenueChart.data.datasets[0].data=rev.map(v=>+(v*m).toFixed(2));charts.revenueChart.data.datasets[1].data=profit.map(v=>+(v*(p/3.17)).toFixed(2));charts.revenueChart.update('none')}
    window.lucide?.createIcons?.(); toast(`Intelligence view updated · ${r==='all'?'all regions':r} · ${category}`);
  }

  function scenario(){
    const d=+($('#discountSlider')?.value||16), i=+($('#inventorySlider')?.value||78), m=+($('#marketingSlider')?.value||24);
    $('#discountValue')&&(('#discountValue').textContent=d+'%');
    if($('#discountValue'))$('#discountValue').textContent=d+'%'; if($('#inventoryValue'))$('#inventoryValue').textContent=i+'%'; if($('#marketingValue'))$('#marketingValue').textContent=m+'%';
    const r=12.48+(d-16)*.018+(i-78)*.006+(m-24)*.022, p=3.17-(d-16)*.009+(i-78)*.004+(m-24)*.008, margin=p/r*100, risk=Math.max(12,Math.min(86,42+(d-16)*2-(i-78)*.7-(m-24)*.9));
    if($('#scenarioRevenue'))$('#scenarioRevenue').textContent='₹'+r.toFixed(2)+'Cr'; if($('#scenarioProfit'))$('#scenarioProfit').textContent='₹'+p.toFixed(2)+'Cr'; if($('#scenarioMargin'))$('#scenarioMargin').textContent=margin.toFixed(1)+'%'; if($('#revDelta'))$('#revDelta').textContent=((r/12.48-1)*100).toFixed(1)+'%'; if($('#profitDelta'))$('#profitDelta').textContent=((p/3.17-1)*100).toFixed(1)+'%'; if($('#marginDelta'))$('#marginDelta').textContent=(margin-25.4).toFixed(1)+'pp';
    if($('#scenarioRisk')){const riskLabel=risk<35?'Low':risk<55?'Moderate':'High';$('#scenarioRisk').textContent=riskLabel;$('#scenarioRisk').style.color=risk<35?'#5ee4a0':risk<55?'#e2b05d':'#ff7185'}
    const good=risk<50&&p>=3.17; if($('#scenarioStatus')){ $('#scenarioStatus').textContent=good?'Favorable':'Watch closely';$('#scenarioStatus').className='trend-chip '+(good?'positive':'negative') } if($('#scenarioVerdict'))$('#scenarioVerdict').textContent=good?'Reduce discount pressure and keep North investment elevated.':'Protect margin first: avoid deeper discounts and review inventory allocation.'; if($('#scenarioVerdictText'))$('#scenarioVerdictText').textContent=good?'This scenario improves profitability while preserving the strongest source of growth.':'The current mix increases risk faster than it creates incremental profit.';
    if(charts.scenario){charts.scenario.data.datasets[0].data=[12.48,r-.36,r-.18,r,r+.13];charts.scenario.data.datasets[1].data=[3.17,p-.12,p-.05,p,p+.06];charts.scenario.update('none')}
  }

  function startLivePerformance(){
    if(window.__livePerformance || !charts.performanceChart)return;
    window.__livePerformance=setInterval(()=>{
      const c=charts.performanceChart; if(!c)return;
      const base=rev.map((v,i)=>+(v*(1+Math.sin(Date.now()/2600+i)/180)).toFixed(2));
      c.data.datasets[0].data=base; c.update('none');
      $('#performanceLiveStatus')?.replaceChildren(document.createTextNode('Live simulation · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})));
    },900);
  }

  function analystAnswer(q){
    const text=q.toLowerCase();
    if(text.includes('churn')||text.includes('retention'))return '<strong>Retention signal detected.</strong><br>South is the main pressure point. Churn is concentrated in inactive accounts with falling renewal activity. Recommended action: segment at-risk customers, trigger a 7-day re-engagement sequence, and monitor renewal conversion daily.';
    if(text.includes('revenue')||text.includes('sales'))return '<strong>Revenue diagnosis.</strong><br>Revenue is ₹12.48 Cr, up 8.4%. The strongest contributor is North (+18.4%), while South is the only region in decline. The highest-value next step is to protect South margin while scaling North demand.';
    if(text.includes('employee')||text.includes('team')||text.includes('performance'))return '<strong>People performance view.</strong><br>The workspace shows 24 active analysts, 91% task completion, and 3 review queues. Focus first on the two analysts below the team quality baseline and rebalance the open review queue.';
    return '<strong>Pulse interpretation.</strong><br>I found a meaningful decision signal but need a narrower question to quantify it. Try: “Why did revenue drop?”, “Which region needs attention?”, “Analyze churn”, or “Review team performance”.';
  }

  function addWorkspace(){
    if($('#analystWorkspace'))return;
    const overlay=document.createElement('div');overlay.id='analystWorkspace';overlay.className='pulse-overlay';overlay.innerHTML=`
      <div class="pulse-modal" role="dialog" aria-modal="true" aria-label="Analyst Workspace">
        <div class="pulse-modal-head"><div><div class="kicker">PULSE / ANALYST WORKSPACE</div><h2>Work, investigate, decide.</h2><p class="muted" style="margin:0;max-width:620px;font-size:13px;line-height:1.6">A working analyst cockpit for people, performance, data quality, investigations and decision follow-through.</p></div><button class="pulse-close" id="closeWorkspace">×</button></div>
        <div class="workspace-grid">
          <div class="workspace-card"><h3>Ask Pulse about the business</h3><div class="analysis-composer"><textarea id="analystQuestion" placeholder="Ask a business question… e.g. Why did revenue drop in South? What is driving churn?"></textarea><div class="analysis-actions"><span class="muted" style="font-size:9px">Deterministic demo intelligence · no external API required</span><button id="runAnalyst">Run analysis →</button></div></div><div id="analystResult" class="analysis-result">Your analysis will appear here with a recommended next action.</div><div style="height:18px"></div><h3>Team performance</h3><div class="workspace-statgrid"><div class="workspace-stat"><small>Active analysts</small><strong>24</strong></div><div class="workspace-stat"><small>Tasks completed</small><strong>91%</strong></div><div class="workspace-stat"><small>Open reviews</small><strong>03</strong></div><div class="workspace-stat"><small>Avg. quality</small><strong>94.2</strong></div><div class="workspace-stat"><small>Data freshness</small><strong>98%</strong></div><div class="workspace-stat"><small>Signals today</small><strong>17</strong></div></div></div>
          <div class="workspace-card"><h3>People & ownership</h3><div class="employee"><div class="avatar">AR</div><div><strong>Ananya Rao</strong><small>Senior Data Analyst · Revenue</small></div><div class="employee-score positive">96</div></div><div class="employee"><div class="avatar">VK</div><div><strong>Vikram Kapoor</strong><small>Business Analyst · Retention</small></div><div class="employee-score positive">93</div></div><div class="employee"><div class="avatar">MS</div><div><strong>Maya Shah</strong><small>BI Analyst · Operations</small></div><div class="employee-score">89</div></div><div class="employee"><div class="avatar">RK</div><div><strong>Rohan Kumar</strong><small>Data Analyst · Customer</small></div><div class="employee-score negative">78</div></div><h3 style="margin-top:22px">Active data sources</h3><div class="workspace-tags"><span class="workspace-tag">Salesforce</span><span class="workspace-tag">ERP</span><span class="workspace-tag">Product DB</span><span class="workspace-tag">Marketing</span><span class="workspace-tag">Support</span></div><div style="margin-top:18px;padding:13px;border-radius:11px;background:#15181e;color:#858c97;font-size:10px;line-height:1.6"><strong style="color:#e8eaee">Next review</strong><br>South retention cohort · owner Vikram Kapoor · due today · <span style="color:#5ce18a">On track</span></div></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    $('#closeWorkspace').onclick=()=>overlay.classList.remove('open');
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});
    $('#runAnalyst').onclick=()=>{$('#analystResult').innerHTML=analystAnswer($('#analystQuestion').value.trim()||'Give me a business overview');toast('Analysis completed · recommendation generated')};
    $('#analystQuestion').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')$('#runAnalyst').click()});
    $$('.analyst-entry').forEach(x=>x.addEventListener('click',()=>overlay.classList.add('open')));
    $$('.workspace').forEach(x=>x.addEventListener('click',()=>overlay.classList.add('open')));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});
  }

  function addBenefitsPage(){
    if($('#page-benefits'))return;
    const nav=$('.side-nav');
    if(nav){const b=document.createElement('button');b.className='nav-item';b.dataset.page='benefits';b.innerHTML='<span>✦</span> Benefits';nav.appendChild(b);b.onclick=()=>go('benefits')}
    const content=$('.content'); if(!content)return;
    const page=document.createElement('section');page.id='page-benefits';page.className='page';page.innerHTML=`<div class="page-head"><div><div class="kicker">PULSE / VALUE LAYER</div><h2>Key Benefits</h2><p>Turn business data into a working decision loop: detect the signal, understand the cause, test the response and move with confidence.</p></div><div class="actions"><button class="smallbtn primary" id="benefitRefresh">Refresh signals</button></div></div><div class="benefits-live"><article class="benefit-live"><div class="pulse-orb"></div><div class="kicker">01 / PREEMPTIVE</div><h3>Spot risks before they become problems.</h3><p>Monitor changing revenue, retention, operational and team signals instead of waiting for a monthly report to explain what already happened.</p><div class="metric" id="benefitRisk">17 <small>signals detected</small></div><div class="live-control"><input id="riskSensitivity" type="range" min="20" max="100" value="72"><span class="muted" style="font-size:10px">Sensitivity</span></div></article><article class="benefit-live"><div class="pulse-orb"></div><div class="kicker">02 / EXPLAINABLE</div><h3>Know why a metric moved.</h3><p>Move from a chart to contributing regions, categories and cohorts, then turn the finding into a clear analyst recommendation.</p><div class="metric" id="benefitExplain">4 <small>drivers identified</small></div><div class="live-control"><input id="explainDepth" type="range" min="1" max="8" value="4"><span class="muted" style="font-size:10px">Depth</span></div></article><article class="benefit-live"><div class="pulse-orb"></div><div class="kicker">03 / ACTIONABLE</div><h3>Convert insight into an owned decision.</h3><p>Assign an owner, create a review item and track the result. The dashboard becomes a place where work happens, not just where numbers are displayed.</p><div class="metric" id="benefitActions">08 <small>actions in motion</small></div><div class="live-control"><button id="benefitAction">Create action</button><span id="benefitActionState" class="muted" style="font-size:10px">Ready</span></div></article></div>`;
    content.appendChild(page);
    $('#benefitRefresh').onclick=()=>{const n=17+Math.floor(Math.random()*6);$('#benefitRisk').innerHTML=n+' <small>signals detected</small>';toast('Benefits intelligence refreshed')};
    $('#riskSensitivity').oninput=e=>{$('#benefitRisk').innerHTML=Math.round(10+e.target.value/3)+' <small>signals detected</small>'};
    $('#explainDepth').oninput=e=>{$('#benefitExplain').innerHTML=e.target.value+' <small>drivers identified</small>'};
    $('#benefitAction').onclick=()=>{$('#benefitActionState').textContent='Action created · owner assigned';toast('Action added to decision queue')};
  }

  function bindInteractions(){
    $$('.nav-item[data-page]').forEach(b=>b.onclick=()=>go(b.dataset.page));
    $$('.page-link').forEach(b=>b.onclick=()=>go(b.dataset.page));
    $('#enterBtn')&&( $('#enterBtn').onclick=enter ); $('#skipBtn')&&( $('#skipBtn').onclick=enter );
    $('#openNav')&&($('#openNav').onclick=()=>$('.sidebar')?.classList.add('open')); $('#closeNav')&&($('#closeNav').onclick=()=>$('.sidebar')?.classList.remove('open'));
    $('#themeBtn')&&($('#themeBtn').onclick=()=>{document.body.classList.toggle('light');localStorage.pulseTheme=document.body.classList.contains('light')?'light':'dark';toast('Theme switched')});
    if(localStorage.pulseTheme==='light')document.body.classList.add('light');
    $('#refreshBtn')&&($('#refreshBtn').onclick=()=>{toast('Signal refreshed · intelligence feeds current');document.body.classList.add('data-flash');setTimeout(()=>document.body.classList.remove('data-flash'),600)});
    $('#notifyBtn')&&($('#notifyBtn').onclick=()=>{go('decisions');toast('Opened decision queue · 3 signals waiting')});
    $('#generateBtn')&&($('#generateBtn').onclick=()=>toast('Fresh decision brief generated'));
    $('#exportBtn')&&($('#exportBtn').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['PULSE — Executive Brief\nRevenue ₹12.48 Cr (+8.4%)\nProfit ₹3.17 Cr (+5.8%)\nKey signal: Furniture × South is the largest source of margin pressure.'],{type:'text/plain'}));a.download='pulse-executive-brief.txt';a.click();toast('Executive brief exported')});
    $('#searchBtn')&&($('#searchBtn').onclick=()=>{$('#searchModal')?.classList.add('open');$('#searchInput')?.focus()}); $('#closeSearch')&&($('#closeSearch').onclick=()=>$('#searchModal')?.classList.remove('open'));
    $('#searchModal')&&($('#searchModal').onclick=e=>{if(e.target.id==='searchModal')e.currentTarget.classList.remove('open')});
    $$('.action-btn').forEach(b=>b.onclick=()=>{b.classList.add('done');b.innerHTML='✓ Added to review';toast('Action added to review queue')});
    ['regionFilter','categoryFilter','periodFilter'].forEach(id=>{if($('#'+id))$('#'+id).onchange=applyFilters});
    $$('.metric-switch button').forEach((b,i)=>b.onclick=()=>{ $$('.metric-switch button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const names=['Revenue','Profit','Orders'];toast('Metric switched · '+names[i]);if(charts.performanceChart){const data=i===0?rev:i===1?profit:rev.map(x=>Math.round(x*380));charts.performanceChart.data.datasets[0].data=data;charts.performanceChart.data.datasets[0].label=names[i];charts.performanceChart.update()}});
    ['discountSlider','inventorySlider','marketingSlider'].forEach(id=>{if($('#'+id))$('#'+id).oninput=scenario});
    $('#resetScenario')&&($('#resetScenario').onclick=()=>{if($('#discountSlider'))$('#discountSlider').value=16;if($('#inventorySlider'))$('#inventorySlider').value=78;if($('#marketingSlider'))$('#marketingSlider').value=24;scenario();toast('Scenario reset')});
    $$('.kpi-card').forEach((card,i)=>card.addEventListener('click',()=>{const labels=['Revenue','Gross profit','Customers','Average order value'];toast(labels[i]+' · drill-down ready');card.classList.add('selected');setTimeout(()=>card.classList.remove('selected'),500)}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#searchModal')?.classList.remove('open');$('.sidebar')?.classList.remove('open')}});
  }

  function addParticles(){
    const splash=$('#splash');if(!splash)return;const canvas=document.createElement('canvas');canvas.className='particle-canvas';splash.prepend(canvas);const ctx=canvas.getContext('2d');let pts=[];
    function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(90,Math.floor(innerWidth/15))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2+.4,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,a:Math.random()*.55+.15}))}
    function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(let i=0;i<pts.length;i++){const a=pts[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>innerWidth)a.vx*=-1;if(a.y<0||a.y>innerHeight)a.vy*=-1;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle=`rgba(132,158,255,${a.a})`;ctx.fill();for(let j=i+1;j<pts.length;j++){const b=pts[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<120){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(100,130,255,${.045*(1-dist/120)})`;ctx.stroke()}}}requestAnimationFrame(draw)}
    addEventListener('resize',resize);resize();draw();
  }

  function init(){
    if(window.lucide?.createIcons)window.lucide.createIcons();
    addParticles(); addBenefitsPage(); addWorkspace(); bindInteractions(); chartsInit();
    setTimeout(enter,4200);
    if($('#page-overview'))go('overview');
    window.addEventListener('beforeunload',()=>clearInterval(window.__livePerformance));
  }
  init();
})();
