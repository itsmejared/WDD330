import { loadHeaderFooter } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter(updateCartIcon);

const checkout = new CheckoutProcess("so-cart", ".summary-card");
checkout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout(e.target);
});