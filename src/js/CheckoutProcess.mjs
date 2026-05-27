import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const totalElement = document.querySelector("#cartTotal") || document.querySelector("#subtotal");
    const numItemsElement = document.querySelector("#num-items") || document.querySelector("#items-count");
    
    const numItems = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
    
    if (totalElement) totalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (numItemsElement) numItemsElement.innerText = numItems;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const numItems = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (numItems > 0) {
      this.shipping = 10 + (numItems - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector("#tax");
    const shippingElement = document.querySelector("#shipping");
    const totalElement = document.querySelector("#orderTotal") || document.querySelector("#total");

    if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const services = new ExternalServices();
      const res = await services.checkout(json);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }
}