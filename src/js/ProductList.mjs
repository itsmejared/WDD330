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
    this.products = [];
  }
  async init() {
    const isSearch = window.location.search.includes("search=");

    if (isSearch) {
      const allCategories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
      const allProducts = await Promise.all(
        allCategories.map((cat) => this.dataSource.getData(cat))
      );
      this.products = allProducts.flat().filter((product) =>
        product.Name.toLowerCase().includes(this.category.toLowerCase()) ||
        product.Brand.Name.toLowerCase().includes(this.category.toLowerCase())
      );
      document.querySelector(".title").textContent = `Search Results: ${this.category}`;
    } else {
      this.products = await this.dataSource.getData(this.category);
      document.querySelector(".title").textContent =
        this.category.charAt(0).toUpperCase() + this.category.slice(1);
    }

    this.renderList(this.products);

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortList(e.target.value);
      });
    }
  }
  sortList(criteria) {
    if (criteria === "name") {
      this.products.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (criteria === "price") {
      this.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    this.renderList(this.products);
  }
  renderList(list) {
    this.listElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}