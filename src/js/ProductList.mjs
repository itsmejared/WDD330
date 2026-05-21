import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;
  let priceHTML = `<p class="product-card__price">$${finalPrice.toFixed(2)}</p>`;

  if (finalPrice < originalPrice) {
    const discountPercent = Math.round(
      ((originalPrice - finalPrice) / originalPrice) * 100,
    );
    priceHTML = `
      <p class="product-card__price">
        <span class="original-price">$${originalPrice.toFixed(2)}</span>
        <span class="final-price">$${finalPrice.toFixed(2)}</span>
        <span class="discount-badge">-${discountPercent}%</span>
      </p>
    `;
  }

  return `<li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        ${priceHTML}
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init() {
    const list = await this.dataSource.getData(this.category);
    console.log(list);
    this.renderList(list);
    document.querySelector(".title").textContent =
      this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
