import { loadHeaderFooter, getParam } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter(updateCartIcon);

const category = getParam("category");
const searchQuery = getParam("search");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, searchQuery, dataSource, element);

listing.init();