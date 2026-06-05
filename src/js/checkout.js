import { loadHeaderFooter } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter(updateCartIcon);
const services = new ExternalServices();
const checkoutProcess = new CheckoutProcess(services, ".order-summary");
checkoutProcess.init();

const zipInput = document.querySelector("#zip");
zipInput.addEventListener("blur", () => {
  checkoutProcess.calculateOrderTotal();
});

const form = document.querySelector("#checkout-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  await checkoutProcess.checkout(form);
});
