import { getLocalStorage } from "./utils.mjs";

export default function updateCartIcon() {
  const cart = document.querySelector(".cart");
  if (!cart) return;
  const cartItems = getLocalStorage("so-cart") || [];
  const existingBadge = document.querySelector(".cart-count");

  if (existingBadge) {
    existingBadge.remove();
  }

  const badge = document.createElement("span");
  badge.classList.add("cart-count");
  badge.textContent = cartItems.length;
  cart.appendChild(badge);
}

updateCartIcon();
