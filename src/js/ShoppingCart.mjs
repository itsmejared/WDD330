import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";

const CART_KEY = "so-cart";

export default class Cart {
  constructor() {
    this.productList = document.querySelector(".product-list");
    this.cartFooter = document.querySelector(".cart-footer");
    this.cartTotal = document.querySelector(".cart-total");
    this.cartItems = [];
  }

  init() {
    this.cartItems = getLocalStorage(CART_KEY) ?? [];
    this.addCartEvents();
    this.renderCartContents();
  }

  renderCartContents() {
    if (!this.cartItems.length) {
      this.productList.innerHTML = "<p>Your cart is empty.</p>";
      this.cartFooter.classList.add("hide");
      return;
    }

    const htmlItems = this.cartItems.map((item) => this.cartItemTemplate(item));
    this.productList.innerHTML = htmlItems.join("");
    this.cartFooter.classList.remove("hide");
    this.renderCartTotal();
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
        <button type="button" class="quantity-btn decrease-btn" data-id="${item.Id}">-</button>
        <input 
          id="qty-${item.Id}" 
          type="number" 
          class="cart-quantity-input" 
          value="${item.Quantity ?? 1}" 
          min="1" 
          data-id="${item.Id}"
        />
        <button type="button" class="quantity-btn increase-btn" data-id="${item.Id}">+</button>
      </div>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <span class="cart-remove-item" data-id="${item.Id}">X</span>
    </li>
    `;
  }

  renderCartTotal() {
    const total = this.cartItems.reduce((sum, item) => {
      return sum + item.FinalPrice * (item.Quantity ?? 1);
    }, 0);
    this.cartFooter.classList.remove("hide");
    this.cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  addCartEvents() {
    this.productList.addEventListener("click", (event) => {
      const productId = event.target.dataset.id;
      if (!productId) return;

      if (event.target.classList.contains("cart-remove-item")) {
        this.removeItemFromCart(productId);
        return;
      }

      const item = this.findCartItem(productId);
      if (!item) return;

      if (event.target.classList.contains("increase-btn")) {
        this.updateQuantity(productId, item.Quantity + 1);
      }

      if (event.target.classList.contains("decrease-btn") &&  item.Quantity > 1) {
        this.updateQuantity(productId, item.Quantity - 1);
      }
    });

    this.productList.addEventListener("input", (event) => {
      if (!event.target.classList.contains("cart-quantity-input")) {
        return;
      }

      const productId = event.target.dataset.id;
      const newQuantity = parseInt(event.target.value, 10);
      if (!Number.isNaN(newQuantity) && newQuantity > 0) {
        this.updateQuantity(productId, newQuantity);
      }
    });
  }

  findCartItem(productId) {
    return this.cartItems.find((item) => item.Id === productId);
  }

  saveCart() {
    setLocalStorage(CART_KEY, this.cartItems);
    updateCartIcon();
  }

  updateQuantity(productId, newQuantity) {
    const item = this.findCartItem(productId);
    if (item) {
      item.Quantity = newQuantity;
      this.saveCart();
      this.renderCartTotal();
      const input = document.querySelector(`#qty-${productId}`);
      if (input) {
        input.value = newQuantity;
      }
    }
  }

  removeItemFromCart(productId) {
    this.cartItems = this.cartItems.filter((item) => item.Id !== productId);
    this.saveCart();
    this.renderCartContents();
  }
}
