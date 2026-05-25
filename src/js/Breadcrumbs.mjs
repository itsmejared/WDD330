export function renderBreadcrumbs(
  container,
  category,
  productName = "",
  productCount = null,
) {
  let breadcrumbs = `
    <nav class="breadcrumbs">
      <a href="/">Home</a>
      <span>></span>
      <span>${category}</span>
  `;

  if (productCount !== null) {
    breadcrumbs += `
      <span>></span>
      <span>(${productCount} items)</span>
    `;
  }

  if (productName) {
    breadcrumbs += `
      <span>></span>
      <span>${productName}</span>
    `;
  }

  breadcrumbs += "</nav>";
  container.innerHTML = breadcrumbs;
}
