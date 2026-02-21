export function nowIso() {
  return new Date().toISOString();
}

export function uid() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
