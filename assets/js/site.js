/* ==========================================================================
   Wiring + visuals. To change any words on the site, edit
   assets/js/content.js instead — nothing in this file needs touching.
   ========================================================================== */
'use strict';
const C=window.CONTENT||{};
const cget=p=>p.split('.').reduce((o,k)=>(o==null?o:o[k]),C);

/* ===================== CONTENT BINDING ===================== */
(function BIND(){
  const q=s=>[...document.querySelectorAll(s)];
  q('[data-c]').forEach(el=>{const v=cget(el.dataset.c);if(v!=null)el.innerHTML=v});
  q('[data-c-href]').forEach(el=>{const v=cget(el.dataset.cHref);if(v)el.href=v});
  q('[data-c-spans]').forEach(el=>{const a=cget(el.dataset.cSpans)||[];
    el.innerHTML=a.map(t=>`<span>${t}</span>`).join('')});
  q('[data-c-list]').forEach(el=>{const a=cget(el.dataset.cList)||[];
    el.innerHTML=a.map(t=>`<p>${t}</p>`).join('')});
  q('[data-c-facts]').forEach(el=>{const a=cget(el.dataset.cFacts)||[];
    el.innerHTML=a.map(f=>`<div class="metric txt"><div class="mv">${f.value}</div><div class="ml">${f.label}</div></div>`).join('')});
  /* a PDF area shows an embed once a file is named in content.js, an empty slot until then */
  q('[data-pdf]').forEach(el=>{
    const d=cget(el.dataset.pdf)||{}, name=d.filename||'document.pdf';
    const bar=`<div class="pdfbar"><span class="dot"></span><span class="fn">${name}</span>`+
      `<span class="rt">${d.file?'embedded':'empty slot'}</span></div>`;
    el.innerHTML=bar+(d.file
      ? `<div class="pdfview"><object class="pdfdoc" data="${d.file}" type="application/pdf">`+
        `<div class="pdfslot" style="width:100%"><span class="ic"></span><span><b>${name}</b></span>`+
        `<span><a href="${d.file}">open the PDF</a> — this browser will not display it inline</span></div></object></div>`
      : `<div class="pdfview" style="padding:16px"><div class="pdfslot" style="width:100%">`+
        `<span class="ic"></span><span><b>${d.slotTitle||''}</b></span><span>${d.slotHint||''}</span></div></div>`)});
  const t=cget('site.title'); if(t){document.title=t;
    const og=document.querySelector('meta[property="og:title"]'); if(og)og.setAttribute('content',t)}
  const de=cget('site.description'), md=document.querySelector('meta[name="description"]');
  if(md&&de)md.setAttribute('content',de);
  q('.mocknote').forEach(el=>{if(!el.textContent.trim())el.remove()});
})();

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const TAU=Math.PI*2, RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const CL={am:'#FFB020',ice:'#6FC8F0',red:'#FF4A45',ink:'#F2ECE1',dim:'#9C9285',faint:'#635B50',line:'#2A2520',brass:'#B98A3C'};
const rgba=(h,a)=>`rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${a})`;
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* ===================== ONE SHARED CLOCK ===================== */
const TICKERS=[]; const T0=performance.now(); let TICK=0;
function frame(now){const t=(now-T0)/1000;TICK++;
  for(const f of TICKERS){if(f.vis&&(TICK%f.every===0))f.fn(t,TICK)}
  requestAnimationFrame(frame)}
function register(fn,{every=1,el=null}={}){
  const rec={fn,every,vis:!el};
  if(el)new IntersectionObserver(es=>{rec.vis=es[0].isIntersecting},{rootMargin:'160px'}).observe(el);
  TICKERS.push(rec);return rec}
requestAnimationFrame(frame);

/* ===================== BACKGROUND ===================== */
(function BG(){
  const cv=$('#bg'),x=cv.getContext('2d');
  let W=0,Hh=0,dpr=1,sites=[],mouse={x:.5,y:.4},mt={x:.5,y:.4};
  const RAMP=' .:-=+*#%@';
  function size(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;Hh=innerHeight;
    cv.width=W*dpr;cv.height=Hh*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  addEventListener('pointermove',e=>{mt.x=e.clientX/innerWidth;mt.y=e.clientY/innerHeight});
  for(let i=0;i<9;i++)sites.push({x:Math.random(),y:Math.random(),ph:Math.random()*TAU});
  const CELL=16;
  register(t=>{
    mouse.x=lerp(mouse.x,mt.x,.07);mouse.y=lerp(mouse.y,mt.y,.07);
    x.clearRect(0,0,W,Hh);
    const S=sites.map(s=>({x:(s.x+Math.sin(t*.09+s.ph)*.07)*W,y:(s.y+Math.cos(t*.07+s.ph*1.7)*.06)*Hh}));
    const mx=mouse.x*W,my=mouse.y*Hh;
    x.font='12px "JetBrains Mono",monospace';x.textBaseline='middle';x.textAlign='center';
    for(let gy=0;gy<Hh+CELL;gy+=CELL)for(let gx=0;gx<W+CELL;gx+=CELL){
      let b=1e12,sd=1e12,bi=0;
      for(let i=0;i<S.length;i++){const dx=S[i].x-gx,dy=S[i].y-gy,d=dx*dx+dy*dy;
        if(d<b){sd=b;b=d;bi=i}else if(d<sd)sd=d}
      const edge=Math.sqrt(sd)-Math.sqrt(b);
      const ang=Math.sin(gx*.006+t*.16)+Math.cos(gy*.008-t*.11)+bi*.4;
      const dm=Math.hypot(gx-mx,gy-my), near=Math.max(0,1-dm/340);
      let a=0.055+near*0.20;
      if(edge<12)a+=0.16*(1-edge/12)+near*.24;
      if(a<0.058)continue;
      const mag=(Math.sin(ang*1.7)+1)/2;
      const q=Math.floor(mag*(RAMP.length-1)*(0.5+near*0.5));
      x.fillStyle=rgba(edge<12?CL.am:CL.ink,Math.min(.6,a));
      x.fillText(RAMP[clamp(q,1,RAMP.length-1)],gx+CELL/2,gy+CELL/2)}
    for(let i=0;i<220;i++){
      const px=((i*137.5)%100)/100*W, py=((i*61.8)%100)/100*Hh;
      const dx=mx-px,dy=my-py,d=Math.hypot(dx,dy)+1;
      if(d>280)continue;
      const bend=(1-d/280)*2.2;
      const a=Math.sin(px*.006+t*.16)+Math.cos(py*.008-t*.11)+Math.atan2(dy,dx)*bend;
      x.strokeStyle=rgba(CL.am,(1-d/280)*.42);x.lineWidth=1;
      x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*12,py+Math.sin(a)*12);x.stroke()}
  },{every:RM?1e9:2});
})();

/* ===================== MARK + MENU ===================== */
const SECTIONS=(C.menu&&C.menu.length?C.menu:[{id:'hero',label:'Intro',ratio:[3,2]}]);
let CUR=0,RA=3,RB=2;
(function MARK(){
  const cv=$('#markc'),x=cv.getContext('2d');x.scale(2,2);
  register(t=>{
    const tg=SECTIONS[CUR].ratio;RA=lerp(RA,tg[0],.055);RB=lerp(RB,tg[1],.055);
    x.clearRect(0,0,42,42);
    const pts=[];
    for(let i=0;i<=200;i++){const u=i/200*TAU;
      pts.push([21+Math.sin(RA*u+t*.5)*15,21+Math.sin(RB*u)*15])}
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    x.strokeStyle=rgba(CL.am,.95);x.lineWidth=1.15;x.stroke();
    x.strokeStyle=rgba(CL.am,.15);x.lineWidth=3.6;x.stroke()});
  const menu=$('#menu'),btn=$('#markbtn');
  menu.innerHTML=SECTIONS.map((s,i)=>`<a href="#${s.id}" data-id="${s.id}" style="--d:${40+i*26}ms"><span>${s.label}</span><span class="s">${s.ratio[0]}:${s.ratio[1]}</span></a>`).join('');
  const close=()=>{menu.classList.remove('open');btn.setAttribute('aria-expanded','false')};
  btn.onclick=e=>{e.stopPropagation();const open=!menu.classList.contains('open');
    menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))};
  menu.onclick=e=>{if(e.target.closest('a'))close()};
  document.addEventListener('click',close);
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  const obs=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){
    const i=SECTIONS.findIndex(s=>s.id===en.target.id);
    if(i>=0){CUR=i;$$('#menu a').forEach(a=>a.setAttribute('aria-current',String(a.dataset.id===en.target.id)))}}}),
    {rootMargin:'-45% 0px -45% 0px'});
  SECTIONS.forEach(s=>obs.observe(document.getElementById(s.id)));
  addEventListener('scroll',()=>$('#hdr').classList.toggle('stuck',scrollY>20),{passive:true});
})();
$$('.reveal').forEach(el=>new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.06}).observe(el));

/* ===================== KEYWORD SPACE — 3D ===================== */
(function TAGS3D(){
  const GO={hpc:'#hpc',it:'#it',research:'#research'};
  const T=((C.skills&&C.skills.keywords)||[]).filter(k=>k&&k[0]&&GO[k[1]]);
  const wrap=$('#tagwrap'),cv=$('#tagc'),x=cv.getContext('2d'),read=$('#tagread');
  let Wd=0,Hd=0,dpr=1;
  const CEN={hpc:[-.78,-.34,.02],it:[.78,-.28,-.04],research:[.02,.66,.03]};
  let seed=31;const rr=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  const N=T.map((tg,i)=>{
    const c=CEN[tg[1]];
    // fibonacci-ish spread inside a small sphere per cluster
    const u=rr()*TAU,v=Math.acos(2*rr()-1),r=(0.35+Math.cbrt(rr())*.34);
    return {t:tg[0],g:tg[1],i,
      x:c[0]+Math.sin(v)*Math.cos(u)*r*1.05,
      y:c[1]+Math.cos(v)*r*.78,
      z:c[2]+Math.sin(v)*Math.sin(u)*r*1.05}});
  /* 3-D relaxation — separation scaled by label width so pills don't stack */
  (function relax3(){
    const hw=N.map(n=>0.070+n.t.length*0.0165), HH=0.150;
    for(let it=0;it<300;it++){
      for(let a=0;a<N.length;a++)for(let b=a+1;b<N.length;b++){
        const A=N[a],B=N[b];
        const dx=B.x-A.x,dz=B.z-A.z,dy=B.y-A.y;
        const need=hw[a]+hw[b];
        const dxz=Math.hypot(dx,dz)||1e-4;
        if(dxz<need&&Math.abs(dy)<HH*2){
          const push=(need-dxz)/dxz*0.42;
          A.x-=dx*push;A.z-=dz*push;B.x+=dx*push;B.z+=dz*push;
          const yp=(HH*2-Math.abs(dy))*0.06*(dy>=0?1:-1);
          A.y-=yp;B.y+=yp}}
      N.forEach(n=>{const c=CEN[n.g];
        n.x=lerp(n.x,c[0],.0022);n.y=lerp(n.y,c[1],.0030);n.z=lerp(n.z,c[2],.0030);
        n.x=clamp(n.x,-1.30,1.30);n.y=clamp(n.y,-1.00,1.00);n.z=clamp(n.z,-.80,.80)})}
  })();
  const el=N.map(n=>{const b=document.createElement('button');
    b.className='tag';b.type='button';b.textContent=n.t;b.dataset.g=n.g;
    b.addEventListener('pointerenter',()=>hot(n));
    b.addEventListener('pointerleave',()=>{HOT=null;read.textContent='30 keywords · 3 clusters · hover to trace co-occurrence'});
    b.addEventListener('focus',()=>hot(n));
    b.addEventListener('blur',()=>{HOT=null});
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
      if(moved)return;
      const tgt=document.querySelector(GO[n.g]);
      if(tgt)tgt.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})});
    wrap.append(b);return b});
  let HOT=null,rotY=.35,rotX=-.10,spin=.10,drag=null,inside=false,moved=false,velY=0,velX=0;
  function hot(n){
    HOT=n;
    const near=N.filter(o=>o!==n&&o.g===n.g)
      .map(o=>({o,d:Math.hypot(o.x-n.x,o.y-n.y,o.z-n.z)})).sort((a,b)=>a.d-b.d).slice(0,4);
    HOT.near=near;
    read.innerHTML='<b>'+n.t+'</b> — nearest: '+near.map(k=>k.o.t+' <span style="color:var(--faint)">'+(k.d*1.0).toFixed(2)+'</span>').join(' · ')}
  function size(){dpr=Math.min(2,devicePixelRatio||1);const r=wrap.getBoundingClientRect();
    Wd=r.width;Hd=r.height;cv.width=Wd*dpr;cv.height=Hd*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  wrap.addEventListener('pointerenter',()=>inside=true);
  wrap.addEventListener('pointerleave',()=>inside=false);
  wrap.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ry:rotY,rx:rotX};
    moved=false;velY=0;velX=0});
  addEventListener('pointermove',e=>{if(!drag)return;
    if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>4)moved=true;
    if(!moved)return;
    const ny=drag.ry+(e.clientX-drag.x)*.006;
    const nx=clamp(drag.rx+(e.clientY-drag.y)*.004,-.5,.5);
    /* carry the hand's speed so letting go spins down instead of stopping dead */
    velY=velY*.55+(ny-rotY)*.45; velX=velX*.55+(nx-rotX)*.45;
    rotY=ny;rotX=nx});
  addEventListener('pointerup',()=>{drag=null;setTimeout(()=>moved=false,0)});
  addEventListener('pointercancel',()=>{drag=null;moved=false});

  const P=[];
  register(t=>{
    const held=HOT||drag||inside;
    spin=lerp(spin,held?0:.10,.05);
    if(!drag){
      /* flywheel: the hand's speed decays away and the idle drift eases back in under it */
      rotY+=velY; rotX=clamp(rotX+velX,-.5,.5);
      velY*=.935; velX*=.90;
      if(Math.abs(velY)<.00025)velY=0;
      if(Math.abs(velX)<.00025)velX=0;
      rotY+=spin*.016}
    const cy=Math.cos(rotY),sy=Math.sin(rotY),cx2=Math.cos(rotX),sx2=Math.sin(rotX);
    const RX=Wd*.345,RY=Hd*.375,FOV=3.6,ox=Wd/2,oy=Hd/2;
    P.length=0;
    N.forEach((n,i)=>{
      let X=n.x*cy+n.z*sy, Z=-n.x*sy+n.z*cy;
      let Y=n.y*cx2-Z*sx2; Z=n.y*sx2+Z*cx2;
      const per=FOV/(FOV-Z);
      P.push({i,sx:ox+X*per*RX,sy:oy+Y*per*RY,z:Z,per})});
    // depth sort → z-index + style
    const order=[...P].sort((a,b)=>a.z-b.z);
    order.forEach((p,k)=>{
      const e=el[p.i], depth=(p.z+1)/2;               // 0 far … 1 near
      const sc=clamp(.58+depth*.70,.54,1.30);
      e.style.transform=`translate(-50%,-50%) translate(${p.sx}px,${p.sy}px) scale(${sc.toFixed(3)})`;
      e.style.opacity=(0.20+depth*0.80).toFixed(3);
      e.style.zIndex=10+k;
      const isHot=HOT&&HOT.i===p.i, isNear=HOT&&HOT.near.some(q=>q.o.i===p.i);
      e.classList.toggle('hot',!!isHot);e.classList.toggle('near',!!isNear)});
    // connections
    x.clearRect(0,0,Wd,Hd);
    for(let a=0;a<N.length;a++)for(let b=a+1;b<N.length;b++){
      if(N[a].g!==N[b].g)continue;
      const d=Math.hypot(N[a].x-N[b].x,N[a].y-N[b].y,N[a].z-N[b].z);
      if(d>.62)continue;
      const pa=P[a],pb=P[b],dep=((pa.z+pb.z)/2+1)/2;
      const al=(1-d/.62)*0.085*(0.28+dep*0.72);
      if(al<0.006)continue;
      x.strokeStyle=rgba(N[a].g==='research'?CL.ice:CL.am,al);
      x.lineWidth=0.7+dep*0.5;
      x.beginPath();x.moveTo(pa.sx,pa.sy);x.lineTo(pb.sx,pb.sy);x.stroke()}
    if(HOT){
      const col=HOT.g==='research'?CL.ice:CL.am, ph=P[HOT.i];
      HOT.near.forEach(k=>{const pk=P[k.o.i];
        x.strokeStyle=rgba(col,.6);x.lineWidth=1.3;x.setLineDash([4,4]);
        x.beginPath();x.moveTo(ph.sx,ph.sy);x.lineTo(pk.sx,pk.sy);x.stroke();x.setLineDash([]);
        x.fillStyle=rgba(col,.92);x.font='9px "JetBrains Mono",monospace';x.textAlign='center';
        x.fillText((k.d*1.0).toFixed(2),(ph.sx+pk.sx)/2,(ph.sy+pk.sy)/2-4)});
      x.strokeStyle=rgba(col,.20);x.lineWidth=1;
      [26,52].forEach(r=>{x.beginPath();x.ellipse(ph.sx,ph.sy,r*ph.per,r*ph.per*.42,0,0,TAU);x.stroke()})}
  },{every:RM?1e9:2,el:wrap});
})();

/* ===================== HPC — CLUSTER ===================== */
(function CLUSTER(){
  const rack=$('#rack'),wrapEl=$('#hpcwrap'),cables=$('#cables'),cx=cables.getContext('2d');
  const IMAGES=['rocky9-hpl','ubuntu24-ml','rhel9-debug'];
  let curImg=0;
  const CH=4,PER=8,nodes=[];
  for(let c=0;c<CH;c++){
    const ch=document.createElement('div');ch.className='chassis';
    ch.innerHTML=`<div class="ct"><span>CHASSIS ${c+1}</span><span>c${c+1}n1–8</span></div>`;
    for(let n=0;n<PER;n++){
      const d=document.createElement('div');d.className='node';d.dataset.s='off';
      d.innerHTML=`<i class="fill"></i><span class="lbl">c${c+1}n${n+1}</span><span class="st">off</span>`;
      const rec={el:d,c,n,state:'off',img:0,ms:0};
      d.addEventListener('click',()=>{
        $$('#rack .node').forEach(e=>e.classList.remove('sel'));d.classList.add('sel');
        $('#nodeinfo').innerHTML=`<b>c${c+1}n${n+1}</b> · ${rec.state==='off'?'powered down':'root <b>'+IMAGES[rec.img]+'</b>'} · `+
          (rec.state==='up'?`slurm partition <b>debug</b> · vswitch root attached · last switch <b>${rec.ms||'—'} ms</b>`
           :rec.state==='prov'?'OpenCHAMI streaming image — container + hypervisor path'
           :rec.state==='swap'?'detaching root, attaching new image over the virtual switch'
           :'press Provision fleet')});
      nodes.push(rec);ch.append(d)}
    rack.append(ch)}
  function setStat(rec,s,txt){rec.state=s;rec.el.dataset.s=s;rec.el.querySelector('.st').textContent=txt}
  function upd(){const u=nodes.filter(n=>n.state==='up').length;
    $('#rackread').innerHTML=(u===32?'fleet up · root '+IMAGES[curImg]:'idle')+' · <b>'+u+'</b>/32 up';
    $('#headstate').textContent=u===32?'32 nodes attached':'idle'}

  let GEO={w:0,h:0};
  /* cables: head node at the top, a bus across, a riser beside each chassis and a
     tap out to every compute node */
  register(t=>{
    const r=wrapEl.getBoundingClientRect();
    const dpr=Math.min(2,devicePixelRatio||1);
    const cw=Math.round(r.width*dpr), chh=Math.round(r.height*dpr);
    if(cables.width!==cw||cables.height!==chh){cables.width=cw;cables.height=chh}
    cx.setTransform(cw/r.width,0,0,chh/r.height,0,0);
    cx.clearRect(0,0,r.width,r.height);
    if(GEO.w!==r.width||GEO.h!==r.height){
      const hb=$('#headnode').getBoundingClientRect();
      GEO={w:r.width,h:r.height,
        hx:hb.left-r.left+hb.width/2, hy:hb.bottom-r.top,
        chs:$$('#rack .chassis').map(c=>{const b=c.getBoundingClientRect();
          return {l:b.left-r.left}}),
        nd:nodes.map(nd=>{const b=nd.el.getBoundingClientRect();
          return {x:b.left-r.left,y:b.top-r.top+b.height/2}})}}
    const hx=GEO.hx, busY=GEO.hy+16;
    const risers=GEO.chs.map(c=>c.l-7);
    /* how far down each riser has to run */
    const deep=risers.map((_,i)=>Math.max(...GEO.nd.filter((_,j)=>nodes[j].c===i).map(g=>g.y)));
    /* head stub + bus */
    cx.lineCap='round';
    cx.strokeStyle=rgba(CL.am,.55);cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(hx,GEO.hy);cx.lineTo(hx,busY);
    cx.moveTo(Math.min(hx,...risers),busY);cx.lineTo(Math.max(hx,...risers),busY);
    cx.stroke();
    /* risers down the gap beside each chassis, stopping where the last elbow starts */
    const RAD=(gx,rx)=>Math.max(5,Math.min(13,(gx-rx)*0.86));
    cx.strokeStyle=rgba(CL.brass,.55);cx.lineWidth=1.2;
    cx.beginPath();
    risers.forEach((rx,i)=>{
      const last=GEO.nd.filter((_,j)=>nodes[j].c===i).reduce((a,g)=>g.y>a.y?g:a,{y:-1e9,x:rx});
      cx.moveTo(rx,busY);cx.lineTo(rx,last.y-RAD(last.x,rx))});
    cx.stroke();
    /* one tap per node: leaves the riser vertically, fillets, arrives level with the node */
    nodes.forEach((nd,gi)=>{
      const g=GEO.nd[gi], rx=risers[nd.c], on=nd.state!=='off', R=RAD(g.x,rx);
      cx.strokeStyle=on?rgba(CL.ice,.62):rgba(CL.brass,.44);
      cx.lineWidth=on?1.2:1;
      cx.beginPath();
      cx.moveTo(rx,g.y-R-6);
      cx.arcTo(rx,g.y,g.x,g.y,R);
      cx.lineTo(g.x,g.y);
      cx.stroke();
      cx.fillStyle=on?rgba(CL.ice,.9):rgba(CL.brass,.5);
      cx.beginPath();cx.arc(g.x,g.y,1.6,0,TAU);cx.fill();
      if(nd.state==='up'||nd.state==='swap'){
        /* the packet follows the real path: down the riser, round the fillet, into the node */
        const L1=Math.max(0,(g.y-R)-busY), L2=Math.PI/2*R, L3=Math.max(0,g.x-(rx+R));
        const L=L1+L2+L3, d=((t*.30+(nd.c*8+nd.n)*.031)%1)*L;
        let bx,by;
        if(d<L1){bx=rx;by=busY+d}
        else if(d<L1+L2){const a=(d-L1)/R;      /* centre of the fillet */
          bx=rx+R-Math.cos(a)*R; by=(g.y-R)+Math.sin(a)*R}
        else{bx=rx+R+(d-L1-L2);by=g.y}
        cx.fillStyle=rgba(nd.state==='swap'?CL.am:CL.ice,.95);
        cx.beginPath();cx.arc(bx,by,1.8,0,TAU);cx.fill()}});
    cx.fillStyle=rgba(CL.am,.95);cx.beginPath();cx.arc(hx,busY,3,0,TAU);cx.fill();
  },{every:2,el:wrapEl});

  let busy=false;
  $('#provision').onclick=()=>{
    if(busy)return;busy=true;$('#provision').disabled=true;
    nodes.forEach(n=>{setStat(n,'off','off');n.el.querySelector('.fill').style.width='0'});
    $('#headstate').textContent='openchami: provisioning';
    let i=0;const iv=setInterval(()=>{
      if(i<nodes.length){const n=nodes[i];n.img=curImg;
        setStat(n,'prov','prov');n.el.querySelector('.fill').style.width='55%';
        setTimeout(()=>{setStat(n,'up',IMAGES[n.img].split('-')[0]);
          n.el.querySelector('.fill').style.width='100%';upd()},520)}
      i++;if(i>nodes.length+4){clearInterval(iv);busy=false;$('#provision').disabled=false}
    },62)};

  $('#reprov').onclick=()=>{
    const up=nodes.filter(n=>n.state==='up');
    if(!up.length){$('#rackread').innerHTML='nothing to reprovision — provision first';return}
    if(busy)return;busy=true;$('#reprov').disabled=true;
    const next=(curImg+1)%IMAGES.length;
    $$('.imgsel button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.img===next)));
    $('#headstate').textContent='vswitch: detach → attach '+IMAGES[next];
    const t0=performance.now();
    up.forEach((n,k)=>setTimeout(()=>{
      setStat(n,'swap','swap');
      setTimeout(()=>{n.img=next;n.ms=180+Math.round(Math.random()*90);
        setStat(n,'up',IMAGES[next].split('-')[0]);
        if(k===up.length-1){curImg=next;busy=false;$('#reprov').disabled=false;
          const el=((performance.now()-t0)/1000).toFixed(1);
          $('#rackread').innerHTML='root switched to <b>'+IMAGES[next]+'</b> · '+up.length+' nodes · '+el+' s';
          $('#headstate').textContent='32 nodes attached'}},200)},k*22))};

  $$('.imgsel button').forEach(b=>b.onclick=()=>{
    if(busy)return;curImg=+b.dataset.img;
    $$('.imgsel button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));
    nodes.filter(n=>n.state==='up').forEach(n=>{n.img=curImg;
      n.el.querySelector('.st').textContent=IMAGES[curImg].split('-')[0]});
    upd()});

  /* ---- nixie countdown driven by scroll ---- */
  const nix=$('#nixie'),digits=[];
  [0,0,0,'.',0].forEach(d=>{
    const tube=document.createElement('div');tube.className='tube'+(d==='.'?' dot':'');
    tube.innerHTML=d==='.'?'<span class="lit" style="font-size:22px">.</span>'
      :'<span class="g">8</span><span class="lit">0</span>';
    nix.append(tube);if(d!=='.')digits.push(tube.querySelector('.lit'))});
  const TARGET=20.7,START=240.0;
  let shown=START;
  const sec=$('#hpc');
  register(()=>{
    const r=sec.getBoundingClientRect();
    const p=clamp((innerHeight*0.92-r.top)/(innerHeight*0.72),0,1);
    const val=lerp(START,TARGET,easeIO(p));
    shown=lerp(shown,val,.16);
    const s=shown.toFixed(1).padStart(5,'0');
    digits[0].textContent=s[0];digits[1].textContent=s[1];digits[2].textContent=s[2];digits[3].textContent=s[4];
    $('#nixbar').style.width=(p*100)+'%';
    $('#nixstate').innerHTML= p>.985 ? 'NODE UP · <b>20.7 s</b>' : (p>.05?'MEASURING…':'SCROLL TO MEASURE');
  },{every:2,el:sec});
})();

/* ===================== IT — FLEET SYNC ===================== */
(function FLEET(){
  const grid=$('#fgrid'),N=64,hosts=[];
  for(let i=0;i<N;i++){const d=document.createElement('div');d.className='host';
    d.title='host-'+String(i+1).padStart(2,'0');grid.append(d);hosts.push(d)}
  function count(){const c=hosts.filter(h=>h.classList.contains('sync')).length;
    $('#fleetread').innerHTML='<b>'+c+'</b>/64 converged'}
  const drift=()=>{hosts.forEach(h=>{h.classList.remove('sync','wave');
    if(Math.random()<.62)h.classList.add('drift')});count()};
  drift();
  let running=false;
  $('#driftbtn').onclick=()=>{if(!running)drift()};
  $('#applyplaybook').onclick=()=>{
    if(running)return;running=true;$('#applyplaybook').disabled=true;
    const cols=16;
    for(let c=0;c<cols;c++)setTimeout(()=>{
      hosts.forEach((h,i)=>{if(i%cols!==c)return;h.classList.add('wave');
        setTimeout(()=>{h.classList.remove('wave','drift');h.classList.add('sync');count()},240)});
      if(c===cols-1)setTimeout(()=>{running=false;$('#applyplaybook').disabled=false},640)},c*105)};
})();

/* ===================== RESEARCH — TRACES → FEATURE SPACE ===================== */
(function SIDECHANNEL(){
  const trc=$('#trace'),tx=trc.getContext('2d');
  const ftc=$('#feat'),fx=ftc.getContext('2d');
  const NS=2500, ROUNDS=17, SPACING=141, START=118;
  let TW=0,TH=0,FW=0,FH=0,dpr=1,SEL=0,HOVF=null,sweep=0;
  let SET=[],TROJ=0,detected=false,detT=0,seed=7;
  let P0X=0,P1X=1,P0Y=0,P1Y=1,CEN_X=.5,CEN_Y=.5,SIG_X=.1,SIG_Y=.1;
  const rr=()=>{seed=(seed*9301+49297)%233280;return seed/233280};

  /* --- trace model: 50 mW baseline ripple + 17 AES round events --- */
  function sample(i,P,trig){
    let v=50 + P.rip*(1.95*Math.sin(i*0.34+P.ph) + 1.25*Math.sin(i*0.13+P.ph*2.1)
                    + 0.42*Math.sin(i*0.87+P.ph*0.7)) + P.off;
    for(let k=0;k<ROUNDS;k++){
      const c=START+k*SPACING+((k*29)%7)-3, d=i-c;
      if(d<-14||d>90)continue;
      const env=d>=0?Math.exp(-d/21):Math.exp(d/4.5);
      let term=P.gain*env*Math.sin(TAU*d/30-0.9);
      if(term<0)term*=1.22;
      if(trig){ term*=1.006;
        if(P.payload.includes(k)&&d>12&&d<58) term+=1.05*Math.exp(-(d-12)/18) }
      v+=term}
    return v}

  function mkParams(){
    return {ph:rr()*TAU, gain:41.2+rr()*2.0, rip:0.72+rr()*0.9, off:(rr()-.5)*0.9,
            payload:[3,7,11,14], id:'T'+(400+Math.floor(rr()*180))}}

  /* features computed from the traces themselves. Dynamic power is measured inside
     the round events; EM band energy from the ripple in the quiet windows between
     them — so the two axes move independently. */
  const inEvent=i=>{for(let k=0;k<ROUNDS;k++){const d=i-(START+k*SPACING+((k*29)%7)-3);
    if(d>-16&&d<96)return true}return false};
  function features(P,trig){
    /* dynamic power: peak-to-peak swing inside each round event (driven by gain;
       the ripple adds symmetrically to both extremes and largely cancels).
       EM band energy: sample-to-sample activity in the quiet windows (ripple only). */
    let pp=0,pn=0,hf=0,hn=0,prev=null,lo=1e9,hi=-1e9,inE=false;
    for(let i=1;i<NS;i+=2){
      const v=sample(i,P,trig), e=inEvent(i);
      if(e){ if(!inE){lo=1e9;hi=-1e9;inE=true}
        if(v<lo)lo=v; if(v>hi)hi=v; prev=null }
      else { if(inE){pp+=hi-lo;pn++;inE=false}
        if(prev!==null){hf+=Math.abs(v-prev);hn++}
        prev=v }}
    if(inE&&hi>lo){pp+=hi-lo;pn++}
    return {p:(pp/Math.max(1,pn))/10, e:(hf/Math.max(1,hn))*10}}

  function build(){
    seed=(Date.now()%9791)+13; SET=[];detected=false;detT=0;
    for(let i=0;i<54;i++){const P=mkParams();P.trig=false;SET.push(P)}
    TROJ=Math.floor(rr()*54);
    SET[TROJ].trig=true; SET[TROJ].gain+=5.6; SET[TROJ].off+=0.30;
    SET.forEach(function(P,i){P.i=i;const f=features(P,P.trig);P.fx=f.p;P.fy=f.e});
    const px=SET.map(P=>P.fx),py=SET.map(P=>P.fy);
    const mX=(Math.max(...px)-Math.min(...px))*0.17||0.1;
    const mY=(Math.max(...py)-Math.min(...py))*0.17||0.1;
    P0X=Math.min(...px)-mX; P1X=Math.max(...px)+mX;
    P0Y=Math.min(...py)-mY; P1Y=Math.max(...py)+mY;
    SET.forEach(P=>{P.nx=(P.fx-P0X)/(P1X-P0X);P.ny=(P.fy-P0Y)/(P1Y-P0Y)});
    const med=a=>{const b=[...a].sort((x,y)=>x-y);return b[b.length>>1]};
    CEN_X=med(SET.map(P=>P.nx)); CEN_Y=med(SET.map(P=>P.ny));
    SIG_X=Math.max(.11,1.4826*med(SET.map(P=>Math.abs(P.nx-CEN_X))));
    SIG_Y=Math.max(.11,1.4826*med(SET.map(P=>Math.abs(P.ny-CEN_Y))));
    SET.forEach(P=>{P.d=Math.hypot((P.nx-CEN_X)/SIG_X,(P.ny-CEN_Y)/SIG_Y);
      P.score=Math.min(.99,1-Math.exp(-Math.max(0,P.d-1.15)/1.9))});
    SEL=TROJ;
    $('#selinfo').innerHTML=cget('research.selinfoIdle')||''}

  function info(P){
    $('#selinfo').innerHTML=`trace <b>AES-${P.id}</b> · mean dynamic power <b>${P.fx.toFixed(2)} mW</b> · `+
      `EM band <b>${P.fy.toFixed(2)}</b> · outlier score `+
      (detected&&P.i===TROJ?`<b class="r">${P.score.toFixed(2)} — flagged</b>`:`<b>${P.score.toFixed(2)}</b>`)}

  function size(){dpr=Math.min(2,devicePixelRatio||1);
    let r=trc.getBoundingClientRect();TW=r.width;TH=r.height;
    trc.width=TW*dpr;trc.height=TH*dpr;tx.setTransform(dpr,0,0,dpr,0,0);
    tx.clearRect(0,0,TW,TH);
    r=ftc.getBoundingClientRect();FW=r.width;FH=r.height;
    ftc.width=FW*dpr;ftc.height=FH*dpr;fx.setTransform(dpr,0,0,dpr,0,0)}
  build();size();addEventListener('resize',size);

  /* ---------- ring trace ----------
     A package sits at the centre of a flat ring, both fixed in the frame and seen in
     perspective from a little above; bond-out traces fan from its pins to the ring. The
     waveform stands straight up off the ring, so the plot always faces the viewer, and it
     never changes shape. Scroll only advances how much of it is drawn. Both ends of the
     record sit at the far apex, hidden by the package: the sweep emerges from behind it,
     comes round the near side larger and brighter, and disappears back behind it. */
  const RCOLS=760, TILT=0.175, PZ=0.52, AMPF=0.0026;
  const CS=0.335, CHF=0.104, KF=1/(1+PZ), KN=1/(1-PZ);
  let RING={sel:-1,w:0,h:0,LX:null,RX:null,D:null};
  let GHOST=null, ghostKey='', flashT=0, wasFull=false;

  function cam(){
    const Rx=Math.min(TW*(TW<760?0.385:0.300),TH*0.74), Ry=Rx*TILT;
    return {cx:TW/2, cy:TH*0.50, Rx, Ry, R:Rx, A:Rx*AMPF}}

  /* a point in the ring's plane: a across, b into the frame, h standing up off it.
     k is the depth factor — small at the back, large at the front. */
  function plane(c,a,b,h,out){
    const k=1/(1+PZ*b);
    out[0]=c.cx+c.Rx*a*k;
    out[1]=c.cy-(c.Ry*b+h)*k;
    out[2]=k}
  const depth=k=>clamp((k-KF)/(KN-KF),0,1);

  /* u=0 sits at the far apex, directly behind the package: the sweep is born out of
     sight there, comes out from the chip's left edge, round the near side, and vanishes
     back into it. b>0 for u<0.25 and u>0.75 — those stretches are behind the chip. */
  function pos(c,v,u,out){
    const th=-u*TAU;
    plane(c,Math.sin(th),Math.cos(th),c.A*(v-50),out)}

  function traceVals(P,trig,out){
    for(let q=0;q<RCOLS;q++){
      const i=Math.round(q/RCOLS*NS);
      let v=0;for(let k=-1;k<=1;k++)v+=sample(clamp(i+k*2,0,NS-1),P,trig);
      out[q]=v/3}}

  function buildRing(){
    const P=SET[SEL];
    const vA=new Float32Array(RCOLS), vB=new Float32Array(RCOLS);
    traceVals(P,false,vA);
    if(P.trig)traceVals(P,true,vB); else vB.set(vA);
    const D=new Float32Array(RCOLS);
    for(let q=0;q<RCOLS;q++)D[q]=Math.abs(vB[q]-vA[q]);
    RING={sel:SEL,w:TW,h:TH,LX:vA,RX:vB,D}}

  /* the other measurements, on the same ring, behind this one */
  function buildGhost(){
    const key=Math.round(TW)+'x'+Math.round(TH)+':'+SET[0].id;
    if(GHOST&&ghostKey===key)return;
    const g2=GHOST||document.createElement('canvas');
    const dpr=Math.min(2,devicePixelRatio||1);
    g2.width=Math.round(TW*dpr);g2.height=Math.round(TH*dpr);
    const c2=g2.getContext('2d');c2.setTransform(g2.width/TW,0,0,g2.height/TH,0,0);
    c2.clearRect(0,0,TW,TH);
    const c=cam(), tmp=new Float32Array(RCOLS), o=[0,0,0];
    c2.lineWidth=1;c2.lineJoin='round';c2.strokeStyle=rgba(CL.ice,.03);
    for(let k=0;k<SET.length;k+=4){
      traceVals(SET[k],false,tmp);
      c2.beginPath();
      for(let q=0;q<RCOLS;q++){pos(c,tmp[q],q/(RCOLS-1),o);
        q?c2.lineTo(o[0],o[1]):c2.moveTo(o[0],o[1])}
      c2.closePath();c2.stroke()}
    GHOST=g2;ghostKey=key}

  function chunk(c,V,from,to){
    const p=new Path2D(), o=[0,0,0];
    for(let q=from;q<=to;q++){pos(c,V[q],q/(RCOLS-1),o);
      q===from?p.moveTo(o[0],o[1]):p.lineTo(o[0],o[1])}
    return p}

  /* pins, and the bond-out traces that run from them to the ring.
     pass 0 = the edges behind the package, pass 1 = the edges in front of it */
  function drawPins(c,pass){
    const o=[0,0,0], H=c.Rx*CHF*0.34, N=9, E1=1.14, E2=1.27;
    tx.lineCap='butt';tx.lineJoin='round';
    for(let s=0;s<4;s++)for(let i=0;i<N;i++){
      const t=((i+0.5)/N*2-1)*0.80;
      const a=s<2?t*CS:(s===2?CS:-CS), b=s<2?(s?-CS:CS):t*CS;
      if((b>0)!==(pass===0))continue;
      const r=Math.hypot(a,b), ua=a/r, ub=b/r;
      plane(c,a,b,H,o); const x0=o[0], y0=o[1], d=depth(o[2]);
      plane(c,a*E1,b*E1,H,o); const x1=o[0], y1=o[1];
      plane(c,a*E2,b*E2,0,o); const x2=o[0], y2=o[1];
      tx.strokeStyle=rgba(CL.brass,.28+.34*d);tx.lineWidth=.9+1.6*d;
      tx.beginPath();tx.moveTo(x0,y0);tx.lineTo(x1,y1);tx.lineTo(x2,y2);tx.stroke();
      if(pass===0){
        plane(c,ua*0.985,ub*0.985,0,o);
        tx.strokeStyle=rgba(CL.brass,.06+.10*d);tx.lineWidth=.8+.6*d;
        tx.beginPath();tx.moveTo(x2,y2);tx.lineTo(o[0],o[1]);tx.stroke()}}
    tx.lineCap='round'}

  /* the long bond-out runs for the front edges, laid down before the package */
  function drawRuns(c){
    const o=[0,0,0], N=9, E2=1.27;
    for(let s=0;s<4;s++)for(let i=0;i<N;i++){
      const t=((i+0.5)/N*2-1)*0.80;
      const a=s<2?t*CS:(s===2?CS:-CS), b=s<2?(s?-CS:CS):t*CS;
      if(b>0)continue;
      const r=Math.hypot(a,b), ua=a/r, ub=b/r;
      plane(c,a*E2,b*E2,0,o); const x2=o[0], y2=o[1], d=depth(o[2]);
      plane(c,ua*0.985,ub*0.985,0,o);
      tx.strokeStyle=rgba(CL.brass,.06+.10*d);tx.lineWidth=.8+.6*d;
      tx.beginPath();tx.moveTo(x2,y2);tx.lineTo(o[0],o[1]);tx.stroke()}}

  /* the package itself — opaque, so the back of the sweep passes behind it */
  function drawChip(c){
    const o=[0,0,0], H=c.Rx*CHF, B=CS*0.90;
    const P=(a,b,h)=>{plane(c,a,b,h,o);return [o[0],o[1]]};
    const quad=(p1,p2,p3,p4)=>{tx.beginPath();tx.moveTo(p1[0],p1[1]);tx.lineTo(p2[0],p2[1]);
      tx.lineTo(p3[0],p3[1]);tx.lineTo(p4[0],p4[1]);tx.closePath()};
    const FL=P(-CS,CS,H*0.62), FR=P(CS,CS,H*0.62), NR=P(CS,-CS,H*0.62), NL=P(-CS,-CS,H*0.62);
    const NRb=P(CS,-CS,0), NLb=P(-CS,-CS,0);
    const bFL=P(-B,B,H), bFR=P(B,B,H), bNR=P(B,-B,H), bNL=P(-B,-B,H);
    tx.lineJoin='round';
    /* near face */
    quad(NL,NR,NRb,NLb);
    let g=tx.createLinearGradient(0,NL[1],0,NLb[1]);
    g.addColorStop(0,'#1B1712');g.addColorStop(1,'#0A0908');
    tx.fillStyle=g;tx.fill();
    tx.strokeStyle=rgba(CL.brass,.30);tx.lineWidth=1;tx.stroke();
    /* the moulded bevel between the body edge and the top face */
    quad(FL,FR,NR,NL);
    g=tx.createLinearGradient(0,FL[1],0,NL[1]);
    g.addColorStop(0,'#2B241B');g.addColorStop(1,'#191410');
    tx.fillStyle=g;tx.fill();
    tx.strokeStyle=rgba(CL.brass,.34);tx.lineWidth=1;tx.stroke();
    /* top face */
    quad(bFL,bFR,bNR,bNL);
    g=tx.createLinearGradient(0,bFL[1],0,bNL[1]);
    g.addColorStop(0,'#332A20');g.addColorStop(1,'#1D1813');
    tx.fillStyle=g;tx.fill();
    tx.strokeStyle=rgba(CL.brass,.46);tx.lineWidth=1.1;tx.stroke();
    /* die window, with the lattice showing through it */
    const q=B*0.56;
    quad(P(-q,q,H),P(q,q,H),P(q,-q,H),P(-q,-q,H));
    tx.save();tx.clip();
    tx.fillStyle='#120F0C';tx.fill();
    tx.strokeStyle=rgba(CL.brass,.16);tx.lineWidth=.7;
    for(let i=1;i<7;i++){
      const u=-q+2*q*i/7;
      let p1=P(u,q,H), p2=P(u,-q,H);
      tx.beginPath();tx.moveTo(p1[0],p1[1]);tx.lineTo(p2[0],p2[1]);tx.stroke();
      p1=P(-q,u,H);p2=P(q,u,H);
      tx.beginPath();tx.moveTo(p1[0],p1[1]);tx.lineTo(p2[0],p2[1]);tx.stroke()}
    tx.fillStyle=rgba(CL.am,.05+.06*Math.min(1,sweep*2));
    tx.fillRect(0,0,TW,TH);
    tx.restore();
    quad(P(-q,q,H),P(q,q,H),P(q,-q,H),P(-q,-q,H));
    tx.strokeStyle=rgba(CL.brass,.30);tx.lineWidth=1;tx.stroke();
    /* pin-1 dot */
    const d1=P(-B*0.80,-B*0.80,H);
    tx.fillStyle=rgba(CL.brass,.55);tx.beginPath();tx.arc(d1[0],d1[1],2.1,0,TAU);tx.fill()}

  function drawHead(o){
    const d=depth(o[2]);
    tx.fillStyle=rgba(CL.am,.26);tx.beginPath();tx.arc(o[0],o[1],3.6+3.2*d,0,TAU);tx.fill();
    tx.fillStyle='rgba(255,247,230,.95)';tx.beginPath();tx.arc(o[0],o[1],1.4+1.1*d,0,TAU);tx.fill()}

  /* one stretch of the revolution, depth-banded so the back reads thinner and dimmer */
  function drawArc(c,from,to){
    if(to<=from)return;
    const o=[0,0,0], NB=24, span=RCOLS-1;
    tx.lineJoin='round';tx.lineCap='round';
    for(let bnd=0;bnd<NB;bnd++){
      const b0=Math.max(from,Math.round(bnd/NB*span)), b1=Math.min(to,Math.round((bnd+1)/NB*span));
      if(b1<=b0)continue;
      pos(c,50,((b0+b1)/2)/span,o);
      const d=depth(o[2]), dim=0.34+0.66*d, lw=0.55+1.00*d;
      const pa=chunk(c,RING.LX,b0,b1), pb=chunk(c,RING.RX,b0,b1);
      tx.strokeStyle=rgba(CL.ice,.26*dim);tx.lineWidth=lw*2.6;tx.stroke(pa);
      tx.strokeStyle=rgba(CL.ice,.80*dim);tx.lineWidth=lw*.95;tx.stroke(pa);
      tx.strokeStyle=rgba(CL.am,.15*dim);tx.lineWidth=lw*3.4;tx.stroke(pb);
      tx.strokeStyle=rgba(CL.am,.92*dim);tx.lineWidth=lw*1.05;tx.stroke(pb)}
    /* where the two runs part, more amber — same colour, more of it */
    let q=from;
    while(q<to){
      if(RING.D[q]>0.22){
        let q1=q;while(q1<to&&RING.D[q1]>0.14)q1++;
        if(q1-q>2){
          pos(c,50,((q+q1)/2)/span,o);
          const d=depth(o[2]), seg=chunk(c,RING.RX,q,q1);
          tx.strokeStyle=rgba(CL.am,.13+.10*d);tx.lineWidth=3.2+3.6*d;tx.stroke(seg);
          tx.strokeStyle=rgba(CL.am,.68+.30*d);tx.lineWidth=1.2+1.4*d;tx.stroke(seg)}
        q=q1}
      else q++}}

  function drawTrace(){
    if(RING.sel!==SEL||RING.w!==TW||RING.h!==TH)buildRing();
    tx.clearRect(0,0,TW,TH);
    const p=sweep, c=cam(), o=[0,0,0], span=RCOLS-1;
    tx.lineJoin='round';tx.lineCap='round';
    /* the ring — fixed furniture, always there */
    tx.beginPath();
    for(let q=0;q<=220;q++){pos(c,50,q/220,o);q?tx.lineTo(o[0],o[1]):tx.moveTo(o[0],o[1])}
    tx.closePath();
    tx.strokeStyle=rgba(CL.brass,.15);tx.lineWidth=1;tx.stroke();
    tx.beginPath();
    for(let q=55;q<=165;q++){pos(c,50,q/220,o);q===55?tx.moveTo(o[0],o[1]):tx.lineTo(o[0],o[1])}
    tx.strokeStyle=rgba(CL.brass,.34);tx.lineWidth=1.5;tx.stroke();
    drawRuns(c);drawPins(c,0);
    if(GHOST){tx.globalAlpha=.5;tx.drawImage(GHOST,0,0,TW,TH);tx.globalAlpha=1}
    const n=p<=0.004?0:Math.max(1,Math.round(span*p));
    const qA=Math.round(span*0.25), qB=Math.round(span*0.75);
    const behind=n<=qA||n>=qB;
    /* the two stretches that run behind the package */
    drawArc(c,0,Math.min(n,qA));
    if(n>qB)drawArc(c,qB,n);
    if(n>0&&behind&&p<0.998){pos(c,RING.RX[n],n/span,o);drawHead(o)}
    drawChip(c);drawPins(c,1);
    /* and the stretch that comes round in front of it */
    if(n>qA){drawArc(c,qA,Math.min(n,qB));
      if(!behind&&p<0.998){pos(c,RING.RX[n],n/span,o);drawHead(o)}}
    /* dissolve at the edges so it sits in the page, not in a frame */
    tx.globalCompositeOperation='destination-out';
    const gy2=tx.createLinearGradient(0,0,0,TH);
    gy2.addColorStop(0,'rgba(0,0,0,.85)');gy2.addColorStop(.12,'rgba(0,0,0,0)');
    gy2.addColorStop(.88,'rgba(0,0,0,0)');gy2.addColorStop(1,'rgba(0,0,0,.85)');
    tx.fillStyle=gy2;tx.fillRect(0,0,TW,TH);
    tx.globalCompositeOperation='source-over'}

  /* nothing is pinned: the sweep is tied to where the canvas sits in the viewport, so it
     travels with the page as the reader scrolls and holds once the section is fully in view */
  function sweepProgress(){
    const r=trc.getBoundingClientRect(), vh=innerHeight||1;
    return clamp((vh*1.12-(r.top+r.height/2))/(vh*0.70),0,1)}

  /* ---------- feature space ---------- */
  const FPL=42,FPB=20,FPT=14,FPR=16;
  function fpos(P){return {x:FPL+P.nx*(FW-FPL-FPR), y:FPT+(1-P.ny)*(FH-FPT-FPB)}}
  function drawFeat(t){
    fx.clearRect(0,0,FW,FH);
    const gx=FPL,gy=FPT,gw=FW-FPL-FPR,gh=FH-FPT-FPB;
    fx.strokeStyle=rgba(CL.ink,.05);fx.lineWidth=1;
    fx.font='8.5px "JetBrains Mono",monospace';
    const NT=FW<420?2:4;
    for(let i=0;i<=NT;i++){
      const xx=gx+i/NT*gw, yy=gy+i/NT*gh;
      fx.beginPath();fx.moveTo(xx,gy);fx.lineTo(xx,gy+gh);fx.stroke();
      fx.beginPath();fx.moveTo(gx,yy);fx.lineTo(gx+gw,yy);fx.stroke()}
    fx.strokeStyle=rgba(CL.faint,.4);
    fx.beginPath();fx.moveTo(gx,gy);fx.lineTo(gx,gy+gh);fx.lineTo(gx+gw,gy+gh);fx.stroke();
    fx.fillStyle=rgba(CL.faint,.9);fx.textAlign='center';fx.textBaseline='top';
    for(let i=0;i<=NT;i++){fx.fillText((P0X+(P1X-P0X)*i/NT).toFixed(1),gx+i/NT*gw,gy+gh+5)}
    fx.textAlign='right';fx.textBaseline='middle';
    for(let i=0;i<=NT;i++){fx.fillText((P0Y+(P1Y-P0Y)*i/NT).toFixed(2),gx-5,gy+gh-i/NT*gh)}
    /* inlier hull: contour rings around the centroid, drawn once detected */
    const sx=SIG_X, sy=SIG_Y;
    const cxp=gx+CEN_X*gw, cyp=gy+(1-CEN_Y)*gh;
    if(detT>.004){
      [1,2,3].forEach((k,j)=>{
        fx.strokeStyle=rgba(CL.ice,(.26-j*.06)*detT);fx.lineWidth=1;fx.setLineDash([4,4]);
        fx.beginPath();fx.ellipse(cxp,cyp,sx*gw*k,sy*gh*k,0,0,TAU);fx.stroke();fx.setLineDash([])});
      fx.fillStyle=rgba(CL.ice,.8*detT);fx.beginPath();fx.arc(cxp,cyp,3,0,TAU);fx.fill();
      fx.fillStyle=rgba(CL.faint,.9*detT);fx.textAlign='left';fx.textBaseline='alphabetic';
      fx.fillText('3σ',cxp+sx*gw*3+5,cyp-4)}
    /* points */
    SET.forEach(P=>{
      const p=fpos(P), isT=P.i===TROJ, sel=P.i===SEL, k=isT?detT:0;
      if(k>.004){const pulse=(Math.sin(t*2.4)+1)/2;
        fx.strokeStyle=rgba(CL.red,.30*k);fx.setLineDash([3,3]);fx.lineWidth=1;
        fx.beginPath();fx.moveTo(cxp,cyp);fx.lineTo(p.x,p.y);fx.stroke();fx.setLineDash([]);
        fx.strokeStyle=rgba(CL.red,(.5+pulse*.5)*k);fx.lineWidth=1.4;
        fx.beginPath();fx.arc(p.x,p.y,9+pulse*4,0,TAU);fx.stroke()}
      if(sel){fx.strokeStyle=rgba(k>.5?CL.red:CL.am,.9);fx.lineWidth=1.3;
        fx.beginPath();fx.arc(p.x,p.y,7,0,TAU);fx.stroke()}
      fx.fillStyle=k>.004
        ?`rgba(${Math.round(lerp(111,255,k))},${Math.round(lerp(200,74,k))},${Math.round(lerp(240,69,k))},${(.55+.4*k).toFixed(2)})`
        :rgba(CL.ice,.55-detT*.25+P.score*.5*detT);
      fx.beginPath();fx.arc(p.x,p.y,isT?2.9+1.3*k:2.9,0,TAU);fx.fill()});
    if(flashT>0){const p=fpos(SET[SEL]);
      const a=flashT*flashT;
      fx.strokeStyle=rgba(SEL===TROJ&&detT>.5?CL.red:CL.am,.85*a);fx.lineWidth=1.4;
      fx.beginPath();fx.arc(p.x,p.y,5+34*(1-a),0,TAU);fx.stroke()}
    if(detT>.35){const p=fpos(SET[TROJ]);
      fx.fillStyle=rgba(CL.red,.95*clamp((detT-.35)/.45,0,1));fx.font='700 8.5px "JetBrains Mono",monospace';
      fx.textAlign=p.x>FW*.6?'right':'left';fx.textBaseline='alphabetic';
      fx.fillText('AES-'+SET[TROJ].id+' · 0.'+String(Math.round(SET[TROJ].score*100)).padStart(2,'0'),
        p.x+(p.x>FW*.6?-13:13),p.y-9)}
  }
  ftc.addEventListener('pointermove',e=>{
    const r=ftc.getBoundingClientRect();
    const mxp=(e.clientX-r.left)*(FW/r.width), myp=(e.clientY-r.top)*(FH/r.height);
    let best=null,bd=1e9;
    SET.forEach(P=>{const p=fpos(P);const d=Math.hypot(p.x-mxp,p.y-myp);if(d<bd){bd=d;best=P}});
    if(best&&bd<26){SEL=best.i;info(best)}});

  register(t=>{
    detT+=((detected?1:0)-detT)*(detected?.055:.11);
    if(detT<.0015)detT=0; if(detT>.9985)detT=1;
    sweep=lerp(sweep,sweepProgress(),.20);
    const full=sweep>0.995;
    if(full&&!wasFull)flashT=1;
    wasFull=full;
    flashT=Math.max(0,flashT-.02);
    buildGhost();
    drawTrace();drawFeat(t)},{every:2,el:trc});

  $('#detect').onclick=()=>{detected=true;SEL=TROJ;info(SET[TROJ]);
    $('#selinfo').innerHTML=(cget('research.selinfoDetected')||'').replace('{id}',SET[TROJ].id)};
  $('#reseed').onclick=()=>{
    detected=false;build();size();
    RING.sel=-1; GHOST=null; ghostKey=''; buildGhost();
    flashT=0; wasFull=false;
    drawTrace()};
})();
