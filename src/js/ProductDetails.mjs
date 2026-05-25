import {
  getLocalStorage,
  setLocalStorage,
  getDiscountPercentage,
} from "./utils.mjs";
import { renderBreadcrumbs } from "./Breadcrumbs.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    const breadcrumbContainer = document.querySelector(".breadcrumb-container");
    renderBreadcrumbs(
      breadcrumbContainer,
      this.product.Category,
      this.product.NameWithoutBrand,
    );
    this.renderProductDetails();
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") ?? [];
    const existingItem = cartItems.find(({ Id }) => Id === this.product.Id);

    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity ?? 0) + 1;
    } else {
      cartItems.push({
        ...this.product,
        Quantity: 1,
      });
    }

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;

  const priceElement = document.getElementById("p-price");
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;

  if (finalPrice < originalPrice) {
    const discountPercent = getDiscountPercentage(originalPrice, finalPrice);

    priceElement.innerHTML = `<span class="original-price">$${originalPrice.toFixed(2)}</span>
    <span class="final-price">$${finalPrice.toFixed(2)}</span>
    <span class="discount-badge">-${discountPercent}% OFF</span>`;
  } else {
    priceElement.textContent = `$${finalPrice.toFixed(2)}`;
  }

  document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
  document.querySelector("#p-description").innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector("#add-to-cart").dataset.id = product.Id;
}
