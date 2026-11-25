/* =========================================================
   PeriodikLab — script.js
   ========================================================= */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } }
};

/* =========================================================
   DATA UNSUR
   ========================================================= */
const RAW = `H|Hidrogen|1.008
He|Helium|4.0026
Li|Litium|6.94
Be|Berilium|9.0122
B|Boron|10.81
C|Karbon|12.011
N|Nitrogen|14.007
O|Oksigen|15.999
F|Fluor|18.998
Ne|Neon|20.180
Na|Natrium|22.990
Mg|Magnesium|24.305
Al|Aluminium|26.982
Si|Silikon|28.085
P|Fosfor|30.974
S|Belerang|32.06
Cl|Klorin|35.45
Ar|Argon|39.948
K|Kalium|39.098
Ca|Kalsium|40.078
Sc|Skandium|44.956
Ti|Titanium|47.867
V|Vanadium|50.942
Cr|Kromium|51.996
Mn|Mangan|54.938
Fe|Besi|55.845
Co|Kobalt|58.933
Ni|Nikel|58.693
Cu|Tembaga|63.546
Zn|Seng|65.38
Ga|Galium|69.723
Ge|Germanium|72.630
As|Arsen|74.922
Se|Selenium|78.971
Br|Bromin|79.904
Kr|Kripton|83.798
Rb|Rubidium|85.468
Sr|Stronsium|87.62
Y|Itrium|88.906
Zr|Zirkonium|91.224
Nb|Niobium|92.906
Mo|Molibdenum|95.95
Tc|Teknesium|98
Ru|Rutenium|101.07
Rh|Rodium|102.91
Pd|Paladium|106.42
Ag|Perak|107.87
Cd|Kadmium|112.41
In|Indium|114.82
Sn|Timah|118.71
Sb|Antimon|121.76
Te|Telurium|127.60
I|Iodin|126.90
Xe|Xenon|131.29
Cs|Sesium|132.91
Ba|Barium|137.33
La|Lantanum|138.91
Ce|Serium|140.12
Pr|Praseodimium|140.91
Nd|Neodimium|144.24
Pm|Prometium|145
Sm|Samarium|150.36
Eu|Europium|151.96
Gd|Gadolinium|157.25
Tb|Terbium|158.93
Dy|Disprosium|162.50
Ho|Holmium|164.93
Er|Erbium|167.26
Tm|Tulium|168.93
Yb|Iterbium|173.05
Lu|Lutesium|174.97
Hf|Hafnium|178.49
Ta|Tantalum|180.95
W|Tungsten|183.84
Re|Renium|186.21
Os|Osmium|190.23
Ir|Iridium|192.22
Pt|Platina|195.08
Au|Emas|196.97
Hg|Raksa|200.59
Tl|Talium|204.38
Pb|Timbal|207.2
Bi|Bismut|208.98
Po|Polonium|209
At|Astatin|210
Rn|Radon|222
Fr|Fransium|223
Ra|Radium|226
Ac|Aktinium|227
Th|Torium|232.04
Pa|Protaktinium|231.04
U|Uranium|238.03
Np|Neptunium|237
Pu|Plutonium|244
Am|Amerisium|243
Cm|Kurium|247
Bk|Berkelium|247
Cf|Kalifornium|251
Es|Einsteinium|252
Fm|Fermium|257
Md|Mendelevium|258
No|Nobelium|259
Lr|Lawrensium|266
Rf|Rutherfordium|267
Db|Dubnium|268
Sg|Seaborgium|269
Bh|Bohrium|270
Hs|Hasium|277
Mt|Meitnerium|278
Ds|Darmstadtium|281
Rg|Roentgenium|282
Cn|Kopernisium|285
Nh|Nihonium|286
Fl|Flerovium|289
Mc|Moskovium|290
Lv|Livermorium|293
Ts|Tenesin|294
Og|Oganeson|294`;

const CATS = {
  ak: { name: 'Logam Alkali',          color: 'var(--c-ak)', hex: '#fb7185' },
  at: { name: 'Logam Alkali Tanah',    color: 'var(--c-at)', hex: '#fb923c' },
  tr: { name: 'Logam Transisi',        color: 'var(--c-tr)', hex: '#fbbf24' },
  lg: { name: 'Logam Pasca-transisi',  color: 'var(--c-lg)', hex: '#a3e635' },
  mt: { name: 'Metaloid',              color: 'var(--c-mt)', hex: '#34d399' },
  nl: { name: 'Nonlogam',              color: 'var(--c-nl)', hex: '#22d3ee' },
  hl: { name: 'Halogen',               color: 'var(--c-hl)', hex: '#60a5fa' },
  gm: { name: 'Gas Mulia',             color: 'var(--c-gm)', hex: '#a78bfa' },
  ln: { name: 'Lantanida',             color: 'var(--c-ln)', hex: '#f472b6' },
  ac: { name: 'Aktinida',              color: 'var(--c-ac)', hex: '#e879f9' }
};

function catOf(z) {
  if ([3, 11, 19, 37, 55, 87].includes(z)) return 'ak';
  if ([4, 12, 20, 38, 56, 88].includes(z)) return 'at';
  if ([5, 14, 32, 33, 51, 52].includes(z)) return 'mt';
  if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return 'nl';
  if ([9, 17, 35, 53, 85, 117].includes(z)) return 'hl';
  if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return 'gm';
  if (z >= 57 && z <= 71) return 'ln';
  if (z >= 89 && z <= 103) return 'ac';
  if ([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116].includes(z)) return 'lg';
  return 'tr';
}

/* posisi golongan (g), periode (p), baris/kolom grid */
function posOf(z) {
  let g, p, row, col, f = false;
  if (z === 1) { p = 1; g = 1; }
  else if (z === 2) { p = 1; g = 18; }
  else if (z <= 4) { p = 2; g = z - 2; }
  else if (z <= 10) { p = 2; g = z + 8; }
  else if (z <= 12) { p = 3; g = z - 10; }
  else if (z <= 18) { p = 3; g = z; }
  else if (z <= 36) { p = 4; g = z - 18; }
  else if (z <= 54) { p = 5; g = z - 36; }
  else if (z <= 56) { p = 6; g = z - 54; }
  else if (z <= 71) { p = 6; g = 3; f = true; }
  else if (z <= 86) { p = 6; g = z - 68; }
  else if (z <= 88) { p = 7; g = z - 86; }
  else if (z <= 103) { p = 7; g = 3; f = true; }
  else { p = 7; g = z - 100; }
  if (f) { row = z <= 71 ? 9 : 10; col = (z <= 71 ? z - 57 : z - 89) + 3; }
  else { row = p; col = g; }
  return { g, p, row, col, f };
}

/* Keelektronegatifan (skala Pauling) */
const EN = { H:2.20, Li:.98, Be:1.57, B:2.04, C:2.55, N:3.04, O:3.44, F:3.98, Na:.93, Mg:1.31, Al:1.61, Si:1.90, P:2.19, S:2.58, Cl:3.16,
  K:.82, Ca:1.00, Sc:1.36, Ti:1.54, V:1.63, Cr:1.66, Mn:1.55, Fe:1.83, Co:1.88, Ni:1.91, Cu:1.90, Zn:1.65, Ga:1.81, Ge:2.01, As:2.18, Se:2.55, Br:2.96, Kr:3.00,
  Rb:.82, Sr:.95, Y:1.22, Zr:1.33, Nb:1.6, Mo:2.16, Tc:1.9, Ru:2.2, Rh:2.28, Pd:2.20, Ag:1.93, Cd:1.69, In:1.78, Sn:1.96, Sb:2.05, Te:2.1, I:2.66, Xe:2.6,
  Cs:.79, Ba:.89, Lu:1.27, Hf:1.3, Ta:1.5, W:2.36, Re:1.9, Os:2.2, Ir:2.2, Pt:2.28, Au:2.54, Hg:2.00, Tl:1.62, Pb:2.33, Bi:2.02, Po:2.0, At:2.2, Fr:.7, Ra:.9 };

const FACTS = {
  H: 'Unsur paling melimpah di alam semesta dan bahan bakar utama bintang.',
  He: 'Gas mulia yang sangat ringan, dipakai untuk mengisi balon udara dan mendinginkan alat MRI.',
  Li: 'Logam paling ringan; bahan utama baterai isi ulang pada ponsel dan kendaraan listrik.',
  C: 'Dasar semua senyawa organik; berwujud intan, grafit, hingga grafena.',
  N: 'Menyusun sekitar 78% udara dan menjadi unsur penting dalam pupuk.',
  O: 'Menyusun sekitar 21% udara dan dibutuhkan makhluk hidup untuk respirasi.',
  F: 'Unsur paling elektronegatif di tabel periodik; terdapat pada pasta gigi dalam bentuk fluorida.',
  Ne: 'Gas mulia yang berpendar jingga-merah pada lampu neon.',
  Na: 'Bereaksi hebat dengan air; bersama klorin membentuk garam dapur (NaCl).',
  Mg: 'Terbakar dengan nyala putih terang; ada di pusat molekul klorofil.',
  Al: 'Logam ringan dan tahan karat; dipakai pada pesawat dan kaleng minuman.',
  Si: 'Metaloid bahan semikonduktor, jantung chip komputer dan panel surya.',
  P: 'Penyusun DNA, ATP, dan tulang; juga ada pada kepala korek api.',
  S: 'Belerang berwarna kuning, banyak di sekitar gunung berapi, bahan asam sulfat.',
  Cl: 'Gas kuning kehijauan yang dipakai untuk mendisinfeksi air kolam renang.',
  K: 'Penting bagi saraf dan otot; banyak dalam pisang.',
  Ca: 'Penyusun utama tulang, gigi, dan cangkang.',
  Ti: 'Sangat kuat namun ringan, dipakai untuk implan medis dan pesawat.',
  Fe: 'Logam paling banyak dipakai manusia; ada pada hemoglobin darah.',
  Cu: 'Penghantar listrik yang sangat baik; dipakai untuk kabel.',
  Zn: 'Melapisi besi agar tidak berkarat (galvanisasi) dan penting bagi imunitas.',
  Br: 'Salah satu dari hanya dua unsur yang berwujud cair pada suhu kamar.',
  Ag: 'Penghantar listrik dan panas terbaik di antara semua logam.',
  Sn: 'Bahan solder dan pelapis kaleng makanan.',
  I: 'Dibutuhkan tubuh untuk hormon tiroid; ditambahkan pada garam beryodium.',
  Pt: 'Logam mulia yang dipakai pada perhiasan dan konverter katalitik.',
  Au: 'Logam mulia yang tidak berkarat; sejak lama menjadi simbol kekayaan.',
  Hg: 'Satu-satunya logam yang berwujud cair pada suhu kamar. Beracun!',
  Pb: 'Logam berat yang beracun; dulu dipakai untuk pipa dan cat.',
  U: 'Bahan bakar reaktor nuklir; seluruh isotopnya radioaktif.',
  Og: 'Unsur sintetis terberat yang diketahui, menutup periode ke-7.'
};

const ELEMENTS = RAW.split('\n').map((line, i) => {
  const [s, n, m] = line.split('|');
  const z = i + 1;
  return { z, s, n, m: parseFloat(m), cat: catOf(z), en: EN[s] ?? null, ...posOf(z) };
});

/* =========================================================
   KONFIGURASI ELEKTRON
   ========================================================= */
const ORDER = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p'];
const CAPS  = { s: 2, p: 6, d: 10, f: 14 };
const EXC = {
  Cr:{'4s':1,'3d':5}, Cu:{'4s':1,'3d':10}, Nb:{'5s':1,'4d':4}, Mo:{'5s':1,'4d':5}, Ru:{'5s':1,'4d':7},
  Rh:{'5s':1,'4d':8}, Pd:{'5s':0,'4d':10}, Ag:{'5s':1,'4d':10}, La:{'4f':0,'5d':1}, Ce:{'4f':1,'5d':1},
  Gd:{'4f':7,'5d':1}, Pt:{'6s':1,'5d':9}, Au:{'6s':1,'5d':10}, Ac:{'5f':0,'6d':1}, Th:{'5f':0,'6d':2},
  Pa:{'5f':2,'6d':1}, U:{'5f':3,'6d':1}, Np:{'5f':4,'6d':1}, Cm:{'5f':7,'6d':1}
};
const NOBLE = [[2,'He'],[10,'Ne'],[18,'Ar'],[36,'Kr'],[54,'Xe'],[86,'Rn']];
const LORD = { s: 0, p: 1, d: 2, f: 3 };

function configOf(z) {
  const sym = ELEMENTS[z - 1].s;
  const c = {};
  let left = z;
  for (const sub of ORDER) {
    if (left <= 0) break;
    const take = Math.min(CAPS[sub[1]], left);
    c[sub] = take; left -= take;
  }
  if (EXC[sym]) Object.assign(c, EXC[sym]);
  return c;
}
function sortSubs(keys) {
  return keys.sort((a, b) => (+a[0] - +b[0]) || (LORD[a[1]] - LORD[b[1]]));
}
function shellsOf(z) {
  const c = configOf(z), sh = [];
  for (const k in c) sh[+k[0] - 1] = (sh[+k[0] - 1] || 0) + c[k];
  return sh.map(v => v || 0);
}
function configHTML(z) {
  const full = configOf(z);
  let core = null;
  for (const [nz, ns] of NOBLE) if (nz < z) core = [nz, ns];
  let keys = sortSubs(Object.keys(full).filter(k => full[k] > 0));
  let prefix = '';
  if (core) {
    const cc = configOf(core[0]);
    prefix = `[${core[1]}] `;
    keys = keys.filter(k => full[k] !== (cc[k] || 0));
  }
  return prefix + keys.map(k => `${k}<sup>${full[k]}</sup>`).join(' ');
}
function groupLabel(e) {
  const g = e.g;
  if (e.f) return 'IIIB (golongan 3)';
  if (g === 1) return 'IA (golongan 1)';
  if (g === 2) return 'IIA (golongan 2)';
  if (g >= 13) return ['IIIA','IVA','VA','VIA','VIIA','VIIIA'][g - 13] + ` (golongan ${g})`;
  const b = { 3:'IIIB', 4:'IVB', 5:'VB', 6:'VIB', 7:'VIIB', 8:'VIIIB', 9:'VIIIB', 10:'VIIIB', 11:'IB', 12:'IIB' };
  return `${b[g]} (golongan ${g})`;
}
function blockOf(e) {
  if (e.f) return 'f';
  if (e.z === 2 || e.g <= 2) return 's';
  if (e.g >= 13) return 'p';
  return 'd';
}
function valenceOf(e) {
  if (e.z === 2) return '2';
  if (e.g <= 2) return String(e.g);
  if (e.g >= 13) return String(e.g - 10);
  return 'bervariasi';
}
function catColorHex(cat) { return CATS[cat].hex; }

/* =========================================================
   MODEL ATOM BOHR (canvas)
   ========================================================= */
class Bohr {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.shells = [2]; this.sym = 'H'; this.color = '#22d3ee'; this.t = 0; this.visible = true;
    new IntersectionObserver(en => { this.visible = en[0].isIntersecting; }).observe(canvas);
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }
  set(z) {
    const e = ELEMENTS[z - 1];
    this.shells = shellsOf(z);
    this.sym = e.s;
    this.color = catColorHex(e.cat);
  }
  loop() {
    if (this.visible) this.draw();
    requestAnimationFrame(this.loop);
  }
  draw() {
    const { ctx, c } = this;
    const W = c.width, H = c.height, cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);
    const n = this.shells.length || 1;
    const step = Math.min(26, 150 / n);
    this.t += reduceMotion ? 0 : 0.012;
    const style = getComputedStyle(document.documentElement);
    const light = document.documentElement.dataset.theme === 'light';
    // inti
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.35, this.color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 30 + Math.sin(this.t * 4) * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = light ? '#14193a' : '#0b1020';
    ctx.font = '700 13px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(this.sym, cx, cy + 1);
    // kulit & elektron
    this.shells.forEach((count, i) => {
      const r = 34 + (i + 1) * step - step * 0.2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = light ? 'rgba(20,30,80,.25)' : 'rgba(255,255,255,.22)'; ctx.lineWidth = 1.2; ctx.stroke();
      const speed = 1.6 / Math.pow(i + 1, 0.55) * (i % 2 ? -1 : 1);
      for (let k = 0; k < count; k++) {
        const a = this.t * speed * 2 + (Math.PI * 2 * k) / count;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        ctx.beginPath(); ctx.arc(x, y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      }
    });
  }
}

/* =========================================================
   NAVBAR, TEMA, SCROLL
   ========================================================= */
(function initChrome() {
  const html = document.documentElement;
  const themeBtn = $('#themeBtn');
  const saved = store.get('pl-theme', 'dark');
  html.dataset.theme = saved; themeBtn.textContent = saved === 'dark' ? '🌙' : '☀️';
  themeBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next; themeBtn.textContent = next === 'dark' ? '🌙' : '☀️'; store.set('pl-theme', next);
  });

  const menu = $('#menu');
  $('#burger').addEventListener('click', () => menu.classList.toggle('open'));
  $$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  const bar = $('#scrollProgress');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = $$('#menu a');
  const secObs = new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.dataset.sec === en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.chapter').forEach(s => secObs.observe(s));

  // reveal + counter
  const revObs = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('.count', en.target).forEach(runCounter);
      if (en.target.classList.contains('stats')) $$('.count', en.target).forEach(runCounter);
      revObs.unobserve(en.target);
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(el => revObs.observe(el));

  function runCounter(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const target = +el.dataset.count, dur = 1400, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();

/* =========================================================
   LATAR BELAKANG: SIMBOL UNSUR MELAYANG
   ========================================================= */
(function bg() {
  if (reduceMotion) return;
  const c = $('#bgCanvas'), ctx = c.getContext('2d');
  let W, H, ps = [];
  const syms = ['H','He','Li','C','N','O','Na','Fe','Cu','Au','Ag','Ne','Cl','K','Ca','Si','U'];
  function resize() {
    W = c.width = innerWidth; H = c.height = innerHeight;
    const n = Math.min(40, Math.floor(W / 38));
    ps = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      s: syms[Math.floor(Math.random() * syms.length)], r: 12 + Math.random() * 14, a: Math.random() * Math.PI * 2
    }));
  }
  resize(); addEventListener('resize', resize);
  (function frame() {
    ctx.clearRect(0, 0, W, H);
    const light = document.documentElement.dataset.theme === 'light';
    ctx.fillStyle = light ? 'rgba(40,60,140,.35)' : 'rgba(180,200,255,.5)';
    ctx.strokeStyle = light ? 'rgba(40,60,140,.07)' : 'rgba(180,200,255,.09)';
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.a += .003;
      if (p.x < -30) p.x = W + 30; if (p.x > W + 30) p.x = -30;
      if (p.y < -30) p.y = H + 30; if (p.y > H + 30) p.y = -30;
      ctx.font = `600 ${p.r}px system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.s, p.x, p.y);
    }
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
      const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
      if (dx * dx + dy * dy < 150 * 150) { ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
    }
    requestAnimationFrame(frame);
  })();
})();

/* =========================================================
   BAB 1 — LINIMASA
   ========================================================= */
(function timeline() {
  const EV = [
    { y: '1789', t: 'Lavoisier', w: 'Antoine Lavoisier', d: 'Mengelompokkan 33 zat yang dianggap unsur ke dalam empat kelompok: gas, nonlogam, logam, dan tanah. Ini adalah upaya pengelompokan unsur pertama.' },
    { y: '1829', t: 'Triade', w: 'Johann Dobereiner', d: 'Mengelompokkan unsur yang mirip dalam tiga serangkai (triade). Massa atom unsur tengah kira-kira sama dengan rata-rata unsur pertama dan ketiga, contohnya Li, Na, K.' },
    { y: '1864', t: 'Oktaf', w: 'John Newlands', d: 'Jika unsur diurutkan menurut massa atom, sifat unsur akan berulang pada unsur kedelapan, seperti nada oktaf musik. Hukum ini hanya cocok sampai unsur kalsium.' },
    { y: '1869', t: 'Mendeleev', w: 'Dmitri Mendeleev', d: 'Menyusun tabel berdasarkan kenaikan massa atom dan kemiripan sifat. Ia sengaja mengosongkan tempat untuk unsur yang belum ditemukan, seperti eka-silikon yang kemudian dikenal sebagai germanium.' },
    { y: '1913', t: 'Moseley', w: 'Henry Moseley', d: 'Menemukan bahwa nomor atom (jumlah proton) adalah dasar yang tepat untuk mengurutkan unsur. Dari sinilah lahir hukum periodik modern dan sistem periodik modern.' },
    { y: '1945', t: 'Aktinida', w: 'Glenn Seaborg', d: 'Mengusulkan agar deret aktinida diletakkan pada baris terpisah di bawah tabel, menyerupai deret lantanida, sehingga bentuk tabel modern semakin lengkap.' },
    { y: '2016', t: 'Periode 7 lengkap', w: 'IUPAC', d: 'Nama resmi unsur 113 (Nihonium), 115 (Moskovium), 117 (Tenesin), dan 118 (Oganeson) ditetapkan, sehingga periode ke-7 terisi penuh.' }
  ];
  const track = $('#tlTrack'), det = $('#tlDetail');
  EV.forEach((e, i) => {
    const b = document.createElement('button');
    b.className = 'tl-node'; b.setAttribute('role', 'tab');
    b.innerHTML = `<span>${e.y}</span><i></i><small>${e.t}</small>`;
    b.addEventListener('click', () => show(i));
    track.appendChild(b);
  });
  function show(i) {
    $$('.tl-node', track).forEach((n, k) => n.classList.toggle('active', k === i));
    const e = EV[i];
    det.style.animation = 'none'; void det.offsetWidth; det.style.animation = '';
    det.innerHTML = `<h4>${e.y} — ${e.t}</h4><p class="who">${e.w}</p><p>${e.d}</p>`;
  }
  show(0);
})();

/* =========================================================
   BAB 2 — TABEL INTERAKTIF
   ========================================================= */
const state = { mode: 'cat', cat: null, q: '', hl: null, sel: 6 };
const bohr = new Bohr($('#bohrCanvas'));

(function periodicTable() {
  const grid = $('#ptable');
  ELEMENTS.forEach(e => {
    const b = document.createElement('button');
    b.className = 'el'; b.dataset.z = e.z; b.type = 'button';
    b.style.gridRow = e.row; b.style.gridColumn = e.col;
    b.style.setProperty('--d', (e.col * 18 + e.row * 25) + 'ms');
    b.title = `${e.n} (${e.s}) — Z=${e.z}`;
    b.setAttribute('aria-label', `${e.n}, simbol ${e.s}, nomor atom ${e.z}`);
    b.innerHTML = `<span class="z">${e.z}</span><span class="s">${e.s}</span><span class="n">${e.n}</span>`;
    b.addEventListener('click', () => selectEl(e.z));
    grid.appendChild(b);
  });
  // penanda lantanida/aktinida
  [[6, 'ln', '57–71'], [7, 'ac', '89–103']].forEach(([row, k, t]) => {
    const p = document.createElement('div'); p.className = 'ph ' + k; p.style.gridRow = row; p.style.gridColumn = 3; p.textContent = t;
    grid.appendChild(p);
  });
  new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { grid.classList.add('in'); ob.disconnect(); } }, { threshold: .1 }).observe(grid);

  // legend
  const legend = $('#legend');
  function renderLegend() {
    legend.innerHTML = '';
    if (state.mode === 'cat') {
      Object.entries(CATS).forEach(([k, v]) => {
        const b = document.createElement('button');
        b.style.setProperty('--c', v.hex); b.innerHTML = `<i></i>${v.name}`;
        b.classList.toggle('active', state.cat === k);
        b.addEventListener('click', () => { state.cat = state.cat === k ? null : k; renderLegend(); applyFilter(); });
        legend.appendChild(b);
      });
    } else {
      const lo = state.mode === 'mass' ? '1' : '0,7', hi = state.mode === 'mass' ? '294' : '3,98';
      legend.innerHTML = `<div class="gradient-legend"><span>${lo}</span><i></i><span>${hi}</span><span>${state.mode === 'mass' ? '(massa atom relatif)' : '(skala Pauling; abu-abu = tidak ada data)'}</span></div>`;
    }
  }

  function applyColors() {
    $$('.el', grid).forEach(el => {
      const e = ELEMENTS[el.dataset.z - 1];
      let c;
      if (state.mode === 'cat') c = CATS[e.cat].hex;
      else if (state.mode === 'mass') c = heat((e.m - 1) / 293);
      else c = e.en == null ? '#8b93b5' : heat((e.en - 0.7) / 3.3);
      el.style.setProperty('--c', c);
    });
  }
  const heat = t => `hsl(${Math.round(220 - 200 * Math.min(1, Math.max(0, t)))} 80% 60%)`;

  window.applyFilter = function () {
    const q = state.q.trim().toLowerCase();
    $$('.el', grid).forEach(el => {
      const e = ELEMENTS[el.dataset.z - 1];
      let ok = true;
      if (state.mode === 'cat' && state.cat && e.cat !== state.cat) ok = false;
      if (q && !(e.n.toLowerCase().includes(q) || e.s.toLowerCase().startsWith(q) || String(e.z) === q)) ok = false;
      if (state.hl) {
        if (state.hl.t === 'g' && e.g !== state.hl.v) ok = false;
        if (state.hl.t === 'p' && e.p !== state.hl.v) ok = false;
      }
      el.classList.toggle('dim', !ok);
    });
    $('#clearHl').hidden = !state.hl;
  };

  $('#modeBtns').addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    $$('#modeBtns button').forEach(x => x.classList.toggle('active', x === b));
    state.mode = b.dataset.mode; if (state.mode !== 'cat') state.cat = null;
    applyColors(); renderLegend(); applyFilter();
  });
  $('#search').addEventListener('input', ev => { state.q = ev.target.value; applyFilter(); });
  $('#clearHl').addEventListener('click', () => { state.hl = null; applyFilter(); });
  $('#prevEl').addEventListener('click', () => selectEl(state.sel > 1 ? state.sel - 1 : 118));
  $('#nextEl').addEventListener('click', () => selectEl(state.sel < 118 ? state.sel + 1 : 1));

  applyColors(); renderLegend(); applyFilter(); selectEl(6);
})();

function selectEl(z) {
  state.sel = z;
  const e = ELEMENTS[z - 1], cat = CATS[e.cat];
  $$('.el').forEach(el => el.classList.toggle('sel', +el.dataset.z === z));
  const big = $('#dBig');
  big.style.setProperty('--c', cat.hex);
  big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop');
  $('#dZ').textContent = e.z; $('#dSym').textContent = e.s; $('#dMass').textContent = e.m;
  $('#dName').textContent = e.n;
  const badge = $('#dCat'); badge.textContent = cat.name; badge.style.background = cat.hex;
  $('#dGroup').textContent = groupLabel(e);
  $('#dPeriod').textContent = e.p;
  $('#dBlock').textContent = 'Blok ' + blockOf(e);
  $('#dEN').textContent = e.en != null ? e.en : 'Tidak ada data';
  $('#dShell').textContent = shellsOf(z).join(', ');
  $('#dConf').innerHTML = configHTML(z);
  $('#dFact').textContent = FACTS[e.s] ? '💡 ' + FACTS[e.s] : `💡 ${e.n} termasuk ${cat.name.toLowerCase()} dan berada pada periode ${e.p}.`;
  bohr.set(z);
}

/* tab */
(function tabs() {
  $$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
})();
function switchTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.tabpanel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  if (name === 'group') animatePeriodBars();
}

/* golongan & periode */
(function groups() {
  const G = [
    { g: 1,  n: 'IA',   t: 'Alkali',        c: '#fb7185', v: '1', d: 'Logam lunak, sangat reaktif, bereaksi hebat dengan air membentuk basa kuat.', ex: 'Li, Na, K, Rb, Cs, Fr' },
    { g: 2,  n: 'IIA',  t: 'Alkali Tanah',  c: '#fb923c', v: '2', d: 'Logam yang lebih keras dari alkali, cukup reaktif, membentuk ion 2+.', ex: 'Be, Mg, Ca, Sr, Ba, Ra' },
    { g: 13, n: 'IIIA', t: 'Boron',         c: '#a3e635', v: '3', d: 'Campuran metaloid (boron) dan logam. Aluminium sangat melimpah di kerak bumi.', ex: 'B, Al, Ga, In, Tl' },
    { g: 14, n: 'IVA',  t: 'Karbon',        c: '#34d399', v: '4', d: 'Beragam sifat, dari nonlogam hingga logam. Karbon dan silikon sangat penting.', ex: 'C, Si, Ge, Sn, Pb' },
    { g: 15, n: 'VA',   t: 'Nitrogen',      c: '#22d3ee', v: '5', d: 'Mengisi pupuk dan penyusun protein, DNA, serta senyawa biologis.', ex: 'N, P, As, Sb, Bi' },
    { g: 16, n: 'VIA',  t: 'Kalkogen',      c: '#38bdf8', v: '6', d: 'Cenderung menerima 2 elektron membentuk ion 2−. Oksigen penting bagi kehidupan.', ex: 'O, S, Se, Te, Po' },
    { g: 17, n: 'VIIA', t: 'Halogen',       c: '#60a5fa', v: '7', d: 'Nonlogam sangat reaktif, membentuk garam dengan logam, membentuk ion 1−.', ex: 'F, Cl, Br, I, At' },
    { g: 18, n: 'VIIIA',t: 'Gas Mulia',     c: '#a78bfa', v: '8 (He: 2)', d: 'Sangat stabil karena kulit terluar penuh, sehingga sukar bereaksi.', ex: 'He, Ne, Ar, Kr, Xe, Rn' },
    { g: 3,  n: 'B',    t: 'Transisi (3–12)',c: '#fbbf24', v: 'bervariasi', d: 'Logam keras, penghantar baik, banyak membentuk senyawa berwarna, bilangan oksidasi lebih dari satu.', ex: 'Fe, Cu, Zn, Ag, Au' }
  ];
  const wrap = $('#groupGrid');
  G.forEach(x => {
    const card = document.createElement('div'); card.className = 'gcard'; card.style.setProperty('--c', x.c);
    card.innerHTML = `<h4>${x.t}<span>${x.n}</span></h4><p>${x.d}</p>
      <div class="ex"><b>Elektron valensi:</b> ${x.v}<br><b>Contoh:</b> ${x.ex}</div>
      <button class="btn small ghost">Sorot di tabel</button>`;
    card.querySelector('button').addEventListener('click', () => highlight(x.g === 3 ? null : 'g', x.g, x.g === 3 ? [3,4,5,6,7,8,9,10,11,12] : null));
    wrap.appendChild(card);
  });
})();

function highlight(type, v, multi) {
  switchTab('table');
  if (multi) {
    state.hl = null; // sorot manual blok transisi
    $$('.el').forEach(el => {
      const e = ELEMENTS[el.dataset.z - 1];
      el.classList.toggle('dim', !(e.cat === 'tr'));
    });
    $('#clearHl').hidden = false;
    $('#clearHl').onclick = () => { applyFilter(); $('#clearHl').hidden = true; };
  } else {
    state.hl = { t: type, v }; applyFilter();
    $('#clearHl').onclick = () => { state.hl = null; applyFilter(); };
  }
  $('#ptable').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const PERIODS = [2, 8, 8, 18, 18, 32, 32];
(function periodBars() {
  const wrap = $('#periodBars');
  PERIODS.forEach((n, i) => {
    const b = document.createElement('button'); b.className = 'pbar';
    b.innerHTML = `<b>Periode ${i + 1}</b><span class="track"><span class="fill" data-w="${(n / 32) * 100}"></span></span><small>${n} unsur</small>`;
    b.addEventListener('click', () => highlight('p', i + 1));
    wrap.appendChild(b);
  });
})();
function animatePeriodBars() {
  $$('.fill').forEach(f => { f.style.width = '0'; });
  requestAnimationFrame(() => setTimeout(() => $$('.fill').forEach(f => { f.style.width = f.dataset.w + '%'; }), 60));
}

/* sifat periodik */
(function trends() {
  const P = {
    radius: { n: 'Jari-jari Atom', x: 'menurun', y: 'meningkat', xi: false, yi: true,
      d: 'Jarak dari inti ke kulit terluar. Ke kanan: muatan inti bertambah, elektron tertarik lebih kuat, sehingga atom mengecil. Ke bawah: kulit bertambah, sehingga atom membesar.',
      pts: ['Terbesar: kiri-bawah (Fr, Cs)', 'Terkecil: kanan-atas (He, Ne, F)'], f: 'Periode → mengecil • Golongan ↓ membesar' },
    ion: { n: 'Energi Ionisasi', x: 'meningkat', y: 'menurun', xi: true, yi: false,
      d: 'Energi minimum untuk melepas satu elektron terluar dari atom gas. Ke kanan semakin sulit melepas elektron; ke bawah elektron terluar makin jauh dari inti sehingga mudah lepas.',
      pts: ['Tertinggi: He, Ne, F (kanan-atas)', 'Terendah: Cs, Fr (kiri-bawah)', 'Ada pengecualian kecil, misalnya Be > B dan N > O'], f: 'Periode → naik • Golongan ↓ turun' },
    en: { n: 'Keelektronegatifan', x: 'meningkat', y: 'menurun', xi: true, yi: false,
      d: 'Kecenderungan atom menarik pasangan elektron dalam ikatan. Fluor adalah unsur paling elektronegatif (4,0 pada skala Pauling). Gas mulia umumnya tidak dihitung.',
      pts: ['Tertinggi: F, O, N, Cl', 'Terendah: Cs, Fr', 'Selisih keelektronegatifan menentukan jenis ikatan'], f: 'Periode → naik • Golongan ↓ turun' },
    ea: { n: 'Afinitas Elektron', x: 'meningkat', y: 'menurun', xi: true, yi: false,
      d: 'Energi yang dilepas/diserap ketika atom menerima elektron. Halogen punya afinitas elektron sangat besar (sangat mudah menerima elektron), sedangkan gas mulia hampir nol.',
      pts: ['Cenderung makin besar ke kanan', 'Tertinggi: Cl (bukan F, karena F sangat kecil sehingga tolakan elektron besar)', 'Gas mulia: sangat rendah'], f: 'Periode → cenderung naik • Golongan ↓ cenderung turun' },
    metal: { n: 'Sifat Logam', x: 'menurun', y: 'meningkat', xi: false, yi: true,
      d: 'Sifat mudah melepas elektron membentuk ion positif. Logam paling aktif berada di kiri-bawah. Ke kanan sifat nonlogam bertambah.',
      pts: ['Paling logam: Fr, Cs', 'Metaloid berada di perbatasan tangga (B, Si, Ge, As, Sb, Te)', 'Nonlogam di kanan-atas'], f: 'Periode → menurun • Golongan ↓ meningkat' }
  };
  const grid = $('#trendGrid'), COLS = 8, ROWS = 5;
  for (let i = 0; i < COLS * ROWS; i++) {
    const d = document.createElement('div'); d.className = 'tcell'; d.style.setProperty('--i', (i % COLS) + Math.floor(i / COLS));
    grid.appendChild(d);
  }
  function show(k) {
    const p = P[k];
    $$('#trendBtns button').forEach(b => b.classList.toggle('active', b.dataset.p === k));
    $$('.tcell', grid).forEach((d, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      const tx = p.xi ? col / (COLS - 1) : 1 - col / (COLS - 1);
      const ty = p.yi ? row / (ROWS - 1) : 1 - row / (ROWS - 1);
      const t = (tx + ty) / 2;
      d.style.background = `hsl(${Math.round(250 - 210 * t)} 85% ${32 + 30 * t}%)`;
    });
    $('#trendArrowX').textContent = (p.x === 'meningkat' ? '▲ ' : '▼ ') + p.x;
    $('#trendArrowY').textContent = (p.y === 'meningkat' ? '▲ ' : '▼ ') + p.y;
    $('#trendText').innerHTML = `<h4>${p.n}</h4><p>${p.d}</p><ul>${p.pts.map(x => `<li>${x}</li>`).join('')}</ul><span class="formula">${p.f}</span>`;
  }
  $('#trendBtns').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(b.dataset.p); });
  show('radius');
})();

/* simulator konfigurasi */
(function simulator() {
  const bohr2 = new Bohr($('#simCanvas'));
  const range = $('#zRange'), out = $('#zNum'), play = $('#playSim');
  let timer = null;
  function update(z) {
    z = +z; const e = ELEMENTS[z - 1], cat = CATS[e.cat];
    out.textContent = z; range.value = z;
    $('#simBig').style.setProperty('--c', cat.hex);
    $('#simZ').textContent = z; $('#simSym').textContent = e.s; $('#simName').textContent = e.n;
    const b = $('#simCat'); b.textContent = cat.name; b.style.background = cat.hex;
    $('#simConf').innerHTML = configHTML(z);
    const sh = shellsOf(z), names = 'KLMNOPQ';
    $('#simShell').textContent = sh.map((v, i) => `${names[i]}=${v}`).join('  ') + '  →  ' + sh.join(', ');
    $('#simPeriod').textContent = `${e.p} (${sh.length} kulit)`;
    $('#simGroup').textContent = groupLabel(e);
    $('#simVal').textContent = valenceOf(e);
    $('#simBlock').textContent = 'Blok ' + blockOf(e);
    const c = configOf(z);
    const subs = sortSubs(Object.keys(c).filter(k => c[k] > 0));
    $('#simDots').innerHTML = subs.map(k => {
      const cap = CAPS[k[1]];
      return `<div class="dot-row"><b>${k}</b><span class="cap">${Array.from({ length: cap }, (_, i) => `<i class="${i < c[k] ? 'on' : ''}"></i>`).join('')}</span><em>${c[k]}/${cap}</em></div>`;
    }).join('');
    bohr2.set(z);
  }
  range.addEventListener('input', () => { stop(); update(range.value); });
  function stop() { clearInterval(timer); timer = null; play.textContent = '▶ Putar'; }
  play.addEventListener('click', () => {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Jeda';
    if (+range.value >= 118) range.value = 0;
    timer = setInterval(() => {
      const nz = +range.value + 1;
      if (nz > 118) { stop(); return; }
      update(nz);
    }, 420);
  });
  update(11);
})();

/* =========================================================
   BAB 3 — PROJECT BASED LEARNING
   ========================================================= */
(function pjbl() {
  const STEPS = [
    { t: 'Pertanyaan Mendasar', d: 'Kelompok membentuk dan memahami masalah yang akan dipecahkan.', l: ['Bentuk kelompok 4–5 siswa', 'Amati tabel periodik dan catat pola yang kamu temukan', 'Rumuskan minimal 3 pertanyaan yang ingin kamu jawab'] },
    { t: 'Desain Perencanaan', d: 'Merancang produk dan membagi peran.', l: ['Pilih produk proyek (maket, kartu, atau infografis)', 'Bagi peran: ketua, peneliti data, desainer, presenter', 'Daftar alat dan bahan yang dibutuhkan'] },
    { t: 'Menyusun Jadwal', d: 'Menetapkan batas waktu tiap tahap.', l: ['Buat jadwal 4 pekan', 'Tentukan tanggal penting (draf, uji coba, presentasi)', 'Tetapkan penanggung jawab tiap tugas'] },
    { t: 'Memonitor Proyek', d: 'Guru memantau kemajuan dan memberi umpan balik.', l: ['Isi jurnal harian kelompok', 'Konsultasi singkat dengan guru tiap pekan', 'Perbaiki data yang masih keliru'] },
    { t: 'Menguji Hasil', d: 'Produk dipresentasikan dan diuji.', l: ['Presentasi 5 menit tiap kelompok', 'Galeri jalan: kelompok lain memberi komentar', 'Teman menguji dengan 3 pertanyaan tentang unsur'] },
    { t: 'Evaluasi Pengalaman', d: 'Refleksi proses dan hasil belajar.', l: ['Isi lembar refleksi pribadi', 'Nilai dengan rubrik', 'Diskusikan: apa yang akan diperbaiki?'] }
  ];
  const track = $('#pjSteps'), det = $('#pjDetail'), fill = $('#stepFill');
  STEPS.forEach((s, i) => {
    const b = document.createElement('button'); b.className = 'step'; b.innerHTML = `<b>${i + 1}</b><span>${s.t}</span>`;
    b.addEventListener('click', () => show(i)); track.appendChild(b);
  });
  function show(i) {
    $$('.step', track).forEach((el, k) => { el.classList.toggle('active', k === i); el.classList.toggle('done', k < i); });
    fill.style.width = ((i + 1) / STEPS.length * 100) + '%';
    const s = STEPS[i];
    det.style.animation = 'none'; void det.offsetWidth; det.style.animation = '';
    det.innerHTML = `<h4>Langkah ${i + 1}: ${s.t}</h4><p>${s.d}</p><ul>${s.l.map(x => `<li>${x}</li>`).join('')}</ul>`;
  }
  show(0);

  // pilihan produk
  const OPTS = [
    { i: '🧊', t: 'Maket Tabel Periodik 3D', d: 'Buat tabel periodik dari kotak bekas atau kardus. Tiap kotak berisi simbol, nomor atom, dan contoh benda sehari-hari.' },
    { i: '🃏', t: 'Kartu Unsur (Permainan)', d: 'Rancang set kartu unsur lengkap dengan data. Buat aturan permainan menebak golongan dan periode.' },
    { i: '🎬', t: 'Infografis / Video Pendek', d: 'Buat infografis atau video 2–3 menit tentang unsur di kehidupan sehari-hari dan tren sifat periodik.' }
  ];
  const optWrap = $('#pjOptions');
  const chosen = store.get('pl-opt', -1);
  OPTS.forEach((o, i) => {
    const b = document.createElement('button'); b.className = 'card glass opt' + (i === chosen ? ' selected' : '');
    b.innerHTML = `<div class="card-icon">${o.i}</div><h3>${o.t}</h3><p>${o.d}</p><span class="tag">✔ Dipilih</span>`;
    b.addEventListener('click', () => { $$('.opt', optWrap).forEach(x => x.classList.remove('selected')); b.classList.add('selected'); store.set('pl-opt', i); });
    optWrap.appendChild(b);
  });

  // checklist
  const ITEMS = ['Membentuk kelompok dan membagi peran', 'Menentukan produk proyek', 'Riset data 20 unsur (Z, massa, konfigurasi, golongan, periode)', 'Membuat sketsa desain', 'Membuat produk', 'Menguji dan memperbaiki produk', 'Presentasi dan galeri jalan', 'Mengisi lembar refleksi'];
  const done = store.get('pl-check', []);
  const ul = $('#pjCheck'), ring = $('#pjRing'), pct = $('#pjPct');
  ITEMS.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" ${done.includes(i) ? 'checked' : ''}><span>${t}</span></label>`;
    li.querySelector('input').addEventListener('change', ev => {
      const idx = done.indexOf(i);
      if (ev.target.checked && idx < 0) done.push(i); if (!ev.target.checked && idx >= 0) done.splice(idx, 1);
      store.set('pl-check', done); upd();
    });
    ul.appendChild(li);
  });
  function upd() {
    const p = Math.round(done.length / ITEMS.length * 100);
    ring.style.strokeDashoffset = 314 - 314 * p / 100; pct.textContent = p + '%';
  }
  setTimeout(upd, 400);

  // undi unsur
  const slot = $('#spinSlot'), btn = $('#spinBtn'), info = $('#spinInfo');
  btn.addEventListener('click', () => {
    btn.disabled = true; slot.classList.remove('done'); slot.classList.add('spinning'); info.textContent = '';
    const pool = ELEMENTS.filter(e => e.z <= 86);
    const final = pool[Math.floor(Math.random() * pool.length)];
    let n = 0, total = reduceMotion ? 1 : 24;
    const iv = setInterval(() => {
      const e = n < total ? pool[Math.floor(Math.random() * pool.length)] : final;
      $('.slot-z', slot).textContent = e.z; $('.slot-s', slot).textContent = e.s; $('.slot-n', slot).textContent = e.n;
      n++;
      if (n > total) {
        clearInterval(iv); slot.classList.remove('spinning'); slot.classList.add('done'); btn.disabled = false;
        info.innerHTML = `Tugas: teliti <b>${final.n}</b> (${final.s}), meliputi nomor atom, massa, konfigurasi elektron, golongan ${final.g}, periode ${final.p}, kegunaan, dan satu fakta menarik.`;
      }
    }, 70 + (reduceMotion ? 0 : 0));
  });
})();

/* =========================================================
   BAB 4 — KUIS 15 SOAL
   ========================================================= */
const QUESTIONS = [
  { q: 'Ilmuwan yang pada tahun 1869 menyusun tabel periodik berdasarkan kenaikan massa atom dan mengosongkan tempat untuk unsur yang belum ditemukan adalah …',
    o: ['Antoine Lavoisier', 'Johann Dobereiner', 'Dmitri Mendeleev', 'Henry Moseley'], a: 2,
    e: 'Dmitri Mendeleev menyusun tabel berdasarkan massa atom dan meramalkan unsur baru, misalnya eka-silikon (germanium).' },
  { q: 'Sistem periodik modern disusun berdasarkan …',
    o: ['Kenaikan massa atom', 'Kenaikan nomor atom', 'Jumlah neutron', 'Wujud zat'], a: 1,
    e: 'Henry Moseley menunjukkan bahwa nomor atom (jumlah proton) adalah dasar pengurutan unsur dalam sistem periodik modern.' },
  { q: 'Sistem periodik modern terdiri atas … golongan dan … periode.',
    o: ['8 golongan dan 7 periode', '18 golongan dan 7 periode', '18 golongan dan 8 periode', '16 golongan dan 7 periode'], a: 1,
    e: 'Tabel periodik modern memiliki 18 golongan (kolom) dan 7 periode (baris).' },
  { q: 'Pengelompokan tiga unsur bersifat mirip, dengan massa atom unsur tengah kira-kira rata-rata unsur pertama dan ketiga, dikemukakan oleh …',
    o: ['Dobereiner', 'Newlands', 'Mendeleev', 'Lavoisier'], a: 0,
    e: 'Itu adalah hukum Triade Dobereiner, misalnya Li (7), Na (23), dan K (39).' },
  { q: 'Hukum Oktaf yang menyatakan sifat unsur berulang pada unsur kedelapan dikemukakan oleh …',
    o: ['Moseley', 'Dobereiner', 'Seaborg', 'Newlands'], a: 3,
    e: 'John Newlands menyusun unsur menurut massa atom dan menemukan sifat berulang pada setiap unsur kedelapan.' },
  { q: 'Unsur golongan IA (kecuali hidrogen) disebut …',
    o: ['Alkali tanah', 'Halogen', 'Alkali', 'Gas mulia'], a: 2,
    e: 'Golongan IA (Li, Na, K, Rb, Cs, Fr) disebut logam alkali.' },
  { q: 'Unsur dengan konfigurasi elektron 2, 8, 7 terletak pada golongan … dan periode …',
    o: ['VIIA, periode 3', 'VIIA, periode 2', 'VA, periode 3', 'VIIIA, periode 3'], a: 0,
    e: 'Ada 3 kulit sehingga periode 3, dan 7 elektron valensi sehingga golongan VIIA (unsur klorin).' },
  { q: 'Unsur yang memiliki keelektronegatifan terbesar adalah …',
    o: ['Oksigen', 'Klorin', 'Fluor', 'Nitrogen'], a: 2,
    e: 'Fluor adalah unsur paling elektronegatif (skala Pauling 3,98).' },
  { q: 'Dalam satu periode, dari kiri ke kanan, jari-jari atom cenderung …',
    o: ['Bertambah besar', 'Bertambah kecil', 'Tetap', 'Tidak beraturan'], a: 1,
    e: 'Muatan inti bertambah sedangkan jumlah kulit tetap, sehingga elektron tertarik lebih kuat dan atom mengecil.' },
  { q: 'Dalam satu golongan, dari atas ke bawah, energi ionisasi pertama cenderung …',
    o: ['Meningkat', 'Menurun', 'Tetap', 'Mula-mula naik lalu turun'], a: 1,
    e: 'Ke bawah jumlah kulit bertambah, elektron terluar makin jauh dari inti sehingga lebih mudah dilepas.' },
  { q: 'Gas mulia sukar bereaksi karena …',
    o: ['Berwujud gas', 'Kulit terluarnya penuh (stabil)', 'Massa atomnya kecil', 'Tidak memiliki elektron'], a: 1,
    e: 'Gas mulia memiliki konfigurasi duplet (He) atau oktet (lainnya) yang sangat stabil.' },
  { q: 'Jumlah elektron valensi atom natrium (nomor atom 11) adalah …',
    o: ['1', '2', '3', '8'], a: 0,
    e: 'Konfigurasi Na adalah 2, 8, 1, sehingga elektron valensinya 1.' },
  { q: 'Unsur-unsur transisi terletak pada golongan …',
    o: ['A', 'B', 'IA dan IIA', 'VIIIA'], a: 1,
    e: 'Unsur transisi berada pada golongan B (golongan 3 sampai 12), dengan subkulit d yang sedang terisi.' },
  { q: 'Unsur yang berada satu golongan dengan klorin (Z = 17) adalah …',
    o: ['Oksigen (Z = 8)', 'Neon (Z = 10)', 'Natrium (Z = 11)', 'Fluor (Z = 9)'], a: 3,
    e: 'Klorin dan fluor sama-sama memiliki 7 elektron valensi, golongan VIIA (halogen).' },
  { q: 'Unsur dengan konfigurasi elektron 1s² 2s² 2p⁶ 3s² terletak pada periode … golongan …',
    o: ['2, IIA', '3, IIA', '3, IIIA', '3, VIIIA'], a: 1,
    e: 'Kulit terbesar n = 3 sehingga periode 3, dan elektron valensi 3s² = 2 sehingga golongan IIA (magnesium).' }
];

(function quiz() {
  const box = $('#quizBox');
  const S = { i: 0, score: 0, ans: Array(QUESTIONS.length).fill(null), answered: false };

  function render() {
    if (S.i >= QUESTIONS.length) return result();
    const q = QUESTIONS[S.i], L = ['A', 'B', 'C', 'D'];
    S.answered = S.ans[S.i] !== null;
    box.innerHTML = `
      <div class="q-top"><span>Soal ${S.i + 1} dari ${QUESTIONS.length}</span><span class="score">⭐ Skor: ${S.score}</span></div>
      <div class="q-bar"><i style="width:${(S.i / QUESTIONS.length) * 100}%"></i></div>
      <div class="q-dots">${QUESTIONS.map((_, k) => `<i class="${k === S.i ? 'cur' : ''} ${S.ans[k] === null ? '' : (S.ans[k] === QUESTIONS[k].a ? 'ok' : 'no')}"></i>`).join('')}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-opts">${q.o.map((t, k) => `<button class="q-opt" data-k="${k}"><b>${L[k]}</b><span>${t}</span></button>`).join('')}</div>
      <div id="qFeed"></div>
      <div class="q-actions"><button class="btn primary" id="qNext" hidden>${S.i === QUESTIONS.length - 1 ? 'Lihat Hasil 🏁' : 'Soal Berikutnya ➜'}</button></div>`;
    $$('.q-opt', box).forEach(b => b.addEventListener('click', () => pick(+b.dataset.k)));
    $('#qNext').addEventListener('click', () => { S.i++; render(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  }

  function pick(k) {
    if (S.answered) return; S.answered = true;
    const q = QUESTIONS[S.i]; S.ans[S.i] = k;
    const ok = k === q.a; if (ok) S.score++;
    $$('.q-opt', box).forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.a) b.classList.add('correct'); else if (idx === k) b.classList.add('wrong');
    });
    $('.score', box).textContent = '⭐ Skor: ' + S.score;
    $$('.q-dots i', box)[S.i].classList.add(ok ? 'ok' : 'no');
    $('#qFeed').innerHTML = `<div class="q-explain"><b>${ok ? '🎉 Benar!' : '😅 Belum tepat.'}</b> ${q.e}</div>`;
    $('#qNext').hidden = false;
  }

  function result() {
    const pct = Math.round(S.score / QUESTIONS.length * 100);
    const best = store.get('pl-best', 0);
    if (S.score > best) store.set('pl-best', S.score);
    updateBest();
    const [emoji, msg] = pct >= 90 ? ['🏆', 'Luar biasa! Kamu menguasai sistem periodik.'] :
      pct >= 75 ? ['🎉', 'Bagus sekali! Sedikit lagi sempurna.'] :
      pct >= 60 ? ['👍', 'Cukup baik. Ulangi materi yang masih keliru.'] : ['📚', 'Jangan menyerah! Pelajari kembali Bab 2 lalu coba lagi.'];
    box.innerHTML = `<div class="result">
      <div class="emoji">${emoji}</div>
      <div class="big">${S.score}<small> / ${QUESTIONS.length}</small></div>
      <p><b>Nilai: ${pct}</b> — ${msg}</p>
      <div class="result-actions">
        <button class="btn primary" id="qAgain">🔁 Ulangi Kuis</button>
        <a class="btn ghost" href="#bab2">Pelajari Materi</a>
        <a class="btn ghost" href="#bab5">Ke Kesimpulan</a>
      </div>
      <div class="review"><h4>Pembahasan</h4>
        ${QUESTIONS.map((q, k) => `<details class="${S.ans[k] === q.a ? 'ok' : 'no'}"><summary>${k + 1}. ${q.q}</summary>
          <p>Jawabanmu: <b>${S.ans[k] === null ? '-' : q.o[S.ans[k]]}</b><br>Jawaban benar: <b>${q.o[q.a]}</b><br>${q.e}</p></details>`).join('')}
      </div></div>`;
    $('#qAgain').addEventListener('click', () => { S.i = 0; S.score = 0; S.ans.fill(null); render(); });
    if (pct >= 75) confetti();
  }
  render();
})();

function updateBest() {
  const b = store.get('pl-best', null);
  $('#bestScore').textContent = b === null ? '–' : b;
}
updateBest();

/* konfeti */
function confetti() {
  if (reduceMotion) return;
  const c = $('#confetti'), ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#5eead4', '#a78bfa', '#f472b6', '#fbbf24', '#60a5fa', '#34d399'];
  const ps = Array.from({ length: 160 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)]
  }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    if (t - t0 < 4500) requestAnimationFrame(frame); else ctx.clearRect(0, 0, c.width, c.height);
  })(t0);
}
