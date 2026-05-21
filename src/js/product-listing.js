import { loadHeaderFooter, getParam } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter(updateCartIcon);

const category = getParam("category");
const searchQuery = getParam("search"); 
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const queryParam = searchQuery || category;
const listing = new ProductList(queryParam, dataSource, element);

listing.init();