const stage=document.getElementById('stage');
  function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.setProperty('--scale',s);}
  addEventListener('resize',fit);fit();
  const slides=[...document.querySelectorAll('.slide')];
  // background swirl palette — pulled from the theme tokens
  const cs=getComputedStyle(document.documentElement);
  const palette=['--p0','--p1','--p2','--p3','--p4','--p5'].map(v=>cs.getPropertyValue(v).trim()||'#0e3b66');
  const themes=slides.map((_,n)=>[palette[n%6],palette[(n+2)%6],palette[(n+4)%6]]);
  const bg=document.getElementById('bg');
  const barfill=document.getElementById('barfill');
  const count=document.getElementById('count');
  const fab=document.getElementById('fab');
  const menu=document.getElementById('menu');
  const nav=document.getElementById('nav');
  const navTitle=s=>{
    if(s.dataset.nav) return s.dataset.nav;
    const b=s.querySelector('.badge'); if(b) return b.textContent.trim();
    const h=s.querySelector('h1,h2'); return h?h.textContent.replace(/\s+/g,' ').trim().slice(0,26):'Slide';
  };
  const navItems=slides.map((s,n)=>{
    const btn=document.createElement('button');
    btn.className='navi'; btn.dataset.go=n;
    btn.innerHTML='<span class="n"></span><span class="t"></span>';
    btn.querySelector('.n').textContent=String(n+1).padStart(2,'0');
    btn.querySelector('.t').textContent=navTitle(s);
    nav.appendChild(btn); return btn;
  });
  let i=0;
  function show(n){
    i=Math.max(0,Math.min(slides.length-1,n));
    slides.forEach((s,x)=>s.classList.toggle('active',x===i));
    document.body.classList.toggle('first',i===0);
    barfill.style.width=((i+1)/slides.length*100)+'%';
    count.textContent=(i+1)+' / '+slides.length;
    navItems.forEach((b,x)=>b.classList.toggle('on',x===i));
    if(navItems[i]) navItems[i].scrollIntoView({block:'nearest'});
    const t=themes[i];
    bg.style.setProperty('--g1',t[0]);bg.style.setProperty('--g2',t[1]);bg.style.setProperty('--g3',t[2]);
    const hash='#'+(i+1);
    if(location.hash!==hash){try{history.replaceState(null,'',hash);}catch(e){location.hash=hash;}}
    if(i===slides.length-1)party();
  }
  function party(){
    const c=document.getElementById('confetti');c.classList.add('go');c.innerHTML='';
    const cols=[...palette,'#fff',cs.getPropertyValue('--gold').trim()||'#FFC857'];
    for(let k=0;k<150;k++){
      const b=document.createElement('b');
      b.style.left=Math.random()*100+'%';
      b.style.background=cols[k%cols.length];
      b.style.animationDuration=(2.4+Math.random()*2.6)+'s';
      b.style.animationDelay=(Math.random()*.8)+'s';
      b.style.transform='scale('+(.5+Math.random())+')';
      c.appendChild(b);
    }
    setTimeout(()=>c.classList.remove('go'),5400);
  }
  function toggleFull(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
  function closeMenu(){menu.classList.remove('open');fab.classList.remove('on')}
  /* ── INLINE EDITING ─────────────────────────────────────────
     E toggles edit mode (click any text, type), Ctrl/Cmd+S downloads the
     edited deck as a self-contained HTML file. Esc exits edit mode. */
  let editing=false;
  function toggleEdit(){
    editing=!editing;
    document.body.classList.toggle('editing',editing);
    document.querySelectorAll('.slide').forEach(s=>{
      if(editing) s.setAttribute('contenteditable','true');
      else s.removeAttribute('contenteditable');
    });
  }
  function saveDeck(){
    const doc=document.documentElement.cloneNode(true);
    // strip runtime-generated content so the saved file rebuilds it cleanly
    doc.querySelectorAll('#nav,#motes,#confetti').forEach(n=>n.innerHTML='');
    doc.querySelectorAll('[contenteditable]').forEach(n=>n.removeAttribute('contenteditable'));
    const b=doc.querySelector('body'); if(b) b.classList.remove('editing');
    const html='<!DOCTYPE html>\n'+doc.outerHTML;
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));
    a.download=(location.pathname.split('/').pop())||'index.html';
    a.click();
  }
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&(e.key==='s'||e.key==='S')){e.preventDefault();saveDeck();return;}
    if(editing){if(e.key==='Escape')toggleEdit();return;}
    if(e.key==='e'||e.key==='E'){toggleEdit();return;}
    if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();show(i+1)}
    if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();show(i-1)}
    if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1);
    if(e.key==='f'||e.key==='F')toggleFull();
    if(e.key==='r'||e.key==='R'){location.href='roller/index.html';}
    if(e.key==='p'||e.key==='P'){e.preventDefault();window.print()}
    if(e.key==='Escape')closeMenu();
  });
  fab.addEventListener('click',e=>{e.stopPropagation();const o=menu.classList.toggle('open');fab.classList.toggle('on',o)});
  menu.addEventListener('click',e=>{
    const g=e.target.closest('.navi');
    if(g){show(+g.dataset.go);closeMenu();return;}
    const b=e.target.closest('.act');if(!b)return;
    const a=b.dataset.act;
    if(a==='prev')show(i-1);
    else if(a==='next')show(i+1);
    else if(a==='edit'){toggleEdit();closeMenu();}
    else if(a==='full')toggleFull();
    else if(a==='print')window.print();
    else if(a==='roller')location.href='roller/index.html';
  });
  let sx=null;
  addEventListener('touchstart',e=>sx=e.touches[0].clientX);
  addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(i+(dx<0?1:-1));sx=null});
  addEventListener('click',e=>{
    if(editing)return;
    if(e.target.closest('.fab')||e.target.closest('.menu'))return;
    if(menu.classList.contains('open')){closeMenu();return;}
    show(i+(e.clientX>innerWidth*.5?1:-1));
  });
  const motes=document.getElementById('motes');
  const moteCols=[['#ffffff','rgba(255,255,255,.55)'],['#b0e8ff','rgba(0,176,240,.6)'],['#fff4b0','rgba(252,216,48,.55)']];
  for(let k=0;k<34;k++){
    const m=document.createElement('i');
    const s=2+Math.random()*3.5;
    const r=k%5;
    const c=r===0?moteCols[2]:(r%2?moteCols[1]:moteCols[0]);
    m.style.left=(Math.random()*100)+'%';
    m.style.top=(Math.random()*100)+'%';
    m.style.width=m.style.height=s+'px';
    m.style.setProperty('--c',c[0]);
    m.style.setProperty('--g',c[1]);
    m.style.setProperty('--dx',(Math.random()*6-3)+'cqw');
    m.style.setProperty('--dy',(Math.random()*6-3)+'cqh');
    m.style.setProperty('--o',(.3+Math.random()*.4).toFixed(2));
    m.style.animationDuration=(7+Math.random()*9)+'s';
    m.style.animationDelay=(-Math.random()*16)+'s';
    motes.appendChild(m);
  }
  /* mock QR (placeholder for a real code) — even quiet zone baked into the viewBox */
  (function(){
    const svg=document.getElementById('qr'); if(!svg) return;
    const N=25, Q=7, M=(100-2*Q)/N;          // Q = quiet-zone units on every side
    const P=i=>(Q+i*M).toFixed(2);           // module top-left position
    const S=n=>(n*M).toFixed(2);             // size of n modules
    const inSep=(x,y)=>{const s=(ox,oy)=>x>=ox&&x<ox+8&&y>=oy&&y<oy+8;return s(-1,-1)||s(N-7,-1)||s(-1,N-7);};
    let r='';
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      if(inSep(x,y))continue;
      const h=Math.abs(Math.sin((x+1)*12.9898+(y+1)*78.233))*43758.5453;
      if((h-Math.floor(h))<.46) r+=`<rect x="${P(x)}" y="${P(y)}" width="${S(1)}" height="${S(1)}"/>`;
    }
    const finder=(ox,oy)=>`<rect x="${P(ox)}" y="${P(oy)}" width="${S(7)}" height="${S(7)}"/>`+
      `<rect x="${P(ox+1)}" y="${P(oy+1)}" width="${S(5)}" height="${S(5)}" fill="#fff"/>`+
      `<rect x="${P(ox+2)}" y="${P(oy+2)}" width="${S(3)}" height="${S(3)}"/>`;
    svg.innerHTML=`<g fill="#0B1B30">${r}${finder(0,0)}${finder(N-7,0)}${finder(0,N-7)}</g>`;
  })();
  const slideFromHash=()=>{const n=parseInt((location.hash||'').slice(1),10);return (n>=1&&n<=slides.length)?n-1:0;};
  window.addEventListener('hashchange',()=>{const n=slideFromHash();if(n!==i)show(n);});
  show(slideFromHash());
