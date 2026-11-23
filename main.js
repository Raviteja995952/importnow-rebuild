(() => {
  const S = window.SITE, $ = s => document.querySelector(s), esc = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  // Render content
  $('#service-grid').innerHTML = S.services.map(([i,t,p],n)=>`<article class="card rv"><span class="num">0${n+1}</span><div class="icon">${i}</div><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join('');
  $('#jsteps').innerHTML = S.steps.map(([t,p],n)=>`<li data-i="${n}"><b>${n+1}</b><div><h4>${esc(t)}</h4><p>${esc(p)}</p></div></li>`).join('');
  $('#product-grid').innerHTML = S.products.map(([h,t,l,f])=>`<article class="card prod rv"><span class="tag">${h}</span><h3>${esc(t)}</h3><ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="foot-note">${esc(f)}</p></article>`).join('');
  $('#work-grid').innerHTML = S.work.map(([r,t,p,tags])=>`<article class="card work rv"><span class="route">${r}</span><h3>${esc(t)}</h3><p>${esc(p)}</p><div class="pills">${tags.map(x=>`<span>${x}</span>`).join('')}</div></article>`).join('');
  $('#story-grid').innerHTML = S.stories.map(([q,n,r])=>`<figure class="card story rv"><blockquote>“${esc(q)}”</blockquote><figcaption><span class="av">${n.split(' ').map(w=>w[0]).join('').slice(0,2)}</span><span><b>${esc(n)}</b><small>${esc(r)}</small></span></figcaption></figure>`).join('');
  $('#post-grid').innerHTML = S.posts.map(([c,t,e,m])=>`<article class="card post rv"><span class="tag">${c}</span><h3>${esc(t)}</h3><p>${esc(e)}</p><small>${m} min read</small></article>`).join('');
  $('#faq-list').innerHTML = S.faq.map(([q,a])=>`<details class="rv"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  $('#yr').textContent = new Date().getFullYear();
  $('#mq').innerHTML += $('#mq').innerHTML; // seamless marquee loop

  // Nav
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), {passive:true});
  $('#burger').onclick = () => nav.classList.toggle('open');
  document.querySelectorAll('#navlinks a').forEach(a => a.onclick = () => nav.classList.remove('open'));

  // Reveal on scroll + count-up
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12});
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, t0 = performance.now() + 300;
    const tick = t => { const k = Math.min(1, Math.max(0,(t - t0) / 1400)); el.textContent = Math.round(end * (1 - Math.pow(1-k,3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  // Hero globe: dotted sphere with China→India arcs (canvas 2D, no libraries)
  const g = $('#globe'), gc = g.getContext('2d'), DPR = Math.min(2, devicePixelRatio||1);
  const pts = []; for (let i=0;i<1400;i++){ const y=1-2*(i+.5)/1400, r=Math.sqrt(1-y*y), th=i*2.39996; pts.push([Math.cos(th)*r,y,Math.sin(th)*r]); }
  const ll = (lat,lon) => { const a=lat*Math.PI/180, b=-lon*Math.PI/180; return [Math.cos(a)*Math.cos(b), Math.sin(a), Math.cos(a)*Math.sin(b)]; };
  const routes = [[[31.2,121.5],[13.1,80.3]],[[29.3,120.1],[19.7,78.5]],[[23.0,113.1],[17.4,78.5]],[[22.5,114.1],[18.9,72.8]],[[29.9,121.6],[17.7,83.3]]];
  function resizeG(){ g.width = g.clientWidth*DPR; g.height = g.clientHeight*DPR; }
  resizeG(); addEventListener('resize', resizeG);
  let rot = 1.2;
  function drawGlobe(){
    const W=g.width,H=g.height,R=Math.min(W,H)*.42,cx=W*(innerWidth>900?.72:.5),cy=H*.5; gc.clearRect(0,0,W,H);
    const proj=([x,y,z])=>{ const c=Math.cos(rot),s=Math.sin(rot),X=x*c-z*s,Z=x*s+z*c; return [cx+X*R, cy-y*R, Z]; };
    const glow = gc.createRadialGradient(cx,cy,R*.2,cx,cy,R*1.25); glow.addColorStop(0,'rgba(255,107,53,.10)'); glow.addColorStop(1,'rgba(255,107,53,0)'); gc.fillStyle=glow; gc.fillRect(0,0,W,H);
    for (const p of pts){ const [x,y,z]=proj(p); if(z<0) continue; gc.fillStyle=`rgba(30,41,80,${.12+.5*z})`; gc.fillRect(x,y,1.6*DPR,1.6*DPR); }
    const t = performance.now()/1000;
    routes.forEach(([a,b],k)=>{ const A=ll(...a),B=ll(...b); gc.beginPath(); let vis=false;
      for(let i=0;i<=40;i++){ const u=i/40, h=1+.25*Math.sin(Math.PI*u); const v=A.map((q,j)=>q*(1-u)+B[j]*u), n=Math.hypot(...v); const [x,y,z]=proj(v.map(q=>q/n*h)); if(z>-.1){ vis=true; i?gc.lineTo(x,y):gc.moveTo(x,y);} }
      if(!vis) return; gc.strokeStyle='rgba(255,107,53,.55)'; gc.lineWidth=1.4*DPR; gc.stroke();
      const u=((t*.25+k*.2)%1), h=1+.25*Math.sin(Math.PI*u), v=A.map((q,j)=>q*(1-u)+B[j]*u), n=Math.hypot(...v), [x,y,z]=proj(v.map(q=>q/n*h));
      if(z>0){ gc.fillStyle='#ff6b35'; gc.beginPath(); gc.arc(x,y,3*DPR,0,7); gc.fill(); }
    });
    rot += .0018; requestAnimationFrame(drawGlobe);
  }
  drawGlobe();

  // Journey: scroll-driven ship voyage
  const sec = $('#journey'), sea = $('#sea'), sc = sea.getContext('2d'), steps = [...document.querySelectorAll('#jsteps li')];
  let prog = 0;
  function resizeS(){ sea.width = sea.clientWidth*DPR; sea.height = sea.clientHeight*DPR; }
  resizeS(); addEventListener('resize', resizeS);
  addEventListener('scroll', () => {
    const r = sec.getBoundingClientRect(); prog = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    const idx = Math.min(5, Math.floor(prog*6)); steps.forEach((s,i)=>s.classList.toggle('on', i===idx)); steps.forEach((s,i)=>s.classList.toggle('done', i<idx));
    $('#jfill').style.width = (prog*100)+'%'; $('#jboat').style.left = (prog*100)+'%'; $('#jday').textContent = 'Day ' + Math.round(prog*35);
  }, {passive:true});
  function drawSea(){
    const W=sea.width,H=sea.height,t=performance.now()/1000; const sky=sc.createLinearGradient(0,0,0,H); sky.addColorStop(0,'#0b1430'); sky.addColorStop(.55,'#13295a'); sky.addColorStop(1,'#0a1a3c'); sc.fillStyle=sky; sc.fillRect(0,0,W,H);
    for(let l=0;l<6;l++){ const y0=H*(.62+l*.07); sc.beginPath(); sc.moveTo(0,H); for(let x=0;x<=W;x+=12*DPR){ sc.lineTo(x, y0+Math.sin(x/(90*DPR)+t*(1+l*.3)+l)*6*DPR); } sc.lineTo(W,H); sc.fillStyle=`rgba(${30+l*8},${70+l*10},${140+l*10},.35)`; sc.fill(); }
    const sx = W*(.1+.8*prog), sy = H*.62 + Math.sin(t*1.5)*4*DPR, s=DPR*(innerWidth>700?1:.6);
    sc.fillStyle='#e8ecf5'; sc.beginPath(); sc.moveTo(sx-90*s,sy); sc.lineTo(sx+90*s,sy); sc.lineTo(sx+70*s,sy+26*s); sc.lineTo(sx-80*s,sy+26*s); sc.fill();
    const cols=['#ff6b35','#ffb020','#3d7bff','#2bb673']; for(let i=0;i<6;i++) for(let j=0;j<2;j++){ sc.fillStyle=cols[(i+j)%4]; sc.fillRect(sx-70*s+i*22*s, sy-18*s-j*16*s, 20*s, 14*s); }
    sc.fillStyle='#fff'; sc.fillRect(sx+55*s,sy-40*s,22*s,40*s);
    requestAnimationFrame(drawSea);
  }
  drawSea();

  // Quote form → WhatsApp
  $('#qform').onsubmit = e => { e.preventDefault(); const v = id => $('#'+id).value.trim();
    const msg = `Hi ImportNow, I'd like a sourcing quote.\nName: ${v('f-name')}\nCity: ${v('f-city')}\nProduct: ${v('f-cat')}\nQuantity: ${v('f-qty')}\nBudget: ${v('f-budget')}\nDetails: ${v('f-msg')}`;
    window.open('https://wa.me/919989724320?text='+encodeURIComponent(msg), '_blank'); };
  $('#wa').onclick = () => window.open('https://wa.me/919989724320', '_blank');
})();
