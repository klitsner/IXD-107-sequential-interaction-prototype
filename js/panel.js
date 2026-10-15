// ---- floating, collapsible control panel (left side) ----
// Edits SETTINGS live; the prototype reads them every frame, so changes show on the next wind sprites.
(() => {
  const CONTROLS = [
    { key: 'sprites', label: 'Sprites per gust', unit: '', min: 0, max: 60, step: 1 },
    { key: 'lengthMin', label: 'Length · min', unit: 'px', min: 20, max: 400, step: 5 },
    { key: 'lengthMax', label: 'Length · max', unit: 'px', min: 20, max: 400, step: 5 },
    { key: 'width', label: 'Width', unit: 'px', min: 0.5, max: 6, step: 0.1 },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'speed', label: 'Speed', unit: 'px/s', min: 100, max: 1200, step: 10 },
    { key: 'speedVar', label: 'Speed variation', unit: 'px/s', prefix: '+', min: 0, max: 600, step: 10 },
    { key: 'easing', label: 'Motion', type: 'select', options: [
      ['linear', 'Linear'], ['easeIn', 'Ease In'], ['easeOut', 'Ease Out'], ['easeInOut', 'Ease In-Out'], ['spring', 'Spring/Bounce']] },
  ];
  const W_ = SETTINGS.wind;
  const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, attrs); kids.forEach(k => e.append(k)); return e; };

  const panel = el('aside', { className: 'panel', id: 'panel' });
  panel.setAttribute('aria-label', 'Control panel');
  const toggle = el('button', { className: 'panel-toggle', type: 'button', textContent: 'Controls' });
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'panel-body');
  const body = el('div', { className: 'panel-body', id: 'panel-body', hidden: true });
  body.append(el('h2', { textContent: 'Step 1 · Wind gust' }));

  const inputs = {};
  const fmt = (c, v) => (c.prefix || '') + (c.step < 1 ? Number(v).toFixed(1) : v) + (c.unit ? ' ' + c.unit : '');
  for (const c of CONTROLS) {
    const id = 'ctl-' + c.key, row = el('div', { className: 'row' });
    const label = el('label', { htmlFor: id, textContent: c.label });
    let input, out = null;
    if (c.type === 'color') {
      input = el('input', { type: 'color', id });
      row.append(label, input);
    } else if (c.type === 'select') {
      input = el('select', { id }, ...c.options.map(([v, t]) => el('option', { value: v, textContent: t })));
      row.append(label, input);
    } else {
      input = el('input', { type: 'range', id, min: c.min, max: c.max, step: c.step });
      out = el('output', { htmlFor: id });
      const range = el('span', { className: 'range', textContent: `${c.min}–${c.max}${c.unit ? ' ' + c.unit : ''}` });
      row.append(el('div', { className: 'row-head' }, label, out), input, range);
    }
    input.addEventListener('input', () => {
      W_[c.key] = c.type ? input.value : Number(input.value);
      // keep the length range valid: moving one end past the other pushes it along
      if (c.key === 'lengthMin' && W_.lengthMin > W_.lengthMax) W_.lengthMax = W_.lengthMin;
      if (c.key === 'lengthMax' && W_.lengthMax < W_.lengthMin) W_.lengthMin = W_.lengthMax;
      sync();
    });
    inputs[c.key] = { c, input, out };
    body.append(row);
  }
  function sync() {
    for (const { c, input, out } of Object.values(inputs)) {
      input.value = W_[c.key];
      if (out) out.textContent = fmt(c, W_[c.key]);
    }
  }

  // ---- actions ----
  const status = el('p', { className: 'status', role: 'status' });
  const restore = el('button', { type: 'button', textContent: 'Restore defaults' });
  const copy = el('button', { type: 'button', textContent: 'Copy settings' });
  restore.addEventListener('click', () => { Object.assign(W_, DEFAULTS.wind); sync(); flash('Defaults restored'); });
  copy.addEventListener('click', async () => {
    const text = settingsText();
    try { await navigator.clipboard.writeText(text); flash('Copied'); }
    catch (e) {
      // the clipboard API can be blocked (e.g. inside an embedded preview): fall back to a selected textarea
      const ta = el('textarea', { value: text }); document.body.append(ta); ta.select();
      const ok = document.execCommand && document.execCommand('copy'); ta.remove();
      flash(ok ? 'Copied' : 'Copy blocked by the browser');
    }
  });
  body.append(el('div', { className: 'actions' }, restore, copy), status);
  let flashT = 0;
  function flash(msg) { status.textContent = msg; clearTimeout(flashT); flashT = setTimeout(() => status.textContent = '', 2000); }

  function settingsText() {
    const lines = ['Control panel settings: Step 1 · Pick up · Wind gust (js/settings.js → DEFAULTS.wind)'];
    for (const { c } of Object.values(inputs)) {
      const v = W_[c.key];
      const shown = c.type === 'select' ? `${c.options.find(o => o[0] === v)[1]} ('${v}')` : c.type === 'color' ? v : fmt(c, v);
      lines.push(`- ${c.label} (wind.${c.key}): ${shown}`);
    }
    lines.push('', 'Apply these values as the prototype’s saved defaults. Retain the panel code for later adjustments. Commit and push the changes.');
    return lines.join('\n');
  }

  toggle.addEventListener('click', () => {
    const open = body.hidden;
    body.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); panel.classList.toggle('open', open);
  });
  panel.append(toggle, body);
  document.querySelector('.stage').append(panel);
  sync();
})();
