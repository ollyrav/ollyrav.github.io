/* home.js : builds the home page from content.js */
(function(){
var B=document.body.getAttribute('data-base')||'';
function live(a){return a.filter(function(x){return x.visible}).sort(function(a,b){return a.order-b.order})}

/* project thumbnails */
document.getElementById('projects').innerHTML=live(PROJECTS).map(function(p){
return '<a class="card" href="'+B+'projects/'+p.slug+'.html"><div class="slot">'+(p.thumb?'<img src="'+B+p.thumb+'" alt="'+p.title+'">':'Cover image')+'</div><div class="cap">'+p.title+'<span>'+(p.cardTag||p.tag)+'</span></div></a>'}).join('');

/* roles accordion */
document.getElementById('roles').innerHTML=live(ROLES).map(function(r,i){
return '<div class="role"><button class="rh" aria-expanded="false" aria-controls="rp'+i+'"><b>'+r.role+'</b><em>'+r.org.split(' | ').join('<span class="sep" aria-hidden="true">/</span>')+'</em><time>'+r.years+'</time></button><div class="rp" id="rp'+i+'" role="region"><div class="rpi"><p>'+r.desc+'</p></div></div></div>'}).join('');
/* about picture: each row can have its own picture (set img in content.js); it fades in while that row is open, and the default shows when all rows are closed */
var RS=live(ROLES),pw=document.querySelector('.pw'),base=pw.querySelector('img.photo'),pl=document.querySelector('.plabel'),L0=pl.textContent;
RS.forEach(function(r,i){if(!r.img)return;var im=document.createElement('img');im.className='photo alt';im.src=B+r.img;im.alt=r.alt||'';im.setAttribute('data-i',i);pw.appendChild(im)});
function showPic(i){[].forEach.call(pw.querySelectorAll('img.alt'),function(im){im.classList.toggle('on',+im.getAttribute('data-i')===i)});pl.textContent=(i>-1&&RS[i].label)||L0}
var R=document.getElementById('roles'),rows=[].slice.call(R.children),n=rows.length,
rhs=rows.map(function(x){return x.querySelector('.rh')}),rps=rows.map(function(x){return x.querySelector('.rp')}),
reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
function bt(i){return i>0?24:0}function bb(i){return i<n-1?24:0}   /* the normal space above / below each row's title */
var cur={p:rows.map(function(){return 0}),t:rows.map(function(_,i){return bt(i)}),b:rows.map(function(_,i){return bb(i)}),s:rows.map(function(){return 1})},openI=-1,raf=0;
/* where everything should end up for a given open row (o = -1 means all closed). The open row grows by E; the other rows give up exactly E of their spacing, so the whole list keeps one fixed height */
function targets(o){var T={p:[],t:[],b:[],s:[]},i,avail=0,E=0,k=1,H=0;
if(o>-1){H=rows[o].querySelector('.rpi').scrollHeight;E=H+(o===n-1?24:0);for(i=0;i<n;i++)if(i!==o)avail+=bt(i)+bb(i);k=Math.max(0,1-E/avail)}
for(i=0;i<n;i++){var on=i===o;T.p.push(on?H:0);T.t.push(on?bt(i):bt(i)*k);T.b.push(on?(i===n-1?24:bb(i)):bb(i)*k);T.s.push(on||o<0?1:.88)}
return T}
function paint(S){for(var i=0;i<n;i++){rps[i].style.height=S.p[i]+'px';rps[i].style.visibility=S.p[i]>.5?'visible':'hidden';rhs[i].style.paddingTop=S.t[i]+'px';rhs[i].style.paddingBottom=S.b[i]+'px';rhs[i].style.setProperty('--s',S.s[i].toFixed(4))}}
/* one single animation moves every row together, so nothing moves out of step */
function go(o,instant){var from={p:cur.p.slice(),t:cur.t.slice(),b:cur.b.slice(),s:cur.s.slice()},to=targets(o),t0=null,dur=480;cancelAnimationFrame(raf);
if(instant||reduce){cur=to;paint(cur);return}
function tick(ts){if(t0===null)t0=ts;var u=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-u,4),k,i,c={p:[],t:[],b:[],s:[]};
for(i=0;i<n;i++){c.p.push(from.p[i]+(to.p[i]-from.p[i])*e);c.t.push(from.t[i]+(to.t[i]-from.t[i])*e);c.b.push(from.b[i]+(to.b[i]-from.b[i])*e);c.s.push(from.s[i]+(to.s[i]-from.s[i])*e)}
cur=c;paint(cur);if(u<1)raf=requestAnimationFrame(tick)}
raf=requestAnimationFrame(tick)}
function setOpen(r){var o=r?rows.indexOf(r):-1;openI=o;rows.forEach(function(x,i){var on=i===o;x.classList.toggle('is-open',on);rhs[i].setAttribute('aria-expanded',on)});showPic(o);go(o)}
window.addEventListener('resize',function(){go(openI,true)});   /* text wraps differently at a new width, so re-fit straight away */
/* click a row to open it; only one row is open at a time, and clicking the open row closes it */
R.addEventListener('click',function(e){var b=e.target.closest('.rh');if(!b)return;var r=b.parentNode;setOpen(r.classList.contains('is-open')?null:r)});

/* keep the about picture and its caption where they are: the left column is held at the height of the list with every row closed, so opening a row no longer pushes the picture down */
var leftCol=document.querySelector('#about .left');
function pinPic(){if(!window.matchMedia('(min-width:761px)').matches){leftCol.style.minHeight='';return}
var h=0,i,cs;for(i=0;i<n;i++){cs=getComputedStyle(rhs[i]);h+=rhs[i].offsetHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)+bt(i)+bb(i)+(i<n-1?1:0)}
leftCol.style.minHeight=h+'px'}
pinPic();window.addEventListener('resize',pinPic);window.addEventListener('load',pinPic);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(pinPic);

/* testimonials */
var qs=live(QUOTES),rail=document.getElementById('rail'),dots=document.getElementById('dots'),N=qs.length,loop=N>1;
/* the cards are laid out three times in a row (the middle set is the "real" one) so there is always a card before and after; the view quietly jumps back to the middle set when you drift out of it, so it loops forever */
function card(q,hide){return '<figure class="quote"'+(hide?' aria-hidden="true"':'')+'><q>'+q.text+'</q><figcaption class="who">'+q.name+'<span>'+q.role+'</span></figcaption></figure>'}
rail.innerHTML=(loop?qs.map(function(q){return card(q,1)}).join(''):'')+qs.map(function(q){return card(q,0)}).join('')+(loop?qs.map(function(q){return card(q,1)}).join(''):'');
dots.innerHTML=qs.map(function(q,i){return '<button aria-label="Testimonial '+(i+1)+'" data-i="'+i+'"></button>'}).join('');
function step(){return rail.children.length>1?rail.children[1].offsetLeft-rail.children[0].offsetLeft:rail.children[0].offsetWidth+12}
function pos(){return Math.round(rail.scrollLeft/step())}
function which(){var n=pos();return loop?((n%N)+N)%N:Math.max(0,Math.min(N-1,n))}
/* the centre card is full strength; cards either side are dimmed (text and all) the further they are from the centre */
function upd(){var s=step(),n=which();[].forEach.call(dots.children,function(b,i){b.setAttribute('aria-current',i===n)});
[].forEach.call(rail.children,function(c,i){c.style.opacity=(1-.2*Math.min(1,Math.abs(rail.scrollLeft/s-i))).toFixed(3)})}
/* jump by exactly one set of cards: the cards look identical either side of the jump, so nobody sees it */
function recentre(){if(!loop)return;var set=N*step();if(rail.scrollLeft<set*.5||rail.scrollLeft>=set*1.5){rail.style.scrollSnapType='none';rail.scrollLeft+=rail.scrollLeft<set*.5?set:-set;requestAnimationFrame(function(){rail.style.scrollSnapType='';upd()})}}
var settle=0;rail.addEventListener('scroll',function(){upd();clearTimeout(settle);settle=setTimeout(recentre,140)});
window.addEventListener('resize',function(){if(loop){rail.style.scrollSnapType='none';rail.scrollLeft=(N+which())*step();requestAnimationFrame(function(){rail.style.scrollSnapType=''})}upd()});
if(loop){rail.style.scrollSnapType='none';rail.scrollLeft=N*step();requestAnimationFrame(function(){rail.style.scrollSnapType='';upd()})}
upd();
dots.addEventListener('click',function(e){var i=e.target.getAttribute&&e.target.getAttribute('data-i');if(i===null||i===undefined)return;i=+i;
var d=i-which();if(loop){if(d>N/2)d-=N;else if(d<-N/2)d+=N}   /* take the shortest way round */
rail.scrollTo({left:(pos()+d)*step(),behavior:'smooth'})});
/* click and drag with a mouse: the cards follow the pointer, then glide to the nearest card when you let go */
var drag=null,snapBack=0;
rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button)return;clearTimeout(snapBack);drag={x:e.clientX,s:rail.scrollLeft,m:0};rail.style.scrollSnapType='none';rail.classList.add('drag')});
window.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x;drag.m=Math.max(drag.m,Math.abs(dx));rail.scrollLeft=drag.s-dx});
function endDrag(){if(!drag)return;var d=drag,s=step(),start=Math.round(d.s/s),moved=(rail.scrollLeft-d.s)/s,to=start;drag=null;rail.classList.remove('drag');
if(Math.abs(moved)>.15)to=start+(moved>0?1:-1)*Math.max(1,Math.round(Math.abs(moved)));
rail.scrollTo({left:to*s,behavior:'smooth'});snapBack=setTimeout(function(){rail.style.scrollSnapType=''},600);
if(d.m>5)rail.addEventListener('click',function k(e){e.stopPropagation();e.preventDefault();rail.removeEventListener('click',k,true)},true)}
window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);
rail.addEventListener('dragstart',function(e){e.preventDefault()});

/* scroll reveal: each section fades up as it scrolls into view (the header block has its own drop-in, see home.css) */
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'});
/* the project thumbnails are revealed one by one (so row by row as you scroll); everything else in the work section just fades up with the heading */
[].forEach.call(document.querySelectorAll('.sec:not(.hero):not(#work)>.w,.end>.w,#work h2,#work .sub,#projects>*'),function(el){el.classList.add('rv');
if(el.parentNode.id==='projects'&&el.offsetLeft>el.parentNode.firstElementChild.offsetLeft+4)el.style.transitionDelay='.12s';   /* the second card in a row follows a beat after the first */
io.observe(el)})}

/* hover zoom + cursor parallax on thumbnails and the about photo */
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
document.querySelectorAll('.card,.pw').forEach(function(c){var s=c.querySelector('.slot')||c;
function cl(v){return Math.max(-.5,Math.min(.5,v)).toFixed(3)}
c.addEventListener('mousemove',function(e){var r=s.getBoundingClientRect();c.style.setProperty('--px',cl((e.clientX-r.left)/r.width-.5));c.style.setProperty('--py',cl((e.clientY-r.top)/r.height-.5))});
c.addEventListener('mouseleave',function(){c.style.setProperty('--px',0);c.style.setProperty('--py',0)})})}
})();
