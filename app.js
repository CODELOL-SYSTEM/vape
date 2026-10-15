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
const hs=$(".stage");if(hs)hs.addEventListener("mousemove",e=>{const r=hs.getBoundingClientRect();$(".scene").style.transform=`rotateX(${-((e.clientY-r.top)/r.height-.5)*30}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*40}deg)`});
$$(".feat").forEach(()=>{});
grid();renderCart();reveal();
if(location.search.includes("paid=1")){cart=[];save();toast("Paiement reçu, merci ! 🎉","ok")}
