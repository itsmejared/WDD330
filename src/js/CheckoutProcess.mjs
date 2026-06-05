import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";

const CART_KEY = "so-cart";

export default class CheckoutProcess {
  constructor(services, outputSelector) {
    this.cartItems = getLocalStorage(CART_KEY) || [];
    this.services = services;
    this.outputSelector = outputSelector;
    this.itemSubTotal = 0;
    this.shipping = 0;
    this.tax = "0";
    this.orderTotal = "0";
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

    this.tax = (this.itemSubTotal * 0.06).toFixed(2);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = (
      this.itemSubTotal +
      Number(this.tax) +
      this.shipping
    ).toFixed(2);

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      `$${this.tax}`;

    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      `$${this.shipping.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #orderTotal`).textContent =
      `$${this.orderTotal}`;
  }

  packageItems() {
    return this.cartItems.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Quantity || 1,
    }));
  }

  async checkout(form) {
    const order = this.formDataToJSON(form);

    Object.assign(order, {
      orderDate: new Date().toISOString(),
      items: this.packageItems(),
      shipping: this.shipping,
      tax: this.tax,
      orderTotal: this.orderTotal,
    });

    try {
      const response = await this.services.checkout(order);
      console.log(response);
      setLocalStorage(CART_KEY, []);
      location.assign("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
      console.log(err);
    }
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }
}
