import { updateCartIcon } from "./CartCount.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter(updateCartIcon);

const dataSource = new ExternalServices("tents");
const productID = getParam("product");
const product = new ProductDetails(productID, dataSource);
product.init();
