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
document.getElementById('roles').addEventListener('click',function(e){var b=e.target.closest('.rh');if(!b)return;var r=b.parentNode,o=!r.classList.contains('is-open');
/* only one row open at a time: close any other open row first */
Array.prototype.forEach.call(this.querySelectorAll('.role.is-open'),function(x){if(x!==r){x.classList.remove('is-open');x.querySelector('.rh').setAttribute('aria-expanded',false)}});
r.classList.toggle('is-open',o);b.setAttribute('aria-expanded',o)});

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
