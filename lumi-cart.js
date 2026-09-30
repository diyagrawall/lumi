(function () {
  if (window.LumiCart) return;
  var KEY = "lumi-cart-v1";
  var IMG = "assets/lumi-hero-campaign.png";
  var TANK_SIZES = ["XS", "S", "M", "L", "XL"];
  var catalog = {
    "pink-popcorn-tank": { name: "PINK POPCORN TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], field: "#EFCFCB", size: "278% auto", pos: "53% 10%" },
    "white-cocktail-tank": { name: "WHITE COCKTAIL TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], field: "#E8DDD4", size: "278% auto", pos: "22% 10%" },
    "black-fries-tank": { name: "BLACK FRIES TANK", mrp: 1199, kind: "tank", price: 899, sizes: TANK_SIZES, soldOut: [], field: "#1B1F16", size: "278% auto", pos: "90.6% 10%" },
    "popcorn-brooch": { name: "POPCORN BROOCH", mrp: 329, kind: "acc", price: 269, sizes: null, field: "#E7E9DE", size: "1000% auto", pos: "51.4% 59%" },
    "fries-brooch": { name: "FRIES BROOCH", mrp: 329, kind: "acc", price: 269, sizes: null, field: "#F6F2EA", size: "1200% auto", pos: "78.5% 67%" },
    "cocktail-brooch": { name: "COCKTAIL BROOCH", mrp: 329, kind: "acc", price: 269, sizes: null, field: "#F6E4E1", size: "1200% auto", pos: "26.7% 61%" },
    "heart-charm": { name: "HEART CHARM", mrp: 359, kind: "acc", price: 289, sizes: null, field: "#E7E9DE", size: "1000% auto", pos: "87.5% 70%" },
    "cherry-charm": { name: "CHERRY CHARM", mrp: 359, kind: "acc", price: 289, sizes: null, field: "#F6F2EA", size: "1500% auto", pos: "20.3% 67.5%" }
  };
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
    combo: { key: "combo", label: "TANK + 2 EXTRAS", short: "TANK + 2 EXTRAS → ₹1,300", line: "TANK + 2 EXTRAS = ₹1,300", sub: "Pick any tank + any 2 brooches or charms.", tanks: 1, acc: 2, price: 1300 },
    acc3: { key: "acc3", label: "PICK ANY 3 BUNDLE", short: "ANY 3 EXTRAS → ₹699", line: "PICK ANY 3. PAY ₹699.", sub: "Mix and match brooches & charms.", tanks: 0, acc: 3, price: 699 },
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
    if (t >= 1 && a === 1) return "Add 1 more brooch or charm — tank + 2 extras is ₹1,300.";
    if (t === 0 && a % 3 === 2) return "Add 1 more extra — any 3 are ₹699.";
    if (t === 0 && a % 3 === 1 && a > 1) return "Add 2 more extras — any 3 are ₹699.";
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
})();
