import { loadHeaderFooter } from "./utils.mjs";
import { updateCartIcon } from "./CartCount.mjs";
import Alert from "./Alert.js";

loadHeaderFooter(updateCartIcon);

const alertSystem = new Alert("main");
alertSystem.init();
