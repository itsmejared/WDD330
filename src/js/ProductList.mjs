import { renderListWithTemplate, getDiscountPercentage } from "./utils.mjs";
import { renderBreadcrumbs } from "./Breadcrumbs.mjs";

function productCardTemplate(product) {
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;
  let priceHTML = `<p class="product-card__price">$${finalPrice.toFixed(2)}</p>`;

  if (finalPrice < originalPrice) {
    const discountPercent = getDiscountPercentage(originalPrice, finalPrice);
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
        <picture>
          <source media="(min-width: 1000px)" srcset="${product.Images.PrimaryLarge}" />
          <source media="(min-width: 600px)" srcset="${product.Images.PrimaryMedium}" />
          <img src="${product.Images.PrimarySmall}" alt="${product.Name}" />
        </picture>
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        ${priceHTML}
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, searchQuery, dataSource, listElement) {
    this.category = category;
    this.searchQuery = searchQuery;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    if (this.searchQuery) {
      const allCategories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
      const allProducts = await Promise.all(
        allCategories.map((cat) => this.dataSource.getData(cat)),
      );
      this.products = allProducts
        .flat()
        .filter(
          (product) =>
            product.NameWithoutBrand.toLowerCase().includes(
              this.searchQuery.toLowerCase(),
            ) ||
            product.Brand.Name.toLowerCase().includes(
              this.searchQuery.toLowerCase(),
            ),
        );
      document.querySelector(".title").textContent =
        `Search Results: ${this.searchQuery}`;
    } else {
      this.products = await this.dataSource.getData(this.category);
      document.querySelector(".title").textContent =
        this.category.charAt(0).toUpperCase() + this.category.slice(1);
    }

    const breadcrumbContainer = document.querySelector(".breadcrumb-container");

    renderBreadcrumbs(
      breadcrumbContainer,
      this.category ?? this.searchQuery,
      "",
      this.products.length,
    );

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortList(e.target.value);
      });
    }

    this.sortList("name-asc");
  }

  sortList(criteria) {
    switch (criteria) {
      case "name-asc":
        this.products.sort((a, b) =>
          a.NameWithoutBrand.localeCompare(b.NameWithoutBrand),
        );
        break;
      case "name-desc":
        this.products.sort((a, b) =>
          b.NameWithoutBrand.localeCompare(a.NameWithoutBrand),
        );
        break;
      case "price-asc":
        this.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case "price-desc":
        this.products.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
    }

    this.renderList(this.products);
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
