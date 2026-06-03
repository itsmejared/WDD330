import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

export default class CheckoutProcess {
  constructor(outputSelector) {
    this.cartItems = getLocalStorage(CART_KEY) || [];
    this.outputSelector = outputSelector;
    this.itemSubTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemSubTotal = this.cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
      0,
    );

    document.querySelector(`${this.outputSelector} #subtotal`).textContent =
      `$${this.itemSubTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    const itemCount = this.cartItems.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0,
    );

    this.tax = this.itemSubTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemSubTotal + this.tax + this.shipping;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      `$${this.tax.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      `$${this.shipping.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #orderTotal`).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }
}
