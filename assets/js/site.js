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
const CL={am:'#D08A52',ice:'#6FC8F0',red:'#FF3D63',ink:'#F2ECE1',dim:'#9C9285',faint:'#635B50',line:'#2A2520',brass:'#9A6A40'};
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
/* ===================== MARK + MENU =====================
   The mark is a Lissajous figure whose x:y ratio eases to the one set for
   whichever section is on screen (menu[].ratio in content.js), so it is always
   in motion and never quite the same shape twice. */
(function MARK(){
  const cv=$('#markc'),x=cv.getContext('2d');x.scale(2,2);
  register(t=>{
    const tg=SECTIONS[CUR].ratio||[3,2];RA=lerp(RA,tg[0],.055);RB=lerp(RB,tg[1],.055);
    x.clearRect(0,0,42,42);
    const pts=[];
    for(let i=0;i<=200;i++){const u=i/200*TAU;
      pts.push([21+Math.sin(RA*u+t*.5)*15,21+Math.sin(RB*u)*15])}
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    x.strokeStyle=rgba(CL.am,.95);x.lineWidth=1.15;x.stroke();
    x.strokeStyle=rgba(CL.am,.15);x.lineWidth=3.6;x.stroke()});
  const menu=$('#menu'),btn=$('#markbtn');
  menu.innerHTML=SECTIONS.map((s,i)=>`<a href="#${s.id}" data-id="${s.id}" style="--d:${40+i*26}ms"><span>${s.label}</span></a>`).join('');
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
    b.addEventListener('pointerleave',()=>{HOT=null;if(read)read.textContent=''});
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
    if(read)read.innerHTML='<b>'+n.t+'</b>'}
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
/* ===================== HPC — PROVISIONING AISLE =====================
   A machine-room aisle in one-point perspective: two rows of racks receding to a
   vanishing point, with the image source at the far end. Scroll drives a
   reprovision front down the aisle toward the viewer. Racks behind the front are
   on the new root image, racks ahead of it are still on the old one, and the
   narrow dark band between the two is the only window in which a node is down.
   The pointer parallaxes the camera and picks out a rack. Nothing is clickable. */
(function AISLE(){
  const cv=$('#aisle'); if(!cv)return;
  const ax=cv.getContext('2d'), readEl=$('#rackread');
  const NR=9, NB=8;                  /* racks per side, bays per rack */
  const AW=0.58, RW=0.66, RH=1.00;   /* aisle half-width, rack depth, rack height */
  const PITCH=0.88, GAP=0.15;
  const EYE=0.54, D0=1.98;           /* eye height, distance to the first rack */
  const ZMAX=(NR-1)*PITCH, TRANS=0.60;
  const IMG_OLD='rocky9-hpl', IMG_NEW='ubuntu24-ml';

  let W=0,H=0,dpr=1,FOC=1,CX=0,CY=0;
  let camX=0,camY=0,mtX=0,mtY=0,hasPtr=false,hov=null,p=0;

  function size(){
    dpr=Math.min(2,devicePixelRatio||1);
    const r=cv.getBoundingClientRect(); W=r.width; H=r.height;
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    ax.setTransform(dpr,0,0,dpr,0,0);
    FOC=Math.min(W*0.72,H*1.72); CX=W/2; CY=H*0.50}
  size(); addEventListener('resize',size);

  /* one-point perspective: the camera sits in the aisle looking down it */
  function P(X,Y,Z,out){
    const k=FOC/(Z+D0);
    out[0]=CX+(X-camX)*k;
    out[1]=CY-(Y-EYE-camY)*k;
    out[2]=k; return out}
  const pt=(X,Y,Z)=>P(X,Y,Z,[0,0,0]);
  const quad=(a,b,c,d)=>{ax.beginPath();ax.moveTo(a[0],a[1]);ax.lineTo(b[0],b[1]);
    ax.lineTo(c[0],c[1]);ax.lineTo(d[0],d[1]);ax.closePath()};
  const seg=(a,b)=>{ax.beginPath();ax.moveTo(a[0],a[1]);ax.lineTo(b[0],b[1]);ax.stroke()};
  const KN=FOC=>0; /* placeholder, unused */
  const dep=k=>clamp((k-FOC/(ZMAX+D0))/((FOC/D0)-(FOC/(ZMAX+D0))),0,1);

  /* a little per-bay stagger so a rack does not switch all at once */
  let sd=17; const rr=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  const JIT=[]; for(let i=0;i<NR*2*NB;i++)JIT.push((rr()*2-1)*0.20);

  function bayY(b){const h=(RH-0.10)/NB; return [0.05+b*h+h*0.14, 0.05+b*h+h*0.86]}

  function drawRack(side,i,F){
    const Xin=side*AW, Xout=side*(AW+RW);
    const Z0=i*PITCH, Z1=Z0+PITCH-GAP, zc=(Z0+Z1)/2;
    const k0=FOC/(Z0+D0), d=dep(k0);
    /* the side of the rack facing the camera */
    const nf=[pt(Xin,0,Z0),pt(Xout,0,Z0),pt(Xout,RH,Z0),pt(Xin,RH,Z0)];
    quad(nf[0],nf[1],nf[2],nf[3]);
    const gsd=ax.createLinearGradient(0,nf[2][1],0,nf[0][1]);
    gsd.addColorStop(0,'#191510'); gsd.addColorStop(1,'#0A0908');
    ax.fillStyle=gsd; ax.fill();
    ax.strokeStyle=rgba(CL.brass,.16+.18*d); ax.lineWidth=1; ax.stroke();
    /* the U divisions, so the side of the rack reads as a rack */
    ax.strokeStyle=rgba(CL.brass,.07+.08*d); ax.lineWidth=.8;
    for(let b=0;b<NB;b++){const y=bayY(b)[0];
      seg(pt(Xin,y,Z0),pt(Xout,y,Z0))}
    ax.strokeStyle=rgba(CL.brass,.06+.07*d);
    seg(pt(Xout-side*RW*0.30,0,Z0),pt(Xout-side*RW*0.30,RH,Z0));
    /* the face onto the aisle, where the bays are */
    quad(pt(Xin,0,Z0),pt(Xin,RH,Z0),pt(Xin,RH,Z1),pt(Xin,0,Z1));
    ax.fillStyle='#131110'; ax.fill();
    const isHov=hov&&hov.side===side&&hov.i===i;
    ax.strokeStyle=rgba(CL.brass,isHov?.55:.16+.16*d); ax.lineWidth=isHov?1.3:1; ax.stroke();
    /* bays */
    let nNew=0;
    for(let b=0;b<NB;b++){
      const jt=JIT[((side>0?NR:0)+i)*NB+b];
      const rel=(zc-F)+jt;
      const up=clamp(Math.abs(rel)/TRANS,0,1), isNew=rel>0;
      if(isNew&&up>.5)nNew++;
      const col=isNew?CL.ice:CL.am;
      const [y0,y1]=bayY(b);
      const zp0=Z0+0.07, zp1=Z1-0.05;
      quad(pt(Xin,y0,zp0),pt(Xin,y1,zp0),pt(Xin,y1,zp1),pt(Xin,y0,zp1));
      ax.fillStyle=rgba(col,(0.035+0.10*up)*(0.5+0.5*d)*(isHov?1.5:1)); ax.fill();
      ax.strokeStyle=rgba(CL.line,.5*d); ax.lineWidth=.7; ax.stroke();
      /* the status light at the near end of the bay */
      const zl0=Z0+0.09, zl1=Z0+0.09+(Z1-Z0)*0.13;
      quad(pt(Xin,y0,zl0),pt(Xin,y1,zl0),pt(Xin,y1,zl1),pt(Xin,y0,zl1));
      ax.fillStyle=up<.06?rgba(CL.faint,.22*d+.05)
        :rgba(col,(0.30+0.66*up)*(0.45+0.55*d)); ax.fill()}
    return nNew}

  function drawFront(F){
    if(F<-TRANS*2.0||F>ZMAX+PITCH)return;
    /* the plane is a suggestion at the far end and a solid wall by the time it
       reaches the front of the aisle; then it passes the viewer and clears */
    const adv=clamp((ZMAX-F)/Math.max(1e-6,ZMAX),0,1);
    const exit=clamp((PITCH*0.55-F)/(TRANS*1.5),0,1);
    const A=(0.10+0.88*adv*adv)*(1-exit);
    if(A<=0.004)return;
    const top=RH*1.22;
    const a=pt(-AW,0,F), b=pt(-AW,top,F), c=pt(AW,top,F), e=pt(AW,0,F);
    const g=ax.createLinearGradient(0,b[1],0,a[1]);
    g.addColorStop(0,rgba(CL.am,A*0.10));
    g.addColorStop(.5,rgba(CL.am,A*0.55));
    g.addColorStop(1,rgba(CL.am,A));
    quad(a,b,c,e); ax.fillStyle=g; ax.fill();
    ax.strokeStyle=rgba(CL.am,Math.min(1,(.55+.45*adv)*(1-exit))); ax.lineWidth=1.6; seg(a,e);
    ax.strokeStyle=rgba(CL.am,.22*(1-exit)); ax.lineWidth=5; seg(a,e)}

  function drawFloor(){
    ax.lineWidth=1;
    for(let i=0;i<=NR;i++){const z=i*PITCH;
      ax.strokeStyle=rgba(CL.brass,.09*(1-i/NR)+.03);
      seg(pt(-AW,0,z),pt(AW,0,z))}
    ax.strokeStyle=rgba(CL.brass,.13);
    seg(pt(-AW,0,0),pt(-AW,0,ZMAX+PITCH));
    seg(pt(AW,0,0),pt(AW,0,ZMAX+PITCH));
    ax.strokeStyle=rgba(CL.brass,.06);
    seg(pt(0,0,0),pt(0,0,ZMAX+PITCH));
    /* cable tray overhead — two runs to the vanishing point */
    ax.strokeStyle=rgba(CL.brass,.10);
    const ty=RH+0.36;
    seg(pt(-AW*0.66,ty,0),pt(-AW*0.66,ty,ZMAX+PITCH));
    seg(pt(AW*0.66,ty,0),pt(AW*0.66,ty,ZMAX+PITCH));
    ax.strokeStyle=rgba(CL.brass,.07);
    for(let i=0;i<=NR;i+=2)seg(pt(-AW*0.66,ty,i*PITCH),pt(AW*0.66,ty,i*PITCH))}

  function drawSource(F){
    const Z=ZMAX+PITCH*0.92, hgt=0.66;
    quad(pt(-AW,0,Z),pt(-AW,hgt,Z),pt(AW,hgt,Z),pt(AW,0,Z));
    ax.fillStyle='#100E0C'; ax.fill();
    ax.strokeStyle=rgba(CL.brass,.34); ax.lineWidth=1; ax.stroke();
    const live=clamp((ZMAX+PITCH-F)/PITCH,0,1);
    for(let i=0;i<7;i++){
      const x0=-AW*0.74+i*(AW*1.48/7), x1=x0+AW*1.48/7*0.62;
      quad(pt(x0,hgt*0.30,Z),pt(x0,hgt*0.46,Z),pt(x1,hgt*0.46,Z),pt(x1,hgt*0.30,Z));
      ax.fillStyle=rgba(CL.ice,.16+.50*live*(0.5+0.5*Math.sin(i*1.7))); ax.fill()}}

  /* which rack face is under the pointer — nearest first */
  function inQuad(px,py,q){
    let c=false;
    for(let i=0,j=3;i<4;j=i++){
      const xi=q[i][0],yi=q[i][1],xj=q[j][0],yj=q[j][1];
      if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))c=!c}
    return c}
  function pick(px,py){
    for(let i=0;i<NR;i++)for(const side of [-1,1]){
      const Xin=side*AW, Z0=i*PITCH, Z1=Z0+PITCH-GAP;
      if(inQuad(px,py,[pt(Xin,0,Z0),pt(Xin,RH,Z0),pt(Xin,RH,Z1),pt(Xin,0,Z1)]))
        return {side,i}}
    return null}

  cv.addEventListener('pointermove',e=>{
    const r=cv.getBoundingClientRect();
    mtX=(e.clientX-r.left)/r.width-0.5; mtY=(e.clientY-r.top)/r.height-0.5; hasPtr=true;
    hov=pick(e.clientX-r.left,e.clientY-r.top)});
  cv.addEventListener('pointerleave',()=>{hasPtr=false;mtX=0;mtY=0;hov=null});

  function prog(){
    const r=cv.getBoundingClientRect(), vh=innerHeight||1;
    return clamp((vh*1.06-(r.top+r.height/2))/(vh*0.76),0,1)}

  register(()=>{
    if(!W)size();
    p=lerp(p,prog(),.16);
    if(!RM){camX=lerp(camX,mtX*0.30,.07); camY=lerp(camY,-mtY*0.16,.07)}
    const F=lerp(ZMAX+PITCH*1.4,-TRANS*1.6,p);
    ax.clearRect(0,0,W,H);
    drawFloor(); drawSource(F);
    let done=0, crossed=false;
    for(let i=NR-1;i>=0;i--){
      const zc=i*PITCH+(PITCH-GAP)/2;
      if(!crossed&&zc<=F){drawFront(F);crossed=true}
      done+=drawRack(-1,i,F); done+=drawRack(1,i,F)}
    if(!crossed)drawFront(F);
    /* a soft vignette so the aisle sits in the panel rather than in a box */
    ax.globalCompositeOperation='destination-out';
    const gg=ax.createLinearGradient(0,0,0,H);
    gg.addColorStop(0,'rgba(0,0,0,.55)');gg.addColorStop(.16,'rgba(0,0,0,0)');
    gg.addColorStop(.90,'rgba(0,0,0,0)');gg.addColorStop(1,'rgba(0,0,0,.5)');
    ax.fillStyle=gg; ax.fillRect(0,0,W,H);
    ax.globalCompositeOperation='source-over';
    if(readEl){
      readEl.innerHTML = hov
        ? `rack <b>${hov.side<0?'A':'B'}${String(hov.i+1).padStart(2,'0')}</b> · ${NB} bays · root `+
          `<b>${(hov.i*PITCH+(PITCH-GAP)/2)>F?IMG_NEW:IMG_OLD}</b>`
        : `<b>${done}</b>/${NR*2*NB} bays on ${IMG_NEW}`}
  },{every:2,el:cv});
})();

/* ===================== IT — CONFIG FACET LATTICE =====================
   Every host is a short stack of config facets — packages, services, firewall,
   users, mounts. Unmanaged, each facet sits at its own offset from the declared
   position. Scrolling runs the playbook across the lattice as a front; as it
   passes a host, that host's facets slide onto the declared line and settle.
   Hovering holds a host up and names what was off. Nothing is clickable. */
(function LATTICE(){
  const cv=$('#lattice'); if(!cv)return;
  const lx=cv.getContext('2d'), readEl=$('#fleetread');
  const FACETS=['packages','services','firewall','users','mounts'];
  const NF=FACETS.length;
  let COLS=12, ROWS=4, N=COLS*ROWS;
  let W=0,H=0,dpr=1,p=0,hov=-1;

  let sd=91; const rr=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  let HOSTS=[];
  function build(){
    sd=91; HOSTS=[];
    for(let i=0;i<N;i++){
      const off=[],bad=[];
      for(let f=0;f<NF;f++){
        const drift=rr()<0.42;
        bad.push(drift); off.push(drift?((rr()*2-1)||.4)*0.95:0)}
      HOSTS.push({off,bad})}}

  function size(){
    dpr=Math.min(2,devicePixelRatio||1);
    const r=cv.getBoundingClientRect(); W=r.width; H=r.height;
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    lx.setTransform(dpr,0,0,dpr,0,0);
    const want=W<560?6:W<820?8:12;
    if(want!==COLS){COLS=want;ROWS=W<560?8:W<820?6:4;N=COLS*ROWS;build()}}
  build(); size(); addEventListener('resize',size);

  const cell=()=>({w:W/COLS,h:H/ROWS});
  const phase=i=>{const c=i%COLS,r=(i/COLS)|0;
    return (COLS<2?0:c/(COLS-1))*0.88+(ROWS<2?0:r/(ROWS-1))*0.12};
  const BAND=0.22;
  const conv=i=>clamp((front()-phase(i))/BAND,0,1);
  let FR=0;
  const front=()=>FR;

  cv.addEventListener('pointermove',e=>{
    const r=cv.getBoundingClientRect();
    const {w,h}=cell();
    const c=Math.floor((e.clientX-r.left)/(r.width/COLS));
    const rw=Math.floor((e.clientY-r.top)/(r.height/ROWS));
    hov=(c>=0&&c<COLS&&rw>=0&&rw<ROWS)?rw*COLS+c:-1});
  cv.addEventListener('pointerleave',()=>{hov=-1});

  function prog(){
    const r=cv.getBoundingClientRect(), vh=innerHeight||1;
    return clamp((vh*1.02-(r.top+r.height/2))/(vh*0.70),0,1)}

  register(t=>{
    if(!W)size();
    p=lerp(p,prog(),.16);
    FR=p*(1+BAND*2)-BAND;
    const {w,h}=cell();
    lx.clearRect(0,0,W,H);
    const fw=Math.min(w*0.54,42), fh=Math.max(2.4,Math.min(h*0.075,4.2)), fg=fh+2.2;
    const stackH=NF*fg-2.2, amp=Math.min(w*0.22,15);
    let converged=0;
    for(let i=0;i<N;i++){
      const c=i%COLS, r=(i/COLS)|0;
      const cxp=c*w+w/2, cyp=r*h+h/2;
      const k=conv(i), fl=Math.sin(clamp(k,0,1)*Math.PI);
      if(k>.985)converged++;
      const isHov=i===hov;
      if(isHov){lx.fillStyle=rgba(CL.ink,.035);
        lx.fillRect(c*w+1,r*h+1,w-2,h-2)}
      /* the declared line the facets are pulled onto */
      lx.strokeStyle=rgba(CL.brass,isHov?.30:.11); lx.lineWidth=1;
      lx.beginPath();lx.moveTo(cxp-fw/2,cyp-stackH/2-3);
      lx.lineTo(cxp-fw/2,cyp+stackH/2+3);lx.stroke();
      for(let f=0;f<NF;f++){
        const H0=HOSTS[i]||{off:[],bad:[]};
        const dx=(H0.off[f]||0)*amp*(1-k);
        const y=cyp-stackH/2+f*fg;
        const col=k>.5?CL.ice:CL.am;
        const a=(H0.bad[f]?.55:.30)+.40*k;
        lx.fillStyle=rgba(col,a*(isHov?1.25:1));
        lx.fillRect(cxp-fw/2+dx,y,fw,fh);
        if(fl>.04&&H0.bad[f]){
          lx.strokeStyle=rgba(CL.am,.7*fl);lx.lineWidth=1;
          lx.strokeRect(cxp-fw/2+dx-1.5,y-1.5,fw+3,fh+3)}}}
    /* the playbook front */
    const fx0=(FR-0*0.12)/0.88, fx1=(FR-0.12)/0.88;
    lx.strokeStyle=rgba(CL.am,.55); lx.lineWidth=1.4;
    lx.beginPath(); lx.moveTo(fx0*W,0); lx.lineTo(fx1*W,H); lx.stroke();
    lx.strokeStyle=rgba(CL.am,.13); lx.lineWidth=9;
    lx.beginPath(); lx.moveTo(fx0*W,0); lx.lineTo(fx1*W,H); lx.stroke();
    if(readEl){
      if(hov>=0&&HOSTS[hov]){
        const bad=FACETS.filter((_,f)=>HOSTS[hov].bad[f]);
        readEl.innerHTML=`<b>host-${String(hov+1).padStart(2,'0')}</b> · `+
          (bad.length?`${bad.join(', ')} ${conv(hov)>.5?'→ converged':'drifted'}`:'already at declared state')}
      else readEl.innerHTML=`<b>${converged}</b>/${N} converged · ${NF} facets each`}
  },{every:2,el:cv});
})();

(function SIDECHANNEL(){
  const trc=$('#trace'),tx=trc.getContext('2d');
  const ftc=$('#feat'),fx=ftc.getContext('2d');
  const NS=2500, ROUNDS=17, SPACING=141, START=118;
  let TW=0,TH=0,FW=0,FH=0,dpr=1,SEL=0,HOVF=null,sweep=0;
  let SET=[],TROJ=0,detT=0,seed=7,THR=2.6,FSCALE=3.4,BRAD=0.5;
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
  /* the third axis: how much of the quiet-window movement is slow rather than fast.
     It comes from the baseline ripple, which the payload never touches — so the
     flagged trace is ordinary along this axis, and only steps out along the first. */
  function feature3(P,trig){
    let slow=0,fast=0,n=0; const h=[];
    for(let i=1;i<NS;i+=2){
      if(inEvent(i)){h.length=0;continue}
      const v=sample(i,P,trig); h.push(v); if(h.length>5)h.shift();
      if(h.length===5){slow+=Math.abs(h[4]-h[0]);fast+=Math.abs(h[4]-h[3]);n++}}
    return n?(slow/Math.max(1e-6,fast)):1}

  function build(){
    seed=(Date.now()%9791)+13; SET=[];detT=0;
    for(let i=0;i<54;i++){const P=mkParams();P.trig=false;SET.push(P)}
    TROJ=Math.floor(rr()*54);
    SET[TROJ].trig=true; SET[TROJ].gain+=5.6; SET[TROJ].off+=0.30;
    SET.forEach(function(P,i){P.i=i;const f=features(P,P.trig);
      P.f1=f.p; P.f2=f.e; P.f3=feature3(P,P.trig)});
    /* each axis standardised on its own median and spread, so the cloud is a
       ball rather than a streak and distance means the same thing in every
       direction */
    const med=a=>{const b=[...a].sort((x,y)=>x-y);return b[b.length>>1]};
    const norm=key=>{
      const v=SET.map(P=>P[key]), m=med(v);
      const sg=Math.max(1e-6,1.4826*med(v.map(x=>Math.abs(x-m))));
      SET.forEach(P=>{P[key+'n']=(P[key]-m)/sg})};
    norm('f1'); norm('f2'); norm('f3');
    SET.forEach(P=>{P.d=Math.hypot(P.f1n,P.f2n,P.f3n);
      P.score=Math.min(.99,1-Math.exp(-Math.max(0,P.d-1.15)/1.9))});
    /* the boundary sits just outside the furthest ordinary trace, the way a
       fitted detector's does — snug on the crowd, and still well inside the one
       it ranks first */
    const dT=SET[TROJ].d, dRest=Math.max(...SET.filter(P=>P.i!==TROJ).map(P=>P.d));
    THR=Math.min((dT+dRest)/2, dRest*1.16);
    /* radius is compressed by a fixed power before drawing, purely so the flagged
       trace stays in frame without squeezing the crowd into a dot. It is a radial
       map, so the boundary is still a sphere and the ordering is untouched. */
    SET.forEach(P=>{const r=Math.pow(P.d,0.62), u=P.d||1e-6;
      P.ux=P.f1n/u*r; P.uy=P.f2n/u*r; P.uz=P.f3n/u*r});
    FSCALE=Math.max(...SET.map(P=>Math.hypot(P.ux,P.uy,P.uz)))*1.13||1;
    BRAD=Math.pow(THR,0.62)/FSCALE;
    SEL=TROJ}

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
    return {cx:TW/2, cy:TH*0.36, Rx, Ry, R:Rx, A:Rx*AMPF}}

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

  /* ---------- feature space, in three dimensions ----------
     Every measurement is reduced to three numbers and drawn as one point in a
     slowly turning space. The crowd is what "usual" looks like; the detector
     wraps a boundary around it as the panel comes into view, and whatever falls
     outside is what gets looked at. Drag to turn it, hover a point to load that
     trace into the ring above. */
  const FOV=3.1;
  let rotX=-0.22, rotY=0.5, velX=0, velY=0, drag=false, moved=0, lastPX=0, lastPY=0;
  let fPtr=null;

  const fp=[0,0,0,0];
  function project(x,y,z,out){
    const cy0=Math.cos(rotY), sy0=Math.sin(rotY);
    const cx0=Math.cos(rotX), sx0=Math.sin(rotX);
    let X=x*cy0+z*sy0, Z=-x*sy0+z*cy0;
    let Y=y*cx0-Z*sx0; Z=y*sx0+Z*cx0;
    const k=FOV/(FOV+Z);
    const R=Math.min(FW*0.46,FH*0.58);
    out[0]=FW/2+X*k*R; out[1]=FH/2+Y*k*R; out[2]=k; out[3]=Z; return out}

  const ppos=P=>project(P.ux/FSCALE,-P.uy/FSCALE,P.uz/FSCALE,[0,0,0,0]);

  /* the boundary drawn as a wireframe ball: three great circles and two rings,
     each segment faded by its own depth so the far side sits behind the cloud */
  function ring(axis,lat,rad,alpha){
    const N=74, o=[0,0,0,0], prev=[0,0,0,0];
    for(let i=0;i<=N;i++){
      const a=i/N*TAU, c=Math.cos(a)*Math.cos(lat), sn=Math.sin(a)*Math.cos(lat), h=Math.sin(lat);
      let x,y,z;
      if(axis===0){x=c;y=sn;z=h} else if(axis===1){x=c;y=h;z=sn} else {x=h;y=c;z=sn}
      project(x*rad,y*rad,z*rad,o);
      if(i){
        const dpt=clamp((o[3]+1.3)/2.6,0,1);
        fx.strokeStyle=rgba(CL.ice,alpha*(0.18+0.82*(1-dpt)));
        fx.beginPath();fx.moveTo(prev[0],prev[1]);fx.lineTo(o[0],o[1]);fx.stroke()}
      prev[0]=o[0];prev[1]=o[1];prev[3]=o[3]}}

  function drawFeat(t){
    fx.clearRect(0,0,FW,FH);
    if(!SET.length)return;
    const rad=BRAD;
    fx.lineWidth=1; fx.setLineDash([2,4]);
    if(detT>.004){
      ring(0,0,rad,.42*detT); ring(1,0,rad,.42*detT); ring(2,0,rad,.42*detT);
      ring(0,0.62,rad,.20*detT); ring(0,-0.62,rad,.20*detT)}
    fx.setLineDash([]);
    /* the centre of the crowd */
    const c0=project(0,0,0,[0,0,0,0]);
    fx.fillStyle=rgba(CL.ice,.35*detT);
    fx.beginPath();fx.arc(c0[0],c0[1],2,0,TAU);fx.fill();
    /* points, far ones first */
    const ord=SET.map(P=>({P,q:ppos(P)})).sort((a,b)=>b.q[3]-a.q[3]);
    let out=0;
    for(const {P,q} of ord){
      const isOut=P.d>THR, k=isOut?detT:0;
      if(isOut&&detT>.5)out++;
      const dpt=clamp((q[3]+1.3)/2.6,0,1), near=1-dpt;
      const r=(1.9+2.6*near)*(P.i===SEL?1.5:1);
      if(k>.02){
        fx.strokeStyle=rgba(CL.red,.22*k);fx.setLineDash([3,4]);fx.lineWidth=1;
        fx.beginPath();fx.moveTo(c0[0],c0[1]);fx.lineTo(q[0],q[1]);fx.stroke();fx.setLineDash([]);
        const pulse=(Math.sin(t*2.2)+1)/2;
        fx.strokeStyle=rgba(CL.red,(.45+.45*pulse)*k);fx.lineWidth=1.3;
        fx.beginPath();fx.arc(q[0],q[1],r+5+pulse*4,0,TAU);fx.stroke()}
      if(P.i===SEL){fx.strokeStyle=rgba(k>.5?CL.red:CL.am,.85);fx.lineWidth=1.2;
        fx.beginPath();fx.arc(q[0],q[1],r+4.5,0,TAU);fx.stroke()}
      fx.fillStyle=k>.02
        ? `rgba(${Math.round(lerp(111,255,k))},${Math.round(lerp(200,74,k))},${Math.round(lerp(240,69,k))},${(.5+.45*near).toFixed(2)})`
        : rgba(CL.ice,.30+.55*near);
      fx.beginPath();fx.arc(q[0],q[1],r,0,TAU);fx.fill()}
    const re=$('#featread');
    if(re)re.innerHTML = detT>.5
      ? `<b class="r">${out}</b> of ${SET.length} outside the boundary`
      : `${SET.length} traces · one point each`;
  }

  /* drag to turn, hover to pick — no clicks */
  ftc.addEventListener('pointerdown',e=>{drag=true;moved=0;lastPX=e.clientX;lastPY=e.clientY});
  addEventListener('pointerup',()=>{drag=false});
  ftc.addEventListener('pointerleave',()=>{fPtr=null});
  ftc.addEventListener('pointermove',e=>{
    const r=ftc.getBoundingClientRect();
    fPtr={x:(e.clientX-r.left)*(FW/r.width),y:(e.clientY-r.top)*(FH/r.height)};
    if(drag){
      const dx=e.clientX-lastPX, dy=e.clientY-lastPY;
      moved+=Math.abs(dx)+Math.abs(dy);
      velY=velY*.4+(dx*0.006)*.6; velX=velX*.4+(dy*0.005)*.6;
      rotY+=dx*0.006; rotX=clamp(rotX+dy*0.005,-.9,.9);
      lastPX=e.clientX;lastPY=e.clientY}});

  function pickFeat(){
    if(!fPtr||drag)return;
    let best=null,bd=1e9;
    for(const P of SET){const q=ppos(P);
      const d=Math.hypot(q[0]-fPtr.x,q[1]-fPtr.y);
      if(d<bd){bd=d;best=P}}
    if(best&&bd<18)SEL=best.i}

  register(t=>{
    const dgt=(()=>{const r=ftc.getBoundingClientRect(), vh=innerHeight||1;
      return clamp((vh*0.95-(r.top+r.height*0.5))/(vh*0.40),0,1)})();
    detT=lerp(detT,dgt,.075);
    if(detT<.0015)detT=0; if(detT>.9985)detT=1;
    if(!drag){rotY+=velY;rotX=clamp(rotX+velX,-.9,.9);velY*=.93;velX*=.90;
      if(!RM)rotY+=0.0016}
    pickFeat();
    sweep=lerp(sweep,sweepProgress(),.20);
    const full=sweep>0.995;
    if(full&&!wasFull)flashT=1;
    wasFull=full;
    flashT=Math.max(0,flashT-.02);
    buildGhost();
    drawTrace();drawFeat(t)},{every:2,el:trc});

})();
