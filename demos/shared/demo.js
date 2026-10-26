(() => {
  'use strict';
  const key=document.body.dataset.demo,$=id=>document.getElementById(id);
  const configs={
    'energy-planner':{intro:'Compare hourly demand with an idealized rooftop solar profile. Move the sliders to explore a different day.',controls:[['demand','Daily electricity demand',100,1500,50,600,'kWh'],['solar','Solar capacity',0,300,10,100,'kW']],heading:'Demand and generation / hourly energy (kWh)',legend:[['Demand','#286c79'],['Solar generation','#739f32']],assumptions:'An illustrative 24-hour load profile is scaled to the selected daily demand. Solar output = installed capacity × max(0, sin(π × (hour − 6) / 12)) × 0.8, sampled at each hour midpoint. Each interval is one hour.\n\nGrid import = sum of max(demand − generation, 0). Solar supplied = sum of min(demand, generation) / total demand. Excess solar is exported with no storage. Weather, losses beyond the fixed factor, prices and battery operation are not modeled.'},
    'fleet-explorer':{intro:'Change collection demand and fleet size to inspect a simple, evenly distributed workload.',controls:[['bins','Bins to collect',50,1000,10,300,'bins'],['vehicles','Available vehicles',1,20,1,6,'vehicles']],heading:'Assigned collection trips / vehicle',legend:[['Trips per vehicle','#286c79']],assumptions:'Each trip collects up to 40 bins and covers a fixed 18 km. Required trips = ceil(bins / 40). Trips are assigned as evenly as possible across available vehicles. Energy = trips × 18 km × 0.85 kWh/km.\n\nThis is a workload illustration, not a routing or charging optimizer. It omits bin volume, service time, payload, traffic, depot distance, battery limits and real routes. Adding vehicles changes the workload distribution, not total travel in this simplified model. It does not reproduce the published waste-bin allocation paper.'},
    'scenario-notebook':{intro:'Move part of an evening load to the early morning. Compare the baseline and shifted hourly profiles.',controls:[['demand','Daily electricity demand',100,2000,50,800,'kWh'],['flexibility','Evening demand shifted',0,60,5,25,'%']],heading:'Baseline and shifted demand / hourly energy (kWh)',legend:[['Baseline','#286c79'],['Shifted scenario','#739f32']],assumptions:'A fixed, illustrative 24-hour profile is scaled to the selected daily demand. The selected fraction is removed from hours 17:00–21:59 and distributed equally across hours 01:00–05:59. Total daily energy is conserved.\n\nPeak change = (baseline peak − scenario peak) / baseline peak. A negative value means the shifted profile creates a higher peak. This example models load shifting only; it does not account for prices, comfort, network constraints or equipment capabilities.'}
  };
  const config=configs[key];if(!config)return;
  $('introduction').textContent=config.intro;$('chart-heading').textContent=config.heading;$('assumptions').textContent=config.assumptions;
  const nodes={},values={};let rows=[];
  const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const fmt=(n,digits=0)=>n.toLocaleString('en-US',{maximumFractionDigits:digits,minimumFractionDigits:digits});
  config.controls.forEach(([id,label,min,max,step,initial,unit])=>{
    const box=node('div',undefined,'control'),lab=node('label',label);lab.htmlFor=id;
    const out=node('output');out.htmlFor=id;
    const input=node('input');Object.assign(input,{id,type:'range',min,max,step,value:initial});input.setAttribute('aria-label',label);
    const limits=node('div',undefined,'range-limits');limits.append(node('span',min+' '+unit),node('span',max+' '+unit));
    box.append(lab,out,input,limits);$('controls').append(box);nodes[id]={input,out,unit};values[id]=initial;
    input.addEventListener('input',()=>{values[id]=Number(input.value);render();});
  });
  config.legend.forEach(([label,color])=>{const item=node('span'),swatch=node('i');swatch.style.background=color;swatch.setAttribute('aria-hidden','true');item.append(swatch,document.createTextNode(label));$('legend').append(item);});
  const weights=[.55,.5,.48,.48,.5,.65,.9,1.2,1.3,1.15,1.05,1.1,1.05,1,1.05,1.15,1.3,1.6,1.8,1.7,1.45,1.15,.85,.65];
  function demandProfile(demand){const total=weights.reduce((a,b)=>a+b,0);return weights.map(w=>w/total*demand);}
  function metric(label,value,unit){const item=node('div',undefined,'metric'),strong=node('strong',value);strong.append(node('small',unit));item.append(node('p',label),strong);return item;}
  const ns='http://www.w3.org/2000/svg';
  function svg(tag,attrs={},text){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n;}
  function chart(series,bar=false){
    const target=$('chart');target.replaceChildren();const left=48,right=680,top=18,bottom=227,width=right-left,height=bottom-top;
    const max=Math.max(...series.flatMap(s=>s.values),1)*1.12;
    target.append(svg('title',{id:'chart-title'},config.heading),svg('desc',{id:'chart-desc'},bar?'Bar heights show assigned trips for each vehicle. Export CSV for exact values.':'Two lines compare hourly values from 00:00 to 23:00. Export CSV for exact values.'));
    for(let i=0;i<=4;i++){const y=bottom-height*i/4;target.append(svg('line',{x1:left,y1:y,x2:right,y2:y,stroke:'#dce4d7'}),svg('text',{x:left-9,y:y+4,'text-anchor':'end',fill:'#617160','font-size':11,'font-family':'monospace'},fmt(max*i/4,max<10?1:0)));}
    series.forEach(s=>{
      if(bar){const slot=width/s.values.length;s.values.forEach((v,i)=>{const h=v/max*height;const rect=svg('rect',{x:left+slot*i+slot*.18,y:bottom-h,width:slot*.64,height:h,rx:2,fill:s.color});rect.append(svg('title',{},'Vehicle '+(i+1)+': '+v+' trips'));target.append(rect,svg('text',{x:left+slot*(i+.5),y:bottom+21,'text-anchor':'middle',fill:'#617160','font-size':10,'font-family':'monospace'},i+1));});}
      else{target.append(svg('path',{d:s.values.map((v,i)=>(i?'L':'M')+(left+width*i/23).toFixed(2)+' '+(bottom-v/max*height).toFixed(2)).join(' '),stroke:s.color,'stroke-width':3,fill:'none','stroke-linejoin':'round'}));}
    });
    if(!bar)[0,6,12,18,23].forEach(h=>target.append(svg('text',{x:left+width*h/23,y:bottom+23,'text-anchor':'middle',fill:'#617160','font-size':11,'font-family':'monospace'},String(h).padStart(2,'0')+':00')));
  }
  function render(){
    Object.entries(nodes).forEach(([id,n])=>{n.out.textContent=fmt(values[id])+' '+n.unit;n.input.setAttribute('aria-valuetext',fmt(values[id])+' '+n.unit);});
    const metrics=$('metrics');metrics.replaceChildren();
    if(key==='fleet-explorer'){
      const trips=Math.ceil(values.bins/40),assignment=Array.from({length:values.vehicles},(_,i)=>Math.floor(trips/values.vehicles)+(i<trips%values.vehicles?1:0));
      metrics.append(metric('Required trips',fmt(trips),'trips'),metric('Total distance',fmt(trips*18),'km'),metric('Fleet energy',fmt(trips*18*.85,1),'kWh'));
      chart([{values:assignment,color:'#286c79'}],true);rows=[['vehicle','trips','distance_km','energy_kwh'],...assignment.map((n,i)=>[i+1,n,n*18,(n*18*.85).toFixed(2)])];
    }else{
      const baseline=demandProfile(values.demand);let second;
      if(key==='energy-planner'){
        second=baseline.map((_,h)=>values.solar*Math.max(0,Math.sin(Math.PI*(h+.5-6)/12))*.8);
        const generated=second.reduce((a,b)=>a+b,0),imported=baseline.reduce((a,v,i)=>a+Math.max(v-second[i],0),0);
        metrics.append(metric('Solar generation',fmt(generated,1),'kWh'),metric('Grid import',fmt(imported,1),'kWh'),metric('Solar supplied',fmt((1-imported/values.demand)*100,1),'% of demand'));
        rows=[['hour','demand_kwh','solar_kwh','grid_import_kwh','export_kwh'],...baseline.map((v,i)=>[String(i).padStart(2,'0')+':00',v.toFixed(4),second[i].toFixed(4),Math.max(v-second[i],0).toFixed(4),Math.max(second[i]-v,0).toFixed(4)])];
      }else{
        second=baseline.slice();let shifted=0;for(let h=17;h<=21;h++){const moved=baseline[h]*values.flexibility/100;second[h]-=moved;shifted+=moved;}for(let h=1;h<=5;h++)second[h]+=shifted/5;
        const peak=Math.max(...baseline),scenarioPeak=Math.max(...second);
        metrics.append(metric('Daily energy',fmt(values.demand),'kWh'),metric('Energy shifted',fmt(shifted,1),'kWh'),metric('Peak change',fmt((peak-scenarioPeak)/peak*100,1),'% reduction'));
        rows=[['hour','baseline_kwh','shifted_kwh'],...baseline.map((v,i)=>[String(i).padStart(2,'0')+':00',v.toFixed(4),second[i].toFixed(4)])];
      }
      chart([{values:baseline,color:'#286c79'},{values:second,color:'#739f32'}]);
    }
  }
  $('reset').addEventListener('click',()=>{config.controls.forEach(([id,,,,,initial])=>{values[id]=initial;nodes[id].input.value=initial;});render();});
  $('export').addEventListener('click',()=>{const csv=rows.map(row=>row.join(',')).join('\r\n');const address=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=address;a.download=key+'-illustrative-scenario.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(address),1500);});
  render();
})();
