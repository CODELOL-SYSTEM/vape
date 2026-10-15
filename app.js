const firebaseConfig = {
  apiKey: "AIzaSyAO3ZNx7hAFG_qH0BfeSUIMQsRfonH-LXw", authDomain: "vape-fc2ca.firebaseapp.com", projectId: "vape-fc2ca",
  storageBucket: "vape-fc2ca.firebasestorage.app", messagingSenderId: "826171627240", appId: "1:826171627240:web:68cb55f24238a68df29b5d", measurementId: "G-SCXPMEKRRJ"
};
const ADMIN_EMAIL = "pc2alex.les@gmail.com", FREE_FROM = 39, SHIPPING = 4.9;
let auth, db, storage, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, setDoc, getDoc, addDoc, collection, onSnapshot, query, where, orderBy, updateDoc, serverTimestamp, ref, uploadBytes, getDownloadURL;
const G = "https://www.gstatic.com/firebasejs/10.12.2/";
async function initFb() {
  const { initializeApp } = await import(G + "firebase-app.js");
  const A = await import(G + "firebase-auth.js"), F = await import(G + "firebase-firestore.js"), S = await import(G + "firebase-storage.js");
  const app = initializeApp(firebaseConfig);
  ({ onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = A);
  ({ doc, setDoc, getDoc, addDoc, collection, onSnapshot, query, where, orderBy, updateDoc, serverTimestamp } = F);
  ({ ref, uploadBytes, getDownloadURL } = S);
  auth = A.getAuth(app); db = F.getFirestore(app); storage = S.getStorage(app);
}
const $ = id => document.getElementById(id);
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const euro = n => n.toFixed(2).replace(".", ",") + " €";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* ===== PRODUITS (puffs uniquement, tous 20 mg de nicotine) ===== */
const E = "https://www.ecigplanete.com/", Lp = "https://cdn.lepetitfumeur.fr/";
const AEROX_PRICE = 13.9; // ⚠️ prix non donné : à corriger
const P = [
  { id: "falcon-x-28000", name: "JNR Falcon X 28000", price: 12.4, tag: "🔥 Best-seller",
    flav: ["Watermelon Ice", "Blueberry Sour Raspberry", "Strawberry Watermelon Ice", "Cherry Ice", "Peach Berry", "Black Dragon Ice", "Mixed Berries", "Fizzy Cherry Cola", "Watermelon Mango Peach", "Blueberry Raspberry Cherry", "Mango Passion Fruit", "Blackberry Red Raspberry", "Blueberry Pomegranate Ice", "Strawberry Kiwi", "Watermelon Bubble Gum", "Cherry Watermelon Freeze", "Luv 66", "Golden Dragon Ice"],
    img: [40787, 40795, 40786, 40788, 40789, 40790, 40791, 40792, 40793, 40794, 41876, 41877, 41878, 41879, 41880, 43265, 43266, 561365].map(i => `${E}${i}-large_default/puff-falcon-x-28000-jnr.jpg`),
    desc: "20 mg de nicotine · 28 000 bouffées · 950 mAh · Dual Mesh 1,2 ohm · Rechargeable · 22 ml." },
  { id: "joker-24k", name: "JNR Joker 24K", price: 12.9,
    flav: ["Cola", "Cerise", "Fraise"],
    img: ["https://www.eliquidandco.com/37636-thickbox_default/fizzy-cherry-cola.jpg", "https://www.eliquidandco.com/37907-large_default/mixed-berries-50ml.jpg", "https://www.eliquidandco.com/38519-large_default/fizzy-cherry-cola.jpg"],
    desc: "20 mg de nicotine · 24 000 bouffées · 3 goûts au choix." },
  { id: "aerox-32k", name: "JNR AeroX 32K", price: AEROX_PRICE,
    flav: ["Watermelon Ice", "Strawberry Ice", "Peach Berry", "Black Dragon Ice", "Mixed Berries", "Summer Peach Ice", "Passion Fruit Kiwi", "Watermelon Mango Peach", "Watermelon Bubble Gum"],
    img: [42178, 42168, 42169, 42170, 42171, 42172, 42173, 42174, 42175, 42176, 42177, 42179, 42180, 42181, 42182, 43595].map(i => `${E}${i}-large_default/puff-aero-x-32k-jnr.jpg`),
    desc: "20 mg de nicotine · 32 000 bouffées · Rechargeable." },
  { id: "falcon-gem-30k", name: "JNR Falcon Gem 30K", price: 14.9,
    flav: null,
    img: [...Array.from({ length: 11 }, (_, i) => 37250 + i), 38167, 38168, 38169, 40801, 40837].map(i => `${Lp}${i}-medium_default/puff-30k-falcon-gem-20-mg-jnr.jpg`),
    desc: "20 mg de nicotine · 30 000 bouffées · Rechargeable." },
  { id: "jnr-24k", name: "JNR 24K", price: 21.68,
    flav: ["Watermelon Ice", "Mexican Mango", "Cherry Ice", "Blue Razz Cherry"],
    img: ["https://puffsjnr.fr/wp-content/uploads/2025/12/jnr-24k-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/%E4%B8%BB%E5%9B%BE2-1-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/%E4%B8%BB%E5%9B%BE4-1-600x600.webp", "https://puffsjnr.fr/wp-content/uploads/2025/12/jnr-24000-puffs-600x600.webp"],
    desc: "20 mg de nicotine · 24 000 bouffées · 4 goûts au choix." }
];
P.forEach(p => { p.emoji = "💨"; p.tiers = { 3: +(p.price * 3 * .94).toFixed(2), 5: +(p.price * 5 * .9).toFixed(2), 10: +(p.price * 10 * .85).toFixed(2) }; });
const byId = id => P.find(p => p.id === id);

/* ===== ÉTAT ===== */
let vstatus = "", cart = JSON.parse(store.get("cart") || "[]").filter(l => byId(l.id)), user = null, verified = false, cur = null, qty = 1, vcode = "";
const ph = p => `style="background-image:url('${p.img[0]}')"`;
const open = id => $(id).classList.add("on"), shut = id => $(id).classList.remove("on");
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest(".ov").classList.remove("on"));

/* ===== ÂGE & COOKIES ===== */
const white = () => { document.body.innerHTML = '<div style="position:fixed;inset:0;background:#fff;color:#111;display:grid;place-items:center;font:600 26px system-ui;text-align:center;padding:20px">Revenez quand vous serez plus âgé.</div>'; setTimeout(() => location.replace("about:blank"), 3000); };
try { if (sessionStorage.getItem("minor")) { white(); throw 0; } } catch {}
if (store.get("age18") === "1") $("age")?.remove();
$("ageYes") && ($("ageYes").onclick = () => { store.set("age18", "1"); $("age").remove(); });
$("ageNo") && ($("ageNo").onclick = () => { try { sessionStorage.setItem("minor", "1"); } catch {} white(); });
if ($("cookie") && !store.get("cookies")) $("cookie").style.display = "flex";
$("ck1") && ($("ck1").onclick = () => { store.set("cookies", "yes"); $("cookie").style.display = "none"; });
$("ck0") && ($("ck0").onclick = () => { store.set("cookies", "no"); $("cookie").style.display = "none"; });

/* ===== CATALOGUE ===== */
function render() {
  const q = norm($("q").value);
  let l = P.filter(p => !q || norm(p.name + " " + (p.flav || []).join(" ")).includes(q));
  if ($("sort").value) l.sort((a, b) => $("sort").value === "a" ? a.price - b.price : b.price - a.price);
  $("count").textContent = `${l.length} puffs · 20 mg nicotine`;
  $("grid").innerHTML = l.map(p => `<div class="card" data-id="${p.id}"><div class="ph" ${ph(p)}></div>${p.tag ? `<span class="tag">${p.tag}</span>` : ""}<div class="in"><small>Puff${p.flav ? " · " + p.flav.length + " goûts" : ""}</small><h3>${esc(p.name)}</h3><div class="price">${euro(p.price)}</div></div></div>`).join("");
  document.querySelectorAll(".card").forEach(c => c.onclick = () => showP(c.dataset.id));
}
$("q").oninput = $("sort").onchange = render;

function showP(id) {
  cur = byId(id); qty = 1;
  const p = cur;
  $("pmb").innerHTML = `<div class="pm"><div><div class="main" id="mn" ${ph(p)}></div>${p.img.length > 1 ? `<div class="th">${p.img.map(u => `<div data-u="${u}" style="background-image:url('${u}')"></div>`).join("")}</div>` : ""}</div>
  <div class="stack"><small class="mut">Puff · 20 mg nicotine</small><h2>${esc(p.name)}</h2><div class="price" style="font-size:28px">${euro(p.price)} <small class="mut" style="font-size:12px">TTC</small></div><p class="mut">${esc(p.desc)}</p>
  ${p.flav ? `<label>Goût<select id="fv">${p.flav.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join("")}</select></label>` : ""}
  <div class="tiers">${[[1, p.price], [3, p.tiers[3]], [5, p.tiers[5]], [10, p.tiers[10]]].map(([n, t]) => `<div class="tier ${n === 1 ? "on" : ""}" data-n="${n}"><b>×${n}</b><br>${euro(t)}<br><small class="mut">${euro(t / n)}/u</small></div>`).join("")}</div>
  <button class="btn" id="add" style="width:100%">Ajouter au panier</button></div></div>`;
  document.querySelectorAll("[data-u]").forEach(d => d.onclick = () => { $("mn").style.backgroundImage = `url('${d.dataset.u}')`; });
  document.querySelectorAll(".tier").forEach(t => t.onclick = () => { qty = +t.dataset.n; document.querySelectorAll(".tier").forEach(x => x.classList.toggle("on", x === t)); });
  $("add").onclick = () => { addCart(p.id, p.flav ? $("fv").value : "", qty); shut("pm"); $("cart").classList.add("on"); drawCart(); };
  open("pm");
}

/* ===== PANIER ===== */
const unit = (p, n) => n >= 10 ? p.tiers[10] / 10 : n >= 5 ? p.tiers[5] / 5 : n >= 3 ? p.tiers[3] / 3 : p.price;
function addCart(id, flav, n) { const l = cart.find(x => x.id === id && x.flav === flav); l ? l.n += n : cart.push({ id, flav, n }); save(); }
function save() { store.set("cart", JSON.stringify(cart)); $("cn").textContent = cart.reduce((s, l) => s + l.n, 0); }
function totals() { const sub = cart.reduce((s, l) => { const p = byId(l.id), tot = cart.filter(x => x.id === l.id).reduce((a, x) => a + x.n, 0); return s + unit(p, tot) * l.n; }, 0); return { sub, ship: !cart.length || sub >= FREE_FROM ? 0 : SHIPPING }; }
function drawCart() {
  $("cl").innerHTML = cart.length ? cart.map((l, i) => `<div class="row"><div><b>${esc(byId(l.id).name)}</b><br><small class="mut">${esc(l.flav)}</small></div><button class="btn alt" data-m="${i}">−</button>${l.n}<button class="btn alt" data-p="${i}">+</button></div>`).join("") : '<p class="mut">Votre panier est vide.</p>';
  document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { const l = cart[b.dataset.m]; if (--l.n <= 0) cart.splice(b.dataset.m, 1); save(); drawCart(); });
  document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { cart[b.dataset.p].n++; save(); drawCart(); });
  const t = totals();
  $("ct").innerHTML = `<div class="row"><div>Sous-total</div>${euro(t.sub)}</div><div class="row"><div>Livraison</div>${t.ship ? euro(t.ship) : "Offerte"}</div><div class="row"><div><b>Total</b></div><b>${euro(t.sub + t.ship)}</b></div><button class="btn" id="ord" style="width:100%">Commander</button>`;
  $("ord").onclick = order;
}
$("bCart").onclick = () => { $("cart").classList.add("on"); drawCart(); };
$("cx").onclick = () => $("cart").classList.remove("on");

async function order() {
  if (!cart.length) return;
  if (!user) { open("auth"); return; }
  if (!verified && vstatus === "pending") { alert("Votre vérification est en cours : attendez la validation."); return; }
  if (!verified && vstatus === "rejected") { alert("Votre vérification a été refusée : achat impossible."); return; }
  if (!verified) { vcode = Math.floor(1000 + Math.random() * 9000) + Array.from({ length: 3 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.random() * 24 | 0]).join(""); $("code").textContent = vcode; open("idv"); return; }
  const t = totals();
  await addDoc(collection(db, "orders"), { uid: user.uid, email: user.email, items: cart, total: +(t.sub + t.ship).toFixed(2), status: "nouvelle", createdAt: serverTimestamp() });
  cart = []; save(); drawCart(); alert("Commande envoyée ✅ Merci !");
}

/* ===== AUTH ===== */
$("bAcc").onclick = () => user ? signOut(auth) : open("auth");
const run = async fn => { try { await fn(); shut("auth"); } catch (e) { $("am").textContent = e.message; } };
$("gG").onclick = () => run(() => signInWithPopup(auth, new GoogleAuthProvider()));
$("gA").onclick = () => run(() => signInWithPopup(auth, new OAuthProvider("apple.com")));
$("li").onclick = () => run(() => signInWithEmailAndPassword(auth, $("em").value, $("pw").value));
$("su").onclick = () => run(() => createUserWithEmailAndPassword(auth, $("em").value, $("pw").value));
let unsubs = [];
initFb().then(() => onAuthStateChanged(auth, async u => {
  user = u; unsubs.forEach(f => f()); unsubs = [];
  $("bAcc").textContent = u ? "Déconnexion" : "Connexion";
  $("bDash").style.display = u && u.email === ADMIN_EMAIL ? "" : "none";
  verified = false; vstatus = "";
  if (u) { try { const s = await getDoc(doc(db, "users", u.uid)); verified = !!(s.exists() && s.data().verified); const v = await getDoc(doc(db, "verifications", u.uid)); vstatus = v.exists() ? v.data().status : ""; } catch (e) { console.error(e); } }
})).catch(e => console.error("Firebase:", e));

/* ===== VÉRIFICATION IDENTITÉ ===== */
$("send").onclick = async () => {
  const a = $("f1").files[0], b = $("f2").files[0];
  if (!a || !b) { $("vm").textContent = "Ajoutez les 2 photos."; return; }
  $("vm").textContent = "Envoi…";
  try {
    const up = async (f, n) => { const r = ref(storage, `verifications/${user.uid}/${n}`); await uploadBytes(r, f); return getDownloadURL(r); };
    const [idUrl, selfieUrl] = [await up(a, "id"), await up(b, "selfie")];
    await setDoc(doc(db, "verifications", user.uid), { uid: user.uid, email: user.email, code: vcode, idUrl, selfieUrl, status: "pending", createdAt: serverTimestamp() });
    vstatus = "pending"; $("vm").textContent = "Envoyé ✅ Vous serez averti après validation.";
  } catch (e) { $("vm").textContent = e.message; }
};

/* ===== DASHBOARD ADMIN (UNIQUEMENT pc2alex.les@gmail.com) ===== */
$("bDash").onclick = () => {
  if (!user || user.email !== ADMIN_EMAIL) return;
  open("dash");
  unsubs.push(onSnapshot(query(collection(db, "verifications"), where("status", "==", "pending")), s => {
    $("dv").innerHTML = s.empty ? '<p class="mut">Aucune demande.</p>' : s.docs.map(d => { const v = d.data(); return `<div class="row"><div><b>${esc(v.email)}</b> · code <b>${esc(v.code)}</b><br><a href="${v.idUrl}" target="_blank" style="color:var(--acc2)">Pièce d'identité</a> · <a href="${v.selfieUrl}" target="_blank" style="color:var(--acc2)">Selfie</a></div><button class="btn ok" data-a="${d.id}">Accepter</button><button class="btn ko" data-r="${d.id}">Refuser</button></div>`; }).join("");
    document.querySelectorAll("[data-a]").forEach(b => b.onclick = async () => { await updateDoc(doc(db, "verifications", b.dataset.a), { status: "approved" }); await setDoc(doc(db, "users", b.dataset.a), { verified: true }, { merge: true }); });
    document.querySelectorAll("[data-r]").forEach(b => b.onclick = async () => { await updateDoc(doc(db, "verifications", b.dataset.r), { status: "rejected" }); await setDoc(doc(db, "users", b.dataset.r), { verified: false }, { merge: true }); });
  }));
  unsubs.push(onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), s => {
    $("do").innerHTML = s.empty ? '<p class="mut">Aucune commande.</p>' : s.docs.map(d => { const o = d.data(); return `<div class="row"><div><b>${esc(o.email)}</b> · ${euro(o.total)}<br><small class="mut">${o.items.map(i => esc(byId(i.id)?.name || i.id) + (i.flav ? " (" + esc(i.flav) + ")" : "") + " ×" + i.n).join(", ")}</small></div><span class="pill">${esc(o.status)}</span></div>`; }).join("");
  }));
};

render(); save();
