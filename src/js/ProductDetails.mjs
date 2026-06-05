import {
  getLocalStorage,
  setLocalStorage,
  getDiscountPercentage,
} from "./utils.mjs";
import { updateCartIcon, animateCartIcon } from "./CartCount.mjs";
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
    updateCartIcon();
    animateCartIcon();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function initializeCarousel(images) {
  if (images.length <= 1) return;

  let currentIndex = 0;

  const mainImage = document.querySelector("#p-image");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const thumbnails = document.querySelectorAll(".carousel-thumbnail");

  function updateCarousel(index) {
    currentIndex = index;

    mainImage.src = images[currentIndex];

    thumbnails.forEach((thumb) => {
      thumb.classList.remove("active");
    });

    thumbnails[currentIndex].classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    updateCarousel(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    updateCarousel(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  });

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      updateCarousel(Number(thumb.dataset.index));
    });
  });
}

function renderCarousel(product) {
  const productImageContainer = document.querySelector(
    ".product-detail__image",
  );

  const images = [
    product.Images.PrimaryExtraLarge,
    ...(product.Images.ExtraImages?.map((img) => img.Src) ?? []),
  ];

  productImageContainer.innerHTML = `
    <div class="carousel-layout">
      <div class="carousel-thumbnails">
        ${images
          .map(
            (img, index) => `
              <img
                src="${img}"
                class="carousel-thumbnail ${index === 0 ? "active" : ""}"
                data-index="${index}"
                alt="Product image ${index + 1}"
              />
            `,
          )
          .join("")}
      </div>

      <div class="carousel-main">
        <img
          id="p-image"
          class="carousel-image"
          src="${images[0]}"
          alt="${product.NameWithoutBrand}"
        />
      </div>
    </div>
  `;

  const mainImage = document.querySelector("#p-image");
  const thumbnails = document.querySelectorAll(".carousel-thumbnail");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;

      thumbnails.forEach((img) => {
        img.classList.remove("active");
      });

      thumb.classList.add("active");
    });
  });
}

function renderColors(product) {
  const colorContainer = document.querySelector("#p-color");

  if (!product.Colors?.length) return;

  colorContainer.innerHTML = `
  <p class="selected-color">
    Color: ${product.Colors[0].ColorName}
  </p>

  <div class="color-selector">
    ${product.Colors.map(
      (color, index) => `
          <img
            src="${color.ColorChipImageSrc}"
            class="color-chip ${index === 0 ? "active" : ""}"
            data-color-name="${color.ColorName}"
            alt="${color.ColorName}"
            title="${color.ColorName}"
          />
        `,
    ).join("")}
  </div>
`;

  const chips = document.querySelectorAll(".color-chip");
  const selectedColor = document.querySelector(".selected-color");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));

      chip.classList.add("active");

      selectedColor.textContent = `Color: ${chip.dataset.colorName}`;
    });
  });
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);

  document.querySelector("#p-brand").textContent = product.Brand.Name;

  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  renderCarousel(product);

  const priceElement = document.getElementById("p-price");

  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;

  if (finalPrice < originalPrice) {
    const discountPercent = getDiscountPercentage(originalPrice, finalPrice);

    priceElement.innerHTML = `
      <span class="original-price">
        $${originalPrice.toFixed(2)}
      </span>

      <span class="final-price">
        $${finalPrice.toFixed(2)}
      </span>

      <span class="discount-badge">
        -${discountPercent}% OFF
      </span>
    `;
  } else {
    priceElement.textContent = `$${finalPrice.toFixed(2)}`;
  }

  renderColors(product);

  document.querySelector("#p-description").innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector("#add-to-cart").dataset.id = product.Id;
}
