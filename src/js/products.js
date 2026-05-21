import { updateCartIcon } from "./CartCount.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter(updateCartIcon);

const dataSource = new ProductData("tents");
const productID = getParam("product");
const product = new ProductDetails(productID, dataSource);
product.init();
