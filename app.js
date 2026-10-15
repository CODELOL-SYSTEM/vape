const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const crypto = require("crypto");
admin.initializeApp();
const db = admin.firestore(), FV = admin.firestore.FieldValue, bucket = () => admin.storage().bucket();

/* ================= À MODIFIER ================= */
const DISCORD_CHANNEL = "ID_DU_SALON_PRIVE";            // clic droit sur le salon > Copier l'identifiant
const ORDERS_CHANNEL = DISCORD_CHANNEL;                 // tu peux mettre un autre salon pour les commandes
const ADMIN_DISCORD_IDS = ["TON_ID_DISCORD"];           // clic droit sur ton pseudo > Copier l'identifiant (qui peut cliquer les boutons)
const SITE_URL = "https://vape-fc2ca.web.app";
/* ============================================== */

const REGION = "europe-west1";
// Secrets : JAMAIS dans le code → firebase functions:secrets:set NOM
const DISCORD_TOKEN = defineSecret("DISCORD_TOKEN");
const DISCORD_PUBLIC_KEY = defineSecret("DISCORD_PUBLIC_KEY");
const STRIPE_KEY = defineSecret("STRIPE_KEY");
const STRIPE_WH = defineSecret("STRIPE_WH");

// Prix = source de vérité côté serveur
const CAT = { "falcon-x-28000": ["JNR Falcon X 28000", 12.4], "joker-24k": ["JNR Joker 24K", 12.9], "aerox-32k": ["JNR AeroX 32K", 13.9], "falcon-gem-30k": ["JNR Falcon Gem 30K", 14.9], "jnr-42k": ["JNR 42K", 21.68] };
const FREE_FROM = 39, SHIPPING = 4.9;
const unit = (price, n) => price * (n >= 10 ? .85 : n >= 5 ? .9 : n >= 3 ? .94 : 1);
const BLOCKED_OR_DONE = ["pending", "approved", "blocked"];

async function discord(payload, files = [], channel = DISCORD_CHANNEL) {
  const fd = new FormData();
  fd.append("payload_json", JSON.stringify(payload));
  files.forEach((f, i) => fd.append(`files[${i}]`, new Blob([f.buf], { type: f.type }), f.name));
  const r = await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, { method: "POST", headers: { Authorization: `Bot ${DISCORD_TOKEN.value()}` }, body: fd });
  if (!r.ok) console.error("Discord", r.status, await r.text());
  return r.ok;
}

/* 1) Code anti-fraude généré par le serveur */
exports.startVerification = onCall({ region: REGION }, async req => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Connecte-toi d'abord.");
  const st = (await db.doc(`verifications/${req.auth.uid}`).get()).data()?.status;
  if (BLOCKED_OR_DONE.includes(st)) throw new HttpsError("failed-precondition", st === "blocked" ? "Compte refusé." : "Vérification déjà " + (st === "pending" ? "en cours." : "validée."));
  const code = crypto.randomInt(1000, 10000) + Array.from({ length: 3 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[crypto.randomInt(24)]).join("");
  await db.doc(`codes/${req.auth.uid}`).set({ code, at: FV.serverTimestamp() });
  return { code };
});

/* 2) Photos → salon Discord privé avec 3 boutons. Photos supprimées de Firebase aussitôt. */
exports.submitVerification = onCall({ region: REGION, secrets: [DISCORD_TOKEN], memory: "512MiB", timeoutSeconds: 60 }, async req => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Connecte-toi d'abord.");
  const uid = req.auth.uid, email = req.auth.token.email || "(sans email)";
  const st = (await db.doc(`verifications/${uid}`).get()).data()?.status;
  if (BLOCKED_OR_DONE.includes(st)) throw new HttpsError("failed-precondition", "Déjà traité.");
  const c = (await db.doc(`codes/${uid}`).get()).data();
  if (!c) throw new HttpsError("failed-precondition", "Demande d'abord un code.");
  const b = bucket(), files = [];
  for (const n of ["id", "selfie"]) {
    const f = b.file(`verifications/${uid}/${n}`);
    if (!(await f.exists())[0]) throw new HttpsError("failed-precondition", "Photo manquante : " + (n === "id" ? "pièce d'identité" : "selfie"));
    const type = (await f.getMetadata())[0].contentType || "";
    if (!type.startsWith("image/")) throw new HttpsError("invalid-argument", "Le fichier doit être une image.");
    files.push({ buf: (await f.download())[0], type, name: `${n}.${type.split("/")[1].replace("jpeg", "jpg")}` });
  }
  const ok = await discord({
    content: `🆕 **Vérification d'âge** — ${email}`,
    embeds: [
      { title: "🪪 Pièce d'identité", color: 0x7c5cff, image: { url: "attachment://" + files[0].name }, fields: [
        { name: "Email", value: email, inline: true },
        { name: "Code à retrouver sur le papier", value: "**" + c.code + "**", inline: true },
        { name: "✅ Checklist", value: "• Le code du papier = le code ci-dessus ?\n• Le visage du selfie = la photo de la pièce ?\n• **18 ans révolus** d'après la date de naissance ?\n• Pièce valide, lisible, non retouchée ?" }] },
      { title: "🤳 Selfie avec le papier", color: 0x00d4b4, image: { url: "attachment://" + files[1].name } }
    ],
    components: [{ type: 1, components: [
      { type: 2, style: 3, label: "Accepter (18+ confirmé)", emoji: { name: "✅" }, custom_id: `v|approve|${uid}` },
      { type: 2, style: 2, label: "Refuser (à refaire)", emoji: { name: "⚠️" }, custom_id: `v|reject|${uid}` },
      { type: 2, style: 4, label: "Mineur / fraude", emoji: { name: "⛔" }, custom_id: `v|block|${uid}` }] }]
  }, files);
  if (!ok) throw new HttpsError("internal", "Envoi au salon impossible, réessaie.");
  await b.deleteFiles({ prefix: `verifications/${uid}/`, force: true });
  await db.doc(`verifications/${uid}`).set({ uid, email, code: c.code, status: "pending", createdAt: FV.serverTimestamp() });
  return { ok: true };
});

/* 3) Discord appelle cette URL quand tu cliques un bouton (signature vérifiée) */
exports.discordInteractions = onRequest({ region: REGION, secrets: [DISCORD_PUBLIC_KEY] }, async (req, res) => {
  let valid = false;
  try {
    const key = crypto.createPublicKey({ key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), Buffer.from(DISCORD_PUBLIC_KEY.value().trim(), "hex")]), format: "der", type: "spki" });
    valid = crypto.verify(null, Buffer.from(req.get("x-signature-timestamp") + req.rawBody), key, Buffer.from(req.get("x-signature-ed25519"), "hex"));
  } catch (e) {}
  if (!valid) return res.status(401).send("invalid request signature");
  const i = req.body;
  if (i.type === 1) return res.json({ type: 1 }); // PING
  const eph = content => res.json({ type: 4, data: { content, flags: 64 } });
  if (i.type !== 3 || !String(i.data?.custom_id).startsWith("v|")) return eph("Action inconnue.");

  const [, decision, uid] = i.data.custom_id.split("|"), who = i.member?.user || i.user;
  if (!ADMIN_DISCORD_IDS.includes(who?.id)) return eph("⛔ Tu n'as pas le droit de valider.");
  const status = { approve: "approved", reject: "rejected", block: "blocked" }[decision];
  const ref = db.doc(`verifications/${uid}`), v = (await ref.get()).data();
  if (!status || !v || v.status !== "pending") return eph("Déjà traité.");

  await ref.update({ status, decidedAt: FV.serverTimestamp(), decidedBy: who.id });
  await db.doc(`users/${uid}`).set({ verified: status === "approved" }, { merge: true });
  const label = { approved: "✅ ACCEPTÉ", rejected: "⚠️ REFUSÉ (peut renvoyer)", blocked: "⛔ BLOQUÉ (mineur/fraude)" }[status];
  res.json({ type: 7, data: { content: `${i.message.content}\n\n**${label}** par <@${who.id}>`, components: [] } }); // retire les boutons, garde les photos
});

/* 4) Paiement : prix recalculés côté serveur, seulement si âge vérifié */
exports.createCheckout = onCall({ region: REGION, secrets: [STRIPE_KEY] }, async req => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Connecte-toi d'abord.");
  if (!(await db.doc(`users/${req.auth.uid}`).get()).data()?.verified) throw new HttpsError("permission-denied", "Âge non vérifié.");
  const items = (req.data?.items || []).slice(0, 50);
  if (!items.length) throw new HttpsError("invalid-argument", "Panier vide.");
  const qty = {};
  for (const l of items) {
    if (!CAT[l.id] || !Number.isInteger(l.n) || l.n < 1 || l.n > 100) throw new HttpsError("invalid-argument", "Article invalide.");
    qty[l.id] = (qty[l.id] || 0) + l.n;
  }
  let sub = 0; for (const l of items) sub += unit(CAT[l.id][1], qty[l.id]) * l.n;
  const cents = Math.round((sub + (sub >= FREE_FROM ? 0 : SHIPPING)) * 100);
  const clean = items.map(l => ({ id: l.id, flav: String(l.flav || "").slice(0, 60), n: l.n }));
  const o = await db.collection("orders").add({ uid: req.auth.uid, email: req.auth.token.email || "", items: clean, total: cents / 100, status: "awaiting_payment", createdAt: FV.serverTimestamp() });
  const s = await require("stripe")(STRIPE_KEY.value()).checkout.sessions.create({
    mode: "payment", customer_email: req.auth.token.email, client_reference_id: o.id, metadata: { orderId: o.id },
    shipping_address_collection: { allowed_countries: ["FR"] }, phone_number_collection: { enabled: true },
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: cents, product_data: { name: "Commande VAPE SHOP" } } }],
    success_url: SITE_URL + "/?paid=1", cancel_url: SITE_URL + "/?paid=0"
  });
  return { url: s.url };
});

exports.stripeWebhook = onRequest({ region: REGION, secrets: [STRIPE_KEY, STRIPE_WH, DISCORD_TOKEN] }, async (req, res) => {
  let ev;
  try { ev = require("stripe")(STRIPE_KEY.value()).webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"], STRIPE_WH.value()); } catch (e) { return res.status(400).send("bad signature"); }
  if (ev.type === "checkout.session.completed") {
    const s = ev.data.object, ref = db.doc(`orders/${s.metadata.orderId}`), o = (await ref.get()).data();
    if (o && o.status === "awaiting_payment") {
      const sh = s.collected_information?.shipping_details || s.shipping_details || {}, a = sh.address || {}, tel = s.customer_details?.phone || "";
      await ref.update({ status: "payée", shipping: { name: sh.name || "", ...a, phone: tel } });
      await discord({ content: `💶 **COMMANDE PAYÉE** — ${o.email} — **${o.total.toFixed(2)} €**\n` + o.items.map(i => `• ${CAT[i.id][0]}${i.flav ? " (" + i.flav + ")" : ""} ×${i.n}`).join("\n") + `\n📦 ${sh.name || ""} — ${a.line1 || ""} ${a.line2 || ""}, ${a.postal_code || ""} ${a.city || ""} — 📞 ${tel}` }, [], ORDERS_CHANNEL);
    }
  }
  res.json({ received: true });
});
