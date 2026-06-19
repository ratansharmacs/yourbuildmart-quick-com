export type CheckoutState = {
  addressId: number;
  remarks: string;
};

const KEY = "ybm_checkout";

export function saveCheckoutState(value: CheckoutState) {
  window.sessionStorage.setItem(KEY, JSON.stringify(value));
}

export function loadCheckoutState(): CheckoutState | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function clearCheckoutState() {
  window.sessionStorage.removeItem(KEY);
}
