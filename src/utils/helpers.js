export function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

export function formatShortNumber(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

export function generateReceipt() {
  return "RCP-" + Math.floor(10000000 + Math.random() * 90000000);
}

export function generateOPReceipt() {
  const ts = Date.now().toString().slice(-8);
  const r = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `OP-${ts}-${r}`;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
