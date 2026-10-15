// ---- shared stage, scaling, audio and drawing helpers (carried over from the interaction studies) ----
// The studies were drawn on a 390 x 844 phone stage. Here the canvas fills the browser window and is scaled
// by U so that 844 virtual units fill the window height; W and H are the window size in those virtual units.
const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
let W = 390, H = 844, DPR = 1, U = 1;
const REF_H = 844, MIN_W = 520;
function resize() {
  const r = cvs.getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  U = Math.min(r.height / REF_H, r.width / MIN_W);
  W = r.width / U; H = r.height / U;
  cvs.width = Math.round(r.width * DPR); cvs.height = Math.round(r.height * DPR);
  ctx.setTransform(DPR * U, 0, 0, DPR * U, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const now = () => performance.now() / 1000;
const easeIO = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
const blur = px => `blur(${px * U}px)`;     // canvas filters are in device-independent pixels, not virtual units

// ---- pointer helpers: mouse and pen only (these studies read hover + press) ----
const isMouse = e => e.pointerType === 'mouse' || e.pointerType === 'pen';
function pos(e) {
  const r = cvs.getBoundingClientRect();
  return { x: (e.clientX - r.left) / U, y: (e.clientY - r.top) / U };
}

// ---- assets ----
const IMG = {};
function loadImg(name) { const im = new Image(); im.src = 'assets/svg/' + name + '.svg'; return im; }
IMG.can = loadImg('can');
IMG.statement = loadImg('statement');
const GLOVES = [1, 2, 3, 4, 5].map(i => loadImg('glove-' + i));            // open -> fist (study 3)
const ROLL = [1, 2, 3, 4, 5, 6, 7, 8].map(i => loadImg('ball-roll-' + i));  // ball rolling toward you (study 4)

// ---- audio ----
let AC = null, master = null;
function audio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain(); master.gain.value = 0.55;
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      master.connect(lp); lp.connect(AC.destination);
    } catch (e) { AC = null; }
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}
// soft, slow-attack tone (silky: no hard transient)
function tone(freq, dur = 1.6, vol = 0.18, delay = 0, type = 'sine') {
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  const o2 = a.createOscillator();              // slight detune for sheen
  o.type = type; o2.type = 'sine';
  o.frequency.value = freq; o2.frequency.value = freq * 1.003;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); o2.connect(g); g.connect(master);
  o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
}
// continuous voice (for groans / flight hum)
function makeVoice(type = 'triangle') {
  const a = audio(); if (!a) return null;
  const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
  o.type = type; f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 4;
  g.gain.value = 0.0001;
  o.connect(f); f.connect(g); g.connect(master); o.start();
  return {
    set(freq, vol, cutoff) {
      const t = a.currentTime;
      o.frequency.setTargetAtTime(freq, t, 0.05);
      g.gain.setTargetAtTime(Math.max(vol, 0.0001), t, 0.08);
      if (cutoff) f.frequency.setTargetAtTime(cutoff, t, 0.08);
    },
    off() { g.gain.setTargetAtTime(0.0001, a.currentTime, 0.15); }
  };
}
let NOISE = null;
function noiseBuf() {
  const a = audio(); if (!a) return null;
  if (!NOISE) { NOISE = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = NOISE.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  return NOISE;
}
function burst({ dur = 0.05, freq = 3000, q = 1, vol = 0.2, delay = 0, type = 'bandpass', attack = 0.002 } = {}) {
  const a = audio(), buf = noiseBuf(); if (!a || !buf) return;
  const t = a.currentTime + delay, s = a.createBufferSource(); s.buffer = buf;
  const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}
function rustle(k = 1) { for (let i = 0; i < 1 + Math.floor(Math.random() * 3 * k); i++) burst({ dur: 0.03 + Math.random() * 0.05, freq: 1500 + Math.random() * 4000, q: 1.5 + Math.random() * 3, vol: 0.06 * k, delay: i * 0.015 }); }
function thud(vol = 0.3, freq = 90) {
  const a = audio(); if (!a) return;
  const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
  o.frequency.setValueAtTime(freq * 1.8, t); o.frequency.exponentialRampToValueAtTime(freq, t + 0.1);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.35);
}
function makeNoiseVoice(type = 'bandpass') {
  const a = audio(), buf = noiseBuf(); if (!a || !buf) return null;
  const s = a.createBufferSource(); s.buffer = buf; s.loop = true;
  const f = a.createBiquadFilter(); f.type = type; f.frequency.value = 600; f.Q.value = 0.8;
  const g = a.createGain(); g.gain.value = 0.0001; s.connect(f); f.connect(g); g.connect(master); s.start();
  return { set(fr, v, q) { const t = a.currentTime; f.frequency.setTargetAtTime(fr, t, 0.05); g.gain.setTargetAtTime(Math.max(v, 0.0001), t, 0.06); if (q) f.Q.setTargetAtTime(q, t, 0.05); },
           off() { g.gain.setTargetAtTime(0.0001, a.currentTime, 0.1); } };
}

// ---- cue: soft ripple where you click off target ----
function softRipple(list, t) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i], age = t - p.t; if (age > 0.5) { list.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(43,43,42,${(1 - age / 0.5) * 0.12})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 6 + age * 50, 0, Math.PI * 2); ctx.fill();
  }
}

// ---- low-poly crumpled ball (same scheme as crushing_01_ball.svg) ----
function makeBall(seed) {
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const n = 11, outer = [], inner = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + (rnd() - 0.5) * 0.24; outer.push([Math.cos(a) * (0.82 + rnd() * 0.26), Math.sin(a) * (0.82 + rnd() * 0.26)]);
    const b = (i + 0.5) / n * Math.PI * 2, r = 0.5 * (0.7 + rnd() * 0.5); inner.push([Math.cos(b) * r - 0.08, Math.sin(b) * r - 0.1]);
  }
  const tris = [];
  for (let i = 0; i < n; i++) {
    const a = outer[i], b = outer[(i + 1) % n], m = inner[i], m0 = inner[(i - 1 + n) % n];
    tris.push([a, b, m], [a, m, m0], [m0, m, [-0.12, -0.15]]);
  }
  tris.forEach(t => t.j = (rnd() - 0.5) * 2.4);
  return { outer, tris };
}
const SHADES = ['#f3f3f0', '#e8e8e4', '#dcdbd6', '#cfcec9', '#c2c1bc', '#b3b2ad', '#a3a29d'];
function triShade(t, rot) {
  const mx = (t[0][0] + t[1][0] + t[2][0]) / 3, my = (t[0][1] + t[1][1] + t[2][1]) / 3;
  const c = Math.cos(rot), s = Math.sin(rot), x = mx * c - my * s, y = mx * s + my * c;
  return SHADES[Math.max(0, Math.min(6, Math.round(3 + (x + y) * 2.2 + t.j)))];
}
function drawBall(ball, cx, cy, r, rot = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy); ctx.rotate(rot);
  for (const t of ball.tris) {
    ctx.fillStyle = triShade(t, rot);
    ctx.beginPath(); ctx.moveTo(t[0][0] * r, t[0][1] * r); ctx.lineTo(t[1][0] * r, t[1][1] * r); ctx.lineTo(t[2][0] * r, t[2][1] * r); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.6; ctx.stroke();   // hide hairline seams
  }
  ctx.restore();
}

// ---- the statement sheet, shared by steps 1-3 ----
const PAPER = '#f4f3ef';          // paper colour (study 2's sheet)
const GROUND = '#e4e3df';         // the plain light ground of steps 2-3
const DRAFT_GROUND = '#d4d3cf';   // step 1's slightly darker ground, so the white draft streaks read
