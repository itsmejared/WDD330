import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default defineConfig({
  root: "src/",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "json/*",
          dest: "json",
        },
        {
          src: "images/*",
          dest: "images",
        },
      ],
    }),
  ],
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        products: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
  },
});
