// ---- the sequence: one linear path, each step unlocks only when the previous one is complete ----
// 1 pick up -> 2 flip -> 3 crumple -> 4 throw. Each later step opens with a short automatic hand-off from the last.
// The reset button appears only on the $0.00 ending and restarts from step 1.
const STEPS = [StepPickUp, StepFlip, StepCrumple, StepThrow];
const resetBtn = document.getElementById('reset');
let current = 0;

function start(i) {
  current = i;
  cvs.style.cursor = 'default';
  STEPS[current].enter(now());
}
function restart() {
  STEPS[current].exit();
  resetBtn.hidden = true;
  start(0);
}
resetBtn.addEventListener('click', restart);

// pointer input goes only to the active step (mouse and pen only, as in the studies)
const step = () => STEPS[current];
cvs.addEventListener('pointermove', e => { if (isMouse(e)) step().move(e, pos(e)); });
cvs.addEventListener('pointerleave', e => { if (isMouse(e)) step().leave(e); });
cvs.addEventListener('pointerdown', e => { if (!isMouse(e)) return; audio(); step().down(e, pos(e)); });
const release = e => { if (isMouse(e)) step().up(e, pos(e)); };
cvs.addEventListener('pointerup', release);
cvs.addEventListener('pointercancel', release);
cvs.addEventListener('lostpointercapture', release);
window.addEventListener('pointerup', release);

function loop() {
  const t = now();
  step().frame(t);
  if (step().done) {
    if (current < STEPS.length - 1) { step().exit(); start(current + 1); }
    else if (resetBtn.hidden) resetBtn.hidden = false;      // the ending holds on $0.00
  }
  requestAnimationFrame(loop);
}
start(0);
requestAnimationFrame(loop);
