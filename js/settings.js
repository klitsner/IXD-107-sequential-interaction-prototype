// ---- saved defaults for the control panel ----
// These are the values the prototype starts with. "Restore defaults" in the panel returns to them.
// To save new defaults, paste the panel's copied settings here.
const DEFAULTS = {
  wind: {                 // step 1 · pick up: the gust of wind
    sprites: 20,          // wind sprites per gust (count)
    lengthMin: 60,        // shortest sprite (px)
    lengthMax: 160,       // longest sprite (px)
    width: 1.5,           // stroke width (px)
    color: '#ffffff',     // sprite colour
    speed: 420,           // base travel speed (px/s)
    speedVar: 220,        // extra random speed added per sprite (px/s)
    easing: 'linear',     // how each sprite travels: linear | easeIn | easeOut | easeInOut | spring
  },
};
// live values, edited by the panel
const SETTINGS = JSON.parse(JSON.stringify(DEFAULTS));

// easing curves for sprite travel: progress 0..1 -> distance 0..1
const EASINGS = {
  linear: k => k,
  easeIn: k => k * k * k,
  easeOut: k => 1 - Math.pow(1 - k, 3),
  easeInOut: k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  spring: k => 1 - Math.exp(-6 * k) * Math.cos(12 * k),     // overshoots, then settles
};
