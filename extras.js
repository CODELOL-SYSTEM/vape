/* extras.js — à charger APRÈS app.js : <script src="extras.js" defer></script> */
(() => {
const PAYPAL_USER = "SH0PNOVA"; // nom PayPal.Me (avec un zéro) : https://www.paypal.com/paypalme/SH0PNOVA/MONTANT
const D = { theme: "light", accent: "#fa2d4e", font: "sys", size: 100, lang: "fr", anim: true, d3: true };
let S; try { S = { ...D, ...JSON.parse(localStorage.getItem("settings") || "{}") }; } catch { S = { ...D }; }
const save = () => { try { localStorage.setItem("settings", JSON.stringify(S)); } catch {} };
const T = (f, e) => S.lang === "en" ? e : f;
const FONTS = { sys: ['system-ui,"Segoe UI",sans-serif', "Standard", "Standard"], round: ['"Trebuchet MS",Verdana,sans-serif', "Arrondie", "Rounded"], serif: ['Georgia,"Times New Roman",serif', "Élégante", "Serif"], mono: ['Consolas,"Courier New",monospace', "Machine", "Mono"], read: ["Verdana,Tahoma,sans-serif", "Lisible", "Readable"] };
const ACC = ["#fa2d4e", "#7c5cff", "#00a58e", "#ff7a1a", "#2f6bff"];

/* ---------- Style boutique + thèmes ---------- */
document.head.insertAdjacentHTML("beforeend", `<style>
body,h1,h2,h3,.logo,.price,button,input,select{font-family:var(--ff)!important}
html[data-theme=light]{--bg:#f5f5f5;--card:#fffffff0;--sol:#fff;--line:#0000001c;--tx:#111;--mut:#6b6b6b}
html[data-theme=light] header{background:#fffffff2}html[data-theme=light] input,html[data-theme=light] select{background:#fff;color:#111}
html[data-theme=light] .bgfx,html[data-theme=light] #glow{display:none}html[data-theme=light] .ph,html[data-theme=light] .pv{background:#fff}
html[data-theme=light] .logo{color:#111}html[data-theme=light] .tab,html[data-theme=light] .tabs,html[data-theme=light] .qty button,html[data-theme=light] .qb button{background:#f0f0f0}
html[data-theme=light] .ov{background:#0007}html[data-theme=light] .toast{background:#fff}html[data-theme=light] .btn.alt{color:#111}
.logo{text-transform:uppercase;letter-spacing:1px}.promo{background:var(--a);animation:none}
.price,.card .price{color:var(--a)}.card{border-radius:8px}.glare{display:none}.card .in h3{font-size:14px;font-weight:500}
.grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}@media(max-width:560px){.grid{grid-template-columns:1fr 1fr;gap:10px}}
.qa{background:#111;border-radius:50%;color:#fff}.qa:hover{background:var(--a)}.disc{position:absolute;left:0;bottom:10px;background:var(--a);color:#fff;font-size:11px;font-weight:700;padding:3px 9px;border-radius:0 99px 99px 0;animation:pulse2 2.4s infinite}
@keyframes pulse2{50%{transform:scale(1.07)}}.fs{font-size:11px;color:var(--mut);margin-top:6px}
.card .shot{transition:transform .35s}.btn{border-radius:6px}.btn::after{display:none}
.ripple{position:absolute;border-radius:50%;background:#fff6;transform:scale(0);animation:rp .6s;pointer-events:none}@keyframes rp{to{transform:scale(4);opacity:0}}
#bSet{position:fixed;right:14px;bottom:14px;z-index:55;width:48px;height:48px;border-radius:50%;background:var(--a);color:#fff;font-size:22px;box-shadow:0 8px 24px -6px var(--a);transition:.4s}#bSet:hover{transform:rotate(120deg) scale(1.1)}
.sr{margin:14px 0}.sg{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.sr input[type=range]{padding:0;accent-color:var(--a)}
.fq .aa p{white-space:pre-line}#fsrch{margin:0 0 14px}.pay li{margin:6px 0 6px 18px}.noanim *,.noanim *::before,.noanim *::after{animation:none!important;transition:none!important}.noanim .rv{opacity:1!important}.no3d .stage{display:none}
</style>`);

/* ---------- Application des réglages ---------- */
const I18N = [["nav a[href='#shop']", "Shop"], ["nav a[href='#how']", "How to order"], ["nav a[href='#faq']", "FAQ"], ["#shop h2", "Our puffs"], ["#how h2", "How to order"], [".hero p.sub", "The whole range in 20 mg nicotine, tiered prices. Delivery in France, age check required."], [".hero a.btn", "See the puffs"], ["#bVerif", "Verify my age"], [".promo", "Free delivery from €39 · Tiered prices from 3 items · Adults only"], [".step h3", "Create your account", 0], [".step h3", "Verify your age", 1], [".step h3", "Order", 2], [".step p", "Email, Google or Apple.", 0], [".step p", "ID + selfie with a code, before your first purchase.", 1], [".step p", "Pay with PayPal, then we ship in France.", 2]];
function apply() {
  const dark = S.theme === "dark" || (S.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches), r = document.documentElement;
  r.dataset.theme = dark ? "dark" : "light"; r.lang = S.lang; r.style.setProperty("--a", S.accent); r.style.setProperty("--b", `color-mix(in srgb,${S.accent} 65%,#000)`); r.style.setProperty("--ff", FONTS[S.font][0]);
  document.body.style.zoom = S.size / 100; document.body.classList.toggle("noanim", !S.anim); document.body.classList.toggle("no3d", !S.d3);
  I18N.forEach(([sel, en, i = 0]) => { const el = $$(sel)[i]; if (!el) return; if (el.dataset.fr === undefined) el.dataset.fr = el.textContent; el.textContent = S.lang === "en" ? en : el.dataset.fr; });
  faq(); $$("#grid .fs").forEach(f => f.textContent = T("Livraison offerte dès 39 €", "Free shipping from €39"));
}
const _s3 = scene3d; scene3d = (...a) => S.d3 ? _s3(...a) : null;

/* ---------- Panneau paramètres ---------- */
document.body.insertAdjacentHTML("beforeend", '<button id="bSet" aria-label="Paramètres">⚙</button><div class="ov" id="set"><div class="box s"><button class="x" aria-label="Fermer">✕</button><div id="setb"></div></div></div>');
const seg = (k, o) => `<div class="sg">${o.map(([v, l]) => `<button class="fc ${String(S[k]) === String(v) ? "on" : ""}" data-k="${k}" data-v="${v}">${l}</button>`).join("")}</div>`;
const row = (l, i) => `<div class="sr"><div class="lbl">${l}</div>${i}</div>`;
function panel() {
  $("setb").innerHTML = `<h2>⚙ ${T("Paramètres", "Settings")}</h2>` +
    row(T("Thème", "Theme"), seg("theme", [["light", T("Clair", "Light")], ["dark", T("Sombre", "Dark")], ["auto", "Auto"]])) +
    row(T("Couleur", "Color"), `<div class="sg">${ACC.map(c => `<button class="sw ${S.accent === c ? "on" : ""}" data-k="accent" data-v="${c}" style="--c:${c}" aria-label="${c}"></button>`).join("")}</div>`) +
    row(T("Police du texte", "Font"), seg("font", Object.entries(FONTS).map(([k, v]) => [k, S.lang === "en" ? v[2] : v[1]]))) +
    row(`${T("Taille du texte", "Text size")} : ${S.size} %`, `<input type="range" id="fsz" min="85" max="130" step="5" value="${S.size}">`) +
    row(T("Langue", "Language"), seg("lang", [["fr", "Français"], ["en", "English"]])) +
    row(T("Animations", "Animations"), seg("anim", [[true, T("Oui", "On")], [false, T("Non", "Off")]])) +
    row("3D", seg("d3", [[true, T("Oui", "On")], [false, T("Non", "Off")]])) +
    `<button class="btn alt w" id="srst">${T("Réinitialiser", "Reset")}</button>`;
}
$("bSet").onclick = () => { panel(); open("set"); };
$("set").onclick = e => {
  if (e.target === $("set") || e.target.closest(".x")) return shut("set");
  if (e.target.id === "srst") { S = { ...D }; save(); apply(); return panel(); }
  const b = e.target.closest("[data-k]"); if (!b) return; let v = b.dataset.v; if (v === "true" || v === "false") v = v === "true";
  S[b.dataset.k] = v; save(); apply(); panel();
};
$("set").oninput = e => { if (e.target.id === "fsz") { S.size = +e.target.value; save(); apply(); e.target.closest(".sr").querySelector(".lbl").textContent = `${T("Taille du texte", "Text size")} : ${S.size} %`; } };
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => S.theme === "auto" && apply());

/* ---------- FAQ ---------- */
const QA = [
  ["Comment payer par carte bancaire ?", "How do I pay by card?", "Le paiement se fait avec PayPal :\n1. Installe l'application PayPal (ou va sur paypal.com).\n2. Crée un compte gratuit.\n3. Ajoute ta carte bancaire dans ton compte PayPal (Portefeuille).\n4. Après ta commande, appuie sur « Payer avec PayPal » : le lien s'ouvre avec le montant exact.\n5. Valide et note ta référence de commande (VS-XXXXX) dans le message.", "Payment is made with PayPal:\n1. Install the PayPal app (or go to paypal.com).\n2. Create a free account.\n3. Add your bank card to your PayPal wallet.\n4. After ordering, tap “Pay with PayPal”: the link opens with the exact amount.\n5. Confirm and put your order reference (VS-XXXXX) in the note."],
  ["Quand ma commande est-elle traitée ?", "When is my order processed?", "Dès que ton paiement PayPal est reçu et contrôlé par l'équipe. Pense à indiquer ta référence pour qu'on retrouve ta commande.", "As soon as your PayPal payment is received and checked by the team. Add your reference so we can match your order."],
  ["Mon paiement n'est pas pris en compte", "My payment isn't recognised", "Vérifie que le montant est exact et que ta référence de commande figure dans la note PayPal. Le contrôle est fait à la main par l'équipe.", "Check that the amount is exact and your order reference is in the PayPal note. The team checks payments by hand."],
  ["Pourquoi une vérification d'identité ?", "Why an ID check?", "La vente aux mineurs est interdite. Avant le premier achat, tu envoies une pièce d'identité (carte, passeport ou permis) et un selfie où tu tiens un papier avec un code.", "Sales to minors are forbidden. Before your first purchase you send an ID and a selfie holding a paper with a code."],
  ["Mes photos sont-elles conservées ?", "Are my photos kept?", "Les photos sont effacées dès que l'équipe accepte ou refuse la demande.", "Photos are deleted as soon as the team accepts or refuses the request."],
  ["Ma vérification a été refusée", "My verification was refused", "Les achats sont alors impossibles avec ce compte.", "Purchases are then not possible with this account."],
  ["Comment marchent les prix dégressifs ?", "How do tiered prices work?", "Pour un même modèle : -6 % dès 3 pièces, -10 % dès 5, -15 % dès 10. Le prix se met à jour dans le panier.", "For the same model: -6% from 3 items, -10% from 5, -15% from 10. The price updates in the cart."],
  ["Livraison et frais ?", "Delivery and fees?", "Livraison offerte dès 39 € d'achat, sinon 4,90 €.", "Free delivery from €39, otherwise €4.90."],
  ["Quelle nicotine contiennent les puffs ?", "How much nicotine?", "Tous nos puffs sont dosés à 20 mg. La nicotine est très addictive : réservé aux adultes. Aide pour arrêter : Tabac Info Service 3989.", "All our puffs are 20 mg. Nicotine is highly addictive: adults only. Help to quit (France): 3989."],
  ["J'ai oublié mon mot de passe", "I forgot my password", "Dans « Connexion », entre ton email puis clique sur « Mot de passe oublié ? ».", "In “Sign in”, enter your email then click “Forgot password?”."],
  ["Comment changer le thème, la police ou la langue ?", "How do I change theme, font or language?", "Appuie sur le bouton ⚙ en bas à droite : thème clair/sombre, couleur, police, taille du texte, langue, animations et 3D.", "Tap the ⚙ button at the bottom right: light/dark theme, color, font, text size, language, animations and 3D."],
  ["À quoi servent les cookies ?", "What are cookies for?", "Uniquement à garder ton panier, ton choix d'âge et tes réglages sur cet appareil.", "Only to keep your cart, age choice and settings on this device."]
];
function faq() {
  const el = $("faq"); if (!el) return;
  el.innerHTML = `<div class="sec"><h2>${T("Questions fréquentes", "FAQ")}</h2></div><input id="fsrch" placeholder="${T("Rechercher une question…", "Search a question…")}">` +
    QA.map(q => `<div class="fq"><button class="qq">${q[S.lang === "en" ? 1 : 0]}<span>+</span></button><div class="aa"><p>${q[S.lang === "en" ? 3 : 2].replace(/</g, "&lt;")}</p></div></div>`).join("");
  el.onclick = e => { const b = e.target.closest(".qq"); if (!b) return; const f = b.parentElement, a = f.querySelector(".aa"), o = f.classList.toggle("open"); a.style.maxHeight = o ? a.scrollHeight + "px" : 0; };
  $("fsrch").oninput = e => { const v = norm(e.target.value); $$("#faq .fq").forEach(f => f.style.display = norm(f.textContent).includes(v) ? "" : "none"); };
}

/* ---------- Badges boutique + ripple ---------- */
const deco = () => $$("#grid .card:not([data-dc])").forEach(c => { c.dataset.dc = 1; c.querySelector(".ph")?.insertAdjacentHTML("beforeend", '<span class="disc">-15 % dès 10</span>'); c.querySelector(".in")?.insertAdjacentHTML("beforeend", `<div class="fs">${T("Livraison offerte dès 39 €", "Free shipping from €39")}</div>`); });
new MutationObserver(deco).observe($("grid"), { childList: true });
addEventListener("pointerdown", e => { const b = e.target.closest(".btn,.qa"); if (!b) return; const r = b.getBoundingClientRect(), s = document.createElement("span"); s.className = "ripple"; s.style.cssText = `left:${e.clientX - r.left - 20}px;top:${e.clientY - r.top - 20}px;width:40px;height:40px`; if (getComputedStyle(b).position === "static") b.style.position = "relative"; b.style.overflow = "hidden"; b.append(s); setTimeout(() => s.remove(), 600); });

/* ---------- PAIEMENT PAYPAL ---------- */
const payUrl = total => `https://www.paypal.com/paypalme/${encodeURIComponent(PAYPAL_USER)}/${total.toFixed(2)}`;
document.body.insertAdjacentHTML("beforeend", '<div class="ov" id="pay"><div class="box s stack pay"><button class="x" aria-label="Fermer">✕</button><div id="payb"></div></div></div>');
$("pay").onclick = e => { if (e.target === $("pay") || e.target.closest(".x")) shut("pay"); else if (e.target.id === "cpy") { navigator.clipboard?.writeText(e.target.dataset.r); toast(T("Référence copiée", "Reference copied"), "ok", 1800); } };
function showPay(ref, total) {
  $("payb").innerHTML = `<h2>${T("Paiement PayPal", "PayPal payment")}</h2><div class="code" style="font-size:30px">${euro(total)}</div><p class="mut">${T("Commande enregistrée. Référence", "Order saved. Reference")} : <b style="color:var(--tx)">${ref}</b> <button class="pill" id="cpy" data-r="${ref}">${T("Copier", "Copy")}</button></p>
  <a class="btn w" id="ppl" target="_blank" rel="noopener" href="${payUrl(total)}">${T("Payer", "Pay")} ${euro(total)} ${T("avec PayPal", "with PayPal")}</a>
  <ol class="mut" style="font-size:13px"><li>${T("Si tu paies par carte : installe PayPal et crée un compte.", "Paying by card: install PayPal and create an account.")}</li><li>${T("Ajoute ta carte dans ton portefeuille PayPal.", "Add your card to your PayPal wallet.")}</li><li>${T("Valide le montant exact et écris la référence dans la note.", "Confirm the exact amount and write the reference in the note.")}</li></ol>
  <p class="mut" style="font-size:12px">${T("Ta commande est traitée dès que le paiement est reçu.", "Your order is processed once payment is received.")}</p>`;
  open("pay"); confetti();
}
order = async function () {
  if (!cart.length) return;
  if (!user) { setMode("in"); open("auth"); return toast(T("Connecte-toi pour commander", "Sign in to order")); }
  if (!verified) { if (vs === "pending") return toast(T("Vérification en cours : attends la validation.", "Verification pending.")); if (vs === "rejected") return toast(T("Vérification refusée : achat impossible.", "Verification refused."), "ko"); closeCart(); return openVerif(); }
  const b = $("ord"); b.classList.add("load"); b.disabled = true;
  try {
    const t = totals(), total = +(t.sub + t.ship).toFixed(2), ref = "VS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const items = cart.map(l => ({ id: l.id, name: byId(l.id).name, flav: l.flav, n: l.n, unit: +unit(l).toFixed(2) }));
    await db.collection("orders").add({ uid: user.uid, email: user.email, items, total, ref, payment: "paypal", paid: false, status: "nouvelle", createdAt: TS() });
    notify("🛒 Nouvelle commande (PayPal à vérifier)", 0x7c5cff, [{ name: "Référence", value: ref }, { name: "Client", value: String(user.email) }, { name: "Articles", value: cart.map(l => `${byId(l.id).name}${l.flav ? " (" + l.flav + ")" : ""} ×${l.n}`).join("\n").slice(0, 1000) || "—" }, { name: "Total à recevoir", value: euro(total) }], "Voir la commande dans le dashboard");
    cart = []; saveCart(); drawCart(); closeCart(); showPay(ref, total);
  } catch (e) { toast(T("Commande non envoyée : ", "Order failed: ") + fbErr(e), "ko", 9000); b.classList.remove("load"); b.disabled = false; }
};

/* ---------- Dashboard : référence + « Paiement reçu » ---------- */
new MutationObserver(() => $$("#do button[data-s]:not([data-x])").forEach(async b => {
  b.dataset.x = 1;
  try {
    const o = (await db.doc("orders/" + b.dataset.s).get()).data() || {}, d = b.closest(".dr").querySelector("div");
    d.insertAdjacentHTML("beforeend", `<br><small>${o.ref ? esc(o.ref) + " · " : ""}${o.paid ? "✅ payée" : "⏳ paiement PayPal à vérifier"}</small>`);
    if (!o.paid) b.insertAdjacentHTML("beforebegin", `<button class="btn ok" data-paid="${b.dataset.s}">Paiement reçu</button>`);
  } catch {}
})).observe($("do"), { childList: true, subtree: true });
$("dash").addEventListener("click", async e => { const b = e.target.closest("[data-paid]"); if (!b) return; try { await db.doc("orders/" + b.dataset.paid).update({ paid: true }); b.parentElement.querySelector("small").textContent = "✅ payée"; b.remove(); toast("Paiement confirmé ✓", "ok"); } catch (x) { toast(fbErr(x), "ko", 8000); } });

apply(); deco();
})();
