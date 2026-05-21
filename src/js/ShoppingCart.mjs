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
    } else {
      this.productList.innerHTML = "<p>Your cart is empty.</p>";
      this.cartFooter.classList.add("hide");
    }
  }

  cartItemTemplate(item) {
    return `<li class="cart-card divider">
       <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimarySmall}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <span class="cart-remove-item" data-id="${item.Id}">X</span>
    </li>
    `;
  }

  renderCartTotal() {
    const total = this.cartItems.reduce((sum, item) => {
      return sum + item.FinalPrice;
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

  removeItemFromCart(productId) {
    this.cartItems = this.cartItems.filter((item) => item.Id !== productId);
    localStorage.setItem("so-cart", JSON.stringify(this.cartItems));
    updateCartIcon();
    this.renderCartContents();
  }
}
