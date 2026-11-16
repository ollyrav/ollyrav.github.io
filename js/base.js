/* base.js : behaviour shared by every page (theme switch, copy email, footer reveal) */
(function(){
var root=document.documentElement;
function dark(){return root.getAttribute('data-theme')==='dark'}

/* light/dark switch (light is the default; the choice is remembered across pages) */
var sw=document.getElementById('sw');
if(sw){
sw.setAttribute('aria-checked',dark());
sw.addEventListener('click',function(){var d=!dark();sw.classList.add('moving');clearTimeout(sw._m);sw._m=setTimeout(function(){sw.classList.remove('moving')},550);
function apply(){root.setAttribute('data-theme',d?'dark':'light');sw.setAttribute('aria-checked',d)}
try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}
/* where the browser can, the whole page cross-fades between light and dark instead of snapping */
if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches)document.startViewTransition(apply);else apply()});
}

/* copy-email button */
var copy=document.getElementById('copy');
if(copy){copy.addEventListener('click',function(){try{navigator.clipboard.writeText('olly.rav@gmail.com')}catch(e){}})}

/* hover reveal: a solid, hard-edged circle follows the cursor and reveals a slowly moving, lava-lamp style gradient underneath.
   It's used in two places: over the footer, and over the big "Olly Ravilious" heading on the home page (where the gradient shows inside the letters).
   It behaves like a blob of jelly on a spring: it lags a touch, overshoots and settles when you speed up or slow down,
   and squashes and stretches a little along the direction you're moving.
   As it moves, a faint, soft glow is left behind it and fades away.
   Tweak the feel with the numbers below (they apply to both places). */
if(matchMedia('(hover:hover)').matches){
var R=118,       /* radius of the circle in px while the cursor is moving */
    REST=40,     /* radius when the cursor is still: the circle eases down to this size when you stop (set it equal to R to keep one size) */
    STILL=700,   /* ms the circle stays big after you stop moving before it starts to shrink (the lag) */
    SHRINKK=60,  /* how fast it shrinks back down (higher = faster) */
    SHRINKB=6,   /* the bounce as it settles at the small size (lower = more bounce, around 25 = none) */
    OPACITY=.8,  /* how strong the gradient picture is, from 0 to 1 (lower = softer, less contrast) */
    LSPEED=1,    /* how fast the gradient drifts and swirls (1 = very slow, higher = faster, 0 = frozen) */
    BLEND=14,    /* how much the blobs melt into each other (1 = not at all, higher = softer and more blended) */
    GRAIN=.11,   /* strength of the grainy texture, from 0 (none) to 1 (strong) */
    GRAINSIZE=.5, /* how coarse the grain is, in px (bigger = chunkier) */
    STIFF=1200,  /* how tightly the circle is pulled to the cursor (higher = sticks closer, lower = floatier) */
    DAMP=50,     /* how quickly the bounce settles (lower = bouncier, around 69 = no bounce at all) */
    STRETCH=.00005,/* how much it stretches along the direction of travel as you speed up (0 = stays a perfect circle) */
    MAXS=.1,     /* the most it can stretch (.1 = up to 1.1x longer; keep it low to avoid an egg shape) */
    WOBBLE=22,   /* how quickly the squash and stretch settles (lower = wobblier, jellier) */
    GLOW=.3,     /* how bright the glow behind the circle is, from 0 (none) to 1 (as bright as the circle itself) - keep it low to stay subtle */
    GSIZE=.9,    /* how wide the glow is compared with the circle */
    TMIN=180,    /* ms the glow takes to fade behind a slow cursor */
    TMAX=450,    /* ms the glow takes to fade behind a fast cursor (longer = a longer glow tail) */
    POPK=100,    /* how fast the circle grows to full size when you enter (lower = slower and more gradual) */
    POP=13,      /* the bounce as it reaches full size (lower = a bigger bounce, around 20 = no bounce) */
    OUTK=70;     /* how fast the circle shrinks away when you leave (lower = slower; 100 = the same speed as it grows in) */
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;   /* reduced motion: no springs and no glow, the circle simply follows */
/* the moving gradient: soft, slowly drifting blobs of the brand colours, like a lava lamp. It's painted small and stretched up, which keeps it smooth and cheap */
var LAVA=[
 /* a few big, quiet washes underneath (colour, x, y, size, stretch, tilt, strength, blend, drift x/y, speed x/y, offset) */
 {c:'13,42,70',   x:.05,y:.3, r:1.2,e:1.3,rot:0, a:.6, m:'source-over',ax:.12,ay:.3, sx:.07,sy:.09,p:.4},
 {c:'43,9,86',   x:.9, y:.1, r:1.3,e:1.4,rot:0, a:.7, m:'source-over',ax:.12,ay:.35,sx:.09,sy:.12,p:0},
 {c:'43,9,86',   x:.45,y:.15,r:1.0,e:1.6,rot:.2,a:.6, m:'source-over',ax:.18,ay:.3, sx:.11,sy:.08,p:1.3},
 {c:'238,67,146',x:.4, y:.7, r:1.0,e:1.4,rot:-.4,a:.6,m:'source-over',ax:.2, ay:.35,sx:.12,sy:.14,p:1.7},
 {c:'255,126,88',x:.85,y:.95,r:1.1,e:1.5,rot:.2,a:.35,m:'source-over',ax:.14,ay:.28,sx:.09,sy:.12,p:3.1}
];
/* ...then lots of blobs of the brand colours scattered across the top. These are what give the grain of colour inside the circle.
   They come in lots of sizes and shapes (ovals, crescents, S-waves, spirals and hooked swooshes) and are placed with a fixed "random" sequence, so it looks the same every visit. Change BLOBS for more or fewer. */
/* colour priority follows the brand palette: primary navy is the most common, then secondary pink, then the tertiary purple and orange, with the mono greys rarest */
(function(){var seed=7,BLOBS=80,i,k,q,s,tot=0,pal=[
 /* colour,         share, blend,         min/max strength, size */
 ['238,67,146',.38,'source-over',.8,.95,1],     /* pink */
 ['255,126,88',.12,'source-over',.8,.95,1],     /* orange */
 ['43,9,86',   .28,'source-over',.8,.95,1.1],   /* deep purple */
 ['13,42,70',   .18,'source-over',.8,.95,1.1],   /* primary navy */
 ['221,221,221',.04,'source-over',.3,.5,1]      /* light grey (rare and soft, so the white text on top still reads clearly) */
];
function rnd(){seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
for(k=0;k<pal.length;k++)tot+=pal[k][1];
for(i=0;i<BLOBS;i++){q=rnd()*tot;for(k=0;k<pal.length-1&&q>pal[k][1];k++)q-=pal[k][1];
/* shape: 0 = oval, 1 = crescent / curved horn, 2 = S-shaped wave, 3 = spiral, 4 = hooked swoosh */
s=rnd();s=s<.3?0:s<.5?1:s<.7?2:s<.85?3:4;
LAVA.push({k:1,s:s,cv:rnd(),w:rnd(),c:pal[k][0],x:rnd(),y:rnd(),r:(2+Math.pow(rnd(),1.8)*4)*pal[k][5],e:.7+rnd()*1.1,rot:rnd()*Math.PI*2,a:pal[k][3]+rnd()*(pal[k][4]-pal[k][3]),m:pal[k][2],ax:.05+rnd()*.12,ay:.15+rnd()*.2,sx:.06+rnd()*.12,sy:.06+rnd()*.12,p:rnd()*6.28})}})();
/* the centre line of each curvy shape, from t = 0 (one end) to t = 1 (the other), L = its length */
function curve(s,t,L,cv){var a,sw;
if(s===1){sw=1.6+cv*1.6;a=(t-.5)*sw;return[L/sw*Math.sin(a),L/sw*(1-Math.cos(a))]}   /* crescent */
if(s===2)return[(t-.5)*L,Math.sin(t*Math.PI*2*(.8+cv))*L*.2];   /* S-wave */
if(s===3){a=t*(3+cv*3);return[L*.28*(.25+t)*Math.cos(a),L*.28*(.25+t)*Math.sin(a)]}   /* spiral */
return[(t-.5)*L,-t*t*L*.4+L*.12]}   /* hooked swoosh */
function rgb(s){var m=String(s).match(/[\d.]+/g);return m&&m.length>2?[+m[0],+m[1],+m[2],m.length>3?+m[3]:1]:[0,0,0,0]}

/* sets up one reveal. host = the footer, or (hdr = true) the big heading */
function reveal(host,hdr){
var cv=document.createElement('canvas'),mk=document.createElement('canvas'),gl=document.createElement('canvas'),iv=document.createElement('canvas');
var cx=cv.getContext&&cv.getContext('2d'),mx=mk.getContext&&mk.getContext('2d'),gx=gl.getContext&&gl.getContext('2d'),ix=iv.getContext&&iv.getContext('2d');
if(!(cx&&mx&&gx&&ix))return;
var el=host,h1=null,inkS='#000';
if(hdr){
/* the heading gets a wrapper with the picture canvas behind it. The heading's own box is painted in the page colour with the letters cut out of it, so the picture only shows through the letters */
h1=host;el=document.createElement('div');h1.parentNode.insertBefore(el,h1);el.appendChild(h1);
el.style.cssText='position:relative;isolation:isolate;display:block;width:fit-content;max-width:100%';
cv.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block';
h1.style.position='relative';h1.style.zIndex='1';
el.insertBefore(cv,h1)}
else{cv.className='glow';el.insertBefore(cv,el.firstChild)}
var zone=(hdr&&h1.closest&&h1.closest('.hero'))||el;   /* the area that reacts to the cursor: for the heading that's the whole header block, down to the line under it (the picture still only shows inside the letters) */
cv.setAttribute('aria-hidden','true');
var lv=document.createElement('canvas'),lx=lv.getContext('2d'),lb=document.createElement('canvas'),lbx=lb.getContext('2d'),lf=document.createElement('canvas'),fx=lf.getContext('2d'),grainPat=null,gx0=0,gy0=0,ready=true,raf=0,W=0,H=0,D=1;
var fa=1,mv=0,mvv=0,stillT=1e4,pts=[],ax=0,ay=0,SP=Math.max(2,R*.06),inside=false,tx=0,ty=0,px=0,py=0,vx=0,vy=0,ss=0,sv=0,w=0,wv=0,ang=0,tPrev=0;
function size(){var cw=el.clientWidth,ch=el.clientHeight,dp=Math.min(2,window.devicePixelRatio||1);   /* draw at the screen's full sharpness (retina) so the edge stays crisp */
if(cw!==W||ch!==H||dp!==D){W=cw;H=ch;D=dp;var cs=[cv,mk,gl,lf],xs=[cx,mx,gx,fx];if(hdr){cs.push(iv);xs.push(ix)}
cs.forEach(function(c){c.width=Math.round(cw*dp);c.height=Math.round(ch*dp)});
xs.forEach(function(c){c.setTransform(dp,0,0,dp,0,0)});lv.width=200;lv.height=Math.max(40,Math.round(200*ch/Math.max(cw,1)));lb.width=Math.max(14,Math.round(lv.width/BLEND));lb.height=Math.max(6,Math.round(lv.height/BLEND))}}
function local(ev){var r=el.getBoundingClientRect();tx=ev.clientX-r.left;ty=ev.clientY-r.top}
function kick(){if(!raf){tPrev=performance.now();raf=requestAnimationFrame(frame)}}
/* heading only: the plain letter colour, painted across the whole canvas when nothing is revealed */
function idle(){cx.clearRect(0,0,W,H);cx.fillStyle=inkS;cx.fillRect(0,0,W,H)}
/* heading only: pick up the page's current colours (so light and dark mode both work) */
function theme(){var b=getComputedStyle(document.body),bg=rgb(b.backgroundColor),k=rgb(b.color);
if(bg[3]<.05)bg=rgb(getComputedStyle(document.documentElement).backgroundColor);if(bg[3]<.05)bg=[255,255,255,1];
var light=(bg[0]*.3+bg[1]*.59+bg[2]*.11)>128;
inkS='rgb('+Math.round(k[0])+','+Math.round(k[1])+','+Math.round(k[2])+')';
h1.style.background='rgb('+Math.round(bg[0])+','+Math.round(bg[1])+','+Math.round(bg[2])+')';
h1.style.boxShadow='0 0 0 3px '+h1.style.background;   /* a thin skirt of page colour round the heading, so no sliver of the picture behind can peek out at its edges (this was the flickering line on load) */
h1.style.color=light?'#000':'#fff';h1.style.mixBlendMode=light?'lighten':'darken';
if(!raf&&W)idle()}
function blob(x,y,r,v){if(r<1||v<=.004)return;
var c=Math.round(255*v),g=mx.createRadialGradient(x,y,0,x,y,r);
g.addColorStop(0,'rgb('+c+','+c+','+c+')');g.addColorStop(1,'#000');
mx.fillStyle=g;mx.fillRect(x-r,y-r,2*r,2*r)}
function spot(px,py,rr,a,c){var g=lx.createRadialGradient(px,py,0,px,py,rr);
g.addColorStop(0,'rgba('+c+','+a+')');g.addColorStop(.4,'rgba('+c+','+(a*.75)+')');g.addColorStop(.7,'rgba('+c+','+(a*.3)+')');g.addColorStop(1,'rgba('+c+',0)');
lx.fillStyle=g;lx.fillRect(px-rr,py-rr,2*rr,2*rr)}
function paintLava(t){var LW=lv.width,LH=lv.height,U=Math.max(LH*1.6,LW*.35),C=R*LW/Math.max(W,1),i,j,n,u,b,x,y,r,L,th,pt,tp,unit,br;t*=LSPEED;
var bg=lx.createLinearGradient(0,0,LW,LH*.4);bg.addColorStop(0,'#0D2A46');bg.addColorStop(1,'#2B0956');
lx.globalCompositeOperation='source-over';lx.fillStyle=bg;lx.fillRect(0,0,LW,LH);
for(i=0;i<LAVA.length;i++){b=LAVA[i];
/* each blob wanders by mixing three different rhythms, so the path never repeats or looks mechanical */
x=(b.x+b.ax*(Math.sin(t*b.sx+b.p)+.6*Math.sin(t*b.sx*2.37+b.p*2.1)+.35*Math.sin(t*b.sx*4.13+b.p*.7))/1.5)*LW;
y=(b.y+b.ay*(Math.sin(t*b.sy+b.p*1.3)+.6*Math.sin(t*b.sy*2.71+b.p*1.7)+.35*Math.sin(t*b.sy*3.9+b.p*.4))/1.5)*LH;
unit=b.k?C:U*1.5;br=1+.14*Math.sin(t*b.sx*1.7+b.p)+.08*Math.sin(t*b.sy*3.1+b.p*2);
lx.globalCompositeOperation=b.m;lx.save();lx.translate(x,y);lx.rotate(b.rot+.25*Math.sin(t*b.sy*1.3+b.p));
if(!b.s){r=b.r*unit*br;lx.scale(b.e,1);spot(0,0,r,b.a,b.c)}
else{L=b.r*unit*br*2.4;th=unit*(1.2+b.w*.9)*br;n=18;   /* a curvy shape is a chain of soft spots along its centre line, thinning to a point at both ends */
for(j=0;j<=n;j++){u=j/n;pt=curve(b.s,u,L,b.cv);tp=Math.pow(Math.sin(Math.PI*(.06+.88*u)),.6);spot(pt[0],pt[1],th*tp,b.a*.6,b.c)}}
lx.restore()}
lx.globalCompositeOperation='source-over'}
/* finishing touches: a gentle blur so neighbouring blobs melt together, then a grainy film-like texture on top */
function composeLava(now){lbx.imageSmoothingQuality='high';lbx.clearRect(0,0,lb.width,lb.height);lbx.drawImage(lv,0,0,lb.width,lb.height);   /* squash it small... */
fx.globalCompositeOperation='source-over';fx.globalAlpha=1;fx.imageSmoothingQuality='high';fx.drawImage(lb,0,0,W,H);   /* ...and stretch it back up, which softens everything */
if(GRAIN>0){if(!grainPat){var nt=document.createElement('canvas'),nx,id,d,i;nt.width=nt.height=128;nx=nt.getContext('2d');id=nx.createImageData(128,128);d=id.data;
for(i=0;i<d.length;i+=4){d[i]=d[i+1]=d[i+2]=Math.random()*255;d[i+3]=255}nx.putImageData(id,0,0);grainPat=fx.createPattern(nt,'repeat')}
fx.save();fx.globalCompositeOperation='overlay';fx.globalAlpha=GRAIN;fx.translate(-gx0*GRAINSIZE,-gy0*GRAINSIZE);fx.scale(GRAINSIZE,GRAINSIZE);fx.fillStyle=grainPat;fx.fillRect(gx0,gy0,W/GRAINSIZE,H/GRAINSIZE);fx.restore()}}
function cover(c,al){c.globalAlpha=al;c.drawImage(lf,0,0,W,H);c.globalAlpha=1}
function frame(){var now=performance.now(),dt=Math.min(.05,(now-tPrev)/1000),tg=inside?1:0;tPrev=now;
if(RM){px=tx;py=ty;vx=vy=0;ss=tg;sv=0;w=0;wv=0}
else{var n=Math.max(1,Math.ceil(dt/.008)),h=dt/n;
for(var i=0;i<n;i++){
/* the circle is pulled towards the cursor by a spring, so it overshoots and settles */
vx+=(STIFF*(tx-px)-DAMP*vx)*h;vy+=(STIFF*(ty-py)-DAMP*vy)*h;px+=vx*h;py+=vy*h;
/* its size pops in and out on a spring */
sv+=(tg?POPK*(tg-ss)-POP*sv:OUTK*(tg-ss)-2*Math.sqrt(OUTK)*sv)*h;   /* growing in is bouncy; shrinking out is a touch slower and smooth */ss+=sv*h;if(ss<0){ss=0;sv=0}
/* the squash and stretch is a second, wobblier spring that chases the current speed */
var sp=Math.hypot(vx,vy),tw=Math.min(MAXS,sp*STRETCH);
wv+=(260*(tw-w)-WOBBLE*wv)*h;w+=wv*h}
w=Math.max(-.05,Math.min(MAXS+.03,w));
if(Math.hypot(vx,vy)>25)ang=Math.atan2(vy,vx)}
var active=inside||ss>.004||Math.abs(sv)>.01||pts.length>0;
/* leave a faint glow behind the circle as it moves: a line of soft spots, each fading away */
var spd=Math.hypot(vx,vy),sf=Math.min(1,spd/1000),keep=[];
/* the circle swells while you move and eases back down to its resting size when the cursor is still */
if(spd>40)stillT=0;else stillT+=dt*1000;var tm=(RM||stillT<STILL)?1:0;   /* big while moving (and for a moment after), small once the cursor has been still for a bit */
mvv+=((tm?200:SHRINKK)*(tm-mv)-(tm?20:SHRINKB)*mvv)*dt;mv+=mvv*dt;if(mv<-.12){mv=-.12;mvv=0}   /* a spring, so it shrinks quickly and bounces slightly */
var RC=REST+(R-REST)*mv;
if(GLOW>0&&!RM&&ss>.2&&spd>60){var dx=px-ax,dy=py-ay,dd=Math.hypot(dx,dy),nn=Math.floor(dd/SP);
for(var j=1;j<=nn;j++)pts.push({x:ax+dx*j*SP/dd,y:ay+dy*j*SP/dd,r:RC*ss*GSIZE*(1+.4*sf),v:GLOW*Math.min(1,spd/700),t:now,l:TMIN+(TMAX-TMIN)*sf});
if(nn){ax+=dx*nn*SP/dd;ay+=dy*nn*SP/dd}if(pts.length>200)pts.splice(0,pts.length-200)}else{ax=px;ay=py}
pts.forEach(function(p){var a=(now-p.t)/p.l;if(a>=1)return;p.cr=p.r*(1+.3*a);p.cv=p.v*Math.pow(1-a,2);keep.push(p)});pts=keep;
if(hdr)idle();else cx.clearRect(0,0,W,H);
if(ready&&(ss>.003||keep.length)){
paintLava(RM?0:now/1000);composeLava(now);
if(keep.length){
/* 1. a grey-scale map of the glow (white = bright), the strongest spot wins where they overlap */
mx.globalCompositeOperation='source-over';mx.fillStyle='#000';mx.fillRect(0,0,W,H);mx.globalCompositeOperation='lighten';
keep.forEach(function(p){blob(p.x,p.y,p.cr,p.cv)});
/* 2. the gradient picture shown through that map, laid under the circle */
gx.globalCompositeOperation='source-over';gx.clearRect(0,0,W,H);cover(gx,1);gx.globalCompositeOperation='multiply';gx.drawImage(mk,0,0,W,H);
if(hdr){
/* in the heading there's no dark footer behind the glow, so blend between the letter colour and the picture instead: letter colour where there's no glow, picture where there is */
ix.globalCompositeOperation='source-over';ix.fillStyle='#fff';ix.fillRect(0,0,W,H);ix.globalCompositeOperation='difference';ix.drawImage(mk,0,0,W,H);
ix.globalCompositeOperation='multiply';ix.fillStyle=inkS;ix.fillRect(0,0,W,H);ix.globalCompositeOperation='source-over';
gx.globalCompositeOperation='lighter';gx.drawImage(iv,0,0,W,H);gx.globalCompositeOperation='source-over';
cx.drawImage(gl,0,0,W,H)}
else{cx.globalAlpha=OPACITY*fa;cx.drawImage(gl,0,0,W,H);cx.globalAlpha=1}}
/* the solid, hard-edged circle on top */
if(ss>.003){var st=1+w,rx=Math.max(.1,RC*ss*st),ry=Math.max(.1,RC*ss/Math.sqrt(st));
cx.save();cx.beginPath();cx.ellipse(px,py,rx,ry,ang,0,Math.PI*2);cx.clip();
if(hdr){cx.fillStyle=inkS;cx.fillRect(0,0,W,H)}else cx.clearRect(0,0,W,H);   /* clear (or reset) whatever is underneath first, so the circle looks identical whether the glow is behind it or not */
cover(cx,OPACITY*fa);cx.restore()}}
if(!active){ss=0;sv=0}
raf=active?requestAnimationFrame(frame):0}
zone.addEventListener('pointerenter',function(ev){size();local(ev);px=ax=tx;py=ay=ty;vx=vy=0;w=wv=0;mv=0;mvv=0;stillT=1e4;pts=[];inside=true;kick()});
zone.addEventListener('pointermove',function(ev){local(ev);inside=true;kick()});
zone.addEventListener('pointerleave',function(ev){inside=false;local(ev);
/* on exit, the circle's centre slides out past the edge the cursor left by, so as it shrinks it falls out of view instead of shrinking in full sight */
var dd=[tx,W-tx,ty,H-ty],e=0,i,P=(REST+(R-REST)*Math.max(0,mv))*.7;for(i=1;i<4;i++)if(dd[i]<dd[e])e=i;
if(e===0)tx-=P;else if(e===1)tx+=P;else if(e===2)ty-=P;else ty+=P;
kick()});
if(hdr){
/* paint the plain letters straight away, then keep them right if the window is resized, the font finishes loading, or the light/dark switch is flipped */
size();theme();
if(window.ResizeObserver)new ResizeObserver(function(){size();if(!raf)idle()}).observe(el);
new MutationObserver(function(){theme();setTimeout(theme,450)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
var mq=matchMedia('(prefers-color-scheme:dark)');if(mq.addEventListener)mq.addEventListener('change',theme);else if(mq.addListener)mq.addListener(theme)}
}
var endEl=document.querySelector('.end');if(endEl)reveal(endEl,false);
var nameEl=document.querySelector('body.home .hero h1');if(nameEl)reveal(nameEl,true);
}
})();
