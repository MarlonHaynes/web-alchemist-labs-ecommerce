const CHECKOUT_STORAGE_KEY = "pendingCheckout";
const LAST_COMPLETED_ORDER_KEY = "lastCompletedOrderId";

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

export function saveLastCompletedOrderId(orderId) {
  localStorage.setItem(LAST_COMPLETED_ORDER_KEY, orderId);
}

export function getLastCompletedOrderId() {
  return localStorage.getItem(LAST_COMPLETED_ORDER_KEY);
}