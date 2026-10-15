// STEP 3 — CRUMPLE · CRUSHING  (from interaction-study-3-crumple)
// Intro: the face-up statement settles to crumpling size. Hover: two open white-glove hands fade in at its sides.
// Press and hold: the hands close in, fingers curl, and they shake harder as the paper is crushed into a low-poly
// ball. Letting go early lets it spring partly back. Done once the ball has settled and the hands have gone.
const StepCrumple = (() => {
  const HW = 98, HH = 128, M = 22, BALL_R = 50, INTRO = 0.6;
  const BALL = makeBall(17);
  const RECT = [], TARGET = [];
  for (let i = 0; i < M; i++) {
    const u = i / M * 4, side = Math.floor(u), f = u - side;
    const p = side === 0 ? [-HW + 2 * HW * f, -HH] : side === 1 ? [HW, -HH + 2 * HH * f] : side === 2 ? [HW - 2 * HW * f, HH] : [-HW, HH - 2 * HH * f];
    RECT.push(p);
    const a = Math.atan2(p[1], p[0]);
    let best = BALL.outer[0], bd = 9; BALL.outer.forEach(o => { const d = Math.abs(Math.atan2(o[1], o[0]) - a); const dd = Math.min(d, 2 * Math.PI - d); if (dd < bd) { bd = dd; best = o; } });
    const r = Math.hypot(...best); TARGET.push([Math.cos(a) * r * BALL_R, Math.sin(a) * r * BALL_R]);
  }
  let S;
  function enter(t) {
    S = { c: 0, L: 0, held: false, mouse: null, state: 'intro', introT: t, shake: 0, handA: 0, close: 0, ripples: [], groan: null, doneT: 0, done: false };
  }
  function exit() { if (S.groan) S.groan.off(); }
  const center = () => ({ x: W / 2, y: H * 0.47 });
  const halfW = k => lerp(HW, BALL_R, k);
  function overPaper(p) { const c = center(), k = easeIO(S.c); return p && Math.abs(p.x - c.x) < halfW(k) + 60 && Math.abs(p.y - c.y) < lerp(HH, BALL_R, k) + 30; }

  function move(e, p) { S.mouse = p; }
  function leave() { S.mouse = null; }
  function down(e, p) {
    if (S.state === 'ball' || S.state === 'intro') return;
    if (overPaper(p)) {
      cvs.setPointerCapture(e.pointerId); S.held = true; S.state = 'crush';
      if (!S.groan) S.groan = makeVoice('sawtooth');
      thud(0.1, 80); rustle(0.5);
    } else S.ripples.push({ x: p.x, y: p.y, t: now() });
  }
  function up() {
    if (!S.held) return; S.held = false;
    if (S.groan) S.groan.off();
    if (S.state !== 'ball') { S.L = S.c * 0.85; S.state = 'flat'; }
  }

  function frame(t) {
    const dt = 1 / 60;
    // ---- intro: hand-off from step 2 (the face-up sheet at 230 x 300 on the same ground) ----
    if (S.state === 'intro') {
      const k = easeIO((t - S.introT) / INTRO), c2 = StepFlip.center(), c = center();
      if (k >= 1) S.state = 'flat';
      const w = lerp(StepFlip.PW, HW * 2, k), h = lerp(StepFlip.PH, HH * 2, k), x = c.x, y = lerp(c2.y, c.y, k);
      ctx.fillStyle = GROUND; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.filter = blur(14); ctx.fillStyle = 'rgba(40,38,35,0.16)';
      ctx.fillRect(x - w / 2 + 3, y - h / 2 + 9, w + 10, h + 10); ctx.restore();
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.ellipse(c.x, c.y + HH + 26, HW, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (IMG.statement.complete) ctx.drawImage(IMG.statement, x - w / 2, y - h / 2, w, h);
      return;
    }
    const hov = S.mouse && overPaper(S.mouse);
    if (S.mouse) cvs.style.cursor = S.state === 'ball' ? 'default' : hov || S.held ? 'none' : 'default';
    S.handA = lerp(S.handA, (hov || S.held) && S.state !== 'ball' ? 1 : 0, S.state === 'ball' ? 0.04 : 0.1);
    if (S.held) {
      S.close = lerp(S.close, 1, 0.2);
      if (S.close > 0.8) {             // hands are on the paper: start crushing; slow at first, then it gives way
        const rate = 0.16 + S.c * 0.75, prev = S.c;
        S.c = Math.min(1, S.c + rate * dt);
        S.shake = 0.6 + S.c * 7;
        if (S.groan) S.groan.set(46 + (1 - S.c) * 20, 0.05 + S.c * 0.05, 180 + S.c * 300);
        if (Math.random() < 0.18 + S.c * 0.5) burst({ dur: 0.05 + Math.random() * 0.06, freq: 300 + Math.random() * 1200, q: 1 + Math.random() * 2, vol: 0.08 + S.c * 0.12 });
        if (S.c >= 1 && prev < 1) { thud(0.45, 55); burst({ dur: 0.25, freq: 600, q: 0.6, vol: 0.2 }); S.state = 'ball'; S.held = false; S.doneT = t; if (S.groan) S.groan.off(); }
      }
    } else {
      S.close = lerp(S.close, 0, 0.08);
      if (S.state === 'flat') S.c = lerp(S.c, S.L, 0.025);
      S.shake *= 0.85;
    }
    if (S.state === 'ball' && t - S.doneT > 1.0) S.done = true;     // ball settled, hands gone: it drops into the room

    ctx.fillStyle = GROUND; ctx.fillRect(0, 0, W, H);
    const c0 = center(), k = easeIO(S.c);
    const j = () => (Math.random() - 0.5) * S.shake;
    const cx = c0.x + j(), cy = c0.y + j() + (S.state === 'ball' ? Math.abs(Math.sin((t - S.doneT) * 8)) * 10 * Math.exp(-(t - S.doneT) * 4) : 0);
    const pts = RECT.map((p, i) => [cx + lerp(p[0], TARGET[i][0], k), cy + lerp(p[1], TARGET[i][1], k)]);

    ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.ellipse(c0.x, c0.y + lerp(HH, BALL_R, k) + 26, lerp(HW, BALL_R, k), 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.clip();
    ctx.translate(cx, cy); const sc = 1 - k * 0.7; ctx.scale(sc, sc);
    if (IMG.statement.complete) ctx.drawImage(IMG.statement, -HW, -HH, HW * 2, HH * 2);
    ctx.restore();
    if (k > 0.02) {
      ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.25);
      for (let i = 0; i < M; i++) {
        const a = pts[i], b = pts[(i + 1) % M];
        const tt = [[(a[0] - cx) / BALL_R, (a[1] - cy) / BALL_R], [(b[0] - cx) / BALL_R, (b[1] - cy) / BALL_R], [-0.1, -0.12]]; tt.j = Math.sin(i * 12.9) * 1.6;
        ctx.fillStyle = triShade(tt, 0);
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(cx - 6 * k, cy - 8 * k); ctx.closePath(); ctx.fill(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.6; ctx.stroke();
      }
      ctx.restore();
      if (k > 0.6) drawBall(BALL, cx, cy, BALL_R * lerp(1.4, 1, (k - 0.6) / 0.4), 0, (k - 0.6) / 0.4);
    }

    // hands: open and hovering a little outside the sheet; close in onto its edges; fingers curl as it is crushed
    if (S.handA > 0.02) {
      const edge = halfW(k), gap = lerp(20, 0, S.close), bob = Math.sin(t * 2.4) * 3 * (1 - S.close);
      const curl = Math.min(1, S.close * 0.2 + S.c * 1.0);
      glove(cx + edge + gap + j(), cy + bob + j(), 1, curl, S.handA);
      glove(cx - edge - gap + j(), cy - bob + j(), -1, curl, S.handA);
    }
    softRipple(S.ripples, t);
  }

  // low-poly white glove drawn from 5 frames (glove-1..5.svg): open -> fist. side = 1 for the right hand (fingers point left).
  function glove(x, y, side, curl, alpha) {
    const im = GLOVES[Math.max(0, Math.min(4, Math.round(curl * 4)))];
    if (!im.complete) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(-side * 0.82, 0.82);   // local +x points toward the paper
    ctx.drawImage(im, -96 - 22, -60, 176, 124);    // svg viewBox: -96 -60 176 124; knuckles sit ~28px outside the edge
    ctx.restore();
  }
  return { enter, exit, frame, down, move, up, leave, get done() { return S.done; }, BALL, BALL_R, center };
})();
