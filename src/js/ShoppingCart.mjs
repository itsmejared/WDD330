import { getLocalStorage } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";

export default class Cart {
  constructor() {
    this.productList = document.querySelector(".product-list");
    this.cartFooter = document.querySelector(".cart-footer");
    this.cartTotal = document.querySelector(".cart-total");
    this.cartItems = [];
  }

  init() {
    this.cartItems = getLocalStorage("so-cart") || [];
    this.renderCartContents();
  }

  renderCartContents() {
    if (this.cartItems.length > 0) {
      const htmlItems = this.cartItems.map((item) =>
        this.cartItemTemplate(item),
      );
      this.productList.innerHTML = htmlItems.join("");
      this.renderCartTotal();
      this.addRemoveListeners();
      this.addQuantityListeners();
    } else {
      this.productList.innerHTML = "<p>Your cart is empty.</p>";
      this.cartFooter.classList.add("hide");
    }
  }

  cartItemTemplate(item) {
    return `<li class="cart-card divider">
       <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimaryMedium}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <div class="cart-card__quantity">
        <label for="qty-${item.Id}">qty:</label>
        <input 
          id="qty-${item.Id}" 
          type="number" 
          class="cart-quantity-input" 
          value="${item.Quantity || 1}" 
          min="1" 
          data-id="${item.Id}"
        />
      </div>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <span class="cart-remove-item" data-id="${item.Id}">X</span>
    </li>
    `;
  }

  renderCartTotal() {
    const total = this.cartItems.reduce((sum, item) => {
      return sum + item.FinalPrice * (item.Quantity || 1);
    }, 0);
    this.cartFooter.classList.remove("hide");
    this.cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
  }

  addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".cart-remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.dataset.id;
        this.removeItemFromCart(productId);
      });
    });
  }

  addQuantityListeners() {
    const quantityInputs = document.querySelectorAll(".cart-quantity-input");
    quantityInputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        const productId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
          this.updateQuantity(productId, newQuantity);
        }
      });
    });
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cartItems.find((item) => item.Id === productId);
    if (item) {
      item.Quantity = newQuantity;
      localStorage.setItem("so-cart", JSON.stringify(this.cartItems));
      updateCartIcon();
      this.renderCartTotal();
    }
  }

  removeItemFromCart(productId) {
    this.cartItems = this.cartItems.filter((item) => item.Id !== productId);
    localStorage.setItem("so-cart", JSON.stringify(this.cartItems));
    updateCartIcon();
    this.renderCartContents();
  }
}