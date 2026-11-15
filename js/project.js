/* project.js : builds a project page from content.js.
   The page says which project it is with <body data-project="slug"> */
(function(){
var B=document.body.getAttribute('data-base')||'';
var slug=document.body.getAttribute('data-project');
function live(a){return a.filter(function(x){return x.visible}).sort(function(a,b){return a.order-b.order})}
var list=live(PROJECTS),P=null;
PROJECTS.forEach(function(p){if(p.slug===slug)P=p});
var main=document.getElementById('blocks');
if(!P){document.getElementById('title').textContent='Project not found';
main.innerHTML='<section class="notfound"><div class="w"><a class="back" href="'+B+'index.html#work"><i>←</i><span>Back to work</span></a></div></section>';return}

document.title=P.title+' – Olly Ravilious';
document.getElementById('tag').textContent=P.tag;
document.getElementById('title').textContent=P.title;
document.getElementById('meta').innerHTML=P.meta.map(function(m){return '<div><dt>'+m[0]+'</dt><dd>'+m[1]+'</dd></div>'}).join('')+
'<div class="acts">'+(P.pdf?'<a class="btn" href="'+B+P.pdf+'" download><span>Download PDF</span><i>↓</i></a>':'')+(P.behance?'<a class="btn" href="'+P.behance+'" target="_blank" rel="noopener"><span>View on Behance</span><i>↗</i></a>':'')+'</div>';

function slot(label,src,alt,cls){return '<div class="slot'+(cls?' '+cls:'')+'">'+(src?'<img src="'+B+src+'" alt="'+(alt||label)+'">':label)+'</div>'}
function imgs(b){var n=b.n||1,o='';for(var i=0;i<n;i++){var s=b.srcs?b.srcs[i]:(n===1?b.src:'');o+=slot(b.slot+(n>1?' '+(i+1):''),s,b.slot,n===3?'sq':'')}return o}

main.innerHTML=P.blocks.map(function(b){
var h='';
if(b.type==='image'){h='<div class="w"><div class="imgs'+(b.n===2?' n2':'')+(b.n===3?' n3':'')+'">'+imgs(b)+'</div>'+(b.caption?'<p class="cap">'+b.caption+'</p>':'')+'</div>'}
if(b.type==='split'){h='<div class="w two"><h2>'+b.label+'</h2><div class="body"><p class="lead'+(b.lead.length>140?' sm':'')+'">'+b.lead+'</p>'+(b.text||[]).map(function(t){return '<p>'+t+'</p>'}).join('')+(b.slot&&!b.imgs?slot(b.slot,b.src,b.slot):'')+'</div></div>'+(b.imgs?'<div class="w" style="margin-top:36px"><div class="imgs n3">'+imgs({n:3,slot:b.slot,srcs:b.srcs})+'</div></div>':'')}
if(b.type==='cards'){h='<div class="w"><h2>'+b.label+'</h2><div class="cards">'+b.items.map(function(i){return '<div class="card">'+slot(i.t,i.src,i.t)+'<h3>'+i.t+'</h3><p>'+i.d+'</p></div>'}).join('')+'</div></div>'}
if(b.type==='trio'){h='<div class="w"><h2>'+b.label+'</h2><div class="trio">'+b.items.map(function(i){return '<div'+(i.todo?' class="todo"':'')+'><h3>'+i.h+'</h3><p>'+i.t+'</p></div>'}).join('')+'</div></div>'}
if(b.type==='gallery'){h='<div class="w two"><h2>'+b.label+'</h2><div class="body"><p class="lead sm">'+b.lead+'</p></div></div><div class="w"><div class="gal'+(b.cols===2?' c2':'')+'">'+b.items.map(function(i){return '<figure>'+slot(i.slot,i.src,i.slot)+'<figcaption>'+i.cap+'</figcaption></figure>'}).join('')+'</div></div>'}
if(b.type==='close'){h='<div class="w"><p class="close">'+b.text+'</p></div>'}
return '<section class="sec">'+h+'</section>'}).join('');

/* next project (wraps round to the first) */
var idx=list.indexOf(P),next=list.length>1?list[(idx+1)%list.length]:null;
var nx=document.getElementById('next');
if(next){nx.innerHTML='<div class="w"><h2>next project.</h2><a class="next" href="'+B+'projects/'+next.slug+'.html">'+slot('Cover image',next.thumb,next.title)+'<div class="row">'+next.title+'<span>'+(next.cardTag||next.tag)+'</span></div></a></div>'}else{nx.style.display='none'}
})();
