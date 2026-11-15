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
document.getElementById('roles').addEventListener('click',function(e){var b=e.target.closest('.rh');if(!b)return;var r=b.parentNode,o=!r.classList.contains('is-open');r.classList.toggle('is-open',o);b.setAttribute('aria-expanded',o)});

/* testimonials */
var qs=live(QUOTES),rail=document.getElementById('rail'),dots=document.getElementById('dots');
rail.innerHTML=qs.map(function(q){
return '<figure class="quote"><q>'+q.text+'</q><figcaption class="who">'+q.name+'<span>'+q.role+'</span></figcaption></figure>'}).join('');
dots.innerHTML=qs.map(function(q,i){return '<button aria-label="Testimonial '+(i+1)+'" data-i="'+i+'"></button>'}).join('');
function step(){return rail.children[0].offsetWidth+8}
function upd(){var n=Math.min(qs.length-1,Math.round(rail.scrollLeft/step()));[].forEach.call(dots.children,function(b,i){b.setAttribute('aria-current',i===n)})}
rail.addEventListener('scroll',upd);upd();
dots.addEventListener('click',function(e){var i=e.target.getAttribute&&e.target.getAttribute('data-i');if(i!==null&&i!==undefined)rail.scrollTo({left:i*step(),behavior:'smooth'})});

/* hover zoom + cursor parallax on thumbnails and the about photo */
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
document.querySelectorAll('.card,.pw').forEach(function(c){var s=c.querySelector('.slot')||c;
function cl(v){return Math.max(-.5,Math.min(.5,v)).toFixed(3)}
c.addEventListener('mousemove',function(e){var r=s.getBoundingClientRect();c.style.setProperty('--px',cl((e.clientX-r.left)/r.width-.5));c.style.setProperty('--py',cl((e.clientY-r.top)/r.height-.5))});
c.addEventListener('mouseleave',function(){c.style.setProperty('--px',0);c.style.setProperty('--py',0)})})}
})();
