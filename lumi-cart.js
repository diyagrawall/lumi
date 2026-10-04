(function () {
  if (window.LumiCart) return;
  var KEY = "lumi-cart-v1";
  var IMG = "";
  var TANK_SIZES = ["XS", "S", "M", "L", "XL"];
  var catalog = {
    "pink-popcorn-tank": { name: "PINK POPCORN TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], img: IMG, field: "#EFCFCB", size: "cover", pos: "center 20%" },
    "white-cocktail-tank": { name: "WHITE COCKTAIL TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], img: IMG, field: "#E8DDD4", size: "cover", pos: "center 20%" },
    "black-fries-tank": { name: "BLACK FRIES TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], img: IMG, field: "#1B1F16", size: "cover", pos: "center 20%" }
  };
  // Six more tank designs. Their photos come from Shopify (matched by product name).
  var NEWTANKS = [
    ["pink-flamingo-tank", "PINK FLAMINGO TANK", "Stand out, stand tall.", "#EFCFCB"],
    ["pink-seashell-tank", "PINK SEASHELL TANK", "Pearls from the shore.", "#EFCFCB"],
    ["black-dragonfly-tank", "BLACK DRAGONFLY TANK", "Dark base, bright wings.", "#1B1F16"],
    ["black-beer-tank", "BLACK BEER TANK", "Cheers to the little things.", "#1B1F16"],
    ["white-jellyfish-tank", "WHITE JELLYFISH TANK", "Drift in, stand out.", "#E8DDD4"],
    ["white-ace-tank", "WHITE ACE TANK", "An ace up your sleeve.", "#E8DDD4"]
  ];
  var tankProducts = [];
  NEWTANKS.forEach(function (t) {
    catalog[t[0]] = { name: t[1], mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], img: "", alt: "", alt2: "", field: t[3], size: "cover", pos: "center 20%", line: t[2], fresh: true };
    tankProducts.push({ slug: t[0], c: "tank-tops", cat: "TANK TOP", name: t[1], line: t[2], price: 899, field: t[3], size: "cover", pos: "center 20%", img: "", size2: "cover", pos2: "center", img2: "", img3: "" });
  });
  var ACC = [
    ["strawberry", "STRAWBERRY", "Sweet on your jacket.", "Berry good bag energy.", "#F6E4E1"],
    ["apple", "BLUE APPLE", "An apple a day, but blue.", "Hang it. Swing it.", "#E7E9DE"],
    ["mushroom", "MUSHROOM", "Tiny toadstool, big mood.", "Your bag's lucky charm.", "#F6F2EA"],
    ["coconut", "COCONUT", "Sip, sip, hooray.", "Vacation, clipped on.", "#E7E9DE"],
    ["avocado", "AVOCADO", "Avo-cado you a favour.", "Guac your bag.", "#F6F2EA"],
    ["cola", "COLA BOTTLE", "Fizzy little detail.", "Pop it on your bag.", "#EFCFCB"],
    ["basketball", "BASKETBALL", "Game on, on your jacket.", "Slam dunk your bag.", "#F6E4E1"],
    ["palm", "PALM TREE", "Beach mode, always.", "Island time, clipped on.", "#E8DDD4"],
    ["dolphin", "DOLPHIN", "Make a splash.", "Swim along with you.", "#EFCFCB"],
    ["owl", "OWL", "Wise choice.", "Night owl approved.", "#F6E4E1"],
    ["pineapple", "PINEAPPLE", "Stand tall, be sweet.", "Tropical on the go.", "#F6F2EA"],
    ["sailboat", "SAILBOAT", "Set sail in style.", "Anchors aweigh.", "#EFCFCB"],
    ["watermelon", "WATERMELON", "One in a melon.", "Juicy on your bag.", "#F6E4E1"],
    ["butterfly", "BUTTERFLY", "Flutter by.", "A bag with wings.", "#EFCFCB"],
    ["bow", "BOW", "Tie it all together.", "Pretty in a bow.", "#F6E4E1"],
    ["camera", "CAMERA", "Say cheese.", "Always ready to snap.", "#EFCFCB"],
    ["teddy", "TEDDY BEAR", "Bear with us.", "Your beary cute bag buddy.", "#F6E4E1"],
    ["perfume", "PERFUME BOTTLE", "Notes of you.", "A spritz of personality.", "#EFCFCB"]
  ];
  var products = [];
  ACC.forEach(function (a) {
    [["brooch", "BROOCH", 349, 289, "brooches", a[2]], ["charm", "CHARM", 359, 299, "bag-charms", a[3]]].forEach(function (t) {
      var id = a[0] + "-" + t[0];
      catalog[id] = { name: a[1] + " " + t[1], mrp: t[2], kind: "acc", price: t[3], sizes: null, field: a[4], size: "cover", pos: "center", img: "", alt: "", alt2: "", line: t[5], group: t[0] };
      products.push({ slug: id, c: t[4], cat: t[0] === "brooch" ? "BROOCH" : "BAG CHARM", name: catalog[id].name, line: t[5], price: t[3], field: a[4], size: "cover", pos: "center", img: "", size2: "cover", pos2: "center", img2: "", img3: "" });
    });
  });
  tankProducts.forEach(function (p) { products.push(p); });
  var items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || "[]").filter(function (l) { return catalog[l.id] && l.qty > 0; }); } catch (e) { items = []; }
  var subs = [];
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function emit() { save(); subs.slice().forEach(function (f) { try { f(); } catch (e) {} }); window.dispatchEvent(new CustomEvent("lumi:change")); }
  function merge() {
    var out = [];
    items.forEach(function (l) {
      var m = out.find(function (o) { return o.id === l.id && o.size === l.size && !(catalog[l.id].sizes && !l.size); });
      if (m) m.qty += l.qty; else out.push({ id: l.id, size: l.size, qty: l.qty });
    });
    items = out;
  }
  window.addEventListener("storage", function (e) { if (e.key === KEY) { try { items = JSON.parse(e.newValue || "[]"); } catch (x) {} subs.forEach(function (f) { f(); }); window.dispatchEvent(new CustomEvent("lumi:change")); } });
  // Placeholder commerce config — replace with the real coupon / shipping / payment backend.
  var COUPONS = { "LUMI20": { type: "percent", value: 20, label: "LUMI20" } };
  var SHIPPING = { name: "STANDARD DELIVERY", eta: "5–7 working days after dispatch", rate: 120, freeOver: 3299 };

  // Central promotions config — single source of truth for sale prices, bundles and order discounts.
  var PROMOS = {
    tank3: { key: "tank3", label: "3 TANK BUNDLE", short: "3 TANKS → ₹2,400", line: "PICK 3. PAY ₹2,400.", sub: "Mix and match any 3 tanks.", tanks: 3, acc: 0, price: 2400 },
    combo: { key: "combo", label: "TANK + 2 EXTRAS", short: "TANK + 2 EXTRAS → ₹1,400", line: "TANK + 2 EXTRAS = ₹1,400", sub: "Pick any tank + any 2 brooches or charms.", tanks: 1, acc: 2, price: 1400 },
    acc3: { key: "acc3", label: "PICK ANY 3 BUNDLE", short: "ANY 3 EXTRAS → ₹749", line: "PICK ANY 3. PAY ₹749.", sub: "Mix and match brooches & charms.", tanks: 0, acc: 3, price: 749 },
    threshold: { label: "10% OFF", short: "10% OFF ₹3,500+", over: 3500, pct: 10 },
    // Stacking rule: an item sits in at most one bundle; the order-level % (threshold or coupon, whichever is larger) applies only to items outside bundles.
    stack: "no-double-discount"
  };
  function fmt(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function priceInfo(id) { var p = catalog[id]; if (!p) return null; var off = p.mrp && p.mrp > p.price ? Math.round((p.mrp - p.price) / p.mrp * 100) : 0; return { now: p.price, mrp: p.mrp || p.price, off: off, nowText: fmt(p.price), mrpText: off ? fmt(p.mrp) : "", offText: off ? off + "% OFF" : "" }; }
  function quote(list, cp) {
    var units = []; list.forEach(function (l) { var p = catalog[l.id]; for (var q = 0; q < l.qty; q++) units.push({ id: l.id, name: p.name, size: l.size, price: p.price, kind: p.kind }); });
    var T = units.filter(function (u) { return u.kind === "tank"; }), A = units.filter(function (u) { return u.kind !== "tank"; }).sort(function (a, b) { return b.price - a.price; });
    var sub = units.reduce(function (a, u) { return a + u.price; }, 0), best = null;
    for (var x = 0; x * 3 <= T.length; x++) for (var y = 0; x * 3 + y <= T.length && y * 2 <= A.length; y++) for (var z = 0; y * 2 + z * 3 <= A.length; z++) {
      var ti = 0, ai = 0, groups = [];
      for (var i = 0; i < x; i++) { groups.push({ p: PROMOS.tank3, items: T.slice(ti, ti + 3) }); ti += 3; }
      for (i = 0; i < y; i++) { groups.push({ p: PROMOS.combo, items: [T[ti]].concat(A.slice(ai, ai + 2)) }); ti += 1; ai += 2; }
      for (i = 0; i < z; i++) { groups.push({ p: PROMOS.acc3, items: A.slice(ai, ai + 3) }); ai += 3; }
      var bSave = 0; groups.forEach(function (g) { g.regular = g.items.reduce(function (a, u) { return a + u.price; }, 0); g.save = g.regular - g.p.price; bSave += g.save; });
      if (groups.some(function (g) { return g.save <= 0; })) continue;
      var rest = T.slice(ti).concat(A.slice(ai)).reduce(function (a, u) { return a + u.price; }, 0), after = sub - bSave;
      var thPct = after > PROMOS.threshold.over ? PROMOS.threshold.pct : 0, cpPct = cp && cp.type === "percent" ? cp.value : 0;
      var pct = Math.max(thPct, cpPct), oSave = Math.round(rest * pct / 100), total = bSave + oSave;
      if (!best || total > best.total) best = { groups: groups, bSave: bSave, rest: rest, pct: pct, src: pct === 0 ? null : (cpPct >= thPct ? "coupon" : "threshold"), oSave: oSave, total: total, after: after };
    }
    if (!best) best = { groups: [], bSave: 0, rest: sub, pct: 0, src: null, oSave: 0, total: 0, after: sub };
    var bundles = best.groups.map(function (g) { return { key: g.p.key, label: g.p.label, names: g.items.map(function (u) { return u.name + (u.size ? " · " + u.size : ""); }), regular: g.regular, price: g.p.price, save: g.save, regularText: fmt(g.regular), priceText: fmt(g.p.price), saveText: fmt(g.save) }; });
    var rows = bundles.map(function (b) { return { label: b.label, amount: b.save, text: "−" + b.saveText, kind: "bundle" }; });
    if (best.oSave > 0) rows.push({ label: best.src === "coupon" ? "Promo · " + cp.label : "10% OFF ₹3,500+", amount: best.oSave, text: "−" + fmt(best.oSave), kind: best.src });
    var need = PROMOS.threshold.over + 1 - best.after;
    return { sub: sub, bundles: bundles, rows: rows, bundleSave: best.bSave, orderSave: best.oSave, orderSrc: best.src, couponSave: best.src === "coupon" ? best.oSave : 0, total: best.total,
      thresholdOn: best.src === "threshold", thresholdNeed: need > 0 && best.src !== "threshold" ? need : 0, thresholdMsg: best.src === "threshold" ? "10% OFF APPLIED" : (need > 0 ? "You're " + fmt(need) + " away from 10% off" : ""),
      tanks: T.length, acc: A.length };
  }
  function nudge(q) {
    var t = q.tanks, a = q.acc, inB = q.bundles.length;
    if (t % 3 === 2 && a < 2) return "Add 1 more tank — 3 tanks are ₹2,400.";
    if (t >= 1 && a === 1) return "Add 1 more brooch or charm — tank + 2 extras is ₹1,400.";
    if (t === 0 && a % 3 === 2) return "Add 1 more extra — any 3 are ₹749.";
    if (t === 0 && a % 3 === 1 && a > 1) return "Add 2 more extras — any 3 are ₹749.";
    return "";
  }
  var CKEY = "lumi-coupon-v1", coupon = null;
  try { coupon = localStorage.getItem(CKEY) || null; if (coupon && !COUPONS[coupon]) coupon = null; } catch (e) {}
  window.LumiCart = {
    IMG: IMG,
    shipping: SHIPPING,
    coupon: function () { return coupon ? COUPONS[coupon] : null; },
    applyCoupon: function (code) { var k = String(code || "").trim().toUpperCase(); if (!COUPONS[k]) return false; coupon = k; try { localStorage.setItem(CKEY, k); } catch (e) {} emit(); return true; },
    removeCoupon: function () { coupon = null; try { localStorage.removeItem(CKEY); } catch (e) {} emit(); },
    promos: PROMOS,
    decorate: function (v) {
      var byPrice = {}; Object.keys(catalog).forEach(function (id) { var i = priceInfo(id); if (i.off) byPrice[i.nowText] = i; });
      var seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;
      function walk(o, d) {
        if (!o || typeof o !== "object" || d > 6 || o.$$typeof || (typeof Element !== "undefined" && o instanceof Element)) return o;
        if (seen) { if (seen.has(o)) return o; seen.add(o); }
        if (Array.isArray(o)) { o.forEach(function (x) { walk(x, d + 1); }); return o; }
        if (Object.getPrototypeOf(o) !== Object.prototype) return o;
        Object.keys(o).forEach(function (k) {
          var val = o[k];
          if (/price$|^unit$/i.test(k) && typeof val === "string") { var m = byPrice[val.replace(/ .*/, "")]; o[k + "Mrp"] = m ? m.mrpText : ""; o[k + "Off"] = m ? m.offText : ""; }
          else if (val && typeof val === "object") walk(val, d + 1);
        });
        return o;
      }
      return walk(v, 0);
    },
    price: priceInfo,
    quote: function (list) { return quote(list || items, this.coupon()); },
    nudge: function () { return nudge(quote(items, this.coupon())); },
    discount: function () { return quote(items, this.coupon()).total; },
    couponSave: function () { return quote(items, this.coupon()).couponSave; },
    soldOutLine: function (l) { var p = catalog[l.id]; return !!(p.sizes && l.size && (p.soldOut || []).indexOf(l.size) >= 0); },
    insert: function (i, l) { if (!l || !catalog[l.id]) return; items.splice(Math.min(i, items.length), 0, { id: l.id, size: l.size || null, qty: l.qty || 1 }); merge(); emit(); },
    catalog: catalog,
    products: products,
    acc: ACC.map(function (a) { return { key: a[0], name: a[1], brooch: a[0] + "-brooch", charm: a[0] + "-charm" }; }),
    requiresSize: function (id) { return !!(catalog[id] && catalog[id].sizes); },
    items: function () { return items.map(function (l) { return { id: l.id, size: l.size, qty: l.qty }; }); },
    count: function () { return items.reduce(function (a, l) { return a + l.qty; }, 0); },
    subtotal: function () { return items.reduce(function (a, l) { return a + catalog[l.id].price * l.qty; }, 0); },
    missingSize: function () { return items.some(function (l) { return catalog[l.id].sizes && !l.size; }); },
    add: function (id, opts) {
      opts = opts || {};
      var p = catalog[id]; if (!p) return false;
      var size = opts.size || null, qty = opts.qty || 1;
      if (p.sizes && (!size || p.sizes.indexOf(size) < 0 || (p.soldOut || []).indexOf(size) >= 0)) return false;
      items.push({ id: id, size: p.sizes ? size : null, qty: qty }); merge(); emit();
      if (opts.toast !== false) this.toast(p.name + (size ? " · SIZE " + size : "") + " · IN THE BAG.");
      return true;
    },
    setQty: function (i, q) { if (!items[i]) return; if (q <= 0) items.splice(i, 1); else items[i].qty = q; emit(); },
    remove: function (i) { items.splice(i, 1); emit(); },
    clear: function () { items = []; coupon = null; try { localStorage.removeItem(CKEY); } catch (e) {} emit(); },
    setSize: function (i, size) { var l = items[i]; if (!l) return; var p = catalog[l.id]; if (!p.sizes || p.sizes.indexOf(size) < 0 || (p.soldOut || []).indexOf(size) >= 0) return; l.size = size; merge(); emit(); },
    subscribe: function (f) { subs.push(f); return function () { subs = subs.filter(function (x) { return x !== f; }); }; },
    open: function () { window.dispatchEvent(new CustomEvent("lumi:open")); },
    toast: function (msg) { window.dispatchEvent(new CustomEvent("lumi:toast", { detail: msg })); },
    requestSize: function (o) { window.dispatchEvent(new CustomEvent("lumi:size", { detail: o })); }
  };
  // ---- Shopify Storefront checkout (public token only) ----
  var SHOP = { domain: "pf03pr-qy.myshopify.com", token: "c639e620965cb7fe117352446b112748", v: "2025-01" };
  function gql(q, vars) {
    return fetch("https://" + SHOP.domain + "/api/" + SHOP.v + "/graphql.json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOP.token },
      body: JSON.stringify({ query: q, variables: vars || {} })
    }).then(function (r) { return r.json(); });
  }
  var norm = function (s) { return String(s || "").toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]+/g, " ").trim(); };
  var busy = false;
  window.LumiCart.shopifyCheckout = function () {
    var LC = window.LumiCart;
    if (busy || !LC.count()) return;
    if (LC.missingSize()) { LC.toast("PICK A SIZE FOR EVERY TANK FIRST."); return; }
    busy = true; LC.toast("TAKING YOU TO CHECKOUT…");
    gql("{products(first:100){nodes{handle title variants(first:50){nodes{id availableForSale selectedOptions{name value}}}}}}").then(function (res) {
      var prods = (res.data && res.data.products.nodes) || [], lines = [], missing = [];
      LC.items().forEach(function (l) {
        var p = catalog[l.id], n = norm(p.name);
        var sp = prods.filter(function (x) { return x.handle === l.id; })[0] || prods.filter(function (x) { return norm(x.title) === n; })[0] || prods.filter(function (x) { return norm(x.title).indexOf(n) >= 0 || n.indexOf(norm(x.title)) >= 0; })[0];
        var v = sp && (p.sizes ? sp.variants.nodes.filter(function (x) { return x.selectedOptions.some(function (o) { return String(o.value).toUpperCase() === String(l.size).toUpperCase(); }); })[0] : sp.variants.nodes[0]);
        if (v) lines.push({ merchandiseId: v.id, quantity: l.qty }); else missing.push(p.name + (l.size ? " " + l.size : ""));
      });
      if (missing.length) throw new Error("Not found in Shopify: " + missing.join(", "));
      var code = LC.coupon() && LC.coupon().label;
      return gql("mutation($i:CartInput!){cartCreate(input:$i){cart{checkoutUrl}userErrors{message}}}", { i: { lines: lines, discountCodes: code ? [code] : [] } });
    }).then(function (res) {
      var c = res.data && res.data.cartCreate;
      if (c && c.cart) { location.href = c.cart.checkoutUrl; return; }
      throw new Error((c && c.userErrors[0] && c.userErrors[0].message) || "Checkout unavailable");
    }).catch(function (e) { busy = false; console.error(e); LC.toast("CHECKOUT ISN'T AVAILABLE RIGHT NOW. " + (e.message || "")); });
  };
  // Product photos come from Shopify (matched by handle or title). Everything else stays in this file.
  var PQ = "{products(first:100){nodes{handle title images(first:3){nodes{url}}}}}";
  function loadShopify() {
    gql(PQ).then(function (res) {
      var nodes = (res.data && res.data.products.nodes) || [], hit = 0;
      nodes.forEach(function (sp) {
        var sq = function (s) { return String(s || "").toLowerCase().replace(/\b(bag|the|beaded)\b/g, "").replace(/[^a-z0-9]+/g, ""); }, n = sq(sp.title), id = Object.keys(catalog).filter(function (k) { return k === sp.handle || sq(catalog[k].name) === n; })[0];
        var im = sp.images.nodes.map(function (x) { return x.url; });
        if (!id || !im.length) return;
        if (catalog[id].kind === "tank") {
          var tc = catalog[id], tp = products.filter(function (x) { return x.slug === id; })[0];
          if (!tp) { tp = { slug: id, c: "tank-tops", cat: "TANK TOP", name: tc.name, line: tc.line || "", price: tc.price, field: tc.field }; products.push(tp); }
          tc.img = im[0]; tc.alt = im[1] || im[0]; tc.alt2 = im[2] || im[1] || im[0]; tc.size = "cover"; tc.pos = "center 20%";
          Object.assign(tp, { img: tc.img, img2: tc.alt, img3: tc.alt2, size: "cover", pos: "center 20%", size2: "cover", pos2: "center" });
          hit++; return;
        }
        if (catalog[id].kind !== "acc" || catalog[id].img) return;
        var c = catalog[id], p = products.filter(function (x) { return x.slug === id; })[0];
        c.img = im[0]; c.alt = im[1] || im[0]; c.alt2 = im[2] || im[1] || im[0];
        if (p) { p.img = c.img; p.img2 = c.alt; p.img3 = c.alt2; }
        hit++;
      });
      window.LumiCart.loaded = true; if (hit) window.dispatchEvent(new CustomEvent("lumi:change")); fillImgs();
    }).catch(function () {});
  }
  // Homepage thumbnails marked data-lsku get their photo from the Shopify product with that handle.
  function fillImgs() {
    Array.prototype.forEach.call(document.querySelectorAll("img[data-lsku]"), function (im) {
      var c = catalog[im.getAttribute("data-lsku")], on = !!(c && c.img);
      if (on && im.getAttribute("src") !== c.img) im.setAttribute("src", c.img);
      im.style.visibility = on ? "visible" : "hidden";
    });
  }
  window.LumiCart.fillImgs = fillImgs;
  window.addEventListener("lumi:change", fillImgs);
  if (typeof MutationObserver !== "undefined") new MutationObserver(function () { fillImgs(); }).observe(document.documentElement, { childList: true, subtree: true });
  loadShopify();
  function route() { if (/LUMI-Checkout/.test(location.pathname) && /^#\/checkout/.test(location.hash)) window.LumiCart.shopifyCheckout(); }
  window.addEventListener("hashchange", route); window.addEventListener("DOMContentLoaded", route);
})();
