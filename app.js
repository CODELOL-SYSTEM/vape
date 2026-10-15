import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, onSnapshot, query, where, orderBy, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAO3ZNx7hAFG_qH0BfeSUIMQsRfonH-LXw", authDomain: "vape-fc2ca.firebaseapp.com", projectId: "vape-fc2ca",
  storageBucket: "vape-fc2ca.firebasestorage.app", messagingSenderId: "826171627240", appId: "1:826171627240:web:68cb55f24238a68df29b5d", measurementId: "G-SCXPMEKRRJ"
};
const ADMIN_EMAIL = "pc2alex.les@gmail.com", FREE_FROM = 39, SHIPPING = 3.9;
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app), storage = getStorage(app);
const $ = id => document.getElementById(id);
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const euro = n => n.toFixed(2).replace(".", ",") + " €";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* ===== PRODUITS ===== */
const FL = ["Berry Passion Tangy Fizz","Black Dragon Ice","Blackberry Red Raspberry","Blue Razz Cherry","Blue Razz Ice","Blueberry Kiwi","Blueberry Pomegranate Ice","Blueberry Raspberry Cherry","Blueberry Red Raspberry","Cherry","Cherry Berry","Cherry Lemon","Cherry Strawberry Raspberry","Cherry Watermelon Freeze","Cola Ice","Dragon Fruit","Fabublue","Fizzy Cherry Cola","Fizzy Strawberry Strips","Fresh Strawberry","Frosted Mint Burst","Grapefruit Lemonade Ice","Green Apple Peach Pear","Hawaii","Hubba Bubba Strawberry","Juicy Peaches","Kiwi Passion Fruit Guava","Love 66","Mango Passion Fruit","Mi Amor","Peach Berry","Raspberry Rhubarb","Red Punch","Sakura Grape","Sour Cherry Gummy","Sparkling Cherry","Strawberry Apple Pear","Strawberry Banana","Strawberry Ice","Strawberry Kiwi","Strawberry Pinacolada","Strawberry Red Bull","Strawberry Watermelon Ice","Summer Peach Ice","Tiger Blood","Tropicana Zest","VC Boost","Watermelon Mango Peach","White Peach Razz","Zesty Marmalade Crunch"];
const U = "https://jnr16k.fr/wp-content/uploads/2026/07/JNR-Falcon-16K-Showcase-";
const TIPS = {
  Puffs: "Préférez un modèle à faible taux de nicotine (ou 0 mg) et fixez-vous une limite de bouffées par jour.",
  "E-liquides": "Les e-liquides en 3 ou 6 mg sont plus doux que les 20 mg des jetables ; baissez progressivement.",
  Kits: "Un kit rechargeable est plus économique et réduit les déchets par rapport aux jetables.",
  Chicha: "La chicha classique brûle du charbon (monoxyde de carbone). Les alternatives électroniques évitent la combustion.",
  Accessoires: "Changez vos résistances/coton régulièrement pour une vape plus propre."
};
const P = [{ id: "jnr-falcon-16k", name: "JNR Falcon 16K", cat: "Puffs", price: 12.9, tiers: { 3: 36.38, 5: 58.05, 10: 108.36 }, flav: FL, tag: "🔥 Best-seller",
  img: ["Main", "01", "02", "03", "04", "05", "06", "07"].map(s => U + s + ".webp").concat("https://jnr16k.fr/wp-content/uploads/2026/06/jnr-falcon-16k-emballer.webp"),
  video: "https://jnr16k.fr/wp-content/uploads/2026/06/JNR-Falcon-16K-Showcase.mp4", emoji: "💨",
  desc: "Puffs rechargeable jusqu'à 16 000 bouffées, écran de contrôle, 48 saveurs au choix. Choisissez votre goût dans la liste déroulante.", alt: "kit-pod-debutant" }];
// Lignes à variantes : [nom, catégorie, prix, emoji, nb goûts, décalage, description]
[["Elfbar BC5000","Puffs",9.9,"💨",12,0],["Lost Mary BM600","Puffs",6.9,"💨",12,4],["Geek Bar Pulse 15K","Puffs",12.5,"💨",12,9],["Vozol Star 20K","Puffs",13.9,"💨",12,14],["Puff Flex 2800","Puffs",8.5,"💨",10,20],["Crystal Pro Max 4000","Puffs",8.9,"💨",10,26],["Puffmi Max 9K","Puffs",10.9,"💨",10,31],["Liquideo Fruits 50ml","E-liquides",8.9,"🧪",12,2],["Fuu Shortfill 50ml","E-liquides",9.5,"🧪",10,12],["Sels de nicotine 10ml","E-liquides",3.9,"🧪",12,18],["Base 0 mg DIY 100ml","E-liquides",12.9,"🧪",6,22],["Chicha électronique Fumytech","Chicha",14.9,"🌫️",10,3],["Pods Vuse compatibles ×2","Accessoires",6.5,"🔋",8,10],["Pods Aspire Vilter ×2","Accessoires",7.9,"🔋",8,16]]
  .forEach(([name, cat, price, emoji, n, o]) => P.push({ id: norm(name).replace(/\W+/g, "-"), name, cat, price, emoji, flav: Array.from({ length: n }, (_, i) => FL[(o + i) % FL.length]), img: [], tiers: { 3: +(price * 3 * .94).toFixed(2), 5: +(price * 5 * .9).toFixed(2), 10: +(price * 10 * .85).toFixed(2) }, desc: `${name} : qualité constante, ${n} saveurs, livraison rapide. Description détaillée à personnaliser.`, alt: cat === "Puffs" ? "base-0-mg-diy-100ml" : null }));
// Produits simples (sans goût)
[["Kit Pod Débutant 800 mAh","Kits",19.9,"🔌"],["Kit Aspire Vilter Pro","Kits",24.9,"🔌"],["Kit Vaporesso Xros 3","Kits",27.9,"🔌"],["Kit Smok Novo 5","Kits",22.9,"🔌"],["Kit Geekvape Wenax","Kits",25.9,"🔌"],["Kit Innokin Endura T18","Kits",21.9,"🔌"],["Résistances Xros ×4","Accessoires",9.9,"🔧"],["Coton Cotton Bacon","Accessoires",5.9,"🔧"],["Câble USB-C charge rapide","Accessoires",3.9,"🔌"],["Pack 5 Pods Xros","Accessoires",11.9,"🔋"],["Tuyau chicha silicone","Chicha",9.9,"🌫️"],["Chicha complète 45 cm","Chicha",39.9,"🌫️"],["Charbon naturel 1 kg","Chicha",7.9,"🌫️"],["Cheminée chicha alu","Chicha",5.9,"🌫️"],["Embout chicha ×5","Chicha",4.9,"🌫️"]]
  .forEach(([name, cat, price, emoji]) => P.push({ id: norm(name).replace(/\W+/g, "-"), name, cat, price, emoji, flav: null, img: [], tiers: { 3: +(price * 3 * .95).toFixed(2), 5: +(price * 5 * .92).toFixed(2), 10: +(price * 10 * .88).toFixed(2) }, desc: `${name} : description à personnaliser.` }));
P.forEach(p => p.tip = p.tip || TIPS[p.cat]);
const byId = id => P.find(p => p.id === id);

/* ===== ÉTAT ===== */
let cat = "Tous", cart = JSON.parse(store.get("cart") || "[]"), user = null, verified = false, cur = null, qty = 1, vcode = "";
const hue = s => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const ph = (p, big) => p.img[0] ? `style="background-image:url('${p.img[0]}')"` : `style="background:linear-gradient(135deg,hsl(${hue(p.name)},70%,35%),hsl(${hue(p.name) + 50},70%,20%))"`;
const open = id => $(id).classList.add("on"), shut = id => $(id).classList.remove("on");
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest(".ov").classList.remove("on"));

/* ===== ÂGE & COOKIES ===== */
if (store.get("age18") === "1") $("age").remove();
$("ageYes").onclick = () => { store.set("age18", "1"); $("age").remove(); };
$("ageNo").onclick = () => $("ageMsg").textContent = "Désolé, l'accès est réservé aux majeurs.";
if (!store.get("cookies")) $("cookie").style.display = "flex";
$("ck1").onclick = () => { store.set("cookies", "yes"); $("cookie").style.display = "none"; };
$("ck0").onclick = () => { store.set("cookies", "no"); $("cookie").style.display = "none"; };

/* ===== CATALOGUE ===== */
const cats = ["Tous", ...new Set(P.map(p => p.cat))];
function render() {
  $("chips").innerHTML = cats.map(c => `<button class="chip ${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { cat = b.dataset.c; render(); });
  const q = norm($("q").value);
  let l = P.filter(p => (cat === "Tous" || p.cat === cat) && (!q || norm(p.name + " " + (p.flav || []).join(" ")).includes(q)));
  if ($("sort").value) l.sort((a, b) => $("sort").value === "a" ? a.price - b.price : b.price - a.price);
  const variants = l.reduce((s, p) => s + (p.flav ? p.flav.length : 1), 0);
  $("count").textContent = `${l.length} produits · ${variants} références`;
  $("grid").innerHTML = l.map(p => `<div class="card" data-id="${p.id}"><div class="ph" ${ph(p)}>${p.img[0] ? "" : p.emoji}</div>${p.tag ? `<span class="tag">${p.tag}</span>` : ""}<div class="in"><small>${p.cat}${p.flav ? " · " + p.flav.length + " goûts" : ""}</small><h3>${esc(p.name)}</h3><div class="price">${euro(p.price)}</div></div></div>`).join("");
  document.querySelectorAll(".card").forEach(c => c.onclick = () => showP(c.dataset.id));
}
$("q").oninput = $("sort").onchange = render;

function showP(id) {
  cur = byId(id); qty = 1;
  const p = cur, alt = p.alt && byId(p.alt);
  $("pmb").innerHTML = `<div class="pm"><div><div class="main" id="mn" ${ph(p)}>${p.img[0] ? "" : p.emoji}</div>${p.img.length > 1 ? `<div class="th">${p.img.map(u => `<div data-u="${u}" style="background-image:url('${u}')"></div>`).join("")}</div>` : ""}${p.video ? `<video src="${p.video}" controls muted playsinline></video>` : ""}</div>
  <div class="stack"><small class="mut">${p.cat}</small><h2>${esc(p.name)}</h2><div class="price" style="font-size:28px">${euro(p.price)} <small class="mut" style="font-size:12px">TTC</small></div><p class="mut">${esc(p.desc)}</p>
  ${p.flav ? `<label>Goût<select id="fv">${p.flav.map(f => `<option>${esc(f)}</option>`).join("")}</select></label>` : ""}
  <div class="tiers" id="tr">${[[1, p.price], [3, p.tiers[3]], [5, p.tiers[5]], [10, p.tiers[10]]].map(([n, t]) => `<div class="tier ${n === 1 ? "on" : ""}" data-n="${n}"><b>×${n}</b><br>${euro(t)}<br><small class="mut">${euro(t / n)}/u</small></div>`).join("")}</div>
  <div class="tip">💚 <b>Conseil santé :</b> ${esc(p.tip || "")}${alt ? `<br>👉 Alternative : <a href="#" id="altl" style="color:var(--acc2)">${esc(alt.name)}</a>` : ""}</div>
  <button class="btn" id="add" style="width:100%">Ajouter au panier</button></div></div>`;
  document.querySelectorAll("[data-u]").forEach(d => d.onclick = () => { $("mn").style.backgroundImage = `url('${d.dataset.u}')`; });
  document.querySelectorAll(".tier").forEach(t => t.onclick = () => { qty = +t.dataset.n; document.querySelectorAll(".tier").forEach(x => x.classList.toggle("on", x === t)); });
  if (alt) $("altl").onclick = e => { e.preventDefault(); showP(alt.id); };
  $("add").onclick = () => { addCart(p.id, p.flav ? $("fv").value : "", qty); shut("pm"); open("cart"); $("cart").classList.add("on"); drawCart(); };
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
onAuthStateChanged(auth, async u => {
  user = u; unsubs.forEach(f => f()); unsubs = [];
  $("bAcc").textContent = u ? "Déconnexion" : "Connexion";
  $("bDash").style.display = u && u.email === ADMIN_EMAIL ? "" : "none";
  verified = false;
  if (u) { const s = await getDoc(doc(db, "users", u.uid)); verified = !!(s.exists() && s.data().verified); }
});

/* ===== VÉRIFICATION IDENTITÉ ===== */
$("send").onclick = async () => {
  const a = $("f1").files[0], b = $("f2").files[0];
  if (!a || !b) { $("vm").textContent = "Ajoutez les 2 photos."; return; }
  $("vm").textContent = "Envoi…";
  try {
    const up = async (f, n) => { const r = ref(storage, `verifications/${user.uid}/${n}`); await uploadBytes(r, f); return getDownloadURL(r); };
    const [idUrl, selfieUrl] = [await up(a, "id"), await up(b, "selfie")];
    await setDoc(doc(db, "verifications", user.uid), { uid: user.uid, email: user.email, code: vcode, idUrl, selfieUrl, status: "pending", createdAt: serverTimestamp() });
    $("vm").textContent = "Envoyé ✅ Vous serez averti après validation.";
  } catch (e) { $("vm").textContent = e.message; }
};

/* ===== DASHBOARD ADMIN (UNIQUEMENT pc2alex.les@gmail.com) ===== */
$("bDash").onclick = () => {
  if (!user || user.email !== ADMIN_EMAIL) return;
  open("dash");
  unsubs.push(onSnapshot(query(collection(db, "verifications"), where("status", "==", "pending")), s => {
    $("dv").innerHTML = s.empty ? '<p class="mut">Aucune demande.</p>' : s.docs.map(d => { const v = d.data(); return `<div class="row"><div><b>${esc(v.email)}</b> · code <b>${esc(v.code)}</b><br><a href="${v.idUrl}" target="_blank" style="color:var(--acc2)">Pièce d'identité</a> · <a href="${v.selfieUrl}" target="_blank" style="color:var(--acc2)">Selfie</a></div><button class="btn ok" data-a="${d.id}">Accepter</button><button class="btn ko" data-r="${d.id}">Refuser</button></div>`; }).join("");
    document.querySelectorAll("[data-a]").forEach(b => b.onclick = async () => { await updateDoc(doc(db, "verifications", b.dataset.a), { status: "approved" }); await setDoc(doc(db, "users", b.dataset.a), { verified: true }, { merge: true }); });
    document.querySelectorAll("[data-r]").forEach(b => b.onclick = () => updateDoc(doc(db, "verifications", b.dataset.r), { status: "rejected" }));
  }));
  unsubs.push(onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), s => {
    $("do").innerHTML = s.empty ? '<p class="mut">Aucune commande.</p>' : s.docs.map(d => { const o = d.data(); return `<div class="row"><div><b>${esc(o.email)}</b> · ${euro(o.total)}<br><small class="mut">${o.items.map(i => esc(byId(i.id)?.name || i.id) + (i.flav ? " (" + esc(i.flav) + ")" : "") + " ×" + i.n).join(", ")}</small></div><span class="pill">${esc(o.status)}</span></div>`; }).join("");
  }));
};

render(); save();
