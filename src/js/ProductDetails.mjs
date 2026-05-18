import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  const priceElement = document.getElementById("productPrice");
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;

  if (finalPrice < originalPrice) {
    const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    priceElement.innerHTML = `
      <span class="original-price">$${originalPrice.toFixed(2)}</span>
      <span class="final-price">$${finalPrice.toFixed(2)}</span>
      <span class="discount-badge">-${discountPercent}% OFF</span>
    `;
  } else {
    priceElement.textContent = `$${finalPrice.toFixed(2)}`;
  }

  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}