import { loadHeaderFooter } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter(updateCartIcon);
const checkoutProcess = new CheckoutProcess(".order-summary");
checkoutProcess.init();

const zipInput = document.querySelector("#zip");
zipInput.addEventListener("blur", () => {
  checkoutProcess.calculateOrderTotal();
});
