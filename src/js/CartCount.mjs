import { getLocalStorage } from "./utils.mjs";

export function updateCartIcon() {
  const cart = document.querySelector(".cart");
  if (!cart) return;

  const existingBadge = document.querySelector(".cart-count");
  if (existingBadge) {
    existingBadge.remove();
  }

  const cartItems = getLocalStorage("so-cart") || [];
  const badge = document.createElement("span");
  badge.classList.add("cart-count");

  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.Quantity || 1),
    0,
  );
  badge.textContent = totalCount;

  cart.appendChild(badge);
}

export function animateCartIcon() {
  const cartIcon = document.querySelector(".cart svg");
  if (!cartIcon) return;
  cartIcon.classList.remove("cart-bounce");
  setTimeout(() => {
    cartIcon.classList.add("cart-bounce");
    cartIcon.addEventListener(
      "animationend",
      () => {
        cartIcon.classList.remove("cart-bounce");
      },
      { once: true },
    );
  }, 20);
}
