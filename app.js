const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');
// Photography stays usable without JavaScript; rotation respects motion preferences.
const hero=document.querySelector('.hero-media[aria-roledescription="carrusel"]');
if(hero){
  const slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('[data-go]')],pause=hero.querySelector('.hero-pause'),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,stopped=motion.matches,hovered=false,focused=false,inView=true,timer;
  function show(next){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.hidden=i!==index});dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)))}
  function schedule(){clearInterval(timer);hero.classList.toggle('is-paused',stopped||hovered||focused||document.hidden||!inView);if(!stopped&&!hovered&&!focused&&!document.hidden&&inView)timer=setInterval(()=>show(index+1),5500)}
  function label(){pause.innerHTML=stopped?'Reanudar fotos <span aria-hidden="true">▶</span>':'Pausar fotos <span aria-hidden="true">Ⅱ</span>';pause.setAttribute('aria-pressed',String(stopped));schedule()}
  pause.addEventListener('click',()=>{stopped=!stopped;label()});
  dots.forEach(d=>d.addEventListener('click',()=>{show(Number(d.dataset.go));schedule()}));
  hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;schedule()}});hero.addEventListener('pointerleave',()=>{hovered=false;schedule()});
  hero.addEventListener('focusin',()=>{focused=true;schedule()});hero.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget)){focused=false;schedule()}});
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',e=>{stopped=e.matches;label()});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(hero);
  label();
}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){menu.click();menu.focus()}});
const players=new Map();let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;const toggle=document.getElementById('toggle-videos');
function syncToggle(){if(toggle){toggle.textContent=paused?'Reanudar videos':'Pausar videos';toggle.setAttribute('aria-pressed',String(paused))}}syncToggle();
function setPlayerState(){for(const[id,p]of players){const host=document.getElementById(id);const hidden=host?.closest('.video-card')?.hidden;try{p.mute();if(paused||hidden||document.hidden)p.pause();else p.play()}catch{}}}
toggle?.addEventListener('click',()=>{paused=!paused;syncToggle();setPlayerState()});document.addEventListener('visibilitychange',setPlayerState);
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.video-card').forEach(c=>c.hidden=b.dataset.filter!=='Todas'&&c.dataset.category!==b.dataset.filter);setPlayerState()}));
if(document.querySelector('.fb-video')){window.fbAsyncInit=()=>{FB.init({xfbml:false,version:'v23.0'});FB.Event.subscribe('xfbml.ready',event=>{if(event.type==='video'){players.set(event.id,event.instance);event.instance.mute();event.instance.subscribe('finishedPlaying',()=>{if(!paused){event.instance.seek(0);event.instance.play()}});setPlayerState()}});FB.XFBML.parse()};const script=document.createElement('script');script.async=true;script.defer=true;script.src='https://connect.facebook.net/es_LA/sdk.js';script.onerror=()=>{document.getElementById('video-status').textContent='Facebook no pudo cargar los reproductores. Podés abrir cada video con su enlace.';document.querySelectorAll('.embed').forEach(e=>e.hidden=true);toggle.hidden=true};document.body.append(script)}
const level=document.getElementById('level');if(level){const q=new URLSearchParams(location.search).get('nivel');if([...level.options].some(o=>o.value===q))level.value=q}
document.getElementById('contact-form')?.addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const text='Hola, soy '+f.elements.name.value.trim()+'. Me interesa '+f.elements.level.value+'. '+f.elements.message.value.trim();const url='https://wa.me/50627772211?text='+encodeURIComponent(text);const status=document.getElementById('form-status');status.replaceChildren(document.createTextNode('Tu consulta está preparada. '));const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent='Continuar en WhatsApp ↗';a.className='textlink';status.append(a)});
