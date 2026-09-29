export function encodeState(fields, values) {
  const params = new URLSearchParams();
  for (const field of fields) {
    const value = values[field];
    if (value === undefined || value === null || value === '') continue;
    params.set(field, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  }
  return params.toString();
}

export function decodeState(search, fields) {
  const params = new URLSearchParams(search);
  const allowed = new Set(fields);
  const state = {};
  for (const [key, value] of params) {
    if (!allowed.has(key) || value.length > 120) continue;
    state[key] = value;
  }
  return state;
}

export function stateFromForm(form, fields) {
  return Object.fromEntries(fields.map(name => {
    const control = form.elements.namedItem(name);
    return [name, control?.type === 'checkbox' ? Boolean(control.checked) : control?.value];
  }));
}

export function restoreFormState(form, state) {
  let restored = 0;
  for (const [name, raw] of Object.entries(state)) {
    const control = form.elements.namedItem(name);
    if (!control) continue;
    if (control.type === 'checkbox') { control.checked = raw === '1' || raw === 'true'; restored++; continue; }
    if (control.type === 'number' && (raw.trim() === '' || !Number.isFinite(Number(raw)))) continue;
    if (control.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(raw)) continue;
    if (control.tagName === 'SELECT' && ![...control.options].some(option => option.value === raw)) continue;
    control.value = raw;
    restored++;
  }
  return restored;
}
