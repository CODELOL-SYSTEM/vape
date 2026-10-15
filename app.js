/* ================= À REMPLIR (3 choses) =================
   Ces 3 IDs ne sont pas secrets. IMPORTANT : le serveur lit ses propres valeurs
   dans functions/index.js — mets les MÊMES IDs là-bas pour que l'envoi Discord marche. */
const DISCORD_CHANNEL_ID = "1560350205100949575";
const DISCORD_BOT_ID     = "1560338158535581726";
const MON_ID_DISCORD     = "1531052694733586462";
/* ======================================================== */
/* ===== AUCUNE CONFIG ICI : Firebase se configure tout seul via /__/firebase/init.js ===== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const auth=firebase.auth(),db=firebase.firestore(),st=firebase.storage(),fn=n=>firebase.app().functions("europe-west1").httpsCallable(n);
const FLAVS=["Fraise Glacée","Menthe Polaire","Pastèque","Cola","Raisin","Blue Razz"];
const P=[["falcon-x-28000","JNR Falcon X 28000",12.4,"28 000 puffs",265],["joker-24k","JNR Joker 24K",12.9,"24 000 puffs",300],["aerox-32k","JNR AeroX 32K",13.9,"32 000 puffs",180],["falcon-gem-30k","JNR Falcon Gem 30K",14.9,"30 000 puffs",330],["jnr-42k","JNR 42K",21.68,"42 000 puffs",20]].map(([id,name,price,puffs,h])=>({id,name,price,puffs,h}));
const FREE=39,SHIP=4.9,eur=n=>n.toFixed(2).replace(".",",")+" €";
const unit=(p,n)=>p*(n>=10?.85:n>=5?.9:n>=3?.94:1);
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let cart=get("cart",[]),user=null,verified=false,vstatus="";

/* toasts */
function toast(m,t=""){const d=document.createElement("div");d.className="toast "+t;d.textContent=m;$("#toasts").append(d);setTimeout(()=>d.remove(),4000)}
/* overlays */
const open=id=>$(id).classList.add("on"),close=()=>$$(".ov").forEach(o=>o.classList.remove("on"));
document.addEventListener("click",e=>{if(e.target.closest("[data-close]")||e.target.classList.contains("ov"))close()});
/* âge */
if(get("age18",0))$("#age").remove();
$("#ageYes").onclick=()=>{put("age18",1);$("#age").remove()};$("#ageNo").onclick=()=>location.href="https://www.google.fr";
/* cookies */
if(!get("ck",0))$("#cookie").style.display="flex";
$("#ck0").onclick=$("#ck1").onclick=()=>{put("ck",1);$("#cookie").style.display="none"};

/* catalogue */
function grid(){
  const q=$("#q").value.toLowerCase(),s=$("#sort").value;
  let l=P.filter(p=>p.name.toLowerCase().includes(q));
  if(s)l.sort((a,b)=>s=="a"?a.price-b.price:b.price-a.price);
  $("#count").textContent=l.length+" produit"+(l.length>1?"s":"");
  $("#grid").innerHTML=l.map((p,i)=>`<div class="card rv" style="--d:${i*.08}s" data-p="${p.id}"><div class="glare"></div><span class="tag">20 mg</span><div class="ph" style="--h:${p.h}"><div class="mini"></div></div><div class="in"><h3>${p.name}</h3><small>${p.puffs}</small><div class="meta"><span class="price">${eur(p.price)}</span><span class="k">Dès 3 : -6%</span></div></div></div>`).join("");
  reveal();
}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target)}}),{threshold:.1});$$(".rv:not(.vis)").forEach(el=>io.observe(el))}
$("#q").oninput=$("#sort").onchange=grid;
$("#grid").addEventListener("click",e=>{const c=e.target.closest(".card");if(c)showP(c.dataset.p)});
window.showP=id=>{
  const p=P.find(x=>x.id==id);let n=1;
  const draw=()=>{$("#pmb").innerHTML=`<div class="pm"><div><div class="main is3d"><div class="stage3"><div class="dev" style="--h:${p.h}">${"<i></i>".repeat(4)}</div></div></div></div><div class="stack"><span class="pill">Réservé aux majeurs</span><h2>${p.name}</h2><p class="mut">${p.puffs} · 20 mg de nicotine</p><div class="price" style="font-size:30px">${eur(unit(p.price,n))} <small class="mut" style="font-size:13px">/ pièce</small></div>
  <div class="tiers">${[[1,"1"],[3,"3 · -6%"],[5,"5 · -10%"],[10,"10 · -15%"]].map(([k,t])=>`<div class="tier ${n>=k&&(k==10||n<[3,5,10,99][[1,3,5,10].indexOf(k)])?"on":""}" data-n="${k}">${t}</div>`).join("")}</div>
  <label>Goût<select id="fl">${FLAVS.map(f=>`<option>${f}</option>`).join("")}</select></label><label>Quantité<input id="qn" type="number" min="1" max="100" value="${n}"></label><button class="btn w" id="add">Ajouter au panier · ${eur(unit(p.price,n)*n)}</button></div></div>`;
  $("#pmb").onclick=e=>{const t=e.target.closest(".tier");if(t){n=+t.dataset.n;const f=$("#fl").value;draw();$("#fl").value=f}};
  $("#qn").onchange=e=>{n=Math.max(1,Math.min(100,+e.target.value||1));const f=$("#fl").value;draw();$("#fl").value=f};
  $("#add").onclick=()=>{add(p.id,$("#fl").value,n);close()}};
  draw();open("#pm");
};
/* panier */
function add(id,flav,n){const l=cart.find(x=>x.id==id&&x.flav==flav);l?l.n=Math.min(100,l.n+n):cart.push({id,flav,n});save();$("#cn").classList.remove("pop");void $("#cn").offsetWidth;$("#cn").classList.add("pop");toast("Ajouté au panier ✓","ok")}
function save(){put("cart",cart);renderCart()}
function totals(){const q={};cart.forEach(l=>q[l.id]=(q[l.id]||0)+l.n);const sub=cart.reduce((s,l)=>s+unit(P.find(p=>p.id==l.id).price,q[l.id])*l.n,0);const ship=!cart.length||sub>=FREE?0:SHIP;return{sub,ship,tot:sub+ship}}
function renderCart(){
  $("#cn").textContent=cart.reduce((s,l)=>s+l.n,0);const t=totals();
  $("#cl").innerHTML=cart.length?cart.map((l,i)=>{const p=P.find(x=>x.id==l.id);return`<div class="row"><div class="t" style="--h:${p.h}"></div><div><b>${p.name}</b><br><small class="mut">${l.flav}</small></div><div class="qb"><button data-q="${i}|-1">−</button><b>${l.n}</b><button data-q="${i}|1">+</button></div></div>`}).join(""):`<p class="mut" style="margin-top:30px;text-align:center">Panier vide 💨</p>`;
  $("#ct").innerHTML=cart.length?`<div class="bar2"><i style="width:${Math.min(100,t.sub/FREE*100)}%"></i></div><small class="mut">${t.sub>=FREE?"🎉 Livraison offerte":"Plus que "+eur(FREE-t.sub)+" pour la livraison offerte"}</small><div style="display:flex;justify-content:space-between"><span>Livraison</span><span>${t.ship?eur(t.ship):"Offerte"}</span></div><div style="display:flex;justify-content:space-between;font:800 22px 'Space Grotesk'"><span>Total</span><span>${eur(t.tot)}</span></div><button class="btn w" id="pay">Payer</button>`:"";
}
$("#cl").onclick=e=>{const b=e.target.closest("[data-q]");if(!b)return;const[i,d]=b.dataset.q.split("|");cart[i].n+=+d;if(cart[i].n<1)cart.splice(i,1);save()};
const cartOpen=o=>{$("#cart").classList.toggle("on",o);$("#dim").classList.toggle("on",o)};
$("#bCart").onclick=()=>cartOpen(true);$("#cx").onclick=$("#dim").onclick=()=>cartOpen(false);
$("#ct").onclick=async e=>{
  if(!e.target.closest("#pay"))return;
  if(!user){cartOpen(false);return open("#auth")}
  if(!verified){cartOpen(false);return startId()}
  const b=e.target.closest("#pay");b.disabled=true;
  try{const r=await fn("createCheckout")({items:cart});location.href=r.data.url}catch(er){toast(er.message,"ko");b.disabled=false}
};
/* auth */
$("#bAcc").onclick=()=>user?(auth.signOut(),toast("Déconnecté")):open("#auth");
const am=m=>$("#am").textContent=m;
const social=p=>auth.signInWithPopup(p).then(close).catch(e=>am(e.message));
$("#gG").onclick=()=>social(new firebase.auth.GoogleAuthProvider());
$("#gA").onclick=()=>social(new firebase.auth.OAuthProvider("apple.com"));
$("#li").onclick=()=>auth.signInWithEmailAndPassword($("#em").value,$("#pw").value).then(close).catch(e=>am(e.message));
$("#su").onclick=()=>auth.createUserWithEmailAndPassword($("#em").value,$("#pw").value).then(close).catch(e=>am(e.message));
let un=[];
auth.onAuthStateChanged(u=>{
  user=u;un.forEach(f=>f());un=[];verified=false;vstatus="";$("#bAcc").textContent=u?"Déconnexion":"Connexion";chip();
  if(!u)return;
  un.push(db.doc("users/"+u.uid).onSnapshot(s=>{verified=!!s.data()?.verified;chip()},()=>{}));
  un.push(db.doc("verifications/"+u.uid).onSnapshot(s=>{vstatus=s.data()?.status||"";chip()},()=>{}));
});
function chip(){const c=$("#vchip");if(!user){c.style.display="none";return}c.style.display="";
  const[t,k]=verified?["✓ Âge vérifié","ok"]:vstatus=="pending"?["⏳ Vérif. en cours","wa"]:vstatus=="blocked"?["⛔ Refusé","ko"]:["Âge non vérifié","wa"];c.className="chip "+k;c.textContent=t;c.onclick=verified?null:startId}
/* vérification identité */
async function startId(){
  if(vstatus=="pending")return toast("Vérification déjà en cours, patiente.","");
  if(vstatus=="blocked")return toast("Compte refusé.","ko");
  open("#idv");$("#code").textContent="…";
  try{$("#code").textContent=(await fn("startVerification")()).data.code}catch(e){$("#vm").textContent=e.message}
}
$("#send").onclick=async()=>{
  const f1=$("#f1").files[0],f2=$("#f2").files[0];if(!f1||!f2)return $("#vm").textContent="Ajoute les 2 photos.";
  const b=$("#send");b.disabled=true;$("#vm").textContent="Envoi…";
  try{const r=n=>st.ref(`verifications/${user.uid}/${n}`);
    await r("id").put(f1,{contentType:f1.type});await r("selfie").put(f2,{contentType:f2.type});
    await fn("submitVerification")();close();toast("Envoyé ! Réponse sous peu ✓","ok")}
  catch(e){$("#vm").textContent=e.message}b.disabled=false;
};
/* effets 3D : tilt cartes + halo curseur */
document.addEventListener("mousemove",e=>{
  $("#glow").style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
  const c=e.target.closest(".card,.feat");$$(".card,.feat").forEach(x=>{if(x!==c)x.style.transform=""});
  if(c){const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.transform=`rotateY(${(x-.5)*16}deg) rotateX(${(.5-y)*16}deg) translateZ(14px)`;c.style.setProperty("--gx",x*100+"%");c.style.setProperty("--gy",y*100+"%")}
});
grid();renderCart();reveal();
if(location.search.includes("paid=1")){cart=[];save();toast("Paiement reçu, merci ! 🎉","ok")}

/* ================= 3D++ ================= */
(()=>{
  const css=document.createElement("style");css.textContent=`
  .cube{position:absolute;width:var(--s);height:var(--s);transform-style:preserve-3d;animation:cubespin var(--t) linear infinite;opacity:.55}
  .cube b{position:absolute;inset:0;border:1px solid color-mix(in srgb,var(--c) 70%,transparent);background:color-mix(in srgb,var(--c) 14%,transparent);backdrop-filter:blur(2px)}
  .cube b:nth-child(1){transform:translateZ(calc(var(--s)/2))}.cube b:nth-child(2){transform:rotateY(180deg) translateZ(calc(var(--s)/2))}
  .cube b:nth-child(3){transform:rotateY(90deg) translateZ(calc(var(--s)/2))}.cube b:nth-child(4){transform:rotateY(-90deg) translateZ(calc(var(--s)/2))}
  .cube b:nth-child(5){transform:rotateX(90deg) translateZ(calc(var(--s)/2))}.cube b:nth-child(6){transform:rotateX(-90deg) translateZ(calc(var(--s)/2))}
  @keyframes cubespin{from{transform:rotateX(0) rotateY(0) translateY(0)}50%{transform:rotateX(180deg) rotateY(200deg) translateY(-30px)}to{transform:rotateX(360deg) rotateY(360deg) translateY(0)}}
  .cubes{position:absolute;inset:0;perspective:900px}
  .fly{position:fixed;z-index:300;width:26px;height:26px;pointer-events:none;transform-style:preserve-3d;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:7px;box-shadow:0 0 24px var(--acc2)}
  .stage{cursor:grab;touch-action:pan-y}.stage:active{cursor:grabbing}
  .hero>div:first-child{transition:transform .2s ease-out}
  .sec h2,.feats,.hero h1{will-change:transform}
  .main{cursor:grab}.main .stage3{transition:transform .15s ease-out}
  .shine3d{position:absolute;left:50%;bottom:8%;width:200px;height:40px;margin-left:-100px;border-radius:50%;background:radial-gradient(#0009,transparent 70%);animation:shadow 4s ease-in-out infinite;pointer-events:none}
  @keyframes shadow{50%{transform:scale(.7);opacity:.5}}`;
  document.head.append(css);

  /* cubes 3D flottants en fond */
  const bg=document.querySelector(".bgfx");if(bg){const w=document.createElement("div");w.className="cubes";
    for(let i=0;i<14;i++){const c=document.createElement("div");c.className="cube";
      c.style.cssText=`--s:${24+Math.random()*50}px;--t:${14+Math.random()*18}s;--c:${i%2?"var(--acc)":"var(--acc2)"};left:${Math.random()*95}%;top:${Math.random()*92}%;animation-delay:-${Math.random()*20}s`;
      c.innerHTML="<b></b>".repeat(6);w.append(c)}bg.append(w)}

  /* ombre sous le puff du hero */
  const sc=document.querySelector(".scene");
  if(sc){const sh=document.createElement("div");sh.className="shine3d";sc.parentElement.append(sh);

    /* drag + inertie + souris + gyroscope */
    let rx=-8,ry=0,vx=0,vy=0,drag=false,lx=0,ly=0,tx=0,ty=0;
    const st=document.querySelector(".stage");
    st.addEventListener("pointerdown",e=>{drag=true;lx=e.clientX;ly=e.clientY;vx=vy=0});
    addEventListener("pointerup",()=>drag=false);
    addEventListener("pointermove",e=>{
      if(drag){vy=(e.clientX-lx)*.5;vx=-(e.clientY-ly)*.4;ry+=vy;rx=Math.max(-50,Math.min(50,rx+vx));lx=e.clientX;ly=e.clientY}
      else{const r=st.getBoundingClientRect();if(e.clientY>r.top-60&&e.clientY<r.bottom+60){tx=-((e.clientY-r.top)/r.height-.5)*26;ty=((e.clientX-r.left)/r.width-.5)*36}}});
    addEventListener("deviceorientation",e=>{if(e.gamma!=null){ty=e.gamma*.8;tx=-(e.beta-45)*.5}});
    (function loop(){if(!drag){ry+=vy;vy*=.95;rx+=(0-rx)*.02}
      sc.style.transform=`rotateX(${rx+tx}deg) rotateY(${ry+ty}deg) translateZ(${Math.sin(Date.now()/900)*16}px)`;requestAnimationFrame(loop)})();
  }

  /* parallax 3D au scroll */
  const hero=document.querySelector(".hero>div:first-child");
  addEventListener("scroll",()=>{const y=scrollY;
    if(hero){hero.style.transform=`translateY(${y*.12}px) translateZ(0)`}
    const f=document.querySelector(".feats");if(f)f.style.transform=`rotateX(${Math.max(0,8-y/80)}deg)`;
    document.querySelectorAll(".card.vis").forEach((c,i)=>{c.style.setProperty("--py",Math.sin((y+i*120)/260)*5+"px")});
  },{passive:true});

  /* fiche produit : le puff suit la souris */
  document.addEventListener("pointermove",e=>{const m=e.target.closest?.(".main");if(!m)return;const r=m.getBoundingClientRect(),
    s=m.querySelector(".stage3");if(s)s.style.transform=`scale(.8) rotateX(${-((e.clientY-r.top)/r.height-.5)*40}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*50}deg)`});

  /* cube qui vole vers le panier */
  document.addEventListener("click",e=>{
    if(!e.target.closest("#add"))return;
    const a=e.target.getBoundingClientRect(),b=document.querySelector("#bCart").getBoundingClientRect();
    const f=document.createElement("div");f.className="fly";f.style.left=a.left+a.width/2+"px";f.style.top=a.top+"px";document.body.append(f);
    f.animate([{transform:"translate(0,0) rotateX(0) rotateY(0) scale(1)",opacity:1},
      {transform:`translate(${(b.left-a.left)/2}px,-120px) rotateX(360deg) rotateY(360deg) scale(1.6)`,opacity:1,offset:.5},
      {transform:`translate(${b.left-a.left-a.width/2+20}px,${b.top-a.top}px) rotateX(720deg) rotateY(720deg) scale(.2)`,opacity:.2}],
      {duration:850,easing:"cubic-bezier(.3,.7,.3,1)"}).onfinish=()=>f.remove();
  },true);
})();
