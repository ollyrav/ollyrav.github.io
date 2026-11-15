/* base.js : behaviour shared by every page (theme switch, copy email, footer reveal) */
(function(){
var root=document.documentElement;
function dark(){return root.getAttribute('data-theme')==='dark'}

/* light/dark switch (light is the default; the choice is remembered across pages) */
var sw=document.getElementById('sw');
if(sw){
sw.setAttribute('aria-checked',dark());
sw.addEventListener('click',function(){var d=!dark();root.setAttribute('data-theme',d?'dark':'light');sw.setAttribute('aria-checked',d);try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}});
}

/* copy-email button */
var copy=document.getElementById('copy');
if(copy){copy.addEventListener('click',function(){try{navigator.clipboard.writeText('olly.rav@gmail.com')}catch(e){}})}

/* footer: gradient revealed around the cursor */
var endEl=document.querySelector('.end');
if(endEl&&matchMedia('(hover:hover)').matches){
function endPos(e){var r=endEl.getBoundingClientRect();endEl.style.setProperty('--mx',(e.clientX-r.left)+'px');endEl.style.setProperty('--my',(e.clientY-r.top)+'px')}
endEl.addEventListener('pointerenter',function(e){endPos(e);endEl.classList.add('lit')});
endEl.addEventListener('pointermove',endPos);
endEl.addEventListener('pointerleave',function(){endEl.classList.remove('lit')});
}
})();
