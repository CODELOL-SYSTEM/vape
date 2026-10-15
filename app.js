const cfg = { apiKey: "AIzaSyAO3ZNx7hAFG_qH0BfeSUIMQsRfonH-LXw", authDomain: "vape-fc2ca.firebaseapp.com", projectId: "vape-fc2ca", storageBucket: "vape-fc2ca.firebasestorage.app", messagingSenderId: "826171627240", appId: "1:826171627240:web:68cb55f24238a68df29b5d" };
const ADMIN = "pc2alex.les@gmail.com", FREE = 39, SHIP = 4.9;
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1560401118775742605/mZ1Vcd419IKiMPhC4YIeuzqmzvCCflSu6c19anH3tpzkfhPdYp6Mm4VxssgxKYfqNUPU"; // ← colle ici l'URL du webhook Discord (Salon → Intégrations → Webhooks)
const SITE = location.origin + location.pathname;
const notify = (title, color, fields, txt = "Ouvrir le dashboard pour décider") => { if (!DISCORD_WEBHOOK) return; fetch(DISCORD_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "VAPE SHOP", embeds: [{ title, color, fields, description: `[👉 ${txt}](${SITE}#dash)`, timestamp: new Date().toISOString() }] }) }).catch(() => {}); };
firebase.initializeApp(cfg);
const auth = firebase.auth(), db = firebase.firestore(), TS = () => firebase.firestore.FieldValue.serverTimestamp();
const $ = id => document.getElementById(id), $$ = s => [...document.querySelectorAll(s)];
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const euro = n => n.toFixed(2).replace(".", ",") + " €";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const hue = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const KW = [["blue", 225], ["cherry", 355], ["cerise", 355], ["strawberry", 345], ["fraise", 345], ["watermelon", 340], ["mango", 38], ["peach", 25], ["dragon", 285], ["kiwi", 105], ["cola", 18], ["raspberry", 330], ["berries", 300], ["passion", 45], ["pomegranate", 350], ["bubble", 320], ["luv", 320]];
const fh = f => { const n = norm(f); for (const [k, h] of KW) if (n.includes(k)) return h; return hue(f); };
const DISC = n => n >= 10 ? .85 : n >= 5 ? .9 : n >= 3 ? .94 : 1;
const fbErr = e => { console.error(e); return (e.message || String(e)) + (/permission|unauthorized/.test(e.code || "") ? " → les règles Firebase (Firestore/Storage) bloquent : publie les règles du guide." : ""); };
function toast(m, t = "", ms = 4200) { const d = document.createElement("div"); d.className = "toast " + t; d.textContent = m; $("toasts").append(d); setTimeout(() => { d.classList.add("out"); setTimeout(() => d.remove(), 400); }, ms); }

/* ===== PRODUITS (puffs, 20 mg) ===== */
const E = "https://www.ecigplanete.com/", Lp = "https://cdn.lepetitfumeur.fr/", AEROX_PRICE = 13.9; // ⚠️ prix AeroX à confirmer
const P = [
  { id: "falcon-x-28000", name: "JNR Falcon X 28000", price: 12.4, puffs: 28000, tag: "🔥 Best-seller",
    flav: ["Watermelon Ice", "Blueberry Sour Raspberry", "Strawberry Watermelon Ice", "Cherry Ice", "Peach Berry", "Black Dragon Ice", "Mixed Berries", "Fizzy Cherry Cola", "Watermelon Mango Peach", "Blueberry Raspberry Cherry", "Mango Passion Fruit", "Blackberry Red Raspberry", "Blueberry Pomegranate Ice", "Strawberry Kiwi", "Watermelon Bubble Gum", "Cherry Watermelon Freeze", "Luv 66", "Golden Dragon Ice"],
    img: [40787, 40795, 40786, 40788, 40789, 40790, 40791, 40792, 40793, 40794, 41876, 41877, 41878, 41879, 41880, 43265, 43266, 561365].map(i => `${E}${i}-large_default/puff-falcon-x-28000-jnr.jpg`),
    desc: "20 mg de nicotine · 28 000 bouffées · 950 mAh · Dual Mesh 1,2 ohm · Rechargeable · 22 ml." },
  { id: "joker-24k", name: "JNR Joker 24K", price: 12.9, puffs: 24000, flav: ["Cola", "Cerise", "Fraise"],
    img: ["https://www.eliquidandco.com/37636-thickbox_default/fizzy-cherry-cola.jpg", "https://www.eliquidandco.com/37907-large_default/mixed-berries-50ml.jpg", "https://www.eliquidandco.com/38519-large_default/fizzy-cherry-cola.jpg"],
    desc: "20 mg de nicotine · 24 000 bouffées · 3 goûts au choix." },
  { id: "aerox-32k", name: "JNR AeroX 32K", price: AEROX_PRICE, puffs: 32000,
    flav: ["Watermelon Ice", "Strawberry Ice", "Peach Berry", "Black Dragon Ice", "Mixed Berries", "Summer Peach Ice", "Passion Fruit Kiwi", "Watermelon Mango Peach", "Watermelon Bubble Gum"],
    img: [42178, 42168, 42169, 42170, 42171, 42172, 42173, 42174, 42175, 42176, 42177, 42179, 42180, 42181, 42182, 43595].map(i => `${E}${i}-large_default/puff-aero-x-32k-jnr.jpg`),
    desc: "20 mg de nicotine · 32 000 bouffées · Rechargeable." },
  { id: "falcon-gem-30k", name: "JNR Falcon Gem 30K", price: 14.9, puffs: 30000, flav: null,
    img: [...Array.from({ length: 11 }, (_, i) => 37250 + i), 38167, 38168, 38169, 40801, 40837].map(i => `${Lp}${i}-medium_default/puff-30k-falcon-gem-20-mg-jnr.jpg`),
    desc: "20 mg de nicotine · 30 000 bouffées · Rechargeable." },
  { id: "jnr-24k", name: "JNR 24K", price: 21.68, puffs: 24000, flav: ["Watermelon Ice", "Mexican Mango", "Cherry Ice", "Blue Razz Cherry"],
    img: ["https://puffsjnr.fr/wp-content/uploads/2025/12/jnr-24k-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/%E4%B8%BB%E5%9B%BE2-1-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/%E4%B8%BB%E5%9B%BE4-1-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/jnr-24000-puffs-600x600.webp"],
    desc: "20 mg de nicotine · 24 000 bouffées · 4 goûts au choix." }
];
const byId = id => P.find(p => p.id === id);

/* ===== 3D (three.js) ===== */
function puff(h) {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(h / 360, .8, .5), metalness: .55, roughness: .28 });
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 2.2, 40), m));
  [1, -1].forEach(s => { const c = new THREE.Mesh(new THREE.SphereGeometry(.55, 40, 20, 0, 6.283, 0, 1.5708), m); c.position.y = 1.1 * s; if (s < 0) c.rotation.x = Math.PI; g.add(c); });
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(.2, .26, .4, 24), new THREE.MeshStandardMaterial({ color: 0x15171f, roughness: .4 })); tip.position.y = 1.85; g.add(tip);
  const led = new THREE.Mesh(new THREE.BoxGeometry(.28, .9, .06), new THREE.MeshStandardMaterial({ color: 0x00ffd5, emissive: 0x00d4b4, emissiveIntensity: 1.4 })); led.position.set(0, .2, .55); g.add(led);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.56, .04, 12, 48), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .2 })); ring.rotation.x = Math.PI / 2; ring.position.y = -.7; g.add(ring);
  g.userData.mat = m; return g;
}
function scene3d(el, defs, fit = 6) {
  if (!window.THREE) return null;
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2)); el.append(r.domElement);
  const s = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, .1, 100); cam.position.z = fit;
  s.add(new THREE.AmbientLight(0xffffff, .6)); const d = new THREE.DirectionalLight(0xffffff, 1.1); d.position.set(3, 4, 5); s.add(d);
  const p1 = new THREE.PointLight(0x7c5cff, 2, 20); p1.position.set(-3, -1, 3); s.add(p1); const p2 = new THREE.PointLight(0x00d4b4, 1.5, 20); p2.position.set(3, -2, 2); s.add(p2);
  const items = defs.map(([h, x, y, z, sc, tz]) => { const g = puff(h); g.position.set(x, y, z); g.scale.setScalar(sc); g.userData.y0 = y; g.rotation.z = tz; s.add(g); return g; });
  const N = 90, pos = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - .5) * 7;
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  s.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x9fffe9, size: .05, transparent: true, opacity: .6 })));
  let rx = 0, ry = 0, drag = false, lx = 0, ly = 0, t = 0; const cv = r.domElement;
  cv.onpointerdown = e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drag) return; ry += (e.clientX - lx) * .01; rx = Math.max(-.6, Math.min(.6, rx + (e.clientY - ly) * .005)); lx = e.clientX; ly = e.clientY; };
  cv.onpointerup = cv.onpointercancel = () => drag = false;
  (function loop() {
    if (!el.isConnected) { r.dispose(); return; } requestAnimationFrame(loop);
    const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
    if (cv.width !== Math.floor(w * r.getPixelRatio())) { r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    t += .016; if (!drag) ry += .006;
    items.forEach((g, i) => { g.rotation.y = ry + i * 1.2; g.rotation.x = rx; g.position.y = g.userData.y0 + Math.sin(t * 1.4 + i) * .12; });
    for (let i = 1; i < N * 3; i += 3) { pos[i] += .01; if (pos[i] > 3.5) pos[i] = -3.5; } geo.attributes.position.needsUpdate = true;
    r.render(s, cam);
  })();
  return { setHue: h => items.forEach(g => g.userData.mat.color.setHSL(h / 360, .8, .5)) };
}

/* ===== OVERLAYS ===== */
const unlock = () => { if (!$$(".ov.on,.side.on").length) document.body.classList.remove("lock"); };
const open = id => { $(id).classList.add("on"); document.body.classList.add("lock"); };
const shut = id => { $(id).classList.remove("on"); unlock(); };
$$("[data-close]").forEach(b => b.onclick = () => shut(b.closest(".ov").id));
$$(".ov").forEach(o => o.addEventListener("pointerdown", e => { if (e.target === o) shut(o.id); }));
const openCart = () => { drawCart(); $("cart").classList.add("on"); $("dim").classList.add("on"); document.body.classList.add("lock"); };
const closeCart = () => { $("cart").classList.remove("on"); $("dim").classList.remove("on"); unlock(); };
$("bCart").onclick = openCart; $("cx").onclick = $("dim").onclick = closeCart;
addEventListener("keydown", e => { if (e.key === "Escape") { $$(".ov.on").forEach(o => shut(o.id)); closeCart(); } });

/* ===== ÂGE & COOKIES ===== */
const blockMinor = () => { document.body.classList.add("blocked"); $("minor").classList.add("on"); try { sessionStorage.setItem("minor", "1"); } catch {} };
try { if (sessionStorage.getItem("minor")) blockMinor(); } catch {}
$("ageNo").onclick = blockMinor;
["dd", "mm", "yy"].forEach((id, i, a) => $(id).oninput = e => { e.target.value = e.target.value.replace(/\D/g, ""); if (e.target.value.length >= e.target.maxLength && a[i + 1]) $(a[i + 1]).focus(); });
$("ageYes").onclick = () => {
  const d = +$("dd").value, m = +$("mm").value, y = +$("yy").value, now = new Date(), b = new Date(y, m - 1, d);
  if (!(d >= 1 && m >= 1 && m <= 12 && y > 1900 && b.getDate() === d && b <= now)) { $("ageErr").textContent = "Entre une date de naissance valide."; const x = $("ageBox"); x.classList.remove("shake"); void x.offsetWidth; x.classList.add("shake"); return; }
  let age = now.getFullYear() - y; if (now < new Date(now.getFullYear(), m - 1, d)) age--;
  if (age < 18) return blockMinor();
  store.set("age18", "1"); $("age").classList.add("out"); setTimeout(() => $("age").remove(), 700);
};
if (store.get("age18") === "1") $("age").remove();
if (!store.get("cookies")) $("cookie").style.display = "flex";
$("ck1").onclick = () => { store.set("cookies", "yes"); $("cookie").style.display = "none"; };
$("ck0").onclick = () => { store.set("cookies", "no"); $("cookie").style.display = "none"; };

/* ===== CATALOGUE ===== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .1 });
const reveal = () => $$(".rv:not(.vis)").forEach(e => io.observe(e));
function render() {
  const q = norm($("q").value), f = document.querySelector(".fc.on").dataset.f, s = $("sort").value;
  const l = P.filter(p => (!q || norm(p.name + " " + (p.flav || []).join(" ")).includes(q)) && (f === "all" || (f === "cheap" && p.price < 15) || (f === "big" && p.puffs >= 30000)));
  if (s) l.sort((a, b) => s === "a" ? a.price - b.price : s === "d" ? b.price - a.price : b.puffs - a.puffs);
  $("count").textContent = `${l.length} puff${l.length > 1 ? "s" : ""} · 20 mg`;
  $("grid").innerHTML = l.length ? l.map((p, i) => `<div class="card rv" tabindex="0" data-id="${p.id}" style="--d:${i * .08}s;--h:${hue(p.name)}"><span class="glare"></span><div class="ph">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}<img class="shot" src="${p.img[0]}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=mini></div>'"></div><div class="in"><small class="mut">${p.puffs.toLocaleString("fr-FR")} bouffées${p.flav ? " · " + p.flav.length + " goûts" : ""}</small><h3>${esc(p.name)}</h3><div class="meta"><span class="price">${euro(p.price)}</span><button class="qa" data-q="1" aria-label="Ajouter">+</button></div></div></div>`).join("") : '<p class="empty">Aucun résultat.</p>';
  reveal();
}
$("q").oninput = $("sort").onchange = render;
$$(".fc").forEach(b => b.onclick = () => { $$(".fc").forEach(x => x.classList.toggle("on", x === b)); render(); });
$("grid").onclick = e => { const c = e.target.closest(".card"); if (!c) return; const p = byId(c.dataset.id); if (e.target.closest(".qa") && !p.flav) add(p.id, "", 1, c.querySelector(".shot")); else showP(p.id); };
$("grid").addEventListener("pointermove", e => { const c = e.target.closest(".card"); if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty("--ry", (x - .5) * 14 + "deg"); c.style.setProperty("--rx", (.5 - y) * 14 + "deg"); c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%"); });
$("grid").addEventListener("pointerout", e => { const c = e.target.closest(".card"); if (c) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); } });
$$("[data-open]").forEach(b => b.onclick = () => showP(b.dataset.open));
$$(".qq").forEach(b => b.onclick = () => { const f = b.parentElement, a = f.querySelector(".aa"), o = f.classList.toggle("open"); a.style.maxHeight = o ? a.scrollHeight + "px" : 0; });

/* ===== FICHE PRODUIT ===== */
let cur, qty = 1, fl = "", vw = null;
function view(m, u) {
  const pv = $("pv"); vw = null; $$(".vb").forEach(b => b.classList.toggle("on", b.dataset.v === m));
  pv.innerHTML = m === "p" ? `<img src="${u || cur.img[0]}" alt="" referrerpolicy="no-referrer">` : "";
  if (m === "3") vw = scene3d(pv, [[fh(fl || cur.name), 0, 0, 0, 1.05, 0]], 6.2);
}
function setQ(n) { qty = Math.max(1, Math.min(99, n || 1)); $("qi").value = qty; $$(".tier").forEach(t => t.classList.toggle("on", +t.dataset.n === qty)); }
function showP(id) {
  cur = byId(id); qty = 1; const p = cur; fl = p.flav ? p.flav[0] : "";
  $("pmb").innerHTML = `<div class="pm"><div><div class="pv" id="pv"></div><div class="vt"><button class="vb on" data-v="p">📷 Photos</button><button class="vb" data-v="3">🧊 Vue 3D</button></div>${p.img.length > 1 ? `<div class="th">${p.img.map((u, i) => `<img src="${u}" data-u="${u}" loading="lazy" referrerpolicy="no-referrer" class="${i ? "" : "on"}">`).join("")}</div>` : ""}</div>
  <div class="stack"><small class="mut">${p.puffs.toLocaleString("fr-FR")} bouffées · 20 mg nicotine</small><h2>${esc(p.name)}</h2><div class="price big">${euro(p.price)} <small class="mut" style="font-size:12px">TTC</small></div><p class="mut">${esc(p.desc)}</p>
  ${p.flav ? `<div class="lbl">Goût : <b id="fn">${esc(fl)}</b></div><div class="sws">${p.flav.map((f, i) => `<button class="sw ${i ? "" : "on"}" data-f="${esc(f)}" title="${esc(f)}" aria-label="${esc(f)}" style="--c:hsl(${fh(f)} 80% 55%)"></button>`).join("")}</div>` : ""}
  <div class="tiers">${[1, 3, 5, 10].map(n => `<button class="tier ${n === 1 ? "on" : ""}" data-n="${n}"><b>×${n}</b><br>${euro(p.price * n * DISC(n))}<small>${n > 1 ? "-" + Math.round((1 - DISC(n)) * 100) + " %" : "prix unitaire"}</small></button>`).join("")}</div>
  <div class="qty"><button data-d="-1">−</button><input id="qi" type="number" min="1" max="99" value="1"><button data-d="1">+</button></div><button class="btn w" id="add">Ajouter au panier</button></div></div>`;
  view("p"); open("pm");
}
$("pmb").onclick = e => {
  const t = e.target.closest("button,img[data-u]"); if (!t) return; const d = t.dataset;
  if (d.v) view(d.v);
  else if (d.u) { $$(".th img").forEach(i => i.classList.toggle("on", i === t)); view("p", d.u); }
  else if (d.f) { fl = d.f; $$(".sw").forEach(s => s.classList.toggle("on", s === t)); $("fn").textContent = fl; vw && vw.setHue(fh(fl)); }
  else if (d.n) setQ(+d.n);
  else if (d.d) setQ(qty + +d.d);
  else if (t.id === "add") { add(cur.id, cur.flav ? fl : "", qty, $("pv").querySelector("img")); shut("pm"); openCart(); }
};
$("pmb").onchange = e => { if (e.target.id === "qi") setQ(+e.target.value); };

/* ===== PANIER ===== */
let cart = JSON.parse(store.get("cart") || "[]").filter(l => byId(l.id));
const tq = id => cart.filter(x => x.id === id).reduce((a, x) => a + x.n, 0), unit = l => byId(l.id).price * DISC(tq(l.id));
const totals = () => { const sub = cart.reduce((s, l) => s + unit(l) * l.n, 0); return { sub, ship: !cart.length || sub >= FREE ? 0 : SHIP }; };
function saveCart() { store.set("cart", JSON.stringify(cart)); const c = $("cn"); c.textContent = cart.reduce((s, l) => s + l.n, 0); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); }
function add(id, f, n, from) { const l = cart.find(x => x.id === id && x.flav === f); l ? l.n += n : cart.push({ id, flav: f, n }); saveCart(); fly(from); toast("Ajouté au panier ✓", "ok", 1800); }
function fly(el) {
  if (!el || !el.getBoundingClientRect) return; const r = el.getBoundingClientRect(), t = $("bCart").getBoundingClientRect(), f = document.createElement("div");
  f.className = "fly"; f.style.cssText = `left:${r.left + r.width / 2 - 28}px;top:${r.top + r.height / 2 - 28}px;background-image:url('${el.src || ""}')`; document.body.append(f);
  f.animate([{ transform: "scale(1)", opacity: 1 }, { transform: `translate(${t.left - r.left - r.width / 2 + 10}px,${t.top - r.top - r.height / 2 + 10}px) scale(.2)`, opacity: .3 }], { duration: 700, easing: "cubic-bezier(.5,0,.8,.4)" }).onfinish = () => f.remove();
}
function drawCart() {
  const t = totals(), left = Math.max(0, FREE - t.sub);
  $("cl").innerHTML = cart.length ? cart.map((l, i) => { const p = byId(l.id); return `<div class="row"><div class="t" style="background-image:url('${p.img[0]}')"></div><div><b>${esc(p.name)}</b><br>${l.flav ? `<small class="mut"><span class="dot" style="--c:hsl(${fh(l.flav)} 80% 55%)"></span>${esc(l.flav)}</small>` : ""}<div class="qb"><button data-m="${i}">−</button>${l.n}<button data-p="${i}">+</button></div></div><div class="rp">${euro(unit(l) * l.n)}<button data-x="${i}">Retirer</button></div></div>`; }).join("") : '<p class="mut" style="padding:20px 0">Ton panier est vide.</p>';
  $("ct").innerHTML = cart.length ? `<div class="mut" style="font-size:13px">${left ? `Plus que ${euro(left)} pour la livraison offerte` : "🎉 Livraison offerte"}</div><div class="bar2"><i style="width:${Math.min(100, t.sub / FREE * 100)}%"></i></div><div class="tot"><span>Sous-total</span><span>${euro(t.sub)}</span></div><div class="tot"><span>Livraison</span><span>${t.ship ? euro(t.ship) : "Offerte"}</span></div><div class="tot g"><span>Total</span><span>${euro(t.sub + t.ship)}</span></div><button class="btn w" id="ord">Commander</button>` : "";
}
$("cl").onclick = e => { const b = e.target.closest("button"); if (!b) return; const d = b.dataset; if (d.m !== undefined) { if (--cart[d.m].n <= 0) cart.splice(d.m, 1); } else if (d.p !== undefined) cart[d.p].n++; else if (d.x !== undefined) cart.splice(d.x, 1); else return; saveCart(); drawCart(); };
$("ct").onclick = e => { if (e.target.id === "ord") order(); };
async function order() {
  if (!cart.length) return;
  if (!user) { setMode("in"); open("auth"); return toast("Connecte-toi pour commander"); }
  if (!verified) { if (vs === "pending") return toast("Vérification en cours : attends la validation."); if (vs === "rejected") return toast("Vérification refusée : achat impossible.", "ko"); closeCart(); return openVerif(); }
  const b = $("ord"); b.classList.add("load"); b.disabled = true;
  try {
    const t = totals();
    await db.collection("orders").add({ uid: user.uid, email: user.email, items: cart.map(l => ({ id: l.id, name: byId(l.id).name, flav: l.flav, n: l.n, unit: +unit(l).toFixed(2) })), total: +(t.sub + t.ship).toFixed(2), status: "nouvelle", createdAt: TS() });
    notify("🛒 Nouvelle commande", 0x7c5cff, [{ name: "Client", value: String(user.email) }, { name: "Articles", value: cart.map(l => `${byId(l.id).name}${l.flav ? " (" + l.flav + ")" : ""} ×${l.n}`).join("\n").slice(0, 1000) || "—" }, { name: "Total", value: euro(t.sub + t.ship) }], "Voir la commande dans le dashboard");
    cart = []; saveCart(); drawCart(); closeCart(); confetti(); toast("Commande envoyée ✅ Merci !", "ok", 6000);
  } catch (e) { toast("Commande non envoyée : " + fbErr(e), "ko", 9000); b.classList.remove("load"); b.disabled = false; }
}

/* ===== COMPTE ===== */
let user = null, verified = false, vs = "", mode = "in", unsub = [], dashUnsub = [], vcode = "";
function setMode(m) { mode = m; $("tabs").classList.toggle("up", m === "up"); $$(".tab").forEach(t => t.classList.toggle("on", t.dataset.m === m)); $("asub").textContent = m === "in" ? "Se connecter" : "Créer mon compte"; $("forgot").style.display = m === "in" ? "" : "none"; }
$("tabs").onclick = e => { const t = e.target.closest(".tab"); t && setMode(t.dataset.m); };
const run = async fn => { $("am").textContent = ""; try { await fn(); shut("auth"); } catch (e) { $("am").textContent = fbErr(e); } };
$("gG").onclick = () => run(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
$("gA").onclick = () => run(() => auth.signInWithPopup(new firebase.auth.OAuthProvider("apple.com")));
$("asub").onclick = () => run(() => mode === "in" ? auth.signInWithEmailAndPassword($("em").value.trim(), $("pw").value) : auth.createUserWithEmailAndPassword($("em").value.trim(), $("pw").value));
$("forgot").onclick = async () => { const m = $("em").value.trim(); if (!m) { $("am").textContent = "Entre ton email d'abord."; return; } try { await auth.sendPasswordResetEmail(m); toast("Email de réinitialisation envoyé", "ok"); } catch (x) { $("am").textContent = fbErr(x); } };
$("bAcc").onclick = () => { if (user) auth.signOut(); else { setMode("in"); open("auth"); } };
function chip() {
  const c = $("vchip"); if (!user) { c.style.display = "none"; return; } c.style.display = "";
  const [m, t] = verified ? ["ok", "✓ Âge vérifié"] : vs === "pending" ? ["wa", "⏳ Vérification en cours"] : vs === "rejected" ? ["ko", "✕ Vérification refusée"] : ["wa", "🪪 À vérifier"];
  c.className = "chip " + m; c.textContent = t;
}
$("vchip").onclick = () => openVerif();
auth.onAuthStateChanged(u => {
  user = u; unsub.forEach(f => f()); unsub = []; dashUnsub.forEach(f => f()); dashUnsub = []; verified = false; vs = "";
  $("bAcc").textContent = u ? "Déconnexion" : "Connexion"; $("bDash").style.display = u && u.email === ADMIN ? "" : "none"; chip(); if (!u) { if (location.hash === "#dash") { toast("Connecte-toi avec le compte admin pour décider"); setMode("in"); open("auth"); } return; }
  if (u.email === ADMIN && location.hash === "#dash") { history.replaceState(null, "", location.pathname); setTimeout(() => $("bDash").click(), 300); }
  unsub.push(db.doc("users/" + u.uid).onSnapshot(s => { verified = !!(s.exists && s.data().verified); chip(); }, e => console.error(e)));
  unsub.push(db.doc("verifications/" + u.uid).onSnapshot(s => { const n = s.exists ? s.data().status : ""; if (n === "approved" && vs && vs !== "approved") { toast("Ton âge est vérifié ✓ Tu peux commander !", "ok", 7000); confetti(); } vs = n; chip(); }, e => console.error(e)));
});

/* ===== VÉRIFICATION ===== */
function openVerif() {
  if (!user) { setMode("in"); open("auth"); return toast("Connecte-toi ou crée un compte d'abord"); }
  if (verified) return toast("Ton âge est déjà vérifié ✓", "ok"); if (vs === "pending") return toast("Vérification déjà envoyée, en attente."); if (vs === "rejected") return toast("Vérification refusée.", "ko");
  vcode = (1000 + Math.random() * 9000 | 0) + Array.from({ length: 3 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.random() * 24 | 0]).join(""); $("code").textContent = vcode; open("idv");
}
$("bVerif").onclick = openVerif;
["1", "2"].forEach(n => $("f" + n).onchange = e => { const f = e.target.files[0], p = $("p" + n); if (f) { p.style.backgroundImage = `url(${URL.createObjectURL(f)})`; p.classList.add("ok"); p.textContent = "✓ Photo ajoutée"; } $("send").disabled = !($("f1").files[0] && $("f2").files[0]); });
// photos réduites (JPEG) et stockées dans Firestore : pas besoin de Firebase Storage
const shrink = f => new Promise((res, rej) => {
  const im = new Image(), u = URL.createObjectURL(f);
  im.onload = () => {
    for (const [max, q] of [[1000, .72], [800, .6], [640, .5]]) {
      const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      const d = c.toDataURL("image/jpeg", q); if (d.length < 430000 || max === 640) { URL.revokeObjectURL(u); return res(d); }
    }
  };
  im.onerror = () => rej(new Error("Photo illisible : essaie une autre photo (JPG ou PNG)."));
  im.src = u;
});
$("send").onclick = async () => {
  const b = $("send"); b.disabled = true; b.classList.add("load"); $("vm").textContent = "Envoi…";
  try {
    const idImg = await shrink($("f1").files[0]), selfieImg = await shrink($("f2").files[0]);
    await db.doc("verifications/" + user.uid).set({ uid: user.uid, email: user.email, code: vcode, idImg, selfieImg, status: "pending", createdAt: TS() });
    notify("🪪 Nouvelle vérification d'âge", 0xf59e0b, [{ name: "Email", value: String(user.email) }, { name: "Code sur le papier", value: "**" + vcode + "**" }]);
    $("vm").textContent = ""; shut("idv"); toast("Envoyé ✅ Tu seras averti dès la validation.", "ok", 6000);
  } catch (e) { $("vm").textContent = fbErr(e); b.disabled = false; }
  b.classList.remove("load");
};

/* ===== DASHBOARD ADMIN ===== */
$("bDash").onclick = () => {
  if (!user || user.email !== ADMIN) return; open("dash"); dashUnsub.forEach(f => f()); dashUnsub = [];
  const er = el => e => { $(el).innerHTML = `<p class="err">${esc(fbErr(e))}</p>`; };
  dashUnsub.push(db.collection("verifications").where("status", "==", "pending").onSnapshot(s => {
    $("dv").innerHTML = s.empty ? '<p class="mut">Aucune demande.</p>' : s.docs.map(d => { const v = d.data(); return `<div class="dr"><div><b>${esc(v.email)}</b> · code <b>${esc(v.code)}</b><div class="im">${["idImg", "selfieImg"].map(k => String(v[k] || "").startsWith("data:image/jpeg;base64,") ? `<img src="${v[k]}" alt="${k === "idImg" ? "Pièce d'identité" : "Selfie"}" title="Clique pour agrandir" onclick="this.classList.toggle('big')">` : "").join("")}</div></div><button class="btn ok" data-a="${d.id}">Accepter</button><button class="btn ko" data-r="${d.id}">Refuser</button></div>`; }).join("");
  }, er("dv")));
  dashUnsub.push(db.collection("orders").orderBy("createdAt", "desc").onSnapshot(s => {
    $("do").innerHTML = s.empty ? '<p class="mut">Aucune commande.</p>' : s.docs.map(d => { const o = d.data(); return `<div class="dr"><div><b>${esc(o.email)}</b> · ${euro(o.total || 0)}<br><small class="mut">${(o.items || []).map(i => esc(i.name || i.id) + (i.flav ? " (" + esc(i.flav) + ")" : "") + " ×" + i.n).join(", ")}</small></div><span class="pill">${esc(o.status)}</span>${o.status === "nouvelle" ? `<button class="btn alt" data-s="${d.id}">Expédiée</button>` : ""}</div>`; }).join("");
  }, er("do")));
};
$("dash").onclick = async e => {
  const b = e.target.closest("button"); if (!b) return; const d = b.dataset;
  try {
    if (d.a || d.r) { const id = d.a || d.r, ok = !!d.a; await db.doc("verifications/" + id).update({ status: ok ? "approved" : "rejected", idImg: firebase.firestore.FieldValue.delete(), selfieImg: firebase.firestore.FieldValue.delete() }); await db.doc("users/" + id).set({ verified: ok }, { merge: true }); toast(ok ? "Accepté ✓" : "Refusé", "ok"); }
    else if (d.s) await db.doc("orders/" + d.s).update({ status: "expédiée" });
  } catch (x) { toast(fbErr(x), "ko", 8000); }
};

/* ===== EFFETS ===== */
function confetti() {
  const c = $("confetti"), x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
  const ps = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, c: `hsl(${Math.random() * 360} 90% 60%)`, s: 4 + Math.random() * 5 })); let f = 0;
  (function a() { x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.vy += .4; p.x += p.vx; p.y += p.vy; x.fillStyle = p.c; x.fillRect(p.x, p.y, p.s, p.s); }); if (++f < 110) requestAnimationFrame(a); else x.clearRect(0, 0, c.width, c.height); })();
}
addEventListener("scroll", () => { const h = document.documentElement; $("prog").style.transform = `scaleX(${scrollY / Math.max(1, h.scrollHeight - innerHeight)})`; document.querySelector("header").classList.toggle("sc", scrollY > 20); }, { passive: true });
addEventListener("pointermove", e => { $("glow").style.transform = `translate(${e.clientX - 220}px,${e.clientY - 220}px)`; });
$$("[data-count]").forEach(el => { const to = +el.dataset.count, t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0); });
scene3d($("h3d"), [[265, -1.9, 0, 0, .85, .25], [170, 0, .1, .6, 1.15, 0], [340, 1.9, 0, 0, .85, -.25]], 7.5);
setMode("in"); render(); saveCart(); reveal();
