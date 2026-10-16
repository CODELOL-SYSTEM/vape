const cfg = { apiKey: "AIzaSyAO3ZNx7hAFG_qH0BfeSUIMQsRfonH-LXw", authDomain: "vape-fc2ca.firebaseapp.com", projectId: "vape-fc2ca", storageBucket: "vape-fc2ca.firebasestorage.app", messagingSenderId: "826171627240", appId: "1:826171627240:web:68cb55f24238a68df29b5d" };
const ADMIN = "pc2alex.les@gmail.com", FREE = 39, SHIP = 4.9, PAYPAL = "SH0PNOVA";
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1560401118775742605/mZ1Vcd419IKiMPhC4YIeuzqmzvCCflSu6c19anH3tpzkfhPdYp6Mm4VxssgxKYfqNUPU"; // colle ici une NOUVELLE URL de webhook Discord (l'ancienne était publique : supprime-la dans Discord)
const SITE = location.origin + location.pathname;
const notify = (title, color, fields) => { if (!DISCORD_WEBHOOK) return; fetch(DISCORD_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "VAPE SHOP", embeds: [{ title, color, fields, description: `[Ouvrir le dashboard](${SITE}#dash)`, timestamp: new Date().toISOString() }] }) }).catch(() => {}); };
firebase.initializeApp(cfg);
const auth = firebase.auth(), db = firebase.firestore(), TS = () => firebase.firestore.FieldValue.serverTimestamp();
const $ = id => document.getElementById(id), $$ = s => [...document.querySelectorAll(s)];
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const euro = n => n.toFixed(2).replace(".", ",") + " €";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const hue = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const DISC = n => n >= 10 ? .85 : n >= 5 ? .9 : n >= 3 ? .94 : 1;
const fbErr = e => { console.error(e); return (e.message || String(e)) + (/permission|unauthorized/.test(e.code || "") ? " → règles Firebase à publier." : ""); };
function toast(m, t = "", ms = 4200) { const d = document.createElement("div"); d.className = "toast " + t; d.textContent = m; $("toasts").append(d); setTimeout(() => d.remove(), ms); }

/* ===== PRODUITS (puffs, 20 mg) ===== */
const E = "https://www.ecigplanete.com/", Lp = "https://cdn.lepetitfumeur.fr/";
const P = [
  { id: "falcon-x-28000", name: "JNR Falcon X 28000", price: 12.4, puffs: 28000, tag: "Best-seller",
    flav: ["Watermelon Ice", "Blueberry Sour Raspberry", "Strawberry Watermelon Ice", "Cherry Ice", "Peach Berry", "Black Dragon Ice", "Mixed Berries", "Fizzy Cherry Cola", "Watermelon Mango Peach", "Blueberry Raspberry Cherry", "Mango Passion Fruit", "Blackberry Red Raspberry", "Blueberry Pomegranate Ice", "Strawberry Kiwi", "Watermelon Bubble Gum", "Cherry Watermelon Freeze", "Luv 66", "Golden Dragon Ice"],
    img: [40787, 40795, 40786, 40788, 40789, 40790, 40791, 40792, 40793, 40794, 41876, 41877, 41878, 41879, 41880, 43265, 43266, 561365].map(i => `${E}${i}-large_default/puff-falcon-x-28000-jnr.jpg`),
    desc: "20 mg de nicotine · 28 000 bouffées · 950 mAh · Dual Mesh 1,2 ohm · Rechargeable · 22 ml." },
  { id: "joker-24k", name: "JNR Joker 24K", price: 12.9, puffs: 24000, flav: ["Cola", "Cerise", "Fraise"],
    img: ["https://www.eliquidandco.com/37636-thickbox_default/fizzy-cherry-cola.jpg", "https://www.eliquidandco.com/37907-large_default/mixed-berries-50ml.jpg", "https://www.eliquidandco.com/38519-large_default/fizzy-cherry-cola.jpg"],
    desc: "20 mg de nicotine · 24 000 bouffées · 3 goûts au choix." },
  { id: "aerox-32k", name: "JNR AeroX 32K", price: 13.9, puffs: 32000,
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

/* ===== FENÊTRES ===== */
const unlock = () => { if (!$$(".ov.on,.side.on").length) document.body.classList.remove("lock"); };
const open = id => { $(id).classList.add("on"); document.body.classList.add("lock"); };
const shut = id => { $(id).classList.remove("on"); unlock(); };
$$("[data-close]").forEach(b => b.onclick = () => shut(b.closest(".ov").id));
$$(".ov").forEach(o => o.addEventListener("pointerdown", e => { if (e.target === o) shut(o.id); }));
const openCart = () => { drawCart(); $("cart").classList.add("on"); $("dim").classList.add("on"); document.body.classList.add("lock"); };
const closeCart = () => { $("cart").classList.remove("on"); $("dim").classList.remove("on"); unlock(); };
$("bCart").onclick = openCart; $("cx").onclick = $("dim").onclick = closeCart;
addEventListener("keydown", e => {
  if (e.key === "Escape") { $$(".ov.on").forEach(o => shut(o.id)); closeCart(); }
  else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && $("pm").classList.contains("on") && cur && !/INPUT|SELECT/.test(document.activeElement.tagName)) setImg(ix + (e.key === "ArrowRight" ? 1 : -1));
});

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
  store.set("age18", "1"); $("age").remove();
};
if (store.get("age18") === "1") $("age").remove();
if (!store.get("cookies")) $("cookie").style.display = "flex";
$("ck1").onclick = () => { store.set("cookies", "yes"); $("cookie").style.display = "none"; };
$("ck0").onclick = () => { store.set("cookies", "no"); $("cookie").style.display = "none"; };

/* ===== CATALOGUE ===== */
function render() {
  const q = norm($("q").value), f = document.querySelector(".fc.on").dataset.f, s = $("sort").value;
  const l = P.filter(p => (!q || norm(p.name + " " + (p.flav || []).join(" ")).includes(q)) && (f === "all" || (f === "cheap" && p.price < 15) || (f === "big" && p.puffs >= 30000)));
  if (s) l.sort((a, b) => s === "a" ? a.price - b.price : s === "d" ? b.price - a.price : b.puffs - a.puffs);
  $("count").textContent = `${l.length} puff${l.length > 1 ? "s" : ""} · 20 mg`;
  $("grid").innerHTML = l.length ? l.map((p, i) => `<div class="card" data-id="${p.id}" style="animation-delay:${i * .07}s;--h:${hue(p.name)}"><div class="ph">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}<img class="shot" src="${p.img[0]}" alt="${esc(p.name)}" loading="lazy" onerror="this.outerHTML='<div class=mini></div>'"></div><div class="in"><small class="mut">${p.puffs.toLocaleString("fr-FR")} bouffées${p.flav ? " · " + p.flav.length + " goûts" : ""}</small><h3>${esc(p.name)}</h3><div class="meta"><span class="price">${euro(p.price)}</span><button class="qa" data-q="1" aria-label="Ajouter">+</button></div></div></div>`).join("") : '<p class="empty">Aucun résultat.</p>';
}
$("q").oninput = $("sort").onchange = render;
$$(".fc").forEach(b => b.onclick = () => { $$(".fc").forEach(x => x.classList.toggle("on", x === b)); render(); });
$("grid").onclick = e => { const c = e.target.closest(".card"); if (!c) return; const p = byId(c.dataset.id); if (e.target.closest(".qa") && !p.flav) add(p.id, "", 1); else showP(p.id); };

/* ===== FICHE PRODUIT ===== */
let cur, qty = 1, fl = "", ix = 0;
function setQ(n) { qty = Math.max(1, Math.min(99, n || 1)); $("qi").value = qty; $$(".tier").forEach(t => t.classList.toggle("on", +t.dataset.n === qty)); }
function setImg(i) {
  const n = cur.img.length; ix = (i + n) % n; $("pimg").src = cur.img[ix];
  const ths = $$(".th img"); ths.forEach((t, k) => t.classList.toggle("on", k === ix));
  if (ths[ix]) ths[ix].scrollIntoView({ block: "nearest", inline: "center" });
  if ($("cnt")) $("cnt").textContent = (ix + 1) + " / " + n;
}
function showP(id) {
  cur = byId(id); qty = 1; ix = 0; const p = cur; fl = p.flav ? p.flav[0] : "";
  $("pmb").innerHTML = `<div class="pm"><div><div class="pv"><img id="pimg" src="${p.img[0]}" alt="">${p.img.length > 1 ? `<button class="ar l" data-i="-1" aria-label="Image précédente">‹</button><button class="ar r" data-i="1" aria-label="Image suivante">›</button><span class="cnt" id="cnt">1 / ${p.img.length}</span>` : ""}</div>${p.img.length > 1 ? `<div class="th">${p.img.map((u, i) => `<img src="${u}" data-k="${i}" loading="lazy" class="${i ? "" : "on"}">`).join("")}</div>` : ""}</div>
  <div class="stack"><small class="mut">${p.puffs.toLocaleString("fr-FR")} bouffées · 20 mg nicotine</small><h2>${esc(p.name)}</h2><div class="price big">${euro(p.price)} <small class="mut" style="font-size:12px">TTC</small></div><p class="mut">${esc(p.desc)}</p>
  ${p.flav ? `<label>Goût<select id="fsel">${p.flav.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join("")}</select></label>` : ""}
  <div class="tiers">${[1, 3, 5, 10].map(n => `<button class="tier ${n === 1 ? "on" : ""}" data-n="${n}"><b>×${n}</b><br>${euro(p.price * n * DISC(n))}<small>${n > 1 ? "-" + Math.round((1 - DISC(n)) * 100) + " %" : "prix unitaire"}</small></button>`).join("")}</div>
  <div class="qty"><button data-d="-1">−</button><input id="qi" type="number" min="1" max="99" value="1"><button data-d="1">+</button></div><button class="btn w" id="add">Ajouter au panier</button></div></div>`;
  open("pm");
}
$("pmb").onclick = e => {
  const t = e.target.closest("button,img[data-k]"); if (!t) return; const d = t.dataset;
  if (d.k !== undefined) setImg(+d.k);
  else if (d.i !== undefined) setImg(ix + +d.i);
  else if (d.n) setQ(+d.n);
  else if (d.d) setQ(qty + +d.d);
  else if (t.id === "add") { add(cur.id, cur.flav ? fl : "", qty); shut("pm"); openCart(); }
};
$("pmb").onchange = e => {
  if (e.target.id === "qi") setQ(+e.target.value);
  else if (e.target.id === "fsel") { fl = e.target.value; if (cur.img.length === cur.flav.length) setImg(cur.flav.indexOf(fl)); }
};
let sx = 0;
$("pmb").addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
$("pmb").addEventListener("touchend", e => { if (!e.target.closest(".pv")) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) setImg(ix + (dx < 0 ? 1 : -1)); }, { passive: true });

/* ===== PANIER ===== */
let cart = JSON.parse(store.get("cart") || "[]").filter(l => byId(l.id));
const tq = id => cart.filter(x => x.id === id).reduce((a, x) => a + x.n, 0), unit = l => byId(l.id).price * DISC(tq(l.id));
const totals = () => { const sub = cart.reduce((s, l) => s + unit(l) * l.n, 0); return { sub, ship: !cart.length || sub >= FREE ? 0 : SHIP }; };
function saveCart() { store.set("cart", JSON.stringify(cart)); $("cn").textContent = cart.reduce((s, l) => s + l.n, 0); }
function add(id, f, n) { const l = cart.find(x => x.id === id && x.flav === f); l ? l.n += n : cart.push({ id, flav: f, n }); saveCart(); toast("Ajouté au panier ✓", "ok", 1800); }
function drawCart() {
  const t = totals(), left = Math.max(0, FREE - t.sub);
  $("cl").innerHTML = cart.length ? cart.map((l, i) => { const p = byId(l.id); return `<div class="row"><div class="t" style="background-image:url('${p.img[0]}')"></div><div><b>${esc(p.name)}</b><br>${l.flav ? `<small class="mut">${esc(l.flav)}</small>` : ""}<div class="qb"><button data-m="${i}">−</button>${l.n}<button data-p="${i}">+</button></div></div><div class="rp">${euro(unit(l) * l.n)}<button data-x="${i}">Retirer</button></div></div>`; }).join("") : '<p class="mut" style="padding:20px 0">Ton panier est vide.</p>';
  $("ct").innerHTML = cart.length ? `<div class="mut" style="font-size:13px">${left ? `Plus que ${euro(left)} pour la livraison offerte` : "Livraison offerte"}</div><div class="bar2"><i style="width:${Math.min(100, t.sub / FREE * 100)}%"></i></div><div class="tot"><span>Sous-total</span><span>${euro(t.sub)}</span></div><div class="tot"><span>Livraison</span><span>${t.ship ? euro(t.ship) : "Offerte"}</span></div><div class="tot g"><span>Total</span><span>${euro(t.sub + t.ship)}</span></div><button class="btn w" id="ord">Commander et payer</button>` : "";
}
$("cl").onclick = e => { const b = e.target.closest("button"); if (!b) return; const d = b.dataset; if (d.m !== undefined) { if (--cart[d.m].n <= 0) cart.splice(d.m, 1); } else if (d.p !== undefined) cart[d.p].n++; else if (d.x !== undefined) cart.splice(d.x, 1); else return; saveCart(); drawCart(); };
$("ct").onclick = e => { if (e.target.id === "ord") order(); };

/* ===== COMMANDE + PAYPAL ===== */
const payUrl = total => `https://www.paypal.com/paypalme/${PAYPAL}/${total.toFixed(2)}`;
async function order() {
  if (!cart.length) return;
  if (!user) { setMode("in"); open("auth"); return toast("Connecte-toi pour commander"); }
  if (!verified) { if (vs === "pending") return toast("Vérification en cours : attends la validation."); if (vs === "rejected") return toast("Vérification refusée : achat impossible.", "ko"); closeCart(); return openVerif(); }
  const b = $("ord"); b.disabled = true;
  try {
    const t = totals(), total = +(t.sub + t.ship).toFixed(2), ref = "VS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    await db.collection("orders").add({ uid: user.uid, email: user.email, items: cart.map(l => ({ id: l.id, name: byId(l.id).name, flav: l.flav, n: l.n, unit: +unit(l).toFixed(2) })), total, ref, paid: false, status: "nouvelle", createdAt: TS() });
    notify("Nouvelle commande (PayPal à vérifier)", 0x7c5cff, [{ name: "Référence", value: ref }, { name: "Client", value: String(user.email) }, { name: "Articles", value: cart.map(l => `${byId(l.id).name}${l.flav ? " (" + l.flav + ")" : ""} ×${l.n}`).join("\n").slice(0, 1000) || "—" }, { name: "Total à recevoir", value: euro(total) }]);
    cart = []; saveCart(); closeCart(); showPay(ref, total);
  } catch (e) { toast("Commande non envoyée : " + fbErr(e), "ko", 9000); b.disabled = false; }
}
function showPay(ref, total) {
  $("payb").innerHTML = `<h2>Paiement PayPal</h2><div class="code" style="font-size:28px;letter-spacing:2px">${euro(total)}</div><p class="mut">Commande enregistrée. Référence : <b style="color:var(--tx)">${ref}</b></p>
  <a class="btn w" target="_blank" rel="noopener" href="${payUrl(total)}">Payer ${euro(total)} avec PayPal</a>
  <ol class="mut" style="font-size:13px;margin-left:18px"><li>Pour payer par carte : installe PayPal et crée un compte.</li><li>Ajoute ta carte dans ton portefeuille PayPal.</li><li>Valide le montant exact et écris la référence <b>${ref}</b> dans la note.</li></ol>
  <p class="mut" style="font-size:12px">Ta commande est traitée dès que le paiement est reçu.</p>`;
  open("pay");
}

/* ===== COMPTE ===== */
let user = null, verified = false, vs = "", mode = "in", unsub = [], dashUnsub = [], vcode = "";
function setMode(m) { mode = m; $$(".tab").forEach(t => t.classList.toggle("on", t.dataset.m === m)); $("asub").textContent = m === "in" ? "Se connecter" : "Créer mon compte"; $("forgot").style.display = m === "in" ? "" : "none"; }
$$(".tab").forEach(t => t.onclick = () => setMode(t.dataset.m));
const run = async fn => { $("am").textContent = ""; try { await fn(); shut("auth"); } catch (e) { $("am").textContent = fbErr(e); } };
$("gG").onclick = () => run(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
$("gA").onclick = () => run(() => auth.signInWithPopup(new firebase.auth.OAuthProvider("apple.com")));
$("asub").onclick = () => run(() => mode === "in" ? auth.signInWithEmailAndPassword($("em").value.trim(), $("pw").value) : auth.createUserWithEmailAndPassword($("em").value.trim(), $("pw").value));
$("forgot").onclick = async () => { const m = $("em").value.trim(); if (!m) { $("am").textContent = "Entre ton email d'abord."; return; } try { await auth.sendPasswordResetEmail(m); toast("Email de réinitialisation envoyé", "ok"); } catch (x) { $("am").textContent = fbErr(x); } };
$("bAcc").onclick = () => { if (user) auth.signOut(); else { setMode("in"); open("auth"); } };
function chip() {
  const c = $("vchip"); if (!user) { c.style.display = "none"; return; } c.style.display = "";
  const [m, t] = verified ? ["ok", "✓ Âge vérifié"] : vs === "pending" ? ["wa", "Vérification en cours"] : vs === "rejected" ? ["ko", "Vérification refusée"] : ["wa", "À vérifier"];
  c.className = "chip " + m; c.textContent = t;
}
$("vchip").onclick = () => openVerif();
auth.onAuthStateChanged(u => {
  user = u; unsub.forEach(f => f()); unsub = []; dashUnsub.forEach(f => f()); dashUnsub = []; verified = false; vs = "";
  $("bAcc").textContent = u ? "Déconnexion" : "Connexion"; $("bDash").style.display = u && u.email === ADMIN ? "" : "none"; chip();
  if (!u) { if (location.hash === "#dash") { toast("Connecte-toi avec le compte admin"); setMode("in"); open("auth"); } return; }
  if (u.email === ADMIN && location.hash === "#dash") { history.replaceState(null, "", location.pathname); setTimeout(() => $("bDash").click(), 300); }
  unsub.push(db.doc("users/" + u.uid).onSnapshot(s => { verified = !!(s.exists && s.data().verified); chip(); }, e => console.error(e)));
  unsub.push(db.doc("verifications/" + u.uid).onSnapshot(s => { const n = s.exists ? s.data().status : ""; if (n === "approved" && vs && vs !== "approved") toast("Ton âge est vérifié ✓ Tu peux commander !", "ok", 7000); vs = n; chip(); }, e => console.error(e)));
});

/* ===== VÉRIFICATION ===== */
function openVerif() {
  if (!user) { setMode("in"); open("auth"); return toast("Connecte-toi ou crée un compte d'abord"); }
  if (verified) return toast("Ton âge est déjà vérifié ✓", "ok"); if (vs === "pending") return toast("Vérification déjà envoyée, en attente."); if (vs === "rejected") return toast("Vérification refusée.", "ko");
  vcode = (1000 + Math.random() * 9000 | 0) + Array.from({ length: 3 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.random() * 24 | 0]).join(""); $("code").textContent = vcode; open("idv");
}
$("bVerif").onclick = openVerif;
["1", "2"].forEach(n => $("f" + n).onchange = e => { const f = e.target.files[0], p = $("p" + n); if (f) { p.style.backgroundImage = `url(${URL.createObjectURL(f)})`; p.classList.add("ok"); p.textContent = "✓ Photo ajoutée"; } $("send").disabled = !($("f1").files[0] && $("f2").files[0]); });
const shrink = f => new Promise((res, rej) => {
  const im = new Image(), u = URL.createObjectURL(f);
  im.onload = () => { for (const [max, q] of [[1000, .72], [800, .6], [640, .5]]) { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); const d = c.toDataURL("image/jpeg", q); if (d.length < 430000 || max === 640) { URL.revokeObjectURL(u); return res(d); } } };
  im.onerror = () => rej(new Error("Photo illisible : essaie une autre photo (JPG ou PNG).")); im.src = u;
});
$("send").onclick = async () => {
  const b = $("send"); b.disabled = true; $("vm").textContent = "Envoi…";
  try {
    const idImg = await shrink($("f1").files[0]), selfieImg = await shrink($("f2").files[0]);
    await db.doc("verifications/" + user.uid).set({ uid: user.uid, email: user.email, code: vcode, idImg, selfieImg, status: "pending", createdAt: TS() });
    notify("Nouvelle vérification d'âge", 0xf59e0b, [{ name: "Email", value: String(user.email) }, { name: "Code sur le papier", value: "**" + vcode + "**" }]);
    $("vm").textContent = ""; shut("idv"); toast("Envoyé ✅ Tu seras averti dès la validation.", "ok", 6000);
  } catch (e) { $("vm").textContent = fbErr(e); b.disabled = false; }
};

/* ===== DASHBOARD ADMIN ===== */
$("bDash").onclick = () => {
  if (!user || user.email !== ADMIN) return; open("dash"); dashUnsub.forEach(f => f()); dashUnsub = [];
  const er = el => e => { $(el).innerHTML = `<p class="err">${esc(fbErr(e))}</p>`; };
  dashUnsub.push(db.collection("verifications").where("status", "==", "pending").onSnapshot(s => {
    $("dv").innerHTML = s.empty ? '<p class="mut">Aucune demande.</p>' : s.docs.map(d => { const v = d.data(); return `<div class="dr"><div><b>${esc(v.email)}</b> · code <b>${esc(v.code)}</b><div class="im">${["idImg", "selfieImg"].map(k => String(v[k] || "").startsWith("data:image/jpeg;base64,") ? `<img src="${v[k]}" alt="" title="Clique pour agrandir" onclick="this.classList.toggle('big')">` : "").join("")}</div></div><button class="btn ok" data-a="${d.id}">Accepter</button><button class="btn ko" data-r="${d.id}">Refuser</button></div>`; }).join("");
  }, er("dv")));
  dashUnsub.push(db.collection("orders").orderBy("createdAt", "desc").onSnapshot(s => {
    $("do").innerHTML = s.empty ? '<p class="mut">Aucune commande.</p>' : s.docs.map(d => { const o = d.data(); return `<div class="dr"><div><b>${esc(o.email)}</b> · ${euro(o.total || 0)} · <b>${esc(o.ref || "")}</b><br><small class="mut">${(o.items || []).map(i => esc(i.name || i.id) + (i.flav ? " (" + esc(i.flav) + ")" : "") + " ×" + i.n).join(", ")}</small><br><small>${o.paid ? "✅ payée" : "⏳ paiement PayPal à vérifier"}</small></div><span class="pill">${esc(o.status)}</span>${o.paid ? "" : `<button class="btn ok" data-paid="${d.id}">Paiement reçu</button>`}${o.status === "nouvelle" ? `<button class="btn alt" data-s="${d.id}">Expédiée</button>` : ""}</div>`; }).join("");
  }, er("do")));
};
$("dash").onclick = async e => {
  const b = e.target.closest("button"); if (!b) return; const d = b.dataset;
  try {
    if (d.a || d.r) { const id = d.a || d.r, ok = !!d.a; await db.doc("verifications/" + id).update({ status: ok ? "approved" : "rejected", idImg: firebase.firestore.FieldValue.delete(), selfieImg: firebase.firestore.FieldValue.delete() }); await db.doc("users/" + id).set({ verified: ok }, { merge: true }); toast(ok ? "Accepté ✓" : "Refusé", "ok"); }
    else if (d.paid) { await db.doc("orders/" + d.paid).update({ paid: true }); toast("Paiement confirmé ✓", "ok"); }
    else if (d.s) await db.doc("orders/" + d.s).update({ status: "expédiée" });
  } catch (x) { toast(fbErr(x), "ko", 8000); }
};

/* ===== FAQ ===== */
const QA = [
  ["Comment payer par carte bancaire ?", "Le paiement se fait avec PayPal :\n1. Installe l'application PayPal (ou va sur paypal.com).\n2. Crée un compte gratuit.\n3. Ajoute ta carte bancaire dans ton compte PayPal.\n4. Après ta commande, appuie sur « Payer avec PayPal » : le lien s'ouvre avec le montant exact.\n5. Valide et écris ta référence de commande (VS-XXXXX) dans la note."],
  ["Quand ma commande est-elle traitée ?", "Dès que ton paiement PayPal est reçu et contrôlé par l'équipe. Indique ta référence pour qu'on retrouve ta commande."],
  ["Mon paiement n'est pas pris en compte", "Vérifie que le montant est exact et que ta référence est dans la note PayPal. Le contrôle est fait à la main."],
  ["Pourquoi une vérification d'identité ?", "La vente aux mineurs est interdite. Avant ton premier achat, tu envoies une pièce d'identité (carte, passeport ou permis) et un selfie où tu tiens un papier avec un code."],
  ["Mes photos sont-elles conservées ?", "Les photos sont effacées dès que l'équipe accepte ou refuse la demande."],
  ["Ma vérification a été refusée", "Les achats sont alors impossibles avec ce compte."],
  ["Comment marchent les prix dégressifs ?", "Pour un même modèle : -6 % dès 3 pièces, -10 % dès 5, -15 % dès 10. Le prix se met à jour dans le panier."],
  ["Livraison et frais ?", "Livraison offerte dès 39 € d'achat, sinon 4,90 €."],
  ["Quelle nicotine contiennent les puffs ?", "Tous nos puffs sont dosés à 20 mg. La nicotine est très addictive : réservé aux adultes. Aide pour arrêter : Tabac Info Service 3989."],
  ["J'ai oublié mon mot de passe", "Dans « Connexion », entre ton email puis clique sur « Mot de passe oublié ? »."]
];
$("faqList").innerHTML = QA.map(q => `<div class="fq"><button class="qq">${esc(q[0])}<span>+</span></button><div class="aa"><p>${esc(q[1])}</p></div></div>`).join("");
$("faqList").onclick = e => { const b = e.target.closest(".qq"); if (!b) return; const f = b.parentElement, a = f.querySelector(".aa"), o = f.classList.toggle("open"); a.style.maxHeight = o ? a.scrollHeight + "px" : 0; };

const hv = $("hv"); hv.muted = true; hv.play().catch(() => {});
setMode("in"); render(); saveCart();
