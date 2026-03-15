const CHECKOUT_STORAGE_KEY = "pendingCheckout";

export function savePendingCheckout(data) {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
}

export function getPendingCheckout() {
  const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw);
}

export function clearPendingCheckout() {
  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}